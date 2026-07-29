import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { getIsCurrentSessionAdmin } from "@/lib/adminAccess";
import { V3_LAUNCH_UNLOCKED } from "@/config/v3Launch";

/**
 * Verrouille une route V3 tant que `V3_LAUNCH_UNLOCKED = false`.
 * Les admins passent toujours.
 * Les autres sont redirigés vers /v3/offre avec un toast informatif.
 */
export function V3LockedGate({ children }: { children: ReactNode }) {
  const [checking, setChecking] = useState(!V3_LAUNCH_UNLOCKED);
  const [allowed, setAllowed] = useState(V3_LAUNCH_UNLOCKED);
  const location = useLocation();

  useEffect(() => {
    if (V3_LAUNCH_UNLOCKED) return;
    let cancelled = false;
    getIsCurrentSessionAdmin()
      .then((isAdmin) => {
        if (cancelled) return;
        setAllowed(isAdmin);
        setChecking(false);
        if (!isAdmin) {
          toast.info(
            "La V3 ouvre le 1er octobre 2026. Découvrez ce qui vous attend.",
            { duration: 5000 },
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAllowed(false);
          setChecking(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (checking) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center text-slate-500">
        Chargement…
      </main>
    );
  }

  if (!allowed) {
    return <Navigate to="/v3/offre" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

export default V3LockedGate;
