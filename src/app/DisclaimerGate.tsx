import { ShieldAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import { DISCLAIMER_PARAGRAPHS, DISCLAIMER_TITLE } from './disclaimer';
import { useModalFokus } from './lib/modalFokus';
import { useDisclaimer } from './useDisclaimer';

interface Props {
  children: ReactNode;
}

/** Disclaimer při prvním spuštění (docs/SPEC.md akceptační kritérium 10). */
export function DisclaimerGate({ children }: Props): ReactNode {
  const { accepted, accept } = useDisclaimer();
  // Fokus rovnou na potvrzovací tlačítko. Bez toho začíná odečítač na
  // začátku dokumentu a rodič se k jedinému tlačítku musí protabovat.
  const okenko = useModalFokus<HTMLDivElement>(!accepted);

  if (accepted) return children;

  return (
    <div
      ref={okenko}
      className="min-h-full px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
      data-testid="disclaimer"
    >
      <div className="mx-auto flex max-w-md flex-col gap-4 rounded-2xl bg-surface p-5 shadow-sm">
        <div className="flex items-center gap-2 text-accent">
          <ShieldAlert aria-hidden="true" className="h-6 w-6 shrink-0" />
          <h1 id="disclaimer-title" className="text-xl font-semibold text-ink">
            {DISCLAIMER_TITLE}
          </h1>
        </div>
        {DISCLAIMER_PARAGRAPHS.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="text-sm leading-relaxed text-muted">
            {paragraph}
          </p>
        ))}
        <button
          type="button"
          onClick={accept}
          data-testid="disclaimer-accept"
          className="min-h-touch w-full rounded-xl bg-accent px-4 py-3 text-base font-semibold text-on-accent"
        >
          Rozumím
        </button>
      </div>
    </div>
  );
}
