import { describe, expect, it } from 'vitest';
import { ingredientById } from '../../src/data';
import {
  COMPOSITION,
  DENNI_POTREBA,
  PODIL_OBSAHUJE,
  PODIL_VYZNAMNY,
  prah,
  urovenZObsahu,
  type Hodnota,
} from '../../src/data/composition';
import { nutrientProfile } from '../../src/data/nutrients';
import { TIER1_DOMAINS } from '../../src/safety/domains';

/** Domény, ze kterých se podle docs/BEZPECNOST.md kap. 8 smí brát miligramy. */
const TABULKY = [
  'nutridatabaze.cz',
  'uzei.cz',
  'fdc.nal.usda.gov',
  'api.nal.usda.gov',
  'ciqual.anses.fr',
  'anses.fr',
  'fineli.fi',
  'thl.fi',
  'frida.fooddata.dk',
  'fooddata.dk',
  'matvaretabellen.no',
  'livsmedelsverket.se',
];

function hodnoty(id: string): Array<[string, Hodnota]> {
  const slozeni = COMPOSITION[id];
  if (slozeni === undefined) return [];
  const out: Array<[string, Hodnota]> = [];
  for (const zivina of ['vitaminC', 'iron', 'zinc'] as const) {
    const hodnota = slozeni[zivina];
    if (hodnota !== undefined) out.push([zivina, hodnota]);
  }
  return out;
}

describe('naměřený obsah živin', () => {
  it('prahy odpovídají patnácti a třiceti procentům denní potřeby', () => {
    expect(prah('vitaminC', 'obsahuje')).toBeCloseTo(DENNI_POTREBA.vitaminC * PODIL_OBSAHUJE);
    expect(prah('vitaminC', 'vyznamny')).toBeCloseTo(DENNI_POTREBA.vitaminC * PODIL_VYZNAMNY);
    expect(prah('vitaminC', 'vyznamny')).toBe(prah('vitaminC', 'obsahuje') * 2);
  });

  it('úroveň se odvodí z miligramů na sto gramů', () => {
    expect(urovenZObsahu('vitaminC', 0)).toBe('nevyznamny');
    expect(urovenZObsahu('vitaminC', prah('vitaminC', 'obsahuje'))).toBe('obsahuje');
    expect(urovenZObsahu('vitaminC', prah('vitaminC', 'vyznamny'))).toBe('vyznamny');
    expect(urovenZObsahu('iron', 1)).toBe('nevyznamny');
    expect(urovenZObsahu('zinc', 5)).toBe('vyznamny');
  });

  it('naměřená hodnota přebíjí zařazení podle skupiny', () => {
    // Kiwi má podle české tabulky 92,7 mg vitaminu C na 100 g, tedy sedminásobek prahu.
    expect(COMPOSITION['kiwi']?.vitaminC?.mg).toBe(92.7);
    expect(nutrientProfile(ingredientById.get('kiwi') as never).vitaminC).toBe('vyznamny');
  });

  it('naměřená hodnota umí zařazení i snížit', () => {
    // Sušené švestky patří do skupiny „sušené ovoce", kterou NHS jmenuje
    // u železa. Naměřených 0,93 mg na 100 g je ale hluboko pod prahem, takže
    // číslo skupinu přebije a aplikace je za zdroj železa nevydává.
    expect(COMPOSITION['susene-svestky']?.iron?.mg).toBe(0.93);
    expect(nutrientProfile(ingredientById.get('susene-svestky') as never).iron).toBe('nevyznamny');
  });

  it('každá naměřená hodnota má zdroj a je kladná', () => {
    for (const id of Object.keys(COMPOSITION)) {
      expect(ingredientById.has(id), `surovina ${id} v katalogu není`).toBe(true);
      const vsechny = hodnoty(id);
      expect(vsechny.length, `surovina ${id} nemá jedinou hodnotu`).toBeGreaterThan(0);
      for (const [zivina, hodnota] of vsechny) {
        expect(hodnota.mg, `${id}/${zivina} není kladné`).toBeGreaterThan(0);
        expect(hodnota.zdroj.url.startsWith('https://')).toBe(true);
        expect(hodnota.zdroj.accessedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(hodnota.zdroj.tier).toBe(1);
      }
    }
  });

  it('miligramy pocházejí jen z národních potravinových tabulek', () => {
    for (const id of Object.keys(COMPOSITION)) {
      for (const [zivina, hodnota] of hodnoty(id)) {
        const host = new URL(hodnota.zdroj.url).hostname;
        const povolena = TABULKY.some((d) => host === d || host.endsWith(`.${d}`));
        expect(povolena, `${id}/${zivina}: „${host}" není potravinová tabulka`).toBe(true);
        expect(TIER1_DOMAINS.some((d) => host === d || host.endsWith(`.${d}`))).toBe(true);
      }
    }
  });

  it('poznámka u hodnoty není zástupný text', () => {
    for (const [id, slozeni] of Object.entries(COMPOSITION)) {
      if (slozeni.poznamka === undefined) continue;
      expect(slozeni.poznamka.length, `${id}: příliš krátká poznámka`).toBeGreaterThan(15);
      expect(slozeni.poznamka).not.toMatch(/TODO|lorem|doplnit|\.\.\./i);
    }
  });
});
