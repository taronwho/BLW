# FIREBASE.md — nastavení sdílení krok za krokem

Aplikace funguje i **bez Firebase**, jen v lokálním režimu nad IndexedDB: každý
telefon má vlastní deník a nic se nesdílí. Firebase zapínáš jen kvůli tomu, aby
víc lidí vidělo tytéž ochutnávky.

Cíl téhle příručky: nastavit to tak, aby **nikdo z uživatelů nic nevyplňoval**.
Konfigurace se zapeče do buildu, člověk dostane odkaz, klepne na něj a je
připojený. V samotné aplikaci se nedá nic nastavit a záměrně tam ani žádné
pole na konfiguraci není.

## Co je a co není tajemství

Firebase web-konfigurace (`apiKey`, `projectId` a spol.) **není tajemství**.
Je z principu vidět v prohlížeči každého návštěvníka — stáhne se jako součást
JavaScriptu. Ukrývat ji nemá smysl a Google to ani nepředpokládá.

Bezpečnost dělá trojice:

1. **Firestore pravidla** (`firestore.rules`) — kdo smí co číst a zapisovat.
2. **Párovací kód** — 10 znaků Crockford Base32, je to název dokumentu
   domácnosti a zároveň jediné heslo. Výpis kolekce je pravidly zakázaný,
   takže cizí domácnost nikdo nenajde náhodou.
3. **Omezení klíče na doménu** — API klíč funguje jen ze stránek tvého webu.

Proto se konfigurace klidně smí zapsat rovnou do repozitáře (krok 7,
varianta A). Kdo ji tam mít nechce, použije proměnné na GitHubu (varianta B).

---

## 1. Založení projektu Firebase

1. Jdi na [console.firebase.google.com](https://console.firebase.google.com)
   a přihlas se Google účtem.
2. **Create a project** (nebo „Přidat projekt").
3. Název například `blw-prikrmy`. Na přesném názvu nezáleží, jen si ho pamatuj.
4. **Google Analytics vypni** — k ničemu tu není a jen přidává souhlasy.
5. Počkej, než se projekt vytvoří, a klikni na **Continue**.

## 2. Přidání webové aplikace

1. Na úvodní stránce projektu klikni na ikonu **`</>`** (Web).
2. Přezdívka aplikace: třeba `Drobek web`.
3. **„Also set up Firebase Hosting" nezaškrtávej** — běžíme na GitHub Pages.
4. **Register app.**
5. Ukáže se blok kódu s objektem `firebaseConfig`. **Tenhle blok si nech
   otevřený nebo zkopíruj stranou**, budeš z něj přepisovat šest hodnot:

```js
const firebaseConfig = {
  apiKey: "AIzaSy…",
  authDomain: "blw-prikrmy.firebaseapp.com",
  projectId: "blw-prikrmy",
  storageBucket: "blw-prikrmy.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123…",
};
```

Kdybys blok zavřel, najdeš ho znovu přes **ozubené kolo → Project settings →
Your apps → SDK setup and configuration → Config**.

## 3. Firestore databáze

1. V levém menu **Build → Firestore Database**.
2. **Create database.**
3. Režim: **Start in production mode** (pravidla hned nahradíme vlastními).
4. Region: **eur3 (europe-west)** — data zůstanou v Evropě.
5. **Enable.**

## 4. Anonymní přihlášení

Tohle je to, co umožní „bez hesel". Bez něj se nikdo nepřipojí.

1. **Build → Authentication → Get started.**
2. Záložka **Sign-in method**.
3. V seznamu **Anonymous → Enable → Save.**

Každé zařízení dostane vlastní `uid`, který se zapíše do `members` domácnosti.

## 5. Nahrání pravidel

Bez tohohle kroku by druhý člověk data přečetl, ale nikdy nezapsal.

1. **Build → Firestore Database → Rules.**
2. Smaž, co tam je, a vlož celý obsah souboru
   [`firestore.rules`](../firestore.rules) z tohohle repozitáře.
3. **Publish.**

Co pravidla dělají:

| Operace | Kdo smí |
|---|---|
| `get` (čtení domácnosti) | kdokoli přihlášený, kdo zná přesný kód |
| `list` (výpis domácností) | nikdo — zákaz enumerace |
| `create` | přihlášený, a jen se sebou jako jediným členem |
| `update` | člen domácnosti; nebo nový člověk, který **přidá jen sám sebe a nezkrátí deník** |
| `delete` | nikdo |

Větev „přidá jen sám sebe" je právě to připojení druhého telefonu: nikoho
neubere a přidat smí nejvýš jedno `uid`. Domácnost unese pět zařízení.

Připojující se člověk navíc nesmí týmž zápisem zkrátit seznam ochutnávek.
Smazaná ochutnávka zůstává v poli jako náhrobek, takže poctivé sloučení počet
záznamů nikdy nesníží — kdo zná kód, se smí připojit, ale nesmí přitom smazat,
co rodiče za měsíce nasbírali. Každý zápis taky musí mít správný tvar
(`state`, `updatedAt`, `members`), aby dokument nešlo přepsat čímkoli.

> **Pravidla se mění ručně.** Když se `firestore.rules` v repozitáři změní,
> nasazená verze se tím sama neaktualizuje — je potřeba projít kroky výš
> znovu. Poslední změna: připojení nesmí zkrátit deník a kontrola tvaru
> dokumentu.

### Mrtvá zařízení

Anonymní přihlášení váže `uid` na úložiště prohlížeče. Kdo smaže data nebo
aplikaci přeinstaluje, dostane příště nové `uid` a připojí se znovu — to staré
ale v `members` zůstane a zabírá jedno z pěti míst. Bez zásahu by se domácnost
časem zaplnila záznamy, které už nikomu nepatří.

Proto je v Domácnosti seznam **Zařízení v domácnosti** s datem posledního
připojení a s možností cizí zařízení odebrat. Odebrat smí kterýkoli člen;
pravidla to dovolují, protože u člena hlídají jen počet, ne podobu seznamu.

## 6. Omezení API klíče na doménu

Nepovinné, ale doporučené — zabrání použití klíče z cizích stránek.

1. [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials),
   nahoře vyber **stejný projekt**.
2. V sekci **API Keys** klikni na klíč, který začíná stejně jako tvůj `apiKey`
   (jmenuje se obvykle „Browser key (auto created by Firebase)").
3. **Application restrictions → Websites → Add.**
4. Přidej dvě položky:
   - `https://<tvůj-nick>.github.io/*`
   - `http://localhost:*` (kvůli vývoji; můžeš vynechat)
5. **Save.** Projeví se to do pěti minut.

## 7. Vložení konfigurace

Máš dvě možnosti; stačí jedna.

### A. Do souvisejícího souboru v repozitáři (jednodušší)

Otevři **`src/storage/firebaseDefaults.ts`** a opiš šest hodnot z bloku
z kroku 2 mezi apostrofy:

```ts
export const FIREBASE_DEFAULTS: FirebaseConfig = {
  apiKey: 'AIzaSy…',
  authDomain: 'blw-prikrmy.firebaseapp.com',
  projectId: 'blw-prikrmy',
  storageBucket: 'blw-prikrmy.firebasestorage.app',
  messagingSenderId: '123456789012',
  appId: '1:123456789012:web:abc123…',
};
```

Commitni a pushni do `main`. Nasazení se spustí samo.

Hodnoty budou v repozitáři vidět — a to je v pořádku. Firebase je posílá do
prohlížeče každému návštěvníkovi jako součást JavaScriptu, takže veřejné jsou
tak jako tak. Chrání to pravidla z kroku 5 a omezení klíče z kroku 6.

### B. Přes proměnné na GitHubu (když hodnoty v repozitáři mít nechceš)

1. V repozitáři: **Settings → Secrets and variables → Actions**.
2. Záložka **Variables** → **New repository variable**.
3. Založ postupně šest proměnných. Hodnoty opiš z bloku z kroku 2:

| Název proměnné | Hodnota z `firebaseConfig` |
|---|---|
| `VITE_FIREBASE_API_KEY` | `apiKey` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `authDomain` |
| `VITE_FIREBASE_PROJECT_ID` | `projectId` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `storageBucket` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
| `VITE_FIREBASE_APP_ID` | `appId` |

Hodnoty piš **bez uvozovek**. Pak spusť nasazení: **Actions → Deploy na GitHub
Pages → Run workflow**, nebo pushni cokoli do `main`. V logu kroku „Kontrola
konfigurace Firebase" musí být vypsané ID projektu.

Proměnné mají přednost před souborem, takže jdou obě cesty i kombinovat.

## 8. Zkouška

1. Otevři nasazenou aplikaci, **Domácnost**.
2. Nesmí tam být žádná zmínka o tom, že sdílení není nastavené. Kdyby tam
   byla, krok 7 neproběhl nebo se nenasadil.
3. Klikni na **Založit domácnost**. Objeví se kód, QR a odkaz k připojení.
4. **Zkopírovat kód** a pošli ho druhému člověku.
5. Ten si otevře nainstalovanou aplikaci, v Domácnosti → Sdílení kód vloží
   do pole **Připojit se ke stávající domácnosti** a klepne na **Připojit**.
   Od té chvíle vidí stejný deník.

### Proč se párovací kód posílá radši než odkaz

Odkaz poslaný v Messengeru, WhatsAppu nebo na Facebooku se otevře ve
vestavěném prohlížeči té aplikace. Ten má vlastní úložiště, takže anonymní
přihlášení dostane jiné uid než nainstalovaná aplikace na téže ploše a
spáruje se právě on:

- v nainstalované aplikaci není nic,
- v seznamu zařízení přibude z jednoho telefonu položka navíc,
- a domácnost má míst jen pět.

Aplikace na to při otevření pozvánky sama upozorní, pojmenuje prohlížeč,
ve kterém běží, a nabídne kód ke zkopírování. Zbytečné zařízení jde v seznamu
odebrat; podle popisu („Prohlížeč v Messengeru" vs. „Nainstalovaná aplikace")
je poznat, které to je.

Bez vestavěného prohlížeče jsou v pořádku obě cesty:

- **QR kód naskenovaný fotoaparátem** — systém odkaz předá, a protože manifest
  má `handle_links: preferred`, Android ho u nainstalované aplikace otevře
  přímo v ní (dokud to uživatel nezakáže v nastavení aplikace).
- **odkaz poslaný SMS nebo otevřený v Chromu** — totéž.

## Jak to funguje bez nastavení

Když konfiguraci nevyplníš, nic se nerozbije: aplikace poběží dál v lokálním
režimu, každé zařízení samo za sebe, a v Domácnosti se objeví jedna věta, že
sdílení není nastavené. V aplikaci se nikdy nic nevyplňuje — pole na vkládání
konfigurace v ní záměrně není.

Pro lokální vývoj slouží `.env.local` podle vzoru v `.env.local.example`.

## Když se něco nedaří

| Projev | Příčina |
|---|---|
| „Jen na tomto zařízení" i po založení domácnosti | Není zapnuté anonymní přihlášení (krok 4). |
| Druhý telefon vidí data, ale jeho zápisy se nepropíšou | Ve Firestore jsou staré verze pravidel (krok 5). |
| `Missing or insufficient permissions` | Pravidla nejsou publikovaná, nebo je domácnost plná. Aplikace u téhle chyby sama nabídne obojí; plnou domácnost uvolníš odebráním zařízení v Domácnosti na některém z připojených telefonů. |
| `auth/api-key-not-valid` | Překlep v `VITE_FIREBASE_API_KEY`, nebo omezení klíče nesedí s doménou. |
| V Domácnosti pořád stojí, že sdílení není nastavené | Některá z šesti hodnot je prázdná, nebo build po jejich vyplnění neproběhl znovu. U varianty B: proměnné musí být *repository*, ne *environment*. |

## Přehled o používání aplikace

V aplikaci je obrazovka s počty: kolik je domácností, zařízení, dětí
a ochutnávek, jak jsou staré děti, jaká zařízení se připojila a které
suroviny se v denících objevují nejčastěji. Nikde na ni nevede odkaz
a v navigaci není.

Otevře se jen na adrese s tajným klíčem, tedy `#/x/<klíč>`. Každá jiná
adresa se chová jako překlep v odkazu: ukáže se „Taková stránka tu není“.
Rodič se tak o existenci přehledu vůbec nedozví.

Klíč není v repozitáři ani v hotovém balíku, je tam jen jeho otisk SHA-256
v `src/admin/tajnyOdkaz.ts`. Z otisku se klíč nedopočítá. Samotný klíč si
drž mimo repozitář; testy si ho berou z proměnné `DROBEK_ADMIN_KLIC`
a bez ní se ta část testů přeskočí.

Tajný odkaz je ale jen zámek na dveřích. Data chrání až pravidlo
`jsemSpravce()` ve `firestore.rules` a heslo k účtu, kterým se přehled
načítá. I kdyby klíč někdo znal, bez hesla neuvidí nic.

Když klíč chceš změnit, spočítej si nový otisk a přepiš ho ve zdroji:

```bash
python3 -c "import hashlib,secrets,string; \
k=''.join(secrets.choice(string.ascii_lowercase+string.digits) for _ in range(28)); \
print('klíč:', k); print('otisk:', hashlib.sha256(k.encode()).hexdigest())"
```

Zprovoznění:

1. Firebase konzole, **Authentication**, **Sign-in method**, zapni
   poskytovatele **Email/Password**.
2. Záložka **Users**, **Add user**, zadej svůj e-mail a silné heslo.
3. Zkontroluj, že e-mail v `firestore.rules` u `jsemSpravce()` sedí
   s tím, který jsi založil.
4. Publikuj pravidla (**Firestore Database**, **Rules**, **Publish**).
   Pravidla se z repozitáře nenasazují sama.

Ověřenou adresu pravidlo nechce. Účet založený v konzoli je neověřený
a konzole ověřovací e-mail poslat neumí, takže by ta podmínka jen bránila
v přihlášení. Adresu si vybírá správce projektu v pravidlech, ne ten, kdo
se přihlašuje, takže se tím nic neotevírá: kdokoli jiný má e-mail jiný
a dál neprojde.

Co je dobré vědět:

- **Heslo je to jediné, co ten výpis chrání.** Kdo ho zná, přečte si
  všechny dokumenty domácností, ne jen počty. Obrazovka sama ukazuje pouze
  souhrny a nic osobního nezobrazuje, ale technicky má přihlášený účet plné
  právo číst. Zacházej s heslem podle toho a nepoužívej ho nikde jinde.
- Přihlášení běží ve vlastní instanci Firebase, oddělené od té, kterou má
  aplikace pro rodiče. Anonymní účet zařízení se tím nepřepíše.
- Rodičovská část aplikace pravidlo nepotřebuje a nic se jí nemění.

## Náklady

Provoz téhle aplikace se vejde do bezplatné úrovně Firebase (Spark).
Jeden dokument na domácnost, několik zápisů denně. Platební kartu Firebase
pro Spark nevyžaduje.

## App Check — proti zakládání domácností skriptem

Tohle je nepovinný krok. Bez něj aplikace funguje, jen se spoléhá na to, že
o adresu projektu nikdo nezavadí.

**Proč:** přihlášení je anonymní a pravidlo na zakládání domácnosti zní
„stačí být přihlášený". Kdokoli si tedy skriptem může založit libovolný
počet dokumentů a účet pojede na kvótě Firebase. App Check k požadavku
přidá potvrzení, že jde ze skutečné aplikace v prohlížeči.

Zapíná se ve **dvou krocích a v tomhle pořadí** — obráceně si odřízneš
vlastní aplikaci od dat.

**Krok 1: klíč a zapnutí v aplikaci.**

1. V konzoli Firebase → *App Check* → *Apps* → vyber webovou aplikaci →
   poskytovatel **reCAPTCHA v3**. Konzole tě pošle zaregistrovat doménu
   `<nick>.github.io` a vrátí **site key**.
2. Klíč vlož jako proměnnou `VITE_RECAPTCHA_SITE_KEY` — stejným způsobem,
   jakým vkládáš `VITE_FIREBASE_*` (kapitola 7, varianta A nebo B).
3. Nasaď a otevři aplikaci. V konzoli Firebase → *App Check* → *Metrics*
   se během pár minut objeví ověřené požadavky.

Site key je veřejný, stejně jako `apiKey`. Patří do repozitáře i do
prohlížeče a není to tajemství.

**Krok 2: vyžádání v pravidlech.** Teprve až *Metrics* ukazují ověřené
požadavky a žádné neověřené, přidej do `firestore.rules` do funkce
`prihlaseny()` podmínku `request.app != null` a pravidla nahraj znovu.
Dokud v metrikách svítí neověřené požadavky, je mezi nimi nejspíš tvůj
vlastní telefon — pak by ho krok 2 odstřihl.

Vrátit se dá kdykoli: smaž podmínku z pravidel a nahraj je znovu.

## Správcovská adresa v pravidlech

`firestore.rules` má funkci `jsemSpravce()` s konkrétní e-mailovou
adresou. Je to veřejný repozitář, takže adresu vidí i roboti sbírající
e-maily. Bezpečnost tím netrpí (chrání ji heslo), ale za úvahu stojí:

- založit si na to vyhrazenou adresu, kterou nikde jinde nepoužíváš, nebo
- nastavit si přes Admin SDK vlastní příznak (`admin: true`) a v pravidlech
  se ptát na `request.auth.token.admin == true` místo na adresu.

Druhá varianta je čistší, ale vyžaduje jednorázové spuštění skriptu s
Admin SDK, tedy servisní klíč — a ten do repozitáře nepatří nikdy.
