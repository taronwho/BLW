# GOALS.md — fáze a podmínky pro `/goal`

## Jak to funguje a proč takhle

`/goal` nastaví **podmínku dokončení**, ne zadání. Po každém tahu ji vyhodnotí samostatný malý model, který nespouští příkazy ani nečte soubory — posuzuje výhradně to, co je vypsané v konverzaci. Z toho plynou tři věci:

1. Podmínka musí být **měřitelná a doložitelná výpisem**. Proto v každé fázi končí požadavkem, aby byl v konverzaci celý výstup `npm run validate`.
2. Podmínka musí být **krátká**. Specifikace patří do `docs/`, ne do `/goal`. Limit je 4 000 znaků.
3. Cíl měří jen to, co v něm je. Co v podmínce není, na to se agent vykašle. Proto jsou v podmínkách i **omezení, co se nesmí změnit** — jinak se testy „opraví" místo dat.

**Jedna fáze = jedna session.** Po dokončení `/clear`, pak další fáze. Fáze 2 a 3 běž ještě po částech (podcíle níže), jinak přeteče kontext a goal se zruší.

Před spuštěním zapni auto mód — `/goal` sám permission mód nemění.

---

## Fáze 0 — kostra a nasazení (dělej první, ne poslední)

Nejdřív zadej normální prompt:

> Založ Vite + React + TypeScript projekt podle `CLAUDE.md`, přidej Tailwind, ESLint, Vitest, Playwright, skripty `validate`, `validate:data`, `test:e2e`, prázdnou datovou vrstvu s typy podle `docs/SPEC.md` a kostru validátoru `scripts/validate-data.ts`. Přidej `.github/workflows/deploy.yml` pro GitHub Pages, `base: '/BLW/'`, `public/.nojekyll`, HashRouter. Aplikace zatím zobrazí jen název a disclaimer.

Pak:

```
/goal Projekt je nasazený: `npm run validate` i `npm run build` skončí exit kódem 0 a jejich úplný výstup je vypsaný v konverzaci, existuje .github/workflows/deploy.yml, poslední push do main proběhl a výpis `gh run list --limit 1` v konverzaci ukazuje úspěšný workflow. Zároveň v konverzaci vypiš obsah vite.config.ts. Nesmíš přidat žádnou runtime závislost mimo ty uvedené v CLAUDE.md. Pokud se do 15 tahů nepodaří nasazení, vypiš přesnou chybu z workflow a skonči.
```

---

## Fáze 1 — bezpečnostní vrstva

```
/goal Bezpečnostní vrstva je hotová: src/safety/rules.ts obsahuje všechna pravidla z tabulky v docs/SPEC.md kapitola 3, v tests/safety/ je pro každé pravidlo alespoň jeden pozitivní a jeden negativní test, `npx vitest run tests/safety` skončí exit kódem 0 a jeho úplný výstup je v konverzaci, a v konverzaci je vypsaná tabulka: id pravidla | severity | název testu, která pokrývá všechna pravidla bez výjimky. Ověř navíc funkčnost tím, že do dočasného fixture vložíš surovinu s medem pro 6 měsíců a recept bez bezmasé varianty a ukážeš v konverzaci, že validátor obojí zachytí; fixture pak smaž. Nesmíš měnit docs/ ani vytvářet skutečná data surovin.
```

---

## Fáze 2 — katalog surovin

Běž **po kategoriích**, každou kategorii jako vlastní goal. Vzor pro jednu:

```
/goal Kategorie "zelenina" je hotová: src/data/ingredients/vegetables.ts obsahuje všech 40 položek ze seznamu v docs/SUROVINY-SEZNAM.md, každá má vyplněné všechny tři fáze prep (6m, 9m, 12m) o délce 80–400 znaků, neprázdné prepIdeas (3–4), seasonCz, hazards podle docs/BEZPECNOST.md a alespoň jeden SourceRef s tier 1, jehož URL jsi skutečně načetl v této session. `npm run validate` skončí exit kódem 0 a jeho úplný výstup včetně řádků SUROVIN a CHYB je vypsaný v konverzaci. V konverzaci vypiš tabulku: název suroviny | chokingRisk | hazards | doména zdroje — pro všech 40 položek. Nesmíš měnit src/safety/, tests/ ani docs/. Položku, jejíž informaci nedohledáš, označ reviewStatus needs-review a vyjmenuj ji na konci; nevymýšlej zdroje.
```

Pak stejné pro `fruits` (36), `grains` (24), `meat_fish` (26), `legumes` (16), `dairy_eggs` (20), `nuts_seeds_oils` (20), `herbs_spices` (18), `other` (10). Vždy `/clear` mezi kategoriemi.

Počty v závorkách jsou minima ze `SUROVINY-SEZNAM.md`, ne stropy — katalog
je od té doby větší.

Uzavírací goal fáze 2:

```
/goal Katalog surovin je kompletní: `npm run validate:data` vypíše SUROVIN ≥ 190, CHYB: 0, a jeho úplný výstup je v konverzaci. V konverzaci je dále vypsaný seznam všech položek se stavem needs-review i s důvodem, a výsledek kontroly, že žádné dvě suroviny nemají shodný nameCz. Nesmíš měnit src/safety/ ani testy. Neoznačuj položku jako verified jen proto, aby prošla validace.
```

---

## Fáze 3 — recepty

Po kategoriích, vzor. **Pozor:** podmínka „alespoň 4 kroky v `baseSteps`"
z prvního znění tady záměrně není. Kuchařka mezitím pojala i jednoduché
úpravy o jedné složce („mám doma pastinák, co s ním"), kterým čtyři kroky
udělat nejde, aniž by se vymýšlela vata. Kolik jich je, měří
`jeJednoduchaUprava` v `src/data/jednoduche.ts`.

```
/goal Kategorie receptů "obed-vecere" je hotová: src/data/recipes/lunches_dinners.ts obsahuje 30 receptů podle typu Recipe z docs/SPEC.md, každý má neprázdný babySplitPoint odkazující na konkrétní krok z baseSteps, všechny tři fáze babyServing, neprázdné `adultSteps` (dříve `meatSteps`) i vegetarianSteps, a každý recept obsahující surovinu z kategorie maso-ryby má vyplněný vegetarianProteinSwap, který nahrazuje bílkovinu (ne pouhé vynechání). Všechny ingredientId existují v katalogu. `npm run validate` skončí exit kódem 0 a jeho úplný výstup je v konverzaci. V konverzaci vypiš tabulku: název receptu | vegetarián ano/ne | náhrada bílkoviny | minAgeMonths. Nesmíš měnit src/safety/, tests/ ani data surovin.
```

Pak `breakfast` (20), `soups` (10), `snacks_baking` (14). Uzavírací:

```
/goal Kuchařka je kompletní: `npm run validate:data` vypíše RECEPTŮ ≥ 80, z toho vegetariánských ≥ 40, CHYB: 0, VAROVÁNÍ: 0, a úplný výstup je v konverzaci. V konverzaci je vypsaná kontrola, že žádné dva recepty nemají shodný název. Nesmíš měnit src/safety/ ani testy.
```

---

## Fáze 4 — uživatelské rozhraní

```
/goal UI je hotové: implementovány jsou všechny obrazovky z docs/SPEC.md kapitola 4 (Suroviny, Detail suroviny, Recepty, Detail receptu, Deník, Domácnost) včetně filtrů, vyhledávání bez diakritiky, přepínače fází a klikacích vazeb surovina↔recept. V tests/e2e/ jsou Playwright testy pro viewporty 320x568, 375x667 a 414x896, které ověřují: žádné vodorovné přetečení (document.scrollWidth <= viewport.width na každé obrazovce), všechny dotykové cíle ≥44px, funkční proklik ze suroviny na recept a zpět, a funkční zaškrtnutí ochutnáno. `npm run test:e2e` i `npm run validate` skončí exit kódem 0 a jejich úplný výstup je v konverzaci. V konverzaci vypiš seznam pořízených screenshotů a u každé obrazovky větu, co je na ní vidět. Nesmíš měnit data ani src/safety/. Riziko dušení musí být na každé obrazovce sděleno barvou i ikonou i slovem; v konverzaci to dolož výpisem příslušného JSX.
```

---

## Fáze 5 — synchronizace a PWA

```
/goal Synchronizace a PWA fungují: existuje úložná vrstva s lokálním režimem (IndexedDB) i Firebase režimem podle docs/SPEC.md kapitola 7, soubor firestore.rules odpovídá pravidlům ze specifikace, v docs/FIREBASE.md je postup nasazení, párovací kód má 10 znaků Crockford Base32 a zobrazuje se po pěticích včetně QR. V tests/ je unit test, že se TastingEvent slučují append-only a že kolize dvou zařízení neztratí záznam; `npm run validate` skončí exit kódem 0 s úplným výstupem v konverzaci. PWA manifest a service worker jsou nakonfigurované, `npm run build` prochází a v konverzaci je vypsaný obsah dist/manifest.webmanifest. Nesmíš vkládat žádné Firebase klíče do repozitáře ani do commitu.
```

---

## Fáze 6 — uzavření

```
/goal Aplikace splňuje všech 10 akceptačních kritérií z docs/SPEC.md kapitola 9. Pro každé z nich je v konverzaci uvedeno číslo kritéria, doklad (výstup příkazu nebo výpis souboru) a verdikt splněno/nesplněno. `npm run validate`, `npm run test:e2e` i `npm run build` končí exit kódem 0 s úplným výstupem v konverzaci, poslední GitHub Actions běh je úspěšný a `curl -sI https://<nick>.github.io/BLW/` vrací 200. Nesmíš žádné kritérium prohlásit za splněné bez doloženého výstupu; nesplněná kritéria vypiš jako seznam zbývající práce a skonči.
```

---

## Když se goal chová divně

| Příznak | Příčina | Co s tím |
|---|---|---|
| Goal se zrušil sám s hláškou o chybě | Přetečení kontextu, vyčerpaný kredit, nedostupný model nebo problém s přihlášením | Odstraň příčinu a nastav goal znovu; u kontextu rozděl fázi na menší podcíle |
| Claude se točí, ale nic nedělá | Odpovídá evaluátoru bez použití nástrojů | Claude Code smyčku sám zastaví a vrátí řízení; napiš konkrétní další krok |
| Evaluátor uzná fázi za hotovou, ale hotová není | Podmínka měřila něco jiného, než jsi chtěl | Uprav podmínku tak, aby vyžadovala výpis, který nejde nahradit tvrzením |
| Goal čeká a nic se neděje | Běží subagent nebo příkaz na pozadí, vyhodnocení se odkládá | Počkej na check-in, nebo běžící úlohu ukonči |
