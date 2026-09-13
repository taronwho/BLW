// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { hasFirebaseConfig, isCompleteConfig, loadFirebaseConfig } from '../../src/storage/firebaseConfig';
import { FIREBASE_DEFAULTS } from '../../src/storage/firebaseDefaults';
import { FIREBASE_CONFIG_KEYS } from '../../src/storage/types';

describe('úplnost konfigurace', () => {
  it('úplná sada projde', () => {
    expect(
      isCompleteConfig({
        apiKey: 'a',
        authDomain: 'b',
        projectId: 'c',
        storageBucket: 'd',
        messagingSenderId: 'e',
        appId: 'f',
      }),
    ).toBe(true);
  });

  it('neúplná sada se zahodí celá', () => {
    // Jinak by Firebase nastartoval a spadl až za běhu, tedy před rodičem.
    expect(isCompleteConfig({ apiKey: 'a', projectId: 'c' })).toBe(false);
  });

  it('prázdné a mezerové hodnoty se nepočítají', () => {
    const vsechny = Object.fromEntries(FIREBASE_CONFIG_KEYS.map((k) => [k, '  ']));
    expect(isCompleteConfig(vsechny)).toBe(false);
  });

  it('null není konfigurace', () => {
    expect(isCompleteConfig(null)).toBe(false);
  });
});

describe('odkud se konfigurace bere', () => {
  it('výchozí soubor má všechny klíče, i když jsou prázdné', () => {
    // Kdyby některý chyběl, chyběl by i v návodu a nikdo by si toho nevšiml.
    for (const key of FIREBASE_CONFIG_KEYS) {
      expect(FIREBASE_DEFAULTS).toHaveProperty(key);
    }
  });

  it('nevyplněné hodnoty znamenají lokální režim, ne pád', () => {
    // V testovacím běhu nejsou VITE_FIREBASE_* nastavené; tohle je tedy stav
    // čerstvě naklonovaného repozitáře.
    const vyplneno = isCompleteConfig(FIREBASE_DEFAULTS);
    expect(hasFirebaseConfig()).toBe(vyplneno);
    expect(loadFirebaseConfig()).toEqual(vyplneno ? FIREBASE_DEFAULTS : null);
  });
});
