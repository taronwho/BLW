# Jak spustit stavbu aplikace — postup pro tebe

Tenhle soubor není pro Claude Code. Je pro tebe. Zbylé soubory vlož do repozitáře.

## 1. Co musíš udělat ručně (Claude Code to za tebe nemůže)

| Krok | Kde | Poznámka |
|---|---|---|
| Založit prázdný GitHub repozitář `BLW` | github.com | Public (kvůli GitHub Pages zdarma). V repu nebudou žádná citlivá data. |
| V repu zapnout Pages | Settings → Pages → Source: **GitHub Actions** | Ne „Deploy from branch". |
| Založit Firebase projekt | console.firebase.google.com | Zdarma (plán Spark). Přidat **Web app**, opsat konfiguraci. |
| Zapnout Firestore | Firebase → Build → Firestore Database → Create | Region **eur3 (europe-west)**. Start v *production mode*, pravidla nahradí Claude Code. |
| Zapnout anonymní přihlášení | Firebase → Authentication → Sign-in method → **Anonymous** | Tohle je to, co umožní „bez hesel". |
| Přidat doménu do Authorized domains | Firebase → Authentication → Settings | `tvuj-nick.github.io` |

Firebase web-konfigurace (apiKey atd.) **není tajemství** — je z principu viditelná v prohlížeči. Bezpečnost dělají Firestore pravidla, ne skrytí klíče. Přesto ji v repu nechceme: půjde zadat v aplikaci v Nastavení a uloží se do prohlížeče. Claude Code na to připraví i `.env.local` variantu pro lokální vývoj.

## 2. Vlož soubory do repozitáře

Do kořene repozitáře nahraj:

```
CLAUDE.md
docs/SPEC.md
docs/BEZPECNOST.md
docs/SUROVINY-SEZNAM.md
docs/GOALS.md
```

`CLAUDE.md` se načítá automaticky při každém spuštění Claude Code — proto v něm jsou jen pravidla, ne celá specifikace.

## 3. Jak pouštět Claude Code

Zásadní věci, které Gemini v promptu nezohlednil:

- **`/goal` není zadání, je to podmínka dokončení.** Po každém tahu ji posuzuje samostatný malý model (defaultně Haiku), který **nespouští příkazy ani nečte soubory** — vidí jen to, co Claude vypsal do konverzace. Proto každá podmínka v `GOALS.md` vyžaduje, aby byl v konverzaci vypsaný výstup `npm run validate`. Podmínka smí mít max. 4 000 znaků.
- **Jeden goal na session, jedna fáze na session.** Po dokončení fáze dej `/clear` a začni další. Důvod: přetečení kontextu, které autokompakce nezvládne, goal zruší — a u 200 surovin na to dojde.
- **Pusť to v auto módu**, jinak se Claude ptá na každé volání nástroje a autonomie je k ničemu. `/goal` sám o sobě permission mód nemění.
- Stav zjistíš `/goal` bez argumentu, zrušíš `/goal clear`. Důvod posledního verdiktu vidíš přes Ctrl+O.
- Když chceš běh z mobilu na pozadí, pomůže Remote Control nebo desktopová appka — `/goal` funguje v obojím i v `-p` režimu. U `-p` přidej `--output-format stream-json --verbose`, jinak se dlouhý běh tváří jako zaseknutý.
- Potřebuješ Claude Code **v2.1.139 nebo novější** a přijatý workspace trust dialog (evaluátor je součást hooks systému).

Pořadí fází je v `docs/GOALS.md`. Nepřeskakuj fázi 0 — nasazení na Pages řešíme hned na začátku s prázdnou aplikací, aby se to nezjistilo až na konci.

## 4. Co si po každé fázi ověř ty sám

Claude Code umí napsat test, který projde, a přitom aplikaci, která je k ničemu. Evaluátor `/goal` to nepozná — čte jen transcript. Proto:

- **Po fázi 2 (suroviny):** otevři 5 náhodných surovin a projdi jim zdroje. Klikni na URL. Když odkaz nevede na nic nebo tvrdí něco jiného, zastav to a nech přepsat celou kategorii.
- **Po fázi 3 (recepty):** vyber 3 recepty s masem a zkontroluj, že bezmasá varianta pro manželku opravdu nahrazuje bílkovinu, ne že jen vynechá maso.
- **Po fázi 4 (UI):** projdi to na svém telefonu, ne v simulátoru.
- **Před ostrým používáním:** ukaž databázi alergenů a bezpečnostních pravidel pediatričce při prohlídce. Aplikace není zdravotnický prostředek a ani ten nejlepší prompt z ní nedělá zdroj lékařských doporučení.

## 5. Známá omezení, se kterými počítej

- Recepty si Claude do jisté míry **vymyslí** — to je v pořádku a nejde to obejít. Bezpečnost proto nesedí v receptech, ale v datech surovin a ve validátoru, kterým každý recept musí projít.
- Solid Starts má obsah chráněný autorským právem. Slouží jako inspirace pro tvary a velikosti porcí, ne jako text k opsání. Validátor kontroluje, že popisy nejsou doslovné převzetí.
- Dcera bude v době dokončení aplikace pravděpodobně kolem 6 měsíců. Fáze 6m+ je tedy ta, která musí být hotová nejlíp; 12m+ snese být hrubší.
