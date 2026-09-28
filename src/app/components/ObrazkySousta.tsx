import type { ReactNode } from 'react';
import type { Grip } from '@/types';
import { obrazekSousta } from '../lib/obrazkySousta';
import type { KlicObrazku } from '../lib/obrazkySousta';

/**
 * Obrázky k průvodci tvarem sousta.
 *
 * Přednost má obrázek ze souboru (`lib/obrazkySousta.ts`). Bez něj se jídlo
 * nakreslí jednoduše v SVG; ruce ne — kreslená ruka z obdélníků vypadá
 * spíš jako rukavice nebo gesto a rodiče mate víc, než pomáhá.
 *
 * Obrázek je vždycky jen ilustrace k textu, který stojí vedle něj. Popis
 * pro čtečku obrazovky nese `aria-label`, takže nevidomý rodič dostane
 * stejnou informaci.
 */

const TAH = 'stroke-ink/70';
/*
 * Barvy jídla, které se poznají jen podle barvy (mrkev, slupka banánu),
 * jsou pevné: oranžová mrkev je oranžová i v tmavém motivu. Tokeny se
 * na ně nehodí — `caution` je v tmavém motivu hnědá.
 */
const MRKEV = 'fill-[#e67e22]';
const SLUPKA = 'fill-[#f2c94c]';
/** Světlá dužina jablka a banánu, v obou motivech stejná. */
const DUZINA = 'fill-[#fbf1d9]';

function Platno({
  popis,
  children,
  vyska = 90,
}: {
  popis: string;
  children: ReactNode;
  vyska?: number;
}): ReactNode {
  return (
    <svg
      viewBox={`0 0 120 ${vyska}`}
      role="img"
      aria-label={popis}
      className="h-auto w-full"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

/** Pára nad jídlem: uvařené, dušené doměkka. */
function Para({ x, y }: { x: number; y: number }): ReactNode {
  return (
    <g className="fill-none stroke-muted" strokeWidth={1.5}>
      <path d={`M${x} ${y} q-4 -5 0 -10 q4 -5 0 -10`} />
      <path d={`M${x + 10} ${y} q-4 -5 0 -10 q4 -5 0 -10`} />
    </g>
  );
}

/** Obrázek ze souboru s popisem pro čtečku; `null`, když soubor chybí. */
function Soubor({ klic, popis }: { klic: KlicObrazku; popis: string }): ReactNode {
  const src = obrazekSousta(klic);
  if (src === undefined) return null;
  return (
    <img
      src={src}
      alt={popis}
      loading="lazy"
      decoding="async"
      className="aspect-[4/3] h-auto w-full rounded-lg object-cover"
    />
  );
}

/* ------------------------------------------------------------------ úchopy */

const POPIS_UCHOPU: Record<Grip, string> = {
  dlanovy: 'Dlaňový úchop: hranolek jídla sevřený v celé pěsti, konec čouhá ven',
  nuzkovy: 'Nůžkový úchop: kousek jídla přitisknutý palcem k boku ukazováku',
  pinzetovy: 'Pinzetový úchop: drobný kousek sevřený mezi bříškem palce a bříškem ukazováku',
};

/** Fotka nebo ilustrace ruky; bez souboru nic. */
export function ObrazekUchopu({ grip }: { grip: Grip }): ReactNode {
  return <Soubor klic={`uchop-${grip}`} popis={POPIS_UCHOPU[grip]} />;
}

export function ObrazekMekkosti(): ReactNode {
  return (
    <Soubor
      klic="mekkost"
      popis="Kousek uvařené zeleniny rozmáčknutý mezi palcem a ukazovákem"
    />
  );
}

const POPIS_TVARU: Record<Grip, string> = {
  dlanovy: 'Hranolky jídla dlouhé zhruba jako dospělý prst',
  nuzkovy: 'Hranolky a k nim větší kousky, které dítě vezme dvěma prsty',
  pinzetovy: 'Malé měkké kousky, které dítě sbírá po jednom mezi palcem a ukazovákem',
};

/** Jaký tvar sousta z úchopu plyne. */
export function ObrazekTvaruProUchop({ grip }: { grip: Grip }): ReactNode {
  if (obrazekSousta(`tvar-${grip}`) !== undefined) {
    return <Soubor klic={`tvar-${grip}`} popis={POPIS_TVARU[grip]} />;
  }
  if (grip === 'dlanovy') {
    return (
      <Platno popis={POPIS_TVARU.dlanovy}>
        <rect x="8" y="26" width="104" height="18" rx="6" className={`fill-caution ${TAH}`} />
        <rect x="8" y="54" width="104" height="18" rx="6" className={`fill-caution ${TAH}`} />
      </Platno>
    );
  }
  if (grip === 'nuzkovy') {
    return (
      <Platno popis={POPIS_TVARU.nuzkovy}>
        <rect x="8" y="16" width="70" height="14" rx="5" className={`fill-caution ${TAH}`} />
        <rect x="8" y="38" width="70" height="14" rx="5" className={`fill-caution ${TAH}`} />
        <rect x="88" y="16" width="20" height="18" rx="4" className={`fill-caution ${TAH}`} />
        <rect x="88" y="44" width="20" height="18" rx="4" className={`fill-caution ${TAH}`} />
        <rect x="40" y="62" width="20" height="18" rx="4" className={`fill-caution ${TAH}`} />
      </Platno>
    );
  }
  return (
    <Platno popis={POPIS_TVARU.pinzetovy}>
      {[
        [20, 30],
        [44, 22],
        [70, 34],
        [96, 24],
        [30, 60],
        [58, 56],
        [86, 62],
      ].map(([x = 0, y = 0]) => (
        <rect key={`${x}-${y}`} x={x - 7} y={y - 7} width="14" height="14" rx="3" className={`fill-caution ${TAH}`} />
      ))}
    </Platno>
  );
}

/* ------------------------------------------------------------------ jídla */

export type DruhObrazku =
  | 'hrozen-cely'
  | 'hrozen-ctvrtky'
  | 'jablko-kostky'
  | 'jablko-cele'
  | 'jablko-mesicek'
  | 'jablko-platek'
  | 'mrkev-kolecka'
  | 'mrkev-hranolek'
  | 'mrkev-kostky'
  | 'arasidy-cele'
  | 'arasidy-mlete'
  | 'maso-kus'
  | 'maso-vlakna'
  | 'maso-kostky'
  | 'brokolice-ruzicka'
  | 'brokolice-kousky'
  | 'banan-drzadlo'
  | 'banan-pulkolecka'
  | 'banan-kostky';

function Kostky({ trida, velikost = 12 }: { trida: string; velikost?: number }): ReactNode {
  return (
    <>
      {[
        [24, 30],
        [50, 24],
        [78, 32],
        [36, 58],
        [66, 60],
        [94, 56],
      ].map(([x = 0, y = 0]) => (
        <rect
          key={`${x}-${y}`}
          x={x - velikost / 2}
          y={y - velikost / 2}
          width={velikost}
          height={velikost}
          rx="2.5"
          className={`${trida} ${TAH}`}
        />
      ))}
    </>
  );
}

/** Čtvrtka kulatého plodu rozkrojeného podélně: úzký půlovál. */
function Ctvrtka({ x, y, otoceni }: { x: number; y: number; otoceni: number }): ReactNode {
  return (
    <path
      d="M0 -17 A7 17 0 0 1 0 17 Z"
      transform={`translate(${x} ${y}) rotate(${otoceni})`}
      className={`fill-safe ${TAH}`}
    />
  );
}

function Arasid({ x, y }: { x: number; y: number }): ReactNode {
  return (
    <g transform={`translate(${x} ${y})`} className={`fill-caution ${TAH}`}>
      <circle cx="-7" cy="0" r="9" />
      <circle cx="7" cy="0" r="9" />
      <rect x="-8" y="-6" width="16" height="12" className={`fill-caution stroke-none`} />
    </g>
  );
}

const POPISY: Record<DruhObrazku, string> = {
  'hrozen-cely': 'Celá kulička hroznu',
  'hrozen-ctvrtky': 'Hrozen rozkrojený podélně na čtyři úzké čtvrtky',
  'jablko-kostky': 'Malé tvrdé kostky syrového jablka',
  'jablko-cele': 'Celé syrové jablko',
  'jablko-mesicek': 'Měkký dušený měsíček jablka, ze kterého stoupá pára',
  'jablko-platek': 'Tenký plátek jablka bez slupky',
  'mrkev-kolecka': 'Kolečka syrové mrkve',
  'mrkev-hranolek': 'Vařený mrkvový hranolek tlustý jako prst',
  'mrkev-kostky': 'Vařená mrkev nakrájená na kostky',
  'arasidy-cele': 'Celé arašídy',
  'arasidy-mlete': 'Miska kaše posypaná mletými arašídy',
  'maso-kus': 'Tuhý kus krátce opečeného masa',
  'maso-vlakna': 'Dlouho dušené maso rozebrané na dlouhá vlákna',
  'maso-kostky': 'Dušené maso nakrájené na malé kostky',
  'brokolice-ruzicka': 'Vařená růžička brokolice se stopkou jako držadlem',
  'brokolice-kousky': 'Vařená brokolice nakrájená na menší kousky',
  'banan-drzadlo': 'Banán oloupaný jen nahoře, spodek ve slupce jako držadlo',
  'banan-pulkolecka': 'Banánová kolečka rozpůlená na půlměsíčky',
  'banan-kostky': 'Banán nakrájený na kostky',
};

export function ObrazekJidla({ obrazek }: { obrazek: DruhObrazku }): ReactNode {
  const popis = POPISY[obrazek];
  if (obrazekSousta(`jidlo-${obrazek}`) !== undefined) {
    return <Soubor klic={`jidlo-${obrazek}`} popis={popis} />;
  }
  switch (obrazek) {
    case 'hrozen-cely':
      return (
        <Platno popis={popis}>
          <ellipse cx="60" cy="45" rx="15" ry="20" className={`fill-safe ${TAH}`} />
          <path d="M60 25 v-8" className={`fill-none ${TAH}`} />
          <ellipse cx="54" cy="38" rx="3" ry="5" className="fill-paper/60 stroke-none" />
        </Platno>
      );
    case 'hrozen-ctvrtky':
      return (
        <Platno popis={popis}>
          <Ctvrtka x={30} y={45} otoceni={0} />
          <Ctvrtka x={52} y={45} otoceni={180} />
          <Ctvrtka x={72} y={45} otoceni={0} />
          <Ctvrtka x={94} y={45} otoceni={180} />
        </Platno>
      );
    case 'jablko-kostky':
      return (
        <Platno popis={popis}>
          <Kostky trida={DUZINA} velikost={11} />
        </Platno>
      );
    case 'jablko-cele':
      return (
        <Platno popis={popis}>
          <path
            d="M60 28 C44 18 26 28 28 50 C30 72 46 82 60 76 C74 82 90 72 92 50 C94 28 76 18 60 28 Z"
            className={`fill-risk/60 ${TAH}`}
          />
          <path d="M60 28 q2 -10 6 -14" className={`fill-none ${TAH}`} />
          <path d="M64 18 q12 -8 20 0 q-10 8 -20 0 Z" className={`fill-safe ${TAH}`} />
        </Platno>
      );
    case 'jablko-mesicek':
      return (
        <Platno popis={popis}>
          <path d="M14 62 Q56 12 106 52 Q58 40 14 62 Z" className={`${DUZINA} ${TAH}`} />
          <Para x={52} y={30} />
        </Platno>
      );
    case 'jablko-platek':
      return (
        <Platno popis={popis}>
          <path d="M14 60 Q58 28 106 52 Q58 46 14 60 Z" className={`${DUZINA} ${TAH}`} />
        </Platno>
      );
    case 'mrkev-kolecka':
      return (
        <Platno popis={popis}>
          {[
            [30, 32],
            [62, 30],
            [92, 36],
            [44, 62],
            [78, 62],
          ].map(([x = 0, y = 0]) => (
            <g key={`${x}-${y}`}>
              <circle cx={x} cy={y} r="11" className={`${MRKEV} ${TAH}`} />
              <circle cx={x} cy={y} r="4" className="fill-none stroke-ink/40" strokeWidth={1.5} />
            </g>
          ))}
        </Platno>
      );
    case 'mrkev-hranolek':
      return (
        <Platno popis={popis}>
          <rect x="14" y="44" width="92" height="16" rx="5" className={`${MRKEV} ${TAH}`} />
          <Para x={52} y={36} />
        </Platno>
      );
    case 'mrkev-kostky':
      return (
        <Platno popis={popis}>
          <Kostky trida={MRKEV} />
        </Platno>
      );
    case 'arasidy-cele':
      return (
        <Platno popis={popis}>
          <Arasid x={34} y={32} />
          <Arasid x={82} y={38} />
          <Arasid x={56} y={64} />
        </Platno>
      );
    case 'arasidy-mlete':
      return (
        <Platno popis={popis}>
          <path d="M16 40 h88 q-6 36 -44 36 q-38 0 -44 -36 Z" className={`fill-surface ${TAH}`} />
          <ellipse cx="60" cy="40" rx="44" ry="8" className={`fill-caution-soft ${TAH}`} />
          {[30, 42, 54, 66, 78, 90, 48, 72].map((x, i) => (
            <circle key={x} cx={x} cy={i < 6 ? 39 : 43} r="1.6" className="fill-caution stroke-none" />
          ))}
        </Platno>
      );
    case 'maso-kus':
      return (
        <Platno popis={popis}>
          <rect x="30" y="26" width="60" height="40" rx="10" className={`fill-risk/70 ${TAH}`} />
          <path d="M42 36 l8 20 M58 34 l8 20 M74 36 l6 14" className="fill-none stroke-ink/50" />
        </Platno>
      );
    case 'maso-vlakna':
      return (
        <Platno popis={popis}>
          {[26, 40, 54, 68].map((y) => (
            <path
              key={y}
              d={`M12 ${y} q12 -6 24 0 t24 0 t24 0 t24 0`}
              className="fill-none stroke-risk/70"
              strokeWidth={6}
            />
          ))}
        </Platno>
      );
    case 'maso-kostky':
      return (
        <Platno popis={popis}>
          <Kostky trida="fill-risk/70" velikost={10} />
        </Platno>
      );
    case 'brokolice-ruzicka':
      return (
        <Platno popis={popis}>
          <rect x="54" y="42" width="12" height="40" rx="5" className={`fill-safe/70 ${TAH}`} />
          <g className={`fill-safe ${TAH}`}>
            <circle cx="46" cy="36" r="13" />
            <circle cx="74" cy="36" r="13" />
            <circle cx="60" cy="24" r="14" />
          </g>
        </Platno>
      );
    case 'brokolice-kousky':
      return (
        <Platno popis={popis}>
          {[
            [28, 34],
            [60, 30],
            [92, 36],
            [44, 64],
            [78, 64],
          ].map(([x = 0, y = 0]) => (
            <g key={`${x}-${y}`}>
              <rect x={x - 3} y={y} width="6" height="12" rx="2" className={`fill-safe/70 ${TAH}`} />
              <circle cx={x} cy={y} r="8" className={`fill-safe ${TAH}`} />
            </g>
          ))}
        </Platno>
      );
    case 'banan-drzadlo':
      return (
        <Platno popis={popis}>
          <path d="M52 12 q-10 30 -2 58 h20 q8 -28 -2 -58 Z" className={`${DUZINA} ${TAH}`} />
          <path d="M46 44 q-10 18 -2 38 h32 q8 -20 -2 -38 l-6 8 l-6 -8 l-6 8 Z" className={`${SLUPKA} ${TAH}`} />
        </Platno>
      );
    case 'banan-pulkolecka':
      return (
        <Platno popis={popis}>
          {[
            [28, 40],
            [60, 34],
            [92, 40],
            [44, 68],
            [78, 68],
          ].map(([x = 0, y = 0]) => (
            <path
              key={`${x}-${y}`}
              d={`M${x - 11} ${y} a11 11 0 0 1 22 0 Z`}
              className={`${DUZINA} ${TAH}`}
            />
          ))}
        </Platno>
      );
    case 'banan-kostky':
      return (
        <Platno popis={popis}>
          <Kostky trida={DUZINA} />
        </Platno>
      );
  }
}
