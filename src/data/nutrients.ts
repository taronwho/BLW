import type { Ingredient, Recipe } from '@/types';
import { ingredientById, ingredients } from './ingredients';
import { recipes } from './recipes';

/**
 * Zařazení surovin podle železa, zinku a vitaminu C.
 *
 * POZOR NA ROZSAH: tohle NEJSOU měřené hodnoty v miligramech. Je to zařazení
 * do skupin potravin, které jako zdroj jmenují načtené stránky NHS a odborná
 * kniha. Číselné obsahy živin by se musely vzít z potravinové tabulky, kterou
 * docs/BEZPECNOST.md mezi povolenými zdroji nemá — a vymýšlet je z hlavy
 * zakazuje CLAUDE.md pravidlo 1. UI to takhle i popisuje.
 *
 * Doložené seznamy, ze kterých zařazení vychází:
 *  - železo (NHS Iron): játra, červené maso, luštěniny (fazole kidney,
 *    edamame, cizrna), ořechy, sušené ovoce (sušené meruňky), obohacené
 *    cereálie, sójová mouka;
 *  - zinek (NHS Vitamins and minerals – others): maso, korýši, mléčné výrobky
 *    jako sýr, chléb a obilné výrobky jako pšeničné klíčky;
 *  - vitamin C (NHS Vitamin C): citrusy, papriky, jahody, černý rybíz,
 *    brokolice, růžičková kapusta, brambory;
 *  - kniha: zdroje zinku se kryjí se zdroji železa — maso, vnitřnosti,
 *    luštěniny, semena a celozrnné obiloviny.
 */

export type NutrientLevel = 'vyznamny' | 'obsahuje' | 'nevyznamny';

/** Hemové železo z masa se vstřebává lépe než nehemové z rostlin. */
export type IronForm = 'hemove' | 'nehemove' | 'zadne';

export interface NutrientProfile {
  iron: NutrientLevel;
  ironForm: IronForm;
  zinc: NutrientLevel;
  vitaminC: NutrientLevel;
}

/** Vnitřnosti — v obou seznamech nejvýš. */
const VNITRNOSTI = new Set(['kureci-jatra', 'teleci-jatra']);

/** Červené maso, které NHS jmenuje jako dobrý zdroj železa. */
const CERVENE_MASO = new Set([
  'hovezi-zadni',
  'hovezi-mlete',
  'teleci',
  'jehneci',
  'veprova-panenka',
  'veprova-kyta',
  'kralik',
  'kaci-prsa',
]);

/** Korýši — NHS je jmenuje u zinku. */
const KORYSI = new Set(['krevety']);

/** Sušené ovoce; sušené meruňky NHS jmenuje přímo. */
const SUSENE_OVOCE = new Set([
  'susene-merunky',
  'susene-svestky',
  'rozinky',
  'datle',
  'brusinky-susene',
]);

/** Celozrnné a pseudoobiloviny — kniha je uvádí u zinku i železa. */
const CELOZRNNE = new Set([
  'mouka-psenicna-celozrnna',
  'testoviny-celozrnne',
  'ryze-natural',
  'kroupy-jecne',
  'ovesne-vlocky-jemne',
  'ovesne-vlocky-velke',
  'oves-bezlepkovy',
  'pohanka-lamanka',
  'pohanka-kroupy',
  'quinoa',
  'amarant',
  'jahly',
  'bulgur',
  'mouka-spaldova',
  'mouka-zitna',
]);

/** Vitamin C — přesně ty skupiny, které NHS jmenuje. */
const VITAMIN_C_VYZNAMNY = new Set([
  'pomeranc',
  'mandarinka',
  'citron',
  'limetka',
  'paprika-sladka',
  'jahody',
  'rybiz-cerny',
  'brokolice',
  'ruzickova-kapusta',
]);

const VITAMIN_C_OBSAHUJE = new Set(['brambor', 'batat', 'rybiz-cerveny', 'kvetak', 'zeli-bile']);

function ironOf(item: Ingredient): { level: NutrientLevel; form: IronForm } {
  if (VNITRNOSTI.has(item.id)) return { level: 'vyznamny', form: 'hemove' };
  if (CERVENE_MASO.has(item.id)) return { level: 'vyznamny', form: 'hemove' };
  if (item.category === 'maso-ryby') return { level: 'obsahuje', form: 'hemove' };
  if (item.category === 'lusteniny') return { level: 'vyznamny', form: 'nehemove' };
  if (item.category === 'orechy-seminka-tuky') {
    // Oleje a kokosové mléko do skupiny „ořechy a semena" nepatří.
    const jeTuk = item.id.startsWith('olej-') || item.id === 'mleko-kokosove';
    return jeTuk
      ? { level: 'nevyznamny', form: 'zadne' }
      : { level: 'vyznamny', form: 'nehemove' };
  }
  if (SUSENE_OVOCE.has(item.id)) return { level: 'vyznamny', form: 'nehemove' };
  if (CELOZRNNE.has(item.id)) return { level: 'obsahuje', form: 'nehemove' };
  return { level: 'nevyznamny', form: 'zadne' };
}

function zincOf(item: Ingredient): NutrientLevel {
  if (VNITRNOSTI.has(item.id)) return 'vyznamny';
  if (KORYSI.has(item.id)) return 'vyznamny';
  if (item.category === 'maso-ryby') return 'vyznamny';
  if (item.category === 'lusteniny') return 'obsahuje';
  if (item.category === 'orechy-seminka-tuky') {
    const jeTuk = item.id.startsWith('olej-') || item.id === 'mleko-kokosove';
    return jeTuk ? 'nevyznamny' : 'obsahuje';
  }
  if (CELOZRNNE.has(item.id)) return 'obsahuje';
  if (item.category === 'mlecne-vejce') return 'obsahuje';
  if (item.category === 'obiloviny') return 'obsahuje';
  return 'nevyznamny';
}

function vitaminCOf(item: Ingredient): NutrientLevel {
  if (VITAMIN_C_VYZNAMNY.has(item.id)) return 'vyznamny';
  if (VITAMIN_C_OBSAHUJE.has(item.id)) return 'obsahuje';
  return 'nevyznamny';
}

export function nutrientProfile(item: Ingredient): NutrientProfile {
  const iron = ironOf(item);
  return {
    iron: iron.level,
    ironForm: iron.form,
    zinc: zincOf(item),
    vitaminC: vitaminCOf(item),
  };
}

/** Nese surovina železo v množství, které stojí za zmínku? */
export function isIronSource(item: Ingredient): boolean {
  const profile = nutrientProfile(item);
  return profile.iron === 'vyznamny' || profile.iron === 'obsahuje';
}

/** Všechny významné zdroje vitaminu C v katalogu. */
export function vitaminCSources(): Ingredient[] {
  return ingredients.filter((item) => vitaminCOf(item) === 'vyznamny');
}

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

/** Zdroje železa v katalogu, seřazené od nejvýznamnějších. */
export function ironSources(limit = 12): Ingredient[] {
  const rank = (item: Ingredient): number => {
    const p = nutrientProfile(item);
    if (p.iron === 'vyznamny') return p.ironForm === 'hemove' ? 0 : 1;
    return 2;
  };
  return ingredients
    .filter(isIronSource)
    .sort((a, b) => rank(a) - rank(b))
    .slice(0, limit);
}

/** Pořadí úrovní od nejvýznamnější — používá se při řazení i při slučování. */
const LEVEL_RANK: Record<NutrientLevel, number> = {
  vyznamny: 2,
  obsahuje: 1,
  nevyznamny: 0,
};

export function levelRank(level: NutrientLevel): number {
  return LEVEL_RANK[level];
}

function higher(a: NutrientLevel, b: NutrientLevel): NutrientLevel {
  return LEVEL_RANK[a] >= LEVEL_RANK[b] ? a : b;
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

