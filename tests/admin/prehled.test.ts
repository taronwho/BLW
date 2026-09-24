import { describe, expect, it } from 'vitest';
import {
  platnySouhrn,
  souhrnDomacnosti,
  spocitejPrehled as spocitejZeSouhrnu,
} from '../../src/admin/prehled';
import { emptyHouseholdState } from '../../src/sync/merge';
import type { Child, HouseholdState, TastingEvent } from '../../src/types';

const DEN = 24 * 60 * 60 * 1000;
const TED = Date.parse('2026-09-15T12:00:00Z');

function dite(id: string, birthDate: string): Child {
  return { id, name: 'Jméno, které se do přehledu nedostane', birthDate };
}

function ochutnavka(over: Partial<TastingEvent>): TastingEvent {
  return {
    id: 'ev',
    ingredientId: 'brokolice',
    childId: 'dite-1',
    date: '2026-09-10',
    amount: 'ochutnala',
    reaction: 'zadna',
    createdBy: 'uid',
    createdAt: 1,
    ...over,
  };
}

/** Přehled tak, jak vznikne v provozu: souhrn z každého telefonu, pak součet. */
function spocitejPrehled(stavy: HouseholdState[], ted: number): ReturnType<typeof spocitejZeSouhrnu> {
  return spocitejZeSouhrnu(
    stavy.map((stav) => souhrnDomacnosti(stav, ted)),
    ted,
  );
}

function domacnost(over: Partial<HouseholdState> = {}): HouseholdState {
  return { ...emptyHouseholdState(), ...over };
}

describe('přehled o používání', () => {
  it('sečte domácnosti, zařízení a děti', () => {
    const prehled = spocitejPrehled(
      [
        domacnost({
          members: ['a', 'b'],
          children: { 'dite-1': { hodnota: dite('dite-1', '2026-03-01'), kdy: 1 } },
        }),
        domacnost({ members: ['c'] }),
      ],
      TED,
    );
    expect(prehled.domacnosti).toBe(2);
    expect(prehled.zarizeni).toBe(3);
    expect(prehled.domacnostiSViceZarizenimi).toBe(1);
    expect(prehled.deti).toBe(1);
    expect(prehled.domacnostiBezDitete).toBe(1);
  });

  it('smazané ochutnávky počítá zvlášť, ne mezi živé', () => {
    const prehled = spocitejPrehled(
      [
        domacnost({
          tastings: [
            ochutnavka({ id: '1' }),
            ochutnavka({ id: '2', deleted: true }),
            ochutnavka({ id: '3', ingredientId: 'banan' }),
          ],
        }),
      ],
      TED,
    );
    expect(prehled.ochutnavky).toBe(2);
    expect(prehled.smazaneOchutnavky).toBe(1);
    expect(prehled.aktivniDomacnosti).toBe(1);
  });

  it('nejčastější suroviny seřadí podle počtu', () => {
    const prehled = spocitejPrehled(
      [
        domacnost({
          tastings: [
            ochutnavka({ id: '1', ingredientId: 'banan' }),
            ochutnavka({ id: '2', ingredientId: 'banan' }),
            ochutnavka({ id: '3', ingredientId: 'brokolice' }),
          ],
        }),
      ],
      TED,
    );
    expect(prehled.nejcastejsiSuroviny[0]).toEqual({ id: 'banan', pocet: 2 });
    expect(prehled.nejcastejsiSuroviny[1]).toEqual({ id: 'brokolice', pocet: 1 });
  });

  it('roztřídí děti podle fáze příkrmu', () => {
    const prehled = spocitejPrehled(
      [
        domacnost({
          children: {
            a: { hodnota: dite('a', '2026-08-01'), kdy: 1 },
            b: { hodnota: dite('b', '2026-01-01'), kdy: 1 },
            c: { hodnota: dite('c', '2023-01-01'), kdy: 1 },
          },
        }),
      ],
      TED,
    );
    expect(prehled.detiPodleFaze['do 6 měsíců']).toBe(1);
    expect(prehled.detiPodleFaze['6 až 9 měsíců']).toBe(1);
    expect(prehled.detiPodleFaze['nad 2 roky']).toBe(1);
  });

  it('aktivitu počítá z posledního připojení zařízení', () => {
    const prehled = spocitejPrehled(
      [
        domacnost({ members: ['a'], memberSeenAt: { a: TED - 2 * DEN } }),
        domacnost({ members: ['b'], memberSeenAt: { b: TED - 20 * DEN } }),
        domacnost({ members: ['c'], memberSeenAt: { c: TED - 200 * DEN } }),
      ],
      TED,
    );
    expect(prehled.aktivniZa7Dni).toBe(1);
    expect(prehled.aktivniZa30Dni).toBe(2);
  });

  it('roztřídí zařízení podle toho, jak se hlásí', () => {
    const prehled = spocitejPrehled(
      [
        domacnost({
          members: ['a', 'b', 'c'],
          memberLabels: { a: 'Nainstalovaná aplikace', b: 'Prohlížeč v Messengeru' },
        }),
      ],
      TED,
    );
    expect(prehled.zarizeniPodleTypu['Nainstalovaná aplikace']).toBe(1);
    expect(prehled.zarizeniPodleTypu['Prohlížeč v Messengeru']).toBe(1);
    expect(prehled.zarizeniPodleTypu['neznámé']).toBe(1);
  });

  it('z prázdného seznamu nespadne', () => {
    const prehled = spocitejPrehled([], TED);
    expect(prehled.domacnosti).toBe(0);
    expect(prehled.nejcastejsiSuroviny).toEqual([]);
  });

  it('nepouští ven nic osobního: jen čísla a názvy kategorií', () => {
    const prehled = spocitejPrehled(
      [
        domacnost({
          members: ['a'],
          children: { 'dite-1': { hodnota: dite('dite-1', '2026-03-01'), kdy: 1 } },
          tastings: [ochutnavka({ note: 'Tajná poznámka rodiče' })],
          recipeNotes: { r1: { hodnota: 'Další tajná poznámka', kdy: 1 } },
        }),
      ],
      TED,
    );
    const serializovano = JSON.stringify(prehled);
    expect(serializovano).not.toContain('Tajná');
    expect(serializovano).not.toContain('Jméno');
    expect(serializovano).not.toContain('dite-1');
  });

  it('souhrn jedné domácnosti nenese nic, co napsal člověk', () => {
    const souhrn = souhrnDomacnosti(
      domacnost({
        members: ['uid-tajne-zarizeni'],
        memberLabels: { 'uid-tajne-zarizeni': 'Telefon Jany Novákové' },
        memberSeenAt: { 'uid-tajne-zarizeni': TED - 3 * 60 * 60 * 1000 },
        children: { 'dite-1': { hodnota: dite('dite-1', '2026-03-01'), kdy: 1 } },
        tastings: [
          ochutnavka({ note: 'Tajná poznámka rodiče' }),
          ochutnavka({ id: '2', ingredientId: 'Jméno v id suroviny' }),
        ],
        recipeNotes: { r1: { hodnota: 'Další tajná poznámka', kdy: 1 } },
      }),
      TED,
    );
    const text = JSON.stringify(souhrn);
    for (const zakazane of ['Tajná', 'Jméno', 'Jany', 'dite-1', 'uid-tajne', '2026-03-01']) {
      expect(text, zakazane).not.toContain(zakazane);
    }
    expect(souhrn.zarizeniPodleTypu).toEqual({ jiné: 1 });
    expect(souhrn.suroviny).toEqual({ brokolice: 1 });
    // Čas posledního připojení jen na den přesně.
    expect(souhrn.naposledy % DEN).toBe(0);
  });

  it('souhrn ze serveru s cizími klíči nebo nesmysly se ořízne nebo zahodí', () => {
    const platny = souhrnDomacnosti(domacnost({ members: ['a'] }), TED);
    expect(platnySouhrn(platny)).toEqual(platny);
    expect(platnySouhrn({ ...platny, ochutnavky: -1 })).toBeNull();
    expect(platnySouhrn({ ...platny, deti: 'hodně' })).toBeNull();
    expect(platnySouhrn(null)).toBeNull();
    const oriznuty = platnySouhrn({
      ...platny,
      zarizeniPodleTypu: { 'Telefon Jany': 1, Chrome: 2 },
      detiPodleFaze: { 'Anička, 4 měsíce': 1 },
      suroviny: { 'Poznámka s mezerou': 3, banan: 2 },
    });
    expect(oriznuty?.zarizeniPodleTypu).toEqual({ Chrome: 2 });
    expect(oriznuty?.detiPodleFaze).toEqual({});
    expect(oriznuty?.suroviny).toEqual({ banan: 2 });
  });
});
