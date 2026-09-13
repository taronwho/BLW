import { create } from 'zustand';
import type { Grip, HouseholdState, ReadySign, TastingEvent } from '@/types';
import {
  emptyHouseholdState,
  MAX_MEMBERS,
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
  removeMember(uid: string): Promise<void>;
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

/**
 * O start i o připojení žádá nezávisle několik obrazovek naráz (hlavička,
 * Domácnost, párovací odkaz). Bez těchhle dvou pojistek běžely dva starty
 * současně, druhý se pokusil otevřít Firestore podruhé a spadl — a protože
 * skončil až po tom úspěšném, přebil ho a rodiči se ukázala červená hláška,
 * kterou další načtení stránky smazalo.
 */
let rozjednanyStart: Promise<void> | null = null;
let rozjednanePripojeni: { id: string; hotovo: Promise<void> } | null = null;

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

  /** Načtení lokálních dat a případné připojení k domácnosti. Běží jednou. */
  async function spustStart(): Promise<void> {
    const stored = await local().load();
    const code = readStoredCode();
    set({
      ready: true,
      state: stored?.state ?? emptyHouseholdState(),
      updatedAt: stored?.updatedAt ?? 0,
      householdCode: code,
    });

    if (code !== null && loadFirebaseConfig() !== null) {
      await get().connect(code);
    }
  }

  /** Vlastní připojení k Firestore. Volá se jen přes `connect`, který ho hlídá. */
  async function pripojSe(householdId: string): Promise<void> {
    const config = loadFirebaseConfig();
    if (config === null || householdId.length === 0) {
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

      // Poslouchá vždycky jen jeden odběr; starý se ruší, ať se změny
      // nezpracují dvakrát.
      remoteUnsubscribe?.();
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
  }

  return {
    ready: false,
    state: emptyHouseholdState(),
    updatedAt: 0,
    status: { kind: 'local-only' },
    householdCode: null,

    async init(): Promise<void> {
      rozjednanyStart ??= spustStart();
      return rozjednanyStart;
    },

    async connect(code?: string): Promise<void> {
      const householdId = normalizeHouseholdCode(code ?? get().householdCode ?? '');
      // Druhá obrazovka se sveze na výsledku první místo druhého spojení.
      if (rozjednanePripojeni !== null && rozjednanePripojeni.id === householdId) {
        return rozjednanePripojeni.hotovo;
      }
      const hotovo = pripojSe(householdId);
      rozjednanePripojeni = { id: householdId, hotovo };
      try {
        await hotovo;
      } finally {
        if (rozjednanePripojeni?.hotovo === hotovo) rozjednanePripojeni = null;
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

    /**
     * Odebrání zařízení z domácnosti.
     *
     * Anonymní uid je vázané na úložiště prohlížeče, takže po smazání dat nebo
     * přeinstalaci zůstane v seznamu mrtvé a zabírá jedno z pěti míst. Odebrat
     * ho smí kterýkoli člen — pravidla to dovolují, protože při `jsemClen()`
     * na podobu seznamu nekladou jinou podmínku než počet.
     */
    async removeMember(uid: string): Promise<void> {
      const stav = get().state;
      if (!stav.members.includes(uid)) return;
      const seenAt = { ...stav.memberSeenAt };
      delete seenAt[uid];
      await persist({
        ...stav,
        members: stav.members.filter((one) => one !== uid),
        memberSeenAt: seenAt,
      });
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
  const members = state.members.includes(uid) ? state.members : [...state.members, uid];
  return { ...state, members, memberSeenAt: { ...state.memberSeenAt, [uid]: Date.now() } };
}

/**
 * Hláška, kterou uvidí rodič. Firebase mluví anglicky a technicky, takže se
 * sem jeho text nikdy nepouští doslova — je nesrozumitelný a v aplikaci pro
 * rodiče nemá co dělat. Podrobnost zůstává v konzoli prohlížeče.
 */
function describeError(error: unknown): string {
  const text = error instanceof Error ? error.message : String(error);
  // Podrobnost pro ladění, ne pro rodiče.
  console.warn('Synchronizace:', text);

  // Firestore vrátí u zamítnutého zápisu jen „permission-denied“. Nejčastější
  // příčinou je plná domácnost, což ze samotné hlášky nikdo nepozná.
  if (/permission|insufficient/i.test(text)) {
    return `Zápis odmítnut. Buď je domácnost plná (nejvýš ${MAX_MEMBERS} zařízení — odeber některé v Domácnosti na jiném telefonu), nebo nemá databáze nahraná pravidla přístupu; to se nastavuje jednou při zprovoznění sdílení.`;
  }
  if (/unavailable|network|offline|failed to (get|fetch)/i.test(text)) {
    return 'Zařízení je teď bez spojení. Zapsané změny máš uložené v telefonu a odešlou se samy, jakmile bude síť zpátky.';
  }
  if (/not-found|no document/i.test(text)) {
    return 'Domácnost s tímhle kódem neexistuje. Zkontroluj kód na druhém telefonu, nebo tam založ novou domácnost.';
  }
  return 'Sdílení se teď nepodařilo navázat. Data máš uložená v telefonu a nic se neztratilo; zkus to za chvíli znovu.';
}
