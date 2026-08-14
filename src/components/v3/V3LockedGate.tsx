import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { V3_LAUNCH_UNLOCKED } from "@/config/v3Launch";
import { isLegacyUnlockedPath } from "@/data/v2LegacyAccess";
import useV3Entitlement from "@/hooks/useV3Entitlement";

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

  if (V3_LAUNCH_UNLOCKED) return <>{children}</>;
  if (isAdmin) return <>{children}</>;
  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--v3-emerald)' }} />
      </div>
    );
  }
  if (hasV2 && isLegacyUnlockedPath(location.pathname)) return <>{children}</>;
  return <Navigate to="/v3/auth" replace state={{ from: location.pathname }} />;
}

export default V3LockedGate;
