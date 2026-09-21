import { Smartphone, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { useHouseholdStore } from '@/storage/householdStore';
import { MAX_MEMBERS, cekajiciClenove, clenstviZeStavu } from '@/sync/merge';
import { formatDate } from '../lib/labels';

/** Z uid se ukazuje jen začátek — celé je dlouhé a nikomu nic neřekne. */
function zkratka(uid: string): string {
  return uid.slice(0, 6).toUpperCase();
}

/**
 * Zařízení připojená k domácnosti.
 *
 * Anonymní přihlášení váže uid na úložiště prohlížeče. Kdo smaže data nebo
 * aplikaci přeinstaluje, dostane nové uid a připojí se znovu — to staré ale
 * v seznamu zůstane a zabírá jedno z pěti míst. Bez možnosti ho odebrat by se
 * domácnost časem zaplnila mrtvými záznamy a další telefon by se nepřipojil.
 */
export function MemberList(): ReactNode {
  const state = useHouseholdStore((store) => store.state);
  const status = useHouseholdStore((store) => store.status);
  const removeMember = useHouseholdStore((store) => store.removeMember);

  if (status.kind !== 'connected' || state.members.length === 0) return null;

  const jaUid = status.uid;
  const plno = state.members.length >= MAX_MEMBERS;
  // Zařízení nad limit. Dřív se šesté tiše zahodilo při slučování a rodič
  // se o něm nedozvěděl (audit 17. 9. 2026, nález 7.3).
  const cekajici = cekajiciClenove(clenstviZeStavu(state));

  return (
    <section className="flex flex-col gap-2" data-testid="seznam-zarizeni">
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        <Smartphone aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
        Zařízení v domácnosti ({state.members.length} z {MAX_MEMBERS})
      </h2>

      <ul className="flex flex-col gap-2">
        {state.members.map((uid) => {
          const jaTo = uid === jaUid;
          const videno = state.memberSeenAt?.[uid];
          const popis = state.memberLabels?.[uid];
          return (
            <li
              key={uid}
              className="flex items-center gap-2 rounded-xl border border-line bg-paper px-3 py-2"
            >
              <span className="min-w-0 flex-1 text-sm">
                {/* Popis zařízení místo holého uid. „A1B2C3" rodiči neřeklo,
                    které z jeho zařízení to je, a odebrat proto nešlo nic. */}
                <span className="font-medium">{popis ?? 'Neznámé zařízení'}</span>
                {jaTo && <span className="ml-2 text-xs text-accent">tohle zařízení</span>}
                <span className="block text-xs text-muted">
                  <span className="font-mono">{zkratka(uid)}</span>
                  {videno === undefined
                    ? ' · poslední připojení neznámé'
                    : ` · naposled ${formatDate(new Date(videno).toISOString().slice(0, 10))}`}
                </span>
              </span>
              {!jaTo && (
                <button
                  type="button"
                  data-testid={`odebrat-${uid}`}
                  aria-label={`Odebrat zařízení ${popis ?? zkratka(uid)}`}
                  onClick={() => void removeMember(uid)}
                  className="flex min-h-touch min-w-touch items-center justify-center rounded-lg text-muted hover:text-risk"
                >
                  <Trash2 aria-hidden="true" className="h-4 w-4" />
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {cekajici.length > 0 && (
        <div
          className="flex flex-col gap-1 rounded-xl border border-caution bg-caution-soft px-3 py-2"
          data-testid="cekajici-zarizeni"
        >
          <p className="text-sm font-semibold">
            {cekajici.length === 1 ? 'Jedno zařízení čeká na místo' : `Čekajících zařízení: ${cekajici.length}`}
          </p>
          <p className="text-xs leading-relaxed">
            {/* Nezmizela: v domácnosti jsou zapsaná dál. Jakmile se místo
                uvolní, připojí se sama a nikdo nemusí zadávat kód znovu. */}
            Připojila se, ale domácnost má plný počet {MAX_MEMBERS} míst. Odeber některé
            zařízení výš a nastoupí samo:{' '}
            {cekajici
              .map((uid) => state.memberLabels?.[uid] ?? zkratka(uid))
              .join(', ')}
            .
          </p>
        </div>
      )}

      <p className="text-xs leading-relaxed text-muted">
        {plno
          ? 'Domácnost je plná. Další telefon se připojí, až některé zařízení odebereš.'
          : 'Každý prohlížeč se počítá zvlášť. Jeden telefon tu proto může být dvakrát. Třeba jako nainstalovaná aplikace a zvlášť jako prohlížeč, ve kterém se otevřela pozvánka. Co už nepotřebuješ, odeber.'}
      </p>
    </section>
  );
}
