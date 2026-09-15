import { describe, expect, it } from 'vitest';
import { frekvence } from '../../src/plan/frekvence';

/**
 * Počet jídel se opírá o NHS a WHO (zdroje jsou v radě o plánu). Test hlídá,
 * že se rozběh nikdy nedostane před věk dítěte: šestiměsíční dítě nedostane
 * tři jídla ani ve třetím bloku.
 */
describe('kolikrát denně plán nabídne jídlo', () => {
  it('první týden jedno jídlo, druhý dvě', () => {
    expect(frekvence(1, 1, 6).jidel).toBe(1);
    expect(frekvence(7, 1, 6).jidel).toBe(1);
    expect(frekvence(8, 1, 6).jidel).toBe(2);
    expect(frekvence(14, 1, 6).jidel).toBe(2);
  });

  it('do sedmi měsíců se nepřekročí dvě jídla, ani v dalších blocích', () => {
    for (const blok of [1, 2, 5]) {
      for (const den of [1, 15, 30]) {
        expect(frekvence(den, blok, 6).jidel).toBeLessThanOrEqual(2);
      }
    }
  });

  it('od sedmi měsíců se plán postupně dostane na tři jídla', () => {
    // Rozběh platí jen v prvním bloku: první týden jedno jídlo, druhý dvě,
    // pak už tři. Ve druhém bloku dítě jí měsíc, takže začíná rovnou na třech.
    expect(frekvence(7, 1, 7).jidel).toBe(1);
    expect(frekvence(14, 1, 7).jidel).toBe(2);
    expect(frekvence(15, 1, 7).jidel).toBe(3);
    expect(frekvence(1, 2, 7).jidel).toBe(3);
    expect(frekvence(30, 2, 9).jidel).toBe(3);
  });

  it('svačiny přibývají až po prvních narozeninách', () => {
    expect(frekvence(10, 2, 11).svacin).toBe(0);
    expect(frekvence(10, 2, 12).svacin).toBe(2);
  });

  it('bez data narození se plán drží opatrnější varianty', () => {
    expect(frekvence(30, 3, null).jidel).toBe(2);
    expect(frekvence(30, 3, null).svacin).toBe(0);
  });
});
