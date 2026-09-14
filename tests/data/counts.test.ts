import { describe, expect, it } from 'vitest';
import { guides, ingredients, recipes } from '../../src/data';
import { CATALOG_COUNTS } from '../../src/data/counts';

describe('počty na úvodní obrazovce', () => {
  it('sedí s katalogem', () => {
    // Úvodní obrazovka je záměrně nemá z katalogu, aby ho nestahovala.
    // Tenhle test je jediné, co brání tomu, aby se čísla rozešla.
    expect(CATALOG_COUNTS.ingredients).toBe(ingredients.length);
    expect(CATALOG_COUNTS.recipes).toBe(recipes.length);
    expect(CATALOG_COUNTS.guides).toBe(guides.length);
  });
});
