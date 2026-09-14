import { useMemo } from 'react';
import { useHouseholdStore } from '@/storage/householdStore';
import { activeChildren } from '@/sync/merge';
import type { Child } from '@/types';

/**
 * Dítě, kterému se aplikace právě přizpůsobuje.
 *
 * Věk, úchop, znaky připravenosti i alergie čte celá aplikace odsud, takže
 * přepnutí dítěte v hlavičce promění všechno naráz — fázi u surovin, filtr
 * „Vhodné teď", tvar sousta i deník.
 *
 * Výběr si drží zařízení, ne domácnost: kdyby se sdílel, přepnutí u jednoho
 * rodiče by přehodilo obrazovku druhému uprostřed vaření.
 */
export function useDeti(): Child[] {
  const children = useHouseholdStore((store) => store.state.children);
  return useMemo(() => activeChildren({ children } as never), [children]);
}

export function useAktivniDite(): Child | null {
  const deti = useDeti();
  const aktivniId = useHouseholdStore((store) => store.activeChildId);
  return (
    deti.find((dite) => dite.id === aktivniId) ??
    // Když vybrané dítě neexistuje (smazalo se na druhém telefonu), ukáže se
    // první. Bez toho by aplikace tvrdila, že žádné dítě není.
    deti[0] ??
    null
  );
}

/**
 * Id dítěte, kterému patří deník na obrazovce.
 *
 * Deník, statistiky i expozice alergenů se filtrují podle něj. Vrací
 * `null`, dokud není žádné dítě — pak není čí ochutnávky ukazovat.
 */
export function useAktivniDiteId(): string | null {
  return useAktivniDite()?.id ?? null;
}

/** Datum narození aktivního dítěte, nebo prázdno. Zkratka pro výpočet věku. */
export function useNarozeniAktivniho(): string {
  return useAktivniDite()?.birthDate ?? '';
}
