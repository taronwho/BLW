import type { ReactNode } from 'react';

interface ChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

/** Vodorovně scrollovatelné čipy. Dotykový cíl nikdy pod 44 px. */
export function Chip({ label, active, onClick }: ChipProps): ReactNode {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-touch shrink-0 whitespace-nowrap rounded-full border px-3 py-2 text-sm font-medium ${
        active ? 'border-accent bg-accent text-white' : 'border-muted/30 bg-surface text-ink'
      }`}
    >
      {label}
    </button>
  );
}

export function ChipRow({ children, label }: { children: ReactNode; label: string }): ReactNode {
  return (
    <div
      role="group"
      aria-label={label}
      // -mx-4 + px-4: čipy se scrollují až k okraji displeje, ale text
      // nezačíná nalepený na hraně.
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {children}
    </div>
  );
}
