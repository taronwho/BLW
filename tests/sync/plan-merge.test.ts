import { describe, expect, it } from 'vitest';
import {
  emptyHouseholdState,
  mergeHouseholdState,
  migrateHouseholdState,
  SCHEMA_VERSION,
} from '../../src/sync/merge';
import type { HouseholdState, Plan, StavDne } from '../../src/types';

/**
 * Plán se slučuje po částech: rozvrh dnů jako celek, odškrtnuté dny po
 * jednom. Bez toho by stačilo, aby každý rodič odškrtl jiný den, a jeden
 * z nich by zmizel.
 */

function plan(patch: Partial<Plan> = {}): Plan {
  return {
    childId: 'dite-1',
    blok: 1,
    vytvoreno: '2026-09-15',
    dny: [
      { cislo: 1, novinka: 'brokolice', jidla: [] },
      { cislo: 2, novinka: 'kvetak', jidla: [] },
      { cislo: 3, novinka: 'cuketa', jidla: [] },
    ],
    stavy: {},
    ...patch,
  };
}

function stav(plany: Record<string, Plan | null>, kdy: number): HouseholdState {
  return {
    ...emptyHouseholdState(),
    plans: Object.fromEntries(
      Object.entries(plany).map(([id, hodnota]) => [id, { hodnota, kdy }]),
    ),
  };
}

function stavy(zaznamy: Record<string, [StavDne, number]>): Plan['stavy'] {
  return Object.fromEntries(
    Object.entries(zaznamy).map(([den, [hodnota, kdy]]) => [den, { hodnota, kdy }]),
  );
}

describe('slučování plánu mezi dvěma telefony', () => {
  it('odškrtnutí z obou telefonů zůstane zachované', () => {
    const matka = stav({ 'dite-1': plan({ stavy: stavy({ '1': ['hotovo', 100] }) }) }, 100);
    const otec = stav({ 'dite-1': plan({ stavy: stavy({ '2': ['preskoceno', 90] }) }) }, 90);

    const sloucene = mergeHouseholdState(matka, otec).plans?.['dite-1']?.hodnota;
    expect(sloucene?.stavy['1']?.hodnota).toBe('hotovo');
    expect(sloucene?.stavy['2']?.hodnota).toBe('preskoceno');
  });

  it('u téhož dne rozhoduje pozdější zápis', () => {
    const matka = stav({ 'dite-1': plan({ stavy: stavy({ '1': ['hotovo', 200] }) }) }, 200);
    const otec = stav({ 'dite-1': plan({ stavy: stavy({ '1': ['preskoceno', 100] }) }) }, 100);

    expect(mergeHouseholdState(matka, otec).plans?.['dite-1']?.hodnota?.stavy['1']?.hodnota).toBe(
      'hotovo',
    );
    expect(mergeHouseholdState(otec, matka).plans?.['dite-1']?.hodnota?.stavy['1']?.hodnota).toBe(
      'hotovo',
    );
  });

  it('stavy starého plánu neoznačí dny toho nového', () => {
    const stary = stav({ 'dite-1': plan({ stavy: stavy({ '1': ['hotovo', 100] }) }) }, 100);
    const novy = stav(
      { 'dite-1': plan({ blok: 2, vytvoreno: '2026-10-20', stavy: {} }) },
      500,
    );

    const sloucene = mergeHouseholdState(novy, stary).plans?.['dite-1']?.hodnota;
    expect(sloucene?.blok).toBe(2);
    expect(sloucene?.stavy).toEqual({});
  });

  it('zrušený plán se z druhého telefonu nevrátí', () => {
    const zruseny = stav({ 'dite-1': null }, 500);
    const puvodni = stav({ 'dite-1': plan() }, 100);
    expect(mergeHouseholdState(zruseny, puvodni).plans?.['dite-1']?.hodnota).toBeNull();
  });

  it('plány dvou dětí se nepřetlačují', () => {
    const matka = stav({ 'dite-1': plan() }, 100);
    const otec = stav({ 'dite-2': plan({ childId: 'dite-2' }) }, 200);
    const sloucene = mergeHouseholdState(matka, otec).plans;
    expect(Object.keys(sloucene ?? {}).sort()).toEqual(['dite-1', 'dite-2']);
  });
});

describe('převod staršího stavu', () => {
  it('stav bez plánu se načte a plán prostě nemá', () => {
    const prevedeny = migrateHouseholdState({
      children: {},
      members: [],
      tastings: [],
      favorites: {},
      recipeNotes: {},
      schemaVersion: 3,
    });
    expect(prevedeny.schemaVersion).toBe(SCHEMA_VERSION);
    expect(prevedeny.plans).toBeUndefined();
  });

  it('uložený plán převod přežije', () => {
    const prevedeny = migrateHouseholdState({
      ...emptyHouseholdState(),
      plans: { 'dite-1': { hodnota: plan(), kdy: 10 } },
    });
    expect(prevedeny.plans?.['dite-1']?.hodnota?.dny).toHaveLength(3);
  });
});
