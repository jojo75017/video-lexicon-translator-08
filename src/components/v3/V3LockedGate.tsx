import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { isLegacyUnlockedPath } from "@/data/v2LegacyAccess";
import useV3Entitlement from "@/hooks/useV3Entitlement";
import useV3Open from "@/hooks/useV3Open";
import { useAdminAccess } from "@/contexts/AdminAccessContext";
import AccessPendingFallback from "@/components/auth/AccessPendingFallback";
import V3ModuleLockCard from "@/components/v3/V3ModuleLockCard";

/**
 * Verrouille une route V3 tant que `V3_LAUNCH_UNLOCKED = false`.
 * - Les admins passent toujours (pour tester avant le lancement).
 * - Les acheteurs V2 passent sur les nouveautés qui leur sont offertes.
 * - Tant que le statut n'est pas connu, on patiente : jamais de redirection
 *   vers `/v3/auth` sur un simple retard de session.
 */
export function V3LockedGate({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { loading, isAdmin, hasV2 } = useV3Entitlement();
  const adminAccess = useAdminAccess();
  const { open: v3Open } = useV3Open();

  // Statut d'ouverture encore inconnu : on patiente plutôt que de verrouiller.
  if (v3Open === null) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--v3-emerald)' }} />
      </div>
    );
  }
  if (v3Open) return <>{children}</>;
  if (isAdmin) return <>{children}</>;
  if (adminAccess.isChecking) {
    return <AccessPendingFallback timedOut={false} onRetry={() => { void adminAccess.refresh(); }} />;
  }
  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--v3-emerald)' }} />
      </div>
    );
  }
  if (hasV2 && isLegacyUnlockedPath(location.pathname)) return <>{children}</>;
  // Ancien client V2 : on explique le verrou et on propose l'offre remisée,
  // jamais une redirection surprise vers la connexion.
  if (hasV2) return <V3ModuleLockCard />;
  return <Navigate to="/v3/auth" replace state={{ from: location.pathname }} />;
}

export default V3LockedGate;
