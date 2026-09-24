import { describe, expect, it } from 'vitest';
import { catalog } from '../../src/data';
import { safetyRules } from '../../src/safety/rules';
import type { Catalog, Ingredient, SourceRef, TemaZdroje } from '../../src/types';
import {
  DATUM_PRAVIDLA_TEMAT,
  MAX_STARI_MESICU,
  STROP_NEDOLOZENYCH,
  ZAVAZNOST_TEMAT,
  dolozeniPodleTemat,
  nedolozenaTvrzeni,
  pouzitiDomen,
  pouzitiUrl,
  stariVMesicich,
  zkontrolujZdroje,
} from '../../src/safety/zdroje';

function zdroj(url: string, accessedAt = '2026-09-12', doklada?: TemaZdroje[]): SourceRef {
  return {
    org: 'NHS',
    title: 'Test',
    url,
    accessedAt,
    tier: 1,
    ...(doklada === undefined ? {} : { doklada }),
  };
}

function surovina(
  id: string,
  sources: SourceRef[],
  rizika: Partial<Pick<Ingredient, 'hazards' | 'allergens' | 'chokingRisk'>> = {},
): Ingredient {
  // `nameCz` tu není kosmetika: podle něj pravidla poznají surovinu od receptu.
  return {
    id,
    nameCz: id,
    sources,
    hazards: [],
    allergens: [],
    chokingRisk: 'low',
    ...rizika,
  } as unknown as Ingredient;
}

function katalog(ingredients: Ingredient[]): Catalog {
  return { ingredients, recipes: [], guides: [] } as unknown as Catalog;
}

/**
 * Zdroje se měří napříč katalogem, ne po položkách.
 *
 * Audit 17. 9. 2026 našel 91 % odkazů na jediné doméně a nikdo si toho
 * nevšiml, protože každá jednotlivá položka pravidly procházela.
 */
describe('pouzitiUrl', () => {
  it('počítá položky, ne výskyty', () => {
    // Surovina, která tentýž odkaz uvede dvakrát, je pořád jedna doložená
    // surovina. Jinak by šlo strop obejít opakováním.
    const stejny = 'https://www.nhs.uk/a/';
    const c = katalog([surovina('a', [zdroj(stejny), zdroj(stejny)])]);
    expect(pouzitiUrl(c)[0]?.polozek).toBe(1);
  });

  it('řadí od nejvytíženějšího odkazu', () => {
    const c = katalog([
      surovina('a', [zdroj('https://www.nhs.uk/a/')]),
      surovina('b', [zdroj('https://www.nhs.uk/b/'), zdroj('https://www.nhs.uk/a/')]),
    ]);
    expect(pouzitiUrl(c).map((z) => z.polozek)).toEqual([2, 1]);
  });

  it('u odkazu drží nejstarší datum ověření', () => {
    // Mladší ověření jiné položky nesmí schovat, že jinde stojí odkaz
    // ověřený před dvěma roky.
    const url = 'https://www.nhs.uk/a/';
    const c = katalog([
      surovina('a', [zdroj(url, '2026-09-12')]),
      surovina('b', [zdroj(url, '2024-01-05')]),
    ]);
    expect(pouzitiUrl(c)[0]?.overeno).toBe('2024-01-05');
  });
});

describe('pouzitiDomen', () => {
  it('sloučí www a bez www', () => {
    const c = katalog([
      surovina('a', [zdroj('https://www.nhs.uk/a/')]),
      surovina('b', [zdroj('https://nhs.uk/b/')]),
    ]);
    expect(pouzitiDomen(c)).toEqual([{ domena: 'nhs.uk', polozek: 2, url: 2 }]);
  });

  it('položku na doméně započítá jednou, i když z ní cituje tři stránky', () => {
    const c = katalog([
      surovina('a', [
        zdroj('https://www.nhs.uk/a/'),
        zdroj('https://www.nhs.uk/b/'),
        zdroj('https://www.nhs.uk/c/'),
      ]),
    ]);
    expect(pouzitiDomen(c)[0]).toEqual({ domena: 'nhs.uk', polozek: 1, url: 3 });
  });
});

describe('stariVMesicich', () => {
  it('počítá celé měsíce', () => {
    expect(stariVMesicich('2026-09-12', '2026-09-12')).toBe(0);
    expect(stariVMesicich('2026-09-12', '2027-09-11')).toBe(11);
    expect(stariVMesicich('2026-09-12', '2027-09-12')).toBe(12);
    expect(stariVMesicich('2026-09-12', '2027-10-13')).toBe(13);
  });

  it('nespadne na nesmyslném datu', () => {
    expect(stariVMesicich('včera', '2026-09-12')).toBe(0);
  });
});

describe('zkontrolujZdroje', () => {
  it('obecná stránka smí dokládat libovolně mnoho obecných tvrzení', () => {
    // Strop počtu položek na odkaz byl 24. 9. 2026 nahrazen doložením
    // rizikových tvrzení. Obecná tvrzení o přípravě obecná stránka unese.
    const url = 'https://www.nhs.uk/vse/';
    const mnoho = Array.from({ length: 400 }, (_, i) => surovina(`s${i}`, [zdroj(url)]));
    expect(zkontrolujZdroje(katalog(mnoho), '2026-09-12')).toEqual([]);
  });

  it('varuje u odkazu staršího než rok', () => {
    const c = katalog([surovina('a', [zdroj('https://www.nhs.uk/a/', '2025-01-01')])]);
    const nalezy = zkontrolujZdroje(c, '2026-09-12');
    expect(nalezy.map((n) => n.ruleId)).toEqual(['source-freshness']);
    expect(nalezy[0]?.message).toContain('2025-01-01');
  });

  it('čerstvý odkaz projde', () => {
    const c = katalog([surovina('a', [zdroj('https://www.nhs.uk/a/', '2026-09-01')])]);
    expect(zkontrolujZdroje(c, '2026-09-12')).toEqual([]);
  });

  it('stáří odkazu je varování, ne chyba', () => {
    // Znovu přečíst desítky stránek nespraví jeden commit. Vidět to má
    // být, build kvůli tomu padat nemá.
    for (const nalez of zkontrolujZdroje(catalog, '2030-01-01')) {
      if (nalez.ruleId === 'source-freshness') expect(nalez.severity).toBe('warning');
    }
  });

  it('skutečný katalog nemá prošlé odkazy', () => {
    // Kdyby tohle přestalo platit, znamená to, že se katalog plnil
    // odkazy ověřenými před rokem — přesně to, co má pravidlo chytat.
    const dnes = new Date().toISOString().slice(0, 10);
    const druhy = new Set(zkontrolujZdroje(catalog, dnes).map((n) => n.ruleId));
    expect(druhy.has('source-freshness')).toBe(false);
  });

  it('lhůta je číslo, ne nekonečno', () => {
    expect(MAX_STARI_MESICU).toBeGreaterThan(0);
  });
});

/**
 * Riziková tvrzení musí mít zdroj, který o daném riziku mluví
 * (docs/BEZPECNOST.md kap. 1, rozhodnutí 24. 9. 2026).
 */
describe('claim-source-topic', () => {
  const cerstve = DATUM_PRAVIDLA_TEMAT;

  it('hazard bez zdroje se štítkem je nedoložený', () => {
    const c = katalog([surovina('med', [zdroj('https://www.nhs.uk/a/')], { hazards: ['botulismus'] })]);
    expect(nedolozenaTvrzeni(c)).toEqual([{ surovina: 'med', tema: 'botulismus' }]);
    const nalez = zkontrolujZdroje(c, cerstve).find((n) => n.ruleId === 'claim-source-topic');
    expect(nalez?.message).toContain('botulismus');
    expect(nalez?.severity).toBe(ZAVAZNOST_TEMAT);
  });

  it('zdroj se správným štítkem tvrzení doloží', () => {
    const c = katalog([
      surovina('med', [zdroj('https://www.nhs.uk/a/', cerstve, ['botulismus'])], {
        hazards: ['botulismus'],
      }),
    ]);
    expect(nedolozenaTvrzeni(c)).toEqual([]);
    expect(zkontrolujZdroje(c, cerstve)).toEqual([]);
  });

  it('štítek jiného tématu nestačí', () => {
    const c = katalog([
      surovina('med', [zdroj('https://www.nhs.uk/a/', cerstve, ['sul'])], { hazards: ['botulismus'] }),
    ]);
    expect(nedolozenaTvrzeni(c)).toHaveLength(1);
  });

  it('alergen i vysoké riziko dušení jsou riziková tvrzení', () => {
    const c = katalog([
      surovina('arasidy', [zdroj('https://www.nhs.uk/a/')], {
        allergens: ['arasidy'],
        chokingRisk: 'high',
      }),
    ]);
    expect(nedolozenaTvrzeni(c).map((n) => n.tema).sort()).toEqual(['arasidy', 'duseni']);
  });

  it('nízké a střední riziko dušení zdroj s tématem nepotřebuje', () => {
    const c = katalog([surovina('jablko', [zdroj('https://www.nhs.uk/a/')], { chokingRisk: 'medium' })]);
    expect(nedolozenaTvrzeni(c)).toEqual([]);
  });

  it('štítek u stránky přečtené před zavedením pravidla je chyba', () => {
    const c = katalog([
      surovina('med', [zdroj('https://www.nhs.uk/a/', '2026-09-12', ['botulismus'])], {
        hazards: ['botulismus'],
      }),
    ]);
    const nalez = zkontrolujZdroje(c, cerstve).find((n) => n.ruleId === 'source-topic-reread');
    expect(nalez?.severity).toBe('error');
  });

  it('tatáž stránka s různými štítky je chyba', () => {
    const url = 'https://www.nhs.uk/a/';
    const c = katalog([
      surovina('med', [zdroj(url, cerstve, ['botulismus'])]),
      surovina('sul', [zdroj(url, cerstve, ['sul'])]),
    ]);
    const nalez = zkontrolujZdroje(c, cerstve).find((n) => n.ruleId === 'source-topic-consistent');
    expect(nalez?.severity).toBe('error');
  });

  it('přehled po tématech sečte suroviny a doložené', () => {
    const c = katalog([
      surovina('a', [zdroj('https://x/', cerstve, ['sul'])], { hazards: ['sul'] }),
      surovina('b', [zdroj('https://y/')], { hazards: ['sul'] }),
    ]);
    expect(dolozeniPodleTemat(c)).toEqual([{ tema: 'sul', surovin: 2, dolozeno: 1 }]);
  });

  it('skutečný katalog nepřekročí strop nedoložených tvrzení (západka)', () => {
    // Číslo STROP_NEDOLOZENYCH se po každé dávce snižuje na nový stav.
    // Když tenhle test spadne, přibylo rizikové tvrzení bez doložení:
    // doplň zdroj, nezvyšuj strop.
    expect(nedolozenaTvrzeni(catalog).length).toBeLessThanOrEqual(STROP_NEDOLOZENYCH);
  });

  it('skutečný katalog nemá chyby ve štítcích', () => {
    const chyby = zkontrolujZdroje(catalog, DATUM_PRAVIDLA_TEMAT).filter((n) => n.severity === 'error');
    expect(chyby.map((n) => n.message)).toEqual([]);
  });
});

/**
 * Idčka musí být jedinečná.
 *
 * Katalog hlásil 494 receptů, ale dva páry sdílely idčko: dva recepty
 * byly z adresy `/recepty/:id` nedosažitelné a v seznamu se překreslovaly
 * pod stejným klíčem. Objevilo se to až při stavbě hledacího indexu,
 * protože ten ukládá výsledky do množiny idček.
 */
describe('unique-ids', () => {
  it('skutečný katalog má jedinečná idčka', () => {
    for (const [kind, polozky] of [
      ['surovina', catalog.ingredients],
      ['recept', catalog.recipes],
    ] as const) {
      const videna = new Map<string, number>();
      for (const p of polozky) videna.set(p.id, (videna.get(p.id) ?? 0) + 1);
      const duplicity = [...videna].filter(([, n]) => n > 1).map(([id]) => id);
      expect(duplicity, `${kind}: duplicitní idčka`).toEqual([]);
    }
  });

  it('pravidlo duplicitu nahlásí jako chybu, ne varování', () => {
    const pravidlo = safetyRules.find((r) => r.id === 'unique-ids');
    expect(pravidlo).toBeDefined();
    expect(pravidlo?.severity).toBe('error');
    const dvakrat = katalog([
      surovina('mrkev', [zdroj('https://www.nhs.uk/a/')]),
      surovina('mrkev', [zdroj('https://www.nhs.uk/a/')]),
    ]);
    const zprava = pravidlo?.check(dvakrat.ingredients[0] as Ingredient, dvakrat);
    expect(zprava).toContain('mrkev');
  });
});
