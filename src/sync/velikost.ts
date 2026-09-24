import type { HouseholdState } from '@/types';

/**
 * Velikost dokumentu domácnosti a úklid náhrobků.
 *
 * Firestore unese v jednom dokumentu nejvýš 1 MiB. Celá domácnost je jeden
 * dokument a ochutnávka v něm zabere kolem 300 B, takže se limit dá
 * vyčerpat zhruba třemi tisíci záznamy — při několika zápisech denně a
 * dvou dětech za rok, dva. Pak by zápisy na server začaly padat, a to
 * potichu (kontrola aplikace 24. 9. 2026). Tady je měřidlo, podle kterého
 * aplikace včas varuje, a úklid, který místo vrací.
 */

/** Limit Firestore na jeden dokument, v bajtech. */
export const LIMIT_DOKUMENTU = 1_048_576;

/** Od kolika se v Domácnosti upozorňuje. */
export const ZAPLNENI_UPOZORNIT = 0.7;

/** Od kolika se upozorňuje naléhavě a i na úvodní obrazovce. */
export const ZAPLNENI_NALEHAVE = 0.9;

/**
 * Přibližná velikost dokumentu, jak ho zapisuje `FirestoreAdapter`.
 *
 * Firestore počítá velikost po svém (jména polí, hodnoty a pár bajtů režie
 * na každé), JSON v UTF-8 mu ale odpovídá dost přesně na to, aby se dalo
 * varovat s rezervou. Vrací bajty.
 */
export function velikostDokumentu(state: HouseholdState, updatedAt = 0): number {
  const dokument = { state, updatedAt, members: state.members };
  return new TextEncoder().encode(JSON.stringify(dokument)).length;
}

/** Podíl limitu, který dokument zabírá (0,25 = čtvrtina). */
export function zaplneni(state: HouseholdState): number {
  return velikostDokumentu(state) / LIMIT_DOKUMENTU;
}

/**
 * Jak dlouho po smazání musí se každé zařízení připojit, než se náhrobek
 * smí zahodit.
 *
 * Čas smazání je z hodin jednoho telefonu, čas připojení z hodin druhého.
 * Týden rezervy pokryje rozjeté hodiny i telefon, který se připojil jen na
 * vteřinu a hned ztratil signál.
 */
export const REZERVA_UKLIDU_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Zahodí náhrobky smazaných ochutnávek, o kterých už ví každý telefon.
 *
 * Smazaná ochutnávka zůstává v poli jako `deleted: true`, jinak by ji
 * telefon, který smazání ještě neviděl, při slučování vrátil. Jakmile se ale
 * po smazání připojil **každý** současný člen domácnosti, má náhrobek
 * u sebe každý a vzkřísit ji už není kdo. Pak je náhrobek jen zátěž.
 *
 * Záměrně se nepočítá s „teď" — rozhoduje jen to, co je v datech (čas
 * smazání a časy připojení). Dva telefony tak ze stejného stavu vždycky
 * vyčistí totéž a nepřetahují se o náhrobek přes zpětný zápis.
 *
 * Co tenhle úklid nepokryje: telefon, který rodič z domácnosti odebral a
 * který se po týdnech vrátí se starou kopií, nebo import staré zálohy. Tam
 * se smazaný záznam může vrátit. Je to menší škoda než domácnost, do které
 * se přestane dát zapisovat, a smazat se dá znovu.
 *
 * Bez členů (jen lokální režim) se neuklízí nic: telefon, který se později
 * připojí, náhrobek potřebuje, aby smazání došlo i na server.
 */
export function uklidNahrobky(state: HouseholdState): HouseholdState {
  const clenove = state.members;
  if (clenove.length === 0) return state;
  const videno = state.memberSeenAt ?? {};

  const tastings = state.tastings.filter((event) => {
    if (event.deleted !== true) return true;
    const hranice = event.createdAt + REZERVA_UKLIDU_MS;
    const vsichniVideli = clenove.every((uid) => (videno[uid] ?? 0) >= hranice);
    return !vsichniVideli;
  });
  return tastings.length === state.tastings.length ? state : { ...state, tastings };
}
