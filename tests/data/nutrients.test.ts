import { describe, expect, it } from 'vitest';
import { ingredientById } from '../../src/data';
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
    // Čočka se v receptech potkává se zeleninou, ne s jahodami — pořadí to
    // musí odrážet, jinak je rada nepoužitelná u sporáku.
    const partners = vitaminCPartners(get('cocka-cervena-loupana'), 5);
    expect(partners[0]?.category).toBe('zelenina');
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
