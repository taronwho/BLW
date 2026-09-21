import { SearchX } from 'lucide-react';
import type { ReactNode } from 'react';
import { useUrlBatch } from '../lib/urlState';
import type { UrlHodnota } from '../lib/urlState';

/**
 * Prázdný stav filtru není chybová hláška, ale nabídka.
 *
 * `docs/SPEC.md` kap. 4.1 to říká i s příkladem: „Nic neodpovídá. Zkus
 * zrušit filtr sezóny." Dosud tu stála rada, co by rodič mohl zkusit —
 * jenže poradit a nechat ho to proklikat je právě to, co nabídka není
 * (audit 17. 9. 2026, kapitola 10 bod 1).
 *
 * Nabízí se jen filtry, které jsou **opravdu zapnuté**. Tlačítko „zrušit
 * filtr sezóny" u někoho, kdo sezónu nezapnul, by mátlo víc než ticho.
 */
export interface ZapnutyFiltr {
  /** Jak se filtr jmenuje v nabídce: „sezóna", „jen oblíbené", „bez mléka". */
  popis: string;
  /** Co se zapíše do adresy, aby filtr zmizel. */
  zrus: Record<string, UrlHodnota>;
}

export interface PrazdnyStavProps {
  /** Co se nenašlo: „surovina", „recept". První pád jednotného čísla. */
  co: string;
  zapnute: readonly ZapnutyFiltr[];
  /** Zápis do adresy, který vypne všechno naráz. */
  zrusVse: Record<string, UrlHodnota>;
  testId?: string;
}

export function PrazdnyStav({
  co,
  zapnute,
  zrusVse,
  testId = 'prazdny-stav',
}: PrazdnyStavProps): ReactNode {
  const nastavFiltry = useUrlBatch();

  return (
    <div
      role="status"
      data-testid={testId}
      className="flex flex-col gap-3 rounded-xl bg-surface p-4"
    >
      <p className="flex items-start gap-2 text-sm">
        <SearchX aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
        <span>
          <strong className="font-semibold">Nic neodpovídá.</strong>{' '}
          {zapnute.length === 0
            ? `Žádná ${co} s tímhle názvem v katalogu není. Zkus jiné slovo nebo jeho část.`
            : 'Nejspíš je podmínek najednou moc. Ubrat se dá rovnou tady:'}
        </span>
      </p>

      {zapnute.length > 0 && (
        <ul className="flex flex-wrap gap-2" data-testid={`${testId}-nabidky`}>
          {zapnute.map((filtr) => (
            <li key={filtr.popis}>
              <button
                type="button"
                onClick={() => nastavFiltry(filtr.zrus)}
                className="flex min-h-touch items-center rounded-xl border border-line bg-paper px-3 text-sm font-medium"
              >
                Zrušit {filtr.popis}
              </button>
            </li>
          ))}
          {/* Až od dvou zapnutých filtrů. U jediného by tohle tlačítko
              dělalo přesně totéž co to vedle a jen zdržovalo. */}
          {zapnute.length > 1 && (
            <li>
              <button
                type="button"
                data-testid={`${testId}-zrusit-vse`}
                onClick={() => nastavFiltry(zrusVse)}
                className="flex min-h-touch items-center rounded-xl border-2 border-accent bg-accent/10 px-3 text-sm font-semibold text-accent"
              >
                Zrušit všechny filtry
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
