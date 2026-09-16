import { ingredientById, recipeById } from '@/data';
import type { HouseholdState, Ingredient, IngredientCategory } from '@/types';
import { nakupniPolozky } from './pocty';
import { popisSouctu, sectiMnozstvi, type Soucet } from './mnozstvi';

/**
 * Nákupní seznam sestavený z uloženého stavu domácnosti.
 *
 * Stav drží jen id a jednotlivé dávky; názvy, množství i pořadí se dopočítají
 * až tady, protože katalog se stahuje zvlášť. Úvodní obrazovka díky tomu
 * ukáže počet položek, aniž by si kvůli němu stáhla celou kuchařku.
 */

/** Odkud se položka v seznamu vzala. */
export interface NakupPuvod {
  recipeId?: string;
  /** Název receptu, nebo „ručně přidáno". */
  nazev: string;
  /** Původní zápis z receptu, třeba „150 g". */
  mnozstvi?: string;
}

export interface NakupniRadek {
  ingredient: Ingredient;
  soucet: Soucet;
  /** Celé množství na jednu řádku, třeba „450 g + 2 lžíce". */
  popis: string;
  koupeno: boolean;
  puvod: NakupPuvod[];
}

/**
 * Pořadí kategorií podle toho, jak se prochází obchod.
 *
 * Abecední pořadí by rodiče honilo od pultu k pultu a zpátky. Tohle je
 * běžná cesta českým supermarketem: nejdřív zelenina a ovoce, pak pulty,
 * nakonec trvanlivé zboží.
 */
const PORADI: readonly IngredientCategory[] = [
  'zelenina',
  'ovoce',
  'maso-ryby',
  'mlecne-vejce',
  'obiloviny',
  'lusteniny',
  'orechy-seminka-tuky',
  'bylinky-koreni',
  'ostatni',
];

function poradiKategorie(kategorie: IngredientCategory): number {
  const index = PORADI.indexOf(kategorie);
  return index === -1 ? PORADI.length : index;
}

/**
 * Celý seznam k zobrazení.
 *
 * Koupené padají na konec a mezi sebou si drží pořadí podle obchodu, aby
 * odškrtnutá položka neuskočila někam, kde se po ní musí pátrat.
 */
export function sestavNakupniSeznam(state: HouseholdState): NakupniRadek[] {
  const radky: NakupniRadek[] = [];
  for (const { id, polozka } of nakupniPolozky(state)) {
    const ingredient = ingredientById.get(id);
    if (ingredient === undefined) continue;
    const zapisy = polozka.davky
      .map((davka) => davka.mnozstvi)
      .filter((text): text is string => text !== undefined && text.trim().length > 0);
    const soucet = sectiMnozstvi(zapisy);
    radky.push({
      ingredient,
      soucet,
      popis: popisSouctu(soucet),
      koupeno: polozka.koupeno,
      puvod: polozka.davky.map((davka) => ({
        ...(davka.recipeId === undefined ? {} : { recipeId: davka.recipeId }),
        nazev:
          davka.recipeId === undefined
            ? 'ručně přidáno'
            : (recipeById.get(davka.recipeId)?.titleCz ?? 'recept z kuchařky'),
        ...(davka.mnozstvi === undefined ? {} : { mnozstvi: davka.mnozstvi }),
      })),
    });
  }

  return radky.sort((a, b) => {
    if (a.koupeno !== b.koupeno) return a.koupeno ? 1 : -1;
    const poradi = poradiKategorie(a.ingredient.category) - poradiKategorie(b.ingredient.category);
    if (poradi !== 0) return poradi;
    return a.ingredient.nameCz.localeCompare(b.ingredient.nameCz, 'cs');
  });
}

/**
 * Složky receptu, které patří do nákupu.
 *
 * Voda se vynechává: teče z kohoutku a v seznamu by jen překážela. Všechno
 * ostatní jde dovnitř včetně linie pro maso i bezmasé varianty — vaří se
 * pro celý stůl a rodič si u regálu rozhodne sám, co koupí.
 */
export function slozkyDoNakupu(recipeId: string): { ingredientId: string; mnozstvi: string }[] {
  const recipe = recipeById.get(recipeId);
  if (recipe === undefined) return [];
  return recipe.ingredients
    .filter((ref) => ref.ingredientId !== 'voda')
    .map((ref) => ({ ingredientId: ref.ingredientId, mnozstvi: ref.amount }));
}
