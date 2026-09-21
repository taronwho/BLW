import { create } from 'zustand';
import { ADRESA_OPRAV, KLIC_OPRAV, PRAZDNE_OPRAVY, rozeberOpravy } from '@/data/opravyTvar';
import type { Opravy, PouziteOpravy } from '@/data/opravyTvar';
import type { Ingredient, Recipe } from '@/types';

/**
 * Načtení oprav katalogu (`src/data/opravy.ts`).
 *
 * Pořadí je schválně tohle:
 *
 * 1. z `localStorage` hned, aby po zapnutí letadlového režimu nebyla
 *    aplikace najednou o opravy chudší než včera,
 * 2. ze sítě na pozadí, bez blokování čehokoli.
 *
 * Když stažení selže, nic se neděje a nikomu se nic nehlásí — rodič
 * o téhle vrstvě nemá co vědět. Katalog z balíku funguje sám o sobě.
 *
 * `localStorage`, ne IndexedDB: je to pár kilobajtů, ztráta nic neznamená
 * (stáhne se to znovu) a nemusí se kvůli tomu migrovat databáze, ve které
 * leží deník.
 */
interface OpravyStore {
  pouzite: PouziteOpravy;
  nacteno: boolean;
  nacti: () => Promise<void>;
}

/**
 * Použití oprav sahá na celý katalog, takže se modul načítá až ve chvíli,
 * kdy nějaká oprava opravdu přišla. Prázdný seznam — což je běžný stav —
 * nestáhne nic navíc a úvodní obrazovka zůstává lehká.
 */
async function pouzij(vstup: Opravy): Promise<PouziteOpravy> {
  if (vstup.opravy.length === 0) {
    return { ...PRAZDNE_OPRAVY, verze: vstup.verze, vydano: vstup.vydano };
  }
  const { pouzijOpravy } = await import('@/data/opravy');
  return pouzijOpravy(vstup);
}

function zUlozeneho(): Opravy | null {
  try {
    const raw = localStorage.getItem(KLIC_OPRAV);
    if (raw === null) return null;
    return rozeberOpravy(JSON.parse(raw));
  } catch {
    // Poškozený nebo nedostupný localStorage (soukromé okno) není chyba,
    // jen se jede bez oprav.
    return null;
  }
}

export const useOpravyStore = create<OpravyStore>((set, get) => ({
  pouzite: PRAZDNE_OPRAVY,
  nacteno: false,

  async nacti(): Promise<void> {
    if (get().nacteno) return;
    set({ nacteno: true });
    const ulozene = zUlozeneho();
    if (ulozene !== null) set({ pouzite: await pouzij(ulozene) });

    try {
      // `no-cache`: service worker i prohlížeč mají soubor přeskočit,
      // jinak by se oprava zdravotního údaje objevila až za týden.
      const odpoved = await fetch(ADRESA_OPRAV, { cache: 'no-cache' });
      if (!odpoved.ok) return;
      const raw: unknown = await odpoved.json();
      const rozebrane = rozeberOpravy(raw);
      if (rozebrane === null) return;
      // Starší nebo stejná verze se nepřebírá: server mohl vrátit
      // zastaralou kopii z mezipaměti.
      if (rozebrane.verze <= get().pouzite.verze) return;
      const pouzite = await pouzij(rozebrane);
      if (pouzite.zahozeno.length > 0) {
        console.warn('Opravy katalogu, které neprošly bezpečnostními pravidly:', pouzite.zahozeno);
      }
      localStorage.setItem(KLIC_OPRAV, JSON.stringify(rozebrane));
      set({ pouzite });
    } catch {
      // Bez sítě, blokovaný požadavek, nevalidní JSON — jede se dál.
    }
  },
}));

/**
 * Opravená podoba suroviny, nebo `null`, když se nic neopravuje.
 *
 * Klíčem je idčko, ne položka: obrazovka si surovinu z katalogu bere až
 * po tomhle volání a hooky se nesmí volat podmíněně.
 */
export function useOpravaSuroviny(id: string): Ingredient | null {
  return useOpravyStore((store) => store.pouzite.suroviny.get(id) ?? null);
}

/** Opravená podoba receptu, nebo `null`. */
export function useOpravaReceptu(id: string): Recipe | null {
  return useOpravyStore((store) => store.pouzite.recepty.get(id) ?? null);
}

/** Proč se položka opravila, nebo `null`. Ukazuje se v detailu. */
export function useDuvodOpravy(id: string): string | null {
  return useOpravyStore((store) => store.pouzite.duvody.get(id) ?? null);
}
