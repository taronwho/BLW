import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  CircleSlash,
  NotebookPen,
  Plus,
  Search,
  Trash2,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ingredientById, ingredients } from '@/data/ingredients';
import { RODINNA_JIDLA, SKUPINY_JIDEL } from '@/data/jidlaRodiny';
import { useHouseholdStore } from '@/storage/householdStore';
import { useOpravyStore } from '@/storage/opravyStore';
import { normalize } from '@/safety/text';
import type { Grip, Ingredient, Stage } from '@/types';
import { ChokingBadge } from '../components/ChokingBadge';
import { TastingForm } from '../components/TastingForm';
import { STAGE_LABELS, ageInMonths, stageForAge } from '../lib/age';
import { useAktivniDite, useAktivniDiteId } from '../lib/dite';
import { GRIP_LABELS, gripAdviceApplies, gripForAge, gripShapeAdvice } from '../lib/grip';
import { hledejSuroviny } from '../lib/hledaciIndexSurovin';
import {
  expoziceBezReakce,
  posudSurovinu,
  rozeberVyber,
  seradPosudky,
  souhrnJidla,
  zapisVyber,
} from '../lib/jimeMy';
import type { DuvodNe, DuvodPozor, PosudekSuroviny } from '../lib/jimeMy';
import { ALLERGEN_LABELS, HAZARD_LABELS } from '../lib/labels';
import { draftPayload, emptyDraft } from '../lib/tastingDraft';
import type { Draft } from '../lib/tastingDraft';
import { activeTastings, surovinySReakci } from '../lib/tastings';
import { useUrlText } from '../lib/urlState';

/** Kolik výsledků hledání se ukáže naráz. Víc se na mobil nevejde. */
const NAJEDNOU = 8;

function textNe(duvod: DuvodNe, posudek: PosudekSuroviny): string {
  const item = posudek.ingredient;
  switch (duvod) {
    case 'vek':
      // Sůl, med, koření a spol. se do jídla přidávají, takže jde porci
      // odebrat dřív. Kus masa nebo sýra se z hotového jídla neodebere.
      return item.servingForm === 'neresi'
        ? `Až od ${item.minAgeMonths} měsíců. Dětskou porci odeber dřív, než ji do jídla přidáš.`
        : `Až od ${item.minAgeMonths} měsíců. Do dětské porce ji nedávej.`;
    case 'alergie':
      return `U dítěte je zapsaná alergie: ${posudek.alergieDitete
        .map((skupina) => ALLERGEN_LABELS[skupina])
        .join(', ')}.`;
    case 'reakce':
      return 'Po poslední ochutnávce je v deníku reakce. Prober ji s pediatrem.';
    case 'vyrazena':
      return 'Je vyřazená v nastavení dítěte.';
  }
}

function textPozor(duvod: DuvodPozor, posudek: PosudekSuroviny): string {
  switch (duvod) {
    case 'duseni':
      return 'Vysoké riziko dušení: drž se přesně pokynu k úpravě.';
    case 'novy-alergen':
      return `Klíčový alergen, který dítě ještě nemá zavedený (${posudek.noveAlergeny
        .map((skupina) => ALLERGEN_LABELS[skupina])
        .join(', ')}). Začni malým množstvím, ideálně dopoledne a doma.`;
    case 'k-revizi':
      return `Údaje čekají na ověření, zkontroluj s pediatrem.${
        posudek.ingredient.reviewNote === undefined ? '' : ` ${posudek.ingredient.reviewNote}`
      }`;
  }
}

function KartaNe({ posudek }: { posudek: PosudekSuroviny }): ReactNode {
  const item = posudek.ingredient;
  return (
    <li
      data-testid={`jime-ne-${item.id}`}
      className="flex flex-col gap-1 rounded-xl border border-risk/40 bg-risk-soft p-3"
    >
      <Link
        to={`/suroviny/${item.id}`}
        className="flex min-h-touch items-center gap-2 text-sm font-semibold"
      >
        <CircleSlash aria-hidden="true" className="h-4 w-4 shrink-0 text-risk" />
        <span className="min-w-0 flex-1">{item.nameCz}</span>
        <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-muted" />
      </Link>
      <ul className="flex flex-col gap-1 text-sm leading-relaxed">
        {posudek.ne.map((duvod) => (
          <li key={duvod}>{textNe(duvod, posudek)}</li>
        ))}
      </ul>
    </li>
  );
}

function KartaPorce({
  posudek,
  faze,
  grip,
}: {
  posudek: PosudekSuroviny;
  faze: Stage;
  grip: Grip;
}): ReactNode {
  const item = posudek.ingredient;
  const pokyn = item.prep[faze];
  const pozor = posudek.verdikt === 'pozor';
  return (
    <li
      data-testid={`jime-porce-${item.id}`}
      className={`flex flex-col gap-2 rounded-xl border p-3 ${
        pozor ? 'border-caution/50 bg-surface' : 'border-line bg-surface'
      }`}
    >
      <Link
        to={`/suroviny/${item.id}`}
        className="flex min-h-touch items-center gap-2 text-sm font-semibold"
      >
        {pozor ? (
          <AlertTriangle aria-hidden="true" className="h-4 w-4 shrink-0 text-caution" />
        ) : (
          <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-safe" />
        )}
        <span className="min-w-0 flex-1">{item.nameCz}</span>
        <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-muted" />
      </Link>
      <ChokingBadge risk={item.chokingRisk} />
      {posudek.pozor.length > 0 && (
        <ul className="flex flex-col gap-1 rounded-lg bg-caution/10 p-2 text-sm leading-relaxed">
          {posudek.pozor.map((duvod) => (
            <li key={duvod}>{textPozor(duvod, posudek)}</li>
          ))}
        </ul>
      )}
      <p className="text-sm leading-relaxed" data-testid={`jime-pokyn-${item.id}`}>
        <strong className="font-semibold">Jak upravit ({STAGE_LABELS[faze]}): </strong>
        {pokyn?.serving ?? 'Pokyn pro tuto fázi není vyplněný.'}
      </p>
      {pokyn?.caution !== undefined && (
        <p className="rounded-lg bg-caution/10 p-2 text-sm leading-relaxed text-caution">
          Pozor: {pokyn.caution}
        </p>
      )}
      {item.hazards.length > 0 && (
        <ul className="flex flex-col gap-1 text-sm leading-relaxed">
          {item.hazards.map((hazard) => (
            <li key={hazard}>
              <strong className="font-semibold">{HAZARD_LABELS[hazard]}: </strong>
              {item.hazardNotes[hazard] ?? 'Viz zdroje u této suroviny.'}
            </li>
          ))}
        </ul>
      )}
      {gripAdviceApplies(item.servingForm) && (
        <p className="text-xs leading-relaxed text-muted">
          <strong className="font-semibold">Tvar pro {GRIP_LABELS[grip]} úchop: </strong>
          {gripShapeAdvice(grip, item.chokingRisk, item.servingForm)}
        </p>
      )}
    </li>
  );
}

/**
 * „Co dnes jíme my" — obrazovka `/jime-my`.
 *
 * Rodič vybere, z čeho je dnešní jídlo rodiny, a dostane dětskou porci:
 * co z toho dítě může, jak to pro něj upravit, co odebrat dřív, než se
 * jídlo dochutí, a co vynechat. Výběr žije v adrese, takže přežije Zpět
 * z detailu suroviny a dá se poslat druhému rodiči.
 */
export function JimeMyScreen(): ReactNode {
  const dite = useAktivniDite();
  const diteId = useAktivniDiteId();
  const state = useHouseholdStore((store) => store.state);
  const recordTasting = useHouseholdStore((store) => store.recordTasting);
  const status = useHouseholdStore((store) => store.status);
  const opravy = useOpravyStore((store) => store.pouzite.suroviny);

  const najdi = useMemo(
    () =>
      (id: string): Ingredient | undefined =>
        opravy.get(id) ?? ingredientById.get(id),
    [opravy],
  );

  const [syrovyVyber, nastavSyrovyVyber] = useUrlText('s', '');
  const vyber = useMemo(
    () => rozeberVyber(syrovyVyber, (id) => najdi(id) !== undefined),
    [syrovyVyber, najdi],
  );
  const nastavVyber = (ids: readonly string[]): void => nastavSyrovyVyber(zapisVyber(ids));
  // Které rodinné jídlo je vybrané: to, jehož suroviny přesně sedí na výběr.
  // Jakmile rodič přidá nebo odebere surovinu, je to už jeho vlastní jídlo.
  const vybraneJidlo = RODINNA_JIDLA.find((jidlo) => {
    const ids = jidlo.suroviny.filter((id) => najdi(id) !== undefined);
    return ids.length === vyber.length && ids.every((id) => vyber.includes(id));
  });

  const [dotaz, setDotaz] = useState('');
  const [jidlaOtevrena, setJidlaOtevrena] = useState(false);
  const [zapis, setZapis] = useState<Draft | null>(null);
  const [zapsat, setZapsat] = useState<ReadonlySet<string>>(new Set());
  const [zapsano, setZapsano] = useState<number | null>(null);

  const months = dite === null ? null : ageInMonths(dite.birthDate);
  const faze = stageForAge(months);
  const grip = dite?.grip ?? gripForAge(months);

  const posudky = useMemo(() => {
    const udalosti = activeTastings(state, diteId);
    const vstup = {
      months,
      alergieDitete: dite?.allergens ?? [],
      vyrazene: dite?.vyrazene ?? [],
      sReakci: new Set(surovinySReakci(state, diteId).keys()),
      expozice: expoziceBezReakce(udalosti, najdi),
    };
    return seradPosudky(
      vyber
        .map(najdi)
        .filter((item): item is Ingredient => item !== undefined)
        .map((item) => posudSurovinu(item, vstup)),
    );
  }, [state, diteId, dite, months, vyber, najdi]);
  const souhrn = useMemo(() => souhrnJidla(posudky), [posudky]);
  const doPorce = [...souhrn.pozor, ...souhrn.ano].sort((a, b) =>
    a.ingredient.nameCz.localeCompare(b.ingredient.nameCz, 'cs'),
  );

  const vysledky = useMemo(() => {
    const nalezene = hledejSuroviny(dotaz);
    if (nalezene === null) return null;
    const zacatek = normalize(dotaz.trim());
    return ingredients
      .filter((item) => nalezene.has(item.id) && !vyber.includes(item.id))
      .sort(
        (a, b) =>
          Number(!normalize(a.nameCz).startsWith(zacatek)) -
            Number(!normalize(b.nameCz).startsWith(zacatek)) ||
          a.nameCz.localeCompare(b.nameCz, 'cs'),
      );
  }, [dotaz, vyber]);

  function pridej(id: string): void {
    nastavVyber([...vyber, id]);
    setDotaz('');
    setZapsano(null);
  }

  function otevriZapis(): void {
    setZapis(emptyDraft());
    setZapsat(new Set(doPorce.map((p) => p.ingredient.id)));
    setZapsano(null);
  }

  async function ulozZapis(): Promise<void> {
    if (zapis === null) return;
    const payload = draftPayload(zapis);
    const createdBy = status.kind === 'connected' ? status.uid : 'toto-zarizeni';
    const ids = doPorce.map((p) => p.ingredient.id).filter((id) => zapsat.has(id));
    // Bez zaškrtnuté suroviny není co zapsat; formulář zůstane otevřený.
    if (ids.length === 0) return;
    for (const ingredientId of ids) {
      await recordTasting({ ingredientId, ...payload, createdBy });
    }
    setZapis(null);
    setZapsano(ids.length);
  }

  const kdo = dite === null || dite.name.trim().length === 0 ? 'dítě' : dite.name.trim();

  return (
    <article className="flex flex-col gap-5" aria-labelledby="jime-nadpis">
      <Link
        to="/recepty"
        className="flex min-h-touch w-fit items-center gap-2 rounded-xl px-2 text-sm font-medium text-accent"
      >
        <ArrowLeft aria-hidden="true" className="h-5 w-5 shrink-0" />
        Recepty
      </Link>

      <header className="flex flex-col gap-2">
        <h1 id="jime-nadpis" className="flex items-center gap-2 text-xl font-bold">
          <UtensilsCrossed aria-hidden="true" className="h-6 w-6 shrink-0 text-accent" />
          Co dnes jíme my
        </h1>
        <p className="text-sm leading-relaxed text-muted">
          Vyber, z čeho je vaše dnešní jídlo. U každé suroviny uvidíš, jestli ji {kdo} může, jak ji
          upravit a co z porce vynechat.
        </p>
        <p className="rounded-xl border border-accent/30 bg-accent-soft p-3 text-sm leading-relaxed">
          Základ vař bez soli a porci pro dítě odeber dřív, než jídlo dochutíš.{' '}
          <Link
            to="/rady/jedno-vareni-pro-celou-rodinu"
            className="inline-flex min-h-touch items-center font-medium text-accent underline"
          >
            Jedno vaření pro celou rodinu
          </Link>
        </p>
      </header>

      {dite === null ? (
        <p className="rounded-xl bg-caution-soft p-3 text-sm leading-relaxed" data-testid="jime-bez-ditete">
          Aplikace zatím nezná dítě, takže posuzuje jako pro šestiměsíční miminko.{' '}
          <Link to="/domacnost" className="inline-flex min-h-touch items-center font-semibold text-accent underline">
            Přidat dítě v Domácnosti
          </Link>
        </p>
      ) : months === null ? (
        <p className="rounded-xl bg-caution-soft p-3 text-sm leading-relaxed" data-testid="jime-bez-veku">
          Bez data narození aplikace posuzuje jako pro šestiměsíční miminko.{' '}
          <Link to="/domacnost" className="inline-flex min-h-touch items-center font-semibold text-accent underline">
            Doplnit datum v Domácnosti
          </Link>
        </p>
      ) : months < 6 ? (
        <p className="rounded-xl bg-caution-soft p-3 text-sm leading-relaxed" data-testid="jime-pred-6m">
          Dítěti ještě není šest měsíců. Příkrm se zavádí kolem šestého měsíce a jen když je na to
          dítě vývojově připravené.{' '}
          <Link to="/rady/je-dite-pripravene" className="inline-flex min-h-touch items-center font-semibold text-accent underline">
            Je dítě připravené?
          </Link>
        </p>
      ) : null}

      <section aria-labelledby="jime-vyber-nadpis" className="flex flex-col gap-3 rounded-xl bg-surface p-4">
        <h2 id="jime-vyber-nadpis" className="text-sm font-semibold uppercase tracking-wide text-muted">
          Z čeho vaříte
        </h2>

        {/* Rozbalovací seznam, ne vodorovný pás: v pásu bylo vidět jen první
            jídlo a půlka druhého, a že jich je dvanáct, rodič nepoznal. */}
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            aria-expanded={jidlaOtevrena}
            aria-controls="jime-jidla"
            data-testid="jime-jidla-prepinac"
            onClick={() => setJidlaOtevrena(!jidlaOtevrena)}
            className="flex min-h-touch w-full items-center gap-2 rounded-2xl border border-line bg-paper px-3 py-2 text-left text-sm"
          >
            <UtensilsCrossed aria-hidden="true" className="h-5 w-5 shrink-0 text-accent" />
            <span className="min-w-0 flex-1">
              <span className="block font-medium">
                {vybraneJidlo === undefined ? 'Vybrat běžné jídlo' : vybraneJidlo.nazev}
              </span>
              <span className="block text-xs text-muted">
                Rychlý výběr surovin, pak uprav podle sebe
              </span>
            </span>
            <ChevronDown
              aria-hidden="true"
              className={`h-5 w-5 shrink-0 text-muted transition-transform ${
                jidlaOtevrena ? 'rotate-180' : ''
              }`}
            />
          </button>
          {jidlaOtevrena && (
            <div id="jime-jidla" className="flex flex-col gap-3" data-testid="jime-jidla">
              {SKUPINY_JIDEL.map((skupina) => (
                <section key={skupina.id} aria-labelledby={`jime-skupina-${skupina.id}`}>
                  <h3
                    id={`jime-skupina-${skupina.id}`}
                    className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted"
                  >
                    {skupina.nazev}
                  </h3>
                  <ul className="flex flex-col gap-1">
                    {RODINNA_JIDLA.filter((jidlo) => jidlo.skupina === skupina.id).map((jidlo) => (
                      <li key={jidlo.id}>
                        <button
                          type="button"
                          data-testid={`jime-jidlo-${jidlo.id}`}
                          aria-pressed={jidlo.id === vybraneJidlo?.id}
                          onClick={() => {
                            nastavVyber(jidlo.suroviny.filter((id) => najdi(id) !== undefined));
                            setZapsano(null);
                            setJidlaOtevrena(false);
                          }}
                          className={`flex min-h-touch w-full items-center rounded-xl border px-3 text-left text-sm ${
                            jidlo.id === vybraneJidlo?.id
                              ? 'border-accent bg-accent-soft font-semibold text-accent'
                              : 'border-line bg-paper'
                          }`}
                        >
                          {jidlo.nazev}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>

        <label className="flex min-h-touch items-center gap-2 rounded-2xl border border-line bg-paper px-3">
          <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-muted" />
          <span className="sr-only">Přidat surovinu</span>
          <input
            type="search"
            value={dotaz}
            data-testid="jime-hledat"
            onChange={(event) => setDotaz(event.target.value)}
            placeholder="Přidej surovinu: mrkev, kuře, sýr…"
            className="min-h-touch w-full min-w-0 bg-transparent text-base outline-none"
          />
        </label>

        {vysledky !== null &&
          (vysledky.length === 0 ? (
            <p className="text-sm leading-relaxed text-muted" data-testid="jime-nenalezeno">
              V katalogu nic takového není. Surovinu mimo katalog aplikace posoudit neumí, takže když
              si nejsi jistý, do dětské porce ji nedávej.
            </p>
          ) : (
            <ul className="flex flex-col gap-1" data-testid="jime-vysledky">
              {vysledky.slice(0, NAJEDNOU).map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    data-testid={`jime-pridat-${item.id}`}
                    onClick={() => pridej(item.id)}
                    className="flex min-h-touch w-full items-center gap-2 rounded-xl border border-line bg-paper px-3 text-left text-sm"
                  >
                    <Plus aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
                    <span className="min-w-0 flex-1">{item.nameCz}</span>
                  </button>
                </li>
              ))}
              {vysledky.length > NAJEDNOU && (
                <li className="text-xs text-muted">
                  A dalších {vysledky.length - NAJEDNOU}. Upřesni hledání.
                </li>
              )}
            </ul>
          ))}

        {vyber.length === 0 ? (
          <p className="text-sm text-muted" data-testid="jime-prazdno">
            Zatím nic nevybráno. Klepni na jídlo nahoře, nebo přidej suroviny hledáním.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            <ul className="flex flex-wrap gap-2" data-testid="jime-vybrane">
              {vyber.map((id) => (
                <li key={id}>
                  <button
                    type="button"
                    data-testid={`jime-odebrat-${id}`}
                    aria-label={`Odebrat ${najdi(id)?.nameCz ?? id}`}
                    onClick={() => {
                      nastavVyber(vyber.filter((jine) => jine !== id));
                      setZapsano(null);
                    }}
                    className="flex min-h-touch items-center gap-1 rounded-full border border-line bg-paper pl-3 pr-2 text-sm"
                  >
                    {najdi(id)?.nameCz ?? id}
                    <X aria-hidden="true" className="h-4 w-4 shrink-0 text-muted" />
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              data-testid="jime-vymazat"
              onClick={() => {
                nastavVyber([]);
                setZapis(null);
                setZapsano(null);
              }}
              className="flex min-h-touch items-center gap-1 self-start rounded-lg px-1 text-sm font-medium text-muted"
            >
              <Trash2 aria-hidden="true" className="h-4 w-4 shrink-0" />
              Vymazat výběr
            </button>
          </div>
        )}
      </section>

      {posudky.length > 0 && (
        <>
          <section
            aria-labelledby="jime-souhrn-nadpis"
            className="flex flex-col gap-2 rounded-xl bg-surface p-4"
            data-testid="jime-souhrn"
          >
            <h2 id="jime-souhrn-nadpis" className="text-sm font-semibold uppercase tracking-wide text-muted">
              Porce pro dítě
            </h2>
            <p className="text-sm font-medium" data-testid="jime-pocty">
              Do porce: {souhrn.ano.length + souhrn.pozor.length} (z toho s opatrností{' '}
              {souhrn.pozor.length}) · vynechat: {souhrn.ne.length}
            </p>
            {souhrn.noveAlergeny.length > 1 && (
              <p
                className="rounded-lg border border-caution/40 bg-caution-soft p-2 text-sm leading-relaxed"
                data-testid="jime-vic-alergenu"
              >
                V porci je víc nových alergenů naráz (
                {souhrn.noveAlergeny.map((skupina) => ALLERGEN_LABELS[skupina]).join(', ')}). Zaváděj
                je po jednom, s odstupem dvou až tří dnů, jinak se při reakci nepozná, co ji
                způsobilo.{' '}
                <Link to="/rady/zavadeni-alergenu" className="inline-flex min-h-touch items-center font-medium text-accent underline">
                  Zavádění alergenů
                </Link>
              </p>
            )}
            {souhrn.chybiZelezo && (
              <p className="text-sm leading-relaxed" data-testid="jime-chybi-zelezo">
                V dětské porci není žádný zdroj železa. Ke každému jídlu patří aspoň jedna potravina
                bohatá na železo.{' '}
                <Link to="/seznamy/zelezo-na-talir" className="inline-flex min-h-touch items-center font-medium text-accent underline">
                  Železo na talíř
                </Link>
              </p>
            )}
            {souhrn.rostlinneZelezoBezC && (
              <p className="text-sm leading-relaxed" data-testid="jime-zelezo-bez-c">
                Železo je tu jen rostlinné a to se vstřebává hůř. Přidej k němu vitamin C z ovoce
                nebo zeleniny.{' '}
                <Link to="/seznamy/cecko-k-zelezu" className="inline-flex min-h-touch items-center font-medium text-accent underline">
                  Vitamin C k železu
                </Link>
              </p>
            )}
            <Link
              to="/tvar-sousta"
              className="flex min-h-touch items-center gap-1 self-start text-sm font-medium text-accent"
            >
              Průvodce tvarem sousta
              <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0" />
            </Link>
          </section>

          {souhrn.ne.length > 0 && (
            <section aria-labelledby="jime-ne-nadpis" className="flex flex-col gap-2">
              <h2 id="jime-ne-nadpis" className="text-sm font-semibold uppercase tracking-wide text-muted">
                Vynech nebo odeber porci dřív
              </h2>
              <ul className="flex flex-col gap-2" data-testid="jime-seznam-ne">
                {souhrn.ne.map((posudek) => (
                  <KartaNe key={posudek.ingredient.id} posudek={posudek} />
                ))}
              </ul>
            </section>
          )}

          {doPorce.length > 0 && (
            <section aria-labelledby="jime-porce-nadpis" className="flex flex-col gap-2">
              <h2 id="jime-porce-nadpis" className="text-sm font-semibold uppercase tracking-wide text-muted">
                Do dětské porce · fáze {STAGE_LABELS[faze]}
              </h2>
              <ul className="flex flex-col gap-2" data-testid="jime-seznam-porce">
                {doPorce.map((posudek) => (
                  <KartaPorce key={posudek.ingredient.id} posudek={posudek} faze={faze} grip={grip} />
                ))}
              </ul>

              {zapsano !== null && (
                <p
                  role="status"
                  className="rounded-xl bg-safe-soft p-3 text-sm font-medium"
                  data-testid="jime-zapsano"
                >
                  Zapsáno do deníku: {zapsano}.{' '}
                  <Link to="/denik" className="inline-flex min-h-touch items-center text-accent underline">
                    Otevřít deník
                  </Link>
                </p>
              )}

              {zapis === null ? (
                <button
                  type="button"
                  data-testid="jime-zapsat"
                  onClick={otevriZapis}
                  className="flex min-h-touch items-center justify-center gap-2 rounded-xl border border-accent bg-accent-soft px-4 text-sm font-semibold text-accent"
                >
                  <NotebookPen aria-hidden="true" className="h-5 w-5 shrink-0" />
                  Zapsat do deníku
                </button>
              ) : (
                <div className="flex flex-col gap-2 rounded-xl bg-surface p-3" data-testid="jime-zapis">
                  <fieldset className="flex flex-col gap-1">
                    <legend className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                      Co dítě ochutnalo
                    </legend>
                    {doPorce.map((posudek) => {
                      const id = posudek.ingredient.id;
                      return (
                        <label key={id} className="flex min-h-touch items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={zapsat.has(id)}
                            data-testid={`jime-zapsat-${id}`}
                            onChange={(event) => {
                              const dalsi = new Set(zapsat);
                              if (event.target.checked) dalsi.add(id);
                              else dalsi.delete(id);
                              setZapsat(dalsi);
                            }}
                            className="h-5 w-5 shrink-0 accent-[rgb(var(--c-accent))]"
                          />
                          {posudek.ingredient.nameCz}
                        </label>
                      );
                    })}
                  </fieldset>
                  <TastingForm
                    draft={zapis}
                    setDraft={setZapis}
                    onSubmit={() => {
                      void ulozZapis();
                    }}
                    onCancel={() => setZapis(null)}
                    submitLabel={`Zapsat (${zapsat.size})`}
                  />
                </div>
              )}
            </section>
          )}
        </>
      )}
    </article>
  );
}
