import type { Ingredient } from '@/types';
import {
  NHS_CHOKING,
  MZCR_COMPLEMENTARY,
  NHS_10_12M,
  NHS_6M,
  NHS_7_9M,
  NHS_ALLERGY,
  NHS_AVOID,
  NHS_AVOID_WEANING,
  NHS_DRINKS,
  NHS_FIRST_FOODS,
  NHS_PREP_SAFELY,
  NHS_YOUNG_CHILDREN,
  WHO_COMPLEMENTARY,
} from './_sources';

/**
 * Kategorie „ovoce" podle docs/SUROVINY-SEZNAM.md (36 položek).
 *
 * Kulaté ovoce (hrozny, borůvky, rybíz, angrešt, třešně, višně) má vysoké
 * riziko dušení a ve fázích 6m i 9m explicitní pokyn ke krájení podélně na
 * čtvrtky — vyžaduje to pravidlo `round-food-shape`.
 */
export const fruits: Ingredient[] = [
  {
    id: 'jablko',
    nameCz: 'jablko',
    altNamesCz: ['jablka', 'jabko'],
    category: 'ovoce',
    servingForm: 'kusove',
    emoji: '🍎',
    icon: 'jablko',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'high',
    chokingReason:
      'Syrové jablko je tak tvrdé, že se z něj ukusují úlomky, které dásně nerozmělní a které se vejdou celé do hrdla.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Oloupej, vykroj jádřinec a nakrájej na silnější měsíčky. Duš v páře nebo upeč doměkka, dokud plátek nejde rozmáčknout mezi dvěma prsty. Syrové jablko v téhle fázi nenabízej vůbec.',
        caution: 'Měkkost zkoušej vždy až po vychladnutí, horký plátek se zdá tužší, než ve skutečnosti je.',
      },
      '9m': {
        serving:
          'Vařené měsíčky nechávej hrubší, ať se dítě učí kousat dásněmi. Jemně nastrouhaná syrová dužina je v tomhle věku také v pořádku, ale samostatné plátky syrového jablka ještě ne.',
        caution: 'Strouhat začni těsně před podáním, nastrouhané jablko rychle zhnědne a ztrácí chuť.',
      },
      '12m': {
        serving:
          'Tenké syrové plátky bez slupky většina batolat zvládne, pokud u jídla sedí a nikam nespěchá. Celé jablko do ruky nedávej ani teď, dítě z něj ukousne velký tvrdý kus.',
        caution: 'Slupku přidávej postupně, až když dítě spolehlivě žvýká.',
      },
    },
    prepIdeas: [
      'měsíčky upečené se skořicí',
      'dušené pyré vmíchané do ovesné kaše',
      'nastrouhané syrové do bílého jogurtu',
      'kousky zapečené v ovesné placce',
    ],
    seasonCz: [8, 9, 10, 11, 12, 1, 2, 3],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
  {
    id: 'hruska',
    nameCz: 'hruška',
    altNamesCz: ['hrušky'],
    category: 'ovoce',
    servingForm: 'kusove',
    emoji: '🍐',
    icon: 'hruska',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Nezralá hruška zůstává tvrdá a její povrch je kluzký, takže ukousnutý kus sklouzne dozadu dřív, než ho dítě stihne rozžvýkat.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Vyber dobře uzrálou hrušku, která povolí pod palcem. Oloupej ji, zbav jádřince a podávej v dlouhých dílech, které dítě sevře v pěsti. Tvrdší kus krátce podus, ať změkne skrz naskrz.',
        caution: 'Kompotovaná hruška ze sklenice bývá slazená, do prvního roku sáhni po čerstvé.',
      },
      '9m': {
        serving:
          'Zralou hrušku už můžeš podat i syrovou, oloupanou a rozdělenou na menší díly velikosti sousta. Pokud jsou plody tvrdé, nech je den dva dozrát na kuchyňské lince.',
        caution: 'Hruška působí projímavě, při řidší stolici ubírej množství.',
      },
      '12m': {
        serving:
          'Batole zvládne hrušku i se slupkou nakrájenou na kostky. Nechej ji sedět a jíst v klidu, kluzké kousky se v běhu snadno vdechnou.',
        caution: 'Sušené hruškové plátky jsou tuhé a lepivé, sekej je nadrobno.',
      },
    },
    prepIdeas: [
      'krátce podušená na měkké díly',
      'rozmačkaná vidličkou do tvarohu',
      'pečená v troubě do měkka',
      'rozmixovaná s ovesnými vločkami',
    ],
    seasonCz: [8, 9, 10, 11],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, MZCR_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'banan',
    nameCz: 'banán',
    altNamesCz: ['banány'],
    category: 'ovoce',
    servingForm: 'kusove',
    emoji: '🍌',
    icon: 'banan',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Oloupej jen horní třetinu a nech spodek ve slupce jako držadlo, dítě pak drží banán jako zmrzlinu. Druhá varianta je půlka rozříznutá po délce, kterou sevře v pěsti.',
        caution: 'Zcela zralý banán klouže, proto ho můžeš obalit v jemných mletých vločkách pro lepší úchop.',
      },
      '9m': {
        serving:
          'Banán nakrájej na kolečka o síle prstu a každé ještě rozpul, aby netvořilo souvislý kotouč. Dítě už si kousky bere klešťovým úchopem mezi palec a ukazovák.',
        caution: 'Nedozrálý banán je svíravý a tuhý, počkej, až slupka dostane tmavé tečky.',
      },
      '12m': {
        serving:
          'Batole jí banán nakrájený na kostky nebo ukusuje z oloupané půlky. Je to ideální jídlo na cesty, ale i teď platí, že se jí vsedě, ne za chůze.',
        caution: 'Banán rychle hnědne, na svačinu ho zabal vcelku a oloupej až na místě.',
      },
    },
    prepIdeas: [
      'rozmačkaný do ovesné kaše',
      'zapečený v lívanci bez přidané sladké složky',
      'nakrájený a obalený v mletých lněných semínkách',
      'rozmixovaný s jogurtem na hustý krém',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, NHS_6M],
    reviewStatus: 'verified',
  },
  {
    id: 'avokado',
    nameCz: 'avokádo',
    altNamesCz: ['avokáda'],
    category: 'ovoce',
    servingForm: 'kusove',
    emoji: '🥑',
    icon: 'avokado',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Zralé avokádo rozkroj, vyjmi pecku a dužinu nakrájej na dlouhé měkké dílky. Kluzký povrch vyřeší obalení v jemných mletých ovesných vločkách, dítě pak dílek udrží v dlani.',
        caution: 'Tvrdé avokádo nechej dozrát v papírovém sáčku, tvrdá dužina se špatně mačká.',
      },
      '9m': {
        serving:
          'Nakrájej dužinu na kostky velikosti sousta nebo ji rozmačkej vidličkou a nabídni na prstu pečiva. V tomhle věku už dítě zvládne nabírat i lžící, když je pyré dost husté.',
        caution: 'Rozříznuté avokádo rychle tmavne, pokap ho kapkou citronové šťávy.',
      },
      '12m': {
        serving:
          'Batole si avokádo namaže samo na chleba nebo jí kostky ze společného talíře. Dobře se hodí i do studených pomazánek, které zůstávají krémové bez dalšího tuku.',
        caution: 'Pecku a slupku vždy vyhazuj hned, tvrdá pecka je pro dítě nebezpečná.',
      },
    },
    prepIdeas: [
      'rozmačkané na prst toastu',
      'kostky obalené v mletých ovesných vločkách',
      'rozmixované s banánem na krém',
      'vmíchané do bílého jogurtu jako dip',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, WHO_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'svestka',
    nameCz: 'švestka',
    altNamesCz: ['švestky', 'blumy'],
    category: 'ovoce',
    servingForm: 'kusove',
    emoji: '🫐',
    icon: 'svestka',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Uvnitř je tvrdá pecka, která se při ukousnutí uvolní celá, a slupka se v ústech sloupne do pevného kroužku.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Vypeckuj, oloupej a nakrájej na dlouhé dílky. Tvrdší plody krátce spař a slupku stáhni, pak stačí dužinu rozmačkat vidličkou na hrubé pyré, které dítě olizuje z prstů.',
        caution: 'Pecku odstraň ještě v kuchyni, ne až na dětském talíři.',
      },
      '9m': {
        serving:
          'Zralou vypeckovanou švestku podávej v osminkách i se slupkou, pokud je tenká. Dítě si dílek nabere klešťovým úchopem, tuhá slupka se dá po uvaření snadno oddělit.',
        caution: 'Švestky povzbuzují trávení, začni dvěma kusy denně.',
      },
      '12m': {
        serving:
          'Batole zvládne vypeckovanou švestku rozčtvrcenou i se slupkou. Sušená švestka je tuhá a lepivá, tu nabízej jen nasekanou nadrobno a namočenou v teplé vodě.',
        caution: 'Nikdy nedávej celý plod s peckou do ruky.',
      },
    },
    prepIdeas: [
      'krátce podušená bez sladké složky',
      'pečená s tvarohem jako svačina',
      'rozmačkaná do kaše z jáhel',
      'zapečená ve špaldovém lívanci',
    ],
    seasonCz: [8, 9, 10],
    vegetarian: true,
    sources: [NHS_PREP_SAFELY, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
  {
    id: 'merunka',
    nameCz: 'meruňka',
    altNamesCz: ['meruňky'],
    category: 'ovoce',
    servingForm: 'kusove',
    emoji: '🍑',
    icon: 'merunka',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Pecka meruňky má hladké hrany a když se uvolní z dužiny, dítě ji nedokáže vyplivnout ani rozmělnit.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Meruňku rozlom, vyjmi pecku a slupku stáhni po krátkém spaření. Měkkou dužinu podávej v půlkách položených řezem dolů, aby se nekutálely, nebo rozmačkanou na lžíci.',
        caution: 'Nezralé meruňky jsou kyselé a tuhé, dítěti je nenabízej.',
      },
      '9m': {
        serving:
          'Vypeckovanou meruňku krájej na proužky, které dítě uchopí mezi prsty. Slupku už můžeš nechat, pokud je plod měkký a slupka se při zmáčknutí trhá.',
        caution: 'Meruňky z kompotu bývají ve sladkém nálevu, vybírej čerstvé.',
      },
      '12m': {
        serving:
          'Batole jí vypeckované meruňkové půlky ze společné mísy. Sušené meruňky drž zvlášť, jsou tuhé a lepí se na patro, patří jen nasekané nadrobno.',
        caution: 'Zkontroluj, že v míse nezůstala žádná pecka.',
      },
    },
    prepIdeas: [
      'rozmačkaná do tvarohu',
      'krátce zapečená v troubě',
      'rozmixovaná na husté pyré',
      'nakrájená do ovesné kaše',
    ],
    seasonCz: [7, 8],
    vegetarian: true,
    sources: [NHS_PREP_SAFELY, MZCR_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'broskev',
    nameCz: 'broskev',
    altNamesCz: ['broskve'],
    category: 'ovoce',
    servingForm: 'kusove',
    emoji: '🍑',
    icon: 'broskev',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Chlupatá slupka se v ústech svine do pevného útržku a pecka bývá k dužině přirostlá, takže se uvolní až v puse.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Broskev spař vroucí vodou, slupku stáhni a dužinu odkroj od pecky. Podávej v širokých měkkých dílech, které dítě drží v pěsti, nebo rozmačkané vidličkou do hrubého pyré.',
        caution: 'Chlupatou slupku v téhle fázi vždy odstraň, dráždí patro.',
      },
      '9m': {
        serving:
          'Oloupanou broskev krájej na kostky velikosti sousta. Dítě už si je nabírá prsty a učí se je posouvat do strany k dásním, kde je rozmačká.',
        caution: 'Velmi šťavnaté plody kloužou, podávej je v mělké misce.',
      },
      '12m': {
        serving:
          'Batoleti nabídni broskvové měsíčky i se slupkou, pokud je zralá a tenká. Ke snídani se hodí nakrájené do kaše, kde nahradí jakoukoli sladkou přísadu.',
        caution: 'Pecku vyhoď hned, batole ji zvedne z talíře.',
      },
    },
    prepIdeas: [
      'oloupaná a rozmačkaná do jogurtu',
      'krátce podušená na měsíčky',
      'pečená v troubě s tvarohem',
      'rozmixovaná do ovesné kaše',
    ],
    seasonCz: [7, 8, 9],
    vegetarian: true,
    sources: [NHS_PREP_SAFELY, NHS_7_9M],
    reviewStatus: 'verified',
  },
  {
    id: 'nektarinka',
    nameCz: 'nektarinka',
    altNamesCz: ['nektarinky'],
    category: 'ovoce',
    servingForm: 'kusove',
    emoji: '🍑',
    icon: 'nektarinka',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Hladká slupka nektarinky se při ukousnutí oddělí v celku a sklouzne dozadu, pecka navíc zůstává v dužině.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Zralou nektarinku oloupej, vypeckuj a rozřež na dlouhé měkké proužky. Pokud je dužina tuhá, nech ji tři minuty v páře, ať povolí a nechá se rozmáčknout mezi prsty.',
        caution: 'Tvrdá nektarinka z lednice se do téhle fáze nehodí.',
      },
      '9m': {
        serving:
          'Nakrájej vypeckovanou dužinu na kostky a nech dítě, ať si je sbírá z podložky. Slupku můžeš ponechat, pokud se dá zmáčknutím protrhnout nehtem.',
        caution: 'Šťáva barví oblečení, počítej s bryndákem s rukávy.',
      },
      '12m': {
        serving:
          'Batole jí nektarinku v měsíčcích jako součást svačiny. Hodí se i do salátu s tvarohem, kde nahradí jakoukoli sladkou přísadu a přidá vitamin C.',
        caution: 'Sleduj, jestli si dítě nestrká do pusy víc kousků najednou.',
      },
    },
    prepIdeas: [
      'proužky v páře do měkka',
      'kostky do bílého jogurtu',
      'rozmačkaná s banánem',
      'zapečená s ovesnými vločkami',
    ],
    seasonCz: [7, 8, 9],
    vegetarian: true,
    sources: [NHS_PREP_SAFELY, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
  {
    id: 'tresne',
    nameCz: 'třešně',
    altNamesCz: ['třešeň'],
    category: 'ovoce',
    servingForm: 'drobne',
    emoji: '🍒',
    icon: 'tresne',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'high',
    chokingReason:
      'Celá třešně má průměr odpovídající dýchacím cestám malého dítěte a uvnitř je tvrdá pecka, která je uzavře úplně.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Třešni vždy nejdřív vyjmi pecku. Potom ji rozkroj podélně na čtvrtky, aby žádný díl nemohl utěsnit dýchací cesty, a dužinu ještě zlehka rozmáčkni vidličkou.',
        caution: 'Pecku odstraňuj vypeckovačem, prsty se snadno přehlédne.',
      },
      '9m': {
        serving:
          'I v tomhle věku platí pravidlo vypeckovat a krájet podélně na čtvrtky. Dítě už si díly nabírá samo, ale velikost sousta se proti fázi 6m nemění.',
        caution: 'Nikdy nenechávej misku celých třešní v dosahu dítěte.',
      },
      '12m': {
        serving:
          'Batoleti krájej vypeckované třešně alespoň na poloviny a dohlédni, že jí vsedě. Celý plod s peckou nepatří dětem ani po prvním roce.',
        caution: 'Naučte se doma pravidlo, že třešně nikdo nejí za chůze.',
      },
    },
    prepIdeas: [
      'vypeckované a podušené na kompot bez sladké složky',
      'rozmixované do jogurtu',
      'zapečené v ovesné kaši',
      'rozmačkané na tvaroh',
    ],
    seasonCz: [6, 7],
    vegetarian: true,
    sources: [NHS_PREP_SAFELY, NHS_AVOID],
    reviewStatus: 'verified',
  },
  {
    id: 'visne',
    nameCz: 'višně',
    altNamesCz: ['višeň'],
    category: 'ovoce',
    servingForm: 'drobne',
    emoji: '🍒',
    icon: 'visne',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'high',
    chokingReason:
      'Višně je stejně velká jako třešně a její pevná pecka uzavře dýchací cesty, i když je dužina měkká a šťavnatá.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Višně vypeckuj a rozřež podélně na čtvrtky. Kyselost změkči krátkým povařením s kouskem banánu, dítě pak přijme i výraznější chuť bez jakéhokoli slazení.',
        caution: 'Višňový kompot ze sklenice je slazený, do prvního roku ho vynech.',
      },
      '9m': {
        serving:
          'Vypeckované višně dál krájej podélně na čtvrtky a mísi je s jogurtem nebo kaší. Výrazná kyselost pomáhá dítěti rozšířit chuťový rejstřík mimo sladké ovoce.',
        caution: 'Zkontroluj každý plod, pecka se snadno přehlédne mezi dužinou.',
      },
      '12m': {
        serving:
          'Batole jí vypeckované višně nasekané na poloviny, nejčastěji zapečené v těstě nebo v kaši. Syrové višně jsou velmi kyselé, počítej s grimasou a nabídni je znovu jindy.',
        caution: 'Pecky sbírej z talíře průběžně, batole je zkouší.',
      },
    },
    prepIdeas: [
      'vypeckované a povařené s banánem',
      'zapečené ve špaldovém nákypu',
      'rozmixované do tvarohu',
      'podušené do jáhlové kaše',
    ],
    seasonCz: [6, 7, 8],
    vegetarian: true,
    sources: [NHS_PREP_SAFELY, NHS_AVOID],
    reviewStatus: 'verified',
  },
  {
    id: 'jahody',
    nameCz: 'jahody',
    altNamesCz: ['jahoda'],
    category: 'ovoce',
    servingForm: 'kusove',
    emoji: '🍓',
    icon: 'jahody',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Menší jahoda má tvar i průměr blízký hrdlu dítěte a její hladký povrch nedovolí dásním se do ní zakousnout.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Odstraň zelenou stopku a velkou jahodu rozřež podélně na čtvrtky, menší plody rozmačkej vidličkou. Dítě dužinu olizuje a cvičí si úchop, aniž by hrozilo celé sousto.',
        caution: 'Jahody dobře omyj, bývají na nich zbytky hlíny.',
      },
      '9m': {
        serving:
          'Nakrájej jahody na tenké plátky nebo na osminky. Dítě už je sbírá dvěma prsty a zvládne i větší kus, pokud není zachovaný celý tvar plodu.',
        caution: 'Po první ochutnávce sleduj kůži kolem úst, jahody dráždí mechanicky.',
      },
      '12m': {
        serving:
          'Batole jí jahody rozkrojené na poloviny nebo čtvrtky podle velikosti. Celé plody nechávej až do doby, kdy dítě spolehlivě žvýká a jí bez spěchu.',
        caution: 'Při prvním jaru bývají jahody z dovozu tvrdší a kyselejší.',
      },
    },
    prepIdeas: [
      'rozmačkané do bílého jogurtu',
      'rozmixované na ovocné pyré',
      'nakrájené do ovesné kaše',
      'zapečené v tvarohovém nákypu',
    ],
    seasonCz: [5, 6, 7],
    vegetarian: true,
    sources: [NHS_PREP_SAFELY, NHS_ALLERGY],
    reviewStatus: 'verified',
  },
  {
    id: 'boruvky',
    nameCz: 'borůvky',
    altNamesCz: ['borůvka', 'čučoriedky'],
    category: 'ovoce',
    servingForm: 'drobne',
    emoji: '🫐',
    icon: 'boruvky',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'high',
    chokingReason:
      'Celá borůvka je pevná bobule s hladkou slupkou, která nepraskne pod tlakem dásní a projde hrdlem vcelku.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Každou borůvku rozkroj podélně na čtvrtky, případně ji rozmačkej hřbetem vidličky, dokud slupka nepraskne. Rozmačkanou dužinu vmíchej do kaše nebo nabídni na lžíci.',
        caution: 'Celou borůvku nedávej do ruky za žádných okolností.',
      },
      '9m': {
        serving:
          'Pravidlo zůstává stejné, borůvky dál krájej podélně na čtvrtky nebo je mačkej. Dítě si je sbírá klešťovým úchopem, což je skvělý trénink jemné motoriky.',
        caution: 'Mražené borůvky nech rozmrznout, zmrzlá bobule je tvrdá jako kamínek.',
      },
      '12m': {
        serving:
          'Batoleti stačí borůvky rozpůlit. Celé plody nech až na dobu, kdy dítě bezpečně žvýká, u drobných bobulí to bývá kolem třetího roku.',
        caution: 'Borůvky barví stolici do tmava, není to důvod k obavám.',
      },
    },
    prepIdeas: [
      'rozmačkané do ovesné kaše',
      'rozmixované na pyré',
      'zapečené ve špaldovém lívanci',
      'vmíchané do bílého jogurtu',
    ],
    seasonCz: [7, 8, 9],
    vegetarian: true,
    sources: [NHS_PREP_SAFELY, NHS_AVOID],
    reviewStatus: 'verified',
  },
  {
    id: 'maliny',
    nameCz: 'maliny',
    altNamesCz: ['malina'],
    category: 'ovoce',
    servingForm: 'drobne',
    emoji: '🫐',
    icon: 'maliny',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Malina se v ústech sama rozpadne na drobné dílky, proto ji můžeš podat celou položenou na podložce. Pokud jsou plody velké, rozmáčkni je prstem, ať se dutina uvnitř otevře.',
        caution: 'Vybírej plody bez plísně, maliny se kazí během jednoho dne.',
      },
      '9m': {
        serving:
          'Nabídni celé maliny do klešťového úchopu, dítě si je bere po jedné a trénuje přesnost. Drobná jadérka projdou trávením beze změny a objeví se ve stolici.',
        caution: 'Po první ochutnávce nech dva dny odstup, než přidáš další nové ovoce.',
      },
      '12m': {
        serving:
          'Batole jí maliny hrstí ze společné misky. Skvěle se hodí rozmačkané na chleba s tvarohem, kde nahradí marmeládu a nepřidají žádnou sladkou složku.',
        caution: 'Mražené maliny nech povolit, ledová bobule je nepříjemně tvrdá.',
      },
    },
    prepIdeas: [
      'rozmačkané na tvaroh místo marmelády',
      'vmíchané do bílého jogurtu',
      'rozmixované do ovesné kaše',
      'zapečené v celozrnném lívanci',
    ],
    seasonCz: [6, 7, 8, 9],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, NHS_7_9M],
    reviewStatus: 'verified',
  },
  {
    id: 'ostruziny',
    nameCz: 'ostružiny',
    altNamesCz: ['ostružina'],
    category: 'ovoce',
    servingForm: 'drobne',
    emoji: '🫐',
    icon: 'ostruziny',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Ostružina je proti malině pevnější, drží pohromadě i pod tlakem dásní a větší plod zaplní ústa v celku.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Ostružiny rozmačkej vidličkou nebo je rozřež na poloviny, ať se pevná struktura naruší. Dužinu vmíchej do jogurtu, samotná rozmačkaná ostružina je pro začátek moc kyselá.',
        caution: 'Divoké ostružiny z kraje cesty raději vynech kvůli prachu a postřikům.',
      },
      '9m': {
        serving:
          'Rozpůlené ostružiny už dítě zvládne sbírat samo. Zralý plod poznáš podle matné barvy a snadného odtržení, nezralý zůstává tvrdý a svíravě kyselý.',
        caution: 'Tvrdá jadérka u některých odrůd dráždí, při odmítání zkus jinou odrůdu.',
      },
      '12m': {
        serving:
          'Batole jí ostružiny celé, pokud u jídla sedí. Dobře se hodí do kaše nebo do tvarohu, kde jejich kyselost vyvažuje jemná mléčná chuť.',
        caution: 'Šťáva z ostružin barví oblečení trvale.',
      },
    },
    prepIdeas: [
      'rozmačkané do tvarohu',
      'rozmixované a přecezené na pyré',
      'zapečené v ovesné kaši',
      'vmíchané do palačinkového těsta',
    ],
    seasonCz: [7, 8, 9],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, MZCR_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'rybiz-cerveny',
    nameCz: 'rybíz červený',
    altNamesCz: ['červený rybíz'],
    category: 'ovoce',
    servingForm: 'drobne',
    emoji: '🫐',
    icon: 'rybiz-cerveny',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'high',
    chokingReason:
      'Kuličky rybízu jsou drobné, pevné a hladké, takže sklouznou přes jazyk dřív, než je dásně stihnou rozmačkat.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Rybíz obeber ze stopek, každou kuličku rozmáčkni a rozkroj podélně na čtvrtky. Prakticky to znamená rozetřít hrst rybízu vidličkou na kaši a tu teprve vmíchat do jogurtu.',
        caution: 'Celé kuličky nikdy nenech volně na dětském talíři.',
      },
      '9m': {
        serving:
          'I v tomhle věku rybíz rozmačkávej nebo krájej podélně na čtvrtky. Kyselost dobře vyvažuje banán nebo hruška, dítě pak přijme i výraznou chuť bez sladidel.',
        caution: 'Stopky odstraň do jedné, jsou tuhé a hořké.',
      },
      '12m': {
        serving:
          'Batoleti nabízej rozmačkaný rybíz v kaši nebo protlačený přes sítko. Celé kuličky jsou i po prvním roce rizikové, nech je až na pozdější věk.',
        caution: 'Rybízová šťáva je velmi kyselá, ohlídej zoubky.',
      },
    },
    prepIdeas: [
      'protlačený přes sítko do jogurtu',
      'rozmačkaný s banánem',
      'podušený do jáhlové kaše',
      'zapečený v tvarohovém nákypu',
    ],
    seasonCz: [6, 7, 8],
    vegetarian: true,
    sources: [NHS_PREP_SAFELY, NHS_AVOID],
    reviewStatus: 'verified',
  },
  {
    id: 'rybiz-cerny',
    nameCz: 'rybíz černý',
    altNamesCz: ['černý rybíz', 'černý rybízek'],
    category: 'ovoce',
    servingForm: 'drobne',
    emoji: '🫐',
    icon: 'rybiz-cerny',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'high',
    chokingReason:
      'Černý rybíz má tužší slupku než červený a jeho kulička drží tvar i po zmáčknutí v prstech.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Obraný černý rybíz nejdřív krátce prohřej, aby slupky povolily, pak ho rozetři a rozkroj podélně na čtvrtky. Vzniklou hustou dřeň mísi s jogurtem nebo s ovesnou kaší.',
        caution: 'Syrový černý rybíz je pro první ochutnávku příliš svíravý.',
      },
      '9m': {
        serving:
          'Dál platí mačkat nebo krájet podélně na čtvrtky, celou kuličku nenabízej. Černý rybíz má hodně vitaminu C, což pomáhá vstřebat železo z rostlinných zdrojů v témže jídle.',
        caution: 'Výrazná chuť může vést k odmítnutí, nabídni ji opakovaně.',
      },
      '12m': {
        serving:
          'Batole jí černý rybíz nejlépe v kaši nebo protlačený do tvarohu. Celé bobule nech až na věk, kdy dítě spolehlivě rozžvýká drobné pevné sousto.',
        caution: 'Nekupuj hotové rybízové sirupy, jsou silně slazené.',
      },
    },
    prepIdeas: [
      'prohřátý a protlačený přes sítko',
      'rozmačkaný do ovesné kaše',
      'smíchaný s banánovým pyré',
      'zapečený ve špaldovém nákypu',
    ],
    seasonCz: [7, 8],
    vegetarian: true,
    sources: [NHS_PREP_SAFELY, NHS_AVOID],
    reviewStatus: 'verified',
  },
  {
    id: 'angrest',
    nameCz: 'angrešt',
    altNamesCz: ['srstka'],
    category: 'ovoce',
    servingForm: 'drobne',
    emoji: '🫐',
    icon: 'angrest',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'high',
    chokingReason:
      'Angrešt má pevnou slupku a velikost blízkou hroznu, po ukousnutí se navíc dužina vyklouzne ze slupky v jednom soustu.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Angrešt zbav zbytků kvítku i stopky a rozřež ho podélně na čtvrtky. Tuhou slupku změkči krátkým povařením, pak dužinu rozmačkej a smíchej s něčím jemným, třeba s tvarohem.',
        caution: 'Nezralý angrešt je tvrdý a kyselý, nech ho dozrát do měkka.',
      },
      '9m': {
        serving:
          'Povařený angrešt dál krájej podélně na čtvrtky, ať nevznikne souvislý plod. Dítě zvládne díly nabírat prsty, slupku ale stále kontroluj, u některých odrůd je tuhá.',
        caution: 'Chlupaté odrůdy dráždí patro, vybírej hladké.',
      },
      '12m': {
        serving:
          'Batole jí angrešt rozpůlený nebo podušený v kaši. Celý plod nedávej ani teď, jeho velikost odpovídá nejrizikovější skupině potravin.',
        caution: 'Zkontroluj, že v kompotu nezůstaly tvrdé stopky.',
      },
    },
    prepIdeas: [
      'povařený a rozmačkaný do tvarohu',
      'protlačený přes sítko na pyré',
      'podušený s hruškou',
      'zapečený v ovesném nákypu',
    ],
    seasonCz: [6, 7, 8],
    vegetarian: true,
    sources: [NHS_PREP_SAFELY, NHS_AVOID],
    reviewStatus: 'verified',
  },
  {
    id: 'hroznove-vino',
    nameCz: 'hroznové víno',
    altNamesCz: ['hrozny', 'vinné hrozny'],
    category: 'ovoce',
    servingForm: 'drobne',
    emoji: '🍇',
    icon: 'hrozny',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'high',
    chokingReason:
      'Hroznové víno má přesně ten průměr, který utěsní dětské dýchací cesty, a hladká pružná slupka brání vzduchu projít kolem.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Každý hrozen rozřež podélně na čtvrtky, tedy nejdřív po délce napůl a každou půlku ještě jednou. Tvar se tím rozbije a slupku můžeš navíc oloupat, ať je sousto úplně měkké.',
        caution: 'Tohle je nejrizikovější položka celého katalogu, nikdy nezkracuj postup.',
      },
      '9m': {
        serving:
          'Pravidlo krájet podélně na čtvrtky platí beze změny, bez ohledu na to, jak dobře už dítě žvýká. Jadérka u odrůd s peckami vyber, jsou tvrdá a hořká.',
        caution: 'Hrozny nikdy nenech v dosahu, když si dítě hraje.',
      },
      '12m': {
        serving:
          'Batoleti dál krájej hrozny alespoň na čtvrtiny. Odborná doporučení vedou celé hrozny jako nevhodné až do pěti let, doma z toho udělej pravidlo pro všechny.',
        caution: 'Pravidlo vysvětli i prarodičům, tady se nedělají výjimky.',
      },
    },
    prepIdeas: [
      'čtvrtky vmíchané do jogurtu',
      'rozmixované na pyré do kaše',
      'zapečené v celozrnné placce',
      'rozmačkané na tvaroh',
    ],
    seasonCz: [9, 10],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'meloun-vodni',
    nameCz: 'meloun vodní',
    altNamesCz: ['vodní meloun', 'červený meloun'],
    category: 'ovoce',
    servingForm: 'kusove',
    emoji: '🍉',
    icon: 'meloun-vodni',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Vodní meloun je natolik kluzký, že ukousnutý kus sjede po jazyku dozadu, a tvrdá jadérka se nedají rozmělnit.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Vyber dužinu bez tmavých jadérek a nakrájej ji na dlouhé tyčinky, které dítě sevře v pěsti. Kůru odřízni až po bílou vrstvu, ta je tvrdá a nedá se rozžvýkat.',
        caution: 'Meloun hodně pouští šťávu, prostři podložku nebo ručník.',
      },
      '9m': {
        serving:
          'Nakrájej dužinu na kostky velikosti sousta a znovu zkontroluj, že v nich nezůstalo tvrdé jadérko. Hodí se i jako osvěžení v horkém dni, dodává hlavně vodu.',
        caution: 'Hodně melounu naráz může rozvolnit stolici.',
      },
      '12m': {
        serving:
          'Batole jí meloun v kostkách nebo v trojúhelnících bez kůry. Jadérka už nejsou tak velké riziko, přesto je u malých dětí raději vybírej.',
        caution: 'Rozkrojený meloun skladuj v lednici, rychle kvasí.',
      },
    },
    prepIdeas: [
      'tyčinky bez jadérek do ruky',
      'rozmixovaný na ledovou tříšť bez slazení',
      'kostky do ovocného salátu',
      'rozmačkaný do bílého jogurtu',
    ],
    seasonCz: [7, 8, 9],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'meloun-cantaloupe',
    nameCz: 'meloun cantaloupe',
    altNamesCz: ['cantaloupe', 'žlutý meloun', 'cukrový meloun'],
    category: 'ovoce',
    servingForm: 'kusove',
    emoji: '🍈',
    icon: 'meloun-cantaloupe',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Dužina cantaloupe je hutnější než u vodního melounu a při ukousnutí se oddělí pevný kluzký kus.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Vydlabej střed s jadérky, odřízni kůru a dužinu nakrájej na silné proužky. Zralý plod voní i přes slupku a dužina se dá rozmáčknout, nezralý zůstává tuhý a bez chuti.',
        caution: 'Povrch melounu omyj před krájením, nese bakterie z půdy.',
      },
      '9m': {
        serving:
          'Podávej kostky velikosti nehtu palce, dítě je sbírá dvěma prsty. Cantaloupe má výraznější aroma než vodní meloun, někdy ho děti přijmou až napodruhé.',
        caution: 'Nakrojený meloun nenechávej déle než den mimo lednici.',
      },
      '12m': {
        serving:
          'Batole jí cantaloupe v kostkách nebo v měsíčcích s odříznutou kůrou. Dobře se kombinuje s bílým jogurtem, kde vytvoří hustou svačinu bez jakéhokoli slazení.',
        caution: 'Přezrálý meloun chutná nakysle, to už není vhodné podávat.',
      },
    },
    prepIdeas: [
      'proužky do ruky bez kůry',
      'kostky do jogurtu',
      'rozmixovaný na husté pyré',
      'smíchaný s rozmačkaným banánem',
    ],
    seasonCz: [7, 8, 9],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, NHS_7_9M],
    reviewStatus: 'verified',
  },
  {
    id: 'mango',
    nameCz: 'mango',
    altNamesCz: ['manga'],
    category: 'ovoce',
    servingForm: 'kusove',
    emoji: '🥭',
    icon: 'mango',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Zralé mango je mimořádně kluzké a vyklouzne z ruky i z úst v celém soustu, aniž by ho dásně zachytily.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Oloupej mango, odkroj dužinu od ploché pecky a nakrájej na dlouhé pásky. Kluzkost zmírni obalením v jemných mletých ovesných vločkách, dítě pak pásek udrží v pěsti.',
        caution: 'Vláknité odrůdy se špatně žvýkají, vybírej hladkou dužinu.',
      },
      '9m': {
        serving:
          'Nakrájej dužinu na kostky, které dítě nabere klešťovým úchopem. Mango je bohaté na vitamin A i C a hodí se jako přirozeně sladká složka k neutrální kaši.',
        caution: 'Šťáva z manga dráždí citlivou pokožku kolem úst.',
      },
      '12m': {
        serving:
          'Batole jí mango v kostkách ze společné mísy nebo rozmačkané na chleba. Pecku odstraň v kuchyni, batole ji rádo olizuje a může se o hranu pořezat.',
        caution: 'Nezralé mango je kyselé a tuhé, nech ho dozrát mimo lednici.',
      },
    },
    prepIdeas: [
      'pásky obalené v mletých vločkách',
      'rozmixované na husté pyré',
      'kostky do bílého jogurtu',
      'zapečené s ovesnou kaší',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, WHO_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'ananas',
    nameCz: 'ananas',
    altNamesCz: ['ananasy'],
    category: 'ovoce',
    servingForm: 'kusove',
    emoji: '🍍',
    icon: 'ananas',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Ananasová dužina je vláknitá a tuhý střed se dásněmi nedá rozmělnit, vlákna se navíc v ústech spojí do chuchvalce.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Odřízni slupku i tvrdý střed a z měkké části nakrájej dlouhé proužky přes vlákna, ne po nich. Tuhý plod krátce podus, tepelná úprava vlákna zkrátí a chuť zjemní.',
        caution: 'Kyselina v ananasu dráždí bradu, potři ji předem tenkou vrstvou tuku.',
      },
      '9m': {
        serving:
          'Podávej kostky z měkké části, vždy bez středu. Čerstvý ananas obsahuje enzym, který štípe v ústech, po krátkém povaření nebo upečení tenhle efekt zmizí.',
        caution: 'Konzervovaný ananas bývá v sladkém nálevu, vybírej čerstvý.',
      },
      '12m': {
        serving:
          'Batole jí ananas v kostkách, tvrdý střed mu ale nedávej ani teď. Kyselost dobře vyvažuje bílý jogurt nebo tvaroh, které zároveň chrání sklovinu.',
        caution: 'Po ananasu vypláchni dítěti pusu vodou.',
      },
    },
    prepIdeas: [
      'proužky krátce podušené',
      'kostky zapečené v troubě',
      'rozmixovaný do jogurtu',
      'nakrájený do ovesné kaše',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, NHS_10_12M],
    reviewStatus: 'verified',
  },
  {
    id: 'kiwi',
    nameCz: 'kiwi',
    altNamesCz: ['kiwi zelené'],
    category: 'ovoce',
    servingForm: 'kusove',
    emoji: '🥝',
    icon: 'kiwi',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Kiwi rozřízni napůl a dužinu vyber lžičkou, nebo ho oloupej a nakrájej na měsíčky. Drobná tmavá zrníčka uvnitř jsou měkká a dítě je bez problému spolkne.',
        caution: 'Bílý střed je tužší, u prvních porcí ho vykroj.',
      },
      '9m': {
        serving:
          'Podávej kiwi v kostkách nebo v půlměsících, které dítě sbírá prsty. Je to silný zdroj vitaminu C, díky němuž se lépe vstřebá železo z luštěnin podaných v témže jídle.',
        caution: 'U dětí s ekzémem sleduj okolí úst, kiwi dráždí i mechanicky.',
      },
      '12m': {
        serving:
          'Batole jí kiwi vydlabané lžičkou přímo z půlky. Slupku neloupej jen tehdy, když je dobře omytá a dítě spolehlivě žvýká, jinak ji raději odstraň.',
        caution: 'Přezrálé kiwi je vodnaté a kyselé, vybírej mírně pružné plody.',
      },
    },
    prepIdeas: [
      'měsíčky do ruky',
      'rozmačkané do jogurtu',
      'kostky v ovocném salátu',
      'rozmixované s banánem',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_ALLERGY, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
  {
    id: 'pomeranc',
    nameCz: 'pomeranč',
    altNamesCz: ['pomeranče'],
    category: 'ovoce',
    servingForm: 'kusove',
    emoji: '🍊',
    icon: 'pomeranc',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Blány mezi dílky jsou pevné a nerozpustí se v ústech, takže vytvoří útržek, který dítě nedokáže spolknout ani vyplivnout.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Oloupej pomeranč, rozeber ho na dílky a z každého sundej bílou blánu, ať zůstane jen dužina. Tu podávej po kouscích na lžíci nebo rozmačkanou do husté kaše.',
        caution: 'Kyselost dráždí bradu, potři ji předem tenkou vrstvou tuku.',
      },
      '9m': {
        serving:
          'Vyloupané dílky bez blan krájej na třetiny, aby netvořily dlouhé sousto. Dítě si je bere prsty, šťáva jí přitom stéká po ruce, což k učení patří.',
        caution: 'Jadérka u některých odrůd vyber, jsou hořká a tvrdá.',
      },
      '12m': {
        serving:
          'Batole zvládne pomerančové dílky i s tenkou blánou, pokud je nakrájíš na menší kusy. Šťávu místo vody nenabízej, celý plod je pro zoubky výrazně lepší volba.',
        caution: 'Po citrusech vypláchni dítěti pusu vodou.',
      },
    },
    prepIdeas: [
      'dílky bez blan na lžíci',
      'nastrouhaná kůra do těsta z nepostřikovaného plodu',
      'kousky do bílého jogurtu',
      'šťáva jako kyselá složka do dušené zeleniny',
    ],
    seasonCz: [11, 12, 1, 2, 3],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, NHS_DRINKS],
    reviewStatus: 'verified',
  },
  {
    id: 'mandarinka',
    nameCz: 'mandarinka',
    altNamesCz: ['mandarinky', 'klementinka'],
    category: 'ovoce',
    servingForm: 'kusove',
    emoji: '🍊',
    icon: 'mandarinka',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Celý dílek mandarinky má tvar pevného váčku, který se v ústech nerozpadne, a tvrdá jadérka v něm zůstávají skrytá.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Mandarinku oloupej, dílky zbav blány a dužinu rozděl na kousky. Prohmatej každý dílek proti světlu a vyber z něj jadérka, u klementinek bez jader je práce podstatně rychlejší.',
        caution: 'Bílá vlákna kolem plodu jsou tuhá, odstraň je také.',
      },
      '9m': {
        serving:
          'Dílky bez blány rozřež napůl, aby nevznikl celý váček. Dítě si je bere prsty a zvládne je rozmačkat dásněmi, šťáva přitom stéká, počítej s bryndákem.',
        caution: 'Jadérka kontroluj i teď, jsou tvrdá a hořká.',
      },
      '12m': {
        serving:
          'Batole jí mandarinkové dílky celé, pokud jsou bez jader. Je to praktická svačina na cesty, ale i teď platí, že jídlo probíhá vsedě a v klidu.',
        caution: 'Slupku odklízej, batole ji zkusí sníst.',
      },
    },
    prepIdeas: [
      'dílky bez blan a jader do ruky',
      'rozdělená dužina do jogurtu',
      'šťáva do dušené mrkve',
      'kousky v ovocném salátu',
    ],
    seasonCz: [11, 12, 1, 2],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'citron',
    nameCz: 'citron',
    altNamesCz: ['citrony', 'citronová šťáva'],
    category: 'ovoce',
    servingForm: 'kusove',
    emoji: '🍋',
    icon: 'citron',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Citron používej jen jako šťávu, pár kapek do hotového jídla. Kyselina pomáhá tělu využít železo z luštěnin a zeleniny a zároveň brání tomu, aby nakrájené ovoce zhnědlo.',
        caution: 'Celý plátek citronu dítěti nedávej, kyselost dráždí sliznici.',
      },
      '9m': {
        serving:
          'Dál zůstává u šťávy, kterou zakápneš rybu, luštěniny nebo dušenou zeleninu. Nastrouhaná kůra z nepostřikovaného citronu dodá vůni pečení bez jakékoli sladké složky.',
        caution: 'Kůru strouhej jen ze žluté vrstvy, bílá je hořká.',
      },
      '12m': {
        serving:
          'Batole občas ochutná i samotný plátek a udělá slavnostní grimasu, což je neškodné. Jako nápoj citronovou vodu nenabízej, kyselina narušuje sklovinu rostoucích zoubků.',
        caution: 'Po kyselém jídle nech odstup do čištění zoubků.',
      },
    },
    prepIdeas: [
      'kapka šťávy do luštěninové pomazánky',
      'zakápnutá ryba před podáním',
      'nastrouhaná kůra do těsta',
      'šťáva proti hnědnutí nakrájeného jablka',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_DRINKS, NHS_YOUNG_CHILDREN],
    reviewStatus: 'verified',
  },
  {
    id: 'limetka',
    nameCz: 'limetka',
    altNamesCz: ['limetky', 'limetková šťáva'],
    category: 'ovoce',
    servingForm: 'kusove',
    emoji: '🍋',
    icon: 'limetka',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Z limetky použij jen několik kapek šťávy do hotového pokrmu. Aroma je výraznější než u citronu, takže stačí opravdu málo, aby se chuť dušené zeleniny rozjasnila.',
        caution: 'Samotnou limetku ke cucání nenabízej.',
      },
      '9m': {
        serving:
          'Šťávou zakápni fazolovou pomazánku nebo pečenou dýni. Kyselá složka v jídle zvyšuje využitelnost rostlinného železa, což se v bezmasé kuchyni hodí obzvlášť.',
        caution: 'Limetkovou šťávu přidávej až na konci, varem ztrácí vůni.',
      },
      '12m': {
        serving:
          'Batoleti limetka zpestří rýži, luštěniny i ovocný salát. Slazené limetkové nápoje do jídelníčku nepatří, voda zůstává jediným nápojem vedle mléka.',
        caution: 'Kůru používej jen z nepostřikovaných plodů.',
      },
    },
    prepIdeas: [
      'kapky do zeleninového pyré',
      'šťáva do cizrnové pomazánky',
      'nastrouhaná kůra do kaše',
      'zakápnuté pečené batáty',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_DRINKS, NHS_AVOID],
    reviewStatus: 'verified',
  },
  {
    id: 'fik-cerstvy',
    nameCz: 'fík čerstvý',
    altNamesCz: ['čerstvé fíky'],
    category: 'ovoce',
    servingForm: 'kusove',
    emoji: '🫒',
    icon: 'fik',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Slupka fíku je pružná a neroztrhne se pod dásněmi, takže ukousnutý kus drží pohromadě i po rozmačkání dužiny.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Zralý fík rozkroj a měkkou dužinu vyber lžičkou, slupku zahoď. Dužina je jemná a plná drobných zrníček, dítě ji zvládne olizovat z předložené lžíce i z prstu.',
        caution: 'Nezralý fík je tuhý a svíravý, nech ho dozrát.',
      },
      '9m': {
        serving:
          'Oloupaný fík nakrájej na měsíčky, které dítě nabere prsty. Fík rozvolňuje stolici, proto pro začátek stačí polovina plodu za den.',
        caution: 'Mléčná šťáva ze stopky dráždí kůži, stopku odřízni.',
      },
      '12m': {
        serving:
          'Batole jí fík rozkrojený na čtvrtky i se slupkou, pokud je tenká a dobře omytá. Sušené fíky drž stranou, jsou tuhé a lepivé a patří jen nasekané nadrobno.',
        caution: 'Zkontroluj, jestli uvnitř plodu nejsou zbytky hmyzu.',
      },
    },
    prepIdeas: [
      'dužina vydlabaná lžičkou',
      'měsíčky do bílého jogurtu',
      'rozmačkaný na tvaroh',
      'krátce zapečený v troubě',
    ],
    seasonCz: [8, 9, 10],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, MZCR_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'datle',
    nameCz: 'datle',
    altNamesCz: ['datle sušené', 'medjool'],
    category: 'ovoce',
    servingForm: 'drobne',
    emoji: '🫘',
    icon: 'datle',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'high',
    chokingReason:
      'Datle je lepivá, v ústech se slepí do jednoho tuhého sousta a uvnitř bývá podlouhlá tvrdá pecka.',
    hazards: ['cukr'],
    hazardNotes: {
      cukr: 'Datle patří k nejsladšímu ovoci vůbec a její přirozené sacharidy ulpívají na zoubcích. Do prvního roku ji používej jen jako sladidlo do těsta nebo kaše, ne jako samostatnou svačinu, a po jídle nabídni vodu.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Datli vždy nejdřív rozřízni a vyjmi pecku. Potom ji namoč v horké vodě a rozmixuj na hladkou pastu, kterou vmícháš do kaše, samostatný kus datle sem ještě nepatří.',
        caution: 'Lepivá struktura je riziková i po nasekání, drž se pasty.',
      },
      '9m': {
        serving:
          'Vypeckovanou a namočenou datli nasekej nadrobno a vmíchej ji do ovesné kaše nebo do těsta. Kousky nechávej menší než zrnko rýže, ať se v ústech nespojí dohromady.',
        caution: 'Po datlích vždy nabídni vodu a otři dítěti dásně.',
      },
      '12m': {
        serving:
          'Batoleti nabízej datle nasekané nadrobno v kaši nebo v pečení. Celá datle do ruky nepatří ani po prvním roce, lepivost a tvar jsou spolehlivá kombinace pro dušení.',
        caution: 'Zkontroluj každou datli, pecka bývá i v balení označeném bez pecek.',
      },
    },
    prepIdeas: [
      'namočená a rozmixovaná na pastu',
      'nasekaná nadrobno do ovesné kaše',
      'pasta jako sladká složka do lívanců',
      'rozmixovaná do celozrnného těsta',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'rozinky',
    nameCz: 'rozinky',
    altNamesCz: ['hrozinky', 'korintky'],
    category: 'ovoce',
    servingForm: 'drobne',
    emoji: '🫘',
    icon: 'rozinky',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'high',
    chokingReason:
      'Rozinka se při nadechnutí přisaje ke stěně dýchacích cest a její svraštělý povrch zabrání tomu, aby ji dítě vykašlalo.',
    hazards: ['cukr'],
    hazardNotes: {
      cukr: 'Sušením se sacharidy z hroznu zahustí do malého objemu a rozinky se lepí na sklovinu. Do prvního roku je používej jen nasekané v jídle a po svačině nabídni vodu, ne jako mlsání během dne.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Rozinky namoč ve vroucí vodě, nech je nabobtnat a pak je rozmixuj do kaše nebo do těsta. V celku ani napůl je v téhle fázi nenabízej, lepivost je větší riziko než tvar.',
        caution: 'Nikdy je nedávej dítěti do ruky jako svačinu na cestu.',
      },
      '9m': {
        serving:
          'Namočené rozinky nasekej na velmi drobné kousky a vmíchej je do jídla. I měkká rozinka si drží pružnou slupku, proto zůstává pravidlo sekat nadrobno až do prvního roku.',
        caution: 'Rozinky v müsli nebo v pečivu kontroluj, bývají celé.',
      },
      '12m': {
        serving:
          'Batoleti dávej rozinky nasekané a nejlépe zapečené v těstě. Celé rozinky jako svačinu odkládej co nejdéle, patří mezi nejčastější příčiny dušení u batolat.',
        caution: 'U babiček a ve školce na tohle pravidlo výslovně upozorni.',
      },
    },
    prepIdeas: [
      'namočené a rozmixované do kaše',
      'nasekané do celozrnného těsta',
      'rozvařené do jablečného pyré',
      'rozmixované s ovesnými vločkami',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'susene-merunky',
    nameCz: 'sušené meruňky',
    altNamesCz: ['meruňky sušené'],
    category: 'ovoce',
    servingForm: 'drobne',
    emoji: '🫘',
    icon: 'susene-merunky',
    allergens: ['siricitany'],
    isKeyAllergen: false,
    chokingRisk: 'high',
    chokingReason:
      'Sušená meruňka je pružná a lepivá, při žvýkání se stočí do pevné kuličky, kterou dásně nerozmělní.',
    hazards: ['cukr'],
    hazardNotes: {
      cukr: 'Sušením se objem zmenší a sacharidy zkoncentrují, sušená meruňka je proto výrazně sladší než čerstvá. Do prvního roku ji používej jen nasekanou v jídle a po ní nabídni vodu.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Sušené meruňky přelij vroucí vodou, nech je změknout a rozmixuj je do hustého pyré. To vmíchej do kaše nebo do jogurtu, kusy sušeného ovoce v téhle fázi nenabízej.',
        caution: 'Vybírej nesířené meruňky, poznáš je podle tmavě hnědé barvy.',
      },
      '9m': {
        serving:
          'Namočené meruňky nasekej nadrobno a přidej je do ovesné kaše nebo do pečení. Jsou dobrým zdrojem železa i draslíku, ale objem drž malý, jinak rozvolní stolici.',
        caution: 'Sířené meruňky mohou dráždit dýchací cesty u citlivých dětí.',
      },
      '12m': {
        serving:
          'Batole zvládne sušenou meruňku nakrájenou na proužky, pokud sedí a jí v klidu. Celý plod do ruky nedávej, tuhá pružná dužina je obtížně rozmělnitelná.',
        caution: 'Kontroluj složení, některá balení obsahují přidané sladidlo.',
      },
    },
    prepIdeas: [
      'namočené a rozmixované na pyré',
      'nasekané do ovesné kaše',
      'rozvařené s jablkem',
      'nasekané do špaldového těsta',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'susene-svestky',
    nameCz: 'sušené švestky',
    altNamesCz: ['švestky sušené', 'sušené blumy'],
    category: 'ovoce',
    servingForm: 'drobne',
    emoji: '🫘',
    icon: 'susene-svestky',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'high',
    chokingReason:
      'Sušená švestka má lepkavý povrch, který se přichytí na patro, a v levných baleních zůstávají tvrdé pecky.',
    hazards: ['cukr'],
    hazardNotes: {
      cukr: 'Sušená švestka je koncentrovaný zdroj přirozených sacharidů a lepí se na zoubky. Do prvního roku ji podávej jen rozmixovanou nebo nasekanou v jídle a po ní nabídni vodu.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Sušené švestky rozvař v malém množství vody a rozmixuj je na hladké pyré. Lžička takového pyré v kaši pomáhá při tuhé stolici a zároveň dodá železo i vlákninu.',
        caution: 'Každou švestku zkontroluj na pecku, i když je balení označené jako vypeckované.',
      },
      '9m': {
        serving:
          'Rozvařené švestky nasekej nadrobno a vmíchej do jogurtu nebo do kaše. Účinek na trávení je silný, proto začni jednou lžičkou denně a sleduj, jak dítě reaguje.',
        caution: 'Při řidší stolici množství okamžitě sniž.',
      },
      '12m': {
        serving:
          'Batoleti nabízej sušené švestky nakrájené na proužky. Jsou praktickou pomocí při zácpě, ale svačina to není, spíš složka jídla podávaná v malém množství.',
        caution: 'Dohlédni, aby si dítě nenabralo víc kusů najednou.',
      },
    },
    prepIdeas: [
      'rozvařené na hladké pyré',
      'nasekané do ovesné kaše',
      'rozmixované do jogurtu',
      'zapečené v celozrnném těstě',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'brusinky-susene',
    nameCz: 'brusinky sušené',
    altNamesCz: ['sušené brusinky'],
    category: 'ovoce',
    servingForm: 'drobne',
    emoji: '🫘',
    icon: 'brusinky',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'high',
    chokingReason:
      'Sušená brusinka je drobná, pružná a lepivá zároveň, takže se snadno dostane do dýchacích cest a přisaje se tam.',
    hazards: ['cukr'],
    hazardNotes: {
      cukr: 'Brusinky jsou samy o sobě velmi kyselé, proto se před sušením prakticky vždy máčejí ve sladkém nálevu. Kvůli tomu jsou sušené brusinky výrazně sladší než ostatní sušené ovoce a do prvního roku se nehodí.',
    },
    minAgeMonths: 12,
    prep: {
      '6m': {
        serving:
          'V šesti měsících se sušené brusinky nenabízejí. Prakticky všechna balení v českých obchodech jsou doslazovaná a kombinace lepivosti s drobným tvarem je navíc riziková.',
        caution: 'Kontroluj složení müsli a granol, brusinky v nich bývají skryté.',
      },
      '9m': {
        serving:
          'Ani v devíti měsících se sušené brusinky nedoporučují. Pokud chceš podobnou kyselou chuť, sáhni po rozmačkaném čerstvém rybízu, který dodá vitamin C bez sladkého nálevu.',
        caution: 'Brusinkový džus není náhrada, obsahuje hodně sladké složky.',
      },
      '12m': {
        serving:
          'Po prvním roce můžeš brusinky občas přidat nasekané do pečení nebo do kaše. Zůstávají ale spíš ozdobou než běžnou svačinou a po nich patří vypláchnout pusu vodou.',
        caution: 'Celé brusinky do ruky nedávej, tvar i lepivost zůstávají rizikové.',
      },
    },
    prepIdeas: [
      'nasekané do celozrnného pečení po prvním roce',
      'rozvařené s jablkem na kompot',
      'rozmixované do jogurtu',
      'nasekané do ovesné kaše',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_AVOID_WEANING],
    reviewStatus: 'verified',
  },
  {
    id: 'papaja',
    nameCz: 'papája',
    altNamesCz: ['papája zralá'],
    category: 'ovoce',
    servingForm: 'kusove',
    emoji: '🍈',
    icon: 'papaja',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Zralou papáju rozkroj, vyber lžící tmavá zrníčka ze středu a dužinu nakrájej na silné proužky. Je tak měkká, že se dá rozmáčknout mezi prsty, a proto je vděčnou první potravinou.',
        caution: 'Nezralá zelená papája je tuhá a v téhle fázi se nehodí.',
      },
      '9m': {
        serving:
          'Podávej kostky, které dítě sbírá klešťovým úchopem. Papája obsahuje enzymy podporující trávení a její jemná chuť se dobře snáší s jogurtem i s ovesnou kaší.',
        caution: 'Zrníčka jsou palčivá, vyber je do jednoho.',
      },
      '12m': {
        serving:
          'Batole jí papáju vydlabanou lžičkou z půlky nebo nakrájenou do ovocného salátu. Před podáním ji zakápni citronem, chuť se tím rozjasní a dužina nezhnědne.',
        caution: 'Slupka je nepoživatelná, vždy ji odstraň.',
      },
    },
    prepIdeas: [
      'proužky do ruky bez zrníček',
      'rozmačkaná do bílého jogurtu',
      'rozmixovaná s banánem',
      'kostky v ovocném salátu',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, WHO_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'nektarinka-bila',
    nameCz: 'nektarinka bílá',
    altNamesCz: ['bílá nektarinka'],
    category: 'ovoce',
    servingForm: 'kusove',
    emoji: '🍑',
    icon: 'nektarinka-bila',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Bílá nektarinka bývá pevnější než žlutá a její hladká slupka se v ústech oddělí v jednom celku.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Oloupej ji, odkroj dužinu od pecky a nakrájej ji na silné měkké díly. Bílá dužina je jemnější a méně kyselá než u žlutých odrůd, takže bývá vděčnou první ochutnávkou.',
        caution: 'Tvrdý plod nech dva dny dozrát mimo lednici.',
      },
      '9m': {
        serving:
          'Nakrájej vypeckovanou dužinu na kostky velikosti sousta a nech dítě, ať si je bere samo. Slupku můžeš nechat jen tehdy, když se dá protrhnout nehtem.',
        caution: 'Přezrálý plod se rozpadá, hodí se spíš rozmačkaný.',
      },
      '12m': {
        serving:
          'Batole jí bílé nektarinky v měsíčcích ze společné mísy. Hodí se i do kaše, kde nahradí sladkou přísadu a přidají vitamin C k rostlinným zdrojům železa.',
        caution: 'Pecku odstraň v kuchyni, ne až na talíři.',
      },
    },
    prepIdeas: [
      'měkké díly do ruky',
      'kostky do ovesné kaše',
      'rozmačkaná do tvarohu',
      'krátce zapečená v troubě',
    ],
    seasonCz: [7, 8, 9],
    vegetarian: true,
    sources: [NHS_PREP_SAFELY, NHS_7_9M],
    reviewStatus: 'verified',
  },
  {
    id: 'jablecne-pyre-bez-cukru',
    nameCz: 'jablečné pyré bez cukru',
    altNamesCz: ['jablečná přesnídávka bez přidaného cukru', 'nesl. jablečné pyré'],
    category: 'ovoce',
    servingForm: 'kasovite',
    emoji: '🍎',
    icon: 'jablecne-pyre',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Pyré bez cukru podávej na předložené lžíci nebo na prstu, ať ho dítě olizuje samo. Hodí se i k zahuštění jáhlové kaše, kde nahradí jakoukoli sladkou přísadu.',
        caution: 'Kapsičky s hubičkou nenabízej, dítě z nich saje a neučí se jíst lžící.',
      },
      '9m': {
        serving:
          'Nech dítě nabírat pyré vlastní lžící z mělké misky, i když se přitom umaže. Hustší pyré drží na lžíci lépe než řídké, proto ho případně zahusti mletými ovesnými vločkami.',
        caution: 'Domácí pyré skladuj v lednici nejvýše dva dny.',
      },
      '12m': {
        serving:
          'Batole si pyré samo namaže na chleba nebo ho vmíchá do jogurtu. Vždy kontroluj složení kupovaných variant, mnohé obsahují přidanou sladkou složku i přes obrázek na obalu.',
        caution: 'Přesnídávky nenahrazují ovoce v celku, dávej přednost kouskům.',
      },
    },
    prepIdeas: [
      'domácí pyré z rozvařených jablek bez cukru',
      'vmíchané do ovesné kaše',
      'jako vlhká složka do celozrnného pečení',
      'smíchané s bílým jogurtem',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_YOUNG_CHILDREN],
    reviewStatus: 'verified',
  },
  {
    id: 'kaki',
    nameCz: 'kaki',
    altNamesCz: ['tomel', 'persimon', 'sharon'],
    category: 'ovoce',
    servingForm: 'kusove',
    emoji: '🍊',
    icon: 'kaki',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Nedozrálé kaki je tvrdé a svíravé, slupka je pevná a odděluje se v celých cárech, které se špatně žvýkají.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Vyber úplně měkké kaki, které povoluje pod prstem. Rozkroj ho, dužinu vyber lžící a podávej ji jako pyré, nebo nabídni měkký díl velikosti prstu bez slupky.',
        caution: 'Tvrdé kaki nenabízej vůbec, je svíravé a dítě po něm odmítne i další ovoce.',
      },
      '9m': {
        serving:
          'Měkkou dužinu bez slupky nakrájej na kostičky do velikosti hrášku pro klešťový úchop, nebo ji vmíchej do jogurtu a do kaše.',
        caution: 'Slupku odstraň i u zralého plodu, je pevná a nerozžvýká se.',
      },
      '12m': {
        serving:
          'Batole jí kaki nakrájené na měsíčky, do ovocného salátu i rozmačkané na chlebu s tvarohem. Slupku pořád odstraňuj.',
        caution: 'Zralost poznáš po hmatu, ne podle barvy; tvrdý plod nech ještě dozrát.',
      },
    },
    prepIdeas: [
      'zralá dužina jako pyré',
      'kostičky do jogurtu',
      'rozmačkané na chleba s tvarohem',
      'do ovocného salátu k batoleti',
    ],
    seasonCz: [10, 11, 12, 1],
    vegetarian: true,
    sources: [NHS_PREP_SAFELY, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
  {
    id: 'fiky-susene',
    nameCz: 'fíky sušené',
    altNamesCz: ['sušené fíky', 'fík sušený'],
    category: 'ovoce',
    servingForm: 'drobne',
    emoji: '🫒',
    icon: 'fiky-susene',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'high',
    chokingReason:
      'Sušený fík je lepivý a houževnatý, v ústech se stáhne do jednoho pevného sousta a drobná tvrdá jadérka zůstávají celá.',
    hazards: ['cukr'],
    hazardNotes: {
      cukr: 'Sušením se cukr z ovoce zahustí. NHS proto sušené ovoce doporučuje podávat k jídlu, ne mezi jídly, a nenabízet ho jako celodenní mlsání.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Fík namoč v horké vodě, nech ho pořádně nabobtnat doměkka a rozmixuj ho do kaše nebo do pyré. Celý ani nakrájený ho v tomhle věku nenabízej.',
        caution: 'Suchý fík nedávej dítěti do ruky, lepí se na patro.',
      },
      '9m': {
        serving:
          'Namočený a změklý fík nakrájej na malé kousky a vmíchej ho do kaše, do tvarohu nebo do těsta na placky, aby se nelepil sám o sobě.',
        caution: 'Kousky krájej menší než hrášek, lepivé ovoce se hůř uvolňuje z úst.',
      },
      '12m': {
        serving:
          'Batole jí nakrájené namočené fíky v kaši, v pečení i v ovesných tyčinkách. Celý suchý fík nechávej až na dobu, kdy dítě spolehlivě kouše.',
        caution: 'Po fících dítěti vyčisti zuby, zbytky se drží v rýhách.',
      },
    },
    prepIdeas: [
      'namočený a rozmixovaný do kaše',
      'nakrájený do tvarohu',
      'do těsta na ovesné tyčinky',
      'vařený s jablkem na kompot bez cukru',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_YOUNG_CHILDREN, NHS_PREP_SAFELY],
    reviewStatus: 'verified',
  },
  {
    id: 'grapefruit',
    nameCz: 'grapefruit',
    altNamesCz: ['grep', 'citrusový grapefruit'],
    category: 'ovoce',
    servingForm: 'kusove',
    emoji: '🍊',
    icon: 'grapefruit',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Blána kolem dužniny je pevná a v puse se svine do celistvého kusu, který dásně nerozdělí.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Oloupej a každý díl zbav i vnitřní blány — právě ta je u citrusů to, co dítě nerozžvýká. Dužninu rozděl na kousky a nabídni je jako měkké sousto, nebo vymačkej pár kapek šťávy do jídla s luštěninami; vitamin C zlepší vstřebání jejich železa.',
        caution: 'Grapefruit je kyselejší než pomeranč a může podráždit kůži kolem pusy. Potři ji předem tenkou vrstvou tuku.',
      },
      '9m': {
        serving:
          'V devíti měsících podávej dužninu bez blan v kouscích, které dítě zvedne dvěma prsty. Kyselost se dá srovnat lžící jogurtu.',
        caution: 'Bílá dřeň pod kůrou je hořká; sloupni ji celou.',
      },
      '12m': {
        serving:
          'Batole jí grapefruit v kouscích i vymačkaný do zálivky. Růžové odrůdy jsou sladší než žluté, takže je děti přijímají snáz.',
        caution: 'Kyselé ovoce podávej k jídlu, ne samotné mezi jídly — je to šetrnější k zubní sklovině.',
      },
    },
    prepIdeas: [
      'dužnina bez blan v kouscích',
      'pár kapek šťávy k luštěninám',
      'do jogurtu s banánem',
      'do zálivky na salát',
    ],
    seasonCz: [11, 12, 1, 2, 3],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, NHS_CHOKING],
    reviewStatus: 'verified',
  },
  {
    id: 'pomelo',
    nameCz: 'pomelo',
    altNamesCz: ['pomela', 'šedok'],
    category: 'ovoce',
    servingForm: 'kusove',
    emoji: '🍊',
    icon: 'pomelo',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Blána kolem dužniny je u pomela obzvlášť tuhá a v puse drží tvar celistvého kusu.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Pomelo má silnou kůru a velmi tuhé blány, takže příprava zabere víc času než u pomeranče. Oloupej, každý díl rozdělej a blány odstraň úplně; zbylé šťavnaté váčky dužniny nabídni v kouscích.',
        caution: 'Blána je tady tužší než u jiných citrusů — když ji necháš, dítě ji vyplivne, nebo se s ní dusí.',
      },
      '9m': {
        serving:
          'V devíti měsících nabídni váčky dužniny, které dítě zvedne dvěma prsty. Pomelo je méně kyselé než grapefruit, takže projde i u dětí, které citrusy odmítají.',
        caution: 'Bílou dřeň sloupni celou, je hořká a tuhá.',
      },
      '12m': {
        serving:
          'Batole jí pomelo v kouscích i v ovocném salátu. Dužnina se nerozpadá, takže drží tvar i po smíchání s jiným ovocem.',
        caution: 'Kyselé ovoce podávej spíš k jídlu než samotné mezi jídly.',
      },
    },
    prepIdeas: [
      'váčky dužniny bez blan',
      'do ovocného salátu',
      'do jogurtu',
      's kouskem avokáda',
    ],
    seasonCz: [11, 12, 1, 2],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, NHS_CHOKING],
    reviewStatus: 'verified',
  },
  {
    id: 'meloun-zluty',
    nameCz: 'meloun žlutý',
    altNamesCz: ['honeydew', 'medový meloun', 'meloun medový'],
    category: 'ovoce',
    servingForm: 'kusove',
    emoji: '🍈',
    icon: 'meloun-zluty',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Kostka melounu je kluzká a pevná zároveň, takže dítěti sklouzne do hrdla dřív, než ji stačí rozžvýkat.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Žlutý meloun je sladší a pevnější než vodní. Nakrájej ho na proužky dlouhé jako dospělý prst, ne na kostky — proužek se dá uchopit a kostka sklouzne.',
        caution: 'Vyber zralý, tvrdý meloun je pro dítě moc pevný na rozžvýkání.',
      },
      '9m': {
        serving:
          'V devíti měsících nech proužky kratší, na uchopení dvěma prsty. Meloun je z velké části voda, takže se hodí v horkých dnech.',
        caution: 'Kluzké kousky dítěti vyklouzávají; osuš je kouskem utěrky, líp je udrží.',
      },
      '12m': {
        serving:
          'Batole jí meloun nakrájený na sousta i v ovocném salátu. Dužnina u kůry je méně sladká, tu odkroj.',
        caution: 'Nakrojený meloun skladuj v lednici zabalený, rychle nasává pachy.',
      },
    },
    prepIdeas: [
      'proužky dlouhé jako prst',
      'do ovocného salátu',
      'rozmixovaný do jogurtu',
      's mátou pro dospělé',
    ],
    seasonCz: [7, 8, 9],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, NHS_CHOKING],
    reviewStatus: 'verified',
  },
  {
    id: 'lici',
    nameCz: 'liči',
    altNamesCz: ['lychee', 'liči čínské'],
    category: 'ovoce',
    servingForm: 'drobne',
    emoji: '🍒',
    icon: 'lici',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'high',
    chokingReason:
      'Oloupané liči je kulaté, kluzké a má průměr odpovídající dýchacím cestám malého dítěte. Uvnitř je navíc tvrdá pecka.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Oloupej slupku, vyndej pecku a dužninu rozřež podélně na čtvrtky — celé ani přepůlené liči se nepodává nikdy, kulatý tvar dýchací cesty uzavře. Čtvrtky můžeš ještě rozmačkat vidličkou.',
        caution: 'Pecku hledej pohledem i prstem, u zralého plodu drží jen volně.',
      },
      '9m': {
        serving:
          'Pravidlo krájet podélně na čtvrtky platí beze změny. Zručná ruka na věci nic nemění: dítě kousek zvedne, ale tvar zůstává stejně rizikový.',
        caution: 'Konzervovaná liči bývají ve sladkém nálevu; sceď je a propláchni.',
      },
      '12m': {
        serving:
          'Batole jí liči nakrájené na čtvrtky. Celý plod nech až na dobu, kdy dítě spolehlivě žvýká — u kulatého ovoce se s tím nespěchá.',
        caution: 'Slupka je nepoživatelná, sloupni ji celou.',
      },
    },
    prepIdeas: [
      'podélné čtvrtky bez pecky',
      'rozmačkané do jogurtu',
      'do ovocného salátu',
      'rozmixované do pyré',
    ],
    seasonCz: [6, 7, 8],
    vegetarian: true,
    sources: [NHS_CHOKING, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
  {
    id: 'granatove-jablko',
    nameCz: 'granátové jablko',
    altNamesCz: ['granátovník', 'granátová jádra'],
    category: 'ovoce',
    servingForm: 'drobne',
    emoji: '🍎',
    icon: 'granatove-jablko',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'high',
    chokingReason:
      'Uvnitř každého šťavnatého jádra je tvrdé jadérko, které dásně nerozdrtí. Jádro je kluzké a spolkne se celé.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Volná jádra se malému dítěti nepodávají. Vymačkej z nich šťávu a pár kapek přidej do jogurtu nebo do jídla s luštěninami, nebo jádra rozmačkej v sítu a protlač; tvrdá jadérka tím zůstanou v sítu.',
        caution: 'Vylouskaná jádra vypadají jako drobné ovoce, ale tvrdé semínko uvnitř z nich dělá něco jiného.',
      },
      '9m': {
        serving:
          'V devíti měsících dál jen protlačená šťáva nebo rozmačkaná dužnina bez jadérek. Pár kapek šťávy zlepší vstřebání železa z čočky nebo z cizrny ve stejném jídle.',
        caution: 'Šťáva silně barví, počítej s tím u oblečení i u prkénka.',
      },
      '12m': {
        serving:
          'I po prvním roce podávej spíš protlačenou šťávu než volná jádra. Celá jádra nech na dobu, kdy dítě spolehlivě žvýká a jí vsedě bez pobíhání.',
        caution: 'Jádra nikdy nedávej do misky, ze které si dítě samo nabírá hrstí.',
      },
    },
    prepIdeas: [
      'protlačená šťáva do jogurtu',
      'pár kapek k čočce nebo cizrně',
      'rozmačkaná dužnina bez jadérek',
      'do ovocného pyré',
    ],
    seasonCz: [10, 11, 12, 1],
    vegetarian: true,
    sources: [NHS_CHOKING, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
  {
    id: 'mucenka',
    nameCz: 'mučenka',
    altNamesCz: ['maracuja', 'passion fruit', 'marakuja'],
    category: 'ovoce',
    servingForm: 'kasovite',
    emoji: '🥭',
    icon: 'mucenka',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Mučenka je uvnitř rosolovitá dužnina s drobnými jadérky. Vylžičkuj ji a protlač sítem, ať v porci zůstane jen šťáva a dužnina; jadérka jsou tvrdá a pro první porce se nehodí.',
        caution: 'Plod je zralý, když je slupka svraštělá — hladká a lesklá mučenka je ještě kyselá.',
      },
      '9m': {
        serving:
          'V devíti měsících můžeš nechat část jadérek, pokud je dítě zvyklé na hrubší strukturu. Lžíce protlačené dužniny dodá jogurtu chuť bez přidávání čehokoli dalšího.',
        caution: 'Mučenka je výrazně kyselá; míchej ji s banánem nebo s jogurtem.',
      },
      '12m': {
        serving:
          'Batole jí mučenku vylžičkovanou přímo z plodu i vmíchanou do kaše. Jadérka jsou poživatelná a křupou, což děti často baví.',
        caution: 'Kyselé ovoce podávej spíš k jídlu než samotné mezi jídly.',
      },
    },
    prepIdeas: [
      'protlačená dužnina do jogurtu',
      'lžíce do ovesné kaše',
      'do ovocného pyré',
      'na lívanečky místo sirupu',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, NHS_CHOKING],
    reviewStatus: 'verified',
  },
  {
    id: 'kokos-strouhany',
    nameCz: 'kokos strouhaný',
    altNamesCz: ['strouhaný kokos', 'kokosová moučka'],
    category: 'ovoce',
    servingForm: 'kasovite',
    emoji: '🥥',
    icon: 'kokos-strouhany',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Suché nitky se v puse spečou do chuchvalce a nasáknou sliny, místo aby změkly. Navlhčené tuhle vlastnost ztrácejí.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Suchý kokos nikdy nesyp nasucho. Vmíchej ho do jogurtu, do kaše nebo do vlhkého těsta a nech ho několik minut nasáknout — teprve pak se dá podat.',
        caution: 'Kokosové chipsy a hrubé vločky do dětské porce nepatří, jsou tvrdé a ostré.',
      },
      '9m': {
        serving:
          'V devíti měsících ho přidej do těsta na placičky nebo do kaše. Jemná kokosová moučka nasákne rychleji než hrubé strouhání.',
        caution: 'Slazený kokos na pečení je cukrovinka, ne surovina.',
      },
      '12m': {
        serving:
          'Batole jí kokos v pečení, v kaši i v ovocném pyré. Dodá jídlu tuk, který malé dítě potřebuje víc než dospělý.',
        caution: 'Skladuj v chladu, kokos je tučný a žlukne.',
      },
    },
    prepIdeas: [
      'vmíchaný do jogurtu s ovocem',
      'do ovesné kaše',
      'do těsta na placičky',
      'do ovocného pyré',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_CHOKING, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
  {
    id: 'brusinky-cerstve',
    nameCz: 'brusinky čerstvé',
    altNamesCz: ['klikva', 'čerstvé brusinky'],
    category: 'ovoce',
    servingForm: 'drobne',
    emoji: '🔴',
    icon: 'brusinky-cerstve',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'high',
    chokingReason:
      'Brusinka je kulatá, pevná a má průměr, který dýchací cesty malého dítěte uzavře celé.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Syrovou brusinku nikdy nepodávej celou — rozřež ji podélně na čtvrtky, nebo ji radši uvař na kompot a rozmačkej. Vařená brusinka se rozpadne sama a kulatý tvar tím ztratí.',
        caution: 'Brusinky jsou velmi trpké; bez osladění je většina dětí odmítne, a sladit se do roka nemá čím.',
      },
      '9m': {
        serving:
          'V devíti měsících platí totéž: uvařit a rozmačkat, nebo každou syrovou bobuli rozřezat podélně na čtvrtky. Trpkost srovnej rozvařeným jablkem nebo hruškou ve stejném hrnci.',
        caution: 'Trpkost srovnávej ovocem, ne ničím jiným — do roka se porce nepřislazuje.',
      },
      '12m': {
        serving:
          'Batole jí brusinkovou omáčku k masu i rozvařené brusinky v kaši. Celé syrové bobule nech na později, trpkost i tvar jsou proti nim.',
        caution: 'Kupovaná brusinková omáčka i sušené brusinky bývají silně doslazované; čti složení.',
      },
    },
    prepIdeas: [
      'rozvařené s jablkem na omáčku',
      'podélné čtvrtky do jogurtu',
      'rozmačkané do ovesné kaše',
      'omáčka k pečenému masu pro dospělé',
    ],
    seasonCz: [9, 10, 11],
    vegetarian: true,
    sources: [NHS_CHOKING, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
  {
    id: 'aronie',
    nameCz: 'aronie',
    altNamesCz: ['černý jeřáb', 'temnoplodec'],
    category: 'ovoce',
    servingForm: 'drobne',
    emoji: '🫐',
    icon: 'aronie',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'high',
    chokingReason:
      'Aronie je kulatá bobule velikosti borůvky, která se do dýchacích cest vejde celá.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Syrovou bobuli rozřež podélně na čtvrtky, nebo ji rozvař a protlač — vařením se trpkost zmírní a kulatý tvar zmizí. Samotná aronie je pro dítě příliš svíravá, míchej ji s jablkem nebo s hruškou.',
        caution: 'Šťáva barví tmavě fialově a z textilu jde ven špatně.',
      },
      '9m': {
        serving:
          'Každou syrovou bobuli dál řež podélně na čtvrtky, nebo ji podávej rozvařenou. Aronie je natolik trpká, že se v čisté podobě do dětské porce nehodí.',
        caution: 'Svíravá chuť pochází z tříslovin, které mohou zhoršit vstřebání železa ve stejném jídle.',
      },
      '12m': {
        serving:
          'Batole jí aronii rozvařenou v kaši nebo v ovocné omáčce. Čerstvé bobule zůstávají spíš surovinou na zpracování než na zobání.',
        caution: 'Aroniové šťávy z obchodu bývají doslazované.',
      },
    },
    prepIdeas: [
      'rozvařená s jablkem do pyré',
      'podélné čtvrtky do jogurtu',
      'protlačená do ovesné kaše',
      'do ovocné omáčky',
    ],
    seasonCz: [8, 9, 10],
    vegetarian: true,
    sources: [NHS_CHOKING, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
  {
    id: 'rakytnik',
    nameCz: 'rakytník',
    altNamesCz: ['rakytníkové bobule', 'sea buckthorn'],
    category: 'ovoce',
    servingForm: 'kasovite',
    emoji: '🟠',
    icon: 'rakytnik',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Bobule je drobná a měkká, ale uvnitř má tvrdé jadérko, které dásně nerozdrtí.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Rakytník se pro dítě zpracovává, ne zobe. Bobule rozmačkej a protlač sítem, aby v porci zůstala jen dužnina bez tvrdých jadérek, a lžičku vmíchej do jogurtu nebo do kaše.',
        caution: 'Chuť je velmi kyselá a svíravá; samotný rakytník dítě nepřijme.',
      },
      '9m': {
        serving:
          'V devíti měsících dál jen protlačená dužnina. Kyselost srovnej banánem nebo dušenou hruškou ve stejné misce.',
        caution: 'Šťáva je natolik kyselá, že dráždí kůži kolem pusy; potři ji předem tenkou vrstvou tuku.',
      },
      '12m': {
        serving:
          'Batole jí rakytník v kaši i v ovocné omáčce. Pořád ho protlačuj, jadérka se v puse nerozdrtí.',
        caution: 'Rakytníkové nápoje z obchodu bývají silně doslazované.',
      },
    },
    prepIdeas: [
      'protlačená dužnina do jogurtu',
      'lžička do ovesné kaše',
      'smíchaný s banánovým pyré',
      'do ovocné omáčky',
    ],
    seasonCz: [9, 10, 11],
    vegetarian: true,
    sources: [NHS_CHOKING, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
];
