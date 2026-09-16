import type { Recipe } from '@/types';
import { breakfast } from './breakfast';
import { breakfast2 } from './breakfast_2';
import { bezMleka } from './bez_mleka';
import { extras } from './extras';
import { lunchesDinners } from './lunches_dinners';
import { prvniSousta } from './prvni_sousta';
import { prvniUpravyLusteniny } from './prvni_upravy_lusteniny';
import { prvniUpravyMaso } from './prvni_upravy_maso';
import { prvniUpravyObiloviny } from './prvni_upravy_obiloviny';
import { prvniUpravyMaso2 } from './prvni_upravy_maso_2';
import { prvniUpravyDokonceni } from './prvni_upravy_dokonceni';
import { prvniUpravyZbytek } from './prvni_upravy_zbytek';
import { prvniUpravyRyby } from './prvni_upravy_ryby';
import { prvniUpravyOvoce } from './prvni_upravy_ovoce';
import { prvniUpravyOvoce2 } from './prvni_upravy_ovoce_2';
import { prvniUpravyMouky } from './prvni_upravy_mouky';
import { prvniUpravyMaso3 } from './prvni_upravy_maso_3';
import { prvniUpravyMlecne } from './prvni_upravy_mlecne';
import { prvniUpravyOrechyBylinky } from './prvni_upravy_orechy_bylinky';
import { prvniUpravyZbytek2 } from './prvni_upravy_zbytek_2';
import { prvniUpravyZelenina } from './prvni_upravy_zelenina';
import { lunchesDinners2 } from './lunches_dinners_2';
import { snacksBaking } from './snacks_baking';
import { snacksBaking2 } from './snacks_baking_2';
import { soups } from './soups';
import { soups2 } from './soups_2';

/**
 * Kuchařka. Plní se po kategoriích ve fázi 3 (docs/GOALS.md).
 */
export const recipes: Recipe[] = [
  ...prvniSousta,
  ...prvniUpravyZelenina,
  ...prvniUpravyOvoce,
  ...prvniUpravyOvoce2,
  ...prvniUpravyMouky,
  ...prvniUpravyMaso3,
  ...prvniUpravyMlecne,
  ...prvniUpravyOrechyBylinky,
  ...prvniUpravyZbytek2,
  ...prvniUpravyLusteniny,
  ...prvniUpravyMaso,
  ...prvniUpravyObiloviny,
  ...prvniUpravyRyby,
  ...prvniUpravyMaso2,
  ...prvniUpravyZbytek,
  ...prvniUpravyDokonceni,
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
