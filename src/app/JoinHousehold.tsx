import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHouseholdStore } from '@/storage/householdStore';
import { formatHouseholdCode, isValidHouseholdCode } from '@/sync/householdCode';

/**
 * Cíl QR kódu: druhý telefon sem přijde s kódem v adrese a jen potvrdí.
 * Připojení nespouštíme automaticky — sken cizího QR nemá tiše přepnout
 * domácnost.
 */
export function JoinHousehold(): ReactNode {
  const { kod } = useParams<{ kod: string }>();
  const navigate = useNavigate();
  const { connect, init } = useHouseholdStore();
  const [pending, setPending] = useState(false);

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

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">Připojit se k domácnosti</h1>
      <p className="font-mono text-2xl font-bold tracking-[0.2em]">{formatHouseholdCode(kod)}</p>
      <p className="text-sm text-muted">
        Po připojení uvidíš stejné ochutnávky a poznámky jako druhý rodič.
      </p>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setPending(true);
          void connect(kod).then(() => {
            void navigate('/domacnost');
          });
        }}
        className="min-h-touch rounded-xl bg-accent px-4 py-3 font-semibold text-on-accent disabled:opacity-60"
      >
        {pending ? 'Připojuji…' : 'Připojit tohle zařízení'}
      </button>
    </section>
  );
}
