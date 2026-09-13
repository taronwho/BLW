import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export interface ToggleOption {
  id: string;
  label: string;
  Icon?: LucideIcon;
}

interface Props {
  options: readonly ToggleOption[];
  selected: readonly string[];
  onToggle: (id: string) => void;
  ariaLabel: string;
  testId?: string;
}

/**
 * Čipy, které se dají zaškrtnout naráz — vybrané podmínky se sčítají.
 *
 * Dotyková plocha zůstává 44 px (docs/SPEC.md kap. 6), ale vidět je menší
 * štítek. Jinak by se filtry roztáhly přes celou obrazovku a recept by rodič
 * uviděl až po odscrollování.
 */
export function FilterToggles({ options, selected, onToggle, ariaLabel, testId }: Props): ReactNode {
  return (
    <div role="group" aria-label={ariaLabel} data-testid={testId} className="flex flex-wrap gap-x-2">
      {options.map(({ id, label, Icon }) => {
        const active = selected.includes(id);
        return (
          <button
            key={id}
            type="button"
            aria-pressed={active}
            data-testid={`prepinac-${id}`}
            onClick={() => onToggle(id)}
            className="flex min-h-touch items-center"
          >
            <span
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
                active
                  ? 'border-accent bg-accent text-on-accent shadow-soft'
                  : 'border-line bg-surface text-ink'
              }`}
            >
              {Icon !== undefined && <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />}
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
