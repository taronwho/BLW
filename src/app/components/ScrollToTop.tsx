import { useEffect, useRef } from 'react';
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
 *
 * Při REPLACE na téže cestě se nedělá nic. Hledání zapisuje
 * dotaz do adresy (`replace`), takže první písmeno změnilo typ navigace
 * z POP na REPLACE — efekt se spustil, fokus odskočil z pole na `<main>`
 * a na mobilu po prvním písmenu zmizela klávesnice.
 */
export function ScrollToTop(): null {
  const { pathname, key } = useLocation();
  const navigationType = useNavigationType();
  const predchozi = useRef(pathname);

  useEffect(() => {
    const tataCesta = predchozi.current === pathname;
    predchozi.current = pathname;
    if (navigationType === 'POP') return;
    if (tataCesta && navigationType === 'REPLACE') return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    const hlavni = document.getElementById('obsah');
    if (hlavni === null) return;
    // `preventScroll`, protože jsme právě odrolovali nahoru a prohlížeč by
    // to zaostřením mohl zase posunout.
    hlavni.focus({ preventScroll: true });
  }, [pathname, key, navigationType]);

  return null;
}
