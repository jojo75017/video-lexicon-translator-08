import { useCallback, useEffect, useState } from 'react';
import { getIsCurrentSessionAdmin } from '@/lib/adminAccess';

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
 * - Le mode n'est lisible/activable que si la session est admin.
 * - Pour tout non-admin, `v3Mode` reste forcé à `false`.
 * - L'état est persisté en localStorage pour l'admin uniquement.
 */
export function useV3Mode() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [v3Mode, setV3ModeState] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const admin = await getIsCurrentSessionAdmin();
      if (cancelled) return;
      setIsAdmin(admin);
      setV3ModeState(admin ? readStored() : false);
      setChecking(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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

  return { isAdmin, checking, v3Mode, setV3Mode, toggleV3Mode };
}

export default useV3Mode;
