import { Baby, Check, ChevronDown, Settings2, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useHouseholdStore } from '@/storage/householdStore';
import { ageInMonths, formatAge } from '../lib/age';
import { useAktivniDite, useDeti } from '../lib/dite';
import { useModalFokus } from '../lib/modalFokus';

/**
 * Které dítě aplikace ukazuje — v hlavičce, na každé obrazovce.
 *
 * S jedním dítětem je to jen jmenovka s věkem, která vede do Domácnosti,
 * přesně jako dřív. Teprve u dvou a víc se z ní stane přepínač: sourozenci
 * bývají v příkrmu každý jinde a rodič mezi nimi přepíná několikrát denně,
 * takže to musí být na dosah, ne schované v nastavení.
 *
 * Přepnutím se změní celá aplikace — fáze u surovin, filtr „Vhodné teď",
 * tvar sousta podle úchopu, alergeny i deník.
 */
export function ChildSwitcher(): ReactNode {
  const deti = useDeti();
  const aktivni = useAktivniDite();
  const setActiveChild = useHouseholdStore((store) => store.setActiveChild);
  const [open, setOpen] = useState(false);
  const okenko = useModalFokus<HTMLDivElement>(open);

  useEffect(() => {
    if (!open) return undefined;
    const naKlavesu = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', naKlavesu);
    return () => window.removeEventListener('keydown', naKlavesu);
  }, [open]);

  const popisek =
    aktivni === null
      ? 'Nastav dítě v Domácnosti'
      : `${aktivni.name.trim().length > 0 ? aktivni.name : 'Dítě'} · ${formatAge(ageInMonths(aktivni.birthDate))}`;

  if (deti.length < 2) {
    return (
      <Link
        to="/domacnost"
        className="flex min-h-touch min-w-0 flex-1 items-center justify-center truncate rounded-full bg-surface px-3 text-xs text-muted shadow-soft"
        data-testid="dite-v-hlavicce"
      >
        <span className="truncate">{popisek}</span>
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Vybrané dítě: ${popisek}. Přepnout na jiné.`}
        data-testid="dite-v-hlavicce"
        onClick={() => setOpen(true)}
        className="flex min-h-touch min-w-0 flex-1 items-center justify-center gap-1 truncate rounded-full bg-surface px-3 text-xs text-muted shadow-soft"
      >
        <span className="truncate">{popisek}</span>
        <ChevronDown aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      </button>

      {/* Okénko se kreslí do `body`, ne do hlavičky. Hlavička je `sticky`
          s `z-10`, takže by v jejím vrstvení skončilo pod spodní navigací
          (`z-20`) — a ta překrývá právě dolní okraj obrazovky, kde okénko
          na mobilu vyjíždí. */}
      {open &&
        createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Vybrat dítě"
          data-testid="prepinac-deti"
          className="fixed inset-0 z-50 flex items-end justify-center bg-scrim/50 p-3 sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            ref={okenko}
            className="flex w-full max-w-md flex-col gap-3 rounded-2xl bg-surface p-4 shadow-lift"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2">
              <h2 className="flex items-center gap-2 text-base font-bold">
                <Baby aria-hidden="true" className="h-5 w-5 shrink-0 text-accent" />
                Které dítě?
              </h2>
              <button
                type="button"
                aria-label="Zavřít"
                data-testid="prepinac-deti-zavrit"
                onClick={() => setOpen(false)}
                className="flex min-h-touch min-w-touch shrink-0 items-center justify-center rounded-lg text-muted"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs leading-relaxed text-muted">
              Podle výběru se řídí fáze u surovin, filtr „Vhodné teď", tvar sousta i deník.
              Volba platí jen v tomhle telefonu.
            </p>

            <ul className="flex flex-col gap-2">
              {deti.map((dite) => {
                const vybrane = dite.id === aktivni?.id;
                return (
                  <li key={dite.id}>
                    <button
                      type="button"
                      aria-pressed={vybrane}
                      data-testid={`vybrat-dite-${dite.id}`}
                      onClick={() => {
                        setActiveChild(dite.id);
                        setOpen(false);
                      }}
                      className={`flex min-h-touch w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left ${
                        vybrane ? 'border-accent bg-accent-soft' : 'border-line bg-paper'
                      }`}
                    >
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-semibold">
                          {dite.name.trim().length > 0 ? dite.name : 'Dítě bez jména'}
                        </span>
                        <span className="text-xs text-muted">
                          {formatAge(ageInMonths(dite.birthDate))}
                        </span>
                      </span>
                      {vybrane && (
                        <Check aria-hidden="true" className="h-5 w-5 shrink-0 text-accent" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            <Link
              to="/domacnost"
              onClick={() => setOpen(false)}
              className="flex min-h-touch items-center gap-2 rounded-xl border border-line px-3 text-sm font-medium"
            >
              <Settings2 aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
              Spravovat děti v Domácnosti
            </Link>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
