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
  /**
   * Menší štítek uvnitř tlačítka. Dotyková plocha zůstává 44 px, jen se
   * vizuálně zmenší, aby řada voleb nezabrala půl obrazovky.
   */
  compact?: boolean;
}

/**
 * Čipy zalomené do řádků — všechny možnosti jsou vidět najednou.
 *
 * Dřív se scrollovalo do boku a část filtrů zůstávala schovaná mimo obraz.
 * Pro dlouhé číselníky (kategorie) se místo čipů používá FilterSelect.
 */
export function FilterChips({
  options,
  selected,
  onSelect,
  ariaLabel,
  testId,
  compact = false,
}: Props): ReactNode {
  const vzhled = (active: boolean): string =>
    active
      ? 'border-accent bg-accent text-on-accent shadow-soft'
      : 'border-line bg-surface text-ink hover:border-accent/40';

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      data-testid={testId}
      className={`flex flex-wrap ${compact ? 'gap-x-2' : 'gap-2'}`}
    >
      {options.map((option) => {
        const active = option.id === selected;
        if (compact) {
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              data-testid={`chip-${option.id}`}
              onClick={() => onSelect(option.id)}
              className="flex min-h-touch items-center"
            >
              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${vzhled(active)}`}
              >
                {option.label}
              </span>
            </button>
          );
        }
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            data-testid={`chip-${option.id}`}
            onClick={() => onSelect(option.id)}
            className={`min-h-touch rounded-full border px-4 py-2 text-sm font-medium transition ${vzhled(active)}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
