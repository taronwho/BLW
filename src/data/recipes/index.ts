import type { Recipe } from '@/types';
import { breakfast } from './breakfast';
import { extras } from './extras';
import { lunchesDinners } from './lunches_dinners';
import { snacksBaking } from './snacks_baking';
import { soups } from './soups';

/**
 * Kuchařka. Plní se po kategoriích ve fázi 3 (docs/GOALS.md).
 */
export const recipes: Recipe[] = [...lunchesDinners, ...breakfast, ...soups, ...snacksBaking, ...extras];

export const recipeById: ReadonlyMap<string, Recipe> = new Map(
  recipes.map((item) => [item.id, item]),
);
