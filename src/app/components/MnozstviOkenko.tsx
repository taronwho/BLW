import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useModalFokus } from '../lib/modalFokus';

/**
 * Zadání množství.
 *
 * Používá se na dvou místech a schválně stejné: když si rodič přidává
 * surovinu sám (tam je předvyplněný návrh podle kuchařky) a když v seznamu
 * přepisuje, kolik čeho koupit. Obojí je tatáž otázka a nemá smysl, aby
 * vypadala pokaždé jinak.
 *
 * Pole je prostý text, ne číslo s výběrem jednotky. U regálu se píše
 * „1 kg", „2 ks" i „balíček" a rozdělit to do dvou ovladačů by znamenalo
 * dvě klepnutí navíc a seznam jednotek, do kterého se stejně všechno
 * nevejde. Co se rozebrat dá, sečte `src/nakup/mnozstvi.ts`; co ne,
 * zůstane vypsané tak, jak to rodič napsal.
 */
export function MnozstviOkenko({
  nadpis,
  vychozi,
  potvrzeni,
  muzeSmazat = false,
  onUloz,
  onZavri,
}: {
  nadpis: string;
  /** Předvyplněná hodnota. U přidání návrh podle kuchařky. */
  vychozi: string;
  /** Popisek potvrzovacího tlačítka, třeba „Přidat do nákupu". */
  potvrzeni: string;
  /** Smí rodič množství úplně smazat a vrátit se k součtu z receptů? */
  muzeSmazat?: boolean;
  onUloz: (mnozstvi: string) => void;
  onZavri: () => void;
}): ReactNode {
  const [text, setText] = useState(vychozi);
  const okenko = useModalFokus<HTMLFormElement>(true);

  // Escape zavírá, jako u každého okénka. Bez toho se z něj klávesnicí
  // vycouvá jen protabováním na křížek.
  useEffect(() => {
    function naKlavesu(event: KeyboardEvent): void {
      if (event.key === 'Escape') onZavri();
    }
    window.addEventListener('keydown', naKlavesu);
    return () => window.removeEventListener('keydown', naKlavesu);
  }, [onZavri]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={nadpis}
      data-testid="mnozstvi-okenko"
      className="fixed inset-0 z-50 flex items-end justify-center bg-scrim/50 p-3 sm:items-center"
      onClick={onZavri}
    >
      <form
        ref={okenko}
        className="flex w-full max-w-md flex-col gap-3 rounded-2xl bg-surface p-4 shadow-lift"
        onClick={(event) => event.stopPropagation()}
        onSubmit={(event) => {
          event.preventDefault();
          onUloz(text.trim());
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-bold">{nadpis}</h2>
          <button
            type="button"
            aria-label="Zavřít"
            onClick={onZavri}
            className="flex min-h-touch min-w-touch shrink-0 items-center justify-center rounded-lg text-muted"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-muted">Množství</span>
          <input
            type="text"
            value={text}
            autoFocus
            data-testid="mnozstvi-pole"
            onChange={(event) => setText(event.target.value)}
            placeholder="třeba 500 g, 2 ks nebo balíček"
            className="min-h-touch w-full rounded-xl border border-line bg-paper px-3 text-base"
          />
        </label>

        <div className="flex flex-col gap-2">
          <button
            type="submit"
            data-testid="mnozstvi-ulozit"
            className="flex min-h-touch items-center justify-center rounded-xl bg-accent px-4 text-sm font-semibold text-on-accent"
          >
            {potvrzeni}
          </button>
          {muzeSmazat && (
            <button
              type="button"
              data-testid="mnozstvi-podle-receptu"
              onClick={() => onUloz('')}
              className="flex min-h-touch items-center justify-center rounded-xl border border-line bg-paper px-4 text-sm font-medium text-muted"
            >
              Počítat zase z receptů
            </button>
          )}
        </div>
      </form>
    </div>,
    document.body,
  );
}
