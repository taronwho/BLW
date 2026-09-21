import { dnesIso, rozeberIsoDatum } from '@/text/datum';
import type {
  AllergenGroup,
  GuideCategory,
  Hazard,
  IngredientCategory,
  RecipeCategory,
  TastingAmount,
  TastingReaction,
} from '@/types';

/** České popisky číselníků. Jedno místo, ať se v UI neliší obrazovka od obrazovky. */

export const CATEGORY_LABELS: Record<IngredientCategory, string> = {
  zelenina: 'Zelenina',
  ovoce: 'Ovoce',
  obiloviny: 'Obiloviny',
  'maso-ryby': 'Maso a ryby',
  lusteniny: 'Luštěniny',
  'mlecne-vejce': 'Mléčné a vejce',
  'orechy-seminka-tuky': 'Ořechy, semínka, tuky',
  'bylinky-koreni': 'Bylinky a koření',
  ostatni: 'Ostatní',
};

export const RECIPE_CATEGORY_LABELS: Record<RecipeCategory, string> = {
  snidane: 'Snídaně',
  'obed-vecere': 'Oběd a večeře',
  polevky: 'Polévky',
  'svaciny-peceni': 'Svačiny a pečení',
};

export const GUIDE_CATEGORY_LABELS: Record<GuideCategory, string> = {
  bezpecnost: 'Bezpečnost',
  vyziva: 'Výživa',
  zacatek: 'Začínáme',
  praxe: 'Praxe',
};

export const ALLERGEN_LABELS: Record<AllergenGroup, string> = {
  vejce: 'vejce',
  arasidy: 'arašídy',
  mleko: 'mléko',
  orechy: 'ořechy',
  'psenice-lepek': 'pšenice a lepek',
  soja: 'sója',
  ryby: 'ryby',
  sezam: 'sezam',
  korysi: 'korýši',
  mekkysi: 'měkkýši',
  celer: 'celer',
  horcice: 'hořčice',
  lupina: 'lupina',
  siricitany: 'siřičitany',
};

export const HAZARD_LABELS: Record<Hazard, string> = {
  dusicnany: 'dusičnany',
  rtut: 'rtuť',
  arsen: 'arsen',
  'vitamin-a': 'vitamin A',
  sul: 'sůl',
  botulismus: 'botulismus',
  nepasterizovane: 'nepasterizované',
  syrove: 'syrové',
  kosti: 'kosti',
  cukr: 'cukr',
};

export const AMOUNT_LABELS: Record<TastingAmount, string> = {
  ochutnala: 'ochutnalo',
  'snedla-cast': 'snědlo část',
  'snedla-vse': 'snědlo vše',
  odmitla: 'odmítlo',
};

export const REACTION_LABELS: Record<TastingReaction, string> = {
  zadna: 'bez reakce',
  chutnalo: 'chutnalo',
  nelibilo: 'nelíbilo se',
  kozni: 'kožní reakce',
  travici: 'trávicí potíže',
  jina: 'jiná reakce',
};

export const MONTH_LABELS: readonly string[] = [
  'leden',
  'únor',
  'březen',
  'duben',
  'květen',
  'červen',
  'červenec',
  'srpen',
  'září',
  'říjen',
  'listopad',
  'prosinec',
];

/** "červen–září" místo výpisu dvanácti čísel. */
export function formatSeason(months: readonly number[]): string {
  if (months.length === 0 || months.length === 12) return 'celoročně';
  const sorted = [...months].sort((a, b) => a - b);
  const names = sorted.map((m) => MONTH_LABELS[m - 1] ?? String(m));
  const isRun = sorted.every((m, index) => index === 0 || m === (sorted[index - 1] ?? 0) + 1);
  if (isRun && sorted.length > 2) {
    return `${names[0] ?? ''}–${names[names.length - 1] ?? ''}`;
  }
  return names.join(', ');
}

/**
 * Datum ve tvaru 12. 9. 2026.
 *
 * Bez `Date`: `new Date('2026-03-01')` je UTC půlnoc a čtení přes
 * `getDate()` v místním čase by západně od Greenwiche ukázalo o den míň
 * (audit 17. 9. 2026, nález 5.2). Datum ochutnávky je den v kalendáři,
 * ne okamžik.
 */
export function formatDate(iso: string): string {
  const datum = rozeberIsoDatum(iso);
  if (datum === null) return iso;
  return `${datum.den}. ${datum.mesic}. ${datum.rok}`;
}

export function todayIso(now: Date = new Date()): string {
  return dnesIso(now);
}
