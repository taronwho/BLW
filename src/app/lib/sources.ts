import type { SourceRef } from '@/types';

/** Stejný zdroj může být u několika surovin — v jednom seznamu stačí jednou. */
export function dedupeSources(sources: readonly SourceRef[]): SourceRef[] {
  const byUrl = new Map<string, SourceRef>();
  for (const source of sources) {
    if (!byUrl.has(source.url)) byUrl.set(source.url, source);
  }
  return [...byUrl.values()];
}
