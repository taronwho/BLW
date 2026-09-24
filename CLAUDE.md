# CLAUDE.md — pravidla projektu Drobek

Tento soubor čti vždy. Plná specifikace je v `docs/SPEC.md`, zdravotní pravidla v `docs/BEZPECNOST.md`, seznam surovin v `docs/SUROVINY-SEZNAM.md`, fáze a cíle v `docs/GOALS.md`, opravy katalogu bez nasazení v `docs/OPRAVY.md`.

## Co stavíme

Aplikace se jmenuje **Drobek**. Repozitář zůstává `BLW`, takže adresa je
`https://taronwho.github.io/BLW/` — „BLW" v cestě i v textech je zkratka metody
(baby-led weaning), ne název aplikace. Nepřejmenovávej ho.

Česká webová aplikace pro Baby-Led Weaning. Používají ji dva rodiče na mobilech, sdílejí jeden účet domácnosti přes párovací kód. Obsahuje katalog ≥190 surovin dostupných v ČR s bezpečnostními a přípravnými informacemi ke třem věkovým fázím (6m+, 9m+, 12m+), ≥80 receptů se společným základem, odběrem dětské porce a dochucením pro dospělé (u receptů s masem navíc v masité i bezmasé variantě), deník ochutnávek a 30denní plán celých dnů. Běží na GitHub Pages jako
statická PWA.

**Rodina:** matka je vegetariánka, otec a dcera jedí i maso. Každý recept musí být pro celou rodinu použitelný v jednom vaření.

## Absolutní pravidla — porušení je chyba, ne kompromis

1. **Nevymýšlej si zdravotní informace.** Každé bezpečnostní tvrzení u suroviny musí mít v poli `sources` alespoň jeden ověřený odkaz. Když ho nedohledáš, nastav `reviewStatus: "needs-review"` a napiš do `reviewNote` čeho se pochybnost týká. Nikdy nevyplňuj URL z paměti — ověř ho reálně a ulož datum ověření.
2. **Nikdy nevymýšlej citaci ani neuváděj zdroj, který jsi nenačetl.** Vymyšlený odkaz je horší než chybějící.
3. **Necopy-pastuj cizí texty.** Formuluj vlastními slovy. Solid Starts a NHS mají chráněný obsah.
4. Instrukce pro miminko do 12 měsíců **nikdy** neobsahují: med, přidanou sůl, přidaný cukr, celé ořechy, celá zrna hroznů / borůvek / cherry rajčat, syrové nebo tekuté vejce, nepasterizované mléčné výrobky, rýžové nápoje, kravské mléko jako nápoj.
5. Bezpečnostní pravidla z `docs/BEZPECNOST.md` jsou implementovaná jako **spustitelné testy** v `src/safety/` a `tests/safety/`. Tyto soubory se nesmí oslabovat, aby prošla data. Když test spadne, oprav data, ne test.
6. Aplikace **nedává lékařská doporučení**, nediagnostikuje alergie a nenahrazuje pediatra. Disclaimer je viditelný při prvním spuštění i v nastavení.
7. V datech ani v UI **nezůstávají zástupné texty**: žádné `TODO`, `lorem`, `...`, `doplnit`, prázdný string. Validátor to kontroluje.

## Technický stack — neměň bez ptaní

- Vite 5 + React 18 + TypeScript (`strict: true`, zákaz `any` a `@ts-ignore`)
- Tailwind CSS + `lucide-react`
- Routing: **HashRouter** (GitHub Pages neumí SPA fallback na podadresářích)
- Stav: Zustand nebo React Context — ne Redux
- Data: Firebase JS SDK (Firestore + Anonymous Auth) s plnohodnotným lokálním režimem bez Firebase
- Testy: Vitest (unit + validace dat), Playwright (mobilní UI)
- Fonty self-hostované přes `@fontsource` — žádné volání na Google Fonts (kvůli offline PWA a soukromí)
- Žádná další runtime závislost bez zdůvodnění v commit message

## Pracovní postup

- **Pracuj po dávkách 10–15 položek.** Po každé dávce spusť `npm run validate` a commitni. Nikdy negeneruj 50 surovin najednou — kvalita popisů spadne a přeteče kontext.
- **Po každé změně:** `npm run validate` (typecheck + lint + unit testy + validace dat). Commit jen když je zeleně.
- **Commit message česky**, formát `fáze/oblast: co se změnilo`.
- Když si nejsi jistý zdravotní informací, **raději ji neuveď** a označ položku k revizi.
- Ke každé fázi z `docs/GOALS.md` na konci **vypiš plný výstup `npm run validate` do konverzace.** Evaluátor `/goal` nespouští příkazy — vidí jen to, co napíšeš. Bez vypsaného výstupu nemůže fázi uzavřít.
- Nepiš do konverzace shrnutí typu „vše hotovo a funguje" bez doloženého výstupu příkazu. To je nejhorší selhání v tomhle projektu.
- **Hotové změny vždy rovnou nasaď** (rozhodnutí vlastníka 24. 9. 2026): po zelené validaci je sluč do `main` a pushni — push do `main` spustí deploy. Neptej se předem. Když se mění `firestore.rules`, řekni to výslovně: pravidla se z repozitáře nenasazují, vlastník je musí publikovat v konzoli Firebase.

## Příkazy

```bash
npm run dev          # vývoj
npm run validate     # typecheck + lint + vitest run + validace dat  ← po každé dávce
npm run validate:data # jen kontrola datové vrstvy, vypíše souhrnnou tabulku
npm run test:e2e     # Playwright, mobilní viewporty
npm run build        # produkční build
```

`npm run validate:data` musí vždy vypsat souhrn ve tvaru:

```
SUROVIN: 301  (ověřeno: 301, k revizi: 0)
RECEPTŮ: 494   (vegetariánských: 370, se dvěma variantami dochucení: 124)
RAD: 16     (naléhavých: 2)
SEZNAMŮ: 8   (položek: 75)
CHYB: 0
VAROVÁNÍ: 0
```

Čísla se mění, tvar ne. „Vegetariánských" znamená receptů, které sní
vegetarián — tedy i bez parmazánu se živočišným syřidlem, ne jen bez masa.
Obě čísla v závorce jsou disjunktní množiny, takže se dají sečíst.

## Nasazení

- `vite.config.ts`: `base: '/BLW/'` — repozitář se jmenuje `BLW`, takže Pages běží na `https://<nick>.github.io/BLW/`. Při přejmenování repozitáře uprav i tuhle hodnotu.
- `public/.nojekyll`
- `.github/workflows/deploy.yml` — build + deploy přes `actions/deploy-pages`, spouští se na push do `main`, **po** úspěšném `npm run validate`
- Deploy nikdy neproběhne, když validace selže

## Co je mimo rozsah verze 1

Fotky jídel, sdílení mimo domácnost, růstové grafy, počítání živin, notifikace. Nenavrhuj je a nestav je.

**Nákupní seznam** do rozsahu patří (rozhodnuto září 2026). Plní se z receptů,
z jednotlivých surovin a z třicetidenního plánu; množství téže suroviny se
sčítají a odškrtnuté položky zůstávají v seznamu jako koupené. Pravidla pro
sčítání jsou spustitelné testy v `tests/nakup/` a platí pro ně totéž co pro
`tests/safety/`: když test spadne, opravuje se počítání, ne test.

**30denní plán** do rozsahu patří (rozhodnuto září 2026). Je to plán celých
dnů s recepty na snídani, oběd a večeři, který po doběhnutí pokračuje dalším
blokem. Logika, zdroje a pravidla jsou v `docs/PLAN-30-DNI.md`; pravidla
generátoru jsou spustitelné testy v `tests/plan/` a platí pro ně totéž co pro
`tests/safety/`: když test spadne, opravuje se generátor, ne test.
