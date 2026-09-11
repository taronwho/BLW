import { ShieldAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import { DISCLAIMER_PARAGRAPHS, DISCLAIMER_TITLE } from './disclaimer';
import { useDisclaimer } from './useDisclaimer';

interface Props {
  children: ReactNode;
}

/** Disclaimer při prvním spuštění (docs/SPEC.md akceptační kritérium 10). */
export function DisclaimerGate({ children }: Props): ReactNode {
  const { accepted, accept } = useDisclaimer();

  if (accepted) return children;

  return (
    <div
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
          className="min-h-touch w-full rounded-xl bg-accent px-4 py-3 text-base font-semibold text-white"
        >
          Rozumím
        </button>
      </div>
    </div>
  );
}
