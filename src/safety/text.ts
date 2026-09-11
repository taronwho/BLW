/**
 * Textové pomůcky pro bezpečnostní pravidla.
 * Vše pracuje nad textem bez diakritiky a malými písmeny, protože data
 * píše člověk a diakritika se v kuchyňských poznámkách nedá zaručit.
 */

/** Malá písmena, bez diakritiky, sjednocené mezery. */
export function normalize(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** Slova, po kterých následující zákaz neplatí — „bez soli", „nikdy nesol". */
const NEGATIONS = ['bez ', 'nikdy ', 'misto ', 'namisto ', 'zadn', 'nepouziv', 'nepridav'];

/** Hledá zpětně, jestli je nález uvozený negací (okno 24 znaků). */
function isNegated(haystack: string, matchIndex: number): boolean {
  const from = Math.max(0, matchIndex - 24);
  const before = haystack.slice(from, matchIndex);
  return NEGATIONS.some((n) => before.includes(n));
}

export interface FoundPattern {
  pattern: string;
  index: number;
}

/**
 * Najde zakázané vzorce v textu.
 *
 * Konvence vzorců:
 *  - `"med"`     — celé slovo; „medvěd" ani „medailon" nález nevyvolá
 *  - `"medov*"`  — kmen; matchne „medový", „medovým", „medovníku"
 *
 * Česká negace je předpona, takže hranice slova sama odfiltruje „nesol"
 * nebo „neosolený". `honorNegation` navíc přeskočí nález uvozený slovem
 * „bez", „nikdy", „místo" — kvůli legitimním větám typu „bez soli".
 */
export function findPatterns(
  text: string,
  patterns: readonly string[],
  options: { honorNegation?: boolean } = {},
): FoundPattern[] {
  const haystack = normalize(text);
  const found: FoundPattern[] = [];
  for (const pattern of patterns) {
    const isStem = pattern.endsWith('*');
    const needle = normalize(isStem ? pattern.slice(0, -1) : pattern);
    if (needle.length === 0) continue;
    const tail = isStem ? '' : '(?![a-z0-9])';
    const re = new RegExp(`(^|[^a-z0-9])${escapeRegExp(needle)}${tail}`, 'g');
    let match: RegExpExecArray | null = re.exec(haystack);
    while (match !== null) {
      const index = match.index + (match[1]?.length ?? 0);
      if (!(options.honorNegation && isNegated(haystack, index))) {
        found.push({ pattern, index });
      }
      match = re.exec(haystack);
    }
  }
  return found;
}

export function containsPattern(
  text: string,
  patterns: readonly string[],
  options: { honorNegation?: boolean } = {},
): boolean {
  return findPatterns(text, patterns, options).length > 0;
}

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Rozdělí text na věty — potřebujeme to u ořechů, kde platí „mleté" jen v téže větě. */
export function sentences(text: string): string[] {
  return text
    .split(/[.!?;\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** Trigramy pro měření podobnosti dvou popisů. */
export function trigrams(text: string): Set<string> {
  const normalized = normalize(text).replace(/[^a-z0-9 ]/g, '');
  const set = new Set<string>();
  for (let i = 0; i + 3 <= normalized.length; i += 1) {
    set.add(normalized.slice(i, i + 3));
  }
  return set;
}

/** Dice koeficient nad trigramy, 0–1. */
export function similarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  for (const gram of small) {
    if (large.has(gram)) shared += 1;
  }
  return (2 * shared) / (a.size + b.size);
}

/** Registrovatelná doména z URL, tj. „www.nhs.uk" → „nhs.uk". */
export function hostMatches(host: string, domain: string): boolean {
  const h = host.toLowerCase();
  const d = domain.toLowerCase();
  return h === d || h.endsWith(`.${d}`);
}
