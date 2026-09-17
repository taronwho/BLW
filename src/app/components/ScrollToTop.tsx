import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Nová obrazovka začíná nahoře a fokus jde na ni.
 *
 * Prohlížeč si u SPA drží pozici posuvníku napříč přechody, takže se recept
 * otevřel v půlce a rodič si myslel, že je to konec stránky. Zpět je výjimka —
 * tam má návrat na původní místo smysl, proto se pozice přepisuje jen při
 * PUSH a REPLACE, ne při POP.
 *
 * Fokus je druhá polovina téhož problému, kterou automatický test
 * přístupnosti nepozná, protože značky jsou v pořádku — chybí chování.
 * Po klepnutí na odkaz ve spodní navigaci zůstával fokus na tom odkazu,
 * takže odečítač obrazovky o změně obrazovky neřekl nic a čtení
 * pokračovalo od navigace, ne od nového obsahu. Přesun na `<main>` to
 * oznámí a zároveň posune výchozí bod pro klávesnici na začátek obsahu.
 *
 * Při POP se fokus nechává být: rodič se vrací tam, kde byl, a přeskočit
 * ho jinam by ho připravilo o kontext, který si právě vyžádal.
 */
export function ScrollToTop(): null {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === 'POP') return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    const hlavni = document.getElementById('obsah');
    if (hlavni === null) return;
    // `preventScroll`, protože jsme právě odrolovali nahoru a prohlížeč by
    // to zaostřením mohl zase posunout.
    hlavni.focus({ preventScroll: true });
  }, [pathname, navigationType]);

  return null;
}
