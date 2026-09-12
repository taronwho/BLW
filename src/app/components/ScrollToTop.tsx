import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Nová obrazovka začíná nahoře.
 *
 * Prohlížeč si u SPA drží pozici posuvníku napříč přechody, takže se recept
 * otevřel v půlce a rodič si myslel, že je to konec stránky. Zpět je výjimka —
 * tam má návrat na původní místo smysl, proto se pozice přepisuje jen při
 * PUSH a REPLACE, ne při POP.
 */
export function ScrollToTop(): null {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === 'POP') return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, navigationType]);

  return null;
}
