import { describe, expect, it } from 'vitest';
import { activeTastings, tastedIds, tastingsByIngredient } from '../../src/app/lib/tastings';
import { emptyHouseholdState, migrateHouseholdState } from '../../src/sync/merge';
import type { Child, HouseholdState, TastingEvent } from '../../src/types';

function dite(id: string, name: string): Child {
  return { id, name, birthDate: '2026-02-01' };
}

function zaznam(overrides: Partial<TastingEvent>): TastingEvent {
  return {
    id: 'ev',
    ingredientId: 'brokolice',
    date: '2026-09-10',
    amount: 'ochutnala',
    reaction: 'zadna',
    createdBy: 'uid',
    createdAt: 1_000,
    ...overrides,
  };
}

function domacnost(tastings: readonly TastingEvent[]): HouseholdState {
  return {
    ...emptyHouseholdState(),
    children: {
      'dite-1': { hodnota: dite('dite-1', 'Anna'), kdy: 1 },
      'dite-2': { hodnota: dite('dite-2', 'Bára'), kdy: 2 },
    },
    tastings: [...tastings],
  };
}

describe('deník patří dítěti, ne domácnosti', () => {
  const stav = domacnost([
    zaznam({ id: 'a1', childId: 'dite-1', ingredientId: 'brokolice' }),
    zaznam({ id: 'a2', childId: 'dite-1', ingredientId: 'mrkev' }),
    zaznam({ id: 'b1', childId: 'dite-2', ingredientId: 'dyne-hokaido' }),
  ]);

  it('každé dítě vidí jen svoje záznamy', () => {
    expect(activeTastings(stav, 'dite-1').map((e) => e.id)).toEqual(['a1', 'a2']);
    expect(activeTastings(stav, 'dite-2').map((e) => e.id)).toEqual(['b1']);
  });

  it('ochutnané suroviny se sourozenci nemíchají', () => {
    expect([...tastedIds(stav, 'dite-1')].sort()).toEqual(['brokolice', 'mrkev']);
    expect([...tastedIds(stav, 'dite-2')]).toEqual(['dyne-hokaido']);
  });

  it('historie u suroviny je také jen dítěte, na které je přepnuto', () => {
    expect(tastingsByIngredient(stav, 'dite-2').get('brokolice')).toBeUndefined();
    expect(tastingsByIngredient(stav, 'dite-1').get('brokolice')).toHaveLength(1);
  });

  it('bez dítěte není čí ochutnávky ukazovat', () => {
    expect(activeTastings(stav, null)).toEqual([]);
  });

  it('záznam z doby jednoho dítěte se počítá prvnímu, ne každému', () => {
    const stare = domacnost([zaznam({ id: 'stary' })]);
    expect(activeTastings(stare, 'dite-1').map((e) => e.id)).toEqual(['stary']);
    expect(activeTastings(stare, 'dite-2')).toEqual([]);
  });

  it('bez dítěte se zapisuje do společného deníku a první dítě ho zdědí', () => {
    const zadneDite: HouseholdState = { ...emptyHouseholdState(), tastings: [zaznam({ id: 'x' })] };
    // Rodič může zapisovat dřív, než dítě vyplní — záznam nesmí zmizet.
    expect(activeTastings(zadneDite, null).map((e) => e.id)).toEqual(['x']);

    const sDitetem: HouseholdState = {
      ...zadneDite,
      children: { 'dite-1': { hodnota: dite('dite-1', 'Anna'), kdy: 1 } },
    };
    expect(activeTastings(sDitetem, 'dite-1').map((e) => e.id)).toEqual(['x']);
  });

  it('migrace starých dat přiřadí ochutnávky prvnímu dítěti', () => {
    const migrovano = migrateHouseholdState({
      childName: 'Anna',
      childBirthDate: '2026-02-01',
      tastings: [zaznam({ id: 'stary' })],
      members: [],
      favorites: {},
      recipeNotes: {},
      schemaVersion: 1,
    });
    expect(migrovano.tastings[0]?.childId).toBe('dite-1');
  });
});
