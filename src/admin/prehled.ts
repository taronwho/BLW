import type { HouseholdState } from '@/types';
import { ZNAME_POPISY_ZARIZENI } from '@/sync/zarizeni';

/**
 * Přehled o používání aplikace — jen čísla.
 *
 * Do 24. 9. 2026 si správce stahoval celé dokumenty domácností a počty si
 * spočítal až u sebe. Přehled sice ukazoval jen čísla, ale v prohlížeči
 * správce se na chvíli ocitla jména dětí, data narození, poznámky i celé
 * deníky. Teď to jde obráceně: každý telefon si z vlastní domácnosti
 * spočítá **souhrn** (tenhle soubor, `souhrnDomacnosti`) a ten jediný
 * zapíše do kolekce `statistiky`. Správce smí číst jen ji; dokumenty
 * domácností mu pravidla Firestore nevydají vůbec.
 *
 * Souhrn nenese nic, co by napsal člověk: žádná jména, data narození,
 * poznámky, párovací kódy ani uid zařízení. Klíčem dokumentu je otisk
 * párovacího kódu, ze kterého se kód zpátky nedopočítá.
 */

/** Verze tvaru souhrnu. Zvedá se, když se změní pole. */
export const VERZE_SOUHRNU = 1;

/** Nejvýš tolik surovin se do souhrnu jedné domácnosti zapíše. */
export const MAX_SUROVIN_V_SOUHRNU = 50;

export interface SouhrnDomacnosti {
  verze: number;
  /** Verze datového schématu domácnosti. */
  schema: number;
  zarizeni: number;
  /** Jak se zařízení hlásí — jen popisy, které umí vyrobit aplikace. */
  zarizeniPodleTypu: Record<string, number>;
  deti: number;
  /** Kolik dětí je v které fázi příkrmu. Fáze, ne datum narození. */
  detiPodleFaze: Record<string, number>;
  ochutnavky: number;
  smazaneOchutnavky: number;
  oblibene: number;
  poznamkyURecepu: number;
  /** Id suroviny → kolikrát je v deníku. Nejčastějších padesát. */
  suroviny: Record<string, number>;
  /** Poslední připojení některého zařízení, zaokrouhlené na den. 0 = neznámo. */
  naposledy: number;
}

/** Souhrn všech domácností, jak ho ukazuje obrazovka přehledu. */
export interface Prehled {
  domacnosti: number;
  /** Domácnosti, ve kterých je aspoň jedna ochutnávka. */
  aktivniDomacnosti: number;
  zarizeni: number;
  domacnostiSViceZarizenimi: number;
  deti: number;
  domacnostiBezDitete: number;
  ochutnavky: number;
  smazaneOchutnavky: number;
  oblibene: number;
  poznamkyURecepu: number;
  /** Počty podle verze datového schématu. */
  schemata: Record<string, number>;
  /** Jak se která zařízení hlásí (nainstalovaná aplikace, prohlížeč v chatu). */
  zarizeniPodleTypu: Record<string, number>;
  /** Kolik dětí je v které fázi příkrmu. */
  detiPodleFaze: Record<string, number>;
  /** Kolikrát se která surovina objevila v denících. Nejčastějších dvacet. */
  nejcastejsiSuroviny: { id: string; pocet: number }[];
  /** Domácnosti, kde se aspoň jedno zařízení hlásilo v posledních dnech. */
  aktivniZa7Dni: number;
  aktivniZa30Dni: number;
}

const DEN = 24 * 60 * 60 * 1000;

/** Fáze, do kterých se děti v přehledu třídí. Nic jiného se nepřijme. */
export const FAZE_PREHLEDU: readonly string[] = [
  'bez data narození',
  'ještě se nenarodilo',
  'do 6 měsíců',
  '6 až 9 měsíců',
  '9 až 12 měsíců',
  '12 až 24 měsíců',
  'nad 2 roky',
];

function faze(birthDate: string, ted: number): string {
  const narozeni = Date.parse(birthDate);
  if (Number.isNaN(narozeni)) return 'bez data narození';
  const mesice = Math.floor((ted - narozeni) / (30.44 * DEN));
  if (mesice < 0) return 'ještě se nenarodilo';
  if (mesice < 6) return 'do 6 měsíců';
  if (mesice < 9) return '6 až 9 měsíců';
  if (mesice < 12) return '9 až 12 měsíců';
  if (mesice < 24) return '12 až 24 měsíců';
  return 'nad 2 roky';
}

/** Tvar id suroviny v katalogu. Cokoli jiného do souhrnu nepatří. */
const ID_SUROVINY = /^[a-z0-9-]{1,60}$/;

function pricti(mapa: Record<string, number>, klic: string, kolik = 1): void {
  mapa[klic] = (mapa[klic] ?? 0) + kolik;
}

/**
 * Souhrn jedné domácnosti. Počítá ho telefon rodiče a nic jiného ze stavu
 * domácnosti na server do statistik nejde.
 */
export function souhrnDomacnosti(stav: HouseholdState, ted = Date.now()): SouhrnDomacnosti {
  const zarizeniPodleTypu: Record<string, number> = {};
  for (const uid of stav.members) {
    const popis = stav.memberLabels?.[uid];
    pricti(
      zarizeniPodleTypu,
      popis === undefined ? 'neznámé' : ZNAME_POPISY_ZARIZENI.has(popis) ? popis : 'jiné',
    );
  }

  const deti = Object.values(stav.children)
    .map((zaznam) => zaznam.hodnota)
    .filter((dite): dite is NonNullable<typeof dite> => dite !== null);
  const detiPodleFaze: Record<string, number> = {};
  for (const dite of deti) pricti(detiPodleFaze, faze(dite.birthDate, ted));

  let ochutnavky = 0;
  let smazaneOchutnavky = 0;
  const podleSuroviny = new Map<string, number>();
  for (const zaznam of stav.tastings) {
    if (zaznam.deleted === true) {
      smazaneOchutnavky += 1;
      continue;
    }
    ochutnavky += 1;
    if (ID_SUROVINY.test(zaznam.ingredientId)) {
      podleSuroviny.set(zaznam.ingredientId, (podleSuroviny.get(zaznam.ingredientId) ?? 0) + 1);
    }
  }
  const suroviny = Object.fromEntries(
    [...podleSuroviny.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, MAX_SUROVIN_V_SOUHRNU),
  );

  const casy = Object.values(stav.memberSeenAt ?? {}).filter((cas) => Number.isFinite(cas));
  const posledni = casy.length === 0 ? 0 : Math.max(...casy);

  return {
    verze: VERZE_SOUHRNU,
    schema: stav.schemaVersion,
    zarizeni: stav.members.length,
    zarizeniPodleTypu,
    deti: deti.length,
    detiPodleFaze,
    ochutnavky,
    smazaneOchutnavky,
    oblibene: Object.values(stav.favorites).filter((one) => one.hodnota).length,
    poznamkyURecepu: Object.values(stav.recipeNotes).filter(
      (one) => one.hodnota.trim().length > 0,
    ).length,
    suroviny,
    naposledy: posledni > 0 ? Math.floor(posledni / DEN) * DEN : 0,
  };
}

function jePocet(hodnota: unknown): hodnota is number {
  return typeof hodnota === 'number' && Number.isInteger(hodnota) && hodnota >= 0;
}

/** Mapa počtů, jen s klíči, které projdou `platnyKlic`. */
function pocty(raw: unknown, platnyKlic: (klic: string) => boolean): Record<string, number> | null {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const out: Record<string, number> = {};
  for (const [klic, hodnota] of Object.entries(raw as Record<string, unknown>)) {
    if (platnyKlic(klic) && jePocet(hodnota)) out[klic] = hodnota;
  }
  return out;
}

/**
 * Souhrn přečtený ze serveru, nebo `null`, když nemá správný tvar.
 *
 * Zapsat do statistik smí kterýkoli přihlášený telefon, takže přehled
 * nevěří ničemu, co nedává smysl, a nic mimo známé klíče neukáže.
 */
export function platnySouhrn(raw: unknown): SouhrnDomacnosti | null {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const r = raw as Record<string, unknown>;
  const cisla = [
    'verze',
    'schema',
    'zarizeni',
    'deti',
    'ochutnavky',
    'smazaneOchutnavky',
    'oblibene',
    'poznamkyURecepu',
    'naposledy',
  ] as const;
  for (const klic of cisla) if (!jePocet(r[klic])) return null;
  const zarizeniPodleTypu = pocty(
    r['zarizeniPodleTypu'],
    (klic) => ZNAME_POPISY_ZARIZENI.has(klic) || klic === 'neznámé' || klic === 'jiné',
  );
  const detiPodleFaze = pocty(r['detiPodleFaze'], (klic) => FAZE_PREHLEDU.includes(klic));
  const suroviny = pocty(r['suroviny'], (klic) => ID_SUROVINY.test(klic));
  if (zarizeniPodleTypu === null || detiPodleFaze === null || suroviny === null) return null;
  return {
    verze: r['verze'] as number,
    schema: r['schema'] as number,
    zarizeni: r['zarizeni'] as number,
    zarizeniPodleTypu,
    deti: r['deti'] as number,
    detiPodleFaze,
    ochutnavky: r['ochutnavky'] as number,
    smazaneOchutnavky: r['smazaneOchutnavky'] as number,
    oblibene: r['oblibene'] as number,
    poznamkyURecepu: r['poznamkyURecepu'] as number,
    suroviny,
    naposledy: r['naposledy'] as number,
  };
}

/** Sečte souhrny všech domácností do přehledu. */
export function spocitejPrehled(
  souhrny: readonly SouhrnDomacnosti[],
  ted = Date.now(),
): Prehled {
  const prehled: Prehled = {
    domacnosti: souhrny.length,
    aktivniDomacnosti: 0,
    zarizeni: 0,
    domacnostiSViceZarizenimi: 0,
    deti: 0,
    domacnostiBezDitete: 0,
    ochutnavky: 0,
    smazaneOchutnavky: 0,
    oblibene: 0,
    poznamkyURecepu: 0,
    schemata: {},
    zarizeniPodleTypu: {},
    detiPodleFaze: {},
    nejcastejsiSuroviny: [],
    aktivniZa7Dni: 0,
    aktivniZa30Dni: 0,
  };
  const podleSuroviny: Record<string, number> = {};

  for (const souhrn of souhrny) {
    prehled.zarizeni += souhrn.zarizeni;
    if (souhrn.zarizeni > 1) prehled.domacnostiSViceZarizenimi += 1;
    pricti(prehled.schemata, String(souhrn.schema));
    for (const [typ, pocet] of Object.entries(souhrn.zarizeniPodleTypu)) {
      pricti(prehled.zarizeniPodleTypu, typ, pocet);
    }
    prehled.deti += souhrn.deti;
    if (souhrn.deti === 0) prehled.domacnostiBezDitete += 1;
    for (const [klic, pocet] of Object.entries(souhrn.detiPodleFaze)) {
      pricti(prehled.detiPodleFaze, klic, pocet);
    }
    prehled.ochutnavky += souhrn.ochutnavky;
    prehled.smazaneOchutnavky += souhrn.smazaneOchutnavky;
    if (souhrn.ochutnavky > 0) prehled.aktivniDomacnosti += 1;
    prehled.oblibene += souhrn.oblibene;
    prehled.poznamkyURecepu += souhrn.poznamkyURecepu;
    for (const [id, pocet] of Object.entries(souhrn.suroviny)) pricti(podleSuroviny, id, pocet);

    // `naposledy` je zaokrouhlené dolů na den, takže se k oknu den přidává.
    if (souhrn.naposledy > 0) {
      if (ted - souhrn.naposledy <= 8 * DEN) prehled.aktivniZa7Dni += 1;
      if (ted - souhrn.naposledy <= 31 * DEN) prehled.aktivniZa30Dni += 1;
    }
  }

  prehled.nejcastejsiSuroviny = Object.entries(podleSuroviny)
    .map(([id, pocet]) => ({ id, pocet }))
    .sort((a, b) => (b.pocet === a.pocet ? a.id.localeCompare(b.id) : b.pocet - a.pocet))
    .slice(0, 20);

  return prehled;
}
