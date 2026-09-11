import type { Stage } from '@/types';

/**
 * Věk dcery a z něj odvozená fáze. Rodiče zadají datum narození v nastavení,
 * aplikace podle něj předvybírá fázi (docs/SPEC.md kapitola 1).
 */

export function ageInMonths(birthDate: string, today: Date = new Date()): number | null {
  const born = new Date(`${birthDate}T00:00:00`);
  if (Number.isNaN(born.getTime())) return null;
  if (born > today) return null;

  let months = (today.getFullYear() - born.getFullYear()) * 12 + (today.getMonth() - born.getMonth());
  // Když ještě nedošlo na den v měsíci, měsíc se nepočítá celý.
  if (today.getDate() < born.getDate()) months -= 1;
  return Math.max(0, months);
}

/** Fáze podle věku. Do 9 měsíců 6m+, do 12 měsíců 9m+, pak 12m+. */
export function stageForAge(months: number): Stage {
  if (months < 9) return '6m';
  if (months < 12) return '9m';
  return '12m';
}

/** Předvybraná fáze podle data narození; bez data zůstává 6m+. */
export function defaultStage(birthDate: string, today: Date = new Date()): Stage {
  const months = ageInMonths(birthDate, today);
  return months === null ? '6m' : stageForAge(months);
}

const STAGE_LABELS: Record<Stage, string> = {
  '6m': '6m+',
  '9m': '9m+',
  '12m': '12m+',
};

export function stageLabel(stage: Stage): string {
  return STAGE_LABELS[stage];
}

/** „7 měsíců" — pro hlavičku v nastavení. */
export function formatAge(months: number): string {
  if (months === 1) return '1 měsíc';
  if (months < 5) return `${months} měsíce`;
  return `${months} měsíců`;
}
