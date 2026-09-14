import type { Recipe } from '@/types';
import { breakfast } from './breakfast';
import { breakfast2 } from './breakfast_2';
import { bezMleka } from './bez_mleka';
import { extras } from './extras';
import { lunchesDinners } from './lunches_dinners';
import { lunchesDinners2 } from './lunches_dinners_2';
import { snacksBaking } from './snacks_baking';
import { snacksBaking2 } from './snacks_baking_2';
import { soups } from './soups';
import { soups2 } from './soups_2';

/**
 * Kuchařka. Plní se po kategoriích ve fázi 3 (docs/GOALS.md).
 */
export const recipes: Recipe[] = [
  ...lunchesDinners,
  ...lunchesDinners2,
  ...breakfast,
  ...breakfast2,
  ...soups,
  ...soups2,
  ...snacksBaking,
  ...snacksBaking2,
  ...extras,
  ...bezMleka,
];

export const recipeById: ReadonlyMap<string, Recipe> = new Map(
  recipes.map((item) => [item.id, item]),
);
