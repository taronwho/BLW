import type { StorageAdapter, StoredHousehold } from './types';

/**
 * Lokální režim — výchozí. Aplikace nad IndexedDB plně funguje i bez Firebase,
 * jen se nesynchronizuje (docs/SPEC.md kapitola 7).
 *
 * Vlastní tenká obálka místo knihovny: potřebujeme jeden objekt v jednom
 * store, přidávat kvůli tomu runtime závislost by bylo neúměrné.
 */

const DB_NAME = 'blw';
const DB_VERSION = 1;
const STORE = 'household';
const RECORD_KEY = 'current';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) {
        request.result.createObjectStore(STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB se nepodařilo otevřít.'));
  });
}

function runRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Zápis do IndexedDB selhal.'));
  });
}

export class IndexedDbAdapter implements StorageAdapter {
  private db: Promise<IDBDatabase> | null = null;
  private readonly listeners = new Set<(stored: StoredHousehold) => void>();

  private database(): Promise<IDBDatabase> {
    this.db ??= openDatabase();
    return this.db;
  }

  async load(): Promise<StoredHousehold | null> {
    const db = await this.database();
    const tx = db.transaction(STORE, 'readonly');
    const value = await runRequest<StoredHousehold | undefined>(
      tx.objectStore(STORE).get(RECORD_KEY),
    );
    return value ?? null;
  }

  async save(stored: StoredHousehold): Promise<void> {
    const db = await this.database();
    const tx = db.transaction(STORE, 'readwrite');
    await runRequest(tx.objectStore(STORE).put(stored, RECORD_KEY));
    // Ostatní otevřené záložky se dozvědí přes vlastní načtení; v rámci jedné
    // záložky posluchače uvědomíme rovnou.
    for (const listener of this.listeners) listener(stored);
  }

  subscribe(listener: (stored: StoredHousehold) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  close(): void {
    this.listeners.clear();
    void this.db?.then((db) => {
      db.close();
    });
    this.db = null;
  }
}
