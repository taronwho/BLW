import { describe, expect, it } from 'vitest';
import { catalog } from '../../src/data';
import { safetyRules } from '../../src/safety/rules';
import type { Catalog, Ingredient, SourceRef } from '../../src/types';
import {
  MAX_STARI_MESICU,
  STROP_POLOZEK_NA_URL,
  pouzitiDomen,
  pouzitiUrl,
  stariVMesicich,
  zkontrolujZdroje,
} from '../../src/safety/zdroje';

function zdroj(url: string, accessedAt = '2026-09-12'): SourceRef {
  return { org: 'NHS', title: 'Test', url, accessedAt, tier: 1 };
}

function surovina(id: string, sources: SourceRef[]): Ingredient {
  // `nameCz` tu není kosmetika: podle něj pravidla poznají surovinu od receptu.
  return { id, nameCz: id, sources } as unknown as Ingredient;
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
  it('varuje, když jedna stránka dokládá víc položek, než je strop', () => {
    const url = 'https://www.nhs.uk/vse/';
    const prilis = Array.from({ length: STROP_POLOZEK_NA_URL + 1 }, (_, i) =>
      surovina(`s${i}`, [zdroj(url)]),
    );
    const nalezy = zkontrolujZdroje(katalog(prilis), '2026-09-12');
    expect(nalezy.map((n) => n.ruleId)).toContain('source-url-cap');
  });

  it('na stropu ještě nevaruje', () => {
    const url = 'https://www.nhs.uk/vse/';
    const presne = Array.from({ length: STROP_POLOZEK_NA_URL }, (_, i) =>
      surovina(`s${i}`, [zdroj(url)]),
    );
    expect(zkontrolujZdroje(katalog(presne), '2026-09-12')).toEqual([]);
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

  it('nálezy o zdrojích jsou varování, nikdy chyby', () => {
    // Monokulturu zdrojů nespraví jeden commit — je to práce se skutečným
    // čtením desítek stránek. Build kvůli ní padat nemá, ale vidět má být.
    for (const nalez of zkontrolujZdroje(catalog, '2030-01-01')) {
      expect(nalez.severity, nalez.ruleId).toBe('warning');
    }
  });

  it('skutečný katalog dnes hlásí jen přetížené odkazy, ne prošlé', () => {
    // Kdyby tohle přestalo platit, znamená to, že se katalog plnil
    // odkazy ověřenými před rokem — přesně to, co má pravidlo chytat.
    const dnes = new Date().toISOString().slice(0, 10);
    const druhy = new Set(zkontrolujZdroje(catalog, dnes).map((n) => n.ruleId));
    expect(druhy.has('source-freshness')).toBe(false);
  });

  it('strop i lhůta jsou čísla, ne nekonečno', () => {
    expect(STROP_POLOZEK_NA_URL).toBeGreaterThan(0);
    expect(MAX_STARI_MESICU).toBeGreaterThan(0);
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
