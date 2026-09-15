import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Baby, Copy, Download, KeyRound, Settings2, ShieldAlert, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ingredients } from '@/data/ingredients';
import { useHouseholdStore } from '@/storage/householdStore';
import {
  formatHouseholdCode,
  householdPairingUrl,
  isValidHouseholdCode,
  normalizeHouseholdCode,
} from '@/sync/householdCode';
import { hasFirebaseConfig } from '@/storage/firebaseConfig';
import { QrCode } from '../QrCode';
import { ChildrenSection } from '../components/ChildrenSection';
import { MemberList } from '../components/MemberList';
import { ThemePicker } from '../components/ThemePicker';
import { SyncStatusBadge } from '../SyncStatusBadge';
import { ChokingLegend } from '../components/ChokingLegend';
import { DISCLAIMER_PARAGRAPHS } from '../disclaimer';
import { useUrlText } from '../lib/urlState';

/**
 * Okruhy nastavení. Dítě je první, protože kvůli němu sem rodič chodí
 * nejčastěji; sdílení a nastavení aplikace se řeší jednou za čas.
 */
const SEKCE = [
  { id: 'deti', label: 'Děti', Icon: Baby },
  { id: 'sdileni', label: 'Sdílení', Icon: KeyRound },
  { id: 'aplikace', label: 'Aplikace', Icon: Settings2 },
] as const;

type Sekce = (typeof SEKCE)[number]['id'];
const SEKCE_IDS = SEKCE.map((jedna) => jedna.id);

/** Domácnost a nastavení (docs/SPEC.md kap. 4.6). */
export function HouseholdScreen(): ReactNode {
  const { state, status, householdCode, init, connect, disconnect, createHousehold, importState } =
    useHouseholdStore();
  const [codeInput, setCodeInput] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  // Sekce drží adresa, aby se dala poslat odkazem a přežila tlačítko Zpět.
  const [sekce, setSekce] = useUrlText<Sekce>('sekce', 'deti', SEKCE_IDS);

  useEffect(() => {
    void init();
  }, [init]);

  const sdileniNastavene = hasFirebaseConfig();

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

      {/* Tři okruhy místo jedné dlouhé roury. Dřív se sem vešlo dítě,
          připravenost, úchop, motiv, párování, záloha, seznam k revizi
          i disclaimer pod sebe a rodič scrolloval přes celou obrazovku,
          aby našel párovací kód. */}
      <nav aria-label="Okruhy nastavení">
        <ul className="flex gap-1 rounded-xl bg-surface p-1" data-testid="sekce-domacnosti">
          {SEKCE.map(({ id, label, Icon }) => (
            <li key={id} className="flex-1">
              <button
                type="button"
                aria-current={sekce === id ? 'page' : undefined}
                data-testid={`sekce-${id}`}
                onClick={() => setSekce(id)}
                className={`flex min-h-touch w-full items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-semibold transition ${
                  sekce === id ? 'bg-accent text-on-accent shadow-soft' : 'text-muted'
                }`}
              >
                <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {sekce === 'deti' && <ChildrenSection />}

      {sekce === 'sdileni' && (
        <>
      <div className="flex flex-col gap-3 rounded-xl bg-surface p-4">
        <SyncStatusBadge status={status} />

        {householdCode === null ? (
          <button
            type="button"
            onClick={() => {
              void createHousehold().then((code) => setMessage(`Kód domácnosti: ${formatHouseholdCode(code)}`));
            }}
            className="min-h-touch rounded-xl bg-accent px-4 py-3 font-semibold text-on-accent"
          >
            Založit domácnost
          </button>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs uppercase tracking-wide text-muted">Párovací kód</p>
            <p data-testid="parovaci-kod" className="font-mono text-2xl font-bold tracking-[0.2em]">
              {formatHouseholdCode(householdCode)}
            </p>
            {/* Kód je spolehlivější cesta než odkaz: ten se v chatu otevře ve
                vestavěném prohlížeči té aplikace a spáruje se on, ne
                nainstalovaný Drobek. */}
            <button
              type="button"
              data-testid="kopirovat-kod"
              onClick={() => {
                void navigator.clipboard
                  .writeText(formatHouseholdCode(householdCode))
                  .then(() => setMessage('Kód zkopírován. Druhý rodič ho vloží v aplikaci níž do políčka.'))
                  .catch(() => setMessage('Kopírování neprošlo: kód opiš ručně.'));
              }}
              className="flex min-h-touch items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-on-accent"
            >
              <Copy aria-hidden="true" className="h-4 w-4 shrink-0" />
              Zkopírovat kód
            </button>
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
                      .catch(() => setMessage('Kopírování neprošlo: odkaz vyber a zkopíruj ručně.'));
                  }}
                  className="flex min-h-touch items-center justify-center gap-2 rounded-xl border border-accent bg-accent-soft px-4 text-sm font-semibold text-accent"
                >
                  <Copy aria-hidden="true" className="h-4 w-4" />
                  Kopírovat odkaz
                </button>
              </div>
            )}
            {/* Poslaný odkaz se v chatu otevře ve vestavěném prohlížeči té
                aplikace — spáruje se on, ne nainstalovaný Drobek, a z jednoho
                telefonu tak v domácnosti vzniknou dvě zařízení. Tohle je
                jediné místo, kde se to dá říct dřív, než se to stane. */}
            <p className="rounded-lg bg-paper px-3 py-2 text-xs leading-relaxed text-muted">
              <strong className="font-semibold text-ink">Nejjistější cesta:</strong> na druhém
              telefonu otevřít nainstalovaného Drobka a kód do něj vložit. Odkaz poslaný
              v Messengeru nebo WhatsAppu se otevře v jejich vlastním prohlížeči a spáruje se
              právě ten. V nainstalované aplikaci pak není nic a v seznamu zařízení přibude
              položka navíc. QR kód naskenovaný fotoaparátem tenhle problém nemá.
            </p>
            <p className="text-center text-xs text-muted">
              Kdo kód zná, vidí do deníku, posílej ho jen lidem, kterým na dítě sáhneš.
              Domácnost unese pět zařízení.
            </p>
            <MemberList />
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
        <button type="submit" className="min-h-touch rounded-xl bg-accent px-4 py-3 font-semibold text-on-accent">
          Připojit
        </button>
      </form>

      {!sdileniNastavene && (
        <p className="flex items-start gap-2 rounded-xl bg-surface p-4 text-xs leading-relaxed text-muted">
          <KeyRound aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <span>
            Sdílení mezi telefony zatím není nastavené, aplikace běží jen na tomhle zařízení.
            Zapíná se jednou při zprovoznění aplikace; v ní samotné se nic nevyplňuje.
          </span>
        </p>
      )}

        </>
      )}

      {sekce === 'aplikace' && (
        <>
      <div className="rounded-xl bg-surface p-4">
        <ThemePicker />
      </div>

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
              // Výsledek se musí počkat, jinak se chyba ze slučování objeví až
              // po `catch` a rodič uvidí „naimportováno", i když se nic
              // neuložilo. Přesně to se dřív stávalo u jiného souboru.
              void (async () => {
                try {
                  await importState(JSON.parse(await file.text()));
                  setMessage('Data naimportována a sloučena.');
                } catch {
                  setMessage('Tohle není záloha Drobka: soubor se nenačetl.');
                }
              })();
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
        </>
      )}

      {message !== null && (
        <p role="status" className="text-sm text-accent">
          {message}
        </p>
      )}
    </section>
  );
}
