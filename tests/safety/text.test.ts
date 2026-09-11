import { describe, expect, it } from 'vitest';
import { containsPattern, normalize, sentences, similarity, trigrams } from '../../src/safety/text';

describe('normalize', () => {
  it('odstraní diakritiku a sjednotí mezery', () => {
    expect(normalize('  Cuketa   PÁRA  ')).toBe('cuketa para');
  });
});

describe('containsPattern', () => {
  it('matchne celé slovo', () => {
    expect(containsPattern('Přidej med.', ['med'])).toBe(true);
  });

  it('nematchne delší slovo se stejným začátkem', () => {
    expect(containsPattern('medvědí česnek', ['med'])).toBe(false);
  });

  it('kmen s hvězdičkou matchne tvary', () => {
    expect(containsPattern('medová kaše', ['medov*'])).toBe(true);
  });

  it('negace předponou nález nevyvolá', () => {
    expect(containsPattern('Porci nesol.', ['solit', 'osol*'])).toBe(false);
  });

  it('„bez" před nálezem ho při honorNegation potlačí', () => {
    expect(containsPattern('opeč bez soli', ['spetka soli'], { honorNegation: true })).toBe(false);
  });
});

describe('sentences', () => {
  it('rozdělí text na věty', () => {
    expect(sentences('První věta. Druhá věta! Třetí?')).toHaveLength(3);
  });
});

describe('similarity', () => {
  it('shodné texty mají skóre 1', () => {
    expect(similarity(trigrams('mrkev v páře'), trigrams('mrkev v páře'))).toBe(1);
  });

  it('nesouvisející texty mají nízké skóre', () => {
    expect(similarity(trigrams('mrkev v páře'), trigrams('losos v troubě'))).toBeLessThan(0.4);
  });
});
