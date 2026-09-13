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
 * Čipy zalomené do řádků — všechny možnosti jsou vidět najednou.
 *
 * Dřív se scrollovalo do boku a část filtrů zůstávala schovaná mimo obraz.
 * Pro dlouhé číselníky (kategorie) se místo čipů používá FilterSelect.
 */
export function FilterChips({ options, selected, onSelect, ariaLabel, testId }: Props): ReactNode {
  return (
    <div role="group" aria-label={ariaLabel} data-testid={testId} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option.id === selected;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            data-testid={`chip-${option.id}`}
            onClick={() => onSelect(option.id)}
            className={`min-h-touch rounded-full border px-4 py-2 text-sm font-medium transition ${
              active
                ? 'border-accent bg-accent text-on-accent shadow-soft'
                : 'border-line bg-surface text-ink hover:border-accent/40'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
