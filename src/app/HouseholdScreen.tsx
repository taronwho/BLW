import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Download, KeyRound, Upload } from 'lucide-react';
import { useHouseholdStore } from '@/storage/householdStore';
import {
  formatHouseholdCode,
  householdPairingUrl,
  isValidHouseholdCode,
  normalizeHouseholdCode,
} from '@/sync/householdCode';
import {
  clearFirebaseConfig,
  loadFirebaseConfig,
  parseFirebaseConfig,
  saveFirebaseConfig,
} from '@/storage/firebaseConfig';
import { QrCode } from './QrCode';
import { SyncStatusBadge } from './SyncStatusBadge';

/**
 * Domácnost a nastavení (docs/SPEC.md kapitola 4.6) v rozsahu fáze 5:
 * párovací kód, QR, stav synchronizace, Firebase konfigurace a export dat.
 * Zbytek obrazovky doplní fáze 4.
 */
export function HouseholdScreen(): ReactNode {
  const { state, status, householdCode, init, connect, disconnect, createHousehold, importState } =
    useHouseholdStore();
  const [codeInput, setCodeInput] = useState('');
  const [configInput, setConfigInput] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [hasConfig, setHasConfig] = useState(false);

  useEffect(() => {
    void init();
    setHasConfig(loadFirebaseConfig() !== null);
  }, [init]);

  const pairingUrl =
    householdCode === null ? null : householdPairingUrl(householdCode, window.location.origin + import.meta.env.BASE_URL);

  return (
    <section className="flex flex-col gap-5" aria-labelledby="domacnost-nadpis">
      <h2 id="domacnost-nadpis" className="text-lg font-semibold">
        Domácnost
      </h2>

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
            <p
              data-testid="parovaci-kod"
              className="font-mono text-2xl font-bold tracking-[0.2em]"
            >
              {formatHouseholdCode(householdCode)}
            </p>
            {pairingUrl !== null && (
              <QrCode value={pairingUrl} label="QR kód pro spárování druhého telefonu" />
            )}
            <p className="text-center text-xs text-muted">
              Na druhém telefonu kód naskenuj nebo přepiš. Kdo kód zná, vidí do deníku — sdílej ho
              jen doma.
            </p>
            <button
              type="button"
              onClick={disconnect}
              className="min-h-touch text-sm font-medium text-muted underline"
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

      {message !== null && (
        <p role="status" className="text-sm text-accent">
          {message}
        </p>
      )}
    </section>
  );
}
