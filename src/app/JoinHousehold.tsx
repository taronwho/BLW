import { AlertTriangle, Copy, Smartphone } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHouseholdStore } from '@/storage/householdStore';
import {
  formatHouseholdCode,
  isValidHouseholdCode,
  normalizeHouseholdCode,
} from '@/sync/householdCode';
import { jeNainstalovana, vestavenyProhlizec } from '@/sync/zarizeni';

/**
 * Cíl QR kódu a odkazu: druhý telefon sem přijde s kódem v adrese a potvrdí.
 * Připojení nespouštíme automaticky — sken cizího QR nemá tiše přepnout
 * domácnost.
 *
 * Pozvánka z chatu se skoro vždy otevře ve vestavěném prohlížeči té
 * aplikace, ne v nainstalovaném Drobkovi. Připojit se odtud jde a data se
 * sdílet budou, ale spáruje se právě ten prohlížeč — z jednoho telefonu tak
 * v domácnosti vzniknou dvě zařízení a v nainstalované aplikaci není nic.
 * Proto se tu na to upozorňuje dřív, než rodič klepne, a kód jde přenést
 * jedním klepnutím.
 */
export function JoinHousehold(): ReactNode {
  const { kod } = useParams<{ kod: string }>();
  const navigate = useNavigate();
  const { connect, init } = useHouseholdStore();
  const householdCode = useHouseholdStore((store) => store.householdCode);
  const [pending, setPending] = useState(false);
  const [zkopirovano, setZkopirovano] = useState(false);

  useEffect(() => {
    void init();
  }, [init]);

  if (kod === undefined || !isValidHouseholdCode(kod)) {
    return (
      <section className="flex flex-col gap-3">
        <h1 className="text-lg font-semibold">Neplatný kód</h1>
        <p className="text-sm text-muted">
          Odkaz neobsahuje platný párovací kód. Zkus ho na druhém telefonu načíst znovu.
        </p>
      </section>
    );
  }

  const vestaveny = vestavenyProhlizec();
  const vAplikaci = jeNainstalovana();
  // Klepnout na odkaz podruhé je snadné — v chatu zůstane viset. Připojovat
  // se znovu ale nemá smysl a jiná domácnost by tichým přepnutím vzala
  // rodiči deník z očí.
  const uzTady = householdCode !== null && householdCode === normalizeHouseholdCode(kod);
  const jinaDomacnost = householdCode !== null && !uzTady;

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">Připojit se k domácnosti</h1>

      <div className="flex flex-col items-center gap-2 rounded-xl bg-surface p-4">
        <p className="text-xs uppercase tracking-wide text-muted">Párovací kód</p>
        <p data-testid="kod-z-odkazu" className="font-mono text-2xl font-bold tracking-[0.2em]">
          {formatHouseholdCode(kod)}
        </p>
        <button
          type="button"
          data-testid="kopirovat-kod-z-odkazu"
          onClick={() => {
            void navigator.clipboard
              .writeText(formatHouseholdCode(kod))
              .then(() => setZkopirovano(true))
              .catch(() => setZkopirovano(false));
          }}
          className="flex min-h-touch items-center justify-center gap-2 rounded-xl border border-accent bg-accent-soft px-4 text-sm font-semibold text-accent"
        >
          <Copy aria-hidden="true" className="h-4 w-4 shrink-0" />
          {zkopirovano ? 'Kód zkopírován' : 'Zkopírovat kód'}
        </button>
      </div>

      {uzTady && (
        <p
          data-testid="uz-pripojeno"
          className="rounded-xl border border-safe/40 bg-safe/10 p-3 text-sm leading-snug"
        >
          Tohle zařízení už v téhle domácnosti je — nic dalšího dělat nemusíš.
        </p>
      )}

      {jinaDomacnost && (
        <p
          data-testid="jina-domacnost"
          className="rounded-xl border-2 border-caution/40 bg-caution/10 p-3 text-sm leading-snug"
        >
          Tohle zařízení je zatím v jiné domácnosti. Připojením se přepne do téhle a deník té
          předchozí přestane být vidět.
        </p>
      )}

      {!vAplikaci && !uzTady && (
        <div
          data-testid="upozorneni-prohlizec"
          className="flex items-start gap-2.5 rounded-xl border-2 border-caution/40 bg-caution/10 p-3"
        >
          <AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-caution" />
          <div className="flex min-w-0 flex-col gap-1.5 text-sm leading-snug">
            <p className="font-semibold text-caution">
              {vestaveny === null
                ? 'Tohle je prohlížeč, ne nainstalovaná aplikace'
                : `Tohle je prohlížeč uvnitř ${vestaveny}`}
            </p>
            <p className="text-ink/80">
              Připojí se právě on. Pokud máš Drobka nainstalovaného na ploše, otevři ho a kód do
              něj vlož — jinak budeš mít z jednoho telefonu v domácnosti dvě zařízení a
              v nainstalované aplikaci nebude nic.
            </p>
            <p className="flex items-center gap-1.5 text-xs text-muted">
              <Smartphone aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
              Domácnost → Sdílení → Připojit se ke stávající domácnosti
            </p>
          </div>
        </div>
      )}

      {!uzTady && (
        <p className="text-sm text-muted">
          Po připojení uvidíš stejné ochutnávky a poznámky jako druhý rodič.
        </p>
      )}

      <button
        type="button"
        disabled={pending || uzTady}
        data-testid="pripojit-z-odkazu"
        onClick={() => {
          setPending(true);
          void connect(kod).then(() => {
            void navigate('/domacnost?sekce=sdileni');
          });
        }}
        className={`min-h-touch rounded-xl px-4 py-3 font-semibold disabled:opacity-60 ${
          vAplikaci
            ? 'bg-accent text-on-accent'
            : 'border border-accent bg-transparent text-accent'
        }`}
      >
        {pending ? 'Připojuji…' : uzTady ? 'Už je připojeno' : 'Připojit tenhle prohlížeč'}
      </button>
    </section>
  );
}
