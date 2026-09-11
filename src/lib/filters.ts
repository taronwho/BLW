import type { Ingredient, IngredientCategory, Recipe, TastingEvent } from '@/types';

/**
 * Rychlé filtry ze seznamu v docs/SPEC.md kapitola 4.1.
 * Jsou to čisté funkce, aby se daly testovat bez UI.
 */

export type QuickFilter =
  | 'vse'
  | 'neochutnano'
  | 'ochutnano'
  | 'klicove-alergeny'
  | 'oblibene'
  | 'vhodne-ted'
  | 'sezonni';

export const QUICK_FILTERS: ReadonlyArray<{ id: QuickFilter; label: string }> = [
  { id: 'vse', label: 'Vše' },
  { id: 'neochutnano', label: 'Neochutnáno' },
  { id: 'ochutnano', label: 'Ochutnáno' },
  { id: 'klicove-alergeny', label: 'Klíčové alergeny' },
  { id: 'oblibene', label: 'Oblíbené' },
  { id: 'vhodne-ted', label: 'Vhodné teď' },
  { id: 'sezonni', label: 'Sezónní' },
];

export interface FilterContext {
  tastedIds: ReadonlySet<string>;
  favorites: ReadonlySet<string>;
  /** Věk dcery v měsících; null, když datum narození není zadané. */
  ageMonths: number | null;
  /** Měsíc 1–12 pro filtr sezónnosti. */
  month: number;
}

export function tastedIngredientIds(tastings: readonly TastingEvent[]): Set<string> {
  return new Set(tastings.map((event) => event.ingredientId));
}

/** Prázdné `seasonCz` znamená celoročně dostupné. */
export function isInSeason(ingredient: Ingredient, month: number): boolean {
  return ingredient.seasonCz.length === 0 || ingredient.seasonCz.includes(month);
}

export function isSuitableNow(ingredient: Ingredient, ageMonths: number | null): boolean {
  // Bez data narození nemá smysl nic schovávat — ukážeme vše.
  if (ageMonths === null) return true;
  return ingredient.minAgeMonths <= ageMonths;
}

export function applyQuickFilter(
  ingredients: readonly Ingredient[],
  filter: QuickFilter,
  context: FilterContext,
): Ingredient[] {
  switch (filter) {
    case 'neochutnano':
      return ingredients.filter((i) => !context.tastedIds.has(i.id));
    case 'ochutnano':
      return ingredients.filter((i) => context.tastedIds.has(i.id));
    case 'klicove-alergeny':
      return ingredients.filter((i) => i.isKeyAllergen);
    case 'oblibene':
      return ingredients.filter((i) => context.favorites.has(i.id));
    case 'vhodne-ted':
      return ingredients.filter((i) => isSuitableNow(i, context.ageMonths));
    case 'sezonni':
      return ingredients.filter((i) => isInSeason(i, context.month));
    case 'vse':
    default:
      return [...ingredients];
  }
}

export function filterByCategory(
  ingredients: readonly Ingredient[],
  category: IngredientCategory | null,
): Ingredient[] {
  return category === null ? [...ingredients] : ingredients.filter((i) => i.category === category);
}

/**
 * Prázdný stav není chybová hláška, ale nabídka (docs/SPEC.md kap. 4.1).
 * Vrací konkrétní radu podle toho, který filtr seznam vyprázdnil.
 */
export function emptyStateHint(
  filter: QuickFilter,
  category: IngredientCategory | null,
  query: string,
): string {
  if (query.trim().length > 0) return `Nic neodpovídá hledání „${query.trim()}". Zkus kratší slovo.`;
  if (filter === 'sezonni') return 'Nic neodpovídá. Zkus zrušit filtr sezóny.';
  if (filter === 'vhodne-ted') return 'Nic neodpovídá věku. Zkus filtr Vše.';
  if (filter === 'oblibene') return 'Zatím nic v oblíbených. Přidáš je srdíčkem v detailu suroviny.';
  if (filter === 'neochutnano') return 'Všechno v tomhle výběru už má ochutnávku. Pěkná práce.';
  if (filter === 'ochutnano') return 'Tady zatím nic neochutnala. Zkus filtr Vše.';
  if (category !== null) return 'V téhle kategorii zatím nic není. Zkus jinou.';
  return 'Katalog se zatím plní.';
}

/** Recepty, které používají danou surovinu — pro detail suroviny. */
export function recipesWithIngredient(
  recipes: readonly Recipe[],
  ingredientId: string,
): Recipe[] {
  return recipes.filter((recipe) =>
    recipe.ingredients.some((ref) => ref.ingredientId === ingredientId),
  );
}
