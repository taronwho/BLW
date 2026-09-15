import type { Ingredient } from '@/types';
import type { SeznamPodminka } from './lists';
import { nutrientProfile } from './nutrients';

/**
 * Co musí splnit každá položka seznamu.
 *
 * Bydlí to zvlášť od `lists.ts` schválně: tenhle soubor sahá na katalog
 * i na výpočet živin, kdežto seznamy čte úvodní obrazovka. Kdyby byly
 * predikáty přímo u dat, stáhl by si celý katalog každý rodič hned při
 * prvním otevření aplikace, i kdyby do seznamů nikdy neklepl.
 */
export const PODMINKY: Record<
  SeznamPodminka,
  { popis: string; splnuje: (ingredient: Ingredient) => boolean }
> = {
  'zdroj-zeleza': {
    popis: 'je aspoň zdrojem železa',
    splnuje: (i) => nutrientProfile(i).iron !== 'nevyznamny',
  },
  'zdroj-cecka': {
    popis: 'je aspoň zdrojem vitaminu C',
    splnuje: (i) => nutrientProfile(i).vitaminC !== 'nevyznamny',
  },
  'klicovy-alergen': {
    popis: 'nese některý z devíti klíčových alergenů',
    splnuje: (i) => i.isKeyAllergen,
  },
  'vysoke-riziko-duseni': {
    popis: 'má vysoké riziko dušení',
    splnuje: (i) => i.chokingRisk === 'high',
  },
  'od-sesti-bez-vysokeho-rizika': {
    popis: 'je od šesti měsíců a nemá vysoké riziko dušení',
    splnuje: (i) => i.minAgeMonths <= 6 && i.chokingRisk !== 'high',
  },
  'az-od-roku': {
    popis: 'se nabízí až od dvanácti měsíců',
    splnuje: (i) => i.minAgeMonths >= 12,
  },
};
