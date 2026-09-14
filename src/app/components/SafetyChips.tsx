import { Nut } from 'lucide-react';
import type { ReactNode } from 'react';
import type { AllergenGroup, ChokingRisk } from '@/types';
import { CHOKING_PRESENTATION } from '../lib/choking';
import { ALLERGEN_LABELS } from '../lib/labels';

/**
 * Drobné štítky do řádky v seznamu. Stejná podoba u suroviny v přehledu
 * i u suroviny uvnitř receptu, aby totéž znamenalo totéž.
 *
 * Nízké riziko dušení se v seznamu nevypisuje. Kdyby svítilo u většiny
 * položek, přestalo by být vidět to jedno opravdové varování. Celá stupnice
 * včetně nízkého rizika zůstává v detailu položky, kde je k ní i vysvětlení.
 */
export function ChokingChip({
  risk,
  testId,
  compact = false,
}: {
  risk: ChokingRisk;
  testId?: string;
  /** Na dlaždici je na štítek půlka šířky obrazovky — vejde se jen slovo. */
  compact?: boolean;
}): ReactNode {
  if (risk === 'low') return null;
  const { word, Icon, text, chip } = CHOKING_PRESENTATION[risk];
  return (
    <span
      data-testid={testId}
      data-risk={risk}
      className={`flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[11px] font-medium ${chip} ${text}`}
    >
      <Icon aria-hidden="true" className="h-3 w-3 shrink-0" />
      {word.toLowerCase()}
      {/* Samotné „střední" nic neznamená. Zkrácená je jen ta viditelná
          podoba; odečítač obrazovky i testy čtou celou větu dál. */}
      <span className={compact ? 'sr-only' : ''}> riziko dušení</span>
    </span>
  );
}

/**
 * Alergen u konkrétní suroviny. Rodič plánující zavádění alergenů ho
 * potřebuje vidět už v seznamu, ne až po prokliku do detailu.
 */
export function AllergenChip({
  allergen,
  testId,
  compact = false,
}: {
  allergen: AllergenGroup;
  testId?: string;
  /** Na dlaždici nese význam barva a ikona, slovo „alergen" se vynechává. */
  compact?: boolean;
}): ReactNode {
  return (
    <span
      data-testid={testId}
      data-alergen={allergen}
      className="flex items-center gap-1 rounded-lg border border-caution/30 bg-caution/10 px-2 py-0.5 text-[11px] font-medium text-caution"
    >
      {compact && <Nut aria-hidden="true" className="h-3 w-3 shrink-0" />}
      <span className={compact ? 'sr-only' : ''}>alergen: </span>
      {ALLERGEN_LABELS[allergen]}
    </span>
  );
}
