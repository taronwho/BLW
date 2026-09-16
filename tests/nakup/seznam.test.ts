import { describe, expect, it } from 'vitest';
import { sestavNakupniSeznam, slozkyDoNakupu } from '../../src/nakup/seznam';
import { nakupPocty } from '../../src/nakup/pocty';
import { emptyHouseholdState } from '../../src/sync/merge';
import { recipeById } from '../../src/data';
import type { HouseholdState, NakupPolozka } from '../../src/types';

function stav(nakup: Record<string, NakupPolozka | null>): HouseholdState {
  return {
    ...emptyHouseholdState(),
    nakup: Object.fromEntries(
      Object.entries(nakup).map(([id, hodnota]) => [id, { hodnota, kdy: 1 }]),
    ),
  };
}

function polozka(over: Partial<NakupPolozka> = {}): NakupPolozka {
  return { davky: [], koupeno: false, ...over };
}

describe('složky receptu do nákupu', () => {
  it('vezme všechny linie receptu, vodu ne', () => {
    const recept = recipeById.get('mlete-hovezi-zadni-s-cibuli');
    expect(recept).toBeDefined();
    const slozky = slozkyDoNakupu('mlete-hovezi-zadni-s-cibuli');
    const ids = slozky.map((s) => s.ingredientId);

    expect(ids).toContain('hovezi-zadni');
    expect(ids).toContain('cocka-cervena-loupana');
    expect(ids).not.toContain('voda');
    expect(slozky.every((s) => s.mnozstvi.length > 0)).toBe(true);
  });

  it('neznámý recept nic nepřidá', () => {
    expect(slozkyDoNakupu('recept-ktery-neexistuje')).toEqual([]);
  });
});

describe('sestavení seznamu', () => {
  it('sečte množství téže suroviny z více receptů', () => {
    const seznam = sestavNakupniSeznam(
      stav({
        mrkev: polozka({
          davky: [
            { recipeId: 'a', mnozstvi: '150 g' },
            { recipeId: 'b', mnozstvi: '300 g' },
          ],
        }),
      }),
    );
    expect(seznam).toHaveLength(1);
    expect(seznam[0]?.popis).toBe('450 g');
  });

  it('koupené padají na konec seznamu', () => {
    const seznam = sestavNakupniSeznam(
      stav({
        mrkev: polozka({ koupeno: true }),
        jablko: polozka(),
        brokolice: polozka(),
      }),
    );
    expect(seznam.map((r) => r.ingredient.id)).toEqual(['brokolice', 'jablko', 'mrkev']);
    expect(seznam.at(-1)?.koupeno).toBe(true);
  });

  it('řadí podle cesty obchodem, ne podle abecedy', () => {
    const seznam = sestavNakupniSeznam(
      stav({ 'ovesne-vlocky-jemne': polozka(), mrkev: polozka(), jablko: polozka() }),
    );
    // Zelenina, pak ovoce, obiloviny až za nimi.
    expect(seznam.map((r) => r.ingredient.id)).toEqual(['mrkev', 'jablko', 'ovesne-vlocky-jemne']);
  });

  it('u položky drží, odkud se vzala', () => {
    const seznam = sestavNakupniSeznam(
      stav({
        mrkev: polozka({
          davky: [{ recipeId: 'mrkev-dusena-s-dynovym-olejem', mnozstvi: '6 středních' }, {}],
        }),
      }),
    );
    expect(seznam[0]?.puvod[0]?.nazev).toBe('Dušená mrkev s dýňovým olejem');
    expect(seznam[0]?.puvod[1]?.nazev).toBe('ručně přidáno');
  });

  it('náhrobek po odebrané položce se do seznamu nedostane', () => {
    const seznam = sestavNakupniSeznam(stav({ mrkev: null, jablko: polozka() }));
    expect(seznam.map((r) => r.ingredient.id)).toEqual(['jablko']);
  });

  it('spočítá položky bez katalogu', () => {
    const pocty = nakupPocty(
      stav({ mrkev: polozka({ koupeno: true }), jablko: polozka(), brokolice: null }),
    );
    expect(pocty).toEqual({ celkem: 2, koupeno: 1 });
  });
});
