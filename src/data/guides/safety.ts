import type { Guide } from '@/types';
import {
  NHS_ALLERGY,
  NHS_AVOID,
  NHS_CHOKING,
  NHS_FIRST_FOODS,
  NHS_PREP_SAFELY,
  SZU_FIRST_SPOON,
} from '../ingredients/_sources';

/** Odborná kniha, ze které vychází výklad. Doplněk ke `sources`, ne náhrada. */
const KNIHA = 'Baby-led weaning — příběh metody vedené dítětem (kapitoly 1 a 2)';

/**
 * Bezpečnost u stolu. Tyhle dvě rady jsou označené jako naléhavé, protože se
 * k nim sahá ve chvíli, kdy rodič nemá čas hledat.
 *
 * Aplikace nenahrazuje kurz první pomoci ani pediatra — postup je tu proto,
 * aby ho rodič znal předem, ne aby se podle něj učil za pochodu.
 */
export const safety: Guide[] = [
  {
    id: 'daveni-vs-duseni',
    titleCz: 'Dávení není dušení',
    category: 'bezpecnost',
    summary:
      'Hlučné kuckání a zrudnutí je funkční obrana, ne selhání. Tiché dítě, které se nenadechne, je naopak stav, kdy se zasahuje okamžitě.',
    keyPoints: [
      'Dávící dítě dělá hluk: kašle, kucká, zrudne, slzí a sousto vypudí ven.',
      'Dusící se dítě je tiché, nenadechne se a mění barvu do bledé nebo namodralé.',
      'Do dávících úst se nesahá — prst zasune sousto právě tam, kam nemá.',
    ],
    urgent: true,
    sections: [
      {
        heading: 'Proč malé děti dáví častěji než dospělí',
        body: [
          'Dávicí reflex se spouští podrážděním zadní části jazyka a hltanu a jeho úkolem je vypudit sousto dopředu, ven z úst.',
          'U dospělého člověka leží spouštěcí zóna hluboko vzadu. U kojence leží výrazně blíž ke špičce jazyka a teprve během prvního roku a dalších let se posouvá dozadu.',
          'Znamená to, že kojenec začne dávit dřív — nad soustem, které je od dýchacích cest ještě daleko — a vypudí ho ven dřív, než se stihne dostat někam, odkud by to nešlo. Je to obrana, která funguje, ne její selhání.',
        ],
      },
      {
        heading: 'Jak to od sebe poznat',
        asList: true,
        body: [
          'DÁVENÍ — dítě vydává zvuk, kašle a kucká, zrudne, slzí, vyplázne jazyk, často vyzvrátí obsah úst na stůl a po pár vteřinách pokračuje v jídle, jako by se nic nestalo.',
          'DUŠENÍ — dítě je tiché, protože vzduch neprochází hlasivkami; nekašle vůbec nebo kašle slabě a bez zvuku, nedokáže se nadechnout a barva kůže se mění od bledé k namodralé.',
          'Hraniční případ: kašel, který je hlasitý a účinný, znamená nechat dítě kašlat dál a neodcházet od něj. Kašel tichý nebo neúčinný znamená zasáhnout.',
        ],
      },
      {
        heading: 'Co dělat při dávení',
        asList: true,
        body: [
          'Zůstaň klidná a zůstaň u dítěte. Dávení odezní během několika vteřin samo.',
          'Nesahej dítěti do úst a nešátrej prstem. Zásah posune sousto směrem k dýchacím cestám.',
          'Nezvedej dítě ze židličky a nepřevracej ho. Vzpřímený sed dávení pomáhá.',
          'Nekřič a neplácej dítě po zádech — při účinném kašli to není potřeba a dítě to vyleká.',
          'Až dávení odezní, nech dítě pokračovat v jídle. Přerušení jídla z něj dělá událost, kterou si dítě zapamatuje.',
        ],
      },
      {
        heading: 'Počítej s tím předem',
        body: [
          'Rodič, který poprvé vidí své šestiměsíční dítě zalykat se nad kouskem chleba, prochází zážitkem, na který roky nezapomene. Že šlo o dávení a ne o dušení, pozná až zpětně.',
          'Řada rodin metodu po první takové příhodě opustila. Velká část z nich by ji zřejmě neopustila, kdyby dopředu věděla, že příhoda přijde a jak bude vypadat.',
          'Dávení není důvod přestat. Je to fáze, kterou dítě potřebuje projít, aby se naučilo posouvat sousto v ústech.',
        ],
      },
    ],
    sources: [NHS_CHOKING, NHS_PREP_SAFELY],
    literature: [KNIHA],
    reviewStatus: 'verified',
  },
  {
    id: 'prvni-pomoc-pri-duseni',
    titleCz: 'První pomoc při dušení',
    category: 'bezpecnost',
    summary:
      'Postup u kojence je jiný než u dospělého a není intuitivní. Pět úderů mezi lopatky, pak pět stlačení hrudníku. Heimlichův manévr do jednoho roku ne.',
    keyPoints: [
      'Volej 155. Hlasitý účinný kašel nech pokračovat a neodcházej od dítěte.',
      'Do 1 roku: 5 úderů mezi lopatky, pak 5 stlačení hrudníku dvěma prsty.',
      'Břišní stlačení (Heimlich) se do jednoho roku neprovádí — hrozí poranění jater.',
    ],
    urgent: true,
    sections: [
      {
        heading: 'Nejdřív rozhodni, jestli kašel funguje',
        asList: true,
        body: [
          'Kašel je hlasitý a dítě se mezi kašlem nadechne → povzbuzuj ho, ať kašle dál, a neodcházej od něj. Nesahej mu do úst.',
          'Kašel je tichý, slabý nebo žádný a dítě se nenadechne → hlasitě si řekni o pomoc a začni zasahovat.',
          'Vidíš-li předmět v ústech a jde vyjmout, vyjmi ho. Nikdy ale nešátrej prsty naslepo ani opakovaně — předmět se tím zasune hlouběji.',
        ],
      },
      {
        heading: 'Kojenec do jednoho roku',
        asList: true,
        body: [
          'Sedni si. Polož dítě obličejem dolů podél svého předloktí nebo stehna, hlavu mu podepři dlaní a drž ji níž než trup.',
          'Dej mu až pět ostrých úderů hranou dlaně mezi lopatky. Po každém úderu zkontroluj, jestli předmět nevyšel ven — nemusíš vždy vyčerpat všech pět.',
          'Když údery nepomohou, otoč dítě obličejem nahoru podél svých stehen, hlavu níž než nohy.',
          'Polož dva prsty doprostřed hrudníku těsně pod úroveň bradavek a proveď až pět ostrých stlačení. Po každém zkontroluj ústa.',
          'Střídej pět úderů mezi lopatky a pět stlačení hrudníku, dokud předmět nevyjde nebo nepřijede pomoc.',
          'Břišní stlačení, tedy Heimlichův manévr, se u dětí do jednoho roku neprovádí — hrozí poranění jater.',
        ],
      },
      {
        heading: 'Dítě nad jeden rok',
        asList: true,
        body: [
          'Polož menší dítě obličejem dolů přes svůj klín stejně jako kojence; když to nejde, podepři ho v předklonu a dej pět úderů mezi lopatky zezadu.',
          'Nepomohou-li údery, přejdi u dítěte nad jeden rok na břišní stlačení.',
          'Metody můžeš střídat v libovolném pořadí a opakovat je, dokud předmět nevyjde.',
        ],
      },
      {
        heading: 'Kdy volat 155',
        asList: true,
        body: [
          'Vždy, když je kašel neúčinný a dítě se nenadechne.',
          'Vždy, když dítě ztratí vědomí.',
          'Vždy po zásahu stlačením hrudníku nebo břicha, i když předmět vyšel ven a dítě vypadá v pořádku — vnitřní poranění není na první pohled vidět.',
        ],
      },
      {
        heading: 'Nauč se to nanečisto',
        body: [
          'Nejužitečnější rada z celé metody zní: absolvuj kurz první pomoci zaměřený na kojence a malé děti ještě předtím, než začnete s příkrmem.',
          'Znalost postupu mění situaci u stolu podstatněji než cokoli jiného, protože odstraňuje bezmoc. Rodič, který ví, co udělá, se na dávící dítě dívá jinak než rodič, který to neví.',
          'Platí to stejně pro rodiny, které metodu vedenou dítětem nepoužívají. K tuhé stravě se dostane každé dítě, jen o něco později — a udusit se může i nad kouskem, který našlo na zemi.',
          'Tenhle text kurz nenahrazuje. Je tu proto, aby sis postup připomněla, ne aby ses ho učila za pochodu.',
        ],
      },
    ],
    sources: [NHS_CHOKING],
    literature: [KNIHA],
    reviewStatus: 'verified',
  },
  {
    id: 'pravidla-u-stolu',
    titleCz: 'Pravidla bezpečného jídla u stolu',
    category: 'bezpecnost',
    summary:
      'Krátký a nesmlouvavý seznam. Vzpřímený sed, žádné krmení do úst, žádné hry u jídla, nikdy bez dozoru a pryč s tvary, které ucpou dýchací cesty.',
    keyPoints: [
      'Dítě sedí vzpřímeně — ne v polosedu, ne v autosedačce, ne v náručí na zádech.',
      'Dítě si jídlo bere samo. Nikdo mu nic do úst nedává.',
      'U jídla se nelechtá, nepřekvapuje zezadu a nehrají se hry.',
    ],
    sections: [
      {
        heading: 'Pět pravidel, která platí bez výjimky',
        asList: true,
        body: [
          'Vzpřímený sed. Dítě sedí rovně ve své židličce, ne v polosedu, ne v autosedačce a ne v náručí v poloze na zádech. V leže se sousto posouvá do hltanu samo.',
          'Dítě jí samo. Nikdo mu nic do úst nedává, ani „na ochutnání". Cizí ruka vloží sousto hlouběji, než by ho tam dítě vložilo samo.',
          'Žádné hry u jídla. Nikdo nepřichází zezadu, nelechtá a nebaví dítě tak, aby se prudce nadechlo nebo zasmálo se soustem v ústech.',
          'Nikdy bez dozoru. Ani na tu chvíli, za kterou se dojde pro utěrku. Dušení je tiché, takže z vedlejší místnosti ho neslyšíš.',
          'Pryč s tvary ucpávky. Ze stolu mizí celé ořechy, celé hroznové víno a bobule, kulaté plátky párku, tvrdá syrová mrkev, karamely a hrudka ořechového másla na lžíci.',
        ],
      },
      {
        heading: 'Test měkkosti',
        body: [
          'Sousto se položí na jazyk a přitiskne k patru. Když se pod tlakem jazyka rozpadne, je vhodné. Když se nerozpadne, není.',
          'Druhá varianta téhož testu je rozmáčknutí mezi palcem a ukazovákem. Co nejde rozmáčknout mezi prsty, nejde rozmělnit ani dásněmi.',
          'Test si udělej u každé nové suroviny a u každé nové úpravy. Stejná mrkev je po deseti minutách v páře něco jiného než po pěti.',
        ],
      },
      {
        heading: 'Čím se malé děti opravdu dusí',
        body: [
          'V evropských i amerických přehledech jsou nejčastějšími předměty oříšky, hroznové víno, párek, bonbony, popcorn a drobné části hraček.',
          'Věková skupina s nejvyšším výskytem není šest až dvanáct měsíců, ale jeden až tři roky — tedy období, kdy dítě chodí, dosáhne na věci a strká si do úst, co najde.',
          'Prevence dušení je proto hlavně otázkou toho, co je v domácnosti na dosah, ne toho, jak se podával první příkrm.',
        ],
      },
    ],
    sources: [NHS_PREP_SAFELY, NHS_AVOID, NHS_FIRST_FOODS, SZU_FIRST_SPOON],
    literature: [KNIHA],
    reviewStatus: 'verified',
  },
  {
    id: 'zavadeni-alergenu',
    titleCz: 'Zavádění alergenů',
    category: 'bezpecnost',
    summary:
      'Alergeny se nemají odkládat. Zavádí se po jednom, s odstupem, ráno a doma — a při dobré snášenlivosti se musí nabízet opakovaně.',
    keyPoints: [
      'Alergenní potraviny se zavádějí od zhruba šesti měsíců jako každé jiné jídlo.',
      'Po jednom, s odstupem dva až tři dny, malé množství, ideálně dopoledne a doma.',
      'Jednorázová expozice toleranci neudrží — po zavedení se potravina nabízí dál pravidelně.',
    ],
    sections: [
      {
        heading: 'Proč se odkládání nevyplácí',
        body: [
          'Odkládání arašídů a slepičích vajec na dobu po šestém až dvanáctém měsíci se podle dostupných dat pojí s vyšším rizikem, že se na ně alergie rozvine.',
          'Ořechy a arašídy se přitom nabízejí výhradně mleté nebo jako máslo rozředěné do hladka — celý ořech je tvar, který ucpe dýchací cesty.',
          'Korýši se nikdy nepodávají syroví ani krátce zahřátí.',
        ],
      },
      {
        heading: 'Jak postupovat',
        asList: true,
        body: [
          'Zaváděj po jednom alergenu, s odstupem dvou až tří dnů, abys poznala, co reakci způsobilo.',
          'Začni malým množstvím, ideálně dopoledne, doma — ne v den očkování a ne když je dítě nemocné.',
          'Při dobré snášenlivosti nabízej potravinu opakovaně a pravidelně. Za zavedenou ji považuj po třech expozicích bez reakce.',
          'Má-li dítě diagnostikovanou potravinovou alergii nebo ekzém, nebo jsou alergie v rodině, prober postup napřed s pediatrem.',
        ],
      },
      {
        heading: 'Kdy volat záchranku',
        body: [
          'Při otoku rtů nebo víček, dušnosti, zvracení s bledostí nebo náhlé ochablosti volej okamžitě 155.',
          'Aplikace alergii nediagnostikuje. Při jakémkoli podezření na reakci patří rozhodnutí pediatrovi.',
        ],
      },
    ],
    sources: [NHS_ALLERGY, SZU_FIRST_SPOON],
    literature: [KNIHA],
    reviewStatus: 'verified',
  },
];
