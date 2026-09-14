import type { SourceRef } from '@/types';
import { BP_VITAMIN_C, NHS_IRON, NHS_TRACE_MINERALS, NHS_VITAMIN_C } from './ingredients/_sources';
import type { NutrientLevel } from './nutrients';

/**
 * Naměřený obsah živin, když je k dispozici.
 *
 * Zařazení do stupňů (viz src/data/nutrients.ts) stojí na skupinách potravin,
 * protože pro většinu surovin číslo nemáme. Kde ho ale máme z potravinové
 * tabulky, je přesnější než jakákoli skupina — a tahle tabulka ho nese.
 * `nutrientProfile` dá naměřené hodnotě přednost před skupinou.
 *
 * PRAVIDLA ZÁPISU (docs/BEZPECNOST.md kap. 1 a 8):
 *  - hodnota je v miligramech na 100 g jedlého podílu,
 *  - bere se z národní potravinové tabulky, ne z článku ani z blogu,
 *  - zapisuje se jen číslo, které zdroj uvádí jako obsah, ne horní mez
 *    („až 300 mg/100 g" je maximum odrůdy, ne obsah běžné porce),
 *  - ke každé položce patří zdroj a datum, kdy byl načten.
 */
export interface Slozeni {
  /** Miligramy na 100 g jedlého podílu. */
  vitaminC?: number;
  iron?: number;
  zinc?: number;
  zdroj: SourceRef;
  poznamka?: string;
}

/**
 * Denní potřeba dospělého podle NHS.
 *
 * Z každé živiny se bere vyšší z hodnot, které NHS pro dospělé uvádí — práh
 * je tím přísnější. Slouží jen k porovnání potravin mezi sebou, ne k dávkování
 * dítěte; to aplikace nedělá a dělat nebude.
 */
export const DENNI_POTREBA = {
  /** NHS: dospělí 19–64 potřebují 40 mg vitaminu C denně. */
  vitaminC: 40,
  /** NHS: 8,7 mg muži, 14,8 mg ženy 19–49. */
  iron: 14.8,
  /** NHS: 9,5 mg muži, 7 mg ženy. */
  zinc: 9.5,
} as const;

/**
 * Podíl denní potřeby, od kterého se potravina počítá za zdroj živiny.
 *
 * Patnáct procent denní potřeby ve 100 g je hranice, od které se vitamin nebo
 * minerální látka vůbec smí na obalu uvést; „vysoký obsah" je dvojnásobek.
 * Aplikace používá stejnou hranici, aby „obsahuje" a „významný zdroj"
 * znamenaly totéž co na etiketě, a ne něco vymyšleného.
 */
export const PODIL_OBSAHUJE = 0.15;
export const PODIL_VYZNAMNY = 0.3;

export type Zivina = keyof typeof DENNI_POTREBA;

/** Práh v miligramech na 100 g, od kterého živina dosáhne dané úrovně. */
export function prah(zivina: Zivina, uroven: 'obsahuje' | 'vyznamny'): number {
  const podil = uroven === 'vyznamny' ? PODIL_VYZNAMNY : PODIL_OBSAHUJE;
  return DENNI_POTREBA[zivina] * podil;
}

/** Úroveň z naměřené hodnoty. */
export function urovenZObsahu(zivina: Zivina, mg: number): NutrientLevel {
  if (mg >= prah(zivina, 'vyznamny')) return 'vyznamny';
  if (mg >= prah(zivina, 'obsahuje')) return 'obsahuje';
  return 'nevyznamny';
}

/**
 * Naměřené hodnoty po surovinách.
 *
 * Zatím jen tam, kde načtený zdroj uvádí obsah číslem, ne rozpětím ani horní
 * mezí. Dokud tabulka nepokryje víc surovin, zbytek katalogu se řídí
 * skupinami — a to je v pořádku, jen hrubší.
 */
export const COMPOSITION: Readonly<Record<string, Slozeni>> = {
  kiwi: { vitaminC: 130, zdroj: BP_VITAMIN_C },
  papaja: { vitaminC: 100, zdroj: BP_VITAMIN_C },
};

/** Zdroje, o které se číselná vrstva opírá. */
export const COMPOSITION_SOURCES: readonly SourceRef[] = [
  NHS_VITAMIN_C,
  NHS_IRON,
  NHS_TRACE_MINERALS,
  BP_VITAMIN_C,
];
