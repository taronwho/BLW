import { ArrowLeft, Check, Circle, Pencil, ShoppingBasket, Trash2, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { INGREDIENT_CATEGORIES } from '@/types';
import type { IngredientCategory } from '@/types';
import { useHouseholdStore } from '@/storage/householdStore';
import { sestavNakupniSeznam, type NakupniRadek } from '@/nakup/seznam';
import { IngredientIcon } from '../components/IngredientIcon';
import { CATEGORY_LABELS } from '../lib/labels';
import { useModalFokus } from '../lib/modalFokus';
import { MnozstviOkenko } from '../components/MnozstviOkenko';
import { POLOZKA, sklonuj } from '@/text/sklonovani';

/**
 * Nákupní seznam.
 *
 * Seznam se plní z receptů, z plánu a z jednotlivých surovin; množství se
 * sčítají až tady, aby šlo kterýkoli recept zase odebrat. Odškrtnuté položky
 * nemizí, jen zešednou a spadnou dolů — v obchodě se člověk potřebuje
 * podívat, co už do košíku dal.
 */
export function NakupScreen(): ReactNode {
  const state = useHouseholdStore((store) => store.state);
  const prepniKoupeno = useHouseholdStore((store) => store.prepniKoupeno);
  const odeberZNakupu = useHouseholdStore((store) => store.odeberZNakupu);
  const vyprazdniNakup = useHouseholdStore((store) => store.vyprazdniNakup);
  const [ptaSe, setPtaSe] = useState(false);
  const nastavMnozstvi = useHouseholdStore((store) => store.nastavMnozstvi);
  /** Která surovina má právě otevřené okénko s množstvím. */
  const [upravovana, setUpravovana] = useState<string | null>(null);
  const okenko = useModalFokus<HTMLDivElement>(ptaSe);

  const radky = sestavNakupniSeznam(state);
  const kNakupu = radky.filter((radek) => !radek.koupeno);
  const koupene = radky.filter((radek) => radek.koupeno);

  const upravena = radky.find((radek) => radek.ingredient.id === upravovana);

  const skupiny = INGREDIENT_CATEGORIES.map((kategorie) => ({
    kategorie,
    polozky: kNakupu.filter((radek) => radek.ingredient.category === kategorie),
  })).filter((skupina) => skupina.polozky.length > 0);

  return (
    <section className="flex flex-col gap-3" aria-labelledby="nakup-nadpis">
      <Link
        to="/"
        className="flex min-h-touch items-center gap-2 self-start text-sm font-semibold text-accent"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4 shrink-0" />
        Zpět domů
      </Link>

      <header className="flex flex-col gap-2 rounded-2xl bg-accent-sheen p-4 text-white shadow-lift">
        <div className="flex items-baseline justify-between gap-2">
          <h1 id="nakup-nadpis" className="text-lg font-bold">
            Nákupní seznam
          </h1>
          <span
            data-testid="nakup-postup"
            className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold"
          >
            {koupene.length} z {radky.length} v košíku
          </span>
        </div>
        <p className="text-xs leading-relaxed text-white/90">
          Množství se sčítá napříč recepty, takže u regálu vidíš rovnou, kolik čeho vzít.
        </p>
      </header>

      {radky.length === 0 ? (
        <div
          data-testid="nakup-prazdny"
          className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4"
        >
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <ShoppingBasket aria-hidden="true" className="h-5 w-5 shrink-0 text-accent" />
            Zatím je prázdný
          </h2>
          <p className="text-xs leading-relaxed text-muted">
            Naplní se ze tří míst: tlačítkem u receptu, u jednotlivé suroviny, nebo v plánu
            jedním klepnutím na celý příští týden.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/recepty"
              data-testid="nakup-do-receptu"
              className="flex min-h-touch items-center justify-center rounded-xl border-2 border-accent bg-accent/10 px-4 text-sm font-semibold text-accent"
            >
              Vybrat recepty
            </Link>
            <Link
              to="/plan"
              className="flex min-h-touch items-center justify-center rounded-xl border border-line bg-paper px-4 text-sm font-medium"
            >
              Otevřít plán
            </Link>
          </div>
        </div>
      ) : (
        <>
          {skupiny.map(({ kategorie, polozky }) => (
            <section key={kategorie} className="flex flex-col gap-1.5">
              <h2 className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                {CATEGORY_LABELS[kategorie as IngredientCategory]}
              </h2>
              <ul className="flex flex-col gap-1" data-testid={`nakup-skupina-${kategorie}`}>
                {polozky.map((radek) => (
                  <Radek
                    key={radek.ingredient.id}
                    radek={radek}
                    onPrepni={() => void prepniKoupeno(radek.ingredient.id)}
                    onOdeber={() => void odeberZNakupu(radek.ingredient.id)}
                    onUprav={() => setUpravovana(radek.ingredient.id)}
                  />
                ))}
              </ul>
            </section>
          ))}

          {koupene.length > 0 && (
            <section className="flex flex-col gap-1.5" data-testid="nakup-koupene">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                  V košíku
                </h2>
                <button
                  type="button"
                  data-testid="nakup-uklid-koupene"
                  onClick={() => void vyprazdniNakup(true)}
                  className="flex min-h-touch items-center gap-1.5 text-xs font-semibold text-accent"
                >
                  <Trash2 aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                  Uklidit koupené
                </button>
              </div>
              <ul className="flex flex-col gap-1">
                {koupene.map((radek) => (
                  <Radek
                    key={radek.ingredient.id}
                    radek={radek}
                    onPrepni={() => void prepniKoupeno(radek.ingredient.id)}
                    onOdeber={() => void odeberZNakupu(radek.ingredient.id)}
                    onUprav={() => setUpravovana(radek.ingredient.id)}
                  />
                ))}
              </ul>
            </section>
          )}

          {/* Rovnou tlačítko, ne rozbalovátko. Schovat mazání pod „Začít
              seznam znovu" znamenalo, že ho rodič musel nejdřív najít — a
              přitom ho to stejně před omylem nechránilo, protože pod ním
              stačilo jedno klepnutí. Pojistkou je otázka, ne schovávačka. */}
          <button
            type="button"
            data-testid="nakup-vyprazdnit"
            onClick={() => setPtaSe(true)}
            className="flex min-h-touch items-center justify-center gap-2 self-start rounded-xl border border-line bg-surface px-4 text-sm font-medium text-muted"
          >
            <Trash2 aria-hidden="true" className="h-4 w-4 shrink-0" />
            Vyprázdnit seznam
          </button>
        </>
      )}
      {upravena !== undefined && (
        <MnozstviOkenko
          nadpis={`Kolik koupit: ${upravena.ingredient.nameCz}`}
          vychozi={upravena.popis}
          potvrzeni="Uložit množství"
          muzeSmazat={upravena.rucni}
          onZavri={() => setUpravovana(null)}
          onUloz={(mnozstvi) => {
            void nastavMnozstvi(upravena.ingredient.id, mnozstvi.length === 0 ? null : mnozstvi);
            setUpravovana(null);
          }}
        />
      )}

      {ptaSe &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="vyprazdnit-nadpis"
            data-testid="nakup-vyprazdnit-okenko"
            className="fixed inset-0 z-50 flex items-end justify-center bg-scrim/50 p-3 sm:items-center"
            onClick={() => setPtaSe(false)}
          >
            <div
              ref={okenko}
              className="flex w-full max-w-md flex-col gap-3 rounded-2xl bg-surface p-4 shadow-lift"
              onClick={(event) => event.stopPropagation()}
            >
              <h2 id="vyprazdnit-nadpis" className="text-base font-bold">
                Opravdu vyprázdnit celý seznam?
              </h2>
              <p className="text-xs leading-relaxed text-muted">
                Smaže se {sklonuj(radky.length, POLOZKA)} včetně toho, co ještě není koupené.
                Recepty ani plán se tím nemění, dají se do seznamu přidat znovu.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  data-testid="nakup-vyprazdnit-potvrdit"
                  onClick={() => {
                    void vyprazdniNakup(false);
                    setPtaSe(false);
                  }}
                  className="flex min-h-touch items-center justify-center gap-2 rounded-xl bg-risk px-4 text-sm font-semibold text-white"
                >
                  <Trash2 aria-hidden="true" className="h-4 w-4 shrink-0" />
                  Ano, vyprázdnit
                </button>
                <button
                  type="button"
                  data-testid="nakup-vyprazdnit-zrusit"
                  onClick={() => setPtaSe(false)}
                  className="flex min-h-touch items-center justify-center rounded-xl border border-line bg-paper px-4 text-sm font-medium"
                >
                  Nechat seznam být
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}

/**
 * Jedna položka seznamu.
 *
 * Klepnutí kamkoli do řádky znamená „mám", protože v obchodě se míří jednou
 * rukou a rychle. Křížek vedle položku ze seznamu odebere úplně — to je něco
 * jiného než koupeno a plete se to jen tehdy, když jsou obě akce stejné.
 */
function Radek({
  radek,
  onPrepni,
  onOdeber,
  onUprav,
}: {
  radek: NakupniRadek;
  onPrepni: () => void;
  onOdeber: () => void;
  onUprav: () => void;
}): ReactNode {
  const { ingredient, popis, popisZReceptu, rucni, koupeno, puvod } = radek;
  const zdroje = [...new Set(puvod.map((jeden) => jeden.nazev))];

  return (
    <li className="flex items-stretch gap-1">
      <button
        type="button"
        aria-pressed={koupeno}
        data-testid={`nakup-polozka-${ingredient.id}`}
        onClick={onPrepni}
        className={`flex min-h-touch min-w-0 flex-1 items-center gap-2 rounded-xl border px-2 py-1.5 text-left transition-colors ${
          koupeno ? 'border-line bg-paper text-muted' : 'border-line bg-surface'
        }`}
      >
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            koupeno ? 'border-accent bg-accent text-on-accent' : 'border-accent/50'
          }`}
        >
          {koupeno && <Check aria-hidden="true" className="h-4 w-4 animate-odskrtnuto" />}
          {!koupeno && <Circle aria-hidden="true" className="h-0 w-0" />}
        </span>

        <IngredientIcon
          ingredient={ingredient}
          className={`h-6 w-6 shrink-0 ${koupeno ? 'opacity-50' : ''}`}
        />

        <span className="flex min-w-0 flex-1 flex-col leading-tight">
          <span
            className={`truncate text-sm font-medium ${koupeno ? 'line-through' : ''}`}
          >
            {ingredient.nameCz}
          </span>
          {zdroje.length > 0 && (
            <span className="truncate text-[10px] text-muted">{zdroje.join(' · ')}</span>
          )}
        </span>

      </button>

      {/* Množství je vlastní tlačítko, ne text uvnitř řádky.
          U regálu se hodí přepsat, kolik čeho koupit — součet z receptů
          je odhad z kuchařky, ale prodává se v balení. Zvlášť proto, že
          klepnutí do řádky znamená „mám" a spojit obojí do jednoho místa
          by znamenalo odškrtnout položku pokaždé, když ji chci upravit. */}
      <button
        type="button"
        onClick={onUprav}
        data-testid={`nakup-mnozstvi-${ingredient.id}`}
        aria-label={
          popis.length > 0
            ? `Upravit množství: ${ingredient.nameCz}, teď ${popis}`
            : `Zadat množství: ${ingredient.nameCz}`
        }
        className={`flex min-h-touch shrink-0 flex-col items-end justify-center rounded-xl px-2 text-xs font-semibold tabular-nums ${
          koupeno ? 'text-muted line-through' : 'text-accent'
        }`}
      >
        {popis.length > 0 ? (
          popis
        ) : (
          <Pencil aria-hidden="true" className="h-4 w-4 shrink-0" />
        )}
        {/* Když rodič množství přepsal, je vidět i to počítané — jinak by
            po přidání dalšího receptu nepochopil, proč se číslo nezměnilo. */}
        {rucni && popisZReceptu.length > 0 && (
          <span className="text-[10px] font-normal text-muted">z receptů {popisZReceptu}</span>
        )}
      </button>

      <button
        type="button"
        aria-label={`Odebrat ${ingredient.nameCz} ze seznamu`}
        data-testid={`nakup-odebrat-${ingredient.id}`}
        onClick={onOdeber}
        className="flex min-h-touch min-w-touch shrink-0 items-center justify-center rounded-xl text-muted"
      >
        <X aria-hidden="true" className="h-4 w-4" />
      </button>
    </li>
  );
}
