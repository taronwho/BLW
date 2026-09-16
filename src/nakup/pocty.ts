import type { HouseholdState, NakupPolozka } from '@/types';

/**
 * Počty položek nákupního seznamu.
 *
 * Schválně v samostatném souboru bez jediného importu katalogu: kartu na
 * úvodní obrazovce zajímá jen číslo, a kdyby si ho brala ze `seznam.ts`,
 * stáhl by si rodič při prvním otevření aplikace celou kuchařku i katalog
 * surovin — přesně to, čemu se rozdělení balíků vyhýbá.
 */

/** Položky seznamu bez náhrobků po odebraných surovinách. */
export function nakupniPolozky(state: HouseholdState): { id: string; polozka: NakupPolozka }[] {
  const out: { id: string; polozka: NakupPolozka }[] = [];
  for (const [id, zaznam] of Object.entries(state.nakup ?? {})) {
    if (zaznam.hodnota !== null) out.push({ id, polozka: zaznam.hodnota });
  }
  return out;
}

/** Kolik toho v seznamu je a kolik už je v košíku. */
export function nakupPocty(state: HouseholdState): { celkem: number; koupeno: number } {
  const polozky = nakupniPolozky(state);
  return {
    celkem: polozky.length,
    koupeno: polozky.filter(({ polozka }) => polozka.koupeno).length,
  };
}
