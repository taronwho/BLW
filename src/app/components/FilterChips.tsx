import type { ReactNode } from 'react';

export interface ChipOption {
  id: string;
  label: string;
}

interface Props {
  options: readonly ChipOption[];
  selected: string;
  onSelect: (id: string) => void;
  ariaLabel: string;
  testId?: string;
}

/**
 * Vodorovně scrollovatelné čipy. Scroll drží uvnitř kontejneru — stránka
 * sama nikdy nepřeteče (docs/SPEC.md kap. 6).
 */
export function FilterChips({ options, selected, onSelect, ariaLabel, testId }: Props): ReactNode {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      data-testid={testId}
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1"
    >
      {options.map((option) => {
        const active = option.id === selected;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            data-testid={`chip-${option.id}`}
            onClick={() => onSelect(option.id)}
            className={`min-h-touch shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium ${
              active ? 'border-accent bg-accent text-white' : 'border-muted/30 bg-surface text-ink'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
