import type { HouseholdState } from '@/types';

/** Stav připojení, který se ukazuje v Nastavení (docs/SPEC.md kap. 4.6). */
export type SyncStatus =
  | { kind: 'local-only' }
  | { kind: 'connecting' }
  | { kind: 'connected'; householdCode: string; uid: string }
  | { kind: 'offline'; queued: number }
  | { kind: 'error'; message: string };

export interface StoredHousehold {
  state: HouseholdState;
  /** Čas posledního zápisu — rozhoduje last-write-wins při slučování. */
  updatedAt: number;
}

export interface StorageAdapter {
  load(): Promise<StoredHousehold | null>;
  save(stored: StoredHousehold): Promise<void>;
  /** Vrátí funkci pro odhlášení odběru. Lokální režim nic neposílá. */
  subscribe(listener: (stored: StoredHousehold) => void): () => void;
  close(): void;
}

/** Firebase web-konfigurace. Není to tajemství, ale do repozitáře nepatří. */
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export const FIREBASE_CONFIG_KEYS: readonly (keyof FirebaseConfig)[] = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];
