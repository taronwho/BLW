import { describe, expect, it } from 'vitest';
import { formatAge } from '../../src/app/lib/age';
import { cislo, MESIC, ROK, sklonuj, tvarPodlePoctu } from '../../src/text/sklonovani';

describe('tvarPodlePoctu', () => {
  it('bere pro jedničku první tvar', () => {
    expect(tvarPodlePoctu(1, MESIC)).toBe('měsíc');
  });

  it('bere pro dva až čtyři druhý tvar', () => {
    for (const pocet of [2, 3, 4]) {
      expect(tvarPodlePoctu(pocet, MESIC)).toBe('měsíce');
    }
  });

  it('bere pro pět a víc třetí tvar', () => {
    for (const pocet of [5, 11, 21, 100]) {
      expect(tvarPodlePoctu(pocet, MESIC)).toBe('měsíců');
    }
  });

  it('bere pro nulu tvar pro pět a víc', () => {
    expect(tvarPodlePoctu(0, MESIC)).toBe('měsíců');
  });

  it('bere pro desetinné číslo čtvrtý tvar', () => {
    expect(tvarPodlePoctu(1.5, MESIC)).toBe('měsíce');
    expect(tvarPodlePoctu(2.5, ROK)).toBe('roku');
  });

  it('řídí se absolutní hodnotou u záporného čísla', () => {
    expect(tvarPodlePoctu(-2, MESIC)).toBe('měsíce');
  });
});

describe('cislo', () => {
  it('celé číslo píše bez desetinné čárky', () => {
    expect(cislo(7)).toBe('7');
  });

  it('desetinné zaokrouhlí na jedno místo a použije čárku', () => {
    expect(cislo(1.55)).toBe('1,6');
  });
});

describe('sklonuj', () => {
  it('spojí číslo se správným tvarem', () => {
    expect(sklonuj(1, MESIC)).toBe('1 měsíc');
    expect(sklonuj(3, MESIC)).toBe('3 měsíce');
    expect(sklonuj(9, MESIC)).toBe('9 měsíců');
  });
});

/**
 * Regrese na konkrétní chybu: `formatAge` vyrábělo „1 měsíců", „2 měsíců"
 * a „5 roky" — a je vidět ve stálé hlavičce na každé obrazovce.
 */
describe('formatAge', () => {
  const ocekavane: [number, string][] = [
    [0, '0 měsíců'],
    [1, '1 měsíc'],
    [2, '2 měsíce'],
    [4, '4 měsíce'],
    [5, '5 měsíců'],
    [6, '6 měsíců'],
    [11, '11 měsíců'],
    [12, '12 měsíců'],
    [23, '23 měsíců'],
    [24, '2 roky'],
    [47, '3 roky'],
    [60, '5 let'],
    [84, '7 let'],
  ];

  for (const [mesice, text] of ocekavane) {
    it(`${mesice} měsíců věku se vypíše jako „${text}"`, () => {
      expect(formatAge(mesice)).toBe(text);
    });
  }

  it('bez data narození to řekne slovy', () => {
    expect(formatAge(null)).toBe('věk nevyplněn');
  });

  it('nevyrobí žádný tvar, který čeština nezná', () => {
    // Projede celý rozsah, ve kterém se aplikace používá, a hlídá, že se
    // nikde neobjeví chybná kombinace čísla a tvaru.
    for (let mesice = 0; mesice <= 120; mesice += 1) {
      const text = formatAge(mesice);
      expect(text).not.toMatch(/^1 (měsíců|let)$/);
      expect(text).not.toMatch(/^[234] (měsíců|let)$/);
      expect(text).not.toMatch(/^([05-9]|\d\d+) (měsíc|rok|roky)$/);
    }
  });
});
