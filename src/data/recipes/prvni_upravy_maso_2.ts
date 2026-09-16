import type { Recipe } from '@/types';
import { NHS_FIRST_FOODS, NHS_FISH, NHS_IRON, NHS_PREP_SAFELY } from '../ingredients/_sources';

/**
 * Jednoduché úpravy masa, druhá část.
 *
 * Doplňuje druhy, které v kuchařce zůstaly jen v dlouhých rodinných pokrmech:
 * telecí, vepřové, kachní, jehněčí, mletá masa a mořské plody.
 *
 * Platí tu totéž co v první části: dušení místo prudkého opékání, maso
 * natrhané po vláknech místo kostek a u každého receptu bezmasá varianta.
 * Mořské plody mají navíc vlastní pravidlo, protože se u nich k riziku
 * dušení přidává i tvar, který se nedá zmenšit jinak než rozmačkáním.
 */
export const prvniUpravyMaso2: Recipe[] = [
  {
    id: 'teleci-dusene-na-vlakna',
    titleCz: 'Telecí dušené na vlákna',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 70,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'teleci', amount: '500 g', track: 'meat' },
      { ingredientId: 'voda', amount: '350 ml', track: 'all' },
      { ingredientId: 'olej-repkovy', amount: '1 lžíce', track: 'all' },
      { ingredientId: 'cizrna', amount: '250 g uvařené', track: 'vegetarian' },
    ],
    baseSteps: [
      'Telecí maso nakrájej na velké kusy a otři je do sucha.',
      'V hrnci rozpal řepkový olej a kusy z každé strany zatáhni.',
      'Podlij vodou, přiklop a duš padesát minut na mírném ohni.',
      'Telecí je jemnější a světlejší než hovězí, ale železa má míň; za to se rozpadá po vláknech rychleji. Hotové maso jde rozebrat dvěma vidličkami.',
      'Od tohoto místa se hrnec dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint: 'Po kroku 4 odeber dvě lžíce masa stranou, ještě než se hrnec dochucuje.',
    babySteps: [
      'Maso natrhej podél vláken na dlouhé měkké proužky a vyřaď šlachy.',
      'Promíchej porci se lžící šťávy z dušení, telecí je libové a bez šťávy vysychá.',
    ],
    babyServing: {
      '6m': 'Dlouhé vlákno telecího masa velikosti prstu dospělého, které dítě sevře celou dlaní.',
      '9m': 'Krátká vlákna masa k sebrání špetkou.',
      '12m': 'Kousky telecího jako pro dospělé, jen bez soli.',
    },
    adultSteps: [
      'Zbylé maso osol, přidej do hrnce kořenovou zeleninu a nech šťávu zredukovat na omáčku.',
      'K telecímu sedne citronová kůra a lžíce smetany.',
    ],
    vegetarianSteps: [
      'Uvařenou cizrnu zahřej ve druhém hrnci, osol a promíchej s výpekem z kořenové zeleniny.',
      'Dochuť ji citronovou kůrou stejně jako maso.',
    ],
    vegetarianProteinSwap:
      'Místo telecího se podává 250 g uvařené cizrny s kořenovou zeleninou, která dodá bílkovinu i železo.',
    allergens: [],
    tags: ['do ruky', 'rodinné', 'mrazitelné'],
    sources: [NHS_IRON, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'veprova-panenka-dusena',
    titleCz: 'Vepřová panenka dušená na plátky',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 25,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'veprova-panenka', amount: '500 g', track: 'meat' },
      { ingredientId: 'voda', amount: '200 ml', track: 'all' },
      { ingredientId: 'olej-olivovy', amount: '1 lžíce', track: 'all' },
      { ingredientId: 'cocka-zelena', amount: '250 g uvařené', track: 'vegetarian' },
    ],
    baseSteps: [
      'Z vepřové panenky odstraň stříbrnou blánu, která se při vaření smršťuje a maso stáhne.',
      'Nakrájej ji na plátky silné dva prsty, do hrnce dej olivový olej a plátky zatáhni.',
      'Podlij vodou, přiklop a duš patnáct minut.',
      'Panenka je nejjemnější vepřový kus a vysychá nejrychleji. Hotová je, jakmile uvnitř zbělá; delší dušení už jen ubližuje.',
      'Od tohoto místa se hrnec dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint: 'Po kroku 4 odeber jeden plátek stranou, ještě než se hrnec dochucuje.',
    babySteps: [
      'Plátek natrhej podél vláken na dlouhé proužky.',
      'Zakápni porci šťávou z dušení; vepřová panenka je libová a suchá skoro jako krůtí prso.',
    ],
    babyServing: {
      '6m': 'Dlouhé vlákno vepřového masa velikosti prstu dospělého.',
      '9m': 'Krátká vlákna masa k sebrání špetkou.',
      '12m': 'Plátek vepřového nakrájený na kousky jako pro dospělé, jen bez soli.',
    },
    adultSteps: [
      'Zbylé plátky osol, opeč je na prudko dozlatova a do výpeku přidej hořčici se smetanou.',
      'K panence sedne pečené jablko nebo švestková omáčka.',
    ],
    vegetarianSteps: [
      'Uvařenou zelenou čočku zahřej, osol ji a promíchej s hořčicí a smetanou.',
      'Nech ji chvíli probublat, aby zhoustla podobně jako masová omáčka.',
    ],
    vegetarianProteinSwap:
      'Místo vepřové panenky se podává 250 g uvařené zelené čočky s hořčicí, která dodá bílkovinu i železo.',
    allergens: [],
    tags: ['do ruky', 'rychlé'],
    sources: [NHS_IRON, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
  {
    id: 'veprova-kyta-dusena',
    titleCz: 'Vepřová kýta dušená doměkka',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 75,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'veprova-kyta', amount: '600 g', track: 'meat' },
      { ingredientId: 'voda', amount: '400 ml', track: 'all' },
      { ingredientId: 'olej-repkovy', amount: '1 lžíce', track: 'all' },
      { ingredientId: 'fazole-bile', amount: '250 g uvařené', track: 'vegetarian' },
    ],
    baseSteps: [
      'Vepřovou kýtu nakrájej na velké kusy a ořízni z nich tuhé okraje tuku.',
      'V hrnci rozpal řepkový olej a maso ze všech stran opeč dohněda.',
      'Podlij vodou, přiklop a duš šedesát minut na nejmenším plameni.',
      'Kýta je libovější než plec, takže potřebuje delší dušení, než se rozpadne. Hotová je, když jde rozebrat vidličkou bez tlaku.',
      'Od tohoto místa se hrnec dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint: 'Po kroku 4 odeber dvě lžíce masa stranou, ještě než se hrnec dochucuje.',
    babySteps: [
      'Maso rozeber na dlouhá vlákna a vyřaď zbytky tuku i šlach.',
      'Promíchej porci se šťávou z dušení, ať je vláčná.',
    ],
    babyServing: {
      '6m': 'Dlouhé vlákno vepřového masa velikosti prstu dospělého.',
      '9m': 'Krátká vlákna masa promíchaná s lžící zeleninové kaše.',
      '12m': 'Kousky vepřového jako pro dospělé, jen bez soli.',
    },
    adultSteps: [
      'Zbylé maso osol, přidej kmín a česnek a nech šťávu zredukovat.',
      'K vepřové kýtě sedne dušené zelí a bramborový knedlík.',
    ],
    vegetarianSteps: [
      'Uvařené bílé fazole zahřej, osol je a promíchej s kmínem a česnekem.',
      'Nech je deset minut probublat, aby nasákly stejnou chuť jako maso.',
    ],
    vegetarianProteinSwap:
      'Místo vepřové kýty se podává 250 g uvařených bílých fazolí s kmínem, které dodají bílkovinu.',
    allergens: [],
    tags: ['do ruky', 'rodinné', 'mrazitelné'],
    sources: [NHS_IRON, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'kaci-prsa-dusena',
    titleCz: 'Kachní prsa dušená bez kůže',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 35,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'kaci-prsa', amount: '2 kusy', track: 'meat' },
      { ingredientId: 'voda', amount: '250 ml', track: 'all' },
      { ingredientId: 'jablko', amount: '2 kusy', track: 'all' },
      { ingredientId: 'cocka-beluga', amount: '250 g uvařené', track: 'vegetarian' },
    ],
    baseSteps: [
      'Kachním prsům stáhni kůži s tukovou vrstvou; pro dětskou porci je moc tučná a pro dospělé se z ní dá vyškvařit sádlo zvlášť.',
      'Jablka oloupej, zbav jádřince a nakrájej na měsíčky.',
      'Do hrnce dej maso i jablka, podlij vodou, přiklop a duš pětadvacet minut.',
      'Kachní maso je tmavé a nese víc železa než kuřecí. Dušením s jablkem ztratí část výrazné chuti, kterou děti napoprvé odmítají.',
      'Od tohoto místa se hrnec dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint:
      'Po kroku 4 odeber kousek masa a dva měsíčky jablka stranou, ještě než se hrnec dochucuje.',
    babySteps: [
      'Maso natrhej po vláknech a zkontroluj, že na něm nezůstal kousek kůže.',
      'Jablko z dušení je měkké a sladké, takže z něj je druhé sousto na talíř vedle masa.',
    ],
    babyServing: {
      '6m': 'Dlouhé vlákno kachního masa velikosti prstu dospělého, k němu měsíček dušeného jablka.',
      '9m': 'Krátká vlákna masa a kostičky jablka k sebrání špetkou.',
      '12m': 'Kousky kachního s jablkem jako pro dospělé, jen bez soli.',
    },
    adultSteps: [
      'Kůži vyškvař na pánvi dokřupava, zbylé maso osol a podávej ho s ní i se šťávou z jablek.',
      'Ke kachně sedne červené zelí a pomerančová kůra.',
    ],
    vegetarianSteps: [
      'Uvařenou čočku beluga zahřej se zbylými dušenými jablky, osol a promíchej.',
      'Zakápni ji pomerančovou šťávou, aby dostala stejnou sladkokyselou chuť jako maso.',
    ],
    vegetarianProteinSwap:
      'Místo kachních prsou se podává 250 g uvařené čočky beluga s jablky, která dodá bílkovinu i železo.',
    allergens: [],
    tags: ['do ruky', 'rodinné', 'zdroj železa', 'podzimní'],
    sources: [NHS_IRON, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'jehneci-dusene-na-vlakna',
    titleCz: 'Jehněčí dušené na vlákna',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 90,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'jehneci', amount: '600 g', track: 'meat' },
      { ingredientId: 'voda', amount: '400 ml', track: 'all' },
      { ingredientId: 'olej-olivovy', amount: '2 lžíce', track: 'all' },
      { ingredientId: 'cizrna', amount: '250 g uvařené', track: 'vegetarian' },
    ],
    baseSteps: [
      'Jehněčí nakrájej na velké kusy a ořízni z nich přebytečný tuk, ve kterém sedí ta nejvýraznější chuť.',
      'V hrnci rozpal olivový olej a maso ze všech stran opeč dohněda.',
      'Podlij vodou, přiklop a duš sedmdesát minut na nejmenším plameni.',
      'Jehněčí má z běžných mas nejvíc zinku a hodně železa, ale i nejsilnější chuť. Dlouhé dušení ji zjemní a maso se rozpadne po vláknech.',
      'Od tohoto místa se hrnec dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint: 'Po kroku 4 odeber dvě lžíce masa stranou, ještě než se hrnec dochucuje.',
    babySteps: [
      'Maso rozeber na dlouhá vlákna a vyřaď tvrdé kousky tuku a šlach.',
      'Jehněčí chuť je pro dítě nová a výrazná. Když porci odmítne, není to odmítnutí navždy; nabídni ji znovu za pár dní.',
    ],
    babyServing: {
      '6m': 'Dlouhé vlákno jehněčího masa velikosti prstu dospělého.',
      '9m': 'Krátká vlákna masa promíchaná se zeleninovou kaší, která chuť zjemní.',
      '12m': 'Kousky jehněčího jako pro dospělé, jen bez soli a bez ostrého koření.',
    },
    adultSteps: [
      'Zbylé maso osol, přidej rozmarýn s česnekem a nech šťávu zredukovat na omáčku.',
      'K jehněčímu sedne pečený lilek a jogurt s mátou.',
    ],
    vegetarianSteps: [
      'Uvařenou cizrnu zahřej na oleji s rozmarýnem a česnekem a osol ji.',
      'Rozmačkej asi třetinu zrn, aby směs zhoustla podobně jako masová omáčka.',
    ],
    vegetarianProteinSwap:
      'Místo jehněčího se podává 250 g uvařené cizrny s rozmarýnem, která dodá bílkovinu i železo.',
    allergens: [],
    tags: ['do ruky', 'rodinné', 'zdroj železa'],
    sources: [NHS_IRON, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'teleci-jatra-dusena',
    titleCz: 'Telecí játra dušená na měkko',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 20,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'teleci-jatra', amount: '300 g', track: 'meat' },
      { ingredientId: 'voda', amount: '100 ml', track: 'all' },
      { ingredientId: 'olej-olivovy', amount: '1 lžíce', track: 'all' },
      { ingredientId: 'cocka-hneda', amount: '200 g uvařené', track: 'vegetarian' },
    ],
    baseSteps: [
      'Telecí játra zbav blány a nakrájej je na plátky silné centimetr.',
      'Do pánve dej olivový olej a plátky krátce zatáhni z obou stran.',
      'Podlij vodou, přiklop a duš šest minut. Telecí játra jsou jemnější než kuřecí a ještě rychleji ztvrdnou, takže se hlídají po minutách.',
      'Hotová játra už nejsou uvnitř růžová, ale zůstávají měkká. Mají ze všech potravin nejvíc vitaminu A, proto platí limit jednou týdně.',
      'Od tohoto místa se pánev dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint: 'Po kroku 4 odeber jeden plátek jater stranou, ještě než se pánev dochucuje.',
    babySteps: [
      'Rozmačkej játra vidličkou na pastu a zamíchej ji do bramborové kaše nebo do dýňového pyré.',
      'Pro dítě do roka stačí zhruba lžíce jednou týdně, kvůli vitaminu A.',
    ],
    babyServing: {
      '6m': 'Lžíce jaterní pasty zamíchaná do zeleninové kaše, nabídnutá na naložené lžíci.',
      '9m': 'Jaterní pasta namazaná na proužek chleba, ze kterého se stane sousto do ruky.',
      '12m': 'Rozmačkaná telecí játra jako součást jídla, dál nejvýš jednou týdně.',
    },
    adultSteps: [
      'Zbylá játra osol, přidej opečenou cibulku a lžíci balzamika.',
      'K telecím játrům sedne bramborová kaše nebo pečená polenta.',
    ],
    vegetarianSteps: [
      'Uvařenou hnědou čočku zahřej s opečenou cibulkou, osol ji a zakápni balzamikem.',
      'Rozmačkej část čočky, aby směs zhoustla podobně jako jaterní pasta.',
    ],
    vegetarianProteinSwap:
      'Místo telecích jater se podává 200 g uvařené hnědé čočky s cibulkou, která dodá bílkovinu i rostlinné železo.',
    allergens: [],
    tags: ['rychlé', 'zdroj železa'],
    sources: [NHS_IRON, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
  {
    id: 'kureci-mlete-kulicky',
    titleCz: 'Kuřecí mleté na měkké kuličky',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 25,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'kureci-mlete', amount: '400 g', track: 'meat' },
      { ingredientId: 'cuketa', amount: '1 střední', track: 'all' },
      { ingredientId: 'olej-olivovy', amount: '2 lžíce', track: 'all' },
      { ingredientId: 'cizrna', amount: '250 g uvařené', track: 'vegetarian' },
    ],
    baseSteps: [
      'Cuketu nastrouhej najemno a vymačkej z ní vodu do dřezu.',
      'Smíchej ji s mletým kuřecím masem a směs prohněť rukou. Cuketa drží maso vláčné; samotné mleté kuřecí se opečením promění v tuhou hroudu.',
      'Vytvaruj podlouhlé kuličky velikosti prstu dospělého, ne kulaté; kulatý tvar téhle velikosti je u kojence riziko dušení.',
      'Na pánvi rozpal olivový olej a opékej je osm minut, občas je otoč, dokud uvnitř nezmizí růžová barva.',
      'Od tohoto místa se pánev dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint: 'Po kroku 4 odeber dvě kuličky stranou, ještě než se pánev dochucuje.',
    babySteps: [
      'Rozkroj jednu a zkontroluj, že uvnitř není růžové maso. U mletého masa to platí přísněji než u celého kusu.',
      'Nech je vychladnout na teplotu ruky a ověř, že se dají rozmáčknout mezi prsty.',
    ],
    babyServing: {
      '6m': 'Podlouhlá kulička z mletého kuřecího, velikosti prstu dospělého.',
      '9m': 'Kulička rozdrobená na kousky masa velikosti fazole.',
      '12m': 'Celá kulička z kuřecího masa jako pro dospělé, jen bez soli.',
    },
    adultSteps: [
      'Zbylé kuličky osol, posyp nasekanou mátou a zakápni citronem.',
      'Sedne k nim jogurtový dip s česnekem a pita.',
    ],
    vegetarianSteps: [
      'Uvařenou cizrnu rozmačkej s vymačkanou cuketou, osol a vytvaruj stejné kuličky.',
      'Opeč je na oleji dozlatova, cizrnové drží tvar hůř, takže je obracej opatrně.',
    ],
    vegetarianProteinSwap:
      'Místo mletého kuřecího se do kuliček dá 250 g uvařené cizrny, která dodá bílkovinu.',
    allergens: [],
    tags: ['do ruky', 'rychlé'],
    sources: [NHS_IRON, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'kruti-mlete-placicky',
    titleCz: 'Krůtí mleté na placičky s batátem',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 30,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'kruti-mlete', amount: '400 g', track: 'meat' },
      { ingredientId: 'batat', amount: '250 g uvařeného', track: 'all' },
      { ingredientId: 'olej-repkovy', amount: '2 lžíce', track: 'all' },
      { ingredientId: 'cocka-cervena-loupana', amount: '200 g uvařené', track: 'vegetarian' },
    ],
    baseSteps: [
      'Uvařený batát rozmačkej vidličkou a nech ho vychladnout.',
      'Smíchej ho s mletým krůtím a prohněť. Krůtí je z mletých mas to nejlibovější, takže bez vlhké přísady vyjde placička suchá jako papír.',
      'Vytvaruj podlouhlé placičky silné asi centimetr.',
      'Na pánvi rozpal řepkový olej a opékej je čtyři minuty z každé strany, dokud uvnitř nezbělají.',
      'Od tohoto místa se pánev dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint: 'Po kroku 4 odeber dvě placičky stranou, ještě než se pánev dochucuje.',
    babySteps: [
      'Rozlom jednu placičku a zkontroluj, že uvnitř není růžové maso.',
      'Nech je vychladnout na teplotu ruky; batát drží teplo uvnitř dlouho.',
    ],
    babyServing: {
      '6m': 'Podlouhlá placička z krůtího masa a batátu, velikosti prstu dospělého.',
      '9m': 'Placička rozdrobená na kousky masa velikosti fazole.',
      '12m': 'Celá placička s krůtím jako pro dospělé, jen bez soli.',
    },
    adultSteps: [
      'Zbylé placičky osol, posyp uzenou paprikou a opeč je na vyšší teplotu do křupava.',
      'Sedne k nim salát z červeného zelí a lžíce jogurtu.',
    ],
    vegetarianSteps: [
      'Uvařenou červenou čočku smíchej se zbylým batátem, osol a vytvaruj stejné placičky.',
      'Opeč je na oleji z obou stran dozlatova.',
    ],
    vegetarianProteinSwap:
      'Místo mletého krůtího se do placiček dá 200 g uvařené červené čočky, která dodá bílkovinu i železo.',
    allergens: [],
    tags: ['do ruky', 'rychlé'],
    sources: [NHS_IRON, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'veprove-mlete-karbanatky',
    titleCz: 'Vepřové mleté na karbanátky s bramborem',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 28,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'veprove-mlete', amount: '400 g', track: 'meat' },
      { ingredientId: 'brambor', amount: '250 g uvařené', track: 'all' },
      { ingredientId: 'olej-repkovy', amount: '2 lžíce', track: 'all' },
      { ingredientId: 'fazole-bile', amount: '250 g uvařené', track: 'vegetarian' },
    ],
    baseSteps: [
      'Uvařené brambory rozmačkej a nech je vychladnout.',
      'Smíchej je s mletým vepřovým a prohněť rukou; brambora udrží karbanátek měkký a zabrání tomu, aby se stáhl do gumové kuličky.',
      'Vytvaruj podlouhlé karbanátky silné jako prst dospělého.',
      'Na pánvi rozpal řepkový olej a opékej je pět minut z každé strany. U vepřového se hlídá, aby uvnitř nezůstalo růžové maso.',
      'Od tohoto místa se pánev dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint: 'Po kroku 4 odeber dva karbanátky stranou, ještě než se pánev dochucuje.',
    babySteps: [
      'Rozkroj jeden a zkontroluj barvu masa uvnitř.',
      'Nech karbanátky vychladnout a ověř, že povolí pod tlakem prstů.',
    ],
    babyServing: {
      '6m': 'Podlouhlý karbanátek z vepřového a brambory, velikosti prstu dospělého.',
      '9m': 'Karbanátek rozdrobený na kousky masa velikosti fazole.',
      '12m': 'Celý vepřový karbanátek jako pro dospělé, jen bez soli.',
    },
    adultSteps: [
      'Zbylé karbanátky osol, přidej majoránku a česnek a opeč je dokřupava.',
      'Sedne k nim hořčice a kyselá okurka.',
    ],
    vegetarianSteps: [
      'Uvařené bílé fazole rozmačkej se zbylou bramborou, osol a vytvaruj stejné karbanátky.',
      'Opeč je na oleji z obou stran a dochuť majoránkou.',
    ],
    vegetarianProteinSwap:
      'Místo mletého vepřového se do karbanátků dá 250 g uvařených bílých fazolí, které dodají bílkovinu.',
    allergens: [],
    tags: ['do ruky', 'rychlé', 'rodinné'],
    sources: [NHS_IRON, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'krevety-rozmackane',
    titleCz: 'Krevety rozmačkané na pomazánku',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 12,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'krevety', amount: '300 g', track: 'meat' },
      { ingredientId: 'avokado', amount: '1 zralé', track: 'all' },
      { ingredientId: 'fazole-bile', amount: '200 g uvařené', track: 'vegetarian' },
    ],
    baseSteps: [
      'Krevety oloupej, vytáhni tmavou střevní žilku po hřbetě a opláchni je.',
      'Vhoď je do vroucí vody a vař dvě minuty, dokud se nestočí do C a nezrůžoví. Delší vaření z nich udělá gumu.',
      'Nakrájej je najemno a rozmačkej vidličkou.',
      'Celá kreveta má tvar i pružnost, kterou dítě neprokousne, a patří k nejrizikovějším soustům vůbec. Proto se pro miminko vždycky mačká.',
      'Od tohoto místa se miska dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint:
      'Po kroku 4 odeber lžíci rozmačkaných krevet do misky, ještě než se miska dochucuje.',
    babySteps: [
      'Smíchej krevety s rozmačkaným avokádem, které je zvláční a zjemní slanou mořskou chuť.',
      'Namaž pomazánku v silné vrstvě na proužek chleba, ze kterého se stane sousto do ruky.',
      'Korýši patří mezi klíčové alergeny. První nabídku dej dopoledne a pak ji s odstupem zopakuj, aby se tolerance udržela.',
    ],
    babyServing: {
      '6m': 'Silná vrstva pomazánky z krevet a avokáda na proužku chleba. Celá kreveta nikdy.',
      '9m': 'Pomazánka z krevet na lžíci nebo na kouscích pečiva k sebrání špetkou.',
      '12m': 'Rozmačkané krevety jako pro dospělé, celé až s jistotou, že je dítě rozkouše.',
    },
    adultSteps: [
      'Zbylé krevety osol, zakápni citronem a promíchej s chilli a česnekem.',
      'Ke krevetám sedne opečený chléb nebo těstoviny s olivovým olejem.',
    ],
    vegetarianSteps: [
      'Uvařené bílé fazole rozmačkej s avokádem místo krevet, osol a zakápni citronem.',
      'Dochuť je česnekem a chilli stejně jako mořskou verzi.',
    ],
    vegetarianProteinSwap:
      'Místo krevet se do pomazánky dá 200 g uvařených bílých fazolí, které dodají bílkovinu.',
    allergens: ['korysi'],
    tags: ['rychlé', 'studená kuchyně'],
    sources: [NHS_FISH, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'krabi-maso-pomazanka',
    titleCz: 'Pomazánka z bílého krabího masa',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 8,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'krabi-maso-bile', amount: '250 g', track: 'meat' },
      { ingredientId: 'avokado', amount: '1 zralé', track: 'all' },
      { ingredientId: 'cizrna', amount: '200 g uvařené', track: 'vegetarian' },
    ],
    baseSteps: [
      'Krabí maso rozeber prsty na vlákna a projdi je kvůli úlomkům krunýře; ty jsou ostré a v puse se nerozpustí.',
      'Avokádo rozmačkej vidličkou na hladkou kaši.',
      'Smíchej obojí a rozmačkej dohromady na pomazánku.',
      'Bílé krabí maso je jemné a rozpadá se samo, takže se s ním pracuje snáz než s krevetami; hlídat se u něj musí hlavně krunýř.',
      'Od tohoto místa se miska dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint: 'Po kroku 4 odeber lžíci pomazánky do misky, ještě než se miska dochucuje.',
    babySteps: [
      'Projdi porci ještě jednou prsty kvůli úlomkům krunýře.',
      'Korýši jsou klíčový alergen. Nabídni krabí maso poprvé dopoledne a pak ho s odstupem zopakuj.',
    ],
    babyServing: {
      '6m': 'Silná vrstva pomazánky z krabího masa na proužku chleba.',
      '9m': 'Pomazánka z krabího masa na lžíci, ze které si dítě nabírá samo.',
      '12m': 'Krabí maso s avokádem jako pro dospělé, jen bez soli.',
    },
    adultSteps: [
      'Zbylou pomazánku osol, zakápni limetkou a promíchej s nasekanou jarní cibulkou.',
      'Na opečeném chlebu s rajčetem je z toho rychlá večeře.',
    ],
    vegetarianSteps: [
      'Uvařenou cizrnu rozmačkej s avokádem místo krabího masa, osol a zakápni limetkou.',
      'Promíchej ji s jarní cibulkou stejně jako mořskou verzi.',
    ],
    vegetarianProteinSwap:
      'Místo krabího masa se do pomazánky dá 200 g uvařené cizrny, která dodá bílkovinu.',
    allergens: ['korysi'],
    tags: ['rychlé', 'studená kuchyně'],
    sources: [NHS_FISH, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'hrebenatky-kratce-opecene',
    titleCz: 'Hřebenatky krátce opečené',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 10,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'hrebenatky', amount: '300 g', track: 'meat' },
      { ingredientId: 'olej-olivovy', amount: '1 lžíce', track: 'all' },
      { ingredientId: 'tofu-natural', amount: '300 g', track: 'vegetarian' },
    ],
    baseSteps: [
      'Hřebenatky otři do sucha a odstraň tuhý postranní sval, pokud na nich zůstal.',
      'Pánev potři olivovým olejem a rozpal ji doběla.',
      'Opékej hřebenatky devadesát vteřin z každé strany. Delší opékání je promění v gumu, kratší je nechá uvnitř syrové.',
      'Hotová hřebenatka je uvnitř mléčně bílá a pruží. Pro dětskou porci ji nech na pánvi o minutu déle, syrový střed u kojence nemá co dělat.',
      'Od tohoto místa se pánev dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint:
      'Po kroku 4 odeber jednu propečenou hřebenatku stranou, ještě než se pánev dochucuje.',
    babySteps: [
      'Rozkroj hřebenatku na tenké plátky a ty pak nasekej najemno; celá je pružná a dítě ji neprokousne.',
      'Měkkýši jsou klíčový alergen. První nabídku dej dopoledne a pak ji s odstupem zopakuj.',
    ],
    babyServing: {
      '6m': 'Najemno nasekané hřebenatky promíchané s bramborovou kaší na lžíci. Celá hřebenatka nikdy.',
      '9m': 'Drobné kousky hřebenatky promíchané s kaší, které dítě sbírá špetkou.',
      '12m': 'Hřebenatka nakrájená na malé kousky, jen bez soli.',
    },
    adultSteps: [
      'Zbylé hřebenatky osol, zakápni citronem a do pánve přidej lžíci másla s česnekem.',
      'K hřebenatkám sedne hrachové pyré nebo chřest.',
    ],
    vegetarianSteps: [
      'Tofu natural odvodni, nakrájej na kolečka silná jako hřebenatky a opeč je na oleji dozlatova.',
      'Osol je a zakápni citronovým máslem s česnekem stejně jako mořskou verzi.',
    ],
    vegetarianProteinSwap:
      'Místo hřebenatek se podává 300 g opečeného tofu nakrájeného na kolečka, které dodá bílkovinu.',
    allergens: ['mekkysi', 'soja'],
    tags: ['rychlé'],
    sources: [NHS_FISH, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
];
