interface KonecSeznamuProps {
  /** Kolik položek ještě čeká. Při nule se nevykreslí nic. */
  zbyva: number;
  nacistDalsi: () => void;
  /** Sledovaný prvek — jakmile se objeví na obrazovce, načte se další dávka. */
  konecSeznamu: (uzel: HTMLElement | null) => void;
  testId: string;
}

/**
 * Patička dlouhého seznamu.
 *
 * Další dávka se načte sama, jakmile sem rodič doroluje — žádné tlačítko.
 * To se ukáže jedině tam, kde prohlížeč `IntersectionObserver` neumí; bez
 * něj by byl zbytek seznamu nedostupný.
 */
export function KonecSeznamu({ zbyva, nacistDalsi, konecSeznamu, testId }: KonecSeznamuProps) {
  if (zbyva === 0) return null;
  const samoNacita = typeof IntersectionObserver !== 'undefined';

  return (
    <div ref={konecSeznamu} className="flex flex-col items-center gap-1 py-3">
      {samoNacita ? (
        <span role="status" className="text-xs text-muted" data-testid={testId}>
          Načítám další… zbývá {zbyva}
        </span>
      ) : (
        <>
          <button
            type="button"
            onClick={nacistDalsi}
            data-testid={testId}
            className="min-h-11 rounded-xl bg-surface px-4 py-2 text-sm font-medium text-accent"
          >
            Načíst další
          </button>
          <span className="text-xs text-muted">zbývá {zbyva}</span>
        </>
      )}
    </div>
  );
}
