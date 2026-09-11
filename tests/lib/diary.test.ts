import { describe, expect, it } from 'vitest';
import {
  allergenProgress,
  categoryStats,
  EXPOSURES_FOR_INTRODUCED,
  groupByDay,
  refusedIngredientIds,
  suggestToday,
} from '../../src/lib/diary';
import { ingredient, tasting } from './fixtures';

const katalog = [
  ingredient({ id: 'vejce', allergens: ['vejce'], isKeyAllergen: true }),
  ingredient({ id: 'arasidove-maslo', allergens: ['arasidy'], isKeyAllergen: true }),
  ingredient({ id: 'brokolice', category: 'zelenina' }),
  ingredient({ id: 'jablko', category: 'ovoce' }),
];

describe('groupByDay', () => {
  it('seskupí po dnech, nejnovější den první', () => {
    const skupiny = groupByDay([
      tasting({ id: 'a', date: '2026-09-01' }),
      tasting({ id: 'b', date: '2026-09-03' }),
      tasting({ id: 'c', date: '2026-09-03' }),
    ]);
    expect(skupiny.map((g) => g.date)).toEqual(['2026-09-03', '2026-09-01']);
    expect(skupiny[0]?.events).toHaveLength(2);
  });

  it('prázdný deník vrátí prázdný seznam', () => {
    expect(groupByDay([])).toEqual([]);
  });
});

describe('allergenProgress', () => {
  it('sleduje všech 9 klíčových alergenů', () => {
    expect(allergenProgress([], katalog)).toHaveLength(9);
  });

  it('po třech expozicích bez reakce vede alergen jako zavedený', () => {
    const zaznamy = [1, 2, 3].map((n) =>
      tasting({ id: `ev-${n}`, ingredientId: 'vejce', date: `2026-09-0${n}` }),
    );
    const vejce = allergenProgress(zaznamy, katalog).find((a) => a.allergen === 'vejce');
    expect(vejce?.exposures).toBe(EXPOSURES_FOR_INTRODUCED);
    expect(vejce?.introduced).toBe(true);
    expect(vejce?.lastDate).toBe('2026-09-03');
  });

  it('dvě expozice na zavedení nestačí', () => {
    const zaznamy = [1, 2].map((n) => tasting({ id: `ev-${n}`, ingredientId: 'vejce' }));
    expect(allergenProgress(zaznamy, katalog).find((a) => a.allergen === 'vejce')?.introduced).toBe(
      false,
    );
  });

  it('kožní reakce zavedení ruší, i když je expozic dost', () => {
    const zaznamy = [
      tasting({ id: 'ev-1', ingredientId: 'vejce' }),
      tasting({ id: 'ev-2', ingredientId: 'vejce' }),
      tasting({ id: 'ev-3', ingredientId: 'vejce' }),
      tasting({ id: 'ev-4', ingredientId: 'vejce', reaction: 'kozni' }),
    ];
    const vejce = allergenProgress(zaznamy, katalog).find((a) => a.allergen === 'vejce');
    expect(vejce?.hasReaction).toBe(true);
    expect(vejce?.introduced).toBe(false);
  });

  it('nezapočítá ochutnávku suroviny, která alergen neobsahuje', () => {
    const zaznamy = [tasting({ ingredientId: 'brokolice' })];
    expect(allergenProgress(zaznamy, katalog).find((a) => a.allergen === 'vejce')?.exposures).toBe(0);
  });
});

describe('categoryStats', () => {
  it('spočítá ochutnané z celkového počtu po kategoriích', () => {
    const staty = categoryStats([tasting({ ingredientId: 'brokolice' })], katalog);
    const zelenina = staty.find((s) => s.category === 'zelenina');
    expect(zelenina?.total).toBe(3);
    expect(zelenina?.tasted).toBe(1);
  });
});

describe('refusedIngredientIds', () => {
  it('bere v potaz jen poslední záznam u suroviny', () => {
    const zaznamy = [
      tasting({ id: 'a', ingredientId: 'jablko', amount: 'odmitla', createdAt: 1 }),
      tasting({ id: 'b', ingredientId: 'jablko', amount: 'snedla-vse', createdAt: 2 }),
      tasting({ id: 'c', ingredientId: 'brokolice', amount: 'odmitla', createdAt: 3 }),
    ];
    expect(refusedIngredientIds(zaznamy)).toEqual(['brokolice']);
  });
});

describe('suggestToday', () => {
  it('nabídne jen dosud neochutnané', () => {
    const navrhy = suggestToday(katalog, [tasting({ ingredientId: 'vejce' })], {
      ageMonths: 7,
      month: 7,
    });
    expect(navrhy.map((i) => i.id)).not.toContain('vejce');
  });

  it('respektuje věk a sezónu', () => {
    const sezonni = [
      ingredient({ id: 'chrest', seasonCz: [4, 5] }),
      ingredient({ id: 'med', minAgeMonths: 12 }),
      ingredient({ id: 'mrkev' }),
    ];
    const navrhy = suggestToday(sezonni, [], { ageMonths: 7, month: 7 }).map((i) => i.id);
    expect(navrhy).toEqual(['mrkev']);
  });

  it('vrací nejvýš tři návrhy', () => {
    const hodne = Array.from({ length: 10 }, (_, n) => ingredient({ id: `s-${n}` }));
    expect(suggestToday(hodne, [], { ageMonths: 7, month: 7 })).toHaveLength(3);
  });

  it('v rámci jednoho dne je výběr stabilní', () => {
    const hodne = Array.from({ length: 10 }, (_, n) => ingredient({ id: `s-${n}` }));
    const prvni = suggestToday(hodne, [], { ageMonths: 7, month: 7 }, '2026-09-11');
    const druhy = suggestToday(hodne, [], { ageMonths: 7, month: 7 }, '2026-09-11');
    expect(prvni.map((i) => i.id)).toEqual(druhy.map((i) => i.id));
  });

  it('jiný den nabídne jiný výběr', () => {
    const hodne = Array.from({ length: 20 }, (_, n) => ingredient({ id: `s-${n}` }));
    const dnes = suggestToday(hodne, [], { ageMonths: 7, month: 7 }, '2026-09-11');
    const zitra = suggestToday(hodne, [], { ageMonths: 7, month: 7 }, '2026-09-12');
    expect(dnes.map((i) => i.id)).not.toEqual(zitra.map((i) => i.id));
  });
});
