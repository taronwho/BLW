import { AlertTriangle, Database } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useHouseholdStore } from '@/storage/householdStore';
import { ZAPLNENI_NALEHAVE, ZAPLNENI_UPOZORNIT } from '@/sync/velikost';

/**
 * Kolik místa zabírá sdílená domácnost v databázi.
 *
 * Firestore unese na jeden dokument 1 MB a celá domácnost je jeden
 * dokument (src/sync/velikost.ts). Bez tohohle ukazatele by rodič zjistil,
 * že je plno, až ve chvíli, kdy se záznamy přestanou posílat na druhý
 * telefon.
 */
function procenta(podil: number): number {
  return Math.min(100, Math.max(1, Math.round(podil * 100)));
}

/** Řádek v Domácnosti, pod stavem synchronizace. */
export function ZaplneniDomacnosti(): ReactNode {
  const podil = useHouseholdStore((store) => store.zaplneni);
  if (podil === null) return null;
  const pct = procenta(podil);

  if (podil < ZAPLNENI_UPOZORNIT) {
    return (
      <p data-testid="zaplneni-domacnosti" className="flex items-center gap-2 text-xs text-muted">
        <Database aria-hidden="true" className="h-4 w-4 shrink-0" />
        Místo pro sdílená data: zabráno {pct} %
      </p>
    );
  }

  const nalehave = podil >= ZAPLNENI_NALEHAVE;
  return (
    <div
      role="note"
      data-testid="zaplneni-domacnosti"
      className={`flex gap-2 rounded-xl border p-3 text-xs leading-relaxed ${
        nalehave ? 'border-risk/40 bg-risk-soft' : 'border-caution/40 bg-caution-soft'
      }`}
    >
      <AlertTriangle
        aria-hidden="true"
        className={`mt-0.5 h-4 w-4 shrink-0 ${nalehave ? 'text-risk' : 'text-caution'}`}
      />
      <p>
        <strong className="font-semibold">Místo pro sdílená data: zabráno {pct} %.</strong>{' '}
        Databáze unese na jednu domácnost nejvýš 1 MB. Až se zaplní, nové záznamy zůstanou
        jen v tomhle telefonu a na druhý nedojdou. Stáhni si zálohu (Domácnost → Aplikace →
        Export) a dej vědět autorovi aplikace přes „Nahlásit nepřesnost".
      </p>
    </div>
  );
}

/** Upozornění na úvodní obrazovce. Jen když už hoří, jinak by rušilo. */
export function ZaplneniNaUvodu(): ReactNode {
  const podil = useHouseholdStore((store) => store.zaplneni);
  if (podil === null || podil < ZAPLNENI_NALEHAVE) return null;
  return (
    <Link
      to="/domacnost?sekce=sdileni"
      data-testid="zaplneni-na-uvodu"
      className="flex min-h-touch items-center gap-2 rounded-xl border-2 border-risk/40 bg-risk-soft px-3 text-xs font-semibold"
    >
      <AlertTriangle aria-hidden="true" className="h-4 w-4 shrink-0 text-risk" />
      Sdílená domácnost je skoro plná ({procenta(podil)} %). Co s tím?
    </Link>
  );
}
