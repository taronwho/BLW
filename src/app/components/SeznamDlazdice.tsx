import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Seznam, SeznamTon } from '@/data/lists';
import { IKONY_SEZNAMU } from '../lib/seznamIkony';

/**
 * Barva a ikona dlaždice podle toho, o čem seznam je.
 *
 * Aplikace nemá fotky a mít je nebude — offline PWA, která má fungovat
 * u sporáku bez signálu, si nemůže dovolit megabajty obrázků.
 */
const TONY: Record<SeznamTon, string> = {
  zelezo: 'border-accent/40 bg-accent-soft',
  cecko: 'border-safe/40 bg-safe/10',
  alergen: 'border-caution/40 bg-caution/10',
  riziko: 'border-risk/35 bg-risk-soft',
  zacatek: 'border-line bg-surface',
  klid: 'border-line bg-paper',
};

export function SeznamDlazdice({
  seznam,
  ochutnano,
  compact = false,
}: {
  seznam: Seznam;
  /** Kolik položek už má dítě za sebou. */
  ochutnano: number;
  /** Užší podoba do vodorovného pásu na úvodní obrazovce. */
  compact?: boolean;
}): ReactNode {
  const Icon = IKONY_SEZNAMU[seznam.icon];
  const celkem = seznam.polozky.length;
  const podil = celkem === 0 ? 0 : Math.round((ochutnano / celkem) * 100);

  return (
    <Link
      to={`/seznamy/${seznam.id}`}
      data-testid={`seznam-${seznam.id}`}
      className={`flex flex-col rounded-xl border shadow-soft transition hover:shadow-lift ${
        TONY[seznam.tone]
      } ${compact ? 'w-44 shrink-0 gap-1 p-2' : 'h-full w-full gap-2 p-3'}`}
    >
      {/* V úsporné podobě stojí ikona vedle názvu, ne nad ním: na úvodní
          obrazovce je každá řádka znát a dlaždice se nemá roztahovat do
          výšky kvůli obrázku. V plné podobě zůstává nad textem. */}
      {compact ? (
        /* Počet stojí v řádce s názvem, ne pod ním: na úvodní obrazovce
           je každá řádka znát a „ochutnáno 0 z 10" na vlastním řádku
           přidávalo dlaždici čtrnáct bodů výšky jen kvůli dvěma číslům. */
        <span className="flex items-start gap-1.5">
          <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <span className="min-w-0 flex-1 text-[13px] font-semibold leading-tight">
            {seznam.titleCz}
          </span>
          <span className="shrink-0 text-[11px] tabular-nums text-ink/70">
            {ochutnano}/{celkem}
          </span>
        </span>
      ) : (
        <>
          <Icon aria-hidden="true" className="h-6 w-6 shrink-0 text-accent" />
          <span className="text-sm font-semibold leading-snug">{seznam.titleCz}</span>
          <span className="text-[11px] leading-snug text-ink/70">{seznam.summary}</span>
        </>
      )}

      {/* Postup se počítá z deníku vybraného dítěte, takže po přepnutí
          sourozence ukazuje jeho čísla, ne cizí. */}
      <span className="mt-auto flex flex-col gap-1">
        {!compact && (
          <span className="flex items-center justify-between gap-2 text-[11px] text-ink/70">
            <span>
              ochutnáno {ochutnano} z {celkem}
            </span>
            <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0" />
          </span>
        )}
        <span className="h-1 w-full overflow-hidden rounded-full bg-ink/15">
          <span
            className="block h-full rounded-full bg-accent transition-all"
            style={{ width: `${podil}%` }}
          />
        </span>
      </span>
    </Link>
  );
}
