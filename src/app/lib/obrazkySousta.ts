/**
 * Obrázky k průvodci tvarem sousta, dodané jako soubory.
 *
 * Soubory leží v `src/assets/sousto/` a jmenují se podle klíče, např.
 * `uchop-dlanovy.webp`. Seznam klíčů, zadání pro generátor obrázků a
 * postup, jak soubor přidat, je v `docs/OBRAZKY-SOUSTA.md`.
 *
 * Když soubor chybí, obrazovka si poradí sama: ruce se neukážou vůbec
 * (kreslená ruka, která nevypadá jako ruka, je horší než žádná) a jídlo
 * dostane jednoduchou kresbu v SVG.
 */

export const KLICE_OBRAZKU = [
  'uchop-dlanovy',
  'uchop-nuzkovy',
  'uchop-pinzetovy',
  'tvar-dlanovy',
  'tvar-nuzkovy',
  'tvar-pinzetovy',
  'mekkost',
  'jidlo-hrozen-cely',
  'jidlo-hrozen-ctvrtky',
  'jidlo-jablko-kostky',
  'jidlo-jablko-cele',
  'jidlo-jablko-mesicek',
  'jidlo-jablko-platek',
  'jidlo-mrkev-kolecka',
  'jidlo-mrkev-hranolek',
  'jidlo-mrkev-kostky',
  'jidlo-arasidy-cele',
  'jidlo-arasidy-mlete',
  'jidlo-maso-kus',
  'jidlo-maso-vlakna',
  'jidlo-maso-kostky',
  'jidlo-brokolice-ruzicka',
  'jidlo-brokolice-kousky',
  'jidlo-banan-drzadlo',
  'jidlo-banan-pulkolecka',
  'jidlo-banan-kostky',
] as const;

export type KlicObrazku = (typeof KLICE_OBRAZKU)[number];

const soubory = import.meta.glob<string>('../../assets/sousto/*.{webp,png,jpg,jpeg}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const podleKlice = new Map<string, string>();
for (const [cesta, url] of Object.entries(soubory)) {
  const nazev = cesta.split('/').pop() ?? '';
  podleKlice.set(nazev.replace(/\.[a-z]+$/, ''), url);
}

/** Adresa obrázku, nebo `undefined`, když soubor zatím není. */
export function obrazekSousta(klic: KlicObrazku): string | undefined {
  return podleKlice.get(klic);
}

/** Je obrázek k dispozici? Podle toho se rozhoduje, jestli ukázat rámeček. */
export function maObrazek(klic: KlicObrazku): boolean {
  return podleKlice.has(klic);
}
