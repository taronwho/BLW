import { AlertTriangle, CalendarX2, CalendarCheck2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ingredientById } from '@/data/ingredients';
import { useHouseholdStore } from '@/storage/householdStore';
import { useAktivniDite } from '../lib/dite';
import { ALLERGEN_LABELS, formatDate, REACTION_LABELS } from '../lib/labels';
import { surovinySReakci } from '../lib/tastings';

/**
 * Upozornění po reakci a vyřazení suroviny z plánu.
 *
 * Aplikace reakci nevyhodnocuje a nic nediagnostikuje (CLAUDE.md, pravidlo
 * 6). Jen připomene, co rodič sám zapsal do deníku, a řekne, co s tím dělá
 * plán: surovinu po reakci ani její alergen sám nenabízí, dokud ji rodič
 * znovu nezapíše bez reakce.
 */

/** Poslední ochutnávky s reakcí aktivního dítěte, podle suroviny. */
function useReakce(): ReturnType<typeof surovinySReakci> {
  const state = useHouseholdStore((store) => store.state);
  const dite = useAktivniDite();
  return useMemo(() => surovinySReakci(state, dite?.id ?? null), [state, dite]);
}

/** Detail suroviny: upozornění po reakci a přepínač „vyřadit z plánu". */
export function ReakceSuroviny({ ingredientId }: { ingredientId: string }): ReactNode {
  const dite = useAktivniDite();
  const prepniVyrazeni = useHouseholdStore((store) => store.prepniVyrazeni);
  const reakce = useReakce().get(ingredientId);
  const surovina = ingredientById.get(ingredientId);
  const vyrazena = dite?.vyrazene?.includes(ingredientId) ?? false;
  const kdo = dite === null || dite.name.trim().length === 0 ? 'dítě' : dite.name;

  return (
    <>
      {reakce !== undefined && (
        <div
          role="note"
          data-testid="upozorneni-reakce"
          className="flex gap-3 rounded-xl border border-risk bg-risk/10 p-4 text-sm leading-relaxed"
        >
          <AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-risk" />
          <div className="flex flex-col gap-1.5">
            <p className="font-semibold text-risk">
              V deníku je reakce: {REACTION_LABELS[reakce.reaction]}, {formatDate(reakce.date)}
            </p>
            {reakce.note !== undefined && reakce.note.trim().length > 0 && (
              <p>Poznámka: {reakce.note}</p>
            )}
            <p>
              Reakci prober s pediatrem. Plán tuhle surovinu
              {surovina !== undefined && surovina.allergens.length > 0
                ? ` ani alergen ${surovina.allergens.map((a) => ALLERGEN_LABELS[a]).join(', ')}`
                : ''}{' '}
              zatím sám nenabízí. Až ji znovu podáš a zapíšeš bez reakce, vrátí se.
            </p>
          </div>
        </div>
      )}

      {dite !== null && (
        <div className="flex flex-col gap-2 rounded-xl bg-surface p-4">
          <p className="text-sm leading-relaxed text-muted">
            {vyrazena
              ? `Vyřazeno z plánu pro ${kdo}. Plán tuhle surovinu nenabídne jako novinku ani v receptu.`
              : `Nechceš, aby plán tuhle surovinu nabízel (${kdo})? Třeba kvůli nesnášenlivosti nebo radě pediatra.`}
          </p>
          <button
            type="button"
            aria-pressed={vyrazena}
            data-testid="prepni-vyrazeni"
            onClick={() => void prepniVyrazeni(dite.id, ingredientId)}
            className="flex min-h-touch items-center justify-center gap-2 self-start rounded-xl border border-line px-4 py-2 text-sm font-semibold text-accent"
          >
            {vyrazena ? (
              <CalendarCheck2 aria-hidden="true" className="h-4 w-4 shrink-0" />
            ) : (
              <CalendarX2 aria-hidden="true" className="h-4 w-4 shrink-0" />
            )}
            {vyrazena ? 'Vrátit do plánu' : 'Vyřadit z plánu'}
          </button>
        </div>
      )}
    </>
  );
}

/**
 * Detail receptu: které suroviny mají v deníku reakci nebo jsou vyřazené.
 * Nic se neskrývá — recept je dál k přečtení, jen o tom rodič ví.
 */
export function ReakceVReceptu({ ingredientIds }: { ingredientIds: readonly string[] }): ReactNode {
  const dite = useAktivniDite();
  const reakce = useReakce();
  const sReakci = ingredientIds.filter((id) => reakce.has(id));
  const vyrazene = ingredientIds.filter(
    (id) => !reakce.has(id) && (dite?.vyrazene?.includes(id) ?? false),
  );
  if (sReakci.length === 0 && vyrazene.length === 0) return null;

  return (
    <div
      role="note"
      data-testid="recept-reakce"
      className="flex gap-3 rounded-xl border border-risk bg-risk/10 p-4 text-sm leading-relaxed"
    >
      <AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-risk" />
      <div className="flex flex-col gap-1.5">
        {sReakci.length > 0 && (
          <p>
            <strong className="font-semibold text-risk">V deníku je reakce na: </strong>
            <SeznamSurovin ids={sReakci} />. Reakci prober s pediatrem.
          </p>
        )}
        {vyrazene.length > 0 && (
          <p>
            <strong className="font-semibold">Vyřazené z plánu: </strong>
            <SeznamSurovin ids={vyrazene} />.
          </p>
        )}
      </div>
    </div>
  );
}

function SeznamSurovin({ ids }: { ids: readonly string[] }): ReactNode {
  return ids.map((id, index) => (
    <span key={id}>
      {index > 0 && ', '}
      <Link to={`/suroviny/${id}`} className="font-medium underline underline-offset-2">
        {ingredientById.get(id)?.nameCz ?? id}
      </Link>
    </span>
  ));
}
