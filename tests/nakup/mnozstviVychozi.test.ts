import { describe, expect, it } from 'vitest';
import { ingredients } from '../../src/data';
import { VYCHOZI_MNOZSTVI, vychoziMnozstviSuroviny } from '../../src/data/mnozstviVychozi';
import { vychoziMnozstvi } from '../../src/nakup/seznam';

/**
 * Vygenerovaná tabulka návrhů nesmí zastarat.
 *
 * Obrazovka Surovin si kvůli jednomu návrhu množství nesmí stahovat
 * celou kuchařku (audit 17. 9. 2026, nález 3.2), takže se návrhy počítají
 * předem do `src/data/mnozstviVychozi.ts`. Cena za to je, že se tabulka
 * může rozejít s kuchařkou — tenhle test je proti tomu jediná pojistka.
 *
 * Když spadne, pusť `npm run generate:mnozstvi`.
 */
describe('mnozstviVychozi', () => {
  it('sedí na to, co se počítá z kuchařky', () => {
    for (const item of ingredients) {
      expect(VYCHOZI_MNOZSTVI[item.id], `${item.id} — pusť npm run generate:mnozstvi`).toBe(
        vychoziMnozstvi(item.id),
      );
    }
  });

  it('pokrývá celý katalog, ani o položku víc', () => {
    // Přebytečný klíč znamená surovinu, která se z katalogu vytratila.
    expect(Object.keys(VYCHOZI_MNOZSTVI).sort()).toEqual(ingredients.map((i) => i.id).sort());
  });

  it('neznámá surovina dostane kus, ne prázdno', () => {
    expect(vychoziMnozstviSuroviny('tohle-v-katalogu-neni')).toBe('1 ks');
  });

  it('žádný návrh není prázdný ani nulový', () => {
    for (const [id, navrh] of Object.entries(VYCHOZI_MNOZSTVI)) {
      expect(navrh.trim().length, id).toBeGreaterThan(0);
      expect(navrh, id).not.toMatch(/^0\s/);
    }
  });
});
