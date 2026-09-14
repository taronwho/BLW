import { ingredients } from '@/data/ingredients';
import type { AllergenGroup } from '@/types';
import type { SelectOption } from '../components/FilterSelect';
import type { ToggleOption } from '../components/FilterToggles';
import { ALLERGEN_LABELS } from './labels';

/**
 * Nabídka do filtru „bez alergenu".
 *
 * Staví se z alergenů, které v katalogu opravdu jsou — volba, po které
 * pokaždé vypadne prázdný seznam, jen mate. Dřív se brala pevná devítka
 * klíčových alergenů, takže chyběl celer, měkkýši i siřičitany.
 */
export const ALLERGENS_IN_CATALOGUE: readonly AllergenGroup[] = [
  ...new Set(ingredients.flatMap((item) => item.allergens)),
].sort((a, b) => ALLERGEN_LABELS[a].localeCompare(ALLERGEN_LABELS[b], 'cs'));

export const ALLERGEN_FILTER_OPTIONS: readonly SelectOption[] = [
  { id: 'vse', label: 'Neomezovat' },
  ...ALLERGENS_IN_CATALOGUE.map((allergen) => ({
    id: allergen,
    label: `bez ${ALLERGEN_LABELS[allergen]}`,
  })),
];

/** Čipy do filtru „bez alergenu" — zaškrtává se jich víc naráz. */
export const ALLERGEN_TOGGLE_OPTIONS: readonly ToggleOption[] = ALLERGENS_IN_CATALOGUE.map(
  (allergen) => ({ id: allergen, label: ALLERGEN_LABELS[allergen] }),
);
