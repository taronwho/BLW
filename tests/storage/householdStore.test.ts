// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { FirebaseSession } from '../../src/storage/firebase';
import type { StoredHousehold } from '../../src/storage/types';

/**
 * Start aplikace nesmí sáhnout na Firebase dvakrát.
 *
 * O `init()` žádají nezávisle hlavička, Domácnost i párovací odkaz. Když
 * běžely dva starty naráz, druhý se pokusil otevřít Firestore podruhé,
 * dostal od SDK chybu a tou přebil už navázané spojení — rodiči se po
 * zapnutí ukázala červená hláška, kterou další načtení stránky smazalo.
 */

const connectFirebase = vi.fn();
const load = vi.fn<() => Promise<StoredHousehold | null>>();
const save = vi.fn<(stored: StoredHousehold) => Promise<void>>();
const subscribe = vi.fn();

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
  connectFirebase: (...args: unknown[]) => connectFirebase(...args),
  FirestoreAdapter: class {
    async load(): Promise<StoredHousehold | null> {
      return null;
    }
    async save(): Promise<void> {
      // Vzdálený zápis v testu nezajímá.
    }
    subscribe(): () => void {
      subscribe();
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
      return load();
    }
    async save(stored: StoredHousehold): Promise<void> {
      await save(stored);
    }
    subscribe(): () => void {
      return () => undefined;
    }
    close(): void {
      // Nic k uklízení.
    }
  },
}));

async function importStore(): Promise<typeof import('../../src/storage/householdStore')> {
  vi.resetModules();
  return import('../../src/storage/householdStore');
}

beforeEach(() => {
  connectFirebase.mockReset();
  load.mockReset();
  save.mockReset();
  subscribe.mockReset();
  load.mockResolvedValue(null);
  save.mockResolvedValue(undefined);
  window.localStorage.setItem('blw.household.code.v1', 'ABCD1234');
  // Spojení se navazuje se zpožděním, ať se souběžné starty stihnou potkat.
  connectFirebase.mockImplementation(
    async (): Promise<FirebaseSession> =>
      new Promise((resolve) => {
        setTimeout(
          () =>
            resolve({
              app: {} as FirebaseSession['app'],
              auth: {} as FirebaseSession['auth'],
              db: {} as FirebaseSession['db'],
              uid: 'uid-1',
            }),
          5,
        );
      }),
  );
});

describe('start domácnosti', () => {
  it('tři obrazovky naráz otevřou spojení jen jednou', async () => {
    const { useHouseholdStore } = await importStore();
    const { init } = useHouseholdStore.getState();

    await Promise.all([init(), init(), init()]);

    expect(connectFirebase).toHaveBeenCalledTimes(1);
    expect(useHouseholdStore.getState().status.kind).toBe('connected');
  });

  it('souběžné připojení ke stejné domácnosti se sveze na prvním', async () => {
    const { useHouseholdStore } = await importStore();
    const { connect } = useHouseholdStore.getState();

    await Promise.all([connect('ABCD1234'), connect('ABCD1234')]);

    expect(connectFirebase).toHaveBeenCalledTimes(1);
  });

  it('po zapnutí se rodiči neukáže chyba', async () => {
    const { useHouseholdStore } = await importStore();
    await useHouseholdStore.getState().init();

    expect(useHouseholdStore.getState().status.kind).not.toBe('error');
  });
});

describe('hlášky o chybě synchronizace', () => {
  it('anglický text z Firebase se rodiči nikdy nezobrazí', async () => {
    const { useHouseholdStore } = await importStore();
    connectFirebase.mockRejectedValue(
      new Error(
        'initializeFirestore() has already been called with different options. To avoid this error, call getFirestore() instead.',
      ),
    );

    await useHouseholdStore.getState().init();

    const status = useHouseholdStore.getState().status;
    expect(status.kind).toBe('error');
    const message = status.kind === 'error' ? status.message : '';
    expect(message).not.toMatch(/initializeFirestore|has already been called/);
    // Hláška je česká a končí větou, ne útržkem z knihovny.
    expect(message).toMatch(/[a-záčďéěíňóřšťúůýž]\./i);
  });
});
