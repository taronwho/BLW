import type { ChokingRisk, Grip, Stage } from '@/types';

/**
 * Úchop dítěte a tvar sousta.
 *
 * ROZSAH, ať se to nepřehání: úchop rozhoduje o TVARU a VELIKOSTI sousta —
 * o tom, co dítě z tácku vůbec zvedne. Neříká nic o tom, jak měkké jídlo musí
 * být, co už dítě smí a co ne, ani jak dobře žvýká. To se dál řídí věkem
 * (poloha dávicího reflexu se posouvá dozadu v průběhu celého prvního roku) a
 * pravidly v docs/BEZPECNOST.md. Proto úchop nikde nepřepisuje `minAgeMonths`
 * ani fázi krájení — přidává k nim druhou osu.
 *
 * Posloupnost dlaňový → nůžkový → klešťový → pinzetový popsala vývojová
 * psychologie (Gesell, Piaget) dávno před metodou vedenou dítětem; ta ji jen
 * použila jako rozvrh jídelníčku. Věky u jednotlivých úchopů jsou proto
 * orientační, ne podmínka: rodič se řídí tím, co vidí, ne kalendářem.
 */

export const GRIP_LABELS: Record<Grip, string> = {
  dlanovy: 'dlaňový',
  nuzkovy: 'nůžkový a klešťový',
  pinzetovy: 'pinzetový',
};

/** Krátký popisek do dlaždic a hlavičky. */
export const GRIP_SHORT: Record<Grip, string> = {
  dlanovy: 'celou dlaní',
  nuzkovy: 'palcem o bok ukazováku',
  pinzetovy: 'palcem a ukazovákem',
};

/** Podle čeho rodič úchop pozná — pozorovatelné, ne odvozené z věku. */
export const GRIP_HOW_TO_TELL: Record<Grip, string> = {
  dlanovy:
    'Dítě předmět přitiskne ke dlani a obalí ho prsty i palcem tak, že celý zmizí v pěsti. Pěst neumí otevřít cíleně a neumí pustit jen část obsahu.',
  nuzkovy:
    'Dlaňový úchop se začíná rozpadat: dítě přitiskne kousek mezi palec a bok ukazováku, později mezi palec a ohnutý ukazovák. Menší sousta už zvedne, ale nejistě.',
  pinzetovy:
    'Dítě sevře kousek mezi bříškem palce a bříškem ukazováku. Pozná se to nejlíp na tom, že zvedne z tácku hrášek, kousek těstoviny nebo drobek.',
};

/** Jaký tvar sousta z úchopu plyne. */
export const GRIP_SHAPE: Record<Grip, string> = {
  dlanovy:
    'Krájej na proužky dlouhé zhruba jako dospělý prst, aby konec čouhal z pěsti. Cokoli menšího než dětská pěst zmizí v dlani a dítě se k tomu už nedostane.',
  nuzkovy:
    'Proužky pořád dávají smysl, ale k nim už můžeš přidat i větší kousky na uchopení dvěma prsty. Dítě si samo vybere, co mu jde.',
  pinzetovy:
    'Dlouhé proužky ztrácejí smysl — dítě si umí vzít malé kousky a obvykle jim dává přednost. Velikost pořád hlídej podle rizika dušení, ne podle toho, co dítě zvedne.',
};

/** Orientační věk, kdy se úchop objevuje. Není to podmínka ani cíl. */
export const GRIP_TYPICAL_MONTHS: Record<Grip, string> = {
  dlanovy: 'zhruba od 6 měsíců',
  nuzkovy: 'obvykle mezi 8. a 10. měsícem',
  pinzetovy: 'u většiny dětí mezi 9. a 12. měsícem',
};

/**
 * Fáze, ke které úchop orientačně patří.
 *
 * Používá se JEN k pojmenování rozporu („dítě má pinzetový úchop dřív, než
 * odpovídá jeho věku"), nikdy k předvýběru fáze krájení — ta zůstává na věku,
 * protože měkkost a výběr potravin na úchopu nezávisí.
 */
export const GRIP_STAGE: Record<Grip, Stage> = {
  dlanovy: '6m',
  nuzkovy: '9m',
  pinzetovy: '12m',
};

export const STAGE_ORDER: Record<Stage, number> = { '6m': 0, '9m': 1, '12m': 2 };

/** Úchop, který se u daného věku dá čekat — jen jako výchozí nabídka. */
export function gripForAge(months: number | null): Grip {
  if (months === null) return 'dlanovy';
  if (months >= 12) return 'pinzetovy';
  if (months >= 8) return 'nuzkovy';
  return 'dlanovy';
}

export type GripVsAge = 'shoda' | 'napred' | 'pozadu';

/**
 * Jak pozorovaný úchop vychází proti věku. Slouží k formulaci věty pro rodiče,
 * ne k žádnému rozhodnutí o bezpečnosti.
 */
export function gripVsAge(grip: Grip, months: number | null): GripVsAge {
  if (months === null) return 'shoda';
  const ocekavany = gripForAge(months);
  const rozdil = STAGE_ORDER[GRIP_STAGE[grip]] - STAGE_ORDER[GRIP_STAGE[ocekavany]];
  if (rozdil > 0) return 'napred';
  if (rozdil < 0) return 'pozadu';
  return 'shoda';
}

export const GRIP_VS_AGE_NOTE: Record<GripVsAge, string | null> = {
  shoda: null,
  napred:
    'Ruka je napřed proti věku — to je běžné a nic to nemění na tom, co dítě smí dostat. Tvar sousta uprav podle úchopu, výběr a měkkost dál podle fáze.',
  pozadu:
    'Ruka je zatím pozadu proti věku, což je taky běžné. Nabízej tvar, který dítě opravdu zvedne; nic se tím nezdržuje.',
};

/**
 * Smí se u téhle suroviny říct „už můžeš nabízet malé kousky"?
 *
 * U surovin s vysokým rizikem dušení ne. Pinzetový úchop znamená, že dítě
 * drobný kousek zvedne — ne že ho bezpečně zpracuje. Právě potraviny, které
 * se do dýchacích cest vejdou celé (hrozny, borůvky, cherry rajčata, ořechy),
 * jsou nebezpečné bez ohledu na to, jak zručná je ruka.
 */
export function smallPiecesAllowed(grip: Grip, risk: ChokingRisk): boolean {
  return grip === 'pinzetovy' && risk !== 'high';
}

/** Věta o tvaru sousta pro konkrétní surovinu a úchop. */
export function gripShapeAdvice(grip: Grip, risk: ChokingRisk): string {
  if (grip === 'pinzetovy' && risk === 'high') {
    return 'Dítě už drobný kousek zvedne, ale u téhle suroviny to nic nemění: velikost a tvar drž podle pokynu pro bezpečnost výš, ne podle toho, co ruka dokáže sebrat.';
  }
  return GRIP_SHAPE[grip];
}
