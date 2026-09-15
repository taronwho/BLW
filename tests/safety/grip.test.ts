import { describe, expect, it } from 'vitest';
import { ingredients, recipes } from '../../src/data';
import { suitableNow } from '../../src/app/lib/derive';
import { recipeServingForm } from '../../src/app/lib/deriveRecipes';
import { stageForAge } from '../../src/app/lib/age';
import {
  GRIP_HOW_TO_TELL,
  GRIP_LABELS,
  GRIP_SHAPE,
  GRIP_SHORT,
  GRIP_STAGE,
  GRIP_TYPICAL_MONTHS,
  gripAdviceApplies,
  gripForAge,
  gripShapeAdvice,
  gripVsAge,
  smallPiecesAllowed,
} from '../../src/app/lib/grip';
import { GRIPS } from '../../src/types';
import type { ChokingRisk, Grip, ServingForm } from '../../src/types';

const FORMY: readonly ServingForm[] = ['kusove', 'drobne', 'kasovite', 'neresi'];

const RIZIKA: readonly ChokingRisk[] = ['low', 'medium', 'high'];

describe('úchop a tvar sousta', () => {
  it('odhad podle věku jde po posloupnosti dlaňový → nůžkový → pinzetový', () => {
    expect(gripForAge(6)).toBe('dlanovy');
    expect(gripForAge(7)).toBe('dlanovy');
    expect(gripForAge(8)).toBe('nuzkovy');
    expect(gripForAge(11)).toBe('nuzkovy');
    expect(gripForAge(12)).toBe('pinzetovy');
  });

  it('bez data narození se začíná od dlaňového úchopu', () => {
    expect(gripForAge(null)).toBe('dlanovy');
  });

  it('pozná, že je ruka napřed nebo pozadu proti věku', () => {
    expect(gripVsAge('pinzetovy', 7)).toBe('napred');
    expect(gripVsAge('dlanovy', 13)).toBe('pozadu');
    expect(gripVsAge('dlanovy', 6)).toBe('shoda');
    // Bez věku se nedá nic porovnávat, takže se nic netvrdí.
    expect(gripVsAge('pinzetovy', null)).toBe('shoda');
  });

  it('u dlaňového úchopu se radí proužek, u pinzetového malé kousky', () => {
    expect(GRIP_SHAPE.dlanovy).toMatch(/prst/);
    expect(GRIP_SHAPE.pinzetovy).toMatch(/malé kousky/);
  });
});

describe('úchop nikdy neoslabuje bezpečnost', () => {
  it('malé kousky se nepovolují u vysokého rizika dušení, ani s pinzetovým úchopem', () => {
    for (const grip of GRIPS) {
      expect(smallPiecesAllowed(grip, 'high')).toBe(false);
    }
    expect(smallPiecesAllowed('pinzetovy', 'low')).toBe(true);
    expect(smallPiecesAllowed('dlanovy', 'low')).toBe(false);
  });

  it('rada u vysokého rizika odkazuje zpět na bezpečnostní pokyn', () => {
    for (const grip of GRIPS) {
      for (const form of FORMY) {
        const rada = gripShapeAdvice(grip, 'high', form);
        expect(rada.trim().length).toBeGreaterThan(0);
        if (grip === 'pinzetovy') {
          // Právě tady by šlo nejsnáz svést dítě k drobečkům, text to musí odmítnout.
          expect(rada).not.toMatch(/můžeš nabízet malé kousky/);
          expect(rada).toMatch(/bezpečnost/);
        }
      }
    }
  });

  it('žádná kombinace úchopu, rizika a podoby nezůstane bez textu', () => {
    for (const grip of GRIPS) {
      for (const risk of RIZIKA) {
        for (const form of FORMY) {
          expect(gripShapeAdvice(grip, risk, form).trim().length).toBeGreaterThan(20);
        }
      }
    }
  });

  /**
   * Rada, která u dané suroviny nedává smysl, není neškodná: naučí rodiče
   * panel přeskakovat i tam, kde na něm záleží.
   */
  it('u kaše a u drobné suroviny se neradí krájení na proužky', () => {
    for (const grip of GRIPS) {
      for (const risk of RIZIKA) {
        for (const form of ['kasovite', 'drobne'] as const) {
          const rada = gripShapeAdvice(grip, risk, form);
          expect(rada, `${grip}/${risk}/${form}`).not.toMatch(/Krájej na proužky/);
        }
      }
    }
  });

  it('panel se neukazuje tam, kde žádné sousto nevzniká', () => {
    expect(gripAdviceApplies('neresi')).toBe(false);
    for (const form of ['kusove', 'drobne', 'kasovite'] as const) {
      expect(gripAdviceApplies(form)).toBe(true);
    }
  });

  it('podobu na talíři má vyplněnou každá surovina', () => {
    const bez = ingredients.filter((item) => !FORMY.includes(item.servingForm));
    expect(bez.map((item) => item.nameCz)).toEqual([]);
  });

  /**
   * Recept nikdy nevyjde jako „neřeší se", jídlo vždycky něco na talíři má.
   * Kdyby vyšlo, panel o tvaru sousta by z receptu zmizel úplně.
   */
  it('recept má vždycky podobu, u které se tvar sousta řeší', () => {
    for (const recipe of recipes) {
      expect(gripAdviceApplies(recipeServingForm(recipe)), recipe.id).toBe(true);
    }
  });

  it('úchop nemění, které suroviny jsou vhodné, to zůstává na věku', () => {
    // suitableNow bere jen věk. Kdyby někdo v budoucnu přidal úchop i sem,
    // začaly by se dítěti nabízet suroviny nad jeho věk.
    const sedmimesicni = ingredients.filter((item) => suitableNow(item, 7));
    const dvanactimesicni = ingredients.filter((item) => suitableNow(item, 12));
    expect(sedmimesicni.length).toBeLessThan(dvanactimesicni.length);
    for (const item of sedmimesicni) {
      expect(item.minAgeMonths).toBeLessThanOrEqual(7);
    }
  });

  it('fáze krájení se odvozuje z věku, ne z úchopu', () => {
    // GRIP_STAGE existuje jen k pojmenování rozporu proti věku. Kdyby se z něj
    // předvybírala fáze, měnil by úchop i měkkost a výběr, a to z něj neplyne.
    expect(stageForAge(7)).toBe('6m');
    expect(GRIP_STAGE.pinzetovy).toBe('12m');
    expect(stageForAge(7)).not.toBe(GRIP_STAGE.pinzetovy);
  });

  it('každý úchop má popis, podle čeho se pozná, i orientační věk', () => {
    // Rodič vybírá podle toho, co vidí. Kdyby některému úchopu popis chyběl,
    // zbyl by z výběru jen věk, a tím by celá věc ztratila smysl.
    const grips: readonly Grip[] = GRIPS;
    expect(grips).toHaveLength(3);
    for (const grip of grips) {
      expect(GRIP_HOW_TO_TELL[grip].trim().length).toBeGreaterThan(40);
      expect(GRIP_LABELS[grip].trim().length).toBeGreaterThan(0);
      expect(GRIP_SHORT[grip].trim().length).toBeGreaterThan(0);
      expect(GRIP_TYPICAL_MONTHS[grip]).toMatch(/měsíc/);
    }
  });
});
