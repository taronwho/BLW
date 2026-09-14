import type { ReactNode } from 'react';
import { C } from './palette';

/**
 * Kresby ikon surovin na plátně 64 × 64.
 *
 * Proč vlastní kresba a ne emoji: emoji pokrývá běžné světové potraviny, ne
 * českou spíž. Nemá červenou řepu, ředkvičku, tvaroh, čočku ani sušené
 * brusinky, takže katalog používal náhradu — fazoli za čočku i za brusinky,
 * muchomůrku za žampiony, olivu za řepu. Kontrola v scripts/audit-icons.ts
 * to vypisuje po kategoriích.
 *
 * Pravidla kresby, aby sada držela pohromadě:
 *  - ploché barvy z palette.ts, žádné přechody ani obrysy,
 *  - motiv vyplní zhruba 52 × 52 uprostřed plátna,
 *  - čitelnost na 20 px rozhoduje: raději tři velké tvary než deset malých.
 */

/**
 * Nať, kterou sdílí kořenová zelenina.
 *
 * Úmyslně obyčejná funkce, ne komponenta: soubor vyváží data (mapu kreseb),
 * takže by mu komponenta uvnitř rozbila hot reload.
 */
function nat(posun = 0, barva: string = C.zelen): ReactNode {
  return (
    <g transform={`translate(0 ${posun})`}>
      <path d="M32 24c0-8-6-14-12-13-1 8 5 13 12 13Z" fill={barva} />
      <path d="M32 24c0-8 6-14 12-13 1 8-5 13-12 13Z" fill={C.zelenSvetla} />
      <rect x="30.5" y="18" width="3" height="9" rx="1.5" fill={C.zelenTmava} />
    </g>
  );
}

/** Rozmístění zrn v hromádce. Stejné u všech sypkých surovin, ať drží sadu
 *  pohromadě; liší se jen tvar a barva samotného zrna. */
const mistaVHromadce: readonly [number, number, number][] = [
  [18, 43, -18],
  [31, 45, 8],
  [44, 43, 16],
  [24, 34, 24],
  [38, 34, -14],
  [31, 25, 4],
  [49, 34, -28],
  [14, 33, 30],
];

/** Hromádka zrn; `zrno` dostane střed a natočení. */
function hromadka(zrno: (x: number, y: number, uhel: number, i: number) => ReactNode): ReactNode {
  return <>{mistaVHromadce.map(([x, y, u], i) => zrno(x, y, u, i))}</>;
}

/** Fazole: krátký tlustý oblouk. Čitelnější než přesný obrys ledviny,
 *  protože na 20 px z obrysu stejně zbude jen zakřivená skvrna. */
function fazole(
  x: number,
  y: number,
  uhel: number,
  barva: string,
  klic: number,
  /** Světlá fazole potřebuje obrys, jinak na světlém podkladu zmizí. */
  obrys?: string,
): ReactNode {
  const d = `M${x - 7} ${y + 3}Q${x} ${y - 8} ${x + 7} ${y + 3}`;
  const otoc = `rotate(${uhel} ${x} ${y})`;
  return (
    <g key={klic} transform={otoc}>
      {obrys !== undefined && (
        <path d={d} stroke={obrys} strokeWidth="10" strokeLinecap="round" fill="none" />
      )}
      <path d={d} stroke={barva} strokeWidth="7.5" strokeLinecap="round" fill="none" />
    </g>
  );
}

/** Plátek masa: zaoblený tvar s okrajem tuku a žilkováním. */
function platek(maso: string, tuk: string, zilky: string): ReactNode {
  return (
    <>
      <path d="M14 26c4-8 14-12 22-11 10 1 16 7 15 15-1 9-8 17-18 18-9 1-18-4-20-11-2-4-1-8 1-11Z" fill={tuk} />
      <path d="M19 28c3-6 11-9 17-8 8 1 12 5 11 11-1 7-6 13-14 14-7 1-14-3-15-8-2-3-1-6 1-9Z" fill={maso} />
      <path d="M25 30c3 3 5 7 6 11M34 29c2 4 3 8 3 12M40 33c0 4-1 7-2 10" stroke={zilky} strokeWidth="2" strokeLinecap="round" fill="none" />
    </>
  );
}

/** Stehno: palička s kostí u užšího konce. */
function palicka(maso: string, stin: string): ReactNode {
  return (
    <>
      <path d="M40 12c8 0 13 7 13 16 0 11-9 20-20 20-8 0-14-5-14-12 0-9 4-15 9-19 3-3 7-5 12-5Z" fill={maso} />
      <path d="M44 20c4 2 5 7 4 12" stroke={stin} strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M22 45l-8 8" stroke={C.krem} strokeWidth="8" strokeLinecap="round" fill="none" />
      <circle cx="12" cy="52" r="6" fill={C.bila} />
      <circle cx="17" cy="57" r="5" fill={C.bila} />
    </>
  );
}

/** Celá ryba z profilu; `znaky` doplní pruhy nebo skvrny daného druhu. */
function ryba(telo: string, brich: string, znaky?: ReactNode): ReactNode {
  return (
    <>
      <path d="M50 32c4-5 8-8 10-8 1 5 1 11 0 16-2 0-6-3-10-8Z" fill={telo} />
      <path d="M8 32c0-9 10-16 22-16s20 7 20 16-8 16-20 16S8 41 8 32Z" fill={telo} />
      <path d="M12 36c4 6 12 10 20 10 8 0 15-3 18-8-3 6-10 10-18 10-9 0-16-4-20-12Z" fill={brich} />
      <path d="M26 16c2-5 6-8 9-8 1 4 0 7-2 9l-7-1Z" fill={telo} />
      {znaky}
      <circle cx="17" cy="28" r="2.6" fill="#20262A" />
    </>
  );
}

/** Filet: klín s viditelnými svalovými pruhy. */
function filet(maso: string, pruhy: string, kuze?: string): ReactNode {
  return (
    <>
      <path d="M6 40c2-10 14-18 28-19 12-1 22 3 24 9 2 7-6 15-19 18-14 3-30 0-33-8Z" fill={maso} />
      {kuze !== undefined && (
        <path d="M6 40c-1-3 0-6 2-9 8 5 22 7 34 4 6-1 11-4 15-7 1 2 1 4 1 6-4 4-11 7-19 9-14 3-30 0-33-3Z" fill={kuze} />
      )}
      <path d="M18 26c1 6 1 12 0 17M28 22c1 7 1 14 0 20M38 22c1 6 1 12 0 17M47 25c1 5 1 9 0 13" stroke={pruhy} strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>
  );
}

/** Sýrový klín: tělo, kůrka na zadní hraně a volitelná struktura. */
function klin(telo: string, kura: string, znaky?: ReactNode): ReactNode {
  return (
    <>
      <path d="M8 46L48 14c6 0 8 3 8 7v25H12a4 4 0 0 1-4-4v4Z" fill={kura} />
      <path d="M8 46L46 17c5 0 7 2 7 6v23H11a3 3 0 0 1-3-3v3Z" fill={telo} />
      {znaky}
    </>
  );
}

/** Kelímek s hladkým obsahem; liší se barvou a tím, co je na povrchu. */
function kelimek(obsah: string, vicko: string, navrch?: ReactNode): ReactNode {
  return (
    <>
      <path d="M16 24h32l-4 28a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4L16 24Z" fill={vicko} />
      <path d="M21 30h22l-3 22H24l-3-22Z" fill={obsah} />
      <path d="M14 20h36v6H14Z" fill={vicko} />
      {navrch}
    </>
  );
}

/** Sklenice s máslem či pastou; `znak` je plod, podle kterého se pozná. */
function sklenice(obsah: string, znak: ReactNode): ReactNode {
  return (
    <>
      <path d="M20 22h24v30a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4V22Z" fill={C.bilaStin} />
      <path d="M23 28h18v24H23V28Z" fill={obsah} />
      <path d="M18 14h28v8H18Z" fill={C.hnedaSvetla} />
      {znak}
    </>
  );
}

/** Láhev oleje; `znak` je plod, ze kterého se lisuje. */
function lahev(olej: string, znak: ReactNode): ReactNode {
  return (
    <>
      <path d="M26 10h12v10l6 10v22a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4V30l6-10V10Z" fill={C.bilaStin} />
      <path d="M23 32h18v20a2 2 0 0 1-2 2H25a2 2 0 0 1-2-2V32Z" fill={olej} />
      <path d="M25 8h14v5H25Z" fill={C.hnedaSvetla} />
      {znak}
    </>
  );
}

/** Mletá surovina: nízká hromádka prášku pod celým plodem. */
function mleto(barva: string): ReactNode {
  return (
    <path d="M8 54c0-5 5-9 11-10 4-4 8-6 13-6s9 2 13 6c6 1 11 5 11 10H8Z" fill={barva} />
  );
}

/** Hromádka mletého koření pod celým plodem. */
function prasek(barva: string, svetlejsi: string): ReactNode {
  return (
    <>
      <path d="M6 54c0-6 6-11 12-12 4-5 9-8 14-8s10 3 14 8c6 1 12 6 12 12H6Z" fill={barva} />
      <path d="M14 50c6-4 14-6 20-5" stroke={svetlejsi} strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>
  );
}

/** Krabice rostlinného nápoje; `znak` je surovina, ze které se vyrábí. */
function krabice(pasek: string, znak: ReactNode): ReactNode {
  return (
    <>
      <path d="M20 20h24v34a3 3 0 0 1-3 3H23a3 3 0 0 1-3-3V20Z" fill={C.bila} />
      <path d="M20 20h24v34a3 3 0 0 1-3 3H23a3 3 0 0 1-3-3V20Z" fill="none" stroke={C.bilaStin} strokeWidth="2" />
      <path d="M20 20l6-11h12l6 11H20Z" fill={pasek} />
      <path d="M20 30h24v4H20Z" fill={pasek} />
      {znak}
    </>
  );
}

export const SHAPES: Record<string, ReactNode> = {
  // ── dávka 7: ořechy, semínková pasta a olej ───────────────────────────
  'liskove-orechy': (
    <>
      <circle cx="32" cy="36" r="18" fill="#A9793F" />
      <path d="M32 18c9 0 15 6 16 13-4-5-9-7-16-7s-12 2-16 7c1-7 7-13 16-13Z" fill="#6E4A22" />
      <path d="M32 18v-7" stroke="#4E3416" strokeWidth="4" strokeLinecap="round" />
      <path d="M24 40c3 4 11 4 15 0" stroke="#8A5F2E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>
  ),
  'kesu-orechy': (
    <>
      <path d="M14 26c10-10 26-9 33 1 5 8 1 18-9 18-7 0-10-6-15-6s-8 4-12 1c-5-4-3-10 3-14Z" fill="#E0C193" stroke="#B2915F" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M22 30c8-5 17-4 21 3" stroke="#B2915F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>
  ),
  arasidy: (
    <>
      <path d="M32 8c7 0 11 5 11 10 0 4-3 6-3 9s3 5 3 9c0 6-4 12-11 12s-11-6-11-12c0-4 3-6 3-9s-3-5-3-9c0-5 4-10 11-10Z" fill="#D3A76C" stroke="#A87E45" strokeWidth="2.5" />
      <path d="M23 18c6-2 12-2 18 0M23 30c6-2 12-2 18 0M23 42c6-2 12-2 18 0" stroke="#A87E45" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>
  ),
  pistacie: (
    <>
      <path d="M12 30c8-9 32-9 40 0 3 4 1 9-4 10-8 2-24 2-32 0-5-1-7-6-4-10Z" fill="#E0D2B0" stroke="#B8A87E" strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="32" cy="38" rx="13" ry="9" fill="#8FAE55" />
      <path d="M24 36c5-3 11-3 16 0" stroke="#6E8C3A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>
  ),
  'para-orechy': (
    <>
      <path d="M18 14h28l-8 38a5 5 0 0 1-5 4h-2a5 5 0 0 1-5-4L18 14Z" fill="#6E4A22" />
      <path d="M24 20h16l-6 28h-4l-6-28Z" fill="#A8794A" />
      <path d="M18 14h28l-4 6H22l-4-6Z" fill="#4E3416" />
    </>
  ),
  'pekanove-orechy': (
    <>
      <ellipse cx="32" cy="32" rx="13" ry="22" fill="#9E6836" />
      <path d="M32 10v44" stroke="#6E4522" strokeWidth="3" />
      <path d="M26 16c-3 8-3 24 0 32M38 16c3 8 3 24 0 32" stroke="#C08F5A" strokeWidth="2.5" fill="none" />
    </>
  ),
  'makadamove-orechy': (
    <>
      <circle cx="32" cy="34" r="19" fill="#EDE2CC" stroke="#B8A784" strokeWidth="3" />
      <path d="M32 15v38" stroke="#B8A784" strokeWidth="3" />
      <path d="M22 24c-3 6-3 14 0 20" stroke="#D6C8A8" strokeWidth="3" fill="none" />
    </>
  ),
  'piniove-orisky': hromadka((x, y, u, i) => (
    <ellipse key={i} cx={x} cy={y} rx="3" ry="6" transform={`rotate(${u} ${x} ${y})`} fill={i % 2 === 0 ? '#E2D2AE' : '#C9B58C'} stroke="#A8946C" strokeWidth="1.2" />
  )),
  'slunecnicove-maslo': sklenice('#C9A552', (
    <>
      <circle cx="32" cy="20" r="5" fill={C.zlutaTmava} />
      <path d="M32 12v4M32 24v4M24 20h4M36 20h4M26 14l3 3M38 14l-3 3M26 26l3-3M38 26l-3-3" stroke={C.zluta} strokeWidth="2.5" strokeLinecap="round" />
    </>
  )),
  'olej-slunecnicovy': lahev(C.zluta, (
    <>
      <circle cx="32" cy="16" r="4" fill={C.zlutaTmava} />
      <path d="M32 9v4M32 19v4M25 16h4M35 16h4" stroke={C.zluta} strokeWidth="2.5" strokeLinecap="round" />
    </>
  )),

  // ── dávka 6: ovoce ────────────────────────────────────────────────────
  grapefruit: (
    <>
      <circle cx="32" cy="34" r="21" fill="#E8A07A" />
      <circle cx="32" cy="34" r="16" fill="#E8687A" />
      <path d="M32 18v32M18 34h28M21 23l22 22M43 23L21 45" stroke="#F6D8D0" strokeWidth="2.5" />
      <circle cx="32" cy="34" r="3" fill="#F6D8D0" />
    </>
  ),
  pomelo: (
    <>
      <circle cx="32" cy="34" r="22" fill="#D7DC9E" />
      <circle cx="32" cy="34" r="15" fill="#F0E9C0" />
      <path d="M32 19v30M17 34h30M22 24l20 20M42 24L22 44" stroke="#C3C982" strokeWidth="2.5" />
    </>
  ),
  'meloun-zluty': (
    <>
      <path d="M8 42c0-13 11-22 24-22s24 9 24 22H8Z" fill="#E8DF9C" />
      <path d="M12 42c0-11 9-18 20-18s20 7 20 18H12Z" fill="#F2E9B8" />
      <path d="M8 42h48v4a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3v-4Z" fill="#BFC77E" />
    </>
  ),
  lici: (
    <>
      <circle cx="32" cy="36" r="18" fill="#CE4B52" />
      <circle cx="24" cy="30" r="2.5" fill="#A93238" />
      <circle cx="33" cy="26" r="2.5" fill="#A93238" />
      <circle cx="41" cy="33" r="2.5" fill="#A93238" />
      <circle cx="29" cy="42" r="2.5" fill="#A93238" />
      <circle cx="39" cy="44" r="2.5" fill="#A93238" />
      <path d="M32 18c-1-5-3-8-6-10 5 1 8 4 9 9" fill={C.zelenTmava} />
    </>
  ),
  'granatove-jablko': (
    <>
      <circle cx="32" cy="36" r="19" fill="#B93A46" />
      <path d="M32 17l-4-8h8l-4 8Z" fill={C.zelenTmava} />
      <circle cx="26" cy="33" r="3.5" fill="#E2606A" />
      <circle cx="36" cy="31" r="3.5" fill="#E2606A" />
      <circle cx="31" cy="41" r="3.5" fill="#E2606A" />
      <circle cx="40" cy="40" r="3" fill="#E2606A" />
      <circle cx="23" cy="42" r="3" fill="#E2606A" />
    </>
  ),
  mucenka: (
    <>
      <circle cx="32" cy="34" r="20" fill="#6E4A63" />
      <circle cx="32" cy="34" r="14" fill="#E8B04A" />
      <circle cx="27" cy="31" r="2.2" fill="#4A3140" />
      <circle cx="36" cy="32" r="2.2" fill="#4A3140" />
      <circle cx="31" cy="39" r="2.2" fill="#4A3140" />
      <circle cx="38" cy="39" r="2" fill="#4A3140" />
    </>
  ),
  'kokos-strouhany': hromadka((x, y, u, i) => (
    <rect key={i} x={x - 5} y={y - 1.6} width="10" height="3.2" rx="1.6" transform={`rotate(${u} ${x} ${y})`} fill={i % 2 === 0 ? C.bila : C.bilaStin} stroke={C.kremTmavy} strokeWidth="1.2" />
  )),
  'brusinky-cerstve': (
    <>
      {fazole(21, 40, 0, '#C0303A', 1, '#8E2028')}
      {fazole(42, 41, 0, '#D44A52', 2, '#8E2028')}
      {fazole(32, 26, 0, '#C0303A', 3, '#8E2028')}
    </>
  ),
  aronie: hromadka((x, y, _u, i) => (
    <g key={i}>
      <circle cx={x} cy={y} r="6" fill={i % 2 === 0 ? '#3F2A46' : '#553A5C'} />
      <circle cx={x - 1.6} cy={y - 1.8} r="1.8" fill="#7A5A82" />
    </g>
  )),
  rakytnik: hromadka((x, y, _u, i) => (
    <g key={i}>
      <circle cx={x} cy={y} r="6" fill={i % 2 === 0 ? '#E8912A' : '#CE7418'} />
      <circle cx={x - 1.6} cy={y - 1.8} r="1.8" fill="#F6C06A" />
    </g>
  )),

  // ── dávka 5: ryby a mořské plody ──────────────────────────────────────
  platys: (
    <>
      <ellipse cx="32" cy="34" rx="22" ry="15" fill="#8E9AA4" />
      <ellipse cx="32" cy="34" rx="15" ry="9" fill="#AAB6C0" />
      <circle cx="22" cy="29" r="2.5" fill={C.hnedaTmava} />
      <circle cx="28" cy="28" r="2.5" fill={C.hnedaTmava} />
      <path d="M54 34l8-7v14l-8-7Z" fill="#6F7B85" />
    </>
  ),
  kambala: (
    <>
      <ellipse cx="32" cy="34" rx="21" ry="17" fill="#7F7466" />
      <circle cx="24" cy="28" r="3" fill={C.krem} />
      <circle cx="34" cy="25" r="2.5" fill={C.krem} />
      <circle cx="40" cy="36" r="2.5" fill={C.krem} />
      <circle cx="27" cy="41" r="2.5" fill={C.krem} />
      <path d="M53 34l9-6v12l-9-6Z" fill="#5F564B" />
    </>
  ),
  'morsky-vlk': ryba('#93A3AE', '#D7DEE3', <path d="M20 30c6-3 12-3 18 0" stroke="#6E7C86" strokeWidth="2.5" strokeLinecap="round" fill="none" />),
  prazma: ryba('#C9C3AE', '#EFEADC', <path d="M24 26c3 1 5 3 6 6" stroke={C.zlutaTmava} strokeWidth="3" strokeLinecap="round" fill="none" />),
  'okoun-ricni': ryba('#7E8C4E', '#D5D9B4', <path d="M22 24v16M28 23v18M34 24v16" stroke="#4E5A2C" strokeWidth="2.5" strokeLinecap="round" fill="none" />),
  kalamary: (
    <>
      <path d="M32 10c7 0 11 6 11 13 0 5-2 9-4 11h-14c-2-2-4-6-4-11 0-7 4-13 11-13Z" fill="#E2A6A6" />
      <path d="M25 34c-1 8-3 14-6 18M29 34c-1 9-2 15-3 19M35 34c1 9 2 15 3 19M39 34c1 8 3 14 6 18" stroke="#C97F7F" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="27" cy="22" r="2.5" fill={C.hnedaTmava} />
      <circle cx="37" cy="22" r="2.5" fill={C.hnedaTmava} />
    </>
  ),
  hrebenatky: (
    <>
      <path d="M32 52c-13 0-21-9-21-19 0-5 3-9 7-9 2-4 7-6 14-6s12 2 14 6c4 0 7 4 7 9 0 10-8 19-21 19Z" fill={C.krem} stroke={C.kremTmavy} strokeWidth="2" />
      <path d="M32 20v30M22 24c-2 9-1 18 3 25M42 24c2 9 1 18-3 25" stroke={C.kremTmavy} strokeWidth="2.5" fill="none" />
    </>
  ),
  'krabi-maso-bile': (
    <>
      <ellipse cx="32" cy="36" rx="15" ry="11" fill="#D9694F" />
      <path d="M17 32c-5-2-9-6-10-11 4 1 8 4 10 8M47 32c5-2 9-6 10-11-4 1-8 4-10 8" fill="#C0523A" />
      <path d="M20 46c-4 3-7 6-9 10M44 46c4 3 7 6 9 10" stroke="#C0523A" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="27" cy="33" r="2" fill={C.bila} />
      <circle cx="37" cy="33" r="2" fill={C.bila} />
    </>
  ),
  'tunak-v-konzerve': (
    <>
      <ellipse cx="32" cy="22" rx="18" ry="6" fill={C.seda} />
      <path d="M14 22h36v24a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6V22Z" fill={C.sedaTmava} />
      <path d="M18 28h28v18H18V28Z" fill="#C4756A" />
      <path d="M22 36c4-3 8-3 12 0M28 42c4-3 8-3 12 0" stroke="#8E4A42" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <ellipse cx="32" cy="22" rx="13" ry="4" fill={C.bilaStin} />
    </>
  ),
  ancovicky: (
    <>
      <path d="M8 34c8-6 16-8 24-8s16 2 24 8c-8 6-16 8-24 8s-16-2-24-8Z" fill="#8E7F70" />
      <path d="M8 34c8-4 16-5 24-5s16 1 24 5" stroke="#B5A797" strokeWidth="2.5" fill="none" />
      <circle cx="18" cy="33" r="2" fill={C.bila} />
      <circle cx="24" cy="44" r="2" fill={C.bilaStin} />
      <circle cx="40" cy="24" r="2" fill={C.bilaStin} />
      <circle cx="46" cy="43" r="2" fill={C.bilaStin} />
    </>
  ),

  // ── dávka 4: mouky, vločky a bezlepkové základy ───────────────────────
  'mouka-ryzova': (
    <>
      <path d="M6 54c0-6 6-11 12-12 4-5 9-8 14-8s10 3 14 8c6 1 12 6 12 12H6Z" fill={C.bila} stroke={C.kremTmavy} strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="26" cy="46" rx="4" ry="2.4" transform="rotate(-18 26 46)" fill={C.kremTmavy} />
      <ellipse cx="38" cy="48" rx="4" ry="2.4" transform="rotate(14 38 48)" fill={C.kremTmavy} />
    </>
  ),
  'mouka-kukuricna': prasek(C.zluta, C.krem),
  'mouka-pohankova': prasek('#9C8168', '#C0A98E'),
  'mouka-ovesna': prasek(C.kremTmavy, C.krem),
  'mouka-sojova': prasek('#C8B87A', '#E2D6A8'),
  'jecne-vlocky': hromadka((x, y, u, i) => (
    <ellipse key={i} cx={x} cy={y} rx="6" ry="3.5" transform={`rotate(${u} ${x} ${y})`} fill={i % 2 === 0 ? '#D9C79A' : '#BFA97A'} />
  )),
  'spaldove-vlocky': hromadka((x, y, u, i) => (
    <ellipse key={i} cx={x} cy={y} rx="6" ry="3.5" transform={`rotate(${u} ${x} ${y})`} fill={i % 2 === 0 ? '#C9A876' : '#A98A5C'} />
  )),
  'ryzove-nudle': (
    <>
      <path d="M14 20c6 8 6 20 0 30M24 18c6 8 6 22 0 32M34 18c6 8 6 22 0 32M44 20c6 8 6 20 0 30" stroke={C.kremTmavy} strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M14 20c6 8 6 20 0 30M24 18c6 8 6 22 0 32M34 18c6 8 6 22 0 32M44 20c6 8 6 20 0 30" stroke={C.krem} strokeWidth="4" strokeLinecap="round" fill="none" />
    </>
  ),
  'tapiokovy-skrob': (
    <>
      <path d="M6 54c0-6 6-11 12-12 4-5 9-8 14-8s10 3 14 8c6 1 12 6 12 12H6Z" fill={C.bila} stroke={C.seda} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="24" cy="45" r="4" fill={C.bila} stroke={C.sedaTmava} strokeWidth="2" />
      <circle cx="39" cy="47" r="4" fill={C.bila} stroke={C.sedaTmava} strokeWidth="2" />
      <circle cx="32" cy="40" r="4" fill={C.bila} stroke={C.sedaTmava} strokeWidth="2" />
    </>
  ),
  'kukuricne-lupinky': hromadka((x, y, u, i) => (
    <path key={i} d={`M${x - 5} ${y}c1-4 4-5 5-5s4 1 5 5c-1 3-4 4-5 4s-4-1-5-4Z`} transform={`rotate(${u} ${x} ${y})`} fill={i % 2 === 0 ? '#E5B84A' : '#C99A34'} />
  )),

  // ── dávka 3: plísňové sýry, kysané mléčné, zelenina ───────────────────
  hermelin: (
    <>
      <circle cx="32" cy="34" r="20" fill={C.bila} stroke={C.bilaStin} strokeWidth="2" />
      <path d="M32 14a20 20 0 0 1 17 30H15a20 20 0 0 1 17-30Z" fill={C.krem} opacity="0.5" />
      <path d="M22 30c3-2 6-2 9 0M36 40c3-2 6-2 9 0M26 42c2-2 5-2 7 0" stroke={C.bilaStin} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M32 34l12 12a17 17 0 0 1-24 0l12-12Z" fill={C.zluta} opacity="0.35" />
    </>
  ),
  niva: (
    <>
      {klin(C.bila, C.bilaStin)}
      <circle cx="30" cy="36" r="3" fill="#4A6B8A" />
      <circle cx="39" cy="42" r="2.5" fill="#3A5570" />
      <circle cx="34" cy="46" r="2.5" fill="#4A6B8A" />
      <circle cx="42" cy="34" r="2" fill="#3A5570" />
    </>
  ),
  'kozi-syr-zrajici': (
    <>
      <ellipse cx="32" cy="36" rx="17" ry="15" fill={C.bila} stroke={C.hnedaSvetla} strokeWidth="2.5" />
      <ellipse cx="32" cy="36" rx="9" ry="8" fill={C.kremTmavy} />
      <path d="M24 28c-3-2-4-5-3-8M40 28c3-2 4-5 3-8" stroke={C.hnedaSvetla} strokeWidth="3" strokeLinecap="round" fill="none" />
    </>
  ),
  podmasli: krabice(
    C.zlutaTmava,
    <>
      <ellipse cx="32" cy="44" rx="10" ry="8" fill={C.krem} stroke={C.hnedaSvetla} strokeWidth="2" />
      <path d="M27 44c3-3 7-3 10 0" stroke={C.hnedaSvetla} strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>,
  ),
  'acidofilni-mleko': kelimek(C.bila, C.zelenBleda, <path d="M26 38c4-3 8-3 12 0" stroke={C.zelen} strokeWidth="2.5" strokeLinecap="round" fill="none" />),
  'vejce-kreplci': (
    <>
      <ellipse cx="24" cy="38" rx="9" ry="12" fill={C.krem} />
      <ellipse cx="41" cy="34" rx="9" ry="12" fill={C.bila} />
      <circle cx="22" cy="34" r="2" fill={C.hneda} />
      <circle cx="27" cy="42" r="1.8" fill={C.hneda} />
      <circle cx="21" cy="44" r="1.5" fill={C.hnedaTmava} />
      <circle cx="39" cy="30" r="2" fill={C.hneda} />
      <circle cx="44" cy="38" r="1.8" fill={C.hnedaTmava} />
    </>
  ),
  'creme-fraiche': kelimek(
    C.bila,
    C.hneda,
    <path d="M24 40c3-5 7-7 8-12 1 5 5 7 8 12-2 5-6 7-8 7s-6-2-8-7Z" fill={C.bila} stroke={C.hnedaSvetla} strokeWidth="2" />,
  ),
  'zeli-cervene': (
    <>
      <circle cx="32" cy="34" r="20" fill="#7C3A78" />
      <path d="M32 14c-7 6-10 13-10 20s3 13 10 20" stroke="#A85FA0" strokeWidth="3" fill="none" />
      <path d="M32 14c7 6 10 13 10 20s-3 13-10 20" stroke="#A85FA0" strokeWidth="3" fill="none" />
      <path d="M12 34h40" stroke="#5E2A5C" strokeWidth="2.5" />
    </>
  ),
  'jarni-cibulka': (
    <>
      <path d="M28 52c0-4 1-7 2-9h4c1 2 2 5 2 9-1 2-3 3-4 3s-3-1-4-3Z" fill={C.bila} />
      <path d="M30 44c-2-10-6-18-10-24 5 2 9 8 11 16M34 44c2-10 6-18 10-24-5 2-9 8-11 16" fill={C.zelen} />
      <path d="M31 44c-1-12-1-22 1-30 2 8 2 18 1 30Z" fill={C.zelenTmava} />
    </>
  ),
  salotka: (
    <>
      <path d="M32 20c8 0 13 8 13 17s-6 15-13 15-13-6-13-15 5-17 13-17Z" fill="#C08A6E" />
      <path d="M32 20c3 0 5 8 5 17s-2 15-5 15" stroke="#9E6B52" strokeWidth="2.5" fill="none" />
      <path d="M32 20c-3 0-5 8-5 17s2 15 5 15" stroke="#9E6B52" strokeWidth="2.5" fill="none" />
      <path d="M30 20c-1-5-2-8-4-10 3 1 5 4 6 9M34 20c1-5 2-8 4-10-3 1-5 4-6 9" fill={C.zelenTmava} />
    </>
  ),

  // ── dávka 2: rajčatové základy, mletá masa, luštěniny ─────────────────
  'rajcatovy-protlak': (
    <>
      <path d="M22 22h20v30a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4V22Z" fill={C.bilaStin} />
      <path d="M25 28h14v24H25V28Z" fill="#B93326" />
      <path d="M24 14h16v8H24Z" fill={C.sedaTmava} />
      <path d="M32 36c3 0 5 2 5 5s-2 5-5 5-5-2-5-5 2-5 5-5Z" fill="#E0563F" />
      <path d="M32 34c1-2 3-3 5-3-1 2-3 3-5 3Z" fill={C.zelen} />
    </>
  ),
  'rajcata-loupana-konzerva': (
    <>
      <ellipse cx="32" cy="20" rx="18" ry="6" fill={C.seda} />
      <path d="M14 20h36v28a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6V20Z" fill={C.sedaTmava} />
      <path d="M18 26h28v20H18V26Z" fill="#C23A2B" />
      <circle cx="26" cy="34" r="5" fill="#E0563F" />
      <circle cx="38" cy="40" r="5" fill="#E0563F" />
      <ellipse cx="32" cy="20" rx="13" ry="4" fill={C.bilaStin} />
    </>
  ),
  cedar: klin('#E8A33C', '#C9812A'),
  'kureci-mlete': (
    <>
      <path d="M10 44c0-5 4-9 9-11 3-6 8-9 13-9s10 3 13 9c5 2 9 6 9 11 0 4-11 8-22 8s-22-4-22-8Z" fill="#E8CDA8" />
      <path d="M18 40c4-3 8-4 12-3M28 32c4-2 8-2 12 0M34 42c4-2 8-3 12-2M20 46c5-2 9-2 13-1" stroke="#C2A175" strokeWidth="3" strokeLinecap="round" fill="none" />
    </>
  ),
  'kruti-mlete': (
    <>
      <path d="M10 44c0-5 4-9 9-11 3-6 8-9 13-9s10 3 13 9c5 2 9 6 9 11 0 4-11 8-22 8s-22-4-22-8Z" fill="#D8A88E" />
      <path d="M18 40c4-3 8-4 12-3M28 32c4-2 8-2 12 0M34 42c4-2 8-3 12-2M20 46c5-2 9-2 13-1" stroke="#B07E62" strokeWidth="3" strokeLinecap="round" fill="none" />
    </>
  ),
  'veprove-mlete': (
    <>
      <path d="M10 44c0-5 4-9 9-11 3-6 8-9 13-9s10 3 13 9c5 2 9 6 9 11 0 4-11 8-22 8s-22-4-22-8Z" fill="#E09A9A" />
      <path d="M18 40c4-3 8-4 12-3M28 32c4-2 8-2 12 0M34 42c4-2 8-3 12-2M20 46c5-2 9-2 13-1" stroke="#BC6B6B" strokeWidth="3" strokeLinecap="round" fill="none" />
    </>
  ),
  strouhanka: hromadka((x, y, u, i) => (
    <rect key={i} x={x - 3} y={y - 2.5} width="6" height="5" rx="1.5" transform={`rotate(${u} ${x} ${y})`} fill={i % 2 === 0 ? '#D3A96B' : '#B98A4E'} />
  )),
  'tortilla-psenicna': (
    <>
      <circle cx="32" cy="32" r="22" fill={C.krem} stroke={C.kremTmavy} strokeWidth="2" />
      <circle cx="24" cy="26" r="3" fill={C.kremTmavy} />
      <circle cx="39" cy="30" r="2.5" fill={C.kremTmavy} />
      <circle cx="30" cy="40" r="3" fill={C.kremTmavy} />
      <circle cx="41" cy="42" r="2" fill={C.kremTmavy} />
    </>
  ),
  'fazole-cerne': (
    <>
      {fazole(20, 40, -12, '#3B3138', 1, '#211A20')}
      {fazole(42, 42, 14, '#4A3F47', 2, '#211A20')}
      {fazole(31, 26, -4, '#3B3138', 3, '#211A20')}
    </>
  ),
  'cocka-zelena': hromadka((x, y, _u, i) => (
    <g key={i}>
      <circle cx={x} cy={y} r="5" fill={i % 2 === 0 ? '#6F8A43' : '#55703A'} />
      <path d={`M${x - 3.4} ${y}a3.4 3.4 0 0 1 6.8 0`} fill="#93AC63" />
    </g>
  )),

  // ── sladidla, dochucovadla a nápoje ───────────────────────────────────
  med: (
    <>
      <path d="M22 18h20l4 8v26a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4V26l4-8Z" fill={C.bilaStin} />
      <path d="M21 30h22v22a2 2 0 0 1-2 2H23a2 2 0 0 1-2-2V30Z" fill={C.zluta} />
      <path d="M32 34l4 2v5l-4 2-4-2v-5l4-2Z" fill={C.zlutaTmava} />
      <path d="M24 16h16v4H24Z" fill={C.hnedaSvetla} />
    </>
  ),
  sul: (
    <>
      <path d="M21 24h22v28a5 5 0 0 1-5 5H26a5 5 0 0 1-5-5V24Z" fill={C.bila} stroke={C.bilaStin} strokeWidth="2" />
      <path d="M19 12h26v12H19Z" fill={C.sedaTmava} />
      <circle cx="27" cy="17" r="2.2" fill={C.bila} />
      <circle cx="37" cy="17" r="2.2" fill={C.bila} />
      <circle cx="32" cy="20" r="2.2" fill={C.bila} />
      <circle cx="28" cy="38" r="3" fill={C.seda} />
      <circle cx="37" cy="45" r="3" fill={C.seda} />
      <circle cx="31" cy="49" r="3" fill={C.seda} />
    </>
  ),
  cukr: (
    <>
      <path d="M10 28h20v14H10Z" fill={C.krem} stroke={C.kremTmavy} strokeWidth="3" />
      <path d="M34 20h20v14H34Z" fill={C.krem} stroke={C.kremTmavy} strokeWidth="3" />
      <path d="M22 44h20v14H22Z" fill={C.krem} stroke={C.kremTmavy} strokeWidth="3" />
    </>
  ),
  'javorovy-sirup': (
    <>
      <path d="M24 20h16l3 8v24a4 4 0 0 1-4 4H25a4 4 0 0 1-4-4V28l3-8Z" fill={C.bilaStin} />
      <path d="M24 32h16v20a2 2 0 0 1-2 2H26a2 2 0 0 1-2-2V32Z" fill={C.hneda} />
      <path d="M32 34l3 4h-2l2 4h-2l1 4h-4l1-4h-2l2-4h-2l3-4Z" fill={C.cervenaTmava} />
      <path d="M26 17h12v4H26Z" fill={C.hnedaTmava} />
    </>
  ),
  'bujon-kostka': (
    <>
      <path d="M14 24h30v26H14Z" fill={C.kremTmavy} />
      <path d="M18 28h22v18H18Z" fill={C.zlutaTmava} />
      <path d="M44 24l8-6v26l-8 6V24Z" fill={C.hnedaSvetla} />
      <path d="M14 24l8-6h30l-8 6H14Z" fill={C.krem} />
    </>
  ),
  'napoj-ryzovy': krabice(
    C.bilaStin,
    <>
      <ellipse cx="27" cy="43" rx="4" ry="7" transform="rotate(-20 27 43)" fill={C.kremTmavy} />
      <ellipse cx="36" cy="46" rx="4" ry="7" transform="rotate(18 36 46)" fill={C.kremTmavy} />
    </>,
  ),
  'napoj-ovesny': krabice(
    C.hnedaSvetla,
    <>
      <ellipse cx="32" cy="44" rx="9" ry="7" fill={C.krem} stroke={C.kremTmavy} strokeWidth="2" />
      <path d="M23 44h18" stroke={C.kremTmavy} strokeWidth="2" />
    </>,
  ),
  'napoj-sojovy': krabice(
    C.zelenSvetla,
    <>
      <path d="M22 46c0-6 5-10 10-10s10 4 10 10-5 8-10 8-10-2-10-8Z" fill={C.zelenBleda} />
      <circle cx="27" cy="45" r="3" fill={C.zelenTmava} />
      <circle cx="36" cy="45" r="3" fill={C.zelenTmava} />
    </>,
  ),
  'napoj-mandlovy': krabice(
    C.kremTmavy,
    <path d="M32 35c5 0 9 5 9 10s-4 9-9 9-9-4-9-9 4-10 9-10Z" fill={C.hnedaSvetla} stroke={C.hnedaTmava} strokeWidth="2" />,
  ),
  'mleko-kozi': krabice(
    C.hneda,
    <>
      <path d="M25 44c1-5 4-7 7-7s6 2 7 7c-2 4-4 6-7 6s-5-2-7-6Z" fill={C.krem} />
      <path d="M26 39c-3-2-4-5-3-8M38 39c3-2 4-5 3-8" stroke={C.hnedaTmava} strokeWidth="3" strokeLinecap="round" fill="none" />
    </>,
  ),

  // ── kořenová zelenina ──────────────────────────────────────────────────
  repa: (
    <>
      {nat(0)}
      <path d="M32 56c-2 0-3-4-3-8h6c0 4-1 8-3 8Z" fill={C.fialovaTmava} />
      <ellipse cx="32" cy="38" rx="15" ry="14" fill={C.fialova} />
      <path d="M24 31c2-3 6-5 9-5" stroke={C.ruzova} strokeWidth="3" strokeLinecap="round" fill="none" />
    </>
  ),

  redkvicka: (
    <>
      {nat(-1)}
      <path d="M32 58c-1.5 0-2.5-3-2.5-6h5c0 3-1 6-2.5 6Z" fill={C.bilaStin} />
      <circle cx="32" cy="37" r="14" fill={C.cervena} />
      <path d="M22 46a14 14 0 0 0 20 0c-3 4-6 6-10 6s-7-2-10-6Z" fill={C.bila} />
      <path d="M24 30c2-3 5-4 8-4" stroke={C.ruzova} strokeWidth="3" strokeLinecap="round" fill="none" />
    </>
  ),

  // ── houby ──────────────────────────────────────────────────────────────
  zampion: (
    <>
      <path d="M26 36h12v14a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V36Z" fill={C.krem} />
      <path d="M32 13c11 0 19 8 19 17 0 4-3 6-7 6H20c-4 0-7-2-7-6 0-9 8-17 19-17Z" fill={C.hnedaSvetla} />
      <path d="M32 13c-6 0-11 2-14 6 4-2 9-3 14-3s10 1 14 3c-3-4-8-6-14-6Z" fill={C.krem} />
    </>
  ),

  hliva: (
    <>
      {/* Vějíř s krátkým postranním třeněm, ne kulatý klobouk — tím se hlíva
          na první pohled liší od žampionu. */}
      <path d="M44 42C36 48 20 48 12 40c6-12 20-18 29-14 5 2 6 10 3 16Z" fill={C.seda} />
      <path
        d="M28 26c8-6 20-6 25 1 4 6 0 16-8 21-9 5-20 4-24-2-3-6 0-15 7-20Z"
        fill={C.krem}
      />
      <path
        d="M46 31c-6 2-13 8-17 16M40 28c-6 3-12 9-15 17M33 27c-5 4-9 10-11 17"
        stroke={C.kremTmavy}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M40 47c3 4 6 6 10 6" stroke={C.bilaStin} strokeWidth="5" strokeLinecap="round" fill="none" />
    </>
  ),

  // ── luštěniny ──────────────────────────────────────────────────────────
  'hrach-zluty': (
    <>
      <path d="M12 40a10 10 0 0 1 20 0Z" fill={C.zluta} />
      <path d="M32 40a10 10 0 0 1 20 0Z" fill={C.zlutaTmava} />
      <path d="M20 52a10 10 0 0 1 20 0Z" fill={C.zluta} />
      <path d="M22 24a9 9 0 0 1 18 0Z" fill={C.zlutaTmava} />
    </>
  ),

  'hrach-zeleny': (
    <>
      <circle cx="21" cy="40" r="10" fill={C.zelen} />
      <circle cx="43" cy="40" r="10" fill={C.zelenTmava} />
      <circle cx="32" cy="23" r="9" fill={C.zelen} />
      <circle cx="32" cy="52" r="9" fill={C.zelenTmava} />
      <circle cx="30" cy="20" r="2.5" fill={C.zelenSvetla} />
      <circle cx="19" cy="37" r="2.5" fill={C.zelenSvetla} />
    </>
  ),

  tofu: (
    <>
      <path d="M14 24l18-8 18 8-18 8-18-8Z" fill={C.bila} />
      <path d="M14 24v18l18 8V32l-18-8Z" fill={C.krem} />
      <path d="M50 24v18l-18 8V32l18-8Z" fill={C.kremTmavy} />
    </>
  ),

  'tofu-uzene': (
    <>
      <path d="M14 24l18-8 18 8-18 8-18-8Z" fill={C.hnedaSvetla} />
      <path d="M14 24v18l18 8V32l-18-8Z" fill={C.hneda} />
      <path d="M50 24v18l-18 8V32l18-8Z" fill={C.hnedaTmava} />
    </>
  ),

  tempeh: (
    <>
      <path d="M14 24l18-8 18 8-18 8-18-8Z" fill={C.krem} />
      <path d="M14 24v18l18 8V32l-18-8Z" fill={C.kremTmavy} />
      <path d="M50 24v18l-18 8V32l18-8Z" fill={C.hnedaSvetla} />
      <ellipse cx="25" cy="22" rx="4" ry="2.5" fill={C.hnedaSvetla} />
      <ellipse cx="37" cy="19" rx="4" ry="2.5" fill={C.hneda} />
      <ellipse cx="40" cy="26" rx="4" ry="2.5" fill={C.hnedaSvetla} />
    </>
  ),

  // ── sušené ovoce ───────────────────────────────────────────────────────
  brusinky: (
    <>
      <ellipse cx="22" cy="28" rx="9" ry="7" transform="rotate(-18 22 28)" fill={C.cervenaTmava} />
      <ellipse cx="42" cy="26" rx="9" ry="7" transform="rotate(12 42 26)" fill={C.cervena} />
      <ellipse cx="32" cy="42" rx="10" ry="7.5" transform="rotate(-6 32 42)" fill={C.cervenaTmava} />
      <path d="M17 27c3 1 7 1 10 0M37 25c3 1 7 1 10 0M27 41c3 1 7 1 10 0" stroke={C.cervena} strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </>
  ),

  // ── zelenina ───────────────────────────────────────────────────────────
  chrest: (
    <>
      <path d="M20 54V26c0-5 2-9 4-9s4 4 4 9v28h-8Z" fill={C.zelen} />
      <path d="M32 54V22c0-5 2-9 4-9s4 4 4 9v32h-8Z" fill={C.zelenSvetla} />
      <path d="M43 54V28c0-5 2-8 3.5-8s3.5 3 3.5 8v26h-7Z" fill={C.zelenTmava} />
      <path d="M18 44h34" stroke={C.kremTmavy} strokeWidth="4" strokeLinecap="round" fill="none" />
    </>
  ),

  kvetak: (
    <>
      <path d="M13 34c-2 8 2 16 8 18 2-6 2-13 0-19l-8 1Z" fill={C.zelen} />
      <path d="M51 34c2 8-2 16-8 18-2-6-2-13 0-19l8 1Z" fill={C.zelenTmava} />
      <circle cx="22" cy="31" r="9" fill={C.bila} />
      <circle cx="42" cy="31" r="9" fill={C.bila} />
      <circle cx="32" cy="24" r="10" fill={C.bila} />
      <circle cx="32" cy="37" r="11" fill={C.bilaStin} />
      <circle cx="26" cy="33" r="4" fill={C.bila} />
      <circle cx="38" cy="34" r="4" fill={C.bila} />
    </>
  ),

  // ── kořenová a hlíznatá zelenina ───────────────────────────────────────
  mrkev: (
    <>
      <path d="M26 16c4-4 10-4 13 0l-4 5-9-5Z" fill={C.zelenTmava} />
      <path d="M22 14c5-3 10-1 12 3l-6 4-6-7Z" fill={C.zelen} />
      <path d="M38 14c-5-3-10-1-12 3l6 4 6-7Z" fill={C.zelenSvetla} />
      <path d="M22 22h20L34 56c-1 3-5 3-6 0L22 22Z" fill={C.oranzova} />
      <path d="M26 32h9M27 40h7M29 47h4" stroke={C.zluta} strokeWidth="2" strokeLinecap="round" fill="none" />
    </>
  ),

  pastinak: (
    <>
      <path d="M22 14c5-3 10-1 12 3l-6 4-6-7Z" fill={C.zelen} />
      <path d="M38 14c-5-3-10-1-12 3l6 4 6-7Z" fill={C.zelenSvetla} />
      <path d="M19 22h26L35 55c-1 3-5 3-6 0L19 22Z" fill={C.krem} />
      <path d="M24 31h14M26 39h10M29 46h4" stroke={C.kremTmavy} strokeWidth="2" strokeLinecap="round" fill="none" />
    </>
  ),

  'petrzel-koren': (
    <>
      <circle cx="24" cy="15" r="4" fill={C.zelen} />
      <circle cx="32" cy="12" r="4.5" fill={C.zelenSvetla} />
      <circle cx="40" cy="15" r="4" fill={C.zelenTmava} />
      <path d="M23 22h18L34 56c-1 3-4 3-5 0L23 22Z" fill={C.bila} />
      <path d="M26 31h11M27 39h8M29 46h3" stroke={C.bilaStin} strokeWidth="2" strokeLinecap="round" fill="none" />
    </>
  ),

  'celer-bulva': (
    <>
      <path d="M26 16v8h3v-8ZM33 14v10h3V14ZM40 17v7h3v-7Z" fill={C.zelen} />
      <circle cx="32" cy="38" r="16" fill={C.krem} />
      <path d="M20 33c4 2 8 2 11 0M36 30c3 2 6 3 9 2M22 44c5 1 9 0 12-2" stroke={C.kremTmavy} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M28 53c1 3 2 4 3 5M34 53c0 3 1 4 2 5" stroke={C.hnedaSvetla} strokeWidth="2" strokeLinecap="round" fill="none" />
    </>
  ),

  turin: (
    <>
      {nat(-2)}
      <path d="M32 57c-1 0-2-2-2-5h4c0 3-1 5-2 5Z" fill={C.kremTmavy} />
      <circle cx="32" cy="37" r="15" fill={C.krem} />
      <path d="M18 32a15 15 0 0 1 28 0Z" fill={C.fialova} />
    </>
  ),

  brambor: (
    <>
      <ellipse cx="32" cy="34" rx="20" ry="15" transform="rotate(-12 32 34)" fill={C.hnedaSvetla} />
      <circle cx="24" cy="30" r="2.5" fill={C.hneda} />
      <circle cx="36" cy="36" r="2.5" fill={C.hneda} />
      <circle cx="41" cy="27" r="2" fill={C.hneda} />
      <circle cx="27" cy="40" r="2" fill={C.hneda} />
    </>
  ),

  batat: (
    <>
      <path d="M11 40c0-9 12-18 25-18s17 5 17 10c0 8-12 15-24 15S11 46 11 40Z" fill="#C0603C" />
      <path d="M20 33c6-4 14-6 21-5" stroke="#D98259" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M53 32c3-1 5 0 6 2-2 2-4 2-6 1" fill="#C0603C" />
    </>
  ),

  'dyne-hokaido': (
    <>
      <rect x="30" y="10" width="4" height="8" rx="2" fill={C.zelenTmava} />
      <ellipse cx="32" cy="38" rx="21" ry="17" fill="#D9531E" />
      <path d="M22 23c-3 8-3 22 0 30M42 23c3 8 3 22 0 30" stroke="#B03E13" strokeWidth="2.5" fill="none" />
      <path d="M32 21c-2 8-2 26 0 34" stroke="#B03E13" strokeWidth="2.5" fill="none" />
    </>
  ),

  'dyne-maslova': (
    <>
      <rect x="30" y="8" width="4" height="6" rx="2" fill={C.zelenTmava} />
      <path d="M32 13c5 0 6 5 6 11 0 5-2 7-2 10 6 2 10 8 10 14 0 6-6 10-14 10s-14-4-14-10c0-6 4-12 10-14 0-3-2-5-2-10 0-6 1-11 6-11Z" fill={C.kremTmavy} />
      <path d="M28 40c-3 2-5 5-5 8" stroke={C.krem} strokeWidth="3" strokeLinecap="round" fill="none" />
    </>
  ),

  'dyne-spagetova': (
    <>
      <rect x="30" y="12" width="4" height="6" rx="2" fill={C.zelenTmava} />
      <ellipse cx="32" cy="38" rx="15" ry="19" fill={C.zluta} />
      <path d="M24 26c-2 8-2 16 0 22" stroke={C.zlutaTmava} strokeWidth="2.5" fill="none" />
      <path d="M40 26c2 8 2 16 0 22" stroke={C.zlutaTmava} strokeWidth="2.5" fill="none" />
    </>
  ),

  cuketa: (
    <>
      <path d="M18 10c3-1 5 1 6 4l-5 3-1-7Z" fill={C.zelenTmava} />
      <path d="M22 14c8 0 14 6 19 16 5 10 7 20 2 24s-13-2-18-12S14 20 22 14Z" fill="#3E7A33" />
      <path d="M28 22c4 4 8 12 11 19" stroke="#5E9B4A" strokeWidth="3" strokeLinecap="round" fill="none" />
    </>
  ),

  patizon: (
    <>
      <rect x="30" y="13" width="4" height="6" rx="2" fill={C.zelenTmava} />
      {/* Zoubkovaný okraj je jediné, čím se patizon na 20 px pozná — proto
          výrazná barva a velké zuby, ne jemné vroubkování. */}
      <path d="M32 19c7 0 12 4 15 8 5 0 9 2 9 5s-4 5-9 5c-3 4-8 8-15 8s-12-4-15-8c-5 0-9-2-9-5s4-5 9-5c3-4 8-8 15-8Z" fill={C.krem} />
      <circle cx="13" cy="32" r="4" fill={C.kremTmavy} />
      <circle cx="51" cy="32" r="4" fill={C.kremTmavy} />
      <circle cx="22" cy="41" r="4" fill={C.kremTmavy} />
      <circle cx="42" cy="41" r="4" fill={C.kremTmavy} />
      <path d="M20 30c4 3 8 4 12 4s8-1 12-4" stroke={C.kremTmavy} strokeWidth="2.5" fill="none" />
    </>
  ),

  okurka: (
    <>
      <path d="M46 12c2 0 4 2 3 4l-5 2 2-6Z" fill={C.zelenTmava} />
      <path d="M45 15c5 5 3 16-5 25s-19 13-24 8 0-16 8-24 16-13 21-9Z" fill={C.zelen} />
      <path d="M38 21c-4 3-9 8-13 13M43 26c-4 4-9 9-14 13" stroke={C.zelenSvetla} strokeWidth="3" strokeLinecap="round" fill="none" />
    </>
  ),

  lilek: (
    <>
      <path d="M32 12c5 0 8 3 9 7-3 2-6 3-9 3s-6-1-9-3c1-4 4-7 9-7Z" fill={C.zelen} />
      <rect x="30" y="8" width="4" height="7" rx="2" fill={C.zelenTmava} />
      <path d="M32 21c11 0 19 8 19 18s-8 17-19 17-19-7-19-17 8-18 19-18Z" fill="#6B3A7A" />
      <path d="M22 33c3-4 7-6 11-6" stroke="#9B63A8" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    </>
  ),

  kedlubna: (
    <>
      <path d="M24 18l3 8M32 14v12M40 18l-3 8" stroke={C.zelenTmava} strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="21" cy="16" r="5" fill={C.zelen} />
      <circle cx="43" cy="16" r="5" fill={C.zelenSvetla} />
      <circle cx="32" cy="39" r="16" fill={C.zelenBleda} />
      <path d="M20 34c4 3 9 4 13 3" stroke={C.zelenSvetla} strokeWidth="3" strokeLinecap="round" fill="none" />
    </>
  ),

  // ── košťálová a listová zelenina ───────────────────────────────────────
  brokolice: (
    <>
      <path d="M27 34h10v18a5 5 0 0 1-10 0V34Z" fill={C.zelenBleda} />
      <circle cx="20" cy="26" r="9" fill={C.zelenTmava} />
      <circle cx="44" cy="26" r="9" fill={C.zelenTmava} />
      <circle cx="32" cy="20" r="11" fill={C.zelen} />
      <circle cx="25" cy="32" r="8" fill={C.zelen} />
      <circle cx="39" cy="32" r="8" fill={C.zelenTmava} />
      <circle cx="28" cy="18" r="3" fill={C.zelenSvetla} />
      <circle cx="37" cy="24" r="3" fill={C.zelenSvetla} />
    </>
  ),

  'zeli-bile': (
    <>
      <circle cx="32" cy="34" r="20" fill={C.zelenBleda} />
      <path d="M32 14c-7 6-11 13-11 20s4 13 11 20" stroke="#A9CC84" strokeWidth="2.5" fill="none" />
      <path d="M32 14c7 6 11 13 11 20s-4 13-11 20" stroke="#A9CC84" strokeWidth="2.5" fill="none" />
      <path d="M14 30c8 3 28 3 36 0" stroke="#A9CC84" strokeWidth="2.5" fill="none" />
    </>
  ),

  'kapusta-hlavkova': (
    <>
      <circle cx="32" cy="34" r="20" fill="#4E8C4A" />
      <path d="M20 22c3 3 3 7 0 10s-3 7 0 10 3 7 0 9" stroke="#7CB36A" strokeWidth="2.5" fill="none" />
      <path d="M32 15c3 4 3 8 0 12s-3 8 0 12 3 8 0 12" stroke="#7CB36A" strokeWidth="2.5" fill="none" />
      <path d="M44 22c-3 3-3 7 0 10s3 7 0 10-3 7 0 9" stroke="#7CB36A" strokeWidth="2.5" fill="none" />
    </>
  ),

  'kapusta-kaderava': (
    <>
      <path d="M30 38h4v16h-4Z" fill={C.zelenBleda} />
      <path d="M32 38c-9 2-18-2-21-9 4 1 6 0 7-2-3-1-5-4-5-7 3 2 6 2 8 0-2-3-2-7 0-10 2 3 5 5 8 4-1-3 0-6 3-8Z" fill="#3F7A46" />
      <path d="M32 38c9 2 18-2 21-9-4 1-6 0-7-2 3-1 5-4 5-7-3 2-6 2-8 0 2-3 2-7 0-10-2 3-5 5-8 4 1-3 0-6-3-8Z" fill="#55975C" />
    </>
  ),

  'ruzickova-kapusta': (
    <>
      <circle cx="21" cy="40" r="11" fill="#4E8C4A" />
      <circle cx="43" cy="40" r="11" fill="#3F7A46" />
      <circle cx="32" cy="24" r="10" fill="#55975C" />
      <path d="M21 30c2 4 2 8 0 11M43 30c-2 4-2 8 0 11M32 15c2 4 2 8 0 11" stroke="#89C077" strokeWidth="2.5" fill="none" />
      <rect x="30.5" y="12" width="3" height="5" rx="1.5" fill={C.zelenBleda} />
    </>
  ),

  spenat: (
    <>
      {/* Celé okrouhlé listy, ne snítky — špenát se v seznamu pozná podle
          plochy listu, ne podle stonku. */}
      <path d="M32 54c-1-9-1-17 0-22" stroke={C.zelenBleda} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M31 34c-9 1-17-4-19-12 9-4 18 0 19 12Z" fill="#3F7A46" />
      <path d="M33 34c9 1 17-4 19-12-9-4-18 0-19 12Z" fill="#55975C" />
      <path d="M32 32c-6-6-7-15-3-21 7 4 9 14 3 21Z" fill="#4E8C4A" />
      <path d="M20 26c4 2 8 4 11 7M44 26c-4 2-8 4-11 7M32 13c1 6 1 13 0 18" stroke="#9BC98A" strokeWidth="2" strokeLinecap="round" fill="none" />
    </>
  ),

  mangold: (
    <>
      <path d="M30 56V28h5v28c0 2-5 2-5 0Z" fill={C.cervena} />
      <path d="M32 30c-12-1-20-9-20-17 12-4 22 4 20 17Z" fill="#3F7A46" />
      <path d="M32 30c12-1 20-9 20-17-12-4-22 4-20 17Z" fill="#55975C" />
      <path d="M32 30c-4-8-2-16 0-19 3 4 4 12 0 19Z" fill="#4E8C4A" />
    </>
  ),

  rukola: (
    <>
      {/* Hluboko laločnatý list rukoly — tím se liší od hladkého špenátu. */}
      <path d="M32 55c0-10 1-19 3-26" stroke={C.zelenBleda} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M35 30c-5-3-7-8-6-12 3 1 5 0 6-3 2 3 4 3 6 1 1 3 3 4 6 4-2 3-2 5 0 8-4 0-8 1-12 2Z" fill="#5E9B4A" />
      <path d="M29 38c-5-2-10-2-14 1 1-3 0-5-2-7 3-1 4-4 3-7 3 2 5 1 7-1 2 4 5 8 6 12Z" fill="#3F7A46" />
      <path d="M44 22c-3 2-6 5-8 8M22 28c3 2 5 5 6 8" stroke="#9BC98A" strokeWidth="2" strokeLinecap="round" fill="none" />
    </>
  ),

  'hlavkovy-salat': (
    <>
      {/* Volná hlávka: světlá a rozevlátá, proti pevnému zelí i kapustě. */}
      <path d="M32 56c-14 0-24-8-24-18 0-4 2-7 5-8-1-5 2-10 7-11 2-5 7-8 12-8s10 3 12 8c5 1 8 6 7 11 3 1 5 4 5 8 0 10-10 18-24 18Z" fill="#9BC96E" />
      <path d="M18 26c4 6 4 13 0 19M32 15c4 7 4 17 0 24M46 26c-4 6-4 13 0 19" stroke="#D2E8AE" strokeWidth="3" fill="none" />
    </>
  ),

  porek: (
    <>
      <path d="M27 8c-3 6-4 12-3 18l4-1c-1-6 0-11 3-17Z" fill="#3F7A46" />
      <path d="M37 8c3 6 4 12 3 18l-4-1c1-6 0-11-3-17Z" fill="#55975C" />
      <path d="M32 6c-2 7-2 14-1 20h4c1-6 1-13-1-20Z" fill="#4E8C4A" />
      <path d="M25 26h14v24c0 3-3 5-7 5s-7-2-7-5V26Z" fill={C.bila} />
      <path d="M29 27v27M35 27v27" stroke={C.bilaStin} strokeWidth="2" fill="none" />
    </>
  ),

  fenykl: (
    <>
      <path d="M22 16c2 3 3 6 3 9M32 12c0 4 0 8-1 12M42 16c-2 3-3 6-3 9" stroke={C.zelen} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="20" cy="14" r="3" fill={C.zelenSvetla} />
      <circle cx="32" cy="10" r="3" fill={C.zelenSvetla} />
      <circle cx="44" cy="14" r="3" fill={C.zelenSvetla} />
      <path d="M32 25c10 0 17 7 17 15s-7 13-17 13-17-5-17-13 7-15 17-15Z" fill={C.zelenBleda} />
      <path d="M26 27c-2 8-2 17 0 24M38 27c2 8 2 17 0 24" stroke={C.bila} strokeWidth="2.5" fill="none" />
    </>
  ),

  artycok: (
    <>
      <path d="M30 50h4v8h-4Z" fill={C.zelenBleda} />
      <path d="M32 8c8 6 13 15 13 24 0 11-6 18-13 18s-13-7-13-18c0-9 5-18 13-24Z" fill="#6E9B52" />
      <path d="M20 26c3 3 7 4 12 4s9-1 12-4M19 36c4 3 8 4 13 4s9-1 13-4M21 45c3 3 7 4 11 4s8-1 11-4" stroke="#4A7136" strokeWidth="2.5" fill="none" />
      <path d="M32 8c-3 5-5 11-5 16h10c0-5-2-11-5-16Z" fill="#8FB56C" />
    </>
  ),

  hrasek: (
    <>
      {/* Světlý lusk a tmavá zrna — obráceně splynou v jednu skvrnu. */}
      <path d="M8 26c12-9 36-9 48 0-5 14-19 21-24 21S13 40 8 26Z" fill="#C3DF9E" />
      <path d="M10 25c12-7 32-7 44 0" stroke="#8FBF6B" strokeWidth="3" fill="none" />
      <circle cx="20" cy="34" r="7" fill="#3F7A46" />
      <circle cx="32" cy="36" r="7.5" fill="#4E8C4A" />
      <circle cx="44" cy="34" r="7" fill="#3F7A46" />
    </>
  ),

  'fazolky-zelene': (
    <>
      <path d="M14 46c-2-14 6-28 16-32 3 8 1 22-5 30-3 4-9 6-11 2Z" fill="#4E8C4A" />
      <path d="M28 50c-4-14 3-30 13-34 4 8 3 24-3 32-3 4-9 6-10 2Z" fill="#5E9B4A" />
      <path d="M44 48c-3-12 2-26 10-30 3 7 2 21-3 28-2 4-6 5-7 2Z" fill="#3F7A46" />
      <path d="M22 22c-3 8-4 16-3 22M36 21c-3 8-3 17-2 23" stroke="#8FC45A" strokeWidth="2" strokeLinecap="round" fill="none" />
    </>
  ),

  kukurice: (
    <>
      <path d="M20 22c-6 8-8 20-4 30 7-2 11-9 12-18l-8-12Z" fill="#4E8C4A" />
      <path d="M44 22c6 8 8 20 4 30-7-2-11-9-12-18l8-12Z" fill="#55975C" />
      <path d="M32 8c8 0 13 8 13 20s-5 26-13 26-13-14-13-26S24 8 32 8Z" fill={C.zluta} />
      <path d="M26 18c0 12 0 22 1 28M32 14c0 14 0 26 0 32M38 18c0 12 0 22-1 28" stroke={C.zlutaTmava} strokeWidth="2" fill="none" />
      <path d="M21 26c7 2 15 2 22 0M21 36c7 2 15 2 22 0M22 46c6 2 14 2 20 0" stroke={C.zlutaTmava} strokeWidth="2" fill="none" />
    </>
  ),

  // ── plodová zelenina a cibuloviny ──────────────────────────────────────
  rajce: (
    <>
      <circle cx="32" cy="37" r="19" fill="#D63A2F" />
      <path d="M22 30c2-4 6-7 10-8" stroke="#EE7566" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M32 20c-3-3-8-5-12-4 1 4 4 7 8 8M32 20c3-3 8-5 12-4-1 4-4 7-8 8M32 20c-2-4-2-8 0-11 2 3 2 7 0 11Z" fill={C.zelen} />
    </>
  ),

  paprika: (
    <>
      {/* Hranatá ramena a tři laloky dole — kulatý tvar by na 20 px splynul
          s rajčetem, které leží v katalogu hned vedle. */}
      <path d="M32 19c11 0 19 6 19 15 0 10-4 18-8 20-2 1-4-1-5-3-1 3-3 5-6 5s-5-2-6-5c-1 2-3 4-5 3-4-2-8-10-8-20 0-9 8-15 19-15Z" fill="#D63A2F" />
      <path d="M25 31c-1 8-1 15 1 20M39 31c1 8 1 15-1 20" stroke="#9E241C" strokeWidth="2.5" fill="none" />
      <path d="M22 29c1-4 3-7 6-9" stroke="#EE7566" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M32 19c-5 0-8-2-8-5 5-2 11-2 16 0 0 3-3 5-8 5Z" fill={C.zelen} />
      <rect x="30" y="7" width="4" height="9" rx="2" fill={C.zelenTmava} />
    </>
  ),

  cibule: (
    <>
      <path d="M29 14c1-4 2-6 3-8 1 2 2 4 3 8M26 16c-1-3-3-5-5-6 0 3 1 5 3 7" stroke={C.zelen} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M32 16c11 0 19 9 19 20s-8 18-19 18-19-7-19-18 8-20 19-20Z" fill="#D79B3F" />
      <path d="M32 17c-5 6-7 14-7 20s2 12 7 17M32 17c5 6 7 14 7 20s-2 12-7 17" stroke="#EFC378" strokeWidth="2.5" fill="none" />
    </>
  ),

  cesnek: (
    <>
      <path d="M32 12c1 3 2 6 2 9h-4c0-3 1-6 2-9Z" fill={C.kremTmavy} />
      <path d="M32 19c-3 4-5 10-5 16 0 11 5 18 5 18s-12 0-16-6c-4-7-1-22 6-27 3-2 7-3 10-1Z" fill={C.bila} />
      <path d="M32 19c3 4 5 10 5 16 0 11-5 18-5 18s12 0 16-6c4-7 1-22-6-27-3-2-7-3-10-1Z" fill={C.bilaStin} />
      <path d="M32 19c-3 5-4 11-4 17s2 12 4 17c2-5 4-11 4-17s-1-12-4-17Z" fill={C.bila} />
    </>
  ),

  // ── ovoce ──────────────────────────────────────────────────────────────
  jablko: (
    <>
      <path d="M38 15c4-3 9-3 12 0-1 5-6 8-11 7l-1-7Z" fill={C.zelen} />
      <rect x="31" y="10" width="3" height="10" rx="1.5" fill={C.hneda} />
      <path d="M32 20c3-2 7-3 11-1 6 3 9 10 8 18-1 9-7 18-13 18-2 0-4-1-6-1s-4 1-6 1c-6 0-12-9-13-18-1-8 2-15 8-18 4-2 8-1 11 1Z" fill="#CE3B36" />
      <path d="M23 26c-3 3-4 7-4 11" stroke="#EA7A6E" strokeWidth="4" strokeLinecap="round" fill="none" />
    </>
  ),

  hruska: (
    <>
      <path d="M38 14c4-3 8-3 11-1-1 4-5 7-10 6l-1-5Z" fill={C.zelen} />
      <rect x="31" y="9" width="3" height="10" rx="1.5" fill={C.hneda} />
      <path d="M32 18c4 0 6 4 6 9 0 4-2 6-2 8 7 2 12 9 12 16 0 7-7 12-16 12s-16-5-16-12c0-7 5-14 12-16 0-2-2-4-2-8 0-5 2-9 6-9Z" fill="#B8CC4A" />
      <path d="M26 38c-4 3-6 7-6 12" stroke="#D8E68A" strokeWidth="4" strokeLinecap="round" fill="none" />
    </>
  ),

  banan: (
    <>
      <path d="M14 20c0 18 10 31 26 31 7 0 12-3 12-7 0-3-3-4-7-4-13 0-22-8-23-21 0-3-2-4-4-4s-4 2-4 5Z" fill={C.zluta} />
      <path d="M22 26c3 10 11 17 21 18" stroke="#F5DC8A" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M14 17c2-2 6-2 8 1l-8 4v-5Z" fill={C.zelenTmava} />
      <path d="M50 44c3 0 5 2 5 4l-6 2 1-6Z" fill={C.hneda} />
    </>
  ),

  avokado: (
    <>
      <path d="M32 10c8 0 13 7 13 16 0 7 7 11 7 21 0 8-9 14-20 14s-20-6-20-14c0-10 7-14 7-21 0-9 5-16 13-16Z" fill="#3F6B33" />
      <path d="M32 17c5 0 8 5 8 11 0 6 6 9 6 18 0 6-6 10-14 10s-14-4-14-10c0-9 6-12 6-18 0-6 3-11 8-11Z" fill="#CBDB86" />
      <circle cx="32" cy="42" r="9" fill="#9C6B3A" />
    </>
  ),

  svestka: (
    <>
      <path d="M40 14c4-3 9-3 12 0-2 5-7 7-12 6v-6Z" fill={C.zelen} />
      <rect x="31" y="9" width="3" height="9" rx="1.5" fill={C.hneda} />
      <ellipse cx="32" cy="37" rx="16" ry="19" fill="#5B3C74" />
      <path d="M32 19c-4 6-5 12-5 18s1 12 5 17" stroke="#3F2755" strokeWidth="3" fill="none" />
      <path d="M23 28c-2 3-3 6-3 9" stroke="#8A63A5" strokeWidth="4" strokeLinecap="round" fill="none" />
    </>
  ),

  merunka: (
    <>
      <path d="M38 15c4-3 8-3 11-1-1 4-5 7-10 6l-1-5Z" fill={C.zelen} />
      <circle cx="32" cy="38" r="17" fill="#E8963C" />
      <path d="M32 22c-3 5-4 10-4 16s1 11 4 15" stroke="#C77425" strokeWidth="2.5" fill="none" />
      <path d="M23 31c-2 3-3 5-3 8" stroke="#F5BC78" strokeWidth="4" strokeLinecap="round" fill="none" />
    </>
  ),

  broskev: (
    <>
      <path d="M38 13c4-3 9-3 12 0-1 5-6 8-11 7l-1-7Z" fill={C.zelen} />
      <circle cx="32" cy="38" r="19" fill="#E8A05C" />
      <path d="M32 19c11 0 19 8 19 19 0 3-1 6-2 8-8-2-14-9-15-18-1-4-2-7-2-9Z" fill="#D9663F" />
      <path d="M32 20c-4 5-5 11-5 18s1 13 5 18" stroke="#C4753A" strokeWidth="2.5" fill="none" />
    </>
  ),

  nektarinka: (
    <>
      <path d="M38 13c4-3 9-3 12 0-1 5-6 8-11 7l-1-7Z" fill={C.zelen} />
      <circle cx="32" cy="38" r="19" fill="#C4372E" />
      <path d="M22 28c-3 3-5 7-5 11" stroke="#EF8168" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M32 20c-4 5-5 11-5 18s1 13 5 18" stroke="#8E2119" strokeWidth="2.5" fill="none" />
    </>
  ),

  'nektarinka-bila': (
    <>
      <path d="M38 13c4-3 9-3 12 0-1 5-6 8-11 7l-1-7Z" fill={C.zelen} />
      <circle cx="32" cy="38" r="19" fill="#F0D9C4" />
      <path d="M32 19c9 0 16 6 18 14-6 3-13 2-17-3-2-4-2-8-1-11Z" fill="#E08B84" />
      <path d="M32 20c-4 5-5 11-5 18s1 13 5 18" stroke="#CBA893" strokeWidth="2.5" fill="none" />
    </>
  ),

  tresne: (
    <>
      <path d="M32 12c-6 6-11 14-13 22M32 12c5 6 9 14 11 22" stroke={C.hneda} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M32 12c5-4 11-4 15-1-4 5-10 6-15 3Z" fill={C.zelen} />
      <circle cx="19" cy="42" r="12" fill="#C42B31" />
      <circle cx="45" cy="43" r="11" fill="#A81F26" />
      <path d="M13 37c2-3 4-4 6-5" stroke="#E8666A" strokeWidth="4" strokeLinecap="round" fill="none" />
    </>
  ),

  visne: (
    <>
      <path d="M32 12c-6 6-11 14-13 22M32 12c5 6 9 14 11 22" stroke={C.hneda} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M32 12c5-4 11-4 15-1-4 5-10 6-15 3Z" fill={C.zelen} />
      <ellipse cx="19" cy="43" rx="12" ry="11" fill="#7E1B20" />
      <ellipse cx="45" cy="44" rx="11" ry="10" fill="#5E1216" />
      <path d="M13 39c2-3 4-4 6-5" stroke="#B0454A" strokeWidth="4" strokeLinecap="round" fill="none" />
    </>
  ),

  // ── bobuloviny a exotické ovoce ────────────────────────────────────────
  jahody: (
    <>
      <path d="M32 20c12 0 20 7 20 15 0 11-12 21-20 21s-20-10-20-21c0-8 8-15 20-15Z" fill="#D42F33" />
      <path d="M32 20c-6-1-11-3-14-7 5-2 10-2 14 0 4-2 9-2 14 0-3 4-8 6-14 7Z" fill={C.zelen} />
      <rect x="30.5" y="8" width="3" height="8" rx="1.5" fill={C.zelenTmava} />
      <circle cx="24" cy="32" r="2" fill={C.zluta} />
      <circle cx="38" cy="31" r="2" fill={C.zluta} />
      <circle cx="31" cy="39" r="2" fill={C.zluta} />
      <circle cx="41" cy="41" r="2" fill={C.zluta} />
      <circle cx="23" cy="43" r="2" fill={C.zluta} />
    </>
  ),

  boruvky: (
    <>
      <circle cx="21" cy="40" r="12" fill="#3D4C89" />
      <circle cx="44" cy="41" r="11" fill="#2E3A6B" />
      <circle cx="33" cy="24" r="11" fill="#4A5CA3" />
      <path d="M33 19l3 4-3 2-3-2 3-4ZM21 35l3 4-3 2-3-2 3-4ZM44 36l3 4-3 2-3-2 3-4Z" fill="#8090C7" />
    </>
  ),

  maliny: (
    <>
      <path d="M32 12c-4-2-9-1-11 2 3 1 5 3 6 5" fill={C.zelen} />
      <circle cx="24" cy="26" r="6.5" fill="#D94A6B" />
      <circle cx="40" cy="26" r="6.5" fill="#C13A5A" />
      <circle cx="32" cy="24" r="6.5" fill="#E05C7C" />
      <circle cx="20" cy="37" r="6.5" fill="#C13A5A" />
      <circle cx="32" cy="36" r="7" fill="#D94A6B" />
      <circle cx="44" cy="37" r="6.5" fill="#C13A5A" />
      <circle cx="26" cy="47" r="6" fill="#D94A6B" />
      <circle cx="38" cy="47" r="6" fill="#C13A5A" />
    </>
  ),

  ostruziny: (
    <>
      <path d="M32 12c-4-2-9-1-11 2 3 1 5 3 6 5" fill={C.zelen} />
      <circle cx="24" cy="26" r="6.5" fill="#2E2340" />
      <circle cx="40" cy="26" r="6.5" fill="#1E1730" />
      <circle cx="32" cy="24" r="6.5" fill="#413055" />
      <circle cx="20" cy="37" r="6.5" fill="#1E1730" />
      <circle cx="32" cy="36" r="7" fill="#2E2340" />
      <circle cx="44" cy="37" r="6.5" fill="#1E1730" />
      <circle cx="26" cy="47" r="6" fill="#413055" />
      <circle cx="38" cy="47" r="6" fill="#2E2340" />
    </>
  ),

  'rybiz-cerveny': (
    <>
      <path d="M32 8v14M32 14l-10 8M32 16l10 8M32 20l-4 10M32 20l6 12" stroke={C.hnedaSvetla} strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="20" cy="28" r="7" fill="#D8302E" />
      <circle cx="44" cy="30" r="7" fill="#B8211F" />
      <circle cx="26" cy="38" r="7.5" fill="#E04745" />
      <circle cx="39" cy="42" r="7.5" fill="#D8302E" />
      <circle cx="30" cy="51" r="6.5" fill="#B8211F" />
      <circle cx="23" cy="35" r="2" fill="#F58E8A" />
    </>
  ),

  'rybiz-cerny': (
    <>
      <path d="M32 8v14M32 14l-10 8M32 16l10 8M32 20l-4 10M32 20l6 12" stroke={C.hnedaSvetla} strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="20" cy="28" r="7" fill="#2A1F33" />
      <circle cx="44" cy="30" r="7" fill="#1A1224" />
      <circle cx="26" cy="38" r="7.5" fill="#3A2B47" />
      <circle cx="39" cy="42" r="7.5" fill="#2A1F33" />
      <circle cx="30" cy="51" r="6.5" fill="#1A1224" />
      <circle cx="23" cy="35" r="2" fill="#6E5C80" />
    </>
  ),

  angrest: (
    <>
      <path d="M24 16c-2-3-5-5-8-5 0 4 2 7 5 8M42 17c2-3 5-5 8-5 0 4-2 7-5 8" stroke={C.zelen} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <ellipse cx="22" cy="36" rx="12" ry="13" fill="#B9CF63" />
      <ellipse cx="43" cy="38" rx="11" ry="12" fill="#9DB84E" />
      <path d="M22 24c-3 7-3 17 0 24M43 27c-3 6-3 15 0 21" stroke="#D9E8A0" strokeWidth="2.5" fill="none" />
    </>
  ),

  hrozny: (
    <>
      <path d="M32 6v10" stroke={C.hneda} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M32 12c5-4 11-4 15-1-4 5-10 6-15 3Z" fill={C.zelen} />
      <circle cx="22" cy="26" r="7" fill="#6B3A7A" />
      <circle cx="42" cy="26" r="7" fill="#5A2E68" />
      <circle cx="32" cy="30" r="7.5" fill="#7C4A8C" />
      <circle cx="18" cy="38" r="7" fill="#5A2E68" />
      <circle cx="46" cy="38" r="7" fill="#6B3A7A" />
      <circle cx="32" cy="44" r="7.5" fill="#6B3A7A" />
      <circle cx="24" cy="50" r="6.5" fill="#5A2E68" />
      <circle cx="40" cy="50" r="6.5" fill="#7C4A8C" />
    </>
  ),

  'meloun-vodni': (
    <>
      <path d="M6 46c0-16 12-28 26-28s26 12 26 28H6Z" fill="#2E7A38" />
      <path d="M11 46c0-13 9-23 21-23s21 10 21 23H11Z" fill="#C3DF9E" />
      <path d="M16 46c0-10 7-18 16-18s16 8 16 18H16Z" fill="#D93A3F" />
      <ellipse cx="26" cy="38" rx="2" ry="3" fill="#2A1A1A" />
      <ellipse cx="37" cy="37" rx="2" ry="3" fill="#2A1A1A" />
      <ellipse cx="32" cy="43" rx="2" ry="3" fill="#2A1A1A" />
    </>
  ),

  'meloun-cantaloupe': (
    <>
      {/* Stejná stavba jako u vodního melounu, jen jiné barvy a síťka na
          kůře — jinak by z toho na 20 px byla béžová kupole bez významu. */}
      <path d="M6 46c0-16 12-28 26-28s26 12 26 28H6Z" fill="#BFC98A" />
      <path d="M12 46c0-13 9-23 20-23s20 10 20 23H12Z" fill="#EDE7C0" />
      <path d="M16 46c0-10 7-18 16-18s16 8 16 18H16Z" fill="#E8944A" />
      <path d="M28 46c0-5 2-9 4-9s4 4 4 9" fill="#F6D2A0" />
      <path d="M13 30c6-3 13-5 19-5s13 2 19 5M8 38c8-2 16-3 24-3s16 1 24 3" stroke="#8E9A5E" strokeWidth="1.6" fill="none" />
    </>
  ),

  papaja: (
    <>
      <path d="M32 8c12 0 20 12 20 26s-8 22-20 22-20-8-20-22S20 8 32 8Z" fill="#E8A04A" />
      <path d="M32 16c8 0 13 8 13 18s-5 14-13 14-13-4-13-14 5-18 13-18Z" fill="#E86A3A" />
      <circle cx="32" cy="34" r="9" fill="#3A2A22" />
      <circle cx="29" cy="31" r="2" fill="#6E5A4A" />
      <circle cx="35" cy="36" r="2" fill="#6E5A4A" />
    </>
  ),

  mango: (
    <>
      <path d="M40 12c4-2 8-2 10 0-2 4-6 6-10 5v-5Z" fill={C.zelen} />
      <path d="M18 26c8-10 22-12 30-6 7 6 5 20-4 28s-22 8-27 1c-4-6-4-16 1-23Z" fill="#E8A02A" />
      <path d="M24 24c8-6 17-6 22-2" stroke="#D9532A" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M22 38c2 6 6 10 11 12" stroke="#F5CE72" strokeWidth="4" strokeLinecap="round" fill="none" />
    </>
  ),

  ananas: (
    <>
      <path d="M32 6c-2 5-4 9-4 14h8c0-5-2-9-4-14ZM24 10c-2 4-3 8-3 11l5 1c0-4 0-8-2-12ZM40 10c2 4 3 8 3 11l-5 1c0-4 0-8 2-12Z" fill={C.zelen} />
      <path d="M32 20c10 0 17 7 17 18s-7 19-17 19-17-8-17-19 7-18 17-18Z" fill={C.zluta} />
      <path d="M18 28l28 18M46 28L18 46M15 38h34" stroke={C.zlutaTmava} strokeWidth="2" fill="none" />
    </>
  ),

  kiwi: (
    <>
      <circle cx="32" cy="35" r="22" fill="#7A5A36" />
      <circle cx="32" cy="35" r="18" fill="#8CB84A" />
      <ellipse cx="32" cy="35" rx="7" ry="8" fill="#EDF2D8" />
      <circle cx="32" cy="22" r="1.8" fill="#2A2418" />
      <circle cx="42" cy="28" r="1.8" fill="#2A2418" />
      <circle cx="44" cy="40" r="1.8" fill="#2A2418" />
      <circle cx="36" cy="48" r="1.8" fill="#2A2418" />
      <circle cx="26" cy="47" r="1.8" fill="#2A2418" />
      <circle cx="20" cy="38" r="1.8" fill="#2A2418" />
      <circle cx="22" cy="27" r="1.8" fill="#2A2418" />
    </>
  ),

  pomeranc: (
    <>
      <path d="M38 14c4-4 10-4 13-1-2 5-8 8-13 6v-5Z" fill={C.zelen} />
      <rect x="31" y="9" width="3" height="9" rx="1.5" fill={C.hneda} />
      <circle cx="32" cy="38" r="19" fill="#E87A22" />
      <path d="M22 29c2-3 5-5 8-6" stroke="#F5AF66" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <circle cx="32" cy="38" r="19" fill="none" stroke="#C25E10" strokeWidth="2" strokeDasharray="2 5" />
    </>
  ),

  // ── citrusy, fík a sušené ovoce ────────────────────────────────────────
  mandarinka: (
    <>
      <path d="M40 15c4-3 9-3 12 0-2 5-7 7-12 6v-6Z" fill={C.zelen} />
      <ellipse cx="30" cy="40" rx="18" ry="15" fill="#EE8A22" />
      <path d="M30 25v30M15 40h30M18 30l24 20M42 30L18 50" stroke="#C96A0E" strokeWidth="1.6" fill="none" />
      <path d="M48 34c6 2 9 7 8 12-6 1-11-3-12-9l4-3Z" fill="#F6A94E" />
    </>
  ),

  citron: (
    <>
      <path d="M42 16c4-3 8-3 11-1-2 4-6 6-11 5v-4Z" fill={C.zelen} />
      <path d="M12 34c0-10 9-16 20-16s20 6 20 16-9 17-20 17-20-7-20-17Z" fill={C.zluta} />
      <path d="M52 34c4-1 7 0 8 2-2 2-5 3-8 2v-4ZM12 34c-4-1-7 0-8 2 2 2 5 3 8 2v-4Z" fill={C.zlutaTmava} />
      <path d="M22 27c3-3 7-4 11-4" stroke="#F7E294" strokeWidth="4" strokeLinecap="round" fill="none" />
    </>
  ),

  limetka: (
    <>
      <path d="M40 14c4-3 9-3 12 0-2 5-7 7-12 6v-6Z" fill={C.zelenTmava} />
      <circle cx="26" cy="38" r="17" fill="#6FA82A" />
      <path d="M17 30c2-3 5-5 8-6" stroke="#A8CE62" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <path d="M46 22a16 16 0 1 1 0 32 16 16 0 0 1 0-32Z" fill="#D9E8AE" />
      <path d="M46 22v32M46 38h16M40 27l12 22M52 27L40 49" stroke="#8FBF4A" strokeWidth="1.8" fill="none" />
    </>
  ),

  fik: (
    <>
      <rect x="30" y="8" width="4" height="7" rx="2" fill={C.hneda} />
      <path d="M32 13c3-3 8-4 11-2-2 4-7 6-11 5Z" fill={C.zelen} />
      <path d="M25 16c4 0 7 2 7 5 0 8 12 11 12 22 0 8-6 13-14 13s-14-5-14-13c0-11 9-15 9-22 0-3-1-5 0-5Z" fill="#6E4A78" />
      <path d="M32 25c6 0 10 6 10 14s-4 12-10 12-10-4-10-12 4-14 10-14Z" fill="#D4506B" />
      <path d="M32 31c3 0 5 4 5 9s-2 7-5 7-5-2-5-7 2-9 5-9Z" fill="#F2C0C4" />
    </>
  ),

  datle: (
    <>
      <ellipse cx="22" cy="28" rx="8" ry="13" transform="rotate(-24 22 28)" fill="#7A4A22" />
      <ellipse cx="40" cy="31" rx="8" ry="13" transform="rotate(16 40 31)" fill="#5E3617" />
      <ellipse cx="30" cy="45" rx="8" ry="13" transform="rotate(-8 30 45)" fill="#8C5A2C" />
      <path d="M17 25c4 2 8 2 11 0M35 29c4 2 8 2 11 0M25 43c4 2 7 2 10 0" stroke="#B08048" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </>
  ),

  rozinky: (
    <>
      <ellipse cx="20" cy="28" rx="8" ry="6" transform="rotate(-18 20 28)" fill="#4A2A30" />
      <ellipse cx="40" cy="25" rx="8" ry="6" transform="rotate(14 40 25)" fill="#3A2026" />
      <ellipse cx="30" cy="37" rx="8.5" ry="6.5" fill="#5A343C" />
      <ellipse cx="46" cy="39" rx="7.5" ry="6" transform="rotate(-10 46 39)" fill="#4A2A30" />
      <ellipse cx="22" cy="47" rx="8" ry="6" transform="rotate(8 22 47)" fill="#3A2026" />
      <ellipse cx="38" cy="49" rx="7.5" ry="6" fill="#5A343C" />
      <path d="M16 27c3 2 5 2 8 0M36 24c3 2 5 2 8 0M26 36c3 2 5 2 8 0" stroke="#8A6068" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </>
  ),

  'susene-merunky': (
    <>
      <path d="M10 30c0-6 6-10 13-10s13 4 13 10-6 12-13 12-13-6-13-12Z" fill="#D9812A" />
      <path d="M14 29c0-4 4-6 9-6s9 2 9 6-4 8-9 8-9-4-9-8Z" fill="#E8A055" />
      <path d="M30 44c0-6 6-10 13-10s13 4 13 10-6 12-13 12-13-6-13-12Z" fill="#C56E1C" />
      <path d="M34 43c0-4 4-6 9-6s9 2 9 6-4 8-9 8-9-4-9-8Z" fill="#DE9448" />
    </>
  ),

  'susene-svestky': (
    <>
      <ellipse cx="23" cy="30" rx="11" ry="9" transform="rotate(-14 23 30)" fill="#33223A" />
      <ellipse cx="42" cy="34" rx="10" ry="8.5" transform="rotate(12 42 34)" fill="#241729" />
      <ellipse cx="30" cy="46" rx="11" ry="9" fill="#422C4A" />
      <path d="M16 28c4 3 9 3 13 0M34 33c4 3 8 3 12 0M24 45c4 3 8 3 12 0" stroke="#6E5478" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </>
  ),

  'jablecne-pyre': (
    <>
      <path d="M18 24h28v24a6 6 0 0 1-6 6H24a6 6 0 0 1-6-6V24Z" fill="#EFE2C6" />
      <path d="M18 24h28v6H18Z" fill={C.kremTmavy} />
      <path d="M21 34h22v14a4 4 0 0 1-4 4H25a4 4 0 0 1-4-4V34Z" fill="#E8C87A" />
      <path d="M32 10c3-2 7-2 9 0-1 4-5 6-9 5v-5Z" fill={C.zelen} />
      <path d="M26 22c-2-5 1-10 6-10s8 5 6 10Z" fill="#CE3B36" />
    </>
  ),

  // ── obiloviny ──────────────────────────────────────────────────────────
  'vlocky-jemne': (
    <>
      <path d="M10 40c0-3 3-5 8-6 3-6 8-9 14-9s11 3 14 9c5 1 8 3 8 6 0 5-10 9-22 9s-22-4-22-9Z" fill={C.krem} />
      <ellipse cx="22" cy="38" rx="4" ry="2.5" fill={C.kremTmavy} />
      <ellipse cx="33" cy="34" rx="4" ry="2.5" fill={C.kremTmavy} />
      <ellipse cx="43" cy="39" rx="4" ry="2.5" fill={C.kremTmavy} />
      <ellipse cx="28" cy="43" rx="4" ry="2.5" fill={C.kremTmavy} />
      <ellipse cx="39" cy="44" rx="4" ry="2.5" fill={C.kremTmavy} />
    </>
  ),

  'vlocky-velke': (
    <>
      <ellipse cx="20" cy="28" rx="10" ry="6.5" transform="rotate(-16 20 28)" fill={C.krem} />
      <ellipse cx="42" cy="27" rx="10" ry="6.5" transform="rotate(14 42 27)" fill={C.kremTmavy} />
      <ellipse cx="31" cy="38" rx="11" ry="7" fill={C.krem} />
      <ellipse cx="46" cy="42" rx="9" ry="6" transform="rotate(-12 46 42)" fill={C.kremTmavy} />
      <ellipse cx="20" cy="46" rx="10" ry="6.5" transform="rotate(10 20 46)" fill={C.kremTmavy} />
      <path d="M13 27c5 2 9 2 14 0M36 26c4 2 8 2 12 0M24 37c5 2 9 2 14 0" stroke="#BFA574" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </>
  ),

  oves: (
    <>
      <path d="M32 58V26" stroke="#B8A468" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M32 30c-6-2-10-6-11-11 6 0 10 4 11 11ZM32 40c-6-2-10-6-11-11 6 0 10 4 11 11ZM32 50c-6-2-10-6-11-11 6 0 10 4 11 11Z" fill={C.zlutaTmava} />
      <path d="M32 26c6-2 10-6 11-11-6 0-10 4-11 11ZM32 36c6-2 10-6 11-11-6 0-10 4-11 11ZM32 46c6-2 10-6 11-11-6 0-10 4-11 11Z" fill={C.zluta} />
    </>
  ),

  'mouka-psenicna': (
    <>
      {/* Hromádka bílé mouky potřebuje vlastní okraj, jinak na světlém
          podkladu zmizí; proto tmavší spodek a světlý vrch. */}
      <path d="M6 48c0-7 6-12 12-14 4-8 10-13 16-13s12 5 16 13c6 2 12 7 12 14H6Z" fill={C.bilaStin} />
      <path d="M14 48c0-6 5-10 10-12 3-6 7-10 10-10s7 4 10 10c5 2 10 6 10 12H14Z" fill={C.bila} />
      <path d="M34 21V9" stroke={C.zlutaTmava} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M34 12c-4-1-6-3-7-6 4 0 6 2 7 6ZM34 18c-4-1-6-3-7-6 4 0 6 2 7 6ZM34 10c4-1 6-3 7-6-4 0-6 2-7 6ZM34 16c4-1 6-3 7-6-4 0-6 2-7 6Z" fill={C.zluta} />
    </>
  ),

  'mouka-celozrnna': (
    <>
      <path d="M6 48c0-7 6-12 12-14 4-8 10-13 16-13s12 5 16 13c6 2 12 7 12 14H6Z" fill={C.krem} />
      <path d="M18 44c6-3 22-3 28 0" stroke={C.kremTmavy} strokeWidth="2.5" fill="none" />
      <circle cx="24" cy="40" r="1.8" fill="#B08048" />
      <circle cx="40" cy="41" r="1.8" fill="#B08048" />
      <circle cx="32" cy="37" r="1.8" fill="#B08048" />
      <path d="M34 21V9" stroke={C.hneda} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M34 12c-4-1-6-3-7-6 4 0 6 2 7 6ZM34 18c-4-1-6-3-7-6 4 0 6 2 7 6ZM34 10c4-1 6-3 7-6-4 0-6 2-7 6ZM34 16c4-1 6-3 7-6-4 0-6 2-7 6Z" fill={C.hnedaSvetla} />
    </>
  ),

  'mouka-spaldova': (
    <>
      <path d="M6 48c0-7 6-12 12-14 4-8 10-13 16-13s12 5 16 13c6 2 12 7 12 14H6Z" fill={C.kremTmavy} />
      <path d="M18 44c6-3 22-3 28 0" stroke="#B08048" strokeWidth="2.5" fill="none" />
      <path d="M34 21V6" stroke="#8C6239" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M28 10l6 4-6 4M40 10l-6 4 6 4M28 18l6 4-6 4M40 18l-6 4 6 4" stroke="#B98A56" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>
  ),

  // ── pečivo, těstoviny a sypké obiloviny ────────────────────────────────
  'mouka-zitna': (
    <>
      <path d="M6 48c0-7 6-12 12-14 4-8 10-13 16-13s12 5 16 13c6 2 12 7 12 14H6Z" fill="#B5A98E" />
      <path d="M18 44c6-3 22-3 28 0" stroke="#8E836B" strokeWidth="2.5" fill="none" />
      <path d="M34 21V4" stroke="#6E6450" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M34 8c-3-2-5-4-5-7 3 1 5 3 5 7ZM34 14c-3-2-5-4-5-7 3 1 5 3 5 7ZM34 20c-3-2-5-4-5-7 3 1 5 3 5 7ZM34 8c3-2 5-4 5-7-3 1-5 3-5 7ZM34 14c3-2 5-4 5-7-3 1-5 3-5 7ZM34 20c3-2 5-4 5-7-3 1-5 3-5 7Z" fill="#9E9074" />
    </>
  ),

  'chleb-kvaskovy': (
    <>
      <ellipse cx="32" cy="38" rx="24" ry="18" fill="#A9702F" />
      <ellipse cx="32" cy="35" rx="24" ry="16" fill="#C68A42" />
      <path d="M18 30c6 4 10 9 12 15M30 26c6 4 10 9 12 15" stroke="#8A5522" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M14 32c8-5 28-5 36 0" stroke="#DEA967" strokeWidth="3" fill="none" />
    </>
  ),

  'chleb-toustovy': (
    <>
      <path d="M16 26c0-8 7-13 16-13s16 5 16 13v24a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4V26Z" fill="#E8C78A" />
      <path d="M20 28c0-6 5-10 12-10s12 4 12 10v20H20V28Z" fill="#F5E2B8" />
      <path d="M11 24c0-6 3-9 6-9v14c-3 0-6-2-6-5ZM53 24c0-6-3-9-6-9v14c3 0 6-2 6-5Z" fill="#E8C78A" />
    </>
  ),

  rohlik: (
    <>
      <path d="M10 44c0-4 3-6 6-7 5-9 12-14 20-14 9 0 16 6 18 14 3 1 6 3 6 7 0 3-3 5-7 5-6 0-11-3-13-8-1-4-3-7-6-7s-5 3-6 7c-2 5-7 8-13 8-3 0-5-2-5-5Z" fill="#D9A455" />
      <path d="M20 38c3-5 7-8 12-9M34 29c5 1 9 4 11 9" stroke="#F0CE8E" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M27 34l-2 6M32 32v7M37 34l2 6" stroke="#A9702F" strokeWidth="2" strokeLinecap="round" fill="none" />
    </>
  ),

  'testoviny-semolinove': (
    <>
      <path d="M14 22c6 4 6 10 0 14s-6 10 0 14" stroke={C.zluta} strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M32 18c6 4 6 10 0 14s-6 10 0 14 6 10 0 14" stroke="#F2D468" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M50 22c-6 4-6 10 0 14s6 10 0 14" stroke={C.zlutaTmava} strokeWidth="7" strokeLinecap="round" fill="none" />
    </>
  ),

  'testoviny-celozrnne': (
    <>
      <path d="M14 22c6 4 6 10 0 14s-6 10 0 14" stroke="#A9702F" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M32 18c6 4 6 10 0 14s-6 10 0 14 6 10 0 14" stroke="#C68A42" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M50 22c-6 4-6 10 0 14s6 10 0 14" stroke="#8A5522" strokeWidth="7" strokeLinecap="round" fill="none" />
    </>
  ),

  kuskus: hromadka((x, y, _u, i) => (
    <circle key={i} cx={x} cy={y} r="3.2" fill={i % 2 === 0 ? '#E8CF94' : '#D4B571'} />
  )),

  bulgur: hromadka((x, y, u, i) => (
    <rect
      key={i}
      x={x - 4}
      y={y - 3}
      width="8"
      height="6"
      rx="1.5"
      transform={`rotate(${u} ${x} ${y})`}
      fill={i % 2 === 0 ? '#C89A56' : '#A87C3C'}
    />
  )),

  'ryze-basmati': hromadka((x, y, u, i) => (
    <ellipse
      key={i}
      cx={x}
      cy={y}
      rx="8"
      ry="3.2"
      transform={`rotate(${u} ${x} ${y})`}
      fill={i % 2 === 0 ? C.bila : C.bilaStin}
      stroke="#BFB8A4"
      strokeWidth="1.2"
    />
  )),

  'ryze-kulatozrnna': hromadka((x, y, u, i) => (
    <ellipse
      key={i}
      cx={x}
      cy={y}
      rx="5.2"
      ry="4.4"
      transform={`rotate(${u} ${x} ${y})`}
      fill={i % 2 === 0 ? C.bila : C.bilaStin}
      stroke="#BFB8A4"
      strokeWidth="1.2"
    />
  )),

  'ryze-natural': hromadka((x, y, u, i) => (
    <ellipse
      key={i}
      cx={x}
      cy={y}
      rx="8"
      ry="3.2"
      transform={`rotate(${u} ${x} ${y})`}
      fill={i % 2 === 0 ? '#B98A56' : '#96683A'}
    />
  )),

  'ryzove-chlebicky': (
    <>
      <ellipse cx="32" cy="44" rx="23" ry="9" fill={C.kremTmavy} />
      <ellipse cx="32" cy="34" rx="23" ry="16" fill={C.krem} />
      <circle cx="22" cy="30" r="4" fill={C.bila} />
      <circle cx="34" cy="27" r="4.5" fill={C.bila} />
      <circle cx="44" cy="33" r="4" fill={C.bila} />
      <circle cx="27" cy="40" r="4" fill={C.bila} />
      <circle cx="40" cy="42" r="3.5" fill={C.bila} />
      <circle cx="15" cy="36" r="3" fill={C.bila} />
    </>
  ),

  jahly: hromadka((x, y, _u, i) => (
    <circle key={i} cx={x} cy={y} r="3.6" fill={i % 2 === 0 ? '#E8C43F' : '#C9A522'} />
  )),

  'pohanka-lamanka': hromadka((x, y, u, i) => (
    <path
      key={i}
      d={`M${x} ${y - 4.6}L${x + 5} ${y + 3.4}L${x - 5} ${y + 3.4}Z`}
      transform={`rotate(${u} ${x} ${y})`}
      fill={i % 2 === 0 ? '#BFA47A' : '#9E855C'}
    />
  )),

  'pohanka-kroupy': hromadka((x, y, u, i) => (
    <path
      key={i}
      d={`M${x} ${y - 5.4}L${x + 5.4} ${y + 3.8}L${x - 5.4} ${y + 3.8}Z`}
      transform={`rotate(${u} ${x} ${y})`}
      fill={i % 2 === 0 ? '#7E6440' : '#5E4A2C'}
    />
  )),

  // ── drobná zrna a luštěniny ────────────────────────────────────────────
  quinoa: hromadka((x, y, _u, i) => (
    <g key={i}>
      <circle cx={x} cy={y} r="4.4" fill={i % 2 === 0 ? '#E4D6B2' : '#CDBC92' } />
      <circle cx={x} cy={y} r="2" fill="none" stroke="#A8946A" strokeWidth="1.4" />
    </g>
  )),

  amarant: hromadka((x, y, _u, i) => (
    <g key={i}>
      <circle cx={x - 4} cy={y} r="2.4" fill="#E8D48A" />
      <circle cx={x + 3} cy={y - 3} r="2.4" fill="#CFB962" />
      <circle cx={x + 2} cy={y + 3} r="2.4" fill="#E8D48A" />
    </g>
  )),

  polenta: (
    <>
      <path d="M10 46c0-6 5-11 11-13 3-6 7-10 11-10s8 4 11 10c6 2 11 7 11 13H10Z" fill={C.zluta} />
      <circle cx="22" cy="41" r="2" fill={C.zlutaTmava} />
      <circle cx="32" cy="36" r="2" fill={C.zlutaTmava} />
      <circle cx="41" cy="42" r="2" fill={C.zlutaTmava} />
      <circle cx="28" cy="44" r="2" fill={C.zlutaTmava} />
      <circle cx="36" cy="45" r="2" fill={C.zlutaTmava} />
    </>
  ),

  krupice: (
    <>
      <path d="M10 46c0-6 5-11 11-13 3-6 7-10 11-10s8 4 11 10c6 2 11 7 11 13H10Z" fill={C.bilaStin} />
      <path d="M17 46c0-5 4-9 8-11 2-4 5-7 7-7s5 3 7 7c4 2 8 6 8 11H17Z" fill={C.bila} />
      <circle cx="26" cy="40" r="1.4" fill={C.kremTmavy} />
      <circle cx="35" cy="38" r="1.4" fill={C.kremTmavy} />
      <circle cx="31" cy="44" r="1.4" fill={C.kremTmavy} />
    </>
  ),

  'kroupy-jecne': hromadka((x, y, u, i) => (
    <g key={i} transform={`rotate(${u} ${x} ${y})`}>
      <ellipse cx={x} cy={y} rx="6" ry="4.6" fill={i % 2 === 0 ? '#E2D5B4' : '#C9B98F'} />
      <path d={`M${x - 3} ${y}h6`} stroke="#A8946A" strokeWidth="1.4" strokeLinecap="round" />
    </g>
  )),

  'cocka-cervena': hromadka((x, y, _u, i) => (
    <g key={i}>
      <circle cx={x} cy={y} r="5" fill={i % 2 === 0 ? '#E07A38' : '#C25E22'} />
      <path d={`M${x - 3.4} ${y}a3.4 3.4 0 0 1 6.8 0`} fill="#F0A470" />
    </g>
  )),

  'cocka-hneda': hromadka((x, y, _u, i) => (
    <g key={i}>
      <circle cx={x} cy={y} r="5" fill={i % 2 === 0 ? '#A07A4A' : '#7E5C34'} />
      <path d={`M${x - 3.4} ${y}a3.4 3.4 0 0 1 6.8 0`} fill="#C09A68" />
    </g>
  )),

  'cocka-beluga': hromadka((x, y, _u, i) => (
    <g key={i}>
      <circle cx={x} cy={y} r="5" fill={i % 2 === 0 ? '#2E2A2E' : '#1C191C'} />
      <path d={`M${x - 3.4} ${y}a3.4 3.4 0 0 1 6.8 0`} fill="#585158" />
    </g>
  )),

  cizrna: (
    <>
      <circle cx="20" cy="40" r="10" fill="#DCC084" />
      <circle cx="42" cy="41" r="9.5" fill="#C4A465" />
      <circle cx="31" cy="26" r="9.5" fill="#DCC084" />
      <path d="M20 30c1-3 2-4 3-5M42 32c1-3 2-4 3-4M31 17c1-3 2-4 3-4" stroke="#A8874A" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="17" cy="36" r="2.4" fill="#F0DDB0" />
      <circle cx="28" cy="22" r="2.4" fill="#F0DDB0" />
    </>
  ),

  'fazole-bile': (
    <>
      {fazole(20, 40, -12, C.bila, 1, '#BFB8A4')}
      {fazole(42, 42, 14, C.bilaStin, 2, '#BFB8A4')}
      {fazole(31, 26, -4, C.bila, 3, '#BFB8A4')}
    </>
  ),

  'fazole-kidney': (
    <>
      {fazole(20, 40, -12, '#8E2A24', 1)}
      {fazole(42, 42, 14, '#6E1E1A', 2)}
      {fazole(31, 26, -4, '#A33830', 3)}
      <path d="M17 39h7M39 41h7M28 25h7" stroke="#C97068" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </>
  ),

  'fazole-adzuki': hromadka((x, y, _u, i) => (
    <g key={i}>
      <ellipse cx={x} cy={y} rx="5.4" ry="4.4" fill={i % 2 === 0 ? '#7E2A22' : '#5E1C16'} />
      <path d={`M${x - 2.6} ${y}h5.2`} stroke="#E8D8C8" strokeWidth="1.6" strokeLinecap="round" />
    </g>
  )),

  'fazolky-mungo': hromadka((x, y, _u, i) => (
    <g key={i}>
      <ellipse cx={x} cy={y} rx="5" ry="4.2" fill={i % 2 === 0 ? '#4E7A32' : '#3A5E24'} />
      <path d={`M${x - 2.4} ${y}h4.8`} stroke="#D8E8C0" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  )),

  'soja-edamame': (
    <>
      <path d="M10 34c0-7 8-12 18-12s18 5 18 12-8 12-18 12-18-5-18-12Z" fill="#6E9B3A" />
      <circle cx="19" cy="34" r="5" fill="#4E7A2A" />
      <circle cx="31" cy="34" r="5" fill="#4E7A2A" />
      <circle cx="42" cy="34" r="4.5" fill="#4E7A2A" />
      <path d="M46 30c5-2 9-1 11 2-3 3-7 4-11 2v-4Z" fill="#6E9B3A" />
      <path d="M16 26c8-3 18-3 26 0" stroke="#9EC46A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M22 48c6 6 16 7 24 3-6-6-17-7-24-3Z" fill="#5E8C30" />
    </>
  ),

  'mouka-cizrnova': (
    <>
      <path d="M6 48c0-7 6-12 12-14 4-8 10-13 16-13s12 5 16 13c6 2 12 7 12 14H6Z" fill="#E4CE8C" />
      <path d="M18 44c6-3 22-3 28 0" stroke="#C4A95E" strokeWidth="2.5" fill="none" />
      <circle cx="34" cy="14" r="8" fill="#DCC084" />
      <path d="M34 6c1-2 2-3 3-4" stroke="#A8874A" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="31" cy="11" r="2" fill="#F0DDB0" />
    </>
  ),

  hummus: (
    <>
      <path d="M8 34h48c0 12-11 20-24 20S8 46 8 34Z" fill={C.bila} />
      <path d="M12 34h40c0 9-9 15-20 15s-20-6-20-15Z" fill="#E4CE8C" />
      <path d="M22 38c4-4 12-5 18-2" stroke="#C4A95E" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M32 24c-3 4-3 7 0 10 3-3 3-6 0-10Z" fill="#6E9B3A" />
      <circle cx="24" cy="30" r="3" fill="#DCC084" />
      <circle cx="41" cy="30" r="3" fill="#DCC084" />
    </>
  ),

  // ── maso ───────────────────────────────────────────────────────────────
  'kureci-prsa': (
    <>
      <path d="M18 24c6-7 16-10 24-7 9 3 13 11 10 19-3 9-13 15-22 14-8-1-14-7-14-14 0-5 1-9 2-12Z" fill="#EFC3B0" />
      <path d="M24 28c5-4 12-5 17-2" stroke="#F8DCD0" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M28 40c4 2 9 2 13 0" stroke="#D9A08A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>
  ),

  'kureci-stehno': palicka('#E8B49E', '#F5D8CA'),

  'kruti-prsa': (
    <>
      <path d="M12 28c6-9 18-13 28-10 11 4 16 13 12 22-4 10-16 16-26 15-9-1-16-8-16-15 0-5 1-9 2-12Z" fill="#E0AE9A" />
      <path d="M20 30c6-5 14-6 20-3" stroke="#F2D0C0" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <path d="M24 42c6 3 12 3 17 0" stroke="#C4917A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>
  ),

  'kruti-stehno': palicka('#C99A82', '#E8BCA6'),

  'hovezi-zadni': platek('#9E3026', '#EFD8C8', '#C96B58'),

  'hovezi-mlete': (
    <>
      <path d="M10 44c0-5 4-9 9-11 3-6 8-9 13-9s10 3 13 9c5 2 9 6 9 11 0 4-11 8-22 8s-22-4-22-8Z" fill="#A83A2C" />
      <path d="M18 40c4-3 8-4 12-3M28 32c4-2 8-2 12 0M34 42c4-2 8-3 12-2M20 46c5-2 9-2 13-1" stroke="#CE6A55" strokeWidth="3" strokeLinecap="round" fill="none" />
    </>
  ),

  teleci: platek('#C96A5E', '#F2E2D2', '#E09888'),

  'veprova-panenka': (
    <>
      <path d="M8 38c0-6 6-10 14-11 8-1 22-1 30 1 6 1 8 5 8 9s-3 8-9 9c-9 2-22 2-30 1-8-1-13-4-13-9Z" fill="#E09A88" />
      <path d="M14 34c8-2 26-2 36 0" stroke="#F2C8B8" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M16 44c8 2 26 2 34 0" stroke="#C4715E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>
  ),

  'veprova-kyta': platek('#DE8C78', '#F5E4D4', '#F0B8A4'),

  kralik: (
    <>
      <path d="M16 24c6-7 16-9 24-6 9 3 13 10 11 18-3 9-12 14-21 13-8-1-15-6-15-13 0-4 0-8 1-12Z" fill="#EFD2C0" />
      <path d="M22 28c5-4 12-5 17-2" stroke="#F8E8DC" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M18 46l-6 8" stroke={C.krem} strokeWidth="7" strokeLinecap="round" fill="none" />
      <circle cx="11" cy="54" r="5.5" fill={C.bila} />
      <path d="M26 38c5 2 10 2 14 0" stroke="#D9AE96" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>
  ),

  'kaci-prsa': (
    <>
      <path d="M12 40c0-5 5-9 12-11 9-3 24-4 32-2 6 2 8 6 8 10s-4 8-10 9c-10 2-24 2-32 0-6-1-10-3-10-6Z" fill="#8E2E28" />
      <path d="M14 32c8-4 26-6 38-4 5 1 7 4 7 7H13c-1-1-1-2 1-3Z" fill="#F2E2CE" />
      <path d="M20 30l-3 5M28 28l-3 5M36 28l-3 5M44 29l-3 5" stroke="#D9C4A8" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M20 45c8 2 22 2 30 0" stroke="#B4574E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>
  ),

  jehneci: (
    <>
      {/* Kotleta: medailonek masa a z něj vyčnívající žebro — bez kosti by
          jehněčí splynulo s telecím plátkem. */}
      <path d="M40 14c8-2 15 2 17 9" stroke={C.bila} strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M14 34c3-9 12-14 21-12 9 2 15 9 13 18-2 9-11 15-20 14s-16-7-16-14c0-2 1-4 2-6Z" fill="#EFD8C8" />
      <path d="M19 35c3-6 10-9 16-8 7 2 11 7 10 14-2 7-9 11-16 10-6-1-11-5-11-11 0-2 0-4 1-5Z" fill="#A8372B" />
      <path d="M26 38c4-2 9-2 13 0" stroke="#CE6A55" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>
  ),

  'kureci-jatra': (
    <>
      <path d="M32 20c8-5 18-3 22 4 5 8 1 20-8 25-7 4-15 3-19-2-3 5-10 7-15 4-7-4-9-14-4-21 5-8 16-13 24-10Z" fill="#6E2622" />
      <path d="M22 34c4-3 9-4 13-3" stroke="#9E4038" strokeWidth="4" strokeLinecap="round" fill="none" />
    </>
  ),

  'teleci-jatra': (
    <>
      <path d="M30 16c10-6 22-3 27 6 5 10 0 24-11 30-9 5-19 3-23-3-4 6-12 8-18 4-8-5-10-17-4-26 7-10 19-15 29-11Z" fill="#4E1A18" />
      <path d="M20 36c5-4 11-5 16-4" stroke="#7E2C28" strokeWidth="4.5" strokeLinecap="round" fill="none" />
    </>
  ),

  'sunka-od-kosti': (
    <>
      <path d="M16 22c8-6 24-6 32 0 7 5 9 15 5 23-5 9-17 13-27 10-9-3-14-11-13-20 0-5 1-9 3-13Z" fill="#E8A093" />
      <path d="M24 26c7-4 17-4 23 0" stroke="#F5CDC2" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <path d="M20 44c8 4 20 4 28-1" stroke="#C4736A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M14 48l-6 8" stroke={C.krem} strokeWidth="7" strokeLinecap="round" fill="none" />
      <circle cx="8" cy="55" r="5.5" fill={C.bila} />
    </>
  ),

  // ── ryby a mořské plody ────────────────────────────────────────────────
  losos: filet('#E8804E', '#F7C3A2', '#C9C4B8'),

  'treska-obecna': filet('#F0E6D6', '#D4C8B4', '#BFB8A4'),

  'treska-tmava': filet('#D8CFC0', '#A89C88', '#6E6A62'),

  tunak: (
    <>
      <path d="M10 34c0-10 10-18 22-18s22 8 22 18-10 18-22 18-22-8-22-18Z" fill="#8E2A2E" />
      <path d="M14 34c0-8 8-14 18-14s18 6 18 14-8 14-18 14-18-6-18-14Z" fill="#A8353A" />
      <path d="M24 22c2 8 2 16 0 24M32 20c2 9 2 19 0 28M40 22c2 8 2 16 0 24" stroke="#C4595E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>
  ),

  'pstruh-duhovy': ryba(
    '#8E9AA8',
    '#E4E8EC',
    <>
      {/* Duhový pruh patří pod čáru očí, jinak se čte jako ústa. */}
      <path d="M13 35c9 2 22 1 33-4" stroke="#D9628E" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="24" cy="23" r="1.5" fill="#3E4750" />
      <circle cx="32" cy="26" r="1.5" fill="#3E4750" />
      <circle cx="40" cy="22" r="1.5" fill="#3E4750" />
      <circle cx="36" cy="33" r="1.5" fill="#3E4750" />
      <circle cx="28" cy="38" r="1.5" fill="#3E4750" />
    </>,
  ),

  candat: ryba(
    '#9EA890',
    '#E8EAE0',
    <>
      <path d="M22 20l3-7 3 7 3-7 3 7 3-6 3 6" stroke="#6E7A62" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M20 34c8 2 18 2 26-2" stroke="#7E8A70" strokeWidth="2.5" fill="none" />
    </>,
  ),

  stika: (
    <>
      <path d="M54 32c3-4 6-6 8-6 1 4 1 9 0 13-2 0-5-3-8-7Z" fill="#5E7A4A" />
      <path d="M2 32c2-5 8-8 16-9 12-2 28 0 36 5 4 2 4 6 0 8-8 5-24 7-36 5-8-1-14-4-16-9Z" fill="#5E7A4A" />
      <path d="M6 36c6 4 16 6 26 6 9 0 18-2 24-5-6 5-15 8-24 8-11 0-21-3-26-9Z" fill="#D8E0C8" />
      <path d="M28 27c2 3 2 7 0 10M36 26c2 4 2 8 0 12M44 27c2 3 2 7 0 10" stroke="#8FA870" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="12" cy="30" r="2.4" fill="#20262A" />
    </>
  ),

  kapr: (
    <>
      <path d="M52 32c4-5 8-8 10-8 1 5 1 12 0 17-2 0-6-4-10-9Z" fill="#8E7A46" />
      <path d="M6 32c0-11 11-19 24-19s22 8 22 19-9 19-22 19S6 43 6 32Z" fill="#A8924E" />
      <path d="M10 37c5 7 14 11 22 11 9 0 17-4 20-9-4 7-11 11-20 11-10 0-18-5-22-13Z" fill="#E0D4A8" />
      <path d="M20 24c3 2 3 6 0 8M28 21c3 2 3 6 0 8M36 23c3 2 3 6 0 8M24 34c3 2 3 6 0 8M32 33c3 2 3 6 0 8M40 32c3 2 3 6 0 8" stroke="#7E6A36" strokeWidth="2" fill="none" />
      <circle cx="15" cy="27" r="2.6" fill="#20262A" />
    </>
  ),

  makrela: ryba(
    '#5E7A8E',
    '#E4EAEE',
    <path
      d="M14 24c4 3 8 3 12 0M26 22c4 3 8 3 12 0M38 23c4 3 7 3 10 0M18 30c4 3 8 3 12 0M32 29c4 3 8 3 12 0"
      stroke="#2E3E4E"
      strokeWidth="2.4"
      strokeLinecap="round"
      fill="none"
    />,
  ),

  'sardinky-v-oleji': (
    <>
      <path d="M8 26h48v22a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V26Z" fill="#B8BCC0" />
      <path d="M12 30h40v18H12Z" fill="#8E9AA8" />
      <path d="M14 36c4-3 12-3 16 0-4 3-12 3-16 0ZM34 36c4-3 12-3 16 0-4 3-12 3-16 0ZM14 44c4-3 12-3 16 0-4 3-12 3-16 0ZM34 44c4-3 12-3 16 0-4 3-12 3-16 0Z" fill="#E4E8EC" />
      <path d="M56 26l4-12c1 5 1 9 0 13l-4 1Z" fill="#D8DCE0" />
    </>
  ),

  krevety: (
    <>
      <path d="M44 16c-14 0-24 9-24 20 0 8 6 14 14 14 6 0 11-4 11-10 0-5-4-8-8-8-3 0-5 2-5 4" stroke="#E8734E" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M44 16c-11 0-19 6-22 14M30 46c5 2 10 0 12-4" stroke="#F6A98A" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M44 16c5-3 10-4 14-2-3 4-8 6-14 6v-4Z" fill="#E8734E" />
      <circle cx="44" cy="19" r="2.2" fill="#3A2018" />
    </>
  ),

  // ── mléčné výrobky ─────────────────────────────────────────────────────
  'jogurt-bily': (
    <>
      <path d="M16 20h32l-4 32a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4L16 20Z" fill={C.bila} />
      <path d="M14 16h36v6H14Z" fill={C.bilaStin} />
      <path d="M21 26h22l-3 24H24l-3-24Z" fill="#F8F5EC" />
      <path d="M25 32c4-2 10-2 14 0" stroke={C.bilaStin} strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>
  ),

  'jogurt-recky': (
    <>
      <path d="M16 24h32l-4 28a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4L16 24Z" fill={C.bilaStin} />
      <path d="M14 20h36v6H14Z" fill={C.kremTmavy} />
      <path d="M32 6c6 0 10 4 10 8 0 3-2 5-5 6h-10c-3-1-5-3-5-6 0-4 4-8 10-8Z" fill={C.bila} />
      <path d="M21 30h22l-3 22H24l-3-22Z" fill={C.bila} />
    </>
  ),

  kefir: (
    <>
      <path d="M26 8h12v8l6 8v28a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4V24l6-8V8Z" fill={C.bilaStin} />
      <path d="M23 28h18v22a2 2 0 0 1-2 2H25a2 2 0 0 1-2-2V28Z" fill={C.bila} />
      <circle cx="29" cy="36" r="2.4" fill={C.bilaStin} />
      <circle cx="36" cy="42" r="2" fill={C.bilaStin} />
      <circle cx="29" cy="46" r="1.8" fill={C.bilaStin} />
      <path d="M25 6h14v4H25Z" fill={C.kremTmavy} />
    </>
  ),

  'tvaroh-polotucny': (
    <>
      <path d="M12 30l20-10 20 10-20 10-20-10Z" fill={C.bila} />
      <path d="M12 30v14l20 10V40L12 30Z" fill={C.bilaStin} />
      <path d="M52 30v14L32 54V40l20-10Z" fill="#E4DECD" />
      <circle cx="22" cy="29" r="2.2" fill={C.bilaStin} />
      <circle cx="34" cy="25" r="2.4" fill={C.bilaStin} />
      <circle cx="42" cy="31" r="2" fill={C.bilaStin} />
      <circle cx="30" cy="33" r="2" fill={C.bilaStin} />
    </>
  ),

  // ── tvarohy, sýry a tuky ───────────────────────────────────────────────
  'tvaroh-mekky': kelimek(
    C.bila,
    C.bilaStin,
    <path d="M24 34c4-3 12-3 16 0-4 4-12 4-16 0Z" fill="#F8F5EC" />,
  ),

  ricotta: (
    <>
      {/* Ricotta se cedí v košíčku, takže má po obvodu rýhy — bez nich by
          z ní byla jen bílá kupole. */}
      <path d="M10 52c0-14 10-26 22-26s22 12 22 26H10Z" fill={C.bilaStin} />
      <path d="M14 52c0-12 8-22 18-22s18 10 18 22H14Z" fill={C.bila} />
      <path d="M20 38c8-3 16-3 24 0M15 45c11-4 23-4 34 0" stroke="#D2CBB8" strokeWidth="2.5" fill="none" />
      <path d="M32 26c-3 0-6 2-6 5h12c0-3-3-5-6-5Z" fill="#FBFAF6" />
    </>
  ),

  mascarpone: kelimek(
    '#FBF8F0',
    C.kremTmavy,
    <path d="M26 36c3-4 9-4 12 0-3 3-9 3-12 0Z" fill={C.bilaStin} />,
  ),

  cottage: kelimek(
    C.bilaStin,
    '#C9D6DE',
    <>
      <circle cx="27" cy="36" r="3" fill={C.bila} />
      <circle cx="36" cy="34" r="3" fill={C.bila} />
      <circle cx="31" cy="43" r="3" fill={C.bila} />
      <circle cx="38" cy="44" r="2.6" fill={C.bila} />
    </>,
  ),

  mozzarella: (
    <>
      <path d="M8 44c0-4 4-6 8-7 3-2 8-3 16-3s13 1 16 3c4 1 8 3 8 7 0 5-11 8-24 8S8 49 8 44Z" fill="#D8E4EA" />
      <circle cx="32" cy="30" r="17" fill={C.bila} />
      <path d="M21 22c4-4 9-6 14-6" stroke="#FBFAF6" strokeWidth="5" strokeLinecap="round" fill="none" />
    </>
  ),

  zerve: (
    <>
      {/* Porcička v kelímku s víčkem; samotný bílý disk byl na světlém
          podkladu sotva vidět. */}
      <path d="M32 20c11 0 20 4 20 9v13c0 6-9 10-20 10s-20-4-20-10V29c0-5 9-9 20-9Z" fill="#D9D3C2" />
      <ellipse cx="32" cy="29" rx="20" ry="9" fill={C.bila} />
      <ellipse cx="32" cy="29" rx="13" ry="5.5" fill="#E8E2D2" />
      <path d="M12 29v13c0 6 9 10 20 10" stroke="#BFB8A4" strokeWidth="2" fill="none" />
    </>
  ),

  eidam: klin(
    '#F0C74A',
    '#D9A92E',
    <>
      <circle cx="26" cy="36" r="3.4" fill="#D9A92E" />
      <circle cx="38" cy="32" r="2.8" fill="#D9A92E" />
      <circle cx="42" cy="41" r="2.4" fill="#D9A92E" />
    </>,
  ),

  gouda: klin(
    '#EFBF52',
    '#C4382C',
    <>
      <circle cx="28" cy="38" r="2.6" fill="#D2A035" />
      <circle cx="40" cy="35" r="2.2" fill="#D2A035" />
    </>,
  ),

  emental: klin(
    '#F5DE8E',
    '#DCC15E',
    <>
      <circle cx="24" cy="38" r="5" fill="#DCC15E" />
      <circle cx="38" cy="31" r="4.4" fill="#DCC15E" />
      <circle cx="44" cy="42" r="3.6" fill="#DCC15E" />
    </>,
  ),

  parmazan: klin(
    '#F0DCA0',
    '#C9A96E',
    <>
      <circle cx="26" cy="36" r="1.4" fill="#CFB884" />
      <circle cx="33" cy="32" r="1.4" fill="#CFB884" />
      <circle cx="39" cy="38" r="1.4" fill="#CFB884" />
      <circle cx="45" cy="32" r="1.4" fill="#CFB884" />
      <circle cx="31" cy="41" r="1.4" fill="#CFB884" />
    </>,
  ),

  pecorino: klin(
    '#EFD07A',
    '#4E3A22',
    <>
      <circle cx="28" cy="37" r="1.4" fill="#CDA94E" />
      <circle cx="36" cy="32" r="1.4" fill="#CDA94E" />
      <circle cx="43" cy="38" r="1.4" fill="#CDA94E" />
    </>,
  ),

  'grana-padano': (
    <>
      {klin('#F2E4B8', '#D9C48A')}
      <path d="M10 52l10-8 8 6-6 8-12-6Z" fill="#F2E4B8" />
      <path d="M14 50l6 4" stroke="#D9C48A" strokeWidth="2" strokeLinecap="round" fill="none" />
    </>
  ),

  maslo: (
    <>
      <path d="M10 34l14-8 30 8-14 8-30-8Z" fill="#F7DC7E" />
      <path d="M10 34v10l30 8V42L10 34Z" fill="#EFC94E" />
      <path d="M54 34v10l-14 8V42l14-8Z" fill="#D9AE2E" />
      <path d="M24 26l30 8" stroke="#FBEFB8" strokeWidth="3" strokeLinecap="round" fill="none" />
    </>
  ),

  ghi: (
    <>
      <path d="M26 8h12v6l4 6v30a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4V20l4-6V8Z" fill="#EFE6D2" />
      <path d="M25 26h14v26a2 2 0 0 1-2 2H27a2 2 0 0 1-2-2V26Z" fill="#E8B93E" />
      <path d="M25 6h14v5H25Z" fill={C.hnedaSvetla} />
      <path d="M28 32c4-2 8-2 8 0" stroke="#F5D88A" strokeWidth="3" strokeLinecap="round" fill="none" />
    </>
  ),

  'smetana-ke-slehani': (
    <>
      {/* Krabice má vlastní barvu, jinak bílá na bílém podkladu zmizí. */}
      <path d="M18 26h28v26a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4V26Z" fill="#BFD2DE" />
      <path d="M18 26l14-14 14 14H18Z" fill="#9FBACB" />
      <path d="M23 34h18v18H23Z" fill={C.bila} />
      <path d="M32 6c5 0 8 3 8 6 0 3-2 5-5 6h-6c-3-1-5-3-5-6 0-3 3-6 8-6Z" fill={C.bila} />
      <path d="M27 40c4-2 8-2 11 0" stroke="#D9D3C2" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>
  ),

  'zakysana-smetana': kelimek(
    C.bila,
    '#BFD4C4',
    <>
      <path d="M24 36c5-4 11-4 16 0-5 4-11 4-16 0Z" fill={C.bilaStin} />
      <path d="M42 20l8-10" stroke={C.bilaStin} strokeWidth="4" strokeLinecap="round" fill="none" />
    </>,
  ),

  'kravske-mleko': (
    <>
      <path d="M22 16h20v8l4 8v20a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4V32l4-8v-8Z" fill={C.bilaStin} />
      <path d="M21 34h22v18a2 2 0 0 1-2 2H23a2 2 0 0 1-2-2V34Z" fill={C.bila} />
      <path d="M21 12h22v6H21Z" fill="#8FB6D9" />
      <path d="M25 40c5-2 10-2 14 0" stroke={C.bilaStin} strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>
  ),

  'vejce-slepici': (
    <>
      <ellipse cx="24" cy="36" rx="14" ry="18" fill="#F2E0C8" />
      <path d="M15 30c2-6 6-10 10-11" stroke="#FBF2E4" strokeWidth="5" strokeLinecap="round" fill="none" />
      <ellipse cx="45" cy="44" rx="15" ry="11" fill={C.bila} />
      <circle cx="45" cy="44" r="6" fill="#EFB92E" />
    </>
  ),

  // ── ořechy, semínka a tuky ─────────────────────────────────────────────
  'arasidove-maslo': sklenice(
    '#C08A46',
    <>
      <ellipse cx="32" cy="38" rx="9" ry="6" fill="#DCAE6E" />
      <path d="M26 38c3-2 9-2 12 0" stroke="#A06E2E" strokeWidth="2" fill="none" />
    </>,
  ),

  'mandlove-maslo': sklenice(
    '#CFA77E',
    <ellipse cx="32" cy="38" rx="6" ry="9" fill="#E8CBAE" />,
  ),

  'kesu-maslo': sklenice(
    '#E2C89E',
    <path d="M26 42c-2-6 2-11 8-11 5 0 8 3 8 7 0 3-2 5-5 5-2 0-3-1-3-3" stroke="#C4A472" strokeWidth="5" strokeLinecap="round" fill="none" />,
  ),

  'liskooriskove-maslo': sklenice(
    '#8E5E34',
    <>
      <circle cx="32" cy="40" r="8" fill="#C08A56" />
      <path d="M24 36c4-4 12-4 16 0Z" fill="#6E4A22" />
    </>,
  ),

  tahini: sklenice(
    '#DED3B4',
    <>
      <ellipse cx="28" cy="38" rx="3" ry="2" fill="#F2ECD8" />
      <ellipse cx="36" cy="36" rx="3" ry="2" fill="#F2ECD8" />
      <ellipse cx="32" cy="44" rx="3" ry="2" fill="#F2ECD8" />
    </>,
  ),

  'seminka-lnena': (
    <>
      {mleto('#C4A87E')}
      {hromadka((x, y, u, i) =>
        y > 40 ? null : (
          <ellipse
            key={i}
            cx={x}
            cy={y - 6}
            rx="5.4"
            ry="2.8"
            transform={`rotate(${u} ${x} ${y - 6})`}
            fill={i % 2 === 0 ? '#8E6432' : '#6E4A22'}
          />
        ),
      )}
    </>
  ),

  'seminka-chia': (
    <>
      {mleto('#9E9488')}
      {hromadka((x, y, u, i) =>
        y > 40 ? null : (
          <ellipse
            key={i}
            cx={x}
            cy={y - 6}
            rx="4"
            ry="2.6"
            transform={`rotate(${u} ${x} ${y - 6})`}
            fill={i % 2 === 0 ? '#4E4640' : '#7E7468'}
          />
        ),
      )}
    </>
  ),

  'seminka-konopna': (
    <>
      {mleto('#D8D2B8')}
      {hromadka((x, y, u, i) =>
        y > 40 ? null : (
          <ellipse
            key={i}
            cx={x}
            cy={y - 6}
            rx="4.4"
            ry="3.4"
            transform={`rotate(${u} ${x} ${y - 6})`}
            fill={i % 2 === 0 ? '#E8E2C0' : '#C4BE94'}
          />
        ),
      )}
    </>
  ),

  'seminka-dynova': (
    <>
      {mleto('#9EB878')}
      <path d="M20 30c0-6 4-11 8-11s8 5 8 11-4 10-8 10-8-4-8-10Z" fill="#6E9B3A" />
      <path d="M36 24c0-6 4-11 8-11s8 5 8 11-4 10-8 10-8-4-8-10Z" fill="#8FBF5A" />
      <path d="M24 24c0-3 2-5 4-5M40 18c0-3 2-5 4-5" stroke="#C8E0A0" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>
  ),

  'seminka-slunecnicova': (
    <>
      {mleto('#BFAE94')}
      <path d="M18 32c0-7 4-13 8-13s8 6 8 13-4 11-8 11-8-4-8-11Z" fill="#3E3A34" />
      <path d="M34 26c0-7 4-13 8-13s8 6 8 13-4 11-8 11-8-4-8-11Z" fill="#5E5850" />
      <path d="M26 21c-1 5-1 12 0 17M42 15c-1 5-1 12 0 17" stroke="#D8D2C4" strokeWidth="2" fill="none" />
    </>
  ),

  'sezam-mlety': (
    <>
      {mleto('#E4DCC4')}
      {hromadka((x, y, u, i) =>
        y > 40 ? null : (
          <ellipse
            key={i}
            cx={x}
            cy={y - 6}
            rx="3.6"
            ry="2.4"
            transform={`rotate(${u} ${x} ${y - 6})`}
            fill={i % 2 === 0 ? '#F2ECD8' : '#D2C8A8'}
            stroke="#BFB496"
            strokeWidth="1"
          />
        ),
      )}
    </>
  ),

  'mak-mlety': (
    <>
      {mleto('#6E6870')}
      {hromadka((x, y, _u, i) =>
        y > 40 ? null : <circle key={i} cx={x} cy={y - 6} r="3" fill={i % 2 === 0 ? '#3A3642' : '#565060'} />,
      )}
    </>
  ),

  'vlasske-orechy': (
    <>
      {mleto('#C4A47E')}
      <circle cx="32" cy="26" r="15" fill="#D9B888" />
      <path d="M32 12v28M32 18c-6 2-10 6-11 12M32 18c6 2 10 6 11 12M32 30c-4 1-7 3-8 7M32 30c4 1 7 3 8 7" stroke="#A8834E" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </>
  ),

  'mandle-mlete': (
    <>
      {mleto('#DCC8A8')}
      <ellipse cx="24" cy="27" rx="8" ry="12" transform="rotate(-14 24 27)" fill="#C49A6E" />
      <ellipse cx="41" cy="24" rx="8" ry="12" transform="rotate(12 41 24)" fill="#DCB88E" />
      <path d="M24 19c-2 4-2 10 0 14M41 16c-2 4-2 10 0 14" stroke="#8E6A42" strokeWidth="2" fill="none" />
    </>
  ),

  'olej-olivovy': lahev(
    '#9EB13A',
    <>
      <ellipse cx="46" cy="20" rx="7" ry="9" transform="rotate(20 46 20)" fill="#6E8A2A" />
      <path d="M46 12c3-4 7-6 11-5-1 5-5 8-10 8" fill={C.zelen} />
    </>,
  ),

  'olej-repkovy': lahev(
    '#E8C33A',
    <>
      <circle cx="46" cy="18" r="4" fill="#F2DE72" />
      <circle cx="41" cy="14" r="4" fill={C.zluta} />
      <circle cx="51" cy="14" r="4" fill={C.zluta} />
      <circle cx="43" cy="23" r="4" fill={C.zluta} />
      <circle cx="49" cy="23" r="4" fill={C.zluta} />
    </>,
  ),

  'olej-dynovy': lahev(
    '#2E3A22',
    <path d="M40 20c0-6 4-11 8-11s8 5 8 11-4 10-8 10-8-4-8-10Z" fill="#6E9B3A" />,
  ),

  'olej-lneny': lahev(
    '#D9A83A',
    <>
      <ellipse cx="44" cy="18" rx="6" ry="3.2" transform="rotate(-18 44 18)" fill="#8E6432" />
      <ellipse cx="51" cy="22" rx="6" ry="3.2" transform="rotate(14 51 22)" fill="#6E4A22" />
    </>,
  ),

  'olej-kokosovy': (
    <>
      <path d="M20 22h24v30a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4V22Z" fill={C.bilaStin} />
      <path d="M23 28h18v24H23V28Z" fill={C.bila} />
      <path d="M18 14h28v8H18Z" fill={C.hnedaSvetla} />
      <path d="M26 36c4-3 8-3 12 0-4 4-8 4-12 0Z" fill="#EFE8D8" />
      <path d="M48 18c5 0 9 4 9 9s-4 9-9 9-9-4-9-9 4-9 9-9Z" fill="#7A5230" />
      <path d="M48 22c3 0 5 2 5 5s-2 5-5 5-5-2-5-5 2-5 5-5Z" fill={C.bila} />
    </>
  ),

  'mleko-kokosove': (
    <>
      <path d="M22 18h20v34a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4V18Z" fill="#C9CFD4" />
      <path d="M25 26h14v26H25V26Z" fill={C.bila} />
      <path d="M20 14h24v6H20Z" fill="#9EA8AE" />
      <path d="M48 22c5 0 9 4 9 9s-4 9-9 9-9-4-9-9 4-9 9-9Z" fill="#7A5230" />
      <path d="M48 26c3 0 5 2 5 5s-2 5-5 5-5-2-5-5 2-5 5-5Z" fill={C.bila} />
    </>
  ),

  // ── bylinky a koření ───────────────────────────────────────────────────
  petrzelka: (
    <>
      <path d="M32 56V30" stroke="#5E8C36" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M32 30c-4-4-4-9-1-12 2 2 4 1 5-1 2 3 4 3 6 1 1 3 3 4 6 3-2 4-2 7 0 10-6-2-12-2-16-1Z" fill="#4E8C3A" />
      <path d="M30 34c-4-3-9-4-13-2 1-3 0-5-2-7 3-1 4-3 4-6 3 2 5 2 7 0 2 4 4 9 4 15Z" fill="#3F7A2E" />
      <path d="M32 30c2-6 6-10 10-11" stroke="#8FBF5A" strokeWidth="2" strokeLinecap="round" fill="none" />
    </>
  ),

  pazitka: (
    <>
      <path d="M18 56c-2-16 0-30 4-40M26 56c-1-18 1-32 3-42M34 56c1-18 2-32 5-41M42 56c2-15 4-27 8-35" stroke="#4E9E42" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <path d="M30 14c1-5 4-8 7-8 0 5-2 8-5 10" fill="#8FC45A" />
    </>
  ),

  kopr: (
    <>
      <path d="M32 56V20" stroke="#5E8C36" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M32 22c-6-4-10-3-14 1M32 22c6-4 10-3 14 1M32 30c-7-3-12-1-16 4M32 30c7-3 12-1 16 4M32 38c-6-2-11 0-14 4M32 38c6-2 11 0 14 4" stroke="#6EB04A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M28 18c-2-4-5-6-9-6 1 4 4 7 8 8M36 18c2-4 5-6 9-6-1 4-4 7-8 8" stroke="#8FC45A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>
  ),

  bazalka: (
    <>
      <path d="M32 56V28" stroke="#3F7A2E" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M32 30c-10 0-17-6-18-14 10-3 18 4 18 14Z" fill="#357A2E" />
      <path d="M32 30c10 0 17-6 18-14-10-3-18 4-18 14Z" fill="#4E9E42" />
      <path d="M32 42c-8 0-14-5-15-11 8-2 15 3 15 11Z" fill="#4E9E42" />
      <path d="M20 20c4 3 8 6 10 10M44 20c-4 3-8 6-10 10" stroke="#8FC45A" strokeWidth="2" strokeLinecap="round" fill="none" />
    </>
  ),

  oregano: (
    <>
      <path d="M32 56V16" stroke="#6E8C4A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="24" cy="22" r="5.5" fill="#5E8C3A" />
      <circle cx="40" cy="22" r="5.5" fill="#7EA84E" />
      <circle cx="23" cy="33" r="5.5" fill="#7EA84E" />
      <circle cx="41" cy="33" r="5.5" fill="#5E8C3A" />
      <circle cx="25" cy="44" r="5" fill="#5E8C3A" />
      <circle cx="39" cy="44" r="5" fill="#7EA84E" />
    </>
  ),

  tymian: (
    <>
      <path d="M22 56c4-16 8-28 14-38" stroke="#7E6A48" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M30 40c-4 0-7-2-8-5 4-1 7 1 8 5ZM33 33c-4 0-7-2-8-5 4-1 7 1 8 5ZM36 26c-4 0-7-2-8-5 4-1 7 1 8 5ZM30 38c3-2 4-5 3-8-3 2-4 5-3 8ZM33 31c3-2 4-5 3-8-3 2-4 5-3 8ZM36 24c3-2 4-5 3-8-3 2-4 5-3 8Z" fill="#5E8C4A" />
      <circle cx="40" cy="14" r="4" fill="#8FA85E" />
    </>
  ),

  majoranka: (
    <>
      <path d="M32 56V18" stroke="#8E9470" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <ellipse cx="24" cy="24" rx="6.5" ry="4.5" transform="rotate(-24 24 24)" fill="#9EA87E" />
      <ellipse cx="40" cy="24" rx="6.5" ry="4.5" transform="rotate(24 40 24)" fill="#8E9A6E" />
      <ellipse cx="23" cy="36" rx="6.5" ry="4.5" transform="rotate(-18 23 36)" fill="#8E9A6E" />
      <ellipse cx="41" cy="36" rx="6.5" ry="4.5" transform="rotate(18 41 36)" fill="#9EA87E" />
      <ellipse cx="26" cy="46" rx="6" ry="4" transform="rotate(-14 26 46)" fill="#9EA87E" />
    </>
  ),

  rozmaryn: (
    <>
      <path d="M32 56V10" stroke="#6E7A50" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M30 20l-12-4M34 20l12-4M30 28l-13-3M34 28l13-3M30 36l-12-3M34 36l12-3M30 44l-11-3M34 44l11-3M31 14l-8-4M33 14l8-4" stroke="#4E7A3A" strokeWidth="3" strokeLinecap="round" fill="none" />
    </>
  ),

  salvej: (
    <>
      {/* Podlouhlé listy s výraznou žilkou a zubatým okrajem; tři splývající
          elipsy z první verze vypadaly jako houba. */}
      <path d="M32 56V34" stroke="#8E9A80" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M31 36c-9-2-16-9-17-17 9-2 17 5 17 17Z" fill="#8FA08E" />
      <path d="M33 36c9-2 16-9 17-17-9-2-17 5-17 17Z" fill="#7E9080" />
      <path d="M32 30c-5-5-6-13-3-19 6 4 8 13 3 19Z" fill="#9EB09C" />
      <path d="M18 21c4 4 8 8 11 13M46 21c-4 4-8 8-11 13M32 13c1 6 1 12 0 17" stroke="#C2CCBE" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </>
  ),

  mata: (
    <>
      <path d="M32 56V26" stroke="#3F8C4A" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M32 28c-11 1-18-5-18-13 10-3 18 3 18 13Z" fill="#3F9E52" />
      <path d="M32 28c11 1 18-5 18-13-10-3-18 3-18 13Z" fill="#5EBF6E" />
      <path d="M32 42c-9 1-15-4-15-10 8-2 15 2 15 10Z" fill="#5EBF6E" />
      <path d="M18 18c5 3 10 6 13 10M46 18c-5 3-10 6-13 10" stroke="#A8E0AE" strokeWidth="2" strokeLinecap="round" fill="none" />
    </>
  ),

  libecek: (
    <>
      {/* Jeden velký trojdílný list na řapíku — proti drobnějším lístkům
          petrželky je hrubší a tmavší. */}
      <path d="M32 56V36" stroke="#4E7A2E" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M32 38c-12-2-19-11-18-21 6 2 10 1 12-2 3 5 6 6 10 4 2 6 0 13-4 19Z" fill="#2E6E2A" />
      <path d="M32 38c12-2 19-11 18-21-6 2-10 1-12-2-3 5-6 6-10 4-2 6 0 13 4 19Z" fill="#3F8C36" />
      <path d="M32 24c-4-5-4-12-1-17 5 4 6 12 1 17Z" fill="#4E9E42" />
      <path d="M22 20c4 4 7 9 9 14M42 20c-4 4-7 9-9 14" stroke="#8FBF5A" strokeWidth="2" strokeLinecap="round" fill="none" />
    </>
  ),

  'bobkovy-list': (
    <>
      <path d="M32 8c10 8 14 20 12 30-2 9-8 16-12 18-4-2-10-9-12-18-2-10 2-22 12-30Z" fill="#3A6E3E" />
      <path d="M32 10v44" stroke="#2A5A2E" strokeWidth="2.5" fill="none" />
      <path d="M32 20c4 2 7 5 8 9M32 20c-4 2-7 5-8 9M32 32c4 2 7 5 8 9M32 32c-4 2-7 5-8 9" stroke="#5E9E5E" strokeWidth="1.8" fill="none" />
    </>
  ),

  'kmin-cely': hromadka((x, y, u, i) => (
    <g key={i} transform={`rotate(${u} ${x} ${y})`}>
      <path d={`M${x} ${y - 6}c3 2 4 5 3 8-2 3-4 4-6 4s-4-1-3-4c0-3 3-6 6-8Z`} fill={i % 2 === 0 ? '#8E6432' : '#6E4A22'} />
    </g>
  )),

  'kmin-mlety': (
    <>
      {prasek('#9E7440', '#C49A66')}
      <path d="M30 22c3 2 4 5 3 8-2 3-4 4-6 4s-4-1-3-4c0-3 3-6 6-8Z" fill="#6E4A22" />
      <path d="M40 18c3 2 4 5 3 8-2 3-4 4-6 4s-4-1-3-4c0-3 3-6 6-8Z" fill="#8E6432" />
    </>
  ),

  'koriandr-mlety': (
    <>
      {prasek('#C4A472', '#E0C79C')}
      <circle cx="28" cy="26" r="6" fill="#BFA06A" />
      <circle cx="40" cy="22" r="5.5" fill="#D2B586" />
      <path d="M24 26h8M36 22h8" stroke="#9E7E4A" strokeWidth="1.6" fill="none" />
    </>
  ),

  skorice: (
    <>
      {/* Svitky kůry, ne sud: na čele je vidět, že je kůra srolovaná. */}
      <path d="M10 42c0-4 3-7 7-8l28-8c4-1 8 1 9 5 1 4-1 8-5 9l-28 8c-4 1-8-1-9-5l-2-1Z" fill="#A05E2A" />
      <path d="M12 40c0-3 2-5 5-6l28-8c3-1 6 1 7 4 1 3-1 6-4 7l-28 8c-3 1-6-1-7-4l-1-1Z" fill="#C07A3E" />
      <ellipse cx="49" cy="29" rx="4" ry="6" transform="rotate(16 49 29)" fill="#D9924E" />
      <ellipse cx="49" cy="29" rx="2" ry="3.4" transform="rotate(16 49 29)" fill="#8E4E1E" />
      <path d="M18 47c0-3 3-6 7-7l26-6c4-1 8 2 8 6s-2 7-6 8l-26 5c-4 1-8-2-9-6Z" fill="#8E4E1E" />
      <ellipse cx="56" cy="37" rx="3.6" ry="5.6" transform="rotate(12 56 37)" fill="#C07A3E" />
    </>
  ),

  kurkuma: (
    <>
      {prasek('#E8952A', '#F5BE6E')}
      <path d="M24 30c-4-4-4-10 0-14 3-3 7-3 9 0 2-3 6-3 9 0 3 3 3 8 0 11-3 3-7 3-9 1-2 3-6 4-9 2Z" fill="#C4661A" />
      <path d="M28 22c2-2 4-2 6 0" stroke="#E8952A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>
  ),

  vanilka: (
    <>
      <path d="M18 10c3-1 6 1 7 5 3 14 6 28 7 38 0 3-2 5-5 5s-5-2-6-5c-3-12-6-26-7-38 0-3 1-5 4-5Z" fill="#3A2A20" />
      <path d="M40 12c3-1 6 1 6 5 1 14 1 28 0 38 0 3-2 5-5 5s-5-2-5-5c-1-12-1-26 0-38 0-3 1-5 4-5Z" fill="#2A1C14" />
      <path d="M41 20c0 10 0 22 1 30" stroke="#7E6450" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="22" cy="30" r="1.6" fill="#8E7460" />
      <circle cx="24" cy="40" r="1.6" fill="#8E7460" />
    </>
  ),

  zazvor: (
    <>
      <path d="M10 36c0-8 6-13 14-13 5 0 8 2 10 5 3-4 8-6 13-4 6 2 9 8 7 14-2 5-7 8-12 7-1 4-5 7-10 7-6 0-11-4-12-9-6-1-10-4-10-7Z" fill="#D9B87E" />
      <path d="M24 28c3 2 5 5 5 8M40 30c2 3 2 7 0 10M18 38c3 1 6 1 8 0" stroke="#B4914E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>
  ),

  'paprika-mleta': (
    <>
      {prasek('#C4361E', '#E06A50')}
      <path d="M36 12c8 0 14 6 14 13 0 5-3 9-7 9-2 0-3-1-4-3-1 2-2 3-4 3-4 0-7-4-7-9 0-7 6-13 8-13Z" fill="#A82A18" />
      <path d="M36 12c-3 0-5-1-5-3 3-1 7-1 10 0 0 2-2 3-5 3Z" fill={C.zelenTmava} />
    </>
  ),

  // ── ostatní ────────────────────────────────────────────────────────────
  voda: (
    <>
      <path d="M18 14h28l-4 38a5 5 0 0 1-5 5H27a5 5 0 0 1-5-5L18 14Z" fill="#DCE8EE" />
      <path d="M21 28h22l-3 24a3 3 0 0 1-3 3H27a3 3 0 0 1-3-3l-3-24Z" fill="#7EB4D9" />
      <path d="M21 28c4 3 8 3 11 0 3 3 7 3 11 0" stroke="#A8D2EA" strokeWidth="3" fill="none" />
    </>
  ),

  'detsky-caj': (
    <>
      <path d="M12 26h32v18c0 7-7 12-16 12s-16-5-16-12V26Z" fill={C.bila} />
      <path d="M16 30h24v14c0 5-5 8-12 8s-12-3-12-8V30Z" fill="#E0C486" />
      <path d="M44 30h6a6 6 0 0 1 0 12h-6" stroke={C.bila} strokeWidth="5" fill="none" />
      <path d="M28 18c-3-4-2-8 1-10 3 2 4 6 1 10Z" fill={C.zelen} />
      <path d="M36 18c3-4 2-8-1-10-3 2-4 6-1 10Z" fill={C.zelenSvetla} />
    </>
  ),

  'kokosovy-jogurt': (
    <>
      <path d="M14 24h28l-3 28a4 4 0 0 1-4 4H21a4 4 0 0 1-4-4L14 24Z" fill={C.bilaStin} />
      <path d="M19 30h18l-3 22H22l-3-22Z" fill={C.bila} />
      <path d="M12 20h32v6H12Z" fill="#B4A48E" />
      <path d="M50 22c5 0 9 4 9 9s-4 9-9 9-9-4-9-9 4-9 9-9Z" fill="#7A5230" />
      <path d="M50 26c3 0 5 2 5 5s-2 5-5 5-5-2-5-5 2-5 5-5Z" fill={C.bila} />
    </>
  ),

  'kvasnice-drozdi': (
    <>
      <path d="M12 30l20-9 20 9-20 9-20-9Z" fill="#E4D4A8" />
      <path d="M12 30v13l20 9V39l-20-9Z" fill="#CFBC86" />
      <path d="M52 30v13l-20 9V39l20-9Z" fill="#B8A46C" />
      <circle cx="22" cy="30" r="2" fill="#B8A46C" />
      <circle cx="34" cy="26" r="2.2" fill="#B8A46C" />
      <circle cx="41" cy="32" r="1.8" fill="#CFBC86" />
      <path d="M20 42c4 2 8 3 10 3" stroke="#E4D4A8" strokeWidth="2" strokeLinecap="round" fill="none" />
    </>
  ),

  'prasek-do-peciva': (
    <>
      <path d="M20 16h24v36a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4V16Z" fill="#9FC0D9" />
      <path d="M24 24h16v20H24V24Z" fill={C.bila} />
      <path d="M18 12h28v6H18Z" fill="#6E94B4" />
      <path d="M28 30c3-2 6-2 8 0M27 36c4-2 7-2 10 0" stroke="#C9D8E4" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M46 44c5-4 11-4 14 0-4 4-10 4-14 0Z" fill={C.bila} />
    </>
  ),

  'jedla-soda': (
    <>
      <path d="M16 22h32v30a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4V22Z" fill="#E8A83A" />
      <path d="M20 30h24v18H20V30Z" fill={C.bila} />
      <path d="M16 22l6-8h20l6 8H16Z" fill="#D9922A" />
      <path d="M25 36h14M25 42h10" stroke="#D2CBB8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>
  ),

  'kakao-100': (
    <>
      {prasek('#5E3A22', '#8E5E38')}
      <path d="M28 18c6-4 14-2 17 4 3 7-1 15-8 18-6 2-13-1-15-7-2-6 1-12 6-15Z" fill="#4A2A16" />
      <path d="M31 22c4-2 8 0 10 4" stroke="#7E5230" strokeWidth="3" strokeLinecap="round" fill="none" />
    </>
  ),

  karob: (
    <>
      {/* Světlý prášek a výrazně tmavší lusk s hrbolky po semenech — ve
          stejném odstínu se obojí slilo v jednu skvrnu. */}
      {prasek('#C49460', '#E0B588')}
      <path d="M10 26c11-5 28-5 40 2 3 2 3 6-1 7-11 3-26 1-36-4-3-1-4-4-3-5Z" fill="#5E3A1E" />
      <circle cx="20" cy="28" r="3" fill="#8E6032" />
      <circle cx="30" cy="30" r="3" fill="#8E6032" />
      <circle cx="40" cy="32" r="3" fill="#8E6032" />
      <path d="M50 28c4 0 6 1 7 3-3 2-6 2-8 0l1-3Z" fill="#5E3A1E" />
    </>
  ),

  'ocet-jablecny': (
    <>
      <path d="M26 10h12v10l6 10v22a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4V30l6-10V10Z" fill={C.bilaStin} />
      <path d="M23 32h18v20a2 2 0 0 1-2 2H25a2 2 0 0 1-2-2V32Z" fill="#D9A83A" />
      <path d="M25 8h14v5H25Z" fill={C.hnedaSvetla} />
      <circle cx="49" cy="24" r="9" fill="#CE3B36" />
      <path d="M49 15c2-3 5-4 7-3-1 3-4 5-7 5v-2Z" fill={C.zelen} />
    </>
  ),

  'skrob-kukuricny': (
    <>
      {prasek(C.bilaStin, C.bila)}
      <path d="M32 16c5 0 8 5 8 12s-3 12-8 12-8-5-8-12 3-12 8-12Z" fill={C.zluta} />
      <path d="M28 22c0 8 0 12 1 15M36 22c0 8 0 12-1 15M25 27c5 1 9 1 14 0" stroke={C.zlutaTmava} strokeWidth="1.8" fill="none" />
    </>
  ),

  // ── doplněná dávka surovin ─────────────────────────────────────────────
  'redkev-bila': (
    <>
      {nat(-4)}
      <path d="M22 22h20l-5 30c-1 5-3 8-5 8s-4-3-5-8l-5-30Z" fill={C.bila} />
      <path d="M26 30h12M27 38h10M29 46h6" stroke={C.bilaStin} strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </>
  ),

  'celer-rapikaty': (
    <>
      <path d="M16 22c4-6 8-9 11-9-1 5-3 9-6 12l-5-3Z" fill="#4E8C3A" />
      <path d="M48 22c-4-6-8-9-11-9 1 5 3 9 6 12l5-3Z" fill="#5E9E4A" />
      <path d="M32 10c3 4 4 9 4 14h-8c0-5 1-10 4-14Z" fill="#3F7A2E" />
      <path d="M20 24h8l-2 32h-6l-2-24c0-4 1-7 2-8Z" fill="#A8C46E" />
      <path d="M30 24h8l1 32h-7l-2-32Z" fill="#C0D98E" />
      <path d="M40 24h6c1 1 2 4 2 8l-2 24h-6l-2-32Z" fill="#A8C46E" />
      <path d="M24 30v22M34 30v22M44 30v20" stroke="#7EA84E" strokeWidth="2" fill="none" />
    </>
  ),

  'pekingske-zeli': (
    <>
      <path d="M32 6c10 0 17 8 17 20 0 16-7 30-17 30S15 42 15 26C15 14 22 6 32 6Z" fill="#C8DC96" />
      <path d="M32 6c5 0 9 8 9 20 0 16-4 30-9 30s-9-14-9-30c0-12 4-20 9-20Z" fill="#E4EEC2" />
      <path d="M24 14c-2 8-2 20 0 30M40 14c2 8 2 20 0 30" stroke="#A8C46E" strokeWidth="2.5" fill="none" />
      <path d="M32 40c-4 0-7 4-7 9 0 4 3 7 7 7s7-3 7-7c0-5-3-9-7-9Z" fill={C.bila} />
    </>
  ),

  polnicek: (
    <>
      <path d="M32 54c-1-8-1-14 0-18" stroke={C.zelenBleda} strokeWidth="3" strokeLinecap="round" fill="none" />
      <ellipse cx="18" cy="34" rx="11" ry="7" transform="rotate(-26 18 34)" fill="#3F7A2E" />
      <ellipse cx="46" cy="34" rx="11" ry="7" transform="rotate(26 46 34)" fill="#55975C" />
      <ellipse cx="24" cy="22" rx="9" ry="6" transform="rotate(-48 24 22)" fill="#4E9E42" />
      <ellipse cx="40" cy="22" rx="9" ry="6" transform="rotate(48 40 22)" fill="#3F7A2E" />
      <ellipse cx="32" cy="30" rx="7" ry="10" fill="#5EBF6E" />
    </>
  ),

  'zeli-kysane': (
    <>
      <path d="M12 30h40v18c0 5-9 8-20 8s-20-3-20-8V30Z" fill={C.krem} />
      <ellipse cx="32" cy="30" rx="20" ry="8" fill={C.bila} />
      <path d="M18 28c6 3 10 3 14 1M26 33c6 2 10 2 14 0M20 36c5 2 9 2 13 1M32 26c5 2 9 2 13 1" stroke={C.kremTmavy} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M20 44c6 3 12 4 20 3M22 50c6 2 12 2 18 1" stroke={C.kremTmavy} strokeWidth="2" strokeLinecap="round" fill="none" />
    </>
  ),

  kaki: (
    <>
      <circle cx="32" cy="38" r="18" fill="#E8712A" />
      <path d="M22 30c2-3 5-5 8-6" stroke="#F5A466" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <path d="M32 20c-5 0-9-1-12-3 3-3 7-4 12-4s9 1 12 4c-3 2-7 3-12 3Z" fill={C.zelen} />
      <path d="M32 20c-3-3-4-6-4-9 3 1 5 4 6 8M32 20c3-3 4-6 4-9-3 1-5 4-6 8" fill={C.zelenTmava} />
      <rect x="30.5" y="8" width="3" height="6" rx="1.5" fill={C.hneda} />
    </>
  ),

  'fiky-susene': (
    <>
      <path d="M20 24c6-3 12-1 14 5 2 7-2 15-8 18-6 2-12-1-13-7-1-7 2-13 7-16Z" fill="#8C6A3E" />
      <path d="M42 30c6-2 11 1 12 7 1 7-3 13-9 15-5 2-10-1-11-6-1-6 3-14 8-16Z" fill="#6E5230" />
      <path d="M24 28c3 3 4 7 3 11M46 34c3 3 3 7 2 10" stroke="#B8945E" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M24 22c1-3 3-5 5-6-1 3-2 5-2 7l-3-1ZM46 28c1-3 3-5 5-5-1 3-2 4-2 6l-3-1Z" fill={C.hnedaTmava} />
    </>
  ),

  sled: ryba(
    '#6E86A0',
    '#EDF1F5',
    <>
      <path d="M12 27c10 3 24 2 36-3" stroke="#3E5470" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M14 34c10 2 22 1 32-3" stroke="#A8BCD0" strokeWidth="2" strokeLinecap="round" fill="none" />
    </>,
  ),

  'treska-jednoskvrnna': ryba(
    '#9EA6A8',
    '#F0F2F2',
    <>
      <path d="M12 32c10 3 24 2 36-4" stroke="#2E3438" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="27" cy="27" r="4.4" fill="#2E3438" />
    </>,
  ),

  'treska-aljasska': ryba(
    '#8E9480',
    '#EDEEE6',
    <path
      d="M14 26c10 2 22 1 32-3M16 33c10 2 20 1 28-2"
      stroke="#5E6450"
      strokeWidth="2.2"
      strokeLinecap="round"
      fill="none"
    />,
  ),

  slavky: (
    <>
      <path d="M8 30c10-8 24-8 32 2 4 5 2 12-4 15-9 4-22 1-27-6-2-4-2-8-1-11Z" fill="#2E2A3E" />
      <path d="M12 31c8-5 18-5 24 2" stroke="#5E5878" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M30 44c10-8 22-8 28 1 3 5 1 10-5 12-8 3-18 1-23-5-1-3-1-6 0-8Z" fill="#403A54" />
      <path d="M34 45c7-4 15-4 20 2" stroke="#7E76A0" strokeWidth="3" strokeLinecap="round" fill="none" />
    </>
  ),

  sumec: (
    <>
      <path d="M52 32c4-5 8-8 10-8 1 5 1 12 0 17-2 0-6-4-10-9Z" fill="#4E4636" />
      <path d="M6 33c0-10 11-17 24-17s22 7 22 16-9 16-22 16S6 42 6 33Z" fill="#5E5442" />
      <path d="M10 38c5 7 14 10 22 10 8 0 15-3 19-8-4 7-11 10-19 10-10 0-18-4-22-12Z" fill="#CFC4A8" />
      <path d="M12 28c-4-4-8-6-10-5 2 4 6 6 10 7M12 33c-4 0-8 1-10 3 3 2 7 2 10 0" stroke="#3E3828" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <circle cx="15" cy="28" r="2.4" fill="#20262A" />
    </>
  ),

  tilapie: ryba(
    '#B0A894',
    '#F2EEE2',
    <path
      d="M24 20c1 8 1 16 0 22M32 19c1 9 1 18 0 25M40 21c1 8 1 15 0 21"
      stroke="#8A8270"
      strokeWidth="2.2"
      strokeLinecap="round"
      fill="none"
    />,
  ),

  skyr: kelimek(
    C.bila,
    '#9FB6C4',
    <path d="M24 34c5-5 11-5 16 0-5 4-11 4-16 0Z" fill={C.bilaStin} />,
  ),

  'zitne-vlocky': (
    <>
      <ellipse cx="20" cy="28" rx="10" ry="6.5" transform="rotate(-16 20 28)" fill="#9E8A62" />
      <ellipse cx="42" cy="27" rx="10" ry="6.5" transform="rotate(14 42 27)" fill="#7E6C48" />
      <ellipse cx="31" cy="38" rx="11" ry="7" fill="#9E8A62" />
      <ellipse cx="46" cy="42" rx="9" ry="6" transform="rotate(-12 46 42)" fill="#7E6C48" />
      <ellipse cx="20" cy="46" rx="10" ry="6.5" transform="rotate(10 20 46)" fill="#8E7A54" />
      <path d="M13 27c5 2 9 2 14 0M36 26c4 2 8 2 12 0M24 37c5 2 9 2 14 0" stroke="#C4B28A" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </>
  ),
};

export type IconId = keyof typeof SHAPES;