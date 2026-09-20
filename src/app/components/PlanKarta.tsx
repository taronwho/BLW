import { AlertTriangle, CalendarCheck, ChevronRight, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useHouseholdStore } from '@/storage/householdStore';
import { DNU_V_BLOKU, blokDokoncen, dalsiDen, planSediSAlergiemi, vyrizenoDnu } from '@/plan/typy';
import { useAktivniDite } from '../lib/dite';

/**
 * Plán na úvodní obrazovce.
 *
 * Je to jediná karta, která rodiči odpovídá na otázku „co dneska", takže se
 * nesmí ztratit mezi ostatními dlaždicemi. Barvou ji ale odlišit nejde tak,
 * jak by se nabízelo: hlavička nad ní je plná zelená a druhá plná zelená
 * plocha s ní splyne. Karta je proto zelená obráceně, tedy světlý podklad
 * s výrazným rámem a plnou zelenou jen na číslici dne. Rám zároveň dělá to,
 * co má tlačítko dělat, totiž svádí na sebe klepnout.
 *
 * Schválně bez jediného importu katalogu: úvodní obrazovka je v prvním balíku
 * aplikace a stačí jí číslo dne a postup. Názvy surovin a recepty se dotahují
 * až na obrazovce plánu, kterou si stáhne jen ten, kdo ji otevře.
 */
export function PlanKarta(): ReactNode {
  const dite = useAktivniDite();
  const plans = useHouseholdStore((store) => store.state.plans);
  const plan = dite === null ? null : (plans?.[dite.id]?.hodnota ?? null);

  // Neshoda s alergiemi se pozná porovnáním dvou seznamů, bez katalogu.
  // Proto se o ní dá říct i tady, na obrazovce, která si katalog nestahuje.
  const sedi = plan === null || planSediSAlergiemi(plan, dite);
  const hotovo = plan === null ? 0 : vyrizenoDnu(plan);
  const den = plan === null ? null : dalsiDen(plan);

  const stav: 'zacatek' | 'alergie' | 'dokonceno' | 'bezi' =
    plan === null ? 'zacatek' : !sedi ? 'alergie' : blokDokoncen(plan) ? 'dokonceno' : 'bezi';

  /**
   * Popisky se vejdou na jednu řádku.
   *
   * Dvě řádky tu stály čtrnáct bodů výšky a rozcestník se musí vejít na
   * displej celý. Delší vysvětlení má plán na vlastní obrazovce, kam se
   * kliká odsud — tohle je rozcestník, ne článek.
   */
  const popis: Record<typeof stav, string> = {
    zacatek: 'Třicet dnů, každý s novou surovinou.',
    alergie: 'Alergie se změnily, sestav plán znovu.',
    dokonceno: `Blok ${plan?.blok ?? 1} je hotový. Dá se sestavit další.`,
    bezi: 'Co dnes vařit a co dítě ještě nezná.',
  };

  const varovani = stav === 'alergie';

  return (
    <Link
      to="/plan"
      data-testid="karta-planu"
      aria-label={`30denní plán. ${stav === 'bezi' ? `Na řadě den ${den?.cislo ?? 1} z ${DNU_V_BLOKU}.` : popis[stav]}`}
      /* Silnější stín než u ostatních karet. Rám říká „klikni sem", stín
         kartu nadzvedne nad ploché dlaždice kolem. */
      className={`flex grow items-stretch gap-3 rounded-2xl border-2 p-2 shadow-lift ${
        varovani ? 'border-risk/50 bg-risk-soft' : 'border-accent bg-accent-soft'
      }`}
    >
      {/* Plná barva je jen tady, na číslici. Drží pohled a zároveň nedělá
          z celé karty druhou zelenou plochu vedle hlavičky. */}
      <span
        /* Výška je omezená a políčko se drží na střed. Bez toho se na
           vysokém displeji natáhlo s kartou do úzkého sloupku přes půl
           obrazovky a vypadalo jako domino, ne jako číslo dne. */
        className={`flex max-h-20 w-14 shrink-0 flex-col items-center justify-center gap-0.5 self-center rounded-xl leading-none ${
          varovani ? 'bg-risk text-white' : 'bg-accent text-on-accent'
        }`}
      >
        {stav === 'bezi' ? (
          <>
            <span className="text-[9px] font-semibold uppercase tracking-wider opacity-90">den</span>
            <span className="text-2xl font-bold tabular-nums">{den?.cislo ?? 1}</span>
            <span className="text-[9px] opacity-90">z {DNU_V_BLOKU}</span>
          </>
        ) : varovani ? (
          <AlertTriangle aria-hidden="true" className="h-7 w-7" />
        ) : stav === 'dokonceno' ? (
          <Sparkles aria-hidden="true" className="h-7 w-7" />
        ) : (
          <CalendarCheck aria-hidden="true" className="h-7 w-7" />
        )}
      </span>

      <span className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
        <span className="flex flex-wrap items-center gap-x-1.5">
          <span className="text-base font-bold leading-tight">30denní plán</span>
          {stav === 'bezi' && plan !== null && plan.blok > 1 && (
            <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold">
              {plan.blok}. blok
            </span>
          )}
        </span>
        <span className="block text-[11px] leading-snug text-ink/75">{popis[stav]}</span>
        {stav === 'bezi' && (
          <span className="mt-1 flex items-center gap-2">
            <span
              role="progressbar"
              aria-valuenow={hotovo}
              aria-valuemin={0}
              aria-valuemax={DNU_V_BLOKU}
              aria-label="Postup v plánu"
              className="block h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-accent/20"
            >
              <span
                className="block h-full rounded-full bg-accent transition-all"
                style={{ width: `${(hotovo / DNU_V_BLOKU) * 100}%` }}
              />
            </span>
            <span className="shrink-0 text-[10px] font-semibold tabular-nums text-ink/75">
              {hotovo}/{DNU_V_BLOKU}
            </span>
          </span>
        )}
      </span>

      <span className={`flex shrink-0 items-center ${varovani ? 'text-risk' : 'text-accent'}`}>
        <ChevronRight aria-hidden="true" className="h-5 w-5" />
      </span>
    </Link>
  );
}
