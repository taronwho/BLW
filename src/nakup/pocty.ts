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

/**
 * Kolikrát už tohle v seznamu je.
 *
 * Rodič klepne na „do nákupu" u receptu, za týden znovu — a bez čísla
 * nepozná, jestli má v seznamu jedno balení nebo tři. Množství se sice
 * sčítají, ale ze součtu „450 g" se zpátky nedopočítá, kolikrát se recept
 * přidal.
 *
 * Bere `davky` v témže tvaru, v jakém by se přidávaly, takže odpověď sedí
 * na to, co udělá klepnutí: u receptu se ptá na jeho `recipeId`, u samotné
 * suroviny na dávky bez receptu (tedy na ruční přidání).
 *
 * Vrací **největší** počet napříč složkami, ne nejmenší. Když rodič jednu
 * surovinu ze seznamu vyhodil, protože ji má doma, pořád platí, že recept
 * přidal dvakrát — a to je odpověď, kterou u tlačítka hledá.
 */
export function pocetPridani(
  state: HouseholdState,
  davky: readonly { ingredientId: string; recipeId?: string }[],
): number {
  const nakup = state.nakup ?? {};
  let nejvic = 0;
  for (const { ingredientId, recipeId } of davky) {
    const polozka = nakup[ingredientId]?.hodnota;
    if (polozka === undefined || polozka === null) continue;
    const kolik = polozka.davky.filter((davka) => davka.recipeId === recipeId).length;
    if (kolik > nejvic) nejvic = kolik;
  }
  return nejvic;
}
