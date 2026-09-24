// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { StoredHousehold } from '../../src/storage/types';
import type { HouseholdState, TastingEvent } from '../../src/types';
import { emptyHouseholdState } from '../../src/sync/merge';
import { REZERVA_UKLIDU_MS } from '../../src/sync/velikost';

/**
 * Úklid náhrobků a hlídání limitu 1 MiB v úložišti.
 *
 * Pravidla Firestore nedovolí telefonu, který se k domácnosti teprve
 * připojuje, deník zkrátit (`nemazeDenik`). Kdyby úklid proběhl už při
 * připojení, nový telefon by se nikdy nepřipojil.
 */

const SMAZANO = Date.parse('2026-06-01T10:00:00Z');
const zapisyNaServer: StoredHousehold[] = [];
let naServeru: StoredHousehold | null = null;
let uid = 'uid-novy';

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
  connectFirebase: async () => ({ app: {}, auth: {}, db: {}, uid }),
  zapisSouhrn: async (): Promise<void> => undefined,
  FirestoreAdapter: class {
    async load(): Promise<StoredHousehold | null> {
      return naServeru;
    }
    async save(stored: StoredHousehold): Promise<void> {
      zapisyNaServer.push(stored);
    }
    subscribe(): () => void {
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

function ochutnavka(over: Partial<TastingEvent>): TastingEvent {
  return {
    id: 'ev',
    ingredientId: 'brokolice',
    date: '2026-05-30',
    amount: 'ochutnala',
    reaction: 'zadna',
    createdBy: 'uid-a',
    createdAt: SMAZANO,
    ...over,
  };
}

/** Domácnost, kde o smazání už ví každý dosavadní člen. */
function serverSNahrobkem(clenove: string[]): StoredHousehold {
  const pozdeji = SMAZANO + REZERVA_UKLIDU_MS + 1000;
  const state: HouseholdState = {
    ...emptyHouseholdState(),
    members: clenove,
    memberSeenAt: Object.fromEntries(clenove.map((one) => [one, pozdeji])),
    tastings: [ochutnavka({ id: 'zive' }), ochutnavka({ id: 'smazane', deleted: true })],
  };
  return { state, updatedAt: pozdeji };
}

async function pripoj(): Promise<
  typeof import('../../src/storage/householdStore')['useHouseholdStore']
> {
  vi.resetModules();
  window.localStorage.setItem('blw.household.code.v1', 'ABCD1234');
  const { useHouseholdStore } = await import('../../src/storage/householdStore');
  await useHouseholdStore.getState().init();
  return useHouseholdStore;
}

beforeEach(() => {
  zapisyNaServer.length = 0;
});

describe('úklid náhrobků v úložišti', () => {
  it('nový telefon při připojení deník nezkrátí, jinak by ho pravidla odmítla', async () => {
    uid = 'uid-novy';
    naServeru = serverSNahrobkem(['uid-a']);
    await pripoj();
    const pripojovaci = zapisyNaServer[0];
    expect(pripojovaci?.state.tastings.map((one) => one.id).sort()).toEqual(['smazane', 'zive']);
  });

  it('člen domácnosti náhrobek, o kterém všichni vědí, uklidí', async () => {
    uid = 'uid-a';
    naServeru = serverSNahrobkem(['uid-a']);
    const store = await pripoj();
    expect(zapisyNaServer[0]?.state.tastings.map((one) => one.id)).toEqual(['zive']);
    expect(store.getState().state.tastings.map((one) => one.id)).toEqual(['zive']);
  });
});

describe('limit dokumentu', () => {
  it('ukazatel zaplnění se po připojení nastaví', async () => {
    uid = 'uid-a';
    naServeru = serverSNahrobkem(['uid-a']);
    const store = await pripoj();
    const podil = store.getState().zaplneni;
    expect(podil).not.toBeNull();
    expect(podil ?? 1).toBeLessThan(0.01);
  });

  it('přes limit se na server nezapisuje a rodič dostane srozumitelnou hlášku', async () => {
    uid = 'uid-a';
    naServeru = serverSNahrobkem(['uid-a']);
    const store = await pripoj();
    const pred = zapisyNaServer.length;
    const plno = 'x'.repeat(1_100_000);
    await store.getState().setRecipeNote('recept-1', plno);
    expect(zapisyNaServer.length).toBe(pred);
    expect(store.getState().zaplneni ?? 0).toBeGreaterThan(1);
    const status = store.getState().status;
    expect(status.kind).toBe('error');
    if (status.kind === 'error') expect(status.message).toMatch(/plná/);
    // V telefonu zůstalo všechno.
    expect(store.getState().state.recipeNotes['recept-1']?.hodnota).toBe(plno);
  });
});
