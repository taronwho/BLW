import type { Ingredient } from '@/types';
import {
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
 * Kategorie „orechy-seminka-tuky" podle docs/SUROVINY-SEZNAM.md (20 položek).
 *
 * Celé ořechy a celá tvrdá semínka do dětské linie nepatří vůbec
 * (docs/BEZPECNOST.md kapitola 2), proto je každá položka popsaná výhradně
 * ve formě mleté, drcené nebo jako pasta. Hlídá to pravidlo `no-whole-nuts`.
 */
export const nutsSeedsOils: Ingredient[] = [
  {
    id: 'arasidove-maslo',
    nameCz: 'arašídové máslo 100% hladké',
    altNamesCz: ['arašídová pasta', 'burákové máslo'],
    category: 'orechy-seminka-tuky',
    emoji: '🥜',
    allergens: ['arasidy'],
    isKeyAllergen: true,
    chokingRisk: 'medium',
    chokingReason:
      'Hustá vrstva pasty se přilepí na patro a vytvoří souvislý povlak, který dítě nedokáže jazykem posunout ani spolknout.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Vyber hladké máslo se stoprocentním podílem arašídů, bez soli a bez sladké složky. Lžičku vždy rozřeď teplou vodou, mateřským mlékem nebo jogurtem do konzistence řídké omáčky.',
        caution: 'Nikdy nepodávej hustou pastu na lžíci ani v silné vrstvě.',
      },
      '9m': {
        serving:
          'Rozředěné máslo rozetři v tenké vrstvě na prst chleba nebo ho vmíchej do ovesné kaše. Arašídové máslo patří mezi klíčové alergeny a po zavedení je potřeba ho nabízet opakovaně, ne jednorázově.',
        caution: 'Kousky arašídů v másle s kousky pro dítě nejsou vhodné.',
      },
      '12m': {
        serving:
          'Batole jí rozředěnou arašídovou pastu na pečivu i v omáčkách. Celé arašídy zůstávají nevhodné až do pěti let, protože se snadno vdechnou a v plicích způsobí vážný zánět.',
        caution: 'Slaná a slazená arašídová másla nekupuj, čti složení.',
      },
    },
    prepIdeas: [
      'rozředěná pasta do ovesné kaše',
      'tenká vrstva na prst chleba',
      'rozmíchaná v jogurtu',
      'pasta do omáčky k dušené zelenině',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_ALLERGY, NHS_AVOID],
    reviewStatus: 'verified',
  },
  {
    id: 'mandlove-maslo',
    nameCz: 'mandlové máslo',
    altNamesCz: ['mandlová pasta'],
    category: 'orechy-seminka-tuky',
    emoji: '🥜',
    allergens: ['orechy'],
    isKeyAllergen: true,
    chokingRisk: 'medium',
    chokingReason:
      'Pasta je hustá a lepivá, v ústech se stáhne do jednoho kusu a při nadechnutí uzavře dýchací cesty.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Mandlové máslo vybírej hladké, bez přidané soli i sladké složky, a před podáním ho rozmíchej ve vodě nebo v mléce. Řídká směs se dá olíznout z prstu a nelepí se v hrdle.',
        caution: 'Rozřeďuj vždy, hustá vrstva je riziková.',
      },
      '9m': {
        serving:
          'Vmíchej lžičku rozředěné pasty do kaše nebo do jogurtu, aby se chuť rozprostřela. Ořechové máslo patří mezi klíčové alergeny, takže jednotlivé druhy zaváděj po jednom a s odstupem dvou až tří dnů.',
        caution: 'Máslo s kousky ořechů pro dítě nepoužívej.',
      },
      '12m': {
        serving:
          'Batole jí mandlovou pastu na pečivu i v pečení. Dodává zdravé tuky, vitamin E a hořčík a v bezmasé kuchyni pomáhá zvýšit energetickou hodnotu jídla bez velkého objemu.',
        caution: 'Celé mandle nepatří dětem do pěti let.',
      },
    },
    prepIdeas: [
      'rozředěná pasta do jogurtu',
      'vmíchaná do ovesné kaše',
      'tenká vrstva na prst chleba',
      'do těsta na celozrnné placky',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_ALLERGY, NHS_AVOID],
    reviewStatus: 'verified',
  },
  {
    id: 'kesu-maslo',
    nameCz: 'kešu máslo',
    altNamesCz: ['kešu pasta'],
    category: 'orechy-seminka-tuky',
    emoji: '🥜',
    allergens: ['orechy'],
    isKeyAllergen: true,
    chokingRisk: 'medium',
    chokingReason:
      'Kešu pasta je nejlepivější ze všech ořechových past a v ústech se chová jako tuhé lepidlo, které nejde odstranit jazykem.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Kešu máslo má jemnější a sladší chuť než mandlové, děti ho většinou přijímají ochotně. Vždy ho rozmíchej v teplé vodě nebo v jogurtu, dokud nevznikne poloviční hustota omáčky.',
        caution: 'Hustou pastu nikdy nedávej přímo na lžíci.',
      },
      '9m': {
        serving:
          'Rozředěná kešu pasta se hodí do zeleninových omáček, kterým dodá krémovost bez smetany. Pro bezmasou linii je to praktický zdroj energie i bílkovin, který zahustí jinak vodnaté jídlo.',
        caution: 'Kešu máslo je z ořechů, zaváděj ho jako samostatný alergen.',
      },
      '12m': {
        serving:
          'Batole jí kešu pastu na chlebu, v omáčkách i v domácích tyčinkách. Rozmixovaná kešu s vodou nahradí smetanu ve vegetariánském jídle, které pak zvládne i dospělý bez mléka.',
        caution: 'Celé kešu jsou pro malé děti nevhodné.',
      },
    },
    prepIdeas: [
      'rozmixovaná kešu pasta místo smetany',
      'rozředěná do jogurtu',
      'vmíchaná do dušené zeleniny',
      'tenká vrstva na prst chleba',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_ALLERGY, NHS_VEGETARIAN],
    reviewStatus: 'verified',
  },
  {
    id: 'liskoorisove-maslo',
    nameCz: 'lískooříškové máslo',
    altNamesCz: ['lísková pasta', 'pasta z lískových ořechů'],
    category: 'orechy-seminka-tuky',
    emoji: '🥜',
    allergens: ['orechy'],
    isKeyAllergen: true,
    chokingRisk: 'medium',
    chokingReason:
      'Lísková pasta je hustá a mastná zároveň, takže se v ústech rozprostře do vrstvy, kterou dítě nedokáže spolknout najednou.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Používej čistou mletou pastu bez kakaa a bez sladké složky, ne oříškové krémy z obchodu. Lžičku rozmíchej v kaši nebo v jogurtu, nikdy ji nepodávej v hustém stavu.',
        caution: 'Čokoládové krémy z mletých lískových ořechů obsahují velké množství sladké složky.',
      },
      '9m': {
        serving:
          'Rozředěná lísková pasta dodá kaši výraznou chuť a zdravé tuky. Mleté lískové ořechy patří mezi klíčové alergeny, takže první ochutnávku nabídni dopoledne a sleduj reakci dvě hodiny.',
        caution: 'Pasta s kousky ořechů se pro dítě nehodí, kupuj jen úplně hladkou.',
      },
      '12m': {
        serving:
          'Batole jí lískovou pastu na pečivu i v pečení. Domácí varianta z mletých lískových ořechů a kapky oleje je levnější než kupovaná a má kratší složení.',
        caution: 'Celé lískové ořechy jsou pro malé děti nevhodné.',
      },
    },
    prepIdeas: [
      'rozředěná pasta do kaše',
      'domácí pasta z mletých lískových ořechů',
      'tenká vrstva na prst chleba',
      'vmíchaná do celozrnného těsta',
    ],
    seasonCz: [9, 10],
    vegetarian: true,
    sources: [NHS_ALLERGY, NHS_AVOID],
    reviewStatus: 'verified',
  },
  {
    id: 'tahini',
    nameCz: 'tahini',
    altNamesCz: ['sezamová pasta'],
    category: 'orechy-seminka-tuky',
    emoji: '🥣',
    allergens: ['sezam'],
    isKeyAllergen: true,
    chokingRisk: 'medium',
    chokingReason:
      'Sezamová pasta je hutná a zároveň mastná, v ústech se slepí do kompaktní vrstvy, kterou dítě jazykem neposune.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Tahini je pasta z mletého sezamu a patří mezi klíčové alergeny. Vždy ji rozřeď vodou nebo citronovou šťávou, dokud nezískáš konzistenci hustého jogurtu, teprve pak ji nabídni.',
        caution: 'Neředěné tahini se lepí v hrdle, nikdy ho nepodávej samotné.',
      },
      '9m': {
        serving:
          'Rozředěná pasta z mletého sezamu se hodí do hummusu i do zeleninových dipů. Mletý sezam je dobrým zdrojem vápníku, což se hodí zvlášť, když dítě zatím jí málo mléčných výrobků.',
        caution: 'Mletý sezam zaváděj samostatně, ne spolu s ořechy.',
      },
      '12m': {
        serving:
          'Batole jí tahini v hummusu, v omáčkách i rozetřené na pečivu. Kombinace s citronovou šťávou zjemní hořkost a zároveň zlepší využitelnost železa z ostatních rostlinných složek.',
        caution: 'Tahini se v balení rozděluje, před použitím ho promíchej.',
      },
    },
    prepIdeas: [
      'rozředěné do hummusu',
      'omáčka s citronovou šťávou',
      'vmíchané do jogurtového dipu',
      'tenká vrstva na prst chleba',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_ALLERGY, NHS_VEGETARIAN],
    reviewStatus: 'verified',
  },
  {
    id: 'seminka-lnena-mleta',
    nameCz: 'semínka lněná mletá',
    altNamesCz: ['mletý len', 'lněná moučka'],
    category: 'orechy-seminka-tuky',
    emoji: '🌿',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Lněná semínka podávej vždy čerstvě mletá, celá projdou trávením beze změny a nic z nich dítě nezíská. Lžičku mleté moučky vmíchej do kaše nebo do zeleninového pyré.',
        caution: 'Mletá moučka rychle žlukne, mel ji těsně před použitím.',
      },
      '9m': {
        serving:
          'Mletý len zahustí jogurt i ovocné pyré a dodá jídlu rostlinné omega-3 mastné kyseliny. Zároveň pomáhá při tuhé stolici, proto k němu vždy nabídni dostatek vody.',
        caution: 'Větší množství mletého lnu rozvolní stolici.',
      },
      '12m': {
        serving:
          'Batole jí mletý len v kaši, v pečení i v placičkách, kde nahradí část vejce. Namočená mletá lněná moučka vytvoří gel, který drží těsto pohromadě bez další pojící složky.',
        caution: 'Skladuj mletý len v lednici v uzavřené nádobě.',
      },
    },
    prepIdeas: [
      'lžička mleté moučky do kaše',
      'zahuštění jogurtu',
      'namočený gel místo části vejce',
      'vmíchaný do celozrnného těsta',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_VEGETARIAN, NHS_AVOID],
    reviewStatus: 'verified',
  },
  {
    id: 'seminka-chia',
    nameCz: 'semínka chia',
    altNamesCz: ['chia', 'šalvěj hispánská'],
    category: 'orechy-seminka-tuky',
    emoji: '🌿',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Suchá chia v ústech i v jícnu nasáknou tekutinu a několikanásobně zvětší objem, takže se z nich stane lepivý gel na jednom místě.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Chia semínka nabízej jen mletá a předem namočená, nikdy suchá a celá. Lžičku mleté chia nech deset minut nabobtnat v mléce nebo ve vodě, teprve pak ji vmíchej do kaše.',
        caution: 'Suchá celá chia semínka nikdy nesypej přímo do pusy ani na jídlo, patří jen mletá a namočená.',
      },
      '9m': {
        serving:
          'Namočená mletá chia semínka vytvoří hustý puding, který se dá nabrat lžící. Smíchej ho s ovocným pyré a dostaneš svačinu s rostlinnými omega-3 mastnými kyselinami bez slazení.',
        caution: 'Vždy nech gel plně nabobtnat, minimálně deset minut.',
      },
      '12m': {
        serving:
          'Batole jí chia puding i mleté chia semínka vmíchané do jogurtu. Pravidlo namáčení platí dál, protože bobtnání v hrdle je riziko bez ohledu na to, jak dobře dítě žvýká.',
        caution: 'Hotové chia nápoje z obchodu bývají slazené.',
      },
    },
    prepIdeas: [
      'namočený puding z mleté chia',
      'gel vmíchaný do jogurtu',
      'mletá chia do ovesné kaše',
      'namočená mletá chia do těsta',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_VEGETARIAN],
    reviewStatus: 'verified',
  },
  {
    id: 'seminka-konopna-loupana',
    nameCz: 'semínka konopná loupaná',
    altNamesCz: ['konopné semeno loupané', 'konopná srdíčka'],
    category: 'orechy-seminka-tuky',
    emoji: '🌿',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Loupaná konopná semínka jsou měkká, přesto je pro miminko podávej rozdrcená nebo rozmixovaná do jídla. Lžička vmíchaná do zeleninového pyré dodá bílkoviny i nenasycené tuky.',
        caution: 'Neloupaná konopná semínka jsou tvrdá, a i loupaná podávej vždy mletá nebo rozdrcená.',
      },
      '9m': {
        serving:
          'Rozdrcená konopná semínka posyp na kaši nebo je vmíchej do jogurtu. Mají jemnou chuť, kterou děti přijímají snadno, a patří k nejlepším rostlinným zdrojům kompletní bílkoviny.',
        caution: 'Skladuj je v lednici, obsahují hodně tuku a žluknou.',
      },
      '12m': {
        serving:
          'Batole jí mletá konopná semínka v kaši, v pomazánkách i v pečení. V domácnosti, kde někdo z rodičů nejí maso, jsou praktickým doplňkem bílkovin ke každodennímu jídlu.',
        caution: 'Kupuj potravinářská loupaná semena, ne krmné směsi.',
      },
    },
    prepIdeas: [
      'rozdrcená do zeleninového pyré',
      'mletá posypaná na kaši',
      'rozmixovaná do jogurtu',
      'mletá do celozrnného těsta',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_VEGETARIAN, WHO_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'seminka-dynova-mleta',
    nameCz: 'semínka dýňová mletá',
    altNamesCz: ['mletá dýňová jádra'],
    category: 'orechy-seminka-tuky',
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
          'Dýňová semínka pro dítě používej vždy mletá na hrubou moučku, celá jsou tvrdá a plochá. Lžičku mleté moučky vmíchej do dýňového nebo do mrkvového pyré, chuťově se k sobě dobře hodí.',
        caution: 'Celá dýňová semínka do dětského jídla nepatří, jen mletá.',
      },
      '9m': {
        serving:
          'Mletá dýňová semínka jsou dobrým zdrojem železa i zinku a dají se posypat na cokoli teplého. Vstřebávání železa podpoříš tím, že ve stejném jídle nabídneš i zeleninu s vitaminem C.',
        caution: 'Mel je nadvakrát, hrubé kousky zůstávají tvrdé.',
      },
      '12m': {
        serving:
          'Batole jí mletá dýňová semínka v kaši, v pomazánce i v domácím pečivu. Celá semínka nechávej až na věk, kdy dítě spolehlivě žvýká, tedy zhruba po pátém roce.',
        caution: 'Skladuj mletou moučku v lednici, rychle žlukne.',
      },
    },
    prepIdeas: [
      'mletá moučka do dýňového pyré',
      'posypané na teplou kaši',
      'vmíchané do pomazánky',
      'mletá do celozrnného pečiva',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_VEGETARIAN],
    reviewStatus: 'verified',
  },
  {
    id: 'seminka-slunecnicova-mleta',
    nameCz: 'semínka slunečnicová mletá',
    altNamesCz: ['mletá slunečnicová jádra'],
    category: 'orechy-seminka-tuky',
    emoji: '🌻',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Slunečnicová semínka používej jen mletá najemno a vmíchej je do kaše nebo do zeleninového pyré. V celku jsou pro dítě nevhodná, protože jsou tvrdá a jejich tvar se snadno dostane do dýchacích cest.',
        caution: 'Solená slunečnicová semínka nepoužívej ani mletá.',
      },
      '9m': {
        serving:
          'Z mletých slunečnicových semínek se dá udělat i pasta podobná tahini, jen levnější. Rozředěná pasta se hodí do dipů a je vhodnou náhradou tam, kde je alergie na sezam.',
        caution: 'Mletá semínka skladuj v uzavřené nádobě v chladu.',
      },
      '12m': {
        serving:
          'Batole jí mletá slunečnicová semínka v kaši, v pomazánkách i zapečená v plackách. Celá semínka nabízej až po pátém roce, do té doby zůstává mletá forma jedinou bezpečnou.',
        caution: 'Pražením se chuť zlepší, ale rychleji žluknou.',
      },
    },
    prepIdeas: [
      'mletá do zeleninového pyré',
      'domácí pasta z mletých semínek',
      'vmíchaná do jogurtového dipu',
      'zapečená mletá v placce',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_10_12M],
    reviewStatus: 'verified',
  },
  {
    id: 'sezam-mlety',
    nameCz: 'sezam mletý',
    altNamesCz: ['mletá sezamová semena'],
    category: 'orechy-seminka-tuky',
    emoji: '🌿',
    allergens: ['sezam'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Sezam podávej jen mletý, celá zrnka se lepí na patro a nic z nich tělo nezíská. Lžičku mletého sezamu vmíchej do pyré nebo do jogurtu a sleduj reakci, jde o klíčový alergen.',
        caution: 'Sezam z povrchu pečiva pro dítě neoškrábávej, sáhni radši po mletém z balíčku.',
      },
      '9m': {
        serving:
          'Mletý sezam posyp na dušenou zeleninu nebo ho vmíchej do pomazánky. Je vydatným zdrojem vápníku a hodí se zvlášť tehdy, když dítě mléčné výrobky odmítá nebo je nesnáší.',
        caution: 'Zaváděj ho odděleně od ostatních nových alergenů.',
      },
      '12m': {
        serving:
          'Batole jí mletý sezam v pomazánkách, v kaši i v pečení. Celý sezam na pečivu už problém nepředstavuje, protože se v ústech rozmělní spolu s měkkým podkladem.',
        caution: 'Při podezření na reakci se vždy obrať na pediatra.',
      },
    },
    prepIdeas: [
      'mletý vmíchaný do pyré',
      'posypaný na dušenou zeleninu',
      'v pomazánce s tvarohem',
      'mletý do celozrnného těsta',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_ALLERGY, NHS_AVOID],
    reviewStatus: 'verified',
  },
  {
    id: 'mak-mlety',
    nameCz: 'mák mletý',
    altNamesCz: ['mletý modrý mák'],
    category: 'orechy-seminka-tuky',
    emoji: '🌿',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Mletý mák vmíchej do kaše nebo do ovocného pyré, celá zrnka projdou trávením beze změny. Mletí doma na mlýnku je jistější než kupovaný mletý mák, který rychle žlukne.',
        caution: 'Mletý mák skladuj v lednici a spotřebuj do měsíce.',
      },
      '9m': {
        serving:
          'Mletý mák je v české kuchyni tradiční a je bohatý na vápník. Smíchej ho s rozmačkanou hruškou a vznikne klasická chuťová kombinace bez jakéhokoli přidaného slazení.',
        caution: 'Mletý mák z neznámého zdroje raději nekupuj, kvalita se liší.',
      },
      '12m': {
        serving:
          'Batole jí mletý mák v nudlích, v kaši i v pečení. Makový nákyp s ovocem je jednoduchá svačina pro celou rodinu a dá se připravit úplně bez sladké složky.',
        caution: 'Klasické makové koláče obsahují hodně sladké složky.',
      },
    },
    prepIdeas: [
      'mletý s rozmačkanou hruškou',
      'vmíchaný do jáhlové kaše',
      'makový nákyp s ovocem',
      'mletý do celozrnného těsta',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [MZCR_COMPLEMENTARY, NHS_AVOID],
    reviewStatus: 'verified',
  },
  {
    id: 'vlasske-orechy-mlete',
    nameCz: 'vlašské ořechy mleté',
    altNamesCz: ['mleté vlašské ořechy'],
    category: 'orechy-seminka-tuky',
    emoji: '🌰',
    allergens: ['orechy'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Vlašské ořechy používej jen mleté najemno a vmíchej lžičku do kaše nebo do jogurtu. Celé ani nalámané ořechy dítěti nikdy nedávej, bezpečná je jen mletá forma, protože vdechnutý kousek ořechu působí v plicích zánět.',
        caution: 'Mleté ořechy jsou klíčový alergen, zaváděj je po jednom druhu.',
      },
      '9m': {
        serving:
          'Mleté vlašské ořechy dodají jídlu rostlinné omega-3 mastné kyseliny. Posyp jimi dušené ovoce nebo je vmíchej do těsta, chuť je výrazná, takže lžička na porci stačí.',
        caution: 'Mleté ořechy rychle žluknou, skladuj je v lednici.',
      },
      '12m': {
        serving:
          'Batole jí mleté vlašské ořechy v kaši, v pomazánce i v domácím pečivu. Celé ořechy zůstávají nevhodné až do pěti let, a to i tehdy, když dítě jinak dobře žvýká.',
        caution: 'Zkontroluj, že v mleté směsi nejsou větší kusy.',
      },
    },
    prepIdeas: [
      'mleté vmíchané do ovesné kaše',
      'posypané na dušené ovoce',
      'mleté do celozrnného pečiva',
      'v pomazánce s tvarohem',
    ],
    seasonCz: [9, 10, 11],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_ALLERGY],
    reviewStatus: 'verified',
  },
  {
    id: 'mandle-mlete',
    nameCz: 'mandle mleté',
    altNamesCz: ['mandlová moučka'],
    category: 'orechy-seminka-tuky',
    emoji: '🌰',
    allergens: ['orechy'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Mleté mandle neboli mandlová moučka se dají vmíchat do kaše i do pyré. Celé mandle jsou pro malé dítě jednou z nejnebezpečnějších potravin, bezpečná je jen mletá mandlová moučka.',
        caution: 'Mandlová moučka z obchodu bývá vhodnější než domácí mletí.',
      },
      '9m': {
        serving:
          'Z mleté mandlové moučky upeč placky nebo ji přidej do těsta místo části mouky. Mleté mandle dodají vitamin E i hořčík a zároveň zvýší energetickou hodnotu jídla.',
        caution: 'Mandlová moučka nasává vlhkost, skladuj ji uzavřenou.',
      },
      '12m': {
        serving:
          'Batole jí mletou mandlovou moučku v pečení, v kaši i v pudinku. Loupané mandle rozmixované s vodou dají rostlinné mléko, které se hodí do vaření, ale nenahradí mléko jako nápoj.',
        caution: 'Rostlinné nápoje nejsou náhradou kravského mléka pro batole.',
      },
    },
    prepIdeas: [
      'mandlová moučka do kaše',
      'placky z mleté mandlové moučky',
      'rozmixované s vodou do vaření',
      'mletá moučka do celozrnného těsta',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_ALLERGY],
    reviewStatus: 'verified',
  },
  {
    id: 'olej-olivovy',
    nameCz: 'olej olivový extra panenský',
    altNamesCz: ['extra panenský olivový olej'],
    category: 'orechy-seminka-tuky',
    emoji: '🫒',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Kapka olivového oleje v zeleninovém pyré zvýší energetickou hodnotu jídla a pomůže vstřebat vitaminy rozpustné v tucích. Používej ho hlavně za studena, do hotového jídla.',
        caution: 'Olej přidávej po kapkách, ne po lžících.',
      },
      '9m': {
        serving:
          'Olivovým olejem potři zeleninu před pečením nebo ho zakápni na hotové těstoviny. Extra panenský olej má výraznou chuť, která některým dětem zpočátku nesedne, zkus mírnější odrůdu.',
        caution: 'Na prudké smažení se extra panenský olej nehodí.',
      },
      '12m': {
        serving:
          'Batole jí olivový olej na zelenině, v salátech i v pomazánkách. Tuk je pro malé dítě důležitý zdroj energie, takže ho neškrť tak, jak by to dělal dospělý při dietě.',
        caution: 'Olej skladuj v temnu, na světle rychle ztrácí kvalitu.',
      },
    },
    prepIdeas: [
      'kapka do zeleninového pyré',
      'potření zeleniny před pečením',
      'zakápnutí hotových těstovin',
      'do domácího hummusu',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_YOUNG_CHILDREN, WHO_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'olej-repkovy',
    nameCz: 'olej řepkový lisovaný za studena',
    altNamesCz: ['panenský řepkový olej'],
    category: 'orechy-seminka-tuky',
    emoji: '🌼',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Řepkový olej lisovaný za studena má příznivý poměr mastných kyselin a jemnější chuť než olivový. Kapku vmíchej do zeleninového pyré nebo do kaše, aby jídlo mělo dost energie.',
        caution: 'Rafinovaný olej z běžného regálu má jiné složení než panenský.',
      },
      '9m': {
        serving:
          'Řepkový olej se hodí do dušené zeleniny i do studených pomazánek. Jeho neutrální chuť nepřebije ostatní složky, takže se hodí tam, kde by byl olivový olej příliš výrazný.',
        caution: 'Panenský řepkový olej skladuj v lednici po otevření.',
      },
      '12m': {
        serving:
          'Batoleti slouží řepkový olej ve vaření i do salátů. V domácnosti bez ryb je spolu s mletými lněnými semínky důležitým zdrojem rostlinných omega-3 mastných kyselin.',
        caution: 'Na vysoké teploty používej rafinovanou variantu.',
      },
    },
    prepIdeas: [
      'kapka do zeleninového pyré',
      'do studené pomazánky',
      'na dušení zeleniny',
      'do domácího pečení',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_VEGETARIAN, NHS_6M],
    reviewStatus: 'verified',
  },
  {
    id: 'olej-dynovy',
    nameCz: 'olej dýňový',
    altNamesCz: ['dýňový olej'],
    category: 'orechy-seminka-tuky',
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
          'Dýňový olej je tmavý, hustý a má výraznou chuť, proto ho používej po kapkách. Přidej ho až do hotového vlažného jídla, teplem ztrácí aroma i část cenných látek.',
        caution: 'Na tepelnou úpravu se dýňový olej nehodí vůbec.',
      },
      '9m': {
        serving:
          'Kapka dýňového oleje zvýrazní chuť bramborové kaše i dušené zeleniny. Barví ale jídlo do zelena, což některé děti odradí, proto ho mísi s jinými tmavšími složkami.',
        caution: 'Olej zanechává skvrny na oblečení, počítej s tím.',
      },
      '12m': {
        serving:
          'Batole jí dýňový olej na salátu, v kaši i na tvarohu. Je to typicky středoevropská surovina, kterou v české a rakouské kuchyni znají celé generace.',
        caution: 'Kvalitní olej je drahý, levné směsi bývají ředěné.',
      },
    },
    prepIdeas: [
      'kapka do bramborové kaše',
      'zakápnutí dušené zeleniny',
      'do tvarohové pomazánky',
      'na hotový zeleninový salát',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_YOUNG_CHILDREN, MZCR_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'olej-lneny',
    nameCz: 'olej lněný',
    altNamesCz: ['lněný olej'],
    category: 'orechy-seminka-tuky',
    emoji: '🌿',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Lněný olej lisovaný z mletých lněných semínek je nejbohatším rostlinným zdrojem omega-3 mastných kyselin. Používej ho výhradně za studena, kapku do hotového vlažného pyré.',
        caution: 'Zahřátím se lněný olej znehodnotí a získá hořkou chuť.',
      },
      '9m': {
        serving:
          'Kapku lněného oleje zakápni do jogurtu nebo do zeleninové kaše těsně před podáním. Chuť je zemitá a jemně hořká, což některým dětem sedne a jiným ne, zkoušej to opakovaně.',
        caution: 'Olej vydrží po otevření jen několik týdnů v lednici.',
      },
      '12m': {
        serving:
          'Batole jí lněný olej v jogurtu, v tvarohu i na zelenině. V rodině, kde se ryby nejedí, je vedle mletých lněných semínek klíčovým zdrojem rostlinných omega-3 mastných kyselin.',
        caution: 'Zhořklý olej poznáš čichem, ten už nepoužívej.',
      },
    },
    prepIdeas: [
      'kapka do vlažného zeleninového pyré',
      'zakápnutí jogurtu',
      'do tvarohové pomazánky',
      'na hotový zeleninový salát',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_VEGETARIAN, WHO_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'olej-kokosovy',
    nameCz: 'olej kokosový',
    altNamesCz: ['kokosový tuk'],
    category: 'orechy-seminka-tuky',
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
          'Kokosový olej je při pokojové teplotě tuhý a rozpouští se až teplem. Malé množství se hodí na opečení zeleniny, ale jako hlavní tuk v jídelníčku ho nepoužívej, převažují v něm nasycené tuky.',
        caution: 'Kokosový olej není zdravější než olivový, přes reklamní tvrzení.',
      },
      '9m': {
        serving:
          'Na kokosovém oleji krátce opeč banánové plátky nebo placky. Dodá jídlu výraznou vůni, kterou děti většinou přijímají dobře, ale porci tuku drž v rozumné míře.',
        caution: 'Panenský kokosový olej voní silně, rafinovaný skoro ne.',
      },
      '12m': {
        serving:
          'Batole jí kokosový olej v asijských pokrmech, v pečení i na opečení placek. Snese vysokou teplotu, takže se hodí tam, kde by se panenský olivový olej připálil.',
        caution: 'Střídej tuky, ať jídelníček není postavený jen na jednom.',
      },
    },
    prepIdeas: [
      'na opečení banánových plátků',
      'do zeleninového kari',
      'na opečení placek',
      'do domácího pečení',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_YOUNG_CHILDREN, WHO_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'mleko-kokosove',
    nameCz: 'mléko kokosové',
    altNamesCz: ['kokosové mléko z konzervy'],
    category: 'orechy-seminka-tuky',
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
          'Kokosové mléko z konzervy je hustý tuk z rozmixované kokosové dužiny, ne nápoj. Používej ho do vaření, kde zjemní zeleninové kari nebo kaši, ale nikdy jako náhradu mléka.',
        caution: 'Kokosové mléko nemá dost bílkovin ani vápníku pro miminko.',
      },
      '9m': {
        serving:
          'Lžíce kokosového mléka zjemní ostřejší chuť zeleniny a zahustí omáčku. Vybírej konzervy bez přidané soli a bez zahušťovadel, složení bývá u různých značek hodně odlišné.',
        caution: 'Kokosové nápoje v krabici jsou výrazně řidší a často slazené.',
      },
      '12m': {
        serving:
          'Batole jí kokosové mléko v kari, v polévce i v ovocné kaši. Pro rodinné vaření je to praktická surovina, protože nahradí smetanu v jídle, které pak sní i člověk bez mléka.',
        caution: 'Otevřenou konzervu přelij do sklenice a spotřebuj do dvou dnů.',
      },
    },
    prepIdeas: [
      'do zeleninového kari',
      'zjemnění dýňové polévky',
      'vmíchané do jáhlové kaše',
      'základ ovocného krému',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_YOUNG_CHILDREN, NHS_7_9M],
    reviewStatus: 'verified',
  },
];
