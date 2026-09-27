import { readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { KLICE_OBRAZKU } from '../../src/app/lib/obrazkySousta';
import { ingredientById } from '../../src/data/ingredients';
import { UKAZKY_TVARU, proFazi } from '../../src/app/lib/tvarSousta';
import { normalize } from '../../src/safety/text';
import { STAGES } from '../../src/types';
import type { Stage } from '../../src/types';

/**
 * Průvodce tvarem sousta nemá vlastní zdravotní text: pokyn čte z katalogu
 * a popisky pod obrázky jen pojmenovávají, co obrázek ukazuje. Tady se
 * hlídá, že popisek u každé fáze opravdu odpovídá pokynu katalogu. Když se
 * katalog změní, test spadne a popisek (i obrázek) se musí srovnat s ním.
 */
const OPORA: Record<string, { ano: Record<Stage, string>; ne?: Record<Stage, string> }> = {
  'kulate-plody': {
    ano: { '6m': 'ctvrt', '9m': 'ctvrt', '12m': 'ctvrt' },
    ne: { '6m': 'ctvrt', '9m': 'ctvrt', '12m': 'cele hrozny' },
  },
  'tvrde-ovoce': {
    ano: { '6m': 'dus', '9m': 'strouh', '12m': 'tenke syrove platky bez slupky' },
    ne: { '6m': 'syrove jablko v tehle fazi nenabizej', '9m': 'platky syroveho jablka jeste ne', '12m': 'cele jablko do ruky nedavej' },
  },
  'korenova-zelenina': {
    ano: { '6m': 'hranolky tluste jako tvuj prst', '9m': 'kostky', '12m': 'kostkach' },
    ne: { '6m': 'syrovou mrkev v zadne podobe', '9m': 'samostatne platky jeste ne', '12m': 'nikdy nekrajej na kolecka' },
  },
  orechy: {
    ano: { '6m': 'mlete', '9m': 'mletych', '12m': 'mlete' },
    ne: { '6m': 'cele orechy', '9m': 'mletych', '12m': 'cele arasidy' },
  },
  maso: {
    ano: { '6m': 'proužcich', '9m': 'vlakna', '12m': 'kostky' },
    ne: { '6m': 'kratce', '9m': 'tuhe', '12m': 'kratce' },
  },
  brokolice: {
    ano: { '6m': 'stopk', '9m': 'mensi kusy', '12m': 'pecenou' },
  },
  'mekke-ovoce': {
    ano: { '6m': 'drzadlo', '9m': 'rozpul', '12m': 'kostky' },
  },
};

describe('průvodce tvarem sousta', () => {
  it('každá ukázka má oporu v testu a obráceně', () => {
    expect(UKAZKY_TVARU.map((u) => u.id).sort()).toEqual(Object.keys(OPORA).sort());
  });

  it.each(UKAZKY_TVARU.map((u) => [u.id, u] as const))(
    '%s: surovina je v katalogu, od šesti měsíců a má pokyn pro každou fázi',
    (_id, ukazka) => {
      const item = ingredientById.get(ukazka.ingredientId);
      expect(item).toBeDefined();
      expect(item?.minAgeMonths).toBeLessThanOrEqual(6);
      expect(item?.reviewStatus).toBe('verified');
      for (const faze of STAGES) expect(item?.prep[faze]?.serving.length ?? 0).toBeGreaterThan(0);
    },
  );

  it.each(UKAZKY_TVARU.map((u) => [u.id, u] as const))(
    '%s: popisek u každé fáze sedí na pokyn katalogu',
    (id, ukazka) => {
      const item = ingredientById.get(ukazka.ingredientId);
      const opora = OPORA[id];
      if (item === undefined || opora === undefined) throw new Error(id);
      for (const faze of STAGES) {
        const pokyn = normalize(`${item.prep[faze]?.serving ?? ''} ${item.prep[faze]?.caution ?? ''}`);
        expect(pokyn, `${id} ano ${faze}`).toContain(normalize(opora.ano[faze]));
        expect(proFazi(ukazka.ano.popisek, faze).trim().length).toBeGreaterThan(0);
        if (ukazka.ne !== undefined) {
          expect(opora.ne, `${id}: chybí opora pro „takhle ne"`).toBeDefined();
          expect(pokyn, `${id} ne ${faze}`).toContain(normalize(opora.ne?.[faze] ?? ''));
          expect(proFazi(ukazka.ne.popisek, faze).trim().length).toBeGreaterThan(0);
        }
      }
    },
  );
});

describe('obrázky průvodce ze souborů', () => {
  it('každý soubor v src/assets/sousto má známý klíč a povolený formát', () => {
    const zname = new Set<string>(KLICE_OBRAZKU);
    for (const soubor of readdirSync('src/assets/sousto')) {
      if (soubor.startsWith('.')) continue;
      const shoda = /^(.+)\.(webp|png|jpe?g)$/.exec(soubor);
      expect(shoda, `${soubor}: nepodporovaný formát`).not.toBeNull();
      expect(zname.has(shoda?.[1] ?? ''), `${soubor}: neznámý klíč, překlep v názvu?`).toBe(true);
    }
  });

  it('obrázky jídla mají klíč ke každé kresbě, kterou průvodce používá', () => {
    for (const ukazka of UKAZKY_TVARU) {
      for (const strana of [ukazka.ano, ukazka.ne]) {
        if (strana === undefined) continue;
        for (const faze of STAGES) {
          const klic = `jidlo-${proFazi(strana.obrazek, faze)}`;
          expect(KLICE_OBRAZKU as readonly string[]).toContain(klic);
        }
      }
    }
  });
});
