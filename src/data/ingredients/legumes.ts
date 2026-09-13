import type { Ingredient } from '@/types';
import {
  NHS_IRON,
  BP_COMPLEMENTARY,
  BP_RAW_BEANS,
  MZCR_COMPLEMENTARY,
  NHS_10_12M,
  NHS_6M,
  NHS_7_9M,
  NHS_ALLERGY,
  NHS_AVOID,
  NHS_VEGETARIAN,
  NHS_YOUNG_CHILDREN,
  WHO_COMPLEMENTARY,
} from './_sources';

/**
 * Kategorie „lusteniny" podle docs/SUROVINY-SEZNAM.md (16 položek).
 *
 * Luštěniny jsou pro bezmasou linii hlavním zdrojem bílkovin a železa.
 * Fazole kidney nese hazard `syrove` kvůli nutnosti důkladného provaření,
 * uzené tofu hazard `sul` a minAgeMonths 12.
 *
 * Konkrétní časy namáčení a varu u fazolí a hrachu vycházejí z doporučení
 * FSAI přetištěného na bezpecnostpotravin.cz (`BP_RAW_BEANS`), které bylo
 * načtené 12. 9. 2026: sušené fazole namáčet nejméně 12 hodin, namáčecí
 * vodu slít a vařit nejméně 30 minut prudkým varem.
 */
export const legumes: Ingredient[] = [
  {
    id: 'cocka-cervena-loupana',
    nameCz: 'čočka červená loupaná',
    altNamesCz: ['červená čočka', 'loupaná čočka'],
    category: 'lusteniny',
    servingForm: 'kasovite',
    emoji: '🫘',
    icon: 'cocka-cervena',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Červená čočka je zbavená slupky, vaří se dvacet minut a rozpadne se sama na hustou kaši. Právě proto je ideální první luštěninou, stačí ji rozmíchat s dušenou mrkví do hladké hmoty.',
        caution: 'Čočku před vařením propláchni, v balení bývá prach a kamínky.',
      },
      '9m': {
        serving:
          'Hustou čočkovou kaši zahusť tak, aby se z ní daly tvarovat hromádky nebo placičky. Dítě tak dostane rostlinné bílkoviny i železo, jehož vstřebávání podpoří kousek papriky nebo citron.',
        caution: 'Luštěniny zaváděj postupně, nadýmání se zmírní za pár dní.',
      },
      '12m': {
        serving:
          'Batoleti podávej červenou čočku jako polévku, dhal nebo základ pomazánky. Vaří se rychle a je z ní hotová bezmasá večeře pro celou rodinu za půl hodiny.',
        caution: 'Kupované luštěninové směsi s kořením obsahují sůl.',
      },
    },
    prepIdeas: [
      'rozvařená na hustou kaši s mrkví',
      'placičky se strouhanou cuketou',
      'krémová polévka bez soli',
      'pomazánka s citronovou šťávou',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_VEGETARIAN, WHO_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'cocka-hneda',
    nameCz: 'čočka hnědá',
    altNamesCz: ['hnědá čočka', 'čočka velkozrnná'],
    category: 'lusteniny',
    servingForm: 'drobne',
    emoji: '🫘',
    icon: 'cocka-hneda',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Hnědá čočka si drží slupku, takže po uvaření zůstane celá. Pro tuhle fázi ji vař déle a pak rozmixuj nebo rozmačkej, aby se slupky rozrušily a kaše byla souvislá.',
        caution: 'Nerozmačkaná zrna projdou trávením beze změny.',
      },
      '9m': {
        serving:
          'Uvařená hnědá čočka se dá podávat celá, promíchaná s hustou zeleninovou omáčkou. Dítě ji sbírá prsty a zrnka jsou dost malá na to, aby je zvládla rozmělnit dásněmi.',
        caution: 'Slupky se někdy objeví ve stolici, není to problém.',
      },
      '12m': {
        serving:
          'Batole jí hnědou čočku v salátu, v polévce i jako náhradu mletého masa v rajčatové omáčce. Je levným a vydatným zdrojem bílkovin pro bezmasou část rodinného jídelníčku.',
        caution: 'Namáčení přes noc zkrátí vaření a zmírní nadýmání.',
      },
    },
    prepIdeas: [
      'namočená a dlouho vařená',
      'jako náhrada mletého masa v omáčce',
      'teplý salát s dušenou zeleninou',
      'hustá polévka s kořenovou zeleninou',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_VEGETARIAN, MZCR_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'cocka-beluga',
    nameCz: 'čočka beluga',
    altNamesCz: ['černá čočka', 'beluga'],
    category: 'lusteniny',
    servingForm: 'drobne',
    emoji: '🫘',
    icon: 'cocka-beluga',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Beluga je drobná černá čočka, která po uvaření drží tvar lépe než ostatní druhy. Pro první příkrmy ji proto rozmačkej vidličkou a smíchej s bramborovým nebo s dýňovým pyré.',
        caution: 'Černá barva obarví ostatní složky jídla, na chuť to vliv nemá.',
      },
      '9m': {
        serving:
          'Uvařená beluga se dá podávat celá promíchaná s dušenou zeleninou a s kapkou oleje. Drobná zrna se dobře sbírají prsty a dítě na nich trénuje klešťový úchop.',
        caution: 'Vař ji o něco déle, než uvádí obal, ať je opravdu měkká.',
      },
      '12m': {
        serving:
          'Batole jí belugu v salátu s rajčaty nebo jako přílohu k pečené zelenině. Drží tvar, takže vypadá dobře na talíři a nerozpadne se do kaše jako čočka červená.',
        caution: 'Beluga je dražší než běžná čočka, na kaši ji neplýtvej.',
      },
    },
    prepIdeas: [
      'rozmačkaná do dýňového pyré',
      'salát s rajčaty a petrželkou',
      'promíchaná s dušenou zeleninou',
      'do luštěninové polévky',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_VEGETARIAN, BP_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'cizrna',
    nameCz: 'cizrna',
    altNamesCz: ['garbanzo', 'římský hrách'],
    category: 'lusteniny',
    servingForm: 'drobne',
    emoji: '🫘',
    icon: 'cizrna',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Celé zrno cizrny je pevné i po uvaření a jeho slupka se v ústech odděluje jako tenký váček, který se lepí v hrdle.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Cizrnu namoč přes noc, vař ji nejméně hodinu a pak ji rozmačkej nebo rozmixuj na hladkou hmotu. Celá zrna v téhle fázi nenabízej, jsou příliš pevná a slupka se od nich odděluje.',
        caution: 'Cizrna z konzervy bývá v solném nálevu, propláchni ji.',
      },
      '9m': {
        serving:
          'Měkká cizrna se dá podávat rozpůlená nebo rozmačkaná mezi prsty. Z rozmixované cizrny vytvaruj placičky, které dítě uchopí a které jí dodají bílkoviny i železo.',
        caution: 'Slupky odplavou při proplachování, dají se snadno odstranit.',
      },
      '12m': {
        serving:
          'Batole jí rozmačkanou cizrnu v pomazánce, v placičkách i v zeleninovém kari. Celá zrna nabízej až tehdy, když dítě spolehlivě žvýká, do té doby je vždy rozmáčkni.',
        caution: 'Pražená cizrna je tvrdá a pro malé děti nevhodná.',
      },
    },
    prepIdeas: [
      'rozmixovaná na hummus bez soli',
      'placičky s kmínem a petrželkou',
      'rozmačkaná do zeleninového kari',
      'pečená a rozmačkaná s olivovým olejem',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [BP_RAW_BEANS, NHS_VEGETARIAN, NHS_7_9M],
    reviewStatus: 'verified',
  },
  {
    id: 'fazole-bile',
    nameCz: 'fazole bílé',
    altNamesCz: ['bílé fazole', 'cannellini'],
    category: 'lusteniny',
    servingForm: 'drobne',
    emoji: '🫘',
    icon: 'fazole-bile',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Bílá fazole má hladkou pevnou slupku, která se při stisku oddělí od měkkého vnitřku a zůstane v ústech jako pružná blána.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Namočené bílé fazole vař doměkka a pak je protlač přes sítko, aby slupky zůstaly nahoře. Vzniklé hladké pyré smíchej s dušenou zeleninou nebo s bramborem do husté hmoty.',
        caution: 'Nedovařené fazole jsou tvrdé a špatně stravitelné.',
      },
      '9m': {
        serving:
          'Uvařené fazole rozmačkej vidličkou i se slupkou, pokud je dobře změklá. Bílé fazole jsou výborným zdrojem bílkovin, vlákniny a železa pro bezmasou část jídelníčku.',
        caution: 'Začni malým množstvím, střevo si na luštěniny zvyká.',
      },
      '12m': {
        serving:
          'Batole jí rozmačkané bílé fazole v polévce, v pomazánce i v zapečeném pokrmu. Konzervované fazole propláchni pod tekoucí vodou, zbavíš se tím většiny nálevu.',
        caution: 'Fazole ze sklenice s dochucením obsahují sůl i sladkou složku.',
      },
    },
    prepIdeas: [
      'protlačené na hladké pyré',
      'pomazánka s olivovým olejem',
      'rozmačkané do zeleninové polévky',
      'zapečené s rajčaty',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [BP_RAW_BEANS, NHS_VEGETARIAN, WHO_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'fazole-cervene-kidney',
    nameCz: 'fazole červené kidney',
    altNamesCz: ['kidney fazole', 'červené fazole'],
    category: 'lusteniny',
    servingForm: 'drobne',
    emoji: '🫘',
    icon: 'fazole-kidney',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Kidney fazole je velká a její tuhá slupka se při rozkousnutí sloupne v celku, takže vznikne pružný útržek.',
    hazards: ['syrove'],
    hazardNotes: {
      syrove:
        'Syrové a nedostatečně provařené fazole obsahují lektiny, které způsobují zvracení a průjem. Podle doporučení FSAI namoč sušené fazole nejméně dvanáct hodin, namáčecí vodu slij a v čerstvé vodě je vař prudkým varem nejméně třicet minut. Pomalé vaření při nízké teplotě nestačí; fazole z konzervy jsou už provařené.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Fazole po dvanáctihodinovém namočení a slití vody vař prudkým varem nejméně třicet minut a pak je protlač přes sítko na hladké pyré. Do dětské porce nikdy nedávej fazoli, která nejde rozmáčknout mezi dvěma prsty bez odporu.',
        caution: 'Namáčecí vodu vždy slij, nikdy v ní nevař.',
      },
      '9m': {
        serving:
          'Dobře provařené fazole rozmačkej a promíchej s rajčatovou omáčkou nebo s rýží. Dítě zvládne i hrubší strukturu, slupku ale kontroluj, u kidney fazolí bývá tuhá.',
        caution: 'Konzervované fazole jsou už provařené, stačí je propláchnout.',
      },
      '12m': {
        serving:
          'Batole jí rozmačkané kidney fazole v chilli bez pálivého koření nebo v zapečeném pokrmu. V bezmasé variantě rodinného jídla nahradí mleté maso a dodají stejné množství bílkovin.',
        caution: 'Celé fazole dávej až tehdy, když dítě bezpečně žvýká.',
      },
    },
    prepIdeas: [
      'namočené 12 hodin, vařené 30 minut a protlačené',
      'rozmačkané do rajčatové omáčky',
      'bezmasé chilli bez pálivého koření',
      'zapečené s kukuřicí a paprikou',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [BP_RAW_BEANS, NHS_VEGETARIAN],
    reviewStatus: 'verified',
  },
  {
    id: 'fazole-adzuki',
    nameCz: 'fazole adzuki',
    altNamesCz: ['adzuki', 'fazolky adzuki'],
    category: 'lusteniny',
    servingForm: 'drobne',
    emoji: '🫘',
    icon: 'fazole-adzuki',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Adzuki jsou drobné fazolky s jemnou slupkou, které se po namočení uvaří za čtyřicet minut. Rozvařené je rozmačkej s dýní nebo s batátem, výsledek je jemně nasládlý a hustý.',
        caution: 'I drobné fazolky namoč, zkrátí se tím doba vaření.',
      },
      '9m': {
        serving:
          'Uvařené adzuki podávej rozmačkané nebo celé promíchané s rýží. Jsou lépe stravitelné než velké fazole, takže se hodí jako druhý krok po čočce při zavádění luštěnin.',
        caution: 'Nadýmání sleduj, u každého dítěte je jiné.',
      },
      '12m': {
        serving:
          'Batole jí adzuki v polévce, v placičkách i jako přílohu k zelenině. V japonské kuchyni se z nich dělá sladká pasta, pro dítě ji ale připrav jen z rozmačkaných fazolí a ovoce.',
        caution: 'Kupovaná sladká adzuki pasta obsahuje hodně sladké složky.',
      },
    },
    prepIdeas: [
      'rozmačkané s pečenou dýní',
      'promíchané s rýží',
      'placičky s dušenou zeleninou',
      'do husté zeleninové polévky',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [BP_RAW_BEANS, NHS_VEGETARIAN, WHO_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'fazolky-mungo',
    nameCz: 'fazolky mungo',
    altNamesCz: ['mungo', 'mungo fazole'],
    category: 'lusteniny',
    servingForm: 'drobne',
    emoji: '🫘',
    icon: 'fazolky-mungo',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Mungo se vaří rychle a rozpadá se do měkké kaše, proto patří mezi nejsnáze stravitelné luštěniny. Uvař ho doměkka a rozmixuj s dušenou mrkví nebo s cuketou do hladké hmoty.',
        caution: 'Naklíčené mungo v syrovém stavu dítěti nepodávej.',
      },
      '9m': {
        serving:
          'Uvařené mungo promíchej s rýží nebo s bramborem a dochuť kmínem. Kombinace luštěniny s obilovinou dodá dítěti plnohodnotnou bílkovinu, což je v bezmasé kuchyni zásadní.',
        caution: 'Klíčky vždy tepelně uprav, syrové nesou riziko bakterií.',
      },
      '12m': {
        serving:
          'Batole jí mungo v dhalu, v polévce i jako součást zeleninové směsi. Připravuje se bez namáčení do půl hodiny, takže je to nejrychlejší luštěnina do všedního dne.',
        caution: 'Hotové indické směsi obsahují sůl i pálivé koření.',
      },
    },
    prepIdeas: [
      'rozvařené do hladké kaše',
      'dhal s kmínem a kurkumou',
      'promíchané s rýží',
      'do zeleninové polévky',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_VEGETARIAN, MZCR_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'hrach-zluty-puleny',
    nameCz: 'hrách žlutý půlený',
    altNamesCz: ['půlený hrách', 'žlutý hrách'],
    category: 'lusteniny',
    servingForm: 'drobne',
    emoji: '🫘',
    icon: 'hrach-zluty',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Půlený hrách je zbavený slupky a při vaření se sám rozpadne na hustou kaši. Uvař ho v dostatku vody, rozmíchej s kouskem másla a podávej jako klasickou českou hrachovou kaši bez soli.',
        caution: 'Kaše rychle houstne, před podáním ji rozřeď vodou.',
      },
      '9m': {
        serving:
          'Z hustší hrachové kaše vytvaruj hromádky nebo placičky, které dítě uchopí prsty. Hrách je dobrým zdrojem bílkovin a v české kuchyni má tradiční místo i mimo maso.',
        caution: 'Kaši podávej vlažnou, uvnitř drží teplo dlouho.',
      },
      '12m': {
        serving:
          'Batole jí hrachovou kaši s dušenou cibulí nebo jako přílohu k zelenině. Klasický pokrm se uvaří pro celou rodinu a dospělým se dosolí a okoření až na talíři.',
        caution: 'Smažená cibulka na kaši je pro dítě příliš tučná.',
      },
    },
    prepIdeas: [
      'klasická hrachová kaše bez soli',
      'placičky s dušenou mrkví',
      'krémová polévka s bylinkami',
      'pomazánka s olivovým olejem',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_VEGETARIAN, MZCR_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'hrach-zeleny-suseny',
    nameCz: 'hrách zelený sušený',
    altNamesCz: ['sušený zelený hrách', 'celý zelený hrách'],
    category: 'lusteniny',
    servingForm: 'drobne',
    emoji: '🫘',
    icon: 'hrach-zeleny',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Sušený hrách zůstává i po uvaření celý a jeho pevná slupka se v ústech oddělí, takže vznikne kluzké sousto.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Celý zelený hrách namoč přes noc a vař ho nejméně hodinu, dokud se nerozpadá. Pak ho protlač přes sítko, aby slupky zůstaly nahoře, a hladké pyré smíchej s bramborem.',
        caution: 'Nedovařený hrách je tvrdý a slupka se od něj neoddělí.',
      },
      '9m': {
        serving:
          'Rozvařený hrách rozmačkej vidličkou a promíchej s dušenou zeleninou. Dítě zvládne hrubší strukturu, celá zrna se slupkou ale stále rozmačkávej mezi prsty.',
        caution: 'Slupky ve stolici jsou běžné, není to důvod k obavám.',
      },
      '12m': {
        serving:
          'Batole jí zelený hrách v husté polévce nebo rozmačkaný jako příloha. Výrazná chuť se dobře snáší s mrkví a s petrželkou, které pokrm rozjasní bez dochucení solí.',
        caution: 'Vaření trvá dlouho, počítej s tím při plánování jídla.',
      },
    },
    prepIdeas: [
      'namočený a dlouho vařený',
      'protlačený na hladké pyré',
      'hustá hrachová polévka',
      'rozmačkaný s bramborem',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [BP_RAW_BEANS, NHS_VEGETARIAN, NHS_6M],
    reviewStatus: 'verified',
  },
  {
    id: 'soja-edamame',
    nameCz: 'sója edamame',
    altNamesCz: ['edamame', 'zelená sója'],
    category: 'lusteniny',
    servingForm: 'drobne',
    emoji: '🫛',
    icon: 'soja-edamame',
    allergens: ['soja'],
    isKeyAllergen: true,
    chokingRisk: 'medium',
    chokingReason:
      'Sójové boby edamame jsou pevné a hladké a při stisku vyskočí z lusku celé, takže sklouznou po jazyku bez rozkousání.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Edamame vyloupej z lusku, provař doměkka a každý bob rozmačkej nebo rozpul. Lusk dítěti nedávej vůbec, je vláknitý a nedá se rozžvýkat. Sója patří mezi klíčové alergeny.',
        caution: 'Sóju zaváděj dopoledne a odděleně od dalších nových potravin.',
      },
      '9m': {
        serving:
          'Rozpůlené vařené boby promíchej s rýží nebo s bramborem. Edamame je zdrojem kvalitní rostlinné bílkoviny, což se v domácnosti s vegetariány hodí obzvlášť.',
        caution: 'Celé boby nenabízej, tvar i pružnost jsou rizikové.',
      },
      '12m': {
        serving:
          'Batole jí rozpůlené edamame jako svačinu nebo součást salátu. Vyloupávání z lusku je pro starší dítě zábava, ale dělej to za něj, dokud nemá jistotu v žvýkání.',
        caution: 'Mražené edamame v lusku bývá solené, kupuj neochucené.',
      },
    },
    prepIdeas: [
      'vyloupané, provařené a rozpůlené',
      'rozmačkané do rýže',
      'rozmixované na zelenou pomazánku',
      'promíchané s dušenou zeleninou',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_ALLERGY, NHS_VEGETARIAN],
    reviewStatus: 'verified',
  },
  {
    id: 'tofu-natural',
    nameCz: 'tofu natural',
    altNamesCz: ['tofu přírodní', 'bílé tofu'],
    category: 'lusteniny',
    servingForm: 'kusove',
    emoji: '🧊',
    icon: 'tofu',
    allergens: ['soja'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Tofu osuš, nakrájej na dlouhé hranolky a krátce je opeč, aby povrch nebyl kluzký. Hranolek dítě sevře v pěsti a měkký vnitřek rozmačká dásněmi bez námahy.',
        caution: 'Tofu obsahuje sóju, zaváděj ji jako samostatný alergen.',
      },
      '9m': {
        serving:
          'Nakrájené kostky tofu promíchej s dušenou zeleninou nebo je rozdrob do rajčatové omáčky. Rozdrobené tofu vypadá jako mleté maso a dá se použít úplně stejně.',
        caution: 'Hedvábné tofu je velmi měkké, drží tvar hůř než tuhé.',
      },
      '12m': {
        serving:
          'Batole jí tofu opečené na kostky, v kari nebo rozmixované do krému. V bezmasé verzi rodinného jídla nahradí maso jako plnohodnotný zdroj bílkovin, ne jako pouhá výplň.',
        caution: 'Marinády se sójovou omáčkou jsou pro dítě příliš slané.',
      },
    },
    prepIdeas: [
      'hranolky opečené na pánvi',
      'rozdrobené do rajčatové omáčky',
      'rozmixované na sladký krém s ovocem',
      'zapečené s dušenou zeleninou',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_ALLERGY, NHS_VEGETARIAN],
    reviewStatus: 'verified',
  },
  {
    id: 'tofu-uzene',
    nameCz: 'tofu uzené',
    altNamesCz: ['uzené tofu'],
    category: 'lusteniny',
    servingForm: 'kusove',
    emoji: '🧊',
    icon: 'tofu-uzene',
    allergens: ['soja'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: ['sul'],
    hazardNotes: {
      sul: 'Uzené tofu se před uzením nakládá do solného nálevu, takže má výrazně vyšší obsah soli než tofu natural. Do prvního roku, kdy má být příjem soli velmi nízký, se proto nehodí.',
    },
    minAgeMonths: 12,
    prep: {
      '6m': {
        serving:
          'V šesti měsících uzené tofu nezařazuj. Pokud chceš dítěti nabídnout sóju, použij tofu natural, které má stejné bílkoviny a stejnou strukturu, jen bez solného nálevu.',
        caution: 'Uzené tofu v hotových salátech z obchodu je stejně slané.',
      },
      '9m': {
        serving:
          'Ani v devíti měsících uzené tofu na dětský talíř nepatří. Výraznější chuť, kterou od něj čekáš, dodá i tofu natural opečené s kmínem nebo s uzenou paprikou v malém množství.',
        caution: 'Uzená paprika chuť napodobí, sůl ale nepřidává.',
      },
      '12m': {
        serving:
          'Po prvním roce může batole dostat malý kousek uzeného tofu jako součást jídla. Zůstává to slaná potravina, takže ten den už další slané složky do jídelníčku nepřidávej.',
        caution: 'Kombinaci uzeného tofu se sýrem v jednom jídle vynech.',
      },
    },
    prepIdeas: [
      'nakrájené na kostky do salátu po prvním roce',
      'nastrouhané do těstovin',
      'zapečené se zeleninou',
      'nasekané do rizota',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_ALLERGY],
    reviewStatus: 'verified',
  },
  {
    id: 'tempeh',
    nameCz: 'tempeh',
    altNamesCz: ['fermentovaná sója'],
    category: 'lusteniny',
    servingForm: 'kusove',
    emoji: '🧊',
    icon: 'tempeh',
    allergens: ['soja'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Tempeh je fermentovaná sója slisovaná do bloku, takže je pevnější než tofu. Pro dítě ho nejdřív deset minut poduš v páře, pak nakrájej na tenké proužky a krátce opeč.',
        caution: 'Syrový tempeh má nahořklou chuť, vždy ho tepelně uprav.',
      },
      '9m': {
        serving:
          'Podušený tempeh nastrouhej nebo nadrob do zeleninové omáčky. Fermentace zlepšuje stravitelnost sóji a dodává výraznější chuť, kterou některé děti přijímají lépe než tofu.',
        caution: 'Tempeh je hutný, začni menší porcí.',
      },
      '12m': {
        serving:
          'Batole jí tempeh opečený na proužky nebo nadrobený v omáčce. V bezmasé variantě rodinného pokrmu nahradí maso a dodá výrazně víc bílkovin než samotná zelenina.',
        caution: 'Marinovaný tempeh z obchodu bývá dochucený sójovou omáčkou.',
      },
    },
    prepIdeas: [
      'podušený a opečený na proužky',
      'nadrobený do zeleninové omáčky',
      'nastrouhaný do těstovin',
      'zapečený s rajčaty',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_ALLERGY, NHS_VEGETARIAN],
    reviewStatus: 'verified',
  },
  {
    id: 'mouka-cizrnova',
    nameCz: 'mouka cizrnová',
    altNamesCz: ['cizrnová mouka', 'besan'],
    category: 'lusteniny',
    servingForm: 'neresi',
    emoji: '🌾',
    icon: 'mouka-cizrnova',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Cizrnová mouka je mletá cizrna, takže nese bílkoviny i železo a neobsahuje lepek. Smíchej ji s vodou na řídké těsto a upeč tenkou placku, kterou dítě uchopí do ruky.',
        caution: 'Těsto musí být propečené, syrová cizrnová mouka je nestravitelná.',
      },
      '9m': {
        serving:
          'Z cizrnové mouky upeč placky s nastrouhanou cuketou nebo mrkví. Dodají dítěti rostlinnou bílkovinu a zároveň se dobře drží v ruce, takže se hodí i na svačinu mimo domov.',
        caution: 'Placky peč do sucha, vlhké těsto uvnitř se lepí.',
      },
      '12m': {
        serving:
          'Batoleti připravíš z cizrnové mouky palačinky, obalované kousky zeleniny i zahuštění omáčky. Je to praktická bezlepková náhrada, se kterou uvaříš pro celou rodinu najednou.',
        caution: 'Mouku skladuj v chladu, jinak nasává pachy.',
      },
    },
    prepIdeas: [
      'tenké placky pečené na pánvi',
      'palačinky se strouhanou zeleninou',
      'zahuštění zeleninové omáčky',
      'těstíčko na obalení dušené zeleniny',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_VEGETARIAN, NHS_10_12M],
    reviewStatus: 'verified',
  },
  {
    id: 'hummus-domaci-bez-soli',
    nameCz: 'hummus domácí bez soli',
    altNamesCz: ['domácí cizrnová pomazánka'],
    category: 'lusteniny',
    servingForm: 'kasovite',
    emoji: '🥣',
    icon: 'hummus',
    allergens: ['sezam'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Rozmixuj měkkou cizrnu s olivovým olejem, citronovou šťávou a lžičkou tahini, tedy pasty z mletého sezamu. Hustou hmotu rozetři na prst chleba nebo ji nabídni na lžíci.',
        caution: 'Tahini obsahuje sezam, což je klíčový alergen, zaváděj ho odděleně.',
      },
      '9m': {
        serving:
          'Domácí hummus rozřeď vodou do konzistence hustého jogurtu, aby se dobře olizoval z prstu. Dítě ho zvládne nabrat samo a zároveň se přes něj potká s pastou z mletého sezamu.',
        caution: 'Kupovaný hummus obsahuje sůl, do prvního roku dělej vlastní.',
      },
      '12m': {
        serving:
          'Batole jí hummus na chlebu, se zeleninovými hranolky i jako omáčku k placičkám. Domácí verze bez soli zůstává základem, kupované varianty nech až na pozdější věk.',
        caution: 'Hotový hummus vydrží v lednici tři dny, ne déle.',
      },
    },
    prepIdeas: [
      'rozmixovaná cizrna s tahini a citronem',
      'rozředěný jako dip k zeleninovým hranolkům',
      'rozetřený na prst chleba',
      'smíchaný s pečenou paprikou',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_ALLERGY, NHS_YOUNG_CHILDREN],
    reviewStatus: 'verified',
  },
  {
    id: 'fazole-cerne',
    nameCz: 'fazole černé',
    altNamesCz: ['černé fazole', 'black beans'],
    category: 'lusteniny',
    servingForm: 'drobne',
    emoji: '🫘',
    icon: 'fazole-cerne',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Celá fazole má hladkou slupku a velikost, se kterou si dásně neporadí; rozmačkaná tuhle vlastnost ztrácí.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Sušené fazole namoč přes noc, vodu slij a vař je v čerstvé vodě doměkka. Pro první porce je rozmačkej vidličkou na hrubé pyré a smíchej s rajčatovým základem nebo s rozmačkanou dýní.',
        caution:
          'Syrové ani nedovařené fazole se nepodávají — obsahují látku, která se ničí až dostatečně dlouhým varem v čerstvé vodě.',
      },
      '9m': {
        serving:
          'V devíti měsících nech část fazolí celých a část rozmačkanou, ať se porce drží pohromadě. Černé fazole mají výraznější chuť než bílé a dobře snesou kmín i papriku.',
        caution: 'Celé fazole vždycky rozmáčkni mezi prsty, dokud jsou v porci pro dítě.',
      },
      '12m': {
        serving:
          'Batole jí fazole celé, když jsou uvařené doměkka. Spolu s obilovinou a s vitaminem C v jednom jídle jsou dobrým zdrojem rostlinného železa.',
        caution: 'Z konzervy je propláchni, nálev bývá solený.',
      },
    },
    prepIdeas: [
      'rozmačkané s rajčatovým základem',
      'do zeleninového ragú',
      'pomazánka s avokádem',
      'do polévky s kořenovou zeleninou',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [BP_RAW_BEANS, NHS_VEGETARIAN, NHS_IRON],
    reviewStatus: 'verified',
  },
  {
    id: 'cocka-zelena',
    nameCz: 'čočka zelená',
    altNamesCz: ['zelená čočka', 'čočka na salát'],
    category: 'lusteniny',
    servingForm: 'drobne',
    emoji: '🫘',
    icon: 'cocka-zelena',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Zelená čočka drží po uvaření tvar líp než červená, takže se nerozpadne do kaše sama. Pro první porce ji proto uvař doměkka a rozmačkej vidličkou nebo rozmixuj se zeleninou.',
        caution: 'Nedovařená čočka je tvrdá a dítě ji nerozžvýká; vař ji déle, než uvádí obal.',
      },
      '9m': {
        serving:
          'V devíti měsících nech zrna celá, ale měkká — dítě je sbírá z tácku a trénuje na nich prsty. Kapka citronu v porci zlepší vstřebání železa, které čočka nese.',
        caution: 'Čočku před vařením propláchni a přeber, občas se mezi zrny najde kamínek.',
      },
      '12m': {
        serving:
          'Batole jí čočku v salátu, v polévce i jako přílohu místo rýže. Zelená se hodí tam, kde mají být zrna vidět.',
        caution: 'Luštěniny zaváděj postupně, prudký nárůst vlákniny nadýmá.',
      },
    },
    prepIdeas: [
      'rozmačkaná se zeleninou',
      'do rajčatového ragú místo masa',
      'do polévky s mrkví',
      'vlažný salát s kapkou citronu',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_VEGETARIAN, NHS_IRON, BP_RAW_BEANS],
    reviewStatus: 'verified',
  },
];
