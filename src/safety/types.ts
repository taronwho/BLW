import type { Catalog, Ingredient, Recipe } from '@/types';

export type Severity = 'error' | 'warning';

/**
 * docs/SPEC.md kapitola 3 uvádí `appliesTo: 'ingredient' | 'recipe'`.
 * Pravidla jako `no-honey-baby` ale podle téže tabulky platí zároveň pro
 * suroviny i recepty, a id musí zůstat jedno. Proto je tu navíc 'both';
 * obě hodnoty ze specifikace zůstávají v platnosti.
 */
export type RuleScope = 'ingredient' | 'recipe' | 'both';

export type RuleTarget = Ingredient | Recipe;

export interface SafetyRule {
  id: string;
  severity: Severity;
  appliesTo: RuleScope;
  /** Česky, jednou větou — používá se ve výpisu validátoru. */
  description: string;
  /** Vrátí text chyby, nebo null když je položka v pořádku. */
  check(item: RuleTarget, catalog: Catalog): string | null;
}

export interface Finding {
  ruleId: string;
  severity: Severity;
  itemKind: 'ingredient' | 'recipe';
  itemId: string;
  itemName: string;
  message: string;
}

export function isIngredient(item: RuleTarget): item is Ingredient {
  return 'nameCz' in item;
}

export function isRecipe(item: RuleTarget): item is Recipe {
  return 'titleCz' in item;
}
