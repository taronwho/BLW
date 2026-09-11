import type { Catalog } from '@/types';
import { safetyRules } from './rules';
import type { Finding, SafetyRule } from './types';

function appliesToIngredient(rule: SafetyRule): boolean {
  return rule.appliesTo === 'ingredient' || rule.appliesTo === 'both';
}

function appliesToRecipe(rule: SafetyRule): boolean {
  return rule.appliesTo === 'recipe' || rule.appliesTo === 'both';
}

/** Projde katalog všemi pravidly a vrátí nálezy v pořadí pravidel. */
export function runSafetyRules(
  catalog: Catalog,
  rules: readonly SafetyRule[] = safetyRules,
): Finding[] {
  const findings: Finding[] = [];

  for (const rule of rules) {
    if (appliesToIngredient(rule)) {
      for (const ingredient of catalog.ingredients) {
        const message = rule.check(ingredient, catalog);
        if (message !== null) {
          findings.push({
            ruleId: rule.id,
            severity: rule.severity,
            itemKind: 'ingredient',
            itemId: ingredient.id,
            itemName: ingredient.nameCz,
            message,
          });
        }
      }
    }
    if (appliesToRecipe(rule)) {
      for (const recipe of catalog.recipes) {
        const message = rule.check(recipe, catalog);
        if (message !== null) {
          findings.push({
            ruleId: rule.id,
            severity: rule.severity,
            itemKind: 'recipe',
            itemId: recipe.id,
            itemName: recipe.titleCz,
            message,
          });
        }
      }
    }
  }

  return findings;
}

export function errorsOf(findings: readonly Finding[]): Finding[] {
  return findings.filter((f) => f.severity === 'error');
}

export function warningsOf(findings: readonly Finding[]): Finding[] {
  return findings.filter((f) => f.severity === 'warning');
}
