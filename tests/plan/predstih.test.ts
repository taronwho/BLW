import { describe, expect, it } from 'vitest';
import { recipeById } from '../../src/data';
import { jeNebezna } from '../../src/plan/bezne';
import { sestavPlan, vekProPlan, type VstupPlanu } from '../../src/plan/generator';
import type { Child } from '../../src/types';

const DITE: Child = { id: 'dite-test', name: 'Testovací', birthDate: '2026-04-16' };

function vstup(mesice: number | null): VstupPlanu {
  return {
    dite: DITE,
    blok: 1,
    ochutnane: new Set(),
    mesice,
    mesicVRoce: 10,
    dnes: '2026-10-13',
  };
}

const jidel = (mesice: number | null): number =>
  sestavPlan(vstup(mesice)).dny.reduce((soucet, den) => soucet + den.jidla.length, 0);

describe('plán s předstihem', () => {
  it('dítě těsně před šestým měsícem dostane plný plán, ne prázdný', () => {
    expect(jidel(5)).toBeGreaterThan(30);
    expect(sestavPlan(vstup(5)).dny.every((den) => den.jidla.length > 0)).toBe(true);
  });

  it('mladší dítě se plánuje jako šestiměsíční, nic staršího nedostane', () => {
    expect(sestavPlan(vstup(4)).dny).toEqual(sestavPlan(vstup(6)).dny);
    for (const den of sestavPlan(vstup(4)).dny) {
      for (const jidlo of den.jidla) {
        const recept = recipeById.get(jidlo.recipeId ?? '');
        if (recept !== undefined) expect(recept.minAgeMonths).toBeLessThanOrEqual(6);
      }
    }
  });

  it('věk pro plán: pod šest měsíců šest, jinak beze změny', () => {
    expect(vekProPlan(3)).toBe(6);
    expect(vekProPlan(6)).toBe(6);
    expect(vekProPlan(10)).toBe(10);
    expect(vekProPlan(null)).toBeNull();
  });
});

describe('plán z běžných českých jídel', () => {
  it('neběžná surovina není novinkou v prvním bloku, dokud je z čeho brát', () => {
    for (const den of sestavPlan(vstup(6)).dny) {
      if (den.novinka !== undefined) expect(jeNebezna(den.novinka), den.novinka).toBe(false);
    }
  });

  it('jídla s neběžnou surovinou jsou v prvním bloku výjimka', () => {
    const plan = sestavPlan(vstup(6));
    const recepty = plan.dny.flatMap((den) =>
      den.jidla.map((jidlo) => recipeById.get(jidlo.recipeId ?? '')).filter((r) => r !== undefined),
    );
    const nebezne = recepty.filter((r) => r.ingredients.some((ref) => jeNebezna(ref.ingredientId)));
    expect(nebezne.length / recepty.length).toBeLessThan(0.15);
  });
});
