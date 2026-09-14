import type { Recipe } from '@/types';
import {
  NHS_FIRST_FOODS,
  NHS_VEGETARIAN,
} from '../ingredients/_sources';

/**
 * Snídaně a svačiny bez mléka.
 *
 * Alergie na bílkovinu kravského mléka je v prvním roce nejčastější, ale
 * kuchařka měla ze sedmapadesáti snídaní jen sedm bez mléka a jen čtyři bez
 * mléka a lepku zároveň. Tahle dávka ten rozdíl dorovnává: základ tvoří voda,
 * kokosové mléko nebo kokosový jogurt, obiloviny jsou bezlepkové a většina
 * receptů se obejde i bez vejce.
 *
 * Rostlinné nápoje (ovesný, mandlový, sójový) se tu nepoužívají — do prvního
 * roku nejsou náhradou mléka a v katalogu jsou vedené od dvanácti měsíců.
 * Kokosové mléko je v receptu složkou pokrmu, ne nápojem.
 */
export const bezMleka: Recipe[] = [
  {
    id: 'jahlova-kase-na-kokosovem-mleku-s-mangem',
    titleCz: 'Jáhlová kaše na kokosovém mléku s mangem',
    category: 'snidane',
    minAgeMonths: 6,
    timeMinutes: 30,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'jahly', amount: '200 g', track: 'all' },
      { ingredientId: 'mleko-kokosove', amount: '400 ml', track: 'all' },
      { ingredientId: 'mango', amount: '1 zralé', track: 'all' },
      { ingredientId: 'limetka', amount: 'půlka', track: 'all' },
      { ingredientId: 'seminka-lnena-mleta', amount: '2 lžíce', track: 'all' },
    ],
    baseSteps: [
      'Jáhly spař vroucí vodou a slij ji, jinak zůstanou nahořklé.',
      'Zalij je kokosovým mlékem zředěným stejným dílem vody a vař dvacet minut doměkka.',
      'Mango oloupej, dužinu odkroj od pecky a nakrájej ji na kostky.',
      'Polovinu manga rozmačkej vidličkou a vmíchej do hotové kaše.',
      'Kaši rozděl na tři porce a zbylé kostky manga nech na ozdobu.',
    ],
    babySplitPoint:
      'Po kroku 4 odeber dvě lžíce kaše do misky, dřív než se zbytek dochucuje pro dospělé.',
    babySteps: [
      'Do porce vmíchej lžičku mletých lněných semínek; kaše po nich zhoustne a drží na lžíci.',
      'Kápni pár kapek limetkové šťávy — vitamin C pomáhá vstřebat železo z jáhel i ze lnu.',
      'Nech porci zvlažnět a teplotu zkontroluj kapkou na zápěstí.',
    ],
    babyServing: {
      '6m': 'Podávej hustou kaši na předložené lžíci, kterou dítě olízne, a vedle proužek manga dlouhý jako dospělý prst.',
      '9m': 'Nabídni kaši v mělké misce a kostky manga na tácku pro klešťový úchop.',
      '12m': 'Servíruj kaši v misce se lžící a kostky manga navrch; batole si porci míchá samo.',
    },
    adultSteps: [
      'Kaši pro dospělé oslaď podle chuti a zakápni limetkou.',
      'Posyp ji zbylými mletými lněnými semínky.',
    ],
    allergens: [],
    tags: ['vegetariánské', 'bez lepku', 'kaše'],
    sources: [NHS_FIRST_FOODS, NHS_VEGETARIAN],
    reviewStatus: 'verified',
  },
  {
    id: 'pohankova-kase-s-kokosovym-jogurtem-a-jahodami',
    titleCz: 'Pohanková kaše s kokosovým jogurtem a jahodami',
    category: 'snidane',
    minAgeMonths: 6,
    timeMinutes: 25,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'pohanka-lamanka', amount: '200 g', track: 'all' },
      { ingredientId: 'kokosovy-jogurt', amount: '300 g', track: 'all' },
      { ingredientId: 'jahody', amount: '250 g', track: 'all' },
      { ingredientId: 'mandlove-maslo', amount: '2 lžíce', track: 'all' },
    ],
    baseSteps: [
      'Pohanku propláchni pod tekoucí vodou, dokud voda nezůstane čirá.',
      'Zalij ji dvojnásobkem vody a vař patnáct minut, pak ji nech pod pokličkou dojít.',
      'Jahody zbav stopek, velké rozřež podélně na čtvrtky a menší rozmačkej vidličkou.',
      'Do hotové pohanky vmíchej kokosový jogurt, ať kaše zkrémovatí.',
    ],
    babySplitPoint:
      'Po kroku 4 odeber dvě lžíce kaše do misky, dřív než se zbytek dochucuje pro dospělé.',
    babySteps: [
      'Do porce vmíchej půl lžičky mandlového másla rozmíchaného dohladka do řídké kaše, jinak se lepí na patro.',
      'Přidej rozmačkané jahody — vitamin C z nich pomáhá vstřebat železo z pohanky.',
      'Nech porci zvlažnět a podávej ji hned.',
    ],
    babyServing: {
      '6m': 'Podávej hustou kaši s rozmačkanými jahodami na lžíci, kterou dítě olizuje z dlaně.',
      '9m': 'Nabídni kaši v misce a jahody rozkrojené podélně na čtvrtky pro klešťový úchop.',
      '12m': 'Servíruj kaši s jahodami nakrájenými na plátky; batole si ji nabírá lžící samo.',
    },
    adultSteps: [
      'Kaši pro dospělé promíchej se zbytkem mandlového másla.',
      'Navrch dej zbylé jahody a lžíci kokosového jogurtu.',
    ],
    allergens: ['orechy'],
    tags: ['vegetariánské', 'bez lepku', 'kaše'],
    sources: [NHS_FIRST_FOODS, NHS_VEGETARIAN],
    reviewStatus: 'verified',
  },
  {
    id: 'amarantova-kase-s-hruskou-a-pomerancem',
    titleCz: 'Amarantová kaše s hruškou a pomerančem',
    category: 'snidane',
    minAgeMonths: 6,
    timeMinutes: 30,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'amarant', amount: '200 g', track: 'all' },
      { ingredientId: 'hruska', amount: '2 kusy', track: 'all' },
      { ingredientId: 'pomeranc', amount: '1 kus', track: 'all' },
      { ingredientId: 'mandle-mlete', amount: '2 lžíce', track: 'all' },
      { ingredientId: 'olej-kokosovy', amount: '1 lžíce', track: 'all' },
    ],
    baseSteps: [
      'Amarant propláchni v jemném sítku a zalij trojnásobkem vody.',
      'Vař ho dvacet minut na mírném plameni, dokud zrnka nezprůhlední a kaše nezhoustne.',
      'Hrušky oloupej, zbav jádřince a nakrájej je na kostky.',
      'Hruškové kostky krátce prohřej na kokosovém oleji, dokud nezměknou.',
      'Pomeranč oloupej, rozeber na dílky a z každého sundej bílou blánu.',
    ],
    babySplitPoint:
      'Po kroku 4 odeber dvě lžíce kaše s hruškou do misky, dřív než se zbytek dochucuje pro dospělé.',
    babySteps: [
      'Hruškové kostky v porci rozmačkej vidličkou, ať se s kaší spojí.',
      'Přidej kousek pomerančové dužiny bez blan; vitamin C z něj pomáhá vstřebat železo z amarantu.',
      'Vmíchej lžičku mletých mandlí a nech porci zvlažnět.',
    ],
    babyServing: {
      '6m': 'Podávej hustou kaši na předložené lžíci a vedle proužek dušené hrušky na délku prstu.',
      '9m': 'Nabídni kaši v mělké misce a hruškové kostky vedle na sbírání dvěma prsty.',
      '12m': 'Servíruj kaši s hruškou a pomerančovou dužinou navrch; batole jí lžící samo.',
    },
    adultSteps: [
      'Kaši pro dospělé oslaď podle chuti a promíchej s dílky pomeranče.',
      'Posyp ji zbylými mletými mandlemi.',
    ],
    allergens: ['orechy'],
    tags: ['vegetariánské', 'bez lepku', 'kaše'],
    sources: [NHS_FIRST_FOODS, NHS_VEGETARIAN],
    reviewStatus: 'verified',
  },
  {
    id: 'quinoova-snidane-s-boruvkami-a-kokosem',
    titleCz: 'Quinoová snídaně s borůvkami a kokosem',
    category: 'snidane',
    minAgeMonths: 6,
    timeMinutes: 25,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'quinoa', amount: '200 g', track: 'all' },
      { ingredientId: 'mleko-kokosove', amount: '300 ml', track: 'all' },
      { ingredientId: 'boruvky', amount: '200 g', track: 'all' },
      { ingredientId: 'kokos-strouhany', amount: '2 lžíce', track: 'all' },
      { ingredientId: 'pomeranc', amount: '1 kus', track: 'all' },
    ],
    baseSteps: [
      'Quinou propláchni pod tekoucí vodou, aby ztratila nahořklý povlak.',
      'Zalij ji kokosovým mlékem zředěným stejným dílem vody a vař dvanáct minut.',
      'Hrnec odstav, přiklop a nech quinou pět minut dojít, pak ji načechrej vidličkou.',
      'Borůvky propláchni a nech je okapat na utěrce.',
      'Pomeranč oloupej, rozeber na dílky a z každého sundej bílou blánu.',
    ],
    babySplitPoint:
      'Po kroku 3 odeber dvě lžíce quinoy do misky, dřív než se do hrnce přidávají celé borůvky.',
    babySteps: [
      'Každou borůvku pro dítě rozkroj podélně na čtvrtky; celá bobule má tvar, který uzavře dýchací cesty.',
      'Rozčtvrcené borůvky rozmačkej vidličkou a vmíchej do quinoy, ať porce drží pohromadě.',
      'Přidej kousek pomerančové dužiny bez blan; vitamin C z něj pomáhá vstřebat železo z quinoy.',
    ],
    babyServing: {
      '6m': 'Podávej quinou s rozmačkanými borůvkami jako hustou kaši na předložené lžíci.',
      '9m': 'Nabídni quinou v mělké misce a borůvky rozkrojené podélně na čtvrtky vedle.',
      '12m': 'Servíruj quinou s borůvkami rozkrojenými podélně na čtvrtky i teď; celý plod nenabízej.',
    },
    adultSteps: [
      'Quinou pro dospělé promíchej s celými borůvkami a dílky pomeranče.',
      'Posyp ji strouhaným kokosem opraženým nasucho na pánvi.',
    ],
    allergens: [],
    tags: ['vegetariánské', 'bez lepku', 'kaše'],
    sources: [NHS_FIRST_FOODS, NHS_VEGETARIAN],
    reviewStatus: 'verified',
  },
  {
    id: 'bezlepkova-ovesna-kase-na-vode-s-kiwi',
    titleCz: 'Bezlepková ovesná kaše na vodě s kiwi',
    category: 'snidane',
    minAgeMonths: 6,
    timeMinutes: 15,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'oves-bezlepkovy', amount: '150 g', track: 'all' },
      { ingredientId: 'kiwi', amount: '2 kusy', track: 'all' },
      { ingredientId: 'tahini', amount: '2 lžíce', track: 'all' },
      { ingredientId: 'banan', amount: '1 zralý', track: 'all' },
    ],
    baseSteps: [
      'Bezlepkový oves zalij trojnásobkem vody a vař ho osm minut za občasného míchání.',
      'Banán oloupej a rozmačkej vidličkou; kaše po něm zesládne bez cukru.',
      'Rozmačkaný banán vmíchej do hotové kaše a nech ji dvě minuty odstát.',
      'Kiwi oloupej a nakrájej na měsíčky nebo dužinu vyber lžičkou z rozkrojené půlky.',
    ],
    babySplitPoint:
      'Po kroku 3 odeber dvě lžíce kaše do misky, dřív než se zbytek dochucuje pro dospělé.',
    babySteps: [
      'Do porce vmíchej půl lžičky tahini rozmíchaného lžící vody, husté se lepí na patro.',
      'Přidej měkké kousky kiwi; vitamin C z nich pomáhá vstřebat železo z ovsa i z tahini.',
      'Nech porci zvlažnět a teplotu zkontroluj kapkou na zápěstí.',
    ],
    babyServing: {
      '6m': 'Podávej hustou kaši na předložené lžíci a vedle proužek kiwi dlouhý jako dospělý prst.',
      '9m': 'Nabídni kaši v mělké misce a kiwi v kostkách na sbírání dvěma prsty.',
      '12m': 'Servíruj kaši s kostkami kiwi navrch a lžící vedle; batole jí samo.',
    },
    adultSteps: [
      'Kaši pro dospělé promíchej se zbytkem tahini a osol podle chuti.',
      'Navrch dej měsíčky kiwi a zakápni je lžící vody z vaření.',
    ],
    allergens: ['sezam'],
    tags: ['vegetariánské', 'bez lepku', 'rychlé', 'kaše'],
    sources: [NHS_FIRST_FOODS, NHS_VEGETARIAN],
    reviewStatus: 'verified',
  },
  {
    id: 'ryzova-kase-s-kokosovym-mlekem-a-papajou',
    titleCz: 'Rýžová kaše s kokosovým mlékem a papájou',
    category: 'snidane',
    minAgeMonths: 6,
    timeMinutes: 35,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'ryze-kulatozrnna', amount: '200 g', track: 'all' },
      { ingredientId: 'mleko-kokosove', amount: '400 ml', track: 'all' },
      { ingredientId: 'papaja', amount: '1 menší', track: 'all' },
      { ingredientId: 'limetka', amount: 'půlka', track: 'all' },
      { ingredientId: 'seminka-chia', amount: '1 lžíce', track: 'all' },
    ],
    baseSteps: [
      'Rýži propláchni a zalij kokosovým mlékem zředěným stejným dílem vody.',
      'Vař ji pětadvacet minut na mírném plameni a průběžně míchej, ať se nepřichytí.',
      'Papáju rozkroj, vyber lžící tmavá zrníčka ze středu a dužinu nakrájej na silné proužky.',
      'Část proužků rozmačkej vidličkou a vmíchej do hotové kaše.',
    ],
    babySplitPoint:
      'Po kroku 4 odeber dvě lžíce kaše do misky, dřív než se zbytek dochucuje pro dospělé.',
    babySteps: [
      'Do porce vmíchej špetku rozdrcených chia semínek a nech je pět minut nabobtnat, kaše tím zhoustne.',
      'Kápni pár kapek limetkové šťávy; vitamin C pomáhá vstřebat rostlinné železo z porce.',
      'Nech kaši zvlažnět a podávej ji hned, po vychladnutí ztuhne.',
    ],
    babyServing: {
      '6m': 'Podávej hustou kaši na předložené lžíci a vedle proužek papáji dlouhý jako dospělý prst.',
      '9m': 'Nabídni kaši v mělké misce a papáju v kostkách pro klešťový úchop.',
      '12m': 'Servíruj kaši s kostkami papáji a lžící vedle; batole si porci míchá samo.',
    },
    adultSteps: [
      'Kaši pro dospělé zakápni limetkovou šťávou a oslaď podle chuti.',
      'Navrch dej zbylé proužky papáji.',
    ],
    allergens: [],
    tags: ['vegetariánské', 'bez lepku', 'kaše'],
    sources: [NHS_FIRST_FOODS, NHS_VEGETARIAN],
    reviewStatus: 'verified',
  },
  {
    id: 'chia-pudink-na-kokosovem-mleku-s-jahodami',
    titleCz: 'Chia pudink na kokosovém mléku s jahodami',
    category: 'snidane',
    minAgeMonths: 6,
    timeMinutes: 10,
    servings: '2 dospělí + 1 miminko, příprava večer předem',
    ingredients: [
      { ingredientId: 'seminka-chia', amount: '5 lžic', track: 'all' },
      { ingredientId: 'mleko-kokosove', amount: '400 ml', track: 'all' },
      { ingredientId: 'jahody', amount: '250 g', track: 'all' },
      { ingredientId: 'banan', amount: '1 zralý', track: 'all' },
    ],
    baseSteps: [
      'Chia semínka zalij kokosovým mlékem zředěným stejným dílem vody a důkladně promíchej.',
      'Po deseti minutách promíchej podruhé, ať se semínka neslepí do hrudek, a nech je přes noc v chladu.',
      'Ráno zkontroluj, že jsou semínka nabobtnalá a pudink hustý; jinak přidej lžíci vody a počkej.',
      'Jahody zbav stopek, velké rozřež podélně na čtvrtky a menší rozmačkej vidličkou.',
      'Banán oloupej a nakrájej na kolečka, která rozděl do sklenic pro dospělé.',
    ],
    babySplitPoint:
      'Po kroku 4 odeber dvě lžíce pudinku s rozmačkanými jahodami, dřív než se vrství sklenice.',
    babySteps: [
      'Pudink pro dítě prožeň tyčovým mixérem, aby byla nabobtnalá chia semínka rozdrcená a hmota úplně hladká.',
      'Vmíchej rozmačkané jahody; vitamin C z nich pomáhá vstřebat rostlinné železo z pudinku.',
      'Přidej lžíci rozmačkaného banánu, který porci zjemní a sladí bez cukru.',
    ],
    babyServing: {
      '6m': 'Podávej hustý pudink na předložené lžíci, kterou dítě olizuje, a vedle proužek banánu do dlaně.',
      '9m': 'Nabídni pudink v mělké misce a jahody rozkrojené podélně na čtvrtky pro klešťový úchop.',
      '12m': 'Servíruj sklenici s pudinkem, jahodami a kolečky banánu; batole jí lžící samo.',
    },
    adultSteps: [
      'Sklenice pro dospělé navrství pudinkem, jahodami a kolečky banánu.',
      'Podávej je vychlazené hned ráno, pudink druhý den zvodnatí.',
    ],
    allergens: [],
    tags: ['vegetariánské', 'bez lepku', 'bez pečení'],
    sources: [NHS_FIRST_FOODS, NHS_VEGETARIAN],
    reviewStatus: 'verified',
  },
  {
    id: 'kukuricna-kase-s-dyni-a-pomerancem',
    titleCz: 'Kukuřičná kaše s dýní a pomerančem',
    category: 'snidane',
    minAgeMonths: 6,
    timeMinutes: 30,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'polenta', amount: '150 g', track: 'all' },
      { ingredientId: 'dyne-hokaido', amount: '500 g', track: 'all' },
      { ingredientId: 'pomeranc', amount: '1 kus', track: 'all' },
      { ingredientId: 'olej-kokosovy', amount: '1 lžíce', track: 'all' },
      { ingredientId: 'seminka-dynova-mleta', amount: '2 lžíce', track: 'all' },
    ],
    baseSteps: [
      'Dýni hokaido rozkroj, vyber semena a dužinu i se slupkou nakrájej na kostky.',
      'Kostky dus na kokosovém oleji patnáct minut pod pokličkou, dokud se nerozpadají.',
      'Polentu vsyp tenkým proudem do trojnásobku vroucí vody a za stálého míchání vař deset minut.',
      'Dušenou dýni rozmačkej a vmíchej do kaše, která tím zežloutne a zesládne.',
      'Pomeranč oloupej, rozeber ho na dílky a z každého sundej bílou blánu.',
    ],
    babySplitPoint:
      'Po kroku 4 odeber dvě lžíce kaše do misky, dřív než se zbytek dochucuje pro dospělé.',
    babySteps: [
      'Do porce vmíchej lžičku mletých dýňových semínek; jiná než mletá podoba do dětské porce nepatří.',
      'Přidej kousek pomerančové dužiny bez blan a bez jadérek — vitamin C pomáhá vstřebat železo z mletých semínek.',
      'Nech porci zvlažnět a teplotu zkontroluj kapkou na zápěstí.',
    ],
    babyServing: {
      '6m': 'Podávej hustou kaši rozetřenou na talíři a vedle proužek dušené dýně dlouhý jako dospělý prst.',
      '9m': 'Nech kaši ztuhnout na plechu, nakrájej ji na hranolky a nabídni je vedle pomerančové dužiny.',
      '12m': 'Servíruj kaši v misce se lžící a pomerančem po straně; batole si porci míchá samo.',
    },
    adultSteps: [
      'Kaši pro dospělé osol, opepři a promíchej s dílky pomeranče.',
      'Posyp ji zbylými mletými dýňovými semínky.',
    ],
    allergens: [],
    tags: ['vegetariánské', 'bez lepku', 'podzimní', 'kaše'],
    sources: [NHS_FIRST_FOODS, NHS_VEGETARIAN],
    reviewStatus: 'verified',
  },
  {
    id: 'jahlova-kase-s-merunkami-a-slunecnicovym-maslem',
    titleCz: 'Jáhlová kaše s meruňkami a slunečnicovým máslem',
    category: 'snidane',
    minAgeMonths: 6,
    timeMinutes: 30,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'jahly', amount: '200 g', track: 'all' },
      { ingredientId: 'merunka', amount: '6 kusů', track: 'all' },
      { ingredientId: 'slunecnicove-maslo', amount: '2 lžíce', track: 'all' },
      { ingredientId: 'pomeranc', amount: '1 kus', track: 'all' },
    ],
    baseSteps: [
      'Jáhly spař vroucí vodou a slij ji, jinak zůstanou nahořklé.',
      'Zalij je trojnásobkem vody a vař dvacet minut doměkka.',
      'Meruňky rozpul, vypeckuj a nakrájej na plátky.',
      'Polovinu meruněk krátce podus v hrnci s lžící vody, dokud nezměknou doměkka.',
      'Dušené meruňky vmíchej do hotové kaše a rozděl ji na tři porce.',
    ],
    babySplitPoint:
      'Po kroku 5 odeber dvě lžíce kaše do misky, dřív než se zbytek dochucuje pro dospělé.',
    babySteps: [
      'Do porce vmíchej půl lžičky slunečnicového másla rozmíchaného lžící vody, husté se lepí na patro.',
      'Z pomeranče vymačkej pár kapek šťávy; vitamin C pomáhá vstřebat železo z jáhel.',
      'Nech porci zvlažnět a podávej ji hned.',
    ],
    babyServing: {
      '6m': 'Podávej hustou kaši na předložené lžíci a vedle plátek dušené meruňky do dlaně.',
      '9m': 'Nabídni kaši v mělké misce a meruňkové plátky vedle na sbírání dvěma prsty.',
      '12m': 'Servíruj kaši s čerstvými meruňkami nakrájenými na osminky a lžící vedle.',
    },
    adultSteps: [
      'Kaši pro dospělé promíchej se zbytkem slunečnicového másla a oslaď podle chuti.',
      'Navrch dej čerstvé plátky meruněk a zakápni je pomerančovou šťávou.',
    ],
    allergens: [],
    tags: ['vegetariánské', 'bez lepku', 'letní', 'kaše'],
    sources: [NHS_FIRST_FOODS, NHS_VEGETARIAN],
    reviewStatus: 'verified',
  },
  {
    id: 'pohankove-livanecky-bez-mleka-a-vejce',
    titleCz: 'Pohankové lívanečky bez mléka a vejce',
    category: 'snidane',
    minAgeMonths: 6,
    timeMinutes: 25,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'mouka-pohankova', amount: '150 g', track: 'all' },
      { ingredientId: 'tapiokovy-skrob', amount: '2 lžíce', track: 'all' },
      { ingredientId: 'banan', amount: '2 zralé', track: 'all' },
      { ingredientId: 'jahody', amount: '200 g', track: 'all' },
      { ingredientId: 'olej-kokosovy', amount: '2 lžíce', track: 'all' },
    ],
    baseSteps: [
      'Banány oloupej a rozmačkej vidličkou dohladka; drží těsto pohromadě místo vejce.',
      'Pohankovou mouku smíchej s tapiokovým škrobem, přidej rozmačkaný banán a vodu po lžících, dokud nevznikne husté těsto.',
      'Těsto nech deset minut odpočinout, mouka nasákne a lívanečky pak neztečou.',
      'Na pánvi rozehřej kokosový olej a peč lívanečky po třech minutách z každé strany.',
      'Jahody zbav stopek a rozmačkej je vidličkou na dřeň, kterou lívanečky přeliješ.',
    ],
    babySplitPoint:
      'Po kroku 3 odeber dvě lžíce těsta stranou a upeč z nich menší lívanečky bez dochucení.',
    babySteps: [
      'Z odebraného těsta tvaruj podlouhlé lívanečky velikosti prstu, které dítě sevře v dlani.',
      'Peč je pomaleji a jeden rozlom, ať víš, že je propečený skrz naskrz.',
      'Přelij je jahodovou dření; vitamin C z ní pomáhá vstřebat železo z pohankové mouky.',
    ],
    babyServing: {
      '6m': 'Podávej podlouhlý lívaneček přes celou dlaň, aby konec vyčuhoval z pěsti, a jahodovou dřeň v mělké misce.',
      '9m': 'Lívaneček nalámej na kousky velikosti nehtu a dřeň nabídni vedle na namáčení.',
      '12m': 'Servíruj celý lívaneček na talíři; batole si ho samo láme a namáčí do jahodové dřeně.',
    },
    adultSteps: [
      'Zbylé těsto osol, peč větší lívanečky a podávej je přelité jahodovou dření.',
      'Kdo chce sladší snídani, přidá si lžíci javorového sirupu.',
    ],
    allergens: [],
    tags: ['vegetariánské', 'bez lepku', 'do ruky'],
    sources: [NHS_FIRST_FOODS, NHS_VEGETARIAN],
    reviewStatus: 'verified',
  },
  {
    id: 'ovocna-miska-s-kokosovym-jogurtem-a-granatovym-jablkem',
    titleCz: 'Ovocná miska s kokosovým jogurtem a granátovým jablkem',
    category: 'snidane',
    minAgeMonths: 6,
    timeMinutes: 15,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'kokosovy-jogurt', amount: '300 g', track: 'all' },
      { ingredientId: 'granatove-jablko', amount: '1 kus', track: 'all' },
      { ingredientId: 'kiwi', amount: '2 kusy', track: 'all' },
      { ingredientId: 'oves-bezlepkovy', amount: '60 g', track: 'all' },
      { ingredientId: 'mandle-mlete', amount: '2 lžíce', track: 'all' },
    ],
    baseSteps: [
      'Bezlepkový oves opraž nasucho na pánvi, dokud nezačne vonět, a nech ho vychladnout.',
      'Granátové jablko rozkroj pod vodou a jadérka vyklep do misky; blány odplavou nahoru.',
      'Kiwi oloupej a nakrájej na kostky.',
      'Kokosový jogurt rozmíchej lžící dohladka a rozděl do misek.',
    ],
    babySplitPoint:
      'Po kroku 4 odeber dvě lžíce kokosového jogurtu do misky, dřív než se do zbytku sypou celá jadérka.',
    babySteps: [
      'Jadérka granátového jablka pro dítě rozmačkej vidličkou a tvrdá jádra z dřeně vyber; celé jadérko je pro tenhle věk moc pevné.',
      'Opražený oves rozdrť na hrubou moučku, celý lupínek je nasucho riziko.',
      'Vmíchej kostky kiwi a lžičku mletých mandlí; vitamin C z kiwi pomáhá vstřebat železo z ovsa.',
    ],
    babyServing: {
      '6m': 'Podávej jogurt s rozmačkaným ovocem na předložené lžíci a vedle proužek kiwi na délku prstu.',
      '9m': 'Nabídni jogurt v mělké misce a kostky kiwi na tácku pro klešťový úchop.',
      '12m': 'Servíruj misku s jogurtem, kiwi a rozmačkanou dření z granátového jablka; batole jí lžící samo.',
    },
    adultSteps: [
      'Misky pro dospělé posyp celými jadérky granátového jablka a opraženým ovsem.',
      'Navrch přisyp zbylé mleté mandle a podávej hned, oves změkne.',
    ],
    allergens: ['orechy'],
    tags: ['vegetariánské', 'bez lepku', 'rychlé', 'studená kuchyně'],
    sources: [NHS_FIRST_FOODS, NHS_VEGETARIAN],
    reviewStatus: 'verified',
  },
];
