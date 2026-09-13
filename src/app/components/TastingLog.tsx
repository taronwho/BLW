import { Pencil, Plus, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { useHouseholdStore } from '@/storage/householdStore';
import type { TastingEvent } from '@/types';
import { AMOUNT_LABELS, REACTION_LABELS, formatDate } from '../lib/labels';
import { draftPayload, emptyDraft } from '../lib/tastingDraft';
import type { Draft } from '../lib/tastingDraft';
import { TastingForm } from './TastingForm';

/**
 * Zápis ochutnávek u suroviny.
 *
 * Oproti dřívějšímu jednomu klepnutí tu rodič vybírá množství i reakci, může
 * připsat vlastní poznámku, záznam opravit a hlavně ho smazat — omylem
 * přidaná ochutnávka se dřív vzít zpět nedala. Formulář je stejný jako ten,
 * který se otevírá z fajfky v seznamu surovin.
 */
export function TastingLog({
  ingredientId,
  ingredientName,
  history,
  initiallyAdding = false,
  addTestId,
  onSaved,
}: {
  ingredientId: string;
  ingredientName: string;
  history: readonly TastingEvent[];
  /** V okénku z fajfky je formulář rovnou otevřený — proto se tam kleplo. */
  initiallyAdding?: boolean;
  /** Vlastní testId tlačítka, aby se dvě instance na stránce nepraly. */
  addTestId?: string;
  /** Zavolá se po uložení; okénko se podle toho zavře. */
  onSaved?: () => void;
}): ReactNode {
  const recordTasting = useHouseholdStore((store) => store.recordTasting);
  const updateTasting = useHouseholdStore((store) => store.updateTasting);
  const deleteTasting = useHouseholdStore((store) => store.deleteTasting);
  const status = useHouseholdStore((store) => store.status);
  const createdBy = status.kind === 'connected' ? status.uid : 'toto-zarizeni';

  const [adding, setAdding] = useState(initiallyAdding);
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
    const payload = draftPayload(draft);
    if (editingId !== null) {
      void updateTasting(editingId, { ...payload, note: payload.note });
    } else {
      void recordTasting({ ingredientId, ...payload, createdBy });
    }
    close();
    onSaved?.();
  }

  return (
    <div className="flex flex-col gap-3">
      {!adding && editingId === null && (
        <button
          type="button"
          onClick={startAdd}
          data-testid={addTestId ?? `ochutnano-${ingredientId}`}
          aria-label={`${ingredientName}: zapsat ochutnávku`}
          className="flex min-h-touch items-center justify-center gap-2 rounded-xl border border-accent bg-accent-soft px-4 text-sm font-semibold text-accent"
        >
          <Plus aria-hidden="true" className="h-5 w-5 shrink-0" />
          Zapsat ochutnávku
        </button>
      )}

      {adding && (
        <TastingForm
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
                <TastingForm
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
