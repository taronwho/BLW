# OPRAVY.md — jak opravit údaj bez nasazení

Katalog je v balíku aplikace, takže oprava jediné věty normálně znamená
commit, build a deploy. U aplikace, jejíž celá hodnota je v přesnosti
zdravotních údajů, je to moc dlouhá cesta — proto existuje soubor
`public/opravy.json` (audit 17. 9. 2026, kapitola 10 bod 5).

**Tohle nejsou zadní vrátka do dat.** Je to zkratka v čase, ne v kontrole:
každá opravená položka projde týmiž pravidly z `src/safety/` jako data
v repozitáři. Co neprojde, se zahodí a v konzoli se řekne proč.

## Jak se soubor chová

1. Stahuje se **až po vykreslení** aplikace, s `cache: 'no-cache'`.
2. Když se nestáhne (letadlo, výpadek), použije se poslední uložená podoba
   z `localStorage`.
3. Když není ani ta, jede katalog z balíku. Aplikace na opravách nikdy
   nečeká a bez nich funguje beze zbytku.
4. Menší nebo stejná `verze` se nepřebírá — server může vrátit starou
   kopii z mezipaměti.

## Tvar souboru

```json
{
  "verze": 1,
  "vydano": "2026-10-05",
  "opravy": [
    {
      "druh": "surovina",
      "id": "fenykl-hliza",
      "duvod": "EMA upřesnila doporučení k fenyklovým čajům, viz zdroj v katalogu.",
      "frequencyLimit": "Spíš občas než denně."
    }
  ]
}
```

`verze` musí při každém vydání vzrůst. `duvod` je povinný a **uvidí ho
rodič** v detailu položky — tichá změna zdravotního údaje by byla horší
než žádná.

## Co se smí opravit

| Druh | Pole |
|---|---|
| `surovina` | `chokingReason`, `frequencyLimit`, `hazardNotes`, `prep.<fáze>.serving`, `prep.<fáze>.caution`, `reviewStatus`, `reviewNote` |
| `recept` | `babySplitPoint`, `babySteps`, `babyServing.<fáze>` |

Nic jiného. Idčka, alergeny, věk, kategorie ani složení receptu se takhle
měnit nedají: drží pohromadě filtry, plán i nákupní seznam a změna jednoho
čísla by rozbila půlku aplikace. Na ně je pořád jediná cesta — commit.

## Co opravu zahodí

Cokoli, co by neprošlo `npm run validate`. Pravidlo `no-honey-baby`
zahodí větu o medu v pokynu pro šestiměsíční dítě, `no-placeholder`
zahodí „TODO doplnit", `baby-split-required` zahodí pokyn k dělení, který
neodkazuje na číslo kroku. Testy v `tests/opravy/` to hlídají a platí pro
ně totéž co pro `tests/safety/`: **když test spadne, opravuje se oprava,
ne test.**

## Postup

1. Ověř zdroj. Platí `CLAUDE.md` pravidla 1 a 2 stejně jako v repozitáři.
2. Zvyš `verze` a doplň `vydano`.
3. Přidej záznam s `duvod` psaným pro rodiče, ne pro vývojáře.
4. Pusť `npm run validate` — soubor sám validátor nekontroluje, ale
   testy ověří, že se pravidla na opravy vůbec pouštějí.
5. Nahraj `public/opravy.json` na Pages. Jde to i samostatným commitem
   bez změny kódu; aplikace si ho vezme při příštím otevření.
6. **Tutéž opravu promítni i do dat v repozitáři.** `opravy.json` je
   náplast, ne úložiště: čím déle se v něm oprava drží, tím víc se liší
   od toho, co vidí validátor.
