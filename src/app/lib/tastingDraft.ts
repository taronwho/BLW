import type { TastingAmount, TastingReaction } from '@/types';
import { todayIso } from './labels';

/** Rozepsaná ochutnávka, než se uloží. Poznámka je tu vždy řetězec, ať se
 *  textarea nepře s `undefined`; prázdná se při ukládání zahodí. */
export interface Draft {
  date: string;
  amount: TastingAmount;
  reaction: TastingReaction;
  note: string;
  /** Dítě se nad soustem dávilo. */
  davilo: boolean;
}

export function emptyDraft(): Draft {
  return { date: todayIso(), amount: 'ochutnala', reaction: 'zadna', note: '', davilo: false };
}

/**
 * Co se z rozepsaného záznamu opravdu ukládá — prázdná poznámka se zahodí.
 *
 * `davilo` se posílá vždy, i jako `undefined`: při úpravě záznamu tím
 * odškrtnutí dávení opravdu smaže pole ze starší verze záznamu. Do úložiště
 * se `undefined` nezapíše (JSON ho vynechá, Firestore má
 * `ignoreUndefinedProperties`).
 */
export function draftPayload(draft: Draft): {
  date: string;
  amount: TastingAmount;
  reaction: TastingReaction;
  note?: string;
  davilo: true | undefined;
} {
  const note = draft.note.trim();
  return {
    date: draft.date,
    amount: draft.amount,
    reaction: draft.reaction,
    ...(note.length > 0 ? { note } : {}),
    davilo: draft.davilo ? true : undefined,
  };
}

/** Rozepsaná podoba uloženého záznamu — pro úpravu. */
export function draftZUdalosti(event: {
  date: string;
  amount: TastingAmount;
  reaction: TastingReaction;
  note?: string;
  davilo?: boolean;
}): Draft {
  return {
    date: event.date,
    amount: event.amount,
    reaction: event.reaction,
    note: event.note ?? '',
    davilo: event.davilo === true,
  };
}
