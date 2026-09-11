import type { HouseholdState, TastingEvent } from '@/types';

/**
 * Slučování stavu domácnosti podle docs/SPEC.md kapitola 7.
 *
 *  - `TastingEvent` je append-only: záznam se nikdy nepřepisuje, jen přidává.
 *    Když dva telefony zapíšou offline každý svou ochutnávku, po připojení
 *    musí zůstat obě. Proto má každý záznam vlastní `id`.
 *  - Ostatní pole jsou last-write-wins podle `createdAt` domácnosti.
 */

export const SCHEMA_VERSION = 1;

export function emptyHouseholdState(): HouseholdState {
  return {
    childName: '',
    childBirthDate: '',
    members: [],
    tastings: [],
    favorites: [],
    recipeNotes: {},
    schemaVersion: SCHEMA_VERSION,
  };
}

/**
 * Sloučí dvě sady ochutnávek. Shodné `id` znamená tentýž záznam — vítězí ten
 * s vyšším `createdAt`, aby se dodatečně doplněná reakce neztratila.
 */
export function mergeTastings(
  local: readonly TastingEvent[],
  remote: readonly TastingEvent[],
): TastingEvent[] {
  const byId = new Map<string, TastingEvent>();
  for (const event of [...local, ...remote]) {
    const existing = byId.get(event.id);
    if (existing === undefined || event.createdAt > existing.createdAt) {
      byId.set(event.id, event);
    }
  }
  return [...byId.values()].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? -1 : 1;
    if (a.createdAt !== b.createdAt) return a.createdAt - b.createdAt;
    return a.id < b.id ? -1 : 1;
  });
}

function mergeUnique(local: readonly string[], remote: readonly string[]): string[] {
  return [...new Set([...local, ...remote])];
}

/** Poslední zápis vyhrává; při shodě zůstává vzdálená hodnota (autorita serveru). */
function lastWriteWins<T>(local: T, remote: T, localNewer: boolean): T {
  return localNewer ? local : remote;
}

export interface MergeMeta {
  /** Kdy byl naposled zapsán lokální stav. */
  localUpdatedAt: number;
  /** Kdy byl naposled zapsán vzdálený stav. */
  remoteUpdatedAt: number;
}

/** Maximální počet členů domácnosti (docs/SPEC.md kap. 7 i firestore.rules). */
export const MAX_MEMBERS = 5;

export function mergeHouseholdState(
  local: HouseholdState,
  remote: HouseholdState,
  meta: MergeMeta,
): HouseholdState {
  const localNewer = meta.localUpdatedAt > meta.remoteUpdatedAt;

  return {
    childName: lastWriteWins(local.childName, remote.childName, localNewer),
    childBirthDate: lastWriteWins(local.childBirthDate, remote.childBirthDate, localNewer),
    members: mergeUnique(local.members, remote.members).slice(0, MAX_MEMBERS),
    // Ochutnávky se nikdy neřeší jako konflikt — vždy se spojují.
    tastings: mergeTastings(local.tastings, remote.tastings),
    favorites: mergeUnique(local.favorites, remote.favorites),
    recipeNotes: localNewer
      ? { ...remote.recipeNotes, ...local.recipeNotes }
      : { ...local.recipeNotes, ...remote.recipeNotes },
    schemaVersion: Math.max(local.schemaVersion, remote.schemaVersion),
  };
}

/** Nové id ochutnávky. Náhodné, aby dva telefony offline nevyrobily totéž. */
export function newTastingId(random: Crypto = globalThis.crypto): string {
  return random.randomUUID();
}
