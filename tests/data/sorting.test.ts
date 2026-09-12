import { describe, expect, it } from 'vitest';
import { ingredients, recipes, ingredientById } from '../../src/data';
import { levelRank, nutrientProfile, recipeNutrients } from '../../src/data/nutrients';
import { sortIngredients, sortRecipes } from '../../src/app/lib/sorting';

describe('řazení surovin', () => {
  it('abecedně řadí česky — „č" patří hned za „c"', () => {
    const serazene = sortIngredients(ingredients, 'abeceda').map((item) => item.nameCz);
    const znovu = [...serazene].sort(new Intl.Collator('cs', { sensitivity: 'base' }).compare);
    expect(serazene).toEqual(znovu);
  });

  it('podle železa dává významné zdroje nahoru a nevýznamné dolů', () => {
    const serazene = sortIngredients(ingredients, 'zelezo');
    const urovne = serazene.map((item) => levelRank(nutrientProfile(item).iron));
    expect(urovne).toEqual([...urovne].sort((a, b) => b - a));
    expect(nutrientProfile(serazene[0] as never).iron).toBe('vyznamny');
  });

  it('při shodné úrovni železa jde napřed hemové — vstřebá se líp', () => {
    const prvni = sortIngredients(ingredients, 'zelezo')[0];
    expect(nutrientProfile(prvni as never).ironForm).toBe('hemove');
  });

  it('při shodné úrovni drží abecedu, aby seznam neposkakoval', () => {
    const serazene = sortIngredients(ingredients, 'zinek');
    const collator = new Intl.Collator('cs', { sensitivity: 'base' });
    for (let i = 1; i < serazene.length; i += 1) {
      const a = serazene[i - 1];
      const b = serazene[i];
      if (a === undefined || b === undefined) continue;
      if (levelRank(nutrientProfile(a).zinc) === levelRank(nutrientProfile(b).zinc)) {
        expect(collator.compare(a.nameCz, b.nameCz)).toBeLessThanOrEqual(0);
      }
    }
  });

  it('podle věku začíná u nejnižšího minAgeMonths', () => {
    const serazene = sortIngredients(ingredients, 'vek');
    const veky = serazene.map((item) => item.minAgeMonths);
    expect(veky).toEqual([...veky].sort((a, b) => a - b));
  });

  it('nemění původní pole', () => {
    const original = [...ingredients];
    sortIngredients(ingredients, 'zelezo');
    expect(ingredients).toEqual(original);
  });
});

describe('živiny celého receptu', () => {
  it('bere nejvyšší úroveň ze složek, ne součet', () => {
    for (const recipe of recipes.slice(0, 30)) {
      const slozky = recipe.ingredients
        .map((ref) => ingredientById.get(ref.ingredientId))
        .filter((one) => one !== undefined);
      const nejvyssi = Math.max(
        0,
        ...slozky.map((one) => levelRank(nutrientProfile(one as never).iron)),
      );
      expect(levelRank(recipeNutrients(recipe).iron)).toBe(nejvyssi);
    }
  });

  it('hemová forma vyhrává, když je v receptu maso i rostlinný zdroj', () => {
    const smiseny = recipes.find((recipe) => {
      const profile = recipeNutrients(recipe);
      return profile.ironFrom.some((one) => nutrientProfile(one).ironForm === 'hemove');
    });
    expect(smiseny).toBeDefined();
    expect(recipeNutrients(smiseny as never).ironForm).toBe('hemove');
  });

  it('vyjmenuje složky, které železo nesou', () => {
    const recipe = recipes.find((one) => recipeNutrients(one).iron === 'vyznamny');
    expect(recipe).toBeDefined();
    const profile = recipeNutrients(recipe as never);
    expect(profile.ironFrom.length).toBeGreaterThan(0);
    for (const item of profile.ironFrom) {
      expect(nutrientProfile(item).iron).not.toBe('nevyznamny');
    }
  });
});

describe('řazení receptů', () => {
  it('podle železa nikdy nedá bezželezný recept nad významný zdroj', () => {
    const serazene = sortRecipes(recipes, 'zelezo');
    const urovne = serazene.map((recipe) => levelRank(recipeNutrients(recipe).iron));
    expect(urovne).toEqual([...urovne].sort((a, b) => b - a));
  });

  it('podle času začíná nejrychlejším receptem', () => {
    const serazene = sortRecipes(recipes, 'cas');
    const casy = serazene.map((recipe) => recipe.timeMinutes);
    expect(casy).toEqual([...casy].sort((a, b) => a - b));
  });

  it('neznámý klíč spadne zpátky na abecedu', () => {
    const serazene = sortRecipes(recipes, 'vitamin-c').map((one) => one.titleCz);
    const abecedne = [...serazene].sort(new Intl.Collator('cs', { sensitivity: 'base' }).compare);
    expect(serazene).toEqual(abecedne);
  });
});
