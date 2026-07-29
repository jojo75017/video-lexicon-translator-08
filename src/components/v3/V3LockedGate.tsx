import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getIsCurrentSessionAdmin } from "@/lib/adminAccess";
import { V3_LAUNCH_UNLOCKED } from "@/config/v3Launch";

/**
 * Verrouille une route V3 tant que `V3_LAUNCH_UNLOCKED = false`.
 * Les admins passent toujours (pour tester avant le lancement).
 */
export function V3LockedGate({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [checked, setChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getIsCurrentSessionAdmin()
      .then((v) => { if (!cancelled) setIsAdmin(!!v); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setChecked(true); });
    return () => { cancelled = true; };
  }, []);

  if (V3_LAUNCH_UNLOCKED) return <>{children}</>;
  if (!checked) return null;
  if (isAdmin) return <>{children}</>;
  return <Navigate to="/v3/offre" replace state={{ from: location.pathname }} />;
}

export default V3LockedGate;
