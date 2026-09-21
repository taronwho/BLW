import {
  Baby,
  Clock,
  Dices,
  Leaf,
  RotateCcw,
  Search,
  ShoppingBasket,
  Sparkles,
  Star,
  Timer,
  X,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ingredientById, ingredients, recipes } from '@/data';
import { jeJednoduchaUprava } from '@/data/jednoduche';
import { slozkyDoNakupu } from '@/nakup/seznam';
import { recipeNutrients } from '@/data/recipeNutrients';
import { useHouseholdStore } from '@/storage/householdStore';
import { RECIPE_CATEGORIES } from '@/types';
import type { AllergenGroup, Recipe, RecipeCategory } from '@/types';
import { ChokingChip } from '../components/SafetyChips';
import { RozbalovaciFiltry } from '../components/RozbalovaciFiltry';
import { KonecSeznamu } from '../components/KonecSeznamu';
import { FavoriteToggle } from '../components/FavoriteToggle';
import { NakupTlacitko } from '../components/NakupTlacitko';
import { OdkazNaNakup } from '../components/OdkazNaNakup';
import { vyberNahodny } from '../lib/nahodnyRecept';
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
import { recipeAllergens, recipeChokingRisk, recipeIsVegetarian } from '../lib/deriveRecipes';
import { ALLERGEN_LABELS, RECIPE_CATEGORY_LABELS } from '../lib/labels';
import { ZADNY_ALERGEN } from '../lib/allergenFilter';
import { PrazdnyStav } from '../components/PrazdnyStav';
import type { ZapnutyFiltr } from '../components/PrazdnyStav';
import { ALLERGEN_TOGGLE_OPTIONS } from '../lib/allergenOptions';
import { useFiltrAlergenu } from '../lib/allergenFilter';
import { hledejRecepty } from '../lib/hledaciIndexReceptu';
import { hledejSuroviny } from '../lib/hledaciIndexSurovin';
import { usePozdrzeno } from '../lib/pozdrzeni';
import { useUrlBatch, useUrlFlag, useUrlList, useUrlText } from '../lib/urlState';
import { RECIPE_SORTS } from '../lib/sorting';
import { sortRecipes } from '../lib/sortingRecipes';
import type { SortKey } from '../lib/sorting';
import { favoriteIds } from '../lib/tastings';
import { useNarozeniAktivniho } from '../lib/dite';

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
  const navigate = useNavigate();
  const favorites = useMemo(() => favoriteIds(state), [state]);
  // Filtry drží adresa, ne komponenta — viz src/app/lib/urlState.ts.
  const [query, setQuery] = useUrlText('q', '');
  const [category, setCategory] = useUrlText('kat', 'vse');
  const [time, setTime] = useUrlText('cas', 'vse');
  const [ziviny] = useUrlList('ziv');
  const [druhZeleza, setDruhZeleza] = useUrlText('fe', 'vse');
  const [sila, setSila] = useUrlText('sila', 'aspon');
  const [sort, setSort] = useUrlText<SortKey>('razeni', 'abeceda');
  const [vegetarianOnly, setVegetarianOnly] = useUrlFlag('vege');
  const [oblibene, setOblibene] = useUrlFlag('oblibene');
  const [vhodneTed, setVhodneTed] = useUrlFlag('vhodne');
  const [jednoduche, setJednoduche] = useUrlFlag('jedn');
  const bezAlergenu = useFiltrAlergenu();
  const [pantry, setPantry] = useUrlList('spiz');
  // Rozbalení spíže a její vlastní hledání jsou stav okna, ne filtr — do
  // adresy nepatří a po návratu z receptu nikomu nechybí.
  const [pantryOpen, setPantryOpen] = useState(false);
  const [pantryQuery, setPantryQuery] = useState('');
  // Víc voleb naráz musí do adresy jedním zápisem, jinak se přepíšou.
  const nastavFiltry = useUrlBatch();

  const months = ageInMonths(useNarozeniAktivniho());
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
    (vhodneTed ? 1 : 0) +
    (jednoduche ? 1 : 0) +
    (pantrySet.size > 0 ? 1 : 0) +
    (bezAlergenu.vybrane.length > 0 ? 1 : 0);

  const filtrujeSe =
    query !== '' ||
    category !== 'vse' ||
    time !== 'vse' ||
    ziviny.length > 0 ||
    vegetarianOnly ||
    oblibene ||
    vhodneTed ||
    jednoduche ||
    bezAlergenu.vybrane.length > 0 ||
    pantry.length > 0;

  /**
   * Filtry, které jsou zapnuté — a dají se odsud vypnout po jednom.
   *
   * Prázdný stav nemá radit, má nabízet (docs/SPEC.md kap. 4.1).
   */
  const zapnuteFiltry: ZapnutyFiltr[] = [];
  if (query !== '') zapnuteFiltry.push({ popis: `hledání „${query}"`, zrus: { q: null } });
  if (category !== 'vse') {
    zapnuteFiltry.push({
      popis: `kategorii ${RECIPE_CATEGORY_LABELS[category as RecipeCategory]}`,
      zrus: { kat: null },
    });
  }
  if (time !== 'vse') {
    zapnuteFiltry.push({ popis: `omezení na ${time} minut`, zrus: { cas: null } });
  }
  if (vegetarianOnly) zapnuteFiltry.push({ popis: 'jen vegetariánské', zrus: { vege: null } });
  if (oblibene) zapnuteFiltry.push({ popis: 'jen oblíbené', zrus: { oblibene: null } });
  if (vhodneTed) zapnuteFiltry.push({ popis: 'vhodné teď', zrus: { vhodne: null } });
  if (jednoduche) zapnuteFiltry.push({ popis: 'jen jednoduché', zrus: { jedn: null } });
  if (bezAlergenu.vybrane.length > 0) {
    zapnuteFiltry.push({
      popis: `vynechání alergenů (${bezAlergenu.vybrane
        .map((one) => ALLERGEN_LABELS[one])
        .join(', ')})`,
      // Prázdný filtr se zapisuje značkou, ne smazáním: bez ní by se
      // alergeny dítěte z Domácnosti nasadily automaticky znovu.
      zrus: { bez: ZADNY_ALERGEN },
    });
  }
  if (ziviny.length > 0) {
    zapnuteFiltry.push({ popis: 'filtr živin', zrus: { ziv: null, fe: null, sila: null } });
  }
  if (pantry.length > 0) {
    zapnuteFiltry.push({ popis: 'výběr podle spíže', zrus: { spiz: null } });
  }

  const ZRUSIT_VSE = {
    q: null, kat: null, cas: null, ziv: null, fe: null, sila: null,
    vege: null, oblibene: null, vhodne: null, jedn: null, bez: null, spiz: null,
  };

  function prepniZivinu(id: string): void {
    const dalsi = ziviny.includes(id) ? ziviny.filter((one) => one !== id) : [...ziviny, id];
    // Druh železa dává smysl jen se zaškrtnutým železem; jinak by zůstal
    // viset nastavený a tiše filtroval.
    const odebiramZelezo = id === 'zelezo' && ziviny.includes('zelezo');
    nastavFiltry({ ziv: dalsi, ...(odebiramZelezo ? { fe: null } : {}) });
  }

  function prepniDvojici(): void {
    if (dvojiceAktivni) {
      nastavFiltry({ ziv: null, fe: null });
      return;
    }
    nastavFiltry({ ziv: ['zelezo', 'cecko'], fe: 'nehemove' });
  }

  function zrusFiltry(): void {
    nastavFiltry(ZRUSIT_VSE);
  }

  // Hledá se až chvíli po dopsání a nad předpočítaným indexem. Dřív se
  // pro všech 494 receptů stavělo při každém stisku nové pole názvů složek
  // a synonym — tisíce normalizací na jedno písmeno (audit 17. 9. 2026,
  // nález 6.1).
  const hledane = usePozdrzeno(query);
  const shody = useMemo(() => hledejRecepty(hledane), [hledane]);

  const visible = useMemo(
    () =>
      recipes.filter((recipe) => {
        if (shody !== null && !shody.has(recipe.id)) return false;
        if (category !== 'vse' && recipe.category !== category) return false;
        if (time !== 'vse' && recipe.timeMinutes > Number(time)) return false;
        if (vegetarianOnly && !recipeIsVegetarian(recipe)) return false;
        // Věk se řídí vybraným dítětem v hlavičce. Bez data narození se
        // bere šest měsíců — tedy začátek příkrmu, ne „všechno projde".
        if (vhodneTed && recipe.minAgeMonths > (months ?? 6)) return false;
        if (oblibene && !favorites.has(recipe.id)) return false;
        if (jednoduche && !jeJednoduchaUprava(recipe)) return false;
        if (!vyhovujeZivinam(recipeNutrients(recipe), ziviny, druhZeleza, sila))
          return false;
        // Odvození alergenů ven ze `.some()`: uvnitř se počítalo znovu
        // za každý odškrtnutý alergen.
        if (bezAlergenu.vybrane.length > 0) {
          const alergeny = recipeAllergens(recipe);
          if (bezAlergenu.vybrane.some((skupina) => alergeny.includes(skupina))) return false;
        }
        if (
          pantrySet.size > 0 &&
          !recipe.ingredients.some((ref) => pantrySet.has(ref.ingredientId))
        ) {
          return false;
        }
        return true;
      }),
    [
      shody,
      category,
      time,
      ziviny,
      druhZeleza,
      sila,
      vegetarianOnly,
      oblibene,
      vhodneTed,
      jednoduche,
      months,
      favorites,
      bezAlergenu.vybrane,
      pantrySet,
    ],
  );

  const serazene = useMemo(() => sortRecipes(visible, sort), [visible, sort]);
  const { zobrazene, zbyva, nacistDalsi, konecSeznamu } =
    usePostupneZobrazeni(serazene);

  const pantryHledane = usePozdrzeno(pantryQuery);
  const pantryChoices = useMemo(() => {
    const shody = hledejSuroviny(pantryHledane);
    const vyhovujici = shody === null ? ingredients : ingredients.filter((i) => shody.has(i.id));
    return vyhovujici.slice(0, 40);
  }, [pantryHledane]);

  return (
    <section className="flex flex-col gap-4" aria-labelledby="recepty-nadpis">
      {/* Nadpis a vedle něj cesta do nákupního seznamu. Přidávat do něj
          šlo z téhle obrazovky odjakživa, podívat se na něj ne — rodič
          musel zpátky na úvodní obrazovku. */}
      <div className="flex items-center justify-between gap-2">
        <h1 id="recepty-nadpis" className="text-xl font-bold">
          Recepty
        </h1>
        {/* Obě akce drží vpravo v jedné skupině. Bez obalu je řádka tři
            prvky pod `justify-between` a kostka skončila plavat uprostřed
            mezi nadpisem a košíkem, jako by tam nepatřila. */}
        <span className="flex shrink-0 items-center gap-2">
        {/* Kostka losuje z toho, co je právě vidět, ne z celé kuchařky.
            Když si rodič nafiltroval „do 20 minut, bez mléka", chce náhodu
            uvnitř toho výběru — jinak by mu tlačítko nabídlo přesně to, co
            si před chvílí odfiltroval.

            Popisek je u ní schválně: samotná kostka je hádanka. „Zkus
            štěstí" se vejde i na displej široký 320 px, kdežto „Náhodný
            recept" by nadpis vytlačil. Odečítač obrazovky dostane celou
            větu v aria-label. */}
        <button
          type="button"
          data-testid="recepty-nahoda"
          disabled={serazene.length === 0}
          aria-label={
            filtrujeSe
              ? `Náhodný recept z ${serazene.length} vyfiltrovaných`
              : 'Náhodný recept z celé kuchařky'
          }
          onClick={() => {
            const vylosovany = vyberNahodny(serazene);
            if (vylosovany !== null) void navigate(`/recepty/${vylosovany.id}`);
          }}
          className="flex min-h-touch shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-accent/40 bg-accent-soft px-2.5 text-[13px] font-semibold text-accent disabled:opacity-40"
        >
          <Dices aria-hidden="true" className="h-5 w-5 shrink-0" />
          <span aria-hidden="true">Zkus štěstí</span>
        </button>
        <OdkazNaNakup testId="recepty-na-nakup" />
        </span>
      </div>

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
              popis="Vybrané živiny se sčítají: recept musí mít všechny."
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
                {/* Stejná volba jako v katalogu surovin, aby „vhodné teď"
                    znamenalo na obou obrazovkách totéž. */}
                <ChipButton
                  label="vhodné teď"
                  Icon={Baby}
                  pressed={vhodneTed}
                  onClick={() => setVhodneTed((value) => !value)}
                  testId="filtr-vhodne"
                />
                {/* Odpověď na „mám doma pastinák, co s ním". Počítá se
                    z receptu, ne ze štítku, takže platí i pro starší položky. */}
                <ChipButton
                  label="jednoduchá úprava"
                  Icon={Timer}
                  pressed={jednoduche}
                  onClick={() => setJednoduche((value) => !value)}
                  testId="filtr-jednoduche"
                />
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
              <FilterGroup
                nadpis="Bez alergenu"
                popis={
                  bezAlergenu.zDitete.length > 0 && bezAlergenu.automaticky
                    ? 'Předvyplněno podle alergií dítěte z Domácnosti. Dá se odškrtnout.'
                    : 'Vybrané alergeny se z výpisu vynechají; zaškrtnout jde víc naráz.'
                }
              >
                <FilterToggles
                  options={ALLERGEN_TOGGLE_OPTIONS}
                  selected={bezAlergenu.vybrane}
                  onToggle={(id) => bezAlergenu.prepni(id as AllergenGroup)}
                  ariaLabel="Vynechat alergeny"
                  testId="filtr-bez-alergenu"
                />
              </FilterGroup>
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

      {/* Změna počtu se musí ohlásit; filtrování je jinak pro odečítač
          obrazovky neviditelné — seznam se tiše přeskládá. */}
      <p aria-live="polite" className="text-xs text-muted" data-testid="pocet-receptu">
        {visible.length} z {recipes.length} receptů
      </p>

      {visible.length === 0 ? (
        <PrazdnyStav
          co="recept"
          zapnute={zapnuteFiltry}
          zrusVse={ZRUSIT_VSE}
          testId="prazdny-stav-recepty"
        />
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
              {tooEarly ? ': na dítě ještě brzy' : ''}
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
        <span className="flex shrink-0 flex-col items-center gap-1">
          <FavoriteToggle
            id={recipe.id}
            name={recipe.titleCz}
            favorite={favorite}
          />
          {/* Suroviny celého receptu do nákupu, bez otevírání receptu.
              Rodič, který plánuje nákup, projde seznam receptů jednou. */}
          <NakupTlacitko
            ikona
            davky={slozkyDoNakupu(recipe.id).map((slozka) => ({ ...slozka, recipeId: recipe.id }))}
            popis={`Suroviny receptu ${recipe.titleCz} do nákupu`}
            testId={`do-nakupu-${recipe.id}`}
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
