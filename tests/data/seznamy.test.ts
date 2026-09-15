import { describe, expect, it } from 'vitest';
import { ingredientById, lists } from '../../src/data';
import { guideById } from '../../src/data/guides';
import { PODMINKY } from '../../src/data/listRules';

/**
 * Seznam nesmí tvrdit nic, co katalog nepotvrzuje.
 *
 * Právě tohle je u tematických seznamů to nejsnazší selhání: položka se do
 * „Železa na talíř" dostane, protože se tam hodí významem, a ne proto, že
 * železo opravdu má. Podmínku nese každý seznam u sebe a tenhle test ji
 * uplatní na všechny jeho položky.
 */
describe('tematické seznamy surovin', () => {
  it('každá položka existuje v katalogu', () => {
    const chybejici = lists.flatMap((seznam) =>
      seznam.ingredientIds
        .filter((id) => !ingredientById.has(id))
        .map((id) => `${seznam.id}: ${id}`),
    );
    expect(chybejici).toEqual([]);
  });

  it('žádný seznam neopakuje tutéž surovinu', () => {
    for (const seznam of lists) {
      expect(new Set(seznam.ingredientIds).size).toBe(seznam.ingredientIds.length);
    }
  });

  it('každá položka splňuje podmínku svého seznamu', () => {
    const porusene: string[] = [];
    for (const seznam of lists) {
      if (seznam.podminka === undefined) continue;
      const podminka = PODMINKY[seznam.podminka];
      for (const id of seznam.ingredientIds) {
        const ingredient = ingredientById.get(id);
        if (ingredient === undefined) continue;
        if (!podminka.splnuje(ingredient)) {
          porusene.push(`${seznam.id}: ${ingredient.nameCz} — ${podminka.popis}`);
        }
      }
    }
    expect(porusene).toEqual([]);
  });

  it('rada, na kterou seznam odkazuje, existuje', () => {
    const chybejici = lists
      .filter((seznam) => seznam.guideId !== undefined && !guideById.has(seznam.guideId))
      .map((seznam) => `${seznam.id} → ${seznam.guideId ?? ''}`);
    expect(chybejici).toEqual([]);
  });

  it('seznam má aspoň šest položek — kratší není seznam, ale výběr', () => {
    for (const seznam of lists) {
      expect(seznam.ingredientIds.length).toBeGreaterThanOrEqual(6);
    }
  });

  it('texty seznamu nejsou zástupné ani prázdné', () => {
    for (const seznam of lists) {
      expect(seznam.titleCz.trim().length).toBeGreaterThan(3);
      expect(seznam.summary.trim().length).toBeGreaterThan(15);
      expect(seznam.intro.trim().length).toBeGreaterThan(60);
      for (const text of [seznam.titleCz, seznam.summary, seznam.intro]) {
        expect(text.toLowerCase()).not.toMatch(/todo|lorem|doplnit|\.\.\./);
      }
    }
  });

  it('seznam bez strojové podmínky musí mít zdroje — jinak si vybírá podle ničeho', () => {
    const bezOpory = lists
      .filter((seznam) => seznam.podminka === undefined && (seznam.sources ?? []).length === 0)
      .map((seznam) => seznam.id);
    expect(bezOpory).toEqual([]);
  });

  it('seznam na zoubkování stojí na ověřených zdrojích, ne na doslechu', () => {
    const zoubky = lists.find((seznam) => seznam.id === 'na-zoubky');
    expect(zoubky?.sources?.length ?? 0).toBeGreaterThanOrEqual(1);
    for (const zdroj of zoubky?.sources ?? []) {
      expect(zdroj.tier).toBe(1);
      expect(zdroj.url).toMatch(/^https:\/\//);
      expect(zdroj.accessedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('id seznamů jsou jedinečná', () => {
    expect(new Set(lists.map((one) => one.id)).size).toBe(lists.length);
  });
});
