/**
 * Suroviny, které v běžné české kuchyni nejsou samozřejmostí.
 *
 * V katalogu jsou schválně — vegetariánská a bezlepková kuchyně je
 * potřebuje a rodina, která je doma má, si je v katalogu najde. Plán je
 * ale rozvrh, podle kterého se nakupuje, a rodič v Česku chce na prvních
 * třicet dní jídla, která uvaří z toho, co je v každém supermarketu
 * a co doma stejně jí: ne papájový krém s amarantem a chia pudink na
 * kokosovém mléku (připomínka vlastníka 13. 10. 2026).
 *
 * Plán je proto **nezakazuje**, jen je odsouvá: jako novinka přijdou až
 * po všem běžném a recept s nimi dostane přirážku, takže vyhraje, jen když
 * na daný den nic běžného nesedí. Seznam hlídá `tests/plan/bezne.test.ts`:
 * každé idčko musí být v katalogu.
 */
export const NEBEZNE_V_CESKU: ReadonlySet<string> = new Set([
  // exotické ovoce
  'papaja',
  'mucenka',
  'lici',
  'kaki',
  'granatove-jablko',
  'pomelo',
  'ananas',
  'fik-cerstvy',
  'datle',
  // kokos
  'kokos-strouhany',
  'mleko-kokosove',
  'kokosovy-jogurt',
  'olej-kokosovy',
  // pseudoobiloviny a speciální mouky
  'quinoa',
  'amarant',
  'tapiokovy-skrob',
  'ryzove-nudle',
  'mouka-cizrnova',
  'mouka-sojova',
  'oves-bezlepkovy',
  // luštěniny a sója mimo běžný nákup
  'soja-edamame',
  'tempeh',
  'tofu-uzene',
  'fazolky-mungo',
  'fazole-adzuki',
  'fazole-cerne',
  'cocka-beluga',
  // semínka, ořechy a másla mimo běžný nákup
  'seminka-chia',
  'seminka-konopna-loupana',
  'tahini',
  'kesu-maslo',
  'kesu-orechy',
  'mandlove-maslo',
  'para-orechy',
  'pekanove-orechy',
  'makadamove-orechy',
  'piniove-orisky',
  'pistacie',
  // mořské plody a maso, které se v české domácnosti vaří výjimečně
  'krevety',
  'hrebenatky',
  'kalamary',
  'krabi-maso-bile',
  'jehneci',
  // ostatní
  'karob',
  'artycok',
  'dyne-spagetova',
  'ghi',
]);

export function jeNebezna(ingredientId: string): boolean {
  return NEBEZNE_V_CESKU.has(ingredientId);
}
