import type { Ingredient } from '@/types';
import { fruits } from './fruits';

/**
 * Katalog surovin. Plní se po kategoriích ve fázi 2 (docs/GOALS.md).
 * Každý soubor kategorie exportuje pole, které se tady spojí.
 */
export const ingredients: Ingredient[] = [...fruits];

export const ingredientById: ReadonlyMap<string, Ingredient> = new Map(
  ingredients.map((item) => [item.id, item]),
);
