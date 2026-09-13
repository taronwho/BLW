import type { Ingredient } from '@/types';
import {
  BP_NITRATES_VEG,
  BP_BEETROOT,
  EFSA_NITRATE,
  EMA_FENNEL,
  MZCR_COMPLEMENTARY,
  NHS_10_12M,
  NHS_6M,
  NHS_7_9M,
  NHS_ALLERGY,
  NHS_AVOID,
  NHS_FIRST_FOODS,
  NHS_PREP_SAFELY,
  NHS_VEGETARIAN,
  NHS_YOUNG_CHILDREN,
} from './_sources';

/**
 * Kategorie „zelenina" podle docs/SUROVINY-SEZNAM.md (40 položek).
 *
 * Listová zelenina a řepa nesou hazard `dusicnany` s pokynem neohřívat
 * pokrm opakovaně (EFSA). Syrová tvrdá zelenina a rajčata s tvarem bobule
 * mají vysoké riziko dušení a odpovídající pokyn ke krájení.
 */
export const vegetables: Ingredient[] = [
  {
    id: 'mrkev',
    nameCz: 'mrkev',
    altNamesCz: ['karotka', 'mrkve'],
    category: 'zelenina',
    emoji: '🥕',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'high',
    chokingReason:
      'Syrová mrkev je tvrdší než dětské dásně, odlamují se z ní pevné úlomky a ty projdou hrdlem bez rozmělnění.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Mrkev oloupej, nakrájej na hranolky tlusté jako tvůj prst a vař je v páře, dokud nejdou rozmáčknout mezi prsty. Syrovou mrkev v žádné podobě nenabízej, ani nastrouhanou nahrubo.',
        caution: 'Uvařený hranolek zkoušej vždy po vychladnutí.',
      },
      '9m': {
        serving:
          'Vařené hranolky nakrájej na kostky velikosti sousta, dítě je nabere klešťovým úchopem. Jemně nastrouhaná syrová mrkev je možná ve směsi s jogurtem, samostatné plátky ještě ne.',
        caution: 'Strouhej najemno, hrubé nudličky zůstávají tvrdé.',
      },
      '12m': {
        serving:
          'Batole jí vařenou mrkev v kostkách a jemně strouhanou syrovou v salátu. Syrové mrkvové hranolky nechávej až na dobu, kdy dítě spolehlivě kouše, dřív jsou rizikové.',
        caution: 'Mrkev v salátu vždy strouhej, nikdy nekrájej na kolečka.',
      },
    },
    prepIdeas: [
      'hranolky vařené v páře',
      'pečená se špetkou kmínu',
      'rozmixovaná do polévky',
      'jemně nastrouhaná do jogurtu',
    ],
    seasonCz: [6, 7, 8, 9, 10, 11],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
  {
    id: 'pastinak',
    nameCz: 'pastinák',
    altNamesCz: ['pastyňák'],
    category: 'zelenina',
    emoji: '🥕',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Syrový pastinák má dřevnatý střed, který ani při dlouhém žvýkání nepovolí a odděluje se od měkčí vnější části.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Pastinák oloupej, vyřízni tvrdý střed a zbytek nakrájej na dlouhé díly. Upeč je nebo poduš doměkka, chuť je jemně nasládlá a děti ji přijímají ochotněji než mrkev.',
        caution: 'Střed u velkých kusů bývá dřevnatý, vždy ho odstraň.',
      },
      '9m': {
        serving:
          'Upečený pastinák nakrájej na kostky nebo ho rozmačkej s bramborem. Dobře se snáší s jablkem, se kterým vytvoří nasládlé pyré vhodné i pro vybíravé dny.',
        caution: 'Pečený pastinák rychle vysychá, přikryj ho alobalem.',
      },
      '12m': {
        serving:
          'Batole jí pečený pastinák jako hranolky nebo v polévce. Je základem klasické české kořenové zeleniny a v zimě patří k nejdostupnější zelenině vůbec.',
        caution: 'Kořenová zelenina z pytle bývá starší a tužší.',
      },
    },
    prepIdeas: [
      'pečené hranolky s olivovým olejem',
      'rozmačkaný s bramborem',
      'pyré s jablkem',
      'do zeleninového vývaru',
    ],
    seasonCz: [9, 10, 11, 12, 1, 2],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, MZCR_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'petrzel-koren',
    nameCz: 'petržel kořen',
    altNamesCz: ['kořenová petržel', 'petrželový kořen'],
    category: 'zelenina',
    emoji: '🥕',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Kořen petržele zůstává i po krátkém vaření pevný a jeho vlákna drží kus pohromadě, takže se v ústech nerozpadne.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Kořen petržele oloupej a vař ho v páře déle než mrkev, je hutnější. Měkký kořen rozmačkej vidličkou nebo ho rozmixuj do zeleninového pyré, kterému dodá výraznou vůni.',
        caution: 'Petržel má silnější chuť, pro první ochutnávky ji mísi.',
      },
      '9m': {
        serving:
          'Uvařený kořen nakrájej na kostky a promíchej ho s bramborem. V české kuchyni je základem vývaru, který se dá uvařit bez soli a použít na rozředění dětského pyré.',
        caution: 'Vývar pro dítě vař bez soli, dospělým se dosolí zvlášť.',
      },
      '12m': {
        serving:
          'Batole jí petržel v polévce, v pečené zeleninové směsi i rozmačkanou. Petrželová nať i kořen pocházejí z jedné rostliny, chuťově se ale liší a v jídelníčku se doplňují.',
        caution: 'Starý kořen bývá dutý a hořký, vyber pevné kusy.',
      },
    },
    prepIdeas: [
      'vařený v páře a rozmačkaný',
      'pečený se zeleninovou směsí',
      'do vývaru bez soli',
      'rozmixovaný do polévky',
    ],
    seasonCz: [9, 10, 11, 12, 1, 2],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, MZCR_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'celer-bulva',
    nameCz: 'celer bulva',
    altNamesCz: ['celer bulvový', 'celerová bulva'],
    category: 'zelenina',
    emoji: '🥬',
    allergens: ['celer'],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Celerová bulva je hutná a pevná a ukousnutý kus si drží tvar i po delším žvýkání dásněmi.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Celer oloupej silněji, slupka bývá dřevnatá, a vař ho doměkka v páře. Rozmixuj ho s bramborem, samotné celerové pyré má pro první ochutnávky příliš výraznou chuť.',
        caution: 'Celer patří mezi povinně značené alergeny, zaváděj ho odděleně.',
      },
      '9m': {
        serving:
          'Uvařený celer nakrájej na kostky nebo ho rozmačkej do bramborové kaše. Sleduj při prvním podání reakci kůže i dýchání, alergie na celer se v Evropě vyskytuje běžně.',
        caution: 'Celer je skrytý v mnoha hotových směsích, čti složení.',
      },
      '12m': {
        serving:
          'Batole jí celer v polévce, v pečené zelenině i v kaši. Nať i bulva se v kuchyni používají jinak, ale z hlediska alergenu jde o jednu a tu samou rostlinu.',
        caution: 'Při podezření na reakci se vždy obrať na pediatra.',
      },
    },
    prepIdeas: [
      'rozmixovaný s bramborem',
      'pečený na kostky',
      'do zeleninového vývaru',
      'rozmačkaný do kaše',
    ],
    seasonCz: [9, 10, 11, 12, 1],
    vegetarian: true,
    sources: [NHS_ALLERGY, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
  {
    id: 'cervena-repa',
    nameCz: 'červená řepa',
    altNamesCz: ['řepa salátová', 'červená řepa vařená'],
    category: 'zelenina',
    emoji: '🫒',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Vařená řepa je kluzká a hutná zároveň, takže větší kus sklouzne po jazyku dřív, než ho dásně stihnou rozdělit.',
    hazards: ['dusicnany'],
    hazardNotes: {
      dusicnany:
        'Řepa patří k zelenině s vyšším obsahem dusičnanů. Nabízej ji spíš občas než denně a uvařený pokrm nenechávej stát v teple ani ho podruhé neohřívej, protože při pomalém chladnutí se dusičnany mění na dusitany.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Řepu uvař ve slupce doměkka, pak ji oloupej a nakrájej na dlouhé díly. Zbarví dítěti ruce i obličej, což je neškodné, stejně jako narůžovělá stolice po jejím snědení.',
        caution: 'Uvařenou řepu zchlaď rychle a ulož ji do lednice.',
      },
      '9m': {
        serving:
          'Vařenou řepu nakrájej na kostky nebo ji nastrouhej do jogurtu. Sladká chuť se dobře snáší s jablkem a s kmínem a barva jídla dítě obvykle zaujme.',
        caution: 'Podávej ji obden, ne každý den, kvůli dusičnanům.',
      },
      '12m': {
        serving:
          'Batole jí řepu v salátu, v pečené směsi i rozmačkanou. Pečením v troubě se chuť zkoncentruje a řepa dostane jemně karamelový tón, který děti přijímají snadno.',
        caution: 'Nakládaná řepa ze sklenice obsahuje sůl i ocet.',
      },
    },
    prepIdeas: [
      'vařená ve slupce a nakrájená na díly',
      'pečená v troubě na kostky',
      'nastrouhaná do jogurtu',
      'rozmixovaná s jablkem',
    ],
    seasonCz: [7, 8, 9, 10, 11],
    vegetarian: true,
    sources: [EFSA_NITRATE, BP_BEETROOT, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
  {
    id: 'batat',
    nameCz: 'batát',
    altNamesCz: ['sladké brambory', 'batáty'],
    category: 'zelenina',
    emoji: '🍠',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Batát upeč vcelku ve slupce, dužina pak zůstane vláčná a snadno se z ní tvarují díly do ruky. Sladká chuť patří k nejpřijímanějším první potravinám vůbec, takže je to vděčný začátek.',
        caution: 'Slupku pro první porce sundej, je vláknitá.',
      },
      '9m': {
        serving:
          'Z pečeného batátu nakrájej hranolky nebo ho rozmačkej s trochou olivového oleje. Dítě se na hranolku učí ukusovat a měkká dužina jí přitom nedělá problém.',
        caution: 'Batát v páře zvlhne, na hranolky ho spíš peč.',
      },
      '12m': {
        serving:
          'Batole jí batát ve formě hranolků, kaše i v placičkách. Peče se dobře společně s ostatní zeleninou, takže se dá připravit jeden plech pro celou rodinu najednou.',
        caution: 'Batát se rychle kazí v chladu, skladuj ho mimo lednici.',
      },
    },
    prepIdeas: [
      'pečený vcelku ve slupce',
      'hranolky z trouby',
      'rozmačkaný s olivovým olejem',
      'do zeleninových placiček',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, NHS_6M],
    reviewStatus: 'verified',
  },
  {
    id: 'brambor',
    nameCz: 'brambor',
    altNamesCz: ['brambory', 'zemák'],
    category: 'zelenina',
    emoji: '🥔',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Brambor uvař doměkka a rozmačkej ho s mateřským mlékem nebo s vodou z vaření. Vařený brambor můžeš podat i v dílech do ruky, ale musí být tak měkký, že se dá rozmáčknout prsty.',
        caution: 'Vodu na vaření nesol, brambor sůl nasává.',
      },
      '9m': {
        serving:
          'Bramborovou kaši dělej hustší, aby držela na lžíci, kterou dítě samo nabírá. Z rozmačkaného brambora se dají vytvarovat i placičky, které v ruce drží pohromadě.',
        caution: 'Zelené a naklíčené brambory vůbec nepoužívej.',
      },
      '12m': {
        serving:
          'Batole jí brambory vařené, pečené i v placičkách. Klasické české přílohy se dají připravit bez soli pro celou rodinu a dochutit až na talíři dospělých.',
        caution: 'Smažené hranolky z obchodu jsou slané a tučné.',
      },
    },
    prepIdeas: [
      'rozmačkaný s vodou z vaření',
      'pečené díly s bylinkami',
      'bramborové placičky',
      'do zeleninové polévky',
    ],
    seasonCz: [7, 8, 9, 10, 11, 12],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
  {
    id: 'dyne-hokaido',
    nameCz: 'dýně hokaido',
    altNamesCz: ['hokaido'],
    category: 'zelenina',
    emoji: '🎃',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Hokaido nemusíš loupat, slupka po upečení změkne a dá se sníst. Dýni rozkroj, vydlab vnitřek s jádry, nakrájej na měsíčky a peč doměkka, dítě si měsíček vezme do ruky.',
        caution: 'Slupka u velkých kusů zůstává tuhá, u těch ji odřízni.',
      },
      '9m': {
        serving:
          'Pečenou dýni nakrájej na kostky nebo ji rozmačkej s bramborem. Sladká oranžová dužina je bohatá na karoteny a pro dítě bývá jednou z nejoblíbenějších zelenin.',
        caution: 'Přezrálá dýně je vodnatá a chutná nevýrazně.',
      },
      '12m': {
        serving:
          'Batole jí dýni pečenou, v polévce i v placičkách. Z jedné dýně navaříš pro celou rodinu, část se dá rozmixovat na polévku a zbytek upéct jako přílohu.',
        caution: 'Nakrojenou dýni skladuj v lednici nejvýše tři dny.',
      },
    },
    prepIdeas: [
      'pečené měsíčky se slupkou',
      'krémová polévka bez soli',
      'rozmačkaná s bramborem',
      'do zeleninových placiček',
    ],
    seasonCz: [8, 9, 10, 11],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, NHS_6M],
    reviewStatus: 'verified',
  },
  {
    id: 'dyne-maslova',
    nameCz: 'dýně máslová',
    altNamesCz: ['butternut', 'máslová dýně'],
    category: 'zelenina',
    emoji: '🎃',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Máslovou dýni na rozdíl od hokaida vždy oloupej, její slupka zůstává tuhá i po pečení. Krk dýně je bez dutiny, takže z něj nakrájíš pravidelné hranolky ideální do dětské dlaně.',
        caution: 'Loupej ji škrabkou, nožem se snadno uklouzne.',
      },
      '9m': {
        serving:
          'Upečené hranolky nakrájej na kostky nebo dýni rozmixuj na husté pyré. Chuť je jemnější a máslovější než u hokaida a dobře se snáší s kokosovým mlékem v kari.',
        caution: 'Dýně v páře zvlhne, na hranolky ji raději peč.',
      },
      '12m': {
        serving:
          'Batole jí máslovou dýni pečenou, v kari i v rizotu. Dobře se skladuje, celá dýně vydrží v chladné spíži i několik měsíců bez ztráty kvality.',
        caution: 'Vnitřek s jádry vydlab a vyhoď, je vláknitý.',
      },
    },
    prepIdeas: [
      'pečené hranolky z krku dýně',
      'rozmixovaná do kari',
      'pyré s kokosovým mlékem',
      'zapečená s ricottou',
    ],
    seasonCz: [9, 10, 11, 12],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, NHS_7_9M],
    reviewStatus: 'verified',
  },
  {
    id: 'cuketa',
    nameCz: 'cuketa',
    altNamesCz: ['cukety'],
    category: 'zelenina',
    emoji: '🥒',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Cuketu nakrájej na dlouhé hranolky a krátce je poduš, měknou velmi rychle. Mladé plody nemusíš loupat, u velkých cuket slupku odřízni, protože bývá tuhá a hořká.',
        caution: 'Převařená cuketa se rozpadá, hlídej krátký čas.',
      },
      '9m': {
        serving:
          'Nastrouhaná cuketa se skvěle přidává do placiček, kterým dodá vláhu. Uvařené kostky dítě nabere prsty, ale hlídej, aby nebyly kluzké, jinak jí utečou z ruky.',
        caution: 'Cuketa pouští při pečení hodně vody, osuš ji.',
      },
      '12m': {
        serving:
          'Batole jí cuketu grilovanou, v placičkách i v zapečené zelenině. V sezoně je jí na zahradě přebytek, takže se dá nastrouhat a zamrazit do zásoby na celý rok.',
        caution: 'Hořká cuketa se nesmí jíst, hořkost značí nevhodnou odrůdu.',
      },
    },
    prepIdeas: [
      'hranolky krátce podušené',
      'nastrouhaná do placiček',
      'grilovaná na plátky',
      'zapečená s rajčaty',
    ],
    seasonCz: [6, 7, 8, 9],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, NHS_6M],
    reviewStatus: 'verified',
  },
  {
    id: 'patizon',
    nameCz: 'patizon',
    altNamesCz: ['patisson'],
    category: 'zelenina',
    emoji: '🥒',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Patizon je příbuzný cukety a připravuje se stejně, jen má pevnější dužinu. Nakrájej ho na díly a poduš v páře doměkka, mladé plody přitom nemusíš loupat.',
        caution: 'Starý patizon má tvrdá jádra, ta před vařením vyber.',
      },
      '9m': {
        serving:
          'Uvařený patizon nakrájej na kostky nebo ho rozmačkej do zeleninové směsi. Jeho jemná chuť dobře doplňuje výraznější zeleninu, takže se hodí do směsí s řepou nebo s brokolicí.',
        caution: 'Patizon se rychle rozvaří, kontroluj ho během vaření.',
      },
      '12m': {
        serving:
          'Batole jí patizon zapečený, plněný i nakrájený do rizota. Menší plody se dají vydlabat a naplnit směsí z luštěnin, což je hezký bezmasý oběd pro celou rodinu.',
        caution: 'Přerostlý patizon je vláknitý, vybírej menší plody.',
      },
    },
    prepIdeas: [
      'díly podušené v páře',
      'plněný luštěninovou směsí',
      'nakrájený do rizota',
      'zapečený se sýrem',
    ],
    seasonCz: [7, 8, 9],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, MZCR_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'lilek',
    nameCz: 'lilek',
    altNamesCz: ['baklažán'],
    category: 'zelenina',
    emoji: '🍆',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Lilková slupka je pevná a pružná a po upečení se od měkké dužiny oddělí jako celistvý pásek.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Lilek rozkroj napůl, upeč ho v troubě a dužinu vyber lžící, slupku zahoď. Měkkou dužinu rozmixuj s olivovým olejem a citronem na pomazánku, kterou dítě olizuje z prstu.',
        caution: 'Syrový lilek je hořký a pro dítě nevhodný.',
      },
      '9m': {
        serving:
          'Pečený lilek nakrájej na kostky bez slupky a promíchej ho s rajčaty. Chuť je výrazná a mírně nahořklá, takže ji nabídni opakovaně, než ji dítě přijme.',
        caution: 'Slupku u dětské porce vždy odstraň.',
      },
      '12m': {
        serving:
          'Batole jí lilek v ratatouille, v zapečené zelenině i jako pomazánku. Ve středomořské kuchyni se z něj dělají bezmasá hlavní jídla, což se v téhle rodině hodí.',
        caution: 'Lilek nasává hodně tuku, peč ho spíš než smaž.',
      },
    },
    prepIdeas: [
      'pečený a vydlabaný na pomazánku',
      'kostky bez slupky s rajčaty',
      'v zeleninovém ratatouille',
      'zapečený s ricottou',
    ],
    seasonCz: [7, 8, 9],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, NHS_VEGETARIAN],
    reviewStatus: 'verified',
  },
  {
    id: 'brokolice',
    nameCz: 'brokolice',
    altNamesCz: ['brokolicové růžičky'],
    category: 'zelenina',
    emoji: '🥦',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Brokolici rozděl na větší růžičky se stopkou, kterou dítě drží jako držadlo. Vař je v páře, dokud nejde stopka snadno propíchnout, květ pak funguje jako přirozený kartáček.',
        caution: 'Drobné rozpadlé kousky květu odstraň, lepí se na patro.',
      },
      '9m': {
        serving:
          'Uvařené růžičky nakrájej na menší kusy, které dítě sbírá prsty. Brokolice není sladká, a právě proto ji nabízej často, aby si dítě zvyklo i na hořčejší chutě.',
        caution: 'Převařená brokolice ztrácí barvu i vitaminy.',
      },
      '12m': {
        serving:
          'Batole jí brokolici vařenou, pečenou i zapečenou se sýrem. Stonek neodhazuj, oloupaný a nakrájený je stejně dobrý jako růžičky a je z něj méně odpadu.',
        caution: 'Syrová brokolice je pro malé dítě příliš tvrdá.',
      },
    },
    prepIdeas: [
      'růžičky vařené v páře',
      'pečená s olivovým olejem',
      'rozmixovaná do polévky',
      'zapečená s tvarohem',
    ],
    seasonCz: [6, 7, 8, 9, 10],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, NHS_6M],
    reviewStatus: 'verified',
  },
  {
    id: 'kvetak',
    nameCz: 'květák',
    altNamesCz: ['karfiol', 'květákové růžičky'],
    category: 'zelenina',
    emoji: '🥬',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Květák rozeber na velké růžičky a vař je v páře, dokud nejsou úplně měkké. Stopka slouží dítěti jako držadlo a květ se v ústech rozpadne, takže je to vděčné první sousto do ruky.',
        caution: 'Drobné odpadlé kousky z talíře odstraň.',
      },
      '9m': {
        serving:
          'Vařený květák nakrájej na menší kusy nebo ho rozmačkej s bramborem. Z upečených růžiček se stane karamelizovaná zelenina, kterou děti přijímají lépe než vařenou.',
        caution: 'Vařením květák zesílí ve vůni, větrej kuchyni.',
      },
      '12m': {
        serving:
          'Batole jí květák pečený, zapečený i jako pyré místo bramborové kaše. Rozmixovaný květák s trochou másla je jemná příloha, která chutná i dospělým.',
        caution: 'Syrové květákové růžičky jsou pro malé dítě tvrdé.',
      },
    },
    prepIdeas: [
      'růžičky vařené v páře',
      'pečené s olivovým olejem',
      'květákové pyré místo bramborové kaše',
      'zapečený s bešamelem bez soli',
    ],
    seasonCz: [6, 7, 8, 9, 10],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, NHS_6M],
    reviewStatus: 'verified',
  },
  {
    id: 'kedlubna',
    nameCz: 'kedlubna',
    altNamesCz: ['kedluben'],
    category: 'zelenina',
    emoji: '🥬',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Syrová kedlubna je křupavá a tvrdá, ukousnutý kousek se dásněmi nerozdrtí a zůstane celý.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Kedlubnu oloupej silněji, pod slupkou bývá dřevnatá vrstva, a nakrájej ji na hranolky. Vař je v páře doměkka, syrovou kedlubnu v téhle fázi nenabízej v žádné podobě.',
        caution: 'Přerostlá kedlubna je dřevnatá i uvnitř, vybírej menší.',
      },
      '9m': {
        serving:
          'Vařené hranolky nakrájej na kostky nebo kedlubnu jemně nastrouhej do salátu s jogurtem. Nastrouhaná syrová kedlubna je v pořádku, samostatné syrové plátky ještě ne.',
        caution: 'Strouhej najemno, hrubé nudličky zůstávají křupavé.',
      },
      '12m': {
        serving:
          'Batole jí kedlubnu vařenou i jemně strouhanou syrovou. Syrové hranolky nechávej až na dobu, kdy dítě spolehlivě kouše, kedlubna patří k nejtvrdší běžné zelenině.',
        caution: 'Listy kedlubny jsou jedlé a dají se použít jako špenát.',
      },
    },
    prepIdeas: [
      'hranolky vařené v páře',
      'jemně nastrouhaná do jogurtu',
      'rozmixovaná do polévky',
      'dušená s mrkví',
    ],
    seasonCz: [5, 6, 7, 8, 9],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
  {
    id: 'zeli-bile',
    nameCz: 'zelí bílé',
    altNamesCz: ['bílé zelí', 'hlávkové zelí'],
    category: 'zelenina',
    emoji: '🥬',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Velký list zelí se v ústech svine do pevného svitku a jeho pružná vlákna se dásněmi nepřetrhnou.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Zelí nakrájej nadrobno přes vlákna a dus ho doměkka, listy v celku dítěti nedávej. Dušené zelí s kmínem je tradiční česká příloha, která se dá připravit úplně bez soli.',
        caution: 'Syrové zelí ve velkém množství může způsobit nadýmání.',
      },
      '9m': {
        serving:
          'Dušené zelí promíchej s bramborem nebo s luštěninami. Jemně nakrájené a krátce podušené zelí si zachová víc vitaminu C, který pomáhá vstřebat železo z rostlinných zdrojů.',
        caution: 'Dlouhé pruhy zelí krájej, aby se nemotaly v ústech.',
      },
      '12m': {
        serving:
          'Batole jí dušené zelí, zelnou polévku i zelný salát nakrájený najemno. Kysané zelí je slané, proto ho propláchni a podávej jen v malém množství.',
        caution: 'Kysané zelí z lahve obsahuje hodně soli.',
      },
    },
    prepIdeas: [
      'dušené nadrobno s kmínem',
      'do zelné polévky bez soli',
      'promíchané s bramborem',
      'krátce podušené s mrkví',
    ],
    seasonCz: [6, 7, 8, 9, 10, 11],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_VEGETARIAN, MZCR_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'kapusta-hlavkova',
    nameCz: 'kapusta hlávková',
    altNamesCz: ['hlávková kapusta'],
    category: 'zelenina',
    emoji: '🥬',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Kapustový list má silnou žilnatinu, která zůstává tuhá i po vaření a v ústech se od listu oddělí.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Z kapustového listu vyřízni tvrdý střední žebro a zbytek nakrájej nadrobno. Dus ho doměkka a promíchej s bramborem, samotná kapusta má pro první ochutnávky výraznou chuť.',
        caution: 'Střední žebro nikdy nenechávej v dětské porci.',
      },
      '9m': {
        serving:
          'Dušená kapusta se hodí do polévek i jako příloha promíchaná s obilovinami. Je bohatá na vápník a vitamin K a v zimě patří k nejdostupnější listové zelenině.',
        caution: 'Kapusta výrazně voní při vaření, dítě to může odradit.',
      },
      '12m': {
        serving:
          'Batole jí kapustu v polévce, v plněných závitcích i jako dušenou přílohu. Kapustové listy se dají použít místo těsta na zavinutí náplně z luštěnin a obilovin.',
        caution: 'Závitky krájej na malé kousky, ať se nemotají.',
      },
    },
    prepIdeas: [
      'dušená nadrobno s bramborem',
      'do husté zeleninové polévky',
      'závitky plněné luštěninami',
      'promíchaná s kroupami',
    ],
    seasonCz: [8, 9, 10, 11, 12],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, NHS_VEGETARIAN],
    reviewStatus: 'verified',
  },
  {
    id: 'kapusta-kaderava',
    nameCz: 'kapusta kadeřavá',
    altNamesCz: ['kadeřávek', 'kale'],
    category: 'zelenina',
    emoji: '🥬',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Kadeřávkový list je tuhý a zvlněný, v ústech se slepí do chomáče, který dítě nedokáže rozdělit.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Kadeřávek obeber z tvrdého stonku, nakrájej listy nadrobno a dus je doměkka. Pro první porce ho rozmixuj do bramborového pyré, samotné listy jsou pro tuhle fázi příliš tuhé.',
        caution: 'Stonek kadeřávku je dřevnatý, nikdy ho nepoužívej.',
      },
      '9m': {
        serving:
          'Dušený kadeřávek promíchej s bramborem nebo s luštěninami. Obsahuje hodně vápníku i vitaminu C, který ve stejném jídle zlepší vstřebání rostlinného železa z luštěnin.',
        caution: 'Chipsy z kadeřávku jsou křehké a ostré, nepatří sem.',
      },
      '12m': {
        serving:
          'Batole jí kadeřávek v polévce, v placičkách i dušený s česnekem. Na zahradě vydrží až do mrazů, takže je zdrojem čerstvé zeleniny i v prosinci.',
        caution: 'Syrový kadeřávek v salátu je pro malé dítě moc tuhý.',
      },
    },
    prepIdeas: [
      'dušený a rozmixovaný do pyré',
      'nasekaný do bramborových placiček',
      'do husté luštěninové polévky',
      'krátce podušený s česnekem',
    ],
    seasonCz: [9, 10, 11, 12, 1],
    vegetarian: true,
    sources: [NHS_VEGETARIAN, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
  {
    id: 'ruzickova-kapusta',
    nameCz: 'růžičková kapusta',
    altNamesCz: ['kapustičky', 'brusel'],
    category: 'zelenina',
    emoji: '🥬',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Celá růžička má velikost sousta a její vnější listy drží pohromadě, takže se v ústech nerozpadne.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Růžičky vař doměkka a před podáním je rozřízni na poloviny nebo na čtvrtiny. Celou růžičku dítěti nedávej, i uvařená drží tvar a velikostí odpovídá rizikovému soustu.',
        caution: 'Tvrdé okraje košťálu odřízni, zůstávají pevné.',
      },
      '9m': {
        serving:
          'Rozčtvrcené vařené růžičky dítě nabere prsty a rozmělní dásněmi. Chuť je nahořklá, proto ji zjemni pečením, při kterém se v zelenině rozvinou sladší tóny.',
        caution: 'Převařené růžičky chutnají silně, vař je kratší dobu.',
      },
      '12m': {
        serving:
          'Batole jí růžičkovou kapustu pečenou, dušenou i nakrájenou do salátu. Pečená s kapkou oleje bývá přijímaná mnohem lépe než vařená, i u dospělých.',
        caution: 'Syrové růžičky jsou tvrdé a pro dítě nevhodné.',
      },
    },
    prepIdeas: [
      'vařené a rozčtvrcené růžičky',
      'pečené s olivovým olejem',
      'nasekané do bramborové kaše',
      'dušené s mrkví',
    ],
    seasonCz: [10, 11, 12, 1],
    vegetarian: true,
    sources: [NHS_PREP_SAFELY, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
  {
    id: 'hrasek-zeleny',
    nameCz: 'hrášek zelený',
    altNamesCz: ['zelený hrášek', 'mražený hrášek'],
    category: 'zelenina',
    emoji: '🫛',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Zrnko hrášku má hladkou slupku, která se v ústech oddělí, a jeho velikost odpovídá průsvitu dětských dýchacích cest.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Hrášek uvař doměkka a každé zrnko rozmáčkni vidličkou, dokud slupka nepraskne. Rozmačkaný hrášek smíchej s bramborem, celá zrna v téhle fázi nenabízej.',
        caution: 'Celý hrášek na talíři nenechávej ani jako ozdobu.',
      },
      '9m': {
        serving:
          'I v devíti měsících hrášek mačkej nebo ho podávej ve směsi. Dítě si rozmačkaná zrnka sbírá prsty a trénuje na nich klešťový úchop, který právě v tomhle věku dozrává.',
        caution: 'Mražený hrášek nech úplně rozmrznout a provař ho.',
      },
      '12m': {
        serving:
          'Batole jí hrášek v polévce, v rizotu i rozmačkaný na pomazánku. Celá zrnka nabízej až tehdy, když dítě spolehlivě žvýká a u jídla sedí bez spěchu.',
        caution: 'Sleduj, aby si dítě nenabralo velkou hrst najednou.',
      },
    },
    prepIdeas: [
      'rozmačkaný s bramborem',
      'rozmixovaný na zelenou pomazánku',
      'do husté polévky',
      'promíchaný do rizota',
    ],
    seasonCz: [5, 6, 7],
    vegetarian: true,
    sources: [NHS_PREP_SAFELY, NHS_AVOID],
    reviewStatus: 'verified',
  },
  {
    id: 'fazolky-zelene',
    nameCz: 'fazolky zelené',
    altNamesCz: ['zelené fazolky', 'lusky fazolek'],
    category: 'zelenina',
    emoji: '🫛',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Fazolkový lusk je vláknitý a pružný, takže se ukousnutý kus nerozdělí a jeho vlákna se spojí do chomáče.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Fazolky očisti od konců a vař je doměkka, tvrdší než uvedené na obalu být nesmí. Podávej je vcelku jako dlouhý díl do dlaně nebo je rozmačkej s bramborem do husté hmoty.',
        caution: 'Syrové zelené fazolky se nesmí jíst, obsahují dráždivé látky.',
      },
      '9m': {
        serving:
          'Uvařené fazolky nakrájej na kousky dlouhé jako nehet, ať se nemotají. Dítě je zvládne uchopit prsty, ale vlákna kontroluj, u starších lusků bývají tuhá.',
        caution: 'Velké lusky mají tuhý vláknitý šev, ten odstraň.',
      },
      '12m': {
        serving:
          'Batole jí fazolky vařené, dušené i zapečené. Mražené fazolky mají skoro stejnou výživovou hodnotu jako čerstvé a jsou dostupné celoročně.',
        caution: 'Fazolky vždy dobře provař, nikdy je nepodávej syrové.',
      },
    },
    prepIdeas: [
      'vařené dlouhé lusky do ruky',
      'nakrájené a promíchané s bramborem',
      'dušené s rajčaty',
      'zapečené s vejcem',
    ],
    seasonCz: [7, 8, 9],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, NHS_AVOID],
    reviewStatus: 'verified',
  },
  {
    id: 'kukurice-cukrova',
    nameCz: 'kukuřice cukrová',
    altNamesCz: ['sladká kukuřice', 'kukuřičné klasy'],
    category: 'zelenina',
    emoji: '🌽',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Kukuřičné zrno má pevnou slupku, která se v ústech oddělí od měkkého vnitřku a zůstane celá.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Kukuřici uvař a zrna rozmačkej nebo rozmixuj do pyré, celá zrna v téhle fázi nenabízej. Druhá možnost je podat kus uvařeného klasu, ze kterého dítě zrna olizuje, ale nesbírá je.',
        caution: 'Klas podávej jen pod dohledem a nikdy ne s odlomenými zrny.',
      },
      '9m': {
        serving:
          'Uvařená zrna rozmačkej mezi prsty a promíchej je s bramborem nebo s rýží. Slupka zrna projde trávením beze změny a ve stolici se objeví, což je normální.',
        caution: 'Popcorn do prvního roku ani později malému dítěti nedávej.',
      },
      '12m': {
        serving:
          'Batole jí kukuřici z klasu, v polévce i v placičkách. Konzervovaná kukuřice bývá v nálevu se solí, proto ji propláchni pod tekoucí vodou.',
        caution: 'Kukuřičné zrno je tvrdší, když je studené z konzervy.',
      },
    },
    prepIdeas: [
      'rozmačkaná zrna s bramborem',
      'uvařený klas k olizování',
      'rozmixovaná do polévky',
      'do zeleninových placiček',
    ],
    seasonCz: [7, 8, 9],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'spenat',
    nameCz: 'špenát',
    altNamesCz: ['čerstvý špenát', 'listový špenát'],
    category: 'zelenina',
    emoji: '🥬',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: ['dusicnany'],
    hazardNotes: {
      dusicnany:
        'Špenát patří podle EFSA k zelenině, u které nelze u malých dětí při velké konzumaci vyloučit riziko z dusičnanů. Podávej ho spíš občas než denně, uvařený pokrm zchlaď rychle, nenechávej ho v teple a už ho podruhé neohřívej — rozmixování přeměnu dusičnanů na dusitany urychluje. Dítěti se střevní infekcí špenát podle EFSA nedávej vůbec.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Špenátové listy zbav stonků, krátce je spař a nasekej nadrobno. Vmíchej je do bramborové kaše nebo do ricotty, samotný špenát má výraznou chuť a hůř se nabírá.',
        caution: 'Uvařený špenát nikdy nenechávej stát na lince.',
      },
      '9m': {
        serving:
          'Nasekaný dušený špenát se hodí do placiček, do těstovin i do omelety. Obsahuje železo, které se lépe vstřebá v kombinaci se zeleninou nebo ovocem bohatým na vitamin C.',
        caution: 'Nabízej ho obden, ne jako každodenní složku.',
      },
      '12m': {
        serving:
          'Batole jí špenát v omáčce, v plněných těstovinách i v placičkách. Klasický český špenát se dá připravit bez soli a bez smetany, jen s česnekem a s trochou mléka.',
        caution: 'Mražený špenát v kostkách bývá dochucený, čti složení.',
      },
    },
    prepIdeas: [
      'nasekaný do bramborové kaše',
      'smíchaný s ricottou do těstovin',
      'do zeleninové omelety',
      'krátce podušený s česnekem',
    ],
    seasonCz: [4, 5, 6, 9, 10],
    vegetarian: true,
    sources: [EFSA_NITRATE, NHS_VEGETARIAN],
    reviewStatus: 'verified',
  },
  {
    id: 'mangold',
    nameCz: 'mangold',
    altNamesCz: ['řapíkatý mangold'],
    category: 'zelenina',
    emoji: '🥬',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: ['dusicnany'],
    hazardNotes: {
      dusicnany:
        'Mangold je listová zelenina, kterou docs/BEZPECNOST.md vede mezi zdroji dusičnanů; hodnocení EFSA se týká špenátu a hlávkového salátu, mangold v něm není. Zařazuj ho proto z opatrnosti střídavě s jinou zeleninou, uvařený pokrm rychle zchlaď a znovu ho neohřívej.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'U mangoldu odděl řapíky od listů, řapíky vaří déle. Listy krátce poduš, nasekej je nadrobno a vmíchej do bramborové kaše, řapíky nakrájej a přidej dřív.',
        caution: 'Řapíky jsou vláknité, nakrájej je přes vlákna.',
      },
      '9m': {
        serving:
          'Dušený mangold promíchej s obilovinou nebo s luštěninou. Chuťově je jemnější než špenát a barevné řapíky dělají z jídla něco, co dítě zaujme i vizuálně.',
        caution: 'Podávej ho obden, ne každý den, kvůli dusičnanům.',
      },
      '12m': {
        serving:
          'Batole jí mangold v plněných těstovinách, v polévce i dušený. Na zahradě roste celé léto a průběžným obíráním listů vydrží až do podzimu.',
        caution: 'Starší listy jsou tužší, sklízej je mladé.',
      },
    },
    prepIdeas: [
      'listy podušené a nasekané',
      'řapíky dušené s mrkví',
      'do plněných těstovin',
      'promíchaný s čočkou',
    ],
    seasonCz: [6, 7, 8, 9, 10],
    vegetarian: true,
    sources: [EFSA_NITRATE, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
  {
    id: 'rukola',
    nameCz: 'rukola',
    altNamesCz: ['roketa setá'],
    category: 'zelenina',
    emoji: '🥬',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: ['dusicnany'],
    hazardNotes: {
      dusicnany:
        'Rukolu vede docs/BEZPECNOST.md mezi listovou zeleninou s vyšším obsahem dusičnanů; načtené hodnocení EFSA se týká špenátu a hlávkového salátu, rukolu nehodnotí. Podávej ji proto z opatrnosti jen v malém množství jako ozdobu jídla, a pokud je součástí teplého pokrmu, ten už podruhé neohřívej.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Rukola má ostrou chuť a v tomhle věku se hodí nanejvýš jako pár nasekaných lístků v jídle. Ostrost zjemní tvaroh nebo bramborová kaše, do kterých ji vmícháš.',
        caution: 'Velké množství rukoly pro miminko není vhodné.',
      },
      '9m': {
        serving:
          'Nasekanou rukolu vmíchej do těstovin nebo do pomazánky. Její pepřová chuť rozšiřuje dítěti chuťový rejstřík, ale množství drž opravdu malé kvůli dusičnanům.',
        caution: 'Celé lístky se lepí na patro, vždy je nasekej.',
      },
      '12m': {
        serving:
          'Batole jí rukolu v salátu, na pizze i v pestu. Domácí pesto z rukoly a mletých ořechů je rychlá omáčka k těstovinám pro celou rodinu, jen ho nesol.',
        caution: 'Rukola z květináče chutná jemněji než z pytlíku.',
      },
    },
    prepIdeas: [
      'nasekaná do tvarohové pomazánky',
      'vmíchaná do teplých těstovin',
      'domácí pesto s mletými ořechy',
      'pár lístků na pečenou zeleninu',
    ],
    seasonCz: [4, 5, 6, 9, 10],
    vegetarian: true,
    sources: [EFSA_NITRATE, NHS_YOUNG_CHILDREN],
    reviewStatus: 'verified',
  },
  {
    id: 'hlavkovy-salat',
    nameCz: 'hlávkový salát',
    altNamesCz: ['salát hlávkový', 'ledový salát'],
    category: 'zelenina',
    emoji: '🥬',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Syrový list salátu je tenký a kluzký, v ústech se slepí do vrstvy, kterou dítě nedokáže jazykem rozdělit.',
    hazards: ['dusicnany'],
    hazardNotes: {
      dusicnany:
        'EFSA hodnotila obsah dusičnanů v salátu a u dětí ho nevedla jako zdravotní riziko, přesto platí, že listová zelenina se má střídat a nepodávat denně ve velkém množství. Pokud je salát součástí teplého jídla, to už znovu neohřívej.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Syrový list salátu v tomhle věku nenabízej, kluzká vrstva se špatně zpracovává v ústech. Pokud chceš salát zařadit, nasekej ho nadrobno a vmíchej do bramborové kaše.',
        caution: 'Listy vždy důkladně omyj, bývá na nich hlína i písek.',
      },
      '9m': {
        serving:
          'Nasekaný salát smíchej s jogurtem nebo s tvarohem do husté pomazánky. Samotné listy zatím nenabízej, ale dítě si na chuť zvykne v kombinaci s něčím, co drží pohromadě.',
        caution: 'Kupované mycí salátové směsi rychle hnijí, kupuj hlávku.',
      },
      '12m': {
        serving:
          'Batole jí salát nakrájený na proužky v salátové míse i jako obložení chleba. Naučí se u toho žvýkat listovou zeleninu, což je dovednost, na kterou potřebuje čas.',
        caution: 'Salátové zálivky z obchodu obsahují sůl i sladkou složku.',
      },
    },
    prepIdeas: [
      'nasekaný do bramborové kaše',
      'smíchaný s tvarohem na pomazánku',
      'proužky do salátu po prvním roce',
      'krátce podušený s hráškem',
    ],
    seasonCz: [4, 5, 6, 7, 8, 9],
    vegetarian: true,
    sources: [EFSA_NITRATE, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
  {
    id: 'okurka-salatova',
    nameCz: 'okurka salátová',
    altNamesCz: ['salátová okurka', 'hadovka'],
    category: 'zelenina',
    emoji: '🥒',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Okurková slupka je pevná a kluzká a při ukousnutí se oddělí od vodnaté dužiny jako pružný pásek.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Okurku oloupej a nakrájej na dlouhé hranolky bez vodnatého středu. Studená okurka z lednice uleví dásním při prořezávání zoubků, takže je to vděčná potravina i mimo hlavní jídlo.',
        caution: 'Slupku v téhle fázi vždy odstraň, je pevná a kluzká.',
      },
      '9m': {
        serving:
          'Oloupanou okurku nakrájej na kostky, které dítě nabere prsty. Jemně nastrouhaná okurka smíchaná s jogurtem je osvěžující dip, do kterého se dobře namáčí pečivo.',
        caution: 'Hořká okurka se nesmí jíst, hořkost poznáš ochutnáním.',
      },
      '12m': {
        serving:
          'Batole jí okurku i se slupkou nakrájenou na kostky nebo na proužky. Nakládané okurky nech až na pozdější věk, obsahují hodně soli i octa.',
        caution: 'Kolečka okurky nekrájej, tvar je zbytečně rizikový.',
      },
    },
    prepIdeas: [
      'oloupané hranolky do ruky',
      'nastrouhaná do jogurtového dipu',
      'kostky do zeleninového salátu',
      'studená na uklidnění dásní',
    ],
    seasonCz: [6, 7, 8, 9],
    vegetarian: true,
    sources: [NHS_PREP_SAFELY, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
  {
    id: 'rajce',
    nameCz: 'rajče',
    altNamesCz: ['rajčata', 'cherry rajčata'],
    category: 'zelenina',
    emoji: '🍅',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'high',
    chokingReason:
      'Malé cherry rajče má hladkou pružnou slupku a průměr odpovídající dýchacím cestám, takže je uzavře úplně.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Cherry rajče vždy rozřež podélně na čtvrtky, nikdy ho nepodávej celé. U velkých rajčat sundej slupku po krátkém spaření, vydlab vodnatý střed a dužinu nakrájej na proužky.',
        caution: 'Slupka se v ústech svine do pásku, u malých porcí ji odstraň.',
      },
      '9m': {
        serving:
          'Pravidlo krájet cherry rajčata podélně na čtvrtky platí beze změny. Dužinu velkých rajčat už můžeš podat i se slupkou, pokud je tenká a dítě dobře zpracovává sousta.',
        caution: 'Kyselost rajčat dráždí kůži kolem úst, potři ji tukem.',
      },
      '12m': {
        serving:
          'Batoleti krájej cherry rajčata alespoň na čtvrtiny a velká rajčata na kostky. Celá drobná rajčata zůstávají riziková i po prvním roce, protože se jejich tvar nemění.',
        caution: 'Pravidlo o krájení vysvětli i prarodičům a ve školce.',
      },
    },
    prepIdeas: [
      'čtvrtky v zeleninovém salátu',
      'rozmixovaná na omáčku k těstovinám',
      'pečená s olivovým olejem',
      'dušená s cuketou',
    ],
    seasonCz: [7, 8, 9],
    vegetarian: true,
    sources: [NHS_PREP_SAFELY, NHS_AVOID],
    reviewStatus: 'verified',
  },
  {
    id: 'paprika-sladka',
    nameCz: 'paprika sladká',
    altNamesCz: ['paprika zeleninová', 'papriky'],
    category: 'zelenina',
    emoji: '🫑',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Papriková slupka je pevná a tenká zároveň, při ukousnutí se oddělí v celku a v ústech se svine do útržku.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Papriku upeč, dokud slupka nezčerná, pak ji oloupej a dužinu nakrájej na proužky. Pečená paprika je měkká a sladká a slupka, která je hlavním rizikem, zmizí úplně.',
        caution: 'Syrovou papriku se slupkou v téhle fázi nepodávej.',
      },
      '9m': {
        serving:
          'Pečené proužky bez slupky dítě uchopí prsty. Paprika je jedním z nejlepších zdrojů vitaminu C, který ve stejném jídle výrazně zvýší vstřebání železa z luštěnin.',
        caution: 'Syrové proužky jsou křupavé a zatím nevhodné.',
      },
      '12m': {
        serving:
          'Batole jí papriku pečenou i syrovou nakrájenou na tenké proužky. Pálivé papriky do jídelníčku malého dítěte nepatří, drž se sladkých zeleninových odrůd.',
        caution: 'Zkontroluj, že jde opravdu o sladkou odrůdu.',
      },
    },
    prepIdeas: [
      'pečená a oloupaná na proužky',
      'rozmixovaná do omáčky',
      'dušená s rajčaty',
      'plněná luštěninovou směsí',
    ],
    seasonCz: [7, 8, 9, 10],
    vegetarian: true,
    sources: [NHS_PREP_SAFELY, NHS_VEGETARIAN],
    reviewStatus: 'verified',
  },
  {
    id: 'porek',
    nameCz: 'pórek',
    altNamesCz: ['pór'],
    category: 'zelenina',
    emoji: '🥬',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Pórek je složený z vrstev, které se při ukousnutí od sebe oddělí a vytvoří dlouhé pružné pásky.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Pórek rozkroj podélně, propláchni mezi vrstvami a nakrájej ho nadrobno přes vlákna. Dušený nadrobno se v jídle skoro ztratí a dodá mu jemnou cibulovou chuť bez ostrosti.',
        caution: 'Nikdy nepodávej kolečka pórku, vrstvy se oddělí.',
      },
      '9m': {
        serving:
          'Nadrobno nakrájený a podušený pórek promíchej s bramborem nebo s luštěninami. Základ většiny polévek a omáček se dá postavit právě na něm, a to úplně bez soli.',
        caution: 'Mezi vrstvami zůstává písek, propláchni ho pečlivě.',
      },
      '12m': {
        serving:
          'Batole jí pórek v polévce, v zapečené zelenině i jako základ omáčky. Zelená část je tužší než bílá, hodí se spíš do vývaru, který se nakonec přecedí.',
        caution: 'Dlouhé pruhy pórku vždy nakrájej nakrátko.',
      },
    },
    prepIdeas: [
      'nadrobno dušený jako základ omáčky',
      'do bramborové polévky',
      'zapečený s bešamelem bez soli',
      'promíchaný s čočkou',
    ],
    seasonCz: [9, 10, 11, 12, 1],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, MZCR_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'cibule',
    nameCz: 'cibule',
    altNamesCz: ['cibule žlutá', 'cibule kuchyňská'],
    category: 'zelenina',
    emoji: '🧅',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Cibuli nakrájej nadrobno a dus ji na tuku doměkka, dokud není skoro průsvitná. Dušením ztratí ostrost a zesládne, takže tvoří chuťový základ jídla, které se pak obejde bez soli.',
        caution: 'Syrovou cibuli dítěti nedávej, dráždí sliznici.',
      },
      '9m': {
        serving:
          'Podušená cibule se dá vmíchat do každé omáčky, polévky i luštěninového pokrmu. Pokud dítě kousky cibule vybírá, rozmixuj ji do hladka a chuť v jídle přesto zůstane.',
        caution: 'Spálená cibule chutná hořce, dus ji pomalu.',
      },
      '12m': {
        serving:
          'Batole jí cibuli ve všech vařených jídlech a postupně přijme i kousky. Karamelizovaná cibule je přirozeně sladká a dobře doplňuje luštěniny i pečenou zeleninu.',
        caution: 'Cibulové kroužky ze smažené strouhanky jsou tučné a slané.',
      },
    },
    prepIdeas: [
      'nadrobno dušená jako základ',
      'karamelizovaná k luštěninám',
      'rozmixovaná do omáčky',
      'pečená s kořenovou zeleninou',
    ],
    seasonCz: [8, 9, 10, 11],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, MZCR_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'cesnek',
    nameCz: 'česnek',
    altNamesCz: ['stroužky česneku'],
    category: 'zelenina',
    emoji: '🧄',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Česnek přidávej jen v malém množství a vždy tepelně upravený, syrový je pro dítě příliš ostrý. Jeden prolisovaný stroužek do celého hrnce dodá chuť, která nahradí sůl.',
        caution: 'Česnek jako domácí lék pro kojence nepoužívej.',
      },
      '9m': {
        serving:
          'Pečený česnek zesládne a dá se rozetřít na chleba jako pomazánka. Do dušené zeleniny ho přidávej na konci, aby se nespálil a nezhořkl.',
        caution: 'Spálený česnek je hořký a jídlo znehodnotí.',
      },
      '12m': {
        serving:
          'Batole jí česnek v omáčkách, v pomazánkách i v pečené zelenině. Množství postupně zvyšuj podle toho, jak dítě výraznější chutě přijímá, některé je vyhledávají.',
        caution: 'Syrový česnek v pomazánce je ostrý, dávkuj ho opatrně.',
      },
    },
    prepIdeas: [
      'prolisovaný do dušené zeleniny',
      'pečený a rozetřený na chleba',
      'do luštěninové omáčky',
      'v bylinkovém dipu',
    ],
    seasonCz: [7, 8, 9],
    vegetarian: true,
    sources: [NHS_AVOID, MZCR_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'fenykl-hliza',
    nameCz: 'fenykl hlíza',
    altNamesCz: ['fenyklová hlíza', 'fenykl zeleninový'],
    category: 'zelenina',
    emoji: '🥬',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Fenyklová hlíza je složená z pevných vrstev s podélnými vlákny, která se v ústech oddělí a drží pohromadě.',
    hazards: ['dusicnany'],
    hazardNotes: {
      dusicnany:
        'Fenyklovou hlízu vede docs/BEZPECNOST.md mezi zeleninou s dusičnany; načtené stanovisko EFSA ale hodnotí listovou zeleninu a fenykl v něm není, stejně jako není mezi komoditami s limitem v předpisech EU. Opatření je proto preventivní, ne odvozené z měření: nabízej fenykl střídavě s jinou zeleninou, uvařený pokrm rychle zchlaď, nenechávej ho stát v teple a podruhé už ho neohřívej.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Fenykl rozkroj, vyřízni tvrdý košťál a nakrájej ho přes vlákna na tenké plátky. Dus je doměkka, anýzová chuť se vařením zjemní a dobře se snáší s bramborem i s hruškou.',
        caution: 'Syrový fenykl je vláknitý a pro tuhle fázi nevhodný.',
      },
      '9m': {
        serving:
          'Dušený fenykl nakrájej na kostky nebo ho rozmixuj do polévky. Jeho výrazná vůně je pro dítě nová, proto ho nabídni opakovaně, i když ho napoprvé odmítne.',
        caution: 'Nať fenyklu je jemná a dá se použít jako bylinka.',
      },
      '12m': {
        serving:
          'Batole jí fenykl pečený, dušený i nakrájený nadrobno do salátu. Pečením zesládne a ztratí velkou část anýzového tónu, který dětem někdy vadí.',
        caution: 'Fenyklový čaj je něco jiného než zeleninová hlíza.',
      },
    },
    prepIdeas: [
      'dušený na tenké plátky',
      'pečený s olivovým olejem',
      'rozmixovaný do polévky s bramborem',
      'dušený s hruškou',
    ],
    seasonCz: [9, 10, 11],
    vegetarian: true,
    sources: [BP_NITRATES_VEG, EFSA_NITRATE, EMA_FENNEL, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
  {
    id: 'chrest',
    nameCz: 'chřest',
    altNamesCz: ['chřest zelený', 'chřest bílý'],
    category: 'zelenina',
    emoji: '🌱',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Spodní část chřestového výhonku je dřevnatá a vláknitá, vlákna se v ústech oddělí a spojí do pevného chomáče.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Chřestu odlom dřevnatý konec, bílý chřest navíc oloupej, a vař ho doměkka. Podávej celý měkký výhonek, který dítě drží v pěsti a ukusuje z něj měkkou špičku.',
        caution: 'Tvrdý spodek výhonku vždy odstraň, nedá se rozkousat.',
      },
      '9m': {
        serving:
          'Uvařený chřest nakrájej na kousky velikosti sousta a promíchej s bramborem. Sezona chřestu je krátká, takže ho nabídni na jaře opakovaně, ať si na chuť zvykne.',
        caution: 'Převařený chřest je rozbředlý, vař ho krátce a doměkka.',
      },
      '12m': {
        serving:
          'Batole jí chřest vařený, pečený i zapečený s vejcem. Po chřestu bývá cítit moč, což je neškodné a obvyklé i u dospělých.',
        caution: 'Chřest z lednice rychle dřevnatí, použij ho čerstvý.',
      },
    },
    prepIdeas: [
      'vařené výhonky do ruky',
      'pečený s olivovým olejem',
      'nakrájený do rizota',
      'zapečený s vejcem',
    ],
    seasonCz: [4, 5, 6],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, NHS_7_9M],
    reviewStatus: 'verified',
  },
  {
    id: 'zampiony',
    nameCz: 'žampiony',
    altNamesCz: ['žampion', 'pečárka'],
    category: 'zelenina',
    emoji: '🍄',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Houba je pružná a gumovitá, ukousnutý kus si drží tvar a dásně ho nerozdělí ani po dlouhém žvýkání.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Žampiony nakrájej na velmi tenké plátky a dus je doměkka, dokud nepustí vodu a nezměknou. Pro první porce je nasekej nadrobno a vmíchej do bramborové kaše.',
        caution: 'Syrové žampiony dítěti nikdy nedávej.',
      },
      '9m': {
        serving:
          'Dušené houby nasekej najemno a přidej je do omáčky nebo do rizota. Houby jsou těžší na trávení, proto začni malým množstvím a sleduj, jak je dítě snáší.',
        caution: 'Volně rostoucí houby malému dítěti vůbec nepodávej.',
      },
      '12m': {
        serving:
          'Batole jí žampiony v omáčce, v rizotu i zapečené. Houby dodají bezmasému jídlu chuť, která se podobá masu, což se v téhle domácnosti hodí při jednom vaření pro všechny.',
        caution: 'Kousky hub vždy nakrájej, pružná struktura je riziková.',
      },
    },
    prepIdeas: [
      'nadrobno dušené do bramborové kaše',
      'nasekané do rizota',
      'v houbové omáčce bez soli',
      'zapečené se zeleninou',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_PREP_SAFELY, MZCR_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'hliva-ustricna',
    nameCz: 'hlíva ústřičná',
    altNamesCz: ['hlíva'],
    category: 'zelenina',
    emoji: '🍄',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Hlíva má výrazně vláknitou strukturu a její vlákna se při žvýkání oddělují do dlouhých pružných pásků.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Hlívu nakrájej přes vlákna nadrobno a dus ji doměkka, dokud není úplně měkká. Pro první porce ji rozmixuj do zeleninové kaše, samotná vlákna jsou v téhle fázi problém.',
        caution: 'Tvrdý spodek s pletivem odřízni, nedá se rozkousat.',
      },
      '9m': {
        serving:
          'Nasekaná dušená hlíva se hodí do omáčky, do rizota i do placiček. Pro bezmasou linii je to surovina, která jídlu dodá strukturu podobnou masu bez použití masa.',
        caution: 'Vlákna vždy krájej napříč, ne po délce.',
      },
      '12m': {
        serving:
          'Batole jí hlívu v omáčkách, v zapečených jídlech i v guláši. Klasický bezmasý guláš z hlívy se dá uvařit bez soli a dospělým dochutit až na talíři.',
        caution: 'Doplňky stravy s hlívou dítěti nepodávej.',
      },
    },
    prepIdeas: [
      'nasekaná napříč vlákny a dušená',
      'v bezmasém guláši bez soli',
      'do zeleninových placiček',
      'rozmixovaná do omáčky',
    ],
    seasonCz: [9, 10, 11, 12],
    vegetarian: true,
    sources: [NHS_VEGETARIAN, MZCR_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'redkvicka',
    nameCz: 'ředkvička',
    altNamesCz: ['ředkvičky'],
    category: 'zelenina',
    emoji: '🥗',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'high',
    chokingReason:
      'Ředkvička je tvrdá jako syrová mrkev, ale malá, takže se do dětských úst vejde celá a dásně ji nerozmělní.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Syrovou ředkvičku v tomhle věku nenabízej vůbec. Pokud ji chceš zařadit, uvař ji doměkka v páře a rozmačkej, vařením navíc zmizí většina její ostré chuti.',
        caution: 'Celou ředkvičku nikdy nedávej dítěti do ruky.',
      },
      '9m': {
        serving:
          'Vařenou ředkvičku nakrájej na malé kousky nebo ji jemně nastrouhej do jogurtu. Syrové plátky jsou stále příliš tvrdé a její tvar patří mezi rizikové.',
        caution: 'Strouhej najemno, hrubé kousky zůstávají křupavé.',
      },
      '12m': {
        serving:
          'Batole jí ředkvičku jemně strouhanou v salátu nebo vařenou. Syrové plátky nechávej až na dobu, kdy dítě spolehlivě kouše, ostrá chuť ho navíc často odradí samo.',
        caution: 'Nať ředkvičky je jedlá a hodí se do polévky.',
      },
    },
    prepIdeas: [
      'vařená a rozmačkaná',
      'jemně nastrouhaná do jogurtu',
      'nať do zeleninové polévky',
      'pečená s kořenovou zeleninou',
    ],
    seasonCz: [4, 5, 6, 7, 8, 9],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'turin',
    nameCz: 'tuřín',
    altNamesCz: ['brukev řepka tuřín', 'kvaka'],
    category: 'zelenina',
    emoji: '🥔',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Tuřín má hutnou dužinu, která i po vaření zůstává pevnější než brambor a nerozpadne se pod dásněmi.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Tuřín oloupej silně, slupka je tvrdá, a vař ho déle než brambor. Uvařený ho rozmačkej s bramborem nebo s mrkví, samotné tuřínové pyré má pro první ochutnávky nasládle zemitou chuť.',
        caution: 'Nedovařený tuřín zůstává tvrdý, zkoušej ho vidličkou.',
      },
      '9m': {
        serving:
          'Vařený tuřín nakrájej na kostky nebo ho zapeč s ostatní kořenovou zeleninou. Je to tradiční zimní zelenina, která v obchodě vydrží měsíce a stojí málo.',
        caution: 'Přerostlý tuřín bývá dřevnatý, vybírej menší kusy.',
      },
      '12m': {
        serving:
          'Batole jí tuřín v kaši, v polévce i v pečené zeleninové směsi. Dobře se snáší s bramborem, se kterým vytvoří jemnější pyré než samotný.',
        caution: 'Syrový tuřín je velmi tvrdý a pro dítě nevhodný.',
      },
    },
    prepIdeas: [
      'rozmačkaný s bramborem',
      'pečený s kořenovou zeleninou',
      'do husté zimní polévky',
      'dušený s mrkví',
    ],
    seasonCz: [9, 10, 11, 12, 1, 2],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, MZCR_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'dyne-spagetova',
    nameCz: 'dýně špagetová',
    altNamesCz: ['špagetová dýně'],
    category: 'zelenina',
    emoji: '🎃',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Špagetovou dýni rozkroj, vydlab vnitřek s jádry a upeč ji řezem dolů. Dužina se po upečení rozpadne na vlákna připomínající nudle, která jsou měkká a dají se nabrat lžící.',
        caution: 'Dlouhá vlákna nakrájej, aby se v ústech nemotala.',
      },
      '9m': {
        serving:
          'Vlákna dýně nakrájej na kratší kousky a promíchej je s rajčatovou omáčkou. Dítě se na nich učí manipulovat s podlouhlým jídlem podobně jako na těstovinách.',
        caution: 'Vlákna se kloužou, podávej je v mělké misce.',
      },
      '12m': {
        serving:
          'Batole jí špagetovou dýni místo těstovin s omáčkou i zapečenou. Pro rodinu je to jednoduchý způsob, jak dostat do jídla víc zeleniny bez vyjednávání u stolu.',
        caution: 'Vnitřek s jádry vydlab celý, je vláknitý.',
      },
    },
    prepIdeas: [
      'pečená a rozvolněná na vlákna',
      's rajčatovou omáčkou místo těstovin',
      'zapečená s ricottou',
      'promíchaná s dušenou zeleninou',
    ],
    seasonCz: [9, 10, 11],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, NHS_10_12M],
    reviewStatus: 'verified',
  },
  {
    id: 'artycok',
    nameCz: 'artyčok',
    altNamesCz: ['artyčoky'],
    category: 'zelenina',
    emoji: '🌿',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Vnější listy artyčoku jsou tuhé a špičaté a uvnitř je vláknité seno, které se v hrdle zachytí.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Pro dítě použij jen měkké srdce artyčoku, tedy dno po odstranění listů a vláknitého středu. Uvař ho doměkka a rozmačkej s bramborem nebo s olivovým olejem do husté hmoty.',
        caution: 'Vláknitý střed vždy vyškrábni celý, je nepoživatelný.',
      },
      '9m': {
        serving:
          'Uvařené artyčokové srdce nakrájej na kostky velikosti sousta. Chuť je jemně nahořklá a nezvyklá, takže ji nabízej v kombinaci s bramborem nebo s tvarohem.',
        caution: 'Špičaté listy dítěti nedávej ani k olizování.',
      },
      '12m': {
        serving:
          'Batole jí artyčoková srdce v salátu, v těstovinách i zapečená. Konzervované artyčoky jsou v nálevu se solí a s octem, proto je před podáním dobře propláchni.',
        caution: 'Čerstvý artyčok je v ČR sezonní a dražší než konzervovaný.',
      },
    },
    prepIdeas: [
      'srdce vařené a rozmačkané',
      'kostky do těstovin',
      'zapečené s ricottou',
      'rozmixované na pomazánku',
    ],
    seasonCz: [5, 6, 7],
    vegetarian: true,
    sources: [NHS_PREP_SAFELY, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
];
