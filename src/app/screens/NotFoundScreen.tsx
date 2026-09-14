import { Compass } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Adresa, která v aplikaci není.
 *
 * Dřív tu bylo tiché přesměrování na úvod. Kdo měl uloženou záložku na
 * surovinu nebo recept, který se mezitím přejmenoval, skončil na úvodní
 * obrazovce bez vysvětlení a myslel si, že se aplikace rozbila. Tohle aspoň
 * řekne, co se stalo, a nabídne, kudy dál.
 */
export function NotFoundScreen(): ReactNode {
  const { pathname } = useLocation();

  return (
    <section className="flex flex-col gap-4" aria-labelledby="nenalezeno-nadpis">
      <h1 id="nenalezeno-nadpis" className="flex items-center gap-2 text-xl font-bold">
        <Compass aria-hidden="true" className="h-5 w-5 shrink-0 text-accent" />
        Tahle stránka tu není
      </h1>

      <p className="text-sm leading-relaxed" data-testid="nenalezena-adresa">
        Adresa <span className="break-all font-mono text-xs">{pathname}</span> v aplikaci
        neexistuje. Nejspíš je to stará záložka na surovinu nebo recept, který se přejmenoval.
      </p>

      <ul className="flex flex-col gap-2">
        {[
          { to: '/suroviny', label: 'Suroviny', popis: 'Katalog s přípravou pro tři fáze' },
          { to: '/recepty', label: 'Recepty', popis: 'Jedno vaření pro celou rodinu' },
          { to: '/rady', label: 'Rady', popis: 'Bezpečnost, železo a zinek, praxe' },
          { to: '/', label: 'Úvodní obrazovka', popis: 'Zpátky na začátek' },
        ].map(({ to, label, popis }) => (
          <li key={to}>
            <Link
              to={to}
              className="flex min-h-touch flex-col justify-center rounded-2xl border border-line bg-surface px-4 py-3 shadow-soft"
            >
              <span className="text-sm font-semibold">{label}</span>
              <span className="text-xs text-muted">{popis}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
