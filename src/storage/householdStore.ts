import { create } from 'zustand';
import type {
  AllergenGroup,
  Child,
  Grip,
  HouseholdState,
  NakupDavka,
  NakupPolozka,
  Plan,
  ReadySign,
  StavDne,
  TastingEvent,
} from '@/types';
import {
  activeChildren,
  clenoveZeStavu,
  clenstviZeStavu,
  emptyHouseholdState,
  MAX_MEMBERS,
  mergeHouseholdState,
  jeZNovejsiVerze,
  migrateHouseholdState,
  newChildId,
  prevedStav,
  newTastingId,
  SCHEMA_VERSION,
} from '@/sync/merge';
import { generateHouseholdCode, normalizeHouseholdCode } from '@/sync/householdCode';
import { popisZarizeni } from '@/sync/zarizeni';
import type { Zahozeno } from '@/sync/validace';
import { IndexedDbAdapter } from './indexedDb';
import { loadFirebaseConfig } from './firebaseConfig';
import type { StorageAdapter, StoredHousehold, SyncStatus } from './types';

/**
 * Fasáda nad oběma režimy úložiště. Lokální IndexedDB je vždycky zdrojem
 * pravdy pro tohle zařízení; Firestore je navrch a přes `mergeHouseholdState`
 * se do lokálního stavu slévá, takže offline změny se neztratí.
 */

const CODE_STORAGE_KEY = 'blw.household.code.v1';
/** Vybrané dítě je pohled tohohle zařízení, ne údaj domácnosti. */
const CHILD_STORAGE_KEY = 'blw.household.child.v1';

interface HouseholdStore {
  ready: boolean;
  state: HouseholdState;
  updatedAt: number;
  status: SyncStatus;
  householdCode: string | null;
  /** Které dítě aplikace ukazuje. Jen v tomhle zařízení, nesdílí se. */
  activeChildId: string | null;

  init(): Promise<void>;
  connect(code?: string): Promise<void>;
  disconnect(): void;
  createHousehold(): Promise<string>;
  addChild(name: string, birthDate: string): Promise<string>;
  updateChild(id: string, patch: Partial<Omit<Child, 'id'>>): Promise<void>;
  removeChild(id: string): Promise<void>;
  setActiveChild(id: string | null): void;
  setGrip(id: string, grip: Grip | undefined): Promise<void>;
  toggleReadySign(id: string, sign: ReadySign): Promise<void>;
  toggleChildAllergen(id: string, allergen: AllergenGroup): Promise<void>;
  removeMember(uid: string): Promise<void>;
  recordTasting(event: Omit<TastingEvent, 'id' | 'createdAt'>): Promise<void>;
  updateTasting(id: string, patch: Partial<Omit<TastingEvent, 'id'>>): Promise<void>;
  deleteTasting(id: string): Promise<void>;
  toggleFavorite(id: string): Promise<void>;
  setRecipeNote(recipeId: string, note: string): Promise<void>;
  ulozPlan(childId: string, plan: Plan | null): Promise<void>;
  nastavStavDne(childId: string, cislo: number, stav: StavDne): Promise<void>;
  pridejDoNakupu(davky: readonly { ingredientId: string; mnozstvi?: string; recipeId?: string }[]): Promise<void>;
  odeberZNakupu(ingredientId: string): Promise<void>;
  prepniKoupeno(ingredientId: string): Promise<void>;
  nastavMnozstvi(ingredientId: string, mnozstvi: string | null): Promise<void>;
  vyprazdniNakup(jenKoupene?: boolean): Promise<void>;
  importState(raw: unknown): Promise<Zahozeno>;
}

let localAdapter: StorageAdapter | null = null;
let remoteAdapter: StorageAdapter | null = null;
let remoteUnsubscribe: (() => void) | null = null;

/**
 * O start i o připojení žádá nezávisle několik obrazovek naráz (hlavička,
 * Domácnost, párovací odkaz). Bez těchhle dvou pojistek běžely dva starty
 * současně, druhý se pokusil otevřít Firestore podruhé a spadl — a protože
 * skončil až po tom úspěšném, přebil ho a rodiči se ukázala červená hláška,
 * kterou další načtení stránky smazalo.
 */
let rozjednanyStart: Promise<void> | null = null;
let rozjednanePripojeni: { id: string; hotovo: Promise<void> } | null = null;

function local(): StorageAdapter {
  localAdapter ??= new IndexedDbAdapter();
  return localAdapter;
}

function readStoredCode(): string | null {
  try {
    return window.localStorage.getItem(CODE_STORAGE_KEY);
  } catch {
    return null;
  }
}

function readStoredChild(): string | null {
  try {
    return window.localStorage.getItem(CHILD_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredChild(id: string | null): void {
  try {
    if (id === null) window.localStorage.removeItem(CHILD_STORAGE_KEY);
    else window.localStorage.setItem(CHILD_STORAGE_KEY, id);
  } catch {
    // Bez localStorage se výběr po zavření aplikace zapomene a vezme se
    // první dítě. Vada na kráse, ne důvod k pádu.
  }
}

function writeStoredCode(code: string | null): void {
  try {
    if (code === null) window.localStorage.removeItem(CODE_STORAGE_KEY);
    else window.localStorage.setItem(CODE_STORAGE_KEY, code);
  } catch {
    // Bez localStorage se kód po zavření aplikace zapomene — vada na kráse,
    // ne důvod k pádu.
  }
}

export const useHouseholdStore = create<HouseholdStore>((set, get) => {
  /** Uloží nový stav lokálně a, když je připojeno, i do Firestore. */
  async function persist(next: HouseholdState): Promise<void> {
    const stored: StoredHousehold = { state: next, updatedAt: Date.now() };
    set({ state: next, updatedAt: stored.updatedAt });
    await local().save(stored);
    if (remoteAdapter === null) return;
    try {
      await remoteAdapter.save(stored);
    } catch (error) {
      // Offline zápisy drží Firestore ve vlastní frontě; sem se dostaneme
      // jen při skutečné chybě (např. zamítnutá pravidla).
      set({ status: { kind: 'error', message: describeError(error) } });
    }
  }

  /** Načtení lokálních dat a případné připojení k domácnosti. Běží jednou. */
  async function spustStart(): Promise<void> {
    const stored = await local().load();
    const code = readStoredCode();
    // Data uložená starší verzí mají jiný tvar `favorites`, `recipeNotes`
    // i dítěte; bez převodu by na nich aplikace spadla a rodič by přišel
    // o deník.
    const stav = stored === null ? emptyHouseholdState() : migrateHouseholdState(stored.state);
    // Vybrané dítě si pamatuje zařízení. Když v něm žádné není nebo bylo
    // mezitím smazané, bere se první v domácnosti.
    const ulozeneDite = readStoredChild();
    const deti = activeChildren(stav);
    const aktivni =
      ulozeneDite !== null && deti.some((dite) => dite.id === ulozeneDite)
        ? ulozeneDite
        : (deti[0]?.id ?? null);
    set({
      ready: true,
      state: stav,
      updatedAt: stored?.updatedAt ?? 0,
      householdCode: code,
      activeChildId: aktivni,
    });

    if (code !== null && loadFirebaseConfig() !== null) {
      await get().connect(code);
    }
  }

  /** Vlastní připojení k Firestore. Volá se jen přes `connect`, který ho hlídá. */
  async function pripojSe(householdId: string): Promise<void> {
    const config = loadFirebaseConfig();
    if (config === null || householdId.length === 0) {
      set({ status: { kind: 'local-only' } });
      return;
    }

    set({ status: { kind: 'connecting' } });
    try {
      // Firebase se stahuje až tady, ne při startu aplikace. Knihovna váží
      // víc než celý zbytek kódu a rodič, který sdílení nepoužívá, ji nikdy
      // nepotřebuje — dřív ji stahoval každý při prvním otevření.
      const { connectFirebase, FirestoreAdapter } = await import('./firebase');
      const session = await connectFirebase(config);
      const adapter = new FirestoreAdapter(session, householdId);
      remoteAdapter = adapter;
      writeStoredCode(householdId);

      const remote = await adapter.load();
      const localState = get().state;
      if (remote !== null && jeZNovejsiVerze(remote.state)) {
        // Druhý telefon má novější verzi aplikace. Kdybychom dokument
        // sloučili a zapsali, ořezali bychom mu pole, která tahle verze
        // ještě nezná — a on by o ně přišel.
        remoteAdapter = null;
        set({
          status: {
            kind: 'error',
            message:
              'Druhý telefon má novější verzi aplikace, než je tahle. Obnov ji (v nabídce aktualizace nebo znovunačtením stránky), jinak by se sdílením ztratila data. Do té doby aplikace jede jen v tomhle telefonu.',
          },
        });
        return;
      }
      if (remote !== null) {
        const merged = mergeHouseholdState(localState, migrateHouseholdState(remote.state));
        await persist(withMember(merged, session.uid));
      } else {
        await persist(withMember(localState, session.uid));
      }

      // Poslouchá vždycky jen jeden odběr; starý se ruší, ať se změny
      // nezpracují dvakrát.
      remoteUnsubscribe?.();
      remoteUnsubscribe = adapter.subscribe((incoming) => {
        // Novější tvar se ignoruje ze stejného důvodu jako při připojení.
        if (jeZNovejsiVerze(incoming.state)) return;
        const merged = mergeHouseholdState(get().state, migrateHouseholdState(incoming.state));
        // Čas zápisu musí sedět v paměti i na disku. Dřív se do paměti
        // neukládal vůbec, takže se po přenačtení stránky lišil od toho na
        // disku a další slučování počítalo s jiným časem, než jaký platil.
        const kdy = Date.now();
        set({ state: merged, updatedAt: kdy });
        void local().save({ state: merged, updatedAt: kdy });
      });

      set({
        householdCode: householdId,
        status: { kind: 'connected', householdCode: householdId, uid: session.uid },
      });
    } catch (error) {
      remoteAdapter = null;
      set({ status: { kind: 'error', message: describeError(error) } });
    }
  }

  return {
    ready: false,
    state: emptyHouseholdState(),
    updatedAt: 0,
    status: { kind: 'local-only' },
    householdCode: null,
    activeChildId: null,

    async init(): Promise<void> {
      rozjednanyStart ??= spustStart();
      return rozjednanyStart;
    },

    async connect(code?: string): Promise<void> {
      const householdId = normalizeHouseholdCode(code ?? get().householdCode ?? '');
      // Druhá obrazovka se sveze na výsledku první místo druhého spojení.
      if (rozjednanePripojeni !== null && rozjednanePripojeni.id === householdId) {
        return rozjednanePripojeni.hotovo;
      }
      const hotovo = pripojSe(householdId);
      rozjednanePripojeni = { id: householdId, hotovo };
      try {
        await hotovo;
      } finally {
        if (rozjednanePripojeni?.hotovo === hotovo) rozjednanePripojeni = null;
      }
    },
    disconnect(): void {
      remoteUnsubscribe?.();
      remoteUnsubscribe = null;
      remoteAdapter?.close();
      remoteAdapter = null;
      writeStoredCode(null);
      set({ householdCode: null, status: { kind: 'local-only' } });
    },

    async createHousehold(): Promise<string> {
      const code = generateHouseholdCode();
      writeStoredCode(code);
      set({ householdCode: code });
      await get().connect(code);
      return code;
    },

    /**
     * Založení dítěte. Vrací jeho id, ať ho volající může rovnou zaktivnit.
     *
     * Domácnost jich unese víc — sourozenci se v příkrmu potkávají běžně
     * a každý je jinde.
     */
    async addChild(name: string, birthDate: string): Promise<string> {
      const id = newChildId();
      const stav = get().state;
      await persist({
        ...stav,
        children: {
          ...stav.children,
          [id]: { hodnota: { id, name, birthDate }, kdy: Date.now() },
        },
      });
      get().setActiveChild(id);
      return id;
    },

    /** Změna údajů jednoho dítěte. Čím se nezabývá, to zůstává. */
    async updateChild(id: string, patch: Partial<Omit<Child, 'id'>>): Promise<void> {
      const stav = get().state;
      const soucasne = stav.children[id]?.hodnota;
      if (soucasne === undefined || soucasne === null) return;
      await persist({
        ...stav,
        children: {
          ...stav.children,
          [id]: { hodnota: { ...soucasne, ...patch, id }, kdy: Date.now() },
        },
      });
    },

    /**
     * Smazání dítěte.
     *
     * Zůstává po něm náhrobek `null`, jinak by se při slučování z druhého
     * telefonu vrátilo. Ochutnávky se nemažou: patří k datu, ne k seznamu,
     * a rodič si je může chtít přečíst i potom.
     */
    async removeChild(id: string): Promise<void> {
      const stav = get().state;
      if (stav.children[id] === undefined) return;
      await persist({
        ...stav,
        children: { ...stav.children, [id]: { hodnota: null, kdy: Date.now() } },
      });
      if (get().activeChildId === id) {
        const zbyle = activeChildren(get().state);
        get().setActiveChild(zbyle[0]?.id ?? null);
      }
    },

    /**
     * Které dítě aplikace právě ukazuje.
     *
     * Drží se jen v tomhle zařízení, ne v domácnosti: je to pohled, ne údaj.
     * Kdyby se sdílel, přepnutí u jednoho rodiče by přehodilo obrazovku
     * druhému uprostřed vaření.
     */
    setActiveChild(id: string | null): void {
      writeStoredChild(id);
      set({ activeChildId: id });
    },

    /**
     * Alergen, na který dítě reaguje. Podle toho se předvyplňuje filtr
     * „bez alergenu" na obou seznamech.
     */
    async toggleChildAllergen(id: string, allergen: AllergenGroup): Promise<void> {
      const soucasne = get().state.children[id]?.hodnota?.allergens ?? [];
      await get().updateChild(id, {
        allergens: soucasne.includes(allergen)
          ? soucasne.filter((one) => one !== allergen)
          : [...soucasne, allergen],
      });
    },

    /**
     * Odebrání zařízení z domácnosti.
     *
     * Zapisuje se náhrobek se značkou času, ne prosté vymazání z pole.
     * Dokud se `members` slučovalo sjednocením, druhý telefon odebrané
     * zařízení při dalším sloučení vrátil (audit 17. 9. 2026, nález 7.4).
     */
    async removeMember(uid: string): Promise<void> {
      const stav = get().state;
      const clenstvi = clenstviZeStavu(stav);
      if (clenstvi[uid]?.hodnota !== true) return;
      const noveClenstvi = { ...clenstvi, [uid]: { hodnota: false, kdy: Date.now() } };
      const seenAt = { ...stav.memberSeenAt };
      delete seenAt[uid];
      const popisy = { ...stav.memberLabels };
      delete popisy[uid];
      await persist({
        ...stav,
        members: clenoveZeStavu(noveClenstvi),
        memberClenstvi: noveClenstvi,
        memberSeenAt: seenAt,
        memberLabels: popisy,
      });
    },

    /** Odškrtnutí či zrušení jednoho znaku připravenosti. */
    async toggleReadySign(id: string, sign: ReadySign): Promise<void> {
      const soucasne = get().state.children[id]?.hodnota?.readySigns ?? [];
      await get().updateChild(id, {
        readySigns: soucasne.includes(sign)
          ? soucasne.filter((one) => one !== sign)
          : [...soucasne, sign],
      });
    },

    /** Úchop mění tvar sousta, ne výběr surovin — ten se dál řídí věkem. */
    async setGrip(id: string, grip: Grip | undefined): Promise<void> {
      await get().updateChild(id, { grip });
    },

    async recordTasting(event: Omit<TastingEvent, 'id' | 'createdAt'>): Promise<void> {
      // Dítě se doplňuje tady, ne ve formuláři. Deník patří dítěti a jediný
      // zápis bez `childId` by se v seznamu objevil u všech sourozenců —
      // proto to rozhoduje jedno místo, které vidí, kdo je právě vybraný.
      const aktivni =
        get().activeChildId ?? activeChildren(get().state)[0]?.id;
      const full: TastingEvent = {
        ...event,
        ...(aktivni === undefined ? {} : { childId: aktivni }),
        id: newTastingId(),
        createdAt: Date.now(),
      };
      // Append-only: nikdy nepřepisujeme, jen přidáváme (docs/SPEC.md kap. 7).
      await persist({ ...get().state, tastings: [...get().state.tastings, full] });
    },

    /**
     * Úprava existujícího záznamu. `createdAt` se zvedne, aby při slučování
     * vyhrála novější verze nad tou, kterou má druhé zařízení.
     */
    async updateTasting(id: string, patch: Partial<Omit<TastingEvent, 'id'>>): Promise<void> {
      const next = get().state.tastings.map((event) =>
        event.id === id ? { ...event, ...patch, id, createdAt: Date.now() } : event,
      );
      await persist({ ...get().state, tastings: next });
    },

    /** Měkké smazání — záznam zůstává jako náhrobek, ať ho sync nevzkřísí. */
    async deleteTasting(id: string): Promise<void> {
      await get().updateTasting(id, { deleted: true });
    },

    /**
     * Přepnutí oblíbené položky se ukládá i s časem.
     *
     * Bez času by se odebrání při slučování dvou telefonů vždycky vrátilo —
     * sjednocení seznamů umí jen přidávat. Takhle je „odebráno" plnohodnotný
     * zápis, který na druhém telefonu přebije starší „přidáno".
     */
    async toggleFavorite(id: string): Promise<void> {
      const stav = get().state;
      const zapnuto = stav.favorites[id]?.hodnota === true;
      await persist({
        ...stav,
        favorites: { ...stav.favorites, [id]: { hodnota: !zapnuto, kdy: Date.now() } },
      });
    },

    /** Poznámka k receptu, také s časem — smazaná poznámka musí přežít sloučení. */
    async setRecipeNote(recipeId: string, note: string): Promise<void> {
      const stav = get().state;
      await persist({
        ...stav,
        recipeNotes: { ...stav.recipeNotes, [recipeId]: { hodnota: note, kdy: Date.now() } },
      });
    },

    /**
     * Uloží nebo zruší plán jednoho dítěte.
     *
     * Hotový plán sem přichází zvenčí, ne že by si ho úložiště spočítalo:
     * generátor sahá do celého katalogu a úložiště je v prvním balíku
     * aplikace, takže by si ho na úvodní obrazovku stáhl každý, kdo plán
     * nikdy neotevřel. `null` je náhrobek po zrušeném plánu.
     */
    async ulozPlan(childId: string, plan: Plan | null): Promise<void> {
      const stav = get().state;
      await persist({
        ...stav,
        plans: { ...stav.plans, [childId]: { hodnota: plan, kdy: Date.now() } },
      });
    },

    /**
     * Odškrtnutí, přeskočení nebo návrat dne zpátky mezi čekající.
     *
     * Stav se zapisuje dovnitř plánu s vlastní značkou času, aby se dva
     * telefony mohly prostřídat: bez ní by pozdější zápis celého plánu
     * smazal den, který mezitím odškrtl druhý rodič.
     */
    async nastavStavDne(childId: string, cislo: number, stav: StavDne): Promise<void> {
      const soucasny = get().state.plans?.[childId]?.hodnota;
      if (soucasny === undefined || soucasny === null) return;
      const stavy = { ...soucasny.stavy, [String(cislo)]: { hodnota: stav, kdy: Date.now() } };
      const celkovy = get().state;
      await persist({
        ...celkovy,
        plans: {
          ...celkovy.plans,
          [childId]: { hodnota: { ...soucasny, stavy }, kdy: Date.now() },
        },
      });
    },

    /**
     * Přidá suroviny do nákupního seznamu.
     *
     * Dávky se ukládají jednotlivě, ne jako hotový součet: rodič může tentýž
     * recept přidat dvakrát a taky ho může zase odebrat, a z „450 g" se
     * zpátky nedopočítá, kolik z toho bylo z čeho. Už koupená položka se
     * přidáním znovu odškrtne, protože přibylo něco, co doma není.
     */
    async pridejDoNakupu(
      davky: readonly { ingredientId: string; mnozstvi?: string; recipeId?: string }[],
    ): Promise<void> {
      if (davky.length === 0) return;
      const stav = get().state;
      const nakup = { ...(stav.nakup ?? {}) };
      const ted = Date.now();
      for (const { ingredientId, mnozstvi, recipeId } of davky) {
        const soucasna = nakup[ingredientId]?.hodnota ?? null;
        const davka: NakupDavka = {
          ...(recipeId === undefined ? {} : { recipeId }),
          ...(mnozstvi === undefined ? {} : { mnozstvi }),
        };
        const nova: NakupPolozka = {
          davky: [...(soucasna?.davky ?? []), davka],
          koupeno: false,
        };
        nakup[ingredientId] = { hodnota: nova, kdy: ted };
      }
      await persist({ ...stav, nakup });
    },

    /** Odebere surovinu ze seznamu. Náhrobek, ať se z druhého telefonu nevrátí. */
    async odeberZNakupu(ingredientId: string): Promise<void> {
      const stav = get().state;
      await persist({
        ...stav,
        nakup: { ...(stav.nakup ?? {}), [ingredientId]: { hodnota: null, kdy: Date.now() } },
      });
    },

    /** Koupeno, nebo zase ne. Položka v seznamu zůstává, jen zešedne. */
    async prepniKoupeno(ingredientId: string): Promise<void> {
      const stav = get().state;
      const soucasna = stav.nakup?.[ingredientId]?.hodnota ?? null;
      if (soucasna === null) return;
      await persist({
        ...stav,
        nakup: {
          ...(stav.nakup ?? {}),
          [ingredientId]: {
            hodnota: { ...soucasna, koupeno: !soucasna.koupeno },
            kdy: Date.now(),
          },
        },
      });
    },

    /**
     * Ruční množství u položky, nebo `null` pro návrat k počítanému.
     *
     * Dávky zůstávají: recept jde pořád odebrat a seznam se pak vrátí
     * k součtu z receptů. Rodič u regálu ví líp než kuchařka, jestli
     * koupí větší balení.
     */
    async nastavMnozstvi(ingredientId: string, mnozstvi: string | null): Promise<void> {
      const stav = get().state;
      const soucasna = stav.nakup?.[ingredientId]?.hodnota ?? null;
      if (soucasna === null) return;
      const text = mnozstvi === null ? '' : mnozstvi.trim();
      const nova: NakupPolozka =
        text.length === 0
          ? { davky: soucasna.davky, koupeno: soucasna.koupeno }
          : { ...soucasna, rucniMnozstvi: text };
      await persist({
        ...stav,
        nakup: { ...(stav.nakup ?? {}), [ingredientId]: { hodnota: nova, kdy: Date.now() } },
      });
    },

    /** Uklidí seznam: buď jen odškrtnuté položky, nebo celý. */
    async vyprazdniNakup(jenKoupene = false): Promise<void> {
      const stav = get().state;
      const nakup = { ...(stav.nakup ?? {}) };
      const ted = Date.now();
      for (const [id, zaznam] of Object.entries(nakup)) {
        if (zaznam.hodnota === null) continue;
        if (jenKoupene && !zaznam.hodnota.koupeno) continue;
        nakup[id] = { hodnota: null, kdy: ted };
      }
      await persist({ ...stav, nakup });
    },

    /**
     * Sloučení nahrané zálohy se současným stavem.
     *
     * Bere `unknown`, protože obsah souboru nikdo nekontroluje — rodič může
     * vybrat jiný soubor a dřív se na tom slučování rozbilo tak, že se chyba
     * nedostala ven a aplikace hlásila úspěch, i když se nic neuložilo.
     * Převod na dnešní tvar zároveň otevře i staré zálohy.
     */
    async importState(raw: unknown): Promise<Zahozeno> {
      // Záloha z novější verze aplikace se nepřebírá. Převod umí jen pole,
      // která tahle verze zná, takže by zbytek tiše zahodil.
      if (jeZNovejsiVerze(raw)) {
        throw new Error('Záloha je z novější verze aplikace.');
      }
      const { stav: vstup, zahozeno } = prevedStav(raw);
      const merged = mergeHouseholdState(get().state, vstup);
      await persist({ ...merged, schemaVersion: SCHEMA_VERSION });
      return zahozeno;
    },
  };
});

/**
 * Přidá tohle zařízení mezi členy domácnosti.
 *
 * Členství se zapisuje se značkou času do `memberClenstvi` a `members` se
 * z něj odvodí — pole je jen to, co čtou `firestore.rules`. Zařízení,
 * které rodič odebral a které si aplikaci otevře znovu, se tím přihlásí
 * zpátky: párovací kód je v tomhle modelu členství (docs/SPEC.md kap. 7),
 * takže odebrání znamená „uvolni místo", ne „zakaž přístup".
 *
 * Čas se nepřepisuje, když už členství platí. Jinak by se pořadí podle
 * délky členství měnilo při každém otevření aplikace a „pět nejdéle
 * přihlášených" by znamenalo „pět, které se naposled dívaly".
 */
function withMember(state: HouseholdState, uid: string): HouseholdState {
  const clenstvi = clenstviZeStavu(state);
  const stavajici = clenstvi[uid];
  const noveClenstvi = {
    ...clenstvi,
    [uid]: stavajici?.hodnota === true ? stavajici : { hodnota: true, kdy: Date.now() },
  };
  return {
    ...state,
    members: clenoveZeStavu(noveClenstvi),
    memberClenstvi: noveClenstvi,
    memberSeenAt: { ...state.memberSeenAt, [uid]: Date.now() },
    // Popis se přepisuje při každém připojení: rodič si aplikaci může mezitím
    // nainstalovat a z „Chrome" se stane „Nainstalovaná aplikace".
    memberLabels: { ...state.memberLabels, [uid]: popisZarizeni() },
  };
}

/**
 * Hláška, kterou uvidí rodič. Firebase mluví anglicky a technicky, takže se
 * sem jeho text nikdy nepouští doslova — je nesrozumitelný a v aplikaci pro
 * rodiče nemá co dělat. Podrobnost zůstává v konzoli prohlížeče.
 */
function describeError(error: unknown): string {
  const text = error instanceof Error ? error.message : String(error);
  // Podrobnost pro ladění, ne pro rodiče.
  console.warn('Synchronizace:', text);

  // Firestore vrátí u zamítnutého zápisu jen „permission-denied“. Nejčastější
  // příčinou je plná domácnost, což ze samotné hlášky nikdo nepozná.
  if (/permission|insufficient/i.test(text)) {
    return `Zápis odmítnut. Buď je domácnost plná (nejvýš ${MAX_MEMBERS} zařízení. Odeber některé v Domácnosti na jiném telefonu), nebo nemá databáze nahraná pravidla přístupu; to se nastavuje jednou při zprovoznění sdílení.`;
  }
  if (/unavailable|network|offline|failed to (get|fetch)/i.test(text)) {
    return 'Zařízení je teď bez spojení. Zapsané změny máš uložené v telefonu a odešlou se samy, jakmile bude síť zpátky.';
  }
  if (/not-found|no document/i.test(text)) {
    return 'Domácnost s tímhle kódem neexistuje. Zkontroluj kód na druhém telefonu, nebo tam založ novou domácnost.';
  }
  return 'Sdílení se teď nepodařilo navázat. Data máš uložená v telefonu a nic se neztratilo; zkus to za chvíli znovu.';
}
