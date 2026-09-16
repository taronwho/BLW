import type { Recipe } from '@/types';
import {
  EFSA_CAFFEINE,
  NHS_FIRST_FOODS,
  NHS_IRON,
  NHS_PREP_SAFELY,
  NHS_YOUNG_CHILDREN,
} from '../ingredients/_sources';

/**
 * Jednoduché úpravy: co zbývá ze spíže.
 *
 * Karob, soda, ocet ani kakao nejsou jídlo, ale rodič je koupí a pak neví,
 * jestli z nich smí dítěti něco dát. Tyhle tři recepty ukazují jedinou
 * podobu, ve které do dětského jídla patří.
 */
export const prvniUpravyZbytek2: Recipe[] = [
  {
    id: 'karobovy-krem-banan-jogurt',
    titleCz: 'Karobový krém z banánu a jogurtu',
    category: 'svaciny-peceni',
    minAgeMonths: 6,
    timeMinutes: 5,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'karob', amount: '1 lžička', track: 'all' },
      { ingredientId: 'banan', amount: '2 zralé', track: 'all' },
      { ingredientId: 'jogurt-bily-plnotucny', amount: '250 g', track: 'all' },
    ],
    baseSteps: [
      'Banány rozmačkej vidličkou na kaši. Zralý banán se rozpadne sám a krém se nemusí ničím slazovat.',
      'Jogurt rozmíchej v misce a vmíchej do něj banán.',
      'Vsyp lžičku karobu a rozmíchej dohladka. Karob je mletý lusk svatojánského chleba a chutná podobně jako kakao, jen jemněji.',
      'Od tohoto místa se miska dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint: 'Po kroku 3 odeber dvě lžíce karobového krému, ještě než se miska dochucuje.',
    babySteps: [
      'Karob je přirozeně sladký, takže se do porce nepřidává nic dalšího.',
      'Krém je po karobu tmavý a vypadá jako čokoládový, přitom v něm žádná sladká složka navíc není.',
      'Karobové tyčinky a sušenky z obchodu jsou něco jiného než mletý karob ze sáčku; pro dítě se hodí jen ten druhý.',
    ],
    babyServing: {
      '6m': 'Hustý karobový krém na předem naložené lžíci.',
      '9m': 'Miska krému, do které se dítě pouští lžící samo, nebo krém namazaný na proužek pečiva.',
      '12m': 'Karobový krém jako pro dospělé, neslazený.',
    },
    adultSteps: [
      'Do zbytku krému zamíchej lžíci mandlového másla a med.',
      'Karob rychle nasává vlhkost, skladuj ho v uzavřené nádobě.',
    ],
    allergens: ['mleko'],
    tags: ['vegetariánské', 'bez lepku', 'rychlé', 'studená kuchyně'],
    sources: [NHS_FIRST_FOODS, NHS_IRON],
    reviewStatus: 'verified',
  },
  {
    id: 'placky-soda-ocet',
    titleCz: 'Placky nakynuté sodou a jablečným octem',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 25,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'mouka-psenicna-hladka', amount: '250 g', track: 'all' },
      { ingredientId: 'jedla-soda', amount: 'čtvrt lžičky', track: 'all' },
      { ingredientId: 'ocet-jablecny', amount: '1 lžička', track: 'all' },
      { ingredientId: 'voda', amount: '180 ml', track: 'all' },
    ],
    baseSteps: [
      'Mouku smíchej se sodou. Jedlá soda sama nekypří, potřebuje kyselou složku, a tou je tady jablečný ocet.',
      'Přidej vodu s octem a zpracuj vláčné těsto. Do dětských placek stačí čtvrt lžičky sody; víc není potřeba a pečivo by zhořklo.',
      'Rozděl těsto na šest dílů, rozválej je natenko a peč na suché pánvi dvě minuty z každé strany.',
      'Hotová placka se nafoukne a při stisknutí se vrátí zpátky.',
      'Od tohoto místa se talíř dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint: 'Po kroku 4 odlož jednu placku pro dítě, ještě než se ostatní dochucují.',
    babySteps: [
      'Placku natrhej na proužky široké jako dospělý prst.',
      'Ocet je v těstě jen jako kyselá složka pro sodu, na chuti ho poznat nemá být. Samotný ocet ani ocet ve vodě dítěti nedávej nikdy, dráždí sliznici.',
      'Kyselá složka v jídle zároveň zlepšuje využitelnost rostlinného železa ze stejného pokrmu.',
    ],
    babyServing: {
      '6m': 'Proužek placky, který dítě sevře v pěstičce.',
      '9m': 'Kousky placky na namáčení do pyré nebo do luštěninové pomazánky.',
      '12m': 'Celá placka jako příloha, stejně jako pro dospělé.',
    },
    adultSteps: [
      'Zbylé placky osol, potři je máslem s česnekem a posyp bylinkami.',
      'Podávej je k polévce nebo jako obal na plněnou placku.',
    ],
    allergens: ['psenice-lepek'],
    tags: ['vegetariánské', 'rychlé', 'do ruky'],
    sources: [NHS_FIRST_FOODS, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'kakaova-kase-pro-batole',
    titleCz: 'Kakaová kaše pro batole',
    category: 'snidane',
    minAgeMonths: 12,
    timeMinutes: 15,
    servings: '2 dospělí + 1 batole',
    ingredients: [
      { ingredientId: 'kakao-100', amount: '1 lžička', track: 'all' },
      { ingredientId: 'ovesne-vlocky-jemne', amount: '8 lžic', track: 'all' },
      { ingredientId: 'banan', amount: '2 zralé', track: 'all' },
      { ingredientId: 'kravske-mleko', amount: '400 ml', track: 'all' },
    ],
    baseSteps: [
      'Vločky zalij mlékem a vař pět minut do zhoustnutí.',
      'Banány rozmačkej vidličkou a vmíchej je do kaše; sladkost dodají ony, ne cukr.',
      'Vsyp lžičku stoprocentního kakaa a rozmíchej. Kakao z obchodu určené do mléka je z větší části sladká složka, proto se míchá doma z čistého prášku.',
      'Od tohoto místa se hrnec dělí. Porce pro batole jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint: 'Po kroku 3 odeber dvě lžíce kakaové kaše, ještě než se hrnec dochucuje.',
    babySteps: [
      'Kakaové boby obsahují kofein, tedy povzbuzující látku. Kakao proto zůstává výjimkou, ne každodenní položkou.',
      'Porci podávej spíš dopoledne; kofein z kakaa může rušit usínání.',
      'Do prvního roku se kakao nenabízí vůbec. Podobnou tmavou chuť dodá karob, který je přirozeně sladký.',
    ],
    babyServing: {
      '6m': 'V tomhle věku kakao do jídelníčku nezařazuj; uvař stejnou kaši s karobem.',
      '9m': 'Ani teď se kakao nedoporučuje, karob dodá stejnou tmavou chuť.',
      '12m': 'Malá porce kakaové kaše s banánem, nejlépe dopoledne a jen občas.',
    },
    adultSteps: [
      'Do zbytku kaše zamíchej med nebo javorový sirup a posyp ji mletými ořechy.',
      'Kaše po vychladnutí zhoustne, ráno ji rozmíchej s trochou mléka.',
    ],
    allergens: ['psenice-lepek', 'mleko'],
    tags: ['vegetariánské', 'rychlé', 'rodinné'],
    sources: [EFSA_CAFFEINE, NHS_YOUNG_CHILDREN],
    reviewStatus: 'verified',
  },
];
