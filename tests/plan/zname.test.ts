import { describe, expect, it } from 'vitest';
import { ZNAMYCH_NA_TALIR, znameNaTalir } from '../../src/app/lib/plan';
import { emptyHouseholdState } from '../../src/sync/merge';
import type { HouseholdState, Plan, PlanDen, TastingEvent } from '../../src/types';

function den(cislo: number, novinka?: string): PlanDen {
  return { cislo, ...(novinka === undefined ? {} : { novinka }), jidla: [] };
}

function plan(over: Partial<Plan> = {}): Plan {
  return {
    childId: 'dite-1',
    blok: 2,
    vytvoreno: '2026-09-01',
    dny: [den(1, 'cocka-hneda'), den(2, 'candat'), den(3, 'kruti-stehno')],
    stavy: {},
    ...over,
  };
}

function ochutnavka(over: Partial<TastingEvent>): TastingEvent {
  return {
    id: 'ev',
    ingredientId: 'brokolice',
    childId: 'dite-1',
    date: '2026-08-01',
    amount: 'ochutnala',
    reaction: 'zadna',
    createdBy: 'uid',
    createdAt: 1,
    ...over,
  };
}

function domacnost(over: Partial<HouseholdState> = {}): HouseholdState {
  return { ...emptyHouseholdState(), ...over };
}

describe('známé suroviny na talíř', () => {
  it('nabídne i suroviny z předchozího bloku, ne jen z toho probíhajícího', () => {
    const p = plan({ zname: ['brokolice', 'batat', 'avokado'] });
    const zname = znameNaTalir(p, den(3, 'kruti-stehno'), domacnost(), 'dite-1');
    const ids = zname.map((item) => item.id);

    expect(ids).toContain('cocka-hneda');
    expect(ids).toContain('candat');
    expect(ids).toContain('brokolice');
    expect(ids).toContain('batat');
  });

  it('dnešní novinku mezi známé nepočítá', () => {
    const p = plan({ zname: ['kruti-stehno'] });
    const ids = znameNaTalir(p, den(3, 'kruti-stehno'), domacnost(), 'dite-1').map((i) => i.id);
    expect(ids).not.toContain('kruti-stehno');
  });

  it('řadí od nejčerstvějšího a drží se nastaveného počtu', () => {
    const p = plan({
      dny: [
        den(1, 'brokolice'),
        den(2, 'batat'),
        den(3, 'avokado'),
        den(4, 'mrkev'),
        den(5, 'hruska'),
        den(6, 'banan'),
        den(7, 'cuketa'),
        den(8, 'kruti-stehno'),
      ],
      zname: ['jablko'],
    });
    const ids = znameNaTalir(p, den(8, 'kruti-stehno'), domacnost(), 'dite-1').map((i) => i.id);

    expect(ids).toHaveLength(ZNAMYCH_NA_TALIR);
    expect(ids[0]).toBe('cuketa');
    expect(ids).not.toContain('jablko');
  });

  it('surovinu po nežádoucí reakci znovu nenabízí', () => {
    const p = plan({ dny: [den(1, 'kruti-stehno')] });
    const state = domacnost({
      tastings: [
        ochutnavka({ id: '1', ingredientId: 'vejce-slepici', reaction: 'kozni' }),
        ochutnavka({ id: '2', ingredientId: 'brokolice' }),
      ],
    });
    const ids = znameNaTalir(p, den(1, 'kruti-stehno'), state, 'dite-1').map((i) => i.id);

    expect(ids).toContain('brokolice');
    expect(ids).not.toContain('vejce-slepici');
  });

  it('surovinu s reakcí nevrátí ani přes seznam známých, ani přes novinku z dřívějška', () => {
    // Kontrola aplikace 24. 9. 2026: filtr platil jen pro deník, takže se
    // vejce s kožní reakcí na talíř vrátilo přes plán.
    const p = plan({
      dny: [den(1, 'vejce-slepici'), den(2, 'kruti-stehno')],
      zname: ['vejce-slepici', 'brokolice'],
    });
    const state = domacnost({
      tastings: [ochutnavka({ id: '1', ingredientId: 'vejce-slepici', reaction: 'kozni' })],
    });
    const ids = znameNaTalir(p, den(2, 'kruti-stehno'), state, 'dite-1').map((i) => i.id);

    expect(ids).toContain('brokolice');
    expect(ids).not.toContain('vejce-slepici');
  });

  it('surovinu, kterou rodič z plánu vyřadil, nenabízí', () => {
    const p = plan({ dny: [den(1, 'kruti-stehno')], zname: ['kiwi', 'brokolice'] });
    const ids = znameNaTalir(p, den(1, 'kruti-stehno'), domacnost(), 'dite-1', [], ['kiwi']).map(
      (i) => i.id,
    );

    expect(ids).toContain('brokolice');
    expect(ids).not.toContain('kiwi');
  });

  it('po nové ochutnávce bez reakce surovinu zase nabízí', () => {
    const p = plan({ dny: [den(1, 'kruti-stehno')] });
    const state = domacnost({
      tastings: [
        ochutnavka({ id: '1', ingredientId: 'vejce-slepici', reaction: 'kozni', date: '2026-08-01' }),
        ochutnavka({ id: '2', ingredientId: 'vejce-slepici', reaction: 'zadna', date: '2026-09-10' }),
      ],
    });
    const ids = znameNaTalir(p, den(1, 'kruti-stehno'), state, 'dite-1').map((i) => i.id);

    expect(ids).toContain('vejce-slepici');
  });

  it('vynechá suroviny, které dítě podle profilu nesmí', () => {
    const p = plan({ dny: [den(1, 'kruti-stehno')], zname: ['jogurt-bily-plnotucny', 'brokolice'] });
    const ids = znameNaTalir(p, den(1, 'kruti-stehno'), domacnost(), 'dite-1', ['mleko']).map(
      (i) => i.id,
    );

    expect(ids).toContain('brokolice');
    expect(ids).not.toContain('jogurt-bily-plnotucny');
  });
});
