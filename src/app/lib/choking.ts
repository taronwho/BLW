import { OctagonAlert, ShieldCheck, TriangleAlert } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ChokingRisk } from '@/types';

/**
 * Jak se riziko dušení sděluje na všech obrazovkách.
 *
 * docs/SPEC.md kapitola 5: riziko nikdy nesmí být sděleno jen barvou —
 * vždycky barva + ikona + slovo. Proto je tady jediný zdroj pravdy: každá
 * úroveň má svoje slovo, svou ikonu i svou barvu a UI si nesmí vybrat jen
 * část z toho.
 */
export interface ChokingPresentation {
  /** Slovo samo o sobě — čitelné i černobíle. */
  word: string;
  /** Celá věta do štítku, aby dávala smysl i bez okolí. */
  label: string;
  Icon: LucideIcon;
  /** Barva textu a ikony. */
  text: string;
  /** Podklad štítku. */
  chip: string;
  /** Co to znamená v kuchyni. */
  meaning: string;
}

export const CHOKING_PRESENTATION: Record<ChokingRisk, ChokingPresentation> = {
  low: {
    word: 'Nízké',
    label: 'Nízké riziko dušení',
    Icon: ShieldCheck,
    text: 'text-safe',
    chip: 'bg-safe/10 border-safe/30',
    meaning: 'Při obvyklé úpravě a tvaru podle fáze je riziko malé. Dítě jí vždy vsedě a pod dohledem.',
  },
  medium: {
    word: 'Střední',
    label: 'Střední riziko dušení',
    Icon: TriangleAlert,
    text: 'text-caution',
    chip: 'bg-caution/10 border-caution/30',
    meaning: 'Záleží na tvaru a měkkosti. Drž se pokynu ke krájení u své fáze.',
  },
  high: {
    word: 'Vysoké',
    label: 'Vysoké riziko dušení',
    Icon: OctagonAlert,
    text: 'text-risk',
    chip: 'bg-risk/10 border-risk/30',
    meaning: 'Bez úpravy tvaru nepodávej. Pokyn ke krájení je tady povinný, ne doporučený.',
  },
};

export const CHOKING_ORDER: Record<ChokingRisk, number> = { low: 0, medium: 1, high: 2 };

/** Nejvyšší riziko ze sady — pro štítek receptu. */
export function highestRisk(risks: readonly ChokingRisk[]): ChokingRisk {
  let worst: ChokingRisk = 'low';
  for (const risk of risks) {
    if (CHOKING_ORDER[risk] > CHOKING_ORDER[worst]) worst = risk;
  }
  return worst;
}
