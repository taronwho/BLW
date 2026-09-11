import { CloudOff, Cloud, Loader2, TriangleAlert, Smartphone } from 'lucide-react';
import type { ReactNode } from 'react';
import type { SyncStatus } from '@/storage/types';

/** Stav se sděluje slovem i ikonou, nikdy jen barvou (docs/SPEC.md kap. 5). */
export function SyncStatusBadge({ status }: { status: SyncStatus }): ReactNode {
  const { Icon, text, tone } = describe(status);
  return (
    <p className={`flex items-center gap-2 text-sm ${tone}`} data-testid="stav-synchronizace">
      <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span>{text}</span>
    </p>
  );
}

function describe(status: SyncStatus): {
  Icon: typeof Cloud;
  text: string;
  tone: string;
} {
  switch (status.kind) {
    case 'connected':
      return { Icon: Cloud, text: 'Připojeno — změny se sdílejí', tone: 'text-safe' };
    case 'connecting':
      return { Icon: Loader2, text: 'Připojuji…', tone: 'text-muted' };
    case 'offline':
      return {
        Icon: CloudOff,
        text: `Offline — ve frontě ${status.queued} změn`,
        tone: 'text-caution',
      };
    case 'error':
      return { Icon: TriangleAlert, text: `Chyba synchronizace: ${status.message}`, tone: 'text-risk' };
    case 'local-only':
    default:
      return { Icon: Smartphone, text: 'Jen na tomto zařízení', tone: 'text-muted' };
  }
}
