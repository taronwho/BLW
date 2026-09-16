import { describe, expect, it } from 'vitest';
import { recipes } from '../../src/data';
import {
  JEDNODUCHA_MINUT,
  JEDNODUCHA_SLOZEK,
  jeJednoduchaUprava,
} from '../../src/data/jednoduche';

/**
 * Filtr jednoduchých úprav se nesmí vyprázdnit ani rozlít na celou kuchařku.
 * Obojí by z něj udělalo zbytečné tlačítko.
 */
describe('jednoduchá úprava', () => {
  const jednoduche = recipes.filter(jeJednoduchaUprava);

  it('vybere pár složek a krátký čas, ne víc', () => {
    for (const recipe of jednoduche) {
      expect(recipe.ingredients.length).toBeLessThanOrEqual(JEDNODUCHA_SLOZEK);
      expect(recipe.timeMinutes).toBeLessThanOrEqual(JEDNODUCHA_MINUT);
    }
  });

  it('je jich dost na samostatný filtr, ale ne celá kuchařka', () => {
    expect(jednoduche.length).toBeGreaterThanOrEqual(60);
    expect(jednoduche.length).toBeLessThan(recipes.length * 0.6);
  });

  it('pokrývá snídaně, hlavní jídla i svačiny', () => {
    for (const kategorie of ['snidane', 'obed-vecere', 'svaciny-peceni'] as const) {
      expect(
        jednoduche.filter((recipe) => recipe.category === kategorie).length,
        `kategorie ${kategorie} nemá jednoduchou úpravu`,
      ).toBeGreaterThan(0);
    }
  });

  it('dlouhý rodinný pokrm mezi ně nepatří', () => {
    const dlouhy = recipes.find((recipe) => recipe.timeMinutes > JEDNODUCHA_MINUT);
    expect(dlouhy).toBeDefined();
    expect(jeJednoduchaUprava(dlouhy as (typeof recipes)[number])).toBe(false);
  });
});
