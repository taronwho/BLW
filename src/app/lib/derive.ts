import { ingredientById, ingredients } from '@/data/ingredients';
import { nutrientProfile } from '@/data/nutrients';
import type { Child, HouseholdState, Ingredient } from '@/types';
import { ageInMonths } from './age';
import { activeTastings, tastedIds } from './tastings';

// Odvozeniny nad deníkem si nesahají na katalog, proto bydlí zvlášť; tady se
// jen přeposílají dál, ať obrazovky nemusí vědět, kde co leží.
export { activeTastings, isAdverse, tastedIds, tastingsByIngredient } from './tastings';

/**
 * Odvozeniny nad katalogem surovin a stavem domácnosti. Bez nich by každá
 * obrazovka počítala totéž jinak.
 *
 * Co potřebuje kuchařku, bydlí v `deriveRecipes.ts`.
 */

export function inSeason(ingredient: Ingredient, month: number): boolean {
  return ingredient.seasonCz.length === 0 || ingredient.seasonCz.includes(month);
}

/** „Vhodné teď" = fáze podle věku dítěte už tuhle surovinu dovoluje. */
export function suitableNow(ingredient: Ingredient, ageMonths: number | null): boolean {
  return ingredient.minAgeMonths <= (ageMonths ?? 6);
}

/**
 * Nesmazané ochutnávky. Smazaný záznam zůstává v poli jako náhrobek kvůli
 * slučování mezi zařízeními, ale do UI ani do statistik nepatří.
 */
/**
 * Návrh „Co dnes zkusit?" (docs/SPEC.md 4.5).
 *
 * Dřív to byly první tři neochutnané položky v abecedním pořadí, takže se
 * rodiči pořád dokola nabízela hruška, banán a avokádo. Aplikace přitom ví,
 * co by dítěti prospělo nejvíc, tak ať to použije.
 *
 * Pořadí důležitosti:
 *  1. klíčový alergen, kterého má dítě míň než tři expozice — alergeny se
 *     nemají odkládat a nabízet se mají opakovaně (docs/BEZPECNOST.md kap. 4),
 *  2. zdroj železa — kvůli němu se po šestém měsíci příkrm zavádí,
 *  3. zdroj zinku,
 *  4. sezónní surovina, protože ta je zrovna nejlepší.
 *
 * Vysoké riziko dušení se nenabízí vůbec: návrh má být něco, co rodič zkusí
 * bez dalšího přemýšlení, a tvary, které ucpou dýchací cesty, k tomu nepatří.
 */
export type DuvodNavrhu = 'alergen' | 'zelezo' | 'zinek' | 'sezona' | 'dalsi';

export interface Navrh {
  ingredient: Ingredient;
  duvod: DuvodNavrhu;
}

/** Kolik expozic dělá alergen zavedeným — stejné číslo jako v deníku. */
const EXPOZIC_PRO_ZAVEDENI = 3;

export function suggestions(
  state: HouseholdState,
  dite: Child | null,
  month: number,
  count = 3,
): Navrh[] {
  const ageMonths = dite === null ? null : ageInMonths(dite.birthDate);
  const tasted = tastedIds(state);

  // Kolik expozic má které alergenové skupiny dítě za sebou.
  const expozice = new Map<string, number>();
  for (const event of activeTastings(state)) {
    for (const skupina of ingredientById.get(event.ingredientId)?.allergens ?? []) {
      expozice.set(skupina, (expozice.get(skupina) ?? 0) + 1);
    }
  }
  // Na co dítě reaguje, se nenabízí vůbec — rodič to zadal v Domácnosti.
  const vyloucene = new Set(dite?.allergens ?? []);

  const vhodne = ingredients.filter(
    (item) =>
      !tasted.has(item.id) &&
      suitableNow(item, ageMonths) &&
      inSeason(item, month) &&
      item.chokingRisk !== 'high' &&
      !item.allergens.some((skupina) => vyloucene.has(skupina)),
  );

  const duvod = (item: Ingredient): DuvodNavrhu => {
    const chybiExpozice =
      item.isKeyAllergen &&
      item.allergens.some((skupina) => (expozice.get(skupina) ?? 0) < EXPOZIC_PRO_ZAVEDENI);
    if (chybiExpozice) return 'alergen';
    const profil = nutrientProfile(item);
    if (profil.iron !== 'nevyznamny') return 'zelezo';
    if (profil.zinc !== 'nevyznamny') return 'zinek';
    if (item.seasonCz.length > 0) return 'sezona';
    return 'dalsi';
  };

  const poradi: Record<DuvodNavrhu, number> = {
    alergen: 0,
    zelezo: 1,
    zinek: 2,
    sezona: 3,
    dalsi: 4,
  };

  return vhodne
    .map((ingredient) => ({ ingredient, duvod: duvod(ingredient) }))
    .sort((a, b) => poradi[a.duvod] - poradi[b.duvod])
    .slice(0, count);
}
