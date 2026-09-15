import { Baby, Check, Plus, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { useHouseholdStore } from '@/storage/householdStore';
import type { Child } from '@/types';
import { ageInMonths, formatAge } from '../lib/age';
import { useAktivniDite, useDeti } from '../lib/dite';
import { AllergyPicker } from './AllergyPicker';
import { GripPicker } from './GripPicker';
import { ReadinessPicker } from './ReadinessPicker';

/**
 * Děti v domácnosti a nastavení toho vybraného.
 *
 * Domácnost jich unese víc: sourozenci se v příkrmu potkávají běžně a každý
 * je jinde. Nahoře je proto seznam s přepínačem a teprve pod ním nastavení
 * — připravenost, úchop a alergie — které patří vybranému dítěti, ne
 * domácnosti.
 */
export function ChildrenSection(): ReactNode {
  const deti = useDeti();
  const aktivni = useAktivniDite();
  const addChild = useHouseholdStore((store) => store.addChild);
  const updateChild = useHouseholdStore((store) => store.updateChild);
  const removeChild = useHouseholdStore((store) => store.removeChild);
  const setActiveChild = useHouseholdStore((store) => store.setActiveChild);
  const [pridavam, setPridavam] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <section
        aria-labelledby="deti-nadpis"
        className="flex flex-col gap-3 rounded-xl bg-surface p-4"
      >
        <h2
          id="deti-nadpis"
          className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted"
        >
          <Baby aria-hidden="true" className="h-4 w-4 shrink-0" />
          Děti
        </h2>

        {deti.length === 0 ? (
          <p className="text-sm leading-relaxed text-muted">
            Zatím tu žádné dítě není. Přidej ho a aplikace se rovnou přizpůsobí jeho věku: fáze
            u surovin, filtr „Vhodné teď“ i tvar sousta.
          </p>
        ) : (
          <ul className="flex flex-col gap-2" data-testid="seznam-deti">
            {deti.map((dite) => (
              <li key={dite.id}>
                <button
                  type="button"
                  aria-pressed={dite.id === aktivni?.id}
                  data-testid={`dite-${dite.id}`}
                  onClick={() => setActiveChild(dite.id)}
                  className={`flex min-h-touch w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left ${
                    dite.id === aktivni?.id
                      ? 'border-accent bg-accent-soft'
                      : 'border-line bg-paper'
                  }`}
                >
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-semibold">
                      {dite.name.trim().length > 0 ? dite.name : 'Dítě bez jména'}
                    </span>
                    <span className="text-xs text-muted">
                      {formatAge(ageInMonths(dite.birthDate))}
                    </span>
                  </span>
                  {dite.id === aktivni?.id && (
                    <Check aria-hidden="true" className="h-5 w-5 shrink-0 text-accent" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}

        {pridavam || deti.length === 0 ? (
          <ChildForm
            onSubmit={async (name, birthDate) => {
              await addChild(name, birthDate);
              setPridavam(false);
            }}
            onCancel={deti.length === 0 ? null : () => setPridavam(false)}
          />
        ) : (
          <button
            type="button"
            data-testid="pridat-dite"
            onClick={() => setPridavam(true)}
            className="flex min-h-touch items-center justify-center gap-2 rounded-xl border border-accent bg-accent-soft px-4 text-sm font-semibold text-accent"
          >
            <Plus aria-hidden="true" className="h-4 w-4 shrink-0" />
            Přidat další dítě
          </button>
        )}
      </section>

      {aktivni !== null && (
        <>
          <ChildDetail
            key={aktivni.id}
            dite={aktivni}
            onSave={(name, birthDate) => void updateChild(aktivni.id, { name, birthDate })}
            onRemove={deti.length > 1 ? () => void removeChild(aktivni.id) : null}
          />

          <div className="rounded-xl bg-surface p-4">
            <ReadinessPicker dite={aktivni} />
          </div>

          <div className="rounded-xl bg-surface p-4">
            <GripPicker dite={aktivni} />
          </div>

          <div className="rounded-xl bg-surface p-4">
            <AllergyPicker dite={aktivni} />
          </div>
        </>
      )}
    </div>
  );
}

/** Jméno a datum narození. Používá se při zakládání i při úpravě. */
function ChildForm({
  vychozi,
  onSubmit,
  onCancel,
  submitLabel = 'Uložit',
}: {
  vychozi?: Child;
  onSubmit: (name: string, birthDate: string) => void | Promise<void>;
  onCancel: (() => void) | null;
  submitLabel?: string;
}): ReactNode {
  const [name, setName] = useState(vychozi?.name ?? '');
  const [birthDate, setBirthDate] = useState(vychozi?.birthDate ?? '');
  const idPrefix = vychozi?.id ?? 'nove';

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit(name.trim(), birthDate);
      }}
    >
      <label htmlFor={`jmeno-${idPrefix}`} className="text-sm font-medium">
        Jméno
      </label>
      <input
        id={`jmeno-${idPrefix}`}
        value={name}
        data-testid="jmeno-ditete"
        onChange={(event) => setName(event.target.value)}
        className="min-h-touch rounded-lg border border-muted/40 px-3 py-2"
      />
      <label htmlFor={`narozeni-${idPrefix}`} className="text-sm font-medium">
        Datum narození
      </label>
      <input
        id={`narozeni-${idPrefix}`}
        type="date"
        value={birthDate}
        data-testid="datum-narozeni"
        onChange={(event) => setBirthDate(event.target.value)}
        className="min-h-touch rounded-lg border border-muted/40 px-3 py-2"
      />
      <p className="text-xs leading-relaxed text-muted">
        Podle data narození se předvybírá fáze 6m+ / 9m+ / 12m+ a filtr „Vhodné teď“.
        {birthDate.length > 0 && ` Teď: ${formatAge(ageInMonths(birthDate))}.`}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          data-testid="ulozit-dite"
          className="min-h-touch flex-1 rounded-xl bg-accent px-4 py-3 font-semibold text-on-accent"
        >
          {submitLabel}
        </button>
        {onCancel !== null && (
          <button
            type="button"
            onClick={onCancel}
            className="min-h-touch rounded-xl border border-muted/40 px-4 text-sm font-medium text-muted"
          >
            Zrušit
          </button>
        )}
      </div>
    </form>
  );
}

/** Úprava vybraného dítěte i jeho odebrání. */
function ChildDetail({
  dite,
  onSave,
  onRemove,
}: {
  dite: Child;
  onSave: (name: string, birthDate: string) => void;
  onRemove: (() => void) | null;
}): ReactNode {
  const [potvrzuji, setPotvrzuji] = useState(false);

  return (
    <section
      aria-labelledby="upravit-dite-nadpis"
      className="flex flex-col gap-3 rounded-xl bg-surface p-4"
    >
      <h2
        id="upravit-dite-nadpis"
        className="text-sm font-semibold uppercase tracking-wide text-muted"
      >
        Údaje: {dite.name.trim().length > 0 ? dite.name : 'dítě'}
      </h2>

      <ChildForm vychozi={dite} onSubmit={onSave} onCancel={null} />

      {onRemove !== null &&
        (potvrzuji ? (
          <div className="flex flex-col gap-2 rounded-xl border border-risk/40 bg-risk-soft p-3">
            <p className="text-xs leading-relaxed">
              Opravdu odebrat {dite.name.trim().length > 0 ? dite.name : 'tohle dítě'}? Záznamy
              v deníku zůstanou, patří k datu, ne k seznamu.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                data-testid="odebrat-dite-potvrdit"
                onClick={() => {
                  onRemove();
                  setPotvrzuji(false);
                }}
                className="min-h-touch flex-1 rounded-xl bg-risk px-4 text-sm font-semibold text-white"
              >
                Odebrat
              </button>
              <button
                type="button"
                onClick={() => setPotvrzuji(false)}
                className="min-h-touch rounded-xl border border-muted/40 px-4 text-sm font-medium text-muted"
              >
                Nechat
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            data-testid="odebrat-dite"
            onClick={() => setPotvrzuji(true)}
            className="flex min-h-touch items-center gap-2 self-start rounded-xl border border-muted/40 px-4 text-sm font-medium text-muted"
          >
            <Trash2 aria-hidden="true" className="h-4 w-4 shrink-0" />
            Odebrat dítě
          </button>
        ))}
    </section>
  );
}
