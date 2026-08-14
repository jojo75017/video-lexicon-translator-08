import { useAdminAccess } from '@/contexts/AdminAccessContext';


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
  const { isAdmin, isChecking } = useAdminAccess();
  return { isAdmin: isChecking ? null : isAdmin, loading: isChecking };
}

export default useIsAdmin;
