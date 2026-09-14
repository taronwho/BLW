import {
  Clock,
  Leaf,
  RotateCcw,
  Search,
  ShoppingBasket,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ingredientById, ingredients, recipes } from '@/data';
import { recipeNutrients } from '@/data/nutrients';
import { useHouseholdStore } from '@/storage/householdStore';
import { RECIPE_CATEGORIES } from '@/types';
import type { AllergenGroup, Recipe } from '@/types';
import { ChokingChip } from '../components/SafetyChips';
import { RozbalovaciFiltry } from '../components/RozbalovaciFiltry';
import { KonecSeznamu } from '../components/KonecSeznamu';
import { FavoriteToggle } from '../components/FavoriteToggle';
import { FilterChips } from '../components/FilterChips';
import type { ChipOption } from '../components/FilterChips';
import { FilterSelect } from '../components/FilterSelect';
import { FilterToggles } from '../components/FilterToggles';
import { ChipButton, FilterGroup, Upresneni } from '../components/FilterGroup';
import {
  DRUH_ZELEZA_OPTIONS,
  UROVEN_OPTIONS,
  vyhovujeZivinam,
  ZIVINY_OPTIONS,
} from '../lib/nutrientFilter';
import { NutrientBadge } from '../components/NutrientBadge';
import type { SelectOption } from '../components/FilterSelect';
import { ageInMonths } from '../lib/age';
import { usePostupneZobrazeni } from '../lib/postupneZobrazeni';
import {
  recipeAllergens,
  recipeChokingRisk,
  recipeIsVegetarian,
} from '../lib/derive';
import { RECIPE_CATEGORY_LABELS } from '../lib/labels';
import { ALLERGEN_FILTER_OPTIONS } from '../lib/allergenOptions';
import { matchesIngredient, matchesRecipe } from '../lib/search';
import { RECIPE_SORTS, sortRecipes } from '../lib/sorting';
import type { SortKey } from '../lib/sorting';

const CATEGORY_OPTIONS: readonly SelectOption[] = [
  { id: 'vse', label: 'Všechny' },
  ...RECIPE_CATEGORIES.map((category) => ({
    id: category,
    label: RECIPE_CATEGORY_LABELS[category],
  })),
];

const SORT_OPTIONS: readonly SelectOption[] = RECIPE_SORTS.map((one) => ({
  id: one.id,
  label: one.label,
}));

const TIME_OPTIONS: readonly ChipOption[] = [
  { id: 'vse', label: 'jakýkoli' },
  { id: '20', label: 'do 20 minut' },
  { id: '40', label: 'do 40 minut' },
];

/** Seznam receptů s filtry (docs/SPEC.md kap. 4.3). */
export function RecipesScreen(): ReactNode {
  const state = useHouseholdStore((store) => store.state);
  const favorites = useMemo(() => new Set(state.favorites), [state.favorites]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('vse');
  const [time, setTime] = useState('vse');
  const [ziviny, setZiviny] = useState<readonly string[]>([]);
  const [druhZeleza, setDruhZeleza] = useState('vse');
  const [sila, setSila] = useState('aspon');
  const [sort, setSort] = useState<SortKey>('abeceda');
  const [vegetarianOnly, setVegetarianOnly] = useState(false);
  const [oblibene, setOblibene] = useState(false);
  const [withoutAllergen, setWithoutAllergen] = useState<AllergenGroup | ''>(
    '',
  );
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
  // Počet zapnutých filtrů na tlačítku; kategorie a řazení se nepočítají,
  // ty jsou vidět pořád.
  const podrobnychFiltru =
    (time === 'vse' ? 0 : 1) +
    ziviny.length +
    (dvojiceAktivni ? 1 : 0) +
    (druhZeleza === 'vse' ? 0 : 1) +
    (sila === 'aspon' ? 0 : 1) +
    (oblibene ? 1 : 0) +
    (vegetarianOnly ? 1 : 0) +
    (pantrySet.size > 0 ? 1 : 0) +
    (withoutAllergen === '' ? 0 : 1);

  const filtrujeSe =
    query !== '' ||
    category !== 'vse' ||
    time !== 'vse' ||
    ziviny.length > 0 ||
    vegetarianOnly ||
    oblibene ||
    withoutAllergen !== '' ||
    pantry.length > 0;

  function prepniZivinu(id: string): void {
    setZiviny((current) =>
      current.includes(id)
        ? current.filter((one) => one !== id)
        : [...current, id],
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
    setOblibene(false);
    setWithoutAllergen('');
    setPantry([]);
  }

  const visible = useMemo(
    () =>
      recipes.filter((recipe) => {
        const names = recipe.ingredients.map(
          (ref) => ingredientById.get(ref.ingredientId)?.nameCz ?? '',
        );
        if (!matchesRecipe(recipe, query, names)) return false;
        if (category !== 'vse' && recipe.category !== category) return false;
        if (time !== 'vse' && recipe.timeMinutes > Number(time)) return false;
        if (vegetarianOnly && !recipeIsVegetarian(recipe)) return false;
        if (oblibene && !favorites.has(recipe.id)) return false;
        if (!vyhovujeZivinam(recipeNutrients(recipe), ziviny, druhZeleza, sila))
          return false;
        if (
          withoutAllergen !== '' &&
          recipeAllergens(recipe).includes(withoutAllergen)
        )
          return false;
        if (
          pantrySet.size > 0 &&
          !recipe.ingredients.some((ref) => pantrySet.has(ref.ingredientId))
        ) {
          return false;
        }
        return true;
      }),
    [
      query,
      category,
      time,
      ziviny,
      druhZeleza,
      sila,
      vegetarianOnly,
      oblibene,
      favorites,
      withoutAllergen,
      pantrySet,
    ],
  );

  const serazene = useMemo(() => sortRecipes(visible, sort), [visible, sort]);
  const { zobrazene, zbyva, nacistDalsi, konecSeznamu } =
    usePostupneZobrazeni(serazene);

  const pantryChoices = useMemo(
    () =>
      ingredients
        .filter((item) => matchesIngredient(item, pantryQuery))
        .slice(0, 40),
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

      <RozbalovaciFiltry
        testId="filtry-receptu"
        aktivnich={podrobnychFiltru}
        zakladni={
          <>
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
          </>
        }
        podrobne={
          <>
            <FilterGroup nadpis="Čas přípravy">
              <FilterChips
                compact
                options={TIME_OPTIONS}
                selected={time}
                onSelect={setTime}
                ariaLabel="Filtr času přípravy"
                testId="filtr-casu"
              />
            </FilterGroup>

            <FilterGroup
              nadpis="Musí obsahovat"
              popis="Vybrané živiny se sčítají — recept musí mít všechny."
            >
              <FilterToggles
                options={ZIVINY_OPTIONS}
                selected={ziviny}
                onToggle={prepniZivinu}
                ariaLabel="Filtr živin v receptu"
                testId="filtr-zivin"
              />
              <span className="self-start">
                <ChipButton
                  zvyraznene
                  label="rostlinné železo + vitamin C"
                  Icon={Sparkles}
                  pressed={dvojiceAktivni}
                  onClick={prepniDvojici}
                  testId="filtr-dvojice"
                />
              </span>
              {zeleznyFiltr && (
                <Upresneni nadpis="Druh železa">
                  <FilterChips
                    compact
                    options={DRUH_ZELEZA_OPTIONS}
                    selected={druhZeleza}
                    onSelect={setDruhZeleza}
                    ariaLabel="Filtr druhu železa"
                    testId="filtr-druhu-zeleza"
                  />
                </Upresneni>
              )}
              {ziviny.length > 0 && (
                <Upresneni nadpis="Jak silný zdroj">
                  <FilterChips
                    compact
                    options={UROVEN_OPTIONS}
                    selected={sila}
                    onSelect={setSila}
                    ariaLabel="Filtr síly zdroje živiny"
                    testId="filtr-sily"
                  />
                </Upresneni>
              )}
            </FilterGroup>

            <FilterGroup nadpis="Další">
              <div className="flex flex-wrap gap-x-2">
                <ChipButton
                  label="oblíbené"
                  Icon={Star}
                  pressed={oblibene}
                  onClick={() => setOblibene((value) => !value)}
                  testId="filtr-oblibene"
                />
                <ChipButton
                  label="jen vegetariánské"
                  Icon={Leaf}
                  pressed={vegetarianOnly}
                  onClick={() => setVegetarianOnly((value) => !value)}
                  testId="filtr-vegetarianske"
                />
                <ChipButton
                  label={`mám doma${pantrySet.size > 0 ? ` (${pantrySet.size})` : ''}`}
                  Icon={ShoppingBasket}
                  pressed={pantrySet.size > 0}
                  onClick={() => setPantryOpen((open) => !open)}
                  testId="filtr-mam-doma"
                />
              </div>
              <FilterSelect
                label="Bez alergenu"
                options={ALLERGEN_FILTER_OPTIONS}
                selected={withoutAllergen === '' ? 'vse' : withoutAllergen}
                onSelect={(id) =>
                  setWithoutAllergen(id === 'vse' ? '' : (id as AllergenGroup))
                }
                testId="filtr-bez-alergenu"
              />
            </FilterGroup>

            {filtrujeSe && (
              <span className="self-start">
                <ChipButton
                  tlumene
                  label="zrušit filtry"
                  Icon={RotateCcw}
                  pressed={false}
                  onClick={zrusFiltry}
                  testId="zrusit-filtry"
                />
              </span>
            )}
          </>
        }
      />

      {pantryOpen && (
        <div
          className="flex flex-col gap-2 rounded-xl bg-surface p-3"
          data-testid="panel-mam-doma"
        >
          <label className="flex min-h-touch items-center gap-2 rounded-xl border border-muted/30 px-3">
            <Search
              aria-hidden="true"
              className="h-5 w-5 shrink-0 text-muted"
            />
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
                    onClick={() =>
                      setPantry((current) =>
                        current.filter((item) => item !== id),
                      )
                    }
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
                    pantrySet.has(item.id)
                      ? 'bg-accent/10 font-semibold text-accent'
                      : ''
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
        <p
          className="rounded-xl bg-surface p-4 text-sm text-muted"
          data-testid="prazdny-stav-recepty"
        >
          Nic neodpovídá. Nejspíš je podmínek najednou moc — zkus ubrat některou
          živinu, povolit delší čas nebo klepnout na „zrušit filtry“.
        </p>
      ) : (
        <ul className="flex flex-col gap-2" data-testid="seznam-receptu">
          {zobrazene.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              childMonths={months}
              favorite={favorites.has(recipe.id)}
            />
          ))}
        </ul>
      )}
      <KonecSeznamu
        zbyva={zbyva}
        nacistDalsi={nacistDalsi}
        konecSeznamu={konecSeznamu}
        testId="nacist-dalsi-recepty"
      />
    </section>
  );
}

function RecipeCard({
  recipe,
  childMonths,
  favorite,
}: {
  recipe: Recipe;
  childMonths: number | null;
  favorite: boolean;
}): ReactNode {
  const vegetarian = recipeIsVegetarian(recipe);
  const tooEarly = childMonths !== null && childMonths < recipe.minAgeMonths;
  const nutrients = recipeNutrients(recipe);
  return (
    // Tlačítka živin a rizika stojí vedle odkazu, ne v něm: tlačítko uvnitř
    // odkazu je neplatné HTML, čtečka obrazovky z toho hlásí vnořený ovládací
    // prvek a klepnutí doprostřed karty netrefí odkaz, ale tlačítko.
    <li className="flex flex-col gap-1 rounded-xl bg-surface p-2">
      <div className="flex items-stretch gap-2">
        <Link
          to={`/recepty/${recipe.id}`}
          data-testid={`recept-${recipe.id}`}
          className="flex min-h-touch min-w-0 flex-1 flex-col gap-2 rounded-lg p-1"
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
              vhodné od {recipe.minAgeMonths} měsíců
              {tooEarly ? ' — na dítě ještě brzy' : ''}
            </span>
            {vegetarian && (
              <span className="flex items-center gap-1 rounded-lg bg-accent/10 px-2 py-0.5 font-medium text-accent">
                <Leaf aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                bezmasý základ
              </span>
            )}
            {/* Štítek „vegetariánské" nesou všechny bezmasé recepty, takže vedle
              chlebíčku „bezmasý základ" by stál dvakrát totéž. */}
            {recipe.tags
              .filter((tag) => !(vegetarian && tag === 'vegetariánské'))
              .map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-paper px-2 py-0.5 font-medium"
                >
                  {tag}
                </span>
              ))}
          </span>
        </Link>
        <span className="flex shrink-0 items-start">
          <FavoriteToggle
            id={recipe.id}
            name={recipe.titleCz}
            favorite={favorite}
          />
        </span>
      </div>
      <span className="flex flex-wrap items-center gap-x-1.5 px-1">
        <ChokingChip
          risk={recipeChokingRisk(recipe)}
          testId={`duseni-receptu-${recipe.id}`}
        />
        <NutrientBadge
          profile={nutrients}
          title={recipe.titleCz}
          ironFrom={nutrients.ironFrom}
          vitaminCFrom={nutrients.vitaminCFrom}
          testId={`zeleza-${recipe.id}`}
        />
      </span>
    </li>
  );
}
