import type { Recipe } from '@/types';
import { breakfast } from './breakfast';
import { lunchesDinners } from './lunches_dinners';

/**
 * Kuchařka. Plní se po kategoriích ve fázi 3 (docs/GOALS.md).
 */
export const recipes: Recipe[] = [...lunchesDinners, ...breakfast];

export const recipeById: ReadonlyMap<string, Recipe> = new Map(
  recipes.map((item) => [item.id, item]),
);
