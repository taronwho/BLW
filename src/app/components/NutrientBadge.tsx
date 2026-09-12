import { Droplet, Info, Sparkles, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { NutrientLevel, NutrientProfile } from '@/data/nutrients';
import type { Ingredient } from '@/types';
import { IRON_FORM_LABELS, LEVEL_CHIP, LEVEL_DOTS, LEVEL_LABELS } from '../lib/nutrientLabels';

export interface NutrientBadgeProps {
  profile: NutrientProfile;
  /** Název položky do hlavičky okénka. */
  title: string;
  /** Zdroje železa v receptu; u suroviny zůstává prázdné. */
  ironFrom?: readonly Ingredient[];
  /** Zdroje vitaminu C ve stejném receptu. */
  vitaminCFrom?: readonly Ingredient[];
  testId?: string;
}

function Row({ label, level }: { label: string; level: NutrientLevel }): ReactNode {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-paper px-3 py-2">
      <span className="text-sm font-medium">{label}</span>
      <span className="flex items-center gap-2">
        <span aria-hidden="true" className="font-mono text-[11px] tracking-tight">
          {LEVEL_DOTS[level]}
        </span>
        <span className="text-sm text-muted">{LEVEL_LABELS[level]}</span>
      </span>
    </div>
  );
}

/**
 * Značka obsahu železa v náhledu, po klepnutí s podrobnostmi.
 *
 * V seznamu je vidět jen stupnice teček a slovo — na víc na řádku není
 * místo. Vysvětlení, proč zrovna tahle položka a s čím ji kombinovat, se
 * otevře až na vyžádání, aby seznam zůstal čitelný.
 */
export function NutrientBadge({
  profile,
  title,
  ironFrom = [],
  vitaminCFrom = [],
  testId,
}: NutrientBadgeProps): ReactNode {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (profile.iron === 'nevyznamny' && profile.zinc === 'nevyznamny') return null;

  return (
    <>
      <button
        type="button"
        data-testid={testId ?? 'znacka-zeleza'}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Železo: ${LEVEL_LABELS[profile.iron]}. Otevřít podrobnosti.`}
        onClick={(event) => {
          // Značka bývá uvnitř odkazu na detail — proklik nesmí přebít okénko.
          event.preventDefault();
          event.stopPropagation();
          setOpen(true);
        }}
        // Vizuálně drobný štítek, ale dotykový cíl musí mít 44 px (docs/SPEC.md
        // kap. 6) — proto je plocha na tlačítku a vzhled na vnitřním štítku.
        className="flex min-h-touch items-center"
      >
        <span
          className={`flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[11px] font-medium ${
            LEVEL_CHIP[profile.iron]
          }`}
        >
          <Droplet aria-hidden="true" className="h-3 w-3 shrink-0" />
          železo
          <span aria-hidden="true" className="font-mono tracking-tight">
            {LEVEL_DOTS[profile.iron]}
          </span>
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Živiny — ${title}`}
          data-testid="okenko-zivin"
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-3 sm:items-center"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setOpen(false);
          }}
        >
          <div
            className="flex max-h-[80vh] w-full max-w-md flex-col gap-3 overflow-y-auto rounded-2xl bg-surface p-4 shadow-lift"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <h2 className="min-w-0 text-base font-bold">{title}</h2>
              <button
                type="button"
                data-testid="okenko-zavrit"
                aria-label="Zavřít"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setOpen(false);
                }}
                className="flex min-h-touch min-w-touch shrink-0 items-center justify-center rounded-lg text-muted"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <Row label="Železo" level={profile.iron} />
            <Row label="Zinek" level={profile.zinc} />
            <Row label="Vitamin C" level={profile.vitaminC} />

            <p className="text-sm leading-relaxed">
              {profile.ironForm === 'hemove'
                ? 'Železo z masa a ryb je hemové a vstřebává se lépe než železo z rostlin. Rozhoduje ale podoba sousta — kostka dušená doměkka se rozpadá, tuhý plátek skončí ocucaný.'
                : profile.ironForm === 'nehemove'
                  ? 'Rostlinné, tedy nehemové železo se vstřebává hůř než železo z masa. Výrazně mu ale pomáhá vitamin C ve stejném jídle.'
                  : 'Tahle položka není významným zdrojem železa. Zinek a železo se v jídelníčku většinou potkávají v týchž potravinách.'}
            </p>

            {ironFrom.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                  Železo nesou
                </p>
                <ul className="mt-1.5 flex flex-wrap gap-1.5" data-testid="okenko-zdroje-zeleza">
                  {ironFrom.map((item) => (
                    <li key={item.id}>
                      <Link
                        to={`/suroviny/${item.id}`}
                        className="flex min-h-touch items-center gap-1 rounded-full border border-line bg-paper px-3 text-sm"
                      >
                        <span aria-hidden="true">{item.emoji ?? '🍽️'}</span>
                        {item.nameCz}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {vitaminCFrom.length > 0 && (
              <div>
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
                  <Sparkles aria-hidden="true" className="h-3 w-3" />
                  Vstřebávání zlepšuje
                </p>
                <ul className="mt-1.5 flex flex-wrap gap-1.5" data-testid="okenko-zdroje-cecka">
                  {vitaminCFrom.map((item) => (
                    <li key={item.id}>
                      <Link
                        to={`/suroviny/${item.id}`}
                        className="flex min-h-touch items-center gap-1 rounded-full border border-accent/30 bg-accent-soft px-3 text-sm text-accent"
                      >
                        <span aria-hidden="true">{item.emoji ?? '🍽️'}</span>
                        {item.nameCz}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="flex items-start gap-2 rounded-xl bg-paper px-3 py-2 text-xs leading-relaxed text-muted">
              <Info aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                Zařazení podle skupin potravin, které jako zdroj jmenují NHS a odborná literatura —
                ne měřená hodnota v miligramech. Potravinové tabulky aplikace nepoužívá.
              </span>
            </p>

            <p className="text-xs text-muted">
              {IRON_FORM_LABELS[profile.ironForm]}.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
