import { ingredientById, recipeById, recipes } from '@/data';
import type { HouseholdState, Ingredient, IngredientCategory } from '@/types';
import { nakupniPolozky } from './pocty';
import { nasobekProDospele, vynasobSoucet } from './porce';
import {
  popisMnozstvi,
  popisSouctu,
  rozeberMnozstvi,
  sectiMnozstvi,
  spojSoucty,
  type Soucet,
} from './mnozstvi';

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
  /** Množství spočítané z receptů, i když ho rodič přepsal. */
  popisZReceptu: string;
  /** Přepsal množství rodič? Pak `popis` je jeho, ne součet z dávek. */
  rucni: boolean;
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
  // Kuchařka je psaná na dva dospělé. Kdo vaří pro víc, nastaví si počet
  // v seznamu a množství se přepočítá (kapitola 10 bod 2 auditu).
  const nasobek = nasobekProDospele(state.nakupDospelych?.hodnota);
  for (const { id, polozka } of nakupniPolozky(state)) {
    const ingredient = ingredientById.get(id);
    if (ingredient === undefined) continue;
    // Násobí se jen to, co pochází z receptu. Co si rodič přidal sám,
    // napsal pro svou domácnost a přepočítávat mu to by bylo drzé.
    const zapis = (davka: { mnozstvi?: string }): string => (davka.mnozstvi ?? '').trim();
    const zReceptuZapisy = polozka.davky
      .filter((davka) => davka.recipeId !== undefined)
      .map(zapis)
      .filter((text) => text.length > 0);
    const rucniZapisy = polozka.davky
      .filter((davka) => davka.recipeId === undefined)
      .map(zapis)
      .filter((text) => text.length > 0);
    const soucet = spojSoucty(
      vynasobSoucet(sectiMnozstvi(zReceptuZapisy), nasobek),
      sectiMnozstvi(rucniZapisy),
    );
    const zReceptu = popisSouctu(soucet);
    const rucni = (polozka.rucniMnozstvi ?? '').trim();
    radky.push({
      ingredient,
      soucet,
      // Ruční množství přebíjí součet, ale dávky zůstávají — po odebrání
      // receptu se seznam vrátí k počítanému množství.
      popis: rucni.length > 0 ? rucni : zReceptu,
      popisZReceptu: zReceptu,
      rucni: rucni.length > 0,
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

/**
 * Kolik téhle suroviny obvykle padne, když se z ní vaří.
 *
 * Nabízí se rodiči, který si surovinu přidává sám od sebe — bez návrhu by
 * musel u každé položky vymýšlet, jestli psát „2 ks" nebo „300 g", a
 * většina by skončila bez množství. Číslo se nehádá: bere se **medián**
 * z toho, jak surovinu odměřují recepty v kuchařce, a jednotka ta
 * nejčastější. Medián proto, že jeden recept s kilem masa na osmiporci by
 * průměr vyhnal nahoru.
 *
 * Surovina, kterou žádný recept neodměřuje rozebratelně, dostane „1 ks".
 * Je to návrh, ne pravidlo — rodič ho v okénku přepíše.
 */
export function vychoziMnozstvi(ingredientId: string): string {
  const zapisy: string[] = [];
  for (const recipe of recipes) {
    for (const ref of recipe.ingredients) {
      if (ref.ingredientId === ingredientId) zapisy.push(ref.amount);
    }
  }

  const podleJednotky = new Map<string, number[]>();
  for (const zapis of zapisy) {
    const rozebrane = rozeberMnozstvi(zapis);
    if (rozebrane === null) continue;
    const dosud = podleJednotky.get(rozebrane.jednotka) ?? [];
    dosud.push(rozebrane.hodnota);
    podleJednotky.set(rozebrane.jednotka, dosud);
  }
  if (podleJednotky.size === 0) return '1 ks';

  // Nejčastější jednotka; při shodě rozhodne abeceda, ať je výsledek stejný
  // při každém spuštění.
  const [jednotka, hodnoty] = [...podleJednotky.entries()].sort(
    (a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]),
  )[0] as [string, number[]];

  const serazene = [...hodnoty].sort((a, b) => a - b);
  const median = serazene[Math.floor(serazene.length / 2)] as number;
  return popisMnozstvi({ hodnota: median, jednotka });
}
