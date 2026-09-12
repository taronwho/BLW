import { describe, expect, it } from 'vitest';
import { activeTastings, tastedIds, tastingsByIngredient } from '../../src/app/lib/derive';
import { emptyHouseholdState, mergeTastings } from '../../src/sync/merge';
import type { HouseholdState, TastingEvent } from '../../src/types';

function tasting(overrides: Partial<TastingEvent> = {}): TastingEvent {
  return {
    id: 'ev-1',
    ingredientId: 'brokolice',
    date: '2026-09-10',
    amount: 'ochutnala',
    reaction: 'zadna',
    createdBy: 'uid-rodic',
    createdAt: 1_000,
    ...overrides,
  };
}

function stateWith(tastings: readonly TastingEvent[]): HouseholdState {
  return { ...emptyHouseholdState(), tastings: [...tastings] };
}

describe('smazaná ochutnávka', () => {
  it('zmizí ze seznamu i z ochutnaných surovin', () => {
    const state = stateWith([tasting({ deleted: true })]);
    expect(activeTastings(state)).toEqual([]);
    expect(tastedIds(state).has('brokolice')).toBe(false);
    expect(tastingsByIngredient(state).get('brokolice')).toBeUndefined();
  });

  it('nesmazané záznamy u téže suroviny zůstávají', () => {
    const state = stateWith([
      tasting({ id: 'ev-1', deleted: true }),
      tasting({ id: 'ev-2', createdAt: 2_000 }),
    ]);
    expect(activeTastings(state).map((event) => event.id)).toEqual(['ev-2']);
    expect(tastedIds(state).has('brokolice')).toBe(true);
  });

  it('sloučení ji z druhého zařízení nevzkřísí — smazání je novější zápis', () => {
    const merged = mergeTastings(
      [tasting({ createdAt: 3_000, deleted: true })],
      [tasting({ createdAt: 1_000 })],
    );
    expect(merged).toHaveLength(1);
    expect(merged[0]?.deleted).toBe(true);
    expect(activeTastings(stateWith(merged))).toEqual([]);
  });

  it('pozdější úprava smazání přebije — záznam se dá vrátit novějším zápisem', () => {
    const merged = mergeTastings(
      [tasting({ createdAt: 3_000, deleted: true })],
      [tasting({ createdAt: 4_000, note: 'omylem smazané, vráceno' })],
    );
    expect(merged[0]?.deleted).toBeUndefined();
    expect(activeTastings(stateWith(merged))).toHaveLength(1);
  });
});
