const KEY = 'blw.reviewed.v1';

/**
 * Potvrzení „probráno s pediatričkou" u položek se stavem needs-review.
 * Drží se jen v tomhle prohlížeči: je to poznámka rodiče, ne změna katalogu —
 * data v repozitáři zůstávají tím, čím jsou, a aplikace nikdy nepřepisuje
 * zdravotní informaci podle klepnutí v UI.
 */
export function readReviewAcks(): Set<string> {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === null) return new Set();
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed.filter((id): id is string => typeof id === 'string')) : new Set();
  } catch {
    return new Set();
  }
}

export function writeReviewAck(id: string): Set<string> {
  const next = readReviewAcks();
  next.add(id);
  try {
    window.localStorage.setItem(KEY, JSON.stringify([...next]));
  } catch {
    // Bez localStorage se potvrzení po zavření zapomene — vada na kráse.
  }
  return next;
}
