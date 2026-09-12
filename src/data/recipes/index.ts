import type { Recipe } from '@/types';
import { lunchesDinners } from './lunches_dinners';

/**
 * Kuchařka. Plní se po kategoriích ve fázi 3 (docs/GOALS.md).
 */
export const recipes: Recipe[] = [...lunchesDinners];

export const recipeById: ReadonlyMap<string, Recipe> = new Map(
  recipes.map((item) => [item.id, item]),
);
