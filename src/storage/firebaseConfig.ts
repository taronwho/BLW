import { FIREBASE_CONFIG_KEYS, type FirebaseConfig } from './types';

/**
 * Firebase web-konfigurace se do repozitáře nedává. Bere se buď z `.env.local`
 * pro lokální vývoj, nebo ji rodič vloží v Nastavení a uloží se do prohlížeče.
 * Bezpečnost dělají Firestore pravidla, ne skrytí klíče — viz docs/FIREBASE.md.
 */

const STORAGE_KEY = 'blw.firebase.config.v1';

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

export function isCompleteConfig(value: Partial<FirebaseConfig> | null): value is FirebaseConfig {
  if (value === null) return false;
  return FIREBASE_CONFIG_KEYS.every((key) => (value[key] ?? '').trim().length > 0);
}

/** Přijme i celý objekt zkopírovaný z Firebase konzole. */
export function parseFirebaseConfig(input: string): FirebaseConfig | null {
  const trimmed = input.trim();
  if (trimmed.length === 0) return null;
  // Konzole nabízí JS objekt, ne JSON — klíče bez uvozovek a s koncovou čárkou.
  const jsonish = trimmed
    .replace(/^[^{]*/, '')
    .replace(/[^}]*$/, '')
    .replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:/g, '$1"$2":')
    .replace(/'/g, '"')
    .replace(/,(\s*})/g, '$1');
  try {
    const parsed: unknown = JSON.parse(jsonish);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const record = parsed as Record<string, unknown>;
    const config: Partial<FirebaseConfig> = {};
    for (const key of FIREBASE_CONFIG_KEYS) {
      const value = record[key];
      if (typeof value === 'string') config[key] = value;
    }
    return isCompleteConfig(config) ? config : null;
  } catch {
    return null;
  }
}

/**
 * Je konfigurace zapečená rovnou v buildu?
 *
 * Když ano, nikdo nic nevyplňuje — aplikace se rovnou umí připojit a ruční
 * pole v Domácnosti se schová, aby nemátlo. Když ne, zbývá vložit konfiguraci
 * do prohlížeče ručně.
 */
export function hasBuiltInConfig(): boolean {
  return fromEnv() !== null;
}

export function loadFirebaseConfig(): FirebaseConfig | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const parsed: unknown = JSON.parse(raw);
      if (isCompleteConfig(parsed as Partial<FirebaseConfig>)) return parsed as FirebaseConfig;
    }
  } catch {
    // Nedostupné úložiště není chyba — spadne se na .env.local nebo lokální režim.
  }
  return fromEnv();
}

export function saveFirebaseConfig(config: FirebaseConfig): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function clearFirebaseConfig(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}
