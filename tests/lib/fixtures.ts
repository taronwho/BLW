import type { Ingredient, TastingEvent } from '../../src/types';

/** Minimální platná surovina pro testy logiky — obsah řeší fáze 2. */
export function ingredient(overrides: Partial<Ingredient> = {}): Ingredient {
  const filler =
    'Uvař doměkka a nabídni v proužcích velikosti prstu, aby šly uchopit v pěsti a dcera si je sama donesla do pusy.';
  return {
    id: 'brokolice',
    nameCz: 'Brokolice',
    altNamesCz: [],
    category: 'zelenina',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': { serving: filler },
      '9m': { serving: `${filler} Ve druhé fázi menší kousky.` },
      '12m': { serving: `${filler} Ve třetí fázi větší sousta.` },
    },
    prepIdeas: ['v páře', 'pečená', 'pyré'],
    seasonCz: [],
    vegetarian: true,
    sources: [],
    reviewStatus: 'verified',
    ...overrides,
  };
}

export function tasting(overrides: Partial<TastingEvent> = {}): TastingEvent {
  return {
    id: 'ev-1',
    ingredientId: 'brokolice',
    date: '2026-09-10',
    amount: 'ochutnala',
    reaction: 'zadna',
    createdBy: 'uid-matka',
    createdAt: 1_000,
    ...overrides,
  };
}
