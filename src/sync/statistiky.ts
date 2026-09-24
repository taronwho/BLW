/**
 * Klíč dokumentu se souhrnem domácnosti v kolekci `statistiky`.
 *
 * Párovací kód je jediné tajemství domácnosti: kdo ho zná, přečte si ji
 * celou. Souhrn proto nesmí ležet pod kódem samotným, jinak by ho správce
 * z výpisu statistik vyčetl a měl by klíč ke všem domácnostem. Leží pod
 * otiskem SHA-256, ze kterého se kód zpátky nedopočítá. Oba telefony téže
 * domácnosti dojdou ke stejnému otisku, takže přepisují jeden dokument.
 */
const PREDPONA = 'drobek-statistiky:';

export async function klicStatistiky(kodDomacnosti: string): Promise<string | null> {
  const subtle = globalThis.crypto?.subtle;
  if (subtle === undefined) return null;
  const data = new TextEncoder().encode(PREDPONA + kodDomacnosti);
  const buffer = await subtle.digest('SHA-256', data);
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Jak často se souhrn smí přepsat. Stačí orientační čísla, ne živý stav. */
export const INTERVAL_SOUHRNU_MS = 60 * 60 * 1000;
