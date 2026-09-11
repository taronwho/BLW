import { useEffect, useMemo } from 'react';
import { useHouseholdStore } from '@/storage/householdStore';
import { ageInMonths, defaultStage } from '@/lib/age';
import { tastedIngredientIds } from '@/lib/filters';
import type { FilterContext } from '@/lib/filters';
import type { Stage } from '@/types';

/** Odvozené hodnoty, které potřebuje skoro každá obrazovka. */
export function useHousehold(): {
  ready: boolean;
  ageMonths: number | null;
  suggestedStage: Stage;
  filterContext: FilterContext;
} {
  const { state, ready, init } = useHouseholdStore();

  useEffect(() => {
    void init();
  }, [init]);

  return useMemo(() => {
    const ageMonths = state.childBirthDate === '' ? null : ageInMonths(state.childBirthDate);
    return {
      ready,
      ageMonths,
      suggestedStage: defaultStage(state.childBirthDate),
      filterContext: {
        tastedIds: tastedIngredientIds(state.tastings),
        favorites: new Set(state.favorites),
        ageMonths,
        month: new Date().getMonth() + 1,
      },
    };
  }, [state.childBirthDate, state.tastings, state.favorites, ready]);
}
