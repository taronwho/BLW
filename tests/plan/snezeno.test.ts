import { describe, expect, it } from 'vitest';
import { emptyHouseholdState, mergeHouseholdState, migrateHouseholdState } from '../../src/sync/merge';
import {
  bezSnezenehoDne,
  jeSnezeno,
  odlozDen,
  sSnezenym,
  sStavemDne,
  snezenoJidel,
} from '../../src/plan/typy';
import type { HouseholdState, Plan } from '../../src/types';

/**
 * Snědená jednotlivá jídla dne. Rodič odškrtne snídani ráno, oběd v poledne
 * a den až večer, často každé z jiného telefonu.
 */

function plan(patch: Partial<Plan> = {}): Plan {
  return {
    childId: 'dite-1',
    blok: 1,
    vytvoreno: '2026-09-15',
    dny: [
      {
        cislo: 1,
        novinka: 'brokolice',
        jidla: [
          { typ: 'snidane', recipeId: 'a', duvod: 'osvedcene' },
          { typ: 'obed', ingredientId: 'brokolice', duvod: 'prvni-ochutnavka' },
          { typ: 'vecere', recipeId: 'b', duvod: 'osvedcene' },
        ],
      },
      {
        cislo: 2,
        novinka: 'kvetak',
        jidla: [
          { typ: 'snidane', recipeId: 'c', duvod: 'osvedcene' },
          { typ: 'obed', ingredientId: 'kvetak', duvod: 'prvni-ochutnavka' },
        ],
      },
    ],
    stavy: {},
    ...patch,
  };
}

function stav(hodnota: Plan, kdy: number): HouseholdState {
  return { ...emptyHouseholdState(), plans: { 'dite-1': { hodnota, kdy } } };
}

describe('snědená jídla dne', () => {
  it('jídlo se odškrtne samo, bez odškrtnutí dne', () => {
    const p = sSnezenym(plan(), 1, 0, true, 100);
    expect(jeSnezeno(p, 1, 0)).toBe(true);
    expect(jeSnezeno(p, 1, 1)).toBe(false);
    expect(snezenoJidel(p, p.dny[0]!)).toBe(1);
    expect(p.stavy).toEqual({});
  });

  it('odškrtnutý den znamená snědená jídla, výslovné vrácení platí přednostně', () => {
    const hotovy = sStavemDne(plan(), 1, 'hotovo', 100);
    expect(snezenoJidel(hotovy, hotovy.dny[0]!)).toBe(3);
    const bezVecere = sSnezenym(hotovy, 1, 2, false, 200);
    expect(jeSnezeno(bezVecere, 1, 2)).toBe(false);
    expect(snezenoJidel(bezVecere, bezVecere.dny[0]!)).toBe(2);
  });

  it('odložený den si odškrtnutá jídla odnese s sebou', () => {
    const p = odlozDen(sSnezenym(plan(), 1, 0, true, 100), 1);
    expect(p.dny[1]?.novinka).toBe('brokolice');
    expect(jeSnezeno(p, 2, 0)).toBe(true);
    expect(jeSnezeno(p, 1, 0)).toBe(false);
  });

  it('výměna obsahu dne odškrtnutá jídla toho dne zapomene', () => {
    const p = bezSnezenehoDne(sSnezenym(sSnezenym(plan(), 1, 0, true, 100), 2, 1, true, 100), 1);
    expect(jeSnezeno(p, 1, 0)).toBe(false);
    expect(jeSnezeno(p, 2, 1)).toBe(true);
  });

  it('odškrtnutí z obou telefonů se sloučí', () => {
    const matka = stav(sSnezenym(plan(), 1, 0, true, 100), 100);
    const otec = stav(sSnezenym(plan(), 1, 1, true, 150), 150);
    for (const [a, b] of [
      [matka, otec],
      [otec, matka],
    ] as const) {
      const sloucene = mergeHouseholdState(a, b).plans?.['dite-1']?.hodnota;
      expect(sloucene).toBeTruthy();
      expect(jeSnezeno(sloucene!, 1, 0)).toBe(true);
      expect(jeSnezeno(sloucene!, 1, 1)).toBe(true);
    }
  });

  it('u téhož jídla rozhoduje pozdější zápis', () => {
    const snedl = stav(sSnezenym(plan(), 1, 0, true, 100), 100);
    const vratil = stav(sSnezenym(plan(), 1, 0, false, 200), 200);
    expect(jeSnezeno(mergeHouseholdState(snedl, vratil).plans!['dite-1']!.hodnota!, 1, 0)).toBe(
      false,
    );
    expect(jeSnezeno(mergeHouseholdState(vratil, snedl).plans!['dite-1']!.hodnota!, 1, 0)).toBe(
      false,
    );
  });

  it('zápis telefonu, který o jídlech neví, je nesmaže', () => {
    const novy = stav(sSnezenym(plan(), 1, 0, true, 100), 100);
    const stary = stav(sStavemDne(plan(), 2, 'preskoceno', 300), 300);
    const sloucene = mergeHouseholdState(stary, novy).plans?.['dite-1']?.hodnota;
    expect(jeSnezeno(sloucene!, 1, 0)).toBe(true);
    expect(sloucene?.stavy['2']?.hodnota).toBe('preskoceno');
  });

  it('snědená jídla přežijí převod uloženého stavu', () => {
    const p = sSnezenym(plan(), 1, 0, true, 100);
    const prevedeny = migrateHouseholdState(JSON.parse(JSON.stringify(stav(p, 100))));
    expect(jeSnezeno(prevedeny.plans!['dite-1']!.hodnota!, 1, 0)).toBe(true);
  });
});
