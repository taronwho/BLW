import { AlertTriangle, CircleAlert, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import type { ChokingRisk } from '@/types';

/**
 * Riziko dušení. docs/SPEC.md kapitola 5: nikdy jen barvou — vždy barva
 * i ikona i slovo. Důvod je daltonismus a mizerné světlo v kuchyni.
 */

const RISK: Record<ChokingRisk, { label: string; Icon: typeof ShieldCheck; classes: string }> = {
  low: { label: 'Nízké riziko', Icon: ShieldCheck, classes: 'bg-safe/10 text-safe border-safe/30' },
  medium: {
    label: 'Střední riziko',
    Icon: CircleAlert,
    classes: 'bg-caution/10 text-caution border-caution/30',
  },
  high: {
    label: 'Vysoké riziko',
    Icon: AlertTriangle,
    classes: 'bg-risk/10 text-risk border-risk/40',
  },
};

interface Props {
  risk: ChokingRisk;
  /** Kompaktní varianta do seznamu; v detailu se používá plná. */
  compact?: boolean;
}

export function RiskBadge({ risk, compact = false }: Props): ReactNode {
  const { label, Icon, classes } = RISK[risk];
  return (
    <span
      data-testid={`riziko-${risk}`}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-medium ${classes} ${
        compact ? 'text-[11px]' : 'text-sm'
      }`}
    >
      <Icon aria-hidden="true" className={compact ? 'h-3 w-3 shrink-0' : 'h-4 w-4 shrink-0'} />
      <span>{compact ? label.replace(' riziko', '') : label}</span>
      <span className="sr-only">riziko dušení</span>
    </span>
  );
}
