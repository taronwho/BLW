import { expect } from 'vitest';
import { rulesById } from '../../src/safety/rules';
import type { RuleTarget } from '../../src/safety/types';
import type { Catalog } from '../../src/types';

export function runRule(ruleId: string, item: RuleTarget, catalog: Catalog): string | null {
  const rule = rulesById.get(ruleId);
  expect(rule, `Pravidlo ${ruleId} v src/safety/rules.ts neexistuje.`).toBeDefined();
  if (rule === undefined) throw new Error(`Pravidlo ${ruleId} chybí.`);
  return rule.check(item, catalog);
}

/** Pozitivní test: platná položka projde. */
export function expectPass(ruleId: string, item: RuleTarget, catalog: Catalog): void {
  expect(runRule(ruleId, item, catalog)).toBeNull();
}

/** Negativní test: rozbitá položka neprojde. */
export function expectFail(ruleId: string, item: RuleTarget, catalog: Catalog): string {
  const message = runRule(ruleId, item, catalog);
  expect(message, `Pravidlo ${ruleId} mělo zabrat, ale vrátilo null.`).not.toBeNull();
  return message ?? '';
}
