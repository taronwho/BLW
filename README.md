# BLW — příkrmy pro celou rodinu

Česká webová aplikace pro Baby-Led Weaning: katalog surovin s bezpečnostními
a přípravnými informacemi ke třem věkovým fázím, recepty vždy ve třech liniích
(miminko / masitá / bezmasá) a deník ochutnávek. Statická PWA na GitHub Pages.

**Aplikace nedává lékařská doporučení a nenahrazuje pediatra.**

## Dokumentace

| Soubor | Co v něm je |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | Pravidla projektu — čte se při každém spuštění Claude Code |
| [`docs/SPEC.md`](docs/SPEC.md) | Funkční specifikace, datový model, obrazovky |
| [`docs/BEZPECNOST.md`](docs/BEZPECNOST.md) | Zdravotní pravidla a politika zdrojů |
| [`docs/SUROVINY-SEZNAM.md`](docs/SUROVINY-SEZNAM.md) | Závazný seznam položek katalogu |
| [`docs/GOALS.md`](docs/GOALS.md) | Fáze stavby a podmínky pro `/goal` |
| [`docs/JAK-NA-TO.md`](docs/JAK-NA-TO.md) | Ruční kroky (GitHub Pages, Firebase) a postup pouštění fází |
| [`docs/FIREBASE.md`](docs/FIREBASE.md) | Nasazení Firestore pravidel a omezení API klíče |

## Příkazy

```bash
npm install
npm run dev            # vývoj
npm run validate       # typecheck + lint + vitest + validace dat
npm run validate:data  # jen datová vrstva, vypíše souhrnnou tabulku
npm run test:e2e       # Playwright na viewportech 320 / 375 / 414 px
npm run build          # produkční build
```

Pokud `npm run test:e2e` hlásí, že chybí binárka prohlížeče, spusť
`npx playwright install chromium`. Na stroji s předinstalovaným Chromiem jiné
verze nastav `PLAYWRIGHT_CHROMIUM_EXECUTABLE` na cestu k binárce.

## Stav stavby

- [x] **Fáze 0** — kostra projektu, validátor, CI/CD na GitHub Pages
- [x] **Fáze 1** — bezpečnostní vrstva `src/safety/` se spustitelnými testy
- [ ] **Fáze 2** — katalog surovin (≥190 položek)
- [ ] **Fáze 3** — recepty (≥80, z toho ≥40 vegetariánských)
- [ ] **Fáze 4** — uživatelské rozhraní
- [x] **Fáze 5** — synchronizace a PWA (mimo pořadí: fáze 2 čeká na síť)
- [ ] **Fáze 6** — uzavření podle akceptačních kritérií

## Nasazení

Push do `main` spustí workflow `.github/workflows/deploy.yml`: `npm run validate`,
`npm run build` a teprve pak deploy na Pages. **Když validace selže, nenasadí se nic.**

Jednorázově je potřeba v repozitáři zapnout Settings → Pages → Source: **GitHub Actions**.

## Synchronizace

Výchozí je **lokální režim** nad IndexedDB — aplikace funguje celá, jen se
nesynchronizuje. Firebase režim (Anonymous Auth + Firestore) se zapíná vložením
konfigurace v Nastavení; do repozitáře se žádné klíče nedávají. Postup je
v [`docs/FIREBASE.md`](docs/FIREBASE.md), pravidla v [`firestore.rules`](firestore.rules).

Ochutnávky jsou **append-only** — když oba rodiče zapíšou offline, po připojení
zůstanou oba záznamy. Ostatní pole jsou last-write-wins.

## Bezpečnostní vrstva

`src/safety/` není dokumentace, je to kód. Každé pravidlo z `docs/SPEC.md` kapitoly 3
má v `tests/safety/` pozitivní i negativní test. Když test spadne, opravují se data,
ne pravidlo.
