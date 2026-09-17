import { RefreshCw, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * Nenápadná výzva k aktualizaci (docs/SPEC.md kapitola 8).
 * Nic sama nepřenačítá — rodič může být uprostřed vaření.
 *
 * Dvě věci, které tu dřív chyběly a obracely ten slib naruby:
 *
 *  1. Lišta se nedala odložit a leží na `z-50` nad spodní navigací
 *     (`z-20`), takže jedinou cestou ven bylo klepnout na „Obnovit" —
 *     přesně to, co má nabídka nechat na rodiči. Teď má křížek a po
 *     zavření se do konce téhle návštěvy nevrací.
 *  2. Nová verze se hledala jen při načtení stránky. Nainstalovaná PWA,
 *     kterou rodič nechá otevřenou, o ní nevěděla celé dny — a zrovna
 *     u téhle aplikace je rozjetá verze problém, protože druhý telefon
 *     může mít novější tvar dat.
 */

/** Jak často se ptát serveru, jestli není novější verze. */
const INTERVAL_KONTROLY_MS = 60 * 60 * 1000;

export function UpdatePrompt(): ReactNode {
  const [odlozeno, setOdlozeno] = useState(false);
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registrace) {
      if (registrace === undefined) return;
      const id = window.setInterval(() => {
        // `update()` jen porovná soubor na serveru; když se nic nezměnilo,
        // nestáhne se nic a rodič o kontrole neví.
        void registrace.update();
      }, INTERVAL_KONTROLY_MS);
      // Interval přežívá celou návštěvu; komponenta se neodpojuje, ale
      // uklidit se po sobě sluší i tak.
      window.addEventListener('pagehide', () => window.clearInterval(id), { once: true });
    },
  });

  // Když mezitím přijde ještě novější verze, nabídka se ukáže znovu.
  useEffect(() => {
    if (needRefresh) setOdlozeno(false);
  }, [needRefresh]);

  if (!needRefresh || odlozeno) return null;

  return (
    <div
      role="status"
      data-testid="update-prompt"
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]"
    >
      <div className="mx-auto flex max-w-md items-center gap-2 rounded-xl bg-ink px-3 py-3 text-sm text-paper shadow-lg">
        <span className="min-w-0 flex-1">Je dostupná novější verze.</span>
        <button
          type="button"
          onClick={() => {
            void updateServiceWorker(true);
          }}
          data-testid="update-obnovit"
          className="flex min-h-touch shrink-0 items-center gap-2 rounded-lg bg-accent px-3 py-2 font-semibold text-on-accent"
        >
          <RefreshCw aria-hidden="true" className="h-4 w-4" />
          Obnovit
        </button>
        <button
          type="button"
          onClick={() => setOdlozeno(true)}
          data-testid="update-pozdeji"
          className="flex min-h-touch min-w-touch shrink-0 items-center justify-center rounded-lg text-paper"
        >
          <X aria-hidden="true" className="h-5 w-5" />
          <span className="sr-only">Zavřít nabídku aktualizace, obnovím později</span>
        </button>
      </div>
    </div>
  );
}
