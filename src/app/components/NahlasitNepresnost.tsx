import { Flag } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Hlaseni } from '../lib/hlaseni';
import { odkazNaHlaseni } from '../lib/hlaseni';

/**
 * „Našel jsem tu nepřesnost." — odkaz na předvyplněné hlášení.
 *
 * Nenápadný, pod zdroji: rodič ho hledá až ve chvíli, kdy mu něco
 * nesedí, a do té doby nemá překážet. Otevírá se v nové záložce, aby
 * se člověk neztratil z rozečteného receptu.
 */
export function NahlasitNepresnost(props: Hlaseni): ReactNode {
  return (
    <a
      href={odkazNaHlaseni(props)}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="nahlasit-nepresnost"
      className="flex items-center gap-1.5 self-start text-xs text-muted underline underline-offset-2"
    >
      <Flag aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      Nahlásit nepřesnost
    </a>
  );
}
