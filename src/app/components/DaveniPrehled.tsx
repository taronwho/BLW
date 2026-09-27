import { Hand } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ingredientById } from '@/data';
import type { TastingEvent } from '@/types';
import { OKNO_OPAKOVANI_DNU, podilDaveni, souhrnDaveni } from '../lib/daveni';
import { formatDate, todayIso } from '../lib/labels';

/** „d. m." bez roku — v řádku týdne by rok jen zabíral místo. */
function kratce(iso: string): string {
  const [, mesic, den] = iso.split('-').map(Number);
  return `${den ?? ''}. ${mesic ?? ''}.`;
}

function zOchutnavek(pocet: number): string {
  return `z ${pocet} ${pocet === 1 ? 'ochutnávky' : 'ochutnávek'}`;
}

/**
 * Přehled dávení v deníku: jak se vyvíjí po týdnech a u čeho se opakuje.
 *
 * Nic nevyhodnocuje. Ukazuje jen, co rodič sám zapsal, a u opakovaného
 * dávení odkazuje na průvodce tvarem sousta — tvar a měkkost jsou to, co
 * má rodič v rukou.
 */
export function DaveniPrehled({ udalosti }: { udalosti: readonly TastingEvent[] }): ReactNode {
  const souhrn = useMemo(() => souhrnDaveni(udalosti, todayIso()), [udalosti]);
  const nejvic = Math.max(1, ...souhrn.tydny.map((tyden) => podilDaveni(tyden) ?? 0));

  return (
    <section
      aria-labelledby="daveni-nadpis"
      data-testid="daveni-prehled"
      className="flex flex-col gap-3 rounded-xl bg-surface p-4"
    >
      <h2
        id="daveni-nadpis"
        className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted"
      >
        <Hand aria-hidden="true" className="h-4 w-4 shrink-0" />
        Dávení
      </h2>

      {souhrn.celkem === 0 ? (
        <p className="text-sm leading-relaxed" data-testid="daveni-zadne">
          Zatím žádné zapsané dávení. Když se dítě nad soustem zakucká, označ u ochutnávky
          „Dávilo se“ a tady uvidíš, jestli ubývá.
        </p>
      ) : (
        <>
          <p className="text-sm font-medium" data-testid="daveni-celkem">
            Zapsáno celkem {souhrn.celkem}×
          </p>
          <ul className="flex flex-col gap-2" data-testid="daveni-tydny">
            {souhrn.tydny.map((tyden) => {
              const podil = podilDaveni(tyden);
              return (
                <li key={tyden.od} className="flex flex-col gap-1 text-sm">
                  <span className="flex flex-wrap justify-between gap-x-2">
                    <span className="text-muted">
                      {kratce(tyden.od)} – {kratce(tyden.do)}
                    </span>
                    <span className="font-medium">
                      {podil === null
                        ? 'bez ochutnávek'
                        : `dávilo ${tyden.daveni}× ${zOchutnavek(tyden.ochutnavek)}`}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="block h-2 overflow-hidden rounded-full bg-paper"
                  >
                    <span
                      className="block h-full rounded-full bg-caution"
                      style={{ width: `${((podil ?? 0) / nejvic) * 100}%` }}
                    />
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {souhrn.opakovane.length > 0 && (
        <div
          className="flex flex-col gap-2 rounded-lg border border-caution/40 bg-caution-soft p-3"
          data-testid="daveni-opakovane"
        >
          <p className="text-sm font-semibold">
            Opakuje se u stejné suroviny (za posledních {OKNO_OPAKOVANI_DNU} dní)
          </p>
          <ul className="flex flex-col gap-1">
            {souhrn.opakovane.map((polozka) => (
              <li key={polozka.ingredientId}>
                <Link
                  to={`/suroviny/${polozka.ingredientId}`}
                  className="flex min-h-touch items-center justify-between gap-2 text-sm"
                >
                  <span className="min-w-0 font-medium text-accent">
                    {ingredientById.get(polozka.ingredientId)?.nameCz ?? polozka.ingredientId}
                  </span>
                  <span className="shrink-0 text-xs text-muted">
                    {polozka.pocet}× · naposledy {formatDate(polozka.posledni)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-xs leading-relaxed">
            Zkontroluj tvar a měkkost sousta u téhle suroviny v jejím detailu a v průvodci.{' '}
            <Link to="/tvar-sousta" className="inline-flex min-h-touch items-center font-medium text-accent underline">
              Průvodce tvarem sousta
            </Link>
          </p>
        </div>
      )}

      <p className="text-xs leading-relaxed text-muted">
        Dávení je obrana, ne selhání: dítě sousto vypudí dopředu, ven z úst. S praxí postupně
        zvládá větší a pevnější sousta, aniž by dávilo.{' '}
        <Link to="/rady/daveni-vs-duseni" className="inline-flex min-h-touch items-center font-medium text-accent underline">
          Dávení není dušení
        </Link>
      </p>
    </section>
  );
}
