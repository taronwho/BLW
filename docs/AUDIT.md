# Závěrečný audit aplikace BLW

**Datum:** 12. 9. 2026
**Větev:** `claude/epic-hawking-l1py1m`
**Stav dat:** 216 surovin, 160 receptů
**Rozsah:** kroky 1–5 zadání auditu — dostupnost zdrojů, náhodný vzorek proti
načteným zdrojům, statistiky kvality, spuštění příkazů, akceptační kritéria
z `docs/SPEC.md` kapitola 9.

Audit nic nepřepisoval proto, aby vyšel. Tři nálezy, které si vynutily zásah,
jsou vypsané v sekci [Provedené opravy](#provedené-opravy) a každý má vlastní
commit.

---

## Verdikt akceptačních kritérií

| # | Kritérium | Verdikt |
|---|-----------|---------|
| 1 | `npm run validate` = 0, `CHYB: 0`, `VAROVÁNÍ: 0` | **splněno** |
| 2 | ≥190 surovin, tři fáze, ≥1 zdroj tier 1 | **splněno** |
| 3 | 0 `needs-review`, nebo vypsaný a odsouhlasený seznam | **částečně** — seznam vypsaný, odsouhlasení je na rodičích |
| 4 | ≥80 receptů, ≥40 vegetariánských, `vegetarianProteinSwap` u masitých | **splněno** |
| 5 | `babySplitPoint` + tři fáze `babyServing` u každého receptu | **splněno** |
| 6 | `npm run test:e2e` na třech viewportech | **splněno** — po opravě zastaralého testu |
| 7 | `npm run build` projde, výstup nasazený, URL vrací 200 | **částečně** — build i 200 doloženy, nasazená verze je starší |
| 8 | Ruční průchod párováním dvou zařízení, propsání do 5 s | **neověřeno** — nelze v této session |
| 9 | Aplikace funguje po vypnutí sítě | **splněno** |
| 10 | Disclaimer při prvním spuštění | **splněno** |

Kritérium bez doloženého výstupu je v téhle tabulce vedené jako nesplněné,
ne jako splněné.

---

## Krok 1 — dostupnost zdrojů

Nový skript `scripts/check-sources.ts` (`npm run check:sources`) posbírá
unikátní URL z polí `sources` napříč surovinami i recepty, každé stáhne
(HEAD, při chybě nebo ne-2xx odpovědi GET, timeout 15 s, nejvýš 3 souběžné
požadavky) a vypíše tabulku URL / status / povolená doména / počet položek.
Politiku domén čte z `src/safety/domains.ts`, vlastní seznam si nedrží.

**Výsledek:**

```
UNIKÁTNÍCH URL: 27
MIMO 2xx: 0
NEPOVOLENÝCH DOMÉN: 0
```

Všech 27 URL odpovědělo `200` a všechna sedí na doméně tier 1. Nejpoužívanější
zdroje: NHS „Your baby's first solid foods" (120 položek), NHS „Preparing food
safely" (105), NHS „Foods to avoid" (104), NHS „The vegetarian diet" (76),
NHS „Food allergies" (73).

**Mezera skriptu:** kontroluje jen URL, na která se aspoň jedna položka
odkazuje. Tři konstanty v `src/data/ingredients/_sources.ts` nepoužívá žádná
položka, takže jimi skript neprochází: `CPS_WHO`, `SZU_BREASTFEEDING`,
`WHO_IYCF`. Ověřeny byly ručně (`curl -D -`), všechny tři vracejí `HTTP/2 200`.

---

## Krok 2 — náhodný vzorek proti načteným zdrojům

**Seed:** `BLW-audit-2026-09-12`, použitý přes
`shuf -n 15 --random-source=<(openssl enc -aes-256-ctr -pass pass:"$SEED" -nosalt </dev/zero)`.
Stejný seed dá stejný vzorek.

**15 surovin:** grana-padano, hlavkovy-salat, arasidove-maslo,
kukurice-cukrova, rybiz-cerny, testoviny-celozrnne, soja-edamame, tymian,
pazitka, cervena-repa, turin, batat, rybiz-cerveny, kmin-mlety, chleb-toustovy.

**10 receptů:** hovezi-zadni-porek-ryze-natural, kureci-stehno-korenova-zelenina,
makrela-cervena-repa, quinoova-kase-jablko-mandle, makrela-s-pecenym-lilkem,
rukolovy-salat-s-hruskou-a-ementalem, cerny-rybiz-a-angrest-na-kefiru,
polevka-z-ruzickove-kapusty, sunkovy-bramborovy-salat-teply,
kruti-karbanatky-bramborova-kase.

Jedenáct zdrojů, na které se vzorek odkazuje, bylo v téhle session znovu
staženo a přečteno (ne jen ověřeno na status). U dvanácti z patnácti surovin
tvrzení v textech přesně odpovídají tomu, co načtená stránka říká — například
u `chleb-toustovy` NHS doslova radí bílý chléb opékat, protože nerozžvýkaný
se v krku sbalí do těstovité kuličky; u `arasidove-maslo` NHS zakazuje podat
ořechové máslo samotné a připouští ho jen roztřené nebo vmíchané do jídla;
u `grana-padano` NHS nedoporučuje sýry z nepasterizovaného mléka a zároveň
říká, že v tepelně upraveném pokrmu je listerie zničená.

**Tři nálezy** jsou popsané níže v [Provedené opravy](#provedené-opravy)
(dva z nich) a v [Otevřené nálezy](#otevřené-nálezy) (jeden).

U všech deseti receptů je `babySplitPoint` vyplněný a formulovaný jako
okamžik v postupu („po kroku 3 odeber…, dřív než se dochucuje pro dospělé"),
`vegetarianSteps` jsou vyplněné u všech deseti a `vegetarianProteinSwap` je
u všech šesti receptů vzorku, které obsahují maso nebo rybu. U čtyř
bezmasých receptů vzorku chybí právem — datový model ho vyžaduje jen tam,
kde se maso nahrazuje.

---

## Krok 3 — statistiky kvality

Měří skript `scripts/audit-stats.ts` (`npm run audit:stats`).

**Recepty na surovinu.** Průměr 4,17, maximum 18. Rozdělení: 1 surovina s nulou,
102 s jedním až dvěma, 65 se třemi až pěti, 31 se šesti až deseti, 17 s jedenácti
až dvaceti. Strop 18 drží základní suroviny (brambor, ghí, máslo, oleje, vejce),
což odpovídá tomu, jak se doopravdy vaří. Jediná surovina bez receptu je
`detsky-caj-bez-cukru` a ta má výjimku v `coverage-exceptions.ts`.

**Délky `prep[*].serving`.** 648 vzorků, min 120, max 339, průměr 163,5,
medián 163, p10 147, p90 177. Rozdělení má jeden vrchol kolem 160–179 znaků
(359 vzorků) a 140–159 (232). Pravidlo `length-sanity` povoluje 80–400 znaků,
takže se data drží uvnitř s rezervou na obou koncích.

**Recepty se shodnými složkami.** Z 12 720 dvojic překračuje 60 % shody
`ingredientId` **jediná** dvojice: `cocka-na-kyselo-vejce` ×
`cockova-polevka-korenova` (67 %, 6 společných složek). Jsou to ale jiné pokrmy
— jeden je hlavní jídlo se sázeným vejcem, druhý polévka. Měřeno Jaccardem
(společné / sjednocení), aby krátký recept nevycházel jako podmnožina dlouhého.

**Nejdelší shodné textové úseky.** Napříč 4 884 textovými poli je nejdelší
shoda **102 znaků** — návod na vaření namočených bílých fazolí, sdílený dvěma
recepty. Dalších devět má 76–93 znaků a jde vesměs o kuchařskou techniku
(jáhly spařit vroucí vodou, polentu vařit v trojnásobku vody, nechat porci
vychladnout a zkusit ji na zápěstí). To je opakování postupu, ne šablona:
žádný úsek nepokrývá celé pole a nejdelší textové pole má 339 znaků.

Jediné, co se šabloně blíží, jsou tři `babySplitPoint` polévek, které sdílejí
78 znaků („Po kroku 4 odeber naběračku rozmixované polévky, dřív než se do
misek přidává "), a dva `babySplitPoint` masových polévek sdílející 93 znaků.
Není to chyba dat — věta popisuje tentýž okamžik v témž typu receptu — ale
je to místo, kde by při dalším růstu katalogu stálo za to formulace rozrůznit.

---

## Krok 4 — spuštěné příkazy

| Příkaz | Exit | Podstatné z výstupu |
|--------|------|---------------------|
| `npm run validate` | **0** | `SUROVIN: 216 (ověřeno: 213, k revizi: 3)`, `RECEPTŮ: 160 (vegetariánských: 117, s masitou i bezmasou variantou: 160)`, `CHYB: 0`, `VAROVÁNÍ: 0`, 109 unit testů prošlo |
| `npm run test:e2e` | **0** | 84 testů prošlo na viewportech 320×568, 375×667 a 414×896 |
| `npm run build` | **0** | 1745 modulů, PWA precache 31 položek (2198,80 KiB) |
| `npm run check:sources` | **0** | 27 URL, 0 mimo 2xx, 0 nepovolených domén |

**Velikost `dist`:** 2 268 kB, **28 souborů** (z toho `.nojekyll`, `sw.js`,
`manifest.webmanifest`, 4 ikony a 16 souborů fontu Inter). Největší kus je
`assets/index-*.js` — 1 635,57 kB, po gzipu 442,31 kB. Vite na to hlásí
varování o chunku nad 500 kB; build tím neselhává, ale je to místo na
code-splitting, až na něj přijde řada.

**`gh run list --limit 1`:** `gh` v tomhle prostředí není nainstalovaný.
Odpovídající dotaz přes GitHub API vrací poslední běh CI:

```
CI · run #15 · push · claude/peaceful-rubin-viivgz · e8c1f9e
"recepty: snacks_baking_2 — 20 svačin a pečení, pokrytí surovin kompletní"
status: completed   conclusion: success   2026-09-12T12:15:12Z
```

**`curl -sI` na nasazenou aplikaci:**

```
https://taronwho.github.io/BLW/        -> HTTP/2 200   (last-modified: Sat, 12 Sep 2026 06:12:39 GMT)
https://taronwho.github.io/blw-app/    -> HTTP/2 404
```

Adresa `/blw-app/` v `docs/SPEC.md` kapitole 9 je zastaralá. Platí
`CLAUDE.md`, sekce Nasazení: repozitář se jmenuje `BLW`, `vite.config.ts` má
`base: '/BLW/'` a aplikace běží na `https://taronwho.github.io/BLW/`.

---

## Krok 5 — akceptační kritéria s doklady

**1. `npm run validate` = 0, `CHYB: 0`, `VAROVÁNÍ: 0` — splněno.**
Doklad: běh příkazu skončil exit kódem 0; souhrn hlásí `CHYB: 0` a
`VAROVÁNÍ: 0` a tabulka po kategoriích má nuly ve sloupcích chyb i varování
u všech devíti kategorií surovin a čtyř kategorií receptů.

**2. ≥190 surovin, každá se třemi fázemi a ≥1 zdrojem tier 1 — splněno.**
Doklad: 216 surovin; přímá kontrola dat vrátila 0 surovin s prázdnou
kteroukoli ze tří fází `prep` a 0 surovin bez zdroje tier 1. Platí i
pravidla `stage-prep-complete` a `source-required` ve validátoru.

**3. 0 surovin `needs-review`, nebo vypsaný a odsouhlasený seznam — částečně.**
Doklad: `needs-review` mají tři suroviny, jejich úplný seznam s důvody je
[níže](#položky-needs-review). Výpis tím hotový je; odsouhlasení je
rozhodnutí rodičů, ne auditu, a všechny tři poznámky končí odkazem na
pediatričku. Dokud seznam někdo neodsouhlasí, kritérium je nesplněné.

**4. ≥80 receptů, ≥40 vegetariánských, `vegetarianProteinSwap` u masitých — splněno.**
Doklad: 160 receptů; 117 čistě vegetariánských (bez jediné složky z kategorie
`maso-ryby`); 43 receptů s masem nebo rybou a z nich 0 bez vyplněného
`vegetarianProteinSwap`.

**5. `babySplitPoint` a tři fáze `babyServing` u každého receptu — splněno.**
Doklad: přímá kontrola dat vrátila 0 receptů s prázdným `babySplitPoint`
a 0 receptů s neúplným `babyServing`. Navíc 0 receptů bez `vegetarianSteps`.

**6. `npm run test:e2e` na třech viewportech — splněno po opravě.**
Doklad: 84 testů prošlo, exit 0. Sada obsahuje test na vodorovné přetečení
pro všech šest obrazovek na každém ze tří viewportů. Před opravou padaly
tři testy kvůli zastaralé hodnotě v testu, ne kvůli datům — viz
[Provedené opravy](#provedené-opravy).

**7. Build projde, výstup je nasazený, URL vrací 200 — částečně.**
Doklad: `npm run build` skončil nulou; `https://taronwho.github.io/BLW/`
vrací `HTTP/2 200`. **Nasazená verze ale není tahle.** Živá stránka servíruje
`assets/index-DDc7SN0X.js`, zatímco tenhle build vyrábí
`assets/index-C4fL3UXb.js`. Poslední běh workflow „Deploy na GitHub Pages"
je run #2 z `main` @ `3ecdaad` (12. 9. 2026 06:11 UTC), tedy před dávkami
receptů. Nasazená aplikace proto ukazuje starší katalog. Kritérium bude
splněné až po sloučení do `main` a proběhnutí deploye.

**8. Ruční průchod párováním dvou zařízení — neověřeno.**
Viz [Co audit nemohl ověřit](#co-audit-nemohl-ověřit).

**9. Aplikace funguje po vypnutí sítě — splněno.**
Doklad: měřicí běh Playwrightu na viewportu 375×667 potvrdil aktivní service
worker, poté vypnul síť (`context.setOffline(true)`) a znovu načetl stránku.
Offline se vykreslil seznam se **216 položkami** a obrazovka receptů hlásila
**„160 z 160 receptů"**. Měřicí soubor byl po doložení smazaný, do repozitáře
nepatří.

**10. Disclaimer při prvním spuštění — splněno.**
Doklad: e2e test `vstup do aplikace › disclaimer se ukáže při prvním spuštění
a dá se potvrdit` prošel na všech třech viewportech; ověřuje, že je disclaimer
po startu viditelný a po potvrzení skrytý.

---

## Provedené opravy

Každá je opravou konkrétní chyby nalezené auditem, ne úpravou dat kvůli tomu,
aby audit vyšel.

### 1. `cervena-repa` — tvrzení o dusičnanech stálo na zdroji, který řepu nezmiňuje

Hazard `dusicnany` se opíral jen o stanovisko EFSA k dusičnanům v **listové**
zelenině. Načtená stránka hodnotí špenát a hlávkový salát; červenou řepu
nejmenuje a mluví o jiné skupině zeleniny.

Doplněn zdroj `BP_BEETROOT` — heslo Společnosti pro výživu na portálu
Bezpečnost potravin, načtené 12. 9. 2026, které přímo uvádí vysoký obsah
dusičnanů v červené řepě, jejich přeměnu až na nitrosaminy a uzavírá
doporučením „všeho s mírou". Text tvrzení se neměnil, mění se jeho doložení.

### 2. `testoviny-celozrnne` — caution ve fázi 6m nevyplýval z žádného citovaného zdroje

Věta „Velký podíl vlákniny zasytí dřív, než dítě přijme dost energie."
nevyplývala ani z článku o zavádění lepku, ani z doporučení WHO. WHO
celozrnné obiloviny naopak upřednostňuje („when cereal grains are used, whole
cereal grains should be prioritized").

Doplněn `NHS_YOUNG_CHILDREN`, který přesně tohle o dětech do dvou let říká.
Text tvrzení se neměnil.

### 3. `tests/e2e/ui.spec.ts` — zastaralý natvrdo psaný počet receptů

Test `filtry receptů` očekával „80 z 80 receptů" — hodnotu z commitu
`9d34ea9`, kdy katalog 80 receptů měl. Po dávkách receptů jich je 160, takže
tři e2e testy padaly. Selhání nevzniklo v tomhle auditu a nesouviselo s daty.

Očekávaná hodnota se nově dopočítá z `recipes.length`. Tvrzení testu zůstává
totožné — nefiltrovaný seznam ukazuje všechny recepty, po filtru je jich míň —
jen nezastará při další dávce. Změna proběhla po výslovném odsouhlasení.

### 4. Mrtvá výjimka `voda` v `coverage-exceptions.ts`

Výjimka tvrdila, že voda „není složkou, kterou by recept odměřoval jako
surovinu". Osm receptů ji ale odměřuje jako běžnou složku, takže se výjimka
nikdy neuplatnila a jen vyjímala surovinu z kontroly. Odebrána. Pravidlo
`ingredient-coverage` teď vodu skutečně kontroluje a ta projde. Výjimka ubyla,
žádná nepřibyla — pravidlo se tím zpřísnilo, ne zeslabilo.

---

## Otevřené nálezy

### `fenykl-hliza` — hazard `dusicnany` bez doloženého měření

Hazard u fenyklové hlízy nemá oporu v žádném načteném zdroji. Stanovisko EFSA
se týká špenátu a hlávkového salátu; český článek o dusičnanech v zelenině
navíc říká, že „nejvyšší koncentrace dusičnanů se nacházejí v listech,
nejnižší v semenech nebo hlízách", což hlízu spíš vylučuje.

**Nález ale nevyžaduje zásah:** položka už `needs-review` je a její
`reviewNote` tenhle rozpor přesně popisuje včetně toho, že hazard je nastavený
na stranu opatrnosti podle `docs/BEZPECNOST.md` kap. 3. Data jsou v tomhle
poctivější než citace, na které se odkazují.

### E2E sada neběží v CI

`.github/workflows/ci.yml` ani `deploy.yml` nespouštějí `npm run test:e2e` —
obě dělají jen `npm run validate` a `npm run build`. Proto zastaralý test
z nálezu 3 vydržel nepovšimnutý napříč čtrnácti zelenými běhy CI. Audit to
needitoval, protože jde o změnu nasazení mimo jeho rozsah; doporučení je
přidat e2e krok do `ci.yml`.

### Velikost hlavního JS chunku

`assets/index-*.js` má 1 635,57 kB (gzip 442,31 kB) a Vite na to hlásí
varování. Pro PWA, která má fungovat offline, je to únosné — stáhne se jednou —
ale code-splitting katalogu by první načtení znatelně zrychlil.

---

## Položky `needs-review`

Úplný seznam. Všechny tři jsou suroviny; žádný recept `needs-review` není.

### `kakao-100` — kakao 100 %

Nedoložený je věk zavedení a jakýkoli limit theobrominu pro kojence. Načtená
stránka EFSA ke kofeinu doložila, že kakaové boby jsou přirozeným zdrojem
kofeinu, že u dětí 3–10 let je čokoláda včetně kakaových nápojů nejčastějším
zdrojem kofeinu a že bezpečná úroveň pro děti a dospívající je 3 mg/kg tělesné
hmotnosti a den — nejmladší sledovanou skupinou jsou ale batolata 12–36 měsíců
a theobromin stránka neřeší vůbec. `minAgeMonths: 12` je proto opatrný odhad
odvozený od pravidla o přidaném cukru, ne převzaté doporučení.
**Otevřená otázka pro pediatričku:** termín zavedení.

### `karob` — karob

Tvrzení, že karob neobsahuje theobromin ani kofein, se nepodařilo doložit ani
po druhém kole přímého načtení povolených zdrojů. Stránka EFSA ke kofeinu
jmenuje kávu, kakaové boby, čajové listy, guaranu a kolu; z toho, že karob
v jejím výčtu není, se ale nedá udělat tvrzení o jeho složení. Texty položky
proto tvrdí jen to, co doložit umíme — že se karob nemusí doslazovat.
**Otevřená otázka:** srovnání karobu s kakaem co do povzbuzujících látek.

### `fenykl-hliza` — fenykl hlíza

Dvojí otevřená věc. Stránka EMA říká, že přípravky ze sladkého fenyklového
plodu se používají od 4 let a mladším dětem se nedoporučují, protože o
bezpečném užívání v této skupině není dost údajů — týká se to plodu, tedy
i fenyklového čaje, ne zeleninové hlízy. A hazard `dusicnany` nemá oporu
v načteném zdroji (viz [Otevřené nálezy](#otevřené-nálezy)).
**Otevřená otázka pro pediatričku:** pravidelné zařazení fenyklu.

---

## Výjimky v `coverage-exceptions.ts`

Po opravě 4 obsahuje seznam **jedinou** položku.

| id | Důvod |
|----|-------|
| `detsky-caj-bez-cukru` | Nápoj podávaný samostatně k jídlu, ne složka pokrmu. |

Ověřeno, že výjimka je oprávněná: `detsky-caj-bez-cukru` se skutečně
nevyskytuje v žádném z 160 receptů. Odebraná výjimka `voda` oprávněná nebyla —
osm receptů vodu odměřuje jako složku.

---

## Co audit nemohl ověřit

**Kritérium 8 — párování dvou zařízení a propsání záznamu do 5 s.**
Vyžaduje dvě fyzická zařízení, běžící projekt ve Firebase a přihlášení.
V téhle session není `.env.local` ani přístup k Firebase konzoli a druhé
zařízení neexistuje. Nepřímo doloženo je jen to, že logika kolem toho má
unit testy: `tests/sync/merge.test.ts` (11 testů) a
`tests/sync/householdCode.test.ts` (7 testů) prošly. Samotné propsání mezi
zařízeními a jeho latence ověřené **nejsou** a kritérium proto zůstává
nesplněné, dokud ho někdo neprojde ručně.

**Obsah PDF a obrázkových dokumentů nad rámec vzorku.** Brožura SZÚ „Moje
první lžička" nemá textovou vrstvu. Audit ověřil, že URL vrací 200, ne že
každé ze 14 tvrzení, která se o ni opírají, v ní doslova stojí.

**Pravdivost zdravotních tvrzení mimo náhodný vzorek.** Krok 2 prošel 15 z 216
surovin a 10 ze 160 receptů, tedy asi 7 % katalogu, a našel v nich dvě chybná
doložení. Ze vzorku téhle velikosti nelze usoudit, že ve zbytku katalogu už
žádné nejsou — spíš naopak: dvě chyby na patnáct položek naznačují, že
podobná doložení stojí za dokončení u celého katalogu.

**Aktuálnost nasazené aplikace vůči této větvi.** Ověřeno je, že se živá
a lokální verze liší (různý hash bundlu) a proč. Co přesně nasazená verze
obsahuje, audit nerozebíral.

**Skutečné chování na fyzickém mobilu.** E2E běží v Chromiu na mobilních
rozměrech okna, ne na skutečném telefonu s dotykem, pomalou sítí a systémovou
klávesnicí.

---

## Jak audit zopakovat

```bash
npm run validate       # typecheck + lint + unit testy + validace dat
npm run check:sources  # dostupnost všech URL ze sources
npm run audit:stats    # statistiky kvality z kroku 3
npm run test:e2e       # mobilní viewporty
npm run build          # produkční build
```
