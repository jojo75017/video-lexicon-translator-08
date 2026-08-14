import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  clearAdminCache,
  getCachedAdminStatus,
  resolveAdminStatus,
  subscribeAdminStatus,
} from '@/lib/adminAccess';


/**
 * Statut admin partagé et réactif.
 *
 * `isAdmin === null` signifie « pas encore déterminé » : aucune interface ne doit
 * verrouiller ni rediriger dans cet état, sinon un admin dont la session met du
 * temps à se restaurer est traité comme un visiteur.
 *
 * Le statut est recalculé dès que la session change (restauration, connexion,
 * rafraîchissement de jeton), et remis à zéro à la déconnexion.
 */
export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(getCachedAdminStatus());

  useEffect(() => {
    let cancelled = false;
    const unsubscribe = subscribeAdminStatus((value) => {
      if (!cancelled) setIsAdmin(value);
    });

    const refresh = async () => {
      const result = await resolveAdminStatus();
      // Un admin confirmé n'est jamais rétrogradé ; un inconnu ne conclut rien.
      if (!cancelled) setIsAdmin((prev) => (prev === true ? true : result));
    };


    void refresh();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        clearAdminCache();
        if (!cancelled) setIsAdmin(false);
        return;
      }
      if (session?.user) void refresh();
    });

    return () => {
      cancelled = true;
      unsubscribe();
      subscription.unsubscribe();
    };
  }, []);

  return { isAdmin, loading: isAdmin === null };
}

export default useIsAdmin;
