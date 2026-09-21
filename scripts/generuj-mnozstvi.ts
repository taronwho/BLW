/**
 * Vygeneruje `src/data/mnozstviVychozi.ts` — návrh množství pro každou surovinu.
 *
 * Návrh se počítá z kuchařky (medián toho, jak surovinu odměřují recepty).
 * Kdyby si ho obrazovka Surovin počítala za běhu, musela by kvůli němu
 * stáhnout všech 494 receptů — skoro megabajt, který rodič při procházení
 * surovin nikdy nepotřebuje (audit 17. 9. 2026, nález 3.2).
 *
 * Spouští se ručně: `npm run generate:mnozstvi`. Že soubor nezastaral,
 * hlídá `tests/nakup/mnozstviVychozi.test.ts`.
 */
import { writeFileSync } from 'node:fs';
import { ingredients } from '../src/data';
import { vychoziMnozstvi } from '../src/nakup/seznam';

const radky = ingredients
  .map((item) => `  '${item.id}': ${JSON.stringify(vychoziMnozstvi(item.id))},`)
  .join('\n');

const obsah = `/**
 * VYGENEROVANÝ SOUBOR — needituj ručně.
 *
 * Vzniká příkazem \`npm run generate:mnozstvi\` z kuchařky: u každé suroviny
 * je to medián toho, jak ji odměřují recepty (viz \`vychoziMnozstvi\`
 * v \`src/nakup/seznam.ts\`). Existuje proto, aby si obrazovka Surovin
 * kvůli jednomu návrhu nestahovala celou kuchařku.
 *
 * Že soubor nezastaral, hlídá \`tests/nakup/mnozstviVychozi.test.ts\`.
 */
export const VYCHOZI_MNOZSTVI: Readonly<Record<string, string>> = {
${radky}
};

/** Návrh množství pro surovinu. Neznámá dostane kus, stejně jako dřív. */
export function vychoziMnozstviSuroviny(ingredientId: string): string {
  return VYCHOZI_MNOZSTVI[ingredientId] ?? '1 ks';
}
`;

writeFileSync(new URL('../src/data/mnozstviVychozi.ts', import.meta.url), obsah, 'utf8');
console.log(`Zapsáno ${ingredients.length} návrhů do src/data/mnozstviVychozi.ts`);
