import type { Guide } from '@/types';
import {
  MZCR_COMPLEMENTARY,
  NHS_6M,
  NHS_FIRST_FOODS,
  NHS_PREP_SAFELY,
  SZU_FIRST_SPOON,
} from '../ingredients/_sources';

const KNIHA = 'Baby-led weaning — příběh metody vedené dítětem (kapitoly 1 a 2)';

/** Start příkrmu: připravenost, první potraviny, co je metoda vedená dítětem. */
export const starting: Guide[] = [
  {
    id: 'je-dite-pripravene',
    titleCz: 'Je dítě připravené?',
    category: 'zacatek',
    summary:
      'Nerozhoduje datum v kalendáři, ale tři vývojové znaky. Dokud nejsou pohromadě, nemá začínat žádná metoda příkrmu.',
    keyPoints: [
      'Samostatný stabilní sed a udržená hlava.',
      'Koordinace oko–ruka–ústa: dítě sáhne po jídle a trefí si ho do pusy.',
      'Vyhasl vypuzovací reflex jazyka, kterým dítě vytlačuje ven všechno, co se mu dostane do úst.',
    ],
    sections: [
      {
        heading: 'Tři znaky, které musí být pohromadě',
        body: [
          'Klíčem k celé metodě není žádná filozofie, ale trojice vývojových znaků, které se u zdravého dítěte scházejí kolem šestého měsíce.',
          'Samostatný stabilní sed. Cílené uchopení předmětu a jeho dopravení do úst. A vyhasnutí reflexu, kterým dítě jazykem vytlačuje ven všechno, co se mu dostane do pusy.',
          'Dokud tyhle tři věci nejsou pohromadě, nemá začínat ani jedna metoda příkrmu. Jakmile jsou, dá se začít oběma — lžičkou i kusy do ruky.',
          'Přidej k tomu čtvrtý, měkčí znak: dítě projevuje o jídlo zájem, sleduje, co jíte, a sahá po tom.',
        ],
      },
      {
        heading: 'Co říkají česká doporučení k věku',
        body: [
          'Příkrm se zavádí nejdřív po ukončeném 4. měsíci (17. týden) a nejpozději po ukončeném 6. měsíci (180 dní, 26. týden).',
          'U zdravého prospívajícího kojeného dítěte je preferováno výlučné kojení do ukončeného 6. měsíce a pak pokračování v kojení spolu s příkrmem do dvou let i déle.',
          'Strava s obsahem lepku se zavádí nejpozději do ukončeného 7. měsíce, optimálně ještě v době, kdy je dítě zároveň kojeno.',
          'U nedonošených dětí se postup posuzuje individuálně a patří pediatrovi.',
        ],
      },
      {
        heading: 'Jak poznat, že to ještě není ono',
        asList: true,
        body: [
          'Dítě v židličce padá na stranu nebo se sesouvá dopředu — sed ještě není stabilní.',
          'Jídlo se mu do pusy dostane jen náhodou, ne cíleným pohybem.',
          'Cokoli, co skončí v ústech, jazyk okamžitě vytlačí ven — vypuzovací reflex ještě nevyhasl.',
          'Nic z toho není důvod k obavám. Je to důvod počkat pár týdnů a zkusit to znovu.',
        ],
      },
    ],
    sources: [MZCR_COMPLEMENTARY, SZU_FIRST_SPOON, NHS_6M],
    literature: [KNIHA],
    reviewStatus: 'verified',
  },
  {
    id: 'prvni-potraviny',
    titleCz: 'První potraviny a první týdny',
    category: 'zacatek',
    summary:
      'Krátký seznam s jediným kritériem: povolí sousto pod tlakem dásní? A jeden trik na kluzké kousky.',
    keyPoints: [
      'Vařená mrkev na hranolky, brokolice a květák s dlouhým stonkem místo držadla.',
      'Banán rozkrojený podélně a z poloviny ponechaný ve slupce, aby měl za co držet.',
      'Jablko výhradně vařené nebo pečené — syrové je tak tvrdé, že se z něj lámou kusy.',
    ],
    sections: [
      {
        heading: 'Seznam, jak se ustálil',
        asList: true,
        body: [
          'Vařená mrkev nakrájená na hranolky a uvařená doměkka.',
          'Květák a brokolice s dlouhým stonkem, který slouží jako držadlo.',
          'Vařený brambor a batát.',
          'Dýně a cuketa.',
          'Avokádo — zrádné tím, že klouže, proto se často obaluje ve strouhance nebo v ovesných vločkách.',
          'Banán rozkrojený podélně a z poloviny ponechaný ve slupce, aby ho dítě mělo za co držet.',
          'Hruška a jablko, ale jablko výhradně vařené nebo pečené.',
        ],
      },
      {
        heading: 'Velikost a tvar',
        body: [
          'Sousto má být podlouhlé, zhruba velikosti prstu dospělého, a má z pěsti vyčnívat. Dítě v tomhle věku ještě neumí uvolnit, co sevře v dlani — co zmizí celé v pěsti, k ústům nedoputuje.',
          'Kolem devátého měsíce se rozvíjí klešťový úchop mezi palcem a ukazovákem. Od té chvíle dávají smysl menší kousky velikosti fazole.',
          'Kluzké kousky se drží špatně. Obalení v mletých vločkách, v strouhance nebo v mletých semínkách problém vyřeší.',
        ],
      },
      {
        heading: 'Čím začít podle SZÚ',
        body: [
          'Brožura SZÚ doporučuje začít zeleninou, nejčastěji mrkví, druhou v pořadí bývá dýně. Nesolí se, nesladí a nepřidává se nic dalšího.',
          'Mezi novými potravinami se nechávají dva až tři dny, aby se dala zachytit případná alergická reakce.',
          'Pro začátek stačí jedna až dvě lžičky podané před kojením v poledne nebo odpoledne. Masa se pak přidává zhruba 30 až 50 g libového, upraveného vařením, dušením nebo v páře.',
        ],
      },
    ],
    sources: [NHS_FIRST_FOODS, NHS_PREP_SAFELY, SZU_FIRST_SPOON],
    literature: [KNIHA],
    reviewStatus: 'verified',
  },
  {
    id: 'co-je-blw',
    titleCz: 'Co metoda je a co není',
    category: 'zacatek',
    summary:
      'Dávat dítěti do ruky kus jídla ze společného stolu není novinka. A čistá podoba metody je v praxi vzácná — většina rodin kombinuje.',
    keyPoints: [
      'Většina rodin, které se k metodě hlásí, používá i lžičku. Ortodoxní podoba je vzácná.',
      'Metoda neprokázala prevenci vybíravosti ani ochranu před nadváhou.',
      'To podstatné z ní se dostalo do oficiálních doporučení, aniž by ji kdokoli jmenoval.',
    ],
    sections: [
      {
        heading: 'Co se v praxi opravdu dělá',
        body: [
          'Šetření z různých zemí shodně ukazují, že rodiny hlásící se k metodě ji v čisté podobě provozují zřídka.',
          'Nejběžnější je smíšený postup: dítě dostává kusy do ruky při většině jídel a lžičkou se podává to, co se do ruky vzít nedá — jogurt, tvaroh, hustá polévka a kaše.',
          'Podíl rodin, které nikdy nepoužily lžičku, se pohyboval kolem několika procent. Kombinace je tedy pravidlo, ne selhání.',
        ],
      },
      {
        heading: 'Co metoda neumí',
        body: [
          'Prevence vybíravosti je tvrzení, které se metodě připisuje nejčastěji a které je zároveň nejhůř podložené. Vybíravost je vývojová fáze, která se u většiny dětí objevuje mezi druhým a čtvrtým rokem a má svůj biologický smysl.',
          'Ochrana před nadváhou se v randomizovaném pokusu neprokázala.',
          'Vyšší příjem železa a energie se neprokázal také. Metoda tedy nemá být volena kvůli výživovým výhodám — ty musí zařídit složení talíře.',
        ],
      },
      {
        heading: 'Co z ní zůstalo',
        body: [
          'Zavádět texturu od začátku. Nabízet kusy k uchopení. Nabízet alergenní potraviny brzy a opakovaně. Nechat dítě rozhodovat o množství.',
          'Tohle všechno se dostalo do oficiálních doporučení, aniž by metodu kdokoli jmenoval.',
          'A ještě jedna věc stojí za připomenutí: dávat dítěti do ruky kus jídla ze společného stolu bylo po většinu lidských dějin jediným způsobem, jak se dokrmovalo.',
        ],
      },
    ],
    sources: [SZU_FIRST_SPOON, NHS_6M],
    literature: [KNIHA],
    reviewStatus: 'verified',
  },
];
