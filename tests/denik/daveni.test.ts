import { describe, expect, it } from 'vitest';
import {
  OKNO_OPAKOVANI_DNU,
  PRAH_OPAKOVANI,
  TYDNU_ZPET,
  podilDaveni,
  souhrnDaveni,
} from '../../src/app/lib/daveni';
import { draftPayload, draftZUdalosti, emptyDraft } from '../../src/app/lib/tastingDraft';
import type { TastingEvent } from '../../src/types';

let poradi = 0;
function udalost(
  ingredientId: string,
  date: string,
  davilo = false,
  over: Partial<TastingEvent> = {},
): TastingEvent {
  poradi += 1;
  return {
    id: `e${poradi}`,
    ingredientId,
    date,
    amount: 'ochutnala',
    reaction: 'zadna',
    createdBy: 'u1',
    createdAt: poradi,
    ...(davilo ? { davilo: true } : {}),
    ...over,
  };
}

const DNES = '2026-09-27';

describe('souhrnDaveni', () => {
  it('bez záznamů vrátí prázdné týdny a nic opakovaného', () => {
    const souhrn = souhrnDaveni([], DNES);
    expect(souhrn.celkem).toBe(0);
    expect(souhrn.tydny).toHaveLength(TYDNU_ZPET);
    expect(souhrn.tydny.every((tyden) => tyden.ochutnavek === 0)).toBe(true);
    expect(souhrn.opakovane).toEqual([]);
  });

  it('poslední týden končí dneškem a týdny na sebe navazují', () => {
    const { tydny } = souhrnDaveni([], DNES);
    expect(tydny.at(-1)?.do).toBe(DNES);
    expect(tydny.at(-1)?.od).toBe('2026-09-21');
    expect(tydny[0]?.od).toBe('2026-08-31');
    for (let i = 1; i < tydny.length; i += 1) {
      const predchozi = new Date(`${tydny[i - 1]?.do ?? ''}T00:00:00Z`).getTime();
      const tento = new Date(`${tydny[i]?.od ?? ''}T00:00:00Z`).getTime();
      expect(tento - predchozi).toBe(86_400_000);
    }
  });

  it('počítá podíl z ochutnávek v týdnu, ne jen počet dávení', () => {
    const souhrn = souhrnDaveni(
      [
        udalost('jablko', '2026-09-22', true),
        udalost('mrkev', '2026-09-23'),
        udalost('brokolice', '2026-09-24'),
        udalost('banan', '2026-09-25'),
      ],
      DNES,
    );
    const posledni = souhrn.tydny.at(-1);
    expect(posledni).toMatchObject({ ochutnavek: 4, daveni: 1 });
    expect(podilDaveni(posledni ?? { od: '', do: '', ochutnavek: 0, daveni: 0 })).toBe(25);
  });

  it('prázdný týden nemá podíl, ne nulu', () => {
    expect(podilDaveni({ od: 'a', do: 'b', ochutnavek: 0, daveni: 0 })).toBeNull();
  });

  it('přes přechod na zimní čas se týdny neposunou', () => {
    const { tydny } = souhrnDaveni([udalost('jablko', '2026-10-25', true)], '2026-10-27');
    expect(tydny.at(-1)).toMatchObject({ od: '2026-10-21', do: '2026-10-27', daveni: 1 });
  });

  it('smazané a budoucí záznamy do týdnů nepočítá', () => {
    const souhrn = souhrnDaveni(
      [
        udalost('jablko', '2026-09-26', true, { deleted: true }),
        udalost('jablko', '2026-09-30', true),
      ],
      DNES,
    );
    expect(souhrn.tydny.every((tyden) => tyden.ochutnavek === 0)).toBe(true);
    expect(souhrn.opakovane).toEqual([]);
    // Budoucí dávení je pořád zapsané dávení; smazané ne.
    expect(souhrn.celkem).toBe(1);
  });

  it(`opakování hlásí od ${PRAH_OPAKOVANI} dávení u téže suroviny v okně`, () => {
    const souhrn = souhrnDaveni(
      [
        udalost('jablko', '2026-09-10', true),
        udalost('jablko', '2026-09-20', true),
        udalost('jablko', '2026-09-21'),
        udalost('mrkev', '2026-09-25', true),
      ],
      DNES,
    );
    expect(souhrn.opakovane).toEqual([
      { ingredientId: 'jablko', pocet: 2, posledni: '2026-09-20' },
    ]);
  });

  it(`dávení starší než ${OKNO_OPAKOVANI_DNU} dní se do opakování nepočítá`, () => {
    const souhrn = souhrnDaveni(
      [udalost('jablko', '2026-08-30', true), udalost('jablko', '2026-09-26', true)],
      DNES,
    );
    expect(souhrn.opakovane).toEqual([]);
    expect(souhrn.celkem).toBe(2);
  });

  it('řadí opakované od nejčastějšího', () => {
    const souhrn = souhrnDaveni(
      [
        udalost('mrkev', '2026-09-20', true),
        udalost('mrkev', '2026-09-21', true),
        udalost('jablko', '2026-09-22', true),
        udalost('jablko', '2026-09-23', true),
        udalost('jablko', '2026-09-24', true),
      ],
      DNES,
    );
    expect(souhrn.opakovane.map((polozka) => polozka.ingredientId)).toEqual(['jablko', 'mrkev']);
  });
});

describe('rozepsaná ochutnávka a dávení', () => {
  it('prázdný zápis nedávil', () => {
    expect(emptyDraft().davilo).toBe(false);
    expect(draftPayload(emptyDraft()).davilo).toBeUndefined();
  });

  it('zaškrtnuté dávení se uloží jako true', () => {
    expect(draftPayload({ ...emptyDraft(), davilo: true }).davilo).toBe(true);
  });

  it('úprava záznamu dávení umí i odškrtnout', () => {
    const puvodni = udalost('jablko', DNES, true);
    const draft = draftZUdalosti(puvodni);
    expect(draft.davilo).toBe(true);
    const payload = draftPayload({ ...draft, davilo: false });
    // Klíč tam je, jen s undefined: spread v `updateTasting` tím staré true přepíše.
    expect(Object.hasOwn(payload, 'davilo')).toBe(true);
    expect({ ...puvodni, ...payload }.davilo).toBeUndefined();
  });
});
