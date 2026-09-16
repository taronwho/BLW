import type { Recipe } from '@/types';
import {
  NHS_FIRST_FOODS,
  NHS_FISH,
  NHS_IRON,
  NHS_PREP_SAFELY,
} from '../ingredients/_sources';

/**
 * Jednoduché úpravy masa a ryb.
 *
 * Maso je nejlepší zdroj železa, které se kolem půl roku začíná dítěti
 * tenčit, ale v kuchařce k němu byly jen dlouhé rodinné pokrmy. Tyhle
 * recepty stojí na jednom kusu masa a jedné technice, aby se daly uvařit
 * ve všední den.
 *
 * Podoba rozhoduje stejně jako u zeleniny. Kostka masa je pro kojence
 * horší než dlouhé vlákno: kostku sevře v pěsti a ztratí, vlákno drží
 * a dá se z něj ukousnout. Proto se maso podává natrhané po vláknech,
 * ne nakrájené.
 *
 * Každý recept má i bezmasou variantu, protože matka v téhle rodině maso
 * nejí a vaří se jednou.
 */
export const prvniUpravyMaso: Recipe[] = [
  {
    id: 'kureci-prsa-dusena-na-vlakna',
    titleCz: 'Kuřecí prsa dušená na vlákna',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 25,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'kureci-prsa', amount: '2 kusy', track: 'meat' },
      { ingredientId: 'voda', amount: '200 ml', track: 'all' },
      { ingredientId: 'olej-repkovy', amount: '1 lžíce', track: 'all' },
      { ingredientId: 'cizrna', amount: '200 g uvařené', track: 'vegetarian' },
    ],
    baseSteps: [
      'Kuřecí prsa otři do sucha a odstraň bílou blánu i tuk po okraji.',
      'Do pánve dej řepkový olej, vlož maso a nech ho z obou stran zatáhnout.',
      'Podlij vodou, přiklop a duš 15 minut na mírném ohni. Dušené maso zůstane vláčné, kdežto opečené zvenku vysychá a dítě ho neukousne.',
      'Maso vyndej, nech ho pět minut odpočinout a zkus vidličkou, jestli se rozpadá po vláknech. Když drží, vrať ho na pět minut zpátky.',
      'Od tohoto místa se pánev dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint:
      'Po kroku 4 odeber kousek masa velikosti dlaně stranou, ještě než se pánev dochucuje.',
    babySteps: [
      'Maso natrhej podél vláken na dlouhé měkké proužky. Kostka se v pěsti ztratí, proužek z ní kouká ven.',
      'Zakápni porci lžící šťávy z dušení; suché kuřecí prso se špatně polyká a dítě ho vyplivne.',
    ],
    babyServing: {
      '6m': 'Dlouhé vlákno masa velikosti prstu dospělého, aby ho dítě sevřelo celou dlaní a mohlo z něj ukousnout.',
      '9m': 'Krátká vlákna velikosti nehtu na malíčku, po kterých dítě sahá špetkou.',
      '12m': 'Kousky kuřecího masa jako pro dospělé, jen bez soli a bez marinády.',
    },
    adultSteps: [
      'Zbylé maso osol, opeč ho na prudko dozlatova a zakápni citronem.',
      'Do výpeku se hodí lžíce smetany a snítka tymiánu.',
    ],
    vegetarianSteps: [
      'Uvařenou cizrnu vsyp do druhé pánve, osol a opeč na oleji, dokud navrchu nezačne křupat.',
      'Posyp ji mletou paprikou a zakápni citronem stejně jako maso.',
    ],
    vegetarianProteinSwap:
      'Místo kuřecích prsou se podává 200 g uvařené cizrny opečené na oleji, která dodá bílkovinu i železo.',
    allergens: [],
    tags: ['do ruky', 'rychlé', 'zdroj železa'],
    sources: [NHS_IRON, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
  {
    id: 'kureci-stehno-dusene',
    titleCz: 'Kuřecí stehno dušené doměkka',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 35,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'kureci-stehno', amount: '3 kusy', track: 'meat' },
      { ingredientId: 'voda', amount: '250 ml', track: 'all' },
      { ingredientId: 'olej-olivovy', amount: '1 lžíce', track: 'all' },
      { ingredientId: 'cocka-hneda', amount: '200 g uvařené', track: 'vegetarian' },
    ],
    baseSteps: [
      'Kuřecím stehnům stáhni kůži; pro dětskou porci je moc tučná a špatně se kouše.',
      'Do hrnce dej olivový olej a stehna z obou stran zatáhni.',
      'Podlij vodou, přiklop a duš 25 minut. Stehno má tmavší maso s vyšším obsahem železa než prso a dušením zvláční, místo aby vyschlo.',
      'Maso vyndej a zkontroluj, že se odděluje od kosti samo. Vytáhni kost i chrupavku, obojí je v puse tvrdé.',
      'Od tohoto místa se hrnec dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint:
      'Po kroku 4 odeber dvě lžíce masa bez kosti stranou, ještě než se hrnec dochucuje.',
    babySteps: [
      'Projdi porci prsty a vyber i drobné úlomky kostí; ty jsou u stehna to nejrizikovější.',
      'Maso natrhej po vláknech a zakápni ho šťávou z dušení.',
    ],
    babyServing: {
      '6m': 'Dlouhé vlákno tmavého masa velikosti prstu dospělého, bez kůže a bez kosti.',
      '9m': 'Krátká vlákna k sebrání špetkou.',
      '12m': 'Kousky masa jako pro dospělé, bez soli. Kost dej stranou i teď.',
    },
    adultSteps: [
      'Zbylá stehna osol, vrať do hrnce i s kůží a nech je pod grilem pět minut zezlátnout.',
      'Šťávu z dušení zahusti lžící smetany a přelij přes maso.',
    ],
    vegetarianSteps: [
      'Uvařenou hnědou čočku zahřej ve druhém hrnci, osol ji a promíchej s výpekem z olivového oleje a bylinek.',
      'Zakápni ji octem, aby dostala stejnou kyselost jako dochucené maso.',
    ],
    vegetarianProteinSwap:
      'Místo kuřecího stehna se podává 200 g uvařené hnědé čočky, která dodá bílkovinu i rostlinné železo.',
    allergens: [],
    tags: ['do ruky', 'rodinné', 'zdroj železa'],
    sources: [NHS_IRON, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'krut-prsa-dusena',
    titleCz: 'Krůtí prsa dušená na mléce',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 30,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'kruti-prsa', amount: '500 g', track: 'meat' },
      { ingredientId: 'voda', amount: '250 ml', track: 'all' },
      { ingredientId: 'olej-repkovy', amount: '1 lžíce', track: 'all' },
      { ingredientId: 'tofu-natural', amount: '300 g', track: 'vegetarian' },
    ],
    baseSteps: [
      'Krůtí prso nakrájej na plátky silné dva prsty; celý kus by se dusil přes hodinu.',
      'Do hrnce dej řepkový olej a plátky krátce zatáhni z obou stran.',
      'Podlij vodou, přiklop a duš 18 minut. Krůtí maso je libovější než kuřecí, takže vysychá rychleji a bez dušení se dítěti kouše špatně.',
      'Maso vyndej, nech odpočinout a zkus, jestli se trhá po vláknech.',
      'Od tohoto místa se hrnec dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint: 'Po kroku 4 odeber jeden plátek stranou, ještě než se hrnec dochucuje.',
    babySteps: [
      'Plátek natrhej podél vláken na dlouhé proužky.',
      'Krůtí maso je suché. Vždycky ho zakápni šťávou z dušení nebo lžící zeleninového protlaku, jinak zůstane dítěti v puse.',
    ],
    babyServing: {
      '6m': 'Dlouhé vlákno dlouhé jako prst dospělého, vlhké od šťávy.',
      '9m': 'Krátká vlákna velikosti nehtu na malíčku.',
      '12m': 'Plátek krůtího masa nakrájený na kousky jako pro dospělé, jen bez soli.',
    },
    adultSteps: [
      'Zbylé plátky osol, opeč dozlatova a šťávu z dušení zredukuj s lžící hořčice.',
      'Ke krůtímu sedne brusinková omáčka nebo pečené jablko.',
    ],
    vegetarianSteps: [
      'Tofu natural odvodni mezi prkénky, nakrájej na plátky a opeč je na oleji dozlatova.',
      'Osol je a přelij stejnou zredukovanou šťávou s hořčicí jako maso.',
    ],
    vegetarianProteinSwap:
      'Místo krůtích prsou se podává 300 g opečeného tofu, které dodá bílkovinu v podobném tvaru plátků.',
    allergens: ['soja'],
    tags: ['do ruky', 'rodinné', 'zdroj železa'],
    sources: [NHS_IRON, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
  {
    id: 'krut-stehno-dusene',
    titleCz: 'Krůtí stehno dušené na vlákna',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 45,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'kruti-stehno', amount: '600 g', track: 'meat' },
      { ingredientId: 'voda', amount: '300 ml', track: 'all' },
      { ingredientId: 'olej-olivovy', amount: '1 lžíce', track: 'all' },
      { ingredientId: 'fazole-bile', amount: '250 g uvařené', track: 'vegetarian' },
    ],
    baseSteps: [
      'Krůtímu stehnu stáhni kůži a vykroj šlachy, kterých je v něm víc než v kuřecím.',
      'Maso nakrájej na velké kusy, do hrnce dej olivový olej a kusy zatáhni.',
      'Podlij vodou, přiklop a duš 30 minut na mírném ohni.',
      'Hotové maso se rozpadá vidličkou samo. Tmavé stehno nese víc železa než prso, takže se pro dítě hodí líp.',
      'Od tohoto místa se hrnec dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint: 'Po kroku 4 odeber dvě lžíce masa stranou, ještě než se hrnec dochucuje.',
    babySteps: [
      'Projdi porci prsty a vytáhni všechny šlachy; ty se v puse neroztrhnou.',
      'Maso natrhej po vláknech a promíchej ho s trochou šťávy z dušení.',
    ],
    babyServing: {
      '6m': 'Dlouhé měkké vlákno velikosti prstu dospělého.',
      '9m': 'Krátká vlákna k sebrání špetkou, promíchaná s lžící zeleninové kaše.',
      '12m': 'Kousky masa jako pro dospělé, jen bez soli.',
    },
    adultSteps: [
      'Zbylé maso osol, přidej do hrnce rozmarýn a nech šťávu zredukovat na omáčku.',
      'Krůtí stehno se hodí i studené do sendviče s hořčicí.',
    ],
    vegetarianSteps: [
      'Uvařené bílé fazole zahřej, osol a promíchej s rozmarýnem a olivovým olejem.',
      'Nech je chvíli probublat, aby nasákly stejnou bylinkovou chuť jako maso.',
    ],
    vegetarianProteinSwap:
      'Místo krůtího stehna se podává 250 g uvařených bílých fazolí, které dodají bílkovinu i železo.',
    allergens: [],
    tags: ['do ruky', 'rodinné', 'zdroj železa'],
    sources: [NHS_IRON, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'hovezi-zadni-dusene-vlakna',
    titleCz: 'Hovězí zadní dušené na vlákna',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 90,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'hovezi-zadni', amount: '600 g', track: 'meat' },
      { ingredientId: 'voda', amount: '400 ml', track: 'all' },
      { ingredientId: 'olej-repkovy', amount: '2 lžíce', track: 'all' },
      { ingredientId: 'cocka-beluga', amount: '250 g uvařené', track: 'vegetarian' },
    ],
    baseSteps: [
      'Hovězí zadní nakrájej na velké kusy a otři je do sucha, jinak se v pánvi budou dusit místo zatahovat.',
      'V hrnci rozpal řepkový olej a kusy ze všech stran opeč dohněda.',
      'Podlij vodou, přiklop a duš 70 minut na nejmenším plameni. Hovězí má nejvíc železa ze všech běžných mas, ale potřebuje čas; dřív se po vláknech nerozpadne.',
      'Hotové maso jde rozebrat dvěma vidličkami bez tlaku. Když klade odpor, přidej vodu a duš dalších dvacet minut.',
      'Od tohoto místa se hrnec dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint: 'Po kroku 4 odeber dvě lžíce masa stranou, ještě než se hrnec dochucuje.',
    babySteps: [
      'Maso rozeber na dlouhá vlákna a vyřaď tvrdé kousky šlach a tuku.',
      'Promíchej porci se šťávou z dušení. Hovězí je hutné a bez šťávy ho dítě po dvou soustech odloží.',
    ],
    babyServing: {
      '6m': 'Dlouhé měkké vlákno velikosti prstu dospělého, které dítě sevře a ukousne z konce.',
      '9m': 'Krátká vlákna k sebrání špetkou.',
      '12m': 'Kousky masa jako pro dospělé, bez soli. Šťávu nech, drží porci vláčnou.',
    },
    adultSteps: [
      'Zbylé maso osol, přidej do hrnce rajčatový protlak a nech šťávu zredukovat na hustou omáčku.',
      'Hovězí na vlákna se hodí do housky, do tortilly i na těstoviny.',
    ],
    vegetarianSteps: [
      'Uvařenou čočku beluga zahřej ve druhém hrnci, osol ji a promíchej s rajčatovým protlakem.',
      'Nech ji deset minut probublat, aby zhoustla podobně jako masová omáčka.',
    ],
    vegetarianProteinSwap:
      'Místo hovězího zadního se podává 250 g uvařené čočky beluga, která drží tvar a dodá bílkovinu i rostlinné železo.',
    allergens: [],
    tags: ['do ruky', 'rodinné', 'mrazitelné', 'zdroj železa'],
    sources: [NHS_IRON, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'hovezi-mlete-karbanatky',
    titleCz: 'Hovězí mleté na měkké karbanátky',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 25,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'hovezi-mlete', amount: '400 g', track: 'meat' },
      { ingredientId: 'brambor', amount: '200 g uvařené', track: 'all' },
      { ingredientId: 'olej-repkovy', amount: '2 lžíce', track: 'all' },
      { ingredientId: 'cocka-cervena-loupana', amount: '200 g uvařené', track: 'vegetarian' },
    ],
    baseSteps: [
      'Uvařené brambory rozmačkej vidličkou a nech je vychladnout.',
      'Smíchej je s mletým hovězím a směs prohněť rukou. Brambora tady není náhražka, ale nutnost: samotné mleté maso se po opečení sroluje do tuhé kuličky, kterou dítě nerozkouše.',
      'Vytvaruj podlouhlé karbanátky silné jako prst dospělého.',
      'Na pánvi rozpal řepkový olej a opékej je čtyři minuty z každé strany, dokud uprostřed nezůstane růžové maso.',
      'Od tohoto místa se pánev dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint: 'Po kroku 4 odeber dva karbanátky stranou, ještě než se pánev dochucuje.',
    babySteps: [
      'Rozkroj jeden karbanátek a zkontroluj, že uvnitř není růžové maso. U mletého masa to platí přísněji než u celého kusu.',
      'Nech karbanátky vychladnout na teplotu ruky a ověř, že se dají rozmáčknout mezi prsty.',
    ],
    babyServing: {
      '6m': 'Podlouhlý karbanátek z mletého masa, velikosti prstu dospělého, aby z pěsti vyčníval.',
      '9m': 'Karbanátek s mletým masem rozdrobený na kousky velikosti fazole.',
      '12m': 'Celý karbanátek z hovězího jako pro dospělé, jen bez soli.',
    },
    adultSteps: [
      'Zbylé karbanátky osol, posyp mletým kmínem a opeč je na vyšší teplotu, ať mají křupavou kůrku.',
      'Sedne k nim pečená paprika a lžíce jogurtu s česnekem.',
    ],
    vegetarianSteps: [
      'Uvařenou červenou čočku smíchej se zbylou bramborovou kaší, osol a vytvaruj stejné karbanátky.',
      'Opeč je na oleji z obou stran dozlatova, čočkové drží tvar hůř, takže je obracej opatrně.',
    ],
    vegetarianProteinSwap:
      'Místo mletého hovězího se do karbanátků dá 200 g uvařené červené čočky, která dodá bílkovinu i rostlinné železo.',
    allergens: [],
    tags: ['do ruky', 'rychlé', 'zdroj železa'],
    sources: [NHS_IRON, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'kureci-jatra-dusena',
    titleCz: 'Kuřecí játra dušená na měkko',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 18,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'kureci-jatra', amount: '300 g', track: 'meat' },
      { ingredientId: 'voda', amount: '100 ml', track: 'all' },
      { ingredientId: 'olej-olivovy', amount: '1 lžíce', track: 'all' },
      { ingredientId: 'cocka-hneda', amount: '200 g uvařené', track: 'vegetarian' },
    ],
    baseSteps: [
      'Kuřecí játra opláchni a vyřízni bílé žilky i zelenavá místa po žluči, ta hořknou.',
      'Do pánve dej olivový olej a játra krátce zatáhni z obou stran.',
      'Podlij vodou, přiklop a duš osm minut. Játra jsou hotová, jakmile uvnitř nejsou růžová; přepečená ztvrdnou jako guma.',
      'Nech je chvíli odpočinout. Játra mají ze všech potravin nejvíc železa, ale i nejvíc vitaminu A, proto se podávají jednou týdně a ne častěji.',
      'Od tohoto místa se pánev dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint: 'Po kroku 4 odeber jedno játro stranou, ještě než se pánev dochucuje.',
    babySteps: [
      'Rozmačkej játro vidličkou na hladkou pastu a zamíchej ji do lžíce bramborové kaše nebo do dýňového pyré.',
      'Samotná játra mají silnou chuť, kterou většina dětí napoprvé odmítne. Ve směsi s něčím sladším projdou snáz.',
      'Pro dítě do roka stačí zhruba lžíce jednou týdně, kvůli vitaminu A.',
    ],
    babyServing: {
      '6m': 'Lžíce jaterní pasty zamíchaná do bramborové nebo dýňové kaše, nabídnutá na naložené lžíci.',
      '9m': 'Jaterní pasta namazaná na proužek chleba, ze kterého se stane sousto do ruky.',
      '12m': 'Rozmačkané játro jako součást jídla, dál nejvýš jednou týdně.',
    },
    adultSteps: [
      'Zbylá játra osol, přidej opečenou cibulku a majoránku a nech je minutu provonět.',
      'Hodí se k nim bramborová kaše nebo krajíc tmavého chleba.',
    ],
    vegetarianSteps: [
      'Uvařenou hnědou čočku zahřej s opečenou cibulkou a majoránkou, osol a nech ji chvíli probublat.',
      'Rozmačkej část čočky, aby směs zhoustla podobně jako jaterní.',
    ],
    vegetarianProteinSwap:
      'Místo kuřecích jater se podává 200 g uvařené hnědé čočky s cibulkou, která dodá bílkovinu i rostlinné železo.',
    allergens: [],
    tags: ['rychlé', 'zdroj železa'],
    sources: [NHS_IRON, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
  {
    id: 'losos-peceny-v-alobalu',
    titleCz: 'Losos pečený v alobalu',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 25,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'losos', amount: '400 g filet', track: 'meat' },
      { ingredientId: 'citron', amount: 'půl kusu', track: 'all' },
      { ingredientId: 'olej-olivovy', amount: '1 lžíce', track: 'all' },
      { ingredientId: 'tofu-natural', amount: '300 g', track: 'vegetarian' },
    ],
    baseSteps: [
      'Troubu předehřej na 190 °C. Filet z lososa otři do sucha a přejeď po něm prsty proti směru vláken, jestli v něm nezůstaly kosti.',
      'Polož ho na alobal, pokapej olivovým olejem a plátkem citronu a balíček uzavři.',
      'Peč 15 minut. Uvnitř alobalu se ryba dusí ve vlastní páře a zůstane vláčná, kdežto na plechu by vyschla.',
      'Hotový losos se rozpadá na vrstvy, jakmile do něj zapíchneš vidličku. Uprostřed už nesmí být sklovitý.',
      'Od tohoto místa se balíček dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint:
      'Po kroku 4 odeber kousek ryby velikosti dlaně stranou, ještě než se zbytek dochucuje.',
    babySteps: [
      'Rybu rozeber na vrstvy a projdi každou prsty. Kosti jsou u lososa to jediné opravdu nebezpečné a jedna stačí.',
      'Kůži sundej, pro dítě je moc tuhá.',
      'Losos patří mezi tučné ryby, které se kojenci podávají nejvýš dvakrát týdně kvůli látkám z prostředí.',
    ],
    babyServing: {
      '6m': 'Vrstva ryby velikosti prstu dospělého, pečlivě prohmataná na kosti.',
      '9m': 'Kousky ryby velikosti fazole, po kterých dítě sahá špetkou.',
      '12m': 'Kousek filetu jako pro dospělé, jen bez soli. Kosti kontroluj dál.',
    },
    adultSteps: [
      'Zbylý filet osol, zakápni citronem a posyp nasekaným koprem.',
      'K lososovi sedne lžíce zakysané smetany s křenem.',
    ],
    vegetarianSteps: [
      'Tofu natural odvodni, nakrájej na plátky a zabal je do vlastního alobalu s citronem a olejem.',
      'Peč je stejných patnáct minut, pak osol a posyp koprem jako rybu.',
    ],
    vegetarianProteinSwap:
      'Místo lososa se peče 300 g tofu natural v alobalu s citronem, které dodá bílkovinu ve stejné podobě plátků.',
    allergens: ['ryby', 'soja'],
    tags: ['ryba', 'rychlé', 'pečené'],
    sources: [NHS_FISH, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'treska-dusena-na-panvi',
    titleCz: 'Treska dušená na pánvi',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 18,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'treska-obecna', amount: '400 g filet', track: 'meat' },
      { ingredientId: 'voda', amount: '100 ml', track: 'all' },
      { ingredientId: 'olej-olivovy', amount: '1 lžíce', track: 'all' },
      { ingredientId: 'cizrna', amount: '200 g uvařené', track: 'vegetarian' },
    ],
    baseSteps: [
      'Filet z tresky otři do sucha a přejeď po něm prsty, jestli v něm nezůstaly kosti.',
      'Do pánve dej olivový olej, vlož filet a podlij vodou.',
      'Přiklop a duš osm minut na mírném ohni. Treska je libová bílá ryba, takže se na prudkém ohni rozpadne dřív, než se propeče.',
      'Hotová ryba je uvnitř bílá a rozpadá se na vrstvy. Sklovitý střed znamená, že potřebuje ještě dvě minuty.',
      'Od tohoto místa se pánev dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint:
      'Po kroku 4 odeber kousek ryby velikosti dlaně stranou, ještě než se pánev dochucuje.',
    babySteps: [
      'Rybu rozeber na vrstvy a prohmatej každou prsty kvůli kostem.',
      'Zakápni porci lžící šťávy z dušení, treska je sušší než losos.',
      'Bílé ryby se dají podávat častěji než tučné, klidně několikrát týdně.',
    ],
    babyServing: {
      '6m': 'Vrstva ryby velikosti prstu dospělého, prohmataná na kosti a vlhká od šťávy.',
      '9m': 'Kousky tresky velikosti fazole k sebrání špetkou.',
      '12m': 'Kousek filetu jako pro dospělé, jen bez soli.',
    },
    adultSteps: [
      'Zbylou rybu osol, zakápni citronem a do pánve přidej lžíci másla s petrželkou.',
      'K tresce se hodí vařené brambory a hrášek.',
    ],
    vegetarianSteps: [
      'Uvařenou cizrnu zahřej na oleji, osol ji a rozmačkej asi třetinu zrn, aby směs zhoustla.',
      'Zakápni ji citronem a promíchej s petrželkou jako rybu.',
    ],
    vegetarianProteinSwap:
      'Místo tresky se podává 200 g uvařené cizrny s petrželkou a citronem, která dodá bílkovinu.',
    allergens: ['ryby'],
    tags: ['ryba', 'rychlé'],
    sources: [NHS_FISH, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'sardinky-rozmackane-na-chleb',
    titleCz: 'Rozmačkané sardinky na proužky chleba',
    category: 'obed-vecere',
    minAgeMonths: 12,
    timeMinutes: 8,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'sardinky-v-oleji', amount: '2 konzervy', track: 'meat' },
      { ingredientId: 'citron', amount: 'půl kusu', track: 'all' },
      { ingredientId: 'fazole-bile', amount: '200 g uvařené', track: 'vegetarian' },
    ],
    baseSteps: [
      'Sardinky sceď a nech je chvíli okapat na papírové utěrce.',
      'Rozmačkej je vidličkou i s měkkými páteřními kůstkami. Ty se u konzervovaných sardinek rozpadnou a jsou dobrým zdrojem vápníku.',
      'Zakápni pastu šťávou z půlky citronu a promíchej.',
      'Sardinky jsou drobná ryba z konce potravního řetězce, takže se v nich hromadí mnohem méně rtuti než ve velkých druzích.',
      'Od tohoto místa se miska dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint: 'Po kroku 4 odeber lžíci pasty do misky, ještě než se miska dochucuje.',
    babySteps: [
      'Projdi porci prsty a vyber tvrdší úlomky kostí, které se nerozpadly.',
      'Namaž pastu v silné vrstvě na proužek chleba; ze slané ryby se tím stane sousto do ruky s mírnější chutí.',
      'Sardinky z konzervy bývají solené. Vyber ty ve vlastním oleji bez přidané soli a pro dítě je ještě propláchni.',
    ],
    babyServing: {
      '6m': 'Tenká vrstva rybí pasty na proužku chleba dlouhém jako prst dospělého.',
      '9m': 'Pasta ze sardinek na lžíci nebo namazaná na kousky pečiva k sebrání špetkou.',
      '12m': 'Stejná rybí pasta jako pro dospělé, jen z neosolené konzervy.',
    },
    adultSteps: [
      'Zbylou pastu osol, přidej nasekanou cibulku, kapary a víc citronu.',
      'Na opečeném chlebu s rajčetem je z toho rychlá večeře.',
    ],
    vegetarianSteps: [
      'Uvařené bílé fazole rozmačkej vidličkou, osol a zakápni citronem i olivovým olejem.',
      'Přimíchej nasekanou cibulku a kapary, aby pasta chutnala stejně výrazně jako rybí.',
    ],
    vegetarianProteinSwap:
      'Místo sardinek se maže pasta z 200 g uvařených bílých fazolí s citronem, která dodá bílkovinu.',
    allergens: ['ryby'],
    tags: ['ryba', 'rychlé', 'studená kuchyně'],
    sources: [NHS_FISH, NHS_IRON],
    reviewStatus: 'verified',
  },
];
