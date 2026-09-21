import { normalize } from '@/safety/text';
import { MIN_FUZZY, slova, vzdalenost } from './search';

/**
 * Společná mechanika hledacího indexu.
 *
 * Předpočítaná podoba položky a porovnání s dotazem. Schválně **bez
 * jediného importu katalogu**: samotná data si přitáhne až ten, kdo je
 * potřebuje — jinak by obrazovka Surovin kvůli hledání stáhla i všech
 * 494 receptů (audit 17. 9. 2026, nález 3.2).
 *
 * Audit také ukázal (nález 6.1), proč index vůbec existuje: filtr si
 * při **každém stisku klávesy** stavěl pro všechny položky nová pole
 * názvů a na každý text volal `normalize()` — NFD, regulární výraz, malá
 * písmena. Tisíce volání na jedno písmeno. Katalog se za běhu nemění,
 * takže normalizace stačí jednou.
 *
 * Pravidla shody se nesmí lišit od `search.ts`: přesná shoda na
 * podřetězec, jinak jeden překlep ve slovech od pěti znaků, kategorie jen
 * na celý název. `tests/data/hledaciIndex.test.ts` obě cesty porovnává.
 */

export interface Zaznam {
  id: string;
  /** Normalizované texty pro shodu na podřetězec. */
  texty: readonly string[];
  /** Normalizovaná slova od `MIN_FUZZY` znaků pro shodu s překlepem. */
  slova: readonly string[];
  /** Normalizovaný název kategorie — hledá se jen na přesnou shodu. */
  kategorie: string;
}

/** Dotaz znormalizovaný jednou, ne pro každou položku znovu. */
export interface Dotaz {
  needle: string;
  slova: readonly string[];
}

export function zaznam(id: string, kategorie: string, texty: readonly string[]): Zaznam {
  const normalizovane = texty.map((text) => normalize(text));
  const jednotliva = new Set<string>();
  for (const text of normalizovane) {
    for (const slovo of slova(text)) {
      if (slovo.length >= MIN_FUZZY) jednotliva.add(slovo);
    }
  }
  return {
    id,
    texty: normalizovane,
    slova: [...jednotliva],
    kategorie: normalize(kategorie),
  };
}

/**
 * Prázdný dotaz vrací `null` — to znamená „neomezuj", ne „nic nenajdeš".
 * Volající pak filtr přeskočí a ušetří celý průchod.
 */
export function pripravDotaz(query: string): Dotaz | null {
  const needle = normalize(query);
  if (needle.length === 0) return null;
  return { needle, slova: slova(needle) };
}

function sedi(zaznam: Zaznam, dotaz: Dotaz): boolean {
  if (zaznam.kategorie === dotaz.needle) return true;
  if (zaznam.texty.some((text) => text.includes(dotaz.needle))) return true;
  if (dotaz.slova.length === 0) return false;
  return dotaz.slova.every((slovo) => {
    if (slovo.length < MIN_FUZZY) return false;
    return zaznam.slova.some((kandidat) => vzdalenost(slovo, kandidat, 1) <= 1);
  });
}

/** Idčka, která dotazu odpovídají. `null` = prázdný dotaz, tedy bez omezení. */
export function hledej(index: readonly Zaznam[], query: string): Set<string> | null {
  const dotaz = pripravDotaz(query);
  if (dotaz === null) return null;
  const nalezene = new Set<string>();
  for (const polozka of index) {
    if (sedi(polozka, dotaz)) nalezene.add(polozka.id);
  }
  return nalezene;
}
