import type { Ingredient } from '@/types';
import {
  EFSA_CAFFEINE,
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
 * Kakao a karob zůstávají needs-review: ani po přímém načtení povolených
 * zdrojů (12. 9. 2026) se nepodařilo doložit limit theobrominu pro kojence
 * ani složení karobu, a docs/BEZPECNOST.md zakazuje doplňovat taková
 * tvrzení z paměti. Dětský čaj už needs-review není — NHS i EMA se k němu
 * vyjadřují dost jasně na to, aby položka mohla říct „nedoporučuje se".
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
          'Vedle mléka je jediný potřebný nápoj voda. NHS uvádí, že dětské a bylinné nápoje bývají slazené, a nedoporučuje je; přípravky ze sladkého fenyklu se podle EMA používají až od čtyř let. Čaj tedy v tomhle věku nezařazuj.',
        caution: 'Složení dětských čajů se liší značku od značky, čti etiketu.',
      },
      '9m': {
        serving:
          'Ani teď čaj nepotřebuje a doporučení NHS zůstává stejné. Pokud ho přesto chceš podat, ať je neslazený a slabý a ať ho předem odsouhlasí pediatrička; drž malé množství, aby nevytlačil mléko ani vodu.',
        caution: 'Instantní granulované čaje bývají silně slazené.',
      },
      '12m': {
        serving:
          'Hlavním nápojem batolete zůstává voda a vedle ní mléko. Dětské a bylinné nápoje NHS nedoporučuje ani v tomhle věku, takže z nich nedělej denní zvyk a ber je nanejvýš jako občasné zpestření.',
        caution: 'Černý a zelený čaj obsahují kofein, ten pro malé děti vhodný není.',
      },
    },
    prepIdeas: [
      'jen výjimečně a jen neslazený, po domluvě s pediatričkou',
      'podávaný vlažný v otevřeném hrnku',
      'nikdy jako náhrada vody nebo mléka',
      'bez fenyklové složky u dítěte do čtyř let',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [EMA_FENNEL, NHS_DRINKS, NHS_AVOID_WEANING],
    reviewStatus: 'verified',
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
          'V šesti měsících kakao do jídelníčku nezařazuj. Kakaové boby patří mezi přirozené zdroje kofeinu, tedy povzbuzující látky, a kakao se navíc skoro vždy podává doslazené.',
        caution: 'Kakaové sušenky a nápoje z obchodu jsou silně slazené.',
      },
      '9m': {
        serving:
          'Ani v devíti měsících se kakao nedoporučuje. Pokud chceš podobnou tmavou chuť do kaše, sáhni po karobu — je přirozeně sladký, takže ho nemusíš doslazovat.',
        caution: 'Čokoládové pomazánky nejsou pro dítě do roka vhodné.',
      },
      '12m': {
        serving:
          'Po prvním roce může batole občas dostat malé množství čistého kakaa v jídle. Kakaové nápoje z obchodu jsou z větší části sladká složka, proto si kakao míchej sama do mléka. U dětí od tří let je právě čokoláda a kakaové nápoje nejčastějším zdrojem kofeinu v jídelníčku.',
        caution: 'Kakao podávej spíš dopoledne, kofein z něj může rušit usínání.',
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
    sources: [NHS_AVOID, NHS_AVOID_WEANING, EFSA_CAFFEINE],
    reviewStatus: 'needs-review',
    reviewNote:
      'Ověřeno přímým načtením všech tří zdrojů 12. 9. 2026. NHS říká, že kofein pro kojence a malé děti vhodný není a že se do láhve nemá přidávat nic včetně čokoládového prášku. Stránka EFSA ke kofeinu doložila, že kakaové boby jsou přirozeným zdrojem kofeinu, že u dětí 3–10 let je čokoláda včetně kakaových nápojů nejčastějším zdrojem kofeinu a že bezpečná úroveň pro děti a dospívající je 3 mg/kg tělesné hmotnosti a den. Nejmladší sledovanou skupinou jsou ale batolata 12–36 měsíců, o kojencích do 12 měsíců tam nic není, a theobromin EFSA na téhle stránce neřeší vůbec. Zůstává tedy nedoložené dvojí: věk zavedení (minAgeMonths 12 je opatrný odhad odvozený od pravidla o přidaném cukru, ne převzaté doporučení) a jakýkoli limit theobrominu pro kojence. Termín zavedení prober s pediatričkou.',
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
          'Batole jí karob v kaši, v pudinku i v pečení. V rodině, která zatím drží jídelníček bez kakaa, je nejjednodušší cestou k čokoládové chuti — a hlavně ho nemusíš doslazovat, což je jediný důvod, který doložit umíme.',
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
      'Tvrzení, že karob neobsahuje theobromin ani kofein, se nepodařilo doložit ani po druhém kole přímého načtení povolených zdrojů 12. 9. 2026. Prohledány byly bezpecnostpotravin.cz, szu.gov.cz a efsa.europa.eu; karob v nich jako zdroj povzbuzujících látek nefiguruje, ale stránka EFSA ke kofeinu jmenuje jen kávu, kakaové boby, čajové listy, guaranu a kolu — z toho, že karob v jejím výčtu není, se nedá udělat tvrzení, že povzbuzující látky neobsahuje. Texty položky proto tvrdí jen to, co doložit umíme: karob se nemusí doslazovat. Srovnání karobu s kakaem co do povzbuzujících látek ověř dřív, než ho budeš brát jako jistotu.',
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
