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
 * ZBÝVAJÍCÍ VÝJIMKA: články EFSA Journal (`/en/efsajournal/pub/<číslo>`) dnes
 * přesměrovávají na `efsa.onlinelibrary.wiley.com`, tedy mimo povolené domény.
 * Proto se u arsenu cituje tisková zpráva a shrnutí, které EFSA hostuje na
 * vlastní doméně — obojí bylo načtené.
 *
 * VYŘEŠENO 12. 9. 2026: Ministerstvo zdravotnictví i SZÚ přešly na domény pod
 * `gov.cz`. Obě jsou doplněné do docs/BEZPECNOST.md kap. 1 a do
 * `TIER1_DOMAINS`. Původní adresa dokumentu ministerstva
 * (`/Odbornik/dokumenty/…_7542_1154_3.html`) vrací i na nové doméně `404`;
 * dokument je dnes na `mzd.gov.cz/doporuceni-k-zavadeni-komplementarni-vyzivy-prikrmuu-kojencu/`
 * a byl v téhle session stažený a přečtený celý.
 */

/** Datum, kdy byl zdroj skutečně stažen a přečten (curl, HTTP 200). */
const FETCHED = '2026-09-12';

/** Druhé kolo ověřování, kterým se uzavřely poslední tři položky k revizi. */
const FETCHED_13 = '2026-09-13';

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

/**
 * Obecná stránka o potravinové alergii. Jmenuje mimo jiné celer, hořčici,
 * sezam a lupinu vedle devíti nejčastějších alergenů.
 *
 * OVĚŘENO 13. 9. 2026: staženo a přečteno, věta „you can be allergic to any
 * type of food, including celery, mustard, sesame seeds and lupin flour".
 */
export const NHS_FOOD_ALLERGY = nhs('Food allergy', '/conditions/food-allergy/', FETCHED_13);

/**
 * Ryby: dravé ryby s rtutí, porce tučných ryb, syroví korýši.
 *
 * OVĚŘENO 13. 9. 2026: staženo a přečteno znovu. Klíčové pro katalog:
 * děti do 16 let nemají jíst žraloka, mečouna ani marlina kvůli rtuti;
 * syrové korýše a měkkýše dětem nedávat vůbec; mezi tučné ryby patří sleď,
 * sardinka, losos, pstruh a makrela, mezi bílé treska a treska aljašská.
 */
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
 * Encyklopedické heslo Společnosti pro výživu na portálu Bezpečnost potravin.
 *
 * Co doložitelně říká: červená řepa má vysoký obsah dusičnanů (proto se
 * doporučuje sportovcům kvůli přeměně na oxid dusnatý), dusičnany přijaté ve
 * stravě se přeměňují až na karcinogenní nitrosaminy, a proto je jejich obsah
 * v zelenině limitován zákonem; řepa navíc obsahuje hodně kyseliny šťavelové
 * a puriny. Článek uzavírá, že u červené řepy platí ve zvýšené míře
 * doporučení „všeho s mírou“.
 *
 * Doplněno při auditu: stanovisko EFSA o dusičnanech se týká listové
 * zeleniny (špenát, hlávkový salát) a řepu nejmenuje, takže samotné tvrzení
 * o řepě nepokrývalo.
 */
export const BP_BEETROOT: SourceRef = {
  org: 'Informační centrum bezpečnosti potravin',
  title: 'Červená řepa a doporučení „všeho s mírou“',
  url: 'https://bezpecnostpotravin.cz/cervena-repa-a-doporuceni-vseho-s-mirou/',
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
 * České doporučení k zavádění příkrmu, stanovisko Pracovní skupiny
 * Ministerstva zdravotnictví pro výživu dětí.
 *
 * ROZSAH DOKUMENTU — cituj ho jen na tvrzení, která v něm opravdu jsou:
 * - výlučné kojení do ukončeného 6. měsíce, kojení s příkrmem do 2 let i déle;
 * - příkrm zavádět nejpozději po ukončeném 6. měsíci (180 dní, 26. týden)
 *   a ne před ukončeným 4. měsícem (17 týdnů) — tohle je opora pro
 *   `minAgeMonths: 6` u běžných surovin;
 * - zvláštní postup u dětí narozených před 37., resp. 35. týdnem;
 * - podmínkou je vývojová zralost (stabilní hlava, koordinace oko–ruka–ústa,
 *   polykání a tolerance tuhé stravy);
 * - lepek zavést nejpozději do ukončeného 7. měsíce, optimálně ještě při kojení;
 * - u dětí s vysokým rizikem alergie zavádět po jedné potravině a sledovat reakci.
 *
 * Dokument NEŘEŠÍ jednotlivé suroviny, sůl, cukr, dušení, textury ani
 * kontaminanty. Na tyhle věci ho necituj — patří k nim NHS, WHO, EFSA
 * a bezpecnostpotravin.cz.
 */
export const MZCR_COMPLEMENTARY: SourceRef = {
  org: 'Ministerstvo zdravotnictví ČR',
  title: 'Doporučení k zavádění komplementární výživy (příkrmu) u kojenců',
  url: 'https://mzd.gov.cz/doporuceni-k-zavadeni-komplementarni-vyzivy-prikrmuu-kojencu/',
  accessedAt: FETCHED,
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

/**
 * Kumarin ve skořici. Kasie obsahuje až 4 g kumarinu/kg, cejlonská skořice
 * výrazně méně, zato víc eugenolu (ADI 2,5 mg/kg t. hm.). Tolerovatelný denní
 * příjem kumarinu je 0,1 mg/kg tělesné hmotnosti. Článek doporučuje omezit
 * cereálie, kaše a další výrobky ochucené skořicí na nejvýše jednou týdně
 * a upozorňuje, že děti jsou kvůli nižší tělesné hmotnosti citlivější.
 */
export const BP_CINNAMON: SourceRef = {
  org: 'Informační centrum bezpečnosti potravin',
  title: 'Nebezpečí z konzumace skořice',
  url: 'https://bezpecnostpotravin.cz/nebezpeci-z-konzumace-skorice/',
  accessedAt: FETCHED,
  tier: 1,
};

/** Potvrzení TDI kumarinu 0,1 mg/kg t. hm. panelem EFSA; krátkodobé překročení není zásadní riziko. */
export const BP_COUMARIN_EFSA: SourceRef = {
  org: 'Informační centrum bezpečnosti potravin',
  title: 'Potvrzené stanovisko EFSA ke kumarinu',
  url: 'https://bezpecnostpotravin.cz/potvrzene-stanovisko-efsa-ke-kumarinu/',
  accessedAt: FETCHED,
  tier: 1,
};

/**
 * Bezpečnost kofeinu. Stránka jmenuje kakaové boby mezi přirozenými zdroji
 * kofeinu, uvádí, že u dětí 3–10 let je čokoláda včetně kakaových nápojů
 * nejčastějším zdrojem kofeinu, a navrhuje bezpečnou úroveň 3 mg/kg tělesné
 * hmotnosti a den pro děti a dospívající.
 *
 * POZOR: nejmladší sledovanou skupinou jsou batolata 12–36 měsíců. O kojencích
 * do 12 měsíců ani o theobrominu stránka nemluví.
 */
export const EFSA_CAFFEINE: SourceRef = {
  org: 'EFSA',
  title: 'Caffeine – topic page',
  url: 'https://www.efsa.europa.eu/en/topics/topic/caffeine',
  accessedAt: FETCHED,
  tier: 1,
};

/**
 * Postup při dušení u dítěte. Stránka rozlišuje účinný a neúčinný kašel,
 * popisuje pět úderů mezi lopatky a u kojence do jednoho roku pět stlačení
 * hrudníku dvěma prsty pod úrovní bradavek; břišní stlačení (Heimlichův
 * manévr) uvádí až u dětí nad jeden rok. Varuje před slepým šátráním prsty
 * v ústech, protože to zasune předmět hlouběji.
 */
export const NHS_CHOKING = nhs(
  'How to stop a child from choking',
  '/conditions/baby/first-aid-and-safety/first-aid/how-to-stop-a-child-from-choking/',
  FETCHED,
);

/** Železo: zdroje ve stravě a vliv vitaminu C na vstřebávání nehemového železa. */
export const NHS_IRON = nhs('Iron', '/conditions/vitamins-and-minerals/iron/', FETCHED);

/** Zinek a další stopové prvky — doporučené příjmy a potravinové zdroje. */
export const NHS_TRACE_MINERALS = nhs(
  'Vitamins and minerals – others',
  '/conditions/vitamins-and-minerals/others/',
  FETCHED,
);

/** Metodický manuál podpory kojení. */
export const SZU_BREASTFEEDING: SourceRef = {
  org: 'Státní zdravotní ústav',
  title: 'Podpora kojení – metodický manuál',
  url: 'https://epoz.szu.cz/wp-content/uploads/2023/03/Podpora-kojen%C3%AD.pdf',
  accessedAt: FETCHED,
  tier: 1,
};

/**
 * Brožura SZÚ k zavádění příkrmu. Obrázkové PDF bez textové vrstvy, přečtené
 * po stránkách 12. 9. 2026.
 *
 * Co doložitelně říká: příkrm zavádět ne před ukončeným 4. a nejpozději po
 * ukončeném 6. měsíci, lepek nejpozději do ukončeného 7. měsíce; začínat
 * zeleninou (mrkev, pak dýně) a nesolit, nesladit ani nepřidávat nic dalšího;
 * mezi novými potravinami nechat 2–3 dny a sledovat alergickou reakci; maso
 * v porci 30–50 g libového, upravené vařením, dušením nebo v páře, bez kostí,
 * v žádném případě uzené maso ani masné výrobky, a bez soli a koření; u ryb
 * dávat pozor na kosti; mléčné výrobky od 7. měsíce, nejvhodnější bílý jogurt
 * s 3–3,5 % tuku; ovoce nesladit.
 *
 * POZOR na rozpor s britskou praxí: brožura řadí celozrnné obiloviny až od
 * dvou let věku a dětem do roka nedoporučuje celozrnný chléb. Na tuhle věc ji
 * necituj, dokud se rozpor nevyřeší podle docs/BEZPECNOST.md kap. 1 bodu 4.
 */
export const SZU_FIRST_SPOON: SourceRef = {
  org: 'Státní zdravotní ústav',
  title: 'Moje první lžička',
  url: 'https://szu.gov.cz/wp-content/uploads/2023/11/Moje_prvni_lzicka_2016.pdf',
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

/**
 * Heslo o karobu. Doloží složení karobové mouky — vitaminy skupiny B,
 * draslík, hořčík, vápník, železo a další stopové prvky, vláknina, pektin
 * a lignin — a to, že mouka neobsahuje lepek, takže se používá v potravinách
 * pro lidi s celiakií. Uvádí i regulaci karubinu jako přídatné látky E 410.
 *
 * POZOR: o theobrominu, kofeinu ani o srovnání s kakaem heslo nemluví. Že
 * karob povzbuzující látky neobsahuje, z něj tedy vyčíst nelze — jen to, že
 * v popisu složení nefigurují.
 */
export const BP_CAROB: SourceRef = {
  org: 'Informační centrum bezpečnosti potravin',
  title: 'Karob',
  url: 'https://bezpecnostpotravin.cz/termin/karob/',
  accessedAt: FETCHED_13,
  tier: 1,
};

/** Třetí kolo ověřování — podklady k zařazení surovin podle živin. */
const FETCHED_14 = '2026-09-14';

/**
 * NHS o vitaminu C. Jako dobré zdroje jmenuje citrusy a pomerančovou šťávu,
 * papriky, jahody, černý rybíz, brokolici, růžičkovou kapustu a brambory.
 * Dospělý potřebuje 40 mg denně a tělo si vitamin C neukládá do zásoby.
 */
export const NHS_VITAMIN_C = nhs(
  'Vitamin C',
  '/conditions/vitamins-and-minerals/vitamin-c/',
  FETCHED_14,
);

/**
 * Heslo Vitamin C Informačního centra bezpečnosti potravin.
 *
 * Uvádí, že hlavním zdrojem je ovoce, zvlášť tropické, a zelenina, a čísluje
 * nejbohatší: černý rybíz až 300 mg/100 g, kiwi 130, papája 100, citrusy až
 * 70; ze zeleniny papriky až 300, květák, brokolice a kapusta až 130, kysané
 * zelí a brambory až 40. Dodává, že vitamin C patří k nejméně stálým
 * vitaminům — ztrácí se výluhem a oxidací — a že pro celkový příjem jsou
 * důležitější druhy, kterých se sní hodně (zelí, brambory), než ty
 * nejbohatší.
 */
export const BP_VITAMIN_C: SourceRef = {
  org: 'Informační centrum bezpečnosti potravin',
  title: 'Vitamin C',
  url: 'https://bezpecnostpotravin.cz/termin/vitamin-c/',
  accessedAt: FETCHED_14,
  tier: 1,
};

/**
 * Informační karta SZÚ o vitaminu C.
 *
 * Jako bohaté zdroje jmenuje červenou papriku, pomeranč, citron, černý rybíz,
 * kiwi, jahody, brokolici, květák a kedlubnu a doporučuje pět porcí zeleniny
 * nebo ovoce denně. Popisuje i ztráty: vitamin C ničí vysoká teplota a kyslík,
 * nejvíc ho je pod slupkou.
 */
export const SZU_VITAMIN_C: SourceRef = {
  org: 'Státní zdravotní ústav',
  title: 'Vitamin C (informační karta)',
  url: 'https://szu.gov.cz/wp-content/uploads/2023/02/Vitamin_C.pdf',
  accessedAt: FETCHED_14,
  tier: 1,
};

/**
 * Heslo Železo Informačního centra bezpečnosti potravin.
 *
 * Rozlišuje hemové železo z masa a ryb, kterého se vstřebá kolem 15 %, a
 * nehemové z rostlin. Z rostlinných zdrojů jmenuje zelenou listovou zeleninu,
 * obiloviny a luštěniny a upozorňuje, že fytáty, vláknina a třísloviny
 * vstřebávání snižují, zatímco vitamin C a živočišná bílkovina ho zvyšují.
 */
export const BP_IRON: SourceRef = {
  org: 'Informační centrum bezpečnosti potravin',
  title: 'Železo',
  url: 'https://bezpecnostpotravin.cz/termin/zelezo/',
  accessedAt: FETCHED_14,
  tier: 1,
};

/**
 * Zinek v potravinách, Informační centrum bezpečnosti potravin.
 *
 * S čísly: semena a ořechy 2,9–7,8 mg/100 g, játra a ledviny 4,2–6,1, hovězí
 * a vepřové 2,9–4,7, drůbež 1,8–3,0, ryby a mořské produkty 0,5–5,2, vejce
 * 1,1–1,4, mléko a sýry 0,4–3,1, luštěniny 1,0–2,0, chléb 0,9. Ústřice uvádí
 * jako nejbohatší zdroj vůbec.
 */
export const BP_ZINC: SourceRef = {
  org: 'Informační centrum bezpečnosti potravin',
  title: 'Zinek v potravinách',
  url: 'https://bezpecnostpotravin.cz/zinek-v-potravinach/',
  accessedAt: FETCHED_14,
  tier: 1,
};

/**
 * Heslo Maliny Informačního centra bezpečnosti potravin. Jmenuje maliny mezi
 * bohatými zdroji vitaminu C; číselný obsah neuvádí.
 */
export const BP_RASPBERRY: SourceRef = {
  org: 'Informační centrum bezpečnosti potravin',
  title: 'Maliny',
  url: 'https://bezpecnostpotravin.cz/termin/maliny/',
  accessedAt: FETCHED_14,
  tier: 1,
};

/**
 * Heslo Rajčata Informačního centra bezpečnosti potravin. Jedno střední rajče
 * (123 g) podle něj pokryje skoro 40 % doporučené denní dávky vitaminu C.
 */
export const BP_TOMATO: SourceRef = {
  org: 'Informační centrum bezpečnosti potravin',
  title: 'Rajčata',
  url: 'https://bezpecnostpotravin.cz/termin/rajcata/',
  accessedAt: FETCHED_14,
  tier: 1,
};

/**
 * Stanovisko EFSA k dusičnanům v zelenině v českém shrnutí. Uvádí rozpětí
 * obsahu od 1 mg/kg u hrášku a růžičkové kapusty po 4 800 mg/kg u rukoly,
 * jmenuje listovou zeleninu (hlávkový salát, špenát) jako skupinu s vyššími
 * koncentracemi a uvádí, že příjem snižuje mytí, loupání a tepelná úprava.
 *
 * POZOR: hodnocení počítá s dospělým o hmotnosti 60 kg, kojence a malé děti
 * neřeší, a fenykl se v něm nevyskytuje vůbec.
 */
export const BP_NITRATES_VEG: SourceRef = {
  org: 'Informační centrum bezpečnosti potravin',
  title: 'Stanovisko EFSA k dusičnanům v zelenině',
  url: 'https://bezpecnostpotravin.cz/stanovisko-efsa-k-dusicnanum-v-zelenine/',
  accessedAt: FETCHED_13,
  tier: 1,
};

