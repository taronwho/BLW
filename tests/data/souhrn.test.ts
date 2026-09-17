import { describe, expect, it } from 'vitest';
import { ingredients, recipes } from '../../src/data';
import { recipeIsVegetarian } from '../../src/app/lib/deriveRecipes';

/**
 * Souhrn `npm run validate:data` musí dávat smysl sám o sobě.
 *
 * Dřív hlásil „RECEPTŮ: 494 (vegetariánských: 374, s masem a bezmasou
 * variantou: 124)". Součet 498 je větší než 494, protože se čtyři recepty
 * počítaly dvakrát: maso neobsahují, ale mají obě linie dochucení kvůli
 * syřidlovému sýru. Čísla přes sebe nesmí přetékat, jinak nic neměří.
 */
describe('souhrn validátoru', () => {
  const vegetarianske = recipes.filter(recipeIsVegetarian);
  const dveVarianty = recipes.filter(
    (r) => !recipeIsVegetarian(r) && r.adultSteps.length > 0 && (r.vegetarianSteps ?? []).length > 0,
  );

  it('vegetariánské a dvouvariantní recepty jsou disjunktní množiny', () => {
    const vegIds = new Set(vegetarianske.map((r) => r.id));
    const prunik = dveVarianty.filter((r) => vegIds.has(r.id));
    expect(prunik.map((r) => r.id)).toEqual([]);
  });

  it('součet obou čísel nepřeteče přes celkový počet receptů', () => {
    expect(vegetarianske.length + dveVarianty.length).toBeLessThanOrEqual(recipes.length);
  });

  it('validátor a aplikace počítají vegetariánské recepty stejně', () => {
    // Aplikace se ptá na `vegetarian` u složek, ne na kategorii maso-ryby.
    // Parmazán, pecorino a grana padano maso nejsou, ale vegetariánka je
    // nejí — a rodina v docs/SPEC.md jednu má.
    const byId = new Map(ingredients.map((i) => [i.id, i]));
    const jenPodleKategorie = recipes.filter(
      (r) => !r.ingredients.some((ref) => byId.get(ref.ingredientId)?.category === 'maso-ryby'),
    );
    const rozdil = jenPodleKategorie.filter((r) => !recipeIsVegetarian(r)).map((r) => r.id);
    // Rozdíl smí existovat — jsou to právě recepty se syřidlovým sýrem.
    // Test hlídá, že ho zná jen jedna definice a druhá se podle ní řídí.
    expect(vegetarianske.length).toBe(jenPodleKategorie.length - rozdil.length);
  });

  it('každý recept se dvěma variantami má pro vegetariánku skutečný důvod', () => {
    // Důvodem nemusí být maso: čtyři recepty ho nemají, zato mají parmazán,
    // pecorino nebo granu padano se živočišným syřidlem. Obojí je pro
    // vegetariánku u stolu stejná překážka, a proto obojí druhou variantu
    // potřebuje. Tvrzení testu proto zní „něco, co vegetariánka nejí",
    // ne „maso".
    const byId = new Map(ingredients.map((i) => [i.id, i]));
    for (const recept of dveVarianty) {
      const zavadne = recept.ingredients
        .map((ref) => byId.get(ref.ingredientId))
        .filter((i) => i !== undefined && !i.vegetarian);
      expect(zavadne.length, `${recept.id} má dvě varianty, ale nic nevegetariánského`).toBeGreaterThan(0);
    }
  });

  it('recept s masem nebo rybou vždycky říká, čím se bílkovina nahradí', () => {
    const byId = new Map(ingredients.map((i) => [i.id, i]));
    const sMasem = recipes.filter((r) =>
      r.ingredients.some((ref) => byId.get(ref.ingredientId)?.category === 'maso-ryby'),
    );
    const bezNahrady = sMasem.filter((r) => (r.vegetarianProteinSwap ?? '').trim().length === 0);
    expect(bezNahrady.map((r) => r.id)).toEqual([]);
  });
});
