import type { CasovanaHodnota, HouseholdState, TastingEvent } from '@/types';

/**
 * Slučování stavu domácnosti podle docs/SPEC.md kapitola 7.
 *
 *  - `TastingEvent` je append-only: záznam se nikdy nepřepisuje, jen přidává.
 *    Když dva telefony zapíšou offline každý svou ochutnávku, po připojení
 *    musí zůstat obě. Proto má každý záznam vlastní `id`.
 *  - Oblíbené a poznámky k receptům nesou u každé položky čas poslední změny
 *    a slučují se po klíčích. Sjednocení seznamů, které tu bylo dřív, mělo
 *    tichou vadu: odebrání oblíbené položky se při sloučení vždycky vrátilo
 *    zpátky, protože sjednocení umí jen přidávat. Totéž platilo pro smazanou
 *    poznámku.
 *  - Ostatní pole jsou last-write-wins podle `createdAt` domácnosti.
 */

/**
 * 1 → 2: `favorites` bylo pole id, `recipeNotes` mapa id → text. Obojí je
 * teď mapa id → hodnota se značkou času.
 */
export const SCHEMA_VERSION = 2;

export function emptyHouseholdState(): HouseholdState {
  return {
    childName: '',
    childBirthDate: '',
    members: [],
    tastings: [],
    favorites: {},
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

/**
 * Poslední přihlášení každého člena.
 *
 * Nejde o last-write-wins nad celou mapou: každé zařízení ví jistě jen o sobě,
 * takže se mapy sjednotí a u každého uid vyhraje pozdější čas. Jinak by zápis
 * z telefonu A přepsal to, co o sobě zapsal telefon B.
 */
function mergeSeenAt(
  local: Record<string, number> | undefined,
  remote: Record<string, number> | undefined,
): Record<string, number> | undefined {
  if (local === undefined && remote === undefined) return undefined;
  const out: Record<string, number> = { ...remote };
  for (const [uid, kdy] of Object.entries(local ?? {})) {
    out[uid] = Math.max(kdy, out[uid] ?? 0);
  }
  return out;
}

function mergeUnique(local: readonly string[], remote: readonly string[]): string[] {
  return [...new Set([...local, ...remote])];
}

/**
 * Sloučí dvě mapy se značkou času. U každého klíče vyhraje pozdější zápis,
 * takže projde i mazání — na rozdíl od sjednocení seznamů.
 *
 * Při shodném čase zůstává vzdálená hodnota, stejně jako u ostatních polí:
 * server je autorita, ať se dva telefony nepřetahují donekonečna.
 */
function mergeCasovane<T>(
  local: Readonly<Record<string, CasovanaHodnota<T>>>,
  remote: Readonly<Record<string, CasovanaHodnota<T>>>,
): Record<string, CasovanaHodnota<T>> {
  const out: Record<string, CasovanaHodnota<T>> = { ...remote };
  for (const [klic, hodnota] of Object.entries(local)) {
    const protejsek = out[klic];
    if (protejsek === undefined || hodnota.kdy > protejsek.kdy) out[klic] = hodnota;
  }
  return out;
}

/** Jsou hodnoty ve tvaru, který umí tahle verze? Starší zálohy mají tvar 1. */
function jeCasovanaMapa(value: unknown): boolean {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  return Object.values(value as Record<string, unknown>).every(
    (item) => typeof item === 'object' && item !== null && 'kdy' in item,
  );
}

/**
 * Převod staršího stavu na dnešní tvar.
 *
 * Pouští se na všechno, co přijde zvenčí — z prohlížeče, z Firestore
 * i z ručně nahrané zálohy. Bez něj by aplikace spadla na tom, že `favorites`
 * je pole a ne mapa, a rodič by přišel o celý deník.
 */
export function migrateHouseholdState(raw: unknown): HouseholdState {
  const zaklad = emptyHouseholdState();
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return zaklad;
  const vstup = raw as Record<string, unknown>;

  const favorites: Record<string, CasovanaHodnota<boolean>> = {};
  if (Array.isArray(vstup['favorites'])) {
    // Tvar 1: prosté pole id. Čas 0 znamená „od nepaměti", takže jakékoli
    // pozdější přepnutí na kterémkoli telefonu nad ním vyhraje.
    for (const id of vstup['favorites'] as unknown[]) {
      if (typeof id === 'string') favorites[id] = { hodnota: true, kdy: 0 };
    }
  } else if (jeCasovanaMapa(vstup['favorites'])) {
    Object.assign(favorites, vstup['favorites']);
  }

  const recipeNotes: Record<string, CasovanaHodnota<string>> = {};
  const syroveNotes = vstup['recipeNotes'];
  if (jeCasovanaMapa(syroveNotes)) {
    Object.assign(recipeNotes, syroveNotes);
  } else if (syroveNotes !== null && typeof syroveNotes === 'object' && !Array.isArray(syroveNotes)) {
    for (const [id, text] of Object.entries(syroveNotes as Record<string, unknown>)) {
      if (typeof text === 'string') recipeNotes[id] = { hodnota: text, kdy: 0 };
    }
  }

  const tastings = Array.isArray(vstup['tastings'])
    ? (vstup['tastings'] as TastingEvent[]).filter(
        (event) => typeof event?.id === 'string' && typeof event?.ingredientId === 'string',
      )
    : [];

  return {
    ...zaklad,
    childName: typeof vstup['childName'] === 'string' ? vstup['childName'] : '',
    childBirthDate: typeof vstup['childBirthDate'] === 'string' ? vstup['childBirthDate'] : '',
    ...(typeof vstup['childGrip'] === 'string'
      ? { childGrip: vstup['childGrip'] as HouseholdState['childGrip'] }
      : {}),
    ...(Array.isArray(vstup['readySigns'])
      ? { readySigns: vstup['readySigns'] as HouseholdState['readySigns'] }
      : {}),
    ...(Array.isArray(vstup['childAllergens'])
      ? { childAllergens: vstup['childAllergens'] as HouseholdState['childAllergens'] }
      : {}),
    members: Array.isArray(vstup['members'])
      ? (vstup['members'] as unknown[]).filter((uid): uid is string => typeof uid === 'string')
      : [],
    ...(vstup['memberSeenAt'] !== null &&
    typeof vstup['memberSeenAt'] === 'object' &&
    !Array.isArray(vstup['memberSeenAt'])
      ? { memberSeenAt: vstup['memberSeenAt'] as Record<string, number> }
      : {}),
    tastings,
    favorites,
    recipeNotes,
    schemaVersion: SCHEMA_VERSION,
  };
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
  const grip = lastWriteWins(local.childGrip, remote.childGrip, localNewer);
  // Znaky připravenosti jdou i odškrtnout, takže se nesjednocují — vyhrává
  // novější zápis, stejně jako u ostatních údajů o dítěti.
  const znaky = lastWriteWins(local.readySigns, remote.readySigns, localNewer);
  // Alergie dítěte se taky dají odebrat, takže se nesjednocují — vyhrává
  // novější zápis, stejně jako u ostatních údajů o dítěti.
  const alergie = lastWriteWins(local.childAllergens, remote.childAllergens, localNewer);
  const videno = mergeSeenAt(local.memberSeenAt, remote.memberSeenAt);

  return {
    childName: lastWriteWins(local.childName, remote.childName, localNewer),
    childBirthDate: lastWriteWins(local.childBirthDate, remote.childBirthDate, localNewer),
    // Nevyplněný úchop se do stavu nepropisuje jako `undefined` klíč — v poli
    // by pak ležel prázdný záznam, který nic neznamená.
    ...(grip === undefined ? {} : { childGrip: grip }),
    ...(znaky === undefined ? {} : { readySigns: [...znaky] }),
    ...(alergie === undefined ? {} : { childAllergens: [...alergie] }),
    members: mergeUnique(local.members, remote.members).slice(0, MAX_MEMBERS),
    ...(videno === undefined ? {} : { memberSeenAt: videno }),
    // Ochutnávky se nikdy neřeší jako konflikt — vždy se spojují.
    tastings: mergeTastings(local.tastings, remote.tastings),
    favorites: mergeCasovane(local.favorites, remote.favorites),
    recipeNotes: mergeCasovane(local.recipeNotes, remote.recipeNotes),
    schemaVersion: Math.max(local.schemaVersion, remote.schemaVersion),
  };
}

/** Nové id ochutnávky. Náhodné, aby dva telefony offline nevyrobily totéž. */
export function newTastingId(random: Crypto = globalThis.crypto): string {
  return random.randomUUID();
}
