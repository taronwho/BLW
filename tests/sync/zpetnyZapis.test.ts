// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { StoredHousehold } from '../../src/storage/types';

/**
 * Dokument domácnosti se zapisuje celý. Když dva telefony zapisovaly
 * offline, druhý zápis přepsal první. Telefon, který o přepsaném záznamu
 * ví, ho musí po sloučení vrátit na server — jinak ho druhý rodič neuvidí
 * a při ztrátě telefonu je pryč (kontrola aplikace 24. 9. 2026, nález 1).
 */

const zapisyNaServer: StoredHousehold[] = [];
let poslouchac: ((stored: StoredHousehold) => void) | null = null;

vi.mock('../../src/storage/firebaseConfig', () => ({
  loadFirebaseConfig: () => ({
    apiKey: 'a',
    authDomain: 'b',
    projectId: 'c',
    storageBucket: 'd',
    messagingSenderId: 'e',
    appId: 'f',
  }),
  hasFirebaseConfig: () => true,
}));

vi.mock('../../src/storage/firebase', () => ({
  connectFirebase: async () => ({ app: {}, auth: {}, db: {}, uid: 'uid-a' }),
  // Anonymní souhrn pro přehled o používání test nezajímá.
  zapisSouhrn: async (): Promise<void> => undefined,
  FirestoreAdapter: class {
    async load(): Promise<StoredHousehold | null> {
      return null;
    }
    async save(stored: StoredHousehold): Promise<void> {
      zapisyNaServer.push(stored);
    }
    subscribe(listener: (stored: StoredHousehold) => void): () => void {
      poslouchac = listener;
      return () => undefined;
    }
    close(): void {
      // Nic k uklízení.
    }
  },
}));

vi.mock('../../src/storage/indexedDb', () => ({
  IndexedDbAdapter: class {
    async load(): Promise<StoredHousehold | null> {
      return null;
    }
    async save(): Promise<void> {
      // Lokální zápis v testu nezajímá.
    }
    subscribe(): () => void {
      return () => undefined;
    }
    close(): void {
      // Nic k uklízení.
    }
  },
}));

async function pripravStore(): Promise<
  typeof import('../../src/storage/householdStore')['useHouseholdStore']
> {
  vi.resetModules();
  window.localStorage.setItem('blw.household.code.v1', 'ABCD1234');
  const { useHouseholdStore } = await import('../../src/storage/householdStore');
  await useHouseholdStore.getState().init();
  return useHouseholdStore;
}

async function chvili(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 10));
}

beforeEach(() => {
  zapisyNaServer.length = 0;
  poslouchac = null;
});

describe('zpětný zápis po sloučení', () => {
  it('ochutnávka, kterou server přepsal, se na server vrátí', async () => {
    const store = await pripravStore();
    await store.getState().recordTasting({
      ingredientId: 'mrkev',
      date: '2026-09-20',
      amount: 'ochutnala',
      reaction: 'zadna',
      createdBy: 'uid-a',
    });
    const moje = store.getState().state.tastings[0];
    expect(moje).toBeDefined();
    if (moje === undefined) return;

    // Druhý telefon zapsal offline svou ochutnávku a přepsal dokument.
    const serverovy = {
      ...store.getState().state,
      tastings: [{ ...moje, id: 'cizi', ingredientId: 'hruska', createdBy: 'uid-b' }],
    };
    const pred = zapisyNaServer.length;
    poslouchac?.({ state: serverovy, updatedAt: Date.now() });
    await chvili();

    const vraceno = zapisyNaServer.slice(pred);
    expect(vraceno).toHaveLength(1);
    const naServeru = vraceno[0]?.state.tastings.map((one) => one.ingredientId).sort();
    expect(naServeru).toEqual(['hruska', 'mrkev']);
  });

  it('když server sloučený stav už má, nezapisuje se nic', async () => {
    const store = await pripravStore();
    await store.getState().recordTasting({
      ingredientId: 'mrkev',
      date: '2026-09-20',
      amount: 'ochutnala',
      reaction: 'zadna',
      createdBy: 'uid-a',
    });
    const pred = zapisyNaServer.length;
    // Ozvěna vlastního zápisu, klidně s jinak seřazenými klíči.
    const ozvena = JSON.parse(JSON.stringify(store.getState().state)) as StoredHousehold['state'];
    poslouchac?.({ state: ozvena, updatedAt: Date.now() });
    await chvili();
    expect(zapisyNaServer.length).toBe(pred);
  });

  it('po vrácení se telefony nepřetahují', async () => {
    const store = await pripravStore();
    await store.getState().recordTasting({
      ingredientId: 'mrkev',
      date: '2026-09-20',
      amount: 'ochutnala',
      reaction: 'zadna',
      createdBy: 'uid-a',
    });
    const moje = store.getState().state.tastings[0];
    if (moje === undefined) throw new Error('chybí ochutnávka');
    poslouchac?.({
      state: { ...store.getState().state, tastings: [{ ...moje, id: 'cizi' }] },
      updatedAt: Date.now(),
    });
    await chvili();
    const vraceny = zapisyNaServer.at(-1);
    if (vraceny === undefined) throw new Error('nic se nevrátilo');
    const pred = zapisyNaServer.length;
    // Server teď má sloučený stav a pošle ho zpátky.
    poslouchac?.(vraceny);
    await chvili();
    expect(zapisyNaServer.length).toBe(pred);
  });
});
