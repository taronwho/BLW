import { describe, expect, it } from 'vitest';
import { recipes } from '../../src/data';
import { nahodnyRecept, vhodneRecepty, vyberNahodny } from '../../src/app/lib/nahodnyRecept';
import { recipeAllergens } from '../../src/app/lib/deriveRecipes';
import { ALLERGEN_GROUPS } from '../../src/types';

/**
 * Náhodný recept se losuje z vhodných, ne ze všech.
 *
 * Kuchařka má skoro pět set položek a mezi nimi jídla od dvanácti měsíců.
 * Nabídnout je rodiči šestiměsíčního dítěte by znamenalo, že tlačítko
 * párkrát zklame a nikdo ho pak nepoužije.
 */
describe('vhodneRecepty', () => {
  it('nenabídne recept starší, než je dítě', () => {
    for (const recept of vhodneRecepty(6)) {
      expect(recept.minAgeMonths, recept.id).toBeLessThanOrEqual(6);
    }
  });

  it('bez data narození počítá se šesti měsíci, ne se vším', () => {
    expect(vhodneRecepty(null).length).toBe(vhodneRecepty(6).length);
    expect(vhodneRecepty(null).length).toBeLessThan(recipes.length);
  });

  it('starší dítě dostane víc receptů než mladší', () => {
    expect(vhodneRecepty(12).length).toBeGreaterThan(vhodneRecepty(6).length);
  });

  it('vynechá recepty s alergenem, který má dítě zapsaný', () => {
    for (const recept of vhodneRecepty(12, ['mleko'])) {
      expect(recipeAllergens(recept), recept.id).not.toContain('mleko');
    }
  });

  it('i po vyloučení všech čtrnácti alergenů něco zbyde', () => {
    // Dušená zelenina nebo ovoce žádný alergen nenesou, takže rodič
    // s alergickým dítětem nezůstane bez nabídky.
    const bezAlergenu = vhodneRecepty(12, [...ALLERGEN_GROUPS]);
    expect(bezAlergenu.length).toBeGreaterThan(0);
    for (const recept of bezAlergenu) {
      expect(recipeAllergens(recept), recept.id).toEqual([]);
    }
  });

  it('když nevyjde vůbec nic, raději vrátí celou kuchařku než nic', () => {
    // Prázdné tlačítko, které nic neudělá, je horší než nabídnutý recept,
    // u kterého si rodič sám přečte, proč nesedí. Věk nula žádný recept
    // nesplní — nejnižší v kuchařce je šest měsíců.
    expect(vhodneRecepty(0).length).toBe(recipes.length);
  });
});

describe('vyberNahodny', () => {
  it('z prázdného pole nevybere nic', () => {
    expect(vyberNahodny([])).toBeNull();
  });

  it('dosáhne na první i poslední prvek', () => {
    const pole = ['a', 'b', 'c'];
    expect(vyberNahodny(pole, () => 0)).toBe('a');
    expect(vyberNahodny(pole, () => 0.99)).toBe('c');
  });

  it('nespadne, ani když generátor vrátí jedničku', () => {
    // Math.random() jedničku nevrací, ale podstrčený generátor může.
    expect(vyberNahodny(['a', 'b'], () => 1)).toBe('b');
  });
});

describe('nahodnyRecept', () => {
  it('nevrátí ten recept, na kterém rodič právě je', () => {
    // Jinak by se při opakovaném klepnutí občas nabídl tentýž recept
    // a vypadalo by to, že tlačítko nefunguje.
    const prvni = vhodneRecepty(12)[0];
    expect(prvni).toBeDefined();
    expect(nahodnyRecept(12, [], prvni?.id, () => 0)?.id).not.toBe(prvni?.id);
  });

  it('vrátí vždycky nějaký recept', () => {
    for (const mesice of [null, 6, 9, 12, 24]) {
      expect(nahodnyRecept(mesice)).not.toBeNull();
    }
  });
});
