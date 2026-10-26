import { Check, Circle } from 'lucide-react';
import type { ReactNode } from 'react';
import { useHouseholdStore } from '@/storage/householdStore';
import { jeSnezeno, type Plan } from '@/plan/typy';

/**
 * Odškrtnutí jednoho jídla dne jako snědeného.
 *
 * Den se odškrtává až večer, ale snídaně je snědená ráno a rodič si to chce
 * poznamenat hned, dokud ví, co dítě opravdu jedlo. Jídlo se odškrtává samo
 * a den zůstává na rodiči: odškrtnutí dne zapisuje novinku do deníku a to
 * se samo od sebe dít nemá.
 */
export function SnezenoTlacitko({
  plan,
  cislo,
  poradi,
  nazev,
  siroke = false,
}: {
  plan: Plan;
  cislo: number;
  poradi: number;
  /** Co se jí, pro odečítač obrazovky. Vidět je to o řádek vedle. */
  nazev: string;
  /** Přes celou šířku karty v detailu dne; v přehledu jen štítek. */
  siroke?: boolean;
}): ReactNode {
  const nastavSnezeno = useHouseholdStore((store) => store.nastavSnezeno);
  const snedeno = jeSnezeno(plan, cislo, poradi);
  const ikona = snedeno ? (
    <Check aria-hidden="true" className="h-4 w-4 shrink-0" />
  ) : (
    <Circle aria-hidden="true" className="h-4 w-4 shrink-0" />
  );
  return (
    <button
      type="button"
      data-testid={`jidlo-snezeno-${poradi}`}
      aria-pressed={snedeno}
      aria-label={`${nazev}: snědeno`}
      onClick={() => void nastavSnezeno(plan.childId, cislo, poradi, !snedeno)}
      className={`flex min-h-touch shrink-0 items-center justify-center gap-1.5 rounded-xl border px-2.5 text-xs font-semibold transition-colors ${
        siroke ? 'w-full' : ''
      } ${
        snedeno
          ? 'border-accent bg-accent text-on-accent'
          : 'border-accent/50 bg-accent/10 text-accent'
      }`}
    >
      {ikona}
      {snedeno ? 'Snědeno' : siroke ? 'Označit jako snědené' : 'Snědeno?'}
    </button>
  );
}
