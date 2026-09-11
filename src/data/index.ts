import type { Catalog } from '@/types';
import { ingredients } from './ingredients';
import { recipes } from './recipes';

export { ingredients, ingredientById } from './ingredients';
export { recipes, recipeById } from './recipes';

export const catalog: Catalog = { ingredients, recipes };
