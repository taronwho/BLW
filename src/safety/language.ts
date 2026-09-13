/**
 * Jazyková kontrola českých textů.
 *
 * Doplňuje pravidla v ./rules.ts o dvě věci, které se v korektuře ukázaly
 * jako opakovaný problém napříč celými daty:
 *
 *  1. Typografie. Rovná uvozovka místo „ “ a tři tečky místo výpustky se
 *     v datech objevily jen párkrát, ale nikdo si jich nevšimne, dokud
 *     nejsou vidět na mobilu.
 *  2. Oslovení. Aplikace rodiči tyká na dvou tisících místech. Jediné
 *     „nastavte“ nebo „vašeho dítěte“ mezi nimi působí, jako by text psal
 *     někdo jiný.
 *
 * `\b` v JavaScriptu zná jen ASCII, takže „součást“ by mu vyšlo jako hranice
 * mezi „sou“ a „č“. Česká hranice slova se proto píše přes lookaround nad
 * skutečnou abecedou.
 */

const ABECEDA = 'a-zA-ZáčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ';

export function ceskeSlovo(jadro: string): RegExp {
  return new RegExp(`(?<![${ABECEDA}])(?:${jadro})(?![${ABECEDA}])`, 'iu');
}

/** Rozkazovací způsob v množném čísle tam, kde zbytek aplikace tyká. */
const VYKANI_SLOVESA = [
  'podávejte',
  'nabídněte',
  'zkontrolujte',
  'nakrájejte',
  'krájejte',
  'vmíchejte',
  'proberte',
  'volejte',
  'kombinujte',
  'nastavte',
  'počkejte',
  'sledujte',
  'vyhněte',
  'začněte',
  'udělejte',
  'přidejte',
  'odeberte',
  'vyzkoušejte',
  'používejte',
  'nepodávejte',
  'nedávejte',
  'nenabízejte',
  'nesahejte',
  'zůstaňte',
].join('|');

/** Přivlastňovací zájmena, kterými se vyká jednomu člověku. */
const VYKANI_ZAJMENA = ['vašeho', 'vaše', 'vaší', 'vašich', 'vašemu', 'vašem', 'váš'].join('|');

const VYKANI = ceskeSlovo(`${VYKANI_SLOVESA}|${VYKANI_ZAJMENA}`);

export interface JazykNalez {
  /** Krátké pojmenování problému do hlášky validátoru. */
  problem: string;
  ukazka: string;
}

/** Typografické prohřešky, které jdou rozhodnout bez kontextu. */
export function najdiTypografii(text: string): JazykNalez | null {
  if (text.includes('"')) {
    return { problem: 'rovná uvozovka místo „ a “', ukazka: vyrizni(text, text.indexOf('"')) };
  }
  const tecky = text.indexOf('...');
  if (tecky !== -1) {
    return { problem: 'tři tečky místo výpustky …', ukazka: vyrizni(text, tecky) };
  }
  const dvojita = /\S(  +)\S/.exec(text);
  if (dvojita !== null) {
    return { problem: 'dvojitá mezera', ukazka: vyrizni(text, dvojita.index) };
  }
  if (text !== text.trim()) {
    return { problem: 'mezera na začátku nebo na konci', ukazka: text.slice(0, 40) };
  }
  return null;
}

/** Vykání v textu, který jinde tyká. */
export function najdiVykani(text: string): JazykNalez | null {
  const m = VYKANI.exec(text);
  if (m === null) return null;
  return { problem: `vykání „${m[0]}“ v textu, který jinde tyká`, ukazka: vyrizni(text, m.index) };
}

function vyrizni(text: string, index: number): string {
  return text.slice(Math.max(0, index - 40), index + 45).trim();
}
