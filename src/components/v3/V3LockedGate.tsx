import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { V3_LAUNCH_UNLOCKED } from "@/config/v3Launch";
import { isLegacyUnlockedPath } from "@/data/v2LegacyAccess";
import useV3Entitlement from "@/hooks/useV3Entitlement";

/**
 * Verrouille une route V3 tant que `V3_LAUNCH_UNLOCKED = false`.
 * - Les admins passent toujours (pour tester avant le lancement).
 * - Les acheteurs V2 passent sur les 3 nouveautés qui leur sont offertes
 *   (voir `V2_LEGACY_UNLOCKED_PATHS`).
 */
export function V3LockedGate({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { loading, isAdmin, hasV2 } = useV3Entitlement();

  if (V3_LAUNCH_UNLOCKED) return <>{children}</>;
  if (loading) return null;
  if (isAdmin) return <>{children}</>;
  if (hasV2 && isLegacyUnlockedPath(location.pathname)) return <>{children}</>;
  return <Navigate to="/v3/offre" replace state={{ from: location.pathname }} />;
}

export default V3LockedGate;
