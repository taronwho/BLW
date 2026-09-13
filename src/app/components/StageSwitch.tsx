import type { ReactNode } from 'react';
import type { Stage } from '@/types';
import { STAGES } from '@/types';
import { STAGE_LABELS } from '../lib/age';

interface Props {
  value: Stage;
  onChange: (stage: Stage) => void;
  /** Fáze odpovídající věku dítěte se označí, aby bylo vidět, co je „teď". */
  currentStage?: Stage;
  label?: string;
}

/** Přepínač fází 6m+ / 9m+ / 12m+ (docs/SPEC.md kap. 4.2). */
export function StageSwitch({ value, onChange, currentStage, label = 'Fáze' }: Props): ReactNode {
  return (
    <div className="flex flex-col gap-1" data-testid="prepinac-fazi">
      <span className="text-xs uppercase tracking-wide text-muted">{label}</span>
      <div role="group" aria-label="Přepínač fází" className="flex gap-2">
        {STAGES.map((stage) => {
          const active = stage === value;
          return (
            <button
              key={stage}
              type="button"
              aria-pressed={active}
              data-testid={`faze-${stage}`}
              onClick={() => onChange(stage)}
              className={`min-h-touch min-w-touch flex-1 rounded-xl border px-3 py-2 text-sm font-semibold ${
                active ? 'border-accent bg-accent text-on-accent' : 'border-muted/30 bg-surface text-ink'
              }`}
            >
              {STAGE_LABELS[stage]}
              {currentStage === stage && (
                <span className={`block text-[10px] font-medium ${active ? 'text-on-accent' : 'text-muted'}`}>
                  teď
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
