import {
  Baby,
  Citrus,
  Droplet,
  Flame,
  Nut,
  OctagonAlert,
  ShieldCheck,
  Smile,
  Timer,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { SeznamIkona } from '@/data/lists';

/**
 * Ikona seznamu.
 *
 * Dlaždice na úvodní obrazovce nesmí kreslit ikony vlastních surovin —
 * musela by kvůli tomu sáhnout na katalog a ten by se pak stahoval hned
 * při prvním otevření aplikace, i kdyby do seznamů nikdo neklepl. Uvnitř
 * seznamů, které se stahují až na vyžádání, se ikony surovin ukazují dál.
 */
export const IKONY_SEZNAMU: Record<SeznamIkona, LucideIcon> = {
  zacatek: Baby,
  zelezo: Droplet,
  cecko: Citrus,
  alergen: ShieldCheck,
  riziko: OctagonAlert,
  tuky: Nut,
  bezVareni: Timer,
  zoubky: Smile,
  klid: Flame,
};
