/**
 * Běžná rodinná jídla pro rychlý výběr na obrazovce „Co dnes jíme my".
 *
 * Nejsou to recepty — ty jsou v kuchařce i s odběrem dětské porce. Tohle
 * je jen předvyplněný seznam surovin, jak je rodina obvykle vaří, včetně
 * soli, medu a dalšího, co do dětské porce nepatří: právě na tom má
 * obrazovka ukázat, co odebrat dřív, než se to přidá. Rodič si seznam
 * po vybrání upraví podle toho, co opravdu vaří.
 *
 * Idčka hlídá `tests/data/jimeMy.test.ts`: každé musí být v katalogu.
 */
export interface RodinneJidlo {
  id: string;
  nazev: string;
  suroviny: readonly string[];
}

export const RODINNA_JIDLA: readonly RodinneJidlo[] = [
  {
    id: 'kure-s-bramborem',
    nazev: 'Pečené kuře s bramborem a mrkví',
    suroviny: ['kureci-stehno', 'brambor', 'mrkev', 'olej-olivovy', 'rozmaryn', 'sul'],
  },
  {
    id: 'spagety-s-rajcaty',
    nazev: 'Špagety s rajčatovou omáčkou',
    suroviny: [
      'testoviny-semolinove',
      'rajcata-loupana-konzerva',
      'cibule',
      'cesnek',
      'olej-olivovy',
      'bazalka',
      'parmazan',
      'sul',
    ],
  },
  {
    id: 'zeleninove-rizoto',
    nazev: 'Zeleninové rizoto',
    suroviny: ['ryze-kulatozrnna', 'cuketa', 'hrasek-zeleny', 'cibule', 'maslo', 'parmazan', 'sul'],
  },
  {
    id: 'cocka-na-kyselo',
    nazev: 'Čočka na kyselo s vejcem',
    suroviny: ['cocka-hneda', 'cibule', 'mouka-psenicna-hladka', 'ocet-jablecny', 'vejce-slepici', 'sul'],
  },
  {
    id: 'ryba-s-kasi',
    nazev: 'Rybí filé s bramborovou kaší',
    suroviny: ['treska-obecna', 'brambor', 'maslo', 'kravske-mleko', 'citron', 'sul'],
  },
  {
    id: 'kureci-polevka',
    nazev: 'Kuřecí polévka s nudlemi',
    suroviny: [
      'kureci-prsa',
      'mrkev',
      'petrzel-koren',
      'celer-bulva',
      'testoviny-semolinove',
      'petrzelka-hladkolista',
      'sul',
    ],
  },
  {
    id: 'cizrnove-kari',
    nazev: 'Cizrnové kari s rýží',
    suroviny: [
      'cizrna',
      'rajcata-loupana-konzerva',
      'mleko-kokosove',
      'cibule',
      'cesnek',
      'kurkuma',
      'zazvor',
      'ryze-basmati',
      'sul',
    ],
  },
  {
    id: 'losos-s-batatem',
    nazev: 'Losos s batátem a brokolicí',
    suroviny: ['losos', 'batat', 'brokolice', 'olej-olivovy', 'citron', 'sul'],
  },
  {
    id: 'omeleta',
    nazev: 'Omeleta se zeleninou a sýrem',
    suroviny: ['vejce-slepici', 'paprika-sladka', 'spenat', 'maslo', 'eidam', 'sul'],
  },
  {
    id: 'ovesna-kase',
    nazev: 'Ovesná kaše s ovocem a medem',
    suroviny: ['ovesne-vlocky-jemne', 'kravske-mleko', 'banan', 'boruvky', 'skorice-cejlonska', 'med'],
  },
  {
    id: 'palacinky',
    nazev: 'Palačinky s tvarohem a jahodami',
    suroviny: [
      'mouka-psenicna-hladka',
      'vejce-slepici',
      'kravske-mleko',
      'tvaroh-mekky',
      'jahody',
      'cukr-krystal',
    ],
  },
  {
    id: 'tofu-s-ryzi',
    nazev: 'Tofu se zeleninou a rýží',
    suroviny: ['tofu-natural', 'brokolice', 'mrkev', 'ryze-basmati', 'olej-repkovy', 'sezam-mlety'],
  },
];
