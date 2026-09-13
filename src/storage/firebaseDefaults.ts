import type { FirebaseConfig } from './types';

/**
 * ZDE SE NASTAVUJE SDÍLENÍ MEZI TELEFONY. Jediné místo, nikde jinde nic není.
 *
 * Postup:
 *  1. Firebase konzole → ozubené kolo → Project settings → Your apps →
 *     SDK setup and configuration → Config.
 *  2. Šest hodnot z bloku `firebaseConfig` opiš sem mezi apostrofy.
 *  3. Commitni a pushni. Po nasazení se aplikace připojí sama a nikdo
 *     v aplikaci nic nevyplňuje.
 *
 * Podrobný postup včetně pravidel Firestore je v docs/FIREBASE.md.
 *
 * PROČ TO SMÍ BÝT V REPOZITÁŘI: tyhle hodnoty nejsou tajemství. Firebase je
 * posílá do prohlížeče každému návštěvníkovi jako součást JavaScriptu, takže
 * je stejně vidí každý, kdo si otevře zdroj stránky. Google s tím počítá.
 * Aplikaci chrání tři jiné věci:
 *   - firestore.rules — kdo smí co číst a zapisovat,
 *   - párovací kód domácnosti, který se nikam neposílá a nejde vylistovat,
 *   - omezení API klíče na doménu (docs/FIREBASE.md kap. 6).
 *
 * Dokud jsou hodnoty prázdné, aplikace funguje dál — jen lokálně, každé
 * zařízení samo za sebe. Nic se nerozbije.
 */
export const FIREBASE_DEFAULTS: FirebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};
