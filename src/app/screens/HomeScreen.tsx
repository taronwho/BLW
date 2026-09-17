import {
  AlertTriangle,
  BookOpen,
  ChevronRight,
  LifeBuoy,
  Sparkles,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { CATALOG_COUNTS } from "@/data/counts";
import { lists } from "@/data/lists";
import { SeznamDlazdice } from "../components/SeznamDlazdice";
import { PlanKarta } from "../components/PlanKarta";
import { NakupKarta } from "../components/NakupKarta";
import { useHouseholdStore } from "@/storage/householdStore";
import { STAGE_LABELS, ageInMonths, formatAge, stageForAge } from "../lib/age";
import { GRIP_LABELS, gripForAge } from "../lib/grip";
import { tastedIds } from "../lib/tastings";
import { useAktivniDite } from "../lib/dite";

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
  const tasted = useMemo(
    () => tastedIds(state, dite?.id ?? null),
    [state, dite],
  );
  const hasChild = dite !== null;
  const stage = STAGE_LABELS[stageForAge(months)];
  const grip = dite?.grip;
  const jmeno = dite?.name.trim() ?? "";

  return (
    <div className="flex flex-col gap-1">
      {/* Hlavička je jeden řádek, ne blok.
          Jméno dítěte i fázi ukazuje horní lišta, takže tady stačí to, co
          se jinde nedozvíš: podle čeho je aplikace nastavená a kudy se to
          mění. Dřív tu byly dva řádky odznaků a vytlačily zbytek
          rozcestníku pod okraj displeje. */}
      <header className="rounded-2xl bg-accent-sheen px-3 py-1 text-white shadow-lift">
        <div className="flex items-center justify-between gap-2">
          {hasChild ? (
            <Link
              to="/domacnost"
              data-testid="uchop-v-hlavicce"
              className="flex min-h-touch min-w-0 flex-1 flex-col justify-center"
            >
              <h1 className="truncate text-sm font-bold leading-tight">
                {jmeno.length > 0 ? jmeno : "Příkrmy krok za krokem"}
              </h1>
              {/* Jeden řádek, ne odstavec: delší poznámka („odhad podle
                  věku") se sem nevejde a ořízla by i to podstatné. Kdo
                  chce vědět víc, klepne a je v Domácnosti. */}
              <span className="truncate text-[10px] leading-tight text-white/85">
                fáze {stage}
                {months === null ? "" : ` · ${formatAge(months)}`} ·{" "}
                {GRIP_LABELS[grip ?? gripForAge(months)]} úchop
              </span>
            </Link>
          ) : (
            /* Bez dítěte nemá hlavička co ukazovat, zůstává jen výzva. */
            <Link
              to="/domacnost"
              data-testid="uchop-v-hlavicce"
              className="flex min-h-touch min-w-0 flex-1 flex-col justify-center"
            >
              <h1 className="truncate text-sm font-bold leading-tight">
                Příkrmy krok za krokem
              </h1>
              <span className="truncate text-[10px] leading-tight text-white/85">
                Nastav dítě a fázi, ať sedí porce i tvar soust
              </span>
            </Link>
          )}

          {/* Domácnost patří k hlavičce: mění se v ní právě to, co hlavička
              ukazuje — které dítě, jaká fáze, jaký úchop. */}
          <Link
            to="/domacnost"
            data-testid="odkaz-domacnost"
            className="flex min-h-touch shrink-0 items-center gap-1 rounded-full bg-white/20 px-2.5 text-[13px] font-semibold text-white"
          >
            <Users aria-hidden="true" className="h-4 w-4 shrink-0" />
            Domácnost
          </Link>
        </div>
      </header>

      {/* Co to vlastně je. Rodič, který aplikaci otevře poprvé, tuhle
          otázku má — a odpověď i se zdroji už v Radách je, takže se sem
          nepíše podruhé, jen se na ni ukazuje. */}
      <Link
        to="/rady/co-je-blw"
        data-testid="karta-co-je-blw"
        className="flex items-center gap-2.5 rounded-xl border border-accent/30 bg-accent-soft p-2 shadow-soft"
      >
        <BookOpen aria-hidden="true" className="h-5 w-5 shrink-0 text-accent" />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">Co je BLW</span>
          <span className="block text-[11px] leading-tight text-ink/75">
            Dítě jí samo kusy ze společného stolu, místo aby se krmilo lžičkou.
            Od šesti měsíců a jen když je na to vývojově zralé.
          </span>
        </span>
        <ChevronRight
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-accent"
        />
      </Link>

      {/* Dvě dlaždice v řádce místo dvou karet pod sebou. Informace, ke které
          se sahá bez času hledat, musí být vidět hned — ale nemusí kvůli tomu
          zabírat třetinu obrazovky. */}
      <section
        aria-label="Když se něco děje"
        className="grid grid-cols-2 gap-2"
      >
        <Link
          to="/rady/daveni-vs-duseni"
          data-testid="dlazdice-daveni"
          className="flex flex-col gap-0.5 rounded-xl border-2 border-risk/35 bg-risk-soft p-2 shadow-soft"
        >
          <AlertTriangle
            aria-hidden="true"
            className="h-5 w-5 shrink-0 text-risk"
          />
          <span className="text-[13px] font-bold leading-tight text-risk">
            Dávení není dušení
          </span>
          <span className="text-[11px] leading-tight text-ink/80">
            Hlučné kuckání je obrana. Tiché dítě je nouze.
          </span>
        </Link>
        <Link
          to="/rady/prvni-pomoc-pri-duseni"
          data-testid="dlazdice-prvni-pomoc"
          className="flex flex-col gap-0.5 rounded-xl border border-line bg-surface p-2 shadow-soft"
        >
          <LifeBuoy aria-hidden="true" className="h-5 w-5 shrink-0 text-risk" />
          <span className="text-[13px] font-bold leading-tight">První pomoc</span>
          <span className="text-[11px] leading-tight text-muted">
            Pět úderů mezi lopatky. Heimlich do roku ne.
          </span>
        </Link>
      </section>

      {/* Plán je jediná část aplikace, která rodiči řekne, co má být zítra.
          Proto má na úvodní obrazovce samostatnou kartu, ne řádek v seznamu. */}
      <PlanKarta />

      {/* Nákup a deník v jedné řádce pod plánem.
          Obojí je jen číslo, na které se rodič kouká cestou: co koupit a jak
          daleko je dítě v katalogu. Přes celou šířku braly dvě řádky
          a vytlačily konec obrazovky pod okraj displeje. */}
      <section aria-label="Nákup a postup" className="grid grid-cols-2 gap-1.5">
        <NakupKarta />
        {hasChild && (
          <Link
            to="/denik"
            data-testid="postup-do-deniku"
            className="flex flex-col gap-0.5 rounded-xl border border-line bg-surface p-2 shadow-soft"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
              <span className="text-[13px] font-bold leading-tight">Ochutnáno</span>
            </span>
            <span className="text-[11px] leading-tight text-ink/75">
              {tasted.size} z {CATALOG_COUNTS.ingredients} surovin
            </span>
          </Link>
        )}
      </section>


      {/* Seznamy ve vodorovném pásu: na úvodní obrazovce jich není místo víc
          než pár, ale zbytek je vidět hned za okrajem, takže se nepřehlédnou. */}
      <section aria-labelledby="seznamy-nadpis" className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <h2
            id="seznamy-nadpis"
            className="text-[11px] font-semibold uppercase tracking-wide text-muted"
          >
            Seznamy
          </h2>
          <Link
            to="/seznamy"
            data-testid="vsechny-seznamy"
            className="flex min-h-touch items-center gap-1 text-xs font-semibold text-accent"
          >
            Všechny
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
          </Link>
        </div>
        {/* Záporné okraje vytáhnou pás k okraji displeje, ať je poznat, že
            pokračuje; obsah si vnitřní odsazení vrací zpátky. */}
        <ul
          className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-0.5"
          data-testid="pas-seznamu"
        >
          {lists.map((seznam) => (
            <li key={seznam.id} className="flex snap-start">
              <SeznamDlazdice
                seznam={seznam}
                ochutnano={
                  seznam.polozky.filter((polozka) => tasted.has(polozka.id)).length
                }
                compact
              />
            </li>
          ))}
        </ul>
      </section>

    </div>
  );
}
