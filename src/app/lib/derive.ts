import { ingredients } from '@/data/ingredients';
import type { HouseholdState, Ingredient } from '@/types';
import { tastedIds } from './tastings';

// Odvozeniny nad deníkem si nesahají na katalog, proto bydlí zvlášť; tady se
// jen přeposílají dál, ať obrazovky nemusí vědět, kde co leží.
export { activeTastings, isAdverse, tastedIds, tastingsByIngredient } from './tastings';

/**
 * Odvozeniny nad katalogem surovin a stavem domácnosti. Bez nich by každá
 * obrazovka počítala totéž jinak.
 *
 * Co potřebuje kuchařku, bydlí v `deriveRecipes.ts`.
 */

export function inSeason(ingredient: Ingredient, month: number): boolean {
  return ingredient.seasonCz.length === 0 || ingredient.seasonCz.includes(month);
}

/** „Vhodné teď" = fáze podle věku dítěte už tuhle surovinu dovoluje. */
export function suitableNow(ingredient: Ingredient, ageMonths: number | null): boolean {
  return ingredient.minAgeMonths <= (ageMonths ?? 6);
}

/**
 * Nesmazané ochutnávky. Smazaný záznam zůstává v poli jako náhrobek kvůli
 * slučování mezi zařízeními, ale do UI ani do statistik nepatří.
 */
/** Návrh „Co dnes zkusit?" — dosud neochutnané, k věku i sezóně (docs/SPEC.md 4.5). */
export function suggestions(
  state: HouseholdState,
  ageMonths: number | null,
  month: number,
  count = 3,
): Ingredient[] {
  const tasted = tastedIds(state);
  return ingredients
    .filter(
      (item) =>
        !tasted.has(item.id) &&
        suitableNow(item, ageMonths) &&
        inSeason(item, month) &&
        item.chokingRisk !== 'high',
    )
    .slice(0, count);
}
