/**
 * Klíč k přehledu o používání aplikace.
 *
 * V repozitáři ani v hotovém balíku není samotný klíč, jen jeho otisk.
 * Kdo si prohlédne zdrojový kód stránky, se z něj odkaz nedopočítá.
 *
 * Adresa s jiným klíčem se chová jako každá jiná neexistující stránka:
 * ukáže se „Taková stránka tu není“. Nikde v aplikaci na přehled nevede
 * odkaz a v navigaci není.
 *
 * Tohle je ale jen zámek na dveřích, ne trezor. Data chrání až pravidlo
 * `jsemSpravce()` ve `firestore.rules` a heslo k účtu, kterým se přehled
 * načítá. I kdyby odkaz někdo znal, bez hesla neuvidí nic.
 */
const OTISK_KLICE = '463bda372b3f6cdf062ebcd25bb7fd3b0bdc535ffc475eebf539bef3162b8ecd';

/** Otisk zadaného klíče. Vrací `null`, kde prohlížeč Web Crypto nemá. */
export async function otisk(text: string): Promise<string | null> {
  const subtle = globalThis.crypto?.subtle;
  if (subtle === undefined) return null;
  const data = new TextEncoder().encode(text);
  const buffer = await subtle.digest('SHA-256', data);
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function jeSpravnyKlic(klic: string | undefined): Promise<boolean> {
  if (klic === undefined || klic.length === 0) return false;
  return (await otisk(klic)) === OTISK_KLICE;
}
