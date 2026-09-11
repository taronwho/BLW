import { describe, expect, it } from 'vitest';
import {
  applyQuickFilter,
  emptyStateHint,
  filterByCategory,
  isInSeason,
  isSuitableNow,
  recipesWithIngredient,
  tastedIngredientIds,
} from '../../src/lib/filters';
import type { FilterContext } from '../../src/lib/filters';
import { ingredient, tasting } from './fixtures';
import type { Recipe } from '../../src/types';

const katalog = [
  ingredient({ id: 'brokolice', minAgeMonths: 6, seasonCz: [6, 7, 8] }),
  ingredient({ id: 'vejce', isKeyAllergen: true, allergens: ['vejce'], minAgeMonths: 6 }),
  ingredient({ id: 'med', minAgeMonths: 12, seasonCz: [] }),
  ingredient({ id: 'chrest', minAgeMonths: 6, seasonCz: [4, 5] }),
];

function context(overrides: Partial<FilterContext> = {}): FilterContext {
  return {
    tastedIds: new Set(['brokolice']),
    favorites: new Set(['vejce']),
    ageMonths: 7,
    month: 7,
    ...overrides,
  };
}

describe('applyQuickFilter', () => {
  it('Vše nechává seznam beze změny', () => {
    expect(applyQuickFilter(katalog, 'vse', context())).toHaveLength(4);
  });

  it('Neochutnáno vynechá, co už má záznam', () => {
    expect(applyQuickFilter(katalog, 'neochutnano', context()).map((i) => i.id)).not.toContain(
      'brokolice',
    );
  });

  it('Ochutnáno nechá jen to se záznamem', () => {
    expect(applyQuickFilter(katalog, 'ochutnano', context()).map((i) => i.id)).toEqual(['brokolice']);
  });

  it('Klíčové alergeny nechá jen položky pro plánované zavádění', () => {
    expect(applyQuickFilter(katalog, 'klicove-alergeny', context()).map((i) => i.id)).toEqual([
      'vejce',
    ]);
  });

  it('Oblíbené respektují seznam domácnosti', () => {
    expect(applyQuickFilter(katalog, 'oblibene', context()).map((i) => i.id)).toEqual(['vejce']);
  });

  it('Vhodné teď schová suroviny nad věk dcery', () => {
    const ids = applyQuickFilter(katalog, 'vhodne-ted', context({ ageMonths: 7 })).map((i) => i.id);
    expect(ids).not.toContain('med');
    expect(ids).toContain('brokolice');
  });

  it('Sezónní nechá celoroční i ty právě v sezóně', () => {
    const ids = applyQuickFilter(katalog, 'sezonni', context({ month: 7 })).map((i) => i.id);
    expect(ids).toContain('brokolice');
    expect(ids).toContain('med');
    expect(ids).not.toContain('chrest');
  });
});

describe('isSuitableNow', () => {
  it('bez data narození nic neschovává', () => {
    expect(isSuitableNow(ingredient({ minAgeMonths: 12 }), null)).toBe(true);
  });

  it('porovnává s věkem v měsících', () => {
    expect(isSuitableNow(ingredient({ minAgeMonths: 12 }), 11)).toBe(false);
    expect(isSuitableNow(ingredient({ minAgeMonths: 12 }), 12)).toBe(true);
  });
});

describe('isInSeason', () => {
  it('prázdné seasonCz znamená celoročně', () => {
    expect(isInSeason(ingredient({ seasonCz: [] }), 1)).toBe(true);
  });

  it('respektuje výčet měsíců', () => {
    expect(isInSeason(ingredient({ seasonCz: [4, 5] }), 5)).toBe(true);
    expect(isInSeason(ingredient({ seasonCz: [4, 5] }), 6)).toBe(false);
  });
});

describe('filterByCategory', () => {
  it('null znamená všechny kategorie', () => {
    expect(filterByCategory(katalog, null)).toHaveLength(4);
  });

  it('filtruje podle kategorie', () => {
    const smiseny = [...katalog, ingredient({ id: 'jablko', category: 'ovoce' })];
    expect(filterByCategory(smiseny, 'ovoce').map((i) => i.id)).toEqual(['jablko']);
  });
});

describe('emptyStateHint', () => {
  it('u filtru sezóny poradí zrušit sezónu', () => {
    expect(emptyStateHint('sezonni', null, '')).toContain('sezóny');
  });

  it('u hledání zmíní hledaný výraz', () => {
    expect(emptyStateHint('vse', null, 'xyzzy')).toContain('xyzzy');
  });

  it('nikdy nevrátí prázdný text', () => {
    for (const filtr of ['vse', 'neochutnano', 'ochutnano', 'oblibene', 'vhodne-ted'] as const) {
      expect(emptyStateHint(filtr, null, '').length).toBeGreaterThan(10);
    }
  });
});

describe('tastedIngredientIds', () => {
  it('sesbírá id ze záznamů', () => {
    const ids = tastedIngredientIds([tasting({ ingredientId: 'a' }), tasting({ ingredientId: 'b' })]);
    expect([...ids].sort()).toEqual(['a', 'b']);
  });
});

describe('recipesWithIngredient', () => {
  const recept = {
    id: 'r1',
    ingredients: [{ ingredientId: 'brokolice', amount: '100 g', track: 'all' }],
  } as Recipe;

  it('najde recepty s danou surovinou', () => {
    expect(recipesWithIngredient([recept], 'brokolice')).toHaveLength(1);
    expect(recipesWithIngredient([recept], 'mrkev')).toHaveLength(0);
  });
});
