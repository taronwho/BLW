import {
  AlertTriangle,
  BookOpen,
  Carrot,
  ChevronRight,
  LifeBuoy,
  NotebookPen,
  Sparkles,
  Users,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { guides, ingredients, recipes } from '@/data';
import { useHouseholdStore } from '@/storage/householdStore';
import { STAGE_LABELS, ageInMonths, formatAge, stageForAge } from '../lib/age';
import { GRIP_LABELS, GRIP_SHORT, gripForAge } from '../lib/grip';
import { tastedIds } from '../lib/derive';

const TILES = [
  {
    to: '/suroviny',
    label: 'Suroviny',
    desc: 'Katalog s přípravou pro tři fáze',
    Icon: Carrot,
  },
  {
    to: '/recepty',
    label: 'Recepty',
    desc: 'Jedno vaření pro celou rodinu',
    Icon: BookOpen,
  },
  {
    to: '/rady',
    label: 'Rady',
    desc: 'Bezpečnost, železo a zinek, praxe',
    Icon: LifeBuoy,
  },
  {
    to: '/denik',
    label: 'Deník',
    desc: 'Co už dítě ochutnalo',
    Icon: NotebookPen,
  },
] as const;

/**
 * Úvodní obrazovka a hlavní rozcestník.
 *
 * První je vždy blok o dávení a dušení — je to informace, ke které se sahá
 * bez času hledat, takže nesmí být schovaná v podsekci.
 */
export function HomeScreen(): ReactNode {
  const state = useHouseholdStore((store) => store.state);
  const months = ageInMonths(state.childBirthDate);
  const tasted = useMemo(() => tastedIds(state), [state]);
  const hasChild = state.childName.trim().length > 0 || state.childBirthDate.length > 0;
  const stage = STAGE_LABELS[stageForAge(months)];
  const grip = state.childGrip;

  return (
    <div className="flex flex-col gap-5">
      <header className="rounded-3xl bg-accent-sheen p-5 text-white shadow-lift">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">
          Příkrmy metodou BLW
        </p>
        <h1 className="mt-1 text-2xl font-bold leading-tight">
          {state.childName.trim().length > 0 ? state.childName.trim() : 'Příkrmy krok za krokem'}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-white/90">
          {hasChild
            ? `Aktuální fáze ${stage}${months === null ? '' : ` · ${formatAge(months)}`}. Vše v aplikaci se přizpůsobuje tomuhle věku.`
            : 'Nastavte věk dítěte v Domácnosti a aplikace vám bude rovnou ukazovat pokyny pro správnou fázi.'}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-white/90" data-testid="uchop-v-hlavicce">
          {grip === undefined
            ? `Tvar sousta zatím odhadujeme z věku (${GRIP_LABELS[gripForAge(months)]} úchop). Co dítě opravdu umí, se dá nastavit v Domácnosti.`
            : `Úchop ${GRIP_LABELS[grip]} — ${GRIP_SHORT[grip]}. Podle toho se řídí tvar sousta; výběr surovin a měkkost dál podle věku.`}
        </p>
        {(!hasChild || grip === undefined) && (
          <Link
            to="/domacnost"
            className="mt-3 inline-flex min-h-touch items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-accent-deep"
          >
            {hasChild ? 'Nastavit úchop' : 'Nastavit dítě'}
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        )}
      </header>

      <section aria-labelledby="nouze" className="flex flex-col gap-2">
        <h2 id="nouze" className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          Když se něco děje
        </h2>
        <Link
          to="/rady/daveni-vs-duseni"
          data-testid="dlazdice-daveni"
          className="flex items-start gap-3 rounded-2xl border-2 border-risk/35 bg-risk-soft p-4 shadow-soft"
        >
          <AlertTriangle aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-risk" />
          <span className="min-w-0">
            <span className="block text-base font-bold text-risk">Dávení není dušení</span>
            <span className="mt-0.5 block text-sm leading-snug text-ink/80">
              Hlučné kuckání je obrana, která funguje. Tiché dítě, které se nenadechne, je naopak
              stav na okamžitý zásah.
            </span>
          </span>
          <ChevronRight aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-risk/70" />
        </Link>
        <Link
          to="/rady/prvni-pomoc-pri-duseni"
          className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-soft"
        >
          <LifeBuoy aria-hidden="true" className="h-5 w-5 shrink-0 text-risk" />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">První pomoc při dušení</span>
            <span className="block text-xs text-muted">
              Pět úderů mezi lopatky, pak stlačení hrudníku. Heimlich do roku ne.
            </span>
          </span>
          <ChevronRight aria-hidden="true" className="h-5 w-5 shrink-0 text-muted" />
        </Link>
      </section>

      <section aria-labelledby="rozcestnik" className="flex flex-col gap-2">
        <h2 id="rozcestnik" className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          Kam dál
        </h2>
        <div className="grid grid-cols-2 gap-3" data-testid="hlavni-menu">
          {TILES.map(({ to, label, desc, Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex min-h-[112px] flex-col justify-between rounded-2xl border border-line bg-surface p-4 shadow-soft transition hover:border-accent/40 hover:shadow-lift"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft">
                <Icon aria-hidden="true" className="h-5 w-5 text-accent" />
              </span>
              <span>
                <span className="block text-sm font-semibold">{label}</span>
                <span className="mt-0.5 block text-xs leading-snug text-muted">{desc}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="prehled" className="flex flex-col gap-2">
        <h2 id="prehled" className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          Co je uvnitř
        </h2>
        <dl className="grid grid-cols-3 gap-3">
          {[
            { term: 'surovin', value: ingredients.length },
            { term: 'receptů', value: recipes.length },
            { term: 'rad', value: guides.length },
          ].map(({ term, value }) => (
            <div
              key={term}
              className="rounded-2xl border border-line bg-surface px-3 py-3 text-center shadow-soft"
            >
              <dt className="sr-only">{term}</dt>
              <dd>
                <span className="block text-xl font-bold tabular-nums text-accent">{value}</span>
                <span className="block text-[11px] text-muted">{term}</span>
              </dd>
            </div>
          ))}
        </dl>
        {hasChild && (
          <Link
            to="/denik"
            className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-soft"
          >
            <Sparkles aria-hidden="true" className="h-5 w-5 shrink-0 text-accent" />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">
                Ochutnáno {tasted.size} z {ingredients.length} surovin
              </span>
              <span className="block text-xs text-muted">Deník ochutnávek a statistiky</span>
            </span>
            <ChevronRight aria-hidden="true" className="h-5 w-5 shrink-0 text-muted" />
          </Link>
        )}
        <Link
          to="/domacnost"
          className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-soft"
        >
          <Users aria-hidden="true" className="h-5 w-5 shrink-0 text-accent" />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">Domácnost</span>
            <span className="block text-xs text-muted">
              Věk dítěte, fáze a sdílení s druhým rodičem
            </span>
          </span>
          <ChevronRight aria-hidden="true" className="h-5 w-5 shrink-0 text-muted" />
        </Link>
      </section>

      <p className="rounded-2xl bg-surface/60 px-4 py-3 text-xs leading-relaxed text-muted">
        Aplikace shrnuje veřejně dostupná doporučení odborných institucí a odkazuje na ně.
        Nenahrazuje pediatra a nedává lékařská doporučení.
      </p>
    </div>
  );
}
