import { Check, Pencil, Plus, Trash2, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { useHouseholdStore } from '@/storage/householdStore';
import type { TastingAmount, TastingEvent, TastingReaction } from '@/types';
import { AMOUNT_LABELS, REACTION_LABELS, formatDate, todayIso } from '../lib/labels';

const AMOUNTS: readonly TastingAmount[] = ['ochutnala', 'snedla-cast', 'snedla-vse', 'odmitla'];
const REACTIONS: readonly TastingReaction[] = [
  'zadna',
  'chutnalo',
  'nelibilo',
  'kozni',
  'travici',
  'jina',
];

/** Reakce, u kterých se ukáže připomínka, že rozhoduje pediatr. */
const ADVERSE: ReadonlySet<TastingReaction> = new Set(['kozni', 'travici', 'jina']);

interface Draft {
  date: string;
  amount: TastingAmount;
  reaction: TastingReaction;
  note: string;
}

function emptyDraft(): Draft {
  return { date: todayIso(), amount: 'ochutnala', reaction: 'zadna', note: '' };
}

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
                  ? 'border-accent bg-accent text-white shadow-soft'
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

function DraftForm({
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
          className="flex min-h-touch flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-white"
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

/**
 * Zápis ochutnávek u suroviny.
 *
 * Oproti dřívějšímu jednomu klepnutí tu rodič vybírá množství i reakci, může
 * připsat vlastní poznámku, záznam opravit a hlavně ho smazat — omylem
 * přidaná ochutnávka se dřív vzít zpět nedala.
 */
export function TastingLog({
  ingredientId,
  ingredientName,
  history,
}: {
  ingredientId: string;
  ingredientName: string;
  history: readonly TastingEvent[];
}): ReactNode {
  const recordTasting = useHouseholdStore((store) => store.recordTasting);
  const updateTasting = useHouseholdStore((store) => store.updateTasting);
  const deleteTasting = useHouseholdStore((store) => store.deleteTasting);
  const status = useHouseholdStore((store) => store.status);
  const createdBy = status.kind === 'connected' ? status.uid : 'toto-zarizeni';

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);

  function startAdd(): void {
    setDraft(emptyDraft());
    setEditingId(null);
    setAdding(true);
  }

  function startEdit(event: TastingEvent): void {
    setDraft({
      date: event.date,
      amount: event.amount,
      reaction: event.reaction,
      note: event.note ?? '',
    });
    setAdding(false);
    setEditingId(event.id);
  }

  function close(): void {
    setAdding(false);
    setEditingId(null);
  }

  function submit(): void {
    const note = draft.note.trim();
    const payload = {
      date: draft.date,
      amount: draft.amount,
      reaction: draft.reaction,
      ...(note.length > 0 ? { note } : {}),
    };
    if (editingId !== null) {
      void updateTasting(editingId, { ...payload, note: note.length > 0 ? note : undefined });
    } else {
      void recordTasting({ ingredientId, ...payload, createdBy });
    }
    close();
  }

  return (
    <div className="flex flex-col gap-3">
      {!adding && editingId === null && (
        <button
          type="button"
          onClick={startAdd}
          data-testid={`ochutnano-${ingredientId}`}
          aria-label={`${ingredientName}: zapsat ochutnávku`}
          className="flex min-h-touch items-center justify-center gap-2 rounded-xl border border-accent bg-accent-soft px-4 text-sm font-semibold text-accent"
        >
          <Plus aria-hidden="true" className="h-5 w-5 shrink-0" />
          Zapsat ochutnávku
        </button>
      )}

      {adding && (
        <DraftForm
          draft={draft}
          setDraft={setDraft}
          onSubmit={submit}
          onCancel={close}
          submitLabel="Uložit ochutnávku"
        />
      )}

      {history.length === 0 ? (
        <p className="text-sm text-muted">Zatím nic. Odmítnutí je normální, nabízejte dál.</p>
      ) : (
        <ul className="flex flex-col gap-2" data-testid="historie-ochutnavek">
          {history.map((event) =>
            editingId === event.id ? (
              <li key={event.id}>
                <DraftForm
                  draft={draft}
                  setDraft={setDraft}
                  onSubmit={submit}
                  onCancel={close}
                  submitLabel="Uložit změnu"
                />
              </li>
            ) : (
              <li
                key={event.id}
                className="flex items-start gap-2 rounded-xl border border-line bg-surface px-3 py-2"
              >
                <span className="min-w-0 flex-1 text-sm">
                  <span className="font-medium">{formatDate(event.date)}</span>{' '}
                  <span className="text-muted">
                    {AMOUNT_LABELS[event.amount]} · {REACTION_LABELS[event.reaction]}
                  </span>
                  {event.note !== undefined && event.note.trim().length > 0 && (
                    <span className="mt-1 block text-sm italic text-ink/80">{event.note}</span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => startEdit(event)}
                  data-testid={`upravit-${event.id}`}
                  aria-label={`Upravit ochutnávku z ${formatDate(event.date)}`}
                  className="flex min-h-touch min-w-touch items-center justify-center rounded-lg text-muted hover:text-accent"
                >
                  <Pencil aria-hidden="true" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    void deleteTasting(event.id);
                  }}
                  data-testid={`smazat-${event.id}`}
                  aria-label={`Smazat ochutnávku z ${formatDate(event.date)}`}
                  className="flex min-h-touch min-w-touch items-center justify-center rounded-lg text-muted hover:text-risk"
                >
                  <Trash2 aria-hidden="true" className="h-4 w-4" />
                </button>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
}
