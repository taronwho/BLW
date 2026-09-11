import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Check, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ingredients as catalogIngredients } from '@/data/ingredients';
import { INGREDIENT_CATEGORIES, type IngredientCategory } from '@/types';
import { CATEGORY_LABELS } from '@/lib/labels';
import { byCzechName, searchIngredients } from '@/lib/search';
import { applyQuickFilter, emptyStateHint, filterByCategory, QUICK_FILTERS, type QuickFilter } from '@/lib/filters';
import { stageLabel } from '@/lib/age';
import { stageForAge } from '@/lib/age';
import { useHouseholdStore } from '@/storage/householdStore';
import { useHousehold } from './useHousehold';
import { Chip, ChipRow } from './components/Chips';
import { EmptyState } from './components/EmptyState';
import { RiskBadge } from './components/RiskBadge';

export function IngredientsScreen(): ReactNode {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<IngredientCategory | null>(null);
  const [filter, setFilter] = useState<QuickFilter>('vse');
  const { filterContext, ageMonths } = useHousehold();
  const { recordTasting } = useHouseholdStore();

  const visible = useMemo(() => {
    const searched = searchIngredients(catalogIngredients, query);
    const byCategory = filterByCategory(searched, category);
    const filtered = applyQuickFilter(byCategory, filter, filterContext);
    return byCzechName(filtered, (i) => i.nameCz);
  }, [query, category, filter, filterContext]);

  return (
    <section aria-labelledby="suroviny-nadpis" className="flex flex-col gap-3">
      <h1 id="suroviny-nadpis" className="text-lg font-semibold">
        Suroviny
      </h1>

      <label className="relative block">
        <span className="sr-only">Hledat surovinu</span>
        <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Hledat (i bez diakritiky)"
          data-testid="hledani"
          className="min-h-touch w-full rounded-xl border border-muted/30 bg-surface py-2 pl-9 pr-3"
        />
      </label>

      <ChipRow label="Rychlé filtry">
        {QUICK_FILTERS.map(({ id, label }) => (
          <Chip key={id} label={label} active={filter === id} onClick={() => setFilter(id)} />
        ))}
      </ChipRow>

      <ChipRow label="Kategorie">
        <Chip label="Všechny" active={category === null} onClick={() => setCategory(null)} />
        {INGREDIENT_CATEGORIES.map((id) => (
          <Chip
            key={id}
            label={CATEGORY_LABELS[id]}
            active={category === id}
            onClick={() => setCategory(id)}
          />
        ))}
      </ChipRow>

      <p className="text-xs text-muted" data-testid="pocet-surovin">
        {visible.length} z {catalogIngredients.length} surovin
      </p>

      {visible.length === 0 ? (
        <EmptyState
          hint={emptyStateHint(filter, category, query)}
          action={
            filter !== 'vse' || category !== null || query !== '' ? (
              <button
                type="button"
                onClick={() => {
                  setFilter('vse');
                  setCategory(null);
                  setQuery('');
                }}
                className="min-h-touch rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
              >
                Zrušit filtry
              </button>
            ) : undefined
          }
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {visible.map((item) => {
            const tasted = filterContext.tastedIds.has(item.id);
            const stage = ageMonths === null ? '6m' : stageForAge(ageMonths);
            return (
              <li key={item.id} className="flex items-center gap-2 rounded-xl bg-surface p-3">
                <Link to={`/suroviny/${item.id}`} className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="flex items-center gap-2 font-medium">
                    {item.emoji !== undefined && <span aria-hidden="true">{item.emoji}</span>}
                    <span className="min-w-0 break-words">{item.nameCz}</span>
                  </span>
                  <span className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full bg-paper px-2 py-0.5 text-[11px] text-muted">
                      od {item.minAgeMonths} m · {stageLabel(stage)}
                    </span>
                    <RiskBadge risk={item.chokingRisk} compact />
                  </span>
                </Link>
                <button
                  type="button"
                  aria-label={tasted ? `${item.nameCz} — ochutnáno` : `Označit ${item.nameCz} jako ochutnáno`}
                  aria-pressed={tasted}
                  onClick={() => {
                    if (tasted) return;
                    void recordTasting({
                      ingredientId: item.id,
                      date: new Date().toISOString().slice(0, 10),
                      amount: 'ochutnala',
                      reaction: 'zadna',
                      createdBy: 'toto-zarizeni',
                    });
                  }}
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                    tasted ? 'border-safe bg-safe/10 text-safe' : 'border-muted/30 text-muted'
                  }`}
                >
                  <Check aria-hidden="true" className="h-5 w-5" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
