import { ingredients } from '@/data/ingredients';
import { ALLERGEN_LABELS, CATEGORY_LABELS } from './labels';
import { hledej, zaznam } from './hledaciZaznam';
import type { Zaznam } from './hledaciZaznam';

/**
 * Hledání v surovinách.
 *
 * Vlastní soubor, aby se dal importovat bez kuchařky: obrazovka Surovin
 * si kvůli hledání nesmí stáhnout 494 receptů (audit 17. 9. 2026,
 * nález 3.2). Mechanika je v `hledaciZaznam.ts`.
 *
 * Index se staví **líně, až při prvním hledání** — úvodní obrazovka si
 * katalog schválně nestahuje a nemá ho platit ani tady.
 */
let index: Zaznam[] | null = null;

function surovinyIndex(): Zaznam[] {
  index ??= ingredients.map((item) =>
    zaznam(item.id, CATEGORY_LABELS[item.category], [
      item.nameCz,
      ...item.altNamesCz,
      ...item.allergens.map((skupina) => ALLERGEN_LABELS[skupina]),
    ]),
  );
  return index;
}

/** Idčka surovin, které dotazu odpovídají. `null` = prázdný dotaz. */
export function hledejSuroviny(query: string): Set<string> | null {
  return hledej(surovinyIndex(), query);
}
