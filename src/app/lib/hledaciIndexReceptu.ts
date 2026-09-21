import { ingredients } from '@/data/ingredients';
import { recipes } from '@/data/recipes';
import { RECIPE_CATEGORY_LABELS } from './labels';
import { hledej, zaznam } from './hledaciZaznam';
import type { Zaznam } from './hledaciZaznam';

/**
 * Hledání v receptech. Oddělené od surovin, aby si Suroviny nemusely
 * stahovat kuchařku (audit 17. 9. 2026, nález 3.2).
 */
let index: Zaznam[] | null = null;

function receptyIndex(): Zaznam[] {
  if (index === null) {
    const podleId = new Map(ingredients.map((item) => [item.id, item]));
    index = recipes.map((recipe) => {
      // I synonyma — „jablka" musí najít recepty s jablkem, ne jen ten,
      // který to slovo má v názvu.
      const nazvy = recipe.ingredients.flatMap((ref) => {
        const item = podleId.get(ref.ingredientId);
        return item === undefined ? [] : [item.nameCz, ...item.altNamesCz];
      });
      return zaznam(recipe.id, RECIPE_CATEGORY_LABELS[recipe.category], [
        recipe.titleCz,
        ...recipe.tags,
        ...nazvy,
      ]);
    });
  }
  return index;
}

/** Idčka receptů, které dotazu odpovídají. `null` = prázdný dotaz. */
export function hledejRecepty(query: string): Set<string> | null {
  return hledej(receptyIndex(), query);
}
