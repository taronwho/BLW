import type { TastingAmount, TastingReaction } from '@/types';
import { todayIso } from './labels';

/** Rozepsaná ochutnávka, než se uloží. Poznámka je tu vždy řetězec, ať se
 *  textarea nepře s `undefined`; prázdná se při ukládání zahodí. */
export interface Draft {
  date: string;
  amount: TastingAmount;
  reaction: TastingReaction;
  note: string;
}

export function emptyDraft(): Draft {
  return { date: todayIso(), amount: 'ochutnala', reaction: 'zadna', note: '' };
}

/** Co se z rozepsaného záznamu opravdu ukládá — prázdná poznámka se zahodí. */
export function draftPayload(draft: Draft): {
  date: string;
  amount: TastingAmount;
  reaction: TastingReaction;
  note?: string;
} {
  const note = draft.note.trim();
  return {
    date: draft.date,
    amount: draft.amount,
    reaction: draft.reaction,
    ...(note.length > 0 ? { note } : {}),
  };
}
