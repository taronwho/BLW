import {
  AlertTriangle,
  ArrowLeft,
  CalendarCheck,
  Check,
  ChevronRight,
  Droplet,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  SkipForward,
  Clock,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ingredientById } from '@/data';
import { noveSuroviny } from '@/plan/generator';
import { useHouseholdStore } from '@/storage/householdStore';
import {
  DNU_V_BLOKU,
  dalsiDen,
  hotovoDnu,
  pribyleAlergie,
  planSediSAlergiemi,
  stavDne,
  type StavDne,
} from '@/plan/typy';
import { blokDokoncen } from '@/plan/typy';
import { IngredientIcon } from '../components/IngredientIcon';
import { PlanDenAkce } from '../components/PlanDenAkce';
import { JidlaDne, NovinkaRadek, PlanDenNahled } from '../components/PlanDenNahled';
import { NakupTlacitko } from '../components/NakupTlacitko';
import { slozkyDoNakupu } from '@/nakup/seznam';
import { useAktivniDite } from '../lib/dite';
import { ALLERGEN_LABELS } from '../lib/labels';
import { useAktivniPlan, usePlanNastroje } from '../lib/plan';

/**
 * Třicetidenní plán jídel.
 *
 * Rozvrh se neváže na kalendář, ale na postup: den se posune, až ho rodič
 * odškrtne. Nemoc ani dovolená pak plán nerozbijí a nikdo se nevrací
 * k dvanácti zmeškaným dnům.
 */

const PRAVIDLA = [
  {
    Icon: Sparkles,
    nadpis: 'Jedna nová surovina denně',
    text: 'Vždycky uvnitř jídla, ne jako lžička vedle talíře. Když se zavedou dvě a dítě zareaguje, nepozná se na kterou.',
  },
  {
    Icon: Droplet,
    nadpis: 'Železo v každém dni',
    text: 'Zásoba železa z těhotenství se kolem půl roku tenčí. Jakmile se začne vařit, má každý den aspoň jedno jídlo, které ho nese.',
  },
  {
    Icon: ShieldCheck,
    nadpis: 'Alergeny brzy a opakovaně',
    text: 'Každý klíčový alergen dostane první nabídku a pak ještě dvě s odstupem tří a sedmi dnů. Odkládání riziko alergie nesnižuje.',
  },
  {
    Icon: Clock,
    nadpis: 'Jídel přibývá podle věku',
    text: 'První týden jedno jídlo denně, druhý dvě, dál tři. Svačiny se přidávají až po prvních narozeninách. Mléko zůstává do roku základ.',
  },
] as const;

export function PlanScreen(): ReactNode {
  const dite = useAktivniDite();
  const plan = useAktivniPlan();
  const { sestav } = usePlanNastroje();
  const ulozPlan = useHouseholdStore((store) => store.ulozPlan);
  const [pracuje, setPracuje] = useState(false);
  /** Poslední odškrtnutý nebo přeskočený den, aby šel vzít zpátky. */
  const [posledni, setPosledni] = useState<{ cislo: number; stav: StavDne } | null>(null);
  /** Číslo dne otevřeného v náhledu, nebo `null`, když je mřížka jen mřížka. */
  const [nahled, setNahled] = useState<number | null>(null);
  const nastavStavDne = useHouseholdStore((store) => store.nastavStavDne);

  /**
   * Sestaví blok. Při pokračování se k deníku přidají suroviny z hotových
   * dnů toho předchozího: rodič, který odškrtával bez zápisu do deníku,
   * by jinak dostal tytéž novinky podruhé.
   */
  async function sestavBlok(blok: number, predchozi?: typeof plan): Promise<void> {
    if (dite === null) return;
    setPracuje(true);
    try {
      const hotove =
        predchozi == null
          ? undefined
          : predchozi.dny
              .filter((den) => stavDne(predchozi, den.cislo) === 'hotovo')
              .flatMap((den) => noveSuroviny(den));
      // Přesestavení téhož bloku musí dát jiné recepty. Generátor je čistá
      // funkce, takže beze změny varianty by vrátil řádek po řádku to samé
      // a tlačítko by vypadalo jako nefunkční.
      const varianta = plan !== null && plan.blok === blok ? (plan.varianta ?? 0) + 1 : 0;
      const novy = sestav(blok, hotove, varianta);
      if (novy !== null) await ulozPlan(dite.id, novy);
    } finally {
      setPracuje(false);
    }
  }

  const zpet = (
    <Link
      to="/"
      className="flex min-h-touch items-center gap-2 self-start text-sm font-semibold text-accent"
    >
      <ArrowLeft aria-hidden="true" className="h-4 w-4 shrink-0" />
      Zpět domů
    </Link>
  );

  const pravidla = (
    <section aria-labelledby="pravidla-nadpis" className="flex flex-col gap-2">
      <h2
        id="pravidla-nadpis"
        className="text-[11px] font-semibold uppercase tracking-wide text-muted"
      >
        Podle čeho se plán skládá
      </h2>
      <ul className="flex flex-col gap-2">
        {PRAVIDLA.map(({ Icon, nadpis, text }) => (
          <li key={nadpis} className="flex items-start gap-2.5 rounded-xl bg-surface p-3">
            <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <span className="min-w-0">
              <span className="block text-sm font-semibold">{nadpis}</span>
              <span className="block text-xs leading-relaxed text-muted">{text}</span>
            </span>
          </li>
        ))}
      </ul>
      <Link
        to="/rady/30denni-plan"
        data-testid="odkaz-rada-plan"
        className="flex min-h-touch items-center gap-1.5 text-xs font-semibold text-accent"
      >
        Odkud se ta pravidla berou
        <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      </Link>
    </section>
  );

  if (dite === null) {
    return (
      <section className="flex flex-col gap-4" aria-labelledby="plan-nadpis">
        {zpet}
        <h1 id="plan-nadpis" className="text-xl font-bold">
          30denní plán
        </h1>
        <p className="rounded-xl bg-surface p-3 text-sm leading-relaxed">
          Plán se počítá z věku dítěte a z toho, co už má v deníku. Nejdřív je proto potřeba
          dítě založit.
        </p>
        <Link
          to="/domacnost"
          data-testid="plan-zaloz-dite"
          className="flex min-h-touch items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-on-accent"
        >
          Nastavit dítě
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </Link>
        {pravidla}
      </section>
    );
  }

  if (plan === null) {
    return (
      <section className="flex flex-col gap-4" aria-labelledby="plan-nadpis">
        {zpet}
        <header className="flex flex-col gap-2">
          <h1 id="plan-nadpis" className="text-xl font-bold">
            30denní plán
          </h1>
          <p className="text-sm leading-relaxed text-muted">
            Třicet dnů dopředu: každý den jedna nová surovina a k ní celá jídla i s recepty.
            Plán se řídí věkem dítěte a jeho deníkem, takže co už je ochutnané, se jako
            novinka znovu nenabídne.
          </p>
        </header>
        <button
          type="button"
          disabled={pracuje}
          data-testid="sestavit-plan"
          onClick={() => void sestavBlok(1)}
          className="flex min-h-touch items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-on-accent disabled:opacity-60"
        >
          <CalendarCheck aria-hidden="true" className="h-4 w-4" />
          Sestavit plán
        </button>
        {pravidla}
      </section>
    );
  }

  const dnes = dalsiDen(plan);
  const hotovo = hotovoDnu(plan);
  const vyrizeno = plan.dny.filter((den) => stavDne(plan, den.cislo) !== 'ceka').length;
  const dokonceno = blokDokoncen(plan);
  const novaAlergie = pribyleAlergie(plan, dite).map((skupina) => ALLERGEN_LABELS[skupina]);
  const nahledDen = plan.dny.find((den) => den.cislo === nahled) ?? null;
  // Sedm nejbližších čekajících dnů. Recept, který se v týdnu opakuje, se
  // do nákupu započítá dvakrát — uvaří se dvakrát, tak se dvakrát nakoupí.
  const tydenDnu = plan.dny.filter((den) => stavDne(plan, den.cislo) === 'ceka').slice(0, 7);
  const davkyTydne = tydenDnu.flatMap((den) =>
    den.jidla.flatMap((jidlo) =>
      jidlo.recipeId === undefined
        ? jidlo.ingredientId === undefined
          ? []
          : [{ ingredientId: jidlo.ingredientId }]
        : slozkyDoNakupu(jidlo.recipeId).map((slozka) => ({
            ...slozka,
            recipeId: jidlo.recipeId,
          })),
    ),
  );
  // Pět dnů dopředu stačí na nákup a nezabere půl obrazovky.
  const pristi = plan.dny
    .filter((den) => stavDne(plan, den.cislo) === 'ceka' && den.cislo !== dnes?.cislo)
    .slice(0, 5);

  return (
    <section className="flex flex-col gap-3" aria-labelledby="plan-nadpis">
      {zpet}

      <header className="flex flex-col gap-2 rounded-2xl bg-accent-sheen p-4 text-white shadow-lift">
        <div className="flex items-baseline justify-between gap-2">
          <h1 id="plan-nadpis" className="text-lg font-bold">
            30denní plán
          </h1>
          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold">
            {plan.blok}. blok
          </span>
        </div>
        <p className="text-xs" data-testid="plan-postup">
          Hotovo {hotovo} z {DNU_V_BLOKU} dnů
          {vyrizeno > hotovo ? `, přeskočeno ${vyrizeno - hotovo}` : ''}
        </p>
        <div
          role="progressbar"
          aria-valuenow={vyrizeno}
          aria-valuemin={0}
          aria-valuemax={DNU_V_BLOKU}
          aria-label="Postup v plánu"
          className="h-2 overflow-hidden rounded-full bg-white/25"
        >
          <span
            className="block h-full rounded-full bg-white transition-all"
            style={{ width: `${(vyrizeno / DNU_V_BLOKU) * 100}%` }}
          />
        </div>
      </header>

      {/* Alergie zapsaná až po sestavení. Plán je hotový rozvrh, takže o ní
          neví a dál nabízí jídlo, které dítě nesmí. Tichá oprava by byla
          horší než upozornění: rodič má vědět, proč se plán mění. */}
      {!planSediSAlergiemi(plan, dite) && (
        <section
          data-testid="plan-jine-alergie"
          className="flex flex-col gap-2 rounded-2xl border-2 border-risk/40 bg-risk-soft p-3"
        >
          <h2 className="flex items-center gap-2 text-sm font-bold text-risk">
            <AlertTriangle aria-hidden="true" className="h-5 w-5 shrink-0" />
            Alergie se změnily
          </h2>
          <p className="text-xs leading-relaxed text-ink/80">
            {novaAlergie.length > 0
              ? `Plán je sestavený bez ohledu na ${novaAlergie.join(' a ')}, protože v té době ještě nebyla v Domácnosti zapsaná. Dokud ho nesestavíš znovu, může nabízet jídlo, které dítě nesmí.`
              : 'Plán je sestavený s jiným seznamem alergií, než je v Domácnosti dnes. Sestav ho znovu, ať odpovídá.'}
          </p>
          <button
            type="button"
            disabled={pracuje}
            data-testid="sestavit-po-alergii"
            onClick={() => void sestavBlok(plan.blok)}
            className="flex min-h-touch items-center justify-center gap-2 rounded-xl bg-risk px-4 text-sm font-semibold text-white disabled:opacity-60"
          >
            <RefreshCw aria-hidden="true" className="h-4 w-4" />
            Sestavit plán znovu
          </button>
        </section>
      )}

      {dnes !== null && (
        <section
          aria-labelledby="dnes-nadpis"
          data-testid="plan-dnes"
          className="flex flex-col gap-2.5 rounded-2xl border-2 border-accent/30 bg-surface p-3 shadow-soft"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 id="dnes-nadpis" className="text-sm font-bold">
              Teď je na řadě den {dnes.cislo}
            </h2>
            <Link
              to={`/plan/den/${dnes.cislo}`}
              data-testid="plan-dnes-detail"
              className="flex min-h-touch items-center gap-1 text-xs font-semibold text-accent"
            >
              Recepty
              <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            </Link>
          </div>
          {dnes.novinka !== undefined && <NovinkaRadek id={dnes.novinka} />}
          <JidlaDne den={dnes} />
          <PlanDenAkce plan={plan} den={dnes} onZmena={(cislo, stav) => setPosledni({ cislo, stav })} />
        </section>
      )}

      {/* Nákup na týden dopředu.
          Plán ví, co se bude vařit, takže seznam surovin z něj vypadne sám;
          bez toho by ho rodič skládal ručně recept po receptu. Bere se sedm
          nejbližších dnů, které ještě čekají, ne celý blok: na měsíc dopředu
          se nenakupuje. */}
      {davkyTydne.length > 0 && (
        <section
          data-testid="plan-nakup"
          aria-label="Nákup podle plánu"
          className="flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-surface p-3"
        >
          <span className="min-w-0 flex-1 text-xs leading-snug text-muted">
            Suroviny z nejbližších {tydenDnu.length} dnů, které ještě čekají. Množství se
            v seznamu sečtou.
          </span>
          <NakupTlacitko
            davky={davkyTydne}
            popis="Příští týden do nákupu"
            potvrzeni="Přidáno do nákupu"
            testId="plan-do-nakupu"
          />
          <Link
            to="/nakup"
            data-testid="plan-otevrit-nakup"
            className="flex min-h-touch items-center gap-1 text-xs font-semibold text-accent"
          >
            Otevřít seznam
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
          </Link>
        </section>
      )}

      <section aria-labelledby="prehled-nadpis" className="flex flex-col gap-2">
        <h2
          id="prehled-nadpis"
          className="text-[11px] font-semibold uppercase tracking-wide text-muted"
        >
          Celý blok
        </h2>
        {/* Pět sloupců, ne šest: na 320px displeji vycházela šestina šířky
            na 43 px a dotykový cíl musí mít aspoň 44 (docs/SPEC.md kap. 6).
            Třicet dnů se tak rozpadne na šest rovných týdnů po pěti. */}
        <ul className="grid grid-cols-5 gap-1.5" data-testid="plan-mrizka">
          {plan.dny.map((den) => {
            const stav = stavDne(plan, den.cislo);
            const teď = dnes !== null && den.cislo === dnes.cislo;
            const barva =
              stav === 'hotovo'
                ? 'border-accent bg-accent text-on-accent'
                : stav === 'preskoceno'
                  ? 'border-line bg-paper text-muted line-through'
                  : teď
                    ? 'border-accent bg-accent-soft font-bold'
                    : 'border-line bg-surface';
            return (
              <li key={den.cislo}>
                {/* Klepnutí na číslo otevře náhled, ne rovnou celý den.
                    Zvědavá otázka „co je devátého?" se tak dá zodpovědět,
                    aniž by rodič odešel z plánu a musel se vracet. */}
                <button
                  type="button"
                  data-testid={`plan-den-${den.cislo}`}
                  aria-haspopup="dialog"
                  aria-label={`Den ${den.cislo}, ${stav === 'hotovo' ? 'hotovo' : stav === 'preskoceno' ? 'přeskočeno' : 'čeká'}`}
                  onClick={() => setNahled(den.cislo)}
                  className={`flex min-h-touch w-full items-center justify-center rounded-lg border text-sm transition ${barva}`}
                >
                  {stav === 'hotovo' ? (
                    <Check aria-hidden="true" className="h-4 w-4" />
                  ) : stav === 'preskoceno' ? (
                    <SkipForward aria-hidden="true" className="h-3.5 w-3.5" />
                  ) : (
                    den.cislo
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {nahledDen !== null && (
        <PlanDenNahled plan={plan} den={nahledDen} onZavrit={() => setNahled(null)} />
      )}

      {/* Vrácení posledního kroku. Přeskočený den zmizí z karty „na řadě" a
          rodič by ho musel hledat v mřížce; nabídnout vrácení hned na místě
          je rychlejší a hlavně to o té možnosti řekne. */}
      {posledni !== null && stavDne(plan, posledni.cislo) !== 'ceka' && (
        <p
          data-testid="plan-vratit-posledni"
          className="flex items-center gap-2 rounded-xl border border-line bg-surface p-2 pl-3 text-xs"
        >
          <span className="min-w-0 flex-1">
            Den {posledni.cislo} {posledni.stav === 'hotovo' ? 'je odškrtnutý' : 'jsi přeskočil'}.
          </span>
          <button
            type="button"
            data-testid="plan-vratit-tlacitko"
            onClick={() => {
              void nastavStavDne(plan.childId, posledni.cislo, 'ceka');
              setPosledni(null);
            }}
            className="flex min-h-touch shrink-0 items-center gap-1.5 rounded-lg px-2 font-semibold text-accent"
          >
            <RotateCcw aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            Vrátit zpět
          </button>
        </p>
      )}

      {/* Co bude dál. Rodič, který jde nakupovat, potřebuje vědět, co ho
          čeká, ale ne celých třicet dnů naráz; proto rozbalovací a jen pár
          dnů. Mřížka nad tím ukazuje postup, tohle obsah. */}
      {pristi.length > 0 && (
        <details className="rounded-xl bg-surface p-3">
          <summary className="min-h-touch cursor-pointer text-sm font-semibold">
            Co bude dál
          </summary>
          <ul className="mt-2 flex flex-col gap-2" data-testid="plan-pristi-dny">
            {pristi.map((den) => {
              const novinka = ingredientById.get(den.novinka ?? '');
              return (
                <li key={den.cislo}>
                  <Link
                    to={`/plan/den/${den.cislo}`}
                    className="flex min-h-touch items-center gap-2 rounded-lg bg-paper px-2 py-1.5"
                  >
                    <span className="w-12 shrink-0 text-[11px] font-semibold text-muted">
                      den {den.cislo}
                    </span>
                    {novinka === undefined ? (
                      <span className="min-w-0 flex-1 text-xs text-muted">bez nové suroviny</span>
                    ) : (
                      <>
                        <IngredientIcon ingredient={novinka} className="h-5 w-5 shrink-0" />
                        <span className="min-w-0 flex-1 truncate text-xs font-medium">
                          {novinka.nameCz}
                        </span>
                      </>
                    )}
                    <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-muted" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </details>
      )}

      {dokonceno && (
        <section
          data-testid="plan-dalsi-blok"
          className="flex flex-col gap-2 rounded-2xl border-2 border-accent/30 bg-accent-soft p-3"
        >
          <h2 className="text-sm font-bold">Blok máš za sebou</h2>
          <p className="text-xs leading-relaxed text-ink/75">
            Dalších třicet dnů se sestaví z toho, co zbývá: novinky se vyberou z deníku, jídel
            přibude podle věku a recepty se vymění za jiné.
          </p>
          <button
            type="button"
            disabled={pracuje}
            data-testid="sestavit-dalsi-blok"
            onClick={() => void sestavBlok(plan.blok + 1, plan)}
            className="flex min-h-touch items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-on-accent disabled:opacity-60"
          >
            <CalendarCheck aria-hidden="true" className="h-4 w-4" />
            Sestavit dalších 30 dní
          </button>
        </section>
      )}

      <details className="rounded-xl bg-surface p-3">
        <summary className="min-h-touch cursor-pointer text-sm font-semibold">
          Plán nesedí, chci ho jinak
        </summary>
        <div className="mt-2 flex flex-col gap-2">
          <p className="text-xs leading-relaxed text-muted">
            Sestavením znovu se blok spočítá od začátku podle dnešního deníku a věku. Odškrtnuté
            dny se tím ztratí, zápisy v deníku zůstanou.
          </p>
          <button
            type="button"
            disabled={pracuje}
            data-testid="sestavit-znovu"
            onClick={() => void sestavBlok(plan.blok)}
            className="flex min-h-touch items-center justify-center gap-2 rounded-xl border border-line bg-paper px-4 text-sm font-semibold disabled:opacity-60"
          >
            <RefreshCw aria-hidden="true" className="h-4 w-4" />
            Sestavit tenhle blok znovu
          </button>
          <button
            type="button"
            disabled={pracuje}
            data-testid="zrusit-plan"
            onClick={() => void ulozPlan(dite.id, null)}
            className="flex min-h-touch items-center justify-center rounded-xl border border-line bg-paper px-4 text-sm font-medium text-muted disabled:opacity-60"
          >
            Plán zrušit
          </button>
        </div>
      </details>

      {pravidla}
    </section>
  );
}
