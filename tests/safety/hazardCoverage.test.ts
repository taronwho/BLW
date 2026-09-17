import { describe, expect, it } from 'vitest';
import { ingredients } from '../../src/data';
import {
  BEZ_HAZARDU_ZAMERNE,
  POVINNE_HAZARDY,
  povinneHazardy,
} from '../../src/safety/hazard-coverage';
import { HAZARDS } from '../../src/types';

/**
 * Tabulka povinných hazardů se musí držet katalogu.
 *
 * Audit 12. 9. 2026 našel v `coverage-exceptions.ts` výjimku pro `voda`,
 * která se nikdy neuplatnila a jen tiše vyjímala surovinu z kontroly. Tohle
 * je stejná past o patro vedle: id, které v katalogu není, vypadá jako
 * pokrytí, ale nekontroluje nic.
 */
describe('tabulka povinných hazardů', () => {
  it('nemá mrtvé id — každá položka v katalogu existuje', () => {
    const vKatalogu = new Set(ingredients.map((one) => one.id));
    const mrtve = Object.keys(POVINNE_HAZARDY).filter((id) => !vKatalogu.has(id));
    expect(mrtve, `Id bez položky v katalogu: ${mrtve.join(', ')}`).toEqual([]);
  });

  it('nemá mrtvé id ani v seznamu vědomých výjimek', () => {
    const vKatalogu = new Set(ingredients.map((one) => one.id));
    const mrtve = Object.keys(BEZ_HAZARDU_ZAMERNE).filter((id) => !vKatalogu.has(id));
    expect(mrtve).toEqual([]);
  });

  it('jmenuje jen hazardy, které typ zná', () => {
    const nezname = Object.values(POVINNE_HAZARDY)
      .flat()
      .filter((hazard) => !HAZARDS.includes(hazard));
    expect(nezname).toEqual([]);
  });

  it('žádná položka není zároveň povinná i vědomě vyjmutá', () => {
    const oboji = Object.keys(POVINNE_HAZARDY).filter((id) =>
      Object.hasOwn(BEZ_HAZARDU_ZAMERNE, id),
    );
    expect(oboji).toEqual([]);
  });

  it('katalog tabulku skutečně plní', () => {
    for (const [id, ocekavane] of Object.entries(POVINNE_HAZARDY)) {
      const item = ingredients.find((one) => one.id === id);
      expect(item, `${id} v katalogu chybí`).toBeDefined();
      for (const hazard of ocekavane) {
        expect(item?.hazards, `${id} nemá hazard ${hazard}`).toContain(hazard);
      }
    }
  });

  it('surovina mimo tabulku žádný hazard povinně nemá', () => {
    expect(povinneHazardy('brokolice')).toEqual([]);
  });
});

/**
 * Hazard, který zná typ i dokumentace, ale nemá ho v datech jediná položka,
 * je mrtvá větev: v UI se nikdy neukáže a žádné pravidlo nad ním nepočítá.
 * `botulismus` v tomhle stavu byl, dokud med neměl vyplněné `hazards`.
 */
describe('hazardy použité v katalogu', () => {
  it('každý hazard z typu nese aspoň jedna surovina', () => {
    const pouzite = new Set(ingredients.flatMap((one) => one.hazards));
    const nepouzite = HAZARDS.filter((hazard) => !pouzite.has(hazard));
    expect(
      nepouzite,
      `Hazard v typu, ale v datech nikde: ${nepouzite.join(', ')}. Buď ho něco má nést, nebo nemá být v typu.`,
    ).toEqual([]);
  });
});
