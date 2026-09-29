import { ArrowLeft, Check, ChevronRight, Hand, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ingredientById } from '@/data/ingredients';
import { NHS_7_9M, NHS_PREP_SAFELY } from '@/data/ingredients/_sources';
import { useOpravaSuroviny } from '@/storage/opravyStore';
import { GRIPS } from '@/types';
import type { Grip, Stage } from '@/types';
import {
  ObrazekJidla,
  ObrazekMekkosti,
  ObrazekTvaruProUchop,
  ObrazekUchopu,
} from '../components/ObrazkySousta';
import { ChokingBadge } from '../components/ChokingBadge';
import { SourceDisclosure } from '../components/SourceList';
import { StageSwitch } from '../components/StageSwitch';
import { STAGE_LABELS, ageInMonths, stageForAge } from '../lib/age';
import { useAktivniDite } from '../lib/dite';
import {
  GRIP_HOW_TO_TELL,
  GRIP_LABELS,
  GRIP_SHAPE,
  GRIP_SHORT,
  GRIP_TYPICAL_MONTHS,
  gripForAge,
} from '../lib/grip';
import { maObrazek } from '../lib/obrazkySousta';
import { UKAZKY_TVARU, proFazi } from '../lib/tvarSousta';
import type { StranaUkazky, UkazkaTvaru } from '../lib/tvarSousta';
import { useUrlText } from '../lib/urlState';

function Strana({
  strana,
  faze,
  spravne,
}: {
  strana: StranaUkazky;
  faze: Stage;
  spravne: boolean;
}): ReactNode {
  const Ikona = spravne ? Check : X;
  return (
    <figure className="flex min-w-0 flex-1 flex-col gap-1">
      <div
        className={`relative rounded-xl border-2 p-2 ${
          spravne ? 'border-safe/50 bg-safe-soft' : 'border-risk/40 bg-risk-soft'
        }`}
      >
        <ObrazekJidla obrazek={proFazi(strana.obrazek, faze)} />
        {/* „Takhle ne" je přeškrtnuté, ať je to jasné na první pohled —
            barva rámečku sama nestačí a ikonu pod obrázkem nejde vidět,
            když rodič jen zběžně roluje. */}
        {!spravne && (
          <svg
            aria-hidden="true"
            data-testid="preskrtnuti"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)]"
          >
            <line
              x1="4"
              y1="96"
              x2="96"
              y2="4"
              className="stroke-risk"
              strokeWidth={2.5}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        )}
      </div>
      <figcaption className="flex items-start gap-1 text-xs font-medium leading-snug">
        <Ikona
          aria-hidden="true"
          className={`mt-px h-4 w-4 shrink-0 ${spravne ? 'text-safe' : 'text-risk'}`}
        />
        <span className="min-w-0">
          <span className="sr-only">{spravne ? 'Takhle ano: ' : 'Takhle ne: '}</span>
          {proFazi(strana.popisek, faze)}
        </span>
      </figcaption>
    </figure>
  );
}

function Ukazka({ ukazka, faze }: { ukazka: UkazkaTvaru; faze: Stage }): ReactNode {
  // Pokyn se čte z katalogu i s opravami vydanými bez nasazení — průvodce
  // nesmí ukazovat jiný text než detail suroviny.
  const oprava = useOpravaSuroviny(ukazka.ingredientId);
  const surovina = oprava ?? ingredientById.get(ukazka.ingredientId);
  if (surovina === undefined) return null;
  const pokyn = surovina.prep[faze];

  return (
    <li
      id={ukazka.id}
      data-testid={`ukazka-${ukazka.id}`}
      className="flex flex-col gap-3 rounded-xl bg-surface p-4"
    >
      <h3 className="text-base font-semibold">
        {ukazka.nadpis}{' '}
        <span className="text-sm font-normal text-muted">· {surovina.nameCz}</span>
      </h3>
      <ChokingBadge risk={surovina.chokingRisk} />
      <div className="flex gap-3">
        {ukazka.ne !== undefined && <Strana strana={ukazka.ne} faze={faze} spravne={false} />}
        <Strana strana={ukazka.ano} faze={faze} spravne />
      </div>
      <p className="text-sm leading-relaxed" data-testid={`ukazka-pokyn-${ukazka.id}`}>
        {pokyn?.serving ?? 'Pokyn pro tuto fázi není vyplněný.'}
      </p>
      {pokyn?.caution !== undefined && (
        <p className="rounded-lg bg-caution/10 p-3 text-sm leading-relaxed text-caution">
          Pozor ve fázi {STAGE_LABELS[faze]}: {pokyn.caution}
        </p>
      )}
      <Link
        to={`/suroviny/${surovina.id}`}
        className="flex min-h-touch items-center gap-1 self-start rounded-lg text-sm font-medium text-accent"
      >
        Detail suroviny {surovina.nameCz}
        <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0" />
      </Link>
    </li>
  );
}

/**
 * Průvodce tvarem sousta — obrazovka `/tvar-sousta`.
 *
 * Nahoře úchop: jak ho poznat a jaký tvar z něj plyne, s obrázkem ruky.
 * Pod tím ukázky „takhle ne / takhle ano" na typických surovinách, u
 * kterých se nejčastěji chybuje. Text pokynu je vždy z katalogu
 * (viz `lib/tvarSousta.ts`), průvodce sám žádná zdravotní tvrzení nepřidává.
 *
 * Úchop i fáze jdou přepnout, aby si rodič mohl prohlédnout, co ho čeká.
 * Uložený úchop dítěte se tím nemění — ten se nastavuje v Domácnosti.
 */
export function TvarSoustaScreen(): ReactNode {
  const dite = useAktivniDite();
  const months = ageInMonths(dite?.birthDate ?? '');
  const gripDitete = dite?.grip;
  const vychoziGrip: Grip = gripDitete ?? gripForAge(months);
  const [grip, setGrip] = useUrlText<Grip>('uchop', vychoziGrip, GRIPS);

  const aktualniFaze = stageForAge(months);
  const [faze, setFaze] = useState<Stage>(aktualniFaze);
  useEffect(() => setFaze(aktualniFaze), [aktualniFaze]);

  return (
    <article className="flex flex-col gap-5" aria-labelledby="tvar-nadpis">
      <Link
        to="/rady"
        className="flex min-h-touch w-fit items-center gap-2 rounded-xl px-2 text-sm font-medium text-accent"
      >
        <ArrowLeft aria-hidden="true" className="h-5 w-5 shrink-0" />
        Rady
      </Link>

      <header className="flex flex-col gap-2">
        <h1 id="tvar-nadpis" className="text-xl font-bold">
          Tvar sousta podle úchopu
        </h1>
        <p className="text-sm leading-relaxed text-muted">
          Úchop rozhoduje o tvaru a velikosti sousta: co dítě z tácku zvedne. Co už smí dostat a
          jak měkké to musí být, se dál řídí věkem.
        </p>
      </header>

      <section
        aria-labelledby="uchop-nadpis"
        className="flex flex-col gap-3 rounded-xl bg-surface p-4"
        data-testid="pruvodce-uchop"
      >
        <h2 id="uchop-nadpis" className="text-sm font-semibold uppercase tracking-wide text-muted">
          Úchop
        </h2>
        <div role="group" aria-label="Úchop" className="grid grid-cols-3 gap-2">
          {GRIPS.map((moznost) => {
            const aktivni = moznost === grip;
            return (
              <button
                key={moznost}
                type="button"
                aria-pressed={aktivni}
                data-testid={`pruvodce-uchop-${moznost}`}
                onClick={() => setGrip(moznost)}
                className={`flex min-h-touch flex-col items-center justify-center rounded-xl border px-1 py-2 text-xs font-semibold leading-tight ${
                  aktivni ? 'border-accent bg-accent text-on-accent' : 'border-line bg-paper text-ink'
                }`}
              >
                <span className="first-letter:uppercase">{GRIP_LABELS[moznost].split(' ')[0]}</span>
                {moznost === vychoziGrip && (
                  <span
                    className={`text-[10px] font-medium ${aktivni ? 'text-on-accent' : 'text-muted'}`}
                  >
                    {gripDitete === undefined ? 'podle věku' : 'dítě teď'}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {maObrazek(`uchop-${grip}`) && (
            <figure className="flex flex-col gap-1">
              <div className="rounded-xl border border-line bg-paper p-2">
                <ObrazekUchopu grip={grip} />
              </div>
              <figcaption className="text-xs text-muted">Úchop {GRIP_SHORT[grip]}</figcaption>
            </figure>
          )}
          <figure className="flex flex-col gap-1">
            <div className="rounded-xl border border-line bg-paper p-2">
              <ObrazekTvaruProUchop grip={grip} />
            </div>
            <figcaption className="text-xs text-muted">Tvar, který z něj plyne</figcaption>
          </figure>
        </div>

        <p className="text-xs font-medium text-muted" data-testid="pruvodce-uchop-vek">
          {GRIP_LABELS[grip].charAt(0).toUpperCase() + GRIP_LABELS[grip].slice(1)} úchop:{' '}
          {GRIP_TYPICAL_MONTHS[grip]}. Orientačně, rozhoduje to, co vidíš.
        </p>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold">Jak ho poznáš</h3>
          <p className="text-sm leading-relaxed">{GRIP_HOW_TO_TELL[grip]}</p>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold">Jaký tvar nabízet</h3>
          <p className="text-sm leading-relaxed" data-testid="pruvodce-tvar">
            {GRIP_SHAPE[grip]}
          </p>
        </div>

        {dite !== null && gripDitete === undefined && (
          <Link
            to="/domacnost"
            className="flex min-h-touch items-center gap-2 self-start rounded-lg text-sm font-semibold text-accent underline"
          >
            <Hand aria-hidden="true" className="h-4 w-4 shrink-0" />
            Nastavit úchop dítěte v Domácnosti
          </Link>
        )}
      </section>

      <section aria-labelledby="ukazky-nadpis" className="flex flex-col gap-3">
        <h2 id="ukazky-nadpis" className="text-sm font-semibold uppercase tracking-wide text-muted">
          Takhle ne, takhle ano
        </h2>
        <p className="text-sm leading-relaxed text-muted">
          Tvar se u téže suroviny mění s věkem. Pokyn pod obrázky je stejný jako v detailu suroviny.
        </p>
        <StageSwitch value={faze} onChange={setFaze} currentStage={aktualniFaze} />
        <ul className="flex flex-col gap-3" data-testid="ukazky-tvaru">
          {UKAZKY_TVARU.map((ukazka) => (
            <Ukazka key={ukazka.id} ukazka={ukazka} faze={faze} />
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="mekkost-nadpis"
        className="flex flex-col gap-3 rounded-xl bg-surface p-4"
        data-testid="pruvodce-mekkost"
      >
        <h2 id="mekkost-nadpis" className="text-sm font-semibold uppercase tracking-wide text-muted">
          Zkouška měkkosti
        </h2>
        {maObrazek('mekkost') && (
          <div className="mx-auto w-48 rounded-xl border border-line bg-paper p-2">
            <ObrazekMekkosti />
          </div>
        )}
        <p className="text-sm leading-relaxed">
          U vařené a dušené zeleniny a ovoce katalog v první fázi opakuje totéž: kousek má jít
          rozmáčknout mezi dvěma prsty. Zkoušej ho až po vychladnutí, horký se zdá tužší, než ve
          skutečnosti je.
        </p>
      </section>

      <nav aria-label="Související" className="flex flex-col gap-2">
        <Link
          to="/rady/uchop-rozhoduje-o-tvaru"
          className="flex min-h-touch items-center justify-between gap-2 rounded-xl bg-surface px-4 py-2 text-sm font-medium"
        >
          <span className="min-w-0">Rada: Úchop rozhoduje o tvaru, věk o výběru</span>
          <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
        </Link>
        <Link
          to="/seznamy/pozor-na-tvar"
          className="flex min-h-touch items-center justify-between gap-2 rounded-xl bg-surface px-4 py-2 text-sm font-medium"
        >
          <span className="min-w-0">Seznam: Pozor na tvar</span>
          <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
        </Link>
        <Link
          to="/rady/daveni-vs-duseni"
          className="flex min-h-touch items-center justify-between gap-2 rounded-xl bg-surface px-4 py-2 text-sm font-medium"
        >
          <span className="min-w-0">Rada: Dávení není dušení</span>
          <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
        </Link>
      </nav>

      <SourceDisclosure sources={[NHS_PREP_SAFELY, NHS_7_9M]} testId="pruvodce-zdroje" />
    </article>
  );
}
