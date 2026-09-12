import type { Guide } from '@/types';
import { safety } from './safety';
import { nutrition } from './nutrition';
import { starting } from './starting';
import { practice } from './practice';

/**
 * Rady — souvislé texty, které nepatří ke konkrétní surovině ani receptu.
 *
 * Naléhavé rady (`urgent: true`) jsou vždy první, protože se k nim sahá
 * ve chvíli, kdy na listování není čas.
 */
export const guides: Guide[] = [...safety, ...nutrition, ...starting, ...practice];

export const guideById: ReadonlyMap<string, Guide> = new Map(
  guides.map((item) => [item.id, item]),
);

/** Rady seřazené tak, jak se mají zobrazit: naléhavé nahoře. */
export const guidesByUrgency: Guide[] = [
  ...guides.filter((guide) => guide.urgent === true),
  ...guides.filter((guide) => guide.urgent !== true),
];
