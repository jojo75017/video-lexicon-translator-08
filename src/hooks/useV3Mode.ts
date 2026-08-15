import { useCallback, useEffect, useState } from 'react';
import { useAdminAccess } from '@/contexts/AdminAccessContext';

const LS_KEY = 'ebookstudio_v3_mode';

function readStored(): boolean {
  try {
    return localStorage.getItem(LS_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * Bascule V2 / V3 réservée à l'admin (préparation du lancement V3).
 *
 * Le statut admin vient exclusivement de l'état partagé `useAdminAccess` :
 * aucune vérification concurrente, donc aucun affichage divergent d'une page
 * à l'autre.
 */
export function useV3Mode() {
  const { isAdmin, isChecking } = useAdminAccess();
  const [v3Mode, setV3ModeState] = useState(false);

  useEffect(() => {
    setV3ModeState(isAdmin ? readStored() : false);
  }, [isAdmin]);

  const setV3Mode = useCallback(
    (next: boolean) => {
      if (!isAdmin) return;
      setV3ModeState(next);
      try {
        if (next) localStorage.setItem(LS_KEY, '1');
        else localStorage.removeItem(LS_KEY);
      } catch {
        /* ignore */
      }
    },
    [isAdmin],
  );

  const toggleV3Mode = useCallback(() => setV3Mode(!v3Mode), [setV3Mode, v3Mode]);

  return { isAdmin, checking: isChecking, v3Mode, setV3Mode, toggleV3Mode };
}

export default useV3Mode;
