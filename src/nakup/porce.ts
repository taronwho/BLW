import type { Soucet } from './mnozstvi';

/**
 * Přepočet nákupu na počet lidí u stolu.
 *
 * Každý recept v kuchařce je psaný na **dva dospělé a jedno dítě** — všech
 * 494 bez výjimky. Kdo vaří pro pět, si to dosud musel přepočítat sám a u
 * regálu se to počítá špatně (audit 17. 9. 2026, kapitola 10 bod 2).
 *
 * Počítá se podle dospělých, ne podle celkového počtu lidí. Dětská porce
 * je v receptu odebraná z téhož hrnce a na množství surovin se prakticky
 * neprojeví: kdo přidá druhé dítě, nekupuje o třetinu víc mrkve.
 */

/** Na kolik dospělých je psaná kuchařka. */
export const ZAKLAD_DOSPELYCH = 2;

/** Kolik dospělých jde v nákupu nastavit. */
export const VOLBY_DOSPELYCH: readonly number[] = [2, 3, 4, 5, 6, 8];

/**
 * Násobek pro daný počet dospělých.
 *
 * Nesmyslný nebo chybějící počet znamená „jako v kuchařce", tedy 1.
 * Raději nepřepočítat, než přepočítat podle nesmyslu — podle čísla v
 * seznamu rodič opravdu nakoupí.
 */
export function nasobekProDospele(dospelych: number | undefined): number {
  if (dospelych === undefined || !Number.isFinite(dospelych)) return 1;
  if (dospelych < 1) return 1;
  return dospelych / ZAKLAD_DOSPELYCH;
}

/**
 * Zaokrouhlení, aby v seznamu nestálo „233,3333 g".
 *
 * Gramy a mililitry na celé, všechno ostatní na půlky: „1,5 lžíce" dává
 * smysl, „1,5 stroužku" taky, ale „1,33 stroužku" je hádanka.
 */
function zaokrouhli(hodnota: number, jednotka: string): number {
  if (jednotka === 'g' || jednotka === 'ml') return Math.round(hodnota);
  return Math.round(hodnota * 2) / 2;
}

/**
 * Vynásobí sečtené množství.
 *
 * Zápisy, které se rozebrat nedaly („na pánev", „podle chuti"), zůstávají
 * beze změny. Násobit slovo nejde a vymyšlené číslo by bylo horší než
 * žádné.
 */
export function vynasobSoucet(soucet: Soucet, nasobek: number): Soucet {
  if (nasobek === 1) return soucet;
  return {
    mnozstvi: soucet.mnozstvi.map((jedno) => ({
      jednotka: jedno.jednotka,
      hodnota: zaokrouhli(jedno.hodnota * nasobek, jedno.jednotka),
    })),
    zbytek: soucet.zbytek,
  };
}

/** Násobek slovy, jak ho vidí rodič: „1,5×". */
export function popisNasobku(nasobek: number): string {
  const zaokrouhleny = Math.round(nasobek * 100) / 100;
  return `${String(zaokrouhleny).replace('.', ',')}×`;
}
