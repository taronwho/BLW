import type { ChokingRisk, Grip, ServingForm, Stage } from '@/types';

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
    'Dítě předmět přitiskne ke dlani a obalí ho prsty i palcem tak, že celý zmizí v pěsti. Pěst se přitom cíleně neotevře a nepustí jen část obsahu.',
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
    'Dlouhé proužky ztrácejí smysl. Dítě si umí vzít malé kousky a obvykle jim dává přednost. Velikost pořád hlídej podle rizika dušení, ne podle toho, co dítě zvedne.',
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

const STAGE_ORDER: Record<Stage, number> = { '6m': 0, '9m': 1, '12m': 2 };

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
    'Ruka je napřed proti věku. To je běžné a nic to nemění na tom, co dítě smí dostat. Tvar sousta uprav podle úchopu, výběr a měkkost dál podle fáze.',
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

/**
 * Tvar sousta u drobné suroviny. Proužek z ředkvičky ani z hrášku neukrojíš,
 * takže se neřeší délka, ale jestli to dítě vůbec zvedne — a u kulatých kusů
 * pořád platí rozčtvrcení podle pokynu k bezpečnosti.
 */
const GRIP_SHAPE_DROBNE: Record<Grip, string> = {
  dlanovy:
    'Tahle surovina je sama o sobě menší než dětská pěst, takže se na proužky nekrájí. Dlaňový úchop si s ní zatím neporadí: nabídni ji rozmačkanou, vmíchanou do kaše nebo nalepenou na proužek něčeho většího, po čem dítě sáhne.',
  nuzkovy:
    'Na proužky se nekrájí: je drobná sama o sobě. Dítě, které už bere kousky mezi palec a bok ukazováku, ji z tácku sebere, ale ještě mu to nepůjde vždycky. Část nabídni volně, část vmíchanou do jídla, ať se nají tak jako tak.',
  pinzetovy:
    'Tohle je přesně velikost pro pinzetový úchop: dítě si ji z tácku sebere po jednom kousku. Délka proužku se tu neřeší, hlídej jen tvar podle pokynu k bezpečnosti výš.',
};

/**
 * Tvar sousta u kaše a pomazánky. Nakrájet se nedá nic, řeší se nosič:
 * naložená lžíce, nebo hustá vrstva na proužku, kterého se dítě chytne.
 */
const GRIP_SHAPE_KASOVITE: Record<Grip, string> = {
  dlanovy:
    'Krájet tu není co. Dej dítěti naloženou lžíci do ruky, nebo nanes hustou vrstvu na proužek dlouhý jako dospělý prst. Na měkký chleba, na vařenou mrkev: aby konec čouhal z pěsti.',
  nuzkovy:
    'Krájet tu není co. Dítě už lžíci uchopí líp a zvládne i kratší nosiče: proužek pečiva, kousek dušené zeleniny s nanesenou vrstvou.',
  pinzetovy:
    'Krájet tu není co. Dítě už jí lžící samo a nosič si vezme i malý. Hustší směs drží na lžíci líp než řídká, takže jí projde kolem pusy víc.',
};

/**
 * Věta o tvaru sousta pro konkrétní surovinu a úchop.
 *
 * Podoba na talíři rozhoduje dřív než úchop: u kaše ani u ředkvičky nemá
 * délka proužku smysl a rada, která tam nesedí, učí rodiče panel přeskakovat.
 */
export function gripShapeAdvice(grip: Grip, risk: ChokingRisk, form: ServingForm): string {
  if (grip === 'pinzetovy' && risk === 'high') {
    return 'Dítě už drobný kousek zvedne, ale u téhle suroviny to nic nemění: velikost a tvar drž podle pokynu pro bezpečnost výš, ne podle toho, co ruka dokáže sebrat.';
  }
  if (form === 'kasovite') return GRIP_SHAPE_KASOVITE[grip];
  if (form === 'drobne') return GRIP_SHAPE_DROBNE[grip];
  return GRIP_SHAPE[grip];
}

/**
 * Má se panel o tvaru sousta vůbec ukázat?
 *
 * U nápoje, oleje, koření nebo sladidla žádné sousto nevzniká, takže by
 * panel jen zabíral místo a mátl.
 */
export function gripAdviceApplies(form: ServingForm): boolean {
  return form !== 'neresi';
}
