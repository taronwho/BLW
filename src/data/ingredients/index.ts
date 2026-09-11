import type { Ingredient } from '@/types';
import { dairyEggs } from './dairy_eggs';
import { fruits } from './fruits';
import { grains } from './grains';
import { legumes } from './legumes';
import { meatFish } from './meat_fish';
import { nutsSeedsOils } from './nuts_seeds_oils';

/**
 * Katalog surovin. Plní se po kategoriích ve fázi 2 (docs/GOALS.md).
 * Každý soubor kategorie exportuje pole, které se tady spojí.
 */
export const ingredients: Ingredient[] = [...fruits, ...grains, ...meatFish, ...legumes, ...dairyEggs, ...nutsSeedsOils];

export const ingredientById: ReadonlyMap<string, Ingredient> = new Map(
  ingredients.map((item) => [item.id, item]),
);
