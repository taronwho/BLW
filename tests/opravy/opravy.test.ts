import { describe, expect, it } from 'vitest';
import { rozeberOpravy } from '../../src/data/opravyTvar';
import { pouzijOpravy, porusenaPravidla } from '../../src/data/opravy';
import { ingredients, recipes } from '../../src/data';
import type { Opravy } from '../../src/data/opravyTvar';

const SUROVINA = ingredients[0]!;
const RECEPT = recipes[0]!;

function soubor(opravy: Opravy['opravy'], verze = 1): Opravy {
  return { verze, vydano: '2026-09-21', opravy };
}

/**
 * Opravy katalogu bez nasazení jsou dvířka pro zdravotní údaj — a dvířka
 * se musí dát zamknout. Bezpečnostní vrstva je jediná autorita; původ
 * souboru neznamená nic (audit 17. 9. 2026, kapitola 10 bod 5).
 */
describe('rozeberOpravy', () => {
  it('rozebere platný soubor', () => {
    const vysledek = rozeberOpravy({
      verze: 3,
      vydano: '2026-10-01',
      opravy: [{ druh: 'surovina', id: 'mrkev', duvod: 'Upřesněno podle SZÚ.' }],
    });
    expect(vysledek?.verze).toBe(3);
    expect(vysledek?.opravy).toHaveLength(1);
  });

  it('nesmyslný obsah znamená „žádné opravy", ne pád', () => {
    for (const vstup of [null, 42, 'text', [], {}, { verze: 'x', opravy: [] }, { verze: 1 }]) {
      expect(rozeberOpravy(vstup), JSON.stringify(vstup)).toBeNull();
    }
  });

  it('záznam bez idčka, důvodu nebo druhu se zahodí, zbytek projde', () => {
    const vysledek = rozeberOpravy({
      verze: 1,
      opravy: [
        { druh: 'surovina', id: 'mrkev', duvod: 'Platné.' },
        { druh: 'surovina', id: 'mrkev' },
        { druh: 'neco', id: 'x', duvod: 'y' },
        { id: 'x', duvod: 'y' },
        null,
      ],
    });
    expect(vysledek?.opravy).toHaveLength(1);
  });
});

describe('pouzijOpravy', () => {
  it('opraví text a zapamatuje si důvod', () => {
    const vysledek = pouzijOpravy(
      soubor([
        {
          druh: 'surovina',
          id: SUROVINA.id,
          duvod: 'Upřesněno podle nového doporučení.',
          frequencyLimit: 'Nejvýš dvakrát týdně.',
        },
      ]),
    );
    expect(vysledek.suroviny.get(SUROVINA.id)?.frequencyLimit).toBe('Nejvýš dvakrát týdně.');
    expect(vysledek.duvody.get(SUROVINA.id)).toContain('Upřesněno');
    expect(vysledek.zahozeno).toEqual([]);
  });

  it('nechává netknutá pole, na která oprava nesahá', () => {
    const vysledek = pouzijOpravy(
      soubor([{ druh: 'surovina', id: SUROVINA.id, duvod: 'Jen frekvence.', frequencyLimit: 'Občas.' }]),
    );
    const opravena = vysledek.suroviny.get(SUROVINA.id);
    expect(opravena?.nameCz).toBe(SUROVINA.nameCz);
    expect(opravena?.allergens).toEqual(SUROVINA.allergens);
    expect(opravena?.minAgeMonths).toBe(SUROVINA.minAgeMonths);
  });

  it('oprava na neznámé idčko se zahodí a řekne to', () => {
    const vysledek = pouzijOpravy(
      soubor([{ druh: 'surovina', id: 'tohle-neexistuje', duvod: 'X', frequencyLimit: 'Y.' }]),
    );
    expect(vysledek.suroviny.size).toBe(0);
    expect(vysledek.zahozeno[0]).toContain('tohle-neexistuje');
  });

  it('ZAMKNUTÁ DVÍŘKA: oprava, která porušuje bezpečnostní pravidlo, neprojde', () => {
    // Přesně ten útok, kvůli kterému tahle kontrola existuje: dostat do
    // aplikace větu o medu pro miminko mimo všechny kontroly repozitáře.
    const vysledek = pouzijOpravy(
      soubor([
        {
          druh: 'surovina',
          id: SUROVINA.id,
          duvod: 'Údajné upřesnění.',
          prep: { '6m': { serving: 'Osladíme medem, dítěti to bude chutnat víc.' } },
        },
      ]),
    );
    expect(vysledek.suroviny.size).toBe(0);
    expect(vysledek.zahozeno.join(' ')).toContain('no-honey-baby');
  });

  it('zástupný text taky neprojde', () => {
    const vysledek = pouzijOpravy(
      soubor([
        { druh: 'surovina', id: SUROVINA.id, duvod: 'X', frequencyLimit: 'TODO doplnit' },
      ]),
    );
    expect(vysledek.suroviny.size).toBe(0);
    expect(vysledek.zahozeno.join(' ')).toContain('no-placeholder');
  });

  it('jedna vadná oprava nezahodí ty ostatní', () => {
    const vysledek = pouzijOpravy(
      soubor([
        { druh: 'surovina', id: SUROVINA.id, duvod: 'Dobrá.', frequencyLimit: 'Nejvýš třikrát týdně.' },
        { druh: 'surovina', id: 'neexistuje', duvod: 'Špatná.', frequencyLimit: 'Nikdy.' },
      ]),
    );
    expect(vysledek.suroviny.size).toBe(1);
    expect(vysledek.zahozeno).toHaveLength(1);
  });

  it('recept se opraví stejně jako surovina', () => {
    const vysledek = pouzijOpravy(
      soubor([
        {
          druh: 'recept',
          id: RECEPT.id,
          duvod: 'Upřesněný pokyn k dělení.',
          babySplitPoint: 'Po kroku 2 odeber dětskou porci, ještě než se zbytek dochucuje.',
        },
      ]),
    );
    expect(vysledek.recepty.get(RECEPT.id)?.babySplitPoint).toContain('Po kroku 2');
  });

  it('opravený pokyn k dělení bez čísla kroku neprojde', () => {
    // Nechytil to typ, chytilo to pravidlo `baby-split-required`: bez
    // odkazu na krok rodič u sporáku neví, kdy porci odebrat.
    const vysledek = pouzijOpravy(
      soubor([
        {
          druh: 'recept',
          id: RECEPT.id,
          duvod: 'Údajné upřesnění.',
          babySplitPoint: 'Dětskou porci odeber hned po uvaření, ještě před dochucením.',
        },
      ]),
    );
    expect(vysledek.recepty.size).toBe(0);
    expect(vysledek.zahozeno.join(' ')).toContain('baby-split-required');
  });

  it('prázdný seznam neopraví nic a nic nezahodí', () => {
    const vysledek = pouzijOpravy(soubor([]));
    expect(vysledek.suroviny.size).toBe(0);
    expect(vysledek.zahozeno).toEqual([]);
    expect(vysledek.verze).toBe(1);
  });
});

describe('porusenaPravidla', () => {
  it('nedotčený katalog prochází', () => {
    for (const polozka of [...ingredients.slice(0, 20), ...recipes.slice(0, 20)]) {
      expect(porusenaPravidla(polozka), polozka.id).toEqual([]);
    }
  });
});
