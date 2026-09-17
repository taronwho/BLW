import { describe, expect, it } from 'vitest';
import {
  jeZNovejsiVerze,
  mergeTastings,
  prevedStav,
  SCHEMA_VERSION,
} from '../../src/sync/merge';
import { platnaOchutnavka, platneDite, popisZahozenych } from '../../src/sync/validace';

function ochutnavka(patch: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 'o1',
    ingredientId: 'brokolice',
    date: '2026-09-17',
    amount: 'ochutnala',
    reaction: 'chutnalo',
    createdBy: 'uid-1',
    createdAt: 1_726_500_000_000,
    ...patch,
  };
}

describe('platnaOchutnavka', () => {
  it('projde úplný záznam', () => {
    expect(platnaOchutnavka(ochutnavka())?.id).toBe('o1');
  });

  it.each([
    ['chybí id', { id: undefined }],
    ['prázdné id', { id: '   ' }],
    ['chybí surovina', { ingredientId: undefined }],
    ['datum není ISO', { date: '17. 9. 2026' }],
    ['datum neexistuje', { date: '2026-13-45' }],
    ['neznámé množství', { amount: 'snedla-hodne' }],
    ['neznámá reakce', { reaction: 'super' }],
    ['chybí createdAt', { createdAt: undefined }],
    ['createdAt není číslo', { createdAt: '1726500000000' }],
    ['createdAt je NaN', { createdAt: Number.NaN }],
  ])('zahodí záznam, kde %s', (_popis, patch) => {
    expect(platnaOchutnavka(ochutnavka(patch))).toBeNull();
  });

  it('zahodí i něco, co objekt vůbec není', () => {
    for (const nesmysl of [null, 'text', 42, [], undefined]) {
      expect(platnaOchutnavka(nesmysl)).toBeNull();
    }
  });

  it('nepovinná pole zahodí sama, ne celý záznam', () => {
    const event = platnaOchutnavka(ochutnavka({ childId: 42, note: 7 }));
    expect(event).not.toBeNull();
    expect(event?.childId).toBeUndefined();
    expect(event?.note).toBeUndefined();
  });

  it('prázdné createdBy nevadí — je to stopa, ne klíč', () => {
    expect(platnaOchutnavka(ochutnavka({ createdBy: undefined }))?.createdBy).toBe('');
  });

  it('nepřenese cizí pole ze souboru dál', () => {
    const event = platnaOchutnavka(ochutnavka({ skodlivePole: 'cokoli' }));
    expect(Object.hasOwn(event ?? {}, 'skodlivePole')).toBe(false);
  });
});

describe('platneDite', () => {
  it('projde dítě s datem narození', () => {
    expect(platneDite({ id: 'd1', name: 'Anežka', birthDate: '2026-03-01' })?.name).toBe('Anežka');
  });

  it('projde dítě bez vyplněného data — rodič ho doplní později', () => {
    expect(platneDite({ id: 'd1', name: '', birthDate: '' })).not.toBeNull();
  });

  it('zahodí dítě s nesmyslným datem narození', () => {
    expect(platneDite({ id: 'd1', name: 'A', birthDate: 'kdysi' })).toBeNull();
  });

  it('z alergenů vyhodí ty, které katalog nezná, a pole nechá', () => {
    const dite = platneDite({
      id: 'd1',
      name: 'A',
      birthDate: '',
      allergens: ['mleko', 'draci-ovoce', 'vejce'],
    });
    expect(dite?.allergens).toEqual(['mleko', 'vejce']);
  });

  it('zahodí neznámý úchop, ale dítě nechá', () => {
    const dite = platneDite({ id: 'd1', name: 'A', birthDate: '', grip: 'jiny' });
    expect(dite).not.toBeNull();
    expect(dite?.grip).toBeUndefined();
  });
});

describe('prevedStav', () => {
  it('spočítá, kolik ochutnávek se zahodilo', () => {
    const { stav, zahozeno } = prevedStav({
      tastings: [ochutnavka(), ochutnavka({ id: 'o2', createdAt: undefined }), 'nesmysl'],
      schemaVersion: SCHEMA_VERSION,
    });
    expect(stav.tastings).toHaveLength(1);
    expect(zahozeno.ochutnavky).toBe(2);
  });

  it('spočítá, kolik dětí se zahodilo, a náhrobek nechá projít', () => {
    const { stav, zahozeno } = prevedStav({
      children: {
        d1: { hodnota: { id: 'd1', name: 'A', birthDate: '2026-01-01' }, kdy: 1 },
        d2: { hodnota: { id: 'd2', name: 'B', birthDate: 'nesmysl' }, kdy: 2 },
        d3: { hodnota: null, kdy: 3 },
      },
      schemaVersion: SCHEMA_VERSION,
    });
    expect(Object.keys(stav.children).sort()).toEqual(['d1', 'd3']);
    expect(zahozeno.deti).toBe(1);
  });

  it('poškozený záznam nerozbije slučování', () => {
    // Přesně ten scénář, kvůli kterému validace vznikla: záznam bez
    // `createdAt` dřív prošel a porovnání ve slučování na něm ztroskotalo.
    const { stav } = prevedStav({ tastings: [ochutnavka({ createdAt: undefined })] });
    const slouceno = mergeTastings(stav.tastings, [
      platnaOchutnavka(ochutnavka({ id: 'o9' })) as never,
    ]);
    expect(slouceno).toHaveLength(1);
    expect(slouceno[0]?.id).toBe('o9');
  });

  it('na čistém stavu nic nezahodí', () => {
    const { zahozeno } = prevedStav({ tastings: [ochutnavka()], schemaVersion: SCHEMA_VERSION });
    expect(popisZahozenych(zahozeno)).toBeNull();
  });
});

describe('popisZahozenych', () => {
  it('skloňuje podle počtu', () => {
    expect(popisZahozenych({ ochutnavky: 1, deti: 0 })).toContain('1 zápis ochutnávky');
    expect(popisZahozenych({ ochutnavky: 3, deti: 0 })).toContain('3 zápisy ochutnávky');
    expect(popisZahozenych({ ochutnavky: 7, deti: 0 })).toContain('7 zápisů ochutnávky');
    expect(popisZahozenych({ ochutnavky: 0, deti: 1 })).toContain('1 dítě');
    expect(popisZahozenych({ ochutnavky: 0, deti: 2 })).toContain('2 děti');
    expect(popisZahozenych({ ochutnavky: 0, deti: 5 })).toContain('5 dětí');
  });
});

describe('jeZNovejsiVerze', () => {
  it('pozná dokument z novější verze aplikace', () => {
    expect(jeZNovejsiVerze({ schemaVersion: SCHEMA_VERSION + 1 })).toBe(true);
  });

  it('současnou ani starší verzi za novější nepovažuje', () => {
    expect(jeZNovejsiVerze({ schemaVersion: SCHEMA_VERSION })).toBe(false);
    expect(jeZNovejsiVerze({ schemaVersion: 1 })).toBe(false);
    expect(jeZNovejsiVerze({})).toBe(false);
    expect(jeZNovejsiVerze(null)).toBe(false);
  });
});
