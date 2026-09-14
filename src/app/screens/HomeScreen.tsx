import {
  AlertTriangle,
  BookOpen,
  Carrot,
  ChevronRight,
  LifeBuoy,
  NotebookPen,
  Sparkles,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { CATALOG_COUNTS } from "@/data/counts";
import { useHouseholdStore } from "@/storage/householdStore";
import { STAGE_LABELS, ageInMonths, formatAge, stageForAge } from "../lib/age";
import { GRIP_LABELS, GRIP_SHORT, gripForAge } from "../lib/grip";
import { tastedIds } from "../lib/tastings";
import { useAktivniDite } from "../lib/dite";

const TILES = [
  {
    to: "/suroviny",
    label: "Suroviny",
    desc: "Katalog pro tři fáze",
    Icon: Carrot,
  },
  {
    to: "/recepty",
    label: "Recepty",
    desc: "Vaření pro celou rodinu",
    Icon: BookOpen,
  },
  {
    to: "/rady",
    label: "Rady",
    desc: "Bezpečnost, železo, praxe",
    Icon: LifeBuoy,
  },
  {
    to: "/denik",
    label: "Deník",
    desc: "Co už dítě ochutnalo",
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
  const dite = useAktivniDite();
  const months = ageInMonths(dite?.birthDate ?? "");
  const tasted = useMemo(() => tastedIds(state), [state]);
  const hasChild = dite !== null;
  const stage = STAGE_LABELS[stageForAge(months)];
  const grip = dite?.grip;
  const jmeno = dite?.name.trim() ?? "";

  return (
    <div className="flex flex-col gap-2.5">
      {/* Hlavička říká jen to, co se jinde v aplikaci nedozvíš: komu je
          nastavená a podle čeho se řídí. Dřív tu byly tři odstavce a zabraly
          třetinu obrazovky — vysvětlení úchopu patří k surovině a receptu,
          kde je k čemu, ne na rozcestník. */}
      <header className="rounded-2xl bg-accent-sheen p-4 text-white shadow-lift">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
              Příkrmy metodou BLW
            </p>
            <h1 className="mt-0.5 text-xl font-bold leading-tight">
              {jmeno.length > 0 ? jmeno : "Příkrmy krok za krokem"}
            </h1>
          </div>

          {/* Domácnost patří k hlavičce: mění se v ní právě to, co hlavička
              ukazuje — které dítě, jaká fáze, jaký úchop. Dole pod
              rozcestníkem se k ní muselo rolovat. */}
          <Link
            to="/domacnost"
            data-testid="odkaz-domacnost"
            className="flex min-h-touch shrink-0 items-center gap-1.5 rounded-full bg-white/20 px-3 text-sm font-semibold text-white"
          >
            <Users aria-hidden="true" className="h-4 w-4 shrink-0" />
            Domácnost
          </Link>
        </div>

        {hasChild ? (
          <ul className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <li className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold">
              fáze {stage}
            </li>
            {months !== null && (
              <li className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold">
                {formatAge(months)}
              </li>
            )}
            <li data-testid="uchop-v-hlavicce">
              {grip === undefined ? (
                <Link
                  to="/domacnost"
                  className="flex min-h-touch items-center gap-1 rounded-full bg-white/20 px-3 text-xs font-semibold"
                >
                  úchop {GRIP_LABELS[gripForAge(months)]} — odhad podle věku,
                  upřesnit
                  <ChevronRight
                    aria-hidden="true"
                    className="h-3.5 w-3.5 shrink-0"
                  />
                </Link>
              ) : (
                <span className="flex items-center rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold">
                  úchop {GRIP_LABELS[grip]} — {GRIP_SHORT[grip]}
                </span>
              )}
            </li>
          </ul>
        ) : (
          <p
            className="mt-1.5 text-sm leading-snug text-white"
            data-testid="uchop-v-hlavicce"
          >
            Nastav věk dítěte, ať sedí fáze.
          </p>
        )}

        {!hasChild && (
          <Link
            to="/domacnost"
            className="mt-2.5 inline-flex min-h-touch items-center gap-1.5 rounded-full bg-white px-4 text-sm font-semibold text-accent-deep"
          >
            Nastavit dítě
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        )}
      </header>

      <section aria-label="Když se něco děje" className="flex flex-col gap-2">
        <Link
          to="/rady/daveni-vs-duseni"
          data-testid="dlazdice-daveni"
          className="flex items-center gap-2.5 rounded-xl border-2 border-risk/35 bg-risk-soft p-3 shadow-soft"
        >
          <AlertTriangle
            aria-hidden="true"
            className="h-5 w-5 shrink-0 text-risk"
          />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold text-risk">
              Dávení není dušení
            </span>
            <span className="block text-xs leading-snug text-ink/80">
              Hlučné kuckání je obrana, která funguje. Tiché dítě, které se
              nenadechne, je naopak stav na okamžitý zásah.
            </span>
          </span>
          <ChevronRight
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-risk/70"
          />
        </Link>
        <Link
          to="/rady/prvni-pomoc-pri-duseni"
          className="flex items-center gap-2.5 rounded-xl border border-line bg-surface p-3 shadow-soft"
        >
          <LifeBuoy aria-hidden="true" className="h-5 w-5 shrink-0 text-risk" />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">
              První pomoc při dušení
            </span>
            <span className="block text-xs leading-snug text-muted">
              Pět úderů mezi lopatky, pak stlačení hrudníku. Heimlich do roku
              ne.
            </span>
          </span>
          <ChevronRight
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-muted"
          />
        </Link>
      </section>

      {/* Rozcestník bez nadpisu: čtyři názvy s ikonou se vysvětlí samy
          a řádka navíc znamenala rolování.

          Na nízkém displeji se zkratky vůbec nevykreslí. Míří přesně tam,
          kam vede spodní navigace na každé obrazovce, takže se jimi nic
          neztrácí — a úvodní obrazovka se díky tomu nemusí rolovat ani na
          nejmenších telefonech. Kde je místo, vyplní ho. */}
      <section
        aria-label="Kam dál"
        className="hidden grid-cols-2 gap-2 [@media(min-height:800px)]:grid"
        data-testid="hlavni-menu"
      >
        {TILES.map(({ to, label, desc, Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3 shadow-soft transition hover:border-accent/40 hover:shadow-lift"
          >
            <span className="flex items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-soft">
                <Icon aria-hidden="true" className="h-4 w-4 text-accent" />
              </span>
              <span className="min-w-0 text-sm font-semibold">{label}</span>
            </span>
            <span className="text-[11px] leading-snug text-muted">{desc}</span>
          </Link>
        ))}
      </section>

      {/* Kolik už má dítě za sebou — jediné, co spodní navigace neukáže.
          Dokud žádné dítě není, není co počítat. */}
      {hasChild && (
        <Link
          to="/denik"
          data-testid="postup-do-deniku"
          className="flex items-center gap-2.5 rounded-xl border border-line bg-surface p-3 shadow-soft"
        >
          <Sparkles
            aria-hidden="true"
            className="h-5 w-5 shrink-0 text-accent"
          />
          <span className="min-w-0 flex-1 text-sm font-semibold">
            Ochutnáno {tasted.size} z {CATALOG_COUNTS.ingredients} surovin
          </span>
          <ChevronRight
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-muted"
          />
        </Link>
      )}

      {/* Celý disclaimer je v okně při prvním spuštění i v Domácnosti
          (docs/SPEC.md kap. 3). Tady stačí připomínka. */}
      <p className="px-1 text-[11px] leading-snug text-muted">
        Aplikace shrnuje doporučení odborných institucí. Nenahrazuje pediatra.
      </p>
    </div>
  );
}
