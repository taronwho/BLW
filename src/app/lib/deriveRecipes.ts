import { ingredientById, recipes } from '@/data';
import type { ChokingRisk, Ingredient, Recipe, ServingForm } from '@/types';
import { highestRisk } from './choking';

/**
 * Odvozeniny nad kuchařkou.
 *
 * Zvlášť od `derive.ts` schválně: sahají na všech tři sta receptů i s postupy.
 * Seznam surovin je nepotřebuje a nemá je proč stahovat.
 */

export function recipesWithIngredient(ingredientId: string): Recipe[] {
  return recipes.filter((recipe) =>
    recipe.ingredients.some((ref) => ref.ingredientId === ingredientId),
  );
}

export function recipeIngredients(recipe: Recipe): Ingredient[] {
  const found: Ingredient[] = [];
  for (const ref of recipe.ingredients) {
    const ingredient = ingredientById.get(ref.ingredientId);
    if (ingredient !== undefined) found.push(ingredient);
  }
  return found;
}

/** Recept je vegetariánský, když neobsahuje nic z kategorie maso-ryby. */
/**
 * Bezmasý recept je ten, který sní vegetarián — ne jen ten bez masa a ryby.
 *
 * Tvrdé sýry typu parmazánu, pecorina a grana padana se vyrábějí se
 * živočišným syřidlem, takže recept s nimi vegetariánce u stolu nepomůže,
 * i když v něm žádné maso není. Dřív se tu ptalo jen na kategorii
 * maso-ryby a tři recepty se kvůli tomu tvářily jako bezmasé.
 */
export function recipeIsVegetarian(recipe: Recipe): boolean {
  return recipeIngredients(recipe).every((item) => item.vegetarian);
}

export function recipeChokingRisk(recipe: Recipe): ChokingRisk {
  return highestRisk(recipeIngredients(recipe).map((item) => item.chokingRisk));
}

/**
 * Alergeny se odvozují ze složek, a to není zadarmo: projít složky receptu
 * znamená sáhnout do katalogu za každou z nich. Filtr v Receptech volal
 * tuhle funkci uvnitř `.some()`, takže při čtrnácti odškrtnutých alergenech
 * se celé odvození počítalo čtrnáctkrát na jeden recept a znovu při každém
 * stisku klávesy.
 *
 * Kuchařka se za běhu nemění, takže výsledek stačí spočítat jednou.
 * `WeakMap` proto, že klíčem je samotný recept — kdyby se katalog někdy
 * načítal po částech, staré objekty nic nedrží.
 */
const alergenyReceptu = new WeakMap<Recipe, string[]>();

export function recipeAllergens(recipe: Recipe): string[] {
  const hotove = alergenyReceptu.get(recipe);
  if (hotove !== undefined) return hotove;
  const spoctene = [...new Set(recipeIngredients(recipe).flatMap((item) => item.allergens))];
  alergenyReceptu.set(recipe, spoctene);
  return spoctene;
}

/**
 * Podoba receptu na talíři. Bere tu nejhrubší složku, kterou jídlo obsahuje:
 * stačí jedna věc, která se dá nakrájet na proužky, a rada o tvaru sousta
 * dává smysl. Když v receptu není nic kusového ani drobného, je to kaše.
 * Recept nikdy nevyjde jako „neřeší se" — jídlo vždycky něco na talíři má.
 */
export function recipeServingForm(recipe: Recipe): ServingForm {
  const formy = new Set(recipeIngredients(recipe).map((item) => item.servingForm));
  if (formy.has('kusove')) return 'kusove';
  if (formy.has('drobne')) return 'drobne';
  return 'kasovite';
}
