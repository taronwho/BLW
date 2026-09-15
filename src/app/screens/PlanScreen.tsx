import { ArrowLeft, CalendarCheck, Check, Droplet, Info, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ingredientById } from '@/data';
import { IngredientIcon } from '../components/IngredientIcon';

/**
 * 30denní plán — zatím ukázka, ne hotová funkce.
 *
 * Návrh i otevřené otázky jsou v docs/PLAN-30-DNI.md. Obrazovka existuje
 * proto, aby bylo vidět, jak bude den vypadat, a aby se dalo o podobě
 * mluvit dřív, než se napíše logika, která by se pak přepisovala.
 */

/**
 * Ukázkový den. Skutečný plán si ho spočítá z katalogu a z deníku dítěte.
 *
 * První den stojí samotná surovina bez partnerů schválně: na začátku ještě
 * není z čeho partnera vzít, protože ochutnané není nic. Teprve jak deník
 * roste, má plán čím doplňovat.
 */
const UKAZKA = [
  { den: 1, novinka: 'avokado', zelezo: null, cecko: null, alergen: false },
  { den: 2, novinka: 'ovesne-vlocky-jemne', zelezo: null, cecko: null, alergen: false },
  { den: 3, novinka: 'batat', zelezo: 'ovesne-vlocky-jemne', cecko: null, alergen: false },
  { den: 4, novinka: 'vejce-slepici', zelezo: 'ovesne-vlocky-jemne', cecko: null, alergen: true },
  { den: 5, novinka: 'brokolice', zelezo: 'ovesne-vlocky-jemne', cecko: 'brokolice', alergen: false },
] as const;

const PRAVIDLA = [
  {
    Icon: Sparkles,
    nadpis: 'Jedna nová surovina denně',
    text: 'Když se zavedou dvě a dítě zareaguje, nepozná se na kterou. Zbytek dne se skládá z toho, co už má za sebou.',
  },
  {
    Icon: Droplet,
    nadpis: 'Železo v každém jídle',
    text: 'K nové surovině plán vždycky přidá zdroj železa. U rostlinného železa k tomu ještě vitamin C, bez kterého se vstřebá mnohem hůř.',
  },
  {
    Icon: Check,
    nadpis: 'Alergeny brzy a opakovaně',
    text: 'Každý z devíti klíčových alergenů dostane v plánu tři expozice s odstupem. Odkládání riziko alergie nesnižuje.',
  },
  {
    Icon: CalendarCheck,
    nadpis: 'Den se posune, až jídlo proběhne',
    text: 'Ne o půlnoci. Nemoc ani dovolená pak plán nerozbijí a rodič se nevrací k dvanácti zmeškaným dnům.',
  },
] as const;

function Surovina({ id, popisek }: { id: string; popisek: string }): ReactNode {
  const item = ingredientById.get(id);
  if (item === undefined) return null;
  return (
    <span className="flex items-center gap-1.5 rounded-lg bg-paper px-2 py-1">
      <IngredientIcon ingredient={item} className="h-5 w-5" />
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-wide text-muted">{popisek}</span>
        <span className="text-xs font-medium">{item.nameCz}</span>
      </span>
    </span>
  );
}

export function PlanScreen(): ReactNode {
  return (
    <section className="flex flex-col gap-4" aria-labelledby="plan-nadpis">
      <Link
        to="/"
        className="flex min-h-touch items-center gap-2 self-start text-sm font-semibold text-accent"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4 shrink-0" />
        Zpět domů
      </Link>

      <header className="flex flex-col gap-2">
        <h1 id="plan-nadpis" className="text-xl font-bold">
          30denní plán
        </h1>
        <p
          data-testid="plan-priprava"
          className="flex items-start gap-2 rounded-xl border-2 border-caution/40 bg-caution/10 p-3 text-sm leading-snug"
        >
          <Info aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-caution" />
          <span>
            <strong className="font-semibold">Zatím jen ukázka.</strong> Tohle je návrh podoby,
            aby se o ní dalo mluvit dřív, než se napíše. Plán se nedá spustit ani uložit.
          </span>
        </p>
        <p className="text-sm leading-relaxed text-muted">
          Rodič, který začíná, neví, co nabídnout zítra. Plán dá na každý den jednu novou
          surovinu, k ní partnera se železem a nápad, co z toho uvařit. Počítá se z katalogu
          a z deníku vybraného dítěte: co už je ochutnané, se jako novinka nenabídne.
        </p>
      </header>

      <section aria-labelledby="ukazka-nadpis" className="flex flex-col gap-2">
        <h2 id="ukazka-nadpis" className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          Jak bude vypadat den
        </h2>
        <ul className="flex flex-col gap-2" data-testid="ukazka-dnu">
          {UKAZKA.map(({ den, novinka, zelezo, cecko, alergen }) => (
            <li key={den} className="flex flex-col gap-2 rounded-xl bg-surface p-3">
              <span className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold">Den {den}</span>
                  {alergen && (
                    <span className="rounded-full border border-caution/30 bg-caution/10 px-2 py-0.5 text-[10px] font-semibold text-caution">
                      alergen · 1. expozice
                    </span>
                  )}
                </span>
                <span className="rounded-full bg-paper px-2 py-0.5 text-[11px] text-muted">
                  neodškrtnuto
                </span>
              </span>
              <span className="flex flex-wrap gap-1.5">
                <Surovina id={novinka} popisek="nová" />
                {zelezo !== null && <Surovina id={zelezo} popisek="železo" />}
                {cecko !== null && <Surovina id={cecko} popisek="vitamin C" />}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="pravidla-nadpis" className="flex flex-col gap-2">
        <h2
          id="pravidla-nadpis"
          className="text-[11px] font-semibold uppercase tracking-wide text-muted"
        >
          Podle čeho se bude skládat
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
      </section>

      <p className="rounded-xl bg-surface p-3 text-xs leading-relaxed text-muted">
        Odškrtnutý den zapíše ochutnávku rovnou do deníku, aby plán a deník nebyly dvě evidence
        téhož. Odmítnutá surovina se vrátí o pár dní později. Opakovaná nabídka je u příkrmu
        normální. Při reakci na alergen se ten alergen z plánu vyřadí a aplikace pošle
        k pediatrovi; alergii nediagnostikuje.
      </p>
    </section>
  );
}
