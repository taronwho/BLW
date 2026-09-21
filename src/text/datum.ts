/**
 * Kalendářní datum bez času a bez časového pásma.
 *
 * `new Date('2026-03-01')` je podle specifikace **UTC půlnoc**. Kdo pak
 * přečte `getFullYear()`, `getMonth()` a `getDate()`, dostane je v místním
 * čase — a západně od Greenwiche vyjde 28. února. V Česku (UTC+1/+2) to
 * vychází správně, takže by si toho nikdo nevšiml, dokud by aplikaci
 * neotevřel někdo na dovolené v Americe a neviděl dítě o den mladší
 * (audit 17. 9. 2026, nález 5.2).
 *
 * Datum narození ani datum ochutnávky nejsou okamžiky v čase, jsou to
 * dny v kalendáři. Proto se rozebírají na tři čísla a `Date` se na ně
 * vůbec nepoužívá.
 */
export interface IsoDatum {
  rok: number;
  /** 1–12, ne 0–11 jako u `Date`. */
  mesic: number;
  den: number;
}

const TVAR = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Rozebere `YYYY-MM-DD`; `null` u čehokoli jiného, včetně 31. února. */
export function rozeberIsoDatum(iso: string): IsoDatum | null {
  const shoda = TVAR.exec(iso.trim());
  if (shoda === null) return null;
  const rok = Number(shoda[1]);
  const mesic = Number(shoda[2]);
  const den = Number(shoda[3]);
  if (mesic < 1 || mesic > 12 || den < 1) return null;
  if (den > dnuVMesici(rok, mesic)) return null;
  return { rok, mesic, den };
}

/** Kolik dní má měsíc. Přestupný rok podle gregoriánského pravidla. */
export function dnuVMesici(rok: number, mesic: number): number {
  if (mesic === 2) {
    const prestupny = (rok % 4 === 0 && rok % 100 !== 0) || rok % 400 === 0;
    return prestupny ? 29 : 28;
  }
  return mesic === 4 || mesic === 6 || mesic === 9 || mesic === 11 ? 30 : 31;
}

/** Dnešek v místním čase jako `YYYY-MM-DD`. */
export function dnesIso(ted: Date = new Date()): string {
  const dvojmistne = (cislo: number): string => String(cislo).padStart(2, '0');
  return `${ted.getFullYear()}-${dvojmistne(ted.getMonth() + 1)}-${dvojmistne(ted.getDate())}`;
}

/**
 * Rozdíl dvou kalendářních dat v celých měsících.
 *
 * Záporný, když je `do` dřív než `od` — volající si rozhodne, co s tím.
 */
export function rozdilVMesicich(od: IsoDatum, do_: IsoDatum): number {
  const mesicu = (do_.rok - od.rok) * 12 + (do_.mesic - od.mesic);
  return do_.den >= od.den ? mesicu : mesicu - 1;
}
