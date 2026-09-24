import { deleteApp, initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { loadFirebaseConfig } from '@/storage/firebaseConfig';
import { platnySouhrn, type SouhrnDomacnosti } from './prehled';

/**
 * Přihlášení do přehledu o používání aplikace.
 *
 * Běží ve vlastní instanci Firebase, oddělené od té, kterou má aplikace pro
 * rodiče. Kdyby se sdílela, přihlášení e-mailem by přepsalo anonymní účet
 * zařízení a to by v domácnosti vystupovalo pod cizí identitou.
 *
 * Kdo se sem dostane, rozhodují pravidla Firestore, ne tahle obrazovka.
 * Formulář se dá otevřít komukoli, ale bez hesla k jedinému povolenému účtu
 * nevrátí server žádná data.
 *
 * Čte se jen kolekce `statistiky` s anonymními počty, kterou si plní
 * telefony rodičů samy. Dokumenty domácností (jména, deníky, poznámky)
 * správci pravidla nevydají a tenhle kód o ně ani nežádá.
 */
const APP_NAME = 'drobek-prehled';

export interface PrehledData {
  souhrny: SouhrnDomacnosti[];
  /** Dokumenty, které se nepodařilo převést na dnešní tvar. */
  nepovedene: number;
}

export async function nactiPrehled(email: string, heslo: string): Promise<PrehledData> {
  const config = loadFirebaseConfig();
  if (config === null) {
    throw new Error('Sdílení není nastavené, není odkud číst.');
  }

  const app = initializeApp(config, APP_NAME);
  try {
    const auth = getAuth(app);
    await signInWithEmailAndPassword(auth, email.trim(), heslo);
    const db = getFirestore(app);
    const snapshot = await getDocs(collection(db, 'statistiky'));

    const souhrny: SouhrnDomacnosti[] = [];
    let nepovedene = 0;
    snapshot.forEach((dokument) => {
      const souhrn = platnySouhrn(dokument.data());
      if (souhrn === null) nepovedene += 1;
      else souhrny.push(souhrn);
    });

    await signOut(auth);
    return { souhrny, nepovedene };
  } finally {
    // Instance se vždycky uklidí, ať přihlášení projde, nebo ne. Jinak by
    // po nezdaru zůstala viset a druhý pokus by spadl na tom, že aplikace
    // toho jména už existuje.
    await deleteApp(app).catch(() => undefined);
  }
}

/**
 * Hláška, kterou uvidí člověk. Firebase mluví anglicky a technicky.
 */
export function popisChyby(error: unknown): string {
  const text = error instanceof Error ? error.message : String(error);
  console.warn('Přehled:', text);
  if (text.includes('auth/invalid-credential') || text.includes('auth/wrong-password')) {
    return 'Špatný e-mail nebo heslo.';
  }
  if (text.includes('auth/invalid-email')) return 'E-mail není ve správném tvaru.';
  if (text.includes('auth/too-many-requests')) {
    return 'Příliš mnoho pokusů za sebou. Zkus to za chvíli.';
  }
  if (text.includes('auth/operation-not-allowed')) {
    return 'Ve Firebase není zapnuté přihlášení e-mailem a heslem. Zapíná se v konzoli, v Authentication.';
  }
  if (text.includes('auth/network-request-failed')) {
    return 'Nepodařilo se spojit s Firebase. Zkontroluj připojení k síti.';
  }
  if (text.includes('auth/user-not-found')) {
    return 'Takový účet ve Firebase není. Zakládá se ručně v konzoli, v Authentication.';
  }
  if (text.includes('permission-denied') || text.includes('insufficient permissions')) {
    return 'Účet je přihlášený, ale pravidla Firestore mu čtení nedovolila. Zkontroluj, že jsou v konzoli publikovaná nová pravidla a že v nich sedí e-mail.';
  }
  if (text.includes('Sdílení není nastavené')) return text;
  return 'Přehled se nepodařilo načíst. Podrobnost je v konzoli prohlížeče.';
}
