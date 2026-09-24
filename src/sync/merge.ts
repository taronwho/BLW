import type {
  CasovanaHodnota,
  Child,
  HouseholdState,
  NakupPolozka,
  Plan,
  TastingEvent,
} from '@/types';
import { platnaOchutnavka, platneDite, type Zahozeno } from './validace';

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
 * 5 → 6: dítě má seznam surovin vyřazených z plánu (`vyrazene`). Chybějící
 * seznam znamená, že nic vyřazené není. Verze se zvedá kvůli starším
 * telefonům: ty neznámé pole zahazují, takže by při úpravě dítěte seznam
 * smazaly. Takhle dokument novější verze odmítnou zapsat.
 */
export const SCHEMA_VERSION = 6;

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

/**
 * Členství: kdo v domácnosti je, se značkou času u každého uid.
 *
 * Dokud se `members` slučovalo sjednocením, nešlo odebrat nikoho a nic.
 * Sjednocení umí jen přidávat, takže odebrané zařízení se při dalším
 * sloučení vrátilo a s ním i jeho popisek a čas — a ty pak rostly
 * donekonečna (audit 17. 9. 2026, nálezy 7.3 a 7.4).
 *
 * Starý dokument `memberClenstvi` nemá, takže se dopočítá z `members`
 * s časem 0 — „od nepaměti". Jakýkoli pozdější zápis nad ním vyhraje,
 * stejně jako u oblíbených.
 */
export function clenstviZeStavu(
  state: Pick<HouseholdState, 'members' | 'memberClenstvi'>,
): Record<string, CasovanaHodnota<boolean>> {
  const out: Record<string, CasovanaHodnota<boolean>> = {};
  for (const uid of state.members) out[uid] = { hodnota: true, kdy: 0 };
  for (const [uid, zaznam] of Object.entries(state.memberClenstvi ?? {})) out[uid] = zaznam;
  return out;
}

/**
 * Pole `members`, jak ho čtou `firestore.rules`.
 *
 * Pravidla delší seznam než `MAX_MEMBERS` odmítnou, takže se musí useknout.
 * Dřív se sekalo `slice(0, 5)` nad sjednocením, kde pořadí určoval lokální
 * seznam — při šestém zařízení tedy vypadl někdo podle náhody a bez hlášky.
 * Teď rozhoduje čas připojení: zůstává pět nejdéle přihlášených a ostatní
 * čekají. V `memberClenstvi` zůstávají, takže jakmile se místo uvolní,
 * nastoupí sami a nikdo se nemusí připojovat znovu.
 */
export function clenoveZeStavu(
  clenstvi: Readonly<Record<string, CasovanaHodnota<boolean>>>,
): string[] {
  return Object.entries(clenstvi)
    .filter(([, zaznam]) => zaznam.hodnota)
    .sort((a, b) => a[1].kdy - b[1].kdy || (a[0] < b[0] ? -1 : 1))
    .map(([uid]) => uid)
    .slice(0, MAX_MEMBERS);
}

/** Členové nad `MAX_MEMBERS` — připojení, ale zatím bez místa. */
export function cekajiciClenove(
  clenstvi: Readonly<Record<string, CasovanaHodnota<boolean>>>,
): string[] {
  return Object.entries(clenstvi)
    .filter(([, zaznam]) => zaznam.hodnota)
    .sort((a, b) => a[1].kdy - b[1].kdy || (a[0] < b[0] ? -1 : 1))
    .map(([uid]) => uid)
    .slice(MAX_MEMBERS);
}

/**
 * Popisky a časy jen pro uid, která v domácnosti opravdu jsou.
 *
 * Bez úklidu obě mapy jen rostly: `removeMember` klíče smazal, ale druhý
 * telefon je při dalším sloučení vrátil.
 */
function jenProCleny<T>(
  mapa: Record<string, T> | undefined,
  clenstvi: Readonly<Record<string, CasovanaHodnota<boolean>>>,
): Record<string, T> | undefined {
  if (mapa === undefined) return undefined;
  const out: Record<string, T> = {};
  for (const [uid, hodnota] of Object.entries(mapa)) {
    if (clenstvi[uid]?.hodnota === true) out[uid] = hodnota;
  }
  return out;
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
/**
 * Jedna hodnota se značkou času — `{ hodnota, kdy }`.
 *
 * Kontroluje se i typ `kdy`: bez čísla by se konflikt nedal rozhodnout a
 * `NaN` by v porovnání tiše prohrálo pokaždé.
 */
function jeCasovanaHodnota(value: unknown): boolean {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const zaznam = value as Record<string, unknown>;
  return 'hodnota' in zaznam && jeCas(zaznam['kdy']);
}

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
  return prevedStav(raw).stav;
}

/**
 * Totéž, ale i s počtem zahozených záznamů.
 *
 * Používá to import zálohy, aby rodiči mohl říct, že se část souboru
 * načíst nedala. Tiché zahození by bylo horší než chyba: rodič by si
 * myslel, že má deník kompletní.
 */
export function prevedStav(raw: unknown): { stav: HouseholdState; zahozeno: Zahozeno } {
  const zahozeno: Zahozeno = { ochutnavky: 0, deti: 0 };
  const zaklad = emptyHouseholdState();
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    return { stav: zaklad, zahozeno };
  }
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
  // Časovaná mapa se dřív přebírala celá, protože `jeCasovanaMapa` ověří
  // jen přítomnost klíče `kdy`. Dítě s rozbitým `birthDate` pak rozhodilo
  // výpočet věku i předvolbu fáze.
  const children: Record<string, CasovanaHodnota<Child | null>> = {};
  if (jeCasovanaMapa(vstup['children'])) {
    for (const [id, zaznam] of Object.entries(vstup['children'] as Record<string, CasovanaHodnota<unknown>>)) {
      if (!jeCas(zaznam.kdy)) continue;
      // `null` je náhrobek po smazaném dítěti a musí projít — bez něj by
      // se smazané dítě při slučování vrátilo.
      if (zaznam.hodnota === null) {
        children[id] = { hodnota: null, kdy: zaznam.kdy };
        continue;
      }
      const dite = platneDite(zaznam.hodnota);
      if (dite === null) {
        zahozeno.deti += 1;
        continue;
      }
      children[id] = { hodnota: dite, kdy: zaznam.kdy };
    }
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

  const tastings: TastingEvent[] = [];
  if (Array.isArray(vstup['tastings'])) {
    for (const syrovy of vstup['tastings'] as unknown[]) {
      const event = platnaOchutnavka(syrovy);
      if (event === null) {
        zahozeno.ochutnavky += 1;
        continue;
      }
      // Záznamy z doby jednoho dítěte patří tomu prvnímu.
      tastings.push(
        event.childId === undefined && prvniId !== undefined
          ? { ...event, childId: prvniId }
          : event,
      );
    }
  }

  const plans: Record<string, CasovanaHodnota<Plan | null>> = {};
  if (jeCasovanaMapa(vstup['plans'])) {
    Object.assign(plans, vstup['plans']);
  }

  const nakup: Record<string, CasovanaHodnota<NakupPolozka | null>> = {};
  if (jeCasovanaMapa(vstup['nakup'])) {
    Object.assign(nakup, vstup['nakup']);
  }

  const stav: HouseholdState = {
    ...zaklad,
    children,
    members: Array.isArray(vstup['members'])
      ? (vstup['members'] as unknown[]).filter((uid): uid is string => typeof uid === 'string')
      : [],
    ...(jeCasovanaHodnota(vstup['nakupDospelych'])
      ? { nakupDospelych: vstup['nakupDospelych'] as CasovanaHodnota<number> }
      : {}),
    ...(jeCasovanaMapa(vstup['memberClenstvi'])
      ? {
          memberClenstvi: vstup['memberClenstvi'] as Record<string, CasovanaHodnota<boolean>>,
        }
      : {}),
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
  return { stav, zahozeno };
}

/**
 * Z dvou časovaných hodnot ta pozdější; při shodě vzdálená.
 *
 * Stejné pravidlo jako v `mergeCasovane`, jen pro jedinou hodnotu místo mapy:
 * server je autorita, ať se dva telefony nepřetahují donekonečna.
 */
function novejsi<T>(
  local: CasovanaHodnota<T> | undefined,
  remote: CasovanaHodnota<T> | undefined,
): CasovanaHodnota<T> | undefined {
  if (local === undefined) return remote;
  if (remote === undefined) return local;
  return local.kdy > remote.kdy ? local : remote;
}

/** Značka času v časované mapě. Bez ní se nedá rozhodnout žádný konflikt. */
function jeCas(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * Je tenhle dokument z novější verze aplikace, než jakou má tohle zařízení?
 *
 * `migrateHouseholdState` vrací jen pole, která zná — neznámá zahazuje.
 * Starší telefon by tedy dokument nové verze ořezal, orazítkoval ho vyšším
 * `schemaVersion` a zapsal zpátky; druhý telefon by o data přišel a nikdo
 * by se to nedozvěděl. Protože se PWA aktualizuje až po klepnutí na
 * „Obnovit", je rozjetá verze zrovna tady běžnější než jinde.
 */
export function jeZNovejsiVerze(raw: unknown): boolean {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return false;
  const verze = (raw as Record<string, unknown>)['schemaVersion'];
  return typeof verze === 'number' && verze > SCHEMA_VERSION;
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
  const clenstvi = mergeCasovane<boolean>(clenstviZeStavu(local), clenstviZeStavu(remote));
  const dospelych = novejsi(local.nakupDospelych, remote.nakupDospelych);
  const videno = jenProCleny(mergeSeenAt(local.memberSeenAt, remote.memberSeenAt), clenstvi);
  const popisy = jenProCleny(mergeLabels(local.memberLabels, remote.memberLabels), clenstvi);
  const plany = mergePlany(local.plans, remote.plans);
  const nakup = mergeNakup(local.nakup, remote.nakup);

  return {
    // Děti mají u každé položky vlastní čas, takže dvě zařízení můžou offline
    // přidat každé své a obojí zůstane. Smazané dítě je náhrobek `null`.
    children: mergeCasovane(local.children, remote.children),
    members: clenoveZeStavu(clenstvi),
    memberClenstvi: clenstvi,
    ...(videno === undefined ? {} : { memberSeenAt: videno }),
    ...(popisy === undefined ? {} : { memberLabels: popisy }),
    // Ochutnávky se nikdy neřeší jako konflikt — vždy se spojují.
    tastings: mergeTastings(local.tastings, remote.tastings),
    favorites: mergeCasovane(local.favorites, remote.favorites),
    // Jedna hodnota, ne mapa: vyhrává pozdější zápis. Bez značky času by
    // telefon, který se přihlásil později, vnutil svou starší volbu.
    ...(dospelych === undefined ? {} : { nakupDospelych: dospelych }),
    recipeNotes: mergeCasovane(local.recipeNotes, remote.recipeNotes),
    ...(plany === undefined ? {} : { plans: plany }),
    ...(nakup === undefined ? {} : { nakup }),
    schemaVersion: Math.max(local.schemaVersion, remote.schemaVersion),
  };
}

/**
 * Otisk stavu pro porovnání „je to totéž?".
 *
 * Nezáleží na pořadí klíčů v objektech ani na pořadí ochutnávek a členů —
 * dvě zařízení je můžou mít seřazené jinak, a přitom jde o stejná data.
 */
export function otiskStavu(state: HouseholdState): string {
  const serazene: HouseholdState = {
    ...state,
    members: [...state.members].sort(),
    tastings: [...state.tastings].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)),
  };
  return JSON.stringify(serazene, (_klic, hodnota: unknown) => {
    if (hodnota === null || typeof hodnota !== 'object' || Array.isArray(hodnota)) return hodnota;
    const zdroj = hodnota as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const klic of Object.keys(zdroj).sort()) {
      if (zdroj[klic] !== undefined) out[klic] = zdroj[klic];
    }
    return out;
  });
}

/**
 * Má sloučený stav něco, co na serveru chybí?
 *
 * Dokument domácnosti se zapisuje celý. Když dva telefony zapisovaly
 * offline, druhý zápis přepsal první a server o jeho ochutnávce neví.
 * Telefon, který si ji pamatuje, ji musí po sloučení vrátit zpátky —
 * jinak ji druhý rodič neuvidí, dokud tenhle telefon nezmění něco dalšího.
 */
export function chybiNaServeru(slouceny: HouseholdState, server: HouseholdState): boolean {
  return otiskStavu(slouceny) !== otiskStavu(server);
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
