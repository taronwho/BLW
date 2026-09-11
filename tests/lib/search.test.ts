import { describe, expect, it } from 'vitest';
import { byCzechName, searchIngredients } from '../../src/lib/search';
import { ingredient } from './fixtures';

const katalog = [
  ingredient({ id: 'ruzickova-kapusta', nameCz: 'Růžičková kapusta' }),
  ingredient({ id: 'batat', nameCz: 'Batát', altNamesCz: ['sladké brambory', 'batáty'] }),
  ingredient({ id: 'zampiony', nameCz: 'Žampiony' }),
  ingredient({ id: 'avokado', nameCz: 'Avokádo' }),
];

describe('searchIngredients', () => {
  it('najde i bez diakritiky', () => {
    expect(searchIngredients(katalog, 'ruzickova').map((i) => i.id)).toEqual(['ruzickova-kapusta']);
  });

  it('najde i s diakritikou', () => {
    expect(searchIngredients(katalog, 'Růžičková').map((i) => i.id)).toEqual(['ruzickova-kapusta']);
  });

  it('hledá i v synonymech', () => {
    expect(searchIngredients(katalog, 'sladke brambory').map((i) => i.id)).toEqual(['batat']);
  });

  it('slova můžou být v libovolném pořadí', () => {
    expect(searchIngredients(katalog, 'kapusta ruzickova').map((i) => i.id)).toEqual([
      'ruzickova-kapusta',
    ]);
  });

  it('prázdný dotaz vrátí vše', () => {
    expect(searchIngredients(katalog, '   ')).toHaveLength(katalog.length);
  });

  it('nenajde nesmysl', () => {
    expect(searchIngredients(katalog, 'xyzzy')).toEqual([]);
  });
});

describe('byCzechName', () => {
  it('řadí podle české abecedy, ne podle kódů znaků', () => {
    const serazeno = byCzechName(katalog, (i) => i.nameCz).map((i) => i.nameCz);
    expect(serazeno).toEqual(['Avokádo', 'Batát', 'Růžičková kapusta', 'Žampiony']);
  });
});
