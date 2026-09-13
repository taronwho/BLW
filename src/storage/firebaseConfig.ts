import { FIREBASE_DEFAULTS } from './firebaseDefaults';
import { FIREBASE_CONFIG_KEYS, type FirebaseConfig } from './types';

/**
 * Odkud se bere připojení k Firebase.
 *
 * Dřív se konfigurace vyplňovala v aplikaci a ukládala do prohlížeče. To ale
 * znamenalo, že každý, komu se aplikace pošle, musel něco opisovat z konzole —
 * přesně to, co má sdílení odbourat. Konfigurace proto patří do buildu:
 *
 *   1. `.env.local` nebo proměnné prostředí (`VITE_FIREBASE_*`) — kvůli
 *      lokálnímu vývoji a kvůli tomu, aby šlo nasadit vlastní projekt bez
 *      zásahu do zdrojáku.
 *   2. `src/storage/firebaseDefaults.ts` — hodnoty zapsané v repozitáři.
 *
 * Když ani jedno není vyplněné, aplikace běží lokálně a nic se nesdílí.
 * Bezpečnost dělají firestore.rules a párovací kód, ne skrytí klíče — proto
 * je v pořádku mít hodnoty v repozitáři i v JavaScriptu.
 */

function fromEnv(): FirebaseConfig | null {
  const env = import.meta.env;
  const candidate: FirebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY ?? '',
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
    projectId: env.VITE_FIREBASE_PROJECT_ID ?? '',
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
    appId: env.VITE_FIREBASE_APP_ID ?? '',
  };
  return isCompleteConfig(candidate) ? candidate : null;
}

function fromDefaults(): FirebaseConfig | null {
  return isCompleteConfig(FIREBASE_DEFAULTS) ? FIREBASE_DEFAULTS : null;
}

/**
 * Neúplná sada se zahazuje celá.
 *
 * Kdyby se do buildu dostala jen část hodnot, Firebase by se pokusil nastartovat
 * a spadl by až za běhu — a rodič by viděl chybu místo aplikace.
 */
export function isCompleteConfig(value: Partial<FirebaseConfig> | null): value is FirebaseConfig {
  if (value === null) return false;
  return FIREBASE_CONFIG_KEYS.every((key) => (value[key] ?? '').trim().length > 0);
}

/** Je sdílení vůbec nastavené? Podle toho se v Domácnosti ukazuje, co se dá dělat. */
export function hasFirebaseConfig(): boolean {
  return loadFirebaseConfig() !== null;
}

export function loadFirebaseConfig(): FirebaseConfig | null {
  return fromEnv() ?? fromDefaults();
}
