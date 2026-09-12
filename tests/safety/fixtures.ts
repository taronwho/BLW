import type { Catalog, Ingredient, Recipe, Stage, StagePrep } from '../../src/types';

/**
 * Továrničky na platné položky. Test pak jen rozbije jedno pole a ověří,
 * že pravidlo zabere — negativní test tak nemůže projít omylem.
 */

function prep(serving: string, caution?: string): StagePrep {
  return caution === undefined ? { serving } : { serving, caution };
}

const SERVINGS_BROKOLICE: Record<Stage, string> = {
  '6m': 'Uvař růžičku brokolice v páře doměkka, aby se stonek dal snadno rozmáčknout mezi prsty. Podávej celou růžičku i se stonkem, ten slouží jako držátko, které dcera sevře v pěsti.',
  '9m': 'Nakrájej uvařenou brokolici na kousky velikosti fazole, aby je zvládla sebrat klešťovým úchopem mezi palec a ukazovák. Růžičky nech o něco měkčí, než bys jedl sám.',
  '12m': 'Podávej brokolici nakrájenou na sousta, klidně i pevnější po krátkém orestování. V tomhle věku už zvládne kousat, takže nemusí být rozmačkatelná mezi prsty.',
};

const SERVINGS_MRKEV: Record<Stage, string> = {
  '6m': 'Dušenou mrkev nakrájej na hranolky o délce prstu dospělého, aby jí kus čouhal z pěsti. Musí jít rozmáčknout mezi palcem a ukazovákem, jinak je pro tenhle věk moc tvrdá.',
  '9m': 'Uvařenou mrkev krájej na kostičky do velikosti hrášku, nebo nabídni tenké plátky. Syrová tvrdá mrkev v téhle fázi nepatří na talíř, ani nastrouhaná nahrubo.',
  '12m': 'Měkce uvařená mrkev může být na větších soustech, syrovou nabízej jen nastrouhanou najemno. Tvrdé kolečko syrové mrkve je pořád riziková věc.',
};

export function makeIngredient(overrides: Partial<Ingredient> = {}): Ingredient {
  const base: Ingredient = {
    id: 'brokolice',
    nameCz: 'Brokolice',
    altNamesCz: ['brokolica'],
    category: 'zelenina',
    emoji: '🥦',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': prep(SERVINGS_BROKOLICE['6m']),
      '9m': prep(SERVINGS_BROKOLICE['9m']),
      '12m': prep(SERVINGS_BROKOLICE['12m']),
    },
    prepIdeas: ['v páře', 'pečená s olivovým olejem', 'rozmixovaná do polévky'],
    seasonCz: [6, 7, 8, 9, 10],
    vegetarian: true,
    sources: [
      {
        org: 'NHS Start for Life',
        title: 'Co a jak nabízet při zavádění příkrmů',
        url: 'https://www.nhs.uk/start-for-life/baby/weaning/',
        accessedAt: '2026-09-11',
        tier: 1,
      },
    ],
    reviewStatus: 'verified',
  };
  return { ...base, ...overrides };
}

export function makeCarrot(overrides: Partial<Ingredient> = {}): Ingredient {
  return makeIngredient({
    id: 'mrkev',
    nameCz: 'Mrkev',
    altNamesCz: ['karotka'],
    chokingRisk: 'medium',
    chokingReason: 'Syrová mrkev je tvrdá a při ukousnutí se láme na kolečka, která ucpou dýchací cesty.',
    prep: {
      '6m': prep(SERVINGS_MRKEV['6m']),
      '9m': prep(SERVINGS_MRKEV['9m']),
      '12m': prep(SERVINGS_MRKEV['12m']),
    },
    prepIdeas: ['dušená na hranolky', 'pečená v troubě', 'pyré s bramborem'],
    ...overrides,
  });
}

export function makeChicken(overrides: Partial<Ingredient> = {}): Ingredient {
  return makeIngredient({
    id: 'kureci-prsa',
    nameCz: 'Kuřecí prsa',
    altNamesCz: ['kuřecí prso'],
    category: 'maso-ryby',
    emoji: '🍗',
    vegetarian: false,
    chokingRisk: 'medium',
    chokingReason: 'Vlákna masa jsou pevná a suchý kus se v ústech nerozpadne, dítě ho spolkne vcelku.',
    prep: {
      '6m': prep(
        'Kuřecí maso dus doměkka a nabídni v podélném proužku velikosti prstu, který dítě sevře v pěsti. Suché kostičky v tomhle věku nedávej, špatně se s nimi v puse pracuje.',
      ),
      '9m': prep(
        'Maso natrhej podél vláken na jemné cucky nebo nabídni v kostičkách do velikosti hrášku. Vždy dobře propečené a šťavnaté, klidně promíchané s trochou omáčky.',
      ),
      '12m': prep(
        'V tomhle věku zvládne větší sousta i pevnější kousky. Maso pořád krájej podél vláken, ať se dá rozkousat, a hlídej, aby nebylo vysušené.',
      ),
    },
    prepIdeas: ['dušené s kořenovou zeleninou', 'pečené v troubě', 'vařené a natrhané na cucky'],
    seasonCz: [],
    ...overrides,
  });
}

export function makeRecipe(overrides: Partial<Recipe> = {}): Recipe {
  const base: Recipe = {
    id: 'brokolicove-placky',
    titleCz: 'Brokolicové placky',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 30,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'brokolice', amount: '300 g', track: 'all' },
      { ingredientId: 'mrkev', amount: '150 g', track: 'all' },
    ],
    baseSteps: [
      'Brokolici rozeber na růžičky a mrkev oloupej.',
      'Zeleninu vař v páře asi 12 minut doměkka.',
      'Zeleninu nahrubo rozmačkej vidličkou.',
      'Ze směsi vytvaruj placky a opeč je na olivovém oleji.',
    ],
    babySplitPoint: 'Po kroku 3 odeber dvě lžíce směsi pro miminko, ještě než se cokoli dochucuje.',
    babySteps: [
      'Odebranou směs vytvaruj do menší placky a opeč na olivovém oleji bez soli.',
      'Nech vychladnout na vlažnou teplotu a zkontroluj prstem.',
    ],
    babyServing: {
      '6m': 'Podávej placku nakrájenou na podlouhlé proužky velikosti prstu, aby šly uchopit v pěsti.',
      '9m': 'Placku nakrájej na kostičky do velikosti hrášku pro klešťový úchop.',
      '12m': 'Placku nabídni vcelku nebo na větší sousta, dítě už si ji rozdělí samo.',
    },
    meatSteps: ['Placky dosol podle chuti a podávej s opečeným kuřecím masem.'],
    vegetarianSteps: ['Placky dosol a podávej s bílým jogurtem a citronovou šťávou.'],
    allergens: [],
    tags: ['do ruky', 'bez lepku'],
    sources: [
      {
        org: 'NHS Start for Life',
        title: 'Bezpečné tvary a velikosti soust',
        url: 'https://www.nhs.uk/start-for-life/baby/weaning/safe-weaning/',
        accessedAt: '2026-09-11',
        tier: 1,
      },
    ],
    reviewStatus: 'verified',
  };
  return { ...base, ...overrides };
}

export function makeMeatRecipe(overrides: Partial<Recipe> = {}): Recipe {
  return makeRecipe({
    id: 'kureci-s-mrkvi',
    titleCz: 'Dušené kuře s mrkví',
    ingredients: [
      { ingredientId: 'mrkev', amount: '200 g', track: 'all' },
      { ingredientId: 'kureci-prsa', amount: '300 g', track: 'meat' },
    ],
    baseSteps: [
      'Mrkev oloupej a nakrájej na hranolky.',
      'Mrkev dus na lžíci oleje do měkka.',
      'Přidej lžíci vody a nech krátce probublat.',
      'Sundej z plotny a nech chvíli odstát.',
    ],
    babySplitPoint: 'Po kroku 3 odeber porci mrkve pro miminko, ještě před dochucením.',
    vegetarianProteinSwap: 'Místo kuřecího masa se do bezmasé verze přidá červená čočka uvařená s bobkovým listem.',
    meatSteps: ['Kuřecí maso oprav na pánvi, dosol a smíchej s mrkví.'],
    vegetarianSteps: ['Uvařenou červenou čočku vmíchej do mrkve, osol a dochuť citronem.'],
    ...overrides,
  });
}

export function makeCatalog(overrides: Partial<Catalog> = {}): Catalog {
  const base: Catalog = {
    ingredients: [makeIngredient(), makeCarrot(), makeChicken()],
    recipes: [makeRecipe(), makeMeatRecipe()],
    guides: [],
  };
  return { ...base, ...overrides };
}
