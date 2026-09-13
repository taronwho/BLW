import { Citrus, Clock, Droplet, Leaf, RotateCcw, Search, ShieldCheck, ShoppingBasket, Sparkles, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ingredientById, ingredients, recipes } from '@/data';
import { recipeNutrients } from '@/data/nutrients';
import type { NutrientLevel } from '@/data/nutrients';
import { useHouseholdStore } from '@/storage/householdStore';
import { KEY_ALLERGENS, RECIPE_CATEGORIES } from '@/types';
import type { AllergenGroup, Recipe } from '@/types';
import { ChokingBadge } from '../components/ChokingBadge';
import { FilterChips } from '../components/FilterChips';
import type { ChipOption } from '../components/FilterChips';
import { FilterSelect } from '../components/FilterSelect';
import { FilterToggles } from '../components/FilterToggles';
import type { ToggleOption } from '../components/FilterToggles';
import { NutrientBadge } from '../components/NutrientBadge';
import type { SelectOption } from '../components/FilterSelect';
import { ageInMonths } from '../lib/age';
import { recipeAllergens, recipeChokingRisk, recipeIsVegetarian } from '../lib/derive';
import { ALLERGEN_LABELS, RECIPE_CATEGORY_LABELS } from '../lib/labels';
import { matchesIngredient, matchesRecipe } from '../lib/search';
import { RECIPE_SORTS, sortRecipes } from '../lib/sorting';
import type { SortKey } from '../lib/sorting';

const CATEGORY_OPTIONS: readonly SelectOption[] = [
  { id: 'vse', label: 'Všechny' },
  ...RECIPE_CATEGORIES.map((category) => ({ id: category, label: RECIPE_CATEGORY_LABELS[category] })),
];

const SORT_OPTIONS: readonly SelectOption[] = RECIPE_SORTS.map((one) => ({
  id: one.id,
  label: one.label,
}));

const ALERGEN_OPTIONS: readonly SelectOption[] = [
  { id: 'vse', label: 'Neomezovat' },
  ...KEY_ALLERGENS.map((allergen) => ({ id: allergen, label: `bez ${ALLERGEN_LABELS[allergen]}` })),
];

const TIME_OPTIONS: readonly ChipOption[] = [
  { id: 'vse', label: 'jakýkoli' },
  { id: '20', label: 'do 20 minut' },
  { id: '40', label: 'do 40 minut' },
];

/**
 * Živiny se zaškrtávají nezávisle a podmínky se sčítají: zaškrtnuté „železo"
 * a „vitamin C" znamená recept, který má obojí. Stupnice je stejná jako
 * u značek v náhledu, takže filtr a výpis mluví jedním jazykem.
 */
type ZivinaKlic = 'zelezo' | 'zinek' | 'cecko';

const ZIVINY_OPTIONS: readonly ToggleOption[] = [
  { id: 'zelezo', label: 'železo', Icon: Droplet },
  { id: 'zinek', label: 'zinek', Icon: ShieldCheck },
  { id: 'cecko', label: 'vitamin C', Icon: Citrus },
];

const DRUH_ZELEZA_OPTIONS: readonly ChipOption[] = [
  { id: 'vse', label: 'jakékoli' },
  { id: 'nehemove', label: 'rostlinné' },
  { id: 'hemove', label: 'z masa a ryb' },
];

const UROVEN_OPTIONS: readonly ChipOption[] = [
  { id: 'aspon', label: 'aspoň nějaké' },
  { id: 'vyznamny', label: 'jen významný zdroj' },
];

/** Živina podle klíče, ať se nemusí větvit na třech místech. */
function uroven(profil: ReturnType<typeof recipeNutrients>, klic: ZivinaKlic): NutrientLevel {
  if (klic === 'zelezo') return profil.iron;
  if (klic === 'zinek') return profil.zinc;
  return profil.vitaminC;
}

/** Jedna pojmenovaná skupina filtrů, ať je vidět, co k čemu patří. */
function Skupina({
  nadpis,
  popis,
  children,
}: {
  nadpis: string;
  popis?: string;
  children: ReactNode;
}): ReactNode {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">{nadpis}</span>
      {popis !== undefined && <span className="text-[11px] leading-snug text-muted">{popis}</span>}
      {children}
    </div>
  );
}

/** Seznam receptů s filtry (docs/SPEC.md kap. 4.3). */
export function RecipesScreen(): ReactNode {
  const state = useHouseholdStore((store) => store.state);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('vse');
  const [time, setTime] = useState('vse');
  const [ziviny, setZiviny] = useState<readonly string[]>([]);
  const [druhZeleza, setDruhZeleza] = useState('vse');
  const [sila, setSila] = useState('aspon');
  const [sort, setSort] = useState<SortKey>('abeceda');
  const [vegetarianOnly, setVegetarianOnly] = useState(false);
  const [withoutAllergen, setWithoutAllergen] = useState<AllergenGroup | ''>('');
  const [pantryOpen, setPantryOpen] = useState(false);
  const [pantry, setPantry] = useState<string[]>([]);
  const [pantryQuery, setPantryQuery] = useState('');

  const months = ageInMonths(state.childBirthDate);
  const pantrySet = useMemo(() => new Set(pantry), [pantry]);

  const zeleznyFiltr = ziviny.includes('zelezo');
  // Dvojice, ve které se rostlinné železo vstřebá nejlíp. Jedním klepnutím,
  // protože poskládat ji ze tří voleb by nikoho nenapadlo.
  const dvojiceAktivni =
    ziviny.length === 2 &&
    ziviny.includes('zelezo') &&
    ziviny.includes('cecko') &&
    druhZeleza === 'nehemove';
  const filtrujeSe =
    query !== '' ||
    category !== 'vse' ||
    time !== 'vse' ||
    ziviny.length > 0 ||
    vegetarianOnly ||
    withoutAllergen !== '' ||
    pantry.length > 0;

  function prepniZivinu(id: string): void {
    setZiviny((current) =>
      current.includes(id) ? current.filter((one) => one !== id) : [...current, id],
    );
    // Druh železa dává smysl jen se zaškrtnutým železem; jinak by zůstal
    // viset nastavený a tiše filtroval.
    if (id === 'zelezo' && ziviny.includes('zelezo')) setDruhZeleza('vse');
  }

  function prepniDvojici(): void {
    if (dvojiceAktivni) {
      setZiviny([]);
      setDruhZeleza('vse');
      return;
    }
    setZiviny(['zelezo', 'cecko']);
    setDruhZeleza('nehemove');
  }

  function zrusFiltry(): void {
    setQuery('');
    setCategory('vse');
    setTime('vse');
    setZiviny([]);
    setDruhZeleza('vse');
    setSila('aspon');
    setVegetarianOnly(false);
    setWithoutAllergen('');
    setPantry([]);
  }

  const visible = useMemo(
    () =>
      recipes.filter((recipe) => {
        const names = recipe.ingredients.map((ref) => ingredientById.get(ref.ingredientId)?.nameCz ?? '');
        if (!matchesRecipe(recipe, query, names)) return false;
        if (category !== 'vse' && recipe.category !== category) return false;
        if (time !== 'vse' && recipe.timeMinutes > Number(time)) return false;
        if (vegetarianOnly && !recipeIsVegetarian(recipe)) return false;
        if (ziviny.length > 0) {
          const profile = recipeNutrients(recipe);
          for (const klic of ziviny) {
            const level = uroven(profile, klic as ZivinaKlic);
            if (level === 'nevyznamny') return false;
            if (sila === 'vyznamny' && level !== 'vyznamny') return false;
          }
          if (ziviny.includes('zelezo') && druhZeleza !== 'vse' && profile.ironForm !== druhZeleza) {
            return false;
          }
        }
        if (withoutAllergen !== '' && recipeAllergens(recipe).includes(withoutAllergen)) return false;
        if (pantrySet.size > 0 && !recipe.ingredients.some((ref) => pantrySet.has(ref.ingredientId))) {
          return false;
        }
        return true;
      }),
    [query, category, time, ziviny, druhZeleza, sila, vegetarianOnly, withoutAllergen, pantrySet],
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

      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface/50 p-3" data-testid="filtry-receptu">
        <div className="grid grid-cols-2 gap-2">
          <FilterSelect
            compact
            label="Kategorie"
            options={CATEGORY_OPTIONS}
            selected={category}
            onSelect={setCategory}
            testId="filtr-kategorii-receptu"
          />
          <FilterSelect
            compact
            neutralId="abeceda"
        label="Řazení"
            options={SORT_OPTIONS}
            selected={sort}
            onSelect={(id) => setSort(id as SortKey)}
            testId="razeni-receptu"
          />
        </div>

        <Skupina nadpis="Čas přípravy">
          <FilterChips
            compact
            options={TIME_OPTIONS}
            selected={time}
            onSelect={setTime}
            ariaLabel="Filtr času přípravy"
            testId="filtr-casu"
          />
        </Skupina>

        <Skupina nadpis="Musí obsahovat" popis="Vybrané živiny se sčítají — recept musí mít všechny.">
          <FilterToggles
            options={ZIVINY_OPTIONS}
            selected={ziviny}
            onToggle={prepniZivinu}
            ariaLabel="Filtr živin v receptu"
            testId="filtr-zivin"
          />
          <button
            type="button"
            aria-pressed={dvojiceAktivni}
            data-testid="filtr-dvojice"
            onClick={prepniDvojici}
            className="flex min-h-touch items-center self-start"
          >
            <span
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
                dvojiceAktivni
                  ? 'border-accent bg-accent text-on-accent shadow-soft'
                  : 'border-accent/40 bg-accent-soft text-accent'
              }`}
            >
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
              rostlinné železo + vitamin C
            </span>
          </button>
          {zeleznyFiltr && (
            <div className="flex flex-col gap-1 border-l-2 border-line pl-3">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Druh železa
              </span>
              <FilterChips
                compact
                options={DRUH_ZELEZA_OPTIONS}
                selected={druhZeleza}
                onSelect={setDruhZeleza}
                ariaLabel="Filtr druhu železa"
                testId="filtr-druhu-zeleza"
              />
            </div>
          )}
          {ziviny.length > 0 && (
            <div className="flex flex-col gap-1 border-l-2 border-line pl-3">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Jak silný zdroj
              </span>
              <FilterChips
                compact
                options={UROVEN_OPTIONS}
                selected={sila}
                onSelect={setSila}
                ariaLabel="Filtr síly zdroje živiny"
                testId="filtr-sily"
              />
            </div>
          )}
        </Skupina>

        <Skupina nadpis="Další">
          <div className="flex flex-wrap gap-x-2">
            <button
              type="button"
              aria-pressed={vegetarianOnly}
              data-testid="filtr-vegetarianske"
              onClick={() => setVegetarianOnly((value) => !value)}
              className="flex min-h-touch items-center"
            >
              <span
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
                  vegetarianOnly
                    ? 'border-accent bg-accent text-on-accent shadow-soft'
                    : 'border-line bg-surface text-ink'
                }`}
              >
                <Leaf aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                jen vegetariánské
              </span>
            </button>
            <button
              type="button"
              aria-expanded={pantryOpen}
              data-testid="filtr-mam-doma"
              onClick={() => setPantryOpen((open) => !open)}
              className="flex min-h-touch items-center"
            >
              <span
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
                  pantrySet.size > 0
                    ? 'border-accent bg-accent text-on-accent shadow-soft'
                    : 'border-line bg-surface text-ink'
                }`}
              >
                <ShoppingBasket aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                mám doma{pantrySet.size > 0 ? ` (${pantrySet.size})` : ''}
              </span>
            </button>
          </div>
          <FilterSelect
            label="Bez alergenu"
            options={ALERGEN_OPTIONS}
            selected={withoutAllergen === '' ? 'vse' : withoutAllergen}
            onSelect={(id) => setWithoutAllergen(id === 'vse' ? '' : (id as AllergenGroup))}
            testId="filtr-bez-alergenu"
          />
        </Skupina>

        {filtrujeSe && (
          <button
            type="button"
            data-testid="zrusit-filtry"
            onClick={zrusFiltry}
            className="flex min-h-touch items-center self-start"
          >
            <span className="flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1 text-xs font-medium text-muted">
              <RotateCcw aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
              zrušit filtry
            </span>
          </button>
        )}
      </div>

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
          Nic neodpovídá. Nejspíš je podmínek najednou moc — zkus ubrat některou živinu, povolit
          delší čas nebo klepnout na „zrušit filtry“.
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
