import { cislo, tvarPodlePoctu, type Tvary as SdileneTvary } from '@/text/sklonovani';

/**
 * Počítání množství pro nákupní seznam.
 *
 * Kuchařka píše množství tak, jak se čte u sporáku: „150 g", „2 lžíce",
 * „půl plodu", „špetka". Nákupní seznam z nich potřebuje jedno číslo, aby
 * rodič u regálu věděl, kolik toho vzít, když se surovina opakuje v pěti
 * receptech.
 *
 * Co se rozebrat nedá („na pánev", „kousek velikosti palce"), se nezahazuje
 * ani nehádá: zůstane vypsané tak, jak je. Vymyšlené číslo by bylo horší než
 * žádné, protože podle něj rodič opravdu nakoupí.
 */

/** Rozebrané množství: číslo a jednotka v základním tvaru. */
export interface Mnozstvi {
  hodnota: number;
  jednotka: string;
}

/**
 * Tvary jednotky: [1, 2 až 4, 5 a víc, desetinné číslo].
 *
 * Čeština skloňuje počítaný předmět podle čísla a bez tabulky by seznam
 * hlásil „2 lžic" nebo „5 lžíce". Značky jako „g" nebo „ml" se neskloňují,
 * mají proto všechny tvary stejné.
 */
type Tvary = SdileneTvary;

const JEDNOTKY: Record<string, Tvary> = {
  g: ['g', 'g', 'g', 'g'],
  ml: ['ml', 'ml', 'ml', 'ml'],
  lzice: ['lžíce', 'lžíce', 'lžic', 'lžíce'],
  lzicka: ['lžička', 'lžičky', 'lžiček', 'lžičky'],
  kus: ['kus', 'kusy', 'kusů', 'kusu'],
  hrst: ['hrst', 'hrsti', 'hrstí', 'hrsti'],
  spetka: ['špetka', 'špetky', 'špetek', 'špetky'],
  svazek: ['svazek', 'svazky', 'svazků', 'svazku'],
  strouzek: ['stroužek', 'stroužky', 'stroužků', 'stroužku'],
  snitka: ['snítka', 'snítky', 'snítek', 'snítky'],
  krajic: ['krajíc', 'krajíce', 'krajíců', 'krajíce'],
  list: ['list', 'listy', 'listů', 'listu'],
  hlavka: ['hlávka', 'hlávky', 'hlávek', 'hlávky'],
  hliza: ['hlíza', 'hlízy', 'hlíz', 'hlízy'],
  rapik: ['řapík', 'řapíky', 'řapíků', 'řapíku'],
  stonek: ['stonek', 'stonky', 'stonků', 'stonku'],
  filet: ['filet', 'filety', 'filetů', 'filetu'],
  platek: ['plátek', 'plátky', 'plátků', 'plátku'],
  konzerva: ['konzerva', 'konzervy', 'konzerv', 'konzervy'],
  baleni: ['balení', 'balení', 'balení', 'balení'],
  klas: ['klas', 'klasy', 'klasů', 'klasu'],
  hlavicka: ['hlavička', 'hlavičky', 'hlaviček', 'hlavičky'],
  lusk: ['lusk', 'lusky', 'lusků', 'lusku'],
  plod: ['plod', 'plody', 'plodů', 'plodu'],
  hrbet: ['hřbet', 'hřbety', 'hřbetů', 'hřbetu'],
  ryba: ['ryba', 'ryby', 'ryb', 'ryby'],
  hrozen: ['hrozen', 'hrozny', 'hroznů', 'hroznu'],
  ruzice: ['růžice', 'růžice', 'růžic', 'růžice'],
};

/** Slovo z receptu → jednotka. Klíče jsou bez diakritiky a malými písmeny. */
const SLOVNIK: Record<string, string> = {
  g: 'g',
  gramu: 'g',
  gram: 'g',
  gramy: 'g',
  ml: 'ml',
  lzice: 'lzice',
  lzici: 'lzice',
  lzic: 'lzice',
  lzicka: 'lzicka',
  lzicky: 'lzicka',
  lzicce: 'lzicka',
  lzicek: 'lzicka',
  kus: 'kus',
  kusy: 'kus',
  kusu: 'kus',
  kusum: 'kus',
  hrst: 'hrst',
  hrsti: 'hrst',
  hrstí: 'hrst',
  spetka: 'spetka',
  spetky: 'spetka',
  spetku: 'spetka',
  svazek: 'svazek',
  svazky: 'svazek',
  svazku: 'svazek',
  strouzek: 'strouzek',
  strouzky: 'strouzek',
  strouzku: 'strouzek',
  snitka: 'snitka',
  snitky: 'snitka',
  snitek: 'snitka',
  krajic: 'krajic',
  krajice: 'krajic',
  krajicu: 'krajic',
  list: 'list',
  listy: 'list',
  listu: 'list',
  listku: 'list',
  listek: 'list',
  listky: 'list',
  hlavka: 'hlavka',
  hlavky: 'hlavka',
  hlavek: 'hlavka',
  hliza: 'hliza',
  hlizy: 'hliza',
  rapik: 'rapik',
  rapiky: 'rapik',
  stonek: 'stonek',
  stonky: 'stonek',
  filet: 'filet',
  filety: 'filet',
  filetu: 'filet',
  platek: 'platek',
  platky: 'platek',
  konzerva: 'konzerva',
  konzervy: 'konzerva',
  baleni: 'baleni',
  klas: 'klas',
  klasy: 'klas',
  hlavicka: 'hlavicka',
  hlavicky: 'hlavicka',
  lusk: 'lusk',
  lusky: 'lusk',
  lusku: 'lusk',
  plod: 'plod',
  plody: 'plod',
  plodu: 'plod',
  hrbet: 'hrbet',
  hrbetu: 'hrbet',
  ryba: 'ryba',
  ryby: 'ryba',
  hrozen: 'hrozen',
  hrozny: 'hrozen',
  ruzice: 'ruzice',
  ruzici: 'ruzice',
  cast: 'kus',
  casti: 'kus',
};

/** Jednotky, které se na uložení převádějí na menší: 1 kg = 1000 g. */
const NASOBKY: Record<string, { jednotka: string; nasobek: number }> = {
  kg: { jednotka: 'g', nasobek: 1000 },
  kilogram: { jednotka: 'g', nasobek: 1000 },
  kilo: { jednotka: 'g', nasobek: 1000 },
  dkg: { jednotka: 'g', nasobek: 10 },
  l: { jednotka: 'ml', nasobek: 1000 },
  litr: { jednotka: 'ml', nasobek: 1000 },
  litru: { jednotka: 'ml', nasobek: 1000 },
  dl: { jednotka: 'ml', nasobek: 100 },
};

/** Číslovky psané slovem. */
const CISLOVKY: Record<string, number> = {
  pul: 0.5,
  pulka: 0.5,
  pulky: 0.5,
  polovina: 0.5,
  poloviny: 0.5,
  ctvrt: 0.25,
  ctvrtka: 0.25,
  ctvrtiny: 0.25,
  tretina: 1 / 3,
  tretiny: 1 / 3,
  jedna: 1,
  jeden: 1,
  jedno: 1,
  dve: 2,
  dva: 2,
  tri: 3,
  ctyri: 4,
};

/**
 * Přívlastky, které jednotku neurčují, ale stojí před ní.
 *
 * „2 zralé banány" i „6 středních mrkví" počítají kusy; kdyby se hledala
 * jednotka jen na prvním slově za číslem, spadly by tyhle zápisy mezi
 * nerozebratelné a seznam by je vypsal po jednom.
 */
const PRIVLASTKY = new Set([
  'velky', 'velka', 'velke', 'velkych', 'velkou',
  'maly', 'mala', 'male', 'malych',
  'mensi', 'vetsi', 'stredni', 'strednich',
  'zraly', 'zrala', 'zrale', 'zralych',
  'cerstvy', 'cerstva', 'cerstve', 'cerstvych',
  'sladka', 'sladke', 'sladky',
  'kyselejsi', 'cely', 'cela', 'cele', 'celou',
  'mrazenych', 'mrazene', 'susene', 'susenych',
  'uvarene', 'uvarenych', 'mlete', 'mleteho', 'mleta',
  'hrbetni', 'plnotucne', 'bileho', 'velmi',
]);

function bezDiakritiky(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

/**
 * Rozebere jeden zápis množství z kuchařky.
 *
 * Vrací `null` u všeho, co se rozebrat nedá — takový zápis se v seznamu
 * ukáže tak, jak je napsaný v receptu.
 */
export function rozeberMnozstvi(text: string): Mnozstvi | null {
  const slova = bezDiakritiky(text).replace(/,(\d)/g, '.$1').split(/[\s]+/).filter((s) => s.length > 0);
  if (slova.length === 0) return null;

  let hodnota: number | null = null;
  let index = 0;
  const prvni = slova[0] ?? '';
  if (/^\d+(\.\d+)?$/.test(prvni)) {
    hodnota = Number(prvni);
    index = 1;
  } else if (CISLOVKY[prvni] !== undefined) {
    hodnota = CISLOVKY[prvni] ?? null;
    index = 1;
  }

  // Zápis bez čísla („špetka", „hrst") znamená jeden kus té míry.
  if (hodnota === null) hodnota = 1;
  if (!Number.isFinite(hodnota) || hodnota <= 0) return null;

  for (let i = index; i < slova.length; i += 1) {
    const slovo = (slova[i] ?? '').replace(/[.,;:]$/, '');
    const nasobek = NASOBKY[slovo];
    if (nasobek !== undefined) {
      return { hodnota: hodnota * nasobek.nasobek, jednotka: nasobek.jednotka };
    }
    const jednotka = SLOVNIK[slovo];
    if (jednotka !== undefined) return { hodnota, jednotka };
    if (PRIVLASTKY.has(slovo)) continue;
    // Neznámé podstatné jméno hned za číslem: „2 klasy" jednotku mají,
    // „šťáva z půlky" ne. Rozhoduje slovník, ne odhad.
    return null;
  }

  // Samotné číslo s přívlastkem („2 zralé") jsou kusy.
  return index > 0 ? { hodnota, jednotka: 'kus' } : null;
}

/** Tvar jednotky podle počtu: 1 lžíce, 2 lžíce, 5 lžic, 1,5 lžíce. */
function tvar(jednotka: string, hodnota: number): string {
  const tvary = JEDNOTKY[jednotka];
  // Jednotka, kterou slovník nezná, se nechává tak, jak ji napsal recept.
  // Hádat její tvary by znamenalo vyrobit slovo, které v češtině není.
  if (tvary === undefined) return jednotka;
  return tvarPodlePoctu(hodnota, tvary);
}

/** Zapíše množství česky. Velká čísla se převedou zpátky na kila a litry. */
export function popisMnozstvi({ hodnota, jednotka }: Mnozstvi): string {
  if (jednotka === 'g' && hodnota >= 1000) return `${cislo(hodnota / 1000)} kg`;
  if (jednotka === 'ml' && hodnota >= 1000) return `${cislo(hodnota / 1000)} l`;
  return `${cislo(hodnota)} ${tvar(jednotka, hodnota)}`;
}

export interface Soucet {
  /** Sečtená množství, každá jednotka zvlášť. */
  mnozstvi: Mnozstvi[];
  /** Zápisy, které se rozebrat nedaly. Ukazují se tak, jak jsou. */
  zbytek: string[];
}

/**
 * Sečte zápisy množství jedné suroviny.
 *
 * Gramy se sčítají s gramy a lžíce se lžícemi; dohromady se nepřevádějí,
 * protože lžíce mouky a lžíce oleje neváží totéž a odhad by z nákupního
 * seznamu udělal hádanku.
 */
export function sectiMnozstvi(zapisy: readonly string[]): Soucet {
  const soucty = new Map<string, number>();
  const zbytek: string[] = [];
  for (const zapis of zapisy) {
    const rozebrane = rozeberMnozstvi(zapis);
    if (rozebrane === null) {
      const cisty = zapis.trim();
      if (cisty.length > 0 && !zbytek.includes(cisty)) zbytek.push(cisty);
      continue;
    }
    soucty.set(rozebrane.jednotka, (soucty.get(rozebrane.jednotka) ?? 0) + rozebrane.hodnota);
  }
  return {
    mnozstvi: [...soucty].map(([jednotka, hodnota]) => ({ jednotka, hodnota })),
    zbytek,
  };
}

/**
 * Spojí dva už sečtené součty.
 *
 * Potřeba tam, kde se část množství přepočítává a část ne: množství z
 * receptů se násobí počtem dospělých, ale to, co si rodič přidal ručně,
 * zůstává, jak ho napsal.
 */
export function spojSoucty(a: Soucet, b: Soucet): Soucet {
  const soucty = new Map<string, number>();
  for (const { jednotka, hodnota } of [...a.mnozstvi, ...b.mnozstvi]) {
    soucty.set(jednotka, (soucty.get(jednotka) ?? 0) + hodnota);
  }
  const zbytek = [...a.zbytek];
  for (const text of b.zbytek) if (!zbytek.includes(text)) zbytek.push(text);
  return {
    mnozstvi: [...soucty].map(([jednotka, hodnota]) => ({ jednotka, hodnota })),
    zbytek,
  };
}

/** Celé množství na jednu řádku: „450 g + 2 lžíce". */
export function popisSouctu(soucet: Soucet): string {
  return [...soucet.mnozstvi.map(popisMnozstvi), ...soucet.zbytek].join(' + ');
}

/**
 * O kolik se množství posune jedním klepnutím na plus nebo minus.
 *
 * Gramy a mililitry po padesáti: krokovat mouku po gramu by znamenalo
 * držet prst na tlačítku půl minuty. Všechno ostatní po jedné — kusy,
 * lžíce, stroužky ani svazky se na půlky nekupují.
 */
export function krokMnozstvi(jednotka: string): number {
  return jednotka === 'g' || jednotka === 'ml' ? 50 : 1;
}

/**
 * Množství o krok nahoru (`1`) nebo dolů (`-1`).
 *
 * Vrací `null`, když není co krokovat: buď se zápis rozebrat nedá
 * („balíček", „na pánev"), nebo by se šlo na nulu a níž. Odebrat položku
 * je jiná akce a má vlastní tlačítko, takže nula tady nedává smysl.
 *
 * Hodnota mimo krok se nejdřív zarovná: z „120 g" udělá plus „150 g",
 * ne „170 g". Jinak by se po pár klepnutích dostal rodič k číslům jako
 * „370 g", která v obchodě neodpovídají ničemu.
 */
export function zmenMnozstvi(text: string, smer: 1 | -1): string | null {
  const rozebrane = rozeberMnozstvi(text);
  if (rozebrane === null) return null;
  const krok = krokMnozstvi(rozebrane.jednotka);
  const navrh =
    smer > 0
      ? Math.floor(rozebrane.hodnota / krok) * krok + krok
      : Math.ceil(rozebrane.hodnota / krok) * krok - krok;
  const zaokrouhlene = Math.round(navrh * 100) / 100;
  if (zaokrouhlene <= 0) return null;
  return popisMnozstvi({ hodnota: zaokrouhlene, jednotka: rozebrane.jednotka });
}
