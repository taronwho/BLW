import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';

interface RozbalovaciFiltryProps {
  /** Kolik podrobných filtrů je zapnutých. Ukáže se na tlačítku. */
  aktivnich: number;
  /** Vždy viditelná část — kategorie a řazení. */
  zakladni: ReactNode;
  /** Část, která se skrývá. */
  podrobne: ReactNode;
  testId: string;
}

/**
 * Podrobné filtry schované pod tlačítkem.
 *
 * Rozbalené zabíraly na mobilu osmdesát procent první obrazovky a rodič
 * neviděl ani jednu celou kartu, dokud neposunul prstem. Kategorie a řazení
 * zůstávají venku, protože se používají nejčastěji; zbytek se rozbalí
 * klepnutím a počet zapnutých filtrů je vidět na tlačítku, aby nebylo
 * potřeba panel otvírat jen kvůli kontrole.
 */
export function RozbalovaciFiltry({
  aktivnich,
  zakladni,
  podrobne,
  testId,
}: RozbalovaciFiltryProps) {
  const [otevreno, setOtevreno] = useState(false);
  return (
    <div
      className="flex flex-col gap-3 rounded-2xl border border-line bg-surface/50 p-3"
      data-testid={testId}
    >
      {zakladni}
      <button
        type="button"
        aria-expanded={otevreno}
        onClick={() => setOtevreno((stav) => !stav)}
        data-testid={`${testId}-prepinac`}
        className="flex min-h-touch items-center gap-2 self-start rounded-xl px-2 text-sm font-medium text-accent"
      >
        <SlidersHorizontal aria-hidden="true" className="h-4 w-4 shrink-0" />
        Další filtry
        {aktivnich > 0 && (
          <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-surface">
            {aktivnich}
          </span>
        )}
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 transition-transform ${otevreno ? 'rotate-180' : ''}`}
        />
      </button>
      {/* Podmíněné vykreslení, ne atribut `hidden`: třída `flex` má vyšší
          specifičnost než `display: none` z atributu, takže by se panel
          neschoval. Navíc se tím ušetří vykreslení desítek tlačítek. */}
      {otevreno && <div className="flex flex-col gap-3">{podrobne}</div>}
    </div>
  );
}
