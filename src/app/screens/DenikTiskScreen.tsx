import { ArrowLeft, Printer } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useHouseholdStore } from '@/storage/householdStore';
import { sestavVypis } from '../lib/denikVypis';
import { useAktivniDite } from '../lib/dite';
import { ageInMonths, formatAge } from '../lib/age';
import { formatDate } from '../lib/labels';
import { SUROVINA, ZAZNAM, sklonuj } from '@/text/sklonovani';

/**
 * Výpis deníku k vytištění — obrazovka `/denik/tisk`.
 *
 * Kvůli tomuhle se deník vede: vzít do ordinace seznam toho, co dítě
 * jedlo a jak na to reagovalo. Záloha v JSONu je pro aplikaci, ne pro
 * člověka (audit 17. 9. 2026, kapitola 10 bod 3).
 *
 * Stránka nic nevyhodnocuje a nic nedoporučuje — jen seřadí, co rodič
 * sám zapsal. Aplikace nediagnostikuje alergie (pravidlo 6 z CLAUDE.md)
 * a na papíře to platí dvojnásob, protože papír vypadá odborně.
 *
 * Tisk jede přes `window.print()`, ne přes vlastní generování PDF: každý
 * prohlížeč umí „uložit jako PDF" a knihovna navíc by byla runtime
 * závislost za funkci, kterou systém má.
 */
export function DenikTiskScreen(): ReactNode {
  const state = useHouseholdStore((store) => store.state);
  const dite = useAktivniDite();
  const vypis = useMemo(() => sestavVypis(state, dite), [state, dite]);

  const vek = dite === null ? null : formatAge(ageInMonths(dite.birthDate));

  return (
    <section className="tisk-list flex flex-col gap-4" aria-labelledby="tisk-nadpis">
      <div className="jen-na-obrazovku flex items-center justify-between gap-2">
        <Link
          to="/denik"
          className="flex items-center gap-1 text-sm text-muted"
          data-testid="tisk-zpet"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Zpět do deníku
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          data-testid="tisk-spustit"
          className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white shadow-lift"
        >
          <Printer aria-hidden="true" className="h-4 w-4" />
          Vytisknout
        </button>
      </div>

      <header className="flex flex-col gap-1">
        <h1 id="tisk-nadpis" className="text-lg font-bold">
          Deník ochutnávek — {vypis.dite}
        </h1>
        <p className="text-xs text-muted" data-testid="tisk-hlavicka">
          {vypis.narozeni === null
            ? 'Datum narození není zapsané.'
            : `Narozeno ${formatDate(vypis.narozeni)}${vek === null ? '' : `, nyní ${vek}`}.`}{' '}
          {vypis.odKdy === null
            ? 'Zatím bez záznamů.'
            : `Záznamy od ${formatDate(vypis.odKdy)} do ${formatDate(vypis.doKdy ?? vypis.odKdy)}. ` +
              // Skloňuje se obojí zvlášť a v prvním pádě: „u 1 surovin"
              // by po předložce vyžadovalo druhý pád a to `sklonuj` neumí.
              `Celkem ${sklonuj(vypis.radky.length, ZAZNAM)}, ${sklonuj(vypis.surovin, SUROVINA)}.`}
        </p>
        <p className="text-xs text-muted">
          Výpis z aplikace Drobek. Je to záznam rodiče, ne lékařská zpráva — aplikace
          nediagnostikuje alergie ani nenahrazuje pediatra.
        </p>
      </header>

      {vypis.nezadouci.length > 0 && (
        <section aria-labelledby="tisk-reakce" className="flex flex-col gap-1">
          <h2 id="tisk-reakce" className="text-sm font-semibold">
            Zaznamenané reakce ({vypis.nezadouci.length})
          </h2>
          {/* Nahoře, protože kvůli nim se k lékaři jde. Dole v tabulce jsou
              znovu, aby se daly zasadit do pořadí. */}
          <ul className="flex flex-col gap-1 text-sm" data-testid="tisk-reakce-seznam">
            {vypis.nezadouci.map((radek, i) => (
              <li key={`${radek.datum}-${radek.surovina}-${i}`}>
                <strong>{formatDate(radek.datum)}</strong> — {radek.surovina}: {radek.reakce}
                {radek.poznamka === '' ? '' : ` (${radek.poznamka})`}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="tisk-alergeny" className="flex flex-col gap-1">
        <h2 id="tisk-alergeny" className="text-sm font-semibold">
          Klíčové alergeny
        </h2>
        <ul className="flex flex-col gap-0.5 text-sm" data-testid="tisk-alergeny-seznam">
          {vypis.alergeny.map((alergen) => (
            <li key={alergen.skupina} className="flex justify-between gap-2">
              <span>{alergen.nazev}</span>
              <span className="text-muted">
                {alergen.expozic} expozic, z toho {alergen.bezReakce} bez reakce
                {alergen.posledni === null ? '' : ` · naposledy ${formatDate(alergen.posledni)}`}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tisk-zaznamy" className="flex flex-col gap-1">
        <h2 id="tisk-zaznamy" className="text-sm font-semibold">
          Všechny záznamy
        </h2>
        {vypis.radky.length === 0 ? (
          <p className="text-sm text-muted" data-testid="tisk-prazdno">
            V deníku zatím nic není. Zapiš první ochutnávku a výpis se naplní.
          </p>
        ) : (
          <table className="w-full text-left text-xs" data-testid="tisk-tabulka">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="py-1 pr-2 font-semibold">Datum</th>
                <th scope="col" className="py-1 pr-2 font-semibold">Surovina</th>
                <th scope="col" className="py-1 pr-2 font-semibold">Množství</th>
                <th scope="col" className="py-1 pr-2 font-semibold">Reakce</th>
                <th scope="col" className="py-1 font-semibold">Poznámka</th>
              </tr>
            </thead>
            <tbody>
              {vypis.radky.map((radek, i) => (
                <tr key={`${radek.datum}-${radek.surovina}-${i}`} className="border-b border-line/60 align-top">
                  <td className="whitespace-nowrap py-1 pr-2">{formatDate(radek.datum)}</td>
                  <td className="py-1 pr-2">{radek.surovina}</td>
                  <td className="py-1 pr-2">{radek.mnozstvi}</td>
                  <td className="py-1 pr-2">
                    {radek.nezadouci ? <strong>{radek.reakce}</strong> : radek.reakce}
                  </td>
                  <td className="py-1">{radek.poznamka}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </section>
  );
}
