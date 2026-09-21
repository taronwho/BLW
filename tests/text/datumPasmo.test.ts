import { beforeAll, describe, expect, it } from 'vitest';

/**
 * Věk a datum musí vyjít stejně v Praze i na Havaji.
 *
 * Audit 17. 9. 2026, nález 5.2: `new Date('2026-03-01')` je UTC půlnoc a
 * čtení přes `getDate()` v místním čase ji západně od Greenwiche posune
 * na 28. února. Tenhle test pásmo skutečně přepne — jinak by v Česku
 * (UTC+1/+2) prošla i chybná verze.
 */
const PASMA = ['Europe/Prague', 'Pacific/Honolulu', 'Pacific/Kiritimati', 'UTC'];

type Modul = {
  ageInMonths: (birthDate: string, now?: Date) => number | null;
  formatDate: (iso: string) => string;
};

async function vPasmu(pasmo: string): Promise<Modul> {
  process.env.TZ = pasmo;
  // Moduly se načtou až po přepnutí pásma; `vi.resetModules` není potřeba,
  // protože obě funkce jsou čisté a pásmo čtou až při volání.
  const age = await import('../../src/app/lib/age');
  const labels = await import('../../src/app/lib/labels');
  return { ageInMonths: age.ageInMonths, formatDate: labels.formatDate };
}

describe('datum a věk nezávisí na časovém pásmu', () => {
  let puvodni: string | undefined;
  beforeAll(() => {
    puvodni = process.env.TZ;
    return () => {
      process.env.TZ = puvodni;
    };
  });

  it('formatDate ukáže v každém pásmu tentýž den', async () => {
    for (const pasmo of PASMA) {
      const { formatDate } = await vPasmu(pasmo);
      expect(formatDate('2026-03-01'), pasmo).toBe('1. 3. 2026');
      expect(formatDate('2026-01-01'), pasmo).toBe('1. 1. 2026');
    }
  });

  it('ageInMonths vyjde v každém pásmu stejně', async () => {
    // Dítě narozené 1. 3. 2026, měřeno 1. 9. 2026 místního času.
    for (const pasmo of PASMA) {
      const { ageInMonths } = await vPasmu(pasmo);
      expect(ageInMonths('2026-03-01', new Date(2026, 8, 1, 9, 0)), pasmo).toBe(6);
      // Den před narozeninami je to ještě pět měsíců.
      expect(ageInMonths('2026-03-01', new Date(2026, 7, 31, 9, 0)), pasmo).toBe(5);
    }
  });

  it('nevyplněné ani nesmyslné datum nedá číslo', async () => {
    const { ageInMonths } = await vPasmu('Europe/Prague');
    expect(ageInMonths('')).toBeNull();
    expect(ageInMonths('   ')).toBeNull();
    expect(ageInMonths('nevím')).toBeNull();
  });

  it('datum v budoucnosti nedá záporný věk', async () => {
    const { ageInMonths } = await vPasmu('Europe/Prague');
    expect(ageInMonths('2027-01-01', new Date(2026, 8, 1))).toBe(0);
  });
});
