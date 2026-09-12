import type { Ingredient } from '@/types';
import {
  BP_GLUTEN,
  EFSA_ARSENIC,
  EFSA_ARSENIC_UPDATE,
  MZCR_COMPLEMENTARY,
  NHS_10_12M,
  NHS_6M,
  NHS_7_9M,
  NHS_AVOID,
  NHS_DRINKS,
  NHS_FIRST_FOODS,
  NHS_YOUNG_CHILDREN,
  WHO_COMPLEMENTARY,
} from './_sources';

/**
 * Kategorie „obiloviny" podle docs/SUROVINY-SEZNAM.md.
 *
 * Seznam v dokumentu má v nadpisu číslo 24, ale vyjmenovává 26 položek.
 * Podle pravidla „nic nevynecháno" je tady všech 26.
 *
 * Rýže a rýžové výrobky nesou hazard `arsen` s pokynem propláchnout zrno
 * a vařit v nadbytku vody; pečivo nese hazard `sul`.
 */
export const grains: Ingredient[] = [
  {
    id: 'ovesne-vlocky-jemne',
    nameCz: 'ovesné vločky jemné',
    altNamesCz: ['jemné vločky', 'ovesná kaše jemná'],
    category: 'obiloviny',
    emoji: '🥣',
    allergens: ['psenice-lepek'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Jemné vločky rozvař v mateřském mléce, umělém mléce nebo ve vodě do husté kaše, která drží na obrácené lžíci. Hustá kaše se dá nabrat, řídká jen kape a dítě se u ní vzteká.',
        caution: 'Kaši nech vychladnout a před podáním promíchej, uprostřed bývá horká.',
      },
      '9m': {
        serving:
          'Kaši dělej hrubší a přimíchej kousky ovoce, ať má dítě co objevovat. V tomhle věku už zvládne nabírat vlastní lžící, i když polovina skončí na bryndáku.',
        caution: 'Nesypej vločky nikdy nasucho do pusy, suché lepí na patro.',
      },
      '12m': {
        serving:
          'Batole jí ovesnou kaši i s většími kusy ovoce nebo s mletými ořechovými máslem. Vločky se hodí i jako zahušťovadlo do polévek a do placek pečených bez tuku.',
        caution: 'Instantní kaše z obchodu kontroluj na přidanou sladkou složku.',
      },
    },
    prepIdeas: [
      'rozvařená kaše s ovocným pyré',
      'zahuštění zeleninové polévky',
      'obalení kluzkého ovoce pro lepší úchop',
      'ovesné placky pečené na sucho',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_6M, BP_GLUTEN],
    reviewStatus: 'verified',
  },
  {
    id: 'ovesne-vlocky-velke',
    nameCz: 'ovesné vločky velké',
    altNamesCz: ['velké vločky', 'vločky na müsli'],
    category: 'obiloviny',
    emoji: '🥣',
    allergens: ['psenice-lepek'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Velké vločky potřebují delší var než jemné, proto je namoč přes noc nebo vař aspoň deset minut. Po rozvaření je rozmixuj, celá vločka je pro první měsíce příkrmu zbytečně tuhá.',
        caution: 'Syrové velké vločky v této fázi nenabízej, jsou tvrdé.',
      },
      '9m': {
        serving:
          'Dobře rozvařené velké vločky nech v kaši celé, dítě si zvyká na strukturu. Dá se z nich upéct i placka, kterou udrží v ruce a rozkouše dásněmi.',
        caution: 'Müsli směsi obvykle obsahují celé kusy sušeného ovoce, ty vyber.',
      },
      '12m': {
        serving:
          'Batole zvládne velké vločky i jen namočené v mléce. Hodí se do domácí granoly bez sladkých přísad, kde nahradí kupované cereálie plné přidané sladké složky.',
        caution: 'Vločky s příchutí obsahují sladidla, kupuj jen čisté.',
      },
    },
    prepIdeas: [
      'namočené přes noc do jogurtu',
      'rozvařené na hustou kaši',
      'zapečené v ovocném nákypu',
      'upečené na placky do ruky',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_6M, NHS_7_9M],
    reviewStatus: 'verified',
  },
  {
    id: 'oves-bezlepkovy',
    nameCz: 'oves bezlepkový',
    altNamesCz: ['bezlepkové ovesné vločky', 'oves bez lepku'],
    category: 'obiloviny',
    emoji: '🌾',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Bezlepkový oves se pěstuje a zpracovává odděleně od pšenice, takže neobsahuje příměs lepku. Připravuje se stejně jako běžné vločky, tedy rozvařením do husté kaše.',
        caution: 'Bez diagnózy celiakie není důvod lepek z jídelníčku vyřazovat.',
      },
      '9m': {
        serving:
          'Kaše z bezlepkového ovsa snese kousky ovoce i lžíci mletých lněných semínek. Chuťově se od běžných vloček neliší, rozdíl je jen v tom, jak se zrno zpracovává.',
        caution: 'Kontroluj značku přeškrtnutého klasu na obalu.',
      },
      '12m': {
        serving:
          'Batoleti slouží bezlepkový oves stejně jako obyčejný, jen se hodí do domácností, kde někdo lepek nesnáší. V ostatních případech volte podle ceny, nutričně jsou srovnatelné.',
        caution: 'Zavádění lepku u zdravého dítěte se neodkládá, řeš to s pediatrem.',
      },
    },
    prepIdeas: [
      'rozvařená bezlepková kaše',
      'zahuštění ovocného pyré',
      'základ pro bezlepkové placky',
      'namočený do jogurtu',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [BP_GLUTEN, MZCR_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'mouka-psenicna-hladka',
    nameCz: 'mouka pšeničná hladká',
    altNamesCz: ['hladká mouka'],
    category: 'obiloviny',
    emoji: '🌾',
    allergens: ['psenice-lepek'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Hladká mouka se sama o sobě nepodává, slouží jako základ placek, lívanců a zahuštění. Právě přes ni se obvykle poprvé dostane do jídelníčku lepek, který se zavádí postupně a v malém množství.',
        caution: 'Syrové těsto dítěti nedávej, mouka není tepelně ošetřená.',
      },
      '9m': {
        serving:
          'Z hladké mouky upeč lívance bez sladké složky nebo tenké placky, které dítě drží v ruce. Zahustit s ní můžeš i zeleninovou omáčku, aby lépe držela na těstovině.',
        caution: 'Placky peč na suché pánvi nebo s kapkou oleje.',
      },
      '12m': {
        serving:
          'Batoleti připravíš z hladké mouky domácí těstoviny, knedlíčky do polévky i piškoty. V domácím pečení máš plnou kontrolu nad tím, kolik se do těsta dostane sladké složky.',
        caution: 'Hotové pečivo z obchodu bývá slanější, než čekáš.',
      },
    },
    prepIdeas: [
      'tenké placky pečené na sucho',
      'lívance bez sladké složky',
      'zahuštění zeleninové omáčky',
      'domácí těstoviny',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [BP_GLUTEN, NHS_6M],
    reviewStatus: 'verified',
  },
  {
    id: 'mouka-psenicna-celozrnna',
    nameCz: 'mouka pšeničná celozrnná',
    altNamesCz: ['celozrnná pšeničná mouka'],
    category: 'obiloviny',
    emoji: '🌾',
    allergens: ['psenice-lepek'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Celozrnná mouka obsahuje obal zrna, a tedy víc vlákniny i minerálů než hladká. Pro první placky ji mísi s hladkou v poměru půl na půl, jinak je výsledek příliš hutný.',
        caution: 'Velký podíl vlákniny u malého dítěte snižuje vstřebávání železa.',
      },
      '9m': {
        serving:
          'Z poloviční celozrnné směsi upeč placky nebo muffiny bez sladké složky. Vláknina podpoří trávení, ale drž se rozumného podílu, aby jídlo nebylo objemné na úkor energie.',
        caution: 'Celozrnnou mouku skladuj v lednici, rychle žlukne.',
      },
      '12m': {
        serving:
          'Batole už zvládne pečivo z čistě celozrnné mouky. Pokud odmítá tmavé pečivo, začni znovu od poloviční směsi a podíl zvyšuj po týdnech.',
        caution: 'Vždy podávej dostatek vody, vláknina bez tekutin zahušťuje stolici.',
      },
    },
    prepIdeas: [
      'poloviční směs do placek',
      'celozrnné muffiny bez sladké složky',
      'zahuštění luštěninové polévky',
      'domácí celozrnné těstoviny',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [BP_GLUTEN, WHO_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'mouka-spaldova',
    nameCz: 'mouka špaldová',
    altNamesCz: ['špaldová mouka'],
    category: 'obiloviny',
    emoji: '🌾',
    allergens: ['psenice-lepek'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Špalda je starší příbuzná pšenice a lepek obsahuje také, takže pro dítě s celiakií vhodná není. Chuť má jemně zemitou a těsto z ní bývá vláčnější než z běžné hladké mouky.',
        caution: 'Nezaměňuj špaldu za bezlepkovou surovinu, to je častý omyl.',
      },
      '9m': {
        serving:
          'Ze špaldové mouky upeč měkké placky nebo lívance, které dítě udrží v pěsti. Těsto potřebuje kratší hnětení než pšeničné, jinak se lepek naruší a pečivo se drolí.',
        caution: 'Špaldové pečivo z obchodu bývá dražší, doma vyjde levněji.',
      },
      '12m': {
        serving:
          'Batoleti připravíš ze špaldy domácí těstoviny, noky i sladké pečení bez přidané sladké složky. Celozrnná špalda je nutričně nejbohatší, ale peče se hůř než světlá.',
        caution: 'Při ekzému sleduj reakci stejně jako u běžné pšenice.',
      },
    },
    prepIdeas: [
      'vláčné špaldové placky',
      'lívance na suché pánvi',
      'domácí špaldové noky',
      'zahuštění dušené zeleniny',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [BP_GLUTEN, MZCR_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'mouka-zitna',
    nameCz: 'mouka žitná',
    altNamesCz: ['žitná mouka'],
    category: 'obiloviny',
    emoji: '🌾',
    allergens: ['psenice-lepek'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Žitná mouka má tmavší barvu, výraznější chuť a slabší lepkovou síť než pšeničná. Samotné žitné těsto je lepivé, proto ho pro dítě vždy mísi s moukou pšeničnou nebo špaldovou.',
        caution: 'Žito patří mezi obiloviny s lepkem, značí se jako alergen.',
      },
      '9m': {
        serving:
          'Ze směsi žitné a pšeničné mouky upeč doma malé placky bez soli. Žito dodá pečivu vlhkost, takže vydrží měkké déle, což se u svačiny na cesty hodí.',
        caution: 'Kupovaný žitný chléb obsahuje výrazně víc soli než domácí placka.',
      },
      '12m': {
        serving:
          'Batole zvládne i hutnější žitné pečivo nakrájené na prsty. Žitná mouka se hodí i k zahuštění omáček, kterým dodá zemitou chuť a tmavší barvu.',
        caution: 'Kvašené žitné těsto se peče déle, uvnitř může zůstat syrové.',
      },
    },
    prepIdeas: [
      'směs se pšeničnou moukou na placky',
      'domácí žitný chléb bez soli',
      'zahuštění houbové omáčky',
      'žitné lívance na sucho',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [BP_GLUTEN, NHS_YOUNG_CHILDREN],
    reviewStatus: 'verified',
  },
  {
    id: 'chleb-kvaskovy',
    nameCz: 'chléb kváskový žitno-pšeničný',
    altNamesCz: ['kváskový chléb', 'žitno-pšeničný chléb'],
    category: 'obiloviny',
    emoji: '🍞',
    allergens: ['psenice-lepek'],
    isKeyAllergen: true,
    chokingRisk: 'medium',
    chokingReason:
      'Měkká střída se v ústech slepí do kompaktního těsta, které dítě nedokáže rozdělit na menší kusy a spolkne ho vcelku.',
    hazards: ['sul'],
    hazardNotes: {
      sul: 'Chléb je v českém jídelníčku jedním z největších zdrojů soli. Do prvního roku by měl být příjem soli velmi nízký, proto z něj podávej jen malé kousky a zbytek dne k nim už žádné slané potraviny nepřidávej.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Nakrájej chléb na prsty široké jako tvůj palec a nech je krátce oschnout nebo je opeč, ať se střída nelepí. Kůrku odřízni, je tvrdá a obsahuje nejvíc soli z celého bochníku.',
        caution: 'Čerstvý měkký chléb se v ústech mění v těsto, nech ho okorat.',
      },
      '9m': {
        serving:
          'Osušené prsty chleba potři tvarohem nebo avokádem, aby se lépe polykaly. Dítě už se s nimi naučí mířit do pusy a trénuje si kousání o tužší okraj.',
        caution: 'Množství drž malé, jeden až dva prsty chleba denně stačí.',
      },
      '12m': {
        serving:
          'Batole jí chléb nakrájený na kostky nebo na trojúhelníky s pomazánkou. Kváskový chléb se tráví lépe než droždový a vydrží déle vláčný bez přidaných látek.',
        caution: 'Sleduj celkový příjem soli, když k chlebu přidáš sýr.',
      },
    },
    prepIdeas: [
      'opečené prsty s avokádovou pomazánkou',
      'kostky osušené v troubě',
      'namočený do zeleninové polévky',
      'základ pod tvarohovou pomazánku',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, BP_GLUTEN],
    reviewStatus: 'verified',
  },
  {
    id: 'chleb-toustovy',
    nameCz: 'chléb toustový',
    altNamesCz: ['toustový chléb', 'tousty'],
    category: 'obiloviny',
    emoji: '🍞',
    allergens: ['psenice-lepek'],
    isKeyAllergen: true,
    chokingRisk: 'medium',
    chokingReason:
      'Neopečený toustový chléb je vláčný a po rozžvýkání se svine do husté kuličky, která se přilepí na patro.',
    hazards: ['sul'],
    hazardNotes: {
      sul: 'Toustový chléb bývá slanější než běžný a kromě soli obsahuje často i přidaný tuk a stabilizátory. Pro miminko je to nouzová volba, kváskový chléb nebo domácí placka jsou lepší.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Toust vždy nejdřív opeč a pak nakrájej na proužky, opečený povrch drží tvar a nelepí se. Neopečený plátek v téhle fázi nenabízej, ve vlhku se rozpadne na lepivou hmotu.',
        caution: 'Kontroluj složení, některé značky obsahují přidanou sladkou složku.',
      },
      '9m': {
        serving:
          'Opečené proužky potři tenkou vrstvou tvarohu nebo ořechového másla rozředěného vodou. Dítě se na nich učí ukusovat a její kousání získá rytmus.',
        caution: 'Ořechové máslo vždy rozřeď, husté se lepí v hrdle.',
      },
      '12m': {
        serving:
          'Batole zvládne opečený toust nakrájený na kostky i s jemnou náplní. Vybírej celozrnné varianty, mají víc vlákniny i minerálů než bílé.',
        caution: 'Spálený toust seškrábni, hořká kůrka obsahuje nežádoucí látky.',
      },
    },
    prepIdeas: [
      'opečené proužky s tvarohem',
      'kostky do zeleninové polévky',
      'základ pod avokádovou pomazánku',
      'osušené kostky jako domácí krutony',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_YOUNG_CHILDREN],
    reviewStatus: 'verified',
  },
  {
    id: 'rohlik-houska',
    nameCz: 'rohlík / houska',
    altNamesCz: ['rohlík', 'houska', 'bílé pečivo'],
    category: 'obiloviny',
    emoji: '🥖',
    allergens: ['psenice-lepek'],
    isKeyAllergen: true,
    chokingRisk: 'medium',
    chokingReason:
      'Z rohlíku se odlamují tvrdé kousky kůrky a měkký vnitřek se zároveň slepuje, takže v ústech vznikne nesourodé sousto.',
    hazards: ['sul'],
    hazardNotes: {
      sul: 'Běžné bílé pečivo z pekárny má vysoký obsah soli a k tomu minimum vlákniny. Do prvního roku se hodí spíš výjimečně a v malém množství, ne jako každodenní základ svačiny.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Použij jen vnitřek rohlíku nakrájený na prsty a nech ho okorat na vzduchu. Kůrku odřízni celou, protože se z ní odlamují tvrdé úlomky, které dásně nerozmělní.',
        caution: 'Rohlík nikdy nedávej celý do ruky, i když se to nabízí.',
      },
      '9m': {
        serving:
          'Osušené proužky namoč do zeleninové polévky nebo je potři pomazánkou. Dítě se na nich učí odkusovat, ale sleduj, kolik si toho strčí do pusy najednou.',
        caution: 'Dbej na to, aby k pečivu vždy měla vodu.',
      },
      '12m': {
        serving:
          'Batole jí rohlík rozkrojený a namazaný, případně nakrájený na kostky. Pořád jde o slanou potravinu, takže ho nedávej ke každému jídlu.',
        caution: 'Loupáček ani croissant nejsou náhrada, mají přidanou sladkou složku.',
      },
    },
    prepIdeas: [
      'vnitřek osušený na prsty',
      'kostky namočené v polévce',
      'základ pod tvarohovou pomazánku',
      'strouhanka z osušeného pečiva',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_YOUNG_CHILDREN],
    reviewStatus: 'verified',
  },
  {
    id: 'testoviny-semolinove',
    nameCz: 'těstoviny semolinové',
    altNamesCz: ['semolinové těstoviny', 'klasické těstoviny'],
    category: 'obiloviny',
    emoji: '🍝',
    allergens: ['psenice-lepek'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Vař těstoviny déle, než uvádí obal, měly by být měkké až rozvařené. Vybírej velké tvary, třeba široké nudle nebo veliké mušle, které dítě pohodlně uchopí celou dlaní.',
        caution: 'Vodu na vaření nesol, těstoviny sůl nasávají do sebe.',
      },
      '9m': {
        serving:
          'Uvařené těstoviny nakrájej na kousky velikosti sousta a promíchej je s rajčatovou nebo zeleninovou omáčkou. Kluzký povrch se lépe drží, když je omáčka hustá.',
        caution: 'Drobné tvary jako kolínka jsou kluzká, krájej je na poloviny.',
      },
      '12m': {
        serving:
          'Batole zvládne těstoviny uvařené na skus i větší tvary vcelku. Nauč ho nabírat je vidličkou, motání špaget je pro jemnou motoriku výborný trénink.',
        caution: 'Dlouhé špagety krájej, aby se dítě nesnažilo polykat celý pramen.',
      },
    },
    prepIdeas: [
      'velké tvary vařené doměkka',
      'promíchané s rajčatovou omáčkou',
      'zapečené s tvarohem a zeleninou',
      'do zeleninové polévky',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
  {
    id: 'testoviny-celozrnne',
    nameCz: 'těstoviny celozrnné',
    altNamesCz: ['celozrnné těstoviny'],
    category: 'obiloviny',
    emoji: '🍝',
    allergens: ['psenice-lepek'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Celozrnné těstoviny zůstávají i po uvaření pevnější, proto jim dopřej o tři minuty víc než klasickým. Pro první porce je mísi napůl se světlými, jinak je pokrm hodně objemný.',
        caution: 'Velký podíl vlákniny zasytí dřív, než dítě přijme dost energie.',
      },
      '9m': {
        serving:
          'Nakrájené celozrnné těstoviny promíchej s hustou zeleninovou omáčkou. Tmavší chuť některým dětem nevyhovuje hned, nabídni je znovu za pár dní bez komentáře.',
        caution: 'Celozrnné tvary se hůř nabírají, vyber kratší druhy.',
      },
      '12m': {
        serving:
          'Batoleti nabízej celozrnné těstoviny jako běžnou součást oběda. Dodají víc vlákniny, hořčíku i vitaminů skupiny B než bílé a dobře drží omáčku.',
        caution: 'K celozrnnému jídlu vždy přidej vodu nebo polévku.',
      },
    },
    prepIdeas: [
      'vařené s dušenou zeleninou',
      'zapečené s ricottou',
      'promíchané s luštěninovou omáčkou',
      'do vývaru bez soli',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [BP_GLUTEN, WHO_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'kuskus',
    nameCz: 'kuskus',
    altNamesCz: ['couscous'],
    category: 'obiloviny',
    emoji: '🍚',
    allergens: ['psenice-lepek'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Kuskus zalij vroucí vodou, nech deset minut nabobtnat a rozvolni vidličkou. Samotná sypká zrnka dítě nenabere, proto je smíchej se zeleninovým pyré do hustší hmoty.',
        caution: 'Sypký kuskus se snadno vdechne, vždy ho podávej vlhký.',
      },
      '9m': {
        serving:
          'Nabobtnalý kuskus smíchej s dušenou zeleninou a s lžící jogurtu, aby držel pohromadě. Dá se z něj vytvarovat i malá kulička, kterou dítě uchopí prsty.',
        caution: 'Po jídle zkontroluj dítěti ústa, zrnka se lepí za tvář.',
      },
      '12m': {
        serving:
          'Batole jí kuskus lžící jako přílohu k dušené zelenině nebo k luštěninám. Připravuje se během deseti minut, takže je to záchrana pro dny bez času na vaření.',
        caution: 'Kupované směsi kuskusu s kořením obsahují sůl, kupuj čistý.',
      },
    },
    prepIdeas: [
      'nabobtnalý se zeleninovým pyré',
      'kuličky do ruky s jogurtem',
      'smíchaný s dušenou cuketou',
      'jako příloha k luštěninám',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [BP_GLUTEN, NHS_7_9M],
    reviewStatus: 'verified',
  },
  {
    id: 'bulgur',
    nameCz: 'bulgur',
    altNamesCz: ['bulghur', 'pšeničná krupice předvařená'],
    category: 'obiloviny',
    emoji: '🍚',
    allergens: ['psenice-lepek'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Bulgur je předvařená drcená pšenice, stačí ho tedy zalít vroucí vodou a nechat nasáknout. Pro první porce vyber jemnou zrnitost a smíchej ho s pyré, ať vznikne souvislá hmota.',
        caution: 'Hrubý bulgur zůstává tvrdší, pro tuhle fázi se nehodí.',
      },
      '9m': {
        serving:
          'Nabobtnalý bulgur promíchej s dušenou zeleninou a kapkou olivového oleje. Má výraznější obilnou chuť než kuskus a dobře drží tvar, když z něj vytvaruješ malé placičky.',
        caution: 'Hotové směsi typu tabbouleh obsahují sůl, míchej si vlastní.',
      },
      '12m': {
        serving:
          'Batole jí bulgur jako přílohu nebo jako základ salátu s rajčaty a bylinkami. Nabírá se dobře lžící a je hotový rychleji než rýže, což se při vaření pro celou rodinu hodí.',
        caution: 'Bulgur obsahuje lepek, není náhrada pro bezlepkovou dietu.',
      },
    },
    prepIdeas: [
      'nabobtnalý se zeleninovým pyré',
      'placičky s vejcem',
      'salát s rajčaty a petrželkou',
      'do plněné papriky pro celou rodinu',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [BP_GLUTEN, NHS_7_9M],
    reviewStatus: 'verified',
  },
  {
    id: 'ryze-basmati',
    nameCz: 'rýže basmati',
    altNamesCz: ['basmati'],
    category: 'obiloviny',
    emoji: '🍚',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: ['arsen'],
    hazardNotes: {
      arsen:
        'Rýže podle NHS přijímá z půdy víc anorganického arsenu než ostatní obiloviny a EFSA ji jmenuje mezi hlavními zdroji expozice v evropské stravě. Zrno proto před vařením propláchni a vař ho v nadbytku vody, kterou pak slij; rýži zároveň nedávej jako jediný denní zdroj obilovin.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Basmati několikrát propláchni ve studené vodě, dokud voda nezůstane čirá, a vař ji v šesti dílech vody, kterou po uvaření slij. Rozvařená zrna pak rozmačkej nebo smíchej s pyré.',
        caution: 'Uvařenou rýži nikdy nenechávej stát v teple, rychle se kazí.',
      },
      '9m': {
        serving:
          'Dobře uvařená basmati zůstává sypká, proto ji spoj s omáčkou nebo s jogurtem, aby ji dítě nabralo. Dlouhé zrno se hodí ke kari zelenině i k dušeným luštěninám.',
        caution: 'Ohřívej jen jednou a jen porci, kterou dítě sní.',
      },
      '12m': {
        serving:
          'Batoleti podávej basmati jako běžnou přílohu, kterou nabírá lžící. Střídej ji s jinými obilovinami, aby se expozice arsenu z rýže nekumulovala den za dnem.',
        caution: 'Rýžové nápoje nejsou pro děti do pěti let vhodné vůbec.',
      },
    },
    prepIdeas: [
      'propláchnutá a vařená v nadbytku vody',
      'smíchaná s dušenou zeleninou',
      'rýžová kaše s ovocným pyré',
      'základ pod cizrnové kari',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [EFSA_ARSENIC, NHS_DRINKS],
    reviewStatus: 'verified',
  },
  {
    id: 'ryze-kulatozrnna',
    nameCz: 'rýže kulatozrnná',
    altNamesCz: ['kulatozrnná rýže', 'rýže na mléčnou kaši'],
    category: 'obiloviny',
    emoji: '🍚',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: ['arsen'],
    hazardNotes: {
      arsen:
        'I kulatozrnná rýže nese anorganický arsen, a protože se z ní nejčastěji vaří sladká kaše, hrozí, že se objeví v jídelníčku každý den. Propláchni ji, vař ve větším množství vody a střídej ji s jáhlami nebo s pohankou.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Kulaté zrno pouští škrob a vytváří krémovou kaši, která se skvěle nabírá lžící. Před vařením ho propláchni, vař v nadbytku vody a teprve pak dolej mléko, ať se arsen slije pryč.',
        caution: 'Kaši nesluď, sladkou chuť dodá rozmačkaný banán nebo hruška.',
      },
      '9m': {
        serving:
          'Hustší rýžová kaše drží na lžíci a dítě se u ní učí samostatně jíst. Do hotové kaše vmíchej ovocné pyré nebo lžíci mletých lněných semínek pro zdroj tuků.',
        caution: 'Uvařenou kaši nenech na lince, ukládej ji hned do lednice.',
      },
      '12m': {
        serving:
          'Batole jí mléčnou rýži jako plnohodnotnou snídani nebo večeři. Kulatozrnná rýže se hodí i do rizota pro celou rodinu, kde se porce pro dítě odebere před dosolením.',
        caution: 'Rýži v jídelníčku střídej, ne každý den.',
      },
    },
    prepIdeas: [
      'krémová mléčná kaše bez slazení',
      'rizoto pro celou rodinu',
      'rýžový nákyp s ovocem',
      'zahuštění zeleninové polévky',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [EFSA_ARSENIC, NHS_AVOID],
    reviewStatus: 'verified',
  },
  {
    id: 'ryze-natural',
    nameCz: 'rýže natural',
    altNamesCz: ['natural rýže', 'neloupaná rýže'],
    category: 'obiloviny',
    emoji: '🍚',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: ['arsen'],
    hazardNotes: {
      arsen:
        'Neloupaná rýže si ponechává obal zrna, ve kterém se arsen koncentruje nejvíc, takže jí obvykle obsahuje více než rýže bílá. Propláchnutí a vaření v nadbytku vody část arsenu odstraní, přesto ji u malého dítěte nenabízej denně.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Natural rýže potřebuje čtyřicet minut varu, aby zrno opravdu změklo. Po propláchnutí ji vař v hodně vodě, slij ji a uvařená zrna rozmixuj se zeleninou do hustého pyré.',
        caution: 'Nedovařená natural rýže je tvrdá a projde trávením nezměněná.',
      },
      '9m': {
        serving:
          'Rozvařená natural rýže má zemitou chuť a víc vlákniny než bílá. Smíchej ji s dušenou zeleninou a kouskem tofu, dítě tak dostane rostlinné železo i vitamin C ze zeleniny.',
        caution: 'Vzhledem k obalu zrna ji střídej s jinými obilovinami častěji.',
      },
      '12m': {
        serving:
          'Batoleti podávej natural rýži jako přílohu nebo v zapékaných pokrmech. Zasytí na delší dobu, ale objem vlákniny je vysoký, takže sleduj, kolik dítě sní energie celkem.',
        caution: 'Kombinuj s vitaminem C, zlepšuje vstřebávání železa z obilovin.',
      },
    },
    prepIdeas: [
      'dlouho vařená a rozmixovaná se zeleninou',
      's tofu a dušenou mrkví',
      'zapečená se zeleninou v troubě',
      'jako příloha k luštěninám',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [EFSA_ARSENIC_UPDATE, WHO_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'ryzove-chlebicky',
    nameCz: 'rýžové chlebíčky',
    altNamesCz: ['rýžové chleby', 'rýžové placky'],
    category: 'obiloviny',
    emoji: '🍘',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Chlebíček se v ústech rozpadne na suché ostré úlomky, které se lepí na patro a nedají se posunout ke krku slinami.',
    hazards: ['arsen'],
    hazardNotes: {
      arsen:
        'Rýžové chlebíčky jsou koncentrovaná rýže bez vody, takže arsen z nich nejde nijak vyplavit. Podle doporučení nemají být pro malé dítě denním základem svačin ani náhradou pečiva.',
    },
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Chlebíček nabízej jen výjimečně a vždy potřený tenkou vrstvou avokáda nebo tvarohu, aby úlomky držely pohromadě. Suchý chlebíček do ruky v téhle fázi nepatří.',
        caution: 'Nikdy nenech dítě jíst rýžový chlebíček nasucho a bez dozoru.',
      },
      '9m': {
        serving:
          'Potřený chlebíček rozlámej na kusy velikosti sousta a podávej je na talíři. Je to praktická svačina na cesty, ale kvůli arsenu i kvůli drolení ji nedávej každý den.',
        caution: 'Slané varianty s příchutí pro dítě vůbec nekupuj.',
      },
      '12m': {
        serving:
          'Batole jí rýžový chlebíček samo, pokud u toho sedí a pije vodu. Lepší volbou zůstává kousek chleba nebo domácí ovesná placka, které nesou méně rizik.',
        caution: 'Kukuřičné chlebíčky jsou z hlediska arsenu bezpečnější alternativa.',
      },
    },
    prepIdeas: [
      'potřený avokádem',
      'rozlámaný do zeleninové polévky',
      'potřený tvarohem s bylinkami',
      'rozdrcený jako obalovací drť',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [EFSA_ARSENIC, NHS_AVOID],
    reviewStatus: 'verified',
  },
  {
    id: 'jahly',
    nameCz: 'jáhly',
    altNamesCz: ['proso loupané', 'jáhlová kaše'],
    category: 'obiloviny',
    emoji: '🌾',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Jáhly nejdřív spař vroucí vodou, aby zmizela nahořklá chuť, a pak je vař v trojnásobku tekutiny doměkka. Rozvařené je rozmixuj s ovocným pyré do kaše, která drží na lžíci.',
        caution: 'Nespařené jáhly hořknou a dítě je odmítne.',
      },
      '9m': {
        serving:
          'Z uvařených jáhel vytvaruj kuličky nebo placičky, které dítě uchopí prsty. Jsou bez lepku a nesou železo i hořčík, takže jsou dobrou náhradou za rýži.',
        caution: 'Jáhly rychle tuhnou, podávej je vlažné a čerstvě uvařené.',
      },
      '12m': {
        serving:
          'Batoleti připravíš z jáhel nákyp s ovocem nebo je použiješ jako přílohu k zelenině. V bezmasé kuchyni dobře doplňují luštěniny na plnohodnotnou bílkovinu.',
        caution: 'Skladuj jáhly v chladu, obsahují tuk a rychle žluknou.',
      },
    },
    prepIdeas: [
      'spařené a rozvařené na kaši',
      'kuličky do ruky se zeleninou',
      'jáhlový nákyp s jablky',
      'příloha ke krémové luštěninové omáčce',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [WHO_COMPLEMENTARY, MZCR_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'pohanka-lamanka',
    nameCz: 'pohanka lámanka',
    altNamesCz: ['lámanka', 'drcená pohanka'],
    category: 'obiloviny',
    emoji: '🌾',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Lámanka je drcené pohankové zrno, takže se vaří rychle a rozpadne se do kaše sama. Uvař ji ve dvojnásobku vody, promíchej s dýňovým pyré a podávej vlažnou na lžíci.',
        caution: 'Pražená pohanka má výraznou chuť, pro začátek volej neparaženou.',
      },
      '9m': {
        serving:
          'Hustší lámanková kaše se dá tvarovat do malých hromádek, které dítě nabere prsty. Pohanka neobsahuje lepek a je dobrým zdrojem hořčíku i rostlinných bílkovin.',
        caution: 'Kaši podávej vlažnou, horká kaše drží teplo uprostřed.',
      },
      '12m': {
        serving:
          'Batole jí lámanku jako přílohu nebo v podobě zapečeného nákypu se zeleninou. Vaří se do deseti minut, takže je rychlejší než celá pohanka i než rýže.',
        caution: 'Lámanka se snadno rozvaří na řídkou kaši, hlídej poměr vody.',
      },
    },
    prepIdeas: [
      'kaše s dýňovým pyré',
      'hromádky do ruky',
      'zapečená se zeleninou',
      'zahuštění polévky',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [MZCR_COMPLEMENTARY, NHS_6M],
    reviewStatus: 'verified',
  },
  {
    id: 'pohanka-kroupy',
    nameCz: 'pohanka kroupy',
    altNamesCz: ['celá pohanka', 'pohankové kroupy'],
    category: 'obiloviny',
    emoji: '🌾',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Celá pohanková zrna vař patnáct minut a nech je pod pokličkou dojít, potom je rozmixuj. Nerozmixovaná zrna jsou v šesti měsících moc pevná a projdou trávením beze změny.',
        caution: 'Zrno před vařením propláchni, bývá na něm prach ze skladování.',
      },
      '9m': {
        serving:
          'Uvařená zrna promíchej s dušenou zeleninou a s trochou tvarohu, aby držela pohromadě. Dítě si je nabírá prsty po malých hromádkách a učí se s nimi manipulovat.',
        caution: 'Samotná sypká zrna se špatně sbírají, vždy je něčím spoj.',
      },
      '12m': {
        serving:
          'Batoleti slouží celá pohanka jako příloha místo rýže i jako základ zeleninových karbanátků. Má výraznější chuť než lámanka a při vaření drží tvar.',
        caution: 'Pohanku kupuj neparaženou, pražená chutná hodně kouřově.',
      },
    },
    prepIdeas: [
      'vařená a rozmixovaná se zeleninou',
      'do zeleninových karbanátků',
      'příloha místo rýže',
      'zapečená s vejcem a cuketou',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [MZCR_COMPLEMENTARY, WHO_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'quinoa',
    nameCz: 'quinoa',
    altNamesCz: ['merlík chilský', 'kvinoa'],
    category: 'obiloviny',
    emoji: '🌾',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Quinou před vařením důkladně propláchni, jinak zůstane hořká od přírodní ochranné vrstvy. Vař ji patnáct minut, pak rozmixuj se zeleninou, samotná drobná zrna dítě nenabere.',
        caution: 'Neproplachovaná quinoa chutná mýdlově a dítě jídlo odmítne.',
      },
      '9m': {
        serving:
          'Uvařenou quinou spoj s hustým pyré nebo s vejcem a udělej z ní malé placičky. Obsahuje všechny esenciální aminokyseliny, takže v bezmasé kuchyni nahradí část bílkovin.',
        caution: 'Hotová zrna se rozsypou po celé kuchyni, počítej s úklidem.',
      },
      '12m': {
        serving:
          'Batole jí quinou jako přílohu, v salátu nebo zapečenou se zeleninou. Vaří se rychleji než rýže a nemá problém s arsenem, takže je dobrou pravidelnou alternativou.',
        caution: 'Skladuj ji v uzavřené nádobě, rychle nasává vlhkost.',
      },
    },
    prepIdeas: [
      'propláchnutá a rozmixovaná se zeleninou',
      'placičky s vejcem',
      'teplý salát s dušenou zeleninou',
      'zapečená s ricottou',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [WHO_COMPLEMENTARY, NHS_7_9M],
    reviewStatus: 'verified',
  },
  {
    id: 'amarant',
    nameCz: 'amarant',
    altNamesCz: ['laskavec'],
    category: 'obiloviny',
    emoji: '🌾',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Amarant má velmi drobná zrna, která se při vaření mění v lepkavou kaši. Uvař ho ve trojnásobku vody, promíchej s ovocným nebo se zeleninovým pyré a podávej na lžíci.',
        caution: 'Samotný amarant je lepkavý, vždy ho s něčím spoj.',
      },
      '9m': {
        serving:
          'Uvařený amarant se dobře váže, takže z něj vytvaruješ kuličky do ruky. Je bez lepku a nese hodně železa i vápníku, což se hodí v bezmasé domácnosti.',
        caution: 'Pufovaný amarant je velmi lehký a snadno se vdechne nasucho.',
      },
      '12m': {
        serving:
          'Batoleti přidávej amarant do kaší, placek i do zeleninových karbanátků. Kvůli výrazné lepivosti ho míchej s jinou obilovinou, aby výsledek nebyl mazlavý.',
        caution: 'Amarant skladuj v chladu, obsahuje tuk a žlukne.',
      },
    },
    prepIdeas: [
      'kaše s ovocným pyré',
      'kuličky do ruky',
      'směs s jáhlami na placky',
      'zahuštění zeleninového ragú',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [WHO_COMPLEMENTARY, MZCR_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'polenta',
    nameCz: 'polenta',
    altNamesCz: ['kukuřičná krupice', 'kukuřičná polenta'],
    category: 'obiloviny',
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
          'Polentu vsypej za stálého míchání do vroucí vody a vař ji, dokud nezhoustne. Měkká polenta se nabírá lžící a chutná neutrálně, takže se dobře snáší s dýní i s brokolicí.',
        caution: 'Horká polenta drží teplo dlouho, nech ji pořádně zchladnout.',
      },
      '9m': {
        serving:
          'Hustou polentu rozlij na plech, nech ztuhnout a nakrájej na hranolky, které dítě uchopí. Krátce je opeč na pánvi, získají pevnější povrch a lépe se drží v ruce.',
        caution: 'Ztuhlou polentu krájej na prsty, ne na malé kostky.',
      },
      '12m': {
        serving:
          'Batole jí polentové hranolky s dušenou zeleninou nebo měkkou polentu jako přílohu. Je bez lepku a snadno se dochucuje bylinkami, které nahradí sůl.',
        caution: 'Kupovaná instantní polenta bývá dochucená, kontroluj složení.',
      },
    },
    prepIdeas: [
      'měkká polenta se zeleninou',
      'opečené polentové hranolky',
      'zapečená s ricottou',
      'polentové kostky do polévky',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, WHO_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'krupice-psenicna',
    nameCz: 'krupice pšeničná',
    altNamesCz: ['dětská krupice', 'pšeničná krupice'],
    category: 'obiloviny',
    emoji: '🥣',
    allergens: ['psenice-lepek'],
    isKeyAllergen: true,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Krupici vsyp do vroucího mléka nebo vody a za stálého míchání vař tři minuty. Bývá to první setkání s lepkem, proto začni malou porcí a další dva dny nepřidávej jiný nový alergen.',
        caution: 'Kaši nesluď, sladkost obstará rozmačkané ovoce.',
      },
      '9m': {
        serving:
          'Krupicová kaše je hotová za pár minut a dá se zahustit tak, aby držela na lžíci. Vmíchej do ní ovocné pyré nebo lžičku mletých lněných semínek pro zdroj tuků.',
        caution: 'Kaše se snadno připálí, míchej ji po celou dobu varu.',
      },
      '12m': {
        serving:
          'Batoleti poslouží krupice na kaši, do nákypu i na zahuštění polévky. Celozrnná varianta obsahuje víc vlákniny než bílá a chuťově se od ní skoro neliší.',
        caution: 'Kupované krupicové směsi bývají slazené, vař si vlastní.',
      },
    },
    prepIdeas: [
      'mléčná kaše s ovocným pyré',
      'zahuštění zeleninové polévky',
      'krupicový nákyp s jablky',
      'knedlíčky do vývaru bez soli',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [BP_GLUTEN, NHS_6M],
    reviewStatus: 'verified',
  },
  {
    id: 'kroupy-jecne',
    nameCz: 'kroupy ječné',
    altNamesCz: ['ječné kroupy', 'perlové kroupy'],
    category: 'obiloviny',
    emoji: '🌾',
    allergens: ['psenice-lepek'],
    isKeyAllergen: true,
    chokingRisk: 'medium',
    chokingReason:
      'Ječné zrno zůstává i po dlouhém varu pružné a kluzké, takže může sklouznout do hrdla celé a nerozžvýkané.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Kroupy namoč přes noc a vař je nejméně čtyřicet minut, aby byly úplně měkké. Pro tuhle fázi je po uvaření rozmixuj se zeleninou, celé zrno je na první příkrmy příliš pevné.',
        caution: 'Nedovařené kroupy jsou tvrdé a dítě je nerozmělní.',
      },
      '9m': {
        serving:
          'Rozvařené kroupy promíchej s dušenou zeleninou nebo je použij do husté polévky. Zrna kontroluj mezi prsty, měla by se rozmáčknout bez odporu.',
        caution: 'Ječmen obsahuje lepek, hlídej to u bezlepkové diety.',
      },
      '12m': {
        serving:
          'Batole jí kroupy v polévce nebo jako přílohu ke zelenině. Klasický kroupový pokrm pro celou rodinu se dá připravit bez soli a dochutit až na talíři dospělých.',
        caution: 'Kroupy hodně bobtnají, vař menší množství, než se zdá.',
      },
    },
    prepIdeas: [
      'namočené a dlouho vařené',
      'rozmixované se zeleninou',
      'do husté zeleninové polévky',
      'kroupový salát s petrželkou',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [BP_GLUTEN, NHS_10_12M],
    reviewStatus: 'verified',
  },
];
