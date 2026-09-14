import type { HouseholdState, TastingEvent } from '@/types';

/**
 * Odvozeniny nad deníkem ochutnávek.
 *
 * Schválně bez jediného importu katalogu: úvodní obrazovka potřebuje jen
 * počet ochutnaných surovin, a kdyby si ho brala z `derive.ts`, stáhla by
 * s ním rovnou všech tři sta surovin a tři sta receptů. Katalogové
 * odvozeniny zůstávají v `derive.ts`, tohle je ta část, která si vystačí
 * se stavem domácnosti.
 */

export function activeTastings(state: HouseholdState): TastingEvent[] {
  return state.tastings.filter((event) => event.deleted !== true);
}

export function tastingsByIngredient(state: HouseholdState): Map<string, TastingEvent[]> {
  const map = new Map<string, TastingEvent[]>();
  for (const event of activeTastings(state)) {
    const list = map.get(event.ingredientId) ?? [];
    list.push(event);
    map.set(event.ingredientId, list);
  }
  for (const list of map.values()) {
    list.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.createdAt - a.createdAt));
  }
  return map;
}

export function tastedIds(state: HouseholdState): Set<string> {
  return new Set(activeTastings(state).map((event) => event.ingredientId));
}

/** Reakce, které rodič hlásí pediatrovi — kvůli nim se alergen nepočítá jako zavedený. */
const ADVERSE: ReadonlySet<string> = new Set(['kozni', 'travici', 'jina']);

export function isAdverse(event: TastingEvent): boolean {
  return ADVERSE.has(event.reaction);
}
