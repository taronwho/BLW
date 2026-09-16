import { describe, expect, it } from 'vitest';
import {
  popisMnozstvi,
  popisSouctu,
  rozeberMnozstvi,
  sectiMnozstvi,
} from '../../src/nakup/mnozstvi';
import { recipes } from '../../src/data/recipes';

describe('rozebrání množství z kuchařky', () => {
  it('rozumí váze, objemu i kusům', () => {
    expect(rozeberMnozstvi('150 g')).toEqual({ hodnota: 150, jednotka: 'g' });
    expect(rozeberMnozstvi('200 ml')).toEqual({ hodnota: 200, jednotka: 'ml' });
    expect(rozeberMnozstvi('2 lžíce')).toEqual({ hodnota: 2, jednotka: 'lzice' });
    expect(rozeberMnozstvi('4 kusy')).toEqual({ hodnota: 4, jednotka: 'kus' });
  });

  it('kila a litry převádí na gramy a mililitry', () => {
    expect(rozeberMnozstvi('1 kg')).toEqual({ hodnota: 1000, jednotka: 'g' });
    expect(rozeberMnozstvi('1,5 l')).toEqual({ hodnota: 1500, jednotka: 'ml' });
  });

  it('číslo s přívlastkem jsou kusy', () => {
    expect(rozeberMnozstvi('6 středních')).toEqual({ hodnota: 6, jednotka: 'kus' });
    expect(rozeberMnozstvi('2 zralé')).toEqual({ hodnota: 2, jednotka: 'kus' });
    expect(rozeberMnozstvi('1 velký filet')).toEqual({ hodnota: 1, jednotka: 'filet' });
  });

  it('zvládne číslovku slovem i zápis bez čísla', () => {
    expect(rozeberMnozstvi('půl hlávky')).toEqual({ hodnota: 0.5, jednotka: 'hlavka' });
    expect(rozeberMnozstvi('špetka')).toEqual({ hodnota: 1, jednotka: 'spetka' });
  });

  it('co se rozebrat nedá, si nedomýšlí', () => {
    expect(rozeberMnozstvi('na pánev')).toBeNull();
    expect(rozeberMnozstvi('kousek velikosti nehtu')).toBeNull();
    expect(rozeberMnozstvi('šťáva z půlky')).toBeNull();
  });

  it('skoro každý zápis v kuchařce se rozebrat dá', () => {
    const zapisy = [...new Set(recipes.flatMap((r) => r.ingredients.map((i) => i.amount)))];
    const nerozebrane = zapisy.filter((zapis) => rozeberMnozstvi(zapis) === null);
    // Zbytek jsou zápisy, u kterých číslo neexistuje („na pánev"). Kdyby jich
    // začalo přibývat, seznam by přestal sčítat a tenhle test to chytí.
    expect(nerozebrane.length).toBeLessThanOrEqual(10);
    expect(zapisy.length - nerozebrane.length).toBeGreaterThan(200);
  });
});

describe('zápis množství česky', () => {
  it('skloňuje podle počtu', () => {
    expect(popisMnozstvi({ hodnota: 1, jednotka: 'lzice' })).toBe('1 lžíce');
    expect(popisMnozstvi({ hodnota: 3, jednotka: 'lzice' })).toBe('3 lžíce');
    expect(popisMnozstvi({ hodnota: 7, jednotka: 'lzice' })).toBe('7 lžic');
    expect(popisMnozstvi({ hodnota: 1, jednotka: 'kus' })).toBe('1 kus');
    expect(popisMnozstvi({ hodnota: 2, jednotka: 'kus' })).toBe('2 kusy');
    expect(popisMnozstvi({ hodnota: 9, jednotka: 'kus' })).toBe('9 kusů');
    expect(popisMnozstvi({ hodnota: 1.5, jednotka: 'kus' })).toBe('1,5 kusu');
  });

  it('velká čísla vrací zpátky do kil a litrů', () => {
    expect(popisMnozstvi({ hodnota: 1500, jednotka: 'g' })).toBe('1,5 kg');
    expect(popisMnozstvi({ hodnota: 2000, jednotka: 'ml' })).toBe('2 l');
    expect(popisMnozstvi({ hodnota: 900, jednotka: 'g' })).toBe('900 g');
  });
});

describe('sčítání množství jedné suroviny', () => {
  it('sečte stejné jednotky a různé nechá vedle sebe', () => {
    const soucet = sectiMnozstvi(['150 g', '300 g', '2 lžíce']);
    expect(popisSouctu(soucet)).toBe('450 g + 2 lžíce');
  });

  it('gramy s lžícemi nemíchá, protože lžíce mouky a oleje neváží totéž', () => {
    const soucet = sectiMnozstvi(['1 lžíce', '1 lžička']);
    expect(soucet.mnozstvi).toHaveLength(2);
  });

  it('nerozebraný zápis vypíše tak, jak je', () => {
    const soucet = sectiMnozstvi(['100 g', 'na pánev', 'na pánev']);
    expect(soucet.zbytek).toEqual(['na pánev']);
    expect(popisSouctu(soucet)).toBe('100 g + na pánev');
  });

  it('prázdný seznam nic nevymyslí', () => {
    expect(popisSouctu(sectiMnozstvi([]))).toBe('');
  });
});
