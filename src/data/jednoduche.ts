import type { Recipe } from '@/types';

/**
 * Jednoduchá úprava: pár složek, do půl hodiny, nic, co se musí hlídat.
 *
 * Rodič na začátku příkrmu nehledá recept, ale odpověď na otázku „mám doma
 * pastinák, co s ním". Kuchařka na to dlouho neuměla odpovědět, protože měla
 * samé rodinné pokrmy o osmi složkách a hodině v troubě.
 *
 * Jednoduchost se nepočítá ze štítku, ale ze samotného receptu. Štítek by se
 * musel doplnit ke stovce položek a časem by se rozešel se skutečností;
 * takhle platí i pro recepty, které v kuchařce byly odjakživa, a nejde ho
 * omylem zapomenout.
 */

/** Kolik složek ještě snese jednoduchá úprava. Olej a voda se počítají taky. */
export const JEDNODUCHA_SLOZEK = 4;

/** Kolik minut. Delší pečení je v pořádku, jen to už není „něco rychlého". */
export const JEDNODUCHA_MINUT = 35;

export function jeJednoduchaUprava(recipe: Recipe): boolean {
  return (
    recipe.ingredients.length <= JEDNODUCHA_SLOZEK && recipe.timeMinutes <= JEDNODUCHA_MINUT
  );
}
