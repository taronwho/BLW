import type { AllergenGroup, Ingredient, IngredientCategory, TastingEvent } from '@/types';
import { KEY_ALLERGENS } from '@/types';
import { isInSeason, isSuitableNow } from './filters';

/**
 * Deník ochutnávek (docs/SPEC.md kapitola 4.5).
 *
 * Pozor na jednu věc: aplikace **nediagnostikuje**. „Zavedeno" tady znamená
 * jen „tři expozice bez zaznamenané reakce", nic víc — je to počítadlo, ne
 * lékařský závěr. Při jakémkoli podezření na reakci odkazuje na pediatra.
 */

/** Reakce, po kterých se alergen nepovažuje za bezproblémově snesený. */
const ADVERSE_REACTIONS: ReadonlySet<TastingEvent['reaction']> = new Set([
  'kozni',
  'travici',
  'jina',
]);

/** Počet expozic bez reakce, po kterém aplikace alergen vede jako zavedený. */
export const EXPOSURES_FOR_INTRODUCED = 3;

export interface DayGroup {
  date: string;
  events: TastingEvent[];
}

/** Časová osa seskupená po dnech, nejnovější den první. */
export function groupByDay(tastings: readonly TastingEvent[]): DayGroup[] {
  const byDate = new Map<string, TastingEvent[]>();
  for (const event of tastings) {
    const bucket = byDate.get(event.date);
    if (bucket === undefined) byDate.set(event.date, [event]);
    else bucket.push(event);
  }
  return [...byDate.entries()]
    .map(([date, events]) => ({
      date,
      events: [...events].sort((a, b) => b.createdAt - a.createdAt),
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export interface AllergenProgress {
  allergen: AllergenGroup;
  exposures: number;
  /** Expozice bez zaznamenané nepříznivé reakce. */
  cleanExposures: number;
  lastDate: string | null;
  hasReaction: boolean;
  introduced: boolean;
}

export function allergenProgress(
  tastings: readonly TastingEvent[],
  ingredients: readonly Ingredient[],
): AllergenProgress[] {
  const byId = new Map(ingredients.map((i) => [i.id, i]));

  return KEY_ALLERGENS.map((allergen) => {
    const relevant = tastings.filter((event) =>
      byId.get(event.ingredientId)?.allergens.includes(allergen),
    );
    const clean = relevant.filter((event) => !ADVERSE_REACTIONS.has(event.reaction));
    const dates = relevant.map((event) => event.date).sort();
    const hasReaction = relevant.length > clean.length;

    return {
      allergen,
      exposures: relevant.length,
      cleanExposures: clean.length,
      lastDate: dates.at(-1) ?? null,
      hasReaction,
      // Reakce zavedení ruší — o dalším postupu rozhoduje pediatr, ne aplikace.
      introduced: !hasReaction && clean.length >= EXPOSURES_FOR_INTRODUCED,
    };
  });
}

export interface CategoryStat {
  category: IngredientCategory;
  tasted: number;
  total: number;
}

export function categoryStats(
  tastings: readonly TastingEvent[],
  ingredients: readonly Ingredient[],
): CategoryStat[] {
  const tastedIds = new Set(tastings.map((event) => event.ingredientId));
  const byCategory = new Map<IngredientCategory, { tasted: number; total: number }>();

  for (const ingredient of ingredients) {
    const entry = byCategory.get(ingredient.category) ?? { tasted: 0, total: 0 };
    entry.total += 1;
    if (tastedIds.has(ingredient.id)) entry.tasted += 1;
    byCategory.set(ingredient.category, entry);
  }

  return [...byCategory.entries()].map(([category, counts]) => ({ category, ...counts }));
}

/** Suroviny, které dcera odmítla a od té doby nepřijala. Odmítnutí je normální. */
export function refusedIngredientIds(tastings: readonly TastingEvent[]): string[] {
  const latestByIngredient = new Map<string, TastingEvent>();
  for (const event of tastings) {
    const existing = latestByIngredient.get(event.ingredientId);
    if (existing === undefined || event.createdAt > existing.createdAt) {
      latestByIngredient.set(event.ingredientId, event);
    }
  }
  return [...latestByIngredient.values()]
    .filter((event) => event.amount === 'odmitla')
    .map((event) => event.ingredientId);
}

export interface SuggestionContext {
  ageMonths: number | null;
  month: number;
  count?: number;
}

/**
 * „Co dnes zkusit?" — dosud neochutnané suroviny vhodné k věku a sezóně.
 * Výběr je stabilní v rámci dne, aby se nabídka při každém překreslení neměnila.
 */
export function suggestToday(
  ingredients: readonly Ingredient[],
  tastings: readonly TastingEvent[],
  context: SuggestionContext,
  today: string = new Date().toISOString().slice(0, 10),
): Ingredient[] {
  const tasted = new Set(tastings.map((event) => event.ingredientId));
  const candidates = ingredients.filter(
    (ingredient) =>
      !tasted.has(ingredient.id) &&
      isSuitableNow(ingredient, context.ageMonths) &&
      isInSeason(ingredient, context.month),
  );

  const seed = [...today].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const ranked = [...candidates].sort((a, b) => {
    const scoreA = stableScore(a.id, seed);
    const scoreB = stableScore(b.id, seed);
    return scoreA === scoreB ? a.id.localeCompare(b.id) : scoreA - scoreB;
  });
  return ranked.slice(0, context.count ?? 3);
}

function stableScore(id: string, seed: number): number {
  let hash = seed;
  for (const char of id) {
    hash = (hash * 31 + char.charCodeAt(0)) % 100_003;
  }
  return hash;
}
