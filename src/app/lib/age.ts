import type { Stage } from '@/types';

/** Popisky fází, jak je vidí rodič. */
export const STAGE_LABELS: Record<Stage, string> = {
  '6m': '6m+',
  '9m': '9m+',
  '12m': '12m+',
};

/** Věk v celých měsících; `null`, když datum narození není vyplněné. */
export function ageInMonths(birthDate: string, now: Date = new Date()): number | null {
  if (birthDate.trim().length === 0) return null;
  const born = new Date(birthDate);
  if (Number.isNaN(born.getTime())) return null;
  let months = (now.getFullYear() - born.getFullYear()) * 12 + (now.getMonth() - born.getMonth());
  if (now.getDate() < born.getDate()) months -= 1;
  return Math.max(0, months);
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

export function formatAge(months: number | null): string {
  if (months === null) return 'věk nevyplněn';
  if (months < 24) return `${months} měsíců`;
  return `${Math.floor(months / 12)} roky`;
}
