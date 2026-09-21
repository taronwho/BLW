import { ingredients, recipes } from '@/data';
import { normalize } from '@/safety/text';
import type { Ingredient, Recipe } from '@/types';
import { ALLERGEN_LABELS, CATEGORY_LABELS, RECIPE_CATEGORY_LABELS } from './labels';
import { MIN_FUZZY, slova, vzdalenost } from './search';

/**
 * Předpočítaný index pro hledání v katalogu.
 *
 * Audit 17. 9. 2026 (nález 6.1): filtr v Receptech si při **každém stisku
 * klávesy** postavil pro všech 494 receptů nové pole názvů složek a synonym
 * a na každý text zavolal `normalize()` — NFD, regulární výraz, malá
 * písmena. Tisíce volání na jedno písmeno. Na nové Pixelu to projde, na
 * tříletém Androidu jednou rukou u sporáku ne.
 *
 * Kuchařka ani katalog se za běhu nemění, takže se normalizace dá udělat
 * jednou. Index se staví **líně, až při prvním hledání** — úvodní
 * obrazovka si schválně katalog nestahuje a nemá ho platit ani tady.
 *
 * Chování se nemění ani o písmeno: pravidla shody jsou pořád ta z
 * `search.ts` (přesná shoda na podřetězec, jinak jeden překlep ve slovech
 * od pěti znaků, kategorie jen na celý název). Tenhle soubor je jen jinak
 * uložená tatáž věc a `tests/data/search.test.ts` to hlídá nad oběma cestami.
 */

interface Zaznam {
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

function zaznam(id: string, kategorie: string, texty: readonly string[]): Zaznam {
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

function zaznamSuroviny(item: Ingredient): Zaznam {
  const alergeny = item.allergens.map((skupina) => ALLERGEN_LABELS[skupina]);
  return zaznam(item.id, CATEGORY_LABELS[item.category], [
    item.nameCz,
    ...item.altNamesCz,
    ...alergeny,
  ]);
}

function zaznamReceptu(recipe: Recipe, nazvySlozek: readonly string[]): Zaznam {
  return zaznam(recipe.id, RECIPE_CATEGORY_LABELS[recipe.category], [
    recipe.titleCz,
    ...recipe.tags,
    ...nazvySlozek,
  ]);
}

let indexSurovin: Zaznam[] | null = null;
let indexReceptu: Zaznam[] | null = null;

function surovinyIndex(): Zaznam[] {
  indexSurovin ??= ingredients.map(zaznamSuroviny);
  return indexSurovin;
}

function receptyIndex(): Zaznam[] {
  if (indexReceptu === null) {
    const podleId = new Map(ingredients.map((item) => [item.id, item]));
    indexReceptu = recipes.map((recipe) => {
      // I synonyma — „jablka" musí najít recepty s jablkem, ne jen ten,
      // který to slovo má v názvu.
      const nazvy = recipe.ingredients.flatMap((ref) => {
        const item = podleId.get(ref.ingredientId);
        return item === undefined ? [] : [item.nameCz, ...item.altNamesCz];
      });
      return zaznamReceptu(recipe, nazvy);
    });
  }
  return indexReceptu;
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

function hledej(index: readonly Zaznam[], query: string): Set<string> | null {
  const dotaz = pripravDotaz(query);
  if (dotaz === null) return null;
  const nalezene = new Set<string>();
  for (const zaznam of index) {
    if (sedi(zaznam, dotaz)) nalezene.add(zaznam.id);
  }
  return nalezene;
}

/** Idčka surovin, které dotazu odpovídají. `null` = prázdný dotaz. */
export function hledejSuroviny(query: string): Set<string> | null {
  return hledej(surovinyIndex(), query);
}

/** Idčka receptů, které dotazu odpovídají. `null` = prázdný dotaz. */
export function hledejRecepty(query: string): Set<string> | null {
  return hledej(receptyIndex(), query);
}
