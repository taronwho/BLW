import { describe, expect, it } from 'vitest';
import {
  hasSign,
  isReady,
  missingSigns,
  READY_HOW_TO_TELL,
  READY_LABELS,
  READY_MISSING_LABELS,
  readySigns,
  shouldWarnAboutReadiness,
} from '../../src/app/lib/readiness';
import { emptyHouseholdState } from '../../src/sync/merge';
import { READY_SIGNS } from '../../src/types';
import type { HouseholdState, ReadySign } from '../../src/types';

function stav(znaky?: ReadySign[]): HouseholdState {
  const zaklad = emptyHouseholdState();
  return znaky === undefined ? zaklad : { ...zaklad, readySigns: znaky };
}

describe('připravenost na příkrm', () => {
  it('bez odškrtnutí se upozorňuje — to je stav rodiče před začátkem', () => {
    const s = stav();
    expect(readySigns(s)).toEqual([]);
    expect(isReady(s)).toBe(false);
    expect(shouldWarnAboutReadiness(s)).toBe(true);
    expect(missingSigns(s)).toEqual([...READY_SIGNS]);
  });

  it('dva ze tří pořád nestačí', () => {
    const s = stav(['sed', 'koordinace']);
    expect(isReady(s)).toBe(false);
    expect(shouldWarnAboutReadiness(s)).toBe(true);
    expect(missingSigns(s)).toEqual(['reflex']);
  });

  it('všechny tři upozornění vypnou', () => {
    const s = stav(['sed', 'koordinace', 'reflex']);
    expect(isReady(s)).toBe(true);
    expect(shouldWarnAboutReadiness(s)).toBe(false);
    expect(missingSigns(s)).toEqual([]);
  });

  it('na pořadí odškrtnutí nezáleží', () => {
    expect(isReady(stav(['reflex', 'sed', 'koordinace']))).toBe(true);
  });

  it('hasSign odpovídá seznamu', () => {
    const s = stav(['sed']);
    expect(hasSign(s, 'sed')).toBe(true);
    expect(hasSign(s, 'reflex')).toBe(false);
  });

  it('každý znak má popisek i to, podle čeho se pozná', () => {
    // Bez popisu by se odškrtávalo naslepo a celá věc by ztratila smysl.
    for (const sign of READY_SIGNS) {
      expect(READY_LABELS[sign].trim().length).toBeGreaterThan(0);
      expect(READY_HOW_TO_TELL[sign].trim().length).toBeGreaterThan(40);
      // Jmenný tvar musí jít vložit do věty „zbývá …“ — tedy malé písmeno
      // na začátku a žádné sloveso v určitém tvaru.
      const jmenny = READY_MISSING_LABELS[sign];
      expect(jmenny[0]).toBe(jmenny[0]?.toLowerCase());
      expect(jmenny).not.toMatch(/^(vyhasl|trefí|udrží)/);
    }
  });
});
