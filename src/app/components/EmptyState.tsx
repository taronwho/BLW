import type { ReactNode } from 'react';

/**
 * Prázdný stav je nabídka, ne chybová hláška (docs/SPEC.md kapitola 4.1).
 */
export function EmptyState({ hint, action }: { hint: string; action?: ReactNode }): ReactNode {
  return (
    <div data-testid="prazdny-stav" className="flex flex-col items-center gap-3 rounded-xl bg-surface px-4 py-8 text-center">
      <p className="text-sm text-muted">{hint}</p>
      {action}
    </div>
  );
}
