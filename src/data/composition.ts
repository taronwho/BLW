import type { SourceRef } from '@/types';
import {
  BP_VITAMIN_C,
  CZFCDB,
  MATVARETABELLEN,
  NHS_IRON,
  NHS_TRACE_MINERALS,
  NHS_VITAMIN_C,
  USDA_FDC,
  czfcdb,
  matvaretabellen,
  usdaFdc,
} from './ingredients/_sources';
import type { NutrientLevel } from './nutrients';

/**
 * Naměřený obsah živin, když je k dispozici.
 *
 * Zařazení do stupňů (viz src/data/nutrients.ts) stojí na skupinách potravin,
 * protože pro část katalogu číslo nemáme. Kde ho ale máme z potravinové
 * tabulky, je přesnější než jakákoli skupina — a tahle tabulka ho nese.
 * `nutrientProfile` dá naměřené hodnotě přednost před skupinou.
 *
 * PRAVIDLA ZÁPISU (docs/BEZPECNOST.md kap. 1 a 8):
 *  - hodnota je v miligramech na 100 g jedlého podílu,
 *  - bere se z národní potravinové tabulky, ne z článku ani z blogu,
 *  - zapisuje se jen číslo, které zdroj uvádí jako obsah, ne horní mez
 *    („až 300 mg/100 g" je maximum odrůdy, ne obsah běžné porce),
 *  - ke každé hodnotě patří zdroj a datum, kdy byl načten.
 *
 * V JAKÉM STAVU SE MĚŘÍ. Co se jí syrové — ovoce, salátová zelenina, ořechy,
 * semínka — má hodnotu za syrový stav. Co se syrové nejí — brambory, batáty,
 * dýně, luštěniny, obiloviny, maso a ryby — má hodnotu za stav, ve kterém se
 * podává, tedy uvařené nebo upečené bez soli. Je to podstatný rozdíl: suchá
 * čočka má železa přes 5 mg na 100 g, uvařená 2,3 mg, a na talíři je uvařená.
 * Mouky, vločky a krupice jsou měřené suché, jak se prodávají; u nich je to
 * v poznámce, protože v hotové kaši obsah ve 100 g klesne o tolik, kolik se
 * přidá vody.
 *
 * PROČ NĚKDE ČÍSLO CHYBÍ. Když tabulka pro živinu hodnotu nemá nebo uvádí
 * nulu, řádek ji prostě neobsahuje a zařazení té živiny se řídí dál skupinou.
 * Bez čísla zůstalo 169 z 301 surovin katalogu: dvacet z nich jsou
 * bylinky a koření, které se podle docs/BEZPECNOST.md kap. 8 do živin
 * nepočítají vůbec (špetka příjem neposune), zbytek jsou položky, které žádná
 * z povolených tabulek nevede — žitné, ječné a špaldové vločky, kukuřičné
 * lupínky bez cukru, mascarpone, grana padano, skyr, acidofilní mléko,
 * lískooříškové máslo, dýňový a řepkový olej, sójový nápoj, kokosový jogurt
 * a pitná voda s čajem, u kterých by číslo stejně nic neznamenalo.
 *
 * ODKUD ČÍSLA JSOU. Pořadí zdrojů drží docs/BEZPECNOST.md kap. 1: nejdřív
 * Česká databáze složení potravin (ÚZEI), co v ní není, z USDA FoodData
 * Central, a teprve co nemá ani ta, z norské Matvaretabellen — tam skončil
 * jen rakytník, aronie, kefír a ovesný nápoj. Česká tabulka u rostlinných
 * potravin zpravidla neuvádí zinek; u ořechů, semínek, vajec a několika
 * obilovin je proto vitamin C a železo z české tabulky a zinek z USDA.
 * Každá hodnota nese vlastní odkaz, takže je vždycky vidět, která je odkud.
 */

/** Jedna naměřená hodnota i s tabulkou, ze které je. */
export interface Hodnota {
  /** Miligramy na 100 g jedlého podílu. */
  mg: number;
  zdroj: SourceRef;
}

export interface Slozeni {
  vitaminC?: Hodnota;
  iron?: Hodnota;
  zinc?: Hodnota;
  /** Co by u hodnoty bez vysvětlení mátlo — stav potraviny, míchané zdroje. */
  poznamka?: string;
}

/**
 * Denní potřeba dospělého podle NHS.
 *
 * Z každé živiny se bere vyšší z hodnot, které NHS pro dospělé uvádí — práh
 * je tím přísnější. Slouží jen k porovnání potravin mezi sebou, ne k dávkování
 * dítěte; to aplikace nedělá a dělat nebude.
 */
export const DENNI_POTREBA = {
  /** NHS: dospělí 19–64 potřebují 40 mg vitaminu C denně. */
  vitaminC: 40,
  /** NHS: 8,7 mg muži, 14,8 mg ženy 19–49. */
  iron: 14.8,
  /** NHS: 9,5 mg muži, 7 mg ženy. */
  zinc: 9.5,
} as const;

/**
 * Podíl denní potřeby, od kterého se potravina počítá za zdroj živiny.
 *
 * Patnáct procent denní potřeby ve 100 g je hranice, od které se vitamin nebo
 * minerální látka vůbec smí na obalu uvést; „vysoký obsah" je dvojnásobek.
 * Aplikace používá stejnou hranici, aby „obsahuje" a „významný zdroj"
 * znamenaly totéž co na etiketě, a ne něco vymyšleného.
 */
export const PODIL_OBSAHUJE = 0.15;
export const PODIL_VYZNAMNY = 0.3;

export type Zivina = keyof typeof DENNI_POTREBA;

/** Práh v miligramech na 100 g, od kterého živina dosáhne dané úrovně. */
export function prah(zivina: Zivina, uroven: 'obsahuje' | 'vyznamny'): number {
  const podil = uroven === 'vyznamny' ? PODIL_VYZNAMNY : PODIL_OBSAHUJE;
  return DENNI_POTREBA[zivina] * podil;
}

/** Úroveň z naměřené hodnoty. */
export function urovenZObsahu(zivina: Zivina, mg: number): NutrientLevel {
  if (mg >= prah(zivina, 'vyznamny')) return 'vyznamny';
  if (mg >= prah(zivina, 'obsahuje')) return 'obsahuje';
  return 'nevyznamny';
}

/**
 * Hodnoty z jednoho řádku tabulky.
 *
 * Zapisuje se `z({ vitaminC: 92.7, iron: 0.3 }, czfcdb('Kiwi', 39))` — jeden
 * odkaz na potravinu, z něj všechny živiny, které ten řádek uvádí.
 */
function z(hodnoty: Partial<Record<Zivina, number>>, zdroj: SourceRef): Slozeni {
  const out: Slozeni = {};
  for (const [zivina, mg] of Object.entries(hodnoty) as Array<[Zivina, number]>) {
    out[zivina] = { mg, zdroj };
  }
  return out;
}

/**
 * Naměřené hodnoty po surovinách.
 *
 * Řazeno jako katalog, ne abecedně — když se něco doplňuje, hledá se to
 * u sousedů ze stejné kategorie.
 */
export const COMPOSITION: Readonly<Record<string, Slozeni>> = {
  /* Ovoce */
  'jablko': z({ vitaminC: 9.3, iron: 0.4 }, czfcdb('Jablka', 37)),
  'hruska': z({ vitaminC: 3.7, iron: 0.4 }, czfcdb('Hrušky', 36)),
  'banan': z({ vitaminC: 14.3, iron: 0.7 }, czfcdb('Banány', 32)),
  'avokado': z({ vitaminC: 10, iron: 0.55, zinc: 0.64 }, usdaFdc('Avocados, raw, all commercial varieties', 171705)),
  'svestka': z({ vitaminC: 4.7, iron: 0.8 }, czfcdb('Švestky', 44)),
  'merunka': z({ vitaminC: 10.5, iron: 0.7 }, czfcdb('Meruňky', 40)),
  'broskev': z({ vitaminC: 6.6, iron: 0.8 }, czfcdb('Broskve', 34)),
  'nektarinka': z({ vitaminC: 5.4, iron: 0.3 }, czfcdb('Nektarinky', 360)),
  'tresne': z({ vitaminC: 10.1, iron: 0.5 }, czfcdb('Třešně', 45)),
  'visne': z({ vitaminC: 8.9, iron: 0.6 }, czfcdb('Višně', 46)),
  'jahody': z({ vitaminC: 66.6, iron: 0.82 }, czfcdb('Jahody zahradní', 38)),
  'boruvky': z({ vitaminC: 15.7, iron: 0.7 }, czfcdb('Borůvky', 33)),
  'maliny': z({ vitaminC: 24.3, iron: 1 }, czfcdb('Maliny', 333)),
  'ostruziny': z({ vitaminC: 17.9, iron: 0.8 }, czfcdb('Ostružiny', 334)),
  'rybiz-cerveny': z({ vitaminC: 34.5, iron: 1.1 }, czfcdb('Rybíz červený', 43)),
  'rybiz-cerny': z({ vitaminC: 166, iron: 1.4 }, czfcdb('Rybíz černý', 42)),
  'angrest': z({ vitaminC: 29.7, iron: 0.6 }, czfcdb('Angrešt', 366)),
  'hroznove-vino': {
    ...z({ vitaminC: 3.8, iron: 0.8 }, czfcdb('Víno - hrozny', 373)),
    poznamka: 'Tabulka vede stolní i moštové hrozny pod heslem „Víno – hrozny“.',
  },
  'meloun-vodni': z({ vitaminC: 8.1, iron: 0.24, zinc: 0.1 }, usdaFdc('Watermelon, raw', 167765)),
  'meloun-cantaloupe': z({ vitaminC: 36.7, iron: 0.21, zinc: 0.18 }, usdaFdc('Melons, cantaloupe, raw', 169092)),
  'mango': z({ vitaminC: 38, iron: 0.4 }, czfcdb('Mango', 365)),
  'ananas': z({ vitaminC: 20.6, iron: 0.7 }, czfcdb('Ananas', 332)),
  'kiwi': z({ vitaminC: 92.7, iron: 0.3 }, czfcdb('Kiwi', 39)),
  'pomeranc': z({ vitaminC: 50.7, iron: 0.7 }, czfcdb('Pomeranče', 41)),
  'mandarinka': z({ vitaminC: 26.7, iron: 0.15, zinc: 0.07 }, usdaFdc('Tangerines, (mandarin oranges), raw', 169105)),
  'citron': z({ vitaminC: 49, iron: 0.8 }, czfcdb('Citróny', 35)),
  'limetka': z({ vitaminC: 29.1, iron: 0.6, zinc: 0.11 }, usdaFdc('Limes, raw', 168155)),
  'fik-cerstvy': z({ vitaminC: 2, iron: 0.4 }, czfcdb('Fíky', 362)),
  'datle': z({ vitaminC: 3, iron: 1 }, czfcdb('Datle, sušené', 364)),
  'rozinky': {
    ...z({ vitaminC: 2.3, iron: 1.9 }, czfcdb('Rozinky bez jadérek', 47)),
    poznamka: 'Hodnota platí pro rozinky bez jadérek, tedy pro ty, co se běžně prodávají.',
  },
  'susene-merunky': {
    ...z({ vitaminC: 1, iron: 2.66, zinc: 0.39 }, usdaFdc('Apricots, dried, sulfured, uncooked', 173941)),
    poznamka: 'Tabulka měří sířené sušené meruňky, což je běžné zboží.',
  },
  'susene-svestky': z({ vitaminC: 0.6, iron: 0.93, zinc: 0.44 }, usdaFdc('Plums, dried (prunes), uncooked', 168162)),
  'brusinky-susene': {
    ...z({ vitaminC: 0.2, iron: 0.39, zinc: 0.1 }, usdaFdc('Cranberries, dried, sweetened (Includes foods for USDA\'s Food Distribution Program)', 171723)),
    poznamka: 'Sušené brusinky se slazené; tabulka měří právě takové, jaké jsou v obchodě.',
  },
  'papaja': z({ vitaminC: 60.9, iron: 0.25, zinc: 0.08 }, usdaFdc('Papayas, raw', 169926)),
  'jablecne-pyre-bez-cukru': {
    ...z({ vitaminC: 1, iron: 0.23, zinc: 0.03 }, usdaFdc('Applesauce, canned, unsweetened, without added ascorbic acid (Includes foods for USDA\'s Food Distribution Program)', 171695)),
    poznamka: 'Měřeno pyré bez cukru a bez přidané kyseliny askorbové; ta by hodnotu vitaminu C uměle zvedla.',
  },
  'kaki': z({ vitaminC: 7.5, iron: 0.15, zinc: 0.11 }, usdaFdc('Persimmons, japanese, raw', 169941)),
  'fiky-susene': z({ vitaminC: 1.2, iron: 2 }, czfcdb('Fíky, sušené', 363)),
  'grapefruit': z({ vitaminC: 42.8, iron: 0.3 }, czfcdb('Grapefruit', 361)),
  'pomelo': z({ vitaminC: 61, iron: 0.11, zinc: 0.08 }, usdaFdc('Pummelo, raw', 167754)),
  'meloun-zluty': z({ vitaminC: 18, iron: 0.17, zinc: 0.09 }, usdaFdc('Melons, honeydew, raw', 169911)),
  'lici': z({ vitaminC: 71.5, iron: 0.31, zinc: 0.07 }, usdaFdc('Litchis, raw', 169086)),
  'granatove-jablko': z({ vitaminC: 10.2, iron: 0.3, zinc: 0.35 }, usdaFdc('Pomegranates, raw', 169134)),
  'mucenka': z({ vitaminC: 30, iron: 1.6, zinc: 0.1 }, usdaFdc('Passion-fruit, (granadilla), purple, raw', 169108)),
  'kokos-strouhany': {
    ...z({ vitaminC: 1.5, zinc: 2.01 }, usdaFdc('Nuts, coconut meat, dried (desiccated), not sweetened', 170170)),
    ...z({ iron: 3.6 }, czfcdb('Kokos mletý', 89)),
    poznamka: 'Vitamin C a zinek česká tabulka u kokosu neuvádí, jsou proto z USDA; železo je české.',
  },
  'brusinky-cerstve': z({ vitaminC: 14, iron: 0.23, zinc: 0.09 }, usdaFdc('Cranberries, raw', 171722)),
  'aronie': {
    ...z({ vitaminC: 28, iron: 0.9, zinc: 0.3 }, matvaretabellen('Aronia, svartsurbær, rå', 'aronia-svartsurbaer-ra')),
    poznamka: 'Česká ani americká tabulka aronii nemají; hodnota je z norské tabulky, poslední z povolených, která ji uvádí.',
  },
  'rakytnik': {
    ...z({ vitaminC: 131, iron: 0.7, zinc: 0.3 }, matvaretabellen('Tindved, havtorn, rå', 'tindved-havtorn-ra')),
    poznamka: 'Česká ani americká tabulka rakytník nemají; hodnota je z norské tabulky. Vysoké hodnoty z článků o rakytníku bývají horní meze — tohle je naměřený obsah.',
  },

  /* Obiloviny */
  'ovesne-vlocky-jemne': {
    ...z({ iron: 4.4 }, czfcdb('Vločky ovesné', 188)),
    ...z({ zinc: 3.64 }, usdaFdc('Cereals, oats, regular and quick, not fortified, dry', 173904)),
    poznamka: 'Měřeno v suchých vločkách, jak se prodávají. V hotové kaši je obsah ve 100 g nižší, protože se přidá voda nebo mléko.',
  },
  'ovesne-vlocky-velke': {
    ...z({ iron: 4.4 }, czfcdb('Vločky ovesné', 188)),
    ...z({ zinc: 3.64 }, usdaFdc('Cereals, oats, regular and quick, not fortified, dry', 173904)),
    poznamka: 'Měřeno v suchých vločkách, jak se prodávají. V hotové kaši je obsah ve 100 g nižší.',
  },
  'oves-bezlepkovy': z({ iron: 4.1, zinc: 2.5 }, czfcdb('Oves nahý', 163)),
  'mouka-psenicna-hladka': z({ iron: 1, zinc: 0.73 }, czfcdb('Mouka pšeničná, hladká, světlá, T 530, obsah popela max. 0,6 % v suš.', 146)),
  'mouka-psenicna-celozrnna': z({ iron: 3.7, zinc: 2.7 }, czfcdb('Mouka, pšeničná, celozrnná, T 1700, obsah popela max. 1,9 % v suš.', 150)),
  'mouka-spaldova': {
    ...z({ iron: 3.769, zinc: 3.591 }, usdaFdc('Flour, spelt, whole grain', 2003587)),
    poznamka: 'Tabulka vede celozrnnou špaldovou mouku.',
  },
  'mouka-zitna': {
    ...z({ iron: 2.3 }, czfcdb('Mouka žitná', 339)),
    ...z({ zinc: 2.17 }, usdaFdc('Rye flour, medium', 168886)),
    poznamka: 'Železo z české tabulky, zinek z USDA.',
  },
  'chleb-kvaskovy': {
    ...z({ iron: 1.5, zinc: 1.2 }, czfcdb('Chléb pšenično-žitný, Šumava', 195)),
    poznamka: 'Tabulka vede pšenično-žitný chléb typu Šumava.',
  },
  'chleb-toustovy': {
    ...z({ iron: 1.5 }, czfcdb('Chléb pšeničný bílý', 198)),
    ...z({ zinc: 0.74 }, usdaFdc('Bread, white, commercially prepared (includes soft bread crumbs)', 174924)),
    poznamka: 'Železo z české tabulky (bílý pšeničný chléb), zinek z USDA.',
  },
  'rohlik-houska': z({ iron: 0.9, zinc: 0.7 }, czfcdb('Rohlík bílý', 196)),
  'testoviny-semolinove': {
    ...z({ iron: 0.5, zinc: 0.51 }, usdaFdc('Pasta, cooked, unenriched, without added salt', 168928)),
    poznamka: 'Měřeno vařené, neobohacené, bez přidané soli.',
  },
  'testoviny-celozrnne': {
    ...z({ iron: 0.6, zinc: 0.73 }, czfcdb('Těstoviny, bezvaječné, celozrnné, vařené v nesolené vodě', 503)),
    poznamka: 'Měřeno vařené v nesolené vodě, tak se podávají.',
  },
  'kuskus': {
    ...z({ iron: 0.38, zinc: 0.26 }, usdaFdc('Couscous, cooked', 169700)),
    poznamka: 'Měřeno uvařený ve vodě, tak se podává. Suchý má živin víc, ale ten se nejí.',
  },
  'bulgur': {
    ...z({ iron: 0.96, zinc: 0.57 }, usdaFdc('Bulgur, cooked', 170287)),
    poznamka: 'Měřeno uvařený ve vodě, tak se podává. Suchý má živin víc, ale ten se nejí.',
  },
  'ryze-basmati': {
    ...z({ iron: 0.1, zinc: 0.62 }, czfcdb('Rýže loupaná, dušená v nesolené vodě', 504)),
    poznamka: 'Tabulka vede bílou loupanou rýži dušenou v nesolené vodě, odrůdy nerozlišuje.',
  },
  'ryze-kulatozrnna': {
    ...z({ iron: 0.1, zinc: 0.62 }, czfcdb('Rýže loupaná, dušená v nesolené vodě', 504)),
    poznamka: 'Měřeno dušená v nesolené vodě, tak se podává.',
  },
  'ryze-natural': {
    ...z({ iron: 0.3, zinc: 1 }, czfcdb('Rýže neloupaná (natural), dušená v nesolené vodě', 505)),
    poznamka: 'Měřeno dušená v nesolené vodě, tak se podává.',
  },
  'ryzove-chlebicky': {
    ...z({ iron: 1.17, zinc: 2.22 }, usdaFdc('Snacks, rice cakes, brown rice, corn', 169679)),
    poznamka: 'Měřeno chlebíčky z natural rýže s kukuřicí.',
  },
  'jahly': {
    ...z({ iron: 0.63, zinc: 0.91 }, usdaFdc('Millet, cooked', 168871)),
    poznamka: 'Měřeno uvařené ve vodě, tak se podávají. Suché jáhly mají živin víc.',
  },
  'pohanka-lamanka': {
    ...z({ iron: 0.8, zinc: 0.61 }, usdaFdc('Buckwheat groats, roasted, cooked', 170686)),
    poznamka: 'Měřeno vařená ve vodě. Tabulka lámanku a kroupy nerozlišuje.',
  },
  'pohanka-kroupy': {
    ...z({ iron: 0.8, zinc: 0.61 }, usdaFdc('Buckwheat groats, roasted, cooked', 170686)),
    poznamka: 'Měřeno vařená ve vodě. Tabulka lámanku a kroupy nerozlišuje.',
  },
  'quinoa': {
    ...z({ iron: 1.49, zinc: 1.09 }, usdaFdc('Quinoa, cooked', 168917)),
    poznamka: 'Měřeno uvařená ve vodě, tak se podává. Suchá quinoa má živin víc.',
  },
  'amarant': {
    ...z({ iron: 2.1, zinc: 0.86 }, usdaFdc('Amaranth grain, cooked', 170683)),
    poznamka: 'Měřeno uvařený ve vodě, tak se podává. Suchý amarant má živin víc.',
  },
  'polenta': {
    ...z({ iron: 1.7 }, czfcdb('Krupice kukuřičná, T600', 187)),
    poznamka: 'Tabulka vede kukuřičnou krupici T600, ze které se polenta vaří.',
  },
  'krupice-psenicna': z({ iron: 0.5, zinc: 0.56 }, czfcdb('Krupice, pšeničná, hrubá, T 480, obsah popele max. 0,5 % v suš.', 149)),
  'kroupy-jecne': {
    ...z({ iron: 1.33, zinc: 0.82 }, usdaFdc('Barley, pearled, cooked', 170285)),
    poznamka: 'Měřeno uvařené ve vodě, tak se podávají. Suché kroupy mají živin víc.',
  },
  'strouhanka': {
    ...z({ iron: 1.2 }, czfcdb('Strouhanka', 189)),
    ...z({ zinc: 0.74 }, usdaFdc('Bread, white, commercially prepared (includes soft bread crumbs)', 174924)),
    poznamka: 'Železo z české tabulky, zinek z USDA (bílé pečivo).',
  },
  'tortilla-psenicna': z({ iron: 3.3, zinc: 0.71 }, usdaFdc('Tortillas, ready-to-bake or -fry, flour, without added calcium', 173242)),
  'mouka-ryzova': z({ iron: 0.35, zinc: 0.8 }, usdaFdc('Rice flour, white, unenriched', 169714)),
  'mouka-kukuricna': {
    ...z({ iron: 2.99, zinc: 3.1 }, usdaFdc('Cornmeal, yellow (Navajo)', 168039)),
    poznamka: 'Tabulka vede kukuřičnou mouku pod názvem Cornmeal, yellow.',
  },
  'mouka-pohankova': z({ iron: 4.06, zinc: 3.12 }, usdaFdc('Buckwheat flour, whole-groat', 170687)),
  'mouka-ovesna': {
    ...z({ iron: 5.5 }, czfcdb('Mouka ovesná', 343)),
    ...z({ zinc: 2.7 }, matvaretabellen('Havremel', 'havremel')),
    poznamka: 'Železo je z české tabulky, zinek z norské — česká ho u ovesné mouky neuvádí.',
  },
  'mouka-sojova': {
    ...z({ iron: 6.37, zinc: 3.92 }, usdaFdc('Soy flour, full-fat, raw', 174273)),
    poznamka: 'Tabulka vede plnotučnou sójovou mouku.',
  },
  'ryzove-nudle': {
    ...z({ iron: 0.14, zinc: 0.25 }, usdaFdc('Rice noodles, cooked', 168914)),
    poznamka: 'Měřeno uvařené ve vodě, tak se podávají.',
  },
  'tapiokovy-skrob': {
    ...z({ iron: 1.58, zinc: 0.12 }, usdaFdc('Tapioca, pearl, dry', 169717)),
    poznamka: 'Tabulka vede tapiokové perly v suchém stavu.',
  },

  /* Zelenina */
  'mrkev': z({ vitaminC: 4.5, iron: 1.1 }, czfcdb('Mrkev', 62)),
  'pastinak': z({ vitaminC: 17, iron: 0.59, zinc: 0.59 }, usdaFdc('Parsnips, raw', 170417)),
  'petrzel-koren': z({ vitaminC: 45, iron: 1.5 }, czfcdb('Petržel, kořen', 67)),
  'celer-bulva': z({ vitaminC: 11, iron: 0.6 }, czfcdb('Celer bulvový', 50)),
  'cervena-repa': z({ vitaminC: 10, iron: 0.7 }, czfcdb('Řepa červená', 72)),
  'batat': {
    ...z({ vitaminC: 19.6, iron: 0.69, zinc: 0.32 }, usdaFdc('Sweet potato, cooked, baked in skin, flesh, without salt', 168483)),
    poznamka: 'Měřeno pečený ve slupce a bez soli, tak se podává.',
  },
  'brambor': {
    ...z({ vitaminC: 7.4, iron: 0.31, zinc: 0.27 }, usdaFdc('Potatoes, boiled, cooked without skin, flesh, without salt', 170440)),
    poznamka: 'Měřeno vařené bez slupky a bez soli, tak se podávají.',
  },
  'dyne-hokaido': {
    ...z({ vitaminC: 9.6, iron: 0.44, zinc: 0.22 }, usdaFdc('Squash, winter, all varieties, cooked, baked, without salt', 170490)),
    poznamka: 'Tabulka hokkaido zvlášť nevede; hodnota je za pečenou zimní dýni bez rozlišení odrůdy.',
  },
  'dyne-maslova': {
    ...z({ vitaminC: 15.1, iron: 0.6, zinc: 0.13 }, usdaFdc('Squash, winter, butternut, cooked, baked, without salt', 169296)),
    poznamka: 'Měřeno pečená bez soli, tak se dětem podává.',
  },
  'cuketa': z({ vitaminC: 12.8, iron: 1 }, czfcdb('Cuketa', 52)),
  'patizon': z({ vitaminC: 18, iron: 0.4, zinc: 0.29 }, usdaFdc('Squash, summer, scallop, raw', 169289)),
  'lilek': z({ vitaminC: 2.2, iron: 0.23, zinc: 0.16 }, usdaFdc('Eggplant, raw', 169228)),
  'brokolice': {
    ...z({ vitaminC: 121, iron: 1.1 }, czfcdb('Brokolice', 49)),
    ...z({ zinc: 0.41 }, usdaFdc('Broccoli, raw', 170379)),
    poznamka: 'Vitamin C a železo z české tabulky, zinek z USDA.',
  },
  'kvetak': z({ vitaminC: 76.8, iron: 0.6 }, czfcdb('Květák', 61)),
  'kedlubna': z({ vitaminC: 48.1, iron: 1.3 }, czfcdb('Kedlubna', 58)),
  'zeli-bile': z({ vitaminC: 44, iron: 0.5 }, czfcdb('Zelí hlávkové, bílé', 76)),
  'kapusta-hlavkova': z({ vitaminC: 94.8, iron: 1.7 }, czfcdb('Kapusta hlávková', 56)),
  'kapusta-kaderava': z({ vitaminC: 93.4, iron: 1.6, zinc: 0.39 }, usdaFdc('Kale, raw', 168421)),
  'ruzickova-kapusta': z({ vitaminC: 95.2, iron: 1.1 }, czfcdb('Kapusta růžičková', 57)),
  'hrasek-zeleny': {
    ...z({ vitaminC: 14.2, iron: 1.54, zinc: 1.19 }, usdaFdc('Peas, green, cooked, boiled, drained, without salt', 170420)),
    poznamka: 'Měřeno vařený a scezený, bez soli.',
  },
  'fazolky-zelene': {
    ...z({ vitaminC: 9.7, iron: 0.65, zinc: 0.25 }, usdaFdc('Beans, snap, green, cooked, boiled, drained, without salt', 169141)),
    poznamka: 'Měřeno vařené a scezené, bez soli.',
  },
  'kukurice-cukrova': {
    ...z({ vitaminC: 5.5, iron: 0.45, zinc: 0.62 }, usdaFdc('Corn, sweet, yellow, cooked, boiled, drained, without salt', 169999)),
    poznamka: 'Měřeno vařená a scezená, bez soli.',
  },
  'spenat': z({ vitaminC: 60, iron: 3.3 }, czfcdb('Špenát', 74)),
  'mangold': z({ vitaminC: 30, iron: 1.8, zinc: 0.36 }, usdaFdc('Chard, swiss, raw', 169991)),
  'rukola': z({ vitaminC: 15, iron: 1.46, zinc: 0.47 }, usdaFdc('Arugula, raw', 169387)),
  'hlavkovy-salat': z({ vitaminC: 3.7, iron: 1.24, zinc: 0.2 }, usdaFdc('Lettuce, butterhead (includes boston and bibb types), raw', 168429)),
  'okurka-salatova': z({ vitaminC: 2.8, iron: 0.28, zinc: 0.2 }, usdaFdc('Cucumber, with peel, raw', 168409)),
  'rajce': z({ vitaminC: 18.7, iron: 0.7 }, czfcdb('Rajčata', 70)),
  'paprika-sladka': z({ vitaminC: 191, iron: 0.5 }, czfcdb('Paprika zeleninová, červená', 65)),
  'porek': z({ vitaminC: 25, iron: 2.2 }, czfcdb('Pórek', 69)),
  'cibule': z({ vitaminC: 8.2, iron: 0.5 }, czfcdb('Cibule', 51)),
  'cesnek': z({ vitaminC: 17, iron: 1.3 }, czfcdb('Česnek', 53)),
  'fenykl-hliza': z({ vitaminC: 12, iron: 0.73, zinc: 0.2 }, usdaFdc('Fennel, bulb, raw', 169385)),
  'chrest': {
    ...z({ vitaminC: 7.7, iron: 0.91, zinc: 0.6 }, usdaFdc('Asparagus, cooked, boiled, drained', 168390)),
    poznamka: 'Měřeno vařený a scezený, bez soli.',
  },
  'zampiony': z({ vitaminC: 3.2, iron: 1.3 }, czfcdb('Žampiony', 246)),
  'hliva-ustricna': z({ iron: 1.33, zinc: 0.77 }, usdaFdc('Mushrooms, oyster, raw', 168580)),
  'redkvicka': z({ vitaminC: 23.2, iron: 1 }, czfcdb('Ředkvička', 71)),
  'turin': z({ vitaminC: 25, iron: 0.44, zinc: 0.24 }, usdaFdc('Rutabagas, raw', 168454)),
  'dyne-spagetova': {
    ...z({ vitaminC: 3.5, iron: 0.34, zinc: 0.2 }, usdaFdc('Squash, winter, spaghetti, cooked, boiled, drained, or baked, without salt', 169299)),
    poznamka: 'Měřeno vařená nebo pečená, bez soli.',
  },
  'artycok': {
    ...z({ vitaminC: 7.4, iron: 0.61, zinc: 0.4 }, usdaFdc('Artichokes, (globe or french), cooked, boiled, drained, without salt', 168386)),
    poznamka: 'Měřeno vařený a scezený, bez soli.',
  },
  'redkev-bila': z({ vitaminC: 24.8, iron: 1.1 }, czfcdb('Ředkev bílá', 491)),
  'celer-rapikaty': z({ vitaminC: 3.1, iron: 0.2, zinc: 0.13 }, usdaFdc('Celery, raw', 169988)),
  'pekingske-zeli': z({ vitaminC: 27, iron: 0.5 }, czfcdb('Zelí čínské', 75)),
  'polnicek': z({ vitaminC: 38.2, iron: 2.18, zinc: 0.59 }, usdaFdc('Cornsalad, raw', 169219)),
  'zeli-kysane': {
    ...z({ vitaminC: 14.7, iron: 1.47, zinc: 0.19 }, usdaFdc('Sauerkraut, canned, solids and liquids', 169279)),
    poznamka: 'Měřeno kysané zelí i s nálevem.',
  },
  'rajcatovy-protlak': z({ vitaminC: 54.4, iron: 2 }, czfcdb('Protlak rajčatový', 396)),
  'rajcata-loupana-konzerva': {
    ...z({ vitaminC: 12.6, iron: 0.57, zinc: 0.12 }, usdaFdc('Tomatoes, red, ripe, canned, packed in tomato juice', 170051)),
    poznamka: 'Měřeno loupaná rajčata v rajčatové šťávě.',
  },
  'zeli-cervene': z({ vitaminC: 52, iron: 0.6 }, czfcdb('Zelí hlávkové, červené', 77)),
  'jarni-cibulka': z({ vitaminC: 18.8, iron: 1.48, zinc: 0.39 }, usdaFdc('Onions, spring or scallions (includes tops and bulb), raw', 170005)),
  'salotka': z({ vitaminC: 8, iron: 1.2, zinc: 0.4 }, usdaFdc('Shallots, raw', 170499)),
};

/**
 * Zdroje, o které se číselná vrstva opírá.
 *
 * Tady jsou jen databáze jako celek a podklady pro denní potřebu; odkaz na
 * konkrétní potravinu nese každá hodnota v `COMPOSITION` sama.
 */
export const COMPOSITION_SOURCES: readonly SourceRef[] = [
  CZFCDB,
  USDA_FDC,
  MATVARETABELLEN,
  NHS_VITAMIN_C,
  NHS_IRON,
  NHS_TRACE_MINERALS,
  BP_VITAMIN_C,
];
