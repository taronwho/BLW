import { CalendarDays, Baby, RotateCcw, Search, ShieldAlert, Star } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ingredients } from '@/data';
import { nutrientProfile } from '@/data/nutrients';
import { useHouseholdStore } from '@/storage/householdStore';
import { INGREDIENT_CATEGORIES } from '@/types';
import type { Ingredient } from '@/types';
import { ageInMonths } from '../lib/age';
import { ChokingBadge } from '../components/ChokingBadge';
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
import { TastedToggle } from '../components/TastedToggle';
import { inSeason, suitableNow, tastedIds } from '../lib/derive';
import { CATEGORY_LABELS } from '../lib/labels';
import { matchesIngredient } from '../lib/search';
import { INGREDIENT_SORTS, sortIngredients } from '../lib/sorting';
import type { SortKey } from '../lib/sorting';
import { IngredientIcon } from '../components/IngredientIcon';

/**
 * Deník má tři stavy, které se navzájem vylučují — ochutnané a neochutnané
 * najednou nedávají smysl, proto jsou tu jako přepínač, ne jako zaškrtávátka.
 */
const DENIK_OPTIONS: readonly ChipOption[] = [
  { id: 'vse', label: 'nezáleží' },
  { id: 'neochutnano', label: 'ještě neochutnané' },
  { id: 'ochutnano', label: 'už ochutnané' },
];

const SORT_OPTIONS: readonly SelectOption[] = INGREDIENT_SORTS.map((one) => ({
  id: one.id,
  label: one.label,
}));

const CATEGORY_OPTIONS: readonly SelectOption[] = [
  { id: 'vse', label: 'Všechny' },
  ...INGREDIENT_CATEGORIES.map((category) => ({ id: category, label: CATEGORY_LABELS[category] })),
];

/** Seznam surovin (docs/SPEC.md kap. 4.1). */
export function IngredientsScreen(): ReactNode {
  const state = useHouseholdStore((store) => store.state);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('vse');
  const [ziviny, setZiviny] = useState<readonly string[]>([]);
  const [druhZeleza, setDruhZeleza] = useState('vse');
  const [sila, setSila] = useState('aspon');
  const [denik, setDenik] = useState('vse');
  const [oblibene, setOblibene] = useState(false);
  const [vhodneTed, setVhodneTed] = useState(false);
  const [sezonni, setSezonni] = useState(false);
  const [alergeny, setAlergeny] = useState(false);
  const [sort, setSort] = useState<SortKey>('abeceda');

  const tasted = useMemo(() => tastedIds(state), [state]);
  const favorites = useMemo(() => new Set(state.favorites), [state.favorites]);
  const months = ageInMonths(state.childBirthDate);
  const month = new Date().getMonth() + 1;

  const visible = useMemo(
    () =>
      ingredients.filter((item) => {
        if (!matchesIngredient(item, query)) return false;
        if (category !== 'vse' && item.category !== category) return false;
        // Podmínky se sčítají, takže jde hledat i „sezónní zelenina, kterou
        // jsme ještě neochutnali". Dřív se volby vylučovaly a tohle nešlo.
        if (denik === 'neochutnano' && tasted.has(item.id)) return false;
        if (denik === 'ochutnano' && !tasted.has(item.id)) return false;
        if (oblibene && !favorites.has(item.id)) return false;
        if (vhodneTed && !suitableNow(item, months)) return false;
        if (sezonni && !(item.seasonCz.length > 0 && inSeason(item, month))) return false;
        if (alergeny && !item.isKeyAllergen) return false;
        if (!vyhovujeZivinam(nutrientProfile(item), ziviny, druhZeleza, sila)) return false;
        return true;
      }),
    [
      query,
      category,
      denik,
      oblibene,
      vhodneTed,
      sezonni,
      alergeny,
      ziviny,
      druhZeleza,
      sila,
      tasted,
      favorites,
      months,
      month,
    ],
  );

  const serazene = useMemo(() => sortIngredients(visible, sort), [visible, sort]);

  const zeleznyFiltr = ziviny.includes('zelezo');
  const filtrujeSe =
    query !== '' ||
    category !== 'vse' ||
    denik !== 'vse' ||
    oblibene ||
    vhodneTed ||
    sezonni ||
    alergeny ||
    ziviny.length > 0;

  function prepniZivinu(id: string): void {
    setZiviny((current) =>
      current.includes(id) ? current.filter((one) => one !== id) : [...current, id],
    );
    // Druh železa dává smysl jen se zaškrtnutým železem; jinak by zůstal
    // viset nastavený a tiše filtroval.
    if (id === 'zelezo' && ziviny.includes('zelezo')) setDruhZeleza('vse');
  }

  function zrusFiltry(): void {
    setQuery('');
    setCategory('vse');
    setZiviny([]);
    setDruhZeleza('vse');
    setSila('aspon');
    setDenik('vse');
    setOblibene(false);
    setVhodneTed(false);
    setSezonni(false);
    setAlergeny(false);
  }

  return (
    <section className="flex flex-col gap-4" aria-labelledby="suroviny-nadpis">
      <h1 id="suroviny-nadpis" className="text-xl font-bold">
        Suroviny
      </h1>

      <label className="flex min-h-touch items-center gap-2 rounded-2xl border border-line bg-surface px-3 shadow-soft">
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

      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface/50 p-3" data-testid="filtry-surovin">
        <div className="grid grid-cols-2 gap-2">
          <FilterSelect
            compact
            label="Kategorie"
            options={CATEGORY_OPTIONS}
            selected={category}
            onSelect={setCategory}
            testId="filtr-kategorii"
          />
          <FilterSelect
            compact
            neutralId="abeceda"
            label="Řazení"
            options={SORT_OPTIONS}
            selected={sort}
            onSelect={(id) => setSort(id as SortKey)}
            testId="razeni-surovin"
          />
        </div>

        <FilterGroup nadpis="Musí obsahovat" popis="Vybrané živiny se sčítají — surovina musí mít všechny.">
          <FilterToggles
            options={ZIVINY_OPTIONS}
            selected={ziviny}
            onToggle={prepniZivinu}
            ariaLabel="Filtr živin v surovině"
            testId="filtr-zivin"
          />
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

        <FilterGroup nadpis="V deníku">
          <FilterChips
            compact
            options={DENIK_OPTIONS}
            selected={denik}
            onSelect={setDenik}
            ariaLabel="Filtr podle deníku ochutnávek"
            testId="filtr-deniku"
          />
          <ChipButton
            label="oblíbené"
            Icon={Star}
            pressed={oblibene}
            onClick={() => setOblibene((value) => !value)}
            testId="filtr-oblibene"
          />
        </FilterGroup>

        <FilterGroup nadpis="Další">
          <div className="flex flex-wrap gap-x-2">
            <ChipButton
              label="vhodné teď"
              Icon={Baby}
              pressed={vhodneTed}
              onClick={() => setVhodneTed((value) => !value)}
              testId="filtr-vhodne"
            />
            <ChipButton
              label="sezónní"
              Icon={CalendarDays}
              pressed={sezonni}
              onClick={() => setSezonni((value) => !value)}
              testId="filtr-sezonni"
            />
            <ChipButton
              label="klíčové alergeny"
              Icon={ShieldAlert}
              pressed={alergeny}
              onClick={() => setAlergeny((value) => !value)}
              testId="filtr-alergeny"
            />
          </div>
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
      </div>

      <p className="text-xs text-muted" data-testid="pocet-surovin">
        {visible.length} z {ingredients.length} surovin
      </p>

      {visible.length === 0 ? (
        <p className="rounded-xl bg-surface p-4 text-sm text-muted" data-testid="prazdny-stav">
          Nic neodpovídá. Nejspíš je podmínek najednou moc — zkus ubrat některou živinu, povolit
          všechny kategorie nebo klepnout na „zrušit filtry“.
        </p>
      ) : (
        <ul className="flex flex-col gap-2" data-testid="seznam-surovin">
          {serazene.map((item) => (
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
  const profile = nutrientProfile(ingredient);
  // Tři štítky se vedle jména nevejdou ani na 320 px, proto mají vlastní
  // řádku pod ním. Když položka není zdrojem žádné ze tří živin, řádka se
  // nevykreslí — prázdná mezera by jen rozhodila seznam.
  const maZiviny =
    profile.iron !== 'nevyznamny' ||
    profile.zinc !== 'nevyznamny' ||
    profile.vitaminC !== 'nevyznamny';

  return (
    <li className="flex flex-col rounded-xl bg-surface p-2">
      <div className="flex items-stretch gap-2">
        <Link
          to={`/suroviny/${ingredient.id}`}
          data-testid={`surovina-${ingredient.id}`}
          className="flex min-h-touch min-w-0 flex-1 flex-col gap-1 rounded-lg p-2"
        >
          <span className="flex items-center gap-2 font-medium">
            <span aria-hidden="true" className="shrink-0 text-lg">
              <IngredientIcon ingredient={ingredient} className="h-7 w-7" />
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
      </div>
      {maZiviny && (
        <span
          className="flex flex-wrap items-center gap-1.5 px-2"
          data-testid={`ziviny-${ingredient.id}`}
        >
          <NutrientBadge
            profile={profile}
            title={ingredient.nameCz}
            testId={`zeleza-${ingredient.id}`}
          />
        </span>
      )}
    </li>
  );
}
