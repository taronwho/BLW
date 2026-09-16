import type { Guide } from '@/types';
import {
  MZCR_COMPLEMENTARY,
  NHS_6M,
  NHS_FIRST_FOODS,
  NHS_PREP_SAFELY,
  SZU_FIRST_SPOON,
} from '../ingredients/_sources';

const KNIHA = 'Baby-led weaning. Příběh metody vedené dítětem (kapitoly 1 a 2)';

/** Start příkrmu: připravenost, první potraviny, co je metoda vedená dítětem. */
export const starting: Guide[] = [
  {
    id: 'je-dite-pripravene',
    titleCz: 'Je dítě připravené?',
    category: 'zacatek',
    summary:
      'Nerozhoduje datum v kalendáři, ale tři vývojové znaky. Dokud nejsou pohromadě, nemá začínat žádná metoda příkrmu.',
    keyPoints: [
      'Vzpřímený sed a pevně držená hlava. Opora se počítá, sedět samo uprostřed pokoje nemusí.',
      'Koordinace oko–ruka–ústa: dítě sáhne po jídle a trefí si ho do pusy.',
      'Vyhasl vypuzovací reflex jazyka, kterým dítě vytlačuje ven všechno, co se mu dostane do úst.',
    ],
    sections: [
      {
        heading: 'Tři znaky, které musí být pohromadě',
        body: [
          'Klíčem k celé metodě není žádná filozofie, ale trojice vývojových znaků, které se u zdravého dítěte scházejí kolem šestého měsíce.',
          'Vzpřímený sed s pevně drženou hlavou. Cílené uchopení předmětu a jeho dopravení do úst. A vyhasnutí reflexu, kterým dítě jazykem vytlačuje ven všechno, co se mu dostane do pusy.',
          'Dokud tyhle tři věci nejsou pohromadě, nemá začínat ani jedna metoda příkrmu. Jakmile jsou, dá se začít oběma: lžičkou i kusy do ruky.',
          'Přidej k tomu čtvrtý, měkčí znak: dítě projevuje o jídlo zájem, sleduje, co jíte, a sahá po tom.',
        ],
      },
      {
        heading: 'Co přesně znamená sed',
        body: [
          'Tohle je nejčastější nedorozumění z celého seznamu, tak na rovinu. Doporučení mluví o tom, že dítě udrží polohu vsedě a hlavu drží pevně. Neříká, že musí umět sednout si samo ani sedět bez opory uprostřed pokoje.',
          'Opora se počítá. Židlička s oporou zad je v pořádku, klín dospělého taky. Rozhoduje, že je dítě ve vzpřímené poloze a nepropadá se, protože právě vzpřímený trup dovolí sousto bezpečně polknout. Vleže nebo v polosedu jde jídlo špatně a riziko se zbytečně zvyšuje.',
          'Dítě, které se v židličce sesouvá dopředu, převažuje na stranu nebo mu padá hlava, ještě připravené není. Nepomůže podložit ho polštáři: opora má držet záda, ne dítě v pozici, do které samo nedosáhne.',
          'Tenhle znak platí pro každý příkrm, ne jen pro jídlo do ruky. Někdy se tvrdí, že u mixované stravy ze lžičky sedět netřeba; doporučení takový rozdíl nedělá a vzpřímená poloha se u polykání hodí stejně.',
          'Pro dítě, které ještě samo nesedí, ale ostatní znaky má, se nabízí klín. Sedí zády opřené o hruď dospělého, vzpřímeně, a jídlo má před sebou. Není to náhrada za připravenost, jen řešení opory.',
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
          'Dítě v židličce padá na stranu nebo se sesouvá dopředu: sed ještě není stabilní.',
          'Jídlo se mu do pusy dostane jen náhodou, ne cíleným pohybem.',
          'Cokoli, co skončí v ústech, jazyk okamžitě vytlačí ven: vypuzovací reflex ještě nevyhasl.',
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
      'Jablko výhradně vařené nebo pečené: syrové je tak tvrdé, že se z něj lámou kusy.',
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
          'Avokádo. Zrádné tím, že klouže, proto se často obaluje ve strouhance nebo v ovesných vločkách.',
          'Banán rozkrojený podélně a z poloviny ponechaný ve slupce, aby ho dítě mělo za co držet.',
          'Hruška a jablko, ale jablko výhradně vařené nebo pečené.',
        ],
      },
      {
        heading: 'Velikost a tvar',
        body: [
          'Sousto má být podlouhlé, zhruba velikosti prstu dospělého, a má z pěsti vyčnívat. Dítě v tomhle věku ještě neumí uvolnit, co sevře v dlani: co zmizí celé v pěsti, k ústům nedoputuje.',
          'Kolem devátého měsíce se rozvíjí klešťový úchop mezi palcem a ukazovákem. Od té chvíle dávají smysl menší kousky velikosti fazole.',
          'Kluzké kousky se drží špatně. Obalení v mletých vločkách, ve strouhance nebo v mletých semínkách problém vyřeší.',
        ],
      },
      {
        heading: 'Čím začít podle SZÚ',
        body: [
          'Brožura SZÚ doporučuje začít zeleninou, nejčastěji mrkví, druhou v pořadí bývá dýně. Nesolí se, nesladí a nepřidává se nic dalšího.',
          'Mezi novými potravinami se nechávají dva až tři dny, aby se dala zachytit případná alergická reakce.',
          'Pro začátek stačí jedna až dvě lžičky podané před kojením v poledne nebo odpoledne. Libového masa se pak přidává zhruba 30 až 50 g, upraveného vařením, dušením nebo v páře.',
        ],
      },
    ],
    sources: [NHS_FIRST_FOODS, NHS_PREP_SAFELY, SZU_FIRST_SPOON],
    literature: [KNIHA],
    reviewStatus: 'verified',
  },
  {
    id: 'co-je-blw',
    titleCz: 'Co je BLW',
    category: 'zacatek',
    summary:
      'Metoda vedená dítětem: kojenec si od začátku bere jídlo sám, rukama, ze společného stolu. O tom, co a kolik toho sní, rozhoduje on.',
    keyPoints: [
      'Dítě jí samo rukama, nikdo mu nic nevkládá do úst a nikdo ho nepobízí.',
      'Jí to, co má rodina, jen bez soli, bez cukru a v bezpečném tvaru.',
      'Množství určuje dítě. Mléko zůstává do roku hlavním zdrojem výživy.',
    ],
    sections: [
      {
        heading: 'Co metoda je',
        body: [
          'Baby-led weaning znamená v překladu odstavování vedené dítětem. Česky se mu říká příkrm vedený dítětem a myslí se tím způsob, jak se kojenec dostane od samého mléka k běžnému jídlu.',
          'Místo kaše ze lžičky dostane dítě kus jídla přímo do ruky. Sedí u stolu s ostatními, před sebou má několik soust v takovém tvaru, aby se daly uchopit celou dlaní, a samo si vybere, po kterém sáhne, kolik toho sní a kdy skončí. Nikdo mu nic nevkládá do úst, nikdo ho nepobízí a nikdo nedojídá zbytek za něj.',
          'Jídlo je z velké části totéž, co jí zbytek rodiny. Vaří se jednou, dětská porce se odebere dřív, než se dosolí a dochutí, a zbytek se dosolí až na talíři dospělých. Tvar a úprava se dítěti přizpůsobí: doměkka, podlouhle, bez tvrdých a kulatých kousků.',
          'Začíná se kolem šestého měsíce a jen tehdy, když je dítě vývojově zralé. Stabilní sed, cílené uchopení a vyhaslý vypuzovací reflex jazyka rozhodují víc než datum v kalendáři. Podrobně je to v radě o připravenosti.',
        ],
      },
      {
        heading: 'Filozofie za tím',
        body: [
          'Celá metoda stojí na jedné myšlence: zdravý kojenec umí poznat, kdy má hlad a kdy už mu stačí, a je dobré mu tu schopnost nechat. Rodič odpovídá za to, co se objeví na stole, kdy se jí a v jakém prostředí. Kolik toho z nabídnutého skutečně zmizí, je věc dítěte.',
          'Jídlo se proto nebere jako výkon, který se má splnit. První týdny jsou hlavně o zkoumání. Dítě sousto mačká, olizuje, rozmazává a velká část jídla skončí na podlaze. To není neúspěch, ale způsob, jak se to učí: poznává tvar, povrch, teplotu a chuť dřív, než se něco doopravdy spolkne.',
          'Do roku zůstává hlavním zdrojem energie a živin mateřské mléko nebo umělá výživa. Příkrm se k němu přidává, nenahrazuje ho. Právě proto si metoda může dovolit nechat rozhodování na dítěti: nejde o to, aby se najedlo do sytosti, ale aby se naučilo jíst.',
          'Druhá myšlenka je společný stůl. Dítě jí ve stejnou dobu a totéž co ostatní, takže má co okoukávat. Napodobování je v tomhle věku silnější motivace než jakékoli přemlouvání a je to i důvod, proč se metoda vyhýbá zvláštní dětské kuchyni stranou od zbytku rodiny.',
          'Ze stejného myšlení plyne, co se v metodě nedělá. Nehraje se na letadlo, nedává se lžička do pusy ve chvíli, kdy je dítě otočené jinam, nedojídá se za každou cenu a jídlo se nepoužívá jako odměna ani jako útěcha. Odmítnutí se bere jako informace, ne jako spor, a surovina se prostě nabídne znovu za pár dní.',
          'Jedna věc je na filozofii metody vratká a stojí za to ji říct rovnou. Ani přístup vedený dítětem nezaručí, že dítě bude jíst pestře. Chuťové preference vznikají opakovaným setkáním s potravinou a i vybíravé období kolem druhého roku přijde u dětí krmených lžičkou i u těch, které jedly samy.',
        ],
      },
      {
        heading: 'Jak metoda vznikla',
        body: [
          'Pojmenování pochází z Británie z počátku tisíciletí a vzešlo z pozorování v praxi, ne z laboratoře. Zdravotní sestry, které rodiny navštěvovaly doma, si všimly, že kojenci kolem půl roku sahají po jídle sami a že se jim daří dostat ho do úst dřív, než se je to někdo pokusí naučit lžičkou.',
          'Roli sehrálo i posunutí doporučeného začátku příkrmu. Když se výlučné kojení začalo doporučovat do ukončeného šestého měsíce, dostávalo první jídlo starší a obratnější dítě, než jaké se dřív krmilo mixovanou stravou ve čtyřech měsících. Kojenec, který sedí a trefí si rukou do pusy, prostě lžičku k prvnímu soustu nepotřebuje.',
          'Metoda se pak rozšířila hlavně knihami a rodičovskými komunitami, ne oficiálními doporučeními. Tomu odpovídá i to, kolik se jí připisovalo: část tvrzení o ní vznikla v diskusích mezi rodiči dřív, než k nim existoval jakýkoli výzkum.',
          'Historicky přitom na myšlence není nic nového. Dávat dítěti do ruky kus jídla ze společného hrnce byl po většinu lidských dějin jediný způsob, jak se dokrmovalo. Mixovaná strava ze skleničky je vynález posledního století, ne dávná tradice.',
        ],
      },
      {
        heading: 'Co z ní přijala oficiální doporučení',
        body: [
          'Odborná doporučení metodu většinou nejmenují, ale několik jejích zásad se v nich objevuje jako běžná rada pro každý příkrm.',
          'Nabízet od začátku texturu a kusy k uchopení, ne měsíce jen hladkou kaši. Zavádět alergenní potraviny brzy a pak je opakovat. Nechat dítě rozhodovat o množství. Nesolit, nesladit a nabízet jídlo opakovaně i po odmítnutí.',
          'Česká doporučení k tomu přidávají věkové hranice: příkrm nejdřív po ukončeném 4. měsíci a nejpozději po ukončeném 6. měsíci, lepek nejpozději do ukončeného 7. měsíce, kojení ideálně dál spolu s příkrmem.',
        ],
      },
      {
        heading: 'Co metoda neslibuje',
        body: [
          'Prevence vybíravosti se metodě připisuje nejčastěji a je podložená nejhůř. Vybíravost je vývojová fáze, která se u většiny dětí objevuje mezi druhým a čtvrtým rokem a má svůj biologický smysl.',
          'Ochrana před nadváhou se v randomizovaném pokusu neprokázala. Nepotvrdil se ani vyšší příjem železa nebo energie.',
          'Z toho plyne praktický závěr: metoda se nemá volit kvůli výživovým výhodám, protože ty zařídí složení talíře, ne způsob podání. O železo, zinek a vitamin D se stará to, co na talíři je, ať už tam doputuje rukou, nebo lžičkou.',
          'A jedna věc, kterou metoda nemění vůbec: riziko dušení. Ani u kusů, ani u kaše se nesmí nechat jíst dítě bez dozoru, vleže, v autosedačce ani za jízdy. To platí pro každý způsob příkrmu stejně.',
        ],
      },
      {
        heading: 'Poznámka o lžičce',
        body: [
          'V čisté podobě se metoda v praxi drží málokdy a není to chyba. Šetření z různých zemí shodně ukazují, že rodin, které nikdy nepoužily lžičku, jsou jen jednotky procent.',
          'Nejběžnější je smíšený postup: dítě si bere kusy do ruky při většině jídel a lžičkou se podá to, co se do ruky vzít nedá, tedy jogurt, tvaroh, hustá polévka nebo kaše. Kombinace je pravidlo, ne selhání metody.',
          'I u lžičky se dá zůstat u téhož principu. Nabraná lžička se položí před dítě nebo se mu podá do ruky a ono si ji do pusy strčí samo. Rozhoduje pořád o množství i o konci jídla, jen se do hry dostal nástroj na to, co se udržet v prstech nedá.',
        ],
      },
    ],
    sources: [SZU_FIRST_SPOON, NHS_6M, MZCR_COMPLEMENTARY],
    literature: [KNIHA],
    reviewStatus: 'verified',
  },
];
