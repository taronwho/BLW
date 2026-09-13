import { Clock, Leaf, Search, ShoppingBasket, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ingredientById, ingredients, recipes } from '@/data';
import { recipeNutrients } from '@/data/nutrients';
import { useHouseholdStore } from '@/storage/householdStore';
import { KEY_ALLERGENS, RECIPE_CATEGORIES } from '@/types';
import type { AllergenGroup, Recipe } from '@/types';
import { ChokingBadge } from '../components/ChokingBadge';
import { FilterChips } from '../components/FilterChips';
import type { ChipOption } from '../components/FilterChips';
import { FilterSelect } from '../components/FilterSelect';
import { NutrientBadge } from '../components/NutrientBadge';
import type { SelectOption } from '../components/FilterSelect';
import { ageInMonths } from '../lib/age';
import { recipeAllergens, recipeChokingRisk, recipeIsVegetarian } from '../lib/derive';
import { ALLERGEN_LABELS, RECIPE_CATEGORY_LABELS } from '../lib/labels';
import { matchesIngredient, matchesRecipe } from '../lib/search';
import { RECIPE_SORTS, sortRecipes } from '../lib/sorting';
import type { SortKey } from '../lib/sorting';

const CATEGORY_OPTIONS: readonly SelectOption[] = [
  { id: 'vse', label: 'Všechny kategorie' },
  ...RECIPE_CATEGORIES.map((category) => ({ id: category, label: RECIPE_CATEGORY_LABELS[category] })),
];

const SORT_OPTIONS: readonly SelectOption[] = RECIPE_SORTS.map((one) => ({
  id: one.id,
  label: one.label,
}));

/** Filtr obsahu železa — stejná stupnice jako značka v náhledu. */
const IRON_OPTIONS: readonly ChipOption[] = [
  { id: 'vse', label: 'Železo: vše' },
  { id: 'aspon', label: 'Aspoň nějaké' },
  { id: 'vyznamny', label: 'Významný zdroj' },
  { id: 'hemove', label: 'Hemové z masa' },
];

const TIME_OPTIONS: readonly ChipOption[] = [
  { id: 'vse', label: 'Jakýkoli čas' },
  { id: '20', label: 'Do 20 minut' },
  { id: '40', label: 'Do 40 minut' },
];

/** Seznam receptů s filtry (docs/SPEC.md kap. 4.3). */
export function RecipesScreen(): ReactNode {
  const state = useHouseholdStore((store) => store.state);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('vse');
  const [time, setTime] = useState('vse');
  const [iron, setIron] = useState('vse');
  const [sort, setSort] = useState<SortKey>('abeceda');
  const [vegetarianOnly, setVegetarianOnly] = useState(false);
  const [withoutAllergen, setWithoutAllergen] = useState<AllergenGroup | ''>('');
  const [pantryOpen, setPantryOpen] = useState(false);
  const [pantry, setPantry] = useState<string[]>([]);
  const [pantryQuery, setPantryQuery] = useState('');

  const months = ageInMonths(state.childBirthDate);
  const pantrySet = useMemo(() => new Set(pantry), [pantry]);

  const visible = useMemo(
    () =>
      recipes.filter((recipe) => {
        const names = recipe.ingredients.map((ref) => ingredientById.get(ref.ingredientId)?.nameCz ?? '');
        if (!matchesRecipe(recipe, query, names)) return false;
        if (category !== 'vse' && recipe.category !== category) return false;
        if (time !== 'vse' && recipe.timeMinutes > Number(time)) return false;
        if (vegetarianOnly && !recipeIsVegetarian(recipe)) return false;
        if (iron !== 'vse') {
          const profile = recipeNutrients(recipe);
          if (iron === 'aspon' && profile.iron === 'nevyznamny') return false;
          if (iron === 'vyznamny' && profile.iron !== 'vyznamny') return false;
          if (iron === 'hemove' && profile.ironForm !== 'hemove') return false;
        }
        if (withoutAllergen !== '' && recipeAllergens(recipe).includes(withoutAllergen)) return false;
        if (pantrySet.size > 0 && !recipe.ingredients.some((ref) => pantrySet.has(ref.ingredientId))) {
          return false;
        }
        return true;
      }),
    [query, category, time, iron, vegetarianOnly, withoutAllergen, pantrySet],
  );

  const serazene = useMemo(() => sortRecipes(visible, sort), [visible, sort]);

  const pantryChoices = useMemo(
    () => ingredients.filter((item) => matchesIngredient(item, pantryQuery)).slice(0, 40),
    [pantryQuery],
  );

  return (
    <section className="flex flex-col gap-4" aria-labelledby="recepty-nadpis">
      <h1 id="recepty-nadpis" className="text-xl font-bold">
        Recepty
      </h1>

      <label className="flex min-h-touch items-center gap-2 rounded-2xl border border-line bg-surface px-3 shadow-soft">
        <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-muted" />
        <span className="sr-only">Hledat recept</span>
        <input
          type="search"
          value={query}
          data-testid="hledat-recept"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Hledej i bez diakritiky: rizoto, cocka…"
          className="min-h-touch w-full min-w-0 bg-transparent text-base outline-none"
        />
      </label>

      <FilterSelect
        label="Kategorie"
        options={CATEGORY_OPTIONS}
        selected={category}
        onSelect={setCategory}
        testId="filtr-kategorii-receptu"
      />
      <FilterChips
        options={TIME_OPTIONS}
        selected={time}
        onSelect={setTime}
        ariaLabel="Filtr času přípravy"
        testId="filtr-casu"
      />
      <FilterChips
        options={IRON_OPTIONS}
        selected={iron}
        onSelect={setIron}
        ariaLabel="Filtr obsahu železa"
        testId="filtr-zeleza"
      />
      <FilterSelect
        label="Řazení"
        options={SORT_OPTIONS}
        selected={sort}
        onSelect={(id) => setSort(id as SortKey)}
        testId="razeni-receptu"
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={vegetarianOnly}
          data-testid="filtr-vegetarianske"
          onClick={() => setVegetarianOnly((value) => !value)}
          className={`flex min-h-touch items-center gap-2 rounded-xl border px-4 text-sm font-medium ${
            vegetarianOnly ? 'border-accent bg-accent text-on-accent' : 'border-muted/30 bg-surface'
          }`}
        >
          <Leaf aria-hidden="true" className="h-4 w-4 shrink-0" />
          Jen vegetariánské
        </button>
        <button
          type="button"
          aria-expanded={pantryOpen}
          data-testid="filtr-mam-doma"
          onClick={() => setPantryOpen((open) => !open)}
          className={`flex min-h-touch items-center gap-2 rounded-xl border px-4 text-sm font-medium ${
            pantrySet.size > 0 ? 'border-accent bg-accent text-on-accent' : 'border-muted/30 bg-surface'
          }`}
        >
          <ShoppingBasket aria-hidden="true" className="h-4 w-4 shrink-0" />
          Mám doma{pantrySet.size > 0 ? ` (${pantrySet.size})` : ''}
        </button>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-xs uppercase tracking-wide text-muted">Bez alergenu</span>
        <select
          value={withoutAllergen}
          data-testid="filtr-bez-alergenu"
          onChange={(event) => setWithoutAllergen(event.target.value as AllergenGroup | '')}
          className="min-h-touch rounded-xl border border-muted/30 bg-surface px-3 text-sm"
        >
          <option value="">Neomezovat</option>
          {KEY_ALLERGENS.map((allergen) => (
            <option key={allergen} value={allergen}>
              bez {ALLERGEN_LABELS[allergen]}
            </option>
          ))}
        </select>
      </label>

      {pantryOpen && (
        <div className="flex flex-col gap-2 rounded-xl bg-surface p-3" data-testid="panel-mam-doma">
          <label className="flex min-h-touch items-center gap-2 rounded-xl border border-muted/30 px-3">
            <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-muted" />
            <span className="sr-only">Hledat surovinu, kterou máš doma</span>
            <input
              type="search"
              value={pantryQuery}
              onChange={(event) => setPantryQuery(event.target.value)}
              placeholder="mrkev, cocka…"
              className="min-h-touch w-full min-w-0 bg-transparent text-sm outline-none"
            />
          </label>
          {pantry.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {pantry.map((id) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => setPantry((current) => current.filter((item) => item !== id))}
                    className="flex min-h-touch items-center gap-1 rounded-full border border-accent bg-accent/10 px-3 text-sm font-medium text-accent"
                  >
                    {ingredientById.get(id)?.nameCz ?? id}
                    <X aria-hidden="true" className="h-4 w-4 shrink-0" />
                    <span className="sr-only">odebrat</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <ul className="flex max-h-64 flex-col gap-1 overflow-y-auto">
            {pantryChoices.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  aria-pressed={pantrySet.has(item.id)}
                  onClick={() =>
                    setPantry((current) =>
                      current.includes(item.id)
                        ? current.filter((entry) => entry !== item.id)
                        : [...current, item.id],
                    )
                  }
                  className={`flex min-h-touch w-full items-center rounded-lg px-3 text-left text-sm ${
                    pantrySet.has(item.id) ? 'bg-accent/10 font-semibold text-accent' : ''
                  }`}
                >
                  {item.nameCz}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-muted" data-testid="pocet-receptu">
        {visible.length} z {recipes.length} receptů
      </p>

      {visible.length === 0 ? (
        <p className="rounded-xl bg-surface p-4 text-sm text-muted" data-testid="prazdny-stav-recepty">
          Nic neodpovídá. Zkus zrušit filtr času, vyprázdnit „Mám doma“ nebo povolit všechny
          kategorie.
        </p>
      ) : (
        <ul className="flex flex-col gap-2" data-testid="seznam-receptu">
          {serazene.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} childMonths={months} />
          ))}
        </ul>
      )}
    </section>
  );
}

function RecipeCard({ recipe, childMonths }: { recipe: Recipe; childMonths: number | null }): ReactNode {
  const vegetarian = recipeIsVegetarian(recipe);
  const tooEarly = childMonths !== null && childMonths < recipe.minAgeMonths;
  const nutrients = recipeNutrients(recipe);
  return (
    <li>
      <Link
        to={`/recepty/${recipe.id}`}
        data-testid={`recept-${recipe.id}`}
        className="flex min-h-touch flex-col gap-2 rounded-xl bg-surface p-3"
      >
        <span className="font-medium">{recipe.titleCz}</span>
        <span className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
          <span className="flex items-center gap-1 rounded-lg bg-paper px-2 py-0.5 font-medium">
            <Clock aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            {recipe.timeMinutes} min
          </span>
          <span className="rounded-lg bg-paper px-2 py-0.5 font-medium">
            {RECIPE_CATEGORY_LABELS[recipe.category]}
          </span>
          <span className="rounded-lg bg-paper px-2 py-0.5 font-medium">
            vhodné od {recipe.minAgeMonths} měsíců{tooEarly ? ' — na dítě ještě brzy' : ''}
          </span>
          {vegetarian && (
            <span className="flex items-center gap-1 rounded-lg bg-accent/10 px-2 py-0.5 font-medium text-accent">
              <Leaf aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
              bezmasý základ
            </span>
          )}
          {recipe.tags.map((tag) => (
            <span key={tag} className="rounded-lg bg-paper px-2 py-0.5 font-medium">
              {tag}
            </span>
          ))}
        </span>
        <span className="flex flex-wrap items-center gap-2">
          <ChokingBadge risk={recipeChokingRisk(recipe)} />
          <NutrientBadge
            profile={nutrients}
            title={recipe.titleCz}
            ironFrom={nutrients.ironFrom}
            vitaminCFrom={nutrients.vitaminCFrom}
            testId={`zeleza-${recipe.id}`}
          />
        </span>
      </Link>
    </li>
  );
}
