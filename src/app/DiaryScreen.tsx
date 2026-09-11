import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { CircleCheck, CircleDashed, Lightbulb, TriangleAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ingredients as catalogIngredients } from '@/data/ingredients';
import { useHouseholdStore } from '@/storage/householdStore';
import {
  allergenProgress,
  categoryStats,
  EXPOSURES_FOR_INTRODUCED,
  groupByDay,
  refusedIngredientIds,
  suggestToday,
} from '@/lib/diary';
import { useHousehold } from './useHousehold';
import { EmptyState } from './components/EmptyState';
import { ALLERGEN_LABELS, AMOUNT_LABELS, CATEGORY_LABELS, REACTION_LABELS } from '@/lib/labels';

export function DiaryScreen(): ReactNode {
  const { state } = useHouseholdStore();
  const { ageMonths } = useHousehold();

  const byId = useMemo(() => new Map(catalogIngredients.map((i) => [i.id, i])), []);
  const days = useMemo(() => groupByDay(state.tastings), [state.tastings]);
  const allergens = useMemo(
    () => allergenProgress(state.tastings, catalogIngredients),
    [state.tastings],
  );
  const stats = useMemo(
    () => categoryStats(state.tastings, catalogIngredients),
    [state.tastings],
  );
  const refused = useMemo(() => refusedIngredientIds(state.tastings), [state.tastings]);
  const suggestions = useMemo(
    () =>
      suggestToday(catalogIngredients, state.tastings, {
        ageMonths,
        month: new Date().getMonth() + 1,
      }),
    [state.tastings, ageMonths],
  );

  const tastedCount = new Set(state.tastings.map((event) => event.ingredientId)).size;

  return (
    <section aria-labelledby="denik-nadpis" className="flex flex-col gap-5">
      <h1 id="denik-nadpis" className="text-lg font-semibold">
        Deník
      </h1>

      <div className="rounded-xl bg-surface p-4">
        <p className="text-sm">
          Ochutnáno <strong>{tastedCount}</strong> z {catalogIngredients.length} surovin
        </p>
        {stats.length > 0 && (
          <ul className="mt-2 flex flex-col gap-1 text-xs text-muted">
            {stats.map((stat) => (
              <li key={stat.category}>
                {CATEGORY_LABELS[stat.category]}: {stat.tasted}/{stat.total}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Klíčové alergeny
        </h2>
        <ul className="flex flex-col divide-y divide-muted/15 rounded-xl bg-surface">
          {allergens.map((item) => (
            <li key={item.allergen} className="flex items-center gap-2 p-3 text-sm">
              {item.introduced ? (
                <CircleCheck aria-hidden="true" className="h-4 w-4 shrink-0 text-safe" />
              ) : (
                <CircleDashed aria-hidden="true" className="h-4 w-4 shrink-0 text-muted" />
              )}
              <span className="min-w-0 flex-1 break-words">{ALLERGEN_LABELS[item.allergen]}</span>
              <span className="shrink-0 text-xs text-muted">
                {item.exposures}× {item.lastDate !== null && `· ${item.lastDate}`}
              </span>
              {item.hasReaction && (
                <TriangleAlert aria-hidden="true" className="h-4 w-4 shrink-0 text-caution" />
              )}
              <span className="sr-only">
                {item.introduced ? 'zavedeno' : 'zatím nezavedeno'}
                {item.hasReaction ? ', zaznamenaná reakce' : ''}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted">
          Za zavedený se alergen počítá po {EXPOSURES_FOR_INTRODUCED} expozicích bez reakce. Je to
          počítadlo, ne lékařský závěr — při jakémkoli podezření na reakci se ptej pediatričky.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted">
          <Lightbulb aria-hidden="true" className="h-4 w-4" />
          Co dnes zkusit?
        </h2>
        {suggestions.length === 0 ? (
          <p className="rounded-xl bg-surface p-4 text-sm text-muted">
            Zatím není z čeho vybírat — katalog se plní.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {suggestions.map((item) => (
              <li key={item.id}>
                <Link
                  to={`/suroviny/${item.id}`}
                  className="flex min-h-touch items-center rounded-xl bg-surface p-3 text-sm font-medium"
                >
                  {item.nameCz}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Časová osa</h2>
        {days.length === 0 ? (
          <EmptyState hint="Deník je zatím prázdný. První ochutnávku zapíšeš zaškrtnutím v seznamu surovin." />
        ) : (
          <ul className="flex flex-col gap-3">
            {days.map((day) => (
              <li key={day.date} className="flex flex-col gap-1">
                <p className="text-xs font-semibold text-muted">{day.date}</p>
                <ul className="flex flex-col divide-y divide-muted/15 rounded-xl bg-surface">
                  {day.events.map((event) => (
                    <li key={event.id} className="flex items-center gap-2 p-3 text-sm">
                      <span className="min-w-0 flex-1 break-words">
                        {byId.get(event.ingredientId)?.nameCz ?? event.ingredientId}
                      </span>
                      <span className="shrink-0 text-xs text-muted">
                        {AMOUNT_LABELS[event.amount]} · {REACTION_LABELS[event.reaction]}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>

      {refused.length > 0 && (
        <p className="rounded-xl bg-surface p-4 text-xs text-muted">
          Odmítnuté naposledy: {refused.map((id) => byId.get(id)?.nameCz ?? id).join(', ')}.
          Odmítnutí je normální — opakovaná nabídka bez tlaku je běžná cesta.
        </p>
      )}
    </section>
  );
}
