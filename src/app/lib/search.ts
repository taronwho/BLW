import { normalize } from '@/safety/text';
import type { Ingredient, Recipe } from '@/types';
import { ALLERGEN_LABELS, CATEGORY_LABELS, RECIPE_CATEGORY_LABELS } from './labels';

/**
 * Vyhledávání musí fungovat s diakritikou i bez ní — rodič píše jednou rukou
 * na mobilu a „cocka" musí najít čočku (docs/SPEC.md kap. 4.1).
 *
 * Hledá se v lidských názvech, ne ve vnitřních kódech. Dřív byl mezi
 * prohledávanými texty i identifikátor kategorie (`maso-ryby`, `mlecne-vejce`),
 * takže dotaz „ryby" vrátil i hovězí zadní a „vejce" vrátilo kefír a devět
 * sýrů. Kategorie se hledá zvlášť a jen na přesnou shodu celého názvu:
 * „maso a ryby" kategorii najde, samotné „ryby" ne, protože kdo píše „ryby",
 * chce rybu, a ne všechno maso. Na procházení celé kategorie je rozbalovátko
 * hned vedle pole.
 *
 * Zato se prohledávají názvy alergenových skupin, protože ty jsou na rozdíl
 * od kategorie přesné: „ryby" tak najde lososa i tresku a nikoli hovězí,
 * „ořechy" najde ořechy a ne oleje, „mléko" mléčné výrobky. Je to jediný
 * způsob, jak se v katalogu dostat ke skupině, kterou žádná surovina nemá
 * ve svém jméně.
 *
 * Kromě přesné shody se povoluje jeden překlep nebo jedno přehozené písmeno
 * ve slovech od pěti znaků. Pokrývá to dvě věci naráz: skutečné překlepy
 * („brambury") a nejčastější české tvary, které se od základního liší jedním
 * krokem („mrkve" proti „mrkev", „jablka" proti „jablko"). Skloňování obecně
 * to neřeší a řešit nemá — na to by bylo potřeba morfologické jádro, a to je
 * runtime závislost navíc.
 */

/** Nejkratší slovo, u kterého se povolí jeden překlep. Kratší by mátlo. */
const MIN_FUZZY = 5;

/** Damerau–Levenshteinova vzdálenost s předčasným koncem na `limit`. */
function vzdalenost(a: string, b: string, limit: number): number {
  if (Math.abs(a.length - b.length) > limit) return limit + 1;
  let predchozi2: number[] = [];
  let predchozi: number[] = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    const radek = [i, ...new Array<number>(b.length).fill(0)];
    let nejlepsi = radek[0] as number;
    for (let j = 1; j <= b.length; j += 1) {
      const cena = a[i - 1] === b[j - 1] ? 0 : 1;
      let hodnota = Math.min(
        (radek[j - 1] as number) + 1,
        (predchozi[j] as number) + 1,
        (predchozi[j - 1] as number) + cena,
      );
      // Prohozená dvojice písmen je jeden krok, ne dva — „mrkve" proti „mrkev".
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        hodnota = Math.min(hodnota, (predchozi2[j - 2] as number) + 1);
      }
      radek[j] = hodnota;
      if (hodnota < nejlepsi) nejlepsi = hodnota;
    }
    if (nejlepsi > limit) return limit + 1;
    predchozi2 = predchozi;
    predchozi = radek;
  }
  return predchozi[b.length] as number;
}

function slova(text: string): string[] {
  return normalize(text)
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 0);
}

/**
 * Sedí dotaz na některý z textů?
 *
 * Napřed levná přesná shoda přes celý text — ta pokryje většinu dotazů včetně
 * víceslovných („ovesna kase"). Teprve když neprojde, zkusí se po slovech
 * shoda s jedním překlepem.
 */
export function matchesText(query: string, haystacks: readonly string[]): boolean {
  const needle = normalize(query);
  if (needle.length === 0) return true;
  if (haystacks.some((text) => normalize(text).includes(needle))) return true;

  const hledana = slova(needle);
  if (hledana.length === 0) return false;
  const dostupna = haystacks.flatMap((text) => slova(text));
  return hledana.every((slovo) => {
    if (slovo.length < MIN_FUZZY) return false;
    return dostupna.some((kandidat) => {
      if (kandidat.length < MIN_FUZZY) return false;
      return vzdalenost(slovo, kandidat, 1) <= 1;
    });
  });
}

/** Přesná shoda s názvem kategorie — viz hlavička souboru. */
function sediKategorie(query: string, label: string): boolean {
  const needle = normalize(query);
  return needle.length > 0 && normalize(label) === needle;
}

export function matchesIngredient(ingredient: Ingredient, query: string): boolean {
  if (sediKategorie(query, CATEGORY_LABELS[ingredient.category])) return true;
  const alergeny = ingredient.allergens.map((skupina) => ALLERGEN_LABELS[skupina]);
  return matchesText(query, [ingredient.nameCz, ...ingredient.altNamesCz, ...alergeny]);
}

/**
 * Recept se hledá i podle svých surovin — proto `ingredientNames`.
 *
 * Volající posílá název suroviny i její synonyma; dřív posílal jen hlavní
 * název, takže „jablka" našlo jediný recept, který to slovo měl v názvu,
 * místo všech, které jablko obsahují.
 */
export function matchesRecipe(
  recipe: Recipe,
  query: string,
  ingredientNames: readonly string[],
): boolean {
  if (sediKategorie(query, RECIPE_CATEGORY_LABELS[recipe.category])) return true;
  return matchesText(query, [recipe.titleCz, ...recipe.tags, ...ingredientNames]);
}
