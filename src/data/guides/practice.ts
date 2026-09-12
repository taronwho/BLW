import type { Guide } from '@/types';
import {
  NHS_7_9M,
  NHS_10_12M,
  NHS_VEGETARIAN,
  NHS_YOUNG_CHILDREN,
  SZU_FIRST_SPOON,
} from '../ingredients/_sources';

const KNIHA = 'Baby-led weaning — příběh metody vedené dítětem (kapitoly 1 a 2)';

/** Praktický provoz: co čekat, jak vařit pro celou rodinu, jak na okolí. */
export const practice: Guide[] = [
  {
    id: 'prvni-mesice-nic-nejedl',
    titleCz: 'Když to vypadá, že dítě nic nejí',
    category: 'praxe',
    summary:
      'Období, kdy metoda vypadá jako nefunkční, trvá zhruba dva až tři měsíce. Pak se poměr mezi ústy a podlahou obrátí.',
    keyPoints: [
      'První měsíc je nácvik, ne výživa. Většinu energie zatím dodává mléko.',
      'Fáze, kdy to vypadá marně, trvá asi dva až tři měsíce.',
      'Kolem devátého až desátého měsíce začne být vidět, že dítě opravdu jí.',
    ],
    sections: [
      {
        heading: 'Co se doopravdy děje',
        body: [
          'Rozdíl mezi tím, co si dítě vezme, a tím, co skutečně spolkne, je v prvních týdnech propastný. Kus masa bývá ocucaný, rozvlákněný a vyplivnutý. Ovoce se rozmačká a část se spolkne. Chléb navlhne a rozpustí se.',
          'Z hlediska energie i železa je první měsíc spíš nácvikem než výživou. A to je v pořádku, dokud zbytek doplňuje mléko.',
          'Období, kdy metoda vypadá jako nefunkční, trvá zhruba dva až tři měsíce. Pak se poměr mezi tím, co skončí v ústech, a tím, co skončí na zemi, obrátí.',
        ],
      },
      {
        heading: 'Když do toho mluví okolí',
        body: [
          'Nejčastější situace, kterou rodiče popisují, je návštěva, při níž někdo sáhne po lžičce s odůvodněním, že dítě má hlad a nic nesnědlo.',
          'Konflikt přitom není o metodě, je o důvěře. Kdo vidí plný talíř a dítě, které se od něj odvrací, přirozeně z toho vyvodí, že něco není v pořádku. Vysvětlení, že dítě bere většinu energie z mléka a talíř je nácvik, není samozřejmé nikomu, kdo ho neslyšel.',
          'Řešení, které rodiny nacházejí, obvykle není argumentační. Přestanou metodu obhajovat a začnou ji jen provozovat — a spor odezní ve chvíli, kdy dítě začne viditelně jíst, tedy někdy kolem devátého až desátého měsíce.',
        ],
      },
      {
        heading: 'Kdy naopak zpozornět',
        body: [
          'Když dítě neprospívá, nepřibývá na váze nebo je nápadně unavené, nejde o fázi metody a patří to pediatrovi.',
          'Totéž platí při opakovaných infekcích nebo kožních změnách — mohou, ale nemusí souviset s nedostatkem zinku, a rozhodnout to aplikace neumí.',
        ],
      },
    ],
    sources: [NHS_7_9M, SZU_FIRST_SPOON],
    literature: [KNIHA],
    reviewStatus: 'verified',
  },
  {
    id: 'jedno-vareni-pro-celou-rodinu',
    titleCz: 'Jedno vaření pro celou rodinu',
    category: 'praxe',
    summary:
      'Základ se uvaří bez soli, odebere se porce pro dítě a teprve pak se dochucuje. Každý recept v aplikaci to má popsané krok po kroku.',
    keyPoints: [
      'Vař základ bez soli — dosolit jde vždycky, odsolit ne.',
      'Porce pro dítě se odebírá v konkrétním kroku, ještě před dochucením.',
      'Metoda nešetří čas plošně. Šetří ho těm, komu jejich stravování vyhovovalo už předtím.',
    ],
    sections: [
      {
        heading: 'Jak to funguje v receptech',
        body: [
          'Každý recept v aplikaci má společný základ, bod odběru dětské porce a pak tři zakončení: dětské, masité a bezmasé.',
          'Bod odběru je vždy uvedený doslova — „po kroku 3 odeber…" — abys nemusela odhadovat, kdy je ještě čas.',
          'Teprve po odběru se solí, kořeníme a dochucuje pro dospělé.',
        ],
      },
      {
        heading: 'Jak vypadá běžná příprava',
        body: [
          'Zelenina se vaří v páře nebo peče na plechu doměkka, obvykle několik druhů najednou a na několik dní dopředu.',
          'Maso se dusí dlouho a rozvlákňuje. Luštěniny se vaří ve větším množství a mrazí se v porcích.',
          'Nejde o gastronomii, jde o zásobování — a rodiče to tak sami popisují.',
        ],
      },
      {
        heading: 'Upřímně o čase',
        body: [
          'Tvrzení, že odpadá vaření zvláštních porcí, platí jen částečně. Když rodina jí hodně soleně a kořeněně nebo hodně polotovarů, musí se pro dítě stejně vařit zvlášť — a úspora se ztrácí.',
          'Metoda tedy nešetří čas plošně. Šetří ho těm, jejichž stravování jí vyhovovalo už předtím.',
        ],
      },
      {
        heading: 'Bezmasá domácnost',
        body: [
          'Vegetariánská linie musí nést bílkovinu, ne jen vynechat maso. V aplikaci má proto každý recept s masem uvedenou konkrétní náhradu — čočku, cizrnu, tofu, vejce nebo sýr.',
          'Rostlinné železo se vstřebává hůř, proto se luštěniny a obiloviny podávají spolu s vitaminem C z ovoce nebo zeleniny.',
        ],
      },
    ],
    sources: [NHS_VEGETARIAN, NHS_YOUNG_CHILDREN, SZU_FIRST_SPOON],
    literature: [KNIHA],
    reviewStatus: 'verified',
  },
  {
    id: 'textury-a-postup-behem-roku',
    titleCz: 'Jak se mění textury během roku',
    category: 'praxe',
    summary:
      'Od podlouhlých kusů do pěsti přes klešťový úchop až k rodinné stravě. Fáze 6m+, 9m+ a 12m+ najdeš u každé suroviny i receptu.',
    keyPoints: [
      '6m+ — podlouhlé měkké kusy velikosti prstu, které z pěsti vyčnívají.',
      '9m+ — menší kousky velikosti fazole pro úchop mezi palec a ukazovák.',
      '12m+ — rodinná strava, tvrdší textury, dítě jí lžící samo.',
    ],
    sections: [
      {
        heading: 'Proč se textury posouvají',
        body: [
          'Spouštěcí zóna dávicího reflexu se během prvního roku posouvá dozadu. Dítě proto postupně zvládne větší a pevnější sousta, aniž by dávilo.',
          'Zároveň se mění úchop. Zpočátku dítě sevře jídlo v pěsti a neumí ho uvolnit, takže potřebuje kus, který vyčnívá. Kolem devátého měsíce se rozvine klešťový úchop a menší kousky začnou dávat smysl.',
          'Odkládání tuhších textur je chyba. Dítě, které se s nimi nesetká, se je nenaučí zpracovávat.',
        ],
      },
      {
        heading: 'Co se mění v jídelníčku',
        body: [
          'Kolem sedmého měsíce se přidávají mléčné výrobky, nejvhodnější je bílý jogurt s obsahem tuku kolem 3 až 3,5 %.',
          'Postupně se poledne mění z mléčné porce na zeleninu s masem, dopoledne přibývá ovoce a večer obilná kaše. Kolem prvního roku má jídelníček strukturu podobnou jídelníčku dospělých: snídaně, oběd, večeře a dvě svačiny.',
          'Celozrnné pečivo a celozrnné obiloviny jsou bod, ve kterém se česká a britská praxe rozcházejí. Brožura SZÚ je řadí až od dvou let, britská doporučení dřív. V aplikaci jsou proto vedené jako běžná surovina, ale tenhle rozpor je dobré znát.',
        ],
      },
      {
        heading: 'Kde to v aplikaci najdeš',
        body: [
          'U každé suroviny je popis pro všechny tři fáze zvlášť — jak ji nakrájet, na co si dát pozor a jak ji podat.',
          'U každého receptu najdeš totéž pro hotové jídlo: jak porci podat v šesti, v devíti a ve dvanácti měsících.',
          'Přepínač fáze v Domácnosti se předvybírá podle data narození, ale můžeš ho kdykoli přepnout ručně.',
        ],
      },
    ],
    sources: [NHS_7_9M, NHS_10_12M, SZU_FIRST_SPOON],
    literature: [KNIHA],
    reviewStatus: 'verified',
  },
];
