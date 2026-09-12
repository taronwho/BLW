import { CalendarDays, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ingredientById, ingredients } from '@/data';
import { useHouseholdStore } from '@/storage/householdStore';
import { INGREDIENT_CATEGORIES, KEY_ALLERGENS } from '@/types';
import type { TastingEvent } from '@/types';
import { ChokingBadge } from '../components/ChokingBadge';
import { ChokingLegend } from '../components/ChokingLegend';
import { ageInMonths } from '../lib/age';
import { isAdverse, suggestions, tastedIds } from '../lib/derive';
import { ALLERGEN_LABELS, AMOUNT_LABELS, CATEGORY_LABELS, formatDate, REACTION_LABELS } from '../lib/labels';

/** Deník ochutnávek (docs/SPEC.md kap. 4.5). */
export function DiaryScreen(): ReactNode {
  const state = useHouseholdStore((store) => store.state);
  const months = ageInMonths(state.childBirthDate);
  const month = new Date().getMonth() + 1;

  const byDay = useMemo(() => {
    const map = new Map<string, TastingEvent[]>();
    for (const event of state.tastings) {
      const list = map.get(event.date) ?? [];
      list.push(event);
      map.set(event.date, list);
    }
    return [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [state.tastings]);

  const tasted = useMemo(() => tastedIds(state), [state]);
  const tips = useMemo(() => suggestions(state, months, month), [state, months, month]);

  const refused = useMemo(
    () =>
      [...new Set(state.tastings.filter((event) => event.amount === 'odmitla').map((e) => e.ingredientId))],
    [state.tastings],
  );
  const favorites = state.favorites.filter((id) => ingredientById.has(id));

  return (
    <section className="flex flex-col gap-5" aria-labelledby="denik-nadpis">
      <h1 id="denik-nadpis" className="text-xl font-bold">
        Deník
      </h1>

      <section aria-labelledby="statistiky-nadpis" className="flex flex-col gap-2 rounded-xl bg-surface p-4">
        <h2 id="statistiky-nadpis" className="text-sm font-semibold uppercase tracking-wide text-muted">
          Statistiky
        </h2>
        <p className="text-sm font-medium" data-testid="pocet-ochutnanych">
          Ochutnáno {tasted.size} z {ingredients.length} surovin
        </p>
        <ul className="flex flex-col gap-1 text-sm">
          {INGREDIENT_CATEGORIES.map((category) => {
            const all = ingredients.filter((item) => item.category === category);
            const done = all.filter((item) => tasted.has(item.id)).length;
            return (
              <li key={category} className="flex justify-between gap-2">
                <span className="min-w-0 text-muted">{CATEGORY_LABELS[category]}</span>
                <span className="shrink-0 font-medium">
                  {done} / {all.length}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="text-sm">
          <strong className="font-semibold">Oblíbené: </strong>
          {favorites.length === 0
            ? 'zatím nic označeného'
            : favorites.map((id) => ingredientById.get(id)?.nameCz ?? id).join(', ')}
        </p>
        <p className="text-sm">
          <strong className="font-semibold">Odmítnuté: </strong>
          {refused.length === 0
            ? 'zatím nic'
            : refused.map((id) => ingredientById.get(id)?.nameCz ?? id).join(', ')}
        </p>
        <p className="text-xs leading-relaxed text-muted">
          Odmítnutí je normální a opakovaná nabídka je běžná. Některé suroviny potřebují deset i víc
          setkání, než je dítě přijme.
        </p>
      </section>

      <section aria-labelledby="alergeny-nadpis" className="flex flex-col gap-2 rounded-xl bg-surface p-4">
        <h2 id="alergeny-nadpis" className="text-sm font-semibold uppercase tracking-wide text-muted">
          Klíčové alergeny
        </h2>
        <ul className="flex flex-col gap-2" data-testid="karta-alergenu">
          {KEY_ALLERGENS.map((allergen) => {
            const events = state.tastings.filter((event) =>
              ingredientById.get(event.ingredientId)?.allergens.includes(allergen),
            );
            const clean = events.filter((event) => !isAdverse(event));
            const last = events.map((event) => event.date).sort().at(-1);
            const introduced = clean.length >= 3;
            return (
              <li key={allergen} className="flex flex-wrap items-baseline justify-between gap-x-2 text-sm">
                <span className="font-medium">{ALLERGEN_LABELS[allergen]}</span>
                <span className="text-xs text-muted">
                  {events.length} expozic{last === undefined ? '' : ` · naposledy ${formatDate(last)}`}
                  {introduced ? ' · zavedený' : ''}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="text-xs leading-relaxed text-muted">
          Zavedený = 3 a více expozic bez reakce. Aplikace nediagnostikuje alergii; při jakékoli
          reakci se ptej pediatričky.
        </p>
      </section>

      <section aria-labelledby="tipy-nadpis" className="flex flex-col gap-2 rounded-xl bg-surface p-4">
        <h2 id="tipy-nadpis" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted">
          <Sparkles aria-hidden="true" className="h-4 w-4 shrink-0" />
          Co dnes zkusit?
        </h2>
        {tips.length === 0 ? (
          <p className="text-sm text-muted">Pro tenhle věk a sezónu už je všechno ochutnané.</p>
        ) : (
          <ul className="flex flex-col gap-2" data-testid="tipy-dne">
            {tips.map((item) => (
              <li key={item.id}>
                <Link
                  to={`/suroviny/${item.id}`}
                  className="flex min-h-touch flex-col gap-1 rounded-xl bg-paper p-3 text-sm"
                >
                  <span className="font-medium">{item.nameCz}</span>
                  <ChokingBadge risk={item.chokingRisk} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="osa-nadpis" className="flex flex-col gap-3">
        <h2 id="osa-nadpis" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted">
          <CalendarDays aria-hidden="true" className="h-4 w-4 shrink-0" />
          Časová osa
        </h2>
        {byDay.length === 0 ? (
          <p className="rounded-xl bg-surface p-4 text-sm text-muted" data-testid="prazdny-denik">
            Zatím žádná ochutnávka. Zaškrtni surovinu v katalogu a objeví se tady.
          </p>
        ) : (
          <ul className="flex flex-col gap-3" data-testid="casova-osa">
            {byDay.map(([date, events]) => (
              <li key={date} className="flex flex-col gap-2 rounded-xl bg-surface p-3">
                <p className="text-sm font-semibold">{formatDate(date)}</p>
                <ul className="flex flex-col gap-2">
                  {events.map((event) => {
                    const ingredient = ingredientById.get(event.ingredientId);
                    return (
                      <li key={event.id} className="flex flex-col gap-1">
                        <Link
                          to={`/suroviny/${event.ingredientId}`}
                          className="flex min-h-touch items-center justify-between gap-2 text-sm"
                        >
                          <span className="min-w-0 font-medium text-accent">
                            {ingredient?.nameCz ?? event.ingredientId}
                          </span>
                          <span className="shrink-0 text-xs text-muted">
                            {AMOUNT_LABELS[event.amount]} · {REACTION_LABELS[event.reaction]}
                          </span>
                        </Link>
                        {ingredient !== undefined && <ChokingBadge risk={ingredient.chokingRisk} />}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ChokingLegend />
    </section>
  );
}
