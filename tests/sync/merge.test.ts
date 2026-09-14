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

  it('poznámky k receptům slučuje, kolizní klíč bere z pozdějšího zápisu', () => {
    const local = state({
      recipeNotes: {
        placky: { hodnota: 'lokální', kdy: 10 },
        kase: { hodnota: 'jen lokální', kdy: 10 },
      },
    });
    const remote = state({ recipeNotes: { placky: { hodnota: 'vzdálená', kdy: 20 } } });

    const merged = mergeHouseholdState(local, remote, {
      localUpdatedAt: 1,
      remoteUpdatedAt: 2,
    });

    expect(merged.recipeNotes['placky']?.hodnota).toBe('vzdálená');
    expect(merged.recipeNotes['kase']?.hodnota).toBe('jen lokální');
  });

  it('smazaná poznámka se z druhého telefonu nevrátí', () => {
    // Rodič poznámku smaže (uloží prázdný text), druhý telefon o tom ještě
    // neví a drží starou. Dřív se stará vracela, protože se mapy jen slévaly.
    const smazal = state({ recipeNotes: { placky: { hodnota: '', kdy: 20 } } });
    const stary = state({ recipeNotes: { placky: { hodnota: 'stará poznámka', kdy: 10 } } });

    const zPohleduMazajiciho = mergeHouseholdState(smazal, stary, {
      localUpdatedAt: 2,
      remoteUpdatedAt: 1,
    });
    const zPohleduDruheho = mergeHouseholdState(stary, smazal, {
      localUpdatedAt: 3,
      remoteUpdatedAt: 2,
    });

    expect(zPohleduMazajiciho.recipeNotes['placky']?.hodnota).toBe('');
    expect(zPohleduDruheho.recipeNotes['placky']?.hodnota).toBe('');
  });

  it('odebraná oblíbená položka se z druhého telefonu nevrátí', () => {
    // Nejvíc viditelná vada starého slučování: hvězdička se po odebrání
    // sama rozsvítila zpátky, jakmile druhý telefon cokoli uložil.
    const odebral = state({ favorites: { brokolice: { hodnota: false, kdy: 20 } } });
    const stary = state({ favorites: { brokolice: { hodnota: true, kdy: 10 } } });

    expect(
      mergeHouseholdState(odebral, stary, { localUpdatedAt: 2, remoteUpdatedAt: 1 }).favorites[
        'brokolice'
      ]?.hodnota,
    ).toBe(false);
    expect(
      mergeHouseholdState(stary, odebral, { localUpdatedAt: 3, remoteUpdatedAt: 2 }).favorites[
        'brokolice'
      ]?.hodnota,
    ).toBe(false);
  });

  it('novější přidání zpátky nad odebráním vyhraje', () => {
    const znovuPridal = state({ favorites: { brokolice: { hodnota: true, kdy: 30 } } });
    const odebral = state({ favorites: { brokolice: { hodnota: false, kdy: 20 } } });
    expect(
      mergeHouseholdState(znovuPridal, odebral, { localUpdatedAt: 3, remoteUpdatedAt: 2 })
        .favorites['brokolice']?.hodnota,
    ).toBe(true);
  });
});

describe('úchop dítěte při slučování', () => {
  it('vyhrává novější zápis, stejně jako ostatní údaje o dítěti', () => {
    const local: HouseholdState = { ...emptyHouseholdState(), childGrip: 'pinzetovy' };
    const remote: HouseholdState = { ...emptyHouseholdState(), childGrip: 'dlanovy' };
    expect(
      mergeHouseholdState(local, remote, { localUpdatedAt: 2, remoteUpdatedAt: 1 }).childGrip,
    ).toBe('pinzetovy');
    expect(
      mergeHouseholdState(local, remote, { localUpdatedAt: 1, remoteUpdatedAt: 2 }).childGrip,
    ).toBe('dlanovy');
  });

  it('nevyplněný úchop v poli nenechá prázdný klíč', () => {
    const merged = mergeHouseholdState(emptyHouseholdState(), emptyHouseholdState(), {
      localUpdatedAt: 1,
      remoteUpdatedAt: 2,
    });
    expect('childGrip' in merged).toBe(false);
  });
});

describe('znaky připravenosti při slučování', () => {
  it('vyhrává novější zápis, aby šlo znak i odškrtnout zpět', () => {
    const local: HouseholdState = { ...emptyHouseholdState(), readySigns: ['sed'] };
    const remote: HouseholdState = {
      ...emptyHouseholdState(),
      readySigns: ['sed', 'koordinace', 'reflex'],
    };
    expect(
      mergeHouseholdState(local, remote, { localUpdatedAt: 2, remoteUpdatedAt: 1 }).readySigns,
    ).toEqual(['sed']);
    expect(
      mergeHouseholdState(local, remote, { localUpdatedAt: 1, remoteUpdatedAt: 2 }).readySigns,
    ).toEqual(['sed', 'koordinace', 'reflex']);
  });

  it('nevyplněné znaky v poli nenechají prázdný klíč', () => {
    const merged = mergeHouseholdState(emptyHouseholdState(), emptyHouseholdState(), {
      localUpdatedAt: 1,
      remoteUpdatedAt: 2,
    });
    expect('readySigns' in merged).toBe(false);
  });
});

describe('poslední přihlášení zařízení', () => {
  it('mapy se sjednotí a u každého uid vyhraje pozdější čas', () => {
    // Každý telefon ví jistě jen o sobě. Kdyby se mapa brala jako celek
    // last-write-wins, zápis z jednoho by smazal, co o sobě zapsal druhý.
    const local: HouseholdState = {
      ...emptyHouseholdState(),
      members: ['a', 'b'],
      memberSeenAt: { a: 500, b: 100 },
    };
    const remote: HouseholdState = {
      ...emptyHouseholdState(),
      members: ['a', 'b'],
      memberSeenAt: { a: 200, b: 900 },
    };
    const merged = mergeHouseholdState(local, remote, { localUpdatedAt: 1, remoteUpdatedAt: 2 });
    expect(merged.memberSeenAt).toEqual({ a: 500, b: 900 });
  });

  it('zná-li čas jen jedna strana, převezme se', () => {
    const local: HouseholdState = { ...emptyHouseholdState(), memberSeenAt: { a: 5 } };
    const merged = mergeHouseholdState(local, emptyHouseholdState(), {
      localUpdatedAt: 1,
      remoteUpdatedAt: 2,
    });
    expect(merged.memberSeenAt).toEqual({ a: 5 });
  });

  it('bez časů nezůstane v poli prázdný klíč', () => {
    const merged = mergeHouseholdState(emptyHouseholdState(), emptyHouseholdState(), {
      localUpdatedAt: 1,
      remoteUpdatedAt: 2,
    });
    expect('memberSeenAt' in merged).toBe(false);
  });
});

describe('předpoklad, na kterém stojí pravidla Firestore', () => {
  it('sloučení nikdy nezkrátí seznam ochutnávek', () => {
    // Pravidlo `nemazeDenik()` ve firestore.rules zakazuje připojujícímu se
    // telefonu zkrátit pole ochutnávek. Drží to jen proto, že sloučení umí
    // záznamy výhradně přidávat — mazání je náhrobek, ne odstranění.
    const a = state({
      tastings: [
        tasting({ id: 'ev-1' }),
        tasting({ id: 'ev-2', deleted: true }),
      ],
    });
    const b = state({ tastings: [tasting({ id: 'ev-3' })] });

    for (const [local, remote] of [
      [a, b],
      [b, a],
    ] as const) {
      const merged = mergeHouseholdState(local, remote, {
        localUpdatedAt: 2,
        remoteUpdatedAt: 1,
      });
      expect(merged.tastings.length).toBeGreaterThanOrEqual(local.tastings.length);
      expect(merged.tastings.length).toBeGreaterThanOrEqual(remote.tastings.length);
    }
  });
});
