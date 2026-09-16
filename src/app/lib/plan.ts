import { useCallback, useMemo } from 'react';
import { useHouseholdStore } from '@/storage/householdStore';
import { sestavPlan, type VstupPlanu } from '@/plan/generator';
import type { DuvodJidla, Plan, TypJidla } from '@/plan/typy';
import { ageInMonths } from './age';
import { todayIso } from './labels';
import { tastedIds } from './tastings';
import { useAktivniDite } from './dite';

/**
 * Napojení plánu na stav domácnosti.
 *
 * Generátor sahá do celého katalogu, takže se sem smí importovat jen
 * z obrazovek, které se stahují až při otevření. Úložiště o něm neví
 * schválně: kdyby ho znalo, stáhl by si katalog i rodič, který plán nikdy
 * neotevřel.
 */

export const TYP_JIDLA_LABELS: Record<TypJidla, string> = {
  snidane: 'Snídaně',
  obed: 'Oběd',
  svacina: 'Svačina',
  vecere: 'Večeře',
};

export const DUVOD_LABELS: Record<DuvodJidla, string> = {
  'prvni-ochutnavka': 'první ochutnávka',
  'nova-surovina': 'nová surovina',
  alergen: 'opakovaný alergen',
  zelezo: 'železo',
  osvedcene: 'osvědčené',
};

/** Plán vybraného dítěte, nebo `null`, když si ho rodič ještě nesestavil. */
export function useAktivniPlan(): Plan | null {
  const dite = useAktivniDite();
  const plans = useHouseholdStore((store) => store.state.plans);
  return dite === null ? null : (plans?.[dite.id]?.hodnota ?? null);
}

export interface PlanNastroje {
  /** Sestaví blok. Jedna pro první, vyšší číslo pro pokračování. */
  sestav(blok: number, navic?: Iterable<string>, varianta?: number): Plan | null;
  /** Vstup generátoru, aby si obrazovka mohla přepočítat jediný den. */
  vstup(blok: number, navic?: Iterable<string>): VstupPlanu | null;
}

/**
 * Sestavení plánu z toho, co aplikace o dítěti ví.
 *
 * Deník rozhoduje, co je novinka: co už dítě ochutnalo, se jako nová
 * surovina znovu nenabídne. Proto se každý další blok počítá až ve chvíli,
 * kdy si o něj rodič řekne, ne dopředu.
 */
export function usePlanNastroje(): PlanNastroje {
  const dite = useAktivniDite();
  const state = useHouseholdStore((store) => store.state);
  const ochutnane = useMemo(() => tastedIds(state, dite?.id ?? null), [state, dite]);

  const vstup = useCallback(
    (blok: number, navic?: Iterable<string>): VstupPlanu | null =>
      dite === null
        ? null
        : {
            dite,
            blok,
            // Dny odškrtnuté bez zápisu do deníku se počítají taky. Kdo
            // odškrtává bez zapisování, by jinak v dalším bloku dostal
            // tytéž novinky znovu.
            ochutnane: navic === undefined ? ochutnane : new Set([...ochutnane, ...navic]),
            mesice: ageInMonths(dite.birthDate),
            mesicVRoce: new Date().getMonth() + 1,
            dnes: todayIso(),
          },
    [dite, ochutnane],
  );

  const sestav = useCallback(
    (blok: number, navic?: Iterable<string>, varianta?: number): Plan | null => {
      const zadani = vstup(blok, navic);
      return zadani === null ? null : sestavPlan({ ...zadani, varianta: varianta ?? 0 });
    },
    [vstup],
  );

  return { sestav, vstup };
}
