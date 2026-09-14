import type { Ingredient, Recipe } from '@/types';
import { ingredientById, ingredients } from './ingredients';
import { recipes } from './recipes';
import {
  levelRank,
  nutrientProfile,
  vitaminCSources,
  type IronForm,
  type NutrientLevel,
  type NutrientProfile,
} from './nutrients';

/**
 * Živiny na úrovni receptu.
 *
 * Zvlášť od `nutrients.ts` schválně: tenhle soubor sahá na celou kuchařku,
 * a kdyby seděl vedle zařazení surovin, stáhl by si seznam surovin i tři sta
 * receptů, které k ničemu nepotřebuje.
 */

/**
 * Partneři pro vstřebávání železa u konkrétní suroviny.
 *
 * Prvních pět zdrojů vitaminu C podle pořadí v katalogu by u čočky nabídlo
 * jahody a pomeranč — pravda, ale neuvařitelná. Řadí se proto podle toho, co
 * kuchařka skutečně kombinuje: napřed partneři, se kterými tuhle surovinu
 * spojuje aspoň jeden recept, pak ti, kteří se potkávají aspoň s její
 * kategorií (u luštěnin tak vyjde paprika, u vloček ovoce).
 */
export function vitaminCPartners(item: Ingredient, limit = 5): Ingredient[] {
  const kategorie = new Map(ingredients.map((one) => [one.id, one.category]));
  const prime = new Map<string, number>();
  const podleKategorie = new Map<string, number>();

  for (const recipe of recipes) {
    const ids = recipe.ingredients.map((ref) => ref.ingredientId);
    const obsahujeSurovinu = ids.includes(item.id);
    const obsahujeKategorii = ids.some(
      (id) => kategorie.get(id) === item.category,
    );
    if (!obsahujeSurovinu && !obsahujeKategorii) continue;
    for (const id of ids) {
      if (obsahujeSurovinu) prime.set(id, (prime.get(id) ?? 0) + 1);
      if (obsahujeKategorii) podleKategorie.set(id, (podleKategorie.get(id) ?? 0) + 1);
    }
  }

  return vitaminCSources()
    .filter((partner) => partner.id !== item.id)
    .sort((a, b) => {
      const primeRozdil = (prime.get(b.id) ?? 0) - (prime.get(a.id) ?? 0);
      if (primeRozdil !== 0) return primeRozdil;
      return (podleKategorie.get(b.id) ?? 0) - (podleKategorie.get(a.id) ?? 0);
    })
    .slice(0, limit);
}


/** Z dvou úrovní ta vyšší — recept se slučuje maximem, ne součtem. */
function higher(a: NutrientLevel, b: NutrientLevel): NutrientLevel {
  return levelRank(a) >= levelRank(b) ? a : b;
}

export interface RecipeNutrients extends NutrientProfile {
  /** Suroviny receptu, které nesou železo — pro vysvětlení v okénku. */
  ironFrom: Ingredient[];
  /** Zdroje vitaminu C v témže receptu, které vstřebávání pomáhají. */
  vitaminCFrom: Ingredient[];
}

/**
 * Živiny celého receptu.
 *
 * Slučuje se nejvyšší úrovní, ne součtem: součet miligramů by předstíral
 * přesnost, kterou tahle vrstva nemá (viz hlavička souboru). Tvrzení je
 * proto úmyslně slabší — „v tomhle receptu je významný zdroj železa", ne
 * „recept obsahuje X mg".
 */
export function recipeNutrients(recipe: Recipe): RecipeNutrients {
  const slozky = recipe.ingredients
    .map((ref) => ingredientById.get(ref.ingredientId))
    .filter((one): one is Ingredient => one !== undefined);

  let iron: NutrientLevel = 'nevyznamny';
  let ironForm: IronForm = 'zadne';
  let zinc: NutrientLevel = 'nevyznamny';
  let vitaminC: NutrientLevel = 'nevyznamny';
  const ironFrom: Ingredient[] = [];
  const vitaminCFrom: Ingredient[] = [];

  for (const item of slozky) {
    const profile = nutrientProfile(item);
    if (profile.iron !== 'nevyznamny') {
      ironFrom.push(item);
      // Hemové železo z masa vyhrává, protože se vstřebává líp než rostlinné.
      if (profile.ironForm === 'hemove') ironForm = 'hemove';
      else if (ironForm === 'zadne') ironForm = 'nehemove';
    }
    if (profile.vitaminC === 'vyznamny') vitaminCFrom.push(item);
    iron = higher(iron, profile.iron);
    zinc = higher(zinc, profile.zinc);
    vitaminC = higher(vitaminC, profile.vitaminC);
  }

  return { iron, ironForm, zinc, vitaminC, ironFrom, vitaminCFrom };
}

