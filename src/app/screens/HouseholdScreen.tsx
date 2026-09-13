import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Baby, Copy, Download, KeyRound, ShieldAlert, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ingredients } from '@/data';
import { useHouseholdStore } from '@/storage/householdStore';
import {
  formatHouseholdCode,
  householdPairingUrl,
  isValidHouseholdCode,
  normalizeHouseholdCode,
} from '@/sync/householdCode';
import {
  clearFirebaseConfig,
  hasBuiltInConfig,
  loadFirebaseConfig,
  parseFirebaseConfig,
  saveFirebaseConfig,
} from '@/storage/firebaseConfig';
import { QrCode } from '../QrCode';
import { GripPicker } from '../components/GripPicker';
import { ReadinessPicker } from '../components/ReadinessPicker';
import { SyncStatusBadge } from '../SyncStatusBadge';
import { ChokingLegend } from '../components/ChokingLegend';
import { DISCLAIMER_PARAGRAPHS } from '../disclaimer';
import { ageInMonths, formatAge } from '../lib/age';

/** Domácnost a nastavení (docs/SPEC.md kap. 4.6). */
export function HouseholdScreen(): ReactNode {
  const { state, status, householdCode, init, connect, disconnect, createHousehold, importState, setChild } =
    useHouseholdStore();
  const [codeInput, setCodeInput] = useState('');
  const [configInput, setConfigInput] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [hasConfig, setHasConfig] = useState(false);
  const [childName, setChildName] = useState('');
  const [childBirthDate, setChildBirthDate] = useState('');

  useEffect(() => {
    void init();
    setHasConfig(loadFirebaseConfig() !== null);
  }, [init]);

  useEffect(() => {
    setChildName(state.childName);
    setChildBirthDate(state.childBirthDate);
  }, [state.childName, state.childBirthDate]);

  const vestavenaKonfigurace = hasBuiltInConfig();

  const pairingUrl =
    householdCode === null
      ? null
      : householdPairingUrl(householdCode, window.location.origin + import.meta.env.BASE_URL);

  const needsReview = ingredients.filter((item) => item.reviewStatus === 'needs-review');
  const sourceCount = ingredients.reduce((sum, item) => sum + item.sources.length, 0);
  const organizations = [...new Set(ingredients.flatMap((item) => item.sources.map((s) => s.org)))].sort();

  return (
    <section className="flex flex-col gap-5" aria-labelledby="domacnost-nadpis">
      <h1 id="domacnost-nadpis" className="text-xl font-bold">
        Domácnost
      </h1>

      <form
        className="flex flex-col gap-2 rounded-xl bg-surface p-4"
        onSubmit={(event) => {
          event.preventDefault();
          void setChild(childName.trim(), childBirthDate);
          setMessage('Údaje o dítěti uloženy.');
        }}
      >
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted">
          <Baby aria-hidden="true" className="h-4 w-4 shrink-0" />
          Dítě
        </h2>
        <label htmlFor="jmeno" className="text-sm font-medium">
          Jméno
        </label>
        <input
          id="jmeno"
          value={childName}
          data-testid="jmeno-ditete"
          onChange={(event) => setChildName(event.target.value)}
          className="min-h-touch rounded-lg border border-muted/40 px-3 py-2"
        />
        <label htmlFor="narozeni" className="text-sm font-medium">
          Datum narození
        </label>
        <input
          id="narozeni"
          type="date"
          value={childBirthDate}
          data-testid="datum-narozeni"
          onChange={(event) => setChildBirthDate(event.target.value)}
          className="min-h-touch rounded-lg border border-muted/40 px-3 py-2"
        />
        <p className="text-xs text-muted">
          Podle data narození se předvybírá fáze 6m+ / 9m+ / 12m+ a filtr „Vhodné teď“.
          {state.childBirthDate.length > 0 && ` Teď: ${formatAge(ageInMonths(state.childBirthDate))}.`}
        </p>
        <button type="submit" className="min-h-touch rounded-xl bg-accent px-4 py-3 font-semibold text-white">
          Uložit
        </button>
      </form>

      <div className="rounded-xl bg-surface p-4">
        <ReadinessPicker />
      </div>

      <div className="rounded-xl bg-surface p-4">
        <GripPicker />
      </div>

      <div className="flex flex-col gap-3 rounded-xl bg-surface p-4">
        <SyncStatusBadge status={status} />

        {householdCode === null ? (
          <button
            type="button"
            onClick={() => {
              void createHousehold().then((code) => setMessage(`Kód domácnosti: ${formatHouseholdCode(code)}`));
            }}
            className="min-h-touch rounded-xl bg-accent px-4 py-3 font-semibold text-white"
          >
            Založit domácnost
          </button>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs uppercase tracking-wide text-muted">Párovací kód</p>
            <p data-testid="parovaci-kod" className="font-mono text-2xl font-bold tracking-[0.2em]">
              {formatHouseholdCode(householdCode)}
            </p>
            {pairingUrl !== null && (
              <QrCode value={pairingUrl} label="QR kód pro spárování druhého telefonu" />
            )}
            {pairingUrl !== null && (
              <div className="flex w-full flex-col gap-2">
                <p className="text-xs uppercase tracking-wide text-muted">Odkaz k připojení</p>
                <p
                  data-testid="odkaz-k-pripojeni"
                  className="break-all rounded-lg bg-paper px-3 py-2 text-xs"
                >
                  {pairingUrl}
                </p>
                <button
                  type="button"
                  data-testid="kopirovat-odkaz"
                  onClick={() => {
                    void navigator.clipboard
                      .writeText(pairingUrl)
                      .then(() => setMessage('Odkaz zkopírován. Pošli ho komukoli, kdo se má připojit.'))
                      .catch(() => setMessage('Kopírování neprošlo — odkaz vyber a zkopíruj ručně.'));
                  }}
                  className="flex min-h-touch items-center justify-center gap-2 rounded-xl border border-accent bg-accent-soft px-4 text-sm font-semibold text-accent"
                >
                  <Copy aria-hidden="true" className="h-4 w-4" />
                  Kopírovat odkaz
                </button>
              </div>
            )}
            <p className="text-center text-xs text-muted">
              Kdo odkaz otevře, připojí se jedním klepnutím a uvidí stejný deník. Kdo kód zná, vidí
              do deníku — posílej ho jen lidem, kterým na dítě sáhneš. Domácnost unese pět zařízení.
            </p>
            <button
              type="button"
              onClick={disconnect}
              className="min-h-touch rounded-xl border border-muted/30 px-4 text-sm font-medium text-muted"
            >
              Odpojit tohle zařízení
            </button>
          </div>
        )}
      </div>

      <form
        className="flex flex-col gap-2 rounded-xl bg-surface p-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!isValidHouseholdCode(codeInput)) {
            setMessage('Kód má 10 znaků, například K7M2X-9QRT4.');
            return;
          }
          void connect(normalizeHouseholdCode(codeInput));
          setMessage(null);
        }}
      >
        <label htmlFor="kod" className="text-sm font-medium">
          Připojit se ke stávající domácnosti
        </label>
        <input
          id="kod"
          value={codeInput}
          onChange={(event) => setCodeInput(event.target.value)}
          placeholder="K7M2X-9QRT4"
          autoComplete="off"
          spellCheck={false}
          className="min-h-touch rounded-lg border border-muted/40 px-3 py-2 font-mono uppercase"
        />
        <button type="submit" className="min-h-touch rounded-xl bg-accent px-4 py-3 font-semibold text-white">
          Připojit
        </button>
      </form>

      {vestavenaKonfigurace ? (
        <p className="flex items-start gap-2 rounded-xl bg-surface p-4 text-xs leading-relaxed text-muted">
          <KeyRound aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <span>
            Připojení k Firebase je součástí aplikace, není co vyplňovat. Stačí založit domácnost
            a poslat ostatním odkaz.
          </span>
        </p>
      ) : (
      <form
        className="flex flex-col gap-2 rounded-xl bg-surface p-4"
        onSubmit={(event) => {
          event.preventDefault();
          const parsed = parseFirebaseConfig(configInput);
          if (parsed === null) {
            setMessage('Konfiguraci se nepodařilo přečíst. Vlož celý objekt z Firebase konzole.');
            return;
          }
          saveFirebaseConfig(parsed);
          setHasConfig(true);
          setConfigInput('');
          setMessage('Konfigurace uložena do tohoto prohlížeče.');
        }}
      >
        <label htmlFor="firebase" className="flex items-center gap-2 text-sm font-medium">
          <KeyRound aria-hidden="true" className="h-4 w-4 text-accent" />
          Firebase konfigurace
        </label>
        <p className="text-xs text-muted">
          {hasConfig
            ? 'Konfigurace je uložená v tomhle prohlížeči. Do repozitáře se nikdy nedostane.'
            : 'Bez konfigurace aplikace funguje dál, jen se nesynchronizuje. Postup je v docs/FIREBASE.md.'}
        </p>
        <textarea
          id="firebase"
          value={configInput}
          onChange={(event) => setConfigInput(event.target.value)}
          rows={4}
          placeholder='{ "apiKey": "…", "projectId": "…" }'
          className="rounded-lg border border-muted/40 p-2 font-mono text-xs"
        />
        <div className="flex flex-wrap gap-2">
          <button type="submit" className="min-h-touch rounded-xl bg-accent px-4 py-3 font-semibold text-white">
            Uložit konfiguraci
          </button>
          {hasConfig && (
            <button
              type="button"
              onClick={() => {
                clearFirebaseConfig();
                setHasConfig(false);
                disconnect();
                setMessage('Konfigurace smazána, aplikace běží lokálně.');
              }}
              className="min-h-touch rounded-xl border border-muted/40 px-4 py-3 font-medium"
            >
              Smazat
            </button>
          )}
        </div>
      </form>
      )}

      <div className="flex flex-wrap gap-2 rounded-xl bg-surface p-4">
        <button
          type="button"
          onClick={() => {
            const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `blw-zaloha-${new Date().toISOString().slice(0, 10)}.json`;
            link.click();
            URL.revokeObjectURL(url);
          }}
          className="flex min-h-touch items-center gap-2 rounded-xl border border-muted/40 px-4 py-3 font-medium"
        >
          <Download aria-hidden="true" className="h-4 w-4" />
          Export do JSON
        </button>
        <label className="flex min-h-touch cursor-pointer items-center gap-2 rounded-xl border border-muted/40 px-4 py-3 font-medium">
          <Upload aria-hidden="true" className="h-4 w-4" />
          Import
          <input
            type="file"
            accept="application/json"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file === undefined) return;
              void file.text().then((text) => {
                try {
                  void importState(JSON.parse(text));
                  setMessage('Data naimportována a sloučena.');
                } catch {
                  setMessage('Soubor se nepodařilo přečíst.');
                }
              });
            }}
          />
        </label>
      </div>

      <section aria-labelledby="revize-nadpis" className="flex flex-col gap-2 rounded-xl bg-surface p-4">
        <h2 id="revize-nadpis" className="text-sm font-semibold uppercase tracking-wide text-muted">
          K revizi
        </h2>
        <p className="text-sm font-medium" data-testid="pocet-k-revizi">
          {needsReview.length} položek čeká na ověření z {ingredients.length} surovin
        </p>
        <ul className="flex flex-col gap-1">
          {needsReview.map((item) => (
            <li key={item.id}>
              <Link
                to={`/suroviny/${item.id}`}
                className="flex min-h-touch items-center rounded-lg text-sm font-medium text-accent"
              >
                {item.nameCz}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="zdroje-prehled" className="flex flex-col gap-2 rounded-xl bg-surface p-4">
        <h2
          id="zdroje-prehled"
          className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted"
        >
          <ShieldAlert aria-hidden="true" className="h-4 w-4 shrink-0" />
          Disclaimer a zdroje
        </h2>
        {DISCLAIMER_PARAGRAPHS.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="text-xs leading-relaxed text-muted">
            {paragraph}
          </p>
        ))}
        <p className="text-xs leading-relaxed text-muted">
          Katalog se opírá o {sourceCount} odkazů od: {organizations.join(', ')}.
        </p>
      </section>

      <ChokingLegend />

      {message !== null && (
        <p role="status" className="text-sm text-accent">
          {message}
        </p>
      )}
    </section>
  );
}
