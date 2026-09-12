import type { Ingredient } from '@/types';
import {
  EMA_FENNEL,
  MZCR_COMPLEMENTARY,
  NHS_10_12M,
  NHS_6M,
  NHS_AVOID,
  NHS_AVOID_WEANING,
  NHS_DRINKS,
  NHS_YOUNG_CHILDREN,
  WHO_COMPLEMENTARY,
} from './_sources';

/**
 * Kategorie „ostatni" podle docs/SUROVINY-SEZNAM.md (10 položek).
 *
 * Dětský čaj a kakao jsou vedené jako needs-review — u fenyklu i u
 * theobrominu se nepodařilo v této session načíst tier 1 zdroj s konkrétním
 * limitem pro kojence, a docs/BEZPECNOST.md výslovně zakazuje doplňovat
 * taková doporučení z paměti.
 */
export const other: Ingredient[] = [
  {
    id: 'voda',
    nameCz: 'voda',
    altNamesCz: ['pitná voda', 'kohoutková voda'],
    category: 'ostatni',
    emoji: '💧',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Od začátku příkrmu nabízej k jídlu doušky vody z otevřeného hrnku bez ventilu. Dítě se u něj učí srkat místo sání a voda po šestém měsíci nemusí být převařená.',
        caution: 'Voda nesmí nahradit mléčnou stravu, nabízej ji jen k jídlu.',
      },
      '9m': {
        serving:
          'Hrnek s vodou dávej ke každému jídlu na dosah, dcera se ho naučí zvedat sama. Rozlévání je součást učení, prostři proto pod židli utěrku a neřeš to.',
        caution: 'Slazené nápoje ani šťávy z ovoce do jídelníčku nepatří.',
      },
      '12m': {
        serving:
          'Batole pije vodu během celého dne a jako hlavní nápoj vedle mléka. Hrnek s ventilem, ze kterého se saje, už v tomhle věku nahraď obyčejným otevřeným hrnkem nebo brčkem.',
        caution: 'V horku a při nemoci nabízej vodu častěji.',
      },
    },
    prepIdeas: [
      'v otevřeném hrnku ke každému jídlu',
      'jako jediný nápoj mimo mléko',
      'na rozředění hustého pyré',
      'na vaření obilovin a luštěnin',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_DRINKS, WHO_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'detsky-caj-bez-cukru',
    nameCz: 'dětský čaj bez cukru',
    altNamesCz: ['nesl. dětský čaj', 'bylinný čaj pro děti'],
    category: 'ostatni',
    emoji: '🍵',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Voda je pro dceru v tomhle věku jediný potřebný nápoj a čaj ji nenahrazuje. Pokud čaj přesto podáváš, zkontroluj složení: u fenyklových přípravků platí evropské omezení pro malé děti.',
        caution: 'Složení dětských čajů se liší značku od značky, čti etiketu.',
      },
      '9m': {
        serving:
          'Nabízej nanejvýš slabý neslazený nálev z bylin, které máš odsouhlasené od pediatričky. Množství drž malé, aby čaj nevytlačil mléko ani vodu, které dcera opravdu potřebuje.',
        caution: 'Instantní granulované čaje bývají silně slazené.',
      },
      '12m': {
        serving:
          'Batole může dostat slabý neslazený čaj jako zpestření, hlavním nápojem zůstává voda. Čaj obsahuje látky, které snižují vstřebávání železa, proto ho nepodávej k jídlu.',
        caution: 'Černý a zelený čaj obsahují kofein, ty vynech.',
      },
    },
    prepIdeas: [
      'slabý neslazený nálev po konzultaci s pediatričkou',
      'podávaný vlažný v otevřeném hrnku',
      'mimo hlavní jídla kvůli vstřebávání železa',
      'jako občasné zpestření, ne jako denní nápoj',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [EMA_FENNEL, NHS_DRINKS],
    reviewStatus: 'needs-review',
    reviewNote:
      'EMA vede přípravky ze sladkého fenyklu jako nedoporučené pro děti pod 4 roky bez doporučení pediatra, konkrétní limit pro fenyklové složky v běžných dětských čajích se ale v této session nepodařilo načíst. Složení dětských čajů v ČR se navíc liší značku od značky. Vhodnost konkrétního čaje řeš s pediatričkou.',
  },
  {
    id: 'kokosovy-jogurt',
    nameCz: 'kokosový jogurt',
    altNamesCz: ['rostlinný kokosový jogurt'],
    category: 'ostatni',
    emoji: '🥥',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Kokosový jogurt je kysaný výrobek z kokosového tuku, ne z mléka, takže má málo bílkovin i vápníku. Použij ho jako zpestření nebo při alergii na mléko, ale mléčný jogurt jím nenahrazuj.',
        caution: 'Zkontroluj složení, mnoho variant obsahuje sladkou složku.',
      },
      '9m': {
        serving:
          'Vmíchej kokosový jogurt do ovocného pyré nebo z něj udělej základ dipu. Krémová struktura se dobře nabírá lžící a chuť je jemná, takže ji děti obvykle přijímají snadno.',
        caution: 'Neobohacené rostlinné jogurty mají velmi málo vápníku.',
      },
      '12m': {
        serving:
          'Batole jí kokosový jogurt s ovocem i v omáčkách. Pokud doma řešíte alergii na bílkovinu kravského mléka, výběr konkrétního výrobku a zdroj vápníku proberte s pediatričkou.',
        caution: 'Rostlinné jogurty nejsou náhradou mléka pro malé dítě.',
      },
    },
    prepIdeas: [
      'vmíchaný do ovocného pyré',
      'základ dipu k zelenině',
      'do zeleninového kari',
      'smíchaný s mletými lněnými semínky',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_YOUNG_CHILDREN, NHS_DRINKS],
    reviewStatus: 'verified',
  },
  {
    id: 'kvasnice-drozdi',
    nameCz: 'kvasnice droždí',
    altNamesCz: ['čerstvé droždí', 'sušené droždí'],
    category: 'ostatni',
    emoji: '🍞',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Droždí se nepodává samostatně, používá se k nakynutí těsta, které se potom upeče. Domácí kynuté pečivo bez soli je pro dceru lepší volbou než rohlík z pekárny.',
        caution: 'Syrové kynuté těsto dceři nedávej, kvasinky v něm dál pracují.',
      },
      '9m': {
        serving:
          'Z droždí, mouky a vody upeč měkké housky bez soli, které dcera uchopí do ruky. Domácí pečivo vydrží měkké jen den, proto ho peč v menším množství a zbytek zamraz.',
        caution: 'Čerstvé droždí vydrží v lednici jen pár dní.',
      },
      '12m': {
        serving:
          'Batole jí kynuté domácí pečivo, buchty i pizzu. Kynuté těsto se dá připravit večer a nechat vyzrát v lednici, ráno pak stačí jen upéct a snídaně je hotová.',
        caution: 'Kupované kynuté pečivo obsahuje výrazně víc soli.',
      },
    },
    prepIdeas: [
      'domácí housky bez soli',
      'kynuté těsto na pizzu',
      'kynuté lívance',
      'těsto vyzrálé přes noc v lednici',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_6M],
    reviewStatus: 'verified',
  },
  {
    id: 'prasek-do-peceni',
    nameCz: 'prášek do pečiva',
    altNamesCz: ['kypřicí prášek'],
    category: 'ostatni',
    emoji: '🧂',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: ['sul'],
    hazardNotes: {
      sul: 'Prášek do pečiva je založený na sodných solích, které se do denního příjmu sodíku započítávají. V receptech pro miminko proto používej jen množství uvedené v receptu, nikdy ne víc pro lepší nakynutí.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Prášek do pečiva se používá jen jako složka těsta, nikdy samostatně. Do dětských placek a muffinů stačí půl lžičky na porci mouky, větší množství zanechá v pečivu mýdlovou pachuť.',
        caution: 'Odměřuj ho přesně, na oko se snadno předávkuje.',
      },
      '9m': {
        serving:
          'Díky prášku do pečiva nakynou placky i bez droždí a jsou hotové za pár minut. Pro rychlou svačinu je to praktické, jen množství drž při dolní hranici receptu.',
        caution: 'Prášek s obsahem fosfátů kupuj jen podle složení na obalu.',
      },
      '12m': {
        serving:
          'Batole jí muffiny, bublaniny i lívance kypřené práškem do pečiva. Domácí pečení má tu výhodu, že máš pod kontrolou jak množství kypřidla, tak sladké složky.',
        caution: 'Prášek do pečiva a jedlá soda nejsou zaměnitelné.',
      },
    },
    prepIdeas: [
      'do těsta na celozrnné muffiny',
      'do rychlých placek bez droždí',
      'do ovocné bublaniny',
      'do lívanců s ovocným pyré',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_YOUNG_CHILDREN],
    reviewStatus: 'verified',
  },
  {
    id: 'jedla-soda',
    nameCz: 'jedlá soda',
    altNamesCz: ['soda bikarbona', 'hydrogenuhličitan sodný'],
    category: 'ostatni',
    emoji: '🧂',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: ['sul'],
    hazardNotes: {
      sul: 'Jedlá soda je sodná sůl a její sodík se do denního příjmu započítává stejně jako sodík z kuchyňské soli. V dětském pečení proto zůstaň u čtvrt lžičky na dávku těsta a nepoužívej ji jinak než jako kypřidlo.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Jedlá soda funguje jako kypřidlo jen ve spojení s kyselou složkou, třeba s jogurtem nebo s citronovou šťávou. Do dětských placek použij čtvrt lžičky, víc není potřeba a pečivo by zhořklo.',
        caution: 'Jedlou sodu nikdy nepodávej rozpuštěnou ve vodě jako lék.',
      },
      '9m': {
        serving:
          'Ve spojení s kefírem nebo s jogurtem soda nadzvedne lívance i placky. Chuťově je neutrální jen tehdy, když se zcela zneutralizuje kyselinou v těstě, jinak zůstane nepříjemná pachuť.',
        caution: 'Na trávicí potíže u dítěte sodu nikdy nepoužívej.',
      },
      '12m': {
        serving:
          'Batole jí pečivo kypřené sodou stejně jako zbytek rodiny. Mimo kuchyni slouží soda na úklid a čištění, ale v takové podobě ji drž mimo dosah dítěte.',
        caution: 'Uskladni sodu odděleně od kuchyňských surovin na dosah dítěte.',
      },
    },
    prepIdeas: [
      'čtvrt lžičky do kefírových lívanců',
      'do celozrnných placek s jogurtem',
      'do ovocné buchty s citronovou šťávou',
      'do těsta na rychlý chléb',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, MZCR_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'kakao-100',
    nameCz: 'kakao 100%',
    altNamesCz: ['čistý kakaový prášek', 'holandské kakao'],
    category: 'ostatni',
    emoji: '🍫',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 12,
    prep: {
      '6m': {
        serving:
          'V šesti měsících kakao do jídelníčku nezařazuj. Obsahuje theobromin, tedy povzbuzující látku příbuznou kofeinu, a v kombinaci s obvyklým doslazováním se pro miminko nehodí.',
        caution: 'Kakaové sušenky a nápoje z obchodu jsou silně slazené.',
      },
      '9m': {
        serving:
          'Ani v devíti měsících se kakao nedoporučuje. Pokud chceš podobnou tmavou chuť do kaše, použij karob, který povzbuzující látky neobsahuje a je přirozeně sladký.',
        caution: 'Čokoládové pomazánky nejsou pro dítě do roka vhodné.',
      },
      '12m': {
        serving:
          'Po prvním roce může batole občas dostat malé množství čistého kakaa v jídle. Kakaové nápoje z obchodu jsou z větší části sladká složka, proto si kakao míchej sama do mléka.',
        caution: 'Kakao podávej dopoledne, theobromin může narušit usínání.',
      },
    },
    prepIdeas: [
      'lžička do mléčné kaše po prvním roce',
      'do celozrnného pečení',
      'smíchané s banánovým pyré',
      'do domácí pomazánky z mletých ořechů',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_AVOID_WEANING],
    reviewStatus: 'needs-review',
    reviewNote:
      'Konkrétní doporučený věk pro zavedení kakaa ani limit theobrominu u kojenců se v této session nepodařilo dohledat v načtitelném tier 1 zdroji. Hodnota minAgeMonths 12 je proto opatrný odhad odvozený od pravidla o přidaném cukru, ne ověřené doporučení. Termín zavedení prober s pediatričkou.',
  },
  {
    id: 'karob',
    nameCz: 'karob',
    altNamesCz: ['svatojánský chléb', 'karobový prášek'],
    category: 'ostatni',
    emoji: '🫘',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Karob je mletý lusk svatojánského chleba a chutná podobně jako kakao, jen jemněji. Lžičku vmíchej do kaše nebo do ovocného pyré, žádná další sladká složka už není potřeba.',
        caution: 'Karob je přirozeně sladký, nepřidávej k němu nic dalšího.',
      },
      '9m': {
        serving:
          'Karobový prášek se hodí do ovesné kaše, do jogurtu i do domácího pečení. Barví jídlo dohněda, takže vypadá jako čokoládové, ale neobsahuje žádný přidaný cukr.',
        caution: 'Karobové tyčinky z obchodu bývají doslazované.',
      },
      '12m': {
        serving:
          'Batole jí karob v kaši, v pudinku i v pečení. V rodině, která zatím drží jídelníček bez kakaa, je karob nejjednodušší cestou k čokoládové chuti bez povzbuzujících látek.',
        caution: 'Karob rychle nasává vlhkost, skladuj ho v uzavřené nádobě.',
      },
    },
    prepIdeas: [
      'lžička do ovesné kaše',
      'vmíchaný do bílého jogurtu',
      'do celozrnného pečení',
      'smíchaný s banánovým pyré',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_10_12M],
    reviewStatus: 'needs-review',
    reviewNote:
      'Tvrzení, že karob neobsahuje theobromin ani kofein, se v této session nepodařilo doložit načteným tier 1 zdrojem. Položka je proto vedená k revizi; informace o přidaném cukru vychází z NHS, samotné srovnání karobu s kakaem ověř před tím, než ho budeš brát jako jistotu.',
  },
  {
    id: 'ocet-jablecny',
    nameCz: 'ocet jablečný',
    altNamesCz: ['jablečný ocet'],
    category: 'ostatni',
    emoji: '🍎',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Jablečný ocet používej jen jako kuchyňskou kyselou složku, tedy pár kapek do hotového jídla nebo do těsta. Samotný ocet ani ocet ve vodě dceři nikdy nedávej, dráždí sliznici.',
        caution: 'Ocet jako domácí lék pro kojence nepoužívej vůbec.',
      },
      '9m': {
        serving:
          'Kapka octa rozjasní chuť dušené zeleniny i luštěnin a v těstě reaguje s jedlou sodou. Kyselá složka v jídle zároveň zlepšuje využitelnost rostlinného železa ze stejného pokrmu.',
        caution: 'Nezaměňuj jablečný ocet za kvasný lihový, chuť je ostřejší.',
      },
      '12m': {
        serving:
          'Batole jí jídla s octem v zálivce, v luštěninách i v pečení. Používej ho v množství, které chuť jen podtrhne, ne aby jídlo bylo kyselé na první ochutnání.',
        caution: 'Po kyselém jídle nech odstup, než dceři vyčistíš zoubky.',
      },
    },
    prepIdeas: [
      'kapka do luštěninové omáčky',
      'do těsta s jedlou sodou',
      'do zálivky na zeleninový salát',
      'k dušené kořenové zelenině',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_YOUNG_CHILDREN, NHS_AVOID],
    reviewStatus: 'verified',
  },
  {
    id: 'skrob-kukuricny',
    nameCz: 'škrob kukuřičný',
    altNamesCz: ['kukuřičný škrob', 'maizena'],
    category: 'ostatni',
    emoji: '🌽',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Kukuřičný škrob slouží k zahuštění omáčky nebo pudinku a neobsahuje lepek. Rozmíchej ho ve studené tekutině a teprve pak vlij do horkého jídla, jinak se v něm udělají hrudky.',
        caution: 'Zahuštěné jídlo drží teplo uvnitř déle, nech ho vychladnout.',
      },
      '9m': {
        serving:
          'Škrobem zahusť ovocné pyré nebo mléko na domácí pudink bez sladidel. Hustší strukturu dcera nabere lžící lépe než řídkou, takže zahuštění pomáhá i při učení jíst samostatně.',
        caution: 'Škrob sám o sobě nemá výživovou hodnotu, nepřeháněj to.',
      },
      '12m': {
        serving:
          'Batole jí pudink i omáčky zahuštěné kukuřičným škrobem. V bezlepkové kuchyni nahradí mouku při zahušťování a v pečení zjemní strukturu těsta.',
        caution: 'Škrob skladuj v suchu, ve vlhku se srazí do hrudek.',
      },
    },
    prepIdeas: [
      'domácí pudink bez sladidel',
      'zahuštění zeleninové omáčky',
      'zahuštění ovocného pyré',
      'do bezlepkového těsta',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_YOUNG_CHILDREN, WHO_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
];
