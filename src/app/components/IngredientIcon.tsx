import type { ReactNode } from 'react';
import type { Ingredient } from '@/types';
import { SHAPES } from '../icons/shapes';

/**
 * Ikona suroviny.
 *
 * Kreslená ikona ze `src/app/icons/shapes.tsx` má přednost; kde ještě není,
 * kreslí se emoji jako dosud. Katalog se tak dá překreslovat po dávkách, aniž
 * by mezitím některá surovina zůstala bez obrázku.
 */
export function IngredientIcon({
  ingredient,
  className = 'h-6 w-6',
}: {
  ingredient: Pick<Ingredient, 'icon' | 'emoji'>;
  className?: string;
}): ReactNode {
  const kresba = ingredient.icon === undefined ? undefined : SHAPES[ingredient.icon];

  if (kresba !== undefined) {
    return (
      <svg viewBox="0 0 64 64" className={`shrink-0 ${className}`} aria-hidden="true" focusable="false">
        {kresba}
      </svg>
    );
  }

  return (
    <span aria-hidden="true" className="shrink-0">
      {ingredient.emoji ?? '🍽️'}
    </span>
  );
}
