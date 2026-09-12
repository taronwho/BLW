import { Search, Star } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ingredients } from '@/data';
import { useHouseholdStore } from '@/storage/householdStore';
import { INGREDIENT_CATEGORIES } from '@/types';
import type { Ingredient } from '@/types';
import { ageInMonths } from '../lib/age';
import { ChokingBadge } from '../components/ChokingBadge';
import { FilterChips } from '../components/FilterChips';
import type { ChipOption } from '../components/FilterChips';
import { TastedToggle } from '../components/TastedToggle';
import { inSeason, suitableNow, tastedIds } from '../lib/derive';
import { CATEGORY_LABELS } from '../lib/labels';
import { matchesIngredient } from '../lib/search';

type QuickFilter = 'vse' | 'neochutnano' | 'ochutnano' | 'alergeny' | 'oblibene' | 'vhodne' | 'sezonni';

const QUICK_FILTERS: readonly ChipOption[] = [
  { id: 'vse', label: 'Vše' },
  { id: 'neochutnano', label: 'Neochutnáno' },
  { id: 'ochutnano', label: 'Ochutnáno' },
  { id: 'alergeny', label: 'Klíčové alergeny' },
  { id: 'oblibene', label: 'Oblíbené' },
  { id: 'vhodne', label: 'Vhodné teď' },
  { id: 'sezonni', label: 'Sezónní' },
];

const CATEGORY_OPTIONS: readonly ChipOption[] = [
  { id: 'vse', label: 'Všechny kategorie' },
  ...INGREDIENT_CATEGORIES.map((category) => ({ id: category, label: CATEGORY_LABELS[category] })),
];

/** Seznam surovin (docs/SPEC.md kap. 4.1). */
export function IngredientsScreen(): ReactNode {
  const state = useHouseholdStore((store) => store.state);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('vse');
  const [quick, setQuick] = useState<QuickFilter>('vse');

  const tasted = useMemo(() => tastedIds(state), [state]);
  const favorites = useMemo(() => new Set(state.favorites), [state.favorites]);
  const months = ageInMonths(state.childBirthDate);
  const month = new Date().getMonth() + 1;

  const visible = useMemo(
    () =>
      ingredients.filter((item) => {
        if (!matchesIngredient(item, query)) return false;
        if (category !== 'vse' && item.category !== category) return false;
        switch (quick) {
          case 'neochutnano':
            return !tasted.has(item.id);
          case 'ochutnano':
            return tasted.has(item.id);
          case 'alergeny':
            return item.isKeyAllergen;
          case 'oblibene':
            return favorites.has(item.id);
          case 'vhodne':
            return suitableNow(item, months);
          case 'sezonni':
            return item.seasonCz.length > 0 && inSeason(item, month);
          default:
            return true;
        }
      }),
    [query, category, quick, tasted, favorites, months, month],
  );

  return (
    <section className="flex flex-col gap-4" aria-labelledby="suroviny-nadpis">
      <h1 id="suroviny-nadpis" className="text-xl font-bold">
        Suroviny
      </h1>

      <label className="flex min-h-touch items-center gap-2 rounded-xl border border-muted/30 bg-surface px-3">
        <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-muted" />
        <span className="sr-only">Hledat surovinu</span>
        <input
          type="search"
          value={query}
          data-testid="hledat-surovinu"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Hledej i bez diakritiky: cocka, batat…"
          className="min-h-touch w-full min-w-0 bg-transparent text-base outline-none"
        />
      </label>

      <FilterChips
        options={CATEGORY_OPTIONS}
        selected={category}
        onSelect={setCategory}
        ariaLabel="Filtr kategorií"
        testId="filtr-kategorii"
      />
      <FilterChips
        options={QUICK_FILTERS}
        selected={quick}
        onSelect={(id) => setQuick(id as QuickFilter)}
        ariaLabel="Rychlé filtry"
        testId="rychle-filtry"
      />

      <p className="text-xs text-muted" data-testid="pocet-surovin">
        {visible.length} z {ingredients.length} surovin
      </p>

      {visible.length === 0 ? (
        <p className="rounded-xl bg-surface p-4 text-sm text-muted" data-testid="prazdny-stav">
          Nic neodpovídá. Zkus zrušit filtr sezóny, vybrat všechny kategorie nebo hledat kratší
          slovo.
        </p>
      ) : (
        <ul className="flex flex-col gap-2" data-testid="seznam-surovin">
          {visible.map((item) => (
            <IngredientRow
              key={item.id}
              ingredient={item}
              tasted={tasted.has(item.id)}
              favorite={favorites.has(item.id)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function IngredientRow({
  ingredient,
  tasted,
  favorite,
}: {
  ingredient: Ingredient;
  tasted: boolean;
  favorite: boolean;
}): ReactNode {
  return (
    <li className="flex items-stretch gap-2 rounded-xl bg-surface p-2">
      <Link
        to={`/suroviny/${ingredient.id}`}
        data-testid={`surovina-${ingredient.id}`}
        className="flex min-h-touch min-w-0 flex-1 flex-col gap-1 rounded-lg p-2"
      >
        <span className="flex items-center gap-2 font-medium">
          <span aria-hidden="true" className="shrink-0 text-lg">
            {ingredient.emoji ?? '🍽️'}
          </span>
          <span className="min-w-0">{ingredient.nameCz}</span>
          {favorite && <Star aria-label="Oblíbené" className="h-4 w-4 shrink-0 text-caution" />}
        </span>
        <span className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-lg bg-paper px-2 py-0.5 text-[11px] font-medium text-muted">
            od {ingredient.minAgeMonths} měsíců
          </span>
          <ChokingBadge risk={ingredient.chokingRisk} />
        </span>
      </Link>
      <TastedToggle
        ingredientId={ingredient.id}
        ingredientName={ingredient.nameCz}
        tasted={tasted}
      />
    </li>
  );
}
