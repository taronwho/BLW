import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, signInAnonymously, type Auth } from 'firebase/auth';
import {
  doc,
  getDoc,
  initializeFirestore,
  onSnapshot,
  persistentLocalCache,
  persistentSingleTabManager,
  setDoc,
  type Firestore,
} from 'firebase/firestore';
import type { HouseholdState } from '@/types';
import { MAX_MEMBERS } from '@/sync/merge';
import type { FirebaseConfig, StorageAdapter, StoredHousehold } from './types';

/**
 * Firebase režim podle docs/SPEC.md kapitola 7.
 *
 *  - Anonymous Auth, žádná hesla
 *  - dokument `households/{householdId}`, kde id je párovací kód
 *  - realtime přes `onSnapshot`, offline přes `persistentLocalCache`
 *
 * Postup nasazení pravidel je v docs/FIREBASE.md. Žádné klíče tady nejsou.
 */

const COLLECTION = 'households';

export interface FirebaseSession {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  uid: string;
}

export async function connectFirebase(config: FirebaseConfig): Promise<FirebaseSession> {
  const app = initializeApp(config);
  const db = initializeFirestore(app, {
    // Offline fronta: změny se ukládají lokálně a dosynchronizují po připojení.
    localCache: persistentLocalCache({ tabManager: persistentSingleTabManager({}) }),
  });
  const auth = getAuth(app);
  const credential = await signInAnonymously(auth);
  return { app, auth, db, uid: credential.user.uid };
}

interface HouseholdDocument {
  state: HouseholdState;
  updatedAt: number;
  members: string[];
}

function toStored(data: HouseholdDocument): StoredHousehold {
  return { state: data.state, updatedAt: data.updatedAt };
}

export class FirestoreAdapter implements StorageAdapter {
  private unsubscribe: (() => void) | null = null;

  constructor(
    private readonly session: FirebaseSession,
    private readonly householdId: string,
  ) {}

  private ref() {
    return doc(this.session.db, COLLECTION, this.householdId);
  }

  async load(): Promise<StoredHousehold | null> {
    const snapshot = await getDoc(this.ref());
    if (!snapshot.exists()) return null;
    return toStored(snapshot.data() as HouseholdDocument);
  }

  async save(stored: StoredHousehold): Promise<void> {
    const members = stored.state.members.includes(this.session.uid)
      ? stored.state.members
      : [...stored.state.members, this.session.uid];
    if (members.length > MAX_MEMBERS) {
      throw new Error(`Domácnost už má ${MAX_MEMBERS} členů, další se nepřidá.`);
    }
    const payload: HouseholdDocument = {
      state: { ...stored.state, members },
      updatedAt: stored.updatedAt,
      members,
    };
    await setDoc(this.ref(), payload);
  }

  subscribe(listener: (stored: StoredHousehold) => void): () => void {
    this.unsubscribe?.();
    this.unsubscribe = onSnapshot(this.ref(), (snapshot) => {
      if (!snapshot.exists()) return;
      listener(toStored(snapshot.data() as HouseholdDocument));
    });
    return () => {
      this.unsubscribe?.();
      this.unsubscribe = null;
    };
  }

  close(): void {
    this.unsubscribe?.();
    this.unsubscribe = null;
  }
}
