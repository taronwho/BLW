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
};

export type IconId = keyof typeof SHAPES;