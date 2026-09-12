/**
 * Datový model podle docs/SPEC.md kapitola 2.
 * Typy jsou zdrojem pravdy — data se proti nim validují.
 */

export type Stage = '6m' | '9m' | '12m';
export const STAGES: readonly Stage[] = ['6m', '9m', '12m'] as const;

export type ChokingRisk = 'low' | 'medium' | 'high';
export type ReviewStatus = 'verified' | 'needs-review';

export type IngredientCategory =
  | 'zelenina'
  | 'ovoce'
  | 'obiloviny'
  | 'maso-ryby'
  | 'lusteniny'
  | 'mlecne-vejce'
  | 'orechy-seminka-tuky'
  | 'bylinky-koreni'
  | 'ostatni';

export const INGREDIENT_CATEGORIES: readonly IngredientCategory[] = [
  'zelenina',
  'ovoce',
  'obiloviny',
  'maso-ryby',
  'lusteniny',
  'mlecne-vejce',
  'orechy-seminka-tuky',
  'bylinky-koreni',
  'ostatni',
] as const;

/** 9 alergenů klíčových pro zavádění + zbytek ze 14 povinně značených v EU */
export type AllergenGroup =
  | 'vejce'
  | 'arasidy'
  | 'mleko'
  | 'orechy'
  | 'psenice-lepek'
  | 'soja'
  | 'ryby'
  | 'sezam'
  | 'korysi'
  | 'mekkysi'
  | 'celer'
  | 'horcice'
  | 'lupina'
  | 'siricitany';

/** 9 alergenů, u kterých aplikace sleduje plánované zavádění (docs/BEZPECNOST.md kap. 4) */
export const KEY_ALLERGENS: readonly AllergenGroup[] = [
  'vejce',
  'arasidy',
  'mleko',
  'orechy',
  'psenice-lepek',
  'soja',
  'ryby',
  'sezam',
  'korysi',
] as const;

export type Hazard =
  | 'dusicnany'
  | 'rtut'
  | 'arsen'
  | 'vitamin-a'
  | 'sul'
  | 'botulismus'
  | 'nepasterizovane'
  | 'syrove'
  | 'kosti'
  | 'cukr';

export const HAZARDS: readonly Hazard[] = [
  'dusicnany',
  'rtut',
  'arsen',
  'vitamin-a',
  'sul',
  'botulismus',
  'nepasterizovane',
  'syrove',
  'kosti',
  'cukr',
] as const;

export interface SourceRef {
  /** Krátký název instituce, např. "ESPGHAN" nebo "NHS Start for Life" */
  org: string;
  title: string;
  url: string;
  /** ISO datum, kdy byl odkaz skutečně načten */
  accessedAt: string;
  /** 1 = odborná společnost / úřad, 2 = důvěryhodná odborná publikace */
  tier: 1 | 2;
}

export interface StagePrep {
  /** Jak to nakrájet a servírovat. 2–4 věty, konkrétně, česky. */
  serving: string;
  /** Na co si dát pozor právě v této fázi. Prázdné jen pokud opravdu nic. */
  caution?: string;
}

export interface Ingredient {
  id: string;
  nameCz: string;
  /** Synonyma pro vyhledávání ("batáty", "sladké brambory") */
  altNamesCz: string[];
  category: IngredientCategory;
  emoji?: string;

  allergens: AllergenGroup[];
  /** Patří mezi 9 klíčových alergenů pro plánované zavádění */
  isKeyAllergen: boolean;
  chokingRisk: ChokingRisk;
  /** Konkrétní důvod rizika, ne obecná fráze. */
  chokingReason?: string;

  /** Strukturovaná rizika — validátor je kontroluje, UI je zobrazuje jako štítky */
  hazards: Hazard[];
  /** Lidsky napsané vysvětlení ke každému hazardu, klíč = hazard */
  hazardNotes: Record<string, string>;

  /** Nejdřívější věk v měsících, kdy se surovina obvykle nabízí */
  minAgeMonths: number;
  /** Pokud existuje horní omezení četnosti, např. játra */
  frequencyLimit?: string;

  prep: Record<Stage, StagePrep>;
  /** 3–4 konkrétní způsoby úpravy: pára, pečení, pyré, syrové... */
  prepIdeas: string[];
  /** Měsíce sezónnosti v ČR, 1–12. Prázdné pole = celoročně. */
  seasonCz: number[];
  /** Vhodné pro vegetariánskou stravu */
  vegetarian: boolean;

  sources: SourceRef[];
  reviewStatus: ReviewStatus;
  reviewNote?: string;
}

export type RecipeCategory = 'snidane' | 'obed-vecere' | 'polevky' | 'svaciny-peceni';

export const RECIPE_CATEGORIES: readonly RecipeCategory[] = [
  'snidane',
  'obed-vecere',
  'polevky',
  'svaciny-peceni',
] as const;

export type DietTrack = 'vegetarian' | 'meat';

export interface RecipeIngredientRef {
  /** Musí existovat v katalogu */
  ingredientId: string;
  /** "150 g", "1 lžíce" */
  amount: string;
  /** Do které linie složka patří. 'all' = společný základ. */
  track: 'all' | DietTrack;
  /** "pro miminko odeber před přidáním" */
  note?: string;
}

export interface Recipe {
  id: string;
  titleCz: string;
  category: RecipeCategory;
  minAgeMonths: number;
  timeMinutes: number;
  /** "2 dospělí + 1 miminko" */
  servings: string;

  ingredients: RecipeIngredientRef[];
  /** Společný postup pro celou rodinu, číslované kroky */
  baseSteps: string[];
  /** Kdy přesně odebrat porci pro miminko — povinné, nesmí být prázdné */
  babySplitPoint: string;
  babySteps: string[];
  /** Jak porci miminku podat v dané fázi */
  babyServing: Record<Stage, string>;
  /** Dokončení masité verze (otec + dítě) */
  meatSteps: string[];
  /** Dokončení bezmasé verze (matka) — vždy vyplněné */
  vegetarianSteps: string[];
  /** Čím se nahrazuje bílkovina v bezmasé verzi. Povinné u receptu s masem/rybou. */
  vegetarianProteinSwap?: string;

  /** Odvozené ze složek, dopočítá validátor */
  allergens: AllergenGroup[];
  /** "bez lepku", "jednohrnec", "do ruky", "mrazitelné" */
  tags: string[];
  /** Technika/bezpečnost, ne samotný recept */
  sources: SourceRef[];
  reviewStatus: ReviewStatus;
}

export type TastingAmount = 'ochutnala' | 'snedla-cast' | 'snedla-vse' | 'odmitla';
export type TastingReaction = 'zadna' | 'chutnalo' | 'nelibilo' | 'kozni' | 'travici' | 'jina';

export interface TastingEvent {
  id: string;
  ingredientId: string;
  /** ISO datum */
  date: string;
  amount: TastingAmount;
  reaction: TastingReaction;
  note?: string;
  /** uid rodiče */
  createdBy: string;
  /** pro řešení konfliktů */
  createdAt: number;
  /**
   * Měkké smazání. Záznam se nemaže z pole, jen se označí — jinak by ho
   * druhé zařízení při slučování vzkřísilo (docs/SPEC.md kap. 7).
   */
  deleted?: boolean;
}

export interface HouseholdState {
  childName: string;
  /** ISO datum */
  childBirthDate: string;
  /** uid členů domácnosti */
  members: string[];
  tastings: TastingEvent[];
  /** ingredientId + recipeId */
  favorites: string[];
  recipeNotes: Record<string, string>;
  schemaVersion: number;
}

/** Katalog, proti kterému běží validační pravidla */
/** Kategorie rady v sekci Rady. */
export type GuideCategory = 'bezpecnost' | 'vyziva' | 'zacatek' | 'praxe';

export const GUIDE_CATEGORIES: readonly GuideCategory[] = [
  'bezpecnost',
  'vyziva',
  'zacatek',
  'praxe',
] as const;

/** Blok textu uvnitř rady. */
export interface GuideSection {
  heading: string;
  /** Odstavce nebo odrážky, každá položka jedna myšlenka. */
  body: string[];
  /** Odrážky se vykreslí jako seznam, jinak jako odstavce. */
  asList?: boolean;
}

/**
 * Rada — souvislý text, který nepatří ke konkrétní surovině ani receptu.
 * Bezpečnostní tvrzení platí stejná pravidla jako u surovin: každá rada má
 * aspoň jeden ověřený zdroj (docs/BEZPECNOST.md kap. 1).
 */
export interface Guide {
  id: string;
  titleCz: string;
  category: GuideCategory;
  /** Jedna věta do seznamu a na dlaždici. */
  summary: string;
  /** Klíčové věty vypíchnuté nad textem. Prázdné pole je v pořádku. */
  keyPoints: string[];
  sections: GuideSection[];
  /** Rada, na kterou se musí dát sáhnout rychle — dostane červený rám a místo na úvodní obrazovce. */
  urgent?: boolean;
  sources: SourceRef[];
  /** Odborná literatura bez URL; doplněk ke `sources`, nenahrazuje je. */
  literature?: string[];
  reviewStatus: ReviewStatus;
}

export interface Catalog {
  ingredients: Ingredient[];
  recipes: Recipe[];
  guides: Guide[];
}
