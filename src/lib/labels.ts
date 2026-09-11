import type { AllergenGroup, Hazard, IngredientCategory, RecipeCategory } from '@/types';
import type { TastingAmount, TastingReaction } from '@/types';

/** Popisky pro UI. V datech jsou slugy, na obrazovce musí být čeština. */

export const ALLERGEN_LABELS: Record<AllergenGroup, string> = {
  vejce: 'Vejce',
  arasidy: 'Arašídy',
  mleko: 'Mléko',
  orechy: 'Ořechy',
  'psenice-lepek': 'Pšenice (lepek)',
  soja: 'Sója',
  ryby: 'Ryby',
  sezam: 'Sezam',
  korysi: 'Korýši',
  mekkysi: 'Měkkýši',
  celer: 'Celer',
  horcice: 'Hořčice',
  lupina: 'Vlčí bob (lupina)',
  siricitany: 'Siřičitany',
};

export const HAZARD_LABELS: Record<Hazard, string> = {
  dusicnany: 'Dusičnany',
  rtut: 'Rtuť',
  arsen: 'Arsen',
  'vitamin-a': 'Vitamin A',
  sul: 'Sůl',
  botulismus: 'Botulismus',
  nepasterizovane: 'Nepasterizované',
  syrove: 'Syrové',
  kosti: 'Kosti',
  cukr: 'Cukr',
};

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

export const AMOUNT_LABELS: Record<TastingAmount, string> = {
  ochutnala: 'ochutnala',
  'snedla-cast': 'snědla část',
  'snedla-vse': 'snědla vše',
  odmitla: 'odmítla',
};

export const REACTION_LABELS: Record<TastingReaction, string> = {
  zadna: 'bez reakce',
  chutnalo: 'chutnalo',
  nelibilo: 'nelíbilo',
  kozni: 'kožní reakce',
  travici: 'trávicí potíže',
  jina: 'jiná reakce',
};
