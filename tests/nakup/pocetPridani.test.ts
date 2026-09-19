import { describe, expect, it } from 'vitest';
import { pocetPridani } from '../../src/nakup/pocty';
import { emptyHouseholdState } from '../../src/sync/merge';
import type { HouseholdState, NakupPolozka } from '../../src/types';

function stav(nakup: Record<string, NakupPolozka | null>): HouseholdState {
  return {
    ...emptyHouseholdState(),
    nakup: Object.fromEntries(
      Object.entries(nakup).map(([id, hodnota]) => [id, { hodnota, kdy: 1 }]),
    ),
  };
}

/**
 * Kolikrát už tohle v seznamu je.
 *
 * Množství se sčítají, takže ze součtu „450 g" se zpátky nedopočítá,
 * kolikrát se recept přidal. Tohle číslo je jediná odpověď, kterou rodič
 * u tlačítka „do nákupu" má.
 */
describe('pocetPridani', () => {
  const receptovy = [
    { ingredientId: 'mrkev', recipeId: 'polevka' },
    { ingredientId: 'brambor', recipeId: 'polevka' },
  ];

  it('na prázdném seznamu je nula', () => {
    expect(pocetPridani(emptyHouseholdState(), receptovy)).toBe(0);
  });

  it('spočítá, kolikrát se recept přidal', () => {
    const s = stav({
      mrkev: { davky: [{ recipeId: 'polevka' }, { recipeId: 'polevka' }], koupeno: false },
      brambor: { davky: [{ recipeId: 'polevka' }, { recipeId: 'polevka' }], koupeno: false },
    });
    expect(pocetPridani(s, receptovy)).toBe(2);
  });

  it('nepočítá dávky z jiného receptu', () => {
    const s = stav({
      mrkev: {
        davky: [{ recipeId: 'polevka' }, { recipeId: 'rizoto' }, { recipeId: 'rizoto' }],
        koupeno: false,
      },
    });
    expect(pocetPridani(s, receptovy)).toBe(1);
  });

  it('u samotné suroviny počítá jen ruční přidání, ne dávky z receptů', () => {
    const s = stav({
      mrkev: { davky: [{}, {}, { recipeId: 'polevka' }], koupeno: false },
    });
    expect(pocetPridani(s, [{ ingredientId: 'mrkev' }])).toBe(2);
  });

  it('drží počet i po vyhození jedné složky ze seznamu', () => {
    // Rodič bramboru vyhodil, protože ji má doma. Recept tím ale přidal
    // pořád dvakrát a u tlačítka chce vidět právě tohle — proto se bere
    // největší počet napříč složkami, ne nejmenší.
    const s = stav({
      mrkev: { davky: [{ recipeId: 'polevka' }, { recipeId: 'polevka' }], koupeno: false },
      brambor: null,
    });
    expect(pocetPridani(s, receptovy)).toBe(2);
  });

  it('náhrobek po odebrané surovině nepočítá jako přidání', () => {
    const s = stav({ mrkev: null, brambor: null });
    expect(pocetPridani(s, receptovy)).toBe(0);
  });

  it('odškrtnutá položka se pořád počítá — v seznamu je', () => {
    const s = stav({
      mrkev: { davky: [{ recipeId: 'polevka' }], koupeno: true },
    });
    expect(pocetPridani(s, receptovy)).toBe(1);
  });

  it('prázdné dávky znamenají nulu, ne pád', () => {
    expect(pocetPridani(emptyHouseholdState(), [])).toBe(0);
  });
});
