import { describe, expect, it } from 'vitest';
import { EXPOZIC_PRO_ZAVEDENI, sestavVypis } from '../../src/app/lib/denikVypis';
import { odkazNaHlaseni } from '../../src/app/lib/hlaseni';
import { emptyHouseholdState } from '../../src/sync/merge';
import type { Child, HouseholdState, TastingEvent } from '../../src/types';

const DITE = {
  id: 'd1',
  name: 'Ema',
  birthDate: '2026-03-01',
  allergens: [],
} as unknown as Child;

function udalost(
  over: Partial<TastingEvent> & { ingredientId: string; date: string },
): TastingEvent {
  return {
    id: `${over.ingredientId}-${over.date}`,
    childId: 'd1',
    amount: 'ochutnala',
    reaction: 'zadna',
    createdBy: 'u1',
    createdAt: 1,
    ...over,
  } as TastingEvent;
}

function stav(udalosti: TastingEvent[]): HouseholdState {
  return { ...emptyHouseholdState(), tastings: udalosti };
}

/**
 * Výpis pro pediatra je záznam, ne diagnóza.
 *
 * Nic se v něm nevyhodnocuje — jen se seřadí, co rodič sám zapsal. To je
 * pravidlo 6 z CLAUDE.md a na papíře platí dvojnásob, protože papír
 * vypadá odborně.
 */
describe('sestavVypis', () => {
  it('řadí od nejstarší ochutnávky, ne od nejnovější', () => {
    // Deník na obrazovce jde odzadu, protože rodiče zajímá včerejšek.
    // Lékař čte po časové ose od začátku příkrmu.
    const vypis = sestavVypis(
      stav([
        udalost({ ingredientId: 'mrkev', date: '2026-09-10' }),
        udalost({ ingredientId: 'brokolice', date: '2026-08-01' }),
      ]),
      DITE,
    );
    expect(vypis.radky.map((r) => r.datum)).toEqual(['2026-08-01', '2026-09-10']);
    expect(vypis.odKdy).toBe('2026-08-01');
    expect(vypis.doKdy).toBe('2026-09-10');
  });

  it('prázdný deník nespadne a nepředstírá záznamy', () => {
    const vypis = sestavVypis(stav([]), DITE);
    expect(vypis.radky).toEqual([]);
    expect(vypis.odKdy).toBeNull();
    expect(vypis.surovin).toBe(0);
  });

  it('nežádoucí reakce se vytáhnou zvlášť — kvůli nim se k lékaři jde', () => {
    const vypis = sestavVypis(
      stav([
        udalost({ ingredientId: 'mrkev', date: '2026-08-01' }),
        udalost({ ingredientId: 'vejce-slepici', date: '2026-08-02', reaction: 'kozni' }),
      ]),
      DITE,
    );
    expect(vypis.nezadouci).toHaveLength(1);
    // A zůstanou i v hlavní tabulce, ať se dají zasadit do pořadí.
    expect(vypis.radky).toHaveLength(2);
  });

  it('surovina, která v katalogu není, se nezahodí', () => {
    // Záznam mohl vzniknout po přejmenování idčka. Zahodit ho by
    // znamenalo ukázat lékaři neúplný deník.
    const vypis = sestavVypis(
      stav([udalost({ ingredientId: 'neznama-vec', date: '2026-08-01' })]),
      DITE,
    );
    expect(vypis.radky[0]?.surovina).toBe('neznama-vec');
  });

  it('počítá různé suroviny, ne počet zápisů', () => {
    const vypis = sestavVypis(
      stav([
        udalost({ ingredientId: 'mrkev', date: '2026-08-01' }),
        udalost({ ingredientId: 'mrkev', date: '2026-08-05' }),
      ]),
      DITE,
    );
    expect(vypis.radky).toHaveLength(2);
    expect(vypis.surovin).toBe(1);
  });

  it('alergen je zavedený až po třech expozicích bez reakce', () => {
    const vejce = (date: string): TastingEvent => udalost({ ingredientId: 'vejce-slepici', date });
    const dvakrat = sestavVypis(stav([vejce('2026-08-01'), vejce('2026-08-08')]), DITE);
    expect(dvakrat.alergeny.find((a) => a.skupina === 'vejce')?.zavedeny).toBe(false);

    const trikrat = sestavVypis(
      stav([vejce('2026-08-01'), vejce('2026-08-08'), vejce('2026-08-15')]),
      DITE,
    );
    expect(trikrat.alergeny.find((a) => a.skupina === 'vejce')?.zavedeny).toBe(true);
    expect(EXPOZIC_PRO_ZAVEDENI).toBe(3);
  });

  it('expozice s reakcí se do zavedení nepočítá', () => {
    const vejce = (date: string, reaction: TastingEvent['reaction']): TastingEvent =>
      udalost({ ingredientId: 'vejce-slepici', date, reaction });
    const vypis = sestavVypis(
      stav([
        vejce('2026-08-01', 'zadna'),
        vejce('2026-08-08', 'kozni'),
        vejce('2026-08-15', 'zadna'),
      ]),
      DITE,
    );
    const radek = vypis.alergeny.find((a) => a.skupina === 'vejce');
    expect(radek?.expozic).toBe(3);
    expect(radek?.bezReakce).toBe(2);
    expect(radek?.zavedeny).toBe(false);
  });

  it('bez dítěte se v hlavičce nic nevymýšlí', () => {
    const vypis = sestavVypis(stav([]), null);
    expect(vypis.dite).toBe('Dítě');
    expect(vypis.narozeni).toBeNull();
  });
});

describe('odkazNaHlaseni', () => {
  it('vede na issue v repozitáři BLW', () => {
    const url = odkazNaHlaseni({ druh: 'Surovina', nazev: 'Mrkev', id: 'mrkev' });
    expect(url.startsWith('https://github.com/taronwho/BLW/issues/new?')).toBe(true);
  });

  it('název se zakóduje, takže závorky ani ampersand adresu neroztrhnou', () => {
    const url = odkazNaHlaseni({
      druh: 'Recept',
      nazev: 'Kaše (jáhlová) & hruška',
      id: 'kase-jahlova',
    });
    expect(url).not.toContain(' ');
    // Jediný ampersand v adrese je ten, který odděluje title od body.
    expect(url.split('&')).toHaveLength(2);
    expect(decodeURIComponent(url)).toContain('Kaše (jáhlová) & hruška');
  });

  it('v těle je idčko, aby se nález dal najít v datech', () => {
    const url = odkazNaHlaseni({ druh: 'Surovina', nazev: 'Mrkev', id: 'mrkev' });
    expect(decodeURIComponent(url)).toContain('`mrkev`');
  });
});
