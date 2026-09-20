import { Minus, Plus, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useModalFokus } from '../lib/modalFokus';
import { zmenMnozstvi } from '@/nakup/mnozstvi';

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
 *
 * Vedle pole stojí minus a plus. Psát „600 g" na mobilní klávesnici jednou
 * rukou v obchodě je práce navíc, když rodič chce jen o jedno balení víc.
 * Krokuje se po padesáti u gramů a mililitrů, jinak po jedné, a hodnota
 * mimo krok se zarovná — z „120 g" udělá plus „150 g", ne „170 g".
 * U zápisu, který se rozebrat nedá („balíček"), není co krokovat, takže
 * jsou obě tlačítka vypnutá a zůstává psaní.
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
  const nahoru = zmenMnozstvi(text, 1);
  const dolu = zmenMnozstvi(text, -1);
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

        <div className="flex flex-col gap-1">
          <label htmlFor="mnozstvi-pole" className="text-xs font-semibold text-muted">
            Množství
          </label>
          <div className="flex items-stretch gap-2">
            <button
              type="button"
              disabled={dolu === null}
              aria-label="O krok míň"
              data-testid="mnozstvi-min"
              onClick={() => dolu !== null && setText(dolu)}
              className="flex min-h-touch min-w-touch shrink-0 items-center justify-center rounded-xl border border-line bg-paper text-accent disabled:opacity-40"
            >
              <Minus aria-hidden="true" className="h-5 w-5" />
            </button>
            <input
              id="mnozstvi-pole"
              type="text"
              value={text}
              autoFocus
              data-testid="mnozstvi-pole"
              onChange={(event) => setText(event.target.value)}
              placeholder="třeba 500 g, 2 ks nebo balíček"
              className="min-h-touch min-w-0 flex-1 rounded-xl border border-line bg-paper px-3 text-center text-base"
            />
            <button
              type="button"
              disabled={nahoru === null}
              aria-label="O krok víc"
              data-testid="mnozstvi-plus"
              onClick={() => nahoru !== null && setText(nahoru)}
              className="flex min-h-touch min-w-touch shrink-0 items-center justify-center rounded-xl border border-line bg-paper text-accent disabled:opacity-40"
            >
              <Plus aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        </div>

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
