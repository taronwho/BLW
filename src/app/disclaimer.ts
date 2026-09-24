/**
 * Text disclaimeru podle docs/BEZPECNOST.md kapitola 9.
 * Vlastní formulace — zdrojové texty se nekopírují.
 */
export const DISCLAIMER_TITLE = 'Než začneš';

export const DISCLAIMER_PARAGRAPHS: readonly string[] = [
  'Aplikace shrnuje veřejně dostupná doporučení odborných institucí a odkazuje na ně. Nenahrazuje pediatra a nedává lékařská doporučení.',
  'Konkrétní postup u tvého dítěte, zvlášť při podezření na alergii nebo jiné obtíže, patří dětskému lékaři.',
  'U každé informace najdeš zdroj a datum, kdy byl ověřen. Položky označené „Neověřeno“ ber jako podnět k dotazu na pediatra, ne jako doporučení.',
];

export const DISCLAIMER_STORAGE_KEY = 'blw.disclaimer.accepted.v1';

/**
 * Co se s daty děje. Nastavení, sekce Aplikace.
 *
 * Musí sedět s tím, co opravdu dělá kód a `firestore.rules`: bez sdílení
 * nic neodchází, se sdílením jde stav domácnosti do Firestore a správcovský
 * přehled čte jen anonymní souhrny (src/admin/prehled.ts). Poslední věta
 * je tam schválně — vlastník projektu Firebase vidí v konzoli všechno bez
 * ohledu na pravidla a zamlčet to by bylo nepoctivé.
 */
export const SOUKROMI_PARAGRAPHS: readonly string[] = [
  'Bez sdílení zůstává všechno jen v tomhle telefonu: děti, deník, plán, nákup i poznámky.',
  'Když domácnost sdílíš, ukládají se tyhle údaje do databáze Firebase (Google), aby je viděl i druhý telefon. Přečíst je může jen zařízení, které zná párovací kód tvé domácnosti.',
  'Pro přehled o tom, kolik lidí aplikaci používá, posílá sdílený telefon jednou za čas jen anonymní počty: kolik je zařízení, dětí v které fázi příkrmu, ochutnávek a kterých surovin. Jména, data narození, poznámky ani párovací kód v nich nejsou a přehled pro správce k tvé domácnosti přístup nemá.',
  'Autor aplikace je zároveň vlastníkem databáze a má k ní jako u každé cloudové služby technický přístup přes správcovskou konzoli Firebase.',
];
