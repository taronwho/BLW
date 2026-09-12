import type { IronForm, NutrientLevel } from '@/data/nutrients';

/** Popisky úrovní, jak je vidí rodič — stejné v náhledu i v detailu. */
export const LEVEL_LABELS: Record<NutrientLevel, string> = {
  vyznamny: 'významný zdroj',
  obsahuje: 'obsahuje',
  nevyznamny: 'není zdroj',
};

/** Tři tečky jako stupnice — čitelné i bez barvy. */
export const LEVEL_DOTS: Record<NutrientLevel, string> = {
  vyznamny: '●●●',
  obsahuje: '●●○',
  nevyznamny: '●○○',
};

export const LEVEL_CHIP: Record<NutrientLevel, string> = {
  vyznamny: 'border-safe/40 bg-safe-soft text-safe',
  obsahuje: 'border-line bg-paper text-ink',
  nevyznamny: 'border-line bg-paper text-muted',
};

export const IRON_FORM_LABELS: Record<IronForm, string> = {
  hemove: 'hemové železo z masa a ryb',
  nehemove: 'nehemové železo z rostlin',
  zadne: 'bez významného obsahu železa',
};
