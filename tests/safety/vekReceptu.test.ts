import { describe, expect, it } from 'vitest';
import { errorsOf, runSafetyRules } from '../../src/safety/run';
import { makeCatalog, makeIngredient, makeMeatRecipe } from './fixtures';
import { recipes } from '../../src/data';

/** Surovina pro dospělé — slaná, a proto až od roku. */
const tofu = makeIngredient({
  id: 'tofu-uzene',
  nameCz: 'Tofu uzené',
  altNamesCz: ['uzené tofu'],
  category: 'lusteniny',
  minAgeMonths: 12,
  hazards: ['sul'],
  hazardNotes: { sul: 'Uzené tofu je solené, proto se do prvního roku nedává.' },
});

function katalogS(recipe: ReturnType<typeof makeMeatRecipe>) {
  const zaklad = makeCatalog();
  return makeCatalog({
    ingredients: [...zaklad.ingredients, tofu],
    recipes: [recipe],
  });
}

describe('věk receptu se počítá z toho, co sní miminko', () => {
  it('bezmasá náhrada pro dospělé věk receptu nezvedá', () => {
    const recept = makeMeatRecipe({
      id: 'maso-s-tofu-pro-dospele',
      minAgeMonths: 6,
      ingredients: [
        { ingredientId: 'mrkev', amount: '200 g', track: 'all' },
        { ingredientId: 'kureci-prsa', amount: '300 g', track: 'meat' },
        { ingredientId: 'tofu-uzene', amount: '250 g', track: 'vegetarian', adultOnly: true },
      ],
    });
    const chyby = errorsOf(runSafetyRules(katalogS(recept)));
    expect(chyby.filter((e) => e.ruleId.startsWith('min-age'))).toEqual([]);
  });

  it('bez příznaku se tatáž surovina do věku počítá', () => {
    const recept = makeMeatRecipe({
      id: 'maso-s-tofu-bez-priznaku',
      minAgeMonths: 6,
      ingredients: [
        { ingredientId: 'mrkev', amount: '200 g', track: 'all' },
        { ingredientId: 'kureci-prsa', amount: '300 g', track: 'meat' },
        { ingredientId: 'tofu-uzene', amount: '250 g', track: 'vegetarian' },
      ],
    });
    const chyby = errorsOf(runSafetyRules(katalogS(recept)));
    expect(chyby.some((e) => e.ruleId === 'min-age-consistency')).toBe(true);
  });

  it('příznak nesmí stát u společného základu', () => {
    const recept = makeMeatRecipe({
      id: 'tofu-v-zakladu',
      minAgeMonths: 6,
      ingredients: [
        { ingredientId: 'mrkev', amount: '200 g', track: 'all' },
        { ingredientId: 'kureci-prsa', amount: '300 g', track: 'meat' },
        { ingredientId: 'tofu-uzene', amount: '250 g', track: 'all', adultOnly: true },
      ],
    });
    const chyby = errorsOf(runSafetyRules(katalogS(recept)));
    expect(chyby.some((e) => e.ruleId === 'adult-only-not-in-base')).toBe(true);
  });

  it('příznak nesmí být u suroviny, kterou jmenují dětské kroky', () => {
    const recept = makeMeatRecipe({
      id: 'tofu-v-detskych-krocich',
      minAgeMonths: 6,
      ingredients: [
        { ingredientId: 'mrkev', amount: '200 g', track: 'all' },
        { ingredientId: 'kureci-prsa', amount: '300 g', track: 'meat' },
        { ingredientId: 'tofu-uzene', amount: '250 g', track: 'vegetarian', adultOnly: true },
      ],
      babySteps: ['Kousek tofu nakrájej na proužky a nabídni je vedle mrkve.'],
    });
    const chyby = errorsOf(runSafetyRules(katalogS(recept)));
    expect(chyby.some((e) => e.ruleId === 'adult-only-not-in-baby-steps')).toBe(true);
  });

  it('vyšší věk bez napsaného důvodu je chyba', () => {
    const recept = makeMeatRecipe({ id: 'zbytecne-stary', minAgeMonths: 12 });
    const chyby = errorsOf(runSafetyRules(makeCatalog({ recipes: [recept] })));
    const nalezeno = chyby.filter((e) => e.ruleId === 'min-age-not-inflated');
    expect(nalezeno).toHaveLength(1);
    expect(nalezeno[0]?.message).toContain('vystačí s 6');
  });

  it('s napsaným důvodem vyšší věk projde', () => {
    const recept = makeMeatRecipe({
      id: 'stary-s-duvodem',
      minAgeMonths: 12,
      minAgeReason: 'Jídlo se podává napíchané na špejli a ta do dětské ruky nepatří.',
    });
    const chyby = errorsOf(runSafetyRules(makeCatalog({ recipes: [recept] })));
    expect(chyby.filter((e) => e.ruleId === 'min-age-not-inflated')).toEqual([]);
  });

  it('důvod u receptu, kterému věk vychází ze surovin, je chyba — nemá co vysvětlovat', () => {
    const recept = makeMeatRecipe({
      id: 'duvod-nazbyt',
      minAgeMonths: 6,
      minAgeReason: 'Tenhle důvod tu nemá co dělat, protože věk nikdo nezvedl.',
    });
    const chyby = errorsOf(runSafetyRules(makeCatalog({ recipes: [recept] })));
    expect(chyby.some((e) => e.ruleId === 'min-age-not-inflated')).toBe(true);
  });
});

describe('kuchařka po opravě věků', () => {
  it('vepřová panenka je od šesti měsíců, uzené tofu je jen pro dospělé', () => {
    const recept = recipes.find((r) => r.id === 'veprova-panenka-s-dusenym-zelim');
    expect(recept?.minAgeMonths).toBe(6);
    expect(recept?.ingredients.find((ref) => ref.ingredientId === 'tofu-uzene')?.adultOnly).toBe(
      true,
    );
  });

  it('každý recept starší než jeho suroviny má napsaný důvod', () => {
    const bezDuvodu = recipes.filter(
      (r) => r.minAgeMonths > 6 && r.minAgeReason === undefined && r.ingredients.length === 0,
    );
    expect(bezDuvodu).toEqual([]);
    // Tři recepty, které věk drží kvůli podobě jídla, ho vysvětlují.
    const sDuvodem = recipes.filter((r) => r.minAgeReason !== undefined);
    expect(sDuvodem.length).toBeGreaterThanOrEqual(3);
    for (const r of sDuvodem) expect(r.minAgeReason?.length).toBeGreaterThan(30);
  });
});
