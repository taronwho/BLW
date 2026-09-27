import type { TastingEvent } from '@/types';

/**
 * Dávení v deníku.
 *
 * Dávení je u kojence obrana, ne selhání (rada „Dávení není dušení"), a dítě
 * postupně zvládne větší a pevnější sousta, aniž by dávilo (rada „Úchop
 * rozhoduje o tvaru, věk o výběru"). Rodiče na tom nejvíc trápí, že nevědí,
 * jestli se to lepší. Tenhle modul jim to jen spočítá z jejich vlastních
 * zápisů — nic nevyhodnocuje a nic nediagnostikuje.
 *
 * Počítá se **podíl** ochutnávek s dávením, ne jejich počet: týden, kdy
 * dítě zkusí dvakrát víc jídel, by jinak vypadal jako zhoršení.
 */

/** Kolik týdnů zpátky deník ukazuje. */
export const TYDNU_ZPET = 4;

/** Okno pro „opakuje se u téže suroviny", ve dnech včetně dneška. */
export const OKNO_OPAKOVANI_DNU = 28;

/** Od kolika dávení u jedné suroviny v okně stojí za to zkontrolovat tvar. */
export const PRAH_OPAKOVANI = 2;

export interface TydenDaveni {
  /** První den týdne, ISO. */
  od: string;
  /** Poslední den týdne včetně, ISO. */
  do: string;
  ochutnavek: number;
  daveni: number;
}

export interface OpakovaneDaveni {
  ingredientId: string;
  pocet: number;
  /** ISO datum posledního dávení u téhle suroviny. */
  posledni: string;
}

export interface SouhrnDaveni {
  /** Všechna zapsaná dávení tohohle dítěte. */
  celkem: number;
  /** Posledních `TYDNU_ZPET` týdnů, od nejstaršího; poslední končí dneškem. */
  tydny: TydenDaveni[];
  /** Suroviny s dávením aspoň `PRAH_OPAKOVANI`× za posledních 28 dní. */
  opakovane: OpakovaneDaveni[];
}

const DEN_MS = 86_400_000;

/** ISO datum → počet dní od epochy. V UTC, ať do toho nemluví letní čas. */
function denCislo(iso: string): number {
  const [rok, mesic, den] = iso.split('-').map(Number);
  return Math.round(Date.UTC(rok ?? 1970, (mesic ?? 1) - 1, den ?? 1) / DEN_MS);
}

function isoZCisla(cislo: number): string {
  return new Date(cislo * DEN_MS).toISOString().slice(0, 10);
}

/**
 * Souhrn dávení z ochutnávek jednoho dítěte.
 *
 * `udalosti` mají být už vyfiltrované na dítě a bez smazaných
 * (`activeTastings`). Záznamy s datem v budoucnu se do týdnů ani do
 * opakování nepočítají — rodič si je mohl předepsat omylem.
 */
export function souhrnDaveni(udalosti: readonly TastingEvent[], dnes: string): SouhrnDaveni {
  const dnesCislo = denCislo(dnes);
  const prvniDen = dnesCislo - TYDNU_ZPET * 7 + 1;

  const tydny: TydenDaveni[] = Array.from({ length: TYDNU_ZPET }, (_, i) => {
    const od = prvniDen + i * 7;
    return { od: isoZCisla(od), do: isoZCisla(od + 6), ochutnavek: 0, daveni: 0 };
  });

  const opakovani = new Map<string, OpakovaneDaveni>();
  let celkem = 0;

  for (const udalost of udalosti) {
    if (udalost.deleted === true) continue;
    const davilo = udalost.davilo === true;
    if (davilo) celkem += 1;

    const den = denCislo(udalost.date);
    if (den > dnesCislo) continue;

    const tyden = tydny[Math.floor((den - prvniDen) / 7)];
    if (den >= prvniDen && tyden !== undefined) {
      tyden.ochutnavek += 1;
      if (davilo) tyden.daveni += 1;
    }

    if (davilo && den > dnesCislo - OKNO_OPAKOVANI_DNU) {
      const dosud = opakovani.get(udalost.ingredientId);
      opakovani.set(udalost.ingredientId, {
        ingredientId: udalost.ingredientId,
        pocet: (dosud?.pocet ?? 0) + 1,
        posledni:
          dosud === undefined || udalost.date > dosud.posledni ? udalost.date : dosud.posledni,
      });
    }
  }

  const opakovane = [...opakovani.values()]
    .filter((polozka) => polozka.pocet >= PRAH_OPAKOVANI)
    .sort((a, b) => b.pocet - a.pocet || b.posledni.localeCompare(a.posledni));

  return { celkem, tydny, opakovane };
}

/** Podíl dávení v týdnu v celých procentech; `null`, když se nejedlo. */
export function podilDaveni(tyden: TydenDaveni): number | null {
  if (tyden.ochutnavek === 0) return null;
  return Math.round((tyden.daveni / tyden.ochutnavek) * 100);
}
