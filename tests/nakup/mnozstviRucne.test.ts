import { describe, expect, it } from 'vitest';
import { sestavNakupniSeznam, vychoziMnozstvi } from '../../src/nakup/seznam';
import { rozeberMnozstvi } from '../../src/nakup/mnozstvi';
import { emptyHouseholdState } from '../../src/sync/merge';
import { ingredients, recipes } from '../../src/data';
import type { HouseholdState, NakupPolozka } from '../../src/types';

function stav(nakup: Record<string, NakupPolozka>): HouseholdState {
  return {
    ...emptyHouseholdState(),
    nakup: Object.fromEntries(
      Object.entries(nakup).map(([id, hodnota]) => [id, { hodnota, kdy: 1 }]),
    ),
  };
}

/**
 * Ruční množství přebíjí součet z receptů, ale dávky nemaže.
 *
 * Rodič u regálu ví líp než kuchařka, jestli koupí větší balení — součet
 * „450 g" je odhad ze tří receptů, ne to, co se prodává. Recept ale musí
 * jít pořád odebrat a seznam se pak má vrátit k počítanému množství.
 */
describe('ruční množství v seznamu', () => {
  const davky = [
    { recipeId: 'polevka', mnozstvi: '150 g' },
    { recipeId: 'rizoto', mnozstvi: '100 g' },
  ];

  it('bez přepsání se množství počítá z dávek', () => {
    const radek = sestavNakupniSeznam(stav({ mrkev: { davky, koupeno: false } }))[0];
    expect(radek?.popis).toBe('250 g');
    expect(radek?.rucni).toBe(false);
  });

  it('přepsané množství vyhraje nad součtem', () => {
    const radek = sestavNakupniSeznam(
      stav({ mrkev: { davky, koupeno: false, rucniMnozstvi: '1 kg' } }),
    )[0];
    expect(radek?.popis).toBe('1 kg');
    expect(radek?.rucni).toBe(true);
  });

  it('počítané množství zůstává vidět i po přepsání', () => {
    // Jinak by rodič po přidání dalšího receptu nepochopil, proč se
    // číslo v seznamu nezměnilo.
    const radek = sestavNakupniSeznam(
      stav({ mrkev: { davky, koupeno: false, rucniMnozstvi: '1 kg' } }),
    )[0];
    expect(radek?.popisZReceptu).toBe('250 g');
  });

  it('prázdné nebo mezerové přepsání se chová jako žádné', () => {
    for (const rucniMnozstvi of ['', '   ']) {
      const radek = sestavNakupniSeznam(
        stav({ mrkev: { davky, koupeno: false, rucniMnozstvi } }),
      )[0];
      expect(radek?.popis).toBe('250 g');
      expect(radek?.rucni).toBe(false);
    }
  });

  it('přepsat jde i něco, co se rozebrat nedá', () => {
    const radek = sestavNakupniSeznam(
      stav({ mrkev: { davky, koupeno: false, rucniMnozstvi: 'dvě balení' } }),
    )[0];
    expect(radek?.popis).toBe('dvě balení');
  });
});

/**
 * Návrh množství pro surovinu, kterou si rodič přidává sám.
 *
 * Bez návrhu by u každé položky vymýšlel, jestli psát „2 ks" nebo
 * „300 g", a většina by skončila bez množství.
 */
describe('vychoziMnozstvi', () => {
  it('surovina, kterou žádný recept neodměřuje, dostane kus', () => {
    expect(vychoziMnozstvi('tohle-v-katalogu-neni')).toBe('1 ks');
  });

  it('vrátí něco rozebratelného u suroviny z receptů', () => {
    const mrkev = recipes.flatMap((r) => r.ingredients).find((ref) => ref.ingredientId === 'mrkev');
    expect(mrkev, 'mrkev musí být aspoň v jednom receptu').toBeDefined();
    const navrh = vychoziMnozstvi('mrkev');
    expect(rozeberMnozstvi(navrh)).not.toBeNull();
  });

  it('je stálý — stejná surovina dá vždycky totéž', () => {
    expect(vychoziMnozstvi('brambor')).toBe(vychoziMnozstvi('brambor'));
  });

  it('nikdy nevrátí prázdno ani nulu', () => {
    for (const item of ingredients.slice(0, 60)) {
      const navrh = vychoziMnozstvi(item.id);
      expect(navrh.trim().length, `${item.id} dal prázdný návrh`).toBeGreaterThan(0);
      expect(navrh, `${item.id} dal nulu`).not.toMatch(/^0\s/);
    }
  });
});
