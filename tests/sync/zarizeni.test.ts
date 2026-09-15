import { afterEach, describe, expect, it, vi } from 'vitest';
import { popisZarizeni, vestavenyProhlizec } from '../../src/sync/zarizeni';

function sUa(text: string, standalone = false): void {
  vi.stubGlobal('navigator', { userAgent: text, standalone: false });
  vi.stubGlobal('window', {
    matchMedia: (dotaz: string) => ({ matches: standalone && dotaz.includes('standalone') }),
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

const MESSENGER =
  'Mozilla/5.0 (Linux; Android 14; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36 [FB_IAB/MESSENGER;FBAV/460.0.0.0;]';
const CHROME =
  'Mozilla/5.0 (Linux; Android 14; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36';

describe('rozpoznání zařízení pro seznam domácnosti', () => {
  it('pozná vestavěný prohlížeč v Messengeru — právě tam pozvánka z chatu končí', () => {
    sUa(MESSENGER);
    expect(vestavenyProhlizec()).toBe('Messengeru');
    expect(popisZarizeni()).toBe('Prohlížeč v Messengeru');
  });

  it('obyčejný Chrome za vestavěný prohlížeč nepovažuje', () => {
    sUa(CHROME);
    expect(vestavenyProhlizec()).toBeNull();
    expect(popisZarizeni()).toBe('Chrome');
  });

  it('nainstalovaná aplikace se pozná podle režimu zobrazení', () => {
    sUa(CHROME, true);
    expect(popisZarizeni()).toBe('Nainstalovaná aplikace');
  });

  it('Samsung Internet se nespolkne jako Chrome', () => {
    sUa(`${CHROME} SamsungBrowser/25.0`);
    expect(popisZarizeni()).toBe('Samsung Internet');
  });

  it('neznámý prohlížeč má obecný popis, ne prázdno', () => {
    sUa('něco úplně jiného');
    expect(popisZarizeni()).toBe('Prohlížeč');
  });
});
