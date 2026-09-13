import type { Recipe } from '@/types';
import {
  NHS_7_9M,
  NHS_ALLERGY,
  NHS_FIRST_FOODS,
  NHS_FISH,
  NHS_PREP_SAFELY,
  NHS_VEGETARIAN,
} from '../ingredients/_sources';

/**
 * Doplňkové recepty, které kuchařku dotahují na cílový počet ≥ 80 z
 * docs/SPEC.md kapitola 9. Skládají se ze všech čtyř kategorií a řídí se
 * stejnými pravidly jako ostatní soubory: společný základ bez soli, odebrání
 * porce pro miminko před dochucením, obě linie pro dospělé.
 */
export const extras: Recipe[] = [
  {
    id: 'veprova-kyta-zeli-kroupy',
    titleCz: 'Vepřová kýta s dušeným zelím a kroupami',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 80,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'veprova-kyta', amount: '500 g', track: 'meat' },
      { ingredientId: 'zeli-bile', amount: 'půl hlávky', track: 'all' },
      { ingredientId: 'kroupy-jecne', amount: '200 g', track: 'all' },
      { ingredientId: 'kmin-cely', amount: '1 lžička', track: 'all' },
      { ingredientId: 'cibule', amount: '1 kus', track: 'all' },
      { ingredientId: 'ghi', amount: '2 lžíce', track: 'all' },
      { ingredientId: 'tempeh', amount: '250 g', track: 'vegetarian' },
    ],
    baseSteps: [
      'Kroupy propláchni, zalij trojnásobkem vody a vař čtyřicet minut doměkka; pak je sceď.',
      'Zelí zbav košťálu a nakrájej na tenké nudličky; čím tenčí, tím rychleji se udusí doměkka.',
      'Cibuli nakrájej najemno, osmahni na ghí a přidej kmín, aby se rozvoněl.',
      'Přisyp zelí, podlij vodou a duš pod pokličkou třicet minut, dokud nudličky nezměknou a nezesládnou.',
      'Zelí i kroupy rozděl na tři porce a každou dokonči podle linie.',
    ],
    babySplitPoint:
      'Po kroku 4 odeber lžíci dušeného zelí a dvě lžíce krup, dřív než se do hrnce vloží maso a dřív než se zelí dochucuje pro dospělé.',
    babySteps: [
      'Zelí pro miminko nasekej ještě jednou najemno; dlouhé nudličky se v puse motají a děti je vyplivují.',
      'Kroupy rozmačkej vidličkou se lžící vody z dušení, aby držely pohromadě a daly se nabrat.',
      'Vepřovou kýtu pro dítě duš zvlášť v troše vody čtyřicet minut a rozvláknej ji napříč svalem.',
    ],
    babyServing: {
      '6m': 'Podávej nudličku dušeného zelí přeloženou přes prst a kroupy slepené do hrudky, kterou dítě sevře v dlani. Vepřové maso podej jako jedno dlouhé vlákno s koncem čouhajícím z pěsti.',
      '9m': 'Zelí nasekej nadrobno, maso natrhej na krátká vlákna a kroupy nech volnější ke sbírání špetkou.',
      '12m': 'Servíruj porci jako zmenšený talíř dospělých: kroupy, dušené zelí a kousky masa vedle sebe, jen bez dochucení.',
    },
    meatSteps: [
      'Kýtu nakrájej na plátky, osol, opeč na ghí z obou stran a vlož ji do dušeného zelí.',
      'Duš pod pokličkou dvacet minut, podle potřeby podlij vodou a podávej s kroupami.',
    ],
    vegetarianSteps: [
      'Tempeh nakrájej na plátky, osol a opeč na ghí dozlatova, aby po okrajích zkaramelizoval.',
      'Plátky vlož do druhé porce zelí, prohřej pět minut a podávej s kroupami.',
    ],
    vegetarianProteinSwap:
      'Vepřovou kýtu nahrazuje 250 g tempehu opečeného na plátky — v dušeném zelí drží tvar jako maso a dodá plnou bílkovinu.',
    allergens: ['psenice-lepek', 'soja', 'mleko'],
    tags: ['česká klasika', 'jednohrnec', 'mrazitelné'],
    sources: [NHS_FIRST_FOODS, NHS_VEGETARIAN],
    reviewStatus: 'verified',
  },
  {
    id: 'kapr-fenykl-polenta',
    titleCz: 'Kapr pečený na fenyklu s polentou',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 50,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'kapr', amount: '2 filety po 150 g', track: 'meat' },
      { ingredientId: 'fenykl-hliza', amount: '2 hlízy', track: 'all' },
      { ingredientId: 'polenta', amount: '180 g', track: 'all' },
      { ingredientId: 'citron', amount: '1 kus', track: 'all' },
      { ingredientId: 'maslo', amount: '30 g', track: 'all' },
      { ingredientId: 'fazole-bile', amount: '250 g uvařených', track: 'vegetarian' },
    ],
    baseSteps: [
      'Fenykl nakrájej na plátky silné půl centimetru a rozlož je do pekáče; zelenou nať si nech na dozdobení.',
      'Plátky pokapej rozpuštěným máslem, podlij dvěma lžícemi vody a peč 20 minut při 200 °C doměkka.',
      'Polentu zamíchej do trojnásobku vroucí vody a za stálého míchání vař deset minut do zhoustnutí.',
      'Citron rozkroj: polovinu nakrájej na plátky k rybě, druhou nech na vymačkání do linií.',
      'Pekáč i polentu rozděl na tři porce a dokonči každou podle linie.',
    ],
    babySplitPoint:
      'Po kroku 2 odeber dva plátky pečeného fenyklu, dřív než se do pekáče vloží kapr a dřív než se pokrm dochucuje pro dospělé.',
    babySteps: [
      'Kapra pro miminko upeč zvlášť v alobalovém balíčku bez soli dvanáct minut a rozeber ho na vločky.',
      'Každou vločku promni mezi prsty a prohlédni ji proti světlu; kapr má drobné vidličkovité kosti, které se snadno přehlédnou.',
      'Polentu rozetři na talíř v tenké vrstvě, nech ji ztuhnout a nakrájej ji na hranolky do ruky.',
    ],
    babyServing: {
      '6m': 'Podávej hranolek ztuhlé polenty velikosti prstu a plátek měkkého fenyklu, který dítě uchopí celou dlaní.',
      '9m': 'Polentu nakrájej na kostičky, fenykl na proužky a rybí vločky rozlož vedle ke sbírání špetkou.',
      '12m': 'Servíruj měkkou polentu v misce s fenyklem a rybou navrch; dítě už si porci míchá a nabírá samo.',
    },
    meatSteps: [
      'Filety kapra osol, polož je na pečený fenykl, pokapej máslem a peč dvanáct minut, dokud maso nezbělá.',
      'Podávej na měkké polentě, pokapej citronem a posyp fenyklovou natí.',
    ],
    vegetarianSteps: [
      'Bílé fazole osol, promíchej s výpekem z fenyklu a peč je deset minut, aby navrchu zezlátly.',
      'Podávej je na polentě s pečeným fenyklem, pokapané citronem a posypané natí.',
    ],
    vegetarianProteinSwap:
      'Kapra nahrazuje 250 g uvařených bílých fazolí zapečených ve výpeku z fenyklu — dodají porci bílkovinu a stejně sytou konzistenci.',
    allergens: ['ryby', 'mleko'],
    tags: ['bez lepku', 'ryba', 'sváteční'],
    sources: [NHS_FISH, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'zapeceny-lilek-mozzarella',
    titleCz: 'Zapečený lilek s rajčaty a mozzarellou',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 55,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'lilek', amount: '2 kusy', track: 'all' },
      { ingredientId: 'rajce', amount: '600 g', track: 'all' },
      { ingredientId: 'mozzarella', amount: '250 g', track: 'all' },
      { ingredientId: 'bazalka', amount: 'hrst lístků', track: 'all' },
      { ingredientId: 'oregano', amount: '1 lžička', track: 'all' },
      { ingredientId: 'ghi', amount: '1 lžíce', track: 'all' },
    ],
    baseSteps: [
      'Lilek nakrájej na plátky silné centimetr a nech je patnáct minut odležet, aby pustily hořkou šťávu; pak je osuš.',
      'Plátky opeč na pánvi na ghí z obou stran dozlatova a rovnej je na talíř.',
      'Rajčata nakrájej na kostky a duš je s oreganem deset minut, dokud se nerozpadnou v hustou omáčku.',
      'Do zapékací mísy vrstvi lilek a omáčku; mozzarellu zatím nech stranou.',
      'Zapékej dvacet minut při 190 °C, dokud omáčka nezačne po okrajích bublat.',
    ],
    babySplitPoint:
      'Po kroku 4 odeber do malé misky dva plátky lilku s omáčkou, dřív než se zbytek mísy dochucuje pro dospělé.',
    babySteps: [
      'Lilek v dětské porci zbav slupky, která je po zapečení pevná a v puse se sbalí do kuličky.',
      'Dužinu rozmačkej vidličkou do omáčky nebo ji nakrájej na proužky podle toho, co dítě zvládá.',
      'Mozzarellu pro miminko nakrájej na tenké proužky, nikdy nepodávej kuličky — kulatý tvar je pro dětské hrdlo nejrizikovější.',
    ],
    babyServing: {
      '6m': 'Podávej proužek měkkého lilku dlouhý přes dlaň, na kterém drží omáčka, a proužek mozzarelly vedle.',
      '9m': 'Nakrájej lilek i sýr na kostičky velikosti nehtu a omáčku nech hustou, aby se dala nabrat prsty.',
      '12m': 'Servíruj porci v misce se lžící; dítě už zvládne nabrat zapečený lilek i s omáčkou samo.',
    },
    meatSteps: [
      'Zbytek mísy osol, rozlož navrch polovinu mozzarelly natrhané na kousky a zapékej deset minut.',
      'Před podáváním posyp bazalkou; kdo jí maso, přidá si k porci opečený plátek masa ze zásoby.',
    ],
    vegetarianSteps: [
      'Bezmasou porci osol, navrstvi na ni zbytek mozzarelly a zapékej deset minut, dokud se sýr nerozteče.',
      'Navrch dej natrhanou bazalku a nech mísu pět minut odstát, aby se vrstvy usadily.',
    ],
    allergens: ['mleko'],
    tags: ['bez lepku', 'vegetariánské', 'zapékané'],
    sources: [NHS_PREP_SAFELY, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
  {
    id: 'kapustova-polevka-adzuki',
    titleCz: 'Kapustová polévka s fazolemi adzuki',
    category: 'polevky',
    minAgeMonths: 6,
    timeMinutes: 40,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'kapusta-hlavkova', amount: 'půl hlávky', track: 'all' },
      { ingredientId: 'fazole-adzuki', amount: '250 g uvařených', track: 'all' },
      { ingredientId: 'porek', amount: '1 kus', track: 'all' },
      { ingredientId: 'majoranka', amount: '1 lžička', track: 'all' },
      { ingredientId: 'ghi', amount: '1 lžíce', track: 'all' },
    ],
    baseSteps: [
      'Pórek nakrájej na kolečka, propláchni je od písku a nech je na ghí pět minut změknout.',
      'Kapustu zbav košťálu, nakrájej na nudličky a přidej ji k pórku; duš deset minut, dokud nezavadne.',
      'Zalij vodou, přiveď k varu a vař patnáct minut bez soli, dokud kapusta úplně nezměkne.',
      'Vmíchej uvařené fazole adzuki a majoránku rozetřenou mezi prsty a nech polévku pět minut prohřát.',
    ],
    babySplitPoint:
      'Po kroku 4 odeber naběračku polévky s fazolemi, dřív než se hrnec dochucuje pro dospělé.',
    babySteps: [
      'Fazole v dětské porci rozmačkej vidličkou, aby v polévce nezůstaly celé kusy s pevnou slupkou.',
      'Kapustu nasekej nadrobno; nudličky jsou pro dítě dlouhé a v puse se motají.',
      'Polévku zahusti rozmačkanými fazolemi, aby držela na lžíci, a nech ji vychladnout na teplotu ruky.',
    ],
    babyServing: {
      '6m': 'Podávej hustou polévku na lžíci a k ní kousek dušené kapusty přeložený přes prst jako sousto do ruky.',
      '9m': 'Nabídni polévku s nasekanou kapustou a rozmačkanými fazolemi v mělké misce ke sbírání prsty.',
      '12m': 'Servíruj polévku v misce se lžící a celými fazolemi rozmačkanými napůl; dítě už jí samostatně.',
    },
    meatSteps: [
      'Polévku pro dospělé osol, dochuť majoránkou a podávej s krajícem chleba.',
      'Kdo jí maso, přidá si do talíře kousky opečené klobásy ze zásoby.',
    ],
    vegetarianSteps: [
      'Bezmasou porci osol a část fazolí rozmačkej o stěnu hrnce, aby polévka zhoustla.',
      'Navrch zakápni lžičkou rozpuštěného ghí a posyp čerstvou majoránkou.',
    ],
    allergens: ['mleko'],
    tags: ['bez lepku', 'vegetariánské', 'jednohrnec'],
    sources: [NHS_VEGETARIAN, NHS_7_9M],
    reviewStatus: 'verified',
  },
  {
    id: 'tvarohova-miska-nektarinka',
    titleCz: 'Tvarohová miska s nektarinkou a mletým lnem',
    category: 'snidane',
    minAgeMonths: 6,
    timeMinutes: 10,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'tvaroh-mekky', amount: '300 g', track: 'all' },
      { ingredientId: 'nektarinka', amount: '2 zralé', track: 'all' },
      { ingredientId: 'seminka-lnena-mleta', amount: '2 lžíce', track: 'all' },
      { ingredientId: 'boruvky', amount: '100 g', track: 'all' },
    ],
    baseSteps: [
      'Nektarinky rozpul, vyjmi pecky a jednu nakrájej na měsíčky, druhou rozmačkej vidličkou na pyré.',
      'Tvaroh rozmíchej s lžící vody, aby byl krémový a dal se nabírat lžící.',
      'Borůvky rozkroj každou napůl; celá bobule má kulatý tvar, který malým dětem nesvědčí.',
      'Do misek navrstvi tvaroh, nektarinkové pyré a navrch měsíčky s rozkrojenými borůvkami.',
    ],
    babySplitPoint:
      'Po kroku 2 odeber dvě lžíce tvarohu a lžíci nektarinkového pyré, dřív než se misky pro dospělé dosladí.',
    babySteps: [
      'Do dětské misky vmíchej lžičku mletých lněných semínek a nech je pět minut nabobtnat.',
      'Tvaroh zřeď lžící vody nebo mléka, aby nebyl hutný a dítě ho snadno polykalo.',
      'Nektarinku pro miminko oloupej, pokud má pevnou slupku, a borůvky vždy rozkroj.',
    ],
    babyServing: {
      '6m': 'Podávej krémový tvaroh s pyré na lžíci a k němu měsíček zralé nektarinky velikosti prstu do ruky.',
      '9m': 'Nakrájej nektarinku na kostičky a tvaroh nech hustší; dítě si obojí sbírá špetkou z mělké misky.',
      '12m': 'Servíruj vrstvenou misku se lžící a nech dítě, ať si ovoce do tvarohu samo zamíchá.',
    },
    meatSteps: [
      'Misky pro dospělé dolaď podle chuti a posyp zbytkem mletých lněných semínek.',
      'Kdo chce sytější snídani, přisype lžíci ovesných vloček nebo mletých ořechů.',
    ],
    vegetarianSteps: [
      'Bezmasou porci dokonči stejně: vrstva tvarohu, ovoce a mletá lněná semínka navrch.',
      'Pro svěží chuť zakápni misku šťávou z citronu a promíchej.',
    ],
    allergens: ['mleko'],
    tags: ['bez lepku', 'vegetariánské', 'rychlé'],
    sources: [NHS_ALLERGY, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
  {
    id: 'cizrnove-placky-jogurtovy-dip',
    titleCz: 'Cizrnové placky s jogurtovým dipem',
    category: 'svaciny-peceni',
    minAgeMonths: 6,
    timeMinutes: 30,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'mouka-cizrnova', amount: '200 g', track: 'all' },
      { ingredientId: 'jogurt-recky', amount: '200 g', track: 'all' },
      { ingredientId: 'pazitka', amount: 'hrst', track: 'all' },
      { ingredientId: 'kmin-mlety', amount: 'půl lžičky', track: 'all' },
      { ingredientId: 'olej-kokosovy', amount: '2 lžíce', track: 'all' },
    ],
    baseSteps: [
      'Cizrnovou mouku smíchej s mletým kmínem a postupně přilévej vodu, dokud nevznikne těsto hustoty smetany.',
      'Nech těsto dvacet minut odpočinout; mouka nasákne a placky pak drží tvar.',
      'Jogurt rozmíchej s polovinou nastříhané pažitky na dip a rozděl ho do misek.',
      'Pánev potři kokosovým olejem a peč tenké placky po dvou minutách z každé strany.',
    ],
    babySplitPoint:
      'Po kroku 2 odeber tři lžíce těsta stranou a upeč z nich dítětiny placky, dřív než se zbytek těsta pro dospělé dochucuje.',
    babySteps: [
      'Dětské placky peč o něco menší a silnější, aby se v ruce nelámaly, a jednu rozlom na kontrolu propečení.',
      'Placku nakrájej na pásky široké jako dva prsty a nech ji zchladnout.',
      'Jogurt pro miminko nabídni samostatně bez dochucení, jen s nastříhanou pažitkou.',
    ],
    babyServing: {
      '6m': 'Podávej pásek placky dlouhý přes dlaň a jogurt v ploché misce, do které dítě zaboří konec pásku.',
      '9m': 'Placku nalam na kousky velikosti nehtu a jogurtový dip podávej vedle ke smáčení prsty.',
      '12m': 'Nabídni celou placku do ruky s miskou dipu; dítě si ji samo trhá a namáčí.',
    },
    meatSteps: [
      'Zbylé těsto osol, peč z něj větší placky a podávej je s jogurtovým dipem.',
      'Kdo má rád výraznější chuť, přidá do těsta prolisovaný česnek nebo mletou papriku.',
    ],
    vegetarianSteps: [
      'Bezmasou porci osol stejně a placky podávej teplé s dipem posypaným zbylou pažitkou.',
      'Placky se dají péct dopředu a druhý den je stačí prohřát na suché pánvi.',
    ],
    allergens: ['mleko'],
    tags: ['bez lepku', 'vegetariánské', 'do ruky'],
    sources: [NHS_VEGETARIAN, NHS_ALLERGY],
    reviewStatus: 'verified',
  },
];
