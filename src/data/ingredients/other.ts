import type { Ingredient } from '@/types';
import {
  BP_CAROB,
  EFSA_CAFFEINE,
  EMA_FENNEL,
  MZCR_COMPLEMENTARY,
  NHS_10_12M,
  NHS_6M,
  NHS_ALLERGY,
  NHS_AVOID,
  NHS_AVOID_WEANING,
  NHS_DRINKS,
  NHS_YOUNG_CHILDREN,
  WHO_COMPLEMENTARY,
  BP_ARSENIC_EFSA,
  NHS_FOOD_ALLERGY,
  BP_BOTULISMUS_BFR,
} from './_sources';

/**
 * Kategorie „ostatni“ podle docs/SUROVINY-SEZNAM.md (10 položek).
 *
 * Kakao a karob zůstávají needs-review: ani po přímém načtení povolených
 * zdrojů (12. 9. 2026) se nepodařilo doložit limit theobrominu pro kojence
 * ani složení karobu, a docs/BEZPECNOST.md zakazuje doplňovat taková
 * tvrzení z paměti. Dětský čaj už needs-review není — NHS i EMA se k němu
 * vyjadřují dost jasně na to, aby položka mohla říct „nedoporučuje se“.
 */
export const other: Ingredient[] = [
  {
    id: 'voda',
    nameCz: 'voda',
    altNamesCz: ['pitná voda', 'kohoutková voda'],
    category: 'ostatni',
    servingForm: 'neresi',
    emoji: '💧',
    icon: 'voda',
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
          'Hrnek s vodou dávej ke každému jídlu na dosah, dítě se ho naučí zvedat samo. Rozlévání je součást učení, prostři proto pod židli utěrku a neřeš to.',
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
    servingForm: 'neresi',
    emoji: '🍵',
    icon: 'detsky-caj',
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
          'Ani teď čaj nepotřebuje a doporučení NHS zůstává stejné. Pokud ho přesto chceš podat, ať je neslazený a slabý a ať ho předem odsouhlasí pediatr; drž malé množství, aby nevytlačil mléko ani vodu.',
        caution: 'Instantní granulované čaje bývají silně slazené.',
      },
      '12m': {
        serving:
          'Hlavním nápojem batolete zůstává voda a vedle ní mléko. Dětské a bylinné nápoje NHS nedoporučuje ani v tomhle věku, takže z nich nedělej denní zvyk a ber je nanejvýš jako občasné zpestření.',
        caution: 'Černý a zelený čaj obsahují kofein, ten pro malé děti vhodný není.',
      },
    },
    prepIdeas: [
      'jen výjimečně a jen neslazený, po domluvě s pediatrem',
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
    servingForm: 'kasovite',
    emoji: '🥥',
    icon: 'kokosovy-jogurt',
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
          'Batole jí kokosový jogurt s ovocem i v omáčkách. Pokud doma řešíte alergii na bílkovinu kravského mléka, výběr konkrétního výrobku a zdroj vápníku prober s pediatrem.',
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
    servingForm: 'neresi',
    emoji: '🍞',
    icon: 'kvasnice-drozdi',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Droždí se nepodává samostatně, používá se k nakynutí těsta, které se potom upeče. Domácí kynuté pečivo bez soli je pro dítě lepší volbou než rohlík z pekárny.',
        caution: 'Syrové kynuté těsto dítěti nedávej, kvasinky v něm dál pracují.',
      },
      '9m': {
        serving:
          'Z droždí, mouky a vody upeč měkké housky bez soli, které dítě uchopí do ruky. Domácí pečivo vydrží měkké jen den, proto ho peč v menším množství a zbytek zamraz.',
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
    servingForm: 'neresi',
    emoji: '🧂',
    icon: 'prasek-do-peciva',
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
    servingForm: 'neresi',
    emoji: '🧂',
    icon: 'jedla-soda',
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
    servingForm: 'neresi',
    emoji: '🍫',
    icon: 'kakao-100',
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
          'Ani v devíti měsících se kakao nedoporučuje. Pokud chceš podobnou tmavou chuť do kaše, sáhni po karobu. Je přirozeně sladký, takže ho nemusíš doslazovat. Že by karob neobsahoval povzbuzující látky, ale doložené není; důvodem k záměně je sladkost, ne kofein.',
        caution: 'Čokoládové pomazánky nejsou pro dítě do roka vhodné.',
      },
      '12m': {
        serving:
          'Po prvním roce může batole občas dostat malé množství čistého kakaa v jídle. NHS ale řadí kofein mezi to, co se nehodí kojencům ani malým dětem, takže kakao zůstává výjimkou, ne každodenní položkou. Kakaové nápoje z obchodu jsou z větší části sladká složka, proto si kakao do mléka míchej doma sám.',
        caution:
        'Kakao podávej spíš dopoledne, kofein z něj může rušit usínání. U dětí od tří let je právě čokoláda a kakaové nápoje nejčastějším zdrojem kofeinu v jídelníčku.',
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
    frequencyLimit: 'jen výjimečně a v malém množství, ne denně',
    sources: [NHS_AVOID, NHS_AVOID_WEANING, EFSA_CAFFEINE],
    reviewStatus: 'verified',
  },
  {
    id: 'karob',
    nameCz: 'karob',
    altNamesCz: ['svatojánský chléb', 'karobový prášek'],
    category: 'ostatni',
    servingForm: 'neresi',
    emoji: '🫘',
    icon: 'karob',
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
          'Karobový prášek se hodí do ovesné kaše, do jogurtu i do domácího pečení. Barví jídlo dohněda, takže vypadá jako čokoládové, ale neobsahuje žádný přidaný cukr. Karobová mouka je navíc bez lepku, takže se hodí i do bezlepkové kuchyně.',
        caution: 'Karobové tyčinky z obchodu bývají doslazované.',
      },
      '12m': {
        serving:
          'Batole jí karob v kaši, v pudinku i v pečení. Je přirozeně sladký, takže se nemusí doslazovat, a mletý lusk je bohatý na vlákninu, pektin a lignin; ze stopových prvků nese i železo.',
        caution:
        'Karob rychle nasává vlhkost, skladuj ho v uzavřené nádobě. Že by byl oproti kakau bez povzbuzujících látek, doložené není: důvodem k záměně je sladkost, ne kofein.',
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
    sources: [BP_CAROB, NHS_AVOID, NHS_10_12M],
    reviewStatus: 'verified',
  },
  {
    id: 'ocet-jablecny',
    nameCz: 'ocet jablečný',
    altNamesCz: ['jablečný ocet'],
    category: 'ostatni',
    servingForm: 'neresi',
    emoji: '🍎',
    icon: 'ocet-jablecny',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Jablečný ocet používej jen jako kuchyňskou kyselou složku, tedy pár kapek do hotového jídla nebo do těsta. Samotný ocet ani ocet ve vodě dítěti nikdy nedávej, dráždí sliznici.',
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
        caution: 'Po kyselém jídle nech odstup, než dítěti vyčistíš zoubky.',
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
    servingForm: 'neresi',
    emoji: '🌽',
    icon: 'skrob-kukuricny',
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
          'Škrobem zahusť ovocné pyré nebo mléko na domácí pudink bez sladidel. Hustší strukturu dítě nabere lžící lépe než řídkou, takže zahuštění pomáhá i při učení jíst samostatně.',
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
  {
    id: 'med',
    nameCz: 'med',
    altNamesCz: ['včelí med', 'medová zálivka'],
    category: 'ostatni',
    servingForm: 'neresi',
    emoji: '🍯',
    icon: 'med',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: ['botulismus'],
    hazardNotes: {
      botulismus:
        'Med občas obsahuje spory bakterie, které ve střevě kojence vytvoří toxin. NHS kvůli tomu med do prvního roku nedoporučuje. Spory jsou podle německého úřadu BfR odolné vůči teplu a zničí je až teploty nad 100 °C, kterých se v domácí kuchyni uvnitř jídla spolehlivě nedosáhne, takže vaření ani pečení riziko neodstraní. Po prvních narozeninách riziko pomine, protože střevo už si se sporami poradí.',
    },
    minAgeMonths: 12,
    prep: {
      '6m': {
        serving:
          'Do prvních narozenin se nepodává vůbec, a to ani vařený nebo zapečený. Občas obsahuje bakterie, které ve střevě kojence vytvářejí toxin. NHS tak popisuje vznik kojeneckého botulismu a označuje ho za velmi vážné onemocnění. Sladit se dá ovocným pyré nebo rozmačkaným banánem.',
        caution:
          'Pozor na hotové výrobky: sušenky, müsli tyčinky a marinády ho mívají v receptuře, i když to na obalu není nápadné.',
      },
      '9m': {
        serving:
          'Ani v devíti měsících se nic nemění. Hranicí je první rok, ne to, co dítě zvládne rozžvýkat. Tepelná úprava riziko neodstraňuje, protože spory v medu přežijí i var a toxin si bakterie vytvoří až ve střevě miminka.',
        caution: 'Domácí i pastovaný, květový i lesní. Před prvními narozeninami platí totéž pro všechny.',
      },
      '12m': {
        serving:
          'Po prvním roce už batole med dostat může. Podle NHS ale zůstává cukrem, takže platí totéž co pro ostatní sladidla: čím míň a čím řidčeji, tím líp pro zuby. Lžička do jogurtu nebo na chleba je jiná věc než oslazené pití.',
        caution: 'Sladká věc na zubech přes noc škodí nejvíc: po medu vyčisti zuby.',
      },
    },
    prepIdeas: [
      'lžička do jogurtu po prvních narozeninách',
      'tenká vrstva na celozrnný chleba',
      'do marinády pro dospělé',
      'do dochucení pečené zeleniny pro dospělé',
    ],
    seasonCz: [],
    vegetarian: true,
    frequencyLimit: 'Do 12 měsíců vůbec; potom jen výjimečně, je to přidaný cukr.',
    sources: [NHS_AVOID, NHS_AVOID_WEANING, BP_BOTULISMUS_BFR],
    reviewStatus: 'verified',
  },
  {
    id: 'sul',
    nameCz: 'sůl',
    altNamesCz: ['kuchyňská sůl', 'mořská sůl', 'himalájská sůl'],
    category: 'ostatni',
    servingForm: 'neresi',
    emoji: '🧂',
    icon: 'sul',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: ['sul'],
    hazardNotes: {
      sul:
        'Ledviny kojence sůl ještě neumějí zpracovat, a proto se do jeho jídla nepřidává vůbec, ani do vody na vaření. Právě kvůli tomu se dětská porce odebírá dřív, než se hrnec dochutí. Po prvním roce zůstává množství co nejnižší.',
    },
    minAgeMonths: 12,
    prep: {
      '6m': {
        serving:
          'Do jídla pro kojence se nepřidává a nedává se ani do vody, ve které se vaří. NHS to zdůvodňuje ledvinami, které na takovou zátěž ještě nestačí. Tohle je právě ten důvod, proč se dětská porce odebírá stranou dřív, než se hrnec dochutí.',
        caution:
          'Bujon v kostce, vývar z pytlíku a hotové omáčky patří do stejné kategorie. NHS je jmenuje přímo, protože jich obsahují hodně.',
      },
      '9m': {
        serving:
          'V devíti měsících platí totéž. Chuť se dá dodat jinak: bylinkami, česnekem, opečenou cibulí, kouskem citronové kůry nebo kmínem. Dítě, které nezná slané, si o něj neřekne.',
        caution:
          'Slané potraviny jako slanina, klobásy a slané krekry NHS vyjmenovává jako to, čemu se u malých dětí vyhnout.',
      },
      '12m': {
        serving:
          'Po prvním roce se drobné množství připustit dá, pořád to ale zůstává nejnižší možné. Většina soli v jídelníčku nepřichází ze slánky, ale z pečiva, sýra a uzenin.',
        caution: 'Slánku nedávej na stůl v dosahu dítěte; dosolit si může každý dospělý sám na talíři.',
      },
    },
    prepIdeas: [
      'do dochucení pro dospělé až po odebrání dětské porce',
      'do vody na těstoviny pro dospělé, ne pro dítě',
      'nahrazení bylinkami v dětské porci',
      'nahrazení česnekem a kmínem v dětské porci',
    ],
    seasonCz: [],
    vegetarian: true,
    frequencyLimit: 'Do 12 měsíců se nepřidává vůbec.',
    sources: [NHS_AVOID, NHS_AVOID_WEANING],
    reviewStatus: 'verified',
  },
  {
    id: 'cukr-krystal',
    nameCz: 'cukr',
    altNamesCz: ['krystalový cukr', 'třtinový cukr', 'moučkový cukr'],
    category: 'ostatni',
    servingForm: 'neresi',
    emoji: '🍬',
    icon: 'cukr',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: ['cukr'],
    hazardNotes: {
      cukr:
        'Přidaný cukr kojenec nepotřebuje a NHS ho spolu se sladkými nápoji spojuje se zubním kazem. Sladkou chuť dodá ovoce samo, takže se v dětské porci nenahrazuje jiným sladidlem, ale vynechává.',
    },
    minAgeMonths: 12,
    prep: {
      '6m': {
        serving:
          'Kojenec ho podle NHS nepotřebuje. Vyhýbání se sladkým svačinám a nápojům pomáhá předcházet zubnímu kazu, a to platí i pro ovocnou šťávu. Sladkou chuť dodá ovoce samo: rozmačkaný banán, dušená hruška, jablečné pyré.',
        caution: 'Sladkost si dítě rychle oblíbí a méně sladké jídlo pak odmítá. Není kam spěchat.',
      },
      '9m': {
        serving:
          'V devíti měsících se nic nemění. Hlídej hotové výrobky. Dětské sušenky, ochucené jogurty a müsli ho mívají v receptuře víc, než se na první pohled zdá.',
        caution: 'Přírodní znějící sladidla (sirupy, koncentráty) jsou z hlediska zubů pořád cukr.',
      },
      '12m': {
        serving:
          'Ani po prvním roce se batole bez přidaného cukru neobejde hůř. Když v pečení použiješ ovocné pyré místo cukru, dortík zůstane sladký a dítě přitom nedostane nic navíc.',
        caution: 'Nejvíc zubům škodí sladké popíjené po troškách během dne, ne jedna porce k jídlu.',
      },
    },
    prepIdeas: [
      'nahrazení rozmačkaným banánem v pečení',
      'nahrazení jablečným pyré v kaši',
      'nahrazení dušenou hruškou v tvarohu',
      'do dochucení moučníku pro dospělé',
    ],
    seasonCz: [],
    vegetarian: true,
    frequencyLimit: 'Do 12 měsíců se nepřidává vůbec.',
    sources: [NHS_AVOID, NHS_AVOID_WEANING],
    reviewStatus: 'verified',
  },
  {
    id: 'javorovy-sirup',
    nameCz: 'javorový sirup',
    altNamesCz: ['maple sirup'],
    category: 'ostatni',
    servingForm: 'neresi',
    emoji: '🍁',
    icon: 'javorovy-sirup',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: ['cukr'],
    hazardNotes: {
      cukr:
        'Pro zuby i pro chuťové návyky se chová jako každý jiný přidaný cukr, ať je z javoru, z řepy nebo z agáve. NHS mezi nimi nerozlišuje a do prvního roku je nedoporučuje žádné.',
    },
    minAgeMonths: 12,
    prep: {
      '6m': {
        serving:
          'Do jídelníčku kojence nepatří. Že je z javoru a ne z řepy, na věci nic nemění. Pro zuby i pro chuťové návyky se chová jako každý jiný přidaný cukr, kterému se podle NHS má dítě vyhýbat.',
        caution: 'Bývá v hotových kaších a müsli směsích označených jako „bez cukru“.',
      },
      '9m': {
        serving:
          'Ani v devíti měsících. Lívanečky a kaše se dají osladit ovocem: banánem v těstě, dušeným jablkem navrch, rozmačkanými borůvkami.',
        caution: 'Sirup navíc teče a dítě ho snadno rozetře po celém obličeji i po sobě.',
      },
      '12m': {
        serving:
          'Po prvním roce ho batole může výjimečně dostat, třeba pár kapek na lívanečky. Pořád ale platí, že čím méně sladkého během dne, tím lépe pro zuby.',
        caution: 'Kupovaná „javorová“ sirupová náhrada bývá jen glukózový sirup s aromatem.',
      },
    },
    prepIdeas: [
      'pár kapek na lívanečky po prvním roce',
      'do dochucení moučníku pro dospělé',
      'nahrazení ovocným pyré v dětské porci',
      'nahrazení dušeným jablkem na kaši',
    ],
    seasonCz: [],
    vegetarian: true,
    frequencyLimit: 'Do 12 měsíců vůbec; potom jen výjimečně.',
    sources: [NHS_AVOID, NHS_AVOID_WEANING],
    reviewStatus: 'verified',
  },
  {
    id: 'bujon-kostka',
    nameCz: 'bujón v kostce',
    altNamesCz: ['vývar z kostky', 'instantní vývar', 'masox'],
    category: 'ostatni',
    servingForm: 'neresi',
    emoji: '🧊',
    icon: 'bujon-kostka',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: ['sul'],
    hazardNotes: {
      sul:
        'Bujón v kostce bývá hodně slaný a NHS ho jmenuje přímo vedle solení jako to, co se při vaření pro kojence nemá používat. Chuť do polévky i rizota dá zelenina nebo domácí vývar bez soli.',
    },
    minAgeMonths: 12,
    prep: {
      '6m': {
        serving:
          'Do dětského jídla nepatří. NHS ho jmenuje přímo vedle solení jako to, co se při vaření pro kojence nemá používat, protože bývá hodně slaný. Polévku i rizoto uvař na vodě nebo na domácím vývaru bez soli. Zelenina, kost nebo kuřecí skelet dají chuť samy.',
        caution: 'Týká se i vývaru v prášku, v pytlíku a hotových „základů“ na omáčky.',
      },
      '9m': {
        serving:
          'V devíti měsících platí totéž. Když vaříš pro celou rodinu, uvař základ bez bujónu, odeber dětskou porci a teprve pak si hrnec dochuť.',
        caution: 'I bujóny označené jako „se sníženým obsahem soli“ jsou pro kojence pořád slané.',
      },
      '12m': {
        serving:
          'Po prvním roce se malé množství v rodinném jídle připustit dá, ale domácí vývar zůstává lepší volbou: víš, co je v něm.',
        caution: 'Porci pro batole radši nalej dřív, než hrnec dochutíš.',
      },
    },
    prepIdeas: [
      'nahrazení domácím vývarem bez soli',
      'nahrazení vodou a kořenovou zeleninou',
      'do dochucení polévky pro dospělé',
      'do dochucení omáčky pro dospělé',
    ],
    seasonCz: [],
    vegetarian: false,
    frequencyLimit: 'Do 12 měsíců se nepoužívá.',
    sources: [NHS_AVOID, NHS_AVOID_WEANING],
    reviewStatus: 'verified',
  },
  {
    id: 'napoj-ryzovy',
    nameCz: 'rýžový nápoj',
    altNamesCz: ['rýžové mléko', 'rice drink'],
    category: 'ostatni',
    servingForm: 'neresi',
    emoji: '🥛',
    icon: 'napoj-ryzovy',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: ['arsen'],
    hazardNotes: {
      arsen:
        'NHS uvádí, že děti do pěti let nemají rýžový nápoj dostávat jako náhradu mateřského mléka, umělé výživy ani kravského mléka, protože může obsahovat příliš mnoho arsenu. Rýže ho ze svého okolí přijímá víc než ostatní obiloviny. Samotnou rýži to podle NHS nevylučuje: omezení se týká nápoje.',
    },
    minAgeMonths: 12,
    prep: {
      '6m': {
        serving:
          'Nepodává se. Jako nápoj je pro kojence mateřské mléko nebo umělá výživa, k jídlu voda. Rýžový nápoj navíc obsahuje málo bílkovin a tuku, takže by ani jinak mléko nenahradil.',
        caution: 'Omezení platí do pěti let, ne jen do prvních narozenin.',
      },
      '9m': {
        serving:
          'Ani v devíti měsících. Pokud hledáš rostlinnou náhradu do vaření, sáhni po ovesném nebo sójovém neslazeném nápoji.',
        caution: 'Stejné omezení má i rýžová smetana a rýžový nápoj v kaších z obchodu.',
      },
      '12m': {
        serving:
          'Ani po prvním roce se nedoporučuje. NHS mluví o dětech do pěti let. Jako mléčná náhrada připadá v úvahu neslazený sójový, ovesný nebo mandlový nápoj obohacený vápníkem.',
        caution: 'Zkontroluj obal: „rýžový nápoj“ bývá složkou i v kombinovaných rostlinných nápojích.',
      },
    },
    prepIdeas: [
      'nahrazení ovesným nápojem ve vaření',
      'nahrazení neslazeným sójovým nápojem',
      'nahrazení kravským mlékem ve vaření od 6 měsíců',
      'nahrazení vodou v kaši',
    ],
    seasonCz: [],
    vegetarian: true,
    frequencyLimit: 'Do pěti let se jako náhrada mléka nepodává.',
    sources: [NHS_DRINKS, NHS_AVOID, BP_ARSENIC_EFSA],
    reviewStatus: 'verified',
  },
  {
    id: 'napoj-ovesny',
    nameCz: 'ovesný nápoj',
    altNamesCz: ['ovesné mléko', 'oat drink'],
    category: 'ostatni',
    servingForm: 'neresi',
    emoji: '🥛',
    icon: 'napoj-ovesny',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 12,
    prep: {
      '6m': {
        serving:
          'Jako nápoj se kojenci nedává. NHS uvádí neslazené rostlinné nápoje obohacené vápníkem. Sójový, ovesný nebo mandlový: až od jednoho roku. Do šesti měsíců je nápojem mateřské mléko nebo umělá výživa, k jídlu voda.',
        caution: 'Ochucené a slazené varianty (vanilkový, čokoládový) jsou sladké nápoje, ne mléko.',
      },
      '9m': {
        serving:
          'Ani v devíti měsících jako nápoj ne. Do vaření se od šesti měsíců hodí spíš kravské mléko, které má víc bílkovin i tuku.',
        caution: 'Ovesný nápoj obsahuje lepek, pokud není z bezlepkového ovsa.',
      },
      '12m': {
        serving:
          'Po prvních narozeninách ho batole může dostat jako součást pestrého jídelníčku. Vyber neslazený a obohacený vápníkem: na obalu bývá jako „vápník“ ve složení. Hodí se do kaše, do pečení i do kakaa.',
        caution: 'Má méně bílkovin i tuku než kravské mléko, takže samo o sobě není rovnocennou náhradou.',
      },
    },
    prepIdeas: [
      'do ovesné kaše po prvním roce',
      'do celozrnného pečení',
      'do zeleninové omáčky místo smetany',
      'do kakaa pro batole',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_DRINKS, NHS_YOUNG_CHILDREN],
    reviewStatus: 'verified',
  },
  {
    id: 'napoj-sojovy',
    nameCz: 'sójový nápoj neslazený',
    altNamesCz: ['sójové mléko', 'soya drink'],
    category: 'ostatni',
    servingForm: 'neresi',
    emoji: '🥛',
    icon: 'napoj-sojovy',
    allergens: ['soja'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 12,
    prep: {
      '6m': {
        serving:
          'Jako nápoj se kojenci nedává. NHS ho spolu s ovesným a mandlovým uvádí až od jednoho roku, a to neslazený a obohacený vápníkem. Sója přitom patří mezi klíčové alergeny, takže se v jídle (tofu, tempeh) zavádí dřív a samostatně.',
        caution: 'Zavádění sóji jako alergenu řeš v jídle, ne nápojem.',
      },
      '9m': {
        serving:
          'Ani v devíti měsících jako nápoj ne. V jídle je sója v pořádku. Tofu rozmačkané do omáčky nebo edamame jsou vhodnější cesta.',
        caution: 'Po prvním podání sóji nech jeden až dva dny odstup, ať poznáš případnou reakci.',
      },
      '12m': {
        serving:
          'Po prvním roce je z rostlinných nápojů nejblíž kravskému mléku: má srovnatelně bílkovin. Vyber neslazený a obohacený vápníkem.',
        caution: 'Nápoje označené „sójový dezert“ nebo „vanilkový“ jsou slazené.',
      },
    },
    prepIdeas: [
      'do kaše po prvním roce',
      'do pečení místo kravského mléka',
      'do bílé omáčky',
      'do smoothie s ovocem',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_DRINKS, NHS_ALLERGY],
    reviewStatus: 'verified',
  },
  {
    id: 'napoj-mandlovy',
    nameCz: 'mandlový nápoj',
    altNamesCz: ['mandlové mléko', 'almond drink'],
    category: 'ostatni',
    servingForm: 'neresi',
    emoji: '🥛',
    icon: 'napoj-mandlovy',
    allergens: ['orechy'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 12,
    prep: {
      '6m': {
        serving:
          'Jako nápoj se kojenci nedává; NHS ho uvádí až od jednoho roku, neslazený a obohacený vápníkem. Ořechy samotné se ale zavádět můžou. Mleté nebo jako hladké máslo vmíchané do jídla.',
        caution: 'Mandlový nápoj neplatí za zavedení ořechů jako alergenu, bývá velmi řídký.',
      },
      '9m': {
        serving:
          'Ani v devíti měsících jako nápoj ne. Mandle v jídelníčku řeš mletou mandlovou moučkou v kaši nebo v pečení.',
        caution: 'Obsah mandlí bývá pod dvě procenta, zbytek je voda.',
      },
      '12m': {
        serving:
          'Po prvním roce ho batole může dostat. Z rostlinných nápojů má nejméně bílkovin, takže se hodí spíš do vaření než jako hlavní denní mléko.',
        caution: 'Pro dítě s alergií na ořechy nepřipadá v úvahu.',
      },
    },
    prepIdeas: [
      'do kaše po prvním roce',
      'do pečení',
      'do ovocného smoothie',
      'do kakaa pro batole',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_DRINKS, NHS_AVOID, NHS_FOOD_ALLERGY],
    reviewStatus: 'verified',
  },
];
