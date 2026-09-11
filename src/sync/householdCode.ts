/**
 * Párovací kód domácnosti podle docs/SPEC.md kapitola 7.
 *
 * 10 znaků z abecedy Crockford Base32 — bez I, L, O a U, protože se při
 * přepisování z druhého telefonu pletou s 1, 0 a V. Zobrazuje se po pěticích
 * („K7M2X-9QRT4"), ukládá se bez pomlčky.
 */

export const CROCKFORD_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
export const HOUSEHOLD_CODE_LENGTH = 10;
const GROUP_SIZE = 5;

/** Znaky, které uživatel splete, a jejich správný protějšek. */
const CONFUSABLES: Record<string, string> = {
  I: '1',
  L: '1',
  O: '0',
  U: 'V',
};

/** Vygeneruje nový kód pomocí kryptografického generátoru. */
export function generateHouseholdCode(random: Crypto = globalThis.crypto): string {
  const bytes = new Uint8Array(HOUSEHOLD_CODE_LENGTH);
  random.getRandomValues(bytes);
  let code = '';
  for (const byte of bytes) {
    // 256 není dělitelné 32 beze zbytku jen zdánlivě — 256 / 32 = 8, takže
    // modulo je tady rovnoměrné a není potřeba odmítací vzorkování.
    code += CROCKFORD_ALPHABET[byte % CROCKFORD_ALPHABET.length];
  }
  return code;
}

/** „k7m2x-9qrt4" i „K7M2X 9QRT4" dá „K7M2X9QRT4"; zaměnitelné znaky opraví. */
export function normalizeHouseholdCode(input: string): string {
  const stripped = input.toUpperCase().replace(/[^0-9A-Z]/g, '');
  let out = '';
  for (const char of stripped) {
    out += CONFUSABLES[char] ?? char;
  }
  return out;
}

export function isValidHouseholdCode(input: string): boolean {
  const normalized = normalizeHouseholdCode(input);
  if (normalized.length !== HOUSEHOLD_CODE_LENGTH) return false;
  return [...normalized].every((char) => CROCKFORD_ALPHABET.includes(char));
}

/** Kód pro zobrazení: po pěticích, oddělené pomlčkou. */
export function formatHouseholdCode(code: string): string {
  const normalized = normalizeHouseholdCode(code);
  const groups: string[] = [];
  for (let i = 0; i < normalized.length; i += GROUP_SIZE) {
    groups.push(normalized.slice(i, i + GROUP_SIZE));
  }
  return groups.join('-');
}

/**
 * Odkaz pro QR kód. Druhý telefon ho naskenuje, otevře aplikaci a kód
 * předvyplní. Používá hash routu, protože GitHub Pages neumí SPA fallback.
 */
export function householdPairingUrl(code: string, origin: string): string {
  const base = origin.endsWith('/') ? origin : `${origin}/`;
  return `${base}#/domacnost/pripojit/${normalizeHouseholdCode(code)}`;
}
