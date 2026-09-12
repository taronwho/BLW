# BEZPECNOST.md — zdravotní pravidla a politika zdrojů

Tenhle dokument je závazný pro obsah dat. Když se něco v datech rozchází s tímto souborem, chyba je v datech.

Aplikace nedává lékařská doporučení. Shromažďuje obecně dostupná doporučení odborných institucí a odkazuje na ně. Konkrétní situaci dítěte řeší pediatr.

## 1. Politika zdrojů

### Povolené domény pro `SourceRef`

**Tier 1 — odborné společnosti a úřady:**
`who.int`, `espghan.org`, `efsa.europa.eu`, `ema.europa.eu`, `pediatrics.cz` (Česká pediatrická společnost ČLS JEP), `szu.cz` a `szu.gov.cz` (Státní zdravotní ústav), `mzcr.cz` a `mzd.gov.cz` (Ministerstvo zdravotnictví), `bezpecnostpotravin.cz`, `nhs.uk` (vč. `nhs.uk/start-for-life`), `eaaci.org`, `cpzp.cz` není přípustné (pojišťovna, ne odborná společnost).

SZÚ i Ministerstvo zdravotnictví přešly na domény pod `gov.cz`. Jde o tytéž instituce, proto jsou nové domény v tier 1 stejně jako staré; staré zůstávají v seznamu, aby prošly dříve ověřené odkazy, které ještě nebyly přesměrovány.

**Tier 2 — důvěryhodné odborné publikace a projekty:**
`kojeni.cz` (Laktační liga), `vyzivadeti.cz`, `solidstarts.com` (jen pro tvary porcí a rizika dušení), `healthychildren.org` (AAP), `nutricia.cz` a `hipp.cz` **nejsou** přípustné (výrobci).

Blogy, e-shopy, magazíny, Pinterest, recepty od uživatelů: **nikdy**.

### Postup pro každou surovinu

1. Najdi zdroj, **načti ho** a ověř, že opravdu obsahuje to, co chceš tvrdit.
2. Zapiš `org`, `title`, `url`, `accessedAt` (dnešní datum), `tier`.
3. Formuluj obsah **vlastními slovy** — žádné doslovné převzetí ani blízká parafráze.
4. Když se zdroje rozcházejí (což se u zavádění příkrmů stává často, zvlášť mezi českou a britskou praxí), uveď obě verze a nastav `reviewStatus: 'needs-review'`. Nesnaž se rozdíl rozhodnout.
5. Když zdroj nenajdeš, položku ponech s minimálním popisem a `needs-review`. **Nedoplňuj z paměti.**

## 2. Absolutní zákazy pro dětskou linii (do 12 měsíců)

| Zákaz | Důvod | Do kdy |
|---|---|---|
| Med (i pečený, i v pečivu) | Clostridium botulinum, kojenecký botulismus | 12 měsíců |
| Přidaná sůl, bujóny, kostky, sójová omáčka, uzeniny | Zátěž ledvin; limit je pod 1 g soli denně do 1 roku | 12 měsíců (pak ≤ 2 g/den do 3 let) |
| Přidaný cukr, sirupy, javorový sirup, agáve, ovocné šťávy místo vody | Zuby, návyk na sladkou chuť | co nejdéle |
| Celé ořechy a celá tvrdá semínka | Dušení; navíc riziko aspirace do plic | 5 let (mleté/máslo lze od 6 měsíců) |
| Celé kuličky hroznů, borůvek, cherry rajčat, oliv | Kulatý tvar uzavře dýchací cesty | vždy krájet podélně na čtvrtky |
| Syrové nebo tekuté vejce | Salmonela | 12 měsíců, pak podle doporučení pediatra |
| Nepasterizované mléko a sýry z něj, plísňové sýry | Listerie | 12 měsíců |
| Kravské mléko **jako nápoj** | Nízký obsah železa, zátěž | 12 měsíců (do vaření a jogurty od 6 měsíců lze) |
| Rýžové nápoje | Anorganický arsen | 5 let |
| Popcorn, tvrdé bonbóny, marshmallow, klobásy v kolečkách, syrová tvrdá mrkev, celé jablko | Dušení | podle položky, viz surovina |
| Sušené ovoce v celku (rozinky, datle) | Lepivé, ucpe dýchací cesty | do 12 měsíců sekat nadrobno |

## 3. Rizika, která mají vlastní `hazard` štítek

**Dusičnany** — špenát, mangold, rukola, červená řepa, fenykl hlíza, hlávkový salát. V prvních měsících příkrmu podávat spíš občas než denně. Nikdy neuchovávat uvařené při pokojové teplotě a neohřívat opakovaně. Zdroj: EFSA.

**Rtuť** — dravé ryby. Žralok, mečoun a marlín se malým dětem nepodávají vůbec. Tuňák omezit. Uveď u každé rybí položky `frequencyLimit`.

**Arsen** — rýže a rýžové výrobky. Rýži před vařením propláchnout, vařit v nadbytku vody. Rýžové chlebíčky a rýžová kaše ne jako denní základ. Rýžové nápoje do 5 let vůbec.

**Vitamin A** — játra. Vysoce hodnotný zdroj železa, ale nejvýše jednou týdně kvůli kumulaci retinolu.

**Kosti** — kapr, pstruh, sardinky. U každé rybí položky konkrétní pokyn k odstranění kostí, ne obecná věta.

**Fenyklový čaj** — EMA vydala k fenyklovým přípravkům u malých dětí omezující stanovisko. Ověř aktuální znění a podle toho nastav `minAgeMonths`. Nepiš doporučení z paměti.

## 4. Klíčové alergeny a jejich zavádění

Pro **označování** používej všech 14 alergenů povinně značených v EU. Pro **plánované zavádění** sleduj těchto 9: vejce, arašídy, mléko, ořechy, pšenice (lepek), sója, ryby, sezam, korýši.

Aktuální odborný konsenzus (ESPGHAN, EAACI) je, že zavádění alergenů se **neodkládá** — u vajec a arašídů se časnější zavedení pojí s nižším rizikem alergie. Česká pediatrická společnost zároveň u dobře prospívajícího výlučně kojeného dítěte nedoporučuje kvůli alergenům zkracovat plné kojení před ukončeným 6. měsícem. Ověř aktuální znění obou a v aplikaci uveď obě perspektivy.

Protokol, který aplikace zobrazí u každého klíčového alergenu:
- Zavádět **po jednom**, s odstupem 2–3 dny mezi novými alergeny
- Začít malým množstvím, ideálně **dopoledne**, doma, ne když je dítě nemocné nebo očkované týž den
- Při dobré snášenlivosti nabízet **opakovaně a pravidelně** — jednorázová expozice toleranci neudrží
- Za zavedený považovat po 3 expozicích bez reakce
- Aplikace **nediagnostikuje**: u jakéhokoli podezření na reakci odkáže na pediatra
- Při otoku rtů či víček, dušnosti, zvracení s bledostí nebo náhlé ochablosti: **155**

## 5. Připravenost na příkrm

Aplikace musí obsahovat obrazovku/sekci „Je dcera připravená?", protože rodiče ji zapnou dřív, než se bude jíst.

Zavádět příkrm nejdřív po ukončeném 4. měsíci a nejpozději po ukončeném 6. měsíci; u zdravého prospívajícího kojeného dítěte je preferováno výlučné kojení do ukončeného 6. měsíce. U BLW, kde dítě jí samo tuhou stravu, je navíc podmínkou vývojová zralost:

- sedí s oporou a udrží stabilně hlavu
- koordinuje oko–ruka–ústa, sáhne po jídle a trefí si ho do pusy
- vymizel vypuzovací reflex jazyka
- projevuje o jídlo zájem

Neuvádět to jako checklist s výsledkem „ano/ne". Uvést to jako vodítko s větou, že rozhodnutí patří pediatrovi.

## 6. Dávení versus dušení

Krátká, klidná, vždy dostupná sekce. Dávení je hlasité, dítě je červené, kašle a zvládá to samo — je to normální obranný reflex, který je u malých dětí spouštěný dál vepředu na jazyku. Dušení je tiché, dítě nevydá zvuk, modrá. Doplň větu, že dítě má u jídla vždy sedět vzpřímeně, nikdy nejíst v pohybu, v autosedačce nebo vleže, a nikdy nesmí zůstat u jídla samo. Přidej doporučení absolvovat kurz první pomoci u kojenců a odkaz na Tier 1 zdroj s postupem. **Nepiš vlastní návod na řešení dušení** — na to text v aplikaci nestačí.

## 7. Vegetariánská domácnost

Matka je vegetariánka, dcera bude jíst i maso. Aplikace kvůli tomu:
- vede u každé suroviny `vegetarian: boolean`, včetně sýrů se živočišným syřidlem (parmazán, pecorino, grana padano) a želatiny
- v bezmasé variantě receptu vyžaduje **náhradu bílkoviny**, ne jen vynechání masa (luštěniny, tofu, tempeh, vejce, mléčné výrobky)
- u rostlinných zdrojů železa uvádí, že se vstřebávání zlepšuje v kombinaci s vitaminem C (a tuto informaci opatří zdrojem)
- neřeší doplňky stravy a neurčuje dávkování ničeho, včetně vitaminu D a železa — to patří pediatrovi

## 8. Disclaimer v aplikaci

Zobrazí se při prvním spuštění, potvrzuje se jedním tlačítkem, je trvale dostupný v nastavení. Text vlastními slovy v tomto smyslu:

> Aplikace shrnuje veřejně dostupná doporučení odborných institucí a odkazuje na ně. Nenahrazuje pediatra a nedává lékařská doporučení. Konkrétní postup u vašeho dítěte, zvlášť při podezření na alergii nebo jiné obtíže, patří dětskému lékaři. U každé informace najdete zdroj a datum, kdy byl ověřen.
