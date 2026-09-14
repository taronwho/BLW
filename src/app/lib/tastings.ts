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

/**
 * Ochutnávky jednoho dítěte.
 *
 * `childId` je povinné schválně. Deník patří dítěti, ne domácnosti — se
 * dvěma dětmi by sourozencova ochutnávka počítala cizí expozice alergenu
 * a nabízela jídlo, které tohle dítě nikdy nedostalo. Když je parametr
 * povinný, překladač najde každé místo, které na dítě zapomnělo.
 *
 * Záznam bez `childId` je z doby, kdy aplikace uměla jediné dítě; při
 * načtení se přiřadí prvnímu dítěti (`migrateHouseholdState`). Kdyby přesto
 * nějaký propadl — třeba ze staršího telefonu v téže domácnosti — počítá se
 * prvnímu dítěti, ať nezmizí z deníku úplně.
 */
export function activeTastings(
  state: HouseholdState,
  childId: string | null,
): TastingEvent[] {
  // Dokud v domácnosti žádné dítě není, drží se deník pohromadě pod `null`:
  // rodič může zapisovat dřív, než dítě vyplní, a záznam mu nesmí zmizet.
  // Jakmile dítě přibude, patří mu — přiřazuje se tomu prvnímu.
  const prvni = prvniDite(state) ?? null;
  return state.tastings.filter(
    (event) => event.deleted !== true && (event.childId ?? prvni) === childId,
  );
}

/** Id prvního dítěte v domácnosti, nebo `undefined`, když žádné není. */
function prvniDite(state: HouseholdState): string | undefined {
  for (const [id, zaznam] of Object.entries(state.children)) {
    if (zaznam.hodnota !== null) return id;
  }
  return undefined;
}

export function tastingsByIngredient(
  state: HouseholdState,
  childId: string | null,
): Map<string, TastingEvent[]> {
  const map = new Map<string, TastingEvent[]>();
  for (const event of activeTastings(state, childId)) {
    const list = map.get(event.ingredientId) ?? [];
    list.push(event);
    map.set(event.ingredientId, list);
  }
  for (const list of map.values()) {
    list.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.createdAt - a.createdAt));
  }
  return map;
}

export function tastedIds(state: HouseholdState, childId: string | null): Set<string> {
  return new Set(activeTastings(state, childId).map((event) => event.ingredientId));
}

/** Reakce, které rodič hlásí pediatrovi — kvůli nim se alergen nepočítá jako zavedený. */
const ADVERSE: ReadonlySet<string> = new Set(['kozni', 'travici', 'jina']);

export function isAdverse(event: TastingEvent): boolean {
  return ADVERSE.has(event.reaction);
}

/**
 * Které položky jsou právě teď oblíbené.
 *
 * Stav drží u každé položky i čas posledního přepnutí, aby se odebrání
 * přeneslo mezi telefony. Obrazovkám stačí seznam id, takže se sem schovává
 * ten převod — jinak by ho každá dělala po svém.
 */
export function favoriteIds(state: HouseholdState): Set<string> {
  const out = new Set<string>();
  for (const [id, zaznam] of Object.entries(state.favorites)) {
    if (zaznam.hodnota) out.add(id);
  }
  return out;
}

/** Text poznámky k receptu, nebo prázdný řetězec, když žádná není. */
export function recipeNote(state: HouseholdState, recipeId: string): string {
  return state.recipeNotes[recipeId]?.hodnota ?? '';
}
