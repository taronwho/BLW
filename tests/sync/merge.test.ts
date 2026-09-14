import { describe, expect, it } from 'vitest';
import {
  MAX_MEMBERS,
  activeChildren,
  emptyHouseholdState,
  mergeHouseholdState,
  mergeTastings,
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

    const merged = mergeHouseholdState(local, remote);

    expect(merged.tastings.map((e) => e.id).sort()).toEqual(['lokalni', 'vzdaleny']);
  });

  it('u dítěte vyhraje pozdější zápis, ne pozdější dokument', () => {
    // Dřív rozhodoval čas celého dokumentu, takže nesouvisející změna
    // z druhého telefonu mohla přebít úpravu jména. Teď má značku času
    // každé dítě zvlášť.
    const dite = { id: 'dite-1', birthDate: '2026-03-01' };
    const local = state({
      children: { 'dite-1': { hodnota: { ...dite, name: 'Lokální jméno' }, kdy: 20 } },
    });
    const remote = state({
      children: { 'dite-1': { hodnota: { ...dite, name: 'Vzdálené jméno' }, kdy: 10 } },
    });

    expect(mergeHouseholdState(local, remote).children['dite-1']?.hodnota?.name).toBe(
      'Lokální jméno',
    );
    expect(mergeHouseholdState(remote, local).children['dite-1']?.hodnota?.name).toBe(
      'Lokální jméno',
    );
  });

  it('smazané dítě se z druhého telefonu nevrátí', () => {
    const dite = { id: 'dite-1', name: 'Anna', birthDate: '2026-03-01' };
    const smazal = state({ children: { 'dite-1': { hodnota: null, kdy: 20 } } });
    const stary = state({ children: { 'dite-1': { hodnota: dite, kdy: 10 } } });

    expect(mergeHouseholdState(smazal, stary).children['dite-1']?.hodnota).toBeNull();
    expect(mergeHouseholdState(stary, smazal).children['dite-1']?.hodnota).toBeNull();
  });

  it('dvě děti přidané offline na různých telefonech zůstanou obě', () => {
    const a = state({
      children: { a: { hodnota: { id: 'a', name: 'Anna', birthDate: '2026-01-01' }, kdy: 10 } },
    });
    const b = state({
      children: { b: { hodnota: { id: 'b', name: 'Bruno', birthDate: '2024-05-05' }, kdy: 10 } },
    });
    expect(activeChildren(mergeHouseholdState(a, b)).map((dite) => dite.name)).toEqual([
      'Bruno',
      'Anna',
    ]);
  });

  it('členy sjednotí bez duplicit', () => {
    const merged = mergeHouseholdState(
      state({ members: ['uid-matka'] }),
      state({ members: ['uid-matka', 'uid-otec'] }),
    );
    expect(merged.members).toEqual(['uid-matka', 'uid-otec']);
  });

  it('nikdy nepřekročí maximální počet členů domácnosti', () => {
    const many = Array.from({ length: 8 }, (_, i) => `uid-${i}`);
    const merged = mergeHouseholdState(state({ members: many }), state());
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

    const merged = mergeHouseholdState(local, remote);

    expect(merged.recipeNotes['placky']?.hodnota).toBe('vzdálená');
    expect(merged.recipeNotes['kase']?.hodnota).toBe('jen lokální');
  });

  it('smazaná poznámka se z druhého telefonu nevrátí', () => {
    // Rodič poznámku smaže (uloží prázdný text), druhý telefon o tom ještě
    // neví a drží starou. Dřív se stará vracela, protože se mapy jen slévaly.
    const smazal = state({ recipeNotes: { placky: { hodnota: '', kdy: 20 } } });
    const stary = state({ recipeNotes: { placky: { hodnota: 'stará poznámka', kdy: 10 } } });

    const zPohleduMazajiciho = mergeHouseholdState(smazal, stary);
    const zPohleduDruheho = mergeHouseholdState(stary, smazal);

    expect(zPohleduMazajiciho.recipeNotes['placky']?.hodnota).toBe('');
    expect(zPohleduDruheho.recipeNotes['placky']?.hodnota).toBe('');
  });

  it('odebraná oblíbená položka se z druhého telefonu nevrátí', () => {
    // Nejvíc viditelná vada starého slučování: hvězdička se po odebrání
    // sama rozsvítila zpátky, jakmile druhý telefon cokoli uložil.
    const odebral = state({ favorites: { brokolice: { hodnota: false, kdy: 20 } } });
    const stary = state({ favorites: { brokolice: { hodnota: true, kdy: 10 } } });

    expect(
      mergeHouseholdState(odebral, stary).favorites[
        'brokolice'
      ]?.hodnota,
    ).toBe(false);
    expect(
      mergeHouseholdState(stary, odebral).favorites[
        'brokolice'
      ]?.hodnota,
    ).toBe(false);
  });

  it('novější přidání zpátky nad odebráním vyhraje', () => {
    const znovuPridal = state({ favorites: { brokolice: { hodnota: true, kdy: 30 } } });
    const odebral = state({ favorites: { brokolice: { hodnota: false, kdy: 20 } } });
    expect(
      mergeHouseholdState(znovuPridal, odebral)
        .favorites['brokolice']?.hodnota,
    ).toBe(true);
  });
});

describe('úchop a znaky připravenosti při slučování', () => {
  const zaklad = { id: 'dite-1', name: 'Anna', birthDate: '2026-03-01' };

  it('u úchopu vyhrává pozdější zápis, protože jde i zrušit', () => {
    const local = state({
      children: { 'dite-1': { hodnota: { ...zaklad, grip: 'pinzetovy' }, kdy: 20 } },
    });
    const remote = state({
      children: { 'dite-1': { hodnota: { ...zaklad, grip: 'dlanovy' }, kdy: 10 } },
    });
    expect(mergeHouseholdState(local, remote).children['dite-1']?.hodnota?.grip).toBe('pinzetovy');
    expect(mergeHouseholdState(remote, local).children['dite-1']?.hodnota?.grip).toBe('pinzetovy');
  });

  it('u znaků připravenosti vyhrává pozdější zápis, aby šel znak i odškrtnout zpět', () => {
    const local = state({
      children: {
        'dite-1': { hodnota: { ...zaklad, readySigns: ['sed' as const] }, kdy: 20 },
      },
    });
    const remote = state({
      children: {
        'dite-1': {
          hodnota: { ...zaklad, readySigns: ['sed' as const, 'koordinace' as const] },
          kdy: 10,
        },
      },
    });
    expect(mergeHouseholdState(local, remote).children['dite-1']?.hodnota?.readySigns).toEqual([
      'sed',
    ]);
  });

  it('prázdná domácnost zůstane prázdná, žádné prázdné klíče', () => {
    const merged = mergeHouseholdState(emptyHouseholdState(), emptyHouseholdState());
    expect(merged.children).toEqual({});
    expect(activeChildren(merged)).toEqual([]);
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
    const merged = mergeHouseholdState(local, remote);
    expect(merged.memberSeenAt).toEqual({ a: 500, b: 900 });
  });

  it('zná-li čas jen jedna strana, převezme se', () => {
    const local: HouseholdState = { ...emptyHouseholdState(), memberSeenAt: { a: 5 } };
    const merged = mergeHouseholdState(local, emptyHouseholdState());
    expect(merged.memberSeenAt).toEqual({ a: 5 });
  });

  it('bez časů nezůstane v poli prázdný klíč', () => {
    const merged = mergeHouseholdState(emptyHouseholdState(), emptyHouseholdState());
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
      const merged = mergeHouseholdState(local, remote);
      expect(merged.tastings.length).toBeGreaterThanOrEqual(local.tastings.length);
      expect(merged.tastings.length).toBeGreaterThanOrEqual(remote.tastings.length);
    }
  });
});
