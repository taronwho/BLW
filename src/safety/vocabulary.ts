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

/**
 * Oslovení, které z rodiče dělá ženu, a shoda, která z dítěte dělá holčičku.
 *
 * Aplikaci používají oba rodiče. Kdykoli text řekne „zůstaň klidná" nebo
 * „když si nejsi jistá", vyřadí polovinu uživatelů; „dítě nabírá sama" je
 * navíc i chyba ve shodě — `dítě` je střední rod.
 *
 * Ve tvaru pro `findPatterns`, tedy bez diakritiky a s `*` pro kmen.
 */
export const GENDERED_ADDRESS_PATTERNS: readonly string[] = [
  // přísudek jmenný: „buď/zůstaň … -á"
  'jsi jista',
  'nejsi jista',
  'bys jista',
  'zustan klidna',
  'bud klidna',
  'bud opatrna',
  'bud trpeliva',
  'zustan opatrna',
  // minulý čas 2. osoby v ženském rodě
  'abys nemusela',
  'abys musela',
  'abys poznala',
  'abys vedela',
  'abys videla',
  'abys mela',
  'abys stihla',
  'abys nemela',
  'ses presvedcila',
  'ses naucila',
  'sis pripomnela',
  'ses ucila',
  'jsi videla',
  'jsi poznala',
  'jsi mela',
  // rodič jako matka
  'maminka',
  'maminku',
  'mamince',
  'maminkou',
];

/**
 * Ženský rod v oslovení rodiče a shoda po slově „dítě".
 *
 * Regulární výrazy nad textem bez diakritiky, ne vzory pro `findPatterns` —
 * mezi spojkou a špatným tvarem stojí pokaždé jiná slova.
 */
export const GENDERED_SECOND_PERSON_REGEXPS: readonly RegExp[] = [
  // „bys“ je vždycky 2. osoba jednotného čísla, takže příčestí za ním patří
  // rodiči. Ženský tvar tam tedy vylučuje polovinu uživatelů — na rozdíl od
  // „aby se chuť rozjasnila“, kde je podmětem věc.
  /\b(?:bys|abys|kdybys)\b(?:\s+\w+){0,4}\s+\w{2,}(?:la|ila|ala|ela|ovala|yla)\b/,
  /\baniz bys\b/,
];

/**
 * Shoda po slově „dítě". Střední rod, tedy `samo`, ne `sama`; `zvyklé`, ne
 * `zvyklá`.
 */
export const NEUTER_CHILD_REGEXPS: readonly RegExp[] = [
  /\bdite\b[^.!?]{0,80}\bsama\b/,
  /\bdite\b[^.!?]{0,80}\b(zvykla|jista|schopna|nucena|rada)\b/,
  /\bmiminko\b[^.!?]{0,80}\bsama\b/,
];

/**
 * Tvary, které v korektuře prošly českým slovníkem jako neexistující.
 *
 * Kontrola pravopisu proti hunspellovému slovníku je jednorázový audit —
 * potřebuje slovník o třech megabajtech a Python, což do `npm run validate`
 * nepatří. Co ale audit najde, se sem zapíše, aby se to nevrátilo příští
 * dávkou textů. Zapisuje se jen to, co slovník nezná a co má zřejmý správný
 * tvar; kuchařské termíny jako „poduš“ nebo „zvlažnět“ sem nepatří.
 *
 * Ve tvaru pro `findPatterns`, tedy bez diakritiky.
 */
export const KNOWN_TYPO_PATTERNS: readonly string[] = [
  'dosud podle chuti', // „dosuď“ je tvar od dosoudit, ne od dochutit
  'skvirkovat',
  'skvirkuje',
  'obermag',
  'nastroubany',
  'nastroubana',
  'nastroubane',
  'rozdruz',
  'rozdruzena',
  'rozdruzene',
  'redej', // rozkaz od ředit je „řeď“
  'srolej', // rozkaz od srolovat je „sroluj“
  'zadel vlacne', // rozkaz od zadělat je „zadělej“
];

