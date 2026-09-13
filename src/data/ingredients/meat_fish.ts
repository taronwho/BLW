import type { Ingredient } from '@/types';
import {
  MZCR_COMPLEMENTARY,
  NHS_6M,
  NHS_7_9M,
  NHS_ALLERGY,
  NHS_AVOID,
  NHS_FISH,
  NHS_PREP_SAFELY,
  NHS_VITAMIN_A,
  NHS_YOUNG_CHILDREN,
  SZU_FIRST_SPOON,
  WHO_COMPLEMENTARY,
} from './_sources';

/**
 * Kategorie „maso-ryby" podle docs/SUROVINY-SEZNAM.md (26 položek).
 *
 * Žádná položka není vegetariánská. Ryby s hazardem `kosti` mají konkrétní
 * pokyn k odstranění kostí, tuňák nese hazard `rtut` a obě játra hazard
 * `vitamin-a`; u všech tří je vyplněný frequencyLimit.
 */
export const meatFish: Ingredient[] = [
  {
    id: 'kureci-prsa',
    nameCz: 'kuřecí prsa',
    altNamesCz: ['kuřecí prsíčka', 'kuřecí řízek'],
    category: 'maso-ryby',
    emoji: '🍗',
    icon: 'kureci-prsa',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Kuřecí prso je libové a při vaření vysychá, takže se v ústech rozpadne na tuhá vlákna, která se spojí do chomáče.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Uvař prso vcelku v páře nebo ve vodě bez soli a nakrájej ho po vláknech na dlouhé proužky velké jako tvůj prst. Proužek pomaž trochou jogurtu nebo olivového oleje, aby nebyl suchý.',
        caution: 'Nikdy nepodávej maso, které při zmáčknutí pruží a nedá se rozvláknit.',
      },
      '9m': {
        serving:
          'Uvařené maso rozeber na jednotlivá vlákna nebo ho nasekej na drobno a promíchej s dušenou zeleninou. Dítě už si sousta bere prsty a učí se je drtit dásněmi.',
        caution: 'Suché maso zvyšuje riziko dávení, vždy ho podávej s omáčkou.',
      },
      '12m': {
        serving:
          'Batole zvládne kuřecí prso nakrájené na kostky velikosti sousta. Maso je dobrým zdrojem dobře vstřebatelného železa, které dítě po půl roce života potřebuje doplňovat z jídla.',
        caution: 'Grilované maso s tvrdou kůrkou nakrájej obzvlášť malé.',
      },
    },
    prepIdeas: [
      'vařené v páře a rozvlákněné',
      'dušené se zeleninou na kousky',
      'nasekané do rizota',
      'pečené v alobalu s kapkou oleje',
    ],
    seasonCz: [],
    vegetarian: false,
    sources: [NHS_6M, WHO_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'kureci-stehno',
    nameCz: 'kuřecí stehno',
    altNamesCz: ['kuřecí stehýnko', 'horní stehno'],
    category: 'maso-ryby',
    emoji: '🍗',
    icon: 'kureci-stehno',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Ve stehně zůstávají chrupavky a drobné úlomky kosti, které se při krájení uvolní a dítě je nedokáže rozmělnit.',
    hazards: ['kosti'],
    hazardNotes: {
      kosti:
        'Stehno vždy nejdřív vykosti: maso obeber prsty od kosti, projeď každý kousek mezi palcem a ukazovákem a nahmatej chrupavky u kloubu i tenkou kůstku podél holenní kosti. Teprve pak maso krájej.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Stehno upeč nebo podus doměkka, sundej kůži a maso obeber od kosti. Tmavé maso je šťavnatější než prso, takže se z něj dají odtrhnout měkké proužky, které dítě udrží v pěsti.',
        caution: 'Kůži nepodávej, je tučná a kluzká a špatně se kouše.',
      },
      '9m': {
        serving:
          'Vykostěné maso nasekej na kousky a promíchej ho s bramborovým pyré. Dítě zvládne i větší sousta, ale každý kousek předtím prohmatej, jestli v něm nezůstala chrupavka.',
        caution: 'Po jídle zkontroluj talíř, úlomky kostí bývají malé.',
      },
      '12m': {
        serving:
          'Batole jí vykostěné stehno nakrájené na kostky a zvládne i křupavější povrch. Stehenní maso obsahuje víc železa i zinku než prsní a děti ho většinou přijímají ochotněji.',
        caution: 'Celé stehno s kostí do ruky nedávej ani teď.',
      },
    },
    prepIdeas: [
      'pečené a vykostěné na proužky',
      'dušené na zelenině',
      'obrané maso do rizota',
      'vařené do zeleninové polévky',
    ],
    seasonCz: [],
    vegetarian: false,
    sources: [NHS_PREP_SAFELY, NHS_6M],
    reviewStatus: 'verified',
  },
  {
    id: 'kruti-prsa',
    nameCz: 'krůtí prsa',
    altNamesCz: ['krůtí prsíčka'],
    category: 'maso-ryby',
    emoji: '🦃',
    icon: 'kruti-prsa',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Krůtí prso má hrubší vlákna než kuřecí a po přepečení se drobí na tvrdé kousky, které kloužou vzad po jazyku.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Krůtí prso vař v páře jen tak dlouho, aby ztratilo růžovou barvu uvnitř, přepečené vysychá. Nakrájej ho po vláknech na prsty a podávej s hustou zeleninovou omáčkou.',
        caution: 'Krůtí maso vysychá rychleji než kuřecí, hlídej čas.',
      },
      '9m': {
        serving:
          'Rozvlákněné krůtí maso smíchej s dýňovým nebo mrkvovým pyré, aby sousta klouzala. Krůta je libová a bohatá na bílkoviny, dobře se kombinuje s tučnějšími přílohami.',
        caution: 'Uzené krůtí výrobky do dětského jídelníčku nepatří.',
      },
      '12m': {
        serving:
          'Batoleti podávej krůtí maso v kostkách nebo v mleté podobě. Pokud mu maso přijde suché, přidej trochu jogurtu nebo dušenou zeleninu se šťávou.',
        caution: 'Kupované krůtí plátky bývají naložené v solném roztoku.',
      },
    },
    prepIdeas: [
      'dušené v páře a rozvlákněné',
      'mleté na malé kuličky',
      'pečené v troubě pod pokličkou',
      'nasekané do zeleninového ragú',
    ],
    seasonCz: [],
    vegetarian: false,
    sources: [NHS_6M, MZCR_COMPLEMENTARY, SZU_FIRST_SPOON],
    reviewStatus: 'verified',
  },
  {
    id: 'kruti-stehno',
    nameCz: 'krůtí stehno',
    altNamesCz: ['krůtí stehýnko'],
    category: 'maso-ryby',
    emoji: '🦃',
    icon: 'kruti-stehno',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Krůtí stehno je protkané tuhými šlachami, které zůstávají pružné i po dlouhém vaření a nedají se dásněmi přetrhnout.',
    hazards: ['kosti'],
    hazardNotes: {
      kosti:
        'Krůtí stehno obsahuje kromě hlavní kosti i tenké tuhé šlachy podobné kůstkám. Maso od kosti obeber, šlachy vytáhni pinzetou nebo vidličkou a každý kousek před podáním prohmatej mezi prsty.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Stehno dus dlouho a doměkka, pak ho vykosti a odstraň všechny šlachy. Zbylé měkké maso rozeber na vlákna a promíchej ho se šťávou z dušení, ať sousto není vysušené.',
        caution: 'Krátce upečené krůtí stehno zůstává tuhé, potřebuje dlouhý čas.',
      },
      '9m': {
        serving:
          'Obrané maso nasekej najemno a smíchej s bramborem nebo s kuskusem. Tmavé krůtí maso má víc železa než prsa, takže se hodí právě v období, kdy zásoby železa u dítěte klesají.',
        caution: 'Kontroluj každé sousto, šlachy se v mase snadno přehlédnou.',
      },
      '12m': {
        serving:
          'Batole jí obrané krůtí stehno v kostkách jako součást oběda. Z výpeku bez soli se dá udělat omáčka, která soustům pomůže klouzat a zároveň chutná celé rodině.',
        caution: 'Kost z talíře odklízej hned, batole si ji dá do pusy.',
      },
    },
    prepIdeas: [
      'dlouho dušené a obrané od kosti',
      'nasekané do bramborové kaše',
      'pomalu pečené pod pokličkou',
      'obrané maso do polévky',
    ],
    seasonCz: [],
    vegetarian: false,
    sources: [NHS_PREP_SAFELY, WHO_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'hovezi-zadni',
    nameCz: 'hovězí zadní',
    altNamesCz: ['zadní hovězí', 'hovězí kýta'],
    category: 'maso-ryby',
    emoji: '🥩',
    icon: 'hovezi-zadni',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Hovězí svalovina je hustá a pevná, takže kousek masa drží tvar i po dlouhém žvýkání dásněmi a nerozpadne se.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Hovězí zadní dus nejméně dvě hodiny, dokud se nedá rozebrat vidličkou. Rozvlákněné maso podávej v dlouhých proužcích nebo ho rozmixuj se zeleninou do hladkého pyré.',
        caution: 'Krátce tepelně upravené hovězí je pro tuhle fázi příliš pevné.',
      },
      '9m': {
        serving:
          'Dlouho dušené maso rozeber na vlákna a promíchej s dušenou mrkví a s trochou výpeku. Hovězí patří k nejlepším zdrojům železa, které se z masa vstřebává lépe než z rostlin.',
        caution: 'Tuhé okraje a blány odřízni, dítě je nepřekousne.',
      },
      '12m': {
        serving:
          'Batole jí dušené hovězí nakrájené na malé kostky nebo rozvlákněné v omáčce. Steak ani jinak krátce tepelně upravené maso mu zatím nedávej, potřebuje měkkou strukturu.',
        caution: 'Maso musí být propečené skrz, nikdy ne růžové uvnitř.',
      },
    },
    prepIdeas: [
      'dlouho dušené a rozvlákněné',
      'rozmixované se zeleninou',
      'pomalu pečené v alobalu',
      'do husté zeleninové polévky',
    ],
    seasonCz: [],
    vegetarian: false,
    sources: [NHS_6M, WHO_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'hovezi-mlete',
    nameCz: 'hovězí mleté',
    altNamesCz: ['mleté hovězí', 'hovězí mleté maso'],
    category: 'maso-ryby',
    emoji: '🥩',
    icon: 'hovezi-mlete',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Mleté maso se při stisku spojí do hutné kuličky, která se v ústech nerozpadne a projde hrdlem vcelku.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Mleté maso rozdrob při smažení na co nejmenší kousky a promíchej ho s rajčatovou nebo zeleninovou omáčkou. Tvarovat z něj kuličky do ruky v téhle fázi ještě nezkoušej.',
        caution: 'Maso musí být propečené skrz, syrové mleté maso nikdy nepodávej.',
      },
      '9m': {
        serving:
          'Z mletého masa můžeš udělat placičky, které dítě uchopí a ukusuje z nich. Placička musí být vláčná, proto do ní přidej strouhanou cuketu nebo mrkev, jinak se rozpadne na drobky.',
        caution: 'Kulaté masové kuličky nedělej, tvar je rizikový.',
      },
      '12m': {
        serving:
          'Batole jí mleté maso v omáčce k těstovinám i ve formě placiček. Domácí mletá směs je jistější než kupovaná, víš přesně, co v ní je a kolik v ní zůstalo tuku.',
        caution: 'Mleté maso zpracuj do 24 hodin, rychle se kazí.',
      },
    },
    prepIdeas: [
      'rozdrobené do rajčatové omáčky',
      'placičky se strouhanou cuketou',
      'zapečené s bramborem',
      'do plněné papriky pro celou rodinu',
    ],
    seasonCz: [],
    vegetarian: false,
    sources: [NHS_6M, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'teleci',
    nameCz: 'telecí',
    altNamesCz: ['telecí maso', 'telecí plec'],
    category: 'maso-ryby',
    emoji: '🥩',
    icon: 'teleci',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Telecí maso je jemné, ale při rychlé úpravě zůstává pružné a ukousnutý kus se dásněmi nedá rozdělit.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Telecí dus v malém množství vody doměkka, trvá to kratší dobu než u hovězího. Měkké maso rozeber na vlákna a podávej ho s hustou omáčkou z dušené zeleniny.',
        caution: 'Telecí je libové a snadno vyschne, dus ho pod pokličkou.',
      },
      '9m': {
        serving:
          'Rozvlákněné telecí nasekej a promíchej s bramborovým nebo se špenátovým pyré. Chuť je jemnější než u hovězího, takže bývá pro děti přijatelnější při prvních masových soustech.',
        caution: 'Blány a šlachy odřízni ještě před tepelnou úpravou.',
      },
      '12m': {
        serving:
          'Batoleti podávej telecí v kostkách nebo mleté v omáčce. Dobře se snáší s dušenou kořenovou zeleninou, jejíž sladká chuť maso vyváží bez jakéhokoli dochucení.',
        caution: 'Maso z mladých zvířat se kazí rychle, kupuj ho čerstvé.',
      },
    },
    prepIdeas: [
      'dušené a rozvlákněné',
      'mleté do zeleninového ragú',
      'pečené pod pokličkou',
      'do husté polévky se zeleninou',
    ],
    seasonCz: [],
    vegetarian: false,
    sources: [NHS_6M, MZCR_COMPLEMENTARY, SZU_FIRST_SPOON],
    reviewStatus: 'verified',
  },
  {
    id: 'veprova-panenka',
    nameCz: 'vepřová panenka',
    altNamesCz: ['panenka', 'vepřová svíčková'],
    category: 'maso-ryby',
    emoji: '🥩',
    icon: 'veprova-panenka',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Panenka je nejlibovější část vepřového a po propečení se láme na suché kusy, které se špatně posouvají slinami.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Panenku peč vcelku a krátce, aby zůstala šťavnatá, a pak ji nakrájej přes vlákna na plátky. Plátek rozeber prsty na proužky a potři ho výpekem nebo olivovým olejem.',
        caution: 'Vepřové musí být propečené skrz, uprostřed nesmí zůstat růžové.',
      },
      '9m': {
        serving:
          'Nakrájená panenka se dobře kombinuje s dušeným fenyklem nebo s jablkem. Dítě si proužky bere prsty, sledovat ale musíš, jestli je opravdu rozmělňuje, a ne polyká celé.',
        caution: 'Stříbrnou blánu na povrchu vždy odřízni, je tuhá.',
      },
      '12m': {
        serving:
          'Batole jí panenku v kostkách jako součást rodinného oběda. Než na maso dosolíš porci dospělých, odeber dítěti jeho díl, sůl se do jídla přidává až na závěr.',
        caution: 'Marinády z obchodu obsahují sůl i sladkou složku.',
      },
    },
    prepIdeas: [
      'pečená vcelku a krájená přes vlákna',
      'dušená s jablkem',
      'nasekaná do zeleninového ragú',
      'grilovaná na pánvi bez koření',
    ],
    seasonCz: [],
    vegetarian: false,
    sources: [NHS_6M, NHS_YOUNG_CHILDREN],
    reviewStatus: 'verified',
  },
  {
    id: 'veprova-kyta',
    nameCz: 'vepřová kýta',
    altNamesCz: ['kýta vepřová'],
    category: 'maso-ryby',
    emoji: '🥩',
    icon: 'veprova-kyta',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Kýta je protkaná blánami, které se při žvýkání oddělí jako pružné pásky a zůstanou v ústech v celku.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Kýtu dus v troubě aspoň devadesát minut pod pokličkou, dokud nejde rozebrat vidličkou. Blány a tuk odřízni a měkké maso podávej rozvlákněné s hustou šťávou.',
        caution: 'Bez dostatečně dlouhé úpravy zůstane maso pružné a tuhé.',
      },
      '9m': {
        serving:
          'Rozvlákněnou kýtu promíchej s dušeným zelím nebo s bramborem. Vepřové maso nese dobře využitelné železo a vitaminy skupiny B, hodí se tedy do pravidelného jídelníčku.',
        caution: 'Tučné okraje ořízni, tuk se v ústech maže a klouže.',
      },
      '12m': {
        serving:
          'Batoleti nakrájej dušenou kýtu na kostky a podávej ji s bramborem a zeleninou. Ze stejného hrnce se navečeří celá rodina, jen dospělým se jídlo dochutí až na talíři.',
        caution: 'Uzené vepřové výrobky nechávej mimo dětský talíř.',
      },
    },
    prepIdeas: [
      'dlouho dušená a rozvlákněná',
      'pečená s kořenovou zeleninou',
      'nasekaná do bramborové kaše',
      'vařená do zeleninové polévky',
    ],
    seasonCz: [],
    vegetarian: false,
    sources: [NHS_6M, NHS_AVOID],
    reviewStatus: 'verified',
  },
  {
    id: 'kralik',
    nameCz: 'králík',
    altNamesCz: ['králičí maso'],
    category: 'maso-ryby',
    emoji: '🍖',
    icon: 'kralik',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'high',
    chokingReason:
      'Králík má velké množství tenkých a ostrých kůstek, které se při obírání snadno přehlédnou a vnikají do sliznice.',
    hazards: ['kosti'],
    hazardNotes: {
      kosti:
        'Králičí kostra je drobná a kůstky jsou ostré. Maso obeber až po uvaření, každý kousek rozetři mezi palcem a ukazovákem a projeď ho i po délce nehtem — kůstka je cítit jako tvrdá nitka. Žebírka pro dítě nepoužívej vůbec.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Použij jen maso ze stehen a hřbetu, dus ho doměkka a pečlivě obeber od kostí. Rozvlákněné maso rozmixuj se zeleninou, tím se případná přehlédnutá kůstka odhalí při mixování.',
        caution: 'Králičí žebra a přední běhy jsou pro dítě nevhodné.',
      },
      '9m': {
        serving:
          'Obrané a prohmatané maso nasekej najemno a smíchej ho s bramborovou kaší. Králičí maso je velmi libové a lehce stravitelné, patří k tradičním prvním masům v Česku.',
        caution: 'Obírání dělej při dobrém světle, ne v šeru u sporáku.',
      },
      '12m': {
        serving:
          'Batole jí obrané králičí maso v kostkách nebo v omáčce. Ani teď mu nedávej kus s kostí do ruky, počet drobných kůstek je u králíka výrazně vyšší než u kuřete.',
        caution: 'Zbytky kostí z talíře odklízej okamžitě.',
      },
    },
    prepIdeas: [
      'dušený a pečlivě obraný',
      'rozmixovaný se zeleninou',
      'obrané maso do rizota',
      'pomalu pečený pod pokličkou',
    ],
    seasonCz: [],
    vegetarian: false,
    sources: [NHS_PREP_SAFELY, MZCR_COMPLEMENTARY, SZU_FIRST_SPOON],
    reviewStatus: 'verified',
  },
  {
    id: 'kaci-prsa',
    nameCz: 'kachní prsa',
    altNamesCz: ['kachní prso', 'kachní maso'],
    category: 'maso-ryby',
    emoji: '🦆',
    icon: 'kaci-prsa',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Kachní kůže je pevná a gumová, po ukousnutí se stočí do pásku, který dásně nepřetrhnou.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Kachní prso peč doměkka, kůži i podkožní tuk sundej a maso nakrájej přes vlákna na tenké plátky. Plátek rozeber na proužky, které dítě sevře v pěsti a olizuje z nich šťávu.',
        caution: 'Kůži dítěti nedávej, gumovou strukturu nepřekouše.',
      },
      '9m': {
        serving:
          'Nakrájené kachní maso promíchej s dušeným červeným zelím bez sladké složky. Kachna je tučnější než kuře, takže dodá energii, ale porce drž menší, ať jídlo není příliš mastné.',
        caution: 'Výpek sceď, aby na talíři nezůstala vrstva tuku.',
      },
      '12m': {
        serving:
          'Batole jí kachní maso v kostkách jako součást nedělního oběda. Před dochucením pro dospělé odeber dětskou porci, kachna se obvykle dosoluje výrazněji než jiné maso.',
        caution: 'Pečená kůže je křupavá a pro malé dítě riziková.',
      },
    },
    prepIdeas: [
      'pečené bez kůže a krájené přes vlákna',
      'dušené se zelím',
      'nasekané do rizota',
      'obrané maso do polévky',
    ],
    seasonCz: [9, 10, 11],
    vegetarian: false,
    sources: [NHS_6M, NHS_YOUNG_CHILDREN],
    reviewStatus: 'verified',
  },
  {
    id: 'jehneci',
    nameCz: 'jehněčí',
    altNamesCz: ['jehněčí maso', 'jehněčí plec'],
    category: 'maso-ryby',
    emoji: '🍖',
    icon: 'jehneci',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Jehněčí maso je protkané tukovými žilkami a blanami, které při žvýkání zůstanou celé a spojí se v ústech do chuchvalce.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Jehněčí plec dus dlouho a doměkka, pak odstraň tuk i blány a maso rozeber na vlákna. Výraznou chuť zjemní dušená mrkev nebo batát, se kterými se maso promíchá do hustého pokrmu.',
        caution: 'Tučné části pro dítě nepoužívej, jsou těžko stravitelné.',
      },
      '9m': {
        serving:
          'Nasekané jehněčí promíchej s cuketou a s kuskusem. Maso je bohaté na železo a zinek a jeho výrazná chuť rozšiřuje dítěti chuťový rejstřík mimo jemné kuřecí.',
        caution: 'Pokud dítě jehněčí odmítá, zkus ho nabídnout znovu za týden.',
      },
      '12m': {
        serving:
          'Batole jí dušené jehněčí v kostkách s kuskusem nebo s bramborem. Hodí se do pomalu pečených pokrmů pro celou rodinu, kde se dětská porce odebere před dochucením.',
        caution: 'Kosti z pečeně nikdy nenechávej v dosahu dítěte.',
      },
    },
    prepIdeas: [
      'pomalu dušené a rozvlákněné',
      'nasekané s kuskusem',
      'pečené s kořenovou zeleninou',
      'mleté do zeleninového ragú',
    ],
    seasonCz: [3, 4, 5],
    vegetarian: false,
    sources: [NHS_6M, WHO_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'kureci-jatra',
    nameCz: 'kuřecí játra',
    altNamesCz: ['drůbeží játra'],
    category: 'maso-ryby',
    emoji: '🍖',
    icon: 'kureci-jatra',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: ['vitamin-a'],
    hazardNotes: {
      'vitamin-a':
        'Játra jsou nejbohatším potravinovým zdrojem retinolu a ten se v těle kumuluje. Podle NHS hrozí nadbytek vitaminu A tomu, kdo jí játra častěji než jednou týdně, proto drž v jídelníčku nejvýše jednu porci za sedm dní.',
    },
    minAgeMonths: 6,
    frequencyLimit: 'Nejvýše jednou týdně kvůli kumulaci retinolu z vitaminu A.',
    prep: {
      '6m': {
        serving:
          'Játra očisti od blan, kraťoučce je poduš a rozmixuj do hladké paštiky bez soli. Lžičku paštiky rozetři na prst chleba nebo ji vmíchej do bramborového pyré, chuť je výrazná.',
        caution: 'Játra musí být propečená skrz, uvnitř nesmí zůstat růžová.',
      },
      '9m': {
        serving:
          'Dušená játra nasekej najemno a promíchej je s dušenou zeleninou. Pro dítě jsou mimořádně vydatným zdrojem železa, jedna malá porce týdně přispěje k jeho zásobám znatelně.',
        caution: 'Nabízej je zvlášť, nemíchej je s jinými vnitřnostmi.',
      },
      '12m': {
        serving:
          'Batole jí jaterní paštiku na chlebu nebo kousky jater v omáčce. Týdenní limit platí dál, a to včetně jaterních paštik a salámů, které se do počtu porcí započítávají také.',
        caution: 'Kupovaná paštika obsahuje hodně soli, dělej si vlastní.',
      },
    },
    prepIdeas: [
      'domácí paštika bez soli',
      'krátce dušená a nasekaná',
      'rozmixovaná do bramborového pyré',
      'promíchaná s dušenou cibulí',
    ],
    seasonCz: [],
    vegetarian: false,
    sources: [NHS_VITAMIN_A, NHS_6M],
    reviewStatus: 'verified',
  },
  {
    id: 'teleci-jatra',
    nameCz: 'telecí játra',
    altNamesCz: ['játra telecí'],
    category: 'maso-ryby',
    emoji: '🍖',
    icon: 'teleci-jatra',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: ['vitamin-a'],
    hazardNotes: {
      'vitamin-a':
        'Telecí játra obsahují ještě víc retinolu než kuřecí a ten se v játrech dítěte ukládá. Podle NHS se nadbytek vitaminu A týká těch, kdo jedí játra častěji než jednou za týden, proto je zařazuj nejvýše jednou týdně a nekombinuj je v témže týdnu s jinými játry.',
    },
    minAgeMonths: 6,
    frequencyLimit: 'Nejvýše jednou týdně, a to včetně jiných jaterních výrobků v témže týdnu.',
    prep: {
      '6m': {
        serving:
          'Telecí játra zbav blan, nakrájej na plátky a krátce je poduš na másle bez soli. Propečená játra rozmixuj s vařenou mrkví do hladké kaše, sladká zelenina jejich chuť změkčí.',
        caution: 'Játra se přepečením mění v tuhou hmotu, hlídej krátký čas.',
      },
      '9m': {
        serving:
          'Nakrájej dušená játra na drobné kousky a promíchej je s bramborem a s petrželkou. Železo z jater se vstřebává výborně, ale právě proto nepřekračuj jednu porci za týden.',
        caution: 'Zapisuj si, kdy dítě játra měla, limit se snadno přehlédne.',
      },
      '12m': {
        serving:
          'Batoleti nabízej telecí játra jako součást rodinného oběda nebo v domácí paštice. Do týdenního limitu počítej i paštiky a jaterní knedlíčky, jinak se dávka retinolu nasčítá.',
        caution: 'Vitaminové doplňky s vitaminem A řeš vždy s pediatrem.',
      },
    },
    prepIdeas: [
      'krátce dušená a rozmixovaná s mrkví',
      'domácí paštika bez soli',
      'nasekaná do bramborové kaše',
      'dušená s jablkem a cibulí',
    ],
    seasonCz: [],
    vegetarian: false,
    sources: [NHS_VITAMIN_A, NHS_YOUNG_CHILDREN],
    reviewStatus: 'verified',
  },
  {
    id: 'sunka-od-kosti',
    nameCz: 'šunka od kosti',
    altNamesCz: ['vepřová šunka nejvyšší jakosti'],
    category: 'maso-ryby',
    emoji: '🍖',
    icon: 'sunka-od-kosti',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Plátek šunky je pružný a v ústech se svine do pevného válečku, který dítě nedokáže rozdělit dásněmi.',
    hazards: ['sul'],
    hazardNotes: {
      sul: 'Šunka je nakládané masné výrobky a patří mezi potraviny s vysokým obsahem soli. Do prvního roku má být příjem soli velmi nízký kvůli zátěži ledvin, proto se šunka v dětském jídelníčku neobjevuje.',
    },
    minAgeMonths: 12,
    prep: {
      '6m': {
        serving:
          'V šesti měsících šunka do jídelníčku nepatří. Pokud chceš dítěti nabídnout vepřové maso, použij čerstvou kýtu nebo panenku dušenou bez soli, chuťově i nutričně je to lepší volba.',
        caution: 'Dětské šunky z obchodu jsou také slané, název je zavádějící.',
      },
      '9m': {
        serving:
          'Ani v devíti měsících šunku nezařazuj. Náhradou je vlastní pečené maso nakrájené natenko, které se dá připravit dopředu a vydrží v lednici tři dny.',
        caution: 'Zkontroluj, jestli šunku dítěti nenabídne někdo z rodiny.',
      },
      '12m': {
        serving:
          'Po prvním roce může batole dostat občas tenký plátek kvalitní šunky nakrájený na proužky. Zůstává to ale slaná potravina, takže ji nedávej denně a ten den už nesol ostatní jídlo.',
        caution: 'Vybírej šunku s vysokým podílem masa a krátkým složením.',
      },
    },
    prepIdeas: [
      'tenké proužky po prvním roce',
      'nasekaná do omelety',
      'zapečená v zeleninovém nákypu',
      'jako doplněk k čerstvé zelenině',
    ],
    seasonCz: [],
    vegetarian: false,
    sources: [NHS_AVOID, NHS_YOUNG_CHILDREN],
    reviewStatus: 'verified',
  },
  {
    id: 'losos',
    nameCz: 'losos',
    altNamesCz: ['lososí filet'],
    category: 'maso-ryby',
    emoji: '🐟',
    allergens: ['ryby'],
    isKeyAllergen: true,
    chokingRisk: 'medium',
    chokingReason:
      'V lososím filetu zůstává řada tenkých mezisvalových kostí, které jsou měkké na pohled, ale pevné a ostré v ústech.',
    hazards: ['kosti'],
    hazardNotes: {
      kosti:
        'Lososí filet má podél hřbetní linie řadu tenkých kostí. Přejeď filet proti směru vláken prstem, kůstky vystoupí jako drobné hrbolky, a vytáhni je pinzetou. Po uvaření maso ještě jednou rozeber a promni mezi prsty.',
    },
    minAgeMonths: 6,
    frequencyLimit:
      'Tučné ryby, tedy i losos, nejvýše dvě porce týdně; u dívek se doporučuje spíš nižší hranice.',
    prep: {
      '6m': {
        serving:
          'Lososa upeč v alobalu nebo poduš v páře, sundej kůži a maso rozeber na vločky. Každou vločku promni mezi prsty, teprve pak ji podej v hromádce, kterou dítě nabere dlaní.',
        caution: 'Syrového ani uzeného lososa nikdy nepodávej.',
      },
      '9m': {
        serving:
          'Rozebrané maso promíchej s bramborovým pyré a udělej z něj malé placičky. Losos nese omega-3 mastné kyseliny a vitamin D, které jsou pro vývoj mozku i kostí důležité.',
        caution: 'Při každé porci znovu zkontroluj, jestli v mase nezůstala kost.',
      },
      '12m': {
        serving:
          'Batole jí lososa v kostkách nebo v placičkách. Peče se rychle, takže je to praktická rodinná večeře, u které se dětská porce odebere před dosolením zbytku.',
        caution: 'Dodržuj dvě porce tučných ryb týdně, víc není potřeba.',
      },
    },
    prepIdeas: [
      'pečený v alobalu a rozebraný na vločky',
      'rybí placičky s bramborem',
      'dušený v páře se zeleninou',
      'zapečený s cuketou',
    ],
    seasonCz: [],
    vegetarian: false,
    sources: [NHS_FISH, NHS_ALLERGY],
    reviewStatus: 'verified',
  },
  {
    id: 'pstruh-duhovy',
    nameCz: 'pstruh duhový',
    altNamesCz: ['pstruh'],
    category: 'maso-ryby',
    emoji: '🐟',
    allergens: ['ryby'],
    isKeyAllergen: true,
    chokingRisk: 'high',
    chokingReason:
      'Pstruh se obvykle připravuje vcelku a jeho žeberní kosti jsou tenké jako jehly, takže v mase prakticky nejdou nahmatat.',
    hazards: ['kosti'],
    hazardNotes: {
      kosti:
        'Pstruha pro dítě vždy nejdřív rozeber: po upečení odděl filety od páteře, vytáhni celou páteř i s žebry vcelku, pak maso rozmělni na talíři vidličkou a projeď ho po vrstvách. Z hlavy a ocasní části dítěti maso neber vůbec.',
    },
    minAgeMonths: 6,
    frequencyLimit: 'Jako tučná ryba nejvýše dvě porce týdně.',
    prep: {
      '6m': {
        serving:
          'Pstruha upeč vcelku, odděl filety od páteře a maso rozmělni na talíři na drobné kousky. Každou vrstvu prohlédni proti světlu a promni prsty, teprve pak ji dítěti nabídni.',
        caution: 'Nikdy nepodávej pstruha v kuse, kosti se nedají odhadnout.',
      },
      '9m': {
        serving:
          'Zkontrolované maso promíchej s bramborem nebo s dušenou mrkví do hustší směsi. Pstruh má jemnou chuť, kterou děti obvykle přijímají lépe než výraznější mořské ryby.',
        caution: 'Kontrolu kostí dělej za denního světla, ne u sporáku.',
      },
      '12m': {
        serving:
          'Batoleti podávej rozebraného pstruha s bramborem a citronem. Na Vánoce a při rodinných obědech na kosti obzvlášť dohlédni, u rybích pokrmů se na to snadno zapomene.',
        caution: 'Rybí polévky z celé ryby vždy přecezuj.',
      },
    },
    prepIdeas: [
      'pečený a pečlivě obraný od kostí',
      'rozebraný do bramborového pyré',
      'dušený v páře s citronem',
      'zapečený se zeleninou',
    ],
    seasonCz: [],
    vegetarian: false,
    sources: [NHS_PREP_SAFELY, NHS_FISH],
    reviewStatus: 'verified',
  },
  {
    id: 'treska-obecna',
    nameCz: 'treska obecná',
    altNamesCz: ['treska', 'cod'],
    category: 'maso-ryby',
    emoji: '🐟',
    allergens: ['ryby'],
    isKeyAllergen: true,
    chokingRisk: 'medium',
    chokingReason:
      'Tresčí maso se rozpadá na velké vločky, mezi kterými mohou zůstat úlomky kostí z porcování, a ty se v měkkém mase ztratí.',
    hazards: ['kosti'],
    hazardNotes: {
      kosti:
        'I filet označený jako bezkostý obsahuje po strojovém porcování zbytky kostí. Syrový filet přejeď prstem po povrchu i po řezu, po tepelné úpravě maso rozeber na vločky a každou z nich stiskni mezi prsty.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Tresku poduš v páře nebo ji zapeč v troubě pod pokličkou, ať zůstane vlhká. Maso rozeber na vločky, prohmatej je a smíchej s bramborovým pyré, samotná treska je pro dítě suchá.',
        caution: 'Mražené rybí prsty pro miminko nepoužívej, jsou slané a obalované.',
      },
      '9m': {
        serving:
          'Z rozebrané tresky a brambor vytvaruj placičky, které dítě uchopí prsty. Bílá ryba je libová, má jemnou chuť a patří mezi ryby s nízkým obsahem rtuti.',
        caution: 'Rozmrazuj v lednici, ne při pokojové teplotě.',
      },
      '12m': {
        serving:
          'Batole jí tresku v kostkách nebo v placičkách s bramborem a zeleninou. Bílé ryby se dají zařadit klidně dvakrát týdně, limit pro tučné ryby se na ně nevztahuje.',
        caution: 'Ryba musí být propečená skrz, uvnitř nesmí být sklovitá.',
      },
    },
    prepIdeas: [
      'dušená v páře a rozebraná',
      'rybí placičky s bramborem',
      'zapečená s dušeným pórkem',
      'do husté rybí polévky',
    ],
    seasonCz: [],
    vegetarian: false,
    sources: [NHS_FISH, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'treska-tmava',
    nameCz: 'treska tmavá',
    altNamesCz: ['tmavá treska', 'sajda'],
    category: 'maso-ryby',
    emoji: '🐟',
    allergens: ['ryby'],
    isKeyAllergen: true,
    chokingRisk: 'medium',
    chokingReason:
      'Tmavá treska má pevnější vlákna než treska obecná a její vločky drží tvar, takže větší kus se dásněmi nerozdrobí.',
    hazards: ['kosti'],
    hazardNotes: {
      kosti:
        'Tmavá treska se prodává v blocích, ve kterých bývají zalisované úlomky kostí. Rozmrazený blok rozeber po vláknech ještě zasyrova, projeď ho prsty a po uvaření maso znovu rozmělni vidličkou.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Tmavou tresku poduš doměkka a rozeber na jemná vlákna, která promícháš se zeleninovým pyré. Chuť je výraznější než u tresky obecné, takže ji spoj se sladší zeleninou.',
        caution: 'Slaně nakládané rybí výrobky v téhle fázi nepatří na talíř.',
      },
      '9m': {
        serving:
          'Rozebranou tresku promíchej s vařeným bramborem a s kapkou olivového oleje. Ryba je dobrý zdroj jodu a bílkovin a patří do jídelníčku dvakrát týdně.',
        caution: 'Kupuj bloky bez glazury, přidaná voda zvyšuje hmotnost.',
      },
      '12m': {
        serving:
          'Batole jí tmavou tresku zapečenou se zeleninou nebo v podobě placiček. Levnější bílá ryba se hodí do rodinného rozpočtu a nutričně se od dražších druhů zásadně neliší.',
        caution: 'Solit až porci dospělých, po odebrání dětské části.',
      },
    },
    prepIdeas: [
      'dušená a rozebraná do pyré',
      'zapečená s bramborem',
      'placičky s cuketou',
      'do bílé rybí polévky',
    ],
    seasonCz: [],
    vegetarian: false,
    sources: [NHS_FISH, NHS_7_9M],
    reviewStatus: 'verified',
  },
  {
    id: 'candat',
    nameCz: 'candát',
    altNamesCz: ['candát obecný'],
    category: 'maso-ryby',
    emoji: '🐟',
    allergens: ['ryby'],
    isKeyAllergen: true,
    chokingRisk: 'medium',
    chokingReason:
      'Candátí maso je jemné a bílé, takže tenké kůstky v něm nejsou vidět a snadno se s masem dostanou do sousta.',
    hazards: ['kosti'],
    hazardNotes: {
      kosti:
        'U candáta odstraň hřbetní řadu kůstek tak, že filet nakrojíš podél páteřní linie a pás s kostmi vyřízneš celý. Zbytek masa po uvaření rozeber na vlákna a projeď ho mezi prsty.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Candáta poduš v páře s plátkem citronu, sundej kůži a maso rozeber na jemná vlákna. Je mimořádně jemný a málo výrazný, proto se hodí jako první sladkovodní ryba na talíři.',
        caution: 'Kůže candáta je tuhá, pro dítě ji nepoužívej.',
      },
      '9m': {
        serving:
          'Prohmatané maso smíchej s bramborovou kaší nebo s dušenou kořenovou zeleninou. Dítě zvládne i větší vločky, pokud jsou vlhké a spojené s přílohou.',
        caution: 'Filet kupuj čerstvý, sladkovodní ryba se kazí rychle.',
      },
      '12m': {
        serving:
          'Batole jí candáta pečeného na másle s bramborem. Jde o rybu s jemnou chutí, kterou děti přijímají ochotně, a s nízkým obsahem rtuti oproti dravým mořským druhům.',
        caution: 'I u fileta bez kosti kontrolu před podáním nevynechávej.',
      },
    },
    prepIdeas: [
      'dušený v páře s citronem',
      'pečený na másle',
      'rozebraný do bramborové kaše',
      'zapečený s fenyklem',
    ],
    seasonCz: [],
    vegetarian: false,
    sources: [NHS_FISH, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'stika',
    nameCz: 'štika',
    altNamesCz: ['štika obecná'],
    category: 'maso-ryby',
    emoji: '🐟',
    allergens: ['ryby'],
    isKeyAllergen: true,
    chokingRisk: 'high',
    chokingReason:
      'Štika má mezi svalovými vrstvami rozvětvené kosti ve tvaru vidličky, které se v mase rozbíhají do stran a nedají se vytáhnout v celku.',
    hazards: ['kosti'],
    hazardNotes: {
      kosti:
        'Vidličkovité kosti štiky se nedají odstranit tahem. Filet po uvaření rozeber po jednotlivých svalových vrstvách, každou rozetři mezi prsty a hmatem projeď po celé délce. Když si nejsi jistý, štiku dítěti raději nedávej.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Štiku pro dítě připravuj jen z velkého kusu fileta, ze kterého se dá maso rozebrat po vrstvách. Rozmělněné maso promíchej s bramborem, aby se případná kost při míchání odhalila.',
        caution: 'Menší štiky mají víc kostí, pro dítě se vůbec nehodí.',
      },
      '9m': {
        serving:
          'Zkontrolované maso zpracuj do placiček nebo do husté kaše se zeleninou. Štika je libová ryba s výraznou chutí, kterou dobře vyváží dušený pórek nebo mrkev.',
        caution: 'Kontrolu kostí dělej podruhé těsně před podáním.',
      },
      '12m': {
        serving:
          'Batole jí štiku jen rozebranou a prohlédnutou, nikdy ne v kuse. Pokud v domácnosti rybu čistí někdo jiný, dohodněte se, kdo za kontrolu kostí odpovídá.',
        caution: 'Rybí vývar ze štiky vždy přeceď přes jemné sítko.',
      },
    },
    prepIdeas: [
      'vařená a rozebraná po vrstvách',
      'rybí placičky s bramborem',
      'do přecezené rybí polévky',
      'zapečená s dušenou zeleninou',
    ],
    seasonCz: [],
    vegetarian: false,
    sources: [NHS_PREP_SAFELY, NHS_FISH],
    reviewStatus: 'verified',
  },
  {
    id: 'kapr',
    nameCz: 'kapr',
    altNamesCz: ['kapr obecný'],
    category: 'maso-ryby',
    emoji: '🐟',
    allergens: ['ryby'],
    isKeyAllergen: true,
    chokingRisk: 'high',
    chokingReason:
      'Kapr má husté mezisvalové kosti po celém těle a ty jsou v dužině neviditelné, takže se dostanou i do zdánlivě čistého sousta.',
    hazards: ['kosti'],
    hazardNotes: {
      kosti:
        'Kapří mezisvalové kosti jdou odstranit jen tak, že filet po uvaření rozdělíš na tenké vrstvy a každou prohmatáš a projedeš nehtem. Pro dítě používej hřbetní část, kde je kostí nejméně, a nikdy ne břišní partie ani pruh kolem ploutví.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Použij jen hřbetní část kapra, tu poduš a rozeber na tenké vrstvy. Každou vrstvu prohmatej mezi prsty a nabídni ji rozmělněnou s bramborovým pyré, které sousto spojí.',
        caution: 'Smaženého vánočního kapra s kostmi dítěti nedávej.',
      },
      '9m': {
        serving:
          'Rozebranou hřbetní část promíchej s bramborem nebo s dušeným pórkem. Kapr je tučnější sladkovodní ryba, proto porci drž menší a podávej ji spíš v poledne.',
        caution: 'Kapr může mít bahnitou chuť, čerstvost poznáš podle očí.',
      },
      '12m': {
        serving:
          'Batole jí kapra jen rozebraného a zkontrolovaného, ideálně mimo vánoční shon. Na Štědrý den je kolem stolu hodně lidí a kontrola kostí se pak snadno přehlédne.',
        caution: 'Domluvte se předem, kdo dětskou porci kontroluje.',
      },
    },
    prepIdeas: [
      'hřbetní část dušená a rozebraná',
      'zapečená s bramborem',
      'do přecezené polévky',
      'rozmělněná s dušeným pórkem',
    ],
    seasonCz: [11, 12],
    vegetarian: false,
    sources: [NHS_PREP_SAFELY, NHS_FISH],
    reviewStatus: 'verified',
  },
  {
    id: 'sardinky-v-oleji',
    nameCz: 'sardinky v oleji',
    altNamesCz: ['konzervované sardinky'],
    category: 'maso-ryby',
    emoji: '🐟',
    allergens: ['ryby'],
    isKeyAllergen: true,
    chokingRisk: 'medium',
    chokingReason:
      'Páteř konzervovaných sardinek je měkká, ale ocasní a ploutevní kůstky zůstávají tvrdé a v měkkém mase se neodhalí.',
    hazards: ['sul', 'kosti'],
    hazardNotes: {
      sul: 'Konzervované sardinky se nakládají do solného roztoku, takže mají vysoký obsah soli. Do prvního roku má být příjem soli velmi nízký kvůli nezralým ledvinám, proto se sardinky z konzervy v jídelníčku miminka neobjevují.',
      kosti:
        'Páteř sardinky je po sterilaci měkká a dá se sníst, ocasní ploutev a drobné kůstky u hlavy ale tvrdé zůstávají. Rybu rozeber podélně na dvě poloviny, páteř vyndej celou, ocasní část odřízni a maso rozetři vidličkou.',
    },
    minAgeMonths: 12,
    prep: {
      '6m': {
        serving:
          'V šesti měsících sardinky z konzervy nezařazuj. Pokud hledáš zdroj vápníku a omega-3, sáhni po čerstvé rybě dušené bez soli, která má stejné přednosti bez solného nálevu.',
        caution: 'Rybí pomazánky z konzervy jsou stejně slané jako sardinky samotné.',
      },
      '9m': {
        serving:
          'Ani v devíti měsících konzervované sardinky nepatří na talíř. Čerstvá makrela nebo losos pokryjí stejné živiny a dají se připravit úplně bez slané složky.',
        caution: 'Kontroluj složení hotových rybích salátů, bývají velmi slané.',
      },
      '12m': {
        serving:
          'Po prvním roce může batole dostat sardinku propláchnutou vodou a rozetřenou na chleba. Měkká páteř je vydatným zdrojem vápníku, ale vyber ji spolu s ocasní částí a kůstkami u hlavy.',
        caution: 'Vybírej sardinky v oleji, ne v rajčatové nebo pikantní omáčce.',
      },
    },
    prepIdeas: [
      'propláchnuté a rozetřené na chleba po prvním roce',
      'rozmačkané do bramborového salátu',
      'zapečené se zeleninou',
      'smíchané s tvarohem na pomazánku',
    ],
    seasonCz: [],
    vegetarian: false,
    sources: [NHS_AVOID, NHS_FISH],
    reviewStatus: 'verified',
  },
  {
    id: 'makrela',
    nameCz: 'makrela',
    altNamesCz: ['makrela obecná'],
    category: 'maso-ryby',
    emoji: '🐟',
    allergens: ['ryby'],
    isKeyAllergen: true,
    chokingRisk: 'medium',
    chokingReason:
      'Makrelí maso drží v pevných vrstvách a mezi nimi vede řada tenkých kostí, které se od masa neoddělí samy.',
    hazards: ['kosti', 'sul'],
    hazardNotes: {
      kosti:
        'U makrely oddělej filety od páteře, vyřízni tmavý pruh podél hřbetu i s kostmi a zbytek po uvaření rozeber na vrstvy a prohmatej. Hlavu a ocasní část pro dítě nepoužívej.',
      sul: 'Čerstvá makrela sůl neobsahuje, ale uzená makrela ze stánku nebo z lednice v obchodě patří mezi velmi slané potraviny. Pro dítě do prvního roku používej výhradně čerstvou rybu připravenou doma.',
    },
    minAgeMonths: 6,
    frequencyLimit: 'Jako tučná ryba nejvýše dvě porce týdně, započítej i lososa a sardinky.',
    prep: {
      '6m': {
        serving:
          'Čerstvou makrelu upeč v alobalu, sundej kůži a maso rozeber na vrstvy. Chuť je výrazná a mastná, proto ji spoj s bramborovým pyré nebo s dušenou mrkví, které ji zjemní.',
        caution: 'Uzenou makrelu dítěti nenabízej, obsahuje velké množství soli.',
      },
      '9m': {
        serving:
          'Rozebrané maso smíchej s bramborem a s citronovou šťávou do husté pomazánky. Makrela je jedním z nejlepších zdrojů omega-3 mastných kyselin a vitaminu D.',
        caution: 'Prohmatávej maso po vrstvách, kosti jsou dlouhé a tenké.',
      },
      '12m': {
        serving:
          'Batole jí pečenou makrelu rozebranou s bramborem nebo jako pomazánku na chleba. Dvě porce tučných ryb týdně jsou horní hranice, do které se počítají všechny tučné druhy dohromady.',
        caution: 'Rybí kosti z talíře odklízej hned po jídle.',
      },
    },
    prepIdeas: [
      'pečená v alobalu a rozebraná',
      'pomazánka s bramborem a citronem',
      'dušená v páře se zeleninou',
      'zapečená s fenyklem',
    ],
    seasonCz: [],
    vegetarian: false,
    sources: [NHS_FISH, NHS_AVOID],
    reviewStatus: 'verified',
  },
  {
    id: 'tunak',
    nameCz: 'tuňák',
    altNamesCz: ['tuňák ve vlastní šťávě', 'tuňák čerstvý'],
    category: 'maso-ryby',
    emoji: '🐟',
    allergens: ['ryby'],
    isKeyAllergen: true,
    chokingRisk: 'medium',
    chokingReason:
      'Tuňák je po tepelné úpravě suchý a rozpadá se na tuhá zrnitá vlákna, která se v ústech spojí do drolivého sousta.',
    hazards: ['rtut'],
    hazardNotes: {
      rtut: 'Tuňák je dravá ryba a hromadí ve svalovině rtuť, která může poškodit vyvíjející se nervovou soustavu. Proto se u malých dětí omezuje jeho množství; žralok, mečoun a marlín se dětem nepodávají vůbec.',
    },
    minAgeMonths: 6,
    frequencyLimit:
      'Nejvýše jedna malá porce týdně kvůli rtuti; žralok, mečoun a marlín se dětem nepodávají vůbec.',
    prep: {
      '6m': {
        serving:
          'Použij tuňáka ve vlastní šťávě, propláchni ho vodou a rozetři vidličkou s avokádem nebo s tvarohem. Samotný tuňák je suchý a drolivý, dítě ho bez vláčné složky nespolkne.',
        caution: 'Tuňák v oleji nebo v nálevu s dochucením pro dítě nekupuj.',
      },
      '9m': {
        serving:
          'Rozetřený tuňák se dobře hodí do pomazánky na prst chleba nebo do těstovin. Právě proto, že se používá snadno, hlídej, aby se v jídelníčku neobjevoval častěji než jednou týdně.',
        caution: 'Zapisuj si porce, tuňák se do jídelníčku dostane nenápadně.',
      },
      '12m': {
        serving:
          'Batole jí tuňákovou pomazánku nebo kousky čerstvého propečeného tuňáka. Limit kvůli rtuti platí dál a je důležitější než u dospělých, protože dítě má nižší tělesnou hmotnost.',
        caution: 'Sushi a syrové rybí maso nejsou pro děti vhodné.',
      },
    },
    prepIdeas: [
      'propláchnutý a rozetřený s avokádem',
      'pomazánka s tvarohem',
      'vmíchaný do těstovin se zeleninou',
      'čerstvý steak propečený skrz',
    ],
    seasonCz: [],
    vegetarian: false,
    sources: [NHS_FISH, NHS_AVOID],
    reviewStatus: 'verified',
  },
  {
    id: 'krevety',
    nameCz: 'krevety',
    altNamesCz: ['garnáti', 'kreveta'],
    category: 'maso-ryby',
    emoji: '🦐',
    allergens: ['korysi'],
    isKeyAllergen: true,
    chokingRisk: 'medium',
    chokingReason:
      'Kreveta je pružná a po uvaření se stáčí do pevného oblouku, který dásně nerozdělí a který zaplní ústa v celku.',
    hazards: ['syrove'],
    hazardNotes: {
      syrove:
        'Syroví a nedovaření korýši jsou u malých dětí zdrojem otravy z potravin. Krevety proto vždy provař doběla a doprostřed, syrové ani marinované dětem nepodávej.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Krevety oloupej, odstraň střevo a provař je doměkka, pak je nasekej najemno. Nasekané maso promíchej s bramborovým pyré nebo s rýží, aby vznikla souvislá hmota bez celých kusů.',
        caution: 'Korýši patří mezi klíčové alergeny, nabídni je dopoledne a odděleně.',
      },
      '9m': {
        serving:
          'Provařenou krevetu rozkroj podélně na poloviny a ještě na menší kousky. Dítě je zvládne uchopit prsty, ale celou krevetu jí nedávej, tvar i pružnost jsou rizikové.',
        caution: 'Při prvním podání sleduj dvě hodiny reakci kůže i dýchání.',
      },
      '12m': {
        serving:
          'Batole jí nakrájené krevety v rýži nebo v těstovinách. Pokud se objeví otok rtů, dušnost, zvracení s bledostí nebo náhlá ochablost, volej okamžitě 155.',
        caution: 'Aplikace alergii nediagnostikuje, podezření vždy řeš s pediatrem.',
      },
    },
    prepIdeas: [
      'provařené a nasekané do rýže',
      'dušené s cuketou',
      'nasekané do těstovin',
      'zapečené se zeleninou',
    ],
    seasonCz: [],
    vegetarian: false,
    sources: [NHS_ALLERGY, NHS_AVOID],
    reviewStatus: 'verified',
  },
];
