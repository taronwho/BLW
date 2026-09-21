import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { recipes } from '../../src/data';
import { jeJednoduchaUprava } from '../../src/data/jednoduche';

/**
 * Čísla o složitosti kuchařky v docs/GOALS.md musí sedět s daty.
 *
 * Audit 17. 9. 2026 (nález 2.3) ukázal, že „494 receptů" je součet dvou
 * různých věcí, a dokumentace to popisovala nepřesně. Napsat do doku
 * jiná čísla je snadné; nechat je zastarat ještě snazší. Tenhle test
 * spadne, jakmile se kuchařka posune a dok zůstane.
 */
const GOALS = readFileSync(new URL('../../docs/GOALS.md', import.meta.url), 'utf8');

const jednoduche = recipes.filter(jeJednoduchaUprava).length;
const plne = recipes.length - jednoduche;
const malokroku = recipes.filter((r) => !jeJednoduchaUprava(r) && r.baseSteps.length < 4).length;

function cisloZDoku(vzor: RegExp): number {
  const shoda = vzor.exec(GOALS);
  expect(shoda, `docs/GOALS.md neobsahuje ${String(vzor)}`).not.toBeNull();
  return Number(shoda?.[1]);
}

describe('složitost kuchařky odpovídá dokumentaci', () => {
  it('počet jednoduchých úprav', () => {
    expect(cisloZDoku(/\*\*(\d+) jednoduchých úprav/)).toBe(jednoduche);
  });

  it('počet plnohodnotných receptů', () => {
    expect(cisloZDoku(/a (\d+) plnohodnotných\s+receptů\*\*/)).toBe(plne);
  });

  it('kolik plnohodnotných receptů má míň než čtyři kroky', () => {
    expect(cisloZDoku(/\*\*(\d+) z těch plnohodnotných/)).toBe(malokroku);
  });

  it('obě množiny dohromady dávají celou kuchařku', () => {
    // Kdyby se překrývaly, nedaly by se čísla sečíst a souhrn by lhal.
    expect(jednoduche + plne).toBe(recipes.length);
  });

  it('žádný recept nemá míň než tři kroky', () => {
    // Dvoukrokový recept už není postup, je to věta. Tohle je podlaha,
    // pod kterou se kuchařka nesmí propadnout ani u jednoduchých úprav.
    for (const recipe of recipes) {
      expect(recipe.baseSteps.length, recipe.id).toBeGreaterThanOrEqual(3);
    }
  });
});
