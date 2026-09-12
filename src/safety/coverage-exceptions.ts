/**
 * Suroviny, které nemusí figurovat v žádném receptu.
 *
 * Výjimka je přípustná **jen** pro surovinu, ze které se samostatně nevaří —
 * tedy pro nápoj nebo pro pomocnou látku, která v receptu nevystupuje jako
 * složka pokrmu. Výjimka se nikdy nepřidává proto, aby vyšlo pokrytí; když
 * se ze suroviny vařit dá, patří do receptu, ne sem.
 *
 * Klíč je `Ingredient.id`, hodnota je důvod. Pravidlo `ingredient-coverage`
 * v ./rules.ts tenhle seznam čte.
 */
export const COVERAGE_EXCEPTIONS: Readonly<Record<string, string>> = {
  'detsky-caj-bez-cukru': 'Nápoj podávaný samostatně k jídlu, ne složka pokrmu.',
  voda: 'Pitná voda a voda na vaření; není složkou, kterou by recept odměřoval jako surovinu.',
};

/** Ověří, jestli je surovina z povinnosti mít recept vyjmutá. */
export function isCoverageException(ingredientId: string): boolean {
  return Object.hasOwn(COVERAGE_EXCEPTIONS, ingredientId);
}

/** Důvod výjimky, nebo undefined u suroviny, která výjimku nemá. */
export function coverageExceptionReason(ingredientId: string): string | undefined {
  return COVERAGE_EXCEPTIONS[ingredientId];
}
