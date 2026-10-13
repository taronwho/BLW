import { describe, expect, it } from 'vitest';
import { ingredientById } from '../../src/data/ingredients';
import { NEBEZNE_V_CESKU } from '../../src/plan/bezne';

describe('neběžné suroviny', () => {
  it('každé idčko je v katalogu', () => {
    for (const id of NEBEZNE_V_CESKU) expect(ingredientById.has(id), id).toBe(true);
  });

  it('první týden plánu ani klíčová česká zelenina mezi nimi nejsou', () => {
    for (const id of ['brokolice', 'kvetak', 'cuketa', 'brambor', 'dyne-hokaido', 'mrkev', 'jablko']) {
      expect(NEBEZNE_V_CESKU.has(id), id).toBe(false);
    }
  });
});
