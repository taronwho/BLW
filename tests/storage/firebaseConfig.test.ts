// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import {
  hasBuiltInConfig,
  isCompleteConfig,
  parseFirebaseConfig,
} from '../../src/storage/firebaseConfig';

const CONSOLE_SNIPPET = `
const firebaseConfig = {
  apiKey: "ukazkovy-klic-neni-skutecny",
  authDomain: "blw-ukazka.firebaseapp.com",
  projectId: "blw-ukazka",
  storageBucket: "blw-ukazka.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
`;

describe('Firebase konfigurace', () => {
  it('přijme objekt zkopírovaný z konzole i s klíči bez uvozovek', () => {
    const config = parseFirebaseConfig(CONSOLE_SNIPPET);
    expect(config?.projectId).toBe('blw-ukazka');
    expect(config?.appId).toBe('1:123456789012:web:abcdef123456');
  });

  it('přijme čistý JSON', () => {
    const json = JSON.stringify({
      apiKey: 'a',
      authDomain: 'b',
      projectId: 'c',
      storageBucket: 'd',
      messagingSenderId: 'e',
      appId: 'f',
    });
    expect(parseFirebaseConfig(json)?.apiKey).toBe('a');
  });

  it('odmítne neúplnou konfiguraci', () => {
    expect(parseFirebaseConfig('{ "apiKey": "a" }')).toBeNull();
    expect(isCompleteConfig({ apiKey: 'a' })).toBe(false);
  });

  it('odmítne nesmysl místo JSON', () => {
    expect(parseFirebaseConfig('tohle není konfigurace')).toBeNull();
    expect(parseFirebaseConfig('')).toBeNull();
  });
});

describe('konfigurace zapečená v buildu', () => {
  it('bez proměnných prostředí hlásí, že vestavěná není', () => {
    // V testovacím běhu nejsou VITE_FIREBASE_* nastavené, takže se aplikace
    // chová jako čerstvě naklonovaný repozitář.
    expect(hasBuiltInConfig()).toBe(false);
  });

  it('neúplná sada proměnných se nepočítá jako konfigurace', () => {
    // Kdyby se do buildu dostala jen část hodnot, Firebase by spadl až za běhu.
    expect(isCompleteConfig({ apiKey: 'x', projectId: 'y' })).toBe(false);
  });
});
