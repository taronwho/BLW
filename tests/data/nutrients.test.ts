import { describe, expect, it } from 'vitest';
import { ingredientById, ingredients, recipes } from '../../src/data';
import {
  ironSources,
  isIronSource,
  nutrientProfile,
  vitaminCPartners,
} from '../../src/data/nutrients';
import type { Ingredient } from '../../src/types';

function get(id: string): Ingredient {
  const item = ingredientById.get(id);
  if (item === undefined) throw new Error(`Surovina ${id} v katalogu není.`);
  return item;
}

describe('zařazení podle železa, zinku a vitaminu C', () => {
  it('maso nese hemové železo', () => {
    const profile = nutrientProfile(get('hovezi-zadni'));
    expect(profile.iron).toBe('vyznamny');
    expect(profile.ironForm).toBe('hemove');
  });

  it('luštěniny nesou nehemové železo', () => {
    const profile = nutrientProfile(get('cocka-cervena-loupana'));
    expect(profile.iron).toBe('vyznamny');
    expect(profile.ironForm).toBe('nehemove');
  });

  it('olej se jako zdroj železa ani zinku nepočítá', () => {
    const profile = nutrientProfile(get('olej-olivovy'));
    expect(profile.iron).toBe('nevyznamny');
    expect(profile.zinc).toBe('nevyznamny');
    expect(profile.ironForm).toBe('zadne');
  });

  it('jablko není zdroj žádné ze tří živin', () => {
    const profile = nutrientProfile(get('jablko'));
    expect(profile.iron).toBe('nevyznamny');
    expect(profile.zinc).toBe('nevyznamny');
    expect(profile.vitaminC).toBe('nevyznamny');
  });

  it('brokolice je významný zdroj vitaminu C', () => {
    expect(nutrientProfile(get('brokolice')).vitaminC).toBe('vyznamny');
  });

  it('isIronSource odpovídá úrovni v profilu', () => {
    expect(isIronSource(get('kureci-jatra'))).toBe(true);
    expect(isIronSource(get('jablko'))).toBe(false);
  });

  it('partneři pro vstřebávání jsou jen významné zdroje vitaminu C', () => {
    const partners = vitaminCPartners(get('cocka-cervena-loupana'), 5);
    expect(partners.length).toBe(5);
    for (const item of partners) {
      expect(nutrientProfile(item).vitaminC).toBe('vyznamny');
    }
  });

  it('napřed jdou partneři, které kuchařka se surovinou opravdu kombinuje', () => {
    // Pořadí musí odrážet, co kuchařka s luštěninou doopravdy vaří, jinak je
    // rada nepoužitelná u sporáku. Netestuje se konkrétní surovina — ta se
    // s každým novým receptem může posunout — ale pořadí podle obou klíčů:
    // nejdřív počet receptů přímo s touhle surovinou, teprve při shodě počet
    // receptů s její kategorií.
    const cocka = get('cocka-cervena-loupana');
    const partners = vitaminCPartners(cocka, 5);

    const slozky = (recipe: (typeof recipes)[number]): string[] =>
      recipe.ingredients.map((ref) => ref.ingredientId);

    const sPrimo = (id: string): number =>
      recipes.filter((recipe) => {
        const ids = slozky(recipe);
        return ids.includes(cocka.id) && ids.includes(id);
      }).length;

    const sKategorii = (id: string): number =>
      recipes.filter((recipe) => {
        const ids = slozky(recipe);
        const maKategorii = ids.some(
          (one) => ingredients.find((i) => i.id === one)?.category === cocka.category,
        );
        return maKategorii && ids.includes(id);
      }).length;

    const klice = partners.map((partner): [number, number] => [
      sPrimo(partner.id),
      sKategorii(partner.id),
    ]);
    const prvni = klice[0];
    if (prvni === undefined) throw new Error('Čočka nemá žádného partnera na vitamin C.');
    expect(prvni[1]).toBeGreaterThan(0);
    const serazene = [...klice].sort((a, b) => b[0] - a[0] || b[1] - a[1]);
    expect(serazene).toEqual(klice);
  });

  it('surovina sama sobě partnerem není', () => {
    const brokolice = get('brokolice');
    expect(vitaminCPartners(brokolice, 9).map((item) => item.id)).not.toContain('brokolice');
  });

  it('zdroje železa začínají hemovými', () => {
    const sources = ironSources(12);
    expect(sources.length).toBe(12);
    expect(nutrientProfile(sources[0] as Ingredient).ironForm).toBe('hemove');
    for (const item of sources) {
      expect(isIronSource(item)).toBe(true);
    }
  });
});
