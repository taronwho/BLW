import { normalize } from '@/safety/text';
import type { Ingredient, Recipe } from '@/types';

/**
 * Vyhledávání bez ohledu na diakritiku (docs/SPEC.md kapitola 4.1).
 * Rodič v kuchyni píše jednou rukou — „ryzicka" musí najít „růžičkovou kapustu".
 */

function haystackForIngredient(ingredient: Ingredient): string {
  return normalize([ingredient.nameCz, ...ingredient.altNamesCz].join(' '));
}

/** Všechna slova dotazu musí být v názvu nebo synonymu, v libovolném pořadí. */
function matches(haystack: string, query: string): boolean {
  const terms = normalize(query).split(' ').filter((term) => term.length > 0);
  if (terms.length === 0) return true;
  return terms.every((term) => haystack.includes(term));
}

export function searchIngredients(ingredients: readonly Ingredient[], query: string): Ingredient[] {
  const trimmed = query.trim();
  if (trimmed.length === 0) return [...ingredients];
  return ingredients.filter((ingredient) => matches(haystackForIngredient(ingredient), trimmed));
}

export function searchRecipes(recipes: readonly Recipe[], query: string): Recipe[] {
  const trimmed = query.trim();
  if (trimmed.length === 0) return [...recipes];
  return recipes.filter((recipe) =>
    matches(normalize([recipe.titleCz, ...recipe.tags].join(' ')), trimmed),
  );
}

/** Řazení podle češtiny — jinak by „Žampiony" skončily před „Avokádem". */
export function byCzechName<T>(items: readonly T[], key: (item: T) => string): T[] {
  const collator = new Intl.Collator('cs');
  return [...items].sort((a, b) => collator.compare(key(a), key(b)));
}
