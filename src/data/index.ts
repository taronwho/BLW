import type { Catalog } from '@/types';
import { guides } from './guides';
import { ingredients } from './ingredients';
import { recipes } from './recipes';

export { ingredients, ingredientById } from './ingredients';
export { recipes, recipeById } from './recipes';
export { guides, guideById, guidesByUrgency } from './guides';
export { lists, listById } from './lists';
export type { Seznam } from './lists';

export const catalog: Catalog = { ingredients, recipes, guides };
