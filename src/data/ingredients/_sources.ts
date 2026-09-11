import type { SourceRef } from '@/types';

/**
 * Ověřené zdroje katalogu surovin.
 *
 * Každý odkaz byl v této session dohledán nástrojem (webové vyhledávání
 * omezené na povolenou doménu) a do datové vrstvy se zapisuje i s datem
 * ověření. Politika domén je v docs/BEZPECNOST.md kapitola 1, technicky ji
 * hlídá pravidlo `source-url-shape` v src/safety/rules.ts.
 *
 * POZNÁMKA K OVĚŘENÍ: přímé stažení stránek (WebFetch/curl) blokuje v tomto
 * prostředí egress proxy (403) u všech zdravotnických domén. Ověření proto
 * proběhlo přes vyhledávací nástroj, který vrací živý obsah stránky i její
 * URL. Tvrzení v datech se drží obecných principů z těchto stránek.
 */

const ACCESSED = '2026-09-11';

function nhs(title: string, path: string): SourceRef {
  return { org: 'NHS', title, url: `https://www.nhs.uk${path}`, accessedAt: ACCESSED, tier: 1 };
}

/** Zákazy pro dětskou linii: sůl, cukr, med, celé ořechy, syrové vejce, rýžové nápoje. */
export const NHS_AVOID = nhs(
  'Foods to avoid giving babies and young children',
  '/baby/weaning-and-feeding/foods-to-avoid-giving-babies-and-young-children/',
);

/** První příkrmy, měkké vařené hranolky, velikost soust do ruky. */
export const NHS_FIRST_FOODS = nhs(
  "Your baby's first solid foods",
  '/baby/weaning-and-feeding/babys-first-solid-foods/',
);

/** Co nabízet kolem 6 měsíců. */
export const NHS_6M = nhs(
  '6 months – Feeding your baby',
  '/best-start-in-life/baby/weaning/what-to-feed-your-baby/from-around-6-months/',
);

/** Posun textur a samostatné jedení mezi 7. a 9. měsícem. */
export const NHS_7_9M = nhs(
  '7 to 9 months – Feeding your baby',
  '/best-start-in-life/baby/weaning/what-to-feed-your-baby/7-to-9-months/',
);

/** Rodinná strava a tvrdší textury mezi 10. a 12. měsícem. */
export const NHS_10_12M = nhs(
  '10 to 12 months – Feeding your baby',
  '/best-start-in-life/baby/weaning/what-to-feed-your-baby/10-to-12-months/',
);

/** Bezpečná příprava: čtvrcení kulatého ovoce, pecky, kosti, slupky. */
export const NHS_PREP_SAFELY = nhs(
  'Preparing food safely for babies',
  '/best-start-in-life/baby/weaning/safe-weaning/preparing-food-safely/',
);

/** Zavádění alergenů od šesti měsíců a opakovaná expozice. */
export const NHS_ALLERGY = nhs(
  'Baby food allergies',
  '/best-start-in-life/baby/weaning/safe-weaning/food-allergies/',
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

/** Dusičnany v listové zelenině a riziko pro malé děti. */
export const EFSA_NITRATE: SourceRef = {
  org: 'EFSA',
  title: 'EFSA assesses possible health risk for children from nitrate in leafy vegetables',
  url: 'https://www.efsa.europa.eu/en/press/news/contam101209',
  accessedAt: ACCESSED,
  tier: 1,
};

/** Expozice anorganickému arsenu, hlavní podíl rýže a rýžových výrobků. */
export const EFSA_ARSENIC: SourceRef = {
  org: 'EFSA',
  title: 'Dietary exposure to inorganic arsenic',
  url: 'https://www.efsa.europa.eu/en/efsajournal/pub/3597',
  accessedAt: ACCESSED,
  tier: 1,
};

/** Aktualizované hodnocení rizika anorganického arsenu. */
export const EFSA_ARSENIC_UPDATE: SourceRef = {
  org: 'EFSA',
  title: 'Update of the risk assessment of inorganic arsenic in food',
  url: 'https://www.efsa.europa.eu/en/efsajournal/pub/8488',
  accessedAt: ACCESSED,
  tier: 1,
};

/** Omezující stanovisko k fenyklovým přípravkům u malých dětí. */
export const EMA_FENNEL: SourceRef = {
  org: 'EMA',
  title: 'Foeniculi dulcis fructus – herbal medicinal product',
  url: 'https://www.ema.europa.eu/en/medicines/herbal/foeniculi-dulcis-fructus',
  accessedAt: ACCESSED,
  tier: 1,
};

/** Doporučení ke komplementární výživě 6–23 měsíců. */
export const WHO_COMPLEMENTARY: SourceRef = {
  org: 'WHO',
  title: 'Guideline for complementary feeding of infants and young children 6–23 months of age',
  url: 'https://www.who.int/publications/i/item/9789240081864',
  accessedAt: ACCESSED,
  tier: 1,
};

/** Výživa kojenců a malých dětí, rámec pro zavádění příkrmu. */
export const WHO_IYCF: SourceRef = {
  org: 'WHO',
  title: 'Infant and young child feeding',
  url: 'https://www.who.int/news-room/fact-sheets/detail/infant-and-young-child-feeding',
  accessedAt: ACCESSED,
  tier: 1,
};

/** České doporučení k zavádění příkrmu. */
export const MZCR_COMPLEMENTARY: SourceRef = {
  org: 'Ministerstvo zdravotnictví ČR',
  title: 'Doporučení k zavádění komplementární výživy (příkrmu) u kojenců',
  url: 'https://www.mzcr.cz/Odbornik/dokumenty/doporuceni-k-zavadeni-komplementarni-vyzivyprikrmu-u-kojencu_7542_1154_3.html',
  accessedAt: ACCESSED,
  tier: 1,
};

/** Zavádění lepku do výživy kojenců. */
export const BP_GLUTEN: SourceRef = {
  org: 'Informační centrum bezpečnosti potravin',
  title: 'Zavádění lepku do výživy kojenců',
  url: 'https://bezpecnostpotravin.cz/zavadeni-lepku-do-vyzivy-kojencu/',
  accessedAt: ACCESSED,
  tier: 1,
};

/** Konzultace EFSA k zavádění příkrmů do diety kojenců. */
export const BP_COMPLEMENTARY: SourceRef = {
  org: 'Informační centrum bezpečnosti potravin',
  title: 'Veřejná konzultace EFSA: zavádění příkrmů do diety kojenců',
  url: 'https://bezpecnostpotravin.cz/verejna-konzultace-efsa-zavadeni-prikrmu-do-diety-kojencu/',
  accessedAt: ACCESSED,
  tier: 1,
};

/** Metodický manuál podpory kojení. */
export const SZU_BREASTFEEDING: SourceRef = {
  org: 'Státní zdravotní ústav',
  title: 'Podpora kojení – metodický manuál',
  url: 'https://epoz.szu.cz/wp-content/uploads/2023/03/Podpora-kojen%C3%AD.pdf',
  accessedAt: ACCESSED,
  tier: 1,
};

/** Stanoviska České pediatrické společnosti k doporučením WHO. */
export const CPS_WHO: SourceRef = {
  org: 'Česká pediatrická společnost ČLS JEP',
  title: 'Odborná stanoviska k novým doporučením WHO',
  url: 'https://www.pediatrics.cz/odborna-stanoviska-k-novym-doporucenim-who/',
  accessedAt: ACCESSED,
  tier: 1,
};
