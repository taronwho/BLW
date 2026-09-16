# 30denní plán

Hotová funkce, ne návrh. Tenhle dokument popisuje, podle čeho se plán
skládá a proč, aby se logika dala kdykoli ověřit proti datům a testům.

Kód: `src/plan/` (frekvence, generátor, práce s plánem), obrazovky
`src/app/screens/PlanScreen.tsx` a `PlanDenScreen.tsx`, testy
`tests/plan/`. Text pro rodiče je v radě `30denni-plan`.

## K čemu to je

Rodič, který začíná, neví, co nabídnout zítra. Katalog má tři sta položek
a filtry na něj jsou přesné, ale odpověď na otázku „co dneska" v nich není.
Plán ji dává: na každý den jednu novou surovinu a k ní celá jídla i s recepty
pro celou rodinu.

## Rozhodnutí, která padla (září 2026)

Původní návrh se ptal na pět věcí. Odpovědi zadavatele:

1. **Rozsah dne.** Celé dny, ne jedno jídlo. Snídaně, oběd, večeře
   a od roka i svačiny, podle toho, kolikrát denně už má dítě jíst.
2. **Kdy plán začíná.** Kdykoli. Co je v deníku, se jako novinka nenabídne.
3. **Druhé dítě.** Plán patří dítěti, stejně jako deník.
4. **Přeskočení dne.** Rodič rozhoduje: odškrtnout, odložit na jindy,
   přeskočit úplně, nebo vyměnit za jiný nápad se stejnou novinkou.
5. **Recepty v plánu.** Ano, celé recepty, a to i první den. Novinka je
   vždycky součástí jídla, ne lžička vedle talíře.

K tomu přibylo pokračování: až blok doběhne, sestaví se dalších třicet dnů
z toho, co za předchozích třicet opravdu proběhlo.

## Kolikrát denně

Opřeno o NHS a WHO, plán bere z obou tu opatrnější hranici.

| stav | jídel | svačin |
|---|---|---|
| 1. blok, dny 1–7 | 1 | 0 |
| 1. blok, dny 8–14 | 2 | 0 |
| dál | 3 | 0 |
| od 12 měsíců | 3 | 2 |

Nad tím platí strop podle věku: do sedmi měsíců nejvýš dvě jídla, ať dítě
jí jakkoli dlouho. Bez data narození se bere ta opatrnější varianta.

Zdroje: NHS „from around 6 months" (jednou denně malé množství),
NHS „7 to 9 months" (postupně tři jídla), NHS „10 to 12 months" (tři jídla),
NHS „babies under 12 months do not need snacks", WHO IYCF (2–3 jídla
6–8 měsíců, 3–4 jídla 9–23 měsíců, 1–2 svačiny podle potřeby).

## Pravidla, která generátor drží

Každé z nich má svůj test v `tests/plan/generator.test.ts`. Když test
spadne, opravuje se generátor, ne test.

1. **Jedna nová surovina denně.** Když se zavedou dvě a dítě zareaguje,
   nepozná se na kterou.
2. **Železo v každém dni**, jakmile dítě jí víc než jedno jídlo denně.
   V prvním týdnu ne: jediné jídlo dne je jednoduchá zeleninová úprava
   a železo by do ní šlo dostat jen na sílu.
3. **Alergen brzy a pak dvakrát znovu**, tři a sedm dnů po prvním setkání.
   Nový alergen nikdy nepřijde dva dny po sobě.
4. **Alergie dítěte** z Domácnosti se do plánu nedostanou vůbec, ani jako
   složka receptu.
5. **Nic s vysokým rizikem dušení** plán sám od sebe nenabídne. V katalogu
   takové suroviny zůstávají i s pokynem ke krájení.
6. **Recept nepřinese nezavedený alergen.** Jinak by se při reakci
   nepoznalo, co ji způsobilo.
7. **Recept se neopakuje** dřív než po šesti dnech a dvakrát v jednom dni
   nepadne nikdy.

## Jak se vybírá novinka

- **Novinka je vždycky součástí jídla.** Hledá se ve dvou kolech: nejdřív
  recept, který do daného jídla patří i kategorií, pak jakýkoli recept s tou
  surovinou. Když ani tak nevyjde, surovina se odloží a na řadu jde další
  z fronty; nepropadne. Holé sousto vedle talíře zůstává jen jako poslední
  záchrana pro plán, ve kterém už nezbývá nic jiného.
- **První blok je o úchopu.** Polévky a recepty se štítkem „kaše“ dostávají
  po celý první blok penalizaci, sousta do ruky malý bonus. Není to zákaz:
  kaše na předem naložené lžíci do metody patří taky. Jenže kategorie snídaní
  je kašemi přeplněná, takže bez vážení vycházela v prvním měsíci kaše každé
  ráno a z příkrmu vedeného dítětem zbylo krmení lžičkou. Od druhého bloku
  vážení mizí.
- **První dny jsou jednoduché.** Dva týdny se preferují recepty o pár
  složkách, do půl hodiny a mimo polévky: dítě zatím nic nezná a dušená směs
  o deseti surovinách by mu den zaplnila neznámými věcmi.
- **První týden** je opsaný z rady o prvních potravinách: brokolice, květák,
  cuketa, brambor, dýně hokaido, batát, avokádo. Není to odvozené z dat,
  protože „rozumné první sousto" se z dat poznat nedá. Mrkev, kterou SZÚ
  jmenuje jako první, tam schválně není: v katalogu má vysoké riziko dušení
  kvůli syrové podobě a plán takové suroviny sám nenabízí.
- **Klíčové alergeny** dostanou jednoho zástupce na skupinu, ne všechny
  alergenní suroviny. Zástupce se vybírá tak, aby nesl co nejmíň skupin
  naráz: při reakci se to pak vyhodnocuje líp.
- **Zbytek** se řadí podle železa, pak sezóny, pak abecedy, a uvnitř každé
  skupiny se střídají kategorie. Bez střídání vycházely čtyři druhy čočky
  za sebou.
- **Prokládání:** každý třetí den je alergenní, ostatní dny ze zbytku.
  Devět skupin se tím stihne zhruba za měsíc a mezi dvěma novými alergeny
  zůstanou dva klidné dny.

## Jak se vybírá recept

Nižší skóre vyhrává: recept s novinkou dne, pak recept, který doplní
chybějící železo, pak počet surovin, které dítě ještě nezná (penalizace,
ne zákaz: kuchařka se surovinám navíc nevyhne), a v prvních dvou týdnech
i složitost. Při shodě rozhoduje abeceda a posun podle bloku.

Výchozí plán bere to nejlepší, co na daný den sedí. Okno srovnatelných
nápadů se otevře teprve tehdy, když si rodič řekne o jiné jídlo nebo
o přesestavení bloku; jinak by se místo třicetiminutových hranolků
nabídla pětačtyřicetiminutová pečená brambora.

Plán si pamatuje, kolikátá podoba bloku to je. Bez toho vracelo tlačítko
„sestavit znovu" řádek po řádku to samé, protože generátor je čistá funkce.

## Jak se chová

**Postupový, ne kalendářní.** Den se posune, až ho rodič odškrtne, ne
o půlnoci. Nemoc ani dovolená plán nerozbijí a nikdo se nevrací
k dvanácti zmeškaným dnům.

**Jedna novinka, ale ne jedno sousto.** Detail dne připomene posledních pár
surovin z plánu jako nabídku na talíř. Novinka zůstává jedna kvůli přiřazení
reakce, ale výběr na talíři k metodě patří a druhé jídlo navíc kvůli němu
přidávat nejde: počet jídel řídí věk.

**Jedna pravda, ne dvě.** Odškrtnutí zapíše ochutnávku do deníku. Zapsat
se dá i bez toho: domýšlet za rodiče, jak jídlo dopadlo, by deník
znehodnotilo.

**Počítá se v telefonu.** Generátor je čistá funkce nad katalogem a deníkem,
žádný server. Ze stejného vstupu vyjde vždycky tentýž plán, takže se dá
kdykoli přepočítat i otestovat.

**Odmítnutí není konec.** Přeskočená surovina se v dalším bloku vrátí,
protože v deníku nebude.

**Reakce patří pediatrovi.** Plán ji sám nezpracovává. Rodič si alergen
zapíše mezi alergie dítěte a plán ho pak vynechá celý. Aplikace alergii
nediagnostikuje.

**Alergie zapsaná až potom se nepřehlédne.** Plán je hotový rozvrh, ne živý
dotaz do katalogu, takže o alergii zapsané po sestavení neví. Proto si s sebou
nese seznam alergií, se kterými vznikl. Když se rozejde s tím dnešním,
upozorní na to úvodní obrazovka, plán i detail dne, a jídla, která zakázaný
alergen nesou, dostanou v detailu dne štítek. Nic se nemění potichu: rodič
má vědět, proč se plán přesestavuje.

Porovnávají se jen dva seznamy, ne katalog. Díky tomu na neshodu upozorní
i úvodní obrazovka, která si katalog nestahuje. Plán uložený verzí, která
seznam ještě neměla, se za neshodu nepovažuje.

## Ukládání a sloučení

Plán bydlí ve stavu domácnosti pod `plans`, klíčem je `childId`, schéma 4.
Skládá se ze dvou částí, které se při sloučení chovají jinak:

- `dny` jsou výsledek jednoho sestavení, mění se zřídka, rozhoduje pozdější
  zápis;
- `stavy` se mění pořád a každý den má vlastní značku času, aby se
  odškrtnutí ze dvou telefonů sloučilo místo přepsání.

Stavy se slučují jen u téhož bloku sestaveného ve stejnou chvíli. Kdyby se
přenášely mezi různými sestaveními, odškrtnuté dny starého plánu by označily
úplně jiná jídla toho nového.

Generátor se do úložiště neimportuje. Sahá do celého katalogu a úložiště je
v prvním balíku aplikace, takže by si katalog stáhl i rodič, který plán nikdy
neotevřel. Hotový plán proto do úložiště přichází zvenčí, z obrazovky.
