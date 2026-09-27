import type { Stage } from '@/types';
import type { DruhObrazku } from '../components/ObrazkySousta';

/**
 * Ukázky tvaru sousta pro průvodce `/tvar-sousta`.
 *
 * Průvodce **nemá vlastní zdravotní text**. U každé ukázky je obrázek
 * a krátký popisek k němu, ale pokyn, podle kterého se krájí, se čte
 * přímo z katalogu (`prep[fáze].serving` a `caution` té suroviny) — ten
 * je doložený zdroji a prochází bezpečnostními testy. Kdyby tu stál
 * vlastní text, rozešel by se s katalogem při první opravě.
 *
 * Popisky pod obrázky jen pojmenovávají, co obrázek ukazuje, a musí
 * odpovídat pokynu z katalogu pro tutéž fázi. Hlídá to
 * `tests/data/tvarSousta.test.ts`.
 */

export type PodleFaze<T> = T | Record<Stage, T>;

export function proFazi<T extends string>(hodnota: PodleFaze<T>, faze: Stage): T {
  return typeof hodnota === 'string' ? hodnota : hodnota[faze];
}

export interface StranaUkazky {
  obrazek: PodleFaze<DruhObrazku>;
  popisek: PodleFaze<string>;
}

export interface UkazkaTvaru {
  id: string;
  nadpis: string;
  /** Surovina z katalogu, jejíž pokyn ke krájení se u ukázky ukáže. */
  ingredientId: string;
  /** Takhle ne. U surovin bez typické chyby chybí. */
  ne?: StranaUkazky;
  ano: StranaUkazky;
}

export const UKAZKY_TVARU: readonly UkazkaTvaru[] = [
  {
    id: 'kulate-plody',
    nadpis: 'Kulaté plody',
    ingredientId: 'hroznove-vino',
    ne: { obrazek: 'hrozen-cely', popisek: 'celá kulička' },
    ano: { obrazek: 'hrozen-ctvrtky', popisek: 'podélně na čtvrtky' },
  },
  {
    id: 'tvrde-ovoce',
    nadpis: 'Tvrdé ovoce',
    ingredientId: 'jablko',
    ne: {
      obrazek: { '6m': 'jablko-kostky', '9m': 'jablko-kostky', '12m': 'jablko-cele' },
      popisek: {
        '6m': 'syrové jablko v jakékoli podobě',
        '9m': 'samostatné kousky syrového jablka',
        '12m': 'celé jablko do ruky',
      },
    },
    ano: {
      obrazek: { '6m': 'jablko-mesicek', '9m': 'jablko-mesicek', '12m': 'jablko-platek' },
      popisek: {
        '6m': 'dušený měsíček doměkka',
        '9m': 'vařený měsíček nebo jemně strouhané',
        '12m': 'tenký syrový plátek bez slupky',
      },
    },
  },
  {
    id: 'korenova-zelenina',
    nadpis: 'Kořenová zelenina',
    ingredientId: 'mrkev',
    ne: {
      obrazek: 'mrkev-kolecka',
      popisek: {
        '6m': 'syrová mrkev v jakékoli podobě',
        '9m': 'syrové plátky a kolečka',
        '12m': 'kolečka a syrové hranolky',
      },
    },
    ano: {
      obrazek: { '6m': 'mrkev-hranolek', '9m': 'mrkev-kostky', '12m': 'mrkev-kostky' },
      popisek: {
        '6m': 'vařený hranolek tlustý jako prst',
        '9m': 'vařené kostky velikosti sousta',
        '12m': 'vařené kostky nebo jemně strouhaná',
      },
    },
  },
  {
    id: 'orechy',
    nadpis: 'Ořechy a arašídy',
    ingredientId: 'arasidy',
    ne: { obrazek: 'arasidy-cele', popisek: 'celé arašídy a ořechy' },
    ano: { obrazek: 'arasidy-mlete', popisek: 'mleté, vmíchané do jídla' },
  },
  {
    id: 'maso',
    nadpis: 'Maso',
    ingredientId: 'hovezi-zadni',
    ne: { obrazek: 'maso-kus', popisek: 'tuhý, krátce opečený kus' },
    ano: {
      obrazek: { '6m': 'maso-vlakna', '9m': 'maso-vlakna', '12m': 'maso-kostky' },
      popisek: {
        '6m': 'dlouho dušené, v dlouhých proužcích',
        '9m': 'dušené, rozebrané na vlákna',
        '12m': 'dušené, na malé kostky',
      },
    },
  },
  {
    id: 'brokolice',
    nadpis: 'Měkká zelenina',
    ingredientId: 'brokolice',
    ano: {
      obrazek: { '6m': 'brokolice-ruzicka', '9m': 'brokolice-kousky', '12m': 'brokolice-kousky' },
      popisek: {
        '6m': 'vařená růžička se stopkou jako držadlem',
        '9m': 'vařené menší kousky na sbírání prsty',
        '12m': 'vařená, pečená i zapečená',
      },
    },
  },
  {
    id: 'mekke-ovoce',
    nadpis: 'Měkké ovoce',
    ingredientId: 'banan',
    ano: {
      obrazek: { '6m': 'banan-drzadlo', '9m': 'banan-pulkolecka', '12m': 'banan-kostky' },
      popisek: {
        '6m': 'spodek ve slupce jako držadlo',
        '9m': 'kolečka rozpůlená, ať netvoří kotouč',
        '12m': 'kostky nebo ukusování z půlky',
      },
    },
  },
];
