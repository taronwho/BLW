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
 * nesmí ztratit mezi ostatními dlaždicemi. Dostala proto celou šířku, barevný
 * podklad a číslo dne velkým písmem; ostatní karty na obrazovce jsou ploché
 * a světlé, aby ten rozdíl byl vidět na první pohled.
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

  const popisky: Record<typeof stav, { nadpis: string; text: string }> = {
    zacatek: {
      nadpis: '30denní plán',
      text: 'Třicet dnů dopředu. Každý den jedna nová surovina a k ní celá jídla s recepty pro celou rodinu.',
    },
    alergie: {
      nadpis: 'Plán je potřeba přesestavit',
      text: 'Alergie se od sestavení změnily, takže plán může nabízet jídlo, které dítě nesmí.',
    },
    dokonceno: {
      nadpis: `Blok ${plan?.blok ?? 1} je hotový`,
      text: 'Dalších třicet dní se sestaví z toho, co zbývá a co už má dítě za sebou.',
    },
    bezi: {
      // Rodič sem nechodí pro název funkce, ale pro odpověď na jedinou
      // otázku. Nadpis ji proto rovnou pojmenuje.
      nadpis: 'Co dnes vařit',
      text: 'Nová surovina dne a k ní recepty na celý den, pro celou rodinu.',
    },
  };
  const { nadpis, text } = popisky[stav];

  return (
    <Link
      to="/plan"
      data-testid="karta-planu"
      aria-label={`30denní plán, ${stav === 'bezi' ? `na řadě den ${den?.cislo ?? 1} z ${DNU_V_BLOKU}` : nadpis}`}
      /* Hlavička nahoře je taky zelená, takže samotná barva kartu neodliší.
         Světlý rám a silnější stín ji z plochy vytáhnou jako samostatnou
         věc, ne jako pokračování hlavičky. */
      className={`relative flex items-stretch gap-3.5 overflow-hidden rounded-2xl p-4 shadow-lift ring-1 ${
        stav === 'alergie'
          ? 'bg-risk-soft text-ink ring-risk/50'
          : 'bg-accent-sheen text-white ring-white/25'
      }`}
    >
      {/* Číslo dne jako hlavní prvek karty. Rodič ho hledá jako první a
          z odstavce textu se nevyčte tak rychle jako z velké číslice. */}
      {stav === 'bezi' ? (
        <span className="flex w-[4.25rem] shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl bg-white/20 px-1 py-2.5 leading-none ring-1 ring-white/25">
          <span className="text-[10px] font-semibold uppercase tracking-wider opacity-90">den</span>
          <span className="text-[2.15rem] font-bold tabular-nums">{den?.cislo ?? 1}</span>
          <span className="text-[10px] opacity-90">z {DNU_V_BLOKU}</span>
        </span>
      ) : (
        <span
          className={`flex w-16 shrink-0 items-center justify-center rounded-xl ${
            stav === 'alergie' ? 'bg-risk/15 text-risk' : 'bg-white/20'
          }`}
        >
          {stav === 'alergie' ? (
            <AlertTriangle aria-hidden="true" className="h-8 w-8" />
          ) : stav === 'dokonceno' ? (
            <Sparkles aria-hidden="true" className="h-8 w-8" />
          ) : (
            <CalendarCheck aria-hidden="true" className="h-8 w-8" />
          )}
        </span>
      )}

      <span className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        <span className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          <span className="text-[1.05rem] font-bold leading-tight">{nadpis}</span>
          {stav === 'bezi' && plan !== null && plan.blok > 1 && (
            <span className="shrink-0 rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-semibold">
              {plan.blok}. blok
            </span>
          )}
        </span>
        <span
          className={`block text-[11px] leading-snug ${stav === 'alergie' ? 'text-ink/80' : 'text-white/90'}`}
        >
          {text}
        </span>
        {stav === 'bezi' && (
          <span className="mt-0.5 flex items-center gap-2">
            <span
              role="progressbar"
              aria-valuenow={hotovo}
              aria-valuemin={0}
              aria-valuemax={DNU_V_BLOKU}
              aria-label="Postup v plánu"
              className="block h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-white/25 ring-1 ring-inset ring-white/20"
            >
              <span
                className="block h-full rounded-full bg-white transition-all"
                style={{ width: `${(hotovo / DNU_V_BLOKU) * 100}%` }}
              />
            </span>
            <span className="shrink-0 text-[10px] font-semibold tabular-nums text-white/90">
              {hotovo}/{DNU_V_BLOKU}
            </span>
          </span>
        )}
      </span>

      <span className="flex shrink-0 items-center">
        <ChevronRight aria-hidden="true" className="h-5 w-5" />
      </span>
    </Link>
  );
}
