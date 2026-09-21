# SPEC.md — funkční specifikace aplikace Drobek

## 1. Uživatelé a kontext

Dva rodiče, jedna dcera. Matka je **vegetariánka** (nejí maso ani ryby, jí mléčné výrobky a vejce), otec a dcera jedí i maso. Cíl je jedno vaření pro celou rodinu.

Typická situace použití: rodič stojí v kuchyni, drží dítě v jedné ruce, telefon v druhé, potřebuje za pět vteřin zjistit „můžu jí dát tohle a jak to nakrájet". Tomu podřiď celý návrh — velké dotykové cíle, žádné skryté gesto, žádná obrazovka, která vyžaduje dvě ruce.

Datum narození dcery zadají rodiče v nastavení. Z něj se počítá aktuální věk v měsících a aplikace **automaticky předvybírá** odpovídající fázi (6m+ / 9m+ / 12m+); ručně lze přepnout.

## 2. Datový model

Vše v `src/types/`. Typy jsou zdrojem pravdy, data se proti nim validují.

```ts
export type Stage = '6m' | '9m' | '12m';
export type ChokingRisk = 'low' | 'medium' | 'high';
export type ReviewStatus = 'verified' | 'needs-review';

export type IngredientCategory =
  | 'zelenina' | 'ovoce' | 'obiloviny' | 'maso-ryby' | 'lusteniny'
  | 'mlecne-vejce' | 'orechy-seminka-tuky' | 'bylinky-koreni' | 'ostatni';

/** 9 alergenů klíčových pro zavádění + zbytek ze 14 povinně značených v EU */
export type AllergenGroup =
  | 'vejce' | 'arasidy' | 'mleko' | 'orechy' | 'psenice-lepek' | 'soja'
  | 'ryby' | 'sezam' | 'korysi' | 'mekkysi' | 'celer' | 'horcice'
  | 'lupina' | 'siricitany';

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
  id: string;                 // slug, např. "dyne-hokaido"
  nameCz: string;
  altNamesCz: string[];       // synonyma pro vyhledávání ("batáty", "sladké brambory")
  category: IngredientCategory;
  emoji?: string;

  allergens: AllergenGroup[];
  isKeyAllergen: boolean;     // patří mezi 9 klíčových pro plánované zavádění
  chokingRisk: ChokingRisk;
  /** Konkrétní důvod rizika, ne obecná fráze. Např. "kulatý tvar odpovídá průměru dýchacích cest". */
  chokingReason?: string;

  /** Strukturovaná rizika — validátor je kontroluje, UI je zobrazuje jako štítky */
  hazards: Array<
    | 'dusicnany' | 'rtut' | 'arsen' | 'vitamin-a' | 'sul'
    | 'botulismus' | 'nepasterizovane' | 'syrove' | 'kosti' | 'cukr'
  >;
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
export type DietTrack = 'vegetarian' | 'meat';

export interface RecipeIngredientRef {
  ingredientId: string;       // musí existovat v katalogu
  amount: string;             // "150 g", "1 lžíce"
  /** Do které linie složka patří. 'all' = společný základ. */
  track: 'all' | DietTrack;
  /** Složka, kterou dětská porce nikdy nedostane — do věku receptu se nepočítá. */
  adultOnly?: true;
  note?: string;              // "pro miminko odeber před přidáním"
}

export interface Recipe {
  id: string;
  titleCz: string;
  category: RecipeCategory;
  minAgeMonths: number;
  /** Proč je věk vyšší, než vyžadují suroviny. Povinné právě v tom případě. */
  minAgeReason?: string;
  timeMinutes: number;
  servings: string;           // "2 dospělí + 1 miminko"

  ingredients: RecipeIngredientRef[];
  /** Společný postup pro celou rodinu, číslované kroky */
  baseSteps: string[];
  /** Kdy přesně odebrat porci pro miminko — povinné, nesmí být prázdné */
  babySplitPoint: string;
  babySteps: string[];
  /** Jak porci miminku podat v dané fázi */
  babyServing: Record<Stage, string>;
  /** Dochucení pro dospělé; u receptu s masem popisuje masitou variantu */
  adultSteps: string[];
  /** Bezmasá varianta dochucení (matka); jen u receptu s masem nebo rybou */
  vegetarianSteps?: string[];
  /** Čím se nahrazuje bílkovina v bezmasé verzi. Povinné, když recept obsahuje maso/rybu. */
  vegetarianProteinSwap?: string;

  allergens: AllergenGroup[];   // odvozené ze složek, dopočítá validátor
  tags: string[];               // "bez lepku", "jednohrnec", "do ruky", "mrazitelné"
  sources: SourceRef[];         // technika/bezpečnost, ne samotný recept
  reviewStatus: ReviewStatus;
}

export interface TastingEvent {
  id: string;
  ingredientId: string;
  childId?: string;           // chybí u záznamů z doby jednoho dítěte
  date: string;               // ISO
  amount: 'ochutnala' | 'snedla-cast' | 'snedla-vse' | 'odmitla';
  reaction: 'zadna' | 'chutnalo' | 'nelibilo' | 'kozni' | 'travici' | 'jina';
  note?: string;
  createdBy: string;          // uid rodiče
  createdAt: number;          // pro řešení konfliktů
  deleted?: boolean;          // měkké smazání, jinak ho sync vzkřísí
}

/** Hodnota s vlastní značkou času — jinak by odebrání sloučení vrátilo. */
export interface CasovanaHodnota<T> {
  hodnota: T;
  kdy: number;
}

export interface HouseholdState {
  members: string[];                                     // uid
  children: Record<string, CasovanaHodnota<Child | null>>; // null = náhrobek
  tastings: TastingEvent[];
  favorites: Record<string, CasovanaHodnota<boolean>>;
  recipeNotes: Record<string, CasovanaHodnota<string>>;
  plans?: Record<string, CasovanaHodnota<Plan | null>>;   // klíč = childId
  nakup?: Record<string, CasovanaHodnota<NakupPolozka | null>>;
  memberSeenAt?: Record<string, number>;
  memberLabels?: Record<string, string>;
  schemaVersion: number;
}
```

### Co se od prvního znění změnilo a proč

Tenhle výpis je **zkrácený**; úplný a závazný tvar je v
`src/types/domain.ts`. Rozdíly oproti původnímu návrhu stojí za vysvětlení,
protože žádný z nich nebyl kosmetický:

- **Dětí je víc než jedno.** `childName` a `childBirthDate` se změnily na
  mapu `children`. Sourozenci se v příkrmu potkávají běžně a každý je
  jinde — jiný věk, jiný úchop, jiné alergie. `Child` navíc nese `grip`,
  `readySigns` a `allergens`.
- **Oblíbené a poznámky mají značku času.** Původní `favorites: string[]`
  mělo tichou vadu: sjednocení seznamů umí jen přidávat, takže se
  odebrání při sloučení dvou telefonů vždycky vrátilo.
- **Smazání je náhrobek, ne díra.** `deleted: true` u ochutnávky a `null`
  u dítěte, plánu nebo položky nákupu. Bez toho by je druhý telefon
  vzkřísil.
- **Přibyl 30denní plán** (`plans`, `docs/PLAN-30-DNI.md`) a **nákupní
  seznam** (`nakup`). Obojí rozhodnuto září 2026, viz `CLAUDE.md`.
- **Surovina nese navíc** `servingForm` (kusové / drobné / kašovité /
  neřeší se), `icon` a profil živin (`src/data/nutrients.ts`).
- **Katalog vede i rady** (`Guide`, `src/data/guides/`) **a seznamy**
  (`src/data/lists.ts`).

Všechno, co přijde zvenčí, projde kontrolou tvaru v
`src/sync/validace.ts` — viz kapitola 7.

## 3. Bezpečnostní vrstva — `src/safety/`

Tohle je jádro důvěryhodnosti. Není to dokumentace, je to kód.

`src/safety/rules.ts` exportuje pole pravidel. Každé pravidlo má `id`, `severity: 'error' | 'warning'`, `appliesTo: 'ingredient' | 'recipe'`, `check(item, catalog): string | null`. Vrátí text chyby nebo `null`.

Povinná pravidla (minimum, doplň další podle `BEZPECNOST.md`):

| id | severity | co kontroluje |
|---|---|---|
| `no-honey-baby` | error | slovo „med" (vč. tvarů) se neobjeví v `babySteps`, `babyServing` ani v instrukcích surovin s `minAgeMonths < 12` |
| `no-salt-baby` | error | „sůl", „solit", „dosolit", „bujón", „vývar z kostky" v dětské linii; solení smí být až v `adultSteps`/`vegetarianSteps` |
| `no-sugar-baby` | error | přidaný cukr, sirup, javorový sirup, agáve v dětské linii |
| `no-whole-nuts` | error | celé ořechy / celá semínka v dětské linii bez slova „mleté"/"máslo"/"pasta" |
| `round-food-shape` | error | suroviny s `chokingRisk: 'high'` a kulatým tvarem musí mít v `prep['6m'].serving` i `prep['9m'].serving` explicitní pokyn k podélnému rozčtvrcení |
| `baby-split-required` | error | `babySplitPoint` je neprázdný a odkazuje na konkrétní krok z `baseSteps` |
| `baby-step-feasible` | error | pokyn pro miminko jde podle `babySplitPoint` skutečně provést — neodkazuje na krok, který v tu chvíli ještě neproběhl |
| `veg-track-complete` | error | `vegetarianSteps` neprázdné; pokud recept obsahuje surovinu z `maso-ryby`, musí být vyplněný `vegetarianProteinSwap` |
| `hidden-animal-ingredients` | error | v `vegetarianSteps` se nesmí objevit želatina, sádlo, rybí omáčka, worcesterská omáčka, ančovičky, syřidlo živočišného původu; parmazán a pecorino jsou vedeny jako `vegetarian: false` a v bezmasé verzi se nahrazují |
| `source-required` | error | každá surovina má ≥1 `SourceRef` s `tier: 1` nebo dva s `tier: 2` |
| `source-url-shape` | error | URL je absolutní https, doména je v povoleném seznamu důvěryhodných zdrojů |
| `no-placeholder` | error | nikde `TODO`, `lorem`, `doplnit`, `xxx`, prázdný povinný string |
| `ingredient-refs-resolve` | error | každý `ingredientId` v receptu existuje v katalogu |
| `stage-prep-complete` | error | všechny tři fáze vyplněné, každá ≥ 80 znaků, nejsou navzájem identické |
| `allergen-consistency` | error | `allergens` receptu odpovídá sjednocení alergenů složek |
| `min-age-consistency` | error | `minAgeMonths` receptu ≥ maximum ze složek, které jí i miminko (bez `adultOnly`) |
| `min-age-not-inflated` | error | vyšší věk, než složky dětské porce vyžadují, musí mít vysvětlení v `minAgeReason` |
| `adult-only-not-in-base` | error | `adultOnly` nestojí u složky ze společného základu (`track: 'all'`) |
| `adult-only-not-in-baby-steps` | error | složka označená `adultOnly` se neobjeví v `babySplitPoint`, `babySteps` ani `babyServing` |
| `mercury-limit` | warning | ryby s `hazards: ['rtut']` mají vyplněný `frequencyLimit` |
| `nitrate-note` | warning | suroviny s `hazards: ['dusicnany']` mají pokyn neohřívat opakovaně |
| `hazard-coverage` | error | surovina zakázaná do 12 měsíců podle `BEZPECNOST.md` kap. 2 nese odpovídající hazard — med `botulismus`, sůl a bujón `sul`, cukr a sirup `cukr`. Tabulka je v `src/safety/hazard-coverage.ts` |
| `hazard-notes-complete` | error | ke každému hazardu je v `hazardNotes` vysvětlení a žádné vysvětlení nevisí bez hazardu |
| `unique-ids` | error | žádné dvě suroviny ani dva recepty nesdílejí `id` — jinak je jedna z nich z adresy nedosažitelná |
| `duplicate-detection` | warning | žádné dvě suroviny se stejným `nameCz` nebo překrývajícím se `altNamesCz`; žádné dva recepty se stejným `titleCz` |
| `text-uniqueness` | warning | žádné dva popisy `serving` nejsou shodné na >85 % (odhalí generování šablonou) |
| `length-sanity` | warning | `serving` má 80–400 znaků; `chokingReason` není obecná fráze ze zakázaného seznamu („dbejte opatrnosti", „konzultujte s lékařem") |
| `meat-track-only-with-meat` | error | bezmasý recept nemá vlastní `vegetarianSteps` ani `vegetarianProteinSwap` — není co nahrazovat |
| `baby-serving-mentions-meat` | error | recept s masem nebo rybou je pojmenuje v každé fázi `babyServing`, ne jen v `babySteps` |
| `ingredient-coverage` | error | každá surovina katalogu je složkou aspoň jednoho receptu, nebo má důvod v `src/safety/coverage-exceptions.ts` |
| `recipe-ingredients-used` | error | každá složka receptu se objeví aspoň v jednom pokynu, ne jen v nákupním seznamu |
| `no-internal-references` | error | text pro rodiče neodkazuje na soubory v repozitáři ani na příkazy projektu |
| `no-stray-marks` | error | text neobsahuje osamocený modifikátor („osladˇ" místo „oslaď"), kombinující znaménko ani cyrilici zaměněnou za latinku |
| `neutral-address` | error | text neoslovuje rodiče jako ženu a u slova „dítě" drží střední rod |
| `consistent-address` | error | text rodiči tyká, vykání se mezi to nemíchá |
| `czech-typography` | error | české uvozovky, výpustka … a jednoduché mezery |
| `preposition-vocalization` | error | neslabičná předložka se před stejnou hláskou vokalizuje — „se šťávou", ne „s šťávou" |
| `known-typos` | error | tvary, které jednorázový audit proti českému slovníku označil za neexistující, se nevrací |

Validátor `scripts/validate-data.ts` projde všechna pravidla, vypíše **tabulku po kategoriích** a souhrn ve tvaru z `CLAUDE.md`, a skončí s exit kódem 1 při jakékoli chybě.

Že tahle tabulka odpovídá `src/safety/rules.ts`, hlídá test
`tests/safety/specTabulka.test.ts`. Dokumentace, která se rozejde s kódem,
přestává být měřítkem — a rozešla se, aniž si toho kdokoli všiml.

## 4. Obrazovky

Spodní navigace, 5 položek: **Domů · Suroviny · Recepty · Rady · Deník**.

Domácnost ve spodní liště **není** — chodí se do ní z úvodní obrazovky.
Je to nastavení, ne místo, kam rodič u sporáku chodí; lišta o pěti
položkách je na 320 px maximum, při kterém se ještě vejde slovo pod ikonu.

Nad hlavičkou stojí tlačítko „Přeskočit na obsah", viditelné až po
zaostření klávesnicí. Je to tlačítko, ne odkaz na fragment: aplikace jede
na HashRouteru, kde je hash adresa routy.

### 4.1 Suroviny
- Vyhledávání (bez diakritiky i s ní, hledá i v `altNamesCz`)
- Filtr kategorií jako vodorovně scrollovatelné čipy
- Rychlé filtry: Vše / Neochutnáno / Ochutnáno / Klíčové alergeny / Oblíbené / Vhodné teď (podle věku) / Sezónní
- Položka v seznamu: název, ikona kategorie, štítek fáze, štítek rizika, checkbox „ochutnáno"
- Checkbox jedním klepnutím založí `TastingEvent` s dnešním datem; detail reakce lze doplnit později
- Prázdný stav filtru není chybová hláška, ale nabídka: „Nic neodpovídá. Zkus zrušit filtr sezóny."

### 4.2 Detail suroviny
Pořadí odshora — bezpečnost první, protože kvůli ní se sem chodí:
1. Název + štítky (alergen, riziko dušení, hazardy)
2. **Bezpečnostní blok**: riziko dušení slovem, ikonou i barvou (nikdy jen barvou), konkrétní důvod, hazardy s vysvětlením
3. Přepínač fází 6m+ / 9m+ / 12m+ — předvybraný podle věku dcery — s pokynem ke krájení a servírování
4. Nápady na úpravu (3–4)
5. Recepty s touto surovinou — klikací
6. Historie ochutnávek + tlačítko „Zaznamenat ochutnávku"
7. Zdroje (rozbalovací), datum ověření, u `needs-review` výrazný štítek „Neověřeno — zkontroluj s pediatričkou" a tlačítko „Označit jako ověřené"

### 4.3 Recepty
Karty s názvem, časem, kategorií, štítky (bez lepku, do ruky, mrazitelné), indikací „vhodné od X měsíců".
Filtry: kategorie, čas do 20/40 minut, „mám doma" (výběr surovin), „jen vegetariánské", „bez alergenu X".

### 4.4 Detail receptu
- Suroviny se sloupcem, do které linie patří (společné / s masem / bez masa), každá klikací do katalogu
- **Společný postup** číslovaný
- Výrazně oddělený **moment odebrání porce pro miminko** — vizuálně nejsilnější prvek obrazovky, ne poznámka pod čarou
- Panel **Pro miminko** (s přepínačem fází) a pod ním **Dochucení pro dospělé**. Dochucení se dělí na **S masem** a **Bez masa** jen u receptu, který maso nebo rybu obsahuje; u bezmasého receptu je jedno.
- Poznámka rodiny k receptu (sdílená)

### 4.5 Deník
- Časová osa ochutnávek, seskupená po dnech
- Karta „Klíčové alergeny": 9 položek, u každé počet expozic a datum poslední; zavedený = 3+ expozice bez reakce
- Statistiky: ochutnáno X z Y surovin, rozpad po kategoriích, oblíbené, odmítnuté (s poznámkou, že odmítnutí je normální a opakovaná nabídka je běžná)
- „Co dnes zkusit?" — návrh 3 dosud neochutnaných surovin vhodných k věku a sezóně

### 4.6 30denní plán
Otevírá se z karty na úvodní obrazovce, počítá se pro vybrané dítě.
- Přehled bloku: postup (hotovo X z 30), karta dne, který je právě na řadě, a mřížka třiceti dnů po pěti, kde barva a ikona říkají hotovo / přeskočeno / čeká
- Karta dne: nová surovina se štítkem rizika dušení, jídla dne pod sebou a čtyři akce, tedy Hotovo, Na jindy, Jiné jídlo, Přeskočit
- Detail dne (`/plan/den/:cislo`): nová surovina s odkazem do katalogu, upozornění na plánovanou expozici alergenu a všechna jídla dne s odkazem na recept, časem, počtem porcí a dětskou porcí podle fáze
- Odškrtnutí otevře zápis ochutnávky do deníku; dá se odškrtnout i bez zápisu
- Po dokončení bloku nabídka sestavit dalších třicet dnů; kdykoli jde blok přepočítat znovu nebo plán zrušit
- Když se alergie dítěte změní až po sestavení, upozorní na to úvodní obrazovka, plán i detail dne a jídla se zakázaným alergenem dostanou štítek
- Pravidla, podle kterých se plán skládá, jsou v `docs/PLAN-30-DNI.md` a v radě „Jak je postavený 30denní plán"

### 4.7 Domácnost a nastavení
- Jméno a datum narození dcery
- **Párovací kód domácnosti** + QR kód ke skenování druhým telefonem
- Stav synchronizace: Připojeno / Jen na tomto zařízení / Offline (fronta N změn)
- Export/import dat do JSON
- Disclaimer a přehled zdrojů
- Počet položek k revizi s odkazem na seznam

## 5. Vizuální směr

Nepoužívej výchozí AI paletu (krémová #F4F1EA + terakota #D97757 + serif display) — je to dnes poznávací znamení generovaného webu. Tady jde o kuchyni a bezpečnost, ne o lifestyle brand.

Navrhovaná paleta (můžeš ji vylepšit, ne zploštit):

```
--paper:    #F8F8F5   podklad
--ink:      #16211D   text
--muted:    #67716D   sekundární text
--accent:   #1F6F5C   primární akce
--safe:     #2F7D4F   nízké riziko
--caution:  #9A6510   střední riziko
--risk:     #A32318   vysoké riziko
--surface:  #FFFFFF   karty
```

- Písmo: `Inter` na text (má plnou českou diakritiku), volitelně jeden výraznější řez na nadpisy. Self-hostuj přes `@fontsource`.
- **Riziko nikdy nesmí být sděleno jen barvou** — vždy barva + ikona + slovo. Daltonismus i kuchyňské světlo.
- Jeden výrazný prvek na obrazovku, zbytek tiše. Ne každá karta s vlastním stínem a gradientem.
- Animace jen jako odpověď na akci uživatele (rozbalení, potvrzení). Žádné fade-up při scrollu.

## 6. Mobilní kvalita — měřitelné požadavky

- Funguje od šířky **320 px** bez vodorovného scrollu
- Dotykové cíle ≥ 44×44 px
- Respektuje `env(safe-area-inset-bottom)` — spodní lišta se nesmí schovat pod gesto-bar
- Respektuje `prefers-reduced-motion`
- Viditelný focus ring pro klávesnici
- Kontrast textu ≥ 4.5:1
- Žádný text se neořezává; dlouhé názvy se zalamují, ne přetékají
- Testováno Playwrightem na 320×568, 375×667 a 414×896 — test selže při jakémkoli vodorovném přetečení nebo překryvu
- Tři šířky běží na Chromiu s dotykovou emulací (`isMobile`, `hasTouch`), čtvrtý projekt na WebKitu; iOS se chová jinak a PWA pro rodiče se na něm používá
- Při přetečení test jmenuje konkrétní prvek, ne jen šířku dokumentu

## 7. Synchronizace

### Lokální režim (výchozí)
Bez Firebase konfigurace aplikace plně funguje nad IndexedDB. Žádná funkce se neschovává, jen se nesynchronizuje. V UI o tom informuje jeden nevtíravý pruh v nastavení.

### Firebase režim
Konfigurace se **zapéká do buildu** (`src/storage/firebaseDefaults.ts` nebo
proměnné `VITE_FIREBASE_*`), nezadává se v aplikaci. Dřív se vyplňovala
v Nastavení, což znamenalo, že každý, komu se aplikace pošle, musel něco
opisovat z konzole — přesně to, co má sdílení odbourat. Hodnoty nejsou
tajemství, Firebase je posílá do prohlížeče každému; chrání to
`firestore.rules`, párovací kód a omezení klíče na doménu.

- **Anonymous Auth** — žádná hesla
- Dokument `households/{householdId}`, kde `householdId` je 10 znaků z abecedy Crockford Base32 (bez I, L, O, U — nepletou se při přepisování)
- Kód se zobrazuje po pěticích: `K7M2X-9QRT4`
- Druhý rodič ho zadá nebo naskenuje QR; jeho `uid` se přidá do `members` (max 5)
- Realtime přes `onSnapshot`, offline přes `persistentLocalCache` — změny se frontují a dosynchronizují
- Konflikty: `TastingEvent` je append-only (nikdy se nepřepisuje, jen přidává), ostatní pole last-write-wins podle vlastní značky času u každé hodnoty (`CasovanaHodnota`)
- Všechno, co přijde zvenčí — záloha, IndexedDB po starší verzi, Firestore — projde kontrolou tvaru v `src/sync/validace.ts`. Co neprojde, se zahodí a spočítá; nic se nedoplňuje náhradní hodnotou
- Dokument z **novější** verze schématu se nesloučí ani nepřepíše. Převod umí jen pole, která daná verze zná, takže by starší telefon novější dokument ořezal

### Firestore pravidla (nasadit, ne nechat v test mode)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /households/{householdId} {
      // čtení jen pro přihlášeného, který zná přesné ID (capability model)
      allow get: if request.auth != null;
      allow list: if false;                    // zákaz enumerace
      allow create: if request.auth != null
                    && request.resource.data.members == [request.auth.uid];
      allow update: if request.auth != null
                    && request.auth.uid in resource.data.members
                    && request.resource.data.members.size() <= 5;
      allow delete: if false;
    }
  }
}
```

Do `docs/FIREBASE.md` napiš přesný postup nasazení pravidel a omezení API klíče na HTTP referrer domény GitHub Pages.

## 8. PWA

`vite-plugin-pwa`: manifest s českým názvem, ikony 192/512 + maskable, `display: standalone`, offline cache celé aplikace i dat (data jsou statická, jdou cachovat natvrdo), aktualizace s nenápadnou výzvou „Je dostupná novější verze — obnovit".

### Opravy katalogu bez nasazení

Vedle balíku leží `public/opravy.json`: verzovaný soubor, kterým jde
opravit zdravotní údaj u konkrétní suroviny nebo receptu bez buildu
a deploye. Stahuje se až po vykreslení, bez sítě se použije poslední
uložená podoba a bez ní katalog z balíku — aplikace na opravách nikdy
nečeká.

Opravit jde jen vyjmenovaná textová pole a **každá opravená položka
projde týmiž pravidly z `src/safety/`** jako data v repozitáři; co
neprojde, se zahodí. Rodič u opravené položky vidí, že se text po vydání
změnil, a proč. Podrobnosti a postup jsou v `docs/OPRAVY.md`.

## 9. Akceptační kritéria

Aplikace je hotová, když platí **všechno**:

1. `npm run validate` skončí exit kódem 0, `CHYB: 0` a `VAROVÁNÍ: 0`
2. ≥190 surovin, každá se všemi třemi fázemi a ≥1 zdrojem tier 1
3. 0 surovin ve stavu `needs-review`, nebo je jejich seznam explicitně vypsaný a odsouhlasený
4. ≥80 receptů, z toho ≥40 čistě vegetariánských; každý recept s masem má vyplněný `vegetarianProteinSwap`
5. Každý recept má `babySplitPoint` a všechny tři fáze `babyServing`
6. `npm run test:e2e` prochází na všech třech viewportech, včetně testu na vodorovné přetečení
7. `npm run build` prochází, výstup se nasadí a `https://<nick>.github.io/BLW/` vrací 200 (repozitář se jmenuje `BLW`, viz `CLAUDE.md`, Nasazení)
8. Ruční průchod: založení domácnosti, spárování druhým zařízením, záznam ochutnávky na jednom zařízení se do 5 s objeví na druhém
9. Aplikace po vypnutí sítě dál funguje a zobrazuje data
10. Disclaimer je vidět při prvním spuštění
