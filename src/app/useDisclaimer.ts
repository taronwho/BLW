import { useCallback, useState } from 'react';
import { DISCLAIMER_STORAGE_KEY } from './disclaimer';

function readAccepted(): boolean {
  try {
    return window.localStorage.getItem(DISCLAIMER_STORAGE_KEY) === 'true';
  } catch {
    // Soukromé okno nebo zakázané úložiště — disclaimer se prostě ukáže znovu.
    return false;
  }
}

export function useDisclaimer(): { accepted: boolean; accept: () => void } {
  const [accepted, setAccepted] = useState<boolean>(readAccepted);

  const accept = useCallback(() => {
    try {
      window.localStorage.setItem(DISCLAIMER_STORAGE_KEY, 'true');
    } catch {
      // Neuložilo se — aplikace tím není blokovaná.
    }
    setAccepted(true);
  }, []);

  return { accepted, accept };
}
