import type {
  CasovanaHodnota,
  Child,
  HouseholdState,
  NakupPolozka,
  Plan,
  TastingEvent,
} from '@/types';

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
 * 2 → 3: jedno dítě (`childName`, `childBirthDate`, `childGrip`, `readySigns`,
 * `childAllergens`) se změnilo na mapu dětí; ochutnávky nesou `childId`.
 * 3 → 4: přibyl třicetidenní plán (`plans`). Starší stav ho nemá a nemusí:
 * chybějící plán znamená, že si ho rodič ještě nesestavil.
 * 4 → 5: přibyl nákupní seznam (`nakup`). Chybějící seznam znamená prázdný,
 * takže starší stav není co převádět.
 */
export const SCHEMA_VERSION = 5;

export function emptyHouseholdState(): HouseholdState {
  return {
    members: [],
    children: {},
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

/**
 * Popisy zařízení. Každé zapisuje jen svůj vlastní klíč, takže se mapy
 * sjednotí; při shodě rozhoduje vzdálená hodnota jako všude jinde.
 */
function mergeLabels(
  local: Record<string, string> | undefined,
  remote: Record<string, string> | undefined,
): Record<string, string> | undefined {
  if (local === undefined && remote === undefined) return undefined;
  return { ...local, ...remote };
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

  // Děti. Tvar 2 a starší uměl jedno dítě rozepsané do pěti polí stavu;
  // udělá se z něj první dítě a ochutnávky se mu přiřadí.
  const children: Record<string, CasovanaHodnota<Child | null>> = {};
  if (jeCasovanaMapa(vstup['children'])) {
    Object.assign(children, vstup['children']);
  }
  let prvniId: string | undefined = Object.entries(children).find(
    ([, zaznam]) => zaznam.hodnota !== null,
  )?.[0];

  const jmeno = typeof vstup['childName'] === 'string' ? vstup['childName'] : '';
  const narozeni = typeof vstup['childBirthDate'] === 'string' ? vstup['childBirthDate'] : '';
  if (prvniId === undefined && (jmeno.length > 0 || narozeni.length > 0)) {
    const id = PRVNI_DITE;
    children[id] = {
      hodnota: {
        id,
        name: jmeno,
        birthDate: narozeni,
        ...(typeof vstup['childGrip'] === 'string'
          ? { grip: vstup['childGrip'] as Child['grip'] }
          : {}),
        ...(Array.isArray(vstup['readySigns'])
          ? { readySigns: vstup['readySigns'] as Child['readySigns'] }
          : {}),
        ...(Array.isArray(vstup['childAllergens'])
          ? { allergens: vstup['childAllergens'] as Child['allergens'] }
          : {}),
      },
      kdy: 0,
    };
    prvniId = id;
  }

  const tastings = Array.isArray(vstup['tastings'])
    ? (vstup['tastings'] as TastingEvent[])
        .filter((event) => typeof event?.id === 'string' && typeof event?.ingredientId === 'string')
        // Záznamy z doby jednoho dítěte patří tomu prvnímu.
        .map((event) =>
          event.childId === undefined && prvniId !== undefined
            ? { ...event, childId: prvniId }
            : event,
        )
    : [];

  const plans: Record<string, CasovanaHodnota<Plan | null>> = {};
  if (jeCasovanaMapa(vstup['plans'])) {
    Object.assign(plans, vstup['plans']);
  }

  const nakup: Record<string, CasovanaHodnota<NakupPolozka | null>> = {};
  if (jeCasovanaMapa(vstup['nakup'])) {
    Object.assign(nakup, vstup['nakup']);
  }

  return {
    ...zaklad,
    children,
    members: Array.isArray(vstup['members'])
      ? (vstup['members'] as unknown[]).filter((uid): uid is string => typeof uid === 'string')
      : [],
    ...(vstup['memberSeenAt'] !== null &&
    typeof vstup['memberSeenAt'] === 'object' &&
    !Array.isArray(vstup['memberSeenAt'])
      ? { memberSeenAt: vstup['memberSeenAt'] as Record<string, number> }
      : {}),
    ...(vstup['memberLabels'] !== null &&
    typeof vstup['memberLabels'] === 'object' &&
    !Array.isArray(vstup['memberLabels'])
      ? { memberLabels: vstup['memberLabels'] as Record<string, string> }
      : {}),
    tastings,
    favorites,
    recipeNotes,
    ...(Object.keys(plans).length > 0 ? { plans } : {}),
    ...(Object.keys(nakup).length > 0 ? { nakup } : {}),
    schemaVersion: SCHEMA_VERSION,
  };
}

/** Id, pod kterým se uloží dítě převzaté ze starší verze s jedním dítětem. */
export const PRVNI_DITE = 'dite-1';



/** Maximální počet členů domácnosti (docs/SPEC.md kap. 7 i firestore.rules). */
export const MAX_MEMBERS = 5;

/**
 * Sloučení plánů.
 *
 * Plán se skládá ze dvou částí, které se chovají jinak. `dny` jsou výsledek
 * jednoho sestavení a mění se zřídka, takže u nich rozhoduje pozdější zápis.
 * `stavy` se naopak mění pořád a každý den má vlastní značku času, aby se
 * odškrtnutí ze dvou telefonů sloučilo místo přepsání.
 *
 * Stavy se slučují jen u téhož bloku sestaveného ve stejnou chvíli. Kdyby se
 * přenášely i mezi různými sestaveními, odškrtnuté dny starého plánu by
 * označily úplně jiná jídla toho nového.
 */
function mergePlany(
  local: Record<string, CasovanaHodnota<Plan | null>> | undefined,
  remote: Record<string, CasovanaHodnota<Plan | null>> | undefined,
): Record<string, CasovanaHodnota<Plan | null>> | undefined {
  if (local === undefined && remote === undefined) return undefined;
  const out = mergeCasovane<Plan | null>(local ?? {}, remote ?? {});
  for (const [childId, zaznam] of Object.entries(out)) {
    const vitez = zaznam.hodnota;
    const druhy = (zaznam === local?.[childId] ? remote?.[childId] : local?.[childId])?.hodnota;
    if (vitez === null || druhy === null || druhy === undefined) continue;
    if (vitez.blok !== druhy.blok || vitez.vytvoreno !== druhy.vytvoreno) continue;
    out[childId] = { ...zaznam, hodnota: { ...vitez, stavy: mergeCasovane(druhy.stavy, vitez.stavy) } };
  }
  return out;
}

/**
 * Sloučení nákupních seznamů.
 *
 * U každé suroviny rozhoduje pozdější zápis, takže projde i odškrtnutí
 * a odebrání. Dávky se nesčítají napříč telefony: kdyby se sjednocovaly,
 * recept přidaný na obou zařízeních by v seznamu skončil dvakrát.
 */
function mergeNakup(
  local: Record<string, CasovanaHodnota<NakupPolozka | null>> | undefined,
  remote: Record<string, CasovanaHodnota<NakupPolozka | null>> | undefined,
): Record<string, CasovanaHodnota<NakupPolozka | null>> | undefined {
  if (local === undefined && remote === undefined) return undefined;
  return mergeCasovane<NakupPolozka | null>(local ?? {}, remote ?? {});
}

/**
 * Sloučení dvou stavů domácnosti.
 *
 * Nebere čas zápisu celého dokumentu, protože ho už nepotřebuje: každá
 * hodnota, u které může vzniknout konflikt, si nese vlastní značku času.
 * Dokud rozhodoval čas celého dokumentu, mohla jedna změna přebít úplně
 * nesouvisející změnu z druhého telefonu jen proto, že přišla později.
 */
export function mergeHouseholdState(
  local: HouseholdState,
  remote: HouseholdState,
): HouseholdState {
  const videno = mergeSeenAt(local.memberSeenAt, remote.memberSeenAt);
  const popisy = mergeLabels(local.memberLabels, remote.memberLabels);
  const plany = mergePlany(local.plans, remote.plans);
  const nakup = mergeNakup(local.nakup, remote.nakup);

  return {
    // Děti mají u každé položky vlastní čas, takže dvě zařízení můžou offline
    // přidat každé své a obojí zůstane. Smazané dítě je náhrobek `null`.
    children: mergeCasovane(local.children, remote.children),
    members: mergeUnique(local.members, remote.members).slice(0, MAX_MEMBERS),
    ...(videno === undefined ? {} : { memberSeenAt: videno }),
    ...(popisy === undefined ? {} : { memberLabels: popisy }),
    // Ochutnávky se nikdy neřeší jako konflikt — vždy se spojují.
    tastings: mergeTastings(local.tastings, remote.tastings),
    favorites: mergeCasovane(local.favorites, remote.favorites),
    recipeNotes: mergeCasovane(local.recipeNotes, remote.recipeNotes),
    ...(plany === undefined ? {} : { plans: plany }),
    ...(nakup === undefined ? {} : { nakup }),
    schemaVersion: Math.max(local.schemaVersion, remote.schemaVersion),
  };
}

/** Děti, které v domácnosti opravdu jsou — bez náhrobků, v pořadí zadání. */
export function activeChildren(state: HouseholdState): Child[] {
  return Object.values(state.children)
    .map((zaznam) => zaznam.hodnota)
    .filter((dite): dite is Child => dite !== null)
    .sort((a, b) => a.birthDate.localeCompare(b.birthDate) || a.name.localeCompare(b.name, 'cs'));
}

/** Nové id dítěte. Náhodné, aby dva telefony offline nevyrobily totéž. */
export function newChildId(random: Crypto = globalThis.crypto): string {
  return random.randomUUID();
}

/** Nové id ochutnávky. Náhodné, aby dva telefony offline nevyrobily totéž. */
export function newTastingId(random: Crypto = globalThis.crypto): string {
  return random.randomUUID();
}
