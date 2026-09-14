import { useEffect, useRef, type RefObject } from 'react';

/**
 * Ovládání okénka klávesnicí.
 *
 * Okénka měla `role="dialog"` a `aria-modal`, ale fokus se do nich
 * nepřesouval, nedržel se v nich a po zavření skončil na začátku stránky.
 * Kdo ovládá aplikaci klávesnicí nebo odečítačem, musel se u dvousté suroviny
 * protabovat seznamem znovu. Automatický test přístupnosti tohle nepozná,
 * protože značky jsou v pořádku — chybí chování.
 *
 * Hook dělá tři věci:
 *  1. po otevření dá fokus na první ovladatelný prvek uvnitř,
 *  2. drží Tab uvnitř okénka (z posledního prvku zpátky na první),
 *  3. po zavření vrátí fokus tam, odkud se okénko otevřelo.
 */

const OVLADATELNE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function useModalFokus<T extends HTMLElement>(otevreno: boolean): RefObject<T> {
  const okenko = useRef<T>(null);
  const puvodni = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!otevreno) return undefined;

    puvodni.current = document.activeElement as HTMLElement | null;
    const prvky = (): HTMLElement[] =>
      [...(okenko.current?.querySelectorAll<HTMLElement>(OVLADATELNE) ?? [])].filter(
        (prvek) => prvek.offsetParent !== null || prvek === document.activeElement,
      );

    // Fokus až po vykreslení, jinak by v okénku ještě nebylo co zaostřit.
    const id = window.requestAnimationFrame(() => prvky()[0]?.focus());

    function naKlavesu(event: KeyboardEvent): void {
      if (event.key !== 'Tab') return;
      const seznam = prvky();
      if (seznam.length === 0) return;
      const prvni = seznam[0] as HTMLElement;
      const posledni = seznam[seznam.length - 1] as HTMLElement;
      const aktivni = document.activeElement;
      if (event.shiftKey && (aktivni === prvni || !okenko.current?.contains(aktivni))) {
        event.preventDefault();
        posledni.focus();
      } else if (!event.shiftKey && aktivni === posledni) {
        event.preventDefault();
        prvni.focus();
      }
    }

    window.addEventListener('keydown', naKlavesu);
    return () => {
      window.cancelAnimationFrame(id);
      window.removeEventListener('keydown', naKlavesu);
      // Vrátit fokus tam, odkud se okénko otevřelo — jinak rodič s klávesnicí
      // spadne na začátek dlouhého seznamu.
      puvodni.current?.focus();
    };
  }, [otevreno]);

  return okenko;
}
