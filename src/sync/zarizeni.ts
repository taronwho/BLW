/**
 * Jak se tomuhle zařízení říká v seznamu domácnosti.
 *
 * Anonymní přihlášení váže uid na úložiště prohlížeče, ne na telefon. Jeden
 * mobil tak může v domácnosti figurovat několikrát: jednou jako nainstalovaná
 * aplikace, jednou jako Chrome a jednou jako vestavěný prohlížeč v Messengeru,
 * ve kterém rodič otevřel pozvánku. Z uid „A1B2C3" se nepozná, které z nich
 * je které, a rodič pak neví, co smí odebrat.
 *
 * Popis je jen vodítko pro člověka. Nic se podle něj nerozhoduje a nikam se
 * neposílá mimo vlastní domácnost.
 */

/** Vestavěné prohlížeče, které se do aplikace vejdou omylem. */
const VESTAVENE: readonly (readonly [RegExp, string])[] = [
  // Messenger i Facebook hlásí FBAN/FBAV; Messenger navíc MESSENGER.
  [/\bMESSENGER\b/i, 'Messengeru'],
  [/\bFB(AN|AV|_IAB)\b/i, 'Facebooku'],
  [/\bInstagram\b/i, 'Instagramu'],
  [/\bWhatsApp\b/i, 'WhatsAppu'],
  [/\bLine\//i, 'Line'],
  [/\bTwitter\b/i, 'X'],
];

const PROHLIZECE: readonly (readonly [RegExp, string])[] = [
  // Pořadí rozhoduje: Edge i Opera se v řetězci hlásí také jako Chrome.
  [/\bEdgA?\//i, 'Edge'],
  [/\bOPR\//i, 'Opera'],
  [/\bSamsungBrowser\//i, 'Samsung Internet'],
  [/\bFirefox\/|\bFxiOS\//i, 'Firefox'],
  [/\bCriOS\/|\bChrome\//i, 'Chrome'],
  [/\bSafari\//i, 'Safari'],
];

function ua(): string {
  return typeof navigator === 'undefined' ? '' : navigator.userAgent;
}

/** Běží aplikace nainstalovaná na ploše, ne na kartě prohlížeče? */
export function jeNainstalovana(): boolean {
  if (typeof window === 'undefined') return false;
  // iOS má vlastní příznak, ostatní hlásí režim zobrazení z manifestu.
  const iosStandalone = (navigator as { standalone?: boolean }).standalone === true;
  return (
    iosStandalone ||
    ['standalone', 'fullscreen', 'minimal-ui'].some(
      (rezim) => window.matchMedia?.(`(display-mode: ${rezim})`).matches === true,
    )
  );
}

/**
 * Název aplikace, jejíž vestavěný prohlížeč tohle je — nebo `null`.
 *
 * Právě v něm pozvánka z chatu obvykle skončí. Připojit se odtud jde, ale
 * spáruje se ten vestavěný prohlížeč, ne nainstalovaná aplikace.
 */
export function vestavenyProhlizec(): string | null {
  const text = ua();
  for (const [vzor, nazev] of VESTAVENE) {
    if (vzor.test(text)) return nazev;
  }
  return null;
}

export function popisZarizeni(): string {
  const vestaveny = vestavenyProhlizec();
  if (vestaveny !== null) return `Prohlížeč v ${vestaveny}`;
  if (jeNainstalovana()) return 'Nainstalovaná aplikace';
  const text = ua();
  for (const [vzor, nazev] of PROHLIZECE) {
    if (vzor.test(text)) return nazev;
  }
  return 'Prohlížeč';
}

/**
 * Všechny popisy, které `popisZarizeni` umí vrátit.
 *
 * Přehled o používání bere jen tyhle. Popis v dokumentu domácnosti smí
 * zapsat kterýkoli člen, takže by v něm teoreticky mohlo být cokoli —
 * a do anonymních počtů nesmí proniknout nic, co by napsal člověk.
 */
export const ZNAME_POPISY_ZARIZENI: ReadonlySet<string> = new Set([
  ...VESTAVENE.map(([, nazev]) => `Prohlížeč v ${nazev}`),
  'Nainstalovaná aplikace',
  ...PROHLIZECE.map(([, nazev]) => nazev),
  'Prohlížeč',
]);
