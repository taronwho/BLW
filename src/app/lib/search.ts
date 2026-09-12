import { normalize } from '@/safety';
import type { Ingredient, Recipe } from '@/types';

/**
 * Vyhledávání musí fungovat s diakritikou i bez ní — rodič píše jednou rukou
 * na mobilu a „cocka" musí najít čočku (docs/SPEC.md kap. 4.1).
 */
export function matchesIngredient(ingredient: Ingredient, query: string): boolean {
  const needle = normalize(query);
  if (needle.length === 0) return true;
  const haystacks = [ingredient.nameCz, ...ingredient.altNamesCz, ingredient.category];
  return haystacks.some((text) => normalize(text).includes(needle));
}

export function matchesRecipe(recipe: Recipe, query: string, ingredientNames: string[]): boolean {
  const needle = normalize(query);
  if (needle.length === 0) return true;
  const haystacks = [recipe.titleCz, recipe.category, ...recipe.tags, ...ingredientNames];
  return haystacks.some((text) => normalize(text).includes(needle));
}
