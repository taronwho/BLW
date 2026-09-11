import { describe, expect, it } from 'vitest';
import { errorsOf, runSafetyRules } from '../../src/safety/run';
import { makeCatalog, makeIngredient, makeMeatRecipe } from './fixtures';

/**
 * Ověření, že validátor jako celek zachytí dvě nejtypičtější selhání:
 * med u suroviny pro šestiměsíční dítě a recept s masem bez bezmasé varianty.
 */
describe('validátor nad rozbitým katalogem', () => {
  const honeyIngredient = makeIngredient({
    id: 'jogurt-s-medem',
    nameCz: 'Jogurt s medem',
    minAgeMonths: 6,
    prepIdeas: ['smíchat s medem', 'se strouhaným jablkem', 'do kaše'],
  });

  const recipeWithoutVegTrack = makeMeatRecipe({
    id: 'kure-bez-bezmase-varianty',
    titleCz: 'Kuře bez bezmasé varianty',
    vegetarianSteps: [],
    vegetarianProteinSwap: undefined,
  });

  const brokenCatalog = makeCatalog({
    ingredients: [...makeCatalog().ingredients, honeyIngredient],
    recipes: [...makeCatalog().recipes, recipeWithoutVegTrack],
  });

  const errors = errorsOf(runSafetyRules(brokenCatalog));

  it('zachytí med u suroviny pro šestiměsíční dítě', () => {
    const found = errors.filter(
      (e) => e.ruleId === 'no-honey-baby' && e.itemId === 'jogurt-s-medem',
    );
    expect(found).toHaveLength(1);
    expect(found[0]?.message).toContain('Med');
  });

  it('zachytí recept s masem bez bezmasé varianty', () => {
    const found = errors.filter(
      (e) => e.ruleId === 'veg-track-complete' && e.itemId === 'kure-bez-bezmase-varianty',
    );
    expect(found).toHaveLength(1);
  });

  it('nehlásí chyby na jinak platném katalogu', () => {
    expect(errorsOf(runSafetyRules(makeCatalog()))).toEqual([]);
  });
});
