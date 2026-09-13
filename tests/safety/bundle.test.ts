import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Hranice mezi aplikací a validátorem.
 *
 * `src/safety/index.ts` vyváží i pravidla a jejich chybové hlášky, které
 * mluví o souborech projektu („Doména je v docs/BEZPECNOST.md odmítnutá").
 * Ty patří vývojáři při `npm run validate`, ne do balíčku, který si telefon
 * stáhne a uloží do offline cache. Jeden import přes barrel stačil na to,
 * aby se do buildu dostal celý modul pravidel.
 */
function souboryVe(adresar: string): string[] {
  return readdirSync(adresar).flatMap((jmeno) => {
    const cesta = join(adresar, jmeno);
    if (statSync(cesta).isDirectory()) return souboryVe(cesta);
    return cesta.endsWith('.ts') || cesta.endsWith('.tsx') ? [cesta] : [];
  });
}

describe('hranice modulu safety', () => {
  it('aplikace neimportuje pravidla přes souhrnný export', () => {
    const zavadne = souboryVe('src/app')
      .filter((cesta) => /from '@\/safety'/.test(readFileSync(cesta, 'utf-8')))
      .map((cesta) => cesta.replace('src/app/', ''));
    expect(zavadne).toEqual([]);
  });
});
