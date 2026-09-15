import { describe, expect, it } from 'vitest';
import { ingredients, recipes } from '../../src/data';
import { matchesIngredient, matchesRecipe, matchesText } from '../../src/app/lib/search';

const byId = new Map(ingredients.map((item) => [item.id, item]));

function najdiSuroviny(query: string): string[] {
  return ingredients.filter((item) => matchesIngredient(item, query)).map((item) => item.id);
}

function najdiRecepty(query: string): string[] {
  return recipes
    .filter((recipe) =>
      matchesRecipe(
        recipe,
        query,
        recipe.ingredients.flatMap((ref) => {
          const item = byId.get(ref.ingredientId);
          return item === undefined ? [] : [item.nameCz, ...item.altNamesCz];
        }),
      ),
    )
    .map((recipe) => recipe.id);
}

describe('vyhledávání', () => {
  it('najde surovinu i bez diakritiky', () => {
    expect(najdiSuroviny('cocka')).toContain('cocka-cervena-loupana');
    expect(najdiSuroviny('ZELI')).toContain('zeli-bile');
  });

  it('neprohledává vnitřní kód kategorie', () => {
    // Kategorie se jmenuje `maso-ryby`, takže dotaz „ryby" dřív vracel
    // i hovězí zadní a kuřecí prsa. Rodič, který hledá rybu, chce rybu.
    const ryby = najdiSuroviny('ryby');
    expect(ryby).not.toContain('hovezi-zadni');
    expect(ryby).not.toContain('kureci-prsa');

    // A `mlecne-vejce` dělalo z kefíru a sýrů vejce.
    const vejce = najdiSuroviny('vejce');
    expect(vejce).toContain('vejce-slepici');
    expect(vejce).not.toContain('kefir');
    expect(vejce).not.toContain('gouda');
  });

  it('kategorii jde najít napsáním celého jejího názvu', () => {
    expect(najdiSuroviny('luštěniny')).toContain('cocka-hneda');
    expect(najdiSuroviny('maso a ryby')).toContain('losos');
    // Ale ne úlomkem, „ryby" je půlka názvu „Maso a ryby" a vracelo by
    // to zase hovězí.
    expect(najdiSuroviny('ryby')).not.toContain('hovezi-zadni');
  });

  it('skupinu najde přes název alergenu', () => {
    // Žádná ryba nemá „ryba" v názvu, ale všechny mají alergen `ryby` 
    // tudy se k nim rodič dostane, a hovězí mezi nimi není.
    const ryby = najdiSuroviny('ryby');
    expect(ryby).toContain('losos');
    expect(ryby).toContain('treska-obecna');
    expect(ryby).not.toContain('hovezi-zadni');

    const orechy = najdiSuroviny('ořechy');
    expect(orechy).toContain('vlasske-orechy-mlete');
    expect(orechy).not.toContain('olej-olivovy');
  });

  it('odpustí jeden překlep i jeden tvar navíc', () => {
    // Překlep.
    expect(najdiSuroviny('brambury')).toContain('brambor');
    // Přehozená dvojice písmen, což je zároveň druhý pád, „mrkve" a „mrkev".
    expect(najdiSuroviny('mrkve')).toContain('mrkev');
    // Krátká slova se netolerují, jinak by „sůl" našla „síla" a „sója".
    expect(najdiSuroviny('sul')).not.toContain('soja-edamame');
  });

  it('recept se hledá i podle synonym svých surovin', () => {
    // „jablka" je synonymum jablka; dřív se do hledání posílal jen hlavní
    // název, takže se našel jediný recept, který to slovo měl v názvu.
    const podleSynonyma = najdiRecepty('jablka');
    const podleNazvu = najdiRecepty('jablko');
    expect(podleSynonyma.length).toBeGreaterThan(1);
    for (const id of podleNazvu) expect(podleSynonyma).toContain(id);
  });

  it('prázdný dotaz projde vším', () => {
    expect(matchesText('', ['cokoli'])).toBe(true);
    expect(najdiSuroviny('').length).toBe(ingredients.length);
  });
});
