import { describe, expect, it } from 'vitest';
import { ageInMonths, defaultStage, formatAge, stageForAge } from '../../src/lib/age';

const dnes = new Date('2026-09-11T12:00:00');

describe('ageInMonths', () => {
  it('spočítá celé měsíce', () => {
    expect(ageInMonths('2026-03-11', dnes)).toBe(6);
  });

  it('nezapočítá měsíc, který ještě neuplynul celý', () => {
    expect(ageInMonths('2026-03-12', dnes)).toBe(5);
  });

  it('vrátí null pro datum v budoucnosti', () => {
    expect(ageInMonths('2027-01-01', dnes)).toBeNull();
  });

  it('vrátí null pro nesmyslné datum', () => {
    expect(ageInMonths('', dnes)).toBeNull();
    expect(ageInMonths('nedatum', dnes)).toBeNull();
  });
});

describe('stageForAge', () => {
  it('mapuje věk na fázi podle hranic 9 a 12 měsíců', () => {
    expect(stageForAge(6)).toBe('6m');
    expect(stageForAge(8)).toBe('6m');
    expect(stageForAge(9)).toBe('9m');
    expect(stageForAge(11)).toBe('9m');
    expect(stageForAge(12)).toBe('12m');
    expect(stageForAge(24)).toBe('12m');
  });
});

describe('defaultStage', () => {
  it('předvybere fázi podle data narození', () => {
    expect(defaultStage('2026-03-11', dnes)).toBe('6m');
    expect(defaultStage('2025-09-11', dnes)).toBe('12m');
  });

  it('bez data narození zůstává na 6m', () => {
    expect(defaultStage('', dnes)).toBe('6m');
  });
});

describe('formatAge', () => {
  it('skloňuje česky', () => {
    expect(formatAge(1)).toBe('1 měsíc');
    expect(formatAge(3)).toBe('3 měsíce');
    expect(formatAge(7)).toBe('7 měsíců');
  });
});
