import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { safetyRules } from '../../src/safety/rules';

/**
 * Tabulka pravidel v `docs/SPEC.md` kapitola 3 musí sedět s kódem.
 *
 * `CLAUDE.md` říká, že specifikace je závazná. Jenže dokument, který se
 * s kódem rozejde, přestává být měřítkem a stane se archeologií — a přesně
 * to se stalo: tabulka znala 34 pravidel, kód měl 35 a nikdo si toho
 * nevšiml, protože to nic nekontrolovalo.
 *
 * Test je schválně nad textem dokumentu, ne nad nějakým generovaným
 * soupisem. Kdo přidá pravidlo, musí ho popsat i větou pro člověka —
 * a to je ta chvíle, kdy se rozmyslí, jestli ho chce.
 */

const SPEC = readFileSync(new URL('../../docs/SPEC.md', import.meta.url), 'utf-8');

/** Id z prvního sloupce tabulky: řádky tvaru `| \`nazev-pravidla\` | ... |`. */
function idZTabulky(): string[] {
  const nalezy = [...SPEC.matchAll(/^\| `([a-z0-9-]+)` \| (error|warning) \|/gm)];
  return nalezy.map((nalez) => nalez[1] as string);
}

function severityZTabulky(): Map<string, string> {
  const mapa = new Map<string, string>();
  for (const nalez of SPEC.matchAll(/^\| `([a-z0-9-]+)` \| (error|warning) \|/gm)) {
    mapa.set(nalez[1] as string, nalez[2] as string);
  }
  return mapa;
}

describe('tabulka pravidel v docs/SPEC.md', () => {
  it('nevynechává žádné pravidlo, které je v kódu', () => {
    const vTabulce = new Set(idZTabulky());
    const chybi = safetyRules.map((rule) => rule.id).filter((id) => !vTabulce.has(id));
    expect(
      chybi,
      `Pravidla v src/safety/rules.ts, která specifikace nezná: ${chybi.join(', ')}`,
    ).toEqual([]);
  });

  it('neslibuje pravidlo, které v kódu není', () => {
    const vKodu = new Set(safetyRules.map((rule) => rule.id));
    const navic = idZTabulky().filter((id) => !vKodu.has(id));
    expect(
      navic,
      `Pravidla slíbená ve specifikaci, ale chybějící v kódu: ${navic.join(', ')}`,
    ).toEqual([]);
  });

  it('má u každého pravidla stejnou závažnost jako kód', () => {
    const vTabulce = severityZTabulky();
    const neshody = safetyRules
      .filter((rule) => vTabulce.has(rule.id) && vTabulce.get(rule.id) !== rule.severity)
      .map((rule) => `${rule.id}: kód ${rule.severity}, SPEC ${vTabulce.get(rule.id)}`);
    expect(neshody).toEqual([]);
  });

  it('nemá v tabulce žádné id dvakrát', () => {
    const idcka = idZTabulky();
    const duplicity = idcka.filter((id, index) => idcka.indexOf(id) !== index);
    expect(duplicity).toEqual([]);
  });
});
