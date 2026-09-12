import { describe, expect, it } from 'vitest';
import { COVERAGE_EXCEPTIONS } from '../../src/safety/coverage-exceptions';
import { safetyRules } from '../../src/safety/rules';
import { runSafetyRules } from '../../src/safety/run';
import {
  makeCarrot,
  makeCatalog,
  makeChicken,
  makeIngredient,
  makeMeatRecipe,
  makeRecipe,
} from './fixtures';
import { expectFail, expectPass } from './helpers';

const catalog = makeCatalog();

describe('no-honey-baby', () => {
  it('projde recept, kde se med v dětské linii neobjeví', () => {
    expectPass('no-honey-baby', makeRecipe(), catalog);
  });

  it('zachytí med v babySteps', () => {
    const recipe = makeRecipe({
      babySteps: ['Placku pokapej medem a podávej vlažnou.'],
    });
    expect(expectFail('no-honey-baby', recipe, catalog)).toContain('Med');
  });

  it('zachytí med v pokynu k surovině pod 12 měsíců', () => {
    const ingredient = makeIngredient({
      prepIdeas: ['pečená s medem', 'v páře', 'pyré'],
    });
    expectFail('no-honey-baby', ingredient, catalog);
  });

  it('nepovažuje slovo „medvědí česnek" za med', () => {
    expectPass('no-honey-baby', makeIngredient({ prepIdeas: ['s medvědím česnekem', 'v páře', 'pyré'] }), catalog);
  });
});

describe('no-salt-baby', () => {
  it('projde recept, kde se solí až v linii dospělých', () => {
    expectPass('no-salt-baby', makeRecipe(), catalog);
  });

  it('zachytí solení v babySteps', () => {
    const recipe = makeRecipe({ babySteps: ['Placku osol a opeč do zlatova.'] });
    expectFail('no-salt-baby', recipe, catalog);
  });

  it('zachytí bujón v dětské porci', () => {
    const recipe = makeRecipe({
      babyServing: {
        '6m': 'Podávej v proužcích, přelité slabým bujónem z kostky.',
        '9m': 'Kostičky velikosti hrášku.',
        '12m': 'Větší sousta.',
      },
    });
    expectFail('no-salt-baby', recipe, catalog);
  });

  it('nepovažuje větu „bez soli" za porušení', () => {
    expectPass('no-salt-baby', makeRecipe({ babySteps: ['Opeč bez soli na olivovém oleji.'] }), catalog);
  });

  it('nepovažuje zápor „nesol" za porušení', () => {
    expectPass('no-salt-baby', makeRecipe({ babySteps: ['Porci miminka nesol ani nedochucuj.'] }), catalog);
  });
});

describe('no-sugar-baby', () => {
  it('projde recept bez přidaného cukru', () => {
    expectPass('no-sugar-baby', makeRecipe(), catalog);
  });

  it('zachytí javorový sirup v dětské linii', () => {
    const recipe = makeRecipe({ babySteps: ['Placku pokapej javorovým sirupem.'] });
    expectFail('no-sugar-baby', recipe, catalog);
  });

  it('nepovažuje „bez cukru" za porušení', () => {
    expectPass('no-sugar-baby', makeRecipe({ babySteps: ['Použij jablečné pyré bez cukru.'] }), catalog);
  });
});

describe('no-whole-nuts', () => {
  it('projde dětská linie s mletými ořechy', () => {
    expectPass(
      'no-whole-nuts',
      makeRecipe({ babySteps: ['Do směsi vmíchej lžičku mletých vlašských ořechů.'] }),
      catalog,
    );
  });

  it('zachytí celé ořechy v dětské linii', () => {
    const recipe = makeRecipe({ babySteps: ['Posyp placku vlašskými ořechy.'] });
    expectFail('no-whole-nuts', recipe, catalog);
  });

  it('uznává arašídové máslo jako bezpečný tvar', () => {
    expectPass(
      'no-whole-nuts',
      makeRecipe({ babySteps: ['Placku potři tenkou vrstvou arašídového másla zředěného vodou.'] }),
      catalog,
    );
  });
});

describe('round-food-shape', () => {
  const grape = makeIngredient({
    id: 'hroznove-vino',
    nameCz: 'Hroznové víno',
    altNamesCz: ['hrozny'],
    category: 'ovoce',
    chokingRisk: 'high',
    chokingReason: 'Kulatá bobule odpovídá průměru dýchacích cest a uzavře je jako zátka.',
    prep: {
      '6m': {
        serving:
          'Každou bobuli rozkroj podélně na čtvrtky, nikdy nepodávej celou ani rozpůlenou na kolečka. Čtvrtky mají podlouhlý tvar, který dýchací cesty neucpe, a dají se snadno rozmáčknout.',
      },
      '9m': {
        serving:
          'I v této fázi krájej bobule podélně na čtvrtky. Dcera už zvládne menší kousky, ale tvar zůstává stejný, protože riziko nedává velikost, ale kulatý průřez bobule.',
      },
      '12m': {
        serving:
          'Podélné čtvrtky zůstávají doporučením i po roce. Teprve kolem pátého roku, kdy je žvýkání spolehlivé, se dá uvažovat o celé bobuli, a i pak vsedě a pod dohledem.',
      },
    },
    prepIdeas: ['čerstvé podélné čtvrtky', 'rozmixované do jogurtu', 'zapečené v kaši'],
  });

  it('projde hroznové víno s pokynem k podélnému rozčtvrcení', () => {
    expectPass('round-food-shape', grape, catalog);
  });

  it('zachytí kulatou surovinu bez pokynu k rozčtvrcení', () => {
    const broken = makeIngredient({
      ...grape,
      prep: {
        ...grape.prep,
        '6m': {
          serving:
            'Bobule rozpul na poloviny a podávej vychlazené. Slupku můžeš nechat, protože dodává ovoci tvar a dcera se s ní naučí pracovat při kousání.',
        },
      },
    });
    expect(expectFail('round-food-shape', broken, catalog)).toContain('6m');
  });

  it('netýká se surovin s nízkým rizikem', () => {
    expectPass('round-food-shape', makeIngredient(), catalog);
  });
});

describe('baby-split-required', () => {
  it('projde recept s odkazem na konkrétní krok', () => {
    expectPass('baby-split-required', makeRecipe(), catalog);
  });

  it('zachytí prázdný babySplitPoint', () => {
    expectFail('baby-split-required', makeRecipe({ babySplitPoint: '   ' }), catalog);
  });

  it('zachytí odkaz na krok, který v baseSteps neexistuje', () => {
    const recipe = makeRecipe({ babySplitPoint: 'Po kroku 9 odeber porci pro miminko.' });
    expect(expectFail('baby-split-required', recipe, catalog)).toContain('9');
  });

  it('zachytí obecnou formulaci bez čísla kroku', () => {
    expectFail('baby-split-required', makeRecipe({ babySplitPoint: 'Odeber porci včas.' }), catalog);
  });
});

describe('veg-track-complete', () => {
  it('projde recept s masem, který má náhradu bílkoviny', () => {
    expectPass('veg-track-complete', makeMeatRecipe(), catalog);
  });

  it('zachytí prázdné vegetarianSteps', () => {
    expectFail('veg-track-complete', makeRecipe({ vegetarianSteps: [] }), catalog);
  });

  it('zachytí recept s masem bez vegetarianProteinSwap', () => {
    const recipe = makeMeatRecipe({ vegetarianProteinSwap: '' });
    expectFail('veg-track-complete', recipe, catalog);
  });

  it('zachytí náhradu, která maso jen vynechá', () => {
    const recipe = makeMeatRecipe({ vegetarianProteinSwap: 'Maso se jednoduše vynechá.' });
    expectFail('veg-track-complete', recipe, catalog);
  });
});

describe('hidden-animal-ingredients', () => {
  it('projde bezmasá varianta bez živočišných složek', () => {
    expectPass('hidden-animal-ingredients', makeRecipe(), catalog);
  });

  it('zachytí parmazán v bezmasé variantě', () => {
    const recipe = makeRecipe({ vegetarianSteps: ['Placky posyp strouhaným parmazánem.'] });
    expectFail('hidden-animal-ingredients', recipe, catalog);
  });

  it('zachytí nevegetariánskou složku vedenou ve společné linii', () => {
    const recipe = makeRecipe({
      ingredients: [
        { ingredientId: 'brokolice', amount: '300 g', track: 'all' },
        { ingredientId: 'kureci-prsa', amount: '200 g', track: 'all' },
      ],
    });
    expect(expectFail('hidden-animal-ingredients', recipe, catalog)).toContain('Kuřecí prsa');
  });
});

describe('source-required', () => {
  it('projde surovina s jedním zdrojem tier 1', () => {
    expectPass('source-required', makeIngredient(), catalog);
  });

  it('projde surovina se dvěma zdroji tier 2', () => {
    const ingredient = makeIngredient({
      sources: [
        {
          org: 'Laktační liga',
          title: 'Zavádění příkrmů',
          url: 'https://www.kojeni.cz/prikrmy/',
          accessedAt: '2026-09-11',
          tier: 2,
        },
        {
          org: 'Výživa dětí',
          title: 'Zelenina v příkrmu',
          url: 'https://www.vyzivadeti.cz/zelenina/',
          accessedAt: '2026-09-11',
          tier: 2,
        },
      ],
    });
    expectPass('source-required', ingredient, catalog);
  });

  it('zachytí surovinu s jediným zdrojem tier 2', () => {
    const ingredient = makeIngredient({
      sources: [
        {
          org: 'Laktační liga',
          title: 'Zavádění příkrmů',
          url: 'https://www.kojeni.cz/prikrmy/',
          accessedAt: '2026-09-11',
          tier: 2,
        },
      ],
    });
    expectFail('source-required', ingredient, catalog);
  });

  it('zachytí surovinu bez zdrojů', () => {
    expectFail('source-required', makeIngredient({ sources: [] }), catalog);
  });
});

describe('source-url-shape', () => {
  it('projde zdroj na povolené doméně přes https', () => {
    expectPass('source-url-shape', makeIngredient(), catalog);
  });

  it('zachytí blog mimo povolený seznam', () => {
    const ingredient = makeIngredient({
      sources: [
        {
          org: 'Blog o vaření',
          title: 'Brokolice pro miminka',
          url: 'https://maminkyvari.blog/brokolice',
          accessedAt: '2026-09-11',
          tier: 1,
        },
      ],
    });
    expect(expectFail('source-url-shape', ingredient, catalog)).toContain('povoleném');
  });

  it('zachytí http místo https', () => {
    const ingredient = makeIngredient({
      sources: [
        {
          org: 'NHS',
          title: 'Weaning',
          url: 'http://www.nhs.uk/start-for-life/baby/weaning/',
          accessedAt: '2026-09-11',
          tier: 1,
        },
      ],
    });
    expectFail('source-url-shape', ingredient, catalog);
  });

  it('zachytí pojišťovnu vydávanou za tier 1', () => {
    const ingredient = makeIngredient({
      sources: [
        {
          org: 'ČPZP',
          title: 'Příkrmy',
          url: 'https://www.cpzp.cz/prikrmy',
          accessedAt: '2026-09-11',
          tier: 1,
        },
      ],
    });
    expectFail('source-url-shape', ingredient, catalog);
  });

  it('zachytí tier 1 u domény, která je jen tier 2', () => {
    const ingredient = makeIngredient({
      sources: [
        {
          org: 'Solid Starts',
          title: 'Broccoli',
          url: 'https://solidstarts.com/foods/broccoli/',
          accessedAt: '2026-09-11',
          tier: 1,
        },
      ],
    });
    expectFail('source-url-shape', ingredient, catalog);
  });

  it('zachytí chybějící datum ověření ve tvaru ISO', () => {
    const ingredient = makeIngredient({
      sources: [
        {
          org: 'NHS',
          title: 'Weaning',
          url: 'https://www.nhs.uk/start-for-life/baby/weaning/',
          accessedAt: '11. 9. 2026',
          tier: 1,
        },
      ],
    });
    expectFail('source-url-shape', ingredient, catalog);
  });
});

describe('no-placeholder', () => {
  it('projde plně vyplněná surovina', () => {
    expectPass('no-placeholder', makeIngredient(), catalog);
  });

  it('zachytí TODO v poznámce k hazardu', () => {
    const ingredient = makeIngredient({ hazardNotes: { sul: 'TODO doplnit' } });
    expectFail('no-placeholder', ingredient, catalog);
  });

  it('zachytí prázdný název v receptu', () => {
    expectFail('no-placeholder', makeRecipe({ servings: '' }), catalog);
  });
});

describe('ingredient-refs-resolve', () => {
  it('projde recept, jehož složky jsou v katalogu', () => {
    expectPass('ingredient-refs-resolve', makeRecipe(), catalog);
  });

  it('zachytí odkaz na neexistující surovinu', () => {
    const recipe = makeRecipe({
      ingredients: [{ ingredientId: 'neexistuje', amount: '1 ks', track: 'all' }],
    });
    expect(expectFail('ingredient-refs-resolve', recipe, catalog)).toContain('neexistuje');
  });
});

describe('stage-prep-complete', () => {
  it('projde surovina se třemi různými fázemi', () => {
    expectPass('stage-prep-complete', makeIngredient(), catalog);
  });

  it('zachytí příliš krátký popis fáze', () => {
    const ingredient = makeIngredient({
      prep: { ...makeIngredient().prep, '9m': { serving: 'Nakrájej na kostičky.' } },
    });
    expect(expectFail('stage-prep-complete', ingredient, catalog)).toContain('9m');
  });

  it('zachytí tři shodné fáze', () => {
    const text =
      'Uvař v páře doměkka a nabídni v podélných proužcích velikosti prstu, aby šly uchopit v pěsti a dcera je zvládla sama donést do pusy.';
    const ingredient = makeIngredient({
      prep: { '6m': { serving: text }, '9m': { serving: text }, '12m': { serving: text } },
    });
    expectFail('stage-prep-complete', ingredient, catalog);
  });
});

describe('allergen-consistency', () => {
  it('projde recept, jehož alergeny odpovídají složkám', () => {
    expectPass('allergen-consistency', makeRecipe(), catalog);
  });

  it('zachytí chybějící alergen odvozený ze složky', () => {
    const eggCatalog = makeCatalog({
      ingredients: [makeIngredient({ id: 'vejce', nameCz: 'Vejce', allergens: ['vejce'] })],
    });
    const recipe = makeRecipe({
      ingredients: [{ ingredientId: 'vejce', amount: '1 ks', track: 'all' }],
      allergens: [],
    });
    expect(expectFail('allergen-consistency', recipe, eggCatalog)).toContain('vejce');
  });

  it('zachytí alergen uvedený navíc', () => {
    expectFail('allergen-consistency', makeRecipe({ allergens: ['arasidy'] }), catalog);
  });
});

describe('min-age-consistency', () => {
  it('projde recept, jehož věk odpovídá složkám', () => {
    expectPass('min-age-consistency', makeRecipe(), catalog);
  });

  it('zachytí recept mladší než jeho nejpozdější složka', () => {
    const honeyCatalog = makeCatalog({
      ingredients: [makeCarrot({ id: 'mrkev', minAgeMonths: 12 })],
    });
    const recipe = makeRecipe({
      minAgeMonths: 6,
      ingredients: [{ ingredientId: 'mrkev', amount: '100 g', track: 'all' }],
    });
    expect(expectFail('min-age-consistency', recipe, honeyCatalog)).toContain('12');
  });
});

describe('mercury-limit', () => {
  const tuna = makeChicken({
    id: 'tunak',
    nameCz: 'Tuňák',
    altNamesCz: ['tuňák žlutoploutvý'],
    hazards: ['rtut'],
    frequencyLimit: 'Nejvýše jednou za dva týdny.',
  });

  it('projde ryba s vyplněným frequencyLimit', () => {
    expectPass('mercury-limit', tuna, catalog);
  });

  it('zachytí rybu s rtutí bez frequencyLimit', () => {
    const broken = makeChicken({ ...tuna, frequencyLimit: undefined });
    expectFail('mercury-limit', broken, catalog);
  });
});

describe('nitrate-note', () => {
  const spinach = makeIngredient({
    id: 'spenat',
    nameCz: 'Špenát',
    hazards: ['dusicnany'],
    hazardNotes: {
      dusicnany: 'Uvařený špenát nenechávej stát při pokojové teplotě a už ho znovu neohřívej.',
    },
  });

  it('projde surovina s pokynem k opakovanému ohřevu', () => {
    expectPass('nitrate-note', spinach, catalog);
  });

  it('zachytí dusičnany bez pokynu k ohřevu', () => {
    const broken = makeIngredient({ ...spinach, hazardNotes: { dusicnany: 'Obsahuje dusičnany.' } });
    expectFail('nitrate-note', broken, catalog);
  });
});

describe('duplicate-detection', () => {
  it('projde katalog bez duplicit', () => {
    expectPass('duplicate-detection', makeIngredient(), catalog);
  });

  it('zachytí dvě suroviny se stejným názvem', () => {
    const duplicate = makeIngredient({ id: 'brokolice-2' });
    const withDuplicate = makeCatalog({
      ingredients: [...catalog.ingredients, duplicate],
    });
    expectFail('duplicate-detection', duplicate, withDuplicate);
  });

  it('zachytí překryv v altNamesCz', () => {
    const overlapping = makeIngredient({
      id: 'karotka',
      nameCz: 'Karotka',
      altNamesCz: ['mrkev'],
    });
    const withOverlap = makeCatalog({ ingredients: [...catalog.ingredients, overlapping] });
    expectFail('duplicate-detection', overlapping, withOverlap);
  });
});

describe('text-uniqueness', () => {
  it('projde katalog s různě psanými popisy', () => {
    expectPass('text-uniqueness', makeIngredient(), catalog);
  });

  it('zachytí popis vygenerovaný šablonou', () => {
    const cloned = makeIngredient({ id: 'brokolice-klon', nameCz: 'Brokolice klon' });
    const withClone = makeCatalog({ ingredients: [...catalog.ingredients, cloned] });
    expectFail('text-uniqueness', cloned, withClone);
  });
});

describe('length-sanity', () => {
  it('projde surovina s popisy v rozmezí 80–400 znaků', () => {
    expectPass('length-sanity', makeCarrot(), catalog);
  });

  it('zachytí popis delší než 400 znaků', () => {
    const long = 'Nakrájej na proužky velikosti prstu a podávej vlažné. '.repeat(10);
    const ingredient = makeCarrot({
      prep: { ...makeCarrot().prep, '6m': { serving: long } },
    });
    expectFail('length-sanity', ingredient, catalog);
  });

  it('zachytí obecnou frázi v chokingReason', () => {
    const ingredient = makeCarrot({ chokingReason: 'Dbejte opatrnosti a konzultujte s lékařem.' });
    expectFail('length-sanity', ingredient, catalog);
  });

  it('zachytí chybějící chokingReason u rizikové suroviny', () => {
    expectFail('length-sanity', makeCarrot({ chokingReason: undefined }), catalog);
  });
});

describe('ingredient-coverage', () => {
  it('projde surovina, která je složkou některého receptu', () => {
    expectPass('ingredient-coverage', makeCarrot(), catalog);
  });

  it('zachytí surovinu, na kterou se neodkazuje žádný recept', () => {
    const orphan = makeIngredient({
      id: 'topinambur',
      nameCz: 'Topinambur',
      altNamesCz: ['slunecnice hliznata'],
    });
    const message = expectFail(
      'ingredient-coverage',
      orphan,
      makeCatalog({ ingredients: [orphan] }),
    );
    expect(message).toContain('není složkou žádného receptu');
  });

  it('nechá projít surovinu uvedenou ve výjimkách i bez receptu', () => {
    const drink = makeIngredient({
      id: 'detsky-caj-bez-cukru',
      nameCz: 'Dětský čaj bez cukru',
      altNamesCz: ['caj pro deti'],
    });
    expectPass('ingredient-coverage', drink, makeCatalog({ ingredients: [drink] }));
  });

  it('každá výjimka má neprázdný důvod', () => {
    for (const [id, reason] of Object.entries(COVERAGE_EXCEPTIONS)) {
      expect(reason.trim().length, `Výjimka ${id} nemá důvod.`).toBeGreaterThan(0);
    }
  });
});

describe('neutral-address', () => {
  it('projde text, který oslovuje rodiče bez rodu', () => {
    expectPass('neutral-address', makeRecipe(), catalog);
  });

  it('zachytí „zůstaň klidná" v kroku receptu', () => {
    const recipe = makeRecipe({
      babySteps: ['Zůstaň klidná a nech dítě dávit, odezní to samo.', 'Placku nech vychladnout.'],
    });
    expect(expectFail('neutral-address', recipe, catalog)).toContain('ženském rodě');
  });

  it('zachytí „když si nejsi jistá" u suroviny', () => {
    const ingredient = makeIngredient({
      prepIdeas: ['v páře', 'pyré', 'pečená — když si nejsi jistá, raději nepodávej'],
    });
    expectFail('neutral-address', ingredient, catalog);
  });

  it('zachytí rodiče popsaného jako maminka', () => {
    const ingredient = makeIngredient({
      prepIdeas: ['v páře', 'pyré', 'hodí se v rodině s vegetariánskou maminkou'],
    });
    expectFail('neutral-address', ingredient, catalog);
  });

  it('zachytí ženskou shodu po slově dítě', () => {
    const recipe = makeRecipe({
      babyServing: {
        '6m': 'Podávej proužky velikosti prstu, dítě si je nabírá sama.',
        '9m': 'Nakrájej na kostičky do velikosti hrášku.',
        '12m': 'Nabídni vcelku, ať si sousto rozdělí samo.',
      },
    });
    expect(expectFail('neutral-address', recipe, catalog)).toContain('střední rod');
  });

  it('nevadí mu „metoda sama o sobě" — tam o dítě nejde', () => {
    expectPass(
      'neutral-address',
      makeIngredient({ prepIdeas: ['mouka sama o sobě se nepodává', 'v páře', 'pyré'] }),
      catalog,
    );
  });
});

describe('baby-serving-mentions-meat', () => {
  it('projde recept bez masa', () => {
    expectPass('baby-serving-mentions-meat', makeRecipe(), catalog);
  });

  it('projde recept, kde se maso do dětské porce vůbec nedostane', () => {
    // babySteps mluví jen o mrkvi — dětská porce je bezmasá a je to v pořádku.
    expectPass('baby-serving-mentions-meat', makeMeatRecipe(), catalog);
  });

  it('zachytí maso připravené pro dítě, o kterém podání mlčí', () => {
    const recipe = makeMeatRecipe({
      babySteps: [
        'Kuřecí maso pro miminko dus zvlášť dvacet minut a rozeber ho na vlákna.',
        'Mrkev rozmačkej vidličkou.',
      ],
      babyServing: {
        '6m': 'Podávej hranolky mrkve delší než dětská dlaň.',
        '9m': 'Mrkev nakrájej na kostičky do velikosti hrášku.',
        '12m': 'Nabídni mrkev vcelku vedle hromádky přílohy.',
      },
    });
    const message = expectFail('baby-serving-mentions-meat', recipe, catalog);
    expect(message).toContain('6m, 9m, 12m');
  });

  it('pojmenuje jen tu fázi, která maso opomíjí', () => {
    const recipe = makeMeatRecipe({
      babySteps: ['Kuřecí maso pro miminko dus zvlášť a rozvláknej.', 'Mrkev rozmačkej.'],
      babyServing: {
        '6m': 'Vlákno masa podej dlouhé přes prst, ať konec čouhá z pěsti.',
        '9m': 'Mrkev nakrájej na kostičky do velikosti hrášku.',
        '12m': 'Maso nakrájej na kousky velikosti fazole vedle mrkve.',
      },
    });
    const message = expectFail('baby-serving-mentions-meat', recipe, catalog);
    expect(message).toContain('9m');
    expect(message).not.toContain('6m');
  });

  it('uzná i obecné slovo maso, nejen název suroviny', () => {
    const recipe = makeMeatRecipe({
      babySteps: ['Kuřecí maso pro miminko dus zvlášť a rozvláknej.', 'Mrkev rozmačkej.'],
      babyServing: {
        '6m': 'Maso podej v dlouhém vlákně přes celou dlaň.',
        '9m': 'Maso natrhej na krátká vlákna k rozmačkané mrkvi.',
        '12m': 'Maso nakrájej nadrobno vedle hromádky mrkve.',
      },
    });
    expectPass('baby-serving-mentions-meat', recipe, catalog);
  });
});

describe('pokrytí pravidel', () => {
  it('každé pravidlo ze specifikace má vlastní describe blok v tomhle souboru', () => {
    const expected = [
      'no-honey-baby',
      'no-salt-baby',
      'no-sugar-baby',
      'no-whole-nuts',
      'round-food-shape',
      'baby-split-required',
      'veg-track-complete',
      'hidden-animal-ingredients',
      'source-required',
      'source-url-shape',
      'no-placeholder',
      'ingredient-refs-resolve',
      'stage-prep-complete',
      'allergen-consistency',
      'min-age-consistency',
      'mercury-limit',
      'nitrate-note',
      'duplicate-detection',
      'text-uniqueness',
      'length-sanity',
      'ingredient-coverage',
      'neutral-address',
      'baby-serving-mentions-meat',
    ];
    expect(safetyRules.map((rule) => rule.id)).toEqual(expected);
  });

  it('platný katalog neprodukuje žádnou chybu', () => {
    const findings = runSafetyRules(catalog);
    expect(findings.filter((f) => f.severity === 'error')).toEqual([]);
  });
});
