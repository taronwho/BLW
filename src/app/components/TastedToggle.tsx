import { Check, Plus, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useModalFokus } from '../lib/modalFokus';
import { Link } from 'react-router-dom';
import { useHouseholdStore } from '@/storage/householdStore';
import { activeTastings } from '../lib/derive';
import { useAktivniDiteId } from '../lib/dite';
import { TastingLog } from './TastingLog';

interface Props {
  ingredientId: string;
  ingredientName: string;
  tasted: boolean;
}

/**
 * Zápis ochutnávky rovnou ze seznamu surovin.
 *
 * Dřív tohle tlačítko jedním klepnutím uložilo „ochutnala / bez reakce" a
 * omyl se nedal vzít zpět. Teď otevře tutéž nabídku jako detail suroviny:
 * kolik dítě snědlo, jaká byla reakce, vlastní poznámka — a pod tím
 * dosavadní záznamy, které jdou opravit i smazat. Jedna věc, jedno ovládání.
 */
export function TastedToggle({ ingredientId, ingredientName, tasted }: Props): ReactNode {
  const state = useHouseholdStore((store) => store.state);
  const diteId = useAktivniDiteId();
  const [open, setOpen] = useState(false);
  // Fokus do okénka, Tab uvnitř a po zavření zpátky na tlačítko.
  const okenko = useModalFokus<HTMLDivElement>(open);

  const history = useMemo(
    () =>
      activeTastings(state, diteId)
        .filter((event) => event.ingredientId === ingredientId)
        .sort((a, b) =>
          a.date < b.date ? 1 : a.date > b.date ? -1 : b.createdAt - a.createdAt,
        ),
    [state, diteId, ingredientId],
  );

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        data-testid={`ochutnano-${ingredientId}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={
          tasted
            ? `${ingredientName}: ochutnáno, otevřít záznamy`
            : `${ingredientName}: zapsat ochutnávku`
        }
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen(true);
        }}
        className={`flex min-h-touch min-w-touch shrink-0 items-center justify-center rounded-xl border px-3 transition ${
          tasted
            ? 'border-safe bg-safe/10 text-safe'
            : 'border-line bg-surface text-muted hover:border-accent hover:text-accent'
        }`}
      >
        {tasted ? (
          <Check aria-hidden="true" className="h-5 w-5 shrink-0" />
        ) : (
          <Plus aria-hidden="true" className="h-5 w-5 shrink-0" />
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Ochutnávka. ${ingredientName}`}
          data-testid="okenko-ochutnavky"
          className="fixed inset-0 z-50 flex items-end justify-center bg-scrim/50 p-3 sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            ref={okenko}
            className="flex max-h-[85vh] w-full max-w-md flex-col gap-3 overflow-y-auto rounded-2xl bg-surface p-4 shadow-lift"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2">
              <h2 className="min-w-0 text-base font-bold">{ingredientName}</h2>
              <button
                type="button"
                data-testid="ochutnavka-zavrit"
                aria-label="Zavřít"
                onClick={() => setOpen(false)}
                className="flex min-h-touch min-w-touch shrink-0 items-center justify-center rounded-lg text-muted"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <TastingLog
              ingredientId={ingredientId}
              ingredientName={ingredientName}
              history={history}
              initiallyAdding
              addTestId={`okenko-pridat-${ingredientId}`}
              onSaved={() => setOpen(false)}
            />

            <Link
              to={`/suroviny/${ingredientId}`}
              className="flex min-h-touch items-center justify-center rounded-xl border border-line bg-paper px-4 text-sm font-medium"
            >
              Otevřít surovinu
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
