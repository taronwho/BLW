import { describe, expect, it } from 'vitest';
import { ingredients } from '../../src/data';
import { suitableNow } from '../../src/app/lib/derive';
import { stageForAge } from '../../src/app/lib/age';
import {
  GRIP_HOW_TO_TELL,
  GRIP_LABELS,
  GRIP_SHAPE,
  GRIP_SHORT,
  GRIP_STAGE,
  GRIP_TYPICAL_MONTHS,
  gripForAge,
  gripShapeAdvice,
  gripVsAge,
  smallPiecesAllowed,
} from '../../src/app/lib/grip';
import { GRIPS } from '../../src/types';
import type { ChokingRisk, Grip } from '../../src/types';

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
      const rada = gripShapeAdvice(grip, 'high');
      expect(rada.trim().length).toBeGreaterThan(0);
      if (grip === 'pinzetovy') {
        // Právě tady by šlo nejsnáz svést dítě k drobečkům — text to musí odmítnout.
        expect(rada).not.toMatch(/můžeš nabízet malé kousky/);
        expect(rada).toMatch(/bezpečnost/);
      }
    }
  });

  it('žádná kombinace úchopu a rizika nezůstane bez textu', () => {
    for (const grip of GRIPS) {
      for (const risk of RIZIKA) {
        expect(gripShapeAdvice(grip, risk).trim().length).toBeGreaterThan(20);
      }
    }
  });

  it('úchop nemění, které suroviny jsou vhodné — to zůstává na věku', () => {
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
    // předvybírala fáze, měnil by úchop i měkkost a výběr — a to z něj neplyne.
    expect(stageForAge(7)).toBe('6m');
    expect(GRIP_STAGE.pinzetovy).toBe('12m');
    expect(stageForAge(7)).not.toBe(GRIP_STAGE.pinzetovy);
  });

  it('každý úchop má popis, podle čeho se pozná, i orientační věk', () => {
    // Rodič vybírá podle toho, co vidí. Kdyby některému úchopu popis chyběl,
    // zbyl by z výběru jen věk — a tím by celá věc ztratila smysl.
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
