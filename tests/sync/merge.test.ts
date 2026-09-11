import { describe, expect, it } from 'vitest';
import {
  emptyHouseholdState,
  mergeHouseholdState,
  mergeTastings,
  MAX_MEMBERS,
} from '../../src/sync/merge';
import type { HouseholdState, TastingEvent } from '../../src/types';

function tasting(overrides: Partial<TastingEvent> = {}): TastingEvent {
  return {
    id: 'ev-1',
    ingredientId: 'brokolice',
    date: '2026-09-10',
    amount: 'ochutnala',
    reaction: 'zadna',
    createdBy: 'uid-matka',
    createdAt: 1_000,
    ...overrides,
  };
}

function state(overrides: Partial<HouseholdState> = {}): HouseholdState {
  return { ...emptyHouseholdState(), ...overrides };
}

describe('mergeTastings — append-only', () => {
  it('spojí záznamy z obou zařízení a žádný nezahodí', () => {
    const local = [tasting({ id: 'ev-telefon-matky' })];
    const remote = [tasting({ id: 'ev-telefon-otce', createdBy: 'uid-otec' })];

    const merged = mergeTastings(local, remote);

    expect(merged).toHaveLength(2);
    expect(merged.map((e) => e.id).sort()).toEqual(['ev-telefon-matky', 'ev-telefon-otce']);
  });

  it('kolize dvou zařízení u téže suroviny ve stejný den neztratí ani jeden záznam', () => {
    const den = '2026-09-11';
    const local = [tasting({ id: 'a', date: den, createdAt: 5 })];
    const remote = [tasting({ id: 'b', date: den, createdAt: 5, createdBy: 'uid-otec' })];

    const merged = mergeTastings(local, remote);

    expect(merged).toHaveLength(2);
    expect(new Set(merged.map((e) => e.createdBy))).toEqual(new Set(['uid-matka', 'uid-otec']));
  });

  it('u téhož id vyhraje novější zápis, takže se dodatečná reakce neztratí', () => {
    const local = [tasting({ id: 'ev-1', reaction: 'kozni', createdAt: 2_000 })];
    const remote = [tasting({ id: 'ev-1', reaction: 'zadna', createdAt: 1_000 })];

    const merged = mergeTastings(local, remote);

    expect(merged).toHaveLength(1);
    expect(merged[0]?.reaction).toBe('kozni');
  });

  it('slučování je idempotentní — druhý průchod nic nepřidá', () => {
    const local = [tasting({ id: 'a' }), tasting({ id: 'b' })];
    const once = mergeTastings(local, []);
    const twice = mergeTastings(once, local);
    expect(twice).toEqual(once);
  });

  it('slučování nezávisí na pořadí zařízení', () => {
    const a = [tasting({ id: 'a', createdAt: 1 })];
    const b = [tasting({ id: 'b', createdAt: 2 })];
    expect(mergeTastings(a, b)).toEqual(mergeTastings(b, a));
  });

  it('řadí podle data, aby deník šel rovnou vykreslit', () => {
    const merged = mergeTastings(
      [tasting({ id: 'pozdejsi', date: '2026-09-12' })],
      [tasting({ id: 'drivejsi', date: '2026-09-01' })],
    );
    expect(merged.map((e) => e.id)).toEqual(['drivejsi', 'pozdejsi']);
  });
});

describe('mergeHouseholdState', () => {
  it('ochutnávky spojí i tehdy, když je vzdálený stav novější', () => {
    const local = state({ tastings: [tasting({ id: 'lokalni' })] });
    const remote = state({ tastings: [tasting({ id: 'vzdaleny' })] });

    const merged = mergeHouseholdState(local, remote, {
      localUpdatedAt: 1,
      remoteUpdatedAt: 100,
    });

    expect(merged.tastings.map((e) => e.id).sort()).toEqual(['lokalni', 'vzdaleny']);
  });

  it('u ostatních polí platí last-write-wins', () => {
    const local = state({ childName: 'Lokální jméno' });
    const remote = state({ childName: 'Vzdálené jméno' });

    expect(
      mergeHouseholdState(local, remote, { localUpdatedAt: 200, remoteUpdatedAt: 100 }).childName,
    ).toBe('Lokální jméno');
    expect(
      mergeHouseholdState(local, remote, { localUpdatedAt: 100, remoteUpdatedAt: 200 }).childName,
    ).toBe('Vzdálené jméno');
  });

  it('členy sjednotí bez duplicit', () => {
    const merged = mergeHouseholdState(
      state({ members: ['uid-matka'] }),
      state({ members: ['uid-matka', 'uid-otec'] }),
      { localUpdatedAt: 1, remoteUpdatedAt: 2 },
    );
    expect(merged.members).toEqual(['uid-matka', 'uid-otec']);
  });

  it('nikdy nepřekročí maximální počet členů domácnosti', () => {
    const many = Array.from({ length: 8 }, (_, i) => `uid-${i}`);
    const merged = mergeHouseholdState(state({ members: many }), state(), {
      localUpdatedAt: 2,
      remoteUpdatedAt: 1,
    });
    expect(merged.members).toHaveLength(MAX_MEMBERS);
  });

  it('poznámky k receptům slučuje, kolizní klíč bere z novějšího stavu', () => {
    const local = state({ recipeNotes: { placky: 'lokální', kase: 'jen lokální' } });
    const remote = state({ recipeNotes: { placky: 'vzdálená' } });

    const merged = mergeHouseholdState(local, remote, {
      localUpdatedAt: 1,
      remoteUpdatedAt: 2,
    });

    expect(merged.recipeNotes['placky']).toBe('vzdálená');
    expect(merged.recipeNotes['kase']).toBe('jen lokální');
  });
});
