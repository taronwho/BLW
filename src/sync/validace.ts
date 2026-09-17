import {
  ALLERGEN_GROUPS,
  GRIPS,
  READY_SIGNS,
  TASTING_AMOUNTS,
  TASTING_REACTIONS,
  type AllergenGroup,
  type Child,
  type Grip,
  type ReadySign,
  type TastingEvent,
} from '@/types';
import { sklonuj, type Tvary } from '@/text/sklonovani';

/**
 * Kontrola tvaru dat, která přicházejí zvenčí.
 *
 * Zvenčí znamená ze tří míst: z nahrané zálohy, z IndexedDB po starší verzi
 * aplikace a z Firestore. Ani jedno z nich nikdo nekontroluje — zálohu si
 * rodič vybírá z disku sám a do Firestore může zapsat jakýkoli telefon
 * v domácnosti, i takový, kterému se něco rozbilo.
 *
 * Dřív se na hranici ověřovalo jen to, že ochutnávka má `id` a
 * `ingredientId` jako řetězce; zbytek se přetypoval a věřilo se mu.
 * Záznam s chybějícím `createdAt` pak rozbil porovnání ve slučování
 * (`undefined > undefined` je `false`, takže nevyhrál nikdo) i řazení
 * deníku — a protože se poškozený stav ukládá i do Firestore, dostal ho
 * i druhý rodič.
 *
 * Pravidlo je jednoduché: **co neprojde, se zahodí a spočítá.** Nic se
 * nedoplňuje náhradní hodnotou. Datum ani reakci si aplikace vymýšlet
 * nebude, deník je záznam o dítěti.
 */

function jeObjekt(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function neprazdnyText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/** Konečný seznam hodnot — typ sám o sobě po překladu neexistuje. */
function jednaZ<T extends string>(value: unknown, povolene: readonly T[]): value is T {
  return typeof value === 'string' && (povolene as readonly string[]).includes(value);
}

/**
 * Datum ochutnávky. Očekává se `YYYY-MM-DD`, protože tak ho ukládá
 * formulář i plán; jiný tvar by se v deníku řadil špatně.
 */
function jeIsoDatum(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return !Number.isNaN(Date.parse(value));
}

function jeCas(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

/** Podmnožina povolených hodnot; cizí prvky vypadnou, pole zůstane. */
function vyfiltruj<T extends string>(value: unknown, povolene: readonly T[]): T[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.filter((one): one is T => jednaZ(one, povolene));
}

/**
 * Platná ochutnávka, nebo `null`.
 *
 * `childId` a `note` jsou nepovinné; když mají špatný tvar, zahodí se jen
 * ony, ne celý záznam — ztratit kvůli rozbité poznámce fakt, že dítě
 * surovinu ochutnalo, by bylo horší.
 */
export function platnaOchutnavka(raw: unknown): TastingEvent | null {
  if (!jeObjekt(raw)) return null;
  if (!neprazdnyText(raw['id'])) return null;
  if (!neprazdnyText(raw['ingredientId'])) return null;
  if (!jeIsoDatum(raw['date'])) return null;
  if (!jednaZ(raw['amount'], TASTING_AMOUNTS)) return null;
  if (!jednaZ(raw['reaction'], TASTING_REACTIONS)) return null;
  if (!jeCas(raw['createdAt'])) return null;

  const event: TastingEvent = {
    id: raw['id'],
    ingredientId: raw['ingredientId'],
    date: raw['date'],
    amount: raw['amount'],
    reaction: raw['reaction'],
    // Kdo záznam pořídil, je stopa pro rodiče, ne klíč. Prázdné je v pořádku.
    createdBy: typeof raw['createdBy'] === 'string' ? raw['createdBy'] : '',
    createdAt: raw['createdAt'],
    ...(neprazdnyText(raw['childId']) ? { childId: raw['childId'] } : {}),
    ...(typeof raw['note'] === 'string' ? { note: raw['note'] } : {}),
    ...(raw['deleted'] === true ? { deleted: true } : {}),
  };
  return event;
}

/**
 * Platné dítě, nebo `null`.
 *
 * `birthDate` smí být prázdné — rodič si dítě může založit dřív, než datum
 * vyplní, a aplikace s tím počítá (`ageInMonths` vrací `null`). Nesmí ale
 * být nesmysl, protože z něj počítá věk i fáze.
 */
export function platneDite(raw: unknown): Child | null {
  if (!jeObjekt(raw)) return null;
  if (!neprazdnyText(raw['id'])) return null;
  if (typeof raw['name'] !== 'string') return null;

  const narozeni = raw['birthDate'];
  if (typeof narozeni !== 'string') return null;
  if (narozeni.length > 0 && !jeIsoDatum(narozeni)) return null;

  const znaky = vyfiltruj<ReadySign>(raw['readySigns'], READY_SIGNS);
  const alergeny = vyfiltruj<AllergenGroup>(raw['allergens'], ALLERGEN_GROUPS);

  const dite: Child = {
    id: raw['id'],
    name: raw['name'],
    birthDate: narozeni,
    ...(jednaZ<Grip>(raw['grip'], GRIPS) ? { grip: raw['grip'] } : {}),
    ...(znaky === undefined ? {} : { readySigns: znaky }),
    ...(alergeny === undefined ? {} : { allergens: alergeny }),
  };
  return dite;
}

/** Kolik záznamů se při načtení zahodilo a proč. Pro hlášku rodiči. */
export interface Zahozeno {
  ochutnavky: number;
  deti: number;
}

export function zahozenoCelkem(zahozeno: Zahozeno): number {
  return zahozeno.ochutnavky + zahozeno.deti;
}

const ZAPIS: Tvary = ['zápis', 'zápisy', 'zápisů', 'zápisu'];
const DITE: Tvary = ['dítě', 'děti', 'dětí', 'dítěte'];

/** Věta pro rodiče. Vrací `null`, když se nic nezahodilo. */
export function popisZahozenych(zahozeno: Zahozeno): string | null {
  const casti: string[] = [];
  if (zahozeno.ochutnavky > 0) {
    casti.push(`${sklonuj(zahozeno.ochutnavky, ZAPIS)} ochutnávky`);
  }
  if (zahozeno.deti > 0) {
    casti.push(sklonuj(zahozeno.deti, DITE));
  }
  if (casti.length === 0) return null;
  return `Soubor obsahoval ${casti.join(' a ')} v poškozeném tvaru. Zbytek se načetl, poškozené záznamy se zahodily.`;
}
