/**
 * Datový model podle docs/SPEC.md kapitola 2.
 * Typy jsou zdrojem pravdy — data se proti nim validují.
 */

export type Stage = '6m' | '9m' | '12m';
export const STAGES: readonly Stage[] = ['6m', '9m', '12m'] as const;

/**
 * Úchop dítěte. Rozhoduje o TVARU sousta — co dítě zvedne z tácku — zatímco
 * fáze podle věku dál rozhoduje o tom, CO se vůbec nabízí a jak měkké to musí
 * být. Posloupnost dlaňový → nůžkový/klešťový → pinzetový popsala vývojová
 * psychologie dávno před metodou; věk u ní je jen orientační.
 */
/**
 * Tři vývojové znaky, na kterých metoda stojí (rada `je-dite-pripravene`).
 *
 * Nejsou to položky k odškrtání pro parádu: dokud nejsou pohromadě, nemá
 * začínat žádná metoda příkrmu, a to bez ohledu na to, kolik je dítěti
 * měsíců. Proto se podle nich řídí upozornění u fáze 6m+.
 */
export type ReadySign = 'sed' | 'koordinace' | 'reflex';
export const READY_SIGNS: readonly ReadySign[] = ['sed', 'koordinace', 'reflex'] as const;

export type Grip = 'dlanovy' | 'nuzkovy' | 'pinzetovy';
export const GRIPS: readonly Grip[] = ['dlanovy', 'nuzkovy', 'pinzetovy'] as const;

export type ChokingRisk = 'low' | 'medium' | 'high';

/**
 * V jaké podobě se surovina dostane na talíř.
 *
 * Rozhoduje o tom, jestli má u ní vůbec smysl radit tvar sousta. Rada
 * „krájej na proužky dlouhé jako prst" je u amarantu i u ředkvičky nesmysl —
 * jedno je kaše, druhé je menší než prst samo o sobě. Nesmyslná rada přitom
 * není neškodná: naučí rodiče panel přeskakovat i tam, kde na něm záleží.
 *
 *  - `kusove`   — dá se nakrájet na proužky a kousky (mrkev, kuře, jablko)
 *  - `drobne`   — samo o sobě menší než prst; řeší se půlení a čtvrcení,
 *                 ne délka proužku (ředkvička, hrášek, borůvky, těstoviny)
 *  - `kasovite` — kaše, pyré, pomazánka, mletá surovina; podává se na lžíci
 *                 nebo nanesená na nosiči (amarant, jogurt, tahini)
 *  - `neresi`   — nápoj, tuk, koření, sladidlo; sousto z toho nevzniká
 */
export type ServingForm = 'kusove' | 'drobne' | 'kasovite' | 'neresi';
export type ReviewStatus = 'verified' | 'needs-review';

export type IngredientCategory =
  | 'zelenina'
  | 'ovoce'
  | 'obiloviny'
  | 'maso-ryby'
  | 'lusteniny'
  | 'mlecne-vejce'
  | 'orechy-seminka-tuky'
  | 'bylinky-koreni'
  | 'ostatni';

export const INGREDIENT_CATEGORIES: readonly IngredientCategory[] = [
  'zelenina',
  'ovoce',
  'obiloviny',
  'maso-ryby',
  'lusteniny',
  'mlecne-vejce',
  'orechy-seminka-tuky',
  'bylinky-koreni',
  'ostatni',
] as const;

/** 9 alergenů klíčových pro zavádění + zbytek ze 14 povinně značených v EU */
export type AllergenGroup =
  | 'vejce'
  | 'arasidy'
  | 'mleko'
  | 'orechy'
  | 'psenice-lepek'
  | 'soja'
  | 'ryby'
  | 'sezam'
  | 'korysi'
  | 'mekkysi'
  | 'celer'
  | 'horcice'
  | 'lupina'
  | 'siricitany';

/** Všech 14 alergenových skupin za běhu — viz komentář u TASTING_AMOUNTS. */
export const ALLERGEN_GROUPS: readonly AllergenGroup[] = [
  'vejce',
  'arasidy',
  'mleko',
  'orechy',
  'psenice-lepek',
  'soja',
  'ryby',
  'sezam',
  'korysi',
  'mekkysi',
  'celer',
  'horcice',
  'lupina',
  'siricitany',
] as const;

/** 9 alergenů, u kterých aplikace sleduje plánované zavádění (docs/BEZPECNOST.md kap. 4) */
export const KEY_ALLERGENS: readonly AllergenGroup[] = [
  'vejce',
  'arasidy',
  'mleko',
  'orechy',
  'psenice-lepek',
  'soja',
  'ryby',
  'sezam',
  'korysi',
] as const;

export type Hazard =
  | 'dusicnany'
  | 'rtut'
  | 'arsen'
  | 'vitamin-a'
  | 'sul'
  | 'botulismus'
  | 'nepasterizovane'
  | 'syrove'
  | 'kosti'
  | 'cukr';

export const HAZARDS: readonly Hazard[] = [
  'dusicnany',
  'rtut',
  'arsen',
  'vitamin-a',
  'sul',
  'botulismus',
  'nepasterizovane',
  'syrove',
  'kosti',
  'cukr',
] as const;

export interface SourceRef {
  /** Krátký název instituce, např. "ESPGHAN" nebo "NHS Start for Life" */
  org: string;
  title: string;
  url: string;
  /** ISO datum, kdy byl odkaz skutečně načten */
  accessedAt: string;
  /** 1 = odborná společnost / úřad, 2 = důvěryhodná odborná publikace */
  tier: 1 | 2;
}

export interface StagePrep {
  /** Jak to nakrájet a servírovat. 2–4 věty, konkrétně, česky. */
  serving: string;
  /** Na co si dát pozor právě v této fázi. Prázdné jen pokud opravdu nic. */
  caution?: string;
}

export interface Ingredient {
  id: string;
  nameCz: string;
  /** Synonyma pro vyhledávání ("batáty", "sladké brambory") */
  altNamesCz: string[];
  category: IngredientCategory;
  /** Nouzová ikona, dokud surovina nemá vlastní kresbu. */
  emoji?: string;
  /** Klíč do kreslené sady v src/app/icons/shapes.tsx; má přednost před emoji. */
  icon?: string;

  allergens: AllergenGroup[];
  /** Patří mezi 9 klíčových alergenů pro plánované zavádění */
  isKeyAllergen: boolean;
  chokingRisk: ChokingRisk;
  /** Konkrétní důvod rizika, ne obecná fráze. */
  chokingReason?: string;
  /** Podoba na talíři; podle ní se řídí rada o tvaru sousta. */
  servingForm: ServingForm;

  /** Strukturovaná rizika — validátor je kontroluje, UI je zobrazuje jako štítky */
  hazards: Hazard[];
  /** Lidsky napsané vysvětlení ke každému hazardu, klíč = hazard */
  hazardNotes: Record<string, string>;

  /** Nejdřívější věk v měsících, kdy se surovina obvykle nabízí */
  minAgeMonths: number;
  /** Pokud existuje horní omezení četnosti, např. játra */
  frequencyLimit?: string;

  prep: Record<Stage, StagePrep>;
  /** 3–4 konkrétní způsoby úpravy: pára, pečení, pyré, syrové... */
  prepIdeas: string[];
  /** Měsíce sezónnosti v ČR, 1–12. Prázdné pole = celoročně. */
  seasonCz: number[];
  /** Vhodné pro vegetariánskou stravu */
  vegetarian: boolean;

  sources: SourceRef[];
  reviewStatus: ReviewStatus;
  reviewNote?: string;
}

export type RecipeCategory = 'snidane' | 'obed-vecere' | 'polevky' | 'svaciny-peceni';

export const RECIPE_CATEGORIES: readonly RecipeCategory[] = [
  'snidane',
  'obed-vecere',
  'polevky',
  'svaciny-peceni',
] as const;

export type DietTrack = 'vegetarian' | 'meat';

export interface RecipeIngredientRef {
  /** Musí existovat v katalogu */
  ingredientId: string;
  /** "150 g", "1 lžíce" */
  amount: string;
  /** Do které linie složka patří. 'all' = společný základ. */
  track: 'all' | DietTrack;
  /**
   * Složka, kterou dětská porce nikdy nedostane.
   *
   * Věk receptu se počítá z toho, co miminko opravdu sní. Bez tohohle
   * příznaku ho zvedla i surovina, která je v jídle jen kvůli dospělým —
   * třeba uzené tofu jako bezmasá náhrada masa. Recept se pak tvářil jako
   * „vhodné od 12 měsíců", i když dětská porce byla odebraná z masa,
   * zelí a brambory a šla podat od šesti.
   *
   * Nesmí stát u společného základu (`track: 'all'`) ani u suroviny, kterou
   * dětské kroky jmenují — obojí hlídají pravidla v `src/safety/rules.ts`.
   */
  adultOnly?: true;
  /** "pro miminko odeber před přidáním" */
  note?: string;
}

export interface Recipe {
  id: string;
  titleCz: string;
  category: RecipeCategory;
  minAgeMonths: number;
  /**
   * Proč je věk vyšší, než vyžadují samotné suroviny.
   *
   * Povinné právě v tom případě — jinak by šlo věk kdykoli zvednout „pro
   * jistotu" a recept by se rodiči schoval před fází, do které patří.
   * Důvod bývá v podobě jídla, ne ve složení: syrový list v závitku,
   * špejle, salát, který se nedá rozmačkat. Ukazuje se u štítku s věkem.
   */
  minAgeReason?: string;
  timeMinutes: number;
  /** "2 dospělí + 1 miminko" */
  servings: string;

  ingredients: RecipeIngredientRef[];
  /** Společný postup pro celou rodinu, číslované kroky */
  baseSteps: string[];
  /** Kdy přesně odebrat porci pro miminko — povinné, nesmí být prázdné */
  babySplitPoint: string;
  babySteps: string[];
  /** Jak porci miminku podat v dané fázi */
  babyServing: Record<Stage, string>;
  /**
   * Dochucení pro dospělé. Dětská porce je v tuhle chvíli hotová a odebraná,
   * takže sem patří sůl, ostré koření i alkohol.
   *
   * U receptu s masem nebo rybou popisuje masitou variantu; jinak platí pro
   * všechny dospělé u stolu.
   */
  adultSteps: string[];
  /**
   * Bezmasá varianta dochucení pro vegetariány v rodině.
   *
   * Povinná jen u receptu, který maso nebo rybu obsahuje. U bezmasého
   * receptu nemá co dělat — dělit dochucení na masité a bezmasé, když
   * v jídle žádné maso není, byla jen zdvojená a matoucí věta.
   */
  vegetarianSteps?: string[];
  /** Čím se nahrazuje bílkovina v bezmasé verzi. Povinné u receptu s masem/rybou. */
  vegetarianProteinSwap?: string;

  /** Odvozené ze složek, dopočítá validátor */
  allergens: AllergenGroup[];
  /** "bez lepku", "jednohrnec", "do ruky", "mrazitelné" */
  tags: string[];
  /** Technika/bezpečnost, ne samotný recept */
  sources: SourceRef[];
  reviewStatus: ReviewStatus;
}

export type TastingAmount = 'ochutnala' | 'snedla-cast' | 'snedla-vse' | 'odmitla';
export type TastingReaction = 'zadna' | 'chutnalo' | 'nelibilo' | 'kozni' | 'travici' | 'jina';

/**
 * Tytéž hodnoty za běhu.
 *
 * Typ sám o sobě po překladu zmizí, takže se proti němu nedá zkontrolovat
 * nahraná záloha ani dokument z Firestore. Tahle pole jsou jediný způsob,
 * jak se dá na hranici aplikace zeptat „je tohle platná hodnota" — používá
 * je `src/sync/validace.ts` a formulář ochutnávky.
 */
export const TASTING_AMOUNTS: readonly TastingAmount[] = [
  'ochutnala',
  'snedla-cast',
  'snedla-vse',
  'odmitla',
] as const;

export const TASTING_REACTIONS: readonly TastingReaction[] = [
  'zadna',
  'chutnalo',
  'nelibilo',
  'kozni',
  'travici',
  'jina',
] as const;

export interface TastingEvent {
  id: string;
  ingredientId: string;
  /**
   * Které dítě ochutnávalo.
   *
   * Nepovinné kvůli záznamům z doby, kdy aplikace uměla jen jedno dítě —
   * ty se při načtení přiřadí prvnímu dítěti v domácnosti.
   */
  childId?: string;
  /** ISO datum */
  date: string;
  amount: TastingAmount;
  reaction: TastingReaction;
  note?: string;
  /** uid rodiče */
  createdBy: string;
  /** pro řešení konfliktů */
  createdAt: number;
  /**
   * Měkké smazání. Záznam se nemaže z pole, jen se označí — jinak by ho
   * druhé zařízení při slučování vzkřísilo (docs/SPEC.md kap. 7).
   */
  deleted?: boolean;
}

/**
 * Jedno dítě v domácnosti.
 *
 * Sourozenci se v příkrmu potkávají běžně a každý je jinde — jiný věk, jiný
 * úchop, jiné alergie. Dřív aplikace uměla jen jedno dítě a rodina se dvěma
 * si musela vybrat, kterému bude odpovídat.
 */
export interface Child {
  id: string;
  name: string;
  /** ISO datum */
  birthDate: string;
  /** Úchop, který rodič u dítěte pozoruje. Nevyplněný = řídíme se jen věkem. */
  grip?: Grip;
  /** Odškrtnuté znaky připravenosti. Nevyplněné = ještě se nezačalo. */
  readySigns?: ReadySign[];
  /**
   * Alergeny, na které dítě reaguje.
   *
   * Zadává je rodič a filtr „bez alergenu" se podle nich předvyplňuje.
   * Aplikace tím nic nediagnostikuje — jen si pamatuje, co rodič sám zadal.
   */
  allergens?: AllergenGroup[];
}

/**
 * Třicetidenní plán jídel.
 *
 * Patří dítěti, ne domácnosti: sourozenci jsou každý jinde a sdílený plán by
 * jednomu z nich nabízel jídlo, které ještě neumí. Funkce nad tímhle tvarem
 * jsou v src/plan/.
 */
/** Jaké jídlo dne to je. */
export type TypJidla = 'snidane' | 'obed' | 'svacina' | 'vecere';

/** Proč plán zrovna tohle jídlo nabízí. Rodič to vidí u jídla jako štítek. */
export type DuvodJidla =
  | 'prvni-ochutnavka'
  | 'nova-surovina'
  | 'alergen'
  | 'zelezo'
  | 'osvedcene';

export interface PlanJidlo {
  typ: TypJidla;
  /** Recept z kuchařky. U prvních ochutnávek chybí. */
  recipeId?: string;
  /**
   * Samotná surovina bez receptu.
   *
   * Poslední záchrana pro den, na který se na novinku recept nenašel.
   * Zůstává i kvůli plánům uloženým dřív, kdy byl první týden schválně
   * bez vaření.
   */
  ingredientId?: string;
  duvod: DuvodJidla;
}

export interface PlanDen {
  /** Pořadí v bloku, od jedné. */
  cislo: number;
  /** Surovina, která se ten den zavádí poprvé. */
  novinka?: string;
  /** Alergen, který se ten den opakuje. Druhá nebo třetí expozice. */
  opakovanyAlergen?: AllergenGroup;
  jidla: PlanJidlo[];
}

export type StavDne = 'ceka' | 'hotovo' | 'preskoceno';

export interface Plan {
  childId: string;
  /** Kolikátých třicet dní to je. První blok má číslo jedna. */
  blok: number;
  /** Datum sestavení, ISO. */
  vytvoreno: string;
  /**
   * Alergie dítěte v době sestavení, seřazené.
   *
   * Plán je hotový rozvrh, ne živý dotaz do katalogu. Když rodič alergii
   * zapíše až potom, plán o ní neví a dál nabízí jídlo, které dítě nesmí.
   * Uložený seznam se dá porovnat s dnešním, aniž by se kvůli tomu musel
   * stahovat katalog, takže na to upozorní i úvodní obrazovka.
   */
  alergie?: AllergenGroup[];
  /**
   * Kolikátá podoba bloku to je.
   *
   * Plán je čistá funkce, takže ze stejného zadání vyjde vždycky tentýž.
   * Tlačítko „sestavit znovu" proto bez tohohle čísla vracelo řádek po řádku
   * to samé a vypadalo jako nefunkční. Každé přesestavení číslo zvedne a plán
   * sáhne po jiných receptech ze stejně vhodných.
   */
  varianta?: number;
  /**
   * Co dítě znalo ve chvíli, kdy blok vznikl.
   *
   * Druhý blok navazuje na první, ale ukládá se vždycky jen ten poslední.
   * Bez tohohle seznamu by aplikace ve druhém bloku nabízela vedle novinky
   * jen suroviny z jeho vlastních dnů, jako by na první měsíc příkrmu
   * zapomněla. Deník sám nestačí: rodič, který dny jen odškrtává a nezapisuje,
   * by v něm nic neměl.
   */
  zname?: string[];
  dny: PlanDen[];
  /**
   * Stav jednotlivých dnů podle jejich čísla.
   *
   * Každý den nese vlastní značku času, aby se odškrtnutí ze dvou telefonů
   * dalo sloučit. Bez toho by pozdější zápis celého plánu smazal den, který
   * mezitím odškrtl druhý rodič.
   */
  stavy: Record<string, CasovanaHodnota<StavDne>>;
}


export interface HouseholdState {
  /**
   * Děti v domácnosti podle `id`.
   *
   * Mapa se značkou času, ne pole: dvě zařízení můžou offline přidat každé
   * své dítě a obojí musí zůstat. `null` je náhrobek po smazaném dítěti —
   * bez něj by se smazané dítě při slučování vrátilo.
   */
  children: Record<string, CasovanaHodnota<Child | null>>;
  /**
   * uid členů domácnosti.
   *
   * Tohle pole čtou i `firestore.rules`, takže musí zůstat prostým polem
   * řetězců. Autorita je ale `memberClenstvi`: `members` se z něj odvozuje
   * a je useknuté na `MAX_MEMBERS`, protože pravidla delší seznam odmítnou.
   */
  members: string[];
  /**
   * Členství se značkou času (uid → člen ano/ne).
   *
   * Dokud bylo `members` jen pole, slučovalo se sjednocením — a sjednocení
   * umí jen přidávat. Odebrané zařízení se tedy při dalším sloučení vrátilo
   * a popisky s časy rostly donekonečna (audit 17. 9. 2026, nálezy 7.3 a
   * 7.4). Stejná vada, jakou projekt už jednou opravil u `favorites`, a
   * stejné řešení: u každého uid rozhoduje pozdější zápis.
   *
   * Odebrané zařízení, které si aplikaci otevře znovu a zná párovací kód,
   * se přihlásí zpátky. Tak je model přístupu postavený (kód je členství),
   * takže odebrání znamená „uvolni místo", ne „zakaž přístup".
   */
  memberClenstvi?: Record<string, CasovanaHodnota<boolean>>;
  /**
   * Kdy se který člen naposled připojil (uid → čas v ms).
   *
   * Anonymní přihlášení váže uid na úložiště zařízení. Kdo smaže data
   * prohlížeče nebo přeinstaluje aplikaci, dostane příště nové uid a musí se
   * připojit znovu — to staré ale v `members` zůstane a zabírá jedno z pěti
   * míst. Bez téhle značky by nešlo poznat, které z uid ještě někomu patří.
   */
  memberSeenAt?: Record<string, number>;
  /**
   * Jak se které zařízení jmenuje (uid → popis).
   *
   * Z uid se nepozná nic. Jeden telefon přitom v seznamu klidně vystupuje
   * dvakrát — jednou jako nainstalovaná aplikace a jednou jako prohlížeč,
   * ve kterém se otevřela pozvánka z chatu. Bez popisu rodič neví, které
   * z nich smí odebrat.
   */
  memberLabels?: Record<string, string>;
  tastings: TastingEvent[];
  /**
   * Oblíbené suroviny a recepty, klíčem je `ingredientId` nebo `recipeId`.
   *
   * Není to seznam, ale mapa se značkou času, protože seznamy se při
   * slučování dvou telefonů sjednocují a odebrání by se tím vždycky vrátilo
   * zpátky. Takhle rozhoduje u každé položky poslední přepnutí — a to může
   * být i „odebráno". Oblíbené jsou společné celé domácnosti, ne dítěti:
   * recept, který doma funguje, funguje pro rodinu.
   */
  favorites: Record<string, CasovanaHodnota<boolean>>;
  /**
   * Pro kolik dospělých se vaří — přepočet množství v nákupním seznamu.
   *
   * Kuchařka je psaná na dva dospělé a jedno dítě. Kdo vaří pro pět, si to
   * dosud musel přepočítat sám (audit 17. 9. 2026, kapitola 10 bod 2).
   * Se značkou času jako všechno ostatní, ať se dva telefony nepřetahují.
   */
  nakupDospelych?: CasovanaHodnota<number>;
  /** Poznámky rodiče k receptům, klíčem je `recipeId`. Se značkou času ze
   *  stejného důvodu jako oblíbené: smazání poznámky musí přežít sloučení. */
  recipeNotes: Record<string, CasovanaHodnota<string>>;
  /**
   * Třicetidenní plán pro každé dítě, klíčem je `childId`.
   *
   * Nepovinné, protože data uložená dřívější verzí ho nemají. `null` je
   * náhrobek po zrušeném plánu: bez něj by se zrušený plán při slučování
   * z druhého telefonu vrátil.
   */
  plans?: Record<string, CasovanaHodnota<Plan | null>>;
  /**
   * Nákupní seznam domácnosti, klíčem je `ingredientId`.
   *
   * Patří domácnosti, ne dítěti: nakupuje se pro celý stůl a druhý rodič
   * musí u regálu vidět totéž. Nepovinné kvůli datům uloženým dřívější
   * verzí. `null` je náhrobek po odebrané položce — bez něj by se odebraná
   * surovina při slučování z druhého telefonu vrátila.
   */
  nakup?: Record<string, CasovanaHodnota<NakupPolozka | null>>;
  schemaVersion: number;
}

/**
 * Jedna položka nákupního seznamu.
 *
 * Množství se nesčítá při vkládání, ale až při zobrazení. Kdyby se sčítalo
 * hned, nešlo by pak odebrat jeden recept ze seznamu — z „450 g" se zpátky
 * nedopočítá, kolik z toho bylo z které kuchařské položky.
 */
export interface NakupPolozka {
  davky: NakupDavka[];
  /** Odškrtnuté = koupené. Vrátit se dá stejným klepnutím. */
  koupeno: boolean;
  /**
   * Množství přepsané rodičem, třeba „1 kg".
   *
   * Přebíjí součet z dávek, ale nemaže je: recept jde pořád odebrat
   * a po odebrání se seznam vrátí k počítanému množství. Rodič u regálu
   * ví líp než kuchařka, jestli koupí větší balení — a součet „450 g"
   * je odhad ze tří receptů, ne to, co se prodává.
   */
  rucniMnozstvi?: string;
}

export interface NakupDavka {
  /** Recept, ze kterého množství přišlo. Chybí u ručně přidané suroviny. */
  recipeId?: string;
  /** Text z receptu, třeba „150 g". Chybí u ručně přidané suroviny. */
  mnozstvi?: string;
}


/**
 * Hodnota, u které rozhoduje čas poslední změny.
 *
 * Dva telefony můžou být offline a upravit totéž; vyhrává pozdější zápis,
 * ať už něco přidává, mění, nebo maže. Bez značky času se nedá poznat, jestli
 * je „prázdno" nová informace, nebo jen starý stav, který ještě nedošel.
 */
export interface CasovanaHodnota<T> {
  hodnota: T;
  /** Kdy se hodnota naposled změnila, v milisekundách. */
  kdy: number;
}

/** Katalog, proti kterému běží validační pravidla */
/** Kategorie rady v sekci Rady. */
export type GuideCategory = 'bezpecnost' | 'vyziva' | 'zacatek' | 'praxe';

export const GUIDE_CATEGORIES: readonly GuideCategory[] = [
  'bezpecnost',
  'vyziva',
  'zacatek',
  'praxe',
] as const;

/** Blok textu uvnitř rady. */
export interface GuideSection {
  heading: string;
  /** Odstavce nebo odrážky, každá položka jedna myšlenka. */
  body: string[];
  /** Odrážky se vykreslí jako seznam, jinak jako odstavce. */
  asList?: boolean;
}

/**
 * Rada — souvislý text, který nepatří ke konkrétní surovině ani receptu.
 * Bezpečnostní tvrzení platí stejná pravidla jako u surovin: každá rada má
 * aspoň jeden ověřený zdroj (docs/BEZPECNOST.md kap. 1).
 */
export interface Guide {
  id: string;
  titleCz: string;
  category: GuideCategory;
  /** Jedna věta do seznamu a na dlaždici. */
  summary: string;
  /** Klíčové věty vypíchnuté nad textem. Prázdné pole je v pořádku. */
  keyPoints: string[];
  sections: GuideSection[];
  /** Rada, na kterou se musí dát sáhnout rychle — dostane červený rám a místo na úvodní obrazovce. */
  urgent?: boolean;
  sources: SourceRef[];
  /** Odborná literatura bez URL; doplněk ke `sources`, nenahrazuje je. */
  literature?: string[];
  reviewStatus: ReviewStatus;
}

export interface Catalog {
  ingredients: Ingredient[];
  recipes: Recipe[];
  guides: Guide[];
}
