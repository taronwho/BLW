import type { Guide } from '@/types';
import {
  MZCR_COMPLEMENTARY,
  NHS_AVOID,
  NHS_IRON,
  NHS_TRACE_MINERALS,
  NHS_VEGETARIAN,
  NHS_YOUNG_CHILDREN,
  SZU_FIRST_SPOON,
} from '../ingredients/_sources';

const KNIHA = 'Baby-led weaning — příběh metody vedené dítětem (kapitoly 1 a 2)';

/**
 * Výživová část. Železo a zinek jsou tady hlavní téma, protože to je bod,
 * ve kterém metoda vedená dítětem odborníky nejvíc znepokojovala — a bod,
 * ve kterém randomizovaný pokus neprokázal žádnou výhodu oproti lžičce.
 */
export const nutrition: Guide[] = [
  {
    id: 'zelezo-proc-a-jak',
    titleCz: 'Železo: proč je to hlavní téma',
    category: 'vyziva',
    summary:
      'Zásoba železa z těhotenství vydrží zhruba půl roku. Od šestého měsíce musí železo přicházet z jídla — a to v podobě, kterou dítě opravdu sní.',
    keyPoints: [
      'Kolem šestého měsíce se vrozená zásoba železa tenčí a mateřské mléko ji doplňuje jen okrajově.',
      'Nabídni potravinu bohatou na železo při každém jídle, ne jednou za čas.',
      'Rozhoduje podoba: co se rozpadá, dítě sní. Co drží tvar, to ocucá a vyplivne.',
    ],
    sections: [
      {
        heading: 'Odkud se problém bere',
        body: [
          'Donošený novorozenec přichází na svět se zásobou železa uloženou v játrech, kterou nastřádal v posledním trimestru těhotenství. Zásoba je vypočtená zhruba na půl roku.',
          'Mateřské mléko ji doplňuje jen okrajově — železa obsahuje málo, byť ve velmi dobře vstřebatelné formě. Kolem šestého měsíce se proto zásoba tenčí a od té chvíle musí železo přicházet ze stravy.',
          'Tenhle prostý fakt je důvod, proč se doporučení sjednotila právě na šesti měsících. A je to zároveň důvod, proč se všechny pozdější spory o metodu vedenou dítětem točily kolem toho, jestli se do dítěte, které si jídlo bere samo, dostane železa dost.',
        ],
      },
      {
        heading: 'Kdo má zásobu menší',
        body: [
          'Děti narozené předčasně mají zásobu menší. Stejně tak děti, kterým se pupečník podvázal okamžitě po porodu — rozdíl v množství krve z placenty znamená v železe zásobu navíc na několik týdnů.',
          'Menší zásobu mívají i děti matek, které měly v těhotenství chudokrevnost.',
          'Pro rodiče z toho plyne praktický důsledek: takové dítě potřebuje potraviny bohaté na železo dřív a v jistější podobě. Konkrétní postup u vašeho dítěte patří pediatrovi, ne aplikaci.',
        ],
      },
      {
        heading: 'Co s tím udělat prakticky',
        body: [
          'Nabízet železo znamená nabízet ho pokaždé a v podobě, kterou dítě skutečně sní — ne v podobě, která na talíři dobře vypadá.',
          'Rozdíl mezi tím, co si dítě vezme, a tím, co doopravdy spolkne, je v prvních týdnech propastný, a největší je právě u potravin, které vyžadují žvýkání. Kus masa bývá ocucaný, rozvlákněný a vyplivnutý.',
          'První měsíc příkrmu je proto z hlediska energie i železa spíš nácvik než výživa. To je v pořádku, dokud zbytek doplňuje mléko — ale znamená to, že na podobě soust záleží víc, než se zdá.',
        ],
      },
      {
        heading: 'Podoba, která funguje',
        asList: true,
        body: [
          'Kostka hovězího uvařená doměkka je lepší než plátek, protože se rozpadá.',
          'Vaječná omeleta nakrájená na proužky je lepší než vařené vejce, které se drolí.',
          'Čočková pomazánka na chlebu je lepší než celá čočka, kterou dítě neuzvedne.',
          'Maso se dusí dlouho a rozvlákňuje — teprve pak z něj dítě něco získá. Z tuhého plátku nezíská nic.',
          'Opakování je důležitější než pestrost. Potravinu, kterou dítě odmítne, nabídni znovu; nenahrazuj ji jinou.',
        ],
      },
      {
        heading: 'Česká specialita',
        body: [
          'Šetření o stravování malých dětí opakovaně ukazují, že nedostatečný příjem železa se v druhé polovině prvního roku týká velké části českých dětí — bez ohledu na to, jakou metodou se příkrm zaváděl.',
          'Příčinou je kombinace nízké spotřeby masa v dětské stravě, vysoké spotřeby mléčných výrobků a časného zavedení kravského mléka jako nápoje.',
          'Metoda vedená dítětem tenhle problém nezpůsobila ani nevyřešila. Jen ho zviditelnila tím, že z jídelníčku odstranila obohacené kaše, které ho maskovaly.',
        ],
      },
      {
        heading: 'Vstřebávání',
        body: [
          'Železo z rostlinných zdrojů se vstřebává hůř než železo z masa. Pomáhá mu vitamin C — proto se luštěniny, obiloviny a listová zelenina podávají spolu s ovocem nebo se zeleninou bohatou na vitamin C.',
          'V bezmasé domácnosti je tohle spojení klíčové, protože jiná cesta k lepšímu vstřebání nehemového železa není.',
        ],
      },
    ],
    sources: [NHS_IRON, NHS_VEGETARIAN, SZU_FIRST_SPOON, MZCR_COMPLEMENTARY],
    literature: [KNIHA],
    reviewStatus: 'verified',
  },
  {
    id: 'zinek',
    titleCz: 'Zinek: tichý sourozenec železa',
    category: 'vyziva',
    summary:
      'Zásoba zinku je u novorozence menší a po šestém měsíci ji mléko nepokryje. Nedostatek se nediagnostikuje — jen předpokládá u dětí, jejichž strava jeho zdroje neobsahuje.',
    keyPoints: [
      'Zdroje zinku se skoro dokonale kryjí se zdroji železa: maso, vnitřnosti, luštěniny, semena a celozrnné obiloviny.',
      'Spolehlivý a dostupný ukazatel zásob zinku neexistuje — v krvi se to prostě nezměří.',
      'Kdo řeší železo správně, řeší tím zároveň zinek.',
    ],
    sections: [
      {
        heading: 'Proč se o něm mluví míň než o železe',
        body: [
          'Zásoba zinku je u novorozence menší než zásoba železa a mateřské mléko ji po šestém měsíci nepokrývá. Důvod k pozornosti je tedy stejný.',
          'Zatímco hladinu železa lze u dítěte změřit odběrem krve a stanovením feritinu, u zinku spolehlivý a snadno dostupný ukazatel neexistuje — sérová koncentrace kolísá a o zásobách nevypovídá.',
          'Nedostatek zinku se proto v praxi nediagnostikuje. Jen se předpokládá u dětí, jejichž strava jeho zdroje neobsahuje.',
        ],
      },
      {
        heading: 'Jak se projeví',
        body: [
          'Nenápadně: zpomaleným růstem, opakovanými infekcemi a kožními změnami.',
          'Žádné běžné vyšetření, které by se u zdravého kojence dělalo rutinně, ho nezachytí. To je důvod, proč se v odborném hodnocení metody vedené dítětem obavy objevovaly častěji, než by odpovídalo počtu doložených případů.',
          'Máš-li podezření, patří to pediatrovi. Aplikace nic nediagnostikuje.',
        ],
      },
      {
        heading: 'Dobrá zpráva',
        body: [
          'Zdroje zinku se se zdroji železa překrývají téměř dokonale — maso, vnitřnosti, luštěniny, semena a celozrnné obiloviny.',
          'Rada, jak se vyhnout jednomu nedostatku, se tedy kryje s radou, jak se vyhnout druhému. Dítě, které nezískává dost jednoho, obvykle nezískává dost ani druhého — a naopak.',
          'V katalogu surovin poznáš tyhle položky podle kategorií Maso a ryby, Luštěniny a Ořechy, semínka a tuky.',
        ],
      },
    ],
    sources: [NHS_TRACE_MINERALS, NHS_VEGETARIAN, SZU_FIRST_SPOON],
    literature: [KNIHA],
    reviewStatus: 'verified',
  },
  {
    id: 'tri-pravidla-kazdeho-jidla',
    titleCz: 'Tři pravidla každého jídla',
    category: 'vyziva',
    summary:
      'Úpravy, které do metody doplnil novozélandský randomizovaný pokus. Železo, energie a bezpečný tvar — při každém jídle, ne jednou týdně.',
    keyPoints: [
      'Při každém jídle alespoň jedna potravina bohatá na železo.',
      'Při každém jídle alespoň jedna potravina s vysokým obsahem energie — ne jen zelenina a ovoce.',
      'Žádné jídlo nemá tvar a konzistenci, které by mohly ucpat dýchací cesty.',
    ],
    sections: [
      {
        heading: 'Odkud se vzala',
        body: [
          'Novozélandský tým zařadil dvě stě šest kojenců do randomizovaného pokusu, ve kterém se losovalo o to, jakou radu rodina dostane. Jedna polovina dostala podporu zaměřenou na metodu vedenou dítětem, druhá na obvyklý postup s pyré a lžičkou.',
          'Do metody přitom tým doplnil tři úpravy — a právě ty jsou tím nejdůležitějším, co se z celého pokusu dochovalo. Vznikly proto, že přesně v těchhle třech bodech odborníci metodu podezřívali ze slabin.',
          'Sběr dat probíhal několik let a byl neobyčejně důkladný: vážené záznamy porcí i zbytků, pravidelné měření, odběry krve na feritin u části dětí a telefonické hlášení každé příhody dávení nebo dušení.',
        ],
      },
      {
        heading: 'Co pokus zjistil',
        body: [
          'Metoda nezvyšuje riziko dušení. To byla první a nejočekávanější odpověď.',
          'Zároveň ale metoda sama o sobě nezajišťuje víc železa ani energie a nechrání před nadváhou. Nízký příjem železa v druhé polovině prvního roku je problém obou postupů, ne jednoho z nich.',
          'Vzorek dvou set šesti dětí stačí na srovnání hmotnosti a příjmu živin. Nestačí na to, aby se změřil výskyt jevu, který se vyskytuje řídce — a udušení je právě takový jev. Z toho pokusu tedy nelze vyčíst, že je metoda v tomhle ohledu prokazatelně bezpečná; lze vyčíst, že se v něm zvýšené riziko neukázalo.',
        ],
      },
      {
        heading: 'Co si z toho vzít',
        body: [
          'Metoda je legitimní volba, ne zázrak. Nepřinese víc železa sama od sebe — to musí zařídit rodič složením talíře.',
          'Proto ta tři pravidla. Nejsou to doporučení navíc, jsou to podmínky, za kterých metoda z výživového hlediska obstojí.',
          'V praxi to znamená: ke každému jídlu přidej něco s železem a něco vydatného, a než to položíš na stůl, projeď to testem měkkosti.',
        ],
      },
    ],
    sources: [SZU_FIRST_SPOON, NHS_YOUNG_CHILDREN],
    literature: [KNIHA],
    reviewStatus: 'verified',
  },
  {
    id: 'vitamin-d-a-sul',
    titleCz: 'Vitamin D, sůl a kravské mléko',
    category: 'vyziva',
    summary:
      'Vitamin D se kape celý první rok bez ohledu na metodu. Sůl má u kojence velmi nízký strop a jeden rohlík z něj ukrojí podstatnou část.',
    keyPoints: [
      'Vitamin D je jediná věc, která se do dítěte dostává výhradně z ruky dospělého.',
      'Běžný český rohlík obsahuje tolik soli, že jeden kus vyčerpá podstatnou část denní kvóty.',
      'Kravské mléko jako nápoj až po prvním roce; do vaření a jogurty od šesti měsíců ano.',
    ],
    sections: [
      {
        heading: 'Vitamin D',
        body: [
          'Mateřské mléko ho obsahuje minimálně a kojenecká kůže ho v našich zeměpisných šířkách po většinu roku nevytvoří dost. Doporučení proto uvádějí denní suplementaci po celý první rok, v Česku obvykle pěti sty mezinárodních jednotek denně.',
          'Kapky se podávají bez ohledu na to, jestli dítě jí pyré nebo si bere kusy do ruky. Je to jediná položka, u které se do dítěte něco dostává výhradně z rukou dospělého.',
          'Rodiče, kteří metodu zvolili z přesvědčení, že do dítěte nemá nikdo nic dávat, tenhle bod občas přehlíželi — a je to jedno z mála míst, kde metoda skutečně způsobovala škodu. Konkrétní dávkování urči s pediatrem.',
        ],
      },
      {
        heading: 'Sůl',
        body: [
          'Do jednoho roku je limit pod jeden gram soli denně, pak nejvýše dva gramy denně do tří let. Ledviny malého dítěte větší zátěž nezvládnou.',
          'Nejnáročnější položkou v českém jídelníčku bývá pečivo. Běžný rohlík obsahuje soli tolik, že jeden kus vyčerpá podstatnou část denní kvóty.',
          'Řešením je péct chleba bez soli nebo kupovat pečivo s nižším obsahem. Všechny recepty v aplikaci se proto vaří bez soli a dospělí si dosolují až na talíři.',
          'Bujón, kostky, sójová omáčka a uzeniny do dětské linie nepatří vůbec.',
        ],
      },
      {
        heading: 'Kravské mléko',
        body: [
          'Jako nápoj až po prvním roce — má málo železa a zbytečně zatěžuje. Vysoká spotřeba mléčných výrobků a časné zavedení mléka jako nápoje je jedna z příčin nízkého příjmu železa u českých dětí.',
          'Do vaření a v podobě jogurtu nebo tvarohu se mléko používá od šesti měsíců bez problému. Nepasterizované mléko a sýry z něj do jednoho roku ne.',
        ],
      },
    ],
    sources: [NHS_AVOID, NHS_YOUNG_CHILDREN, SZU_FIRST_SPOON],
    literature: [KNIHA],
    reviewStatus: 'verified',
  },
];
