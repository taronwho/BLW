import type { Guide } from '@/types';
import { DENIED_DOMAINS, TIER1_DOMAINS, TIER2_DOMAINS } from './domains';
import { containsPattern, hostMatches } from './text';
import { PLACEHOLDER_PATTERNS } from './vocabulary';

/**
 * Kontrola rad ze sekce Rady.
 *
 * Pravidla ze src/safety/rules.ts pracují nad surovinami a recepty a jejich
 * typ `RuleTarget` se kvůli radám nerozšiřuje — rady mají jinou strukturu.
 * Platí na ně ale tytéž nároky z docs/BEZPECNOST.md kap. 1: ověřený zdroj
 * z povolené domény a žádné zástupné texty.
 */
export interface GuideFinding {
  guideId: string;
  message: string;
}

/** Text u rady, který musí být neprázdný a bez zástupných frází. */
function guideStrings(guide: Guide): Array<{ field: string; value: string }> {
  const out: Array<{ field: string; value: string }> = [
    { field: 'titleCz', value: guide.titleCz },
    { field: 'summary', value: guide.summary },
  ];
  guide.keyPoints.forEach((value, i) => out.push({ field: `keyPoints[${i}]`, value }));
  guide.sections.forEach((section, i) => {
    out.push({ field: `sections[${i}].heading`, value: section.heading });
    section.body.forEach((value, j) => out.push({ field: `sections[${i}].body[${j}]`, value }));
  });
  (guide.literature ?? []).forEach((value, i) => out.push({ field: `literature[${i}]`, value }));
  return out;
}

/** Vrátí seznam nálezů; prázdné pole znamená, že jsou rady v pořádku. */
export function checkGuides(guides: readonly Guide[]): GuideFinding[] {
  const findings: GuideFinding[] = [];
  const push = (guideId: string, message: string): void => {
    findings.push({ guideId, message });
  };

  const seen = new Set<string>();
  for (const guide of guides) {
    if (seen.has(guide.id)) push(guide.id, 'Duplicitní id rady.');
    seen.add(guide.id);

    if (guide.sections.length === 0) push(guide.id, 'Rada nemá žádnou sekci.');
    for (const section of guide.sections) {
      if (section.body.length === 0) {
        push(guide.id, `Sekce „${section.heading}" nemá žádný text.`);
      }
    }

    for (const { field, value } of guideStrings(guide)) {
      if (value.trim().length === 0) {
        push(guide.id, `Prázdný řetězec v poli ${field}.`);
        continue;
      }
      if (containsPattern(value, PLACEHOLDER_PATTERNS, { honorNegation: false })) {
        push(guide.id, `Zástupný text v poli ${field}: „${value.slice(0, 60)}".`);
      }
    }

    // Zdroje: stejná politika domén jako u surovin (docs/BEZPECNOST.md kap. 1).
    const tier1 = guide.sources.filter((s) => s.tier === 1).length;
    const tier2 = guide.sources.filter((s) => s.tier === 2).length;
    if (tier1 < 1 && tier2 < 2) {
      push(guide.id, `Nedostatečné zdroje: tier 1 = ${tier1}, tier 2 = ${tier2}.`);
    }
    for (const source of guide.sources) {
      let url: URL;
      try {
        url = new URL(source.url);
      } catch {
        push(guide.id, `Nevalidní URL: „${source.url}".`);
        continue;
      }
      if (url.protocol !== 'https:') push(guide.id, `URL není https: „${source.url}".`);
      const host = url.hostname;
      if (DENIED_DOMAINS.some((d) => hostMatches(host, d))) {
        push(guide.id, `Doména „${host}" je výslovně odmítnutá.`);
      }
      const isTier1 = TIER1_DOMAINS.some((d) => hostMatches(host, d));
      const isTier2 = TIER2_DOMAINS.some((d) => hostMatches(host, d));
      if (!isTier1 && !isTier2) push(guide.id, `Doména „${host}" není v povoleném seznamu.`);
      if (source.tier === 1 && !isTier1) push(guide.id, `Doména „${host}" nemůže být tier 1.`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(source.accessedAt)) {
        push(guide.id, `accessedAt u „${source.url}" není ISO datum.`);
      }
    }

    // Naléhavá rada musí mít vypíchnuté body — na ně se kouká jako první.
    if (guide.urgent === true && guide.keyPoints.length === 0) {
      push(guide.id, 'Naléhavá rada nemá žádný keyPoint.');
    }
  }

  return findings;
}
