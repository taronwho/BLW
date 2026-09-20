import {
  Baby,
  CalendarDays,
  RotateCcw,
  Search,
  ShieldAlert,
  Star,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ingredients } from '@/data/ingredients';
import { nutrientProfile } from '@/data/nutrients';
import { useHouseholdStore } from '@/storage/householdStore';
import { INGREDIENT_CATEGORIES } from '@/types';
import type { AllergenGroup, Ingredient } from '@/types';
import { ageInMonths } from '../lib/age';
import { usePostupneZobrazeni } from '../lib/postupneZobrazeni';
import { FilterChips } from '../components/FilterChips';
import { RozbalovaciFiltry } from '../components/RozbalovaciFiltry';
import { KonecSeznamu } from '../components/KonecSeznamu';
import { OdkazNaNakup } from '../components/OdkazNaNakup';
import { NakupTlacitko } from '../components/NakupTlacitko';
import { vychoziMnozstvi } from '@/nakup/seznam';
import type { ChipOption } from '../components/FilterChips';
import { FilterSelect } from '../components/FilterSelect';
import { FilterToggles } from '../components/FilterToggles';
import { AllergenChip, ChokingChip } from '../components/SafetyChips';
import { FavoriteToggle } from '../components/FavoriteToggle';
import { ChipButton, FilterGroup, Upresneni } from '../components/FilterGroup';
import {
  DRUH_ZELEZA_OPTIONS,
  UROVEN_OPTIONS,
  vyhovujeZivinam,
  ZIVINY_OPTIONS,
} from '../lib/nutrientFilter';
import { COMPOSITION } from '@/data/composition';
import { NutrientBadge } from '../components/NutrientBadge';
import type { SelectOption } from '../components/FilterSelect';
import { TastedToggle } from '../components/TastedToggle';
import { inSeason, suitableNow, tastedIds } from '../lib/derive';
import { CATEGORY_LABELS } from '../lib/labels';
import { ALLERGEN_TOGGLE_OPTIONS } from '../lib/allergenOptions';
import { useFiltrAlergenu } from '../lib/allergenFilter';
import { matchesIngredient } from '../lib/search';
import { useUrlBatch, useUrlFlag, useUrlList, useUrlText } from '../lib/urlState';
import { INGREDIENT_SORTS, sortIngredients } from '../lib/sorting';
import type { SortKey } from '../lib/sorting';
import { IngredientIcon } from '../components/IngredientIcon';
import { favoriteIds } from '../lib/tastings';
import { useAktivniDiteId, useNarozeniAktivniho } from '../lib/dite';

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
  ...INGREDIENT_CATEGORIES.map((category) => ({
    id: category,
    label: CATEGORY_LABELS[category],
  })),
];

/** Seznam surovin (docs/SPEC.md kap. 4.1). */
export function IngredientsScreen(): ReactNode {
  const state = useHouseholdStore((store) => store.state);
  // Filtry drží adresa, ne komponenta — viz src/app/lib/urlState.ts.
  const [query, setQuery] = useUrlText('q', '');
  const [category, setCategory] = useUrlText('kat', 'vse');
  const [ziviny] = useUrlList('ziv');
  const [druhZeleza, setDruhZeleza] = useUrlText('fe', 'vse');
  const [sila, setSila] = useUrlText('sila', 'aspon');
  const [denik, setDenik] = useUrlText('denik', 'vse');
  const [oblibene, setOblibene] = useUrlFlag('oblibene');
  const [vhodneTed, setVhodneTed] = useUrlFlag('ted');
  const [sezonni, setSezonni] = useUrlFlag('sezona');
  const [alergeny, setAlergeny] = useUrlFlag('alergeny');
  const bezAlergenu = useFiltrAlergenu();
  const [sort, setSort] = useUrlText<SortKey>('razeni', 'abeceda');
  // Víc voleb naráz musí do adresy jedním zápisem, jinak se přepíšou.
  const nastavFiltry = useUrlBatch();

  const diteId = useAktivniDiteId();
  const tasted = useMemo(() => tastedIds(state, diteId), [state, diteId]);
  const favorites = useMemo(() => favoriteIds(state), [state]);
  const months = ageInMonths(useNarozeniAktivniho());
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
        if (sezonni && !(item.seasonCz.length > 0 && inSeason(item, month)))
          return false;
        if (alergeny && !item.isKeyAllergen) return false;
        if (bezAlergenu.vybrane.some((skupina) => item.allergens.includes(skupina)))
          return false;
        if (!vyhovujeZivinam(nutrientProfile(item), ziviny, druhZeleza, sila))
          return false;
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
      bezAlergenu.vybrane,
      ziviny,
      druhZeleza,
      sila,
      tasted,
      favorites,
      months,
      month,
    ],
  );

  const serazene = useMemo(
    () => sortIngredients(visible, sort),
    [visible, sort],
  );
  const { zobrazene, zbyva, nacistDalsi, konecSeznamu } =
    usePostupneZobrazeni(serazene);

  const zeleznyFiltr = ziviny.includes('zelezo');
  // Počet zapnutých filtrů na tlačítku; kategorie a řazení se nepočítají,
  // ty jsou vidět pořád.
  const podrobnychFiltru =
    ziviny.length +
    (druhZeleza === 'vse' ? 0 : 1) +
    (sila === 'aspon' ? 0 : 1) +
    (denik === 'vse' ? 0 : 1) +
    (oblibene ? 1 : 0) +
    (vhodneTed ? 1 : 0) +
    (sezonni ? 1 : 0) +
    (alergeny ? 1 : 0) +
    (bezAlergenu.vybrane.length > 0 ? 1 : 0);

  const filtrujeSe =
    query !== '' ||
    category !== 'vse' ||
    denik !== 'vse' ||
    oblibene ||
    vhodneTed ||
    sezonni ||
    alergeny ||
    bezAlergenu.vybrane.length > 0 ||
    ziviny.length > 0;

  function prepniZivinu(id: string): void {
    const dalsi = ziviny.includes(id) ? ziviny.filter((one) => one !== id) : [...ziviny, id];
    // Druh železa dává smysl jen se zaškrtnutým železem; jinak by zůstal
    // viset nastavený a tiše filtroval.
    const odebiramZelezo = id === 'zelezo' && ziviny.includes('zelezo');
    nastavFiltry({ ziv: dalsi, ...(odebiramZelezo ? { fe: null } : {}) });
  }

  function zrusFiltry(): void {
    nastavFiltry({
      q: null, kat: null, ziv: null, fe: null, sila: null, denik: null,
      oblibene: null, ted: null, sezona: null, alergeny: null, bez: null,
    });
  }

  return (
    <section className="flex flex-col gap-4" aria-labelledby="suroviny-nadpis">
      {/* Nadpis a vedle něj cesta do nákupního seznamu. Přidávat do něj
          šlo z téhle obrazovky odjakživa, podívat se na něj ne — rodič
          musel zpátky na úvodní obrazovku. */}
      <div className="flex items-center justify-between gap-2">
        <h1 id="suroviny-nadpis" className="text-xl font-bold">
          Suroviny
        </h1>
        <OdkazNaNakup testId="suroviny-na-nakup" />
      </div>

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

      <RozbalovaciFiltry
        testId="filtry-surovin"
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
          </>
        }
        podrobne={
          <>
            <FilterGroup
              nadpis="Musí obsahovat"
              popis="Vybrané živiny se sčítají: surovina musí mít všechny."
            >
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

      {/* Změna počtu se musí ohlásit; filtrování je jinak pro odečítač
          obrazovky neviditelné — seznam se tiše přeskládá. */}
      <p aria-live="polite" className="text-xs text-muted" data-testid="pocet-surovin">
        {visible.length} z {ingredients.length} surovin
      </p>

      {visible.length === 0 ? (
        <p
          className="rounded-xl bg-surface p-4 text-sm text-muted"
          data-testid="prazdny-stav"
        >
          Nic neodpovídá. Nejspíš je podmínek najednou moc. Zkus ubrat některou
          živinu, povolit všechny kategorie nebo klepnout na „zrušit filtry“.
        </p>
      ) : (
        // Dlaždice po dvou, ne řádky přes celou šířku. Řádek u krátkého
        // názvu nechával polovinu obrazovky prázdnou a přitom se na jednu
        // obrazovku vešlo jen pár surovin. Dvě dlaždice vedle sebe pobírají
        // dvojnásobek a štítky se pod název vejdou i na 320 px.
        <ul
          className="grid grid-cols-2 items-stretch gap-2 sm:grid-cols-3"
          data-testid="seznam-surovin"
        >
          {zobrazene.map((item) => (
            <IngredientTile
              key={item.id}
              ingredient={item}
              tasted={tasted.has(item.id)}
              favorite={favorites.has(item.id)}
            />
          ))}
        </ul>
      )}
      <KonecSeznamu
        zbyva={zbyva}
        nacistDalsi={nacistDalsi}
        konecSeznamu={konecSeznamu}
        testId="nacist-dalsi-suroviny"
      />
    </section>
  );
}

function IngredientTile({
  ingredient,
  tasted,
  favorite,
}: {
  ingredient: Ingredient;
  tasted: boolean;
  favorite: boolean;
}): ReactNode {
  const profile = nutrientProfile(ingredient);
  // Řádka živin se nevykreslí, když položka není zdrojem žádné ze tří —
  // prázdná mezera by jen rozhodila mřížku.
  const maZiviny =
    profile.iron !== 'nevyznamny' ||
    profile.zinc !== 'nevyznamny' ||
    profile.vitaminC !== 'nevyznamny';
  const alergen = ingredient.allergens[0];

  return (
    <li className="flex flex-col gap-1.5 rounded-xl bg-surface p-2.5">
      {/* Ikona a obě tlačítka sdílejí horní řádku. Samostatná řádka tlačítek
          pod dlaždicí zabírala celých 44 px výšky navíc a na obrazovku se
          pak vešly sotva dvě řádky dlaždic. */}
      <div className="flex items-center justify-between gap-1">
        <IngredientIcon ingredient={ingredient} className="h-8 w-8" />
        {/* Zápis ochutnávky a oblíbená položka jedním palcem přímo ze
            seznamu, bez prokliku do detailu. Tlačítka stojí vedle odkazu,
            ne v něm: tlačítko uvnitř odkazu je neplatné HTML. */}
        <span className="flex shrink-0 gap-1">
          <TastedToggle
            ingredientId={ingredient.id}
            ingredientName={ingredient.nameCz}
            tasted={tasted}
          />
          <FavoriteToggle
            id={ingredient.id}
            name={ingredient.nameCz}
            favorite={favorite}
          />
        </span>
      </div>

      <Link
        to={`/suroviny/${ingredient.id}`}
        data-testid={`surovina-${ingredient.id}`}
        className="flex min-w-0 flex-col gap-1.5 rounded-lg"
      >
        <span className="min-w-0 break-words text-sm font-semibold leading-snug">
          {ingredient.nameCz}
        </span>

        <span className="flex flex-wrap items-center gap-1">
          <span className="rounded-lg bg-paper px-2 py-0.5 text-[11px] font-medium text-muted">
            <span aria-hidden="true">{ingredient.minAgeMonths} m+</span>
            <span className="sr-only">vhodné od {ingredient.minAgeMonths} měsíců</span>
          </span>
          <ChokingChip
            risk={ingredient.chokingRisk}
            testId={`duseni-${ingredient.id}`}
            compact
          />
          {alergen !== undefined && (
            <AllergenChip
              allergen={alergen}
              testId={`alergen-${ingredient.id}`}
              compact
            />
          )}
        </span>
      </Link>

      {/* Do nákupu rovnou z přehledu, bez prokliku do detailu.
          Vlastní řádka přes celou šířku, ne třetí ikona nahoře: na displeji
          širokém 320 px je dlaždice 140 px a tři dotykové cíle po 44 px se
          do ní vedle ikony suroviny nevejdou. Popisek je navíc srozumitelnější
          než další samotná ikona. */}
      <NakupTlacitko
        davky={[{ ingredientId: ingredient.id }]}
        popis="Do nákupu"
        potvrzeni="Přidáno"
        zeptejSe={{
          nadpis: `${ingredient.nameCz} do nákupu`,
          vychozi: vychoziMnozstvi(ingredient.id),
        }}
        testId={`do-nakupu-surovina-${ingredient.id}`}
      />

      {maZiviny && (
        <span
          className="flex flex-wrap items-center gap-x-1.5"
          data-testid={`ziviny-${ingredient.id}`}
        >
          <NutrientBadge
            profile={profile}
            title={ingredient.nameCz}
            slozeni={COMPOSITION[ingredient.id]}
            testId={`zeleza-${ingredient.id}`}
          />
        </span>
      )}
    </li>
  );
}
