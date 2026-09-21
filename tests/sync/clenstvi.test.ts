import { describe, expect, it } from 'vitest';
import {
  MAX_MEMBERS,
  cekajiciClenove,
  clenoveZeStavu,
  clenstviZeStavu,
  emptyHouseholdState,
  mergeHouseholdState,
} from '../../src/sync/merge';
import type { CasovanaHodnota, HouseholdState } from '../../src/types';

function clenstvi(
  zaznamy: Record<string, [boolean, number]>,
): Record<string, CasovanaHodnota<boolean>> {
  return Object.fromEntries(
    Object.entries(zaznamy).map(([uid, [hodnota, kdy]]) => [uid, { hodnota, kdy }]),
  );
}

/**
 * Členství je časovaná mapa, ne sjednocené pole.
 *
 * Audit 17. 9. 2026, nálezy 7.3 a 7.4: `mergeUnique(...).slice(0, 5)`
 * zahodil šesté zařízení podle pořadí v lokálním seznamu, tedy podle
 * náhody a bez hlášky, a odebrané zařízení se vracelo, protože
 * sjednocení umí jen přidávat.
 */
describe('clenstviZeStavu', () => {
  it('starý stav bez mapy se dopočítá z pole s časem nula', () => {
    // Čas 0 znamená „od nepaměti", takže jakýkoli pozdější zápis vyhraje.
    const stav = { members: ['a', 'b'] };
    expect(clenstviZeStavu(stav)).toEqual({
      a: { hodnota: true, kdy: 0 },
      b: { hodnota: true, kdy: 0 },
    });
  });

  it('mapa přebíjí pole — náhrobek v ní nesmí pole vzkřísit', () => {
    const stav = {
      members: ['a', 'b'],
      memberClenstvi: clenstvi({ b: [false, 10] }),
    };
    expect(clenstviZeStavu(stav).b).toEqual({ hodnota: false, kdy: 10 });
  });
});

describe('clenoveZeStavu', () => {
  it('náhrobky se do pole nedostanou', () => {
    expect(clenoveZeStavu(clenstvi({ a: [true, 1], b: [false, 2] }))).toEqual(['a']);
  });

  it('při plné domácnosti zůstává pět nejdéle přihlášených', () => {
    // Ne „pět podle pořadí v lokálním poli". Kdo se připojil dřív,
    // zůstává; nováček čeká, až se místo uvolní.
    const sest = clenstvi({
      f: [true, 600],
      a: [true, 100],
      e: [true, 500],
      b: [true, 200],
      d: [true, 400],
      c: [true, 300],
    });
    expect(clenoveZeStavu(sest)).toEqual(['a', 'b', 'c', 'd', 'e']);
    expect(clenoveZeStavu(sest)).toHaveLength(MAX_MEMBERS);
  });

  it('shodný čas rozhodne uid, ať je pořadí na obou telefonech stejné', () => {
    // Jinak by každý telefon poslal jiné pole a přepisovaly by si ho dokola.
    const a = clenoveZeStavu(clenstvi({ z: [true, 1], a: [true, 1] }));
    const b = clenoveZeStavu(clenstvi({ a: [true, 1], z: [true, 1] }));
    expect(a).toEqual(['a', 'z']);
    expect(b).toEqual(a);
  });
});

describe('cekajiciClenove', () => {
  it('zařízení nad limit se neztratí, jen čeká', () => {
    const sest = clenstvi({
      a: [true, 100],
      b: [true, 200],
      c: [true, 300],
      d: [true, 400],
      e: [true, 500],
      f: [true, 600],
    });
    expect(cekajiciClenove(sest)).toEqual(['f']);
  });

  it('do pěti zařízení nečeká nikdo', () => {
    expect(cekajiciClenove(clenstvi({ a: [true, 1], b: [true, 2] }))).toEqual([]);
  });
});

describe('sloučení členství', () => {
  function stav(over: Partial<HouseholdState>): HouseholdState {
    return { ...emptyHouseholdState(), ...over };
  }

  it('odebrání přežije sloučení s telefonem, který o něm neví', () => {
    const local = stav({
      members: ['a'],
      memberClenstvi: clenstvi({ a: [true, 1], b: [false, 50] }),
    });
    const remote = stav({ members: ['a', 'b'], memberClenstvi: clenstvi({ b: [true, 10] }) });
    expect(mergeHouseholdState(local, remote).members).toEqual(['a']);
  });

  it('opětovné připojení odebraného zařízení vyhraje nad náhrobkem', () => {
    // Párovací kód je v tomhle modelu členství: kdo ho zná, do domácnosti
    // patří. Odebrání tedy znamená „uvolni místo", ne „zakaž přístup".
    const local = stav({ members: [], memberClenstvi: clenstvi({ b: [false, 50] }) });
    const remote = stav({ members: ['b'], memberClenstvi: clenstvi({ b: [true, 80] }) });
    expect(mergeHouseholdState(local, remote).members).toEqual(['b']);
  });

  it('pole members nikdy nepřesáhne limit z firestore.rules', () => {
    // Pravidla delší seznam odmítnou, takže by se domácnost zasekla.
    const local = stav({
      members: ['a', 'b', 'c'],
      memberClenstvi: clenstvi({ a: [true, 1], b: [true, 2], c: [true, 3] }),
    });
    const remote = stav({
      members: ['d', 'e', 'f', 'g'],
      memberClenstvi: clenstvi({ d: [true, 4], e: [true, 5], f: [true, 6], g: [true, 7] }),
    });
    const merged = mergeHouseholdState(local, remote);
    expect(merged.members.length).toBeLessThanOrEqual(MAX_MEMBERS);
    // A nikdo se neztratil — čekající jsou pořád v mapě.
    expect(Object.keys(merged.memberClenstvi ?? {})).toHaveLength(7);
    expect(cekajiciClenove(merged.memberClenstvi ?? {})).toEqual(['f', 'g']);
  });

  it('sloučení je souměrné — na obou telefonech vyjde totéž', () => {
    const local = stav({
      members: ['a', 'b'],
      memberClenstvi: clenstvi({ a: [true, 1], b: [true, 2] }),
    });
    const remote = stav({
      members: ['b', 'c'],
      memberClenstvi: clenstvi({ b: [false, 9], c: [true, 3] }),
    });
    expect(mergeHouseholdState(local, remote).members).toEqual(
      mergeHouseholdState(remote, local).members,
    );
  });
});
