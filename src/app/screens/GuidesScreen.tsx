import { AlertTriangle, ChevronRight, Search } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { guidesByUrgency } from '@/data';
import { GUIDE_CATEGORIES } from '@/types';
import { FilterSelect } from '../components/FilterSelect';
import type { SelectOption } from '../components/FilterSelect';
import { GUIDE_CATEGORY_LABELS } from '../lib/labels';
import { normalize } from '@/safety/text';

const CATEGORY_OPTIONS: readonly SelectOption[] = [
  { id: 'vse', label: 'Všechny okruhy' },
  ...GUIDE_CATEGORIES.map((category) => ({ id: category, label: GUIDE_CATEGORY_LABELS[category] })),
];

/** Seznam rad. Naléhavé jsou vždy nahoře a odlišené barvou. */
export function GuidesScreen(): ReactNode {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('vse');

  const visible = useMemo(() => {
    const needle = normalize(query);
    return guidesByUrgency.filter((guide) => {
      if (category !== 'vse' && guide.category !== category) return false;
      if (needle.length === 0) return true;
      const haystack = normalize(
        [guide.titleCz, guide.summary, ...guide.keyPoints, ...guide.sections.map((s) => s.heading)].join(' '),
      );
      return haystack.includes(needle);
    });
  }, [query, category]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold">Rady</h1>
        <p className="mt-1 text-sm text-muted">
          Co se nevejde ke konkrétní surovině: bezpečnost u stolu, železo a zinek, start příkrmu
          a praktický provoz.
        </p>
      </div>

      <label className="flex min-h-touch items-center gap-2 rounded-2xl border border-line bg-surface px-3 shadow-soft">
        <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-muted" />
        <span className="sr-only">Hledat radu</span>
        <input
          type="search"
          value={query}
          data-testid="hledat-radu"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Hledej: dušení, železo, alergeny…"
          className="min-h-touch w-full min-w-0 bg-transparent text-base outline-none"
        />
      </label>

      <FilterSelect
        label="Okruh"
        options={CATEGORY_OPTIONS}
        selected={category}
        onSelect={setCategory}
        testId="filtr-okruhu"
      />

      <p className="text-xs text-muted" data-testid="pocet-rad">
        {visible.length} rad
      </p>

      <ul className="flex flex-col gap-3" data-testid="seznam-rad">
        {visible.map((guide) => {
          const urgent = guide.urgent === true;
          return (
            <li key={guide.id}>
              <Link
                to={`/rady/${guide.id}`}
                data-testid={`odkaz-rada-${guide.id}`}
                className={`flex items-start gap-3 rounded-2xl border p-4 shadow-soft transition hover:shadow-lift ${
                  urgent ? 'border-risk/35 bg-risk-soft' : 'border-line bg-surface hover:border-accent/40'
                }`}
              >
                {urgent && (
                  <AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-risk" />
                )}
                <span className="min-w-0 flex-1">
                  <span
                    className={`block text-base font-semibold ${urgent ? 'text-risk' : 'text-ink'}`}
                  >
                    {guide.titleCz}
                  </span>
                  <span className="mt-1 block text-sm leading-snug text-ink/75">{guide.summary}</span>
                  <span className="mt-2 inline-block rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
                    {GUIDE_CATEGORY_LABELS[guide.category]}
                  </span>
                </span>
                <ChevronRight aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-muted" />
              </Link>
            </li>
          );
        })}
      </ul>

      {visible.length === 0 && (
        <p data-testid="prazdny-stav" className="rounded-2xl bg-surface p-6 text-center text-sm text-muted">
          Žádná rada tomuhle hledání neodpovídá.
        </p>
      )}
    </div>
  );
}
