import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, signInAnonymously, type Auth } from 'firebase/auth';
import {
  doc,
  getDoc,
  getFirestore,
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

/**
 * Rozjednané nebo hotové spojení. Firebase smí být v jedné záložce otevřený
 * jen jednou a o připojení žádá nezávisle několik obrazovek naráz, takže
 * druhý žadatel dostane týž příslib místo druhého spojení.
 */
let rozjednane: Promise<FirebaseSession> | null = null;

export function connectFirebase(config: FirebaseConfig): Promise<FirebaseSession> {
  if (rozjednane !== null) return rozjednane;
  const spojeni = otevriSpojeni(config);
  rozjednane = spojeni;
  // Neúspěch (třeba výpadek sítě při přihlášení) nesmí zablokovat další pokus.
  void spojeni.catch(() => {
    if (rozjednane === spojeni) rozjednane = null;
  });
  return spojeni;
}

async function otevriSpojeni(config: FirebaseConfig): Promise<FirebaseSession> {
  const app = getApps().length === 0 ? initializeApp(config) : getApp();
  const db = otevriFirestore(app);
  const auth = getAuth(app);
  const credential = await signInAnonymously(auth);
  return { app, auth, db, uid: credential.user.uid };
}

function otevriFirestore(app: FirebaseApp): Firestore {
  try {
    return initializeFirestore(app, {
      // Offline fronta: změny se ukládají lokálně a dosynchronizují po připojení.
      localCache: persistentLocalCache({ tabManager: persistentSingleTabManager({}) }),
      // Nepovinná pole (`childGrip`, `note` u ochutnávky) můžou být `undefined`.
      // Bez tohohle by je setDoc odmítl a zápis by spadl celý.
      ignoreUndefinedProperties: true,
    });
  } catch {
    // Firestore už v téhle záložce běží — nastavení se mu už měnit nedá,
    // takže si vezmeme existující instanci místo vyhození chyby.
    return getFirestore(app);
  }
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
