/**
 * Kolik toho katalog obsahuje — bez stažení katalogu samotného.
 *
 * Úvodní obrazovka ukazuje tři čísla. Kdyby si je brala z polí `ingredients`,
 * `recipes` a `guides`, stáhl by si rodič při prvním otevření aplikace celý
 * katalog i kuchařku (přes megabajt dat) jen kvůli nim, i když si šel jen
 * přečíst, co dělat při dušení.
 *
 * Čísla se proto opisují sem ručně. Aby se nikdy nerozešla se skutečností,
 * hlídá je test `tests/data/counts.test.ts` — ten katalog načte a porovná.
 * Když přibude surovina, spadne validace a číslo se opraví tady.
 */
export const CATALOG_COUNTS = {
  ingredients: 301,
  recipes: 468,
  guides: 16,
} as const;
