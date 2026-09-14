import { describe, expect, it } from 'vitest';
import { ingredientById } from '../../src/data';
import {
  COMPOSITION,
  DENNI_POTREBA,
  PODIL_OBSAHUJE,
  PODIL_VYZNAMNY,
  prah,
  urovenZObsahu,
} from '../../src/data/composition';
import { nutrientProfile } from '../../src/data/nutrients';

describe('naměřený obsah živin', () => {
  it('prahy odpovídají patnácti a třiceti procentům denní potřeby', () => {
    expect(prah('vitaminC', 'obsahuje')).toBeCloseTo(DENNI_POTREBA.vitaminC * PODIL_OBSAHUJE);
    expect(prah('vitaminC', 'vyznamny')).toBeCloseTo(DENNI_POTREBA.vitaminC * PODIL_VYZNAMNY);
    expect(prah('vitaminC', 'vyznamny')).toBe(prah('vitaminC', 'obsahuje') * 2);
  });

  it('úroveň se odvodí z miligramů na sto gramů', () => {
    expect(urovenZObsahu('vitaminC', 0)).toBe('nevyznamny');
    expect(urovenZObsahu('vitaminC', prah('vitaminC', 'obsahuje'))).toBe('obsahuje');
    expect(urovenZObsahu('vitaminC', prah('vitaminC', 'vyznamny'))).toBe('vyznamny');
    expect(urovenZObsahu('iron', 1)).toBe('nevyznamny');
    expect(urovenZObsahu('zinc', 5)).toBe('vyznamny');
  });

  it('naměřená hodnota přebíjí zařazení podle skupiny', () => {
    // Kiwi má 130 mg vitaminu C na 100 g, tedy mnohonásobek prahu.
    expect(COMPOSITION['kiwi']?.vitaminC).toBe(130);
    expect(nutrientProfile(ingredientById.get('kiwi') as never).vitaminC).toBe('vyznamny');
  });

  it('každá naměřená hodnota má zdroj a je kladná', () => {
    for (const [id, slozeni] of Object.entries(COMPOSITION)) {
      expect(ingredientById.has(id), `surovina ${id} v katalogu není`).toBe(true);
      expect(slozeni.zdroj.url.startsWith('https://')).toBe(true);
      expect(slozeni.zdroj.accessedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      for (const hodnota of [slozeni.vitaminC, slozeni.iron, slozeni.zinc]) {
        if (hodnota !== undefined) expect(hodnota).toBeGreaterThan(0);
      }
    }
  });
});
