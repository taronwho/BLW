import type { SourceRef } from '@/types';

/**
 * Ověřené zdroje katalogu surovin.
 *
 * Politika domén je v docs/BEZPECNOST.md kapitola 1, technicky ji hlídá
 * pravidlo `source-url-shape` v src/safety/rules.ts.
 *
 * OVĚŘENÍ K 12. 9. 2026: všechny odkazy s datem `FETCHED` byly v této session
 * skutečně staženy (curl, HTTP 200) a jejich obsah přečten — ne jen dohledán
 * vyhledávačem. Datum u zdroje zvyšuj jen tehdy, když jsi stránku sám znovu
 * načetl.
 *
 * DVĚ VÝJIMKY, které se načíst nepodařilo:
 *
 * 1. `MZCR_COMPLEMENTARY` — `www.mzcr.cz` odpovídá `301` na `mzd.gov.cz`.
 *    Ministerstvo zdravotnictví přešlo na doménu `mzd.gov.cz`, kterou
 *    docs/BEZPECNOST.md zatím nemá v seznamu povolených domén. Odkaz proto
 *    zůstává na původní adrese a s původním datem ověření; nezvyšuj ho,
 *    dokud se dokument nedá načíst.
 * 2. Články EFSA Journal (`/en/efsajournal/pub/<číslo>`) dnes přesměrovávají
 *    na `efsa.onlinelibrary.wiley.com`, tedy mimo povolené domény. Proto se
 *    u arsenu cituje tisková zpráva a shrnutí, které EFSA hostuje na vlastní
 *    doméně — obojí bylo načtené.
 *
 * Totéž platí o `szu.cz`: kořen domény přesměrovává na `szu.gov.cz`, ale
 * `epoz.szu.cz` (kde leží citovaný manuál) odpovídá a byl načtený.
 */

/** Datum ověření zdrojů, které se v této session nepodařilo načíst. */
const UNVERIFIED_TODAY = '2026-09-11';

/** Datum, kdy byl zdroj skutečně stažen a přečten (curl, HTTP 200). */
const FETCHED = '2026-09-12';

function nhs(title: string, path: string, accessedAt = FETCHED): SourceRef {
  return { org: 'NHS', title, url: `https://www.nhs.uk${path}`, accessedAt, tier: 1 };
}

/** Zákazy pro dětskou linii: sůl, cukr, med, celé ořechy, syrové vejce, rýžové nápoje. */
export const NHS_AVOID = nhs(
  'Foods to avoid giving babies and young children',
  '/baby/weaning-and-feeding/foods-to-avoid-giving-babies-and-young-children/',
  FETCHED,
);

/** První příkrmy, měkké vařené hranolky, velikost soust do ruky. */
export const NHS_FIRST_FOODS = nhs(
  "Your baby's first solid foods",
  '/baby/weaning-and-feeding/babys-first-solid-foods/',
  FETCHED,
);

/** Co nabízet kolem 6 měsíců. */
export const NHS_6M = nhs(
  '6 months – Feeding your baby',
  '/best-start-in-life/baby/weaning/what-to-feed-your-baby/from-around-6-months/',
  FETCHED,
);

/** Posun textur a samostatné jedení mezi 7. a 9. měsícem. */
export const NHS_7_9M = nhs(
  '7 to 9 months – Feeding your baby',
  '/best-start-in-life/baby/weaning/what-to-feed-your-baby/7-to-9-months/',
  FETCHED,
);

/** Rodinná strava a tvrdší textury mezi 10. a 12. měsícem. */
export const NHS_10_12M = nhs(
  '10 to 12 months – Feeding your baby',
  '/best-start-in-life/baby/weaning/what-to-feed-your-baby/10-to-12-months/',
  FETCHED,
);

/** Bezpečná příprava: čtvrcení kulatého ovoce, pecky, kosti, slupky. */
export const NHS_PREP_SAFELY = nhs(
  'Preparing food safely for babies',
  '/best-start-in-life/baby/weaning/safe-weaning/preparing-food-safely/',
  FETCHED,
);

/** Zavádění alergenů od šesti měsíců a opakovaná expozice. */
export const NHS_ALLERGY = nhs(
  'Baby food allergies',
  '/best-start-in-life/baby/weaning/safe-weaning/food-allergies/',
  FETCHED,
);

/** Ryby: dravé ryby s rtutí, porce tučných ryb, syroví korýši. */
export const NHS_FISH = nhs(
  'Fish and shellfish',
  '/live-well/eat-well/food-types/fish-and-shellfish-nutrition/',
);

/** Játra a kumulace retinolu. */
export const NHS_VITAMIN_A = nhs('Vitamin A', '/conditions/vitamins-and-minerals/vitamin-a/');

/** Plnotučné mléčné výrobky, pasterizace, kravské mléko do vaření. */
export const NHS_YOUNG_CHILDREN = nhs(
  'What to feed young children',
  '/baby/weaning-and-feeding/what-to-feed-young-children/',
  FETCHED,
);

/** Nápoje: voda od začátku příkrmu, rýžové nápoje do 5 let ne. */
export const NHS_DRINKS = nhs(
  'Drinks and cups for babies and young children',
  '/baby/weaning-and-feeding/drinks-and-cups-for-babies-and-young-children/',
);

/** Jídla a nápoje, které se do prvního roku nenabízejí. */
export const NHS_AVOID_WEANING = nhs(
  'Food and drinks to avoid – Safe weaning',
  '/best-start-in-life/baby/weaning/safe-weaning/food-and-drinks-to-avoid/',
);

/** Rostlinné zdroje železa a vliv vitaminu C na jeho vstřebávání. */
export const NHS_VEGETARIAN = nhs(
  'The vegetarian diet',
  '/live-well/eat-well/how-to-eat-a-balanced-diet/the-vegetarian-diet/',
  FETCHED,
);

/** Dusičnany v listové zelenině a riziko pro malé děti. */
export const EFSA_NITRATE: SourceRef = {
  org: 'EFSA',
  title: 'EFSA assesses possible health risk for children from nitrate in leafy vegetables',
  url: 'https://www.efsa.europa.eu/en/press/news/contam101209',
  accessedAt: FETCHED,
  tier: 1,
};

/**
 * Odhad expozice anorganickému arsenu z potravin. Stránka jmenuje obiloviny,
 * rýži, mléčné výrobky a pitnou vodu jako hlavní zdroje expozice v Evropě.
 *
 * Původně se citoval článek EFSA Journal 3597, ten dnes přesměrovává mimo
 * povolené domény. Tahle tisková zpráva pokrývá stejné hodnocení a EFSA ji
 * hostuje na vlastní doméně, takže se dá načíst.
 */
export const EFSA_ARSENIC: SourceRef = {
  org: 'EFSA',
  title: 'EFSA publishes dietary exposure estimates for inorganic arsenic',
  url: 'https://www.efsa.europa.eu/en/press/news/140306',
  accessedAt: FETCHED,
  tier: 1,
};

/**
 * Aktualizované hodnocení rizika anorganického arsenu (2024). Shrnutí EFSA
 * vlastními slovy — plný článek EFSA Journal 8488 vede na Wiley, tedy mimo
 * povolené domény.
 */
export const EFSA_ARSENIC_UPDATE: SourceRef = {
  org: 'EFSA',
  title: 'Update of the risk assessment of inorganic arsenic in food – plain language summary',
  url: 'https://www.efsa.europa.eu/en/plain-language-summary/update-risk-assessment-inorganic-arsenic-food',
  accessedAt: FETCHED,
  tier: 1,
};

/** Omezující stanovisko k fenyklovým přípravkům u malých dětí. */
export const EMA_FENNEL: SourceRef = {
  org: 'EMA',
  title: 'Foeniculi dulcis fructus – herbal medicinal product',
  url: 'https://www.ema.europa.eu/en/medicines/herbal/foeniculi-dulcis-fructus',
  accessedAt: FETCHED,
  tier: 1,
};

/** Doporučení ke komplementární výživě 6–23 měsíců. */
export const WHO_COMPLEMENTARY: SourceRef = {
  org: 'WHO',
  title: 'Guideline for complementary feeding of infants and young children 6–23 months of age',
  url: 'https://www.who.int/publications/i/item/9789240081864',
  accessedAt: FETCHED,
  tier: 1,
};

/** Výživa kojenců a malých dětí, rámec pro zavádění příkrmu. */
export const WHO_IYCF: SourceRef = {
  org: 'WHO',
  title: 'Infant and young child feeding',
  url: 'https://www.who.int/news-room/fact-sheets/detail/infant-and-young-child-feeding',
  accessedAt: FETCHED,
  tier: 1,
};

/**
 * České doporučení k zavádění příkrmu.
 *
 * POZOR: tuhle adresu se v této session načíst nepodařilo — `www.mzcr.cz`
 * vrací `301` na `mzd.gov.cz`, což je nová doména ministerstva a
 * docs/BEZPECNOST.md ji zatím mezi povolenými nemá. Datum ověření proto
 * zůstává na dřívějším a nezvyšuj ho, dokud dokument sám nenačteš.
 */
export const MZCR_COMPLEMENTARY: SourceRef = {
  org: 'Ministerstvo zdravotnictví ČR',
  title: 'Doporučení k zavádění komplementární výživy (příkrmu) u kojenců',
  url: 'https://www.mzcr.cz/Odbornik/dokumenty/doporuceni-k-zavadeni-komplementarni-vyzivyprikrmu-u-kojencu_7542_1154_3.html',
  accessedAt: UNVERIFIED_TODAY,
  tier: 1,
};

/** Zavádění lepku do výživy kojenců. */
export const BP_GLUTEN: SourceRef = {
  org: 'Informační centrum bezpečnosti potravin',
  title: 'Zavádění lepku do výživy kojenců',
  url: 'https://bezpecnostpotravin.cz/zavadeni-lepku-do-vyzivy-kojencu/',
  accessedAt: FETCHED,
  tier: 1,
};

/** Konzultace EFSA k zavádění příkrmů do diety kojenců. */
export const BP_COMPLEMENTARY: SourceRef = {
  org: 'Informační centrum bezpečnosti potravin',
  title: 'Veřejná konzultace EFSA: zavádění příkrmů do diety kojenců',
  url: 'https://bezpecnostpotravin.cz/verejna-konzultace-efsa-zavadeni-prikrmu-do-diety-kojencu/',
  accessedAt: FETCHED,
  tier: 1,
};

/**
 * Lektiny v syrových a nedostatečně provařených fazolích: namáčení nejméně
 * 12 hodin, slití namáčecí vody, var nejméně 30 minut. Konzervované fazole
 * jsou už provařené.
 */
export const BP_RAW_BEANS: SourceRef = {
  org: 'Informační centrum bezpečnosti potravin',
  title:
    'FSAI: Preventivní doporučení ohledně konzumace tepelně neupravených nebo syrových fazolí',
  url: 'https://bezpecnostpotravin.cz/fsai-preventivni-doporuceni-ohledne-konzumace-tepelne-neupravenych-nebo-syrovych-fazoli/',
  accessedAt: FETCHED,
  tier: 1,
};

/** Metodický manuál podpory kojení. */
export const SZU_BREASTFEEDING: SourceRef = {
  org: 'Státní zdravotní ústav',
  title: 'Podpora kojení – metodický manuál',
  url: 'https://epoz.szu.cz/wp-content/uploads/2023/03/Podpora-kojen%C3%AD.pdf',
  accessedAt: FETCHED,
  tier: 1,
};

/** Stanoviska České pediatrické společnosti k doporučením WHO. */
export const CPS_WHO: SourceRef = {
  org: 'Česká pediatrická společnost ČLS JEP',
  title: 'Odborná stanoviska k novým doporučením WHO',
  url: 'https://www.pediatrics.cz/odborna-stanoviska-k-novym-doporucenim-who/',
  accessedAt: FETCHED,
  tier: 1,
};
