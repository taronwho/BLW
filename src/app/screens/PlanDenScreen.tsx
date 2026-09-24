import { AlertTriangle, ArrowLeft, ChevronRight, Clock, ShieldCheck, Utensils } from 'lucide-react';
import type { ReactNode } from 'react';
import type { AllergenGroup } from '@/types';
import { Link, useParams } from 'react-router-dom';
import { ingredientById, recipeById } from '@/data';
import { useHouseholdStore } from '@/storage/householdStore';
import { denPodleCisla, kdyStavDne, pribyleAlergie, stavDne } from '@/plan/typy';
import { ChokingBadge } from '../components/ChokingBadge';
import { IngredientIcon } from '../components/IngredientIcon';
import { PlanDenAkce } from '../components/PlanDenAkce';
import { NakupTlacitko } from '../components/NakupTlacitko';
import { slozkyDoNakupu } from '@/nakup/seznam';
import { ageInMonths, stageForAge } from '../lib/age';
import { useAktivniDite } from '../lib/dite';
import { ALLERGEN_LABELS } from '../lib/labels';
import { DUVOD_LABELS, TYP_JIDLA_LABELS, useAktivniPlan, znameNaTalir } from '../lib/plan';
import { vyrazeneZPlanu } from '../lib/tastings';
import { NotFoundScreen } from './NotFoundScreen';

/**
 * Jeden den plánu se vším, co k němu patří.
 *
 * Přehled bloku ukazuje jen názvy, tady jsou celé recepty: kdy odebrat
 * dětskou porci, jak ji podat v dané fázi a čím se dosolí talíř dospělých.
 */

const DUVOD_TON: Record<string, string> = {
  'prvni-ochutnavka': 'border-accent/40 bg-accent-soft text-ink',
  'nova-surovina': 'border-accent/40 bg-accent-soft text-ink',
  alergen: 'border-caution/40 bg-caution/10 text-ink',
  zelezo: 'border-line bg-paper text-muted',
  osvedcene: 'border-line bg-paper text-muted',
};

/**
 * Alergeny, které jídlo nese a dítě je podle Domácnosti nesmí.
 *
 * Plán se sestavuje jednou a alergii může rodič zapsat až potom. Tohle je
 * poslední místo, kde se to dá zachytit dřív, než se podle receptu začne
 * vařit, takže se kontroluje při každém zobrazení, ne jen při sestavení.
 */
function zakazaneVJidle(
  jidlo: { recipeId?: string; ingredientId?: string },
  zakazane: readonly AllergenGroup[],
): AllergenGroup[] {
  const nese = new Set<AllergenGroup>([
    ...(recipeById.get(jidlo.recipeId ?? '')?.allergens ?? []),
    ...(ingredientById.get(jidlo.ingredientId ?? '')?.allergens ?? []),
  ]);
  return zakazane.filter((skupina) => nese.has(skupina));
}

/**
 * Suroviny jídla, které plán dnes už nenabízí: po reakci v deníku nebo
 * vyřazené rodičem. Plán mohl vzniknout dřív, než se to stalo, takže se to
 * stejně jako alergie kontroluje při každém zobrazení.
 */
function vyrazeneVJidle(
  jidlo: { recipeId?: string; ingredientId?: string },
  vyrazene: ReadonlySet<string>,
): string[] {
  const ids = new Set<string>([
    ...(recipeById.get(jidlo.recipeId ?? '')?.ingredients.map((ref) => ref.ingredientId) ?? []),
    ...(jidlo.ingredientId === undefined ? [] : [jidlo.ingredientId]),
  ]);
  return [...ids]
    .filter((id) => vyrazene.has(id))
    .map((id) => ingredientById.get(id)?.nameCz ?? id);
}

function datum(kdy: number | null): string {
  if (kdy === null) return '';
  return new Date(kdy).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' });
}

export function PlanDenScreen(): ReactNode {
  const { cislo } = useParams<{ cislo: string }>();
  const plan = useAktivniPlan();
  const dite = useAktivniDite();
  const state = useHouseholdStore((store) => store.state);
  const poradi = Number(cislo);
  const den = plan === null || !Number.isInteger(poradi) ? null : denPodleCisla(plan, poradi);

  if (plan === null || den === null) return <NotFoundScreen />;

  const stav = stavDne(plan, den.cislo);
  const faze = stageForAge(ageInMonths(dite?.birthDate ?? ''));
  const novinka = ingredientById.get(den.novinka ?? '');
  const pribylo = pribyleAlergie(plan, dite ?? null);
  const vyrazene = vyrazeneZPlanu(state, dite?.id ?? null, dite?.vyrazene ?? []);
  const denMaVyrazene =
    (den.novinka !== undefined && vyrazene.has(den.novinka)) ||
    den.jidla.some((jidlo) => vyrazeneVJidle(jidlo, vyrazene).length > 0);

  // Co už dítě zná: dřívější dny tohoto bloku, deník a to, co znalo při
  // sestavení bloku. Nabídka na talíř, ne další jídlo navíc.
  const znameJiz = znameNaTalir(
    plan,
    den,
    state,
    dite?.id ?? null,
    dite?.allergens ?? [],
    dite?.vyrazene ?? [],
  );

  // Co se ten den vaří, to se dá rovnou hodit do nákupu.
  const davkyDne = den.jidla.flatMap((jidlo) =>
    jidlo.recipeId === undefined
      ? jidlo.ingredientId === undefined
        ? []
        : [{ ingredientId: jidlo.ingredientId }]
      : slozkyDoNakupu(jidlo.recipeId).map((slozka) => ({ ...slozka, recipeId: jidlo.recipeId })),
  );

  return (
    <article className="flex flex-col gap-3" aria-labelledby="den-nadpis">
      <Link
        to="/plan"
        className="flex min-h-touch items-center gap-2 self-start text-sm font-semibold text-accent"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4 shrink-0" />
        Zpět na plán
      </Link>

      <header className="flex flex-wrap items-center gap-2">
        <h1 id="den-nadpis" className="text-xl font-bold">
          Den {den.cislo}
        </h1>
        <span
          data-testid="den-stav"
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
            stav === 'hotovo'
              ? 'bg-accent text-on-accent'
              : stav === 'preskoceno'
                ? 'bg-paper text-muted'
                : 'bg-accent-soft text-ink'
          }`}
        >
          {stav === 'hotovo'
            ? `hotovo ${datum(kdyStavDne(plan, den.cislo))}`
            : stav === 'preskoceno'
              ? 'přeskočeno'
              : 'čeká'}
        </span>
      </header>

      {novinka !== undefined && (
        <Link
          to={`/suroviny/${novinka.id}`}
          data-testid="den-novinka"
          className="flex items-center gap-2.5 rounded-xl border border-accent/30 bg-accent-soft p-3"
        >
          <IngredientIcon ingredient={novinka} className="h-8 w-8 shrink-0" />
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] uppercase tracking-wide text-ink/70">
              nová surovina dne
            </span>
            <span className="block text-sm font-bold">{novinka.nameCz}</span>
            <span className="block text-xs leading-snug text-ink/75">
              Jediná novinka dneška. Kdyby se objevila reakce, je jasné, čeho se týká.
            </span>
          </span>
          <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
        </Link>
      )}

      {/* Štítek stojí pod kartou, ne v ní: na barevném podkladu by klesl
          kontrast pod hranici, kterou docs/SPEC.md kap. 6 vyžaduje. */}
      {novinka !== undefined && (
        <ChokingBadge risk={novinka.chokingRisk} reason={novinka.chokingReason} />
      )}

      {/* Po mnoha blocích dojdou suroviny, které dítě ještě nezná. Den bez
          novinky je pak v pořádku, ale nesmí vypadat jako chyba. */}
      {novinka === undefined && (
        <p
          data-testid="den-bez-novinky"
          className="rounded-xl bg-surface p-3 text-xs leading-relaxed text-muted"
        >
          Dneska nic nového. V katalogu už nezbývá surovina, kterou by dítě neznalo, takže je
          den poskládaný z osvědčeného. Opakování je u příkrmu v pořádku: chuť vzniká
          opakovaným setkáním, ne prvním soustem.
        </p>
      )}

      {pribylo.length > 0 && (
        <p
          data-testid="den-jine-alergie"
          className="flex items-start gap-2 rounded-xl border-2 border-risk/40 bg-risk-soft p-3 text-xs leading-relaxed"
        >
          <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-risk" />
          <span>
            Tenhle den je sestavený bez ohledu na{' '}
            <strong>{pribylo.map((skupina) => ALLERGEN_LABELS[skupina]).join(' a ')}</strong>.
            Jídla, která to nesou, jsou níž označená. Na plánu se dá nechat sestavit nový.
          </span>
        </p>
      )}

      {denMaVyrazene && (
        <p
          data-testid="den-vyrazene"
          className="flex items-start gap-2 rounded-xl border-2 border-risk/40 bg-risk-soft p-3 text-xs leading-relaxed"
        >
          <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-risk" />
          <span>
            Tenhle den obsahuje surovinu, po které je v deníku reakce, nebo která je vyřazená
            z plánu. Jídla s ní jsou níž označená. Den se dá vyměnit, nebo se dá sestavit nový
            plán, který ji vynechá.
          </span>
        </p>
      )}

      {den.opakovanyAlergen !== undefined && (
        <p
          data-testid="den-expozice"
          className="flex items-start gap-2 rounded-xl border border-caution/40 bg-caution/10 p-3 text-xs leading-relaxed"
        >
          <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-caution" />
          <span>
            Dnešek opakuje alergen <strong>{ALLERGEN_LABELS[den.opakovanyAlergen]}</strong>.
            Jednou zavedený alergen se má nabízet dál, jinak se tolerance ztrácí.
          </span>
        </p>
      )}

      {znameJiz.length > 0 && (
        <section
          data-testid="den-na-vyber"
          aria-labelledby="vyber-nadpis"
          className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-3"
        >
          <h2 id="vyber-nadpis" className="text-sm font-semibold">
            Přidej na talíř i něco známého
          </h2>
          <p className="text-[11px] leading-relaxed text-muted">
            Dítě si vybírá samo, a k tomu potřebuje z čeho. Nová surovina je jedna, aby se dala
            přiřadit případná reakce; vedle ní může ležet cokoli, co už mělo.
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {znameJiz.map((item) => (
              <li key={item.id}>
                <Link
                  to={`/suroviny/${item.id}`}
                  className="flex min-h-touch items-center gap-1.5 rounded-lg bg-paper px-2 py-1 text-xs font-medium"
                >
                  <IngredientIcon ingredient={item} className="h-5 w-5 shrink-0" />
                  {item.nameCz}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="jidla-nadpis" className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <h2
            id="jidla-nadpis"
            className="text-[11px] font-semibold uppercase tracking-wide text-muted"
          >
            Jídla dne
          </h2>
          {/* Suroviny jednoho dne do nákupu. Hodí se, když si rodič doplňuje
              jen to, co chybí na zítřek, ne celý týden. */}
          {davkyDne.length > 0 && (
            <NakupTlacitko
              davky={davkyDne}
              popis="Do nákupu"
              potvrzeni="Přidáno"
              testId="den-do-nakupu"
            />
          )}
        </div>
        <ul className="flex flex-col gap-2" data-testid="den-jidla">
          {den.jidla.map((jidlo, i) => {
            const recept = recipeById.get(jidlo.recipeId ?? '');
            const surovina = ingredientById.get(jidlo.ingredientId ?? '');
            const zakazane = zakazaneVJidle(jidlo, pribylo);
            const vyrazeneTady = vyrazeneVJidle(jidlo, vyrazene);
            const varovani =
              zakazane.length === 0 && vyrazeneTady.length === 0 ? null : (
                <span className="flex items-center gap-1.5 rounded-lg border border-risk/40 bg-risk-soft px-2 py-1 text-[11px] font-semibold text-risk">
                  <AlertTriangle aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                  Obsahuje{' '}
                  {[
                    ...zakazane.map((skupina) => ALLERGEN_LABELS[skupina]),
                    ...vyrazeneTady,
                  ].join(' a ')}
                </span>
              );
            const stitek = (
              <span
                className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                  DUVOD_TON[jidlo.duvod] ?? 'border-line bg-paper text-muted'
                }`}
              >
                {DUVOD_LABELS[jidlo.duvod]}
              </span>
            );

            if (recept !== undefined) {
              return (
                <li key={`${jidlo.typ}-${i}`}>
                  <Link
                    to={`/recepty/${recept.id}`}
                    className="flex flex-col gap-1.5 rounded-xl border border-line bg-surface p-3 shadow-soft"
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                        {TYP_JIDLA_LABELS[jidlo.typ]}
                      </span>
                      {stitek}
                    </span>
                    <span className="flex items-center gap-2">
                      <Utensils aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
                      <span className="min-w-0 flex-1 text-sm font-semibold">{recept.titleCz}</span>
                      <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-muted" />
                    </span>
                    <span className="flex flex-wrap items-center gap-2 text-[11px] text-muted">
                      <span className="flex items-center gap-1">
                        <Clock aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                        {recept.timeMinutes} min
                      </span>
                      <span>{recept.servings}</span>
                    </span>
                    {varovani}
                    <span className="rounded-lg bg-paper p-2 text-[11px] leading-relaxed">
                      <strong className="font-semibold">Dětská porce: </strong>
                      {recept.babyServing[faze]}
                    </span>
                  </Link>
                </li>
              );
            }

            if (surovina === undefined) return null;
            return (
              <li key={`${jidlo.typ}-${i}`}>
                <Link
                  to={`/suroviny/${surovina.id}`}
                  className="flex flex-col gap-1.5 rounded-xl border border-line bg-surface p-3 shadow-soft"
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                      {TYP_JIDLA_LABELS[jidlo.typ]}
                    </span>
                    {stitek}
                  </span>
                  <span className="flex items-center gap-2">
                    <IngredientIcon ingredient={surovina} className="h-6 w-6 shrink-0" />
                    <span className="min-w-0 flex-1 text-sm font-semibold">{surovina.nameCz}</span>
                    <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-muted" />
                  </span>
                  {varovani}
                  <ChokingBadge risk={surovina.chokingRisk} />
                  <span className="rounded-lg bg-paper p-2 text-[11px] leading-relaxed">
                    {surovina.prep[faze].serving}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <PlanDenAkce plan={plan} den={den} />

      <p className="flex items-start gap-2 rounded-xl bg-surface p-3 text-[11px] leading-relaxed text-muted">
        <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-caution" />
        <span>
          Odmítnuté jídlo není problém. Opakovaná nabídka je u příkrmu normální a plán tutéž
          surovinu časem nabídne znovu. Při kožní nebo trávicí reakci zapiš, co se dělo,
          a prober to s pediatrem. Aplikace alergii nediagnostikuje.
        </span>
      </p>
    </article>
  );
}
