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

export const SHAPES: Record<string, ReactNode> = {
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
};

export type IconId = keyof typeof SHAPES;