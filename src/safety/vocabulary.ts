/**
 * Slovníky zákazů podle docs/BEZPECNOST.md kapitola 2.
 *
 * Konvence (viz `findPatterns` v ./text.ts):
 *   "med"     = celé slovo, "medvěd" nález nevyvolá
 *   "medov*"  = kmen, matchne všechny tvary
 * Negace je v češtině předpona, takže "nesol" nebo "neosolený" neprojde
 * jako nález ani bez dalšího ošetření.
 */

/** Med ve všech tvarech (docs/BEZPECNOST.md: botulismus, zákaz do 12 měsíců). */
export const HONEY_PATTERNS: readonly string[] = [
  'med',
  'medu',
  'medem',
  'medy',
  'medov*',
  'medovnik*',
  'medovin*',
];

/** Přidávání soli. Zákaz se týká úkonu, ne zmínky o obsahu soli v surovině. */
export const SALT_ADD_PATTERNS: readonly string[] = [
  'osol*',
  'dosol*',
  'posol*',
  'prisol*',
  'solit',
  'solime',
  'solte',
  'slanime',
  'pridej sul',
  'pridat sul',
  'pridame sul',
  'pridej soli',
  'pridat soli',
  'spetka soli',
  'spetku soli',
  'spetkou soli',
  'dochut soli',
  'dochutit soli',
  'ochut soli',
  'bujon*',
  'masox*',
  'vyvar z kostky',
  'kostka na vyvar',
  'sojova omacka',
  'sojovou omacku',
  'sojove omacky',
  'uzenin*',
  'slanin*',
  'salam*',
];

/** Přidaný cukr a sladidla. */
export const SUGAR_PATTERNS: readonly string[] = [
  'cukr',
  'cukru',
  'cukrem',
  'cukry',
  'mouckovy cukr',
  'trtinovy cukr',
  'sirup',
  'sirupu',
  'sirupem',
  'sirupy',
  'javorovy sirup',
  'agave',
  'agavov*',
  'oslad*',
  'prislad*',
  'sladidl*',
  'fruktoz*',
  'glukozovy sirup',
  'ovocna stava',
  'ovocnou stavu',
  'ovocne stavy',
  'dzus',
  'dzusu',
  'melas*',
];

/** Ořechy a semínka — v dětské linii jen mleté / jako máslo nebo pasta. */
export const NUT_SEED_NOUNS: readonly string[] = [
  'orech',
  'orechy',
  'orechu',
  'orechum',
  'orechy',
  'orisk*',
  'mandle',
  'mandli',
  'mandlemi',
  'kesu',
  'arasid*',
  'pistacie',
  'para orech',
  'pekanov*',
  'seminka',
  'seminek',
  'seminky',
  'sezam',
  'sezamu',
  'mak',
  'maku',
  'makem',
  'chia',
  'slunecnice',
];

/** Tvary, ve kterých ořechy a semínka miminku patří. */
export const NUT_SAFE_FORMS: readonly string[] = [
  'mlet*',
  'maslo',
  'masla',
  'maslem',
  'masle',
  'pasta',
  'pasty',
  'pastou',
  'paste',
  'tahini',
  'rozmixov*',
  'rozdrcen*',
  'drcen*',
  'na prasek',
  'moucka',
  'moucky',
];

/** Živočišné složky, které v bezmasé variantě nemají co dělat. */
export const HIDDEN_ANIMAL_PATTERNS: readonly string[] = [
  'zelatin*',
  'sadlo',
  'sadla',
  'sadlem',
  'rybi omacka',
  'rybi omacku',
  'rybi omacky',
  'worcester*',
  'ancovick*',
  'zivocisne syridlo',
  'zivocisneho syridla',
  'syridlo zivocisneho',
  'parmazan*',
  'pecorino',
  'grana padano',
  'vyvar z kosti',
  'masovy vyvar',
  'kureci vyvar',
  'hovezi vyvar',
  'zelatinov*',
];

/** Zdroje bílkovin, které smí figurovat jako náhrada masa. */
export const PROTEIN_SWAP_SOURCES: readonly string[] = [
  'cocka',
  'cocky',
  'cockou',
  'cizrn*',
  'fazol*',
  'hrach',
  'hrachu',
  'hrasek',
  'hrasku',
  'tofu',
  'tempeh*',
  'edamame',
  'vejce',
  'vejci',
  'vajec',
  'tvaroh*',
  'jogurt*',
  'ricott*',
  'syr',
  'syru',
  'syrem',
  'syra',
  'mozzarell*',
  'lusteni*',
  'hummus*',
  'quinoa',
  'quinoy',
  'seitan*',
  'jahly',
];

/** Obecné fráze, které v `chokingReason` nic nevysvětlují. */
export const BANNED_GENERIC_PHRASES: readonly string[] = [
  'dbejte opatrnosti',
  'dbejte zvysene opatrnosti',
  'konzultujte s lekarem',
  'poradte se s lekarem',
  'budte opatrni',
  'pozor na dusen*',
  'obecne riziko',
  'muze byt nebezpecne',
  'je treba opatrnosti',
];

/** Zástupné texty, které v datech nesmí zůstat (CLAUDE.md pravidlo 7). */
export const PLACEHOLDER_PATTERNS: readonly string[] = [
  'todo',
  'lorem',
  'ipsum',
  'doplnit',
  'doplnit*',
  'xxx',
  'tbd',
  'fixme',
  'placeholder',
  'zatim nevyplneno',
];

/** Kulaté suroviny — musí se krájet podélně na čtvrtky. */
export const ROUND_SHAPE_MARKERS: readonly string[] = [
  'hrozn*',
  'boruvk*',
  'cherry*',
  'oliv*',
  'rybiz*',
  'angrest*',
  'tresn*',
  'visn*',
  'hrasek',
  'hrasku',
  'mozzarell*',
  'parek',
  'parky',
  'klobas*',
  'kulick*',
  'bobul*',
];

/** Pokyn k podélnému rozčtvrcení — vyžadovaný u kulatých surovin. */
export const LENGTHWISE_QUARTER_MARKERS: readonly string[] = ['podel*', 'na delku', 'po delce'];
export const QUARTER_MARKERS: readonly string[] = ['ctvrt*', 'na ctyri dily', 'na ctyri casti'];
