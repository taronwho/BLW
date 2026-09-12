import type { AllergenGroup, Hazard, IngredientCategory, RecipeCategory, TastingAmount, TastingReaction } from '@/types';

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
  ochutnala: 'ochutnala',
  'snedla-cast': 'snědla část',
  'snedla-vse': 'snědla vše',
  odmitla: 'odmítla',
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

/** Datum ve tvaru 12. 9. 2026. */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
}

export function todayIso(now: Date = new Date()): string {
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}
