import { RefreshCw } from 'lucide-react';
import type { ReactNode } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * Nenápadná výzva k aktualizaci (docs/SPEC.md kapitola 8).
 * Nic sama nepřenačítá — rodič může být uprostřed vaření.
 */
export function UpdatePrompt(): ReactNode {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div
      role="status"
      data-testid="update-prompt"
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]"
    >
      <div className="mx-auto flex max-w-md items-center gap-3 rounded-xl bg-ink px-4 py-3 text-sm text-paper shadow-lg">
        <span className="flex-1">Je dostupná novější verze.</span>
        <button
          type="button"
          onClick={() => {
            void updateServiceWorker(true);
          }}
          className="flex min-h-touch items-center gap-2 rounded-lg bg-accent px-3 py-2 font-semibold text-white"
        >
          <RefreshCw aria-hidden="true" className="h-4 w-4" />
          Obnovit
        </button>
      </div>
    </div>
  );
}
