import { describe, expect, it } from 'vitest';
import { ingredients, recipes } from '../../src/data';
import { hledejRecepty } from '../../src/app/lib/hledaciIndexReceptu';
import { hledejSuroviny } from '../../src/app/lib/hledaciIndexSurovin';
import { pripravDotaz } from '../../src/app/lib/hledaciZaznam';
import { matchesIngredient, matchesRecipe } from '../../src/app/lib/search';

const podleId = new Map(ingredients.map((item) => [item.id, item]));

function nazvySlozek(recipeId: string): string[] {
  const recipe = recipes.find((r) => r.id === recipeId);
  if (recipe === undefined) return [];
  return recipe.ingredients.flatMap((ref) => {
    const item = podleId.get(ref.ingredientId);
    return item === undefined ? [] : [item.nameCz, ...item.altNamesCz];
  });
}

/**
 * Index je jen jinak uložená tatáž věc.
 *
 * Kdyby se choval byť o jediný recept jinak než původní `matchesRecipe`,
 * je to tichá změna výsledků hledání — přesně ten druh regrese, kterou
 * nikdo nenahlásí, protože chybějící recept není vidět.
 */
const DOTAZY = [
  '',
  'mrkev',
  'jablka',
  'brambury',
  'cocka',
  'ovesna kase',
  'ryby',
  'maso a ryby',
  'mléko',
  'zzzz',
  '  ',
  'ovoce a zelenina',
];

describe('hledací index se shoduje s původním hledáním', () => {
  it.each(DOTAZY)('suroviny pro dotaz „%s"', (dotaz) => {
    const pres = hledejSuroviny(dotaz);
    const ocekavane = ingredients.filter((item) => matchesIngredient(item, dotaz)).map((i) => i.id);
    if (pres === null) {
      // Prázdný dotaz index neomezuje vůbec — a stará cesta projde všechno.
      expect(ocekavane.length).toBe(ingredients.length);
      return;
    }
    expect([...pres].sort()).toEqual([...ocekavane].sort());
  });

  it.each(DOTAZY)('recepty pro dotaz „%s"', (dotaz) => {
    const pres = hledejRecepty(dotaz);
    const ocekavane = recipes
      .filter((recipe) => matchesRecipe(recipe, dotaz, nazvySlozek(recipe.id)))
      .map((r) => r.id);
    if (pres === null) {
      expect(ocekavane.length).toBe(recipes.length);
      return;
    }
    expect([...pres].sort()).toEqual([...ocekavane].sort());
  });
});

describe('pripravDotaz', () => {
  it('prázdný dotaz neomezuje', () => {
    expect(pripravDotaz('')).toBeNull();
    expect(pripravDotaz('   ')).toBeNull();
  });

  it('dotaz se normalizuje jednou, ne pro každou položku', () => {
    expect(pripravDotaz('Mrkev')?.needle).toBe('mrkev');
    expect(pripravDotaz('ovesná kaše')?.slova).toEqual(['ovesna', 'kase']);
  });
});

describe('hledání nad katalogem', () => {
  it('najde surovinu bez diakritiky', () => {
    expect(hledejSuroviny('cocka')?.has('cocka-cervena-loupana')).toBe(true);
  });

  it('opakované hledání vrací totéž — index se nesmí měnit', () => {
    const prvni = [...(hledejRecepty('mrkev') ?? [])].sort();
    const druhe = [...(hledejRecepty('mrkev') ?? [])].sort();
    expect(druhe).toEqual(prvni);
  });

  it('nesmysl nenajde nic', () => {
    expect(hledejRecepty('qwertzuiop')?.size).toBe(0);
  });
});
