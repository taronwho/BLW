import type { Hazard, Ingredient, Recipe, Stage } from '@/types';

/**
 * Opravy katalogu bez nasazení — „dvířka" pro zdravotní údaj.
 *
 * Data jsou v balíku, takže oprava jedné věty dnes znamená build a deploy.
 * U aplikace, jejíž celá hodnota je v přesnosti údajů, je to moc dlouhá
 * cesta (audit 17. 9. 2026, kapitola 10 bod 5).
 *
 * Soubor `opravy.json` leží vedle aplikace a stahuje se **po** vykreslení.
 * Offline režim tím netrpí: když se nestáhne, použije se poslední uložená
 * verze, a když není ani ta, jede katalog z balíku. Aplikace na opravách
 * nikdy nečeká.
 *
 * ## Proč se opravě nevěří
 *
 * Kdyby se použila jakákoli oprava, byla by to cesta, jak do aplikace
 * dostat větu „med je od šesti měsíců v pořádku" mimo všechny kontroly.
 * Proto každá opravená položka projde **týmiž pravidly z `src/safety/`**
 * jako data v repozitáři, a co neprojde, se zahodí. Bezpečnostní vrstva
 * je tu jediná autorita — ne původ souboru.
 *
 * Měnit se smí jen vyjmenovaná textová pole. Idčka, alergeny, věk ani
 * složení receptu ne: ta drží dohromady zbytek aplikace a oprava jednoho
 * čísla by rozbila filtry i plán.
 */

/** Kde soubor leží. `BASE_URL` kvůli podadresáři `/BLW/` na Pages. */
export const ADRESA_OPRAV = `${import.meta.env.BASE_URL}opravy.json`;

/** Klíč v `localStorage`. Poslední stažená podoba, kvůli offline. */
export const KLIC_OPRAV = 'drobek-opravy';

export interface OpravaSuroviny {
  druh: 'surovina';
  id: string;
  /** Proč se opravuje. Ukáže se v detailu, ať rodič ví, co se změnilo. */
  duvod: string;
  chokingReason?: string;
  frequencyLimit?: string;
  hazardNotes?: Partial<Record<Hazard, string>>;
  prep?: Partial<Record<Stage, { serving?: string; caution?: string }>>;
  reviewStatus?: 'verified' | 'needs-review';
  reviewNote?: string;
}

export interface OpravaReceptu {
  druh: 'recept';
  id: string;
  duvod: string;
  babySplitPoint?: string;
  babySteps?: string[];
  babyServing?: Partial<Record<Stage, string>>;
}

export type Oprava = OpravaSuroviny | OpravaReceptu;

export interface Opravy {
  /** Roste s každým vydáním. Menší nebo stejná verze se nepřebírá. */
  verze: number;
  /** ISO datum vydání — ukazuje se v Domácnosti. */
  vydano: string;
  opravy: Oprava[];
}

export interface PouziteOpravy {
  verze: number;
  vydano: string;
  suroviny: Map<string, Ingredient>;
  recepty: Map<string, Recipe>;
  /** Proč se která položka opravila; klíčem je id. */
  duvody: Map<string, string>;
  /** Co se zahodilo a proč. Do konzole, ne rodiči. */
  zahozeno: string[];
}

export const PRAZDNE_OPRAVY: PouziteOpravy = {
  verze: 0,
  vydano: '',
  suroviny: new Map(),
  recepty: new Map(),
  duvody: new Map(),
  zahozeno: [],
};

function jeText(hodnota: unknown): hodnota is string {
  return typeof hodnota === 'string' && hodnota.trim().length > 0;
}

/** Rozebere stažený soubor. Cokoli podezřelého znamená „žádné opravy". */
export function rozeberOpravy(raw: unknown): Opravy | null {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const zaznam = raw as Record<string, unknown>;
  const verze = zaznam['verze'];
  if (typeof verze !== 'number' || !Number.isFinite(verze) || verze < 0) return null;
  if (!Array.isArray(zaznam['opravy'])) return null;
  const opravy: Oprava[] = [];
  for (const polozka of zaznam['opravy'] as unknown[]) {
    if (polozka === null || typeof polozka !== 'object' || Array.isArray(polozka)) continue;
    const o = polozka as Record<string, unknown>;
    if (!jeText(o['id']) || !jeText(o['duvod'])) continue;
    if (o['druh'] !== 'surovina' && o['druh'] !== 'recept') continue;
    opravy.push(o as unknown as Oprava);
  }
  return {
    verze,
    vydano: jeText(zaznam['vydano']) ? zaznam['vydano'] : '',
    opravy,
  };
}
