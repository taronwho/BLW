# FIREBASE.md — nasazení Firestore pravidel a omezení API klíče

Aplikace funguje i **bez Firebase** — v lokálním režimu nad IndexedDB. Firebase
zapínáš jen kvůli tomu, aby oba telefony viděly tytéž ochutnávky.

Firebase web-konfigurace (`apiKey` a spol.) **není tajemství** — je z principu
viditelná v prohlížeči každého návštěvníka. Bezpečnost dělají Firestore
pravidla a omezení klíče na doménu, ne jeho skrytí. Do repozitáře ji přesto
nedáváme: zadává se v aplikaci v Nastavení a uloží se do prohlížeče, případně
do `.env.local` pro lokální vývoj (vzor je v `.env.local.example`).

## 1. Založení projektu

1. [console.firebase.google.com](https://console.firebase.google.com) → **Add project**.
   Google Analytics není potřeba.
2. V projektu **Add app → Web** (ikona `</>`). Hosting nezapínej, běžíme na GitHub Pages.
3. Opiš si zobrazenou konfiguraci — vložíš ji v aplikaci v Nastavení.

## 2. Firestore

1. **Build → Firestore Database → Create database**.
2. Region **eur3 (europe-west)**.
3. Start v *production mode* — pravidla hned nahradíme vlastními.

## 3. Anonymní přihlášení

**Build → Authentication → Get started → Sign-in method → Anonymous → Enable.**

Tohle je to, co umožní „bez hesel". Každý telefon dostane vlastní `uid`,
který se přidá do `members` dané domácnosti.

Pak **Authentication → Settings → Authorized domains → Add domain** a přidej
`<tvuj-nick>.github.io`. Bez toho přihlášení z Pages selže.

## 4. Nasazení pravidel

Pravidla jsou v repozitáři v souboru [`firestore.rules`](../firestore.rules).
Nenechávej databázi v test mode — ten po 30 dnech vyprší a do té doby je
otevřená komukoli.

### Varianta A — přes konzoli (bez instalace čehokoli)

1. **Firestore Database → Rules**.
2. Smaž obsah editoru a vlož celý obsah `firestore.rules`.
3. **Publish**.

### Varianta B — přes Firebase CLI

```bash
npm install -g firebase-tools
firebase login
firebase init firestore     # vyber existující projekt, jako soubor pravidel zadej firestore.rules
firebase deploy --only firestore:rules
```

### Co pravidla dělají

| Operace | Pravidlo | Proč |
|---|---|---|
| `get` | jen přihlášený | Kdo zná přesné 10znakové ID domácnosti, smí ho číst — capability model. |
| `list` | nikdy | Zákaz enumerace: bez zákazu by šlo projít všechny domácnosti. |
| `create` | `members == [uid]` | Nová domácnost může vzniknout jen se zakladatelem jako jediným členem. |
| `update` | `uid in members` a `members.size() <= 5` | Zapisovat smí jen člen a domácnost nejde nafouknout. |
| `delete` | nikdy | Smazání celé domácnosti z aplikace nepotřebujeme; data se exportují do JSON. |

Párovací kód má 10 znaků z Crockford Base32 (bez I, L, O, U), to je
32^10 ≈ 1,1 × 10^15 kombinací. Uhádnout cizí ID je tedy nereálné, ale
**kdo kód zná, ten dovnitř vidí** — proto ho posílej stejně opatrně jako heslo.

## 5. Omezení API klíče na doménu

Klíč je veřejný, ale nemá smysl nechat ho použitelný odkudkoli.

1. [console.cloud.google.com](https://console.cloud.google.com) → vyber tentýž projekt.
2. **APIs & Services → Credentials → API Keys →** klíč s názvem „Browser key (auto created by Firebase)".
3. **Application restrictions → Websites** a přidej:
   - `https://<tvuj-nick>.github.io/*`
   - `http://localhost:5173/*` (pro vývoj)
4. **API restrictions → Restrict key** a nech povolené jen:
   Identity Toolkit API, Token Service API, Cloud Firestore API.
5. **Save.** Změna se propíše do pár minut.

## 6. Ověření, že to funguje

1. Otevři aplikaci na prvním telefonu → **Domácnost → Založit domácnost**.
   Objeví se kód po pěticích, např. `K7M2X-9QRT4`, a QR kód.
2. Na druhém telefonu naskenuj QR (nebo kód přepiš) → **Připojit se**.
3. Na prvním telefonu zaznamenej ochutnávku. Na druhém se musí objevit do 5 vteřin.
4. Vypni na jednom telefonu síť, zaznamenej ochutnávku, zapni síť zpět.
   Záznam se dosynchronizuje a **žádný z obou záznamů se neztratí** —
   ochutnávky jsou append-only.

## 7. Když se něco nedaří

| Příznak | Příčina | Co s tím |
|---|---|---|
| `auth/unauthorized-domain` | Doména není v Authorized domains | Krok 3 |
| `permission-denied` při zápisu | Uživatel není v `members`, nebo běží pravidla z test mode | Zkontroluj krok 4 a že jsi připojený pod správným kódem |
| `permission-denied` hned po zadání kódu | Domácnost s tímhle kódem už existuje a ty v ní nejsi členem | Nech si poslat kód znovu, nebo založ novou domácnost |
| Data se nepropisují mezi telefony | Druhý telefon je v lokálním režimu | V Nastavení zkontroluj stav synchronizace |
| Aplikace po vypnutí sítě hlásí chybu | Nezapnutá offline cache | Firestore se inicializuje s `persistentLocalCache`, zkus tvrdé obnovení stránky |
