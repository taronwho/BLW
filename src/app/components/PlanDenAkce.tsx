import { Check, Clock3, RotateCcw, Shuffle, SkipForward, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ingredientById } from '@/data';
import { useHouseholdStore } from '@/storage/householdStore';
import { jinyDen, noveSuroviny } from '@/plan/generator';
import { odlozDen, stavDne, type Plan, type PlanDen } from '@/plan/typy';
import { draftPayload, emptyDraft, type Draft } from '../lib/tastingDraft';
import { useModalFokus } from '../lib/modalFokus';
import { usePlanNastroje } from '../lib/plan';
import { TastingForm } from './TastingForm';

/**
 * Co se dá s dnem udělat.
 *
 * Plán nic nevnucuje: den se dá odškrtnout, odložit na jindy, přeskočit
 * úplně, nebo vyměnit za jiný nápad se stejnou novinkou. Bez toho by stačila
 * jedna nemoc a rodič by se k plánu už nevrátil.
 *
 * Odškrtnutí zapíše ochutnávku rovnou do deníku, aby plán a deník nebyly dvě
 * evidence téhož. Zapsat se dá i „jen odškrtnout", protože domýšlet za rodiče,
 * jak jídlo dopadlo, by deník znehodnotilo.
 */
export function PlanDenAkce({ plan, den }: { plan: Plan; den: PlanDen }): ReactNode {
  const ulozPlan = useHouseholdStore((store) => store.ulozPlan);
  const status = useHouseholdStore((store) => store.status);
  const nastavStavDne = useHouseholdStore((store) => store.nastavStavDne);
  const recordTasting = useHouseholdStore((store) => store.recordTasting);
  const { vstup } = usePlanNastroje();
  const [otevreno, setOtevreno] = useState(false);
  /** Kolikrát už si rodič o jiné jídlo řekl. Bez toho by druhé klepnutí
   *  vrátilo tentýž nápad jako to první. */
  const [varianta, setVarianta] = useState(1);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const okenko = useModalFokus<HTMLDivElement>(otevreno);

  const stav = stavDne(plan, den.cislo);
  const novinky = noveSuroviny(den);
  const novinka = ingredientById.get(novinky[0] ?? '');

  useEffect(() => {
    if (!otevreno) return undefined;
    const naKlavesu = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setOtevreno(false);
    };
    window.addEventListener('keydown', naKlavesu);
    return () => window.removeEventListener('keydown', naKlavesu);
  }, [otevreno]);

  async function odskrtni(sZapisem: boolean): Promise<void> {
    if (sZapisem && novinka !== undefined) {
      await recordTasting({
        ingredientId: novinka.id,
        ...draftPayload(draft),
        createdBy: status.kind === 'connected' ? status.uid : 'toto-zarizeni',
      });
    }
    await nastavStavDne(plan.childId, den.cislo, 'hotovo');
    setOtevreno(false);
    setDraft(emptyDraft());
  }

  if (stav !== 'ceka') {
    return (
      <button
        type="button"
        data-testid="den-vratit"
        onClick={() => void nastavStavDne(plan.childId, den.cislo, 'ceka')}
        className="flex min-h-touch items-center justify-center gap-2 rounded-xl border border-line bg-paper px-4 text-sm font-medium"
      >
        <RotateCcw aria-hidden="true" className="h-4 w-4 shrink-0" />
        Vrátit mezi čekající
      </button>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <button
          type="button"
          data-testid="den-hotovo"
          onClick={() => (novinka === undefined ? void odskrtni(false) : setOtevreno(true))}
          className="flex min-h-touch items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-on-accent"
        >
          <Check aria-hidden="true" className="h-4 w-4 shrink-0" />
          Hotovo
        </button>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            data-testid="den-odlozit"
            onClick={() => void ulozPlan(plan.childId, odlozDen(plan, den.cislo))}
            className="flex min-h-touch flex-col items-center justify-center gap-0.5 rounded-xl border border-line bg-paper px-1 text-[11px] font-medium"
          >
            <Clock3 aria-hidden="true" className="h-4 w-4 shrink-0 text-muted" />
            Na jindy
          </button>
          <button
            type="button"
            data-testid="den-jiny"
            onClick={() => {
              const zadani = vstup(plan.blok);
              if (zadani === null) return;
              setVarianta(varianta + 1);
              void ulozPlan(plan.childId, jinyDen(plan, den.cislo, zadani, varianta));
            }}
            className="flex min-h-touch flex-col items-center justify-center gap-0.5 rounded-xl border border-line bg-paper px-1 text-[11px] font-medium"
          >
            <Shuffle aria-hidden="true" className="h-4 w-4 shrink-0 text-muted" />
            Jiné jídlo
          </button>
          <button
            type="button"
            data-testid="den-preskocit"
            onClick={() => void nastavStavDne(plan.childId, den.cislo, 'preskoceno')}
            className="flex min-h-touch flex-col items-center justify-center gap-0.5 rounded-xl border border-line bg-paper px-1 text-[11px] font-medium"
          >
            <SkipForward aria-hidden="true" className="h-4 w-4 shrink-0 text-muted" />
            Přeskočit
          </button>
        </div>
      </div>

      {otevreno &&
        novinka !== undefined &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Jak šla surovina ${novinka.nameCz}`}
            data-testid="den-hotovo-okenko"
            className="fixed inset-0 z-50 flex items-end justify-center bg-scrim/50 p-3 sm:items-center"
            onClick={() => setOtevreno(false)}
          >
            <div
              ref={okenko}
              className="flex max-h-[90vh] w-full max-w-md flex-col gap-3 overflow-y-auto rounded-2xl bg-surface p-4 shadow-lift"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-base font-bold">Jak šlo {novinka.nameCz}?</h2>
                <button
                  type="button"
                  aria-label="Zavřít"
                  onClick={() => setOtevreno(false)}
                  className="flex min-h-touch min-w-touch shrink-0 items-center justify-center rounded-lg text-muted"
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                </button>
              </div>
              <p className="text-xs leading-relaxed text-muted">
                Zápis se uloží do deníku a den se odškrtne. Plán tím postoupí na další den.
              </p>
              <TastingForm
                draft={draft}
                setDraft={setDraft}
                onSubmit={() => void odskrtni(true)}
                onCancel={() => setOtevreno(false)}
                submitLabel="Zapsat a odškrtnout"
              />
              <button
                type="button"
                data-testid="den-hotovo-bez-zapisu"
                onClick={() => void odskrtni(false)}
                className="flex min-h-touch items-center justify-center rounded-xl border border-line bg-paper px-4 text-sm font-medium text-muted"
              >
                Jen odškrtnout, do deníku nezapisovat
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
