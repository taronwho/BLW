import { ChevronDown, ExternalLink } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import type { SourceRef } from '@/types';
import { formatDate } from '../lib/labels';

export function SourceLinks({ sources }: { sources: readonly SourceRef[] }): ReactNode {
  return (
    <ul className="flex flex-col gap-2" data-testid="seznam-zdroju">
      {sources.map((source) => (
        <li key={source.url} className="flex flex-col gap-1">
          <a
            href={source.url}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-touch items-center gap-2 text-sm font-medium text-accent"
          >
            <ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0" />
            <span className="min-w-0">
              {source.org}: {source.title}
            </span>
          </a>
          <span className="text-xs text-muted">
            tier {source.tier} · ověřeno {formatDate(source.accessedAt)}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Rozbalovací blok zdrojů.
 *
 * Zdroje patří ke každému tvrzení, ale rozbalené by přehlušily samotný
 * recept — proto se otevírají až na klepnutí a v zavřeném stavu nesou aspoň
 * počet, aby bylo vidět, že něco doloženého existuje.
 */
export function SourceDisclosure({
  sources,
  label = 'Zdroje',
  count,
  testId,
  children,
}: {
  sources: readonly SourceRef[];
  label?: string;
  /**
   * Číslo v závorce, když ho neurčuje `sources`.
   *
   * Panel, který si obsah vykresluje sám přes `children`, žádné `sources`
   * nedostane — a bez tohohle by za jeho nadpisem svítila nula. Přesně to se
   * dělo u zdrojů k surovinám v receptu: „Zdroje u surovin (6) (0)".
   */
  count?: number;
  testId?: string;
  children?: ReactNode;
}): ReactNode {
  const [open, setOpen] = useState(false);
  if (sources.length === 0 && children === undefined) return null;

  return (
    <section className="flex flex-col gap-2 rounded-xl bg-surface p-4">
      <button
        type="button"
        aria-expanded={open}
        data-testid={testId ?? 'prepinac-zdroju'}
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-touch items-center justify-between gap-2 text-sm font-semibold"
      >
        {label} ({count ?? sources.length})
        <ChevronDown
          aria-hidden="true"
          className={`h-5 w-5 shrink-0 transition ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <>
          {sources.length > 0 && <SourceLinks sources={sources} />}
          {children}
        </>
      )}
    </section>
  );
}
