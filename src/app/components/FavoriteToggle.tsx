import { Star } from 'lucide-react';
import type { ReactNode } from 'react';
import { useHouseholdStore } from '@/storage/householdStore';

/**
 * Hvězdička rovnou v seznamu, aby se kvůli oblíbené položce nemuselo
 * proklikávat do detailu a zpátky.
 *
 * Tlačítko bývá uvnitř odkazu na detail, takže si klepnutí musí vzít pro
 * sebe — jinak by místo označení otevřelo stránku.
 */
export function FavoriteToggle({
  id,
  name,
  favorite,
}: {
  id: string;
  name: string;
  favorite: boolean;
}): ReactNode {
  const toggleFavorite = useHouseholdStore((store) => store.toggleFavorite);
  return (
    <button
      type="button"
      data-testid={`oblibene-${id}`}
      aria-pressed={favorite}
      aria-label={favorite ? `${name}: odebrat z oblíbených` : `${name}: přidat do oblíbených`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void toggleFavorite(id);
      }}
      className={`flex min-h-touch min-w-touch shrink-0 items-center justify-center rounded-xl border px-3 transition ${
        favorite
          ? 'border-caution bg-caution/10 text-caution'
          : 'border-line bg-surface text-muted hover:border-caution hover:text-caution'
      }`}
    >
      <Star aria-hidden="true" className={`h-5 w-5 shrink-0 ${favorite ? 'fill-current' : ''}`} />
    </button>
  );
}
