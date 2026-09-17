import { Check, X } from 'lucide-react';
import type { ReactNode } from 'react';
import type { TastingAmount, TastingReaction } from '@/types';
import { TASTING_AMOUNTS, TASTING_REACTIONS } from '@/types';
import { AMOUNT_LABELS, REACTION_LABELS } from '../lib/labels';
import type { Draft } from '../lib/tastingDraft';

const AMOUNTS: readonly TastingAmount[] = TASTING_AMOUNTS;
const REACTIONS: readonly TastingReaction[] = TASTING_REACTIONS;

/** Reakce, u kterých se ukáže připomínka, že rozhoduje pediatr. */
const ADVERSE: ReadonlySet<TastingReaction> = new Set(['kozni', 'travici', 'jina']);

function ChoiceRow<T extends string>({
  legend,
  options,
  labels,
  value,
  onChange,
  testId,
}: {
  legend: string;
  options: readonly T[];
  labels: Record<T, string>;
  value: T;
  onChange: (value: T) => void;
  testId: string;
}): ReactNode {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="text-[11px] font-semibold uppercase tracking-wide text-muted">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2" data-testid={testId}>
        {options.map((option) => {
          const active = option === value;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              data-testid={`${testId}-${option}`}
              onClick={() => onChange(option)}
              className={`min-h-touch rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                active
                  ? 'border-accent bg-accent text-on-accent shadow-soft'
                  : 'border-line bg-surface text-ink'
              }`}
            >
              {labels[option]}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/**
 * Rozepsaná ochutnávka: datum, kolik dítě snědlo, reakce a vlastní poznámka.
 *
 * Bydlí zvlášť, protože se otevírá ze dvou míst — v detailu suroviny pod
 * historií a rovnou ze seznamu surovin po klepnutí na fajfku. Dvě různé
 * nabídky pro tutéž věc by rodiče jen mátly.
 */
export function TastingForm({
  draft,
  setDraft,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  draft: Draft;
  setDraft: (draft: Draft) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
}): ReactNode {
  return (
    <form
      className="flex flex-col gap-3 rounded-2xl border border-line bg-paper p-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label className="flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">Datum</span>
        <input
          type="date"
          value={draft.date}
          data-testid="ochutnavka-datum"
          onChange={(event) => setDraft({ ...draft, date: event.target.value })}
          className="min-h-touch rounded-xl border border-line bg-surface px-3 text-sm"
        />
      </label>

      <ChoiceRow
        legend="Kolik snědlo"
        options={AMOUNTS}
        labels={AMOUNT_LABELS}
        value={draft.amount}
        onChange={(amount) => setDraft({ ...draft, amount })}
        testId="volba-mnozstvi"
      />

      <ChoiceRow
        legend="Reakce"
        options={REACTIONS}
        labels={REACTION_LABELS}
        value={draft.reaction}
        onChange={(reaction) => setDraft({ ...draft, reaction })}
        testId="volba-reakce"
      />

      {ADVERSE.has(draft.reaction) && (
        <p className="rounded-xl border border-caution/40 bg-caution-soft px-3 py-2 text-xs leading-relaxed">
          Aplikace alergii nediagnostikuje. Při otoku rtů či víček, dušnosti, zvracení s bledostí
          nebo náhlé ochablosti volej <strong>155</strong>; jinak reakci prober s pediatrem.
        </p>
      )}

      <label className="flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          Poznámka
        </span>
        <textarea
          value={draft.note}
          rows={2}
          maxLength={500}
          data-testid="ochutnavka-poznamka"
          onChange={(event) => setDraft({ ...draft, note: event.target.value })}
          placeholder="Vlastní poznámka: jak to podávali, co šlo, co příště jinak…"
          className="rounded-xl border border-line bg-surface px-3 py-2 text-sm"
        />
      </label>

      <div className="flex gap-2">
        <button
          type="submit"
          data-testid="ochutnavka-ulozit"
          className="flex min-h-touch flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-on-accent"
        >
          <Check aria-hidden="true" className="h-4 w-4" />
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          data-testid="ochutnavka-zrusit"
          className="flex min-h-touch items-center justify-center gap-1 rounded-xl border border-line bg-surface px-4 text-sm font-medium"
        >
          <X aria-hidden="true" className="h-4 w-4" />
          Zrušit
        </button>
      </div>
    </form>
  );
}
