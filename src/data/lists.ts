
import type { SourceRef } from '@/types';
import { NHS_TEETHING_SYMPTOMS, NHS_TEETHING_TIPS, NHS_YOUNG_CHILDREN } from './ingredients/_sources';

/**
 * Tematické seznamy surovin.
 *
 * Katalog má tři sta položek a filtry na něj jsou přesné, ale rodič, který
 * poprvé otevírá aplikaci, neví, na co filtrovat. Seznam je hotová odpověď
 * na otázku, kterou si v tu chvíli klade: čím začít, kde vzít železo, na co
 * si dát pozor u tvaru, co počká do roku.
 *
 * Seznamy nic netvrdí nad rámec katalogu — každá položka v nich je ta samá
 * surovina se stejnými zdroji. Kde se dá, nese seznam podmínku, kterou musí
 * splnit každá jeho položka; hlídá ji validátor, takže se do „Železa na
 * talíř" nedá propašovat surovina, která železo nemá.
 */
/**
 * Podmínka je jen jméno, ne funkce.
 *
 * Kdyby si seznam nesl rovnou predikát, musel by tenhle soubor sáhnout na
 * katalog i na výpočet živin — a protože ho čte úvodní obrazovka, stáhl by
 * si každý rodič celý katalog hned při prvním otevření. Predikáty proto
 * žijí v `listRules.ts`, kam sahá jen validace.
 */
export type SeznamPodminka =
  | 'zdroj-zeleza'
  | 'zdroj-cecka'
  | 'klicovy-alergen'
  | 'vysoke-riziko-duseni'
  | 'od-sesti-bez-vysokeho-rizika'
  | 'az-od-roku';

/** Klíč do sady ikon v `src/app/lib/seznamIkony.ts`; data zůstávají bez Reactu. */
export type SeznamIkona =
  | 'zacatek'
  | 'zelezo'
  | 'cecko'
  | 'alergen'
  | 'riziko'
  | 'tuky'
  | 'bezVareni'
  | 'zoubky'
  | 'klid';

export type SeznamTon = 'zelezo' | 'cecko' | 'alergen' | 'riziko' | 'zacatek' | 'klid';

/** Položka seznamu: surovina a jedna věta, proč v něm je. */
export interface SeznamPolozka {
  id: string;
  /**
   * Krátký popisek do řádky seznamu.
   *
   * Nesmí tvrdit nic, co katalog ani zdroje seznamu nepodkládají — je to
   * vodítko, proč je položka zrovna tady, ne nové doporučení.
   */
  note: string;
}

export interface Seznam {
  id: string;
  titleCz: string;
  /** Jedna věta na dlaždici. */
  summary: string;
  /** Odstavec v hlavičce otevřeného seznamu. */
  intro: string;
  tone: SeznamTon;
  icon: SeznamIkona;
  /** Rada, která k seznamu patří. Otevře se z jeho hlavičky. */
  guideId?: string;
  polozky: SeznamPolozka[];
  podminka?: SeznamPodminka;
  /**
   * Doklady k tomu, co seznam tvrdí nad rámec katalogu.
   *
   * Seznam, který jen přeskládá vlastnosti z katalogu (železo, alergen,
   * riziko dušení), zdroje nepotřebuje — ty jsou u surovin. Jakmile ale
   * seznam něco doporučuje, musí to mít odkud, jinak je to vymyšlené.
   */
  sources?: SourceRef[];
}

export const lists: Seznam[] = [
  {
    id: 'prvni-sousta',
    titleCz: 'První sousta',
    summary: 'Čím začít, když jde talíř na stůl poprvé',
    intro:
      'Měkké, uchopitelné a bez tvaru, který by mohl ucpat dýchací cesty. Pořadí nerozhoduje. Začít jde kteroukoli z nich a žádná z nich není „ta správná první“.',
    tone: 'zacatek',
    icon: 'zacatek',
    guideId: 'prvni-potraviny',
    polozky: [
      { id: 'banan', note: 'Měkký, sladký a po ruce kdykoli.' },
      { id: 'avokado', note: 'Máslová dužina, kterou dásně rozmáčknou.' },
      { id: 'batat', note: 'Upečený je tak měkký, že ho zvládne i začátečník.' },
      { id: 'brokolice', note: 'Růžička má vlastní držadlo do dlaně.' },
      { id: 'dyne-hokaido', note: 'Sladká dužina a slupka, která pečením změkne.' },
      { id: 'dyne-maslova', note: 'Vyjde z ní kaše i pečený hranolek.' },
      { id: 'cuketa', note: 'Rychle změkne a chutná skoro neutrálně.' },
      { id: 'ovesne-vlocky-jemne', note: 'Kaše, na které stojí většina snídaní.' },
      { id: 'vejce-slepici', note: 'Zároveň alergen, který se nemá odkládat.' },
      { id: 'tofu-natural', note: 'Bílkovina bez masa, měkká na kousnutí.' },
    ],
    podminka: 'od-sesti-bez-vysokeho-rizika',
  },
  {
    id: 'zelezo-na-talir',
    titleCz: 'Železo na talíř',
    summary: 'Kvůli železu se příkrm po šestém měsíci vůbec zavádí',
    intro:
      'Zásoba železa z těhotenství dochází kolem šestého měsíce a mateřské mléko ji nedoplní. Aspoň jedna z těchhle surovin má být v každém jídle.',
    tone: 'zelezo',
    icon: 'zelezo',
    guideId: 'zelezo-proc-a-jak',
    polozky: [
      { id: 'kureci-jatra', note: 'Nejsilnější zdroj železa v katalogu.' },
      { id: 'hovezi-zadni', note: 'Hemové železo se vstřebává nejlépe.' },
      { id: 'cocka-cervena-loupana', note: 'Rozvaří se do kaše, není co kousat.' },
      { id: 'cocka-hneda', note: 'Drží tvar, hodí se do omáčky.' },
      { id: 'tofu-natural', note: 'Rostlinné železo i bílkovina naráz.' },
      { id: 'spenat', note: 'Nasekaný do kaše nebo do omelety.' },
      { id: 'tahini', note: 'Sezamová pasta, tenká vrstva stačí.' },
      { id: 'sezam-mlety', note: 'Mletý, ne celý. Semínko vcelku je riziko.' },
      { id: 'ovesne-vlocky-jemne', note: 'Železo hned do ranní kaše.' },
      { id: 'fazole-cervene-kidney', note: 'Rozmáčknout: slupka se jinak nedá rozkousat.' },
    ],
    podminka: 'zdroj-zeleza',
  },
  {
    id: 'cecko-k-zelezu',
    titleCz: 'Vitamin C k železu',
    summary: 'Rostlinné železo se bez něj vstřebá mnohem hůř',
    intro:
      'Železo z rostlin se vstřebává hůř než z masa. Vitamin C ve stejném jídle to výrazně zlepšuje, proto se k čočce hodí paprika a ke kaši ovoce.',
    tone: 'cecko',
    icon: 'cecko',
    guideId: 'zelezo-proc-a-jak',
    polozky: [
      { id: 'paprika-sladka', note: 'Ke každé luštěnině, ať se železo vstřebá.' },
      { id: 'brokolice', note: 'Vitamin C rovnou v příloze.' },
      { id: 'kiwi', note: 'Vitamin C k čočce i k ranní kaši.' },
      { id: 'jahody', note: 'V sezóně si je dítě vezme samo.' },
      { id: 'pomeranc', note: 'Dužina bez blan a bez jadérek.' },
      { id: 'ruzickova-kapusta', note: 'Rozpůlená, aby přestala být kulatá.' },
      { id: 'mango', note: 'Sladké a kluzké, krájej na proužky.' },
      { id: 'maliny', note: 'Rozmáčknou se samy mezi prsty.' },
    ],
    podminka: 'zdroj-cecka',
  },
  {
    id: 'klicove-alergeny',
    titleCz: 'Klíčových devět',
    summary: 'Alergeny, které se nemají odkládat',
    intro:
      'Odkládání zavedení riziko alergie nesnižuje. Každý z těchhle alergenů se nabízí brzy, v malém množství a pak opakovaně: aplikace počítá expozice v deníku.',
    tone: 'alergen',
    icon: 'alergen',
    guideId: 'zavadeni-alergenu',
    polozky: [
      { id: 'vejce-slepici', note: 'Vejce: uvařené natvrdo, nikdy tekuté.' },
      { id: 'arasidove-maslo', note: 'Arašídy: tenká vrstva zředěná vodou.' },
      { id: 'jogurt-bily-plnotucny', note: 'Mléko: plnotučný a neslazený.' },
      { id: 'mandlove-maslo', note: 'Ořechy: jen jako máslo, nikdy celé.' },
      { id: 'chleb-kvaskovy', note: 'Pšenice a lepek: kůrka na okusování.' },
      { id: 'tofu-natural', note: 'Sója: měkké kostky do ruky.' },
      { id: 'losos', note: 'Ryby: prohmatat a vybrat kosti.' },
      { id: 'tahini', note: 'Sezam: pasta místo celých semínek.' },
      { id: 'krevety', note: 'Korýši: dobře uvařené a nakrájené.' },
    ],
    podminka: 'klicovy-alergen',
  },
  {
    id: 'pozor-na-tvar',
    titleCz: 'Pozor na tvar',
    summary: 'Nekrájí se na kolečka ani se nepodávají celé',
    intro:
      'Riziko u nich nedělá velikost, ale kulatý průřez, který dýchací cesty uzavře jako zátka. Krájej je podélně a u každé je napsáno jak.',
    tone: 'riziko',
    icon: 'riziko',
    guideId: 'daveni-vs-duseni',
    polozky: [
      { id: 'hroznove-vino', note: 'Podélně na čtvrtky, nikdy celé.' },
      { id: 'rajce', note: 'Cherry rajče se krájí podélně na čtvrtky.' },
      { id: 'boruvky', note: 'Rozmáčknout mezi prsty nebo rozpůlit.' },
      { id: 'mrkev', note: 'Syrová ne. Vařená doměkka ano.' },
      { id: 'redkvicka', note: 'Tvrdá a kulatá: nejhorší možná kombinace.' },
      { id: 'tresne', note: 'Vypeckovat a teprve pak rozpůlit.' },
      { id: 'lici', note: 'Pryč se slupkou i s peckou, pak na čtvrtky.' },
      { id: 'arasidy', note: 'Celé nikdy. Jedině jako hladké máslo.' },
      { id: 'mozzarella', note: 'Kulička se krájí podélně, ne na kolečka.' },
      { id: 'celer-rapikaty', note: 'Vlákna se v puse spletou do chuchvalce.' },
    ],
    podminka: 'vysoke-riziko-duseni',
  },
  {
    id: 'na-zoubky',
    titleCz: 'Když lezou zoubky',
    summary: 'Vychlazené a měkké, na okusování',
    intro:
      'U dítěte od šesti měsíců, které už jí příkrm, radí NHS nabídnout k okusování syrové ovoce a zeleninu; měkké ovoce jako meloun dásně zklidní. Zůstaň u toho. Z okusovaného kousku se může ulomit sousto, které dítě ještě nedokáže rozžvýkat. Nic zmrzlého, nic slazeného a žádné sušenky: cukr kazí i těch pár zubů, co zrovna lezou.',
    tone: 'klid',
    icon: 'zoubky',
    polozky: [
      { id: 'meloun-vodni', note: 'Studený z lednice, měkký na dásně.' },
      { id: 'meloun-cantaloupe', note: 'Sladký a měkký, drží se za kůru.' },
      { id: 'okurka-salatova', note: 'Vychlazený proužek na okusování.' },
      { id: 'hruska', note: 'Zralá je měkká sama od sebe.' },
      { id: 'mango', note: 'Chladné a kluzké, krájej na proužky.' },
      { id: 'banan', note: 'Když nic jiného nejde, banán ano.' },
      { id: 'avokado', note: 'Chladivé a mastné, na dásně netlačí.' },
      { id: 'jogurt-bily-plnotucny', note: 'Studená lžíce, když bolí kousání.' },
      { id: 'kefir', note: 'Chladné a tekuté, kousat se nemusí.' },
      { id: 'tvaroh-mekky', note: 'Studený a hladký, bez kousání.' },
    ],
    podminka: 'od-sesti-bez-vysokeho-rizika',
    sources: [NHS_TEETHING_TIPS, NHS_TEETHING_SYMPTOMS],
  },
  {
    id: 'zdrave-tuky',
    titleCz: 'Tuky, které dítě potřebuje',
    summary: 'Nízkotučné varianty do prvního roku nepatří',
    intro:
      'Tuk je pro kojence hlavní zdroj energie a mozek z něj roste. Odtučněné mléčné výrobky a „light“ varianty se do prvního roku nenabízejí.',
    // Seznam nemá strojovou podmínku: „zdravý tuk" není pole v katalogu
    // a vymýšlet si ho jen kvůli kontrole by bylo horší než ho nemít.
    tone: 'zacatek',
    icon: 'tuky',
    guideId: 'tri-pravidla-kazdeho-jidla',
    sources: [NHS_YOUNG_CHILDREN],
    polozky: [
      { id: 'avokado', note: 'Nejtučnější ovoce, jaké se dá koupit.' },
      { id: 'olej-olivovy', note: 'Lžička do kaše nebo na zeleninu.' },
      { id: 'tahini', note: 'Sezamová pasta, tenká vrstva.' },
      { id: 'arasidove-maslo', note: 'Zředit vodou nebo mlékem.' },
      { id: 'losos', note: 'Tučná ryba; před podáním prohmatat na kosti.' },
      { id: 'vejce-slepici', note: 'Žloutek je tuk i bílkovina.' },
      { id: 'jogurt-bily-plnotucny', note: 'Plnotučný, ne odtučněný.' },
      { id: 'mandlove-maslo', note: 'Mandle jako pasta, ne jako ořech.' },
    ],
  },
  {
    id: 'bez-vareni',
    titleCz: 'Bez vaření',
    summary: 'Když není čas ani chuť zapínat sporák',
    intro:
      'Stačí oloupat, rozmáčknout nebo nakrájet. Hodí se na svačinu, k snídani i ve chvíli, kdy se oběd nepovedl.',
    tone: 'klid',
    icon: 'bezVareni',
    polozky: [
      { id: 'banan', note: 'Oloupat a podat.' },
      { id: 'avokado', note: 'Rozkrojit, vydlabat, rozmáčknout.' },
      { id: 'jogurt-bily-plnotucny', note: 'Lžíce a hotovo.' },
      { id: 'tvaroh-mekky', note: 'Rozmíchat s ovocem.' },
      { id: 'cottage', note: 'Zrníčka, která se dají brát prsty.' },
      { id: 'mango', note: 'Nakrájet na proužky, ať se dá držet.' },
      { id: 'maliny', note: 'Rozmáčknout mezi prsty.' },
      { id: 'okurka-salatova', note: 'Oloupat a nakrájet podélně.' },
      { id: 'tahini', note: 'Tenká vrstva na chleba.' },
      { id: 'kefir', note: 'Do hrnečku nebo na kaši.' },
    ],
    podminka: 'od-sesti-bez-vysokeho-rizika',
  },
];

export const listById: ReadonlyMap<string, Seznam> = new Map(lists.map((one) => [one.id, one]));
