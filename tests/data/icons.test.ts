import { describe, expect, it } from 'vitest';
import { ingredients } from '@/data';
import { SHAPES } from '@/app/icons/shapes';

/**
 * Kreslené ikony surovin.
 *
 * Katalog se překresluje po dávkách, takže obojí musí platit průběžně:
 * odkaz na nenakreslenou ikonu by se v aplikaci projevil jen tichým
 * propadnutím na emoji a nikdo by si toho nevšiml, a kresba bez suroviny
 * je mrtvý kód, který se veze v balíčku.
 */
describe('ikony surovin', () => {
  it('každý odkaz `icon` má svou kresbu', () => {
    const chybi = ingredients
      .filter((item) => item.icon !== undefined && SHAPES[item.icon] === undefined)
      .map((item) => `${item.nameCz} → ${item.icon ?? ''}`);
    expect(chybi).toEqual([]);
  });

  it('žádná kresba nezůstala bez suroviny', () => {
    const pouzite = new Set(ingredients.map((item) => item.icon).filter((id) => id !== undefined));
    const nepouzite = Object.keys(SHAPES).filter((id) => !pouzite.has(id));
    expect(nepouzite).toEqual([]);
  });

  it('surovina má vždycky aspoň jednu ikonu — kresbu nebo emoji', () => {
    const bez = ingredients
      .filter((item) => item.icon === undefined && (item.emoji ?? '').length === 0)
      .map((item) => item.nameCz);
    expect(bez).toEqual([]);
  });
});
