import { describe, expect, it } from 'vitest';
import {
  dnesIso,
  dnuVMesici,
  rozdilVMesicich,
  rozeberIsoDatum,
} from '../../src/text/datum';

/**
 * Datum narození je den v kalendáři, ne okamžik v čase.
 *
 * `new Date('2026-03-01')` je UTC půlnoc; kdo ji pak čte přes
 * `getDate()` v místním čase, dostane západně od Greenwiche 28. února.
 */
describe('rozeberIsoDatum', () => {
  it('rozebere platné datum na tři čísla', () => {
    expect(rozeberIsoDatum('2026-03-01')).toEqual({ rok: 2026, mesic: 3, den: 1 });
  });

  it('odmítne nesmysly místo toho, aby je tiše posunul', () => {
    for (const vstup of ['', '2026-3-1', '1. 3. 2026', '2026-13-01', '2026-02-31', 'včera']) {
      expect(rozeberIsoDatum(vstup), vstup).toBeNull();
    }
  });

  it('zná přestupné roky', () => {
    expect(rozeberIsoDatum('2024-02-29')).not.toBeNull();
    expect(rozeberIsoDatum('2026-02-29')).toBeNull();
    expect(rozeberIsoDatum('2000-02-29')).not.toBeNull();
    expect(rozeberIsoDatum('1900-02-29')).toBeNull();
  });

  it('mezery kolem data nevadí', () => {
    expect(rozeberIsoDatum(' 2026-03-01 ')).toEqual({ rok: 2026, mesic: 3, den: 1 });
  });
});

describe('dnuVMesici', () => {
  it('sedí na všech dvanácti měsících', () => {
    expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => dnuVMesici(2026, m))).toEqual([
      31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
    ]);
  });
});

describe('rozdilVMesicich', () => {
  const den = (iso: string) => rozeberIsoDatum(iso) as NonNullable<ReturnType<typeof rozeberIsoDatum>>;

  it('celý měsíc až po dni narozenin, ne dřív', () => {
    expect(rozdilVMesicich(den('2026-03-01'), den('2026-03-31'))).toBe(0);
    expect(rozdilVMesicich(den('2026-03-01'), den('2026-04-01'))).toBe(1);
  });

  it('počítá přes přelom roku', () => {
    expect(rozdilVMesicich(den('2025-11-15'), den('2026-03-15'))).toBe(4);
  });

  it('záporný, když je druhé datum dřív — volající si rozhodne', () => {
    expect(rozdilVMesicich(den('2026-03-01'), den('2026-02-01'))).toBe(-1);
  });
});

describe('dnesIso', () => {
  it('bere místní den, ne UTC', () => {
    // 1. ledna 2026 v 23:30 místního času je pořád prvního, i když
    // v UTC už může být druhého.
    expect(dnesIso(new Date(2026, 0, 1, 23, 30))).toBe('2026-01-01');
  });

  it('doplňuje nuly', () => {
    expect(dnesIso(new Date(2026, 2, 5, 12))).toBe('2026-03-05');
  });
});
