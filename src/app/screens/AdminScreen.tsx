import { KeyRound, RefreshCw, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ingredientById } from '@/data';
import { nactiPrehled, popisChyby } from '@/admin/adminFirebase';
import { spocitejPrehled, type Prehled } from '@/admin/prehled';
import { jeSpravnyKlic } from '@/admin/tajnyOdkaz';
import { NotFoundScreen } from './NotFoundScreen';

/**
 * Přehled o používání aplikace.
 *
 * Otevře se jen na adrese s tajným klíčem. Jakákoli jiná adresa vypadá
 * stejně jako překlep v odkazu, takže se rodič o existenci přehledu vůbec
 * nedozví. Data pak chrání ještě heslo a pravidla Firestore, takže samotná
 * znalost odkazu nikomu nic nedá.
 */
export function AdminScreen(): ReactNode {
  const { klic } = useParams<{ klic: string }>();
  // `null` znamená, že se otisk ještě počítá. Než je hotový, nevykreslí se
  // ani formulář, aby nebylo z čeho poznat, že na té adrese něco je.
  const [pusti, setPusti] = useState<boolean | null>(null);

  useEffect(() => {
    let platne = true;
    void jeSpravnyKlic(klic).then((vysledek) => {
      if (platne) setPusti(vysledek);
    });
    return () => {
      platne = false;
    };
  }, [klic]);

  if (pusti === null) return null;
  if (!pusti) return <NotFoundScreen />;
  return <Prehledovka />;
}

function Prehledovka(): ReactNode {
  const [email, setEmail] = useState('');
  const [heslo, setHeslo] = useState('');
  const [nacitam, setNacitam] = useState(false);
  const [chyba, setChyba] = useState<string | null>(null);
  const [prehled, setPrehled] = useState<Prehled | null>(null);
  const [nepovedene, setNepovedene] = useState(0);

  async function nacti(): Promise<void> {
    setNacitam(true);
    setChyba(null);
    try {
      const data = await nactiPrehled(email, heslo);
      setPrehled(spocitejPrehled(data.souhrny));
      setNepovedene(data.nepovedene);
    } catch (error) {
      setChyba(popisChyby(error));
      setPrehled(null);
    } finally {
      setNacitam(false);
    }
  }

  return (
    <section className="flex flex-col gap-4" aria-labelledby="prehled-nadpis">
      <h1 id="prehled-nadpis" className="flex items-center gap-2 text-xl font-bold">
        <ShieldCheck aria-hidden="true" className="h-5 w-5 shrink-0 text-accent" />
        Přehled o používání
      </h1>

      <form
        className="flex flex-col gap-2 rounded-xl bg-surface p-4"
        onSubmit={(event) => {
          event.preventDefault();
          void nacti();
        }}
      >
        <label htmlFor="prehled-email" className="text-sm font-medium">
          E-mail správce
        </label>
        <input
          id="prehled-email"
          type="email"
          value={email}
          autoComplete="username"
          data-testid="prehled-email"
          onChange={(event) => setEmail(event.target.value)}
          className="min-h-touch rounded-lg border border-muted/40 px-3 py-2"
        />
        <label htmlFor="prehled-heslo" className="text-sm font-medium">
          Heslo
        </label>
        <input
          id="prehled-heslo"
          type="password"
          value={heslo}
          autoComplete="current-password"
          data-testid="prehled-heslo"
          onChange={(event) => setHeslo(event.target.value)}
          className="min-h-touch rounded-lg border border-muted/40 px-3 py-2"
        />
        <button
          type="submit"
          disabled={nacitam}
          data-testid="prehled-nacti"
          className="flex min-h-touch items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 font-semibold text-on-accent disabled:opacity-60"
        >
          {nacitam ? (
            <RefreshCw aria-hidden="true" className="h-4 w-4 animate-spin" />
          ) : (
            <KeyRound aria-hidden="true" className="h-4 w-4" />
          )}
          {nacitam ? 'Načítám…' : 'Načíst přehled'}
        </button>
        {chyba !== null && (
          <p data-testid="prehled-chyba" className="text-sm font-medium text-risk">
            {chyba}
          </p>
        )}
      </form>

      {prehled !== null && (
        <div className="flex flex-col gap-4" data-testid="prehled-vysledek">
          <Skupina nadpis="Kolik lidí to používá">
            <Radka popisek="Domácností celkem" hodnota={prehled.domacnosti} />
            <Radka popisek="Z toho s aspoň jednou ochutnávkou" hodnota={prehled.aktivniDomacnosti} />
            <Radka popisek="Aktivních za posledních 7 dní" hodnota={prehled.aktivniZa7Dni} />
            <Radka popisek="Aktivních za posledních 30 dní" hodnota={prehled.aktivniZa30Dni} />
            <Radka popisek="Zařízení celkem" hodnota={prehled.zarizeni} />
            <Radka
              popisek="Domácností se dvěma a více zařízeními"
              hodnota={prehled.domacnostiSViceZarizenimi}
            />
          </Skupina>

          <Skupina nadpis="Děti">
            <Radka popisek="Dětí celkem" hodnota={prehled.deti} />
            <Radka popisek="Domácností bez založeného dítěte" hodnota={prehled.domacnostiBezDitete} />
            {Object.entries(prehled.detiPodleFaze)
              .sort((a, b) => b[1] - a[1])
              .map(([klic, pocet]) => (
                <Radka key={klic} popisek={klic} hodnota={pocet} />
              ))}
          </Skupina>

          <Skupina nadpis="Co v aplikaci dělají">
            <Radka popisek="Ochutnávek v denících" hodnota={prehled.ochutnavky} />
            <Radka popisek="Smazaných ochutnávek" hodnota={prehled.smazaneOchutnavky} />
            <Radka popisek="Oblíbených položek" hodnota={prehled.oblibene} />
            <Radka popisek="Poznámek u receptů" hodnota={prehled.poznamkyURecepu} />
          </Skupina>

          <Skupina nadpis="Jaká zařízení se připojila">
            {Object.entries(prehled.zarizeniPodleTypu)
              .sort((a, b) => b[1] - a[1])
              .map(([klic, pocet]) => (
                <Radka key={klic} popisek={klic} hodnota={pocet} />
              ))}
          </Skupina>

          <Skupina nadpis="Nejčastěji ochutnávané suroviny">
            {prehled.nejcastejsiSuroviny.length === 0 ? (
              <p className="text-sm text-muted">Zatím žádná ochutnávka.</p>
            ) : (
              prehled.nejcastejsiSuroviny.map(({ id, pocet }) => (
                <Radka key={id} popisek={ingredientById.get(id)?.nameCz ?? id} hodnota={pocet} />
              ))
            )}
          </Skupina>

          <Skupina nadpis="Verze dat">
            {Object.entries(prehled.schemata)
              .sort((a, b) => Number(a[0]) - Number(b[0]))
              .map(([verze, pocet]) => (
                <Radka key={verze} popisek={`schéma v${verze}`} hodnota={pocet} />
              ))}
            {nepovedene > 0 && <Radka popisek="Nečitelných souhrnů" hodnota={nepovedene} />}
          </Skupina>

          <p className="rounded-xl bg-surface p-3 text-xs leading-relaxed text-muted">
            Přehled ukazuje jen počty, které si každý telefon spočítá sám ze své domácnosti.
            Jména dětí, data narození, párovací kódy, poznámky ani jednotlivé ochutnávky na
            server do statistik vůbec nejdou a dokumenty domácností tenhle účet číst nesmí.
            Domácnosti se sem dostanou až poté, co se jejich telefon s novou verzí aplikace
            připojí.
          </p>
        </div>
      )}
    </section>
  );
}

function Skupina({ nadpis, children }: { nadpis: string; children: ReactNode }): ReactNode {
  return (
    <section className="flex flex-col gap-1.5 rounded-xl bg-surface p-4">
      <h2 className="text-[11px] font-semibold uppercase tracking-wide text-muted">{nadpis}</h2>
      {children}
    </section>
  );
}

function Radka({ popisek, hodnota }: { popisek: string; hodnota: number }): ReactNode {
  return (
    <p className="flex items-baseline justify-between gap-3 text-sm">
      <span className="min-w-0 text-muted">{popisek}</span>
      <span className="shrink-0 font-semibold tabular-nums">{hodnota}</span>
    </p>
  );
}
