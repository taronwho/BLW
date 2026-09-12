import type { Ingredient } from '@/types';
import {
  MZCR_COMPLEMENTARY,
  NHS_10_12M,
  NHS_6M,
  NHS_ALLERGY,
  NHS_AVOID,
  NHS_AVOID_WEANING,
  NHS_DRINKS,
  NHS_YOUNG_CHILDREN,
  WHO_COMPLEMENTARY,
} from './_sources';

/**
 * Kategorie „mlecne-vejce" podle docs/SUROVINY-SEZNAM.md (20 položek)
 * plus pecorino a grana padano.
 *
 * Ty dvě položky v seznamu nejsou, ale docs/BEZPECNOST.md kapitola 7 je
 * spolu s parmazánem jmenuje jako sýry se živočišným syřidlem, a pravidlo
 * `hidden-animal-ingredients` je hlídá v bezmasé linii receptů. Katalog je
 * proto vede s `vegetarian: false`, aby na ně šlo v UI upozornit.
 */
export const dairyEggs: Ingredient[] = [
  {
    id: 'jogurt-bily-plnotucny',
    nameCz: 'jogurt bílý plnotučný',
    altNamesCz: ['bílý jogurt', 'plnotučný jogurt'],
    category: 'mlecne-vejce',
    emoji: '🥛',
    allergens: ['mleko'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Vybírej plnotučný bílý jogurt bez ochucení, dítě do dvou let potřebuje tuk kvůli energii i vývoji. Nabídni ho na předložené lžíci nebo namoč do něj proužek chleba, aby se dal olizovat.',
        caution: 'Ochucené dětské jogurty obsahují přidanou sladkou složku.',
      },
      '9m': {
        serving:
          'Dej jogurt do mělké misky a nech dítě nabírat vlastní lžící. Hustotu zvýšíš lžící mletých ovesných vloček, řídký jogurt z lžíce steče dřív, než ho dítě dopraví do pusy.',
        caution: 'Jogurt s ovocem na dně bývá slazený, míchej si vlastní.',
      },
      '12m': {
        serving:
          'Batole jí jogurt s čerstvým ovocem jako svačinu i jako základ dipu k zelenině. Plnotučné mléčné výrobky se doporučují do dvou let věku, pak se dá přejít na polotučné.',
        caution: 'Jogurtové nápoje jsou slazené, nejsou náhradou jogurtu.',
      },
    },
    prepIdeas: [
      'se rozmačkaným ovocem',
      'jako dip k zeleninovým hranolkům',
      'zahuštěný mletými ovesnými vločkami',
      'vmíchaný do dušené zeleniny místo smetany',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_YOUNG_CHILDREN, NHS_6M],
    reviewStatus: 'verified',
  },
  {
    id: 'jogurt-recky',
    nameCz: 'jogurt řecký',
    altNamesCz: ['řecký jogurt', 'jogurt řeckého typu'],
    category: 'mlecne-vejce',
    emoji: '🥛',
    allergens: ['mleko'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Řecký jogurt je odkapaný, a proto hustší a bohatší na bílkoviny než bílý. Jeho hustota se pro první lžíce hodí, protože drží tvar a nestéká dítěti po bradě ani po ruce.',
        caution: 'Rozlišuj řecký jogurt od výrobku řeckého typu, složení se liší.',
      },
      '9m': {
        serving:
          'Hustý jogurt se skvěle hodí na obalování kluzkého ovoce, třeba kousků manga nebo hrušky. Dítě pak úchop zvládne a zároveň se naučí kombinovat dvě chuti v jednom soustu.',
        caution: 'Odtučněné varianty pro dítě do dvou let nejsou vhodné.',
      },
      '12m': {
        serving:
          'Batole jí řecký jogurt se zeleninou jako dip i s ovocem jako dezert. V rodinném vaření nahradí zakysanou smetanu, protože se při zahřátí tolik nesráží.',
        caution: 'Hustý jogurt zasytí, nedávej ho těsně před hlavním jídlem.',
      },
    },
    prepIdeas: [
      'obalení kluzkého ovoce',
      'bylinkový dip k zelenině',
      'náhrada zakysané smetany v omáčce',
      'se strouhanou okurkou',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_YOUNG_CHILDREN, WHO_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'kefir',
    nameCz: 'kefír',
    altNamesCz: ['kefírové mléko'],
    category: 'mlecne-vejce',
    emoji: '🥛',
    allergens: ['mleko'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Kefír je kysaný mléčný nápoj s živou kulturou a jeho kyselejší chuť dítě překvapí. Do prvního roku ho nenabízej jako nápoj, ale vmíchej ho do kaše nebo do zeleninového pyré.',
        caution: 'Kefír nesmí nahradit mateřské ani umělé mléko.',
      },
      '9m': {
        serving:
          'Lžíci kefíru přidej do ovesné kaše nebo z něj udělej hustý koktejl s banánem. Kyselost dobře vyváží sladké ovoce a dítě si zvyká na širší škálu mléčných chutí.',
        caution: 'Z lahvičky ani z hrnku ho nenabízej místo vody.',
      },
      '12m': {
        serving:
          'Batole může kefír pít z hrnku jako součást mléčné porce dne. Voda ale zůstává hlavním nápojem a mléčné výrobky jsou jídlo, ne nápoj na zahnání žízně.',
        caution: 'Ochucené kefírové nápoje jsou slazené, kupuj bílý.',
      },
    },
    prepIdeas: [
      'vmíchaný do ovesné kaše',
      'koktejl s rozmačkaným banánem',
      'základ bylinkového dipu',
      'do těsta na placky',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_DRINKS, NHS_YOUNG_CHILDREN],
    reviewStatus: 'verified',
  },
  {
    id: 'tvaroh-mekky',
    nameCz: 'tvaroh měkký',
    altNamesCz: ['měkký tvaroh', 'tvaroh ve vaničce'],
    category: 'mlecne-vejce',
    emoji: '🧀',
    allergens: ['mleko'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Měkký tvaroh je hustý a suchý, proto ho rozmíchej s trochou mléka nebo s ovocným pyré. Vzniklou krémovou hmotu rozetři na prst chleba, aby ji dítě mohlo olizovat i kousat.',
        caution: 'Samotný hutný tvaroh se lepí na patro, vždy ho rozřeď.',
      },
      '9m': {
        serving:
          'Tvarohovou hmotu můžeš zahustit a udělat z ní malé kuličky obalené v mletých vločkách. Tvaroh je koncentrovaný zdroj bílkovin a vápníku, takže stačí malá porce.',
        caution: 'Tvarohy s příchutí obsahují sladkou složku, kupuj bílý.',
      },
      '12m': {
        serving:
          'Batole jí tvaroh s ovocem, v pomazánce i zapečený v nákypu. Tvarohová pomazánka s bylinkami je pro rodinu levnou alternativou k sýrům a obsahuje podstatně méně soli.',
        caution: 'Tvaroh se rychle kazí, spotřebuj ho do dvou dnů po otevření.',
      },
    },
    prepIdeas: [
      'rozmíchaný s ovocným pyré',
      'bylinková pomazánka',
      'kuličky obalené v mletých vločkách',
      'zapečený v ovocném nákypu',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_YOUNG_CHILDREN, NHS_6M],
    reviewStatus: 'verified',
  },
  {
    id: 'tvaroh-polotucny',
    nameCz: 'tvaroh polotučný',
    altNamesCz: ['polotučný tvaroh', 'tvaroh v kostce'],
    category: 'mlecne-vejce',
    emoji: '🧀',
    allergens: ['mleko'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Tvaroh v kostce je pevnější a sušší než měkký, takže ho pro dítě nastrouhej a rozmíchej s mlékem. Bez rozmíchání zůstává drobivý a sousta se v ústech rozpadají na suchý prach.',
        caution: 'Do dvou let volej spíš plnotučné varianty kvůli energii.',
      },
      '9m': {
        serving:
          'Rozmíchaný polotučný tvaroh se dobře hodí do slaných pomazánek s bylinkami i do sladkých s ovocem. Dítě z něj dostane bílkoviny, aniž by jídlo bylo příliš tučné.',
        caution: 'Tvrdý tvaroh z kostky nikdy nepodávej v kusu.',
      },
      '12m': {
        serving:
          'Batole jí polotučný tvaroh v nákypu, v knedlíkách i jako náplň do palačinek. Je to univerzální surovina, kterou v rodině s vegetariánskou maminkou využiješ na desítky způsobů.',
        caution: 'Při pečení tvaroh hodně vysychá, přidej jogurt nebo mléko.',
      },
    },
    prepIdeas: [
      'rozmíchaný s mlékem na krém',
      'náplň do palačinek',
      'tvarohový nákyp s jablky',
      'pomazánka s pažitkou',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_YOUNG_CHILDREN, MZCR_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'ricotta',
    nameCz: 'ricotta',
    altNamesCz: ['ricota'],
    category: 'mlecne-vejce',
    emoji: '🧀',
    allergens: ['mleko'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Ricotta je jemný sýr ze syrovátky s nízkým obsahem soli, takže je pro miminko lepší volbou než zrající sýry. Rozetři ji na prst chleba nebo ji vmíchej do zeleninového pyré.',
        caution: 'Vybírej ricottu z pasterizovaného mléka, na obalu to musí být.',
      },
      '9m': {
        serving:
          'Ricottu smíchej s dušeným špenátem a naplň jí těstoviny nebo palačinku. Její neutrální chuť se dobře snáší se zeleninou a přidá do jídla bílkoviny bez výrazné slanosti.',
        caution: 'Ricotta rychle kysne, kupuj ji v malém balení.',
      },
      '12m': {
        serving:
          'Batole jí ricottu zapečenou s těstovinami, v nákypu nebo s ovocem. V bezmasé variantě rodinného jídla nahradí část bílkovin z masa a udrží pokrm krémový.',
        caution: 'Sýry s plísní pro dítě do prvního roku nejsou vhodné.',
      },
    },
    prepIdeas: [
      'rozetřená na prst chleba',
      'smíchaná s dušeným špenátem',
      'náplň do celozrnných těstovin',
      'zapečená s cuketou',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_YOUNG_CHILDREN, NHS_AVOID],
    reviewStatus: 'verified',
  },
  {
    id: 'mascarpone',
    nameCz: 'mascarpone',
    altNamesCz: ['mascarpone sýr'],
    category: 'mlecne-vejce',
    emoji: '🧀',
    allergens: ['mleko'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Mascarpone je velmi tučný smetanový sýr s minimem soli. Lžičku vmíchej do zeleninového pyré nebo do kaše, dodá energii a hladkou strukturu, kterou dítě snadno polkne.',
        caution: 'Kvůli vysokému obsahu tuku ho používej po lžičkách, ne po lžících.',
      },
      '9m': {
        serving:
          'Mascarpone zjemní ostřejší chuť dušené brokolice nebo kedlubny. Dá se z něj udělat i krém s ovocným pyré, který se hodí jako svačina bez jakéhokoli slazení.',
        caution: 'Tiramisu a podobné dezerty obsahují syrové vejce, ty nepatří.',
      },
      '12m': {
        serving:
          'Batole jí mascarpone v omáčce k těstovinám i v ovocném krému. Vysoký obsah tuku je v tomhle věku spíš výhodou, protože malé děti potřebují energii v malém objemu.',
        caution: 'Otevřené balení spotřebuj do tří dnů.',
      },
    },
    prepIdeas: [
      'lžička do zeleninového pyré',
      'krém s ovocným pyré',
      'zjemnění omáčky k těstovinám',
      'vmíchané do bramborové kaše',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_YOUNG_CHILDREN, NHS_AVOID_WEANING],
    reviewStatus: 'verified',
  },
  {
    id: 'cottage',
    nameCz: 'cottage',
    altNamesCz: ['cottage sýr', 'zrnitý tvaroh'],
    category: 'mlecne-vejce',
    emoji: '🧀',
    allergens: ['mleko'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: ['sul'],
    hazardNotes: {
      sul: 'Cottage se solí při výrobě, takže i přes jemnou chuť patří mezi slanější mléčné výrobky. Do prvního roku ho zařazuj po malých porcích a v ten den už nepřidávej další slané potraviny.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Cottage má zrnitou strukturu, kterou dítě zpočátku neudrží na lžíci. Rozmačkej ho proto vidličkou nebo rozmixuj s dušenou zeleninou do hladké hmoty a podávej po lžičkách.',
        caution: 'Ochucené varianty s bylinkami obsahují víc soli než čistý.',
      },
      '9m': {
        serving:
          'Zrnka cottage jsou v tomhle věku dobrým tréninkem, dítě je sbírá prsty po jednom. Smíchej ho s rozmačkaným avokádem, aby zrna držela pohromadě a dala se nabrat.',
        caution: 'Množství drž malé, cottage je slanější než tvaroh.',
      },
      '12m': {
        serving:
          'Batole jí cottage na chlebu, se zeleninou i zapečený v těstovinách. Obsahuje hodně bílkovin při nízkém obsahu tuku, což se hodí jako doplněk k tučnějším mléčným výrobkům.',
        caution: 'Kontroluj složení, některé značky přidávají škrob.',
      },
    },
    prepIdeas: [
      'rozmačkaný s avokádem',
      'rozmixovaný do zeleninového pyré',
      'zapečený s těstovinami',
      'na prst chleba s rajčetem',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_YOUNG_CHILDREN],
    reviewStatus: 'verified',
  },
  {
    id: 'mozzarella',
    nameCz: 'mozzarella',
    altNamesCz: ['mozarela', 'mozzarella kuličky'],
    category: 'mlecne-vejce',
    emoji: '🧀',
    allergens: ['mleko'],
    isKeyAllergen: true,
    chokingRisk: 'high',
    chokingReason:
      'Malé kuličky mozzarelly mají hladký pružný povrch a průměr blízký dýchacím cestám, takže sousto uzavře průchod vzduchu úplně.',
    hazards: ['sul'],
    hazardNotes: {
      sul: 'Mozzarella se uchovává v solném nálevu a část soli do sýra přechází. Před podáním ji nech okapat a pro dítě používej menší porce; slanější varianty typu pizza mozzarella jsou ještě výraznější.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Kuličku mozzarelly nikdy nepodávej celou. Rozřež ji podélně na čtvrtky a každý díl ještě rozmačkej nebo nastrouhej, aby vznikly měkké kousky bez souvislého pružného tvaru.',
        caution: 'Sýr nech okapat, nálev obsahuje sůl.',
      },
      '9m': {
        serving:
          'Mozzarellu dál krájej podélně na čtvrtky, případně ji nastrouhej do dušené zeleniny. Roztavený sýr se táhne do vláken, proto ho vždy rozděl na malé kousky ještě před podáním.',
        caution: 'Zapečený sýr drží teplo dlouho, nech ho zchladnout.',
      },
      '12m': {
        serving:
          'Batoleti krájej mozzarellu na proužky nebo na kostky, nikdy ne na celé kuličky. Malé kuličky zůstávají rizikové i po prvním roce, protože jejich tvar se nemění.',
        caution: 'Mozzarella z nepasterizovaného mléka do prvního roku nepatří.',
      },
    },
    prepIdeas: [
      'nastrouhaná do dušené zeleniny',
      'zapečená s rajčaty a bazalkou',
      'proužky do těstovin',
      'rozmačkaná na prst chleba',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_YOUNG_CHILDREN],
    reviewStatus: 'verified',
  },
  {
    id: 'eidam',
    nameCz: 'eidam',
    altNamesCz: ['eidamská cihla'],
    category: 'mlecne-vejce',
    emoji: '🧀',
    allergens: ['mleko'],
    isKeyAllergen: true,
    chokingRisk: 'medium',
    chokingReason:
      'Kostka tvrdého sýra je pevná a zároveň kluzká, takže se dásněmi nerozdělí a může sklouznout do hrdla vcelku.',
    hazards: ['sul'],
    hazardNotes: {
      sul: 'Eidam patří mezi zrající sýry a sůl je součástí jeho výroby, takže je výrazně slanější než tvaroh nebo ricotta. Pro dítě do prvního roku platí malá porce a v ten den žádné další slané potraviny.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Eidam pro dítě vždy nastrouhej najemno a promíchej ho s teplou zeleninou nebo s bramborem. Kostky ani plátky v téhle fázi nenabízej, tvrdý sýr se dásněmi nedá rozmělnit.',
        caution: 'Vybírej sýr z pasterizovaného mléka, je to na obalu.',
      },
      '9m': {
        serving:
          'Nastrouhaný eidam posyp na dušenou zeleninu nebo ho zapeč do placky. Dítě dostane vápník i bílkoviny, ale porci drž malou, protože sýr je zároveň zdrojem soli.',
        caution: 'Roztavený sýr se táhne, rozděl ho před podáním.',
      },
      '12m': {
        serving:
          'Batole jí eidam nakrájený na tenké proužky nebo nastrouhaný. Kostky sýra do ruky nedávej ani teď, proužek je bezpečnější tvar, protože se dá rozkousat po délce.',
        caution: 'Tavené sýry mají ještě víc soli, nejsou lepší volbou.',
      },
    },
    prepIdeas: [
      'nastrouhaný do dušené zeleniny',
      'zapečený v bramborové kaši',
      'proužky ke svačině po prvním roce',
      'vmíchaný do těstovin',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_YOUNG_CHILDREN],
    reviewStatus: 'verified',
  },
  {
    id: 'gouda',
    nameCz: 'gouda',
    altNamesCz: ['goudský sýr'],
    category: 'mlecne-vejce',
    emoji: '🧀',
    allergens: ['mleko'],
    isKeyAllergen: true,
    chokingRisk: 'medium',
    chokingReason:
      'Gouda je polotvrdý sýr, který se v ústech ohřeje a slepí do jednoho plastického kusu držícího tvar.',
    hazards: ['sul'],
    hazardNotes: {
      sul: 'Gouda zraje v solné lázni, takže obsah soli je srovnatelný s ostatními zrajícími sýry. Čím déle sýr zraje, tím je slanější, proto pro dítě vybírej mladé varianty a podávej je v malém množství.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Goudu nastrouhej a vmíchej ji do teplé zeleniny nebo do kaše, kde se rozpustí. Mladá gouda je jemnější a méně slaná než vyzrálá, proto sáhni po mladém sýru.',
        caution: 'Plátky sýra v téhle fázi nepodávej, slepí se v ústech.',
      },
      '9m': {
        serving:
          'Nastrouhanou goudu zapeč do zeleninové placky nebo ji posyp na těstoviny. Sýr dodá vápník a bílkoviny a zároveň zvýrazní chuť jídla, které jinak nesolíš.',
        caution: 'Sýr na těstovinách stačí posypat, ne zasypat.',
      },
      '12m': {
        serving:
          'Batole jí goudu v tenkých proužcích nebo nastrouhanou na jídle. V rodině se hodí jako sýr, který mají rádi dospělí i dítě, takže se nemusí kupovat dva druhy.',
        caution: 'Uzené varianty goudy jsou slanější, pro dítě je nekupuj.',
      },
    },
    prepIdeas: [
      'nastrouhaná na těstoviny',
      'zapečená v zeleninové placce',
      'rozpuštěná v bramborové kaši',
      'proužky ke svačině po prvním roce',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_10_12M],
    reviewStatus: 'verified',
  },
  {
    id: 'emental',
    nameCz: 'ementál',
    altNamesCz: ['ementálský sýr', 'sýr s oky'],
    category: 'mlecne-vejce',
    emoji: '🧀',
    allergens: ['mleko'],
    isKeyAllergen: true,
    chokingRisk: 'medium',
    chokingReason:
      'Ementál je tvrdý a pružný zároveň, ukousnutý kus si drží tvar a jeho hladké stěny se v hrdle nezachytí o nic.',
    hazards: ['sul', 'nepasterizovane'],
    hazardNotes: {
      sul: 'Ementál je dlouho zrající tvrdý sýr a jeho obsah soli je vyšší než u čerstvých sýrů. Pro dítě do prvního roku ho používej jen nastrouhaný jako dochucení, ne jako samostatnou porci.',
      nepasterizovane:
        'Švýcarský Emmentaler AOP se vyrábí ze syrového mléka, zatímco běžný ementál z českých mlékáren bývá z pasterizovaného. NHS sýry z nepasterizovaného mléka malým dětem nedoporučuje, takže si druh ověř na obalu a při pochybnosti sýr do jídla zapeč.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Ementál nastrouhej na jemném struhadle a vmíchej ho do teplé bramborové nebo zeleninové kaše. Výrazná chuť znamená, že stačí lžička, aby celé jídlo dostalo jinou dimenzi.',
        caution: 'Velká oka v sýru nejsou důvod ke krájení na kostky.',
      },
      '9m': {
        serving:
          'Nastrouhaný ementál zapeč do zeleninového suflé nebo ho vmíchej do těstovin. Sýr dodá vápník, jehož potřeba s růstem kostí stoupá, a zároveň zvýrazní chuť neslaného jídla.',
        caution: 'Zapečený sýr může být velmi horký, nech ho odstát.',
      },
      '12m': {
        serving:
          'Batole jí ementál nakrájený na tenké proužky nebo nastrouhaný na jídle. Nikdy mu nedávej kostku sýra do ruky, tvrdý pružný tvar patří mezi rizikové i po prvním roce.',
        caution: 'Sýrové tyčinky z obchodu bývají hodně slané.',
      },
    },
    prepIdeas: [
      'nastrouhaný do bramborové kaše',
      'zapečený v zeleninovém suflé',
      'vmíchaný do těstovin',
      'proužky ke svačině po prvním roce',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_YOUNG_CHILDREN],
    reviewStatus: 'verified',
  },
  {
    id: 'parmazan',
    nameCz: 'parmazán',
    altNamesCz: ['parmigiano reggiano'],
    category: 'mlecne-vejce',
    emoji: '🧀',
    allergens: ['mleko'],
    isKeyAllergen: true,
    chokingRisk: 'medium',
    chokingReason:
      'Parmazán se láme na tvrdé ostré úlomky s hranami, které dásně nerozdrtí a které se zabodnou do sliznice.',
    hazards: ['sul', 'nepasterizovane'],
    hazardNotes: {
      sul: 'Parmazán je jedním z nejslanějších sýrů vůbec, protože zraje v solné lázni dlouhé měsíce. Pro dítě do prvního roku platí, že se používá jen jako špetka nastrouhaného sýra na dochucení, ne jako složka porce.',
      nepasterizovane:
        'Parmigiano Reggiano se podle své receptury vyrábí ze syrového mléka a NHS doporučuje sýry z nepasterizovaného mléka malým dětem nedávat kvůli listeriím. Před nákupem si tedy na obalu ověř, že jde o sýr z pasterizovaného mléka; pokud to na etiketě není, nech ho jen pro dospělé nebo ho použij zapečený v hotovém pokrmu.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Parmazán nastrouhej najemno a posyp jím teplé jídlo, roztaví se a chuť se rozloží do celé porce. Úlomky ani kousky sýra dítěti nedávej, jsou tvrdé a mají ostré hrany.',
        caution: 'Parmazán se vyrábí se živočišným syřidlem, pro maminku není vhodný.',
      },
      '9m': {
        serving:
          'Jemně nastrouhaný parmazán dodá chuť zeleninové omáčce i rizotu. Protože je výrazně slaný, používej ho jako koření, tedy po špetkách, a ostatní složky jídla nedochucuj.',
        caution: 'V bezmasé variantě jídla ho nahraď sýrem bez živočišného syřidla.',
      },
      '12m': {
        serving:
          'Batole jí parmazán nastrouhaný na těstovinách nebo v polévce. V domácnosti s vegetariánskou maminkou ho drž v samostatné krabičce, aby se nepletl se sýry vhodnými pro ni.',
        caution: 'Hotové strouhané směsi obsahují protispékavé látky.',
      },
    },
    prepIdeas: [
      'špetka nastrouhaná na těstoviny',
      'vmíchaný do rizota',
      'zapečený v zeleninovém gratinu',
      'posypaný na zeleninovou polévku',
    ],
    seasonCz: [],
    vegetarian: false,
    sources: [NHS_AVOID, NHS_YOUNG_CHILDREN],
    reviewStatus: 'verified',
  },
  {
    id: 'pecorino',
    nameCz: 'pecorino',
    altNamesCz: ['pecorino romano', 'ovčí tvrdý sýr'],
    category: 'mlecne-vejce',
    emoji: '🧀',
    allergens: ['mleko'],
    isKeyAllergen: true,
    chokingRisk: 'medium',
    chokingReason:
      'Pecorino je velmi tvrdý ovčí sýr, jehož odlomený kus zůstane v ústech celý a jeho hrany jsou ostré jako u parmazánu.',
    hazards: ['sul', 'nepasterizovane'],
    hazardNotes: {
      sul: 'Pecorino romano patří mezi nejslanější sýry na trhu, sůl je u něj součástí technologie zrání. Pro dítě do prvního roku se hodí nanejvýš jako špetka na dochucení hotového jídla.',
      nepasterizovane:
        'Pecorino romano se tradičně vyrábí ze syrového ovčího mléka a NHS sýry z nepasterizovaného mléka malým dětem nedoporučuje. Na obalu si proto ověř pasterizaci; sýr bez tohoto údaje dítěti nedávej nastrouhaný nastudeno, jen tepelně zpracovaný v pokrmu.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Pecorino používej jen nastrouhané a v opravdu malém množství na teplé jídlo. Jeho chuť je ostřejší než u parmazánu, takže i špetka výrazně změní charakter celé porce.',
        caution: 'Pecorino se vyrábí se živočišným syřidlem, maminka ho nejí.',
      },
      '9m': {
        serving:
          'Nastrouhané pecorino se hodí do zeleninových omáček, kde nahradí chybějící sůl. Kvůli výraznosti ho dávkuj po malých špetkách a ostatní složky jídla už nedochucuj.',
        caution: 'Pro bezmasou verzi jídla sáhni po sýru bez živočišného syřidla.',
      },
      '12m': {
        serving:
          'Batole jí pecorino nastrouhané na těstovinách nebo v zapečené zelenině. Kvůli vysokému obsahu soli zůstává spíš kořením než běžnou složkou jídelníčku.',
        caution: 'Mladé pecorino je jemnější než dlouho zrající romano.',
      },
    },
    prepIdeas: [
      'špetka na teplé těstoviny',
      'vmíchané do zeleninové omáčky',
      'zapečené v gratinu',
      'posypané na pečenou zeleninu',
    ],
    seasonCz: [],
    vegetarian: false,
    sources: [NHS_AVOID, NHS_YOUNG_CHILDREN],
    reviewStatus: 'verified',
  },
  {
    id: 'grana-padano',
    nameCz: 'grana padano',
    altNamesCz: ['grana'],
    category: 'mlecne-vejce',
    emoji: '🧀',
    allergens: ['mleko'],
    isKeyAllergen: true,
    chokingRisk: 'medium',
    chokingReason:
      'Grana padano má zrnitou strukturu, která se při ukousnutí rozpadne na tvrdé krystalické kousky s ostrými hranami.',
    hazards: ['sul', 'nepasterizovane'],
    hazardNotes: {
      sul: 'Grana padano zraje v solné lázni podobně jako parmazán, takže je také výrazně slaný. Pro dítě do prvního roku ho používej jen jako nastrouhané dochucení, nikdy jako samostatné sousto.',
      nepasterizovane:
        'Grana padano se vyrábí ze syrového mléka stejně jako parmazán a NHS doporučuje sýry z nepasterizovaného mléka malým dětem vynechat. Zkontroluj etiketu a bez údaje o pasterizaci ho použij jen zapečený, ne nastrouhaný na hotové jídlo.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Grana padano nastrouhej najemno a vmíchej do teplého zeleninového pyré. Chuť je o něco mírnější než u parmazánu, obsah soli je ale srovnatelný, proto zůstaň u malého množství.',
        caution: 'Grana padano se vyrábí se živočišným syřidlem.',
      },
      '9m': {
        serving:
          'Nastrouhaný sýr posyp na dušenou zeleninu nebo na rizoto. Dítě tím dostane vápník a zvýrazněnou chuť jídla, které jinak nesolíš vůbec.',
        caution: 'Do bezmasé varianty pokrmu ho nedávej, není vegetariánský.',
      },
      '12m': {
        serving:
          'Batole jí grana padano nastrouhané na jídle nebo v polévce. Kůrku ze sýra můžeš přidat do polévky pro chuť, ale před podáním ji vždy vyndej, je tvrdá a nepoživatelná.',
        caution: 'Kůrku po vyvaření vyhoď, batole si ji jinak vezme.',
      },
    },
    prepIdeas: [
      'nastrouhané do zeleninového pyré',
      'posypané na rizoto',
      'kůrka vyvařená v polévce a vyndaná',
      'zapečené se zeleninou',
    ],
    seasonCz: [],
    vegetarian: false,
    sources: [NHS_AVOID, NHS_YOUNG_CHILDREN],
    reviewStatus: 'verified',
  },
  {
    id: 'zerve',
    nameCz: 'žervé',
    altNamesCz: ['čerstvý smetanový sýr', 'žervé přírodní'],
    category: 'mlecne-vejce',
    emoji: '🧀',
    allergens: ['mleko'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: ['sul'],
    hazardNotes: {
      sul: 'Čerstvé smetanové sýry se při výrobě solí, takže i přes jemnou chuť obsahují víc soli než tvaroh. Ochucené varianty s bylinkami nebo se zeleninou mají soli ještě víc, proto pro dítě vybírej čistou.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Žervé rozetři v tenké vrstvě na prst chleba nebo ho vmíchej do zeleninového pyré. Krémová struktura se dobře polyká, ale kvůli soli zůstaň u tenké vrstvy, ne u silné nálože.',
        caution: 'Ochucené varianty obsahují víc soli, kupuj přírodní.',
      },
      '9m': {
        serving:
          'Smíchej žervé s nastrouhanou okurkou nebo s bylinkami a udělej z něj pomazánku. Dítě se u ní naučí mazat a zároveň dostane bílkoviny i vápník v přijatelné podobě.',
        caution: 'Tvaroh je z hlediska soli lepší základ pomazánky.',
      },
      '12m': {
        serving:
          'Batole jí žervé na chlebu, v zapečené zelenině i jako zjemnění omáčky. V kombinaci se sýrem v jiném jídle téhož dne hlídej celkový příjem soli.',
        caution: 'Otevřené balení spotřebuj do pěti dnů.',
      },
    },
    prepIdeas: [
      'tenká vrstva na prst chleba',
      'pomazánka s nastrouhanou okurkou',
      'zjemnění zeleninové omáčky',
      'vmíchané do bramborové kaše',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_YOUNG_CHILDREN],
    reviewStatus: 'verified',
  },
  {
    id: 'maslo',
    nameCz: 'máslo',
    altNamesCz: ['čerstvé máslo'],
    category: 'mlecne-vejce',
    emoji: '🧈',
    allergens: ['mleko'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Kousek másla vmíchej do zeleninového pyré nebo do kaše, dodá energii a zjemní chuť. Malé děti potřebují v malém objemu hodně energie, takže tuk v jídle je pro ně žádoucí.',
        caution: 'Vybírej nesolené máslo, solené zvyšuje denní příjem soli.',
      },
      '9m': {
        serving:
          'Tenká vrstva másla na prstu chleba pomáhá, aby se sousto lépe polykalo. Na másle můžeš krátce opéct zeleninu nebo maso, čímž se z nich uvolní chuť bez dochucování.',
        caution: 'Máslo se na pánvi rychle připaluje, hlídej teplotu.',
      },
      '12m': {
        serving:
          'Batole jí máslo na pečivu, v kaši i v pečení. Rostlinné margaríny nejsou pro malé dítě lepší volbou, máslo je jednodušší surovina s kratším složením.',
        caution: 'Máslo v teple žlukne, skladuj ho v lednici.',
      },
    },
    prepIdeas: [
      'vmíchané do zeleninového pyré',
      'tenká vrstva na prstu chleba',
      'na opečení zeleniny',
      'do domácího pečení',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_YOUNG_CHILDREN, NHS_AVOID],
    reviewStatus: 'verified',
  },
  {
    id: 'ghi',
    nameCz: 'ghí',
    altNamesCz: ['přepuštěné máslo', 'ghee'],
    category: 'mlecne-vejce',
    emoji: '🧈',
    allergens: ['mleko'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Ghí je máslo zbavené vody a mléčných zbytků, takže snese vyšší teplotu a nepřipaluje se. Lžičku vmíchej do zeleninové kaše, dodá energii a jemně máslovou chuť bez soli.',
        caution: 'Ani ghí není zcela bez mléčné bílkoviny, u alergie na mléko ho vynech.',
      },
      '9m': {
        serving:
          'Na ghí osmaž kořenovou zeleninu nebo na něm krátce opeč maso. Snáší vyšší teplotu než máslo, takže se nepřipaluje a v jídle nezůstane hořká chuť ze spálených zbytků.',
        caution: 'Ghí je čistý tuk, používej ho po lžičkách.',
      },
      '12m': {
        serving:
          'Batoleti slouží ghí k opékání, do kaší i do indických pokrmů, kam tradičně patří. Vydrží při pokojové teplotě měsíce, což se hodí na cesty i na chalupu bez lednice.',
        caution: 'Domácí ghí musí být zcela čiré, jinak se kazí.',
      },
    },
    prepIdeas: [
      'lžička do zeleninové kaše',
      'na osmažení kořenové zeleniny',
      'do kari se zeleninou',
      'na opečení placek',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_YOUNG_CHILDREN, NHS_ALLERGY],
    reviewStatus: 'verified',
  },
  {
    id: 'smetana-ke-slehani',
    nameCz: 'smetana ke šlehání',
    altNamesCz: ['šlehačka', 'smetana 33 %'],
    category: 'mlecne-vejce',
    emoji: '🥛',
    allergens: ['mleko'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Smetanu používej jako složku vaření, tedy lžíci do zeleninové polévky nebo do omáčky. Ušlehanou šlehačku dítěti nenabízej, obvykle se sladí a samotný nadýchaný tuk nemá výživovou hodnotu.',
        caution: 'Smetana musí být z pasterizovaného mléka.',
      },
      '9m': {
        serving:
          'Lžíce smetany zjemní ostřejší chuť brokolice nebo květáku a zvýší energetickou hodnotu jídla. Při vaření ji přidávej až na konec a nenech ji prudce povařit, aby se nesrazila.',
        caution: 'Šlehačka ve spreji obsahuje sladkou složku i stabilizátory.',
      },
      '12m': {
        serving:
          'Batoleti může smetana zjemnit polévku, omáčku i ovocný dezert bez slazení. Ušlehaná neslazená smetana s ovocným pyré je jednoduchá svačina pro celou rodinu.',
        caution: 'Otevřenou smetanu spotřebuj do tří dnů.',
      },
    },
    prepIdeas: [
      'lžíce do zeleninové polévky',
      'zjemnění omáčky k těstovinám',
      'ušlehaná bez slazení s ovocem',
      'do zapečené zeleniny',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_YOUNG_CHILDREN, NHS_AVOID_WEANING],
    reviewStatus: 'verified',
  },
  {
    id: 'zakysana-smetana',
    nameCz: 'zakysaná smetana',
    altNamesCz: ['smetana zakysaná', 'kysaná smetana'],
    category: 'mlecne-vejce',
    emoji: '🥛',
    allergens: ['mleko'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Zakysaná smetana má kyselejší chuť než sladká a hodí se k zahuštění zeleninových pokrmů. Lžíci vmíchej do teplého pyré až mimo plotnu, aby se kysaný výrobek nesrazil.',
        caution: 'Při vysoké teplotě se sráží, přidávej ji až nakonec.',
      },
      '9m': {
        serving:
          'Ze zakysané smetany a bylinek udělej dip, do kterého dítě namáčí zeleninové hranolky. Namáčení je pro ni zábava a zároveň se tím učí koordinaci ruky a úst.',
        caution: 'Kyselá chuť nemusí sednout napoprvé, nabídni ji znovu.',
      },
      '12m': {
        serving:
          'Batole jí zakysanou smetanu v omáčkách, v dipech i na bramborách. V rodinném vaření nahradí majonézu, která pro malé dítě není kvůli syrovému vejci vhodná.',
        caution: 'Majonézu domácí ani kupovanou dítěti nedávej.',
      },
    },
    prepIdeas: [
      'bylinkový dip k zeleninovým hranolkům',
      'zahuštění zeleninové omáčky',
      'na pečené brambory',
      'vmíchaná do kaše z kořenové zeleniny',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_YOUNG_CHILDREN, NHS_AVOID],
    reviewStatus: 'verified',
  },
  {
    id: 'kravske-mleko',
    nameCz: 'kravské mléko',
    altNamesCz: ['plnotučné mléko', 'čerstvé mléko'],
    category: 'mlecne-vejce',
    emoji: '🥛',
    allergens: ['mleko'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: ['nepasterizovane'],
    hazardNotes: {
      nepasterizovane:
        'Nepasterizované mléko z automatu nebo přímo od farmáře může obsahovat listerie a další bakterie, na které je malé dítě citlivé. Pro dítě používej výhradně pasterizované mléko, a to i tehdy, když ho budeš vařit.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Plnotučné pasterizované mléko se od šesti měsíců používá do vaření, tedy do kaše, do omáčky nebo do pečení. Jako nápoj se nepodává až do prvního roku kvůli nízkému obsahu železa.',
        caution: 'Mléko nesmí nahradit mateřské ani umělé mléko jako hlavní nápoj.',
      },
      '9m': {
        serving:
          'Mléko dál používej ve vaření, v kaši i v pomazánkách, ale ne do lahve nebo hrnku. K pití patří v tomhle věku voda a mléko mateřské nebo umělé, které dítěti dodá dost železa.',
        caution: 'Rostlinné nápoje nejsou pro miminko náhradou mléka.',
      },
      '12m': {
        serving:
          'Po prvním roce může batole pít plnotučné pasterizované mléko jako hlavní nápoj. Do dvou let se doporučuje plnotučné, protože dítě potřebuje tuk pro růst a vývoj nervové soustavy.',
        caution: 'Nadbytek mléka snižuje chuť k jídlu a zásoby železa.',
      },
    },
    prepIdeas: [
      'do mléčné kaše',
      'základ bešamelu bez soli',
      'do domácího pečení',
      'k rozředění hustého tvarohu',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_DRINKS, NHS_AVOID],
    reviewStatus: 'verified',
  },
  {
    id: 'vejce-slepici',
    nameCz: 'vejce slepičí',
    altNamesCz: ['slepičí vejce', 'vajíčko'],
    category: 'mlecne-vejce',
    emoji: '🥚',
    allergens: ['vejce'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: ['syrove'],
    hazardNotes: {
      syrove:
        'Syrové a nedovařené vejce nese riziko salmonelózy, na kterou je malé dítě citlivější než dospělý. Pro dítě proto vejce vždy provař tak, aby bílek i žloutek byly úplně pevné, a vynech majonézu, tiramisu i syrové těsto.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Vejce uvař natvrdo, oloupej a nakrájej na dlouhé díly nebo rozmačkej se lžičkou jogurtu. Vejce je jedním z klíčových alergenů a jeho časné zavedení se pojí s nižším rizikem alergie.',
        caution: 'Podávej ho dopoledne a další dva dny nezaváděj nový alergen.',
      },
      '9m': {
        serving:
          'Z dobře provařeného vejce udělej omeletu nebo míchaná vajíčka nakrájená na proužky. Dítě je uchopí prsty a zvládne je rozmělnit dásněmi, protože struktura je měkká.',
        caution: 'Míchaná vajíčka musí být pevná, ne tekutá.',
      },
      '12m': {
        serving:
          'Batole jí vejce natvrdo, v omeletě i v pečení. Pravidelná konzumace už zavedeného alergenu je důležitá, jednorázová ochutnávka toleranci neudrží a je potřeba ji opakovat.',
        caution: 'Při podezření na reakci se vždy obrať na pediatra.',
      },
    },
    prepIdeas: [
      'uvařené natvrdo na díly',
      'omeleta se strouhanou cuketou',
      'míchaná vajíčka nakrájená na proužky',
      'do celozrnných placek',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_ALLERGY, NHS_AVOID],
    reviewStatus: 'verified',
  },
];
