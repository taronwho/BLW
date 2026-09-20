import {
  AlertTriangle,
  BookOpen,
  ChevronRight,
  Dices,
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
        className="flex items-center gap-2.5 rounded-xl border border-accent/30 bg-accent-soft p-1.5 shadow-soft"
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
          className="flex flex-col gap-0.5 rounded-xl border-2 border-risk/35 bg-risk-soft p-1.5 shadow-soft"
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
          className="flex flex-col gap-0.5 rounded-xl border border-line bg-surface p-1.5 shadow-soft"
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

      {/* Náhodný recept hned pod plánem: obojí odpovídá na „co dnes vařit",
          jen jinak. Plán je pořádek, tohle je únik z něj, když se na plán
          zrovna nechce. Proto je řádka vědomě tišší než karta nad ní —
          přerušovaný rám, žádná plocha.

          Je to prostý odkaz, ne tlačítko: losuje se až na adrese
          /recepty/nahoda, aby si úvodní obrazovka kvůli němu nestahovala
          celou kuchařku. */}
      <Link
        to="/recepty/nahoda"
        data-testid="domu-nahodny-recept"
        className="flex min-h-touch items-center gap-2.5 rounded-xl border border-dashed border-accent/50 px-2.5 text-accent"
      >
        <Dices aria-hidden="true" className="h-5 w-5 shrink-0" />
        <span className="min-w-0 flex-1 truncate text-[13px] font-semibold">
          Náhodný recept
        </span>
        <span className="shrink-0 text-[11px] text-muted">když nevíš, co vařit</span>
        <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0" />
      </Link>

      {/* Nákup a deník, každý na vlastní řádce pod plánem.
          Nákup je karta, deník tichá řádka — viz komentář v NakupKarta.tsx.
          Proužek u Ochutnáno se vejde dovnitř dotykového cíle, takže řádku
          ani o bod nezvýšil; rozcestník se musí vejít na displej bez
          rolování. */}
      <section aria-label="Nákup a postup" className="flex flex-col gap-1.5">
        <NakupKarta />
        {hasChild && (
          <Link
            to="/denik"
            data-testid="postup-do-deniku"
            className="flex min-h-touch items-center gap-2 rounded-xl border border-line bg-surface px-2.5 py-1 shadow-soft"
          >
            <Sparkles aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="flex items-baseline justify-between gap-2">
                <span className="shrink-0 text-[13px] font-bold leading-tight">Ochutnáno</span>
                <span className="shrink-0 text-[11px] leading-tight tabular-nums text-ink/75">
                  {tasted.size} z {CATALOG_COUNTS.ingredients} surovin
                </span>
              </span>
              <span
                role="progressbar"
                aria-valuenow={tasted.size}
                aria-valuemin={0}
                aria-valuemax={CATALOG_COUNTS.ingredients}
                aria-label="Kolik surovin už dítě ochutnalo"
                data-testid="ochutnano-postup"
                className="block h-1 w-full overflow-hidden rounded-full bg-accent/20"
              >
                <span
                  className="block h-full rounded-full bg-accent transition-all"
                  style={{ width: `${(tasted.size / CATALOG_COUNTS.ingredients) * 100}%` }}
                />
              </span>
            </span>
            <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
          </Link>
        )}
      </section>


      {/* Seznamy ve vodorovném pásu: na úvodní obrazovce jich není místo víc
          než pár, ale zbytek je vidět hned za okrajem, takže se nepřehlédnou. */}
      {/* Nadpis je jen popisek, ne řádka s odkazem.
          Odkaz „Všechny" stál vedle nadpisu a jako dotykový cíl si bral
          celých 44 px výšky jen pro sebe. Přesunul se na konec pásu, kam
          rodič při prohlížení seznamů stejně dojede — a rozcestník se díky
          tomu vejde na displej i s nákupem a deníkem na vlastních řádkách. */}
      {/* Nadpis je jen pro odečítač obrazovky, ne vlastní řádka.
          Dlaždice v pásu jsou samy sebou popsané a řádka navíc znamenala
          dvacet bodů výšky, o které by se rozcestník musel rolovat. */}
      <section aria-label="Seznamy surovin" className="flex flex-col gap-1">
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
          {/* Poslední dlaždice pásu, ne odkaz nad ním. Kdo dojede na konec,
              má rovnou kudy dál; kdo ne, o nic nepřišel. */}
          <li className="flex snap-start">
            <Link
              to="/seznamy"
              data-testid="vsechny-seznamy"
              className="flex w-28 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-accent/50 p-2 text-center text-xs font-semibold text-accent"
            >
              <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0" />
              Všechny seznamy
            </Link>
          </li>
        </ul>
      </section>

    </div>
  );
}
