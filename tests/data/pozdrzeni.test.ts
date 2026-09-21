import { describe, expect, it } from 'vitest';
import { POZDRZENI_MS } from '../../src/app/lib/pozdrzeni';

/**
 * Pozdržení hledání má hranice, ve kterých dává smysl.
 *
 * Pod padesáti milisekundami se nic neušetří, nad dvě stě padesát si
 * člověk prodlevy všimne a připadá mu, že aplikace zamrzla.
 */
describe('POZDRZENI_MS', () => {
  it('je v rozmezí, které rodič nepostřehne a přitom něco ušetří', () => {
    expect(POZDRZENI_MS).toBeGreaterThanOrEqual(50);
    expect(POZDRZENI_MS).toBeLessThanOrEqual(250);
  });
});
