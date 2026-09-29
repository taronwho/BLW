import { describe, expect, it } from 'vitest';
import { ingredientById, ingredients } from '../../src/data/ingredients';
import { RODINNA_JIDLA, SKUPINY_JIDEL } from '../../src/data/jidlaRodiny';
import {
  EXPOZIC_PRO_ZAVEDENI,
  expoziceBezReakce,
  posudSurovinu,
  rozeberVyber,
  seradPosudky,
  souhrnJidla,
  zapisVyber,
} from '../../src/app/lib/jimeMy';
import type { VstupPosudku } from '../../src/app/lib/jimeMy';
import type { AllergenGroup, Ingredient, TastingEvent } from '../../src/types';

function surovina(id: string): Ingredient {
  const item = ingredientById.get(id);
  if (item === undefined) throw new Error(`v katalogu chybí ${id}`);
  return item;
}

/** Dítě s plně zavedenými alergeny, bez alergií a reakcí. */
function vstup(over: Partial<VstupPosudku> = {}): VstupPosudku {
  const vse = new Map<AllergenGroup, number>();
  for (const item of ingredients) {
    for (const skupina of item.allergens) vse.set(skupina, EXPOZIC_PRO_ZAVEDENI);
  }
  return {
    months: 8,
    alergieDitete: [],
    vyrazene: [],
    sReakci: new Set(),
    expozice: vse,
    ...over,
  };
}

let poradi = 0;
function udalost(ingredientId: string, over: Partial<TastingEvent> = {}): TastingEvent {
  poradi += 1;
  return {
    id: `e${poradi}`,
    ingredientId,
    date: '2026-09-01',
    amount: 'ochutnala',
    reaction: 'zadna',
    createdBy: 'u',
    createdAt: poradi,
    ...over,
  };
}

describe('posudSurovinu — co do dětské porce nepatří', () => {
  it('sůl, med a cukr do roka nikdy, ani bez data narození', () => {
    for (const id of ['sul', 'med', 'cukr-krystal']) {
      expect(posudSurovinu(surovina(id), vstup()).verdikt).toBe('ne');
      expect(posudSurovinu(surovina(id), vstup({ months: 11 })).ne).toContain('vek');
      // Bez věku se nesmí nic pustit — počítá se s nejmladším dítětem.
      expect(posudSurovinu(surovina(id), vstup({ months: null })).ne).toContain('vek');
    }
  });

  it('po roce věk sůl nevyřadí', () => {
    expect(posudSurovinu(surovina('sul'), vstup({ months: 13 })).ne).not.toContain('vek');
  });

  it('každá surovina s minAgeMonths nad věkem dítěte je vyřazená', () => {
    for (const item of ingredients) {
      const posudek = posudSurovinu(item, vstup({ months: 6 }));
      expect(posudek.ne.includes('vek')).toBe(item.minAgeMonths > 6);
    }
  });

  it('alergie zapsaná u dítěte surovinu vyřadí a řekne která', () => {
    const posudek = posudSurovinu(surovina('vejce-slepici'), vstup({ alergieDitete: ['vejce'] }));
    expect(posudek.verdikt).toBe('ne');
    expect(posudek.alergieDitete).toEqual(['vejce']);
  });

  it('reakce v deníku a ruční vyřazení surovinu vyřadí', () => {
    expect(posudSurovinu(surovina('mrkev'), vstup({ sReakci: new Set(['mrkev']) })).ne).toEqual([
      'reakce',
    ]);
    expect(posudSurovinu(surovina('mrkev'), vstup({ vyrazene: ['mrkev'] })).ne).toEqual([
      'vyrazena',
    ]);
  });
});

describe('posudSurovinu — na co si dát pozor', () => {
  it('vysoké riziko dušení je vždycky „pozor", nikdy prosté „ano"', () => {
    for (const item of ingredients.filter((i) => i.chokingRisk === 'high' && i.minAgeMonths <= 6)) {
      const posudek = posudSurovinu(item, vstup());
      expect(posudek.pozor).toContain('duseni');
      expect(posudek.verdikt).not.toBe('ano');
    }
  });

  it('nezavedený klíčový alergen je „pozor" s názvem skupiny', () => {
    const posudek = posudSurovinu(surovina('vejce-slepici'), vstup({ expozice: new Map() }));
    expect(posudek.pozor).toContain('novy-alergen');
    expect(posudek.noveAlergeny).toContain('vejce');
  });

  it('surovina k revizi je „pozor"', () => {
    const kRevizi = ingredients.find((i) => i.reviewStatus === 'needs-review' && i.minAgeMonths <= 6);
    if (kRevizi === undefined) return;
    expect(posudSurovinu(kRevizi, vstup()).pozor).toContain('k-revizi');
  });

  it('obyčejná surovina bez rizika je „ano"', () => {
    expect(posudSurovinu(surovina('banan'), vstup()).verdikt).toBe('ano');
  });
});

describe('expoziceBezReakce', () => {
  it('počítá jen ochutnávky bez reakce a bez smazaných', () => {
    const expozice = expoziceBezReakce(
      [
        udalost('vejce-slepici'),
        udalost('vejce-slepici', { reaction: 'kozni' }),
        udalost('vejce-slepici', { deleted: true }),
        udalost('vejce-slepici', { reaction: 'chutnalo' }),
      ],
      (id) => ingredientById.get(id),
    );
    expect(expozice.get('vejce')).toBe(2);
  });
});

describe('souhrnJidla', () => {
  const posud = (ids: string[], over: Partial<VstupPosudku> = {}) =>
    ids.map((id) => posudSurovinu(surovina(id), vstup(over)));

  it('víc nových alergenů naráz se ohlásí', () => {
    const souhrn = souhrnJidla(posud(['vejce-slepici', 'kravske-mleko'], { expozice: new Map() }));
    expect(souhrn.noveAlergeny.length).toBeGreaterThan(1);
  });

  it('alergen ve vyřazené surovině se do porce nepočítá', () => {
    const souhrn = souhrnJidla(
      posud(['vejce-slepici', 'banan'], { expozice: new Map(), alergieDitete: ['vejce'] }),
    );
    expect(souhrn.noveAlergeny).not.toContain('vejce');
  });

  it('pozná porci bez železa', () => {
    expect(souhrnJidla(posud(['banan'])).chybiZelezo).toBe(true);
    expect(souhrnJidla(posud(['hovezi-zadni', 'banan'])).chybiZelezo).toBe(false);
  });

  it('železo z vyřazené suroviny se nepočítá', () => {
    const souhrn = souhrnJidla(posud(['hovezi-zadni', 'banan'], { vyrazene: ['hovezi-zadni'] }));
    expect(souhrn.chybiZelezo).toBe(true);
  });

  it('rostlinné železo bez vitaminu C se ohlásí, s masem ne', () => {
    expect(souhrnJidla(posud(['cocka-cervena-loupana'])).rostlinneZelezoBezC).toBe(true);
    expect(souhrnJidla(posud(['cocka-cervena-loupana', 'hovezi-zadni'])).rostlinneZelezoBezC).toBe(
      false,
    );
  });

  it('prázdné jídlo nic nehlásí', () => {
    const souhrn = souhrnJidla([]);
    expect(souhrn.chybiZelezo).toBe(false);
    expect(souhrn.rostlinneZelezoBezC).toBe(false);
  });

  it('řadí nejdřív co vynechat, pak pozor, pak zbytek', () => {
    const serazene = seradPosudky(posud(['banan', 'sul', 'hroznove-vino']));
    expect(serazene.map((p) => p.verdikt)).toEqual(['ne', 'pozor', 'ano']);
  });
});

describe('výběr v adrese', () => {
  it('zahodí neznámá idčka, duplicity a prázdná místa', () => {
    const zname = (id: string) => ingredientById.has(id);
    expect(rozeberVyber('mrkev,,neexistuje,mrkev, banan ', zname)).toEqual(['mrkev', 'banan']);
    expect(rozeberVyber('', zname)).toEqual([]);
  });

  it('zápis a rozbor jsou navzájem inverzní', () => {
    const ids = ['mrkev', 'banan', 'sul'];
    expect(rozeberVyber(zapisVyber(ids), (id) => ingredientById.has(id))).toEqual(ids);
  });
});

describe('rodinná jídla pro rychlý výběr', () => {
  it('každá surovina je v katalogu a žádná se neopakuje', () => {
    for (const jidlo of RODINNA_JIDLA) {
      for (const id of jidlo.suroviny) expect(ingredientById.has(id), `${jidlo.id}: ${id}`).toBe(true);
      expect(new Set(jidlo.suroviny).size).toBe(jidlo.suroviny.length);
    }
  });

  it('idčka a názvy jídel jsou jedinečné', () => {
    expect(new Set(RODINNA_JIDLA.map((j) => j.id)).size).toBe(RODINNA_JIDLA.length);
    expect(new Set(RODINNA_JIDLA.map((j) => j.nazev)).size).toBe(RODINNA_JIDLA.length);
  });

  it('každé jídlo je ve známé skupině a každá skupina má jídla', () => {
    const skupiny = new Set(SKUPINY_JIDEL.map((s) => s.id));
    for (const jidlo of RODINNA_JIDLA) expect(skupiny.has(jidlo.skupina), jidlo.id).toBe(true);
    for (const skupina of SKUPINY_JIDEL) {
      expect(RODINNA_JIDLA.some((j) => j.skupina === skupina.id), skupina.id).toBe(true);
    }
  });

  it('ve skupinách bez masa, sladkých a snídaních není maso ani ryba', () => {
    const maso = new Set(ingredients.filter((i) => i.category === 'maso-ryby').map((i) => i.id));
    for (const jidlo of RODINNA_JIDLA.filter((j) => j.skupina !== 'maso' && j.skupina !== 'polevky')) {
      for (const id of jidlo.suroviny) expect(maso.has(id), `${jidlo.id}: ${id}`).toBe(false);
    }
  });

  it('ve skupině s masem má každé jídlo maso nebo rybu', () => {
    const maso = new Set(ingredients.filter((i) => i.category === 'maso-ryby').map((i) => i.id));
    for (const jidlo of RODINNA_JIDLA.filter((j) => j.skupina === 'maso')) {
      expect(jidlo.suroviny.some((id) => maso.has(id)), jidlo.id).toBe(true);
    }
  });

  it('aspoň jedno jídlo je bezmasé — matka je vegetariánka', () => {
    const maso = new Set(ingredients.filter((i) => i.category === 'maso-ryby').map((i) => i.id));
    expect(RODINNA_JIDLA.some((j) => j.suroviny.every((id) => !maso.has(id)))).toBe(true);
  });
});
