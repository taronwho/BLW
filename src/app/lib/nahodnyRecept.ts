import { recipes } from '@/data';
import type { AllergenGroup, Recipe } from '@/types';
import { recipeAllergens } from './deriveRecipes';

/**
 * Náhodný recept — odpověď na „nevím, co vařit".
 *
 * Losuje se ze **vhodných** receptů, ne ze všech. Kuchařka má skoro pět set
 * položek a mezi nimi jídla od dvanácti měsíců; nabídnout je rodiči
 * šestiměsíčního dítěte by znamenalo, že tlačítko párkrát zklame a nikdo ho
 * pak nepoužije. Ze stejného důvodu vypadnou recepty s alergenem, který má
 * dítě zapsaný v Domácnosti.
 *
 * Když po filtrech nezbude nic (třeba dítě má zapsanou spoustu alergenů),
 * vrací se celá kuchařka. Prázdné tlačítko, které nic neudělá, je horší
 * než nabídnutý recept, u kterého si rodič sám přečte, proč nesedí.
 */
export function vhodneRecepty(
  mesice: number | null,
  alergeny: readonly AllergenGroup[] = [],
): Recipe[] {
  const vek = mesice ?? 6;
  const vhodne = recipes.filter((recipe) => {
    if (recipe.minAgeMonths > vek) return false;
    if (alergeny.length === 0) return true;
    const receptove = recipeAllergens(recipe);
    return !alergeny.some((skupina) => receptove.includes(skupina));
  });
  return vhodne.length > 0 ? vhodne : [...recipes];
}

/**
 * Jeden prvek z pole, nebo `null` u prázdného.
 *
 * Generátor se dá podstrčit, aby šel výběr testovat — bez toho by se dalo
 * ověřit jen to, že něco vypadlo, ne že se losuje z celého rozsahu.
 */
export function vyberNahodny<T>(polozky: readonly T[], nahoda: () => number = Math.random): T | null {
  if (polozky.length === 0) return null;
  const index = Math.min(polozky.length - 1, Math.floor(nahoda() * polozky.length));
  return polozky[index] ?? null;
}

/**
 * Náhodný recept, ale jiný než ten, na kterém rodič právě je.
 *
 * Bez téhle podmínky by se při opakovaném klepnutí občas nabídl tentýž
 * recept a vypadalo by to, že tlačítko nefunguje.
 */
export function nahodnyRecept(
  mesice: number | null,
  alergeny: readonly AllergenGroup[] = [],
  krome?: string,
  nahoda: () => number = Math.random,
): Recipe | null {
  const vhodne = vhodneRecepty(mesice, alergeny);
  const bezSoucasneho =
    krome === undefined ? vhodne : vhodne.filter((recipe) => recipe.id !== krome);
  // Když byl jediný vhodný recept zrovna ten současný, je lepší ho nabídnout
  // znovu než nenabídnout nic.
  return vyberNahodny(bezSoucasneho.length > 0 ? bezSoucasneho : vhodne, nahoda);
}
