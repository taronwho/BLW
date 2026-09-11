import { describe, expect, it } from 'vitest';
import {
  CROCKFORD_ALPHABET,
  HOUSEHOLD_CODE_LENGTH,
  formatHouseholdCode,
  generateHouseholdCode,
  householdPairingUrl,
  isValidHouseholdCode,
  normalizeHouseholdCode,
} from '../../src/sync/householdCode';

describe('párovací kód domácnosti', () => {
  it('má 10 znaků z Crockford Base32', () => {
    for (let i = 0; i < 200; i += 1) {
      const code = generateHouseholdCode();
      expect(code).toHaveLength(HOUSEHOLD_CODE_LENGTH);
      expect([...code].every((c) => CROCKFORD_ALPHABET.includes(c))).toBe(true);
    }
  });

  it('abeceda neobsahuje I, L, O ani U', () => {
    for (const char of ['I', 'L', 'O', 'U']) {
      expect(CROCKFORD_ALPHABET).not.toContain(char);
    }
  });

  it('zobrazuje se po pěticích', () => {
    expect(formatHouseholdCode('K7M2X9QRT4')).toBe('K7M2X-9QRT4');
  });

  it('opraví zaměnitelné znaky při přepisu z druhého telefonu', () => {
    expect(normalizeHouseholdCode('k7m2x-9qrto')).toBe('K7M2X9QRT0');
    expect(normalizeHouseholdCode('IL0U V2345')).toBe('110VV2345');
  });

  it('uzná kód s pomlčkou i bez ní', () => {
    expect(isValidHouseholdCode('K7M2X-9QRT4')).toBe(true);
    expect(isValidHouseholdCode('K7M2X9QRT4')).toBe(true);
  });

  it('odmítne kód špatné délky', () => {
    expect(isValidHouseholdCode('K7M2X')).toBe(false);
    expect(isValidHouseholdCode('K7M2X9QRT45')).toBe(false);
  });

  it('sestaví odkaz pro QR s hash routou', () => {
    expect(householdPairingUrl('K7M2X-9QRT4', 'https://taronwho.github.io/BLW')).toBe(
      'https://taronwho.github.io/BLW/#/domacnost/pripojit/K7M2X9QRT4',
    );
  });
});
