import type { Recipe } from '@/types';
import {
  BP_RTUT_SZU,
  EFSA_FISH_WILD_FARMED,
  EFSA_MERCURY,
  NHS_AVOID,
  NHS_FISH,
  NHS_IRON,
  NHS_PREP_SAFELY,
  NHS_VEGETARIAN,
} from '../ingredients/_sources';

/**
 * Jednoduché úpravy ryb.
 *
 * U ryby rozhoduje jediná věc víc než všechno ostatní: kosti. Každý recept
 * tady proto končí prohmatáním porce prsty, ne ochutnáním. Druhá věc je
 * vysychání, kvůli kterému se skoro všechny bílé ryby spíš dusí a pečou
 * přikryté, než opékají na prudko.
 *
 * Kde se druh liší, je to v postupu napsané: u dravých ryb střídání kvůli rtuti,
 * u tučných kvůli látkám z prostředí, u konzervy kvůli soli.
 *
 * Každý recept má bezmasou variantu, protože matka v téhle rodině rybu nejí.
 */
export const prvniUpravyRyby: Recipe[] = [
  {
    id: 'candat-duseny-na-masle',
    titleCz: 'Candát dušený pod pokličkou',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 18,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'candat', amount: '400 g filet', track: 'meat' },
      { ingredientId: 'voda', amount: '100 ml', track: 'all' },
      { ingredientId: 'olej-olivovy', amount: '1 lžíce', track: 'all' },
      { ingredientId: 'fazole-bile', amount: '250 g uvařené', track: 'vegetarian' },
    ],
    baseSteps: [
      'Filet z candáta otři do sucha a přejeď po něm bříšky prstů proti směru vláken; drobné kosti tak ucítíš dřív, než rybu uvaříš.',
      'Do pánve dej olivový olej, vlož filet kůží dolů a podlij vodou.',
      'Přiklop a duš osm minut na mírném ohni. Candát je sladkovodní ryba s jemným masem, které na prudkém ohni vysychá během minuty.',
      'Hotová ryba se rozpadá na vrstvy a uvnitř není sklovitá.',
      'Od tohoto místa se pánev dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint:
      'Po kroku 4 odeber kousek ryby velikosti dlaně stranou, ještě než se pánev dochucuje.',
    babySteps: [
      'Rybu rozeber na vrstvy a každou zvlášť prohmatej mezi prsty kvůli kostem.',
      'Kůži sundej, je pro dítě příliš tuhá.',
      'Candát patří mezi dravé sladkovodní ryby, takže ho nedávej častěji než jednou týdně.',
    ],
    babyServing: {
      '6m': 'Vrstva rybího masa velikosti prstu dospělého, pečlivě prohmataná na kosti.',
      '9m': 'Kousky ryby velikosti fazole, po kterých dítě sahá špetkou.',
      '12m': 'Kousek filetu jako pro dospělé, jen bez soli. Kosti kontroluj dál.',
    },
    adultSteps: [
      'Zbylý filet osol, zakápni citronem a do pánve přidej lžíci másla s petrželkou.',
      'Ke candátovi sedne dušený špenát nebo bramborová kaše.',
    ],
    vegetarianSteps: [
      'Uvařené bílé fazole zahřej na oleji, osol je a rozmačkej asi třetinu, aby směs zhoustla.',
      'Zakápni je citronem a promíchej s petrželkou stejně jako rybu.',
    ],
    vegetarianProteinSwap:
      'Místo candáta se podává 250 g uvařených bílých fazolí s citronem a petrželkou, které dodají bílkovinu.',
    allergens: ['ryby'],
    tags: ['ryba', 'rychlé'],
    sources: [NHS_FISH, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'treska-tmava-pecena-pod-zeleninou',
    titleCz: 'Treska tmavá pečená na zelenině',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 32,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'treska-tmava', amount: '400 g filet', track: 'meat' },
      { ingredientId: 'cuketa', amount: '2 střední', track: 'all' },
      { ingredientId: 'olej-olivovy', amount: '2 lžíce', track: 'all' },
      { ingredientId: 'cizrna', amount: '250 g uvařené', track: 'vegetarian' },
    ],
    baseSteps: [
      'Troubu předehřej na 190 °C. Cuketu nakrájej na plátky a rozlož je do zapékací misky v jedné vrstvě.',
      'Pokapej zeleninu olivovým olejem a peč ji deset minut samotnou, ať pustí vodu.',
      'Filet z tresky tmavé prohmatej na kosti, polož ho na zeleninu a vrať do trouby na dalších dvanáct minut.',
      'Zelenina pod rybou funguje jako polštář: ryba se peče v páře, která z ní stoupá, a nevysuší se ani bez přikrytí.',
      'Od tohoto místa se miska dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint:
      'Po kroku 4 odeber kousek ryby a dva plátky cukety stranou, ještě než se miska dochucuje.',
    babySteps: [
      'Rybu rozeber na vrstvy a prohmatej je prsty kvůli kostem.',
      'Treska tmavá má pevnější maso než obecná, takže drží tvar líp a dá se podat v delším kuse.',
    ],
    babyServing: {
      '6m': 'Vrstva ryby velikosti prstu dospělého, k ní plátek cukety jako druhé sousto na talíři.',
      '9m': 'Kousky ryby i cukety velikosti fazole k sebrání špetkou.',
      '12m': 'Kousek filetu se zeleninou jako pro dospělé, jen bez soli.',
    },
    adultSteps: [
      'Zbytek v misce osol, posyp strouhankou s citronovou kůrou a nech pod grilem tři minuty zezlátnout.',
      'K rybě se hodí kapary a lžíce olivového oleje.',
    ],
    vegetarianSteps: [
      'Do druhé misky rozlož zbylou cuketu, nasyp na ni uvařenou cizrnu, osol a peč patnáct minut.',
      'Posyp ji stejnou strouhankou s citronovou kůrou jako rybu.',
    ],
    vegetarianProteinSwap:
      'Místo tresky se na zeleninu peče 250 g uvařené cizrny, která dodá bílkovinu i železo.',
    allergens: ['ryby'],
    tags: ['ryba', 'pečené', 'rodinné'],
    sources: [NHS_FISH, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'treska-jednoskvrnna-v-papiru',
    titleCz: 'Treska jednoskvrnná v pečicím papíru',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 25,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'treska-jednoskvrnna', amount: '400 g filet', track: 'meat' },
      { ingredientId: 'porek', amount: '1 kus', track: 'all' },
      { ingredientId: 'olej-olivovy', amount: '1 lžíce', track: 'all' },
      { ingredientId: 'cocka-cervena-loupana', amount: '200 g uvařené', track: 'vegetarian' },
    ],
    baseSteps: [
      'Troubu předehřej na 190 °C. Pórek rozřízni podélně, propláchni a nakrájej na kolečka.',
      'Na arch pečicího papíru rozlož kolečka pórku, pokapej je olejem a polož na ně prohmataný filet.',
      'Papír přehni a okraje pevně zabal, ať pára nemůže ven. Balíček se nadme, jak se uvnitř vaří.',
      'Peč patnáct minut. Tenhle způsob je pro rybu nejšetrnější: nic se nepřipálí, nic nevyschne a chuť zůstane uvnitř.',
      'Od tohoto místa se balíček dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint:
      'Po kroku 4 rozbal balíček a odeber kousek ryby s pórkem stranou, ještě než se zbytek dochucuje.',
    babySteps: [
      'Pára v balíčku je horká, otevírej ho od sebe. Pak nech porci vychladnout na teplotu ruky.',
      'Rybu rozeber na vrstvy a prohmatej je kvůli kostem, u tresky jednoskvrnné bývají u hřbetu.',
    ],
    babyServing: {
      '6m': 'Vrstva ryby velikosti prstu dospělého, k ní dušená kolečka pórku rozdělená na vrstvy.',
      '9m': 'Kousky ryby velikosti fazole, pórek nakrátko, aby se nemotal do nitek.',
      '12m': 'Porce ryby s pórkem z balíčku jako pro dospělé, jen bez soli.',
    },
    adultSteps: [
      'Zbylou rybu osol přímo v papíru, zakápni bílým vínem a posyp koprem.',
      'Balíček se dá připravit dopředu a upéct až před jídlem.',
    ],
    vegetarianSteps: [
      'Do druhého balíčku dej pórek a uvařenou červenou čočku, osol a peč stejných patnáct minut.',
      'Po upečení zakápni čočku citronem a promíchej s koprem.',
    ],
    vegetarianProteinSwap:
      'Místo tresky se v papíru peče 200 g uvařené červené čočky s pórkem, která dodá bílkovinu i železo.',
    allergens: ['ryby'],
    tags: ['ryba', 'pečené', 'rychlé'],
    sources: [NHS_FISH, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'treska-aljasska-prsty',
    titleCz: 'Rybí prsty z tresky aljašské',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 25,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'treska-aljasska', amount: '400 g filet', track: 'meat' },
      { ingredientId: 'oves-bezlepkovy', amount: '100 g', track: 'all' },
      { ingredientId: 'olej-repkovy', amount: '2 lžíce', track: 'all' },
      { ingredientId: 'tofu-natural', amount: '300 g', track: 'vegetarian' },
    ],
    baseSteps: [
      'Troubu předehřej na 200 °C. Filet z tresky aljašské prohmatej na kosti a nakrájej na proužky silné jako prst dospělého.',
      'Bezlepkový oves rozdrť nahrubo na moučku a nasyp ji na talíř.',
      'Proužky ryby prováleč v moučce ze všech stran a rozlož je na plech s pečicím papírem. Obalování ve vejci a strouhance se dá nahradit mletými vločkami, drží stejně a nepřidává další alergen.',
      'Pokapej je řepkovým olejem a peč patnáct minut, dokud obal nezezlátne.',
      'Od tohoto místa se plech dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint: 'Po kroku 4 odeber dva rybí prsty stranou, ještě než se plech dochucuje.',
    babySteps: [
      'Rozlom jeden prst napůl a prohmatej maso uvnitř kvůli kostem; obal je ukryje před očima, ne před prsty.',
      'Nech prsty vychladnout na teplotu ruky a ověř, že se dají rozmáčknout.',
    ],
    babyServing: {
      '6m': 'Obalený rybí prst dlouhý jako prst dospělého, který z pěsti vyčnívá.',
      '9m': 'Rybí prst rozlomený na kousky velikosti fazole, po kterých dítě sahá špetkou.',
      '12m': 'Celý rybí prst jako pro dospělé, jen bez soli v obalu.',
    },
    adultSteps: [
      'Zbylé prsty před pečením osol a do moučky přimíchej papriku s česnekovým práškem.',
      'Sedne k nim tatarka z jogurtu s okurkou a koprem.',
    ],
    vegetarianSteps: [
      'Tofu natural odvodni mezi prkénky, nakrájej na stejné proužky a obal je v osolené moučce.',
      'Peč je vedle ryby patnáct minut, dokud obal nezezlátne.',
    ],
    vegetarianProteinSwap:
      'Místo tresky se obalí a upeče 300 g tofu natural, které dodá bílkovinu ve stejném tvaru prstů.',
    allergens: ['ryby', 'soja'],
    tags: ['ryba', 'do ruky', 'pečené', 'bez lepku'],
    sources: [NHS_FISH, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'makrela-pecena-cela',
    titleCz: 'Makrela pečená vcelku',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 30,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'makrela', amount: '2 kusy', track: 'meat' },
      { ingredientId: 'citron', amount: '1 kus', track: 'all' },
      { ingredientId: 'olej-olivovy', amount: '1 lžíce', track: 'all' },
      { ingredientId: 'tempeh', amount: '300 g', track: 'vegetarian' },
    ],
    baseSteps: [
      'Troubu předehřej na 200 °C. Makrely opláchni, osuš a do každé vlož dva plátky citronu.',
      'Nařízni kůži třikrát šikmo z každé strany, ať se ryba propeče rovnoměrně, a pokapej ji olivovým olejem.',
      'Peč osmnáct minut. Makrela je tučná ryba, takže se sama podmastí a na rozdíl od tresky nevyschne.',
      'Hotová ryba se od páteře odděluje sama. Vytáhni celou kostru jedním tahem za ocas, zbyde ti maso bez hlavní kosti.',
      'Od tohoto místa se ryba dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint:
      'Po kroku 4 odeber kousek masa bez kůže stranou, ještě než se ryba dochucuje.',
    babySteps: [
      'Maso rozmělni prsty a hledej drobné kosti; u makrely jich zůstává i po vytažení páteře dost.',
      'Tučné ryby se kojenci podávají nejvýš dvakrát týdně kvůli látkám, které se v jejich tuku hromadí.',
    ],
    babyServing: {
      '6m': 'Kousek rybího masa velikosti prstu dospělého, bez kůže a prohmataný na kosti.',
      '9m': 'Menší kousky ryby velikosti fazole k sebrání špetkou.',
      '12m': 'Porce z makrely jako pro dospělé, jen bez soli. Kosti hledej dál.',
    },
    adultSteps: [
      'Zbylou makrelu osol, zakápni zbylou citronovou šťávou a posyp nasekanou petrželkou.',
      'K tučné rybě sedne kyselý salát z okurky a cibule.',
    ],
    vegetarianSteps: [
      'Tempeh nakrájej na plátky, pět minut ho podus ve vodě a pak opeč na oleji dozlatova.',
      'Osol ho, zakápni citronem a posyp petrželkou stejně jako rybu.',
    ],
    vegetarianProteinSwap:
      'Místo makrely se podává 300 g opečeného tempehu, který dodá bílkovinu i výraznou chuť.',
    allergens: ['ryby', 'soja'],
    tags: ['ryba', 'pečené', 'rodinné'],
    sources: [NHS_FISH, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'tunak-cerstvy-kratce-opeceny',
    titleCz: 'Čerstvý tuňák krátce opečený',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 15,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'tunak', amount: '400 g steak', track: 'meat' },
      { ingredientId: 'olej-olivovy', amount: '1 lžíce', track: 'all' },
      { ingredientId: 'voda', amount: '60 ml', track: 'all' },
      { ingredientId: 'cizrna', amount: '250 g uvařené', track: 'vegetarian' },
    ],
    baseSteps: [
      'Steak z tuňáka otři do sucha a nech ho deset minut mimo lednici, ať není uprostřed ledový.',
      'Pánev potři olivovým olejem a rozpal ji. Steak opékej dvě minuty z každé strany.',
      'Pro dětskou porci se tuňák nenechává uvnitř růžový. Odděl kousek, podlij ho vodou, přiklop a nech tři minuty dojít, dokud není celý světlý.',
      'Tuňák je velká dravá ryba a hromadí se v něm rtuť víc než v malých druzích. EFSA proto malým dětem radí vybírat ryby z mnoha druhů a dravým rybám nedávat přednost: tuňák ať je jednou z ryb, ne ta hlavní.',
      'Od tohoto místa se pánev dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint:
      'Po kroku 4 odeber propečený kousek tuňáka stranou, ještě než se pánev dochucuje.',
    babySteps: [
      'Rozeber maso na vlákna a zkontroluj, že uvnitř nezůstalo růžové.',
      'Tuňák je suchý. Promíchej porci s lžící avokáda nebo olivového oleje, jinak ho dítě odloží.',
    ],
    babyServing: {
      '6m': 'Propečená vlákna tuňáka rozmačkaná s avokádem do vláčné kaše, kterou dítě nabírá prsty nebo olizuje z předložené lžíce.',
      '9m': 'Propečená vlákna tuňáka promíchaná s avokádem, podaná po hrstičkách, které dítě sbírá prsty.',
      '12m': 'Propečená vlákna tuňáka promíchaná s avokádem; v týdnu ho střídej s jinými rybami.',
    },
    adultSteps: [
      'Zbylý steak osol, nech ho uvnitř růžový a nakrájej ho na plátky přes vlákna.',
      'K tuňákovi sedne sezamový olej a nakládaný zázvor.',
    ],
    vegetarianSteps: [
      'Uvařenou cizrnu opeč na oleji, osol a rozmačkej asi polovinu zrn.',
      'Promíchej ji se sezamovým olejem, aby chutnala stejně výrazně jako ryba.',
    ],
    vegetarianProteinSwap:
      'Místo tuňáka se podává 250 g opečené cizrny, která dodá bílkovinu i železo.',
    allergens: ['ryby'],
    tags: ['ryba', 'rychlé'],
    sources: [NHS_FISH, NHS_PREP_SAFELY, EFSA_MERCURY],
    reviewStatus: 'verified',
  },
  {
    id: 'tunak-v-konzerve-pomazanka',
    titleCz: 'Pomazánka z tuňáka v konzervě',
    category: 'obed-vecere',
    minAgeMonths: 12,
    timeMinutes: 8,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'tunak-v-konzerve', amount: '2 konzervy', track: 'meat' },
      { ingredientId: 'avokado', amount: '1 zralé', track: 'all' },
      { ingredientId: 'fazole-bile', amount: '200 g uvařené', track: 'vegetarian' },
    ],
    baseSteps: [
      'Tuňáka sceď a propláchni studenou vodou; nálev bývá slaný a dětská porce sůl nesnese.',
      'Avokádo vyloupni z půlek a rozmačkej vidličkou na hladkou kaši.',
      'Vmíchej tuňáka a rozmačkej směs dohladka. Avokádo tady nahrazuje majonézu, dodá tuk i vláčnost.',
      'Tuňák v konzervě má podle EFSA zřejmě méně rtuti než čerstvý, protože se vyrábí z jiných nebo menších ryb, a SZÚ hodnotí rtuť v konzervách z českého trhu i pro děti jako velmi nízké riziko. I tak ho v týdnu střídej s jinými rybami.',
      'Od tohoto místa se miska dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint: 'Po kroku 4 odeber lžíci pomazánky do misky, ještě než se miska dochucuje.',
    babySteps: [
      'Projdi porci prsty kvůli kouskům kostí; v konzervě bývají měkké, ale ne vždycky.',
      'Namaž pomazánku v silné vrstvě na proužek chleba, ze kterého se stane sousto do ruky.',
    ],
    babyServing: {
      '6m': 'Nepodává se, tuňák z konzervy bývá solený a do prvních narozenin nepatří.',
      '9m': 'Nepodává se, tuňák z konzervy bývá solený a do prvních narozenin nepatří.',
      '12m': 'Silná vrstva rybí pomazánky na proužku chleba; v týdnu ho střídej s jinými rybami.',
    },
    adultSteps: [
      'Zbylou pomazánku osol, přidej nasekanou cibulku, kapary a šťávu z citronu.',
      'Na opečeném chlebu s rajčetem je z toho rychlá večeře.',
    ],
    vegetarianSteps: [
      'Uvařené bílé fazole rozmačkej s avokádem místo ryby, osol a zakápni citronem.',
      'Přidej nasekanou cibulku a kapary, aby pomazánka chutnala stejně výrazně.',
    ],
    vegetarianProteinSwap:
      'Místo tuňáka se do pomazánky dá 200 g uvařených bílých fazolí, které dodají bílkovinu.',
    allergens: ['ryby'],
    tags: ['ryba', 'rychlé', 'studená kuchyně'],
    sources: [NHS_FISH, NHS_IRON, NHS_AVOID, EFSA_MERCURY, EFSA_FISH_WILD_FARMED, BP_RTUT_SZU],
    reviewStatus: 'verified',
  },
  {
    id: 'sumec-duseny-na-rajcatech',
    titleCz: 'Sumec dušený na rajčatech',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 28,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'sumec', amount: '400 g filet', track: 'meat' },
      { ingredientId: 'rajcata-loupana-konzerva', amount: '400 g', track: 'all' },
      { ingredientId: 'olej-olivovy', amount: '1 lžíce', track: 'all' },
      { ingredientId: 'cocka-hneda', amount: '250 g uvařené', track: 'vegetarian' },
    ],
    baseSteps: [
      'Do pánve dej olivový olej, vsyp loupaná rajčata z konzervy a rozmačkej je vařečkou.',
      'Nech je deset minut probublat, dokud omáčka nezhoustne.',
      'Filet ze sumce prohmatej na kosti, vlož ho do omáčky, přiklop a duš dvanáct minut.',
      'Sumec má mastnější maso než treska a v kyselé rajčatové omáčce nerozpadne. Hotový je, když se odděluje na vrstvy.',
      'Od tohoto místa se pánev dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint:
      'Po kroku 4 odeber kousek ryby s lžící omáčky stranou, ještě než se pánev dochucuje.',
    babySteps: [
      'Rybu rozeber na vrstvy a prohmatej je kvůli kostem, u sumce jsou velké a snadno se najdou.',
      'Omáčka drží porci vlhkou, takže se dítěti polyká líp než suchá ryba.',
    ],
    babyServing: {
      '6m': 'Vrstva ryby velikosti prstu dospělého, pokapaná rajčatovou omáčkou.',
      '9m': 'Kousky ryby velikosti fazole promíchané s omáčkou.',
      '12m': 'Porce ryby s omáčkou jako pro dospělé, jen bez soli.',
    },
    adultSteps: [
      'Zbytek v pánvi osol, přidej olivy, kapary a chilli a nech chvíli probublat.',
      'K sumci na rajčatech se hodí opečený chléb nebo kuskus.',
    ],
    vegetarianSteps: [
      'Do druhé pánve dej zbylou rajčatovou omáčku, vsyp uvařenou hnědou čočku a osol.',
      'Nech ji deset minut probublat a dochuť olivami a chilli jako rybu.',
    ],
    vegetarianProteinSwap:
      'Místo sumce se do rajčatové omáčky dá 250 g uvařené hnědé čočky, která dodá bílkovinu i železo.',
    allergens: ['ryby'],
    tags: ['ryba', 'rodinné'],
    sources: [NHS_FISH, NHS_VEGETARIAN],
    reviewStatus: 'verified',
  },
  {
    id: 'tilapie-dusena-s-bylinkami',
    titleCz: 'Tilápie dušená s bylinkami',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 16,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'tilapie', amount: '400 g filet', track: 'meat' },
      { ingredientId: 'petrzelka-hladkolista', amount: '1 hrst', track: 'all' },
      { ingredientId: 'olej-olivovy', amount: '1 lžíce', track: 'all' },
      { ingredientId: 'fazolky-mungo', amount: '200 g uvařené', track: 'vegetarian' },
    ],
    baseSteps: [
      'Filet z tilápie prohmatej na kosti a nakrájej ho na kusy velikosti dlaně.',
      'Do pánve dej olivový olej, vlož kusy ryby a posyp je hrstí nasekané petrželky.',
      'Přiklop a duš sedm minut na mírném ohni. Tilápie je velmi libová a jemná, takže potřebuje kratší čas než ostatní bílé ryby.',
      'Hotová ryba je bílá skrz naskrz a rozpadá se vidličkou.',
      'Od tohoto místa se pánev dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint: 'Po kroku 4 odeber jeden kus ryby stranou, ještě než se pánev dochucuje.',
    babySteps: [
      'Rozeber rybu na vrstvy a prohmatej je kvůli kostem.',
      'Tilápie je suchá. Zakápni porci šťávou z pánve nebo ji promíchej s lžící bramborové kaše.',
    ],
    babyServing: {
      '6m': 'Vrstva ryby velikosti prstu dospělého, vlhká od šťávy z dušení.',
      '9m': 'Kousky ryby velikosti fazole k sebrání špetkou.',
      '12m': 'Kousek filetu jako pro dospělé, jen bez soli.',
    },
    adultSteps: [
      'Zbylou rybu osol, zakápni citronem a přidej do pánve lžíci másla s česnekem.',
      'K tilápii se hodí rýže a dušený špenát.',
    ],
    vegetarianSteps: [
      'Uvařené fazolky mungo zahřej na oleji s petrželkou a osol je.',
      'Zakápni je citronem a promíchej s česnekem stejně jako rybu.',
    ],
    vegetarianProteinSwap:
      'Místo tilápie se podává 200 g uvařených fazolek mungo s bylinkami, které dodají bílkovinu.',
    allergens: ['ryby'],
    tags: ['ryba', 'rychlé'],
    sources: [NHS_FISH, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'platys-peceny-na-masle',
    titleCz: 'Platýs pečený nakrátko',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 20,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'platys', amount: '400 g filet', track: 'meat' },
      { ingredientId: 'citron', amount: 'půl kusu', track: 'all' },
      { ingredientId: 'olej-olivovy', amount: '1 lžíce', track: 'all' },
      { ingredientId: 'cizrna', amount: '200 g uvařené', track: 'vegetarian' },
    ],
    baseSteps: [
      'Troubu předehřej na 190 °C. Filet z platýse je velmi tenký, takže se peče kratší dobu než jiné ryby.',
      'Prohmatej ho na kosti, polož na plech s pečicím papírem a pokapej olivovým olejem a citronem.',
      'Peč deset minut. Delší pečení tenký filet vysuší a maso se rozpadne na suchá vlákna.',
      'Hotová ryba je matně bílá a odděluje se od papíru sama.',
      'Od tohoto místa se plech dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint: 'Po kroku 4 odeber kousek ryby stranou, ještě než se plech dochucuje.',
    babySteps: [
      'Rozeber porci na vrstvy a prohmatej je prsty; platýs má drobné kosti po okrajích filetu.',
      'Tenká vrstva ryby se v ruce snadno rozpadne. Slep ji lžící bramborové kaše do sousta, které dítě udrží.',
    ],
    babyServing: {
      '6m': 'Vrstva ryby slepená s bramborovou kaší do podlouhlého sousta velikosti prstu dospělého.',
      '9m': 'Kousky ryby velikosti fazole k sebrání špetkou.',
      '12m': 'Kousek filetu jako pro dospělé, jen bez soli.',
    },
    adultSteps: [
      'Zbylý filet osol, zakápni máslem rozpuštěným s citronem a posyp mandlovými lupínky.',
      'K platýsovi sedne vařený brambor a dušený fenykl.',
    ],
    vegetarianSteps: [
      'Uvařenou cizrnu rozlož na plech, osol a peč deset minut, dokud navrchu nezačne křupat.',
      'Zakápni ji citronovým máslem a posyp mandlovými lupínky jako rybu.',
    ],
    vegetarianProteinSwap:
      'Místo platýse se peče 200 g uvařené cizrny, která dodá bílkovinu i železo.',
    allergens: ['ryby'],
    tags: ['ryba', 'pečené', 'rychlé'],
    sources: [NHS_FISH, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'morsky-vlk-peceny-se-solnym-loze',
    titleCz: 'Mořský vlk pečený vcelku',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 35,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'morsky-vlk', amount: '2 kusy', track: 'meat' },
      { ingredientId: 'fenykl-hliza', amount: '1 hlíza', track: 'all' },
      { ingredientId: 'olej-olivovy', amount: '2 lžíce', track: 'all' },
      { ingredientId: 'fazole-bile', amount: '250 g uvařené', track: 'vegetarian' },
    ],
    baseSteps: [
      'Troubu předehřej na 200 °C. Fenykl nakrájej na plátky a rozlož je do pekáče jako podklad.',
      'Mořského vlka opláchni, osuš a polož na fenykl. Pokapej rybu i zeleninu olivovým olejem.',
      'Peč dvacet minut. Ryba pečená vcelku zůstane šťavnatější než filet, protože ji chrání kůže a kosti.',
      'Hotová ryba má oko bílé a maso u páteře se odděluje samo. Sundej kůži a vytáhni celou kostru jedním tahem.',
      'Od tohoto místa se pekáč dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint:
      'Po kroku 4 odeber kousek masa bez kůže a plátek fenyklu stranou, ještě než se pekáč dochucuje.',
    babySteps: [
      'Maso rozmělni prsty a hledej drobné kosti od žeber; u ryby pečené vcelku jich zůstává víc než u filetu.',
      'Fenykl pod rybou nasál šťávu, takže z něj je druhé sousto na talíř.',
    ],
    babyServing: {
      '6m': 'Kousek rybího masa velikosti prstu dospělého, k němu plátek fenyklu jako druhá volba.',
      '9m': 'Kousky ryby i fenyklu velikosti fazole k sebrání špetkou.',
      '12m': 'Porce ryby s fenyklem jako pro dospělé, jen bez soli. Kosti hledej dál.',
    },
    adultSteps: [
      'Zbylou rybu osol, zakápni citronem a olivovým olejem a posyp fenyklovou natí.',
      'K mořskému vlkovi sedne pečený brambor a sklenka bílého vína.',
    ],
    vegetarianSteps: [
      'Uvařené bílé fazole nasyp na zbylý fenykl v pekáči, osol a peč patnáct minut.',
      'Zakápni je citronem a posyp fenyklovou natí jako rybu.',
    ],
    vegetarianProteinSwap:
      'Místo mořského vlka se na fenykl pečou bílé fazole, 250 g uvařených, které dodají bílkovinu.',
    allergens: ['ryby'],
    tags: ['ryba', 'pečené', 'rodinné'],
    sources: [NHS_FISH, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'prazma-pecena-s-bramborem',
    titleCz: 'Pražma pečená na bramborách',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 40,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'prazma', amount: '2 kusy', track: 'meat' },
      { ingredientId: 'brambor', amount: '600 g', track: 'all' },
      { ingredientId: 'olej-olivovy', amount: '2 lžíce', track: 'all' },
      { ingredientId: 'cocka-beluga', amount: '250 g uvařené', track: 'vegetarian' },
    ],
    baseSteps: [
      'Troubu předehřej na 200 °C. Brambory oškrábej, nakrájej na plátky a rozlož je do pekáče s olivovým olejem.',
      'Peč je patnáct minut samotné, ať se stihnou změknout dřív, než přijde ryba.',
      'Pražmu opláchni, osuš, polož na brambory a peč dalších dvacet minut.',
      'Pražma má pevné bílé maso a méně drobných kostí než mořský vlk, takže se pro dítě rozebírá snadněji. Hotová je, když se maso u páteře odděluje samo.',
      'Od tohoto místa se pekáč dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint:
      'Po kroku 4 odeber kousek masa a dva plátky brambor stranou, ještě než se pekáč dochucuje.',
    babySteps: [
      'Sundej kůži, vytáhni kostru a maso prohmatej prsty kvůli zbylým kostem.',
      'Brambory pod rybou nasákly výpek, takže se dítěti polykají líp než suché pečené.',
    ],
    babyServing: {
      '6m': 'Kousek rybího masa velikosti prstu dospělého a k němu plátek brambory jako druhé sousto.',
      '9m': 'Kousky ryby a brambory velikosti fazole k sebrání špetkou.',
      '12m': 'Porce ryby s bramborami jako pro dospělé, jen bez soli.',
    },
    adultSteps: [
      'Zbytek v pekáči osol, zakápni citronem a posyp rozmarýnem a nasekaným česnekem.',
      'K pražmě se hodí salát z rajčat s červenou cibulí.',
    ],
    vegetarianSteps: [
      'Uvařenou čočku beluga nasyp na zbylé brambory, osol a peč patnáct minut.',
      'Zakápni ji citronem a posyp rozmarýnem s česnekem jako rybu.',
    ],
    vegetarianProteinSwap:
      'Místo pražmy se na brambory peče 250 g uvařené čočky beluga, která dodá bílkovinu i železo.',
    allergens: ['ryby'],
    tags: ['ryba', 'pečené', 'rodinné'],
    sources: [NHS_FISH, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'okoun-ricni-duseny',
    titleCz: 'Okoun říční dušený na másle',
    category: 'obed-vecere',
    minAgeMonths: 6,
    timeMinutes: 18,
    servings: '2 dospělí + 1 miminko',
    ingredients: [
      { ingredientId: 'okoun-ricni', amount: '400 g filet', track: 'meat' },
      { ingredientId: 'voda', amount: '80 ml', track: 'all' },
      { ingredientId: 'olej-olivovy', amount: '1 lžíce', track: 'all' },
      { ingredientId: 'hrach-zluty-puleny', amount: '200 g uvařeného', track: 'vegetarian' },
    ],
    baseSteps: [
      'Filet z okouna prohmatej zvlášť pečlivě. Okoun má hodně drobných kostí a právě ty rozhodují, jestli se dá podat dítěti.',
      'Do pánve dej olivový olej, vlož filet a podlij vodou.',
      'Přiklop a duš osm minut na mírném ohni.',
      'Hotový okoun má maso sněhově bílé a jemné, chuťově je z našich sladkovodních ryb nejjemnější.',
      'Od tohoto místa se pánev dělí. Dětská porce jde stranou dřív, než se cokoli dochucuje.',
    ],
    babySplitPoint: 'Po kroku 4 odeber kousek ryby stranou, ještě než se pánev dochucuje.',
    babySteps: [
      'Rozeber porci na co nejmenší vrstvy a projdi je prsty dvakrát. U okouna to není přehnaná opatrnost.',
      'Zakápni porci šťávou z dušení, ať není suchá.',
    ],
    babyServing: {
      '6m': 'Vrstva ryby velikosti prstu dospělého, dvakrát prohmataná na kosti.',
      '9m': 'Kousky ryby velikosti fazole k sebrání špetkou.',
      '12m': 'Kousek filetu jako pro dospělé, jen bez soli. Kosti kontroluj dál.',
    },
    adultSteps: [
      'Zbylou rybu osol, zakápni máslem s citronem a posyp petrželkou.',
      'K okounovi se hodí vařený brambor a dušený hrášek.',
    ],
    vegetarianSteps: [
      'Uvařený žlutý hrách zahřej, osol ho a promíchej s máslem a citronem.',
      'Posyp ho petrželkou stejně jako rybu.',
    ],
    vegetarianProteinSwap:
      'Místo okouna se podává 200 g uvařeného žlutého hrachu s citronem, který dodá bílkovinu.',
    allergens: ['ryby'],
    tags: ['ryba', 'rychlé'],
    sources: [NHS_FISH, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
];
