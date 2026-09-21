import { describe, expect, it } from 'vitest';
import {
  VOLBY_DOSPELYCH,
  ZAKLAD_DOSPELYCH,
  nasobekProDospele,
  popisNasobku,
  vynasobSoucet,
} from '../../src/nakup/porce';
import { sestavNakupniSeznam } from '../../src/nakup/seznam';
import { emptyHouseholdState } from '../../src/sync/merge';
import type { HouseholdState, NakupPolozka } from '../../src/types';

function stav(nakup: Record<string, NakupPolozka>, dospelych?: number): HouseholdState {
  return {
    ...emptyHouseholdState(),
    ...(dospelych === undefined ? {} : { nakupDospelych: { hodnota: dospelych, kdy: 1 } }),
    nakup: Object.fromEntries(
      Object.entries(nakup).map(([id, hodnota]) => [id, { hodnota, kdy: 1 }]),
    ),
  };
}

/**
 * Kuchařka je psaná na dva dospělé a jedno dítě — všech 494 receptů.
 * Kdo vaří pro pět, si to dosud musel přepočítat sám (audit 17. 9. 2026,
 * kapitola 10 bod 2).
 */
describe('nasobekProDospele', () => {
  it('základní počet nechá množství, jak je v receptu', () => {
    expect(nasobekProDospele(ZAKLAD_DOSPELYCH)).toBe(1);
  });

  it('dvojnásobek lidí je dvojnásobek surovin', () => {
    expect(nasobekProDospele(4)).toBe(2);
    expect(nasobekProDospele(3)).toBe(1.5);
  });

  it('nesmysl znamená „jako v kuchařce", ne odhad', () => {
    // Podle čísla v seznamu rodič opravdu nakoupí. Raději nepřepočítat.
    for (const vstup of [undefined, 0, -3, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(nasobekProDospele(vstup), String(vstup)).toBe(1);
    }
  });

  it('nabízené volby dávají rozumné násobky', () => {
    expect(VOLBY_DOSPELYCH).toContain(ZAKLAD_DOSPELYCH);
    for (const pocet of VOLBY_DOSPELYCH) {
      expect(nasobekProDospele(pocet), String(pocet)).toBeGreaterThanOrEqual(1);
    }
  });
});

describe('vynasobSoucet', () => {
  it('gramy zaokrouhluje na celé', () => {
    const soucet = { mnozstvi: [{ jednotka: 'g', hodnota: 150 }], zbytek: [] };
    expect(vynasobSoucet(soucet, 1.5).mnozstvi[0]?.hodnota).toBe(225);
    expect(vynasobSoucet({ mnozstvi: [{ jednotka: 'g', hodnota: 100 }], zbytek: [] }, 1.5)
      .mnozstvi[0]?.hodnota).toBe(150);
  });

  it('kusy a lžíce na půlky — „1,33 stroužku" je hádanka', () => {
    const soucet = { mnozstvi: [{ jednotka: 'strouzek', hodnota: 1 }], zbytek: [] };
    expect(vynasobSoucet(soucet, 1.5).mnozstvi[0]?.hodnota).toBe(1.5);
    expect(vynasobSoucet(soucet, 1.25).mnozstvi[0]?.hodnota).toBe(1.5);
  });

  it('co se rozebrat nedalo, zůstává beze změny', () => {
    // Násobit slovo nejde a vymyšlené číslo je horší než žádné.
    const soucet = { mnozstvi: [], zbytek: ['na pánev', 'podle chuti'] };
    expect(vynasobSoucet(soucet, 3).zbytek).toEqual(['na pánev', 'podle chuti']);
  });

  it('násobek jedna nemění vůbec nic', () => {
    const soucet = { mnozstvi: [{ jednotka: 'g', hodnota: 133 }], zbytek: ['špetka'] };
    expect(vynasobSoucet(soucet, 1)).toBe(soucet);
  });
});

describe('popisNasobku', () => {
  it('píše se desetinnou čárkou, ne tečkou', () => {
    expect(popisNasobku(1.5)).toBe('1,5×');
    expect(popisNasobku(2)).toBe('2×');
  });
});

describe('přepočet v sestaveném seznamu', () => {
  const zReceptu = { davky: [{ recipeId: 'polevka', mnozstvi: '150 g' }], koupeno: false };

  it('bez nastavení se nepřepočítává', () => {
    expect(sestavNakupniSeznam(stav({ mrkev: zReceptu }))[0]?.popis).toBe('150 g');
  });

  it('čtyři dospělí znamenají dvojnásobek', () => {
    expect(sestavNakupniSeznam(stav({ mrkev: zReceptu }, 4))[0]?.popis).toBe('300 g');
  });

  it('ručně přidané množství se nepřepočítává', () => {
    // Rodič ho napsal pro svou domácnost. Přepočítat mu ho by bylo drzé.
    const rucni = { davky: [{ mnozstvi: '2 kusy' }], koupeno: false };
    expect(sestavNakupniSeznam(stav({ mrkev: rucni }, 6))[0]?.popis).toBe('2 kusy');
  });

  it('v jedné položce se sečte přepočítaný recept i neměněná ruční dávka', () => {
    const obojí = {
      davky: [{ recipeId: 'polevka', mnozstvi: '100 g' }, { mnozstvi: '50 g' }],
      koupeno: false,
    };
    // 100 × 2 z receptu + 50 ručně.
    expect(sestavNakupniSeznam(stav({ mrkev: obojí }, 4))[0]?.popis).toBe('250 g');
  });

  it('přepsané množství vyhraje i nad přepočtem', () => {
    const prepsane = { ...zReceptu, rucniMnozstvi: '1 kg' };
    expect(sestavNakupniSeznam(stav({ mrkev: prepsane }, 6))[0]?.popis).toBe('1 kg');
  });
});
