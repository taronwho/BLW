import type { Ingredient } from '@/types';
import {
  BP_CINNAMON,
  BP_COUMARIN_EFSA,
  MZCR_COMPLEMENTARY,
  NHS_10_12M,
  NHS_6M,
  NHS_7_9M,
  NHS_AVOID,
  NHS_FIRST_FOODS,
  NHS_YOUNG_CHILDREN,
  WHO_COMPLEMENTARY,
} from './_sources';

/**
 * Kategorie „bylinky-koreni" podle docs/SUROVINY-SEZNAM.md.
 *
 * Seznam v dokumentu má v nadpisu číslo 18, ale vyjmenovává 20 položek.
 * Podle pravidla „nic nevynecháno" je tady všech 20.
 *
 * Bylinky a koření jsou v dětské kuchyni náhradou za sůl: chuť dodají,
 * ledviny nezatíží. Tvrdé části (bobkový list, celý kmín, rozmarýnové
 * jehličky) se před podáním odstraňují nebo melou.
 */
export const herbsSpices: Ingredient[] = [
  {
    id: 'petrzelka-hladkolista',
    nameCz: 'petrželka hladkolistá',
    altNamesCz: ['petrželová nať', 'italská petrželka'],
    category: 'bylinky-koreni',
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
          'Petrželku nasekej co nejjemněji a vmíchej ji do hotového pyré nebo do kaše. Dodá jídlu svěží chuť, takže se dítě učí rozeznávat i jinou chuť než sladkou, a jídlo přitom zůstane nesolené.',
        caution: 'Přidávej ji až na konec, varem ztrácí vůni i vitamin C.',
      },
      '9m': {
        serving:
          'Nasekanou petrželkou posyp bramborovou kaši, luštěniny nebo dušenou zeleninu. Obsahuje hodně vitaminu C, který v témže jídle zlepší využitelnost železa z rostlinných složek.',
        caution: 'Nať dobře omyj, na listech bývá zbytek hlíny.',
      },
      '12m': {
        serving:
          'Batole jí petrželku v polévce, v salátu i v pomazánkách. Pěstuje se snadno v květináči na okně a čerstvá chutná úplně jinak než sušená, kterou v zimě běžně koupíš.',
        caution: 'Sušená petrželka má slabší chuť, přidávej jí víc.',
      },
    },
    prepIdeas: [
      'nasekaná do bramborové kaše',
      'posypaná na dušenou zeleninu',
      'vmíchaná do tvarohové pomazánky',
      'do polévky až po uvaření',
    ],
    seasonCz: [5, 6, 7, 8, 9, 10],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_6M],
    reviewStatus: 'verified',
  },
  {
    id: 'pazitka',
    nameCz: 'pažitka',
    altNamesCz: ['pažitková nať'],
    category: 'bylinky-koreni',
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
          'Pažitku stříhej nůžkami na krátké kousky, dlouhá stébla by se dítěti motala v ústech. Jemná cibulová chuť se dobře snáší s tvarohem i s vařeným bramborem a nahrazuje dochucení solí.',
        caution: 'Stébla stříhej opravdu nakrátko, dlouhá se lepí na patro.',
      },
      '9m': {
        serving:
          'Nastříhanou pažitkou posyp vajíčka, tvaroh nebo dušenou zeleninu. Dítě si tím rozšiřuje chuťový rejstřík o jemně ostrou chuť, která je předstupněm k cibuli a česneku.',
        caution: 'Pažitka po nastříhání rychle vadne, použij ji hned.',
      },
      '12m': {
        serving:
          'Batole jí pažitku v pomazánkách, ve vaječných jídlech i na bramborách. Roste na balkoně a dítě si ji může samo stříhat, což bývá první krok k zájmu o vaření.',
        caution: 'Květy pažitky jsou jedlé, ale chutnají ostřeji než nať.',
      },
    },
    prepIdeas: [
      'nastříhaná do tvarohu',
      'posypaná na míchaná vajíčka',
      'do bramborové kaše',
      'vmíchaná do jogurtového dipu',
    ],
    seasonCz: [4, 5, 6, 7, 8, 9],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_YOUNG_CHILDREN],
    reviewStatus: 'verified',
  },
  {
    id: 'kopr',
    nameCz: 'kopr',
    altNamesCz: ['koprová nať'],
    category: 'bylinky-koreni',
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
          'Kopr nasekej najemno a přidej ho do bílé omáčky nebo do bramborového pyré. Jeho výrazná vůně je pro dítě nová a pomáhá jí přijmout, že jídlo nemusí být vždy chuťově neutrální.',
        caution: 'Tvrdé stonky odstraň, používej jen jemné listy.',
      },
      '9m': {
        serving:
          'Nasekaný kopr vmíchej do jogurtového dipu nebo do dušené cukety. Klasická česká koprová omáčka se dá připravit bez soli a pro dospělé se dochutí až na talíři.',
        caution: 'Sušený kopr má výrazně slabší vůni než čerstvý.',
      },
      '12m': {
        serving:
          'Batole jí kopr v omáčce, v polévce i v salátu s okurkou. V sezoně se dá nasekaný kopr zamrazit v lednici ve formičkách s vodou a používat celý rok.',
        caution: 'Nakládané okurky s koprem obsahují sůl i ocet.',
      },
    },
    prepIdeas: [
      'nasekaný do bílé omáčky',
      'vmíchaný do jogurtového dipu',
      'do dušené cukety',
      'zamrazený v olivovém oleji',
    ],
    seasonCz: [6, 7, 8, 9],
    vegetarian: true,
    sources: [NHS_AVOID, MZCR_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'bazalka',
    nameCz: 'bazalka',
    altNamesCz: ['bazalková nať'],
    category: 'bylinky-koreni',
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
          'Bazalkové listy natrhej na malé kousky a vmíchej je do rajčatové omáčky nebo do zeleninového pyré. Celý velký list dítěti nedávej, ve vlhku se v ústech slepí do jednoho kusu.',
        caution: 'Listy natrhej rukou, nožem zčernají.',
      },
      '9m': {
        serving:
          'Natrhanou bazalku přidej do hotových těstovin nebo na pečenou zeleninu. Voní intenzivně a dítě si podle vůně jídlo zařadí ještě dřív, než ho ochutná.',
        caution: 'Bazalka se vařením rozpadne, přidávej ji na konci.',
      },
      '12m': {
        serving:
          'Batole jí bazalku v pestu, v rajčatové omáčce i na pizze. Domácí pesto z bazalky a mletých ořechů je pro rodinu rychlá večeře, jen ho pro dítě nesol a nesyp do něj parmazán.',
        caution: 'Kupované pesto obsahuje hodně soli a často i parmazán.',
      },
    },
    prepIdeas: [
      'natrhaná do rajčatové omáčky',
      'domácí pesto s mletými ořechy',
      'na pečenou zeleninu',
      'do zeleninové polévky',
    ],
    seasonCz: [6, 7, 8, 9],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_7_9M],
    reviewStatus: 'verified',
  },
  {
    id: 'oregano',
    nameCz: 'oregano',
    altNamesCz: ['dobromysl'],
    category: 'bylinky-koreni',
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
          'Oregano používej sušené a rozetři ho v prstech, aby se uvolnila vůně. Špetka do rajčatové omáčky nebo do dušené zeleniny stačí, chuť je výrazná a v malém množství dobře vynikne.',
        caution: 'Velké množství oregana chuť jídla přebije.',
      },
      '9m': {
        serving:
          'Oregano se hodí do všech pokrmů s rajčaty, do luštěnin i na pečenou zeleninu. Dodá jídlu středomořský charakter, takže bezmasý pokrm nechutná jako ochuzená verze masitého.',
        caution: 'Čerstvé oregano je jemnější než sušené, dávkuj jinak.',
      },
      '12m': {
        serving:
          'Batole jí oregano v omáčkách, na pizze i v zapečené zelenině. Kupovaná kořenicí směs typu pizza koření obvykle obsahuje sůl, proto použij čisté oregano.',
        caution: 'Kontroluj složení směsí, sůl bývá na prvním místě.',
      },
    },
    prepIdeas: [
      'špetka do rajčatové omáčky',
      'na pečenou zeleninu',
      'do luštěninového ragú',
      'do domácího těsta na pizzu',
    ],
    seasonCz: [6, 7, 8],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_YOUNG_CHILDREN],
    reviewStatus: 'verified',
  },
  {
    id: 'tymian',
    nameCz: 'tymián',
    altNamesCz: ['mateřídouška zahradní'],
    category: 'bylinky-koreni',
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
          'Tymiánové lístky obeber ze stonku a nasekej je, dřevnatý stonek do jídla nepatří. Špetka dodá dušené zelenině hloubku chuti, kterou by jinak musela obstarat sůl.',
        caution: 'Stonky po vaření vždy vyndej, jsou tvrdé.',
      },
      '9m': {
        serving:
          'Tymián přidej na začátku vaření, jeho vůně se uvolňuje pomalu a snese delší tepelnou úpravu. Skvěle se snáší s kořenovou zeleninou, s luštěninami i s pečenými bramborami.',
        caution: 'Sušený tymián je koncentrovanější, použij ho méně.',
      },
      '12m': {
        serving:
          'Batole jí tymián v pečené zelenině, v polévce i v luštěninovém ragú. Rostlinka na okenním parapetu vydrží roky a vždycky máš pár lístků po ruce.',
        caution: 'Celé tymiánové větvičky před podáním z jídla vyber.',
      },
    },
    prepIdeas: [
      'lístky do pečené kořenové zeleniny',
      'větvička vyvařená v polévce a vyndaná',
      'do luštěninového ragú',
      'na pečené brambory',
    ],
    seasonCz: [5, 6, 7, 8, 9],
    vegetarian: true,
    sources: [NHS_AVOID, MZCR_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'majoranka',
    nameCz: 'majoránka',
    altNamesCz: ['majorán'],
    category: 'bylinky-koreni',
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
          'Majoránka je v české kuchyni klasikou k bramborám a k luštěninám. Sušenou majoránku rozetři mezi prsty a špetku vmíchej do hotové kaše, teplo z ní uvolní vůni okamžitě.',
        caution: 'Používej ji střídmě, ve velkém množství chutná nahořkle.',
      },
      '9m': {
        serving:
          'Majoránka patří do bramborové polévky, do čočky i do zelných pokrmů. Právě díky ní bude jídlo pro dítě chutnat povědomě, i když ho vaříš úplně bez soli.',
        caution: 'Do jídla ji přidej ke konci vaření, jinak vyprchá.',
      },
      '12m': {
        serving:
          'Batole jí majoránku v polévce, v bramboráku i v luštěninových pokrmech. Domácí bramborák bez soli s majoránkou chutná celé rodině a pro dospělé se dosolí až na talíři.',
        caution: 'Kořenicí směsi na bramborák obsahují sůl i glutamát.',
      },
    },
    prepIdeas: [
      'špetka do bramborové polévky',
      'do čočky na kyselo',
      'do těsta na bramborák',
      'na dušené zelí',
    ],
    seasonCz: [7, 8, 9],
    vegetarian: true,
    sources: [NHS_AVOID, MZCR_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'rozmaryn',
    nameCz: 'rozmarýn',
    altNamesCz: ['rozmarýna'],
    category: 'bylinky-koreni',
    emoji: '🌿',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Rozmarýnové jehličky zůstávají tvrdé a špičaté i po dlouhém pečení a mohou se zabodnout do sliznice v ústech nebo v hrdle.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Rozmarýn používej tak, že celou větvičku přidáš při vaření a před podáním ji vyndáš. Jehličky pro dítě nesekej, ani nasekané zůstávají tvrdé a ostré.',
        caution: 'Zkontroluj, že v jídle nezůstala žádná jehlička.',
      },
      '9m': {
        serving:
          'Větvičkou rozmarýnu provoň pečené brambory nebo dušenou zeleninu a pak ji odstraň. Pokud chceš chuť výraznější, nech větvičku v jídle déle, ale vždy ji nakonec vylov.',
        caution: 'Rozmarýnový olej je koncentrovaný, pro dítě ho nepoužívej.',
      },
      '12m': {
        serving:
          'Batole jí pokrmy provoněné rozmarýnem, jehličky z nich ale dál vybírej. Teprve u staršího dítěte, které spolehlivě žvýká, je možné podat velmi jemně nasekané jehličky.',
        caution: 'Při pečení se jehličky rozdrobí a v jídle se ztratí.',
      },
    },
    prepIdeas: [
      'větvička do pečených brambor a vyndaná',
      'provonění dušené zeleniny',
      'do luštěninového ragú',
      've výpeku z pečené zeleniny',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
  {
    id: 'salvej',
    nameCz: 'šalvěj',
    altNamesCz: ['šalvěj lékařská'],
    category: 'bylinky-koreni',
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
          'Šalvěj má velmi výraznou chuť, proto z ní použij jen jeden malý list na celou porci. Nasekej ho najemno a krátce prohřej na másle, tepelná úprava hořkost zmírní.',
        caution: 'Šalvějový čaj ani odvar dítěti nepodávej.',
      },
      '9m': {
        serving:
          'Nasekaná šalvěj se hodí k dýni, k bramborám i k luštěninám. V malém množství přidá jídlu zvláštní zemitou vůni, kterou většina dětí přijímá bez potíží.',
        caution: 'Velké listy jsou chlupaté, vždy je nasekej najemno.',
      },
      '12m': {
        serving:
          'Batole jí šalvěj v máslové omáčce k těstovinám nebo v pečené dýni. Léčivé přípravky ze šalvěje jsou něco jiného než kuchyňské koření a patří do rukou pediatra.',
        caution: 'Aplikace neřeší léčivé použití bylin, to patří lékaři.',
      },
    },
    prepIdeas: [
      'nasekaná na másle k dýni',
      'do bramborové kaše',
      'k luštěninovému ragú',
      'v máslové omáčce k těstovinám',
    ],
    seasonCz: [5, 6, 7, 8, 9],
    vegetarian: true,
    sources: [NHS_AVOID, MZCR_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'mata',
    nameCz: 'máta',
    altNamesCz: ['máta peprná'],
    category: 'bylinky-koreni',
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
          'Mátové listy nasekej najemno a vmíchej je do jogurtu nebo do ovocného pyré. Chladivá chuť je pro dítě překvapivá a hodí se v létě k melounu i k okurce.',
        caution: 'Mátový olej ani bonbony s mátou dítěti nedávej.',
      },
      '9m': {
        serving:
          'Nasekanou mátu přidej do okurkového salátu nebo do jogurtového dipu. V kombinaci s hráškem a s jogurtem vznikne jednoduchá pomazánka, kterou dítě nabere na prst chleba.',
        caution: 'Mátové čaje pro kojence konzultuj s pediatrem.',
      },
      '12m': {
        serving:
          'Batole jí mátu v salátech, v jogurtu i s ovocem. Na zahradě se rychle rozrůstá, takže ji pěstuj v samostatném květináči, jinak přeroste celý záhon.',
        caution: 'Sušená máta ztrácí chladivou chuť, čerstvá je lepší.',
      },
    },
    prepIdeas: [
      'nasekaná do jogurtu s ovocem',
      'do okurkového salátu',
      'v hrachové pomazánce',
      'k melounovým kostkám',
    ],
    seasonCz: [5, 6, 7, 8, 9],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_10_12M],
    reviewStatus: 'verified',
  },
  {
    id: 'libecek',
    nameCz: 'libeček',
    altNamesCz: ['libeček lékařský', 'maggi kořeni'],
    category: 'bylinky-koreni',
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
          'Libeček chutná podobně jako polévkové koření z lahvičky, jen bez soli a bez glutamátu. Jeden malý lístek nasekaný do zeleninového vývaru dodá jídlu tu hloubku chuti, kterou od hotových polévkových směsí čekáš.',
        caution: 'Libeček je velmi výrazný, začni opravdu malým množstvím.',
      },
      '9m': {
        serving:
          'Nasekaný libeček přidej do polévky nebo do dušené kořenové zeleniny. Pro vaření bez soli je to jedna z nejužitečnějších bylinek vůbec, protože nahradí právě tu slanou hloubku.',
        caution: 'Velké listy mají silnější chuť než mladé.',
      },
      '12m': {
        serving:
          'Batole jí libeček v polévkách i v omáčkách. V zimě ho můžeš nahradit sušeným, ale čerstvý z květináče na okně chutná podstatně výrazněji a používá se ho méně.',
        caution: 'Nezaměňuj libeček za kupované tekuté koření, to je slané.',
      },
    },
    prepIdeas: [
      'lístek do zeleninového vývaru',
      'nasekaný do bramborové polévky',
      'do dušené kořenové zeleniny',
      'sušený do luštěnin',
    ],
    seasonCz: [5, 6, 7, 8, 9],
    vegetarian: true,
    sources: [NHS_AVOID, MZCR_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'bobkovy-list',
    nameCz: 'bobkový list',
    altNamesCz: ['vavřín'],
    category: 'bylinky-koreni',
    emoji: '🍃',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'high',
    chokingReason:
      'Bobkový list zůstává i po dlouhém vaření tuhý a jeho okraje jsou ostré, takže se v hrdle zachytí a může ho poranit.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Bobkový list přidej při vaření do hrnce a před podáním ho vždy vyndej. Nikdy nesmí zůstat v porci, kterou dítě dostane, ani rozlámaný na menší kousky.',
        caution: 'Spočítej si listy, které dáváš do hrnce, a stejný počet vylov.',
      },
      '9m': {
        serving:
          'List vaří se v luštěninách, v polévce i v dušené zelenině, kterým dodá jemně kořeněnou vůni. Po uvaření ho odstraň a teprve pak jídlo rozděl na talíře.',
        caution: 'V husté omáčce se list snadno ztratí, hledej ho pečlivě.',
      },
      '12m': {
        serving:
          'Batoleti chutná jídlo s bobkovým listem stejně jako zbytku rodiny, list ale dál patří ven. Ani po prvním roce se rozdrcený bobkový list do jídla nepřidává.',
        caution: 'Mletý bobkový list se v běžné kuchyni nepoužívá, drž se celých listů a vyndávej je.',
      },
    },
    prepIdeas: [
      'vyvařený v luštěninách a vyndaný',
      'do zeleninového vývaru',
      'při dušení kořenové zeleniny',
      'do rajčatové omáčky a před podáním odstraněný',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_FIRST_FOODS, NHS_AVOID],
    reviewStatus: 'verified',
  },
  {
    id: 'kmin-mlety',
    nameCz: 'kmín mletý',
    altNamesCz: ['mletý kmín'],
    category: 'bylinky-koreni',
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
          'Mletý kmín je pro miminko bezpečnější než celý, protože nezůstane v jídle tvrdé zrno. Špetka do brambor, do zelí nebo do luštěnin usnadňuje trávení a dodá jídlu známou českou chuť.',
        caution: 'Mletý kmín rychle ztrácí vůni, kupuj malá balení.',
      },
      '9m': {
        serving:
          'Kmín se hodí do luštěnin, které po něm méně nadýmají, i do dušené zeleniny. Krátké opražení na suché pánvi před použitím jeho vůni výrazně zesílí.',
        caution: 'Opražený kmín se rychle pálí, hlídej ho u sporáku.',
      },
      '12m': {
        serving:
          'Batole jí mletý kmín v bramborách, v zelí i v luštěninových pokrmech. Je základem české kuchyně a zároveň nepálí, takže ho děti přijímají bez potíží.',
        caution: 'Nezaměňuj kmín kořenný za římský, chuť je odlišná.',
      },
    },
    prepIdeas: [
      'špetka do pečených brambor',
      'do dušeného zelí',
      'k luštěninám proti nadýmání',
      'opražený do zeleninového ragú',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [MZCR_COMPLEMENTARY, NHS_AVOID],
    reviewStatus: 'verified',
  },
  {
    id: 'kmin-cely',
    nameCz: 'kmín celý',
    altNamesCz: ['celý kmín', 'kmínová zrna'],
    category: 'bylinky-koreni',
    emoji: '🌾',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'medium',
    chokingReason:
      'Celé kmínové zrno je tvrdé a podlouhlé, při nádechu se snadno dostane do dýchacích cest a dásně ho nerozdrtí.',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Pro miminko kmín vždy rozemel nebo ho vyvař v jídle a před podáním sceď. Celá zrna v porci nenechávej, i když jsou po vaření měkčí, protože se snadno vdechnou.',
        caution: 'Celý kmín na povrchu pečiva pro dítě není vhodný.',
      },
      '9m': {
        serving:
          'Celý kmín můžeš zavázat do plátna, vyvařit v polévce a sáček pak vyndat. Chuť se do jídla dostane, ale žádné zrno v porci nezůstane a riziko tím zmizí úplně.',
        caution: 'Po vyndání sáčku jídlo ještě promíchej a prohlédni.',
      },
      '12m': {
        serving:
          'Batole zvládne i celý kmín v jídle, pokud spolehlivě žvýká a jí vsedě. Do té doby zůstává mletá varianta jistější volbou pro každodenní vaření.',
        caution: 'Kmínové pečivo krájej na malé kousky.',
      },
    },
    prepIdeas: [
      'vyvařený v plátěném sáčku',
      'rozemletý do bramborové kaše',
      'v celku do vývaru a sceděný',
      'opražený a rozdrcený do luštěnin',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_FIRST_FOODS],
    reviewStatus: 'verified',
  },
  {
    id: 'koriandr-mlety',
    nameCz: 'koriandr mletý',
    altNamesCz: ['mletý koriandr', 'koriandrová semena mletá'],
    category: 'bylinky-koreni',
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
          'Mletý koriandr má jemně citrusovou vůni a nepálí, takže se hodí i pro první kořeněná jídla. Špetka do dušené mrkve nebo do čočky změní charakter pokrmu bez jakéhokoli dochucení solí.',
        caution: 'Koriandrová nať chutná úplně jinak než mletá semena.',
      },
      '9m': {
        serving:
          'Koriandr je základem mírných kari směsí, které se dají připravit bez pálivé složky. Spoj ho s kurkumou a s kmínem a vznikne jemné koření vhodné pro celou rodinu.',
        caution: 'Kupované kari směsi bývají pálivé a slané.',
      },
      '12m': {
        serving:
          'Batole jí koriandr v luštěninových pokrmech, v kari i v zeleninovém ragú. Domácí směs koření je levnější a máš jistotu, že v ní není sůl ani zvýrazňovač chuti.',
        caution: 'Mleté koření skladuj v temnu, rychle ztrácí vůni.',
      },
    },
    prepIdeas: [
      'špetka do dušené mrkve',
      'do domácí kari směsi bez pálivé složky',
      'k čočce a cizrně',
      'do zeleninového ragú',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, WHO_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'skorice-cejlonska',
    nameCz: 'skořice cejlonská',
    altNamesCz: ['pravá skořice', 'cejlonská skořice'],
    category: 'bylinky-koreni',
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
          'Špetka skořice v jablečném pyré nebo v kaši dodá sladkou vůni, a jídlo přitom nemusíš sladit. Cejlonskou vybírej záměrně: běžná kasie obsahuje až 4 g kumarinu na kilogram, cejlonská skořice výrazně méně. Tolerovatelný denní příjem kumarinu je 0,1 mg na kilogram tělesné hmotnosti, takže u malého dítěte je to opravdu jen špetka.',
        caution: 'Skořicovou tyčinku v jídle nenechávej, je tvrdá.',
      },
      '9m': {
        serving:
          'Skořice se hodí k jablkům, k hruškám, k dýni i do ovesné kaše. Vůně přitom dělá velkou část chuťového zážitku, takže dítě vnímá jídlo jako sladší, než ve skutečnosti je. Kaše a cereálie ochucené skořicí ale nedávej denně, doporučení zní nejvýše jednou týdně.',
        caution: 'Levná mletá skořice bývá kasie, čti původ na obalu.',
      },
      '12m': {
        serving:
          'Batole jí skořici v kaši, v pečení i v kompotu, pořád ale po špetkách a spíš jednou za týden než denně. Děti jsou ke kumarinu citlivější než dospělí prostě proto, že váží míň. Cejlonská skořice má kumarinu málo, zato víc eugenolu, jehož přípustný denní příjem je 2,5 mg na kilogram tělesné hmotnosti — i proto zůstaň u koření na dochucení.',
        caution: 'Skořicové bonbony a nápoje obsahují hodně sladké složky.',
      },
    },
    prepIdeas: [
      'špetka do jablečného pyré',
      'do ovesné kaše',
      'na pečenou dýni',
      'do celozrnného těsta',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_YOUNG_CHILDREN, BP_CINNAMON, BP_COUMARIN_EFSA],
    reviewStatus: 'verified',
  },
  {
    id: 'kurkuma',
    nameCz: 'kurkuma',
    altNamesCz: ['kurkumovník dlouhý', 'indický šafrán'],
    category: 'bylinky-koreni',
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
          'Kurkuma nepálí a v malém množství jen obarví jídlo do zlatova a dodá mu zemitou vůni. Špetka do dušené zeleniny nebo do čočky je pro první kořeněná jídla akorát.',
        caution: 'Kurkuma barví oblečení i plastové nádobí natrvalo.',
      },
      '9m': {
        serving:
          'Kurkumu použij do jemné kari směsi spolu s mletým koriandrem a kmínem. Barevné jídlo bývá pro dítě zajímavější, což pomáhá v období, kdy začíná jídlo očima vybírat.',
        caution: 'Doplňky stravy s kurkuminem dítěti nepodávej.',
      },
      '12m': {
        serving:
          'Batole jí kurkumu v kari, v rýži i v zeleninových pokrmech. Čerstvý kořen kurkumy z obchodu se dá nastrouhat a chutná jemněji než sušená mletá varianta.',
        caution: 'Léčivé použití kurkumy u dítěte patří k pediatrovi.',
      },
    },
    prepIdeas: [
      'špetka do dušené čočky',
      'do domácí kari směsi',
      'obarvení rýže do zlatova',
      'nastrouhaný čerstvý kořen do polévky',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, WHO_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'zazvor',
    nameCz: 'zázvor',
    altNamesCz: ['čerstvý zázvor', 'zázvorový kořen'],
    category: 'bylinky-koreni',
    emoji: '🫚',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Zázvor oloupej a nastrouhej na nejjemnějším struhadle, kousky vlákna v jídle nenechávej. Úplně malé množství stačí, protože zázvor lehce pálí a dítě na ostrost není zvyklé.',
        caution: 'Zázvorový čaj ani nálev pro kojence nepřipravuj bez porady s pediatrem.',
      },
      '9m': {
        serving:
          'Nastrouhaný zázvor přidej do dušené mrkve, do dýňové polévky nebo do kari. Dobře se snáší se sladkou zeleninou, jejíž chuť vyváží jeho ostřejší tón.',
        caution: 'Množství zvyšuj pomalu, ostrá chuť překvapí.',
      },
      '12m': {
        serving:
          'Batole jí zázvor v polévkách, v kari i v pečení. Zázvorové sušenky jsou klasika, pro dítě je ale peč doma bez velkého množství sladké složky.',
        caution: 'Kandovaný zázvor je velmi sladký a tvrdý zároveň.',
      },
    },
    prepIdeas: [
      'nastrouhaný do dýňové polévky',
      'do zeleninového kari',
      'k dušené mrkvi',
      'do celozrnného pečení',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_10_12M],
    reviewStatus: 'verified',
  },
  {
    id: 'paprika-sladka-mleta',
    nameCz: 'paprika sladká mletá',
    altNamesCz: ['mletá sladká paprika', 'paprika mletá'],
    category: 'bylinky-koreni',
    emoji: '🌶️',
    allergens: [],
    isKeyAllergen: false,
    chokingRisk: 'low',
    hazards: [],
    hazardNotes: {},
    minAgeMonths: 6,
    prep: {
      '6m': {
        serving:
          'Sladká mletá paprika nepálí a dodá jídlu barvu i jemnou chuť. Špetku vmíchej do dušené zeleniny nebo do luštěnin až mimo plotnu, na horkém tuku totiž rychle zhořkne.',
        caution: 'Vybírej sladkou, ne pálivou ani uzenou variantu.',
      },
      '9m': {
        serving:
          'Paprika se hodí do bramborových pokrmů, do luštěnin i do rajčatových omáček. Je bohatá na karoteny a v malém množství výrazně zlepší vzhled jídla, které dítě vybírá očima.',
        caution: 'Uzená paprika má výraznější chuť, začni s malým množstvím.',
      },
      '12m': {
        serving:
          'Batole jí sladkou papriku v guláši, v omáčkách i v pečené zelenině. Klasický český guláš se dá uvařit bez soli a dospělým dochutit až na talíři, chuť z papriky zůstane.',
        caution: 'Kořenicí směsi na guláš obsahují sůl, kupuj čistou papriku.',
      },
    },
    prepIdeas: [
      'špetka do bramborového guláše',
      'do luštěninové omáčky',
      'na pečenou zeleninu',
      'do rajčatové omáčky',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, MZCR_COMPLEMENTARY],
    reviewStatus: 'verified',
  },
  {
    id: 'vanilka',
    nameCz: 'vanilka',
    altNamesCz: ['vanilkový lusk'],
    category: 'bylinky-koreni',
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
          'Vanilkový lusk rozřízni, vyškrábni dřeň a vmíchej ji do kaše nebo do jogurtu. Vůně vanilky vytváří dojem sladké chuti, takže jídlo chutná sladce, a přitom ho nemusíš sladit.',
        caution: 'Vyvařený lusk z jídla vždy vyndej, je tuhý a vláknitý.',
      },
      '9m': {
        serving:
          'Dřeň z lusku se hodí do mléčné kaše, do tvarohu i do ovocného pyré. Vanilkové směsi z obchodu jsou obvykle slazené, proto sáhni po pravém lusku nebo po čisté mleté vanilce.',
        caution: 'Vanilkové extrakty často obsahují alkohol, ty vynech.',
      },
      '12m': {
        serving:
          'Batole jí vanilku v kaši, v pudinku i v pečení. Vyvařený lusk můžeš usušit a uložit do nádoby s moukou, která pak sama provoní všechno domácí pečení.',
        caution: 'Vanilinový cukr není vanilka, je to aroma se sladkou složkou.',
      },
    },
    prepIdeas: [
      'dřeň z lusku do mléčné kaše',
      'do tvarohového krému',
      'vyvařený lusk v ovocném kompotu',
      'usušený lusk v nádobě s moukou',
    ],
    seasonCz: [],
    vegetarian: true,
    sources: [NHS_AVOID, NHS_YOUNG_CHILDREN],
    reviewStatus: 'verified',
  },
];
