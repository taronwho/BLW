import type { Ingredient, Recipe, SourceRef } from '@/types';
import {
  BP_IRON,
  BP_TOMATO,
  BP_VITAMIN_C,
  BP_ZINC,
  NHS_IRON,
  NHS_TRACE_MINERALS,
  NHS_VITAMIN_C,
  SZU_VITAMIN_C,
} from './ingredients/_sources';
import { ingredientById, ingredients } from './ingredients';
import { recipes } from './recipes';

/**
 * Zařazení surovin podle železa, zinku a vitaminu C.
 *
 * POZOR NA ROZSAH: tohle NEJSOU měřené hodnoty v miligramech. Je to zařazení
 * do skupin potravin, které jako zdroj jmenují načtené stránky. Číselné
 * obsahy živin v katalogu nejsou a nebudou: potravinová databáze, ze které by
 * se braly, není mezi povolenými zdroji v docs/BEZPECNOST.md, a vymýšlet je
 * z hlavy zakazuje CLAUDE.md pravidlo 1. UI to takhle i popisuje.
 *
 * Zařazuje se po skupinách, ne po jménech. Politika je v docs/BEZPECNOST.md
 * kapitola 8.
 *
 * Dřív tu stál ruční seznam jmen a platilo, že co v něm není, to podle
 * aplikace živinu nemá. U tří set surovin to nešlo udržet: rakytník, rajče,
 * maliny, mango ani špenát v něm nebyly, takže je aplikace tvrdošíjně
 * ukazovala jako nezdroj vitaminu C. Skupina se dá odvodit od kategorie a
 * zdroje ji popisují jako skupinu — „hlavním zdrojem vitaminu C je ovoce,
 * zvlášť tropické, a zelenina", „zelená listová zelenina", „semena a ořechy".
 *
 * Nejvyšší stupeň dostane jen to, co zdroj vyjmenuje adresně; zbytek skupiny
 * dostane stupeň nižší. Rozdíl mezi „●●●" a „●●○" je tedy rozdíl mezi
 * „zdroj to jmenuje mezi nejbohatšími" a „patří do skupiny, kterou zdroj
 * označuje za zdroj".
 *
 * Doložené podklady:
 *  - železo (NHS Iron): játra, červené maso, luštěniny (fazole kidney,
 *    edamame, cizrna), ořechy, sušené ovoce (sušené meruňky), obohacené
 *    cereálie, sójová mouka;
 *  - železo (ICBP Železo): hemové z masa a ryb se vstřebá kolem 15 %,
 *    nehemové z rostlin hůř; z rostlinných zdrojů jmenuje zelenou listovou
 *    zeleninu, obiloviny a luštěniny;
 *  - zinek (ICBP Zinek v potravinách) s čísly: semena a ořechy 2,9–7,8 mg na
 *    100 g, játra 4,2–6,1, hovězí a vepřové 2,9–4,7, drůbež 1,8–3,0, ryby a
 *    mořské produkty 0,5–5,2, vejce 1,1–1,4, mléko a sýry 0,4–3,1, luštěniny
 *    1,0–2,0, chléb 0,9;
 *  - zinek (NHS Vitamins and minerals – others): maso, korýši, sýr, chléb a
 *    obilné výrobky;
 *  - vitamin C (NHS Vitamin C): citrusy, papriky, jahody, černý rybíz,
 *    brokolice, růžičková kapusta, brambory;
 *  - vitamin C (ICBP Vitamin C): černý rybíz až 300 mg/100 g, kiwi 130,
 *    papája 100, citrusy až 70, papriky až 300, květák, brokolice a kapusta
 *    až 130, kysané zelí a brambory až 40; hlavním zdrojem je ovoce a
 *    zelenina a pro příjem jsou důležitější druhy, kterých se sní hodně;
 *  - vitamin C (SZÚ, informační karta): červená paprika, pomeranč, citron,
 *    černý rybíz, kiwi, jahody, brokolice, květák, kedlubna;
 *  - vitamin C (ICBP Rajčata): jedno střední rajče pokryje skoro 40 %
 *    doporučené denní dávky.
 */

/**
 * Zdroje, ze kterých zařazení vychází. Okénko živin je ukazuje rodiči, aby
 * u tvrzení o živinách stál doklad stejně jako u tvrzení o bezpečnosti.
 */
export const NUTRIENT_SOURCES: readonly SourceRef[] = [
  NHS_IRON,
  NHS_TRACE_MINERALS,
  NHS_VITAMIN_C,
  BP_IRON,
  BP_ZINC,
  BP_VITAMIN_C,
  SZU_VITAMIN_C,
  BP_TOMATO,
];

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

/** Korýši a měkkýši — ICBP i NHS je jmenují u zinku. */
const KORYSI = new Set(['krevety', 'slavky', 'hrebenatky', 'kalamary']);

/** Sušené ovoce; sušené meruňky NHS jmenuje přímo. */
const SUSENE_OVOCE = new Set([
  'susene-merunky',
  'susene-svestky',
  'rozinky',
  'datle',
  'brusinky-susene',
  'fiky-susene',
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

/**
 * Zelená listová zelenina, kterou ICBP jmenuje jako rostlinný zdroj železa.
 *
 * Vybrané jsou tmavé listy, u kterých je označení „zelená listová" nesporné.
 * Hlávkový salát, polníček ani pekingské zelí tu nejsou: jsou světlé a
 * vodnaté a heslo je nejmenuje, takže by to bylo dopsané z hlavy.
 */
const LISTOVA_ZELENINA = new Set(['spenat', 'mangold', 'kapusta-kaderava', 'rukola']);

/**
 * Vitamin C — suroviny, které zdroje jmenují adresně mezi nejbohatšími.
 *
 * Brambory a kysané zelí zdroje jmenují taky, ale v nejnižším pásmu (do
 * 40 mg/100 g), takže patří o stupeň níž, viz `VITAMIN_C_OBSAHUJE`.
 */
const VITAMIN_C_VYZNAMNY = new Set([
  'pomeranc',
  'mandarinka',
  'citron',
  'limetka',
  'grapefruit',
  'pomelo',
  'paprika-sladka',
  'jahody',
  'rybiz-cerny',
  'brokolice',
  'ruzickova-kapusta',
  'kvetak',
  'kapusta-hlavkova',
  'kapusta-kaderava',
  'kedlubna',
  'kiwi',
  'papaja',
  'rajce',
]);

/** Jmenované adresně, ale v nejnižším pásmu obsahu. */
const VITAMIN_C_OBSAHUJE = new Set(['brambor', 'batat', 'zeli-bile', 'zeli-kysane']);

/**
 * Ovoce a zelenina, kde se vitamin C počítat nedá.
 *
 * Sušením, zavařováním i dlouhým skladováním se ztrácí — obě hesla ho řadí
 * mezi nejméně stálé vitaminy a SZÚ dodává, že ho ničí teplo a kyslík. Houby
 * nejsou ani ovoce, ani listová zelenina; do skupiny, kterou zdroje jako
 * zdroj vitaminu C popisují, prostě nepatří.
 */
const BEZ_VITAMINU_C = new Set([
  'datle',
  'rozinky',
  'susene-merunky',
  'susene-svestky',
  'brusinky-susene',
  'fiky-susene',
  'jablecne-pyre-bez-cukru',
  'kokos-strouhany',
  'rajcatovy-protlak',
  'rajcata-loupana-konzerva',
  'zampiony',
  'hliva-ustricna',
]);

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
  if (LISTOVA_ZELENINA.has(item.id)) return { level: 'obsahuje', form: 'nehemove' };
  return { level: 'nevyznamny', form: 'zadne' };
}

function zincOf(item: Ingredient): NutrientLevel {
  if (VNITRNOSTI.has(item.id)) return 'vyznamny';
  if (KORYSI.has(item.id)) return 'vyznamny';
  if (item.category === 'maso-ryby') return 'vyznamny';
  if (item.category === 'orechy-seminka-tuky') {
    // Semena a ořechy mají v načtené tabulce nejvyšší rozpětí ze všech
    // jmenovaných skupin, 2,9–7,8 mg na 100 g. Oleje ne, tuk zinek nenese.
    const jeTuk = item.id.startsWith('olej-') || item.id === 'mleko-kokosove';
    return jeTuk ? 'nevyznamny' : 'vyznamny';
  }
  if (item.category === 'lusteniny') return 'obsahuje';
  if (CELOZRNNE.has(item.id)) return 'obsahuje';
  if (item.category === 'mlecne-vejce') return 'obsahuje';
  if (item.category === 'obiloviny') return 'obsahuje';
  return 'nevyznamny';
}

function vitaminCOf(item: Ingredient): NutrientLevel {
  if (VITAMIN_C_VYZNAMNY.has(item.id)) return 'vyznamny';
  if (VITAMIN_C_OBSAHUJE.has(item.id)) return 'obsahuje';
  if (BEZ_VITAMINU_C.has(item.id)) return 'nevyznamny';
  // Zbytek čerstvého ovoce a zeleniny. Zdroje mluví o ovoci a zelenině jako
  // o skupině a doporučují pět porcí denně právě kvůli vitaminu C; tvrdit
  // o čerstvé malině nebo o rakytníku, že vitamin C nemá, by bylo proti nim.
  if (item.category === 'ovoce' || item.category === 'zelenina') return 'obsahuje';
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

