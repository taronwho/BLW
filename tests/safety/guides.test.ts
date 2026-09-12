import { describe, expect, it } from 'vitest';
import { guides, guidesByUrgency } from '../../src/data/guides';
import { checkGuides } from '../../src/safety/guides';
import type { Guide } from '../../src/types';

function makeGuide(overrides: Partial<Guide> = {}): Guide {
  const base: Guide = {
    id: 'testovaci-rada',
    titleCz: 'Testovací rada',
    category: 'praxe',
    summary: 'Jedna věta, která radu shrnuje.',
    keyPoints: ['První vypíchnutý bod.'],
    sections: [{ heading: 'Nadpis sekce', body: ['Odstavec s obsahem.'] }],
    sources: [
      {
        org: 'NHS',
        title: 'Preparing food safely for babies',
        url: 'https://www.nhs.uk/best-start-in-life/baby/weaning/safe-weaning/preparing-food-safely/',
        accessedAt: '2026-09-12',
        tier: 1,
      },
    ],
    reviewStatus: 'verified',
  };
  return { ...base, ...overrides };
}

describe('checkGuides', () => {
  it('platná rada projde bez nálezu', () => {
    expect(checkGuides([makeGuide()])).toEqual([]);
  });

  it('zachytí radu bez dostatečného zdroje', () => {
    const findings = checkGuides([makeGuide({ sources: [] })]);
    expect(findings.map((f) => f.message).join(' ')).toContain('Nedostatečné zdroje');
  });

  it('zachytí zdroj mimo povolené domény', () => {
    const findings = checkGuides([
      makeGuide({
        sources: [
          {
            org: 'Blog',
            title: 'Náhodný blog',
            url: 'https://nejakyblog.example/clanek',
            accessedAt: '2026-09-12',
            tier: 1,
          },
        ],
      }),
    ]);
    expect(findings.map((f) => f.message).join(' ')).toContain('není v povoleném seznamu');
  });

  it('zachytí zástupný text', () => {
    const findings = checkGuides([
      makeGuide({ sections: [{ heading: 'Nadpis', body: ['TODO doplnit'] }] }),
    ]);
    expect(findings.map((f) => f.message).join(' ')).toContain('Zástupný text');
  });

  it('zachytí prázdnou sekci', () => {
    const findings = checkGuides([makeGuide({ sections: [{ heading: 'Nadpis', body: [] }] })]);
    expect(findings.map((f) => f.message).join(' ')).toContain('nemá žádný text');
  });

  it('zachytí naléhavou radu bez vypíchnutých bodů', () => {
    const findings = checkGuides([makeGuide({ urgent: true, keyPoints: [] })]);
    expect(findings.map((f) => f.message).join(' ')).toContain('nemá žádný keyPoint');
  });

  it('zachytí duplicitní id', () => {
    const findings = checkGuides([makeGuide(), makeGuide()]);
    expect(findings.map((f) => f.message).join(' ')).toContain('Duplicitní id');
  });
});

describe('rady v katalogu', () => {
  it('všechny rady projdou kontrolou', () => {
    expect(checkGuides(guides)).toEqual([]);
  });

  it('existuje rada o dávení i o první pomoci a obě jsou naléhavé', () => {
    const ids = guides.filter((g) => g.urgent === true).map((g) => g.id);
    expect(ids).toContain('daveni-vs-duseni');
    expect(ids).toContain('prvni-pomoc-pri-duseni');
  });

  it('rady o železe a zinku jsou v katalogu', () => {
    const ids = guides.map((g) => g.id);
    expect(ids).toContain('zelezo-proc-a-jak');
    expect(ids).toContain('zinek');
  });

  it('naléhavé rady jsou v seřazeném seznamu první', () => {
    const firstTwo = guidesByUrgency.slice(0, 2);
    expect(firstTwo.every((g) => g.urgent === true)).toBe(true);
  });

  it('první pomoc nedoporučuje Heimlicha u kojence', () => {
    const guide = guides.find((g) => g.id === 'prvni-pomoc-pri-duseni');
    const text = JSON.stringify(guide);
    expect(text).toContain('do jednoho roku neprovádí');
  });
});
