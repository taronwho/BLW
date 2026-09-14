import { ingredientById, ingredients, recipes } from '@/data';
import type {
  ChokingRisk,
  HouseholdState,
  Ingredient,
  Recipe,
  ServingForm,
  TastingEvent,
} from '@/types';
import { highestRisk } from './choking';

/** Odvozeniny nad katalogem a stavem domácnosti. Bez nich by každá obrazovka
 *  počítala totéž jinak. */

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

export function recipeAllergens(recipe: Recipe): string[] {
  return [...new Set(recipeIngredients(recipe).flatMap((item) => item.allergens))];
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

export function inSeason(ingredient: Ingredient, month: number): boolean {
  return ingredient.seasonCz.length === 0 || ingredient.seasonCz.includes(month);
}

/** „Vhodné teď" = fáze podle věku dítěte už tuhle surovinu dovoluje. */
export function suitableNow(ingredient: Ingredient, ageMonths: number | null): boolean {
  return ingredient.minAgeMonths <= (ageMonths ?? 6);
}

/**
 * Nesmazané ochutnávky. Smazaný záznam zůstává v poli jako náhrobek kvůli
 * slučování mezi zařízeními, ale do UI ani do statistik nepatří.
 */
export function activeTastings(state: HouseholdState): TastingEvent[] {
  return state.tastings.filter((event) => event.deleted !== true);
}

export function tastingsByIngredient(state: HouseholdState): Map<string, TastingEvent[]> {
  const map = new Map<string, TastingEvent[]>();
  for (const event of activeTastings(state)) {
    const list = map.get(event.ingredientId) ?? [];
    list.push(event);
    map.set(event.ingredientId, list);
  }
  for (const list of map.values()) {
    list.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.createdAt - a.createdAt));
  }
  return map;
}

export function tastedIds(state: HouseholdState): Set<string> {
  return new Set(activeTastings(state).map((event) => event.ingredientId));
}

/** Reakce, které rodič hlásí pediatrovi — kvůli nim se alergen nepočítá jako zavedený. */
const ADVERSE: ReadonlySet<string> = new Set(['kozni', 'travici', 'jina']);

export function isAdverse(event: TastingEvent): boolean {
  return ADVERSE.has(event.reaction);
}

/** Návrh „Co dnes zkusit?" — dosud neochutnané, k věku i sezóně (docs/SPEC.md 4.5). */
export function suggestions(
  state: HouseholdState,
  ageMonths: number | null,
  month: number,
  count = 3,
): Ingredient[] {
  const tasted = tastedIds(state);
  return ingredients
    .filter(
      (item) =>
        !tasted.has(item.id) &&
        suitableNow(item, ageMonths) &&
        inSeason(item, month) &&
        item.chokingRisk !== 'high',
    )
    .slice(0, count);
}
