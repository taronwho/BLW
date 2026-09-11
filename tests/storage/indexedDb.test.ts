// @vitest-environment jsdom
import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it } from 'vitest';
import { IndexedDbAdapter } from '../../src/storage/indexedDb';
import { emptyHouseholdState } from '../../src/sync/merge';
import type { StoredHousehold } from '../../src/storage/types';

function stored(childName: string, updatedAt: number): StoredHousehold {
  return { state: { ...emptyHouseholdState(), childName }, updatedAt };
}

describe('lokální režim nad IndexedDB', () => {
  let adapter: IndexedDbAdapter;

  beforeEach(() => {
    adapter = new IndexedDbAdapter();
  });

  it('na prázdném zařízení vrátí null, ne chybu', async () => {
    await expect(adapter.load()).resolves.toBeNull();
  });

  it('uloží a načte stav domácnosti', async () => {
    await adapter.save(stored('Anna', 1_000));
    const loaded = await adapter.load();
    expect(loaded?.state.childName).toBe('Anna');
    expect(loaded?.updatedAt).toBe(1_000);
  });

  it('přepíše předchozí zápis', async () => {
    await adapter.save(stored('Anna', 1_000));
    await adapter.save(stored('Anna Marie', 2_000));
    expect((await adapter.load())?.state.childName).toBe('Anna Marie');
  });

  it('uvědomí posluchače o zápisu', async () => {
    const seen: string[] = [];
    const unsubscribe = adapter.subscribe((value) => seen.push(value.state.childName));

    await adapter.save(stored('Anna', 1_000));
    unsubscribe();
    await adapter.save(stored('Po odhlášení', 2_000));

    expect(seen).toEqual(['Anna']);
  });
});
