import { create } from 'zustand';
import type { Grip, HouseholdState, ReadySign, TastingEvent } from '@/types';
import {
  emptyHouseholdState,
  mergeHouseholdState,
  newTastingId,
  SCHEMA_VERSION,
} from '@/sync/merge';
import { generateHouseholdCode, normalizeHouseholdCode } from '@/sync/householdCode';
import { IndexedDbAdapter } from './indexedDb';
import { connectFirebase, FirestoreAdapter } from './firebase';
import { loadFirebaseConfig } from './firebaseConfig';
import type { StorageAdapter, StoredHousehold, SyncStatus } from './types';

/**
 * Fasáda nad oběma režimy úložiště. Lokální IndexedDB je vždycky zdrojem
 * pravdy pro tohle zařízení; Firestore je navrch a přes `mergeHouseholdState`
 * se do lokálního stavu slévá, takže offline změny se neztratí.
 */

const CODE_STORAGE_KEY = 'blw.household.code.v1';

interface HouseholdStore {
  ready: boolean;
  state: HouseholdState;
  updatedAt: number;
  status: SyncStatus;
  householdCode: string | null;

  init(): Promise<void>;
  connect(code?: string): Promise<void>;
  disconnect(): void;
  createHousehold(): Promise<string>;
  setChild(name: string, birthDate: string): Promise<void>;
  setGrip(grip: Grip | undefined): Promise<void>;
  toggleReadySign(sign: ReadySign): Promise<void>;
  recordTasting(event: Omit<TastingEvent, 'id' | 'createdAt'>): Promise<void>;
  updateTasting(id: string, patch: Partial<Omit<TastingEvent, 'id'>>): Promise<void>;
  deleteTasting(id: string): Promise<void>;
  toggleFavorite(id: string): Promise<void>;
  setRecipeNote(recipeId: string, note: string): Promise<void>;
  importState(state: HouseholdState): Promise<void>;
}

let localAdapter: StorageAdapter | null = null;
let remoteAdapter: StorageAdapter | null = null;
let remoteUnsubscribe: (() => void) | null = null;

function local(): StorageAdapter {
  localAdapter ??= new IndexedDbAdapter();
  return localAdapter;
}

function readStoredCode(): string | null {
  try {
    return window.localStorage.getItem(CODE_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredCode(code: string | null): void {
  try {
    if (code === null) window.localStorage.removeItem(CODE_STORAGE_KEY);
    else window.localStorage.setItem(CODE_STORAGE_KEY, code);
  } catch {
    // Bez localStorage se kód po zavření aplikace zapomene — vada na kráse,
    // ne důvod k pádu.
  }
}

export const useHouseholdStore = create<HouseholdStore>((set, get) => {
  /** Uloží nový stav lokálně a, když je připojeno, i do Firestore. */
  async function persist(next: HouseholdState): Promise<void> {
    const stored: StoredHousehold = { state: next, updatedAt: Date.now() };
    set({ state: next, updatedAt: stored.updatedAt });
    await local().save(stored);
    if (remoteAdapter === null) return;
    try {
      await remoteAdapter.save(stored);
    } catch (error) {
      // Offline zápisy drží Firestore ve vlastní frontě; sem se dostaneme
      // jen při skutečné chybě (např. zamítnutá pravidla).
      set({ status: { kind: 'error', message: describeError(error) } });
    }
  }

  return {
    ready: false,
    state: emptyHouseholdState(),
    updatedAt: 0,
    status: { kind: 'local-only' },
    householdCode: null,

    async init(): Promise<void> {
      const stored = await local().load();
      set({
        ready: true,
        state: stored?.state ?? emptyHouseholdState(),
        updatedAt: stored?.updatedAt ?? 0,
        householdCode: readStoredCode(),
      });

      const code = readStoredCode();
      if (code !== null && loadFirebaseConfig() !== null) {
        await get().connect(code);
      }
    },

    async connect(code?: string): Promise<void> {
      const config = loadFirebaseConfig();
      if (config === null) {
        set({ status: { kind: 'local-only' } });
        return;
      }
      const householdId = normalizeHouseholdCode(code ?? get().householdCode ?? '');
      if (householdId.length === 0) {
        set({ status: { kind: 'local-only' } });
        return;
      }

      set({ status: { kind: 'connecting' } });
      try {
        const session = await connectFirebase(config);
        const adapter = new FirestoreAdapter(session, householdId);
        remoteAdapter = adapter;
        writeStoredCode(householdId);

        const remote = await adapter.load();
        const localState = get().state;
        if (remote !== null) {
          const merged = mergeHouseholdState(localState, remote.state, {
            localUpdatedAt: get().updatedAt,
            remoteUpdatedAt: remote.updatedAt,
          });
          await persist(withMember(merged, session.uid));
        } else {
          await persist(withMember(localState, session.uid));
        }

        remoteUnsubscribe = adapter.subscribe((incoming) => {
          const merged = mergeHouseholdState(get().state, incoming.state, {
            localUpdatedAt: get().updatedAt,
            remoteUpdatedAt: incoming.updatedAt,
          });
          set({ state: merged });
          void local().save({ state: merged, updatedAt: Date.now() });
        });

        set({
          householdCode: householdId,
          status: { kind: 'connected', householdCode: householdId, uid: session.uid },
        });
      } catch (error) {
        remoteAdapter = null;
        set({ status: { kind: 'error', message: describeError(error) } });
      }
    },

    disconnect(): void {
      remoteUnsubscribe?.();
      remoteUnsubscribe = null;
      remoteAdapter?.close();
      remoteAdapter = null;
      writeStoredCode(null);
      set({ householdCode: null, status: { kind: 'local-only' } });
    },

    async createHousehold(): Promise<string> {
      const code = generateHouseholdCode();
      writeStoredCode(code);
      set({ householdCode: code });
      await get().connect(code);
      return code;
    },

    async setChild(name: string, birthDate: string): Promise<void> {
      await persist({ ...get().state, childName: name, childBirthDate: birthDate });
    },

    /** Odškrtnutí či zrušení jednoho znaku připravenosti. */
    async toggleReadySign(sign: ReadySign): Promise<void> {
      const soucasne = get().state.readySigns ?? [];
      const dalsi = soucasne.includes(sign)
        ? soucasne.filter((one) => one !== sign)
        : [...soucasne, sign];
      const zbytek = { ...get().state };
      delete zbytek.readySigns;
      await persist(dalsi.length === 0 ? zbytek : { ...zbytek, readySigns: dalsi });
    },

    /** Úchop mění tvar sousta, ne výběr surovin — ten se dál řídí věkem. */
    async setGrip(grip: Grip | undefined): Promise<void> {
      const zbytek = { ...get().state };
      delete zbytek.childGrip;
      await persist(grip === undefined ? zbytek : { ...zbytek, childGrip: grip });
    },

    async recordTasting(event: Omit<TastingEvent, 'id' | 'createdAt'>): Promise<void> {
      const full: TastingEvent = { ...event, id: newTastingId(), createdAt: Date.now() };
      // Append-only: nikdy nepřepisujeme, jen přidáváme (docs/SPEC.md kap. 7).
      await persist({ ...get().state, tastings: [...get().state.tastings, full] });
    },

    /**
     * Úprava existujícího záznamu. `createdAt` se zvedne, aby při slučování
     * vyhrála novější verze nad tou, kterou má druhé zařízení.
     */
    async updateTasting(id: string, patch: Partial<Omit<TastingEvent, 'id'>>): Promise<void> {
      const next = get().state.tastings.map((event) =>
        event.id === id ? { ...event, ...patch, id, createdAt: Date.now() } : event,
      );
      await persist({ ...get().state, tastings: next });
    },

    /** Měkké smazání — záznam zůstává jako náhrobek, ať ho sync nevzkřísí. */
    async deleteTasting(id: string): Promise<void> {
      await get().updateTasting(id, { deleted: true });
    },

    async toggleFavorite(id: string): Promise<void> {
      const current = get().state.favorites;
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
      await persist({ ...get().state, favorites: next });
    },

    async setRecipeNote(recipeId: string, note: string): Promise<void> {
      await persist({
        ...get().state,
        recipeNotes: { ...get().state.recipeNotes, [recipeId]: note },
      });
    },

    async importState(state: HouseholdState): Promise<void> {
      const merged = mergeHouseholdState(get().state, state, {
        localUpdatedAt: get().updatedAt,
        remoteUpdatedAt: Date.now(),
      });
      await persist({ ...merged, schemaVersion: SCHEMA_VERSION });
    },
  };
});

function withMember(state: HouseholdState, uid: string): HouseholdState {
  return state.members.includes(uid) ? state : { ...state, members: [...state.members, uid] };
}

function describeError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Neznámá chyba synchronizace.';
}
