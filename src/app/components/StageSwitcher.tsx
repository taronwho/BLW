import type { ReactNode } from 'react';
import { STAGES, type Stage } from '@/types';
import { stageLabel } from '@/lib/age';

interface Props {
  value: Stage;
  onChange: (stage: Stage) => void;
  /** Fáze odpovídající věku dcery — označí se jako doporučená. */
  suggested?: Stage;
}

export function StageSwitcher({ value, onChange, suggested }: Props): ReactNode {
  return (
    <div role="group" aria-label="Věková fáze" className="flex gap-1 rounded-xl bg-paper p-1">
      {STAGES.map((stage) => {
        const active = stage === value;
        return (
          <button
            key={stage}
            type="button"
            onClick={() => onChange(stage)}
            aria-pressed={active}
            data-testid={`faze-${stage}`}
            className={`min-h-touch flex-1 rounded-lg px-2 py-2 text-sm font-semibold ${
              active ? 'bg-accent text-white' : 'text-muted'
            }`}
          >
            {stageLabel(stage)}
            {suggested === stage && !active && <span className="sr-only"> (podle věku)</span>}
          </button>
        );
      })}
    </div>
  );
}
