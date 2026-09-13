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
2. Přezdívka aplikace: třeba `BLW web`.
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
| `update` | člen domácnosti; nebo nový člověk, který **přidá jen sám sebe** |
| `delete` | nikdo |

Větev „přidá jen sám sebe" je právě to připojení druhého telefonu: nikoho
neubere a přidat smí nejvýš jedno `uid`. Domácnost unese pět zařízení.

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
4. **Kopírovat odkaz** a pošli ho druhému člověku.
5. Ten odkaz otevře, klepne na **Připojit tohle zařízení** — a od té chvíle
   vidí stejný deník.

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
| `Missing or insufficient permissions` | Pravidla nejsou publikovaná, nebo je domácnost už plná (pět zařízení). |
| `auth/api-key-not-valid` | Překlep v `VITE_FIREBASE_API_KEY`, nebo omezení klíče nesedí s doménou. |
| V Domácnosti pořád stojí, že sdílení není nastavené | Některá z šesti hodnot je prázdná, nebo build po jejich vyplnění neproběhl znovu. U varianty B: proměnné musí být *repository*, ne *environment*. |

## Náklady

Provoz téhle aplikace se vejde do bezplatné úrovně Firebase (Spark).
Jeden dokument na domácnost, několik zápisů denně. Platební kartu Firebase
pro Spark nevyžaduje.
