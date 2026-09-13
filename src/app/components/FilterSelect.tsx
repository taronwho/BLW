import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';

export interface SelectOption {
  id: string;
  label: string;
}

interface Props {
  label: string;
  options: readonly SelectOption[];
  selected: string;
  onSelect: (id: string) => void;
  testId?: string;
  /** Užší odsazení, když jsou dvě nabídky vedle sebe v jednom řádku. */
  compact?: boolean;
  /**
   * Hodnota, která nic neomezuje. Jen při jiné se nabídka zvýrazní, aby bylo
   * poznat, že filtr běží. U řazení je výchozí „abeceda", ne „vše".
   */
  neutralId?: string;
}

/**
 * Rozbalovací nabídka pro dlouhé číselníky, typicky kategorie.
 *
 * Nahrazuje vodorovně scrollovatelné čipy — na mobilu se nemuselo scrollovat
 * do boku, aby rodič viděl, že nějaká kategorie vůbec existuje. Nativní
 * `select` navíc otevírá systémový výběr, který se ovládá jedním palcem.
 */
export function FilterSelect({
  label,
  options,
  selected,
  onSelect,
  testId,
  compact = false,
  neutralId = 'vse',
}: Props): ReactNode {
  const active = selected !== neutralId;
  return (
    <label className="relative flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</span>
      <span className="relative block">
        <select
          value={selected}
          data-testid={testId}
          aria-label={label}
          onChange={(event) => onSelect(event.target.value)}
          className={`min-h-touch w-full appearance-none truncate rounded-2xl border text-sm font-medium shadow-soft transition ${
            compact ? 'px-3 pr-8' : 'px-4 pr-10'
          } ${
            active ? 'border-accent bg-accent-soft text-accent' : 'border-line bg-surface text-ink'
          }`}
        >
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 ${
            compact ? 'right-2' : 'right-3'
          } ${
            active ? 'text-accent' : 'text-muted'
          }`}
        />
      </span>
    </label>
  );
}
