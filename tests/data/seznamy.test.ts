import { describe, expect, it } from 'vitest';
import { ingredientById, lists } from '../../src/data';
import { guideById } from '../../src/data/guides';
import { PODMINKY } from '../../src/data/listRules';
import { najdiTypografii, najdiVykani } from '../../src/safety/language';
import { GENDERED_ADDRESS_PATTERNS, KNOWN_TYPO_PATTERNS } from '../../src/safety/vocabulary';
import { findPatterns } from '../../src/safety/text';

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
      seznam.polozky
        .filter((polozka) => !ingredientById.has(polozka.id))
        .map((polozka) => `${seznam.id}: ${polozka.id}`),
    );
    expect(chybejici).toEqual([]);
  });

  it('žádný seznam neopakuje tutéž surovinu', () => {
    for (const seznam of lists) {
      const ids = seznam.polozky.map((polozka) => polozka.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('každá položka splňuje podmínku svého seznamu', () => {
    const porusene: string[] = [];
    for (const seznam of lists) {
      if (seznam.podminka === undefined) continue;
      const podminka = PODMINKY[seznam.podminka];
      for (const { id } of seznam.polozky) {
        const ingredient = ingredientById.get(id);
        if (ingredient === undefined) continue;
        if (!podminka.splnuje(ingredient)) {
          porusene.push(`${seznam.id}: ${ingredient.nameCz}, ${podminka.popis}`);
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

  it('seznam má aspoň šest položek, kratší není seznam, ale výběr', () => {
    for (const seznam of lists) {
      expect(seznam.polozky.length).toBeGreaterThanOrEqual(6);
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

  it('seznam bez strojové podmínky musí mít zdroje, jinak si vybírá podle ničeho', () => {
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

  it('každá položka má vlastní popisek, ne prázdný ani zástupný', () => {
    for (const seznam of lists) {
      for (const polozka of seznam.polozky) {
        expect(polozka.note.trim().length).toBeGreaterThan(12);
        expect(polozka.note.trim()).toMatch(/[.!?]$/);
        expect(polozka.note.toLowerCase()).not.toMatch(/todo|lorem|doplnit/);
      }
    }
  });

  it('popisky se v jednom seznamu neopakují', () => {
    for (const seznam of lists) {
      const texty = seznam.polozky.map((polozka) => polozka.note);
      expect(new Set(texty).size).toBe(texty.length);
    }
  });

  it('id seznamů jsou jedinečná', () => {
    expect(new Set(lists.map((one) => one.id)).size).toBe(lists.length);
  });
});

/**
 * Čeština v seznamech se kontroluje stejnými pravidly jako v katalogu.
 *
 * Katalog má na typografii, vykání a známé překlepy spustitelná pravidla
 * v `src/safety/`. Seznamy jimi dosud neprocházely, protože vznikly později
 *, a text, který nikdo nekontroluje, se pozná právě tím, že v něm chyby
 * zůstanou.
 */
describe('čeština v seznamech', () => {
  const texty = lists.flatMap((seznam) => [
    { kde: `${seznam.id}/titleCz`, text: seznam.titleCz },
    { kde: `${seznam.id}/summary`, text: seznam.summary },
    { kde: `${seznam.id}/intro`, text: seznam.intro },
    ...seznam.polozky.map((polozka) => ({
      kde: `${seznam.id}/${polozka.id}`,
      text: polozka.note,
    })),
  ]);

  it('drží českou typografii, uvozovky, pomlčky, mezery', () => {
    const chyby = texty
      .map(({ kde, text }) => ({ kde, nalez: najdiTypografii(text) }))
      .filter((one) => one.nalez !== null)
      .map((one) => `${one.kde}: ${one.nalez?.problem ?? ''}`);
    expect(chyby).toEqual([]);
  });

  it('tyká stejně jako zbytek aplikace', () => {
    const chyby = texty
      .map(({ kde, text }) => ({ kde, nalez: najdiVykani(text) }))
      .filter((one) => one.nalez !== null)
      .map((one) => `${one.kde}: ${one.nalez?.problem ?? ''}`);
    expect(chyby).toEqual([]);
  });

  it('neobsahuje známé překlepy', () => {
    const chyby = texty
      .map(({ kde, text }) => ({
        kde,
        nalez: findPatterns(text, KNOWN_TYPO_PATTERNS, { honorNegation: false })[0],
      }))
      .filter((one) => one.nalez !== undefined)
      .map((one) => `${one.kde}: ${one.nalez ?? ''}`);
    expect(chyby).toEqual([]);
  });

  it('neoslovuje rodiče podle rodu', () => {
    const chyby = texty
      .map(({ kde, text }) => ({
        kde,
        nalez: findPatterns(text, GENDERED_ADDRESS_PATTERNS, { honorNegation: false })[0],
      }))
      .filter((one) => one.nalez !== undefined)
      .map((one) => `${one.kde}: ${one.nalez ?? ''}`);
    expect(chyby).toEqual([]);
  });

  it('věty začínají velkým písmenem', () => {
    const chyby = texty
      .filter(({ text }) => text.trim()[0] !== text.trim()[0]?.toUpperCase())
      .map(({ kde }) => kde);
    expect(chyby).toEqual([]);
  });
});
