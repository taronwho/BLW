import { describe, expect, it } from 'vitest';
import { emptyHouseholdState, mergeHouseholdState, otiskStavu } from '../../src/sync/merge';
import {
  LIMIT_DOKUMENTU,
  REZERVA_UKLIDU_MS,
  uklidNahrobky,
  velikostDokumentu,
  zaplneni,
} from '../../src/sync/velikost';
import type { HouseholdState, TastingEvent } from '../../src/types';

/**
 * Limit 1 MiB na dokument domácnosti (kontrola aplikace 24. 9. 2026).
 * Náhrobek smazané ochutnávky se smí zahodit, až o smazání ví každý
 * telefon — jinak by ji ten, který to ještě neviděl, vzkřísil.
 */

const SMAZANO = Date.parse('2026-06-01T10:00:00Z');
const PO_REZERVE = SMAZANO + REZERVA_UKLIDU_MS + 1;
const PRED_REZERVOU = SMAZANO + REZERVA_UKLIDU_MS - 1;

function ochutnavka(over: Partial<TastingEvent>): TastingEvent {
  return {
    id: 'ev',
    ingredientId: 'brokolice',
    childId: 'dite-1',
    date: '2026-05-30',
    amount: 'ochutnala',
    reaction: 'zadna',
    createdBy: 'uid-a',
    createdAt: SMAZANO,
    ...over,
  };
}

function domacnost(over: Partial<HouseholdState>): HouseholdState {
  return {
    ...emptyHouseholdState(),
    members: ['uid-a', 'uid-b'],
    tastings: [
      ochutnavka({ id: 'zive' }),
      ochutnavka({ id: 'smazane', deleted: true }),
    ],
    ...over,
  };
}

describe('úklid náhrobků', () => {
  it('zahodí náhrobek, když se po smazání připojil každý telefon', () => {
    const vysledek = uklidNahrobky(
      domacnost({ memberSeenAt: { 'uid-a': PO_REZERVE, 'uid-b': PO_REZERVE } }),
    );
    expect(vysledek.tastings.map((one) => one.id)).toEqual(['zive']);
  });

  it('nechá ho, dokud se některý telefon po smazání nepřipojil', () => {
    const vysledek = uklidNahrobky(
      domacnost({ memberSeenAt: { 'uid-a': PO_REZERVE, 'uid-b': PRED_REZERVOU } }),
    );
    expect(vysledek.tastings.map((one) => one.id)).toEqual(['zive', 'smazane']);
  });

  it('nechá ho, když o některém členovi není záznam vůbec', () => {
    const vysledek = uklidNahrobky(domacnost({ memberSeenAt: { 'uid-a': PO_REZERVE } }));
    expect(vysledek.tastings).toHaveLength(2);
  });

  it('bez členů (jen v telefonu) neuklízí nic', () => {
    const vysledek = uklidNahrobky(domacnost({ members: [], memberSeenAt: {} }));
    expect(vysledek.tastings).toHaveLength(2);
  });

  it('živé ochutnávky nechá vždycky, i ty staré', () => {
    const stav = domacnost({
      tastings: [ochutnavka({ id: 'stara', createdAt: 0 })],
      memberSeenAt: { 'uid-a': PO_REZERVE, 'uid-b': PO_REZERVE },
    });
    expect(uklidNahrobky(stav).tastings).toHaveLength(1);
  });

  it('dva telefony ze stejných dat vyčistí totéž, takže se nepřetahují', () => {
    // Telefon A už uklidil, telefon B má náhrobek ještě u sebe.
    const spolecne = { memberSeenAt: { 'uid-a': PO_REZERVE, 'uid-b': PO_REZERVE } };
    const telefonA = uklidNahrobky(domacnost(spolecne));
    const telefonB = domacnost(spolecne);
    const uB = uklidNahrobky(mergeHouseholdState(telefonB, telefonA));
    const uA = uklidNahrobky(mergeHouseholdState(telefonA, uB));
    // Oba skončí u téhož stavu a náhrobek se nevrátí ani jednomu.
    expect(otiskStavu(uA)).toBe(otiskStavu(uB));
    expect(uB.tastings.map((one) => one.id)).toEqual(['zive']);
    // A další kolo už nic nemění.
    expect(otiskStavu(uklidNahrobky(mergeHouseholdState(uA, uB)))).toBe(otiskStavu(uB));
  });
});

describe('velikost dokumentu', () => {
  it('prázdná domácnost je hluboko pod limitem', () => {
    expect(zaplneni(emptyHouseholdState())).toBeLessThan(0.01);
  });

  it('počítá v bajtech UTF-8, ne ve znacích', () => {
    const ascii = domacnost({ tastings: [ochutnavka({ note: 'aaaa' })] });
    const cesky = domacnost({ tastings: [ochutnavka({ note: 'čččč' })] });
    expect(velikostDokumentu(cesky) - velikostDokumentu(ascii)).toBe(4);
  });

  it('pět tisíc ochutnávek s poznámkou limit překročí', () => {
    // Tohle je důvod, proč měřidlo existuje: odhad z kontroly 24. 9. 2026.
    const tastings = Array.from({ length: 5000 }, (_, i) =>
      ochutnavka({ id: `ev-${String(i).padStart(4, '0')}-${'x'.repeat(30)}`, note: 'Chutnalo, ale hodně se mazala.' }),
    );
    const stav = domacnost({ tastings });
    expect(velikostDokumentu(stav)).toBeGreaterThan(LIMIT_DOKUMENTU);
    expect(zaplneni(stav)).toBeGreaterThan(1);
  });
});
