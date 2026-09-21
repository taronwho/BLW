import type { Stage } from '@/types';
import { dnesIso, rozdilVMesicich, rozeberIsoDatum } from '@/text/datum';
import { MESIC, ROK, sklonuj } from '@/text/sklonovani';

/** Popisky fází, jak je vidí rodič. */
export const STAGE_LABELS: Record<Stage, string> = {
  '6m': '6m+',
  '9m': '9m+',
  '12m': '12m+',
};

/**
 * Věk v celých měsících; `null`, když datum narození není vyplněné.
 *
 * Datum narození se rozebírá na tři čísla, ne přes `Date`. Řetězec
 * `'2026-03-01'` je pro `Date` UTC půlnoc, ale `now` se čte v místním
 * čase — západně od Greenwiche by z toho vyšel věk o den (a na přelomu
 * měsíce o celý měsíc) menší. Věk se počítá z kalendáře, ne z okamžiků
 * (audit 17. 9. 2026, nález 5.2).
 */
export function ageInMonths(birthDate: string, now: Date = new Date()): number | null {
  const born = rozeberIsoDatum(birthDate);
  if (born === null) return null;
  const dnes = rozeberIsoDatum(dnesIso(now));
  if (dnes === null) return null;
  return Math.max(0, rozdilVMesicich(born, dnes));
}

/** Fáze předvybraná podle věku dítěte; bez data narození začínáme na 6m+. */
export function stageForAge(months: number | null): Stage {
  if (months === null) return '6m';
  if (months >= 12) return '12m';
  if (months >= 9) return '9m';
  return '6m';
}

/** Nejnižší věk fáze v měsících — pro porovnání s `minAgeMonths`. */
export const STAGE_MIN_MONTHS: Record<Stage, number> = { '6m': 6, '9m': 9, '12m': 12 };

/**
 * Věk, jak ho čte rodič v hlavičce.
 *
 * Skloňuje se přes `sklonuj`, ne šablonou. Dřív tu stálo
 * `${months} měsíců`, což u batolete vyrobilo „1 měsíců" i „2 měsíců"
 * a u staršího dítěte „5 roky" — a bylo to vidět na každé obrazovce.
 */
export function formatAge(months: number | null): string {
  if (months === null) return 'věk nevyplněn';
  if (months < 24) return sklonuj(months, MESIC);
  return sklonuj(Math.floor(months / 12), ROK);
}
