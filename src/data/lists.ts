
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
  ingredientIds: string[];
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
      'Měkké, uchopitelné a bez tvaru, který by mohl ucpat dýchací cesty. Pořadí nerozhoduje — začít jde kteroukoli z nich a žádná z nich není „ta správná první".',
    tone: 'zacatek',
    icon: 'zacatek',
    guideId: 'prvni-potraviny',
    ingredientIds: [
      'banan',
      'avokado',
      'batat',
      'brokolice',
      'dyne-hokaido',
      'dyne-maslova',
      'cuketa',
      'ovesne-vlocky-jemne',
      'vejce-slepici',
      'tofu-natural',
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
    ingredientIds: [
      'kureci-jatra',
      'hovezi-zadni',
      'cocka-cervena-loupana',
      'cocka-hneda',
      'tofu-natural',
      'spenat',
      'tahini',
      'sezam-mlety',
      'ovesne-vlocky-jemne',
      'fazole-cervene-kidney',
    ],
    podminka: 'zdroj-zeleza',
  },
  {
    id: 'cecko-k-zelezu',
    titleCz: 'Vitamin C k železu',
    summary: 'Rostlinné železo se bez něj vstřebá mnohem hůř',
    intro:
      'Železo z rostlin se vstřebává hůř než z masa. Vitamin C ve stejném jídle to výrazně zlepšuje — proto se k čočce hodí paprika a ke kaši ovoce.',
    tone: 'cecko',
    icon: 'cecko',
    guideId: 'zelezo-proc-a-jak',
    ingredientIds: [
      'paprika-sladka',
      'brokolice',
      'kiwi',
      'jahody',
      'pomeranc',
      'ruzickova-kapusta',
      'mango',
      'maliny',
    ],
    podminka: 'zdroj-cecka',
  },
  {
    id: 'klicove-alergeny',
    titleCz: 'Klíčových devět',
    summary: 'Alergeny, které se nemají odkládat',
    intro:
      'Odkládání zavedení riziko alergie nesnižuje. Každý z těchhle alergenů se nabízí brzy, v malém množství a pak opakovaně — aplikace počítá expozice v deníku.',
    tone: 'alergen',
    icon: 'alergen',
    guideId: 'zavadeni-alergenu',
    ingredientIds: [
      'vejce-slepici',
      'arasidove-maslo',
      'jogurt-bily-plnotucny',
      'mandlove-maslo',
      'chleb-kvaskovy',
      'tofu-natural',
      'losos',
      'tahini',
      'krevety',
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
    ingredientIds: [
      'hroznove-vino',
      'rajce',
      'boruvky',
      'mrkev',
      'redkvicka',
      'tresne',
      'lici',
      'arasidy',
      'mozzarella',
      'celer-rapikaty',
    ],
    podminka: 'vysoke-riziko-duseni',
  },
  {
    id: 'na-zoubky',
    titleCz: 'Když lezou zoubky',
    summary: 'Vychlazené a měkké, na okusování',
    intro:
      'NHS radí u dítěte od šesti měsíců, které už jí příkrm, nabídnout syrové ovoce a zeleninu k okusování; měkké ovoce jako meloun dásně zklidní. Vždycky u toho buď — žvýkání a dušení jsou u kojence blízko sebe. Nic zmrzlého, nic slazeného a žádné sušenky: cukr kazí zuby i těch pár, co zrovna lezou.',
    tone: 'klid',
    icon: 'zoubky',
    ingredientIds: [
      'meloun-vodni',
      'meloun-cantaloupe',
      'okurka-salatova',
      'hruska',
      'mango',
      'banan',
      'avokado',
      'jogurt-bily-plnotucny',
      'kefir',
      'tvaroh-mekky',
    ],
    podminka: 'od-sesti-bez-vysokeho-rizika',
    sources: [NHS_TEETHING_TIPS, NHS_TEETHING_SYMPTOMS],
  },
  {
    id: 'zdrave-tuky',
    titleCz: 'Tuky, které dítě potřebuje',
    summary: 'Nízkotučné varianty do prvního roku nepatří',
    intro:
      'Tuk je pro kojence hlavní zdroj energie a mozek z něj roste. Odtučněné mléčné výrobky a „light" varianty se do prvního roku nenabízejí.',
    // Seznam nemá strojovou podmínku: „zdravý tuk" není pole v katalogu
    // a vymýšlet si ho jen kvůli kontrole by bylo horší než ho nemít.
    tone: 'zacatek',
    icon: 'tuky',
    guideId: 'tri-pravidla-kazdeho-jidla',
    sources: [NHS_YOUNG_CHILDREN],
    ingredientIds: [
      'avokado',
      'olej-olivovy',
      'tahini',
      'arasidove-maslo',
      'losos',
      'vejce-slepici',
      'jogurt-bily-plnotucny',
      'mandlove-maslo',
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
    ingredientIds: [
      'banan',
      'avokado',
      'jogurt-bily-plnotucny',
      'tvaroh-mekky',
      'cottage',
      'mango',
      'maliny',
      'okurka-salatova',
      'tahini',
      'kefir',
    ],
    podminka: 'od-sesti-bez-vysokeho-rizika',
  },
];

export const listById: ReadonlyMap<string, Seznam> = new Map(lists.map((one) => [one.id, one]));
