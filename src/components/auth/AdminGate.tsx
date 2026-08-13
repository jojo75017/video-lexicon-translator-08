import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getIsCurrentSessionAdmin } from "@/lib/adminAccess";
import { ADMIN_LOGIN_PATH } from "@/config/adminRoutes";

type Props = {
  children: React.ReactNode;
};

/**
 * Server-validated admin gate.
 *
 * Why: admin access must not depend on local/session storage flags.
 * This gate checks the current authenticated session then confirms admin role
 * via the backend function.
 */
export function AdminGate({ children }: Props) {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const isAdmin = await getIsCurrentSessionAdmin();

        if (cancelled) return;

        setAllowed(isAdmin);
        setChecking(false);
      } catch (e) {
        console.error("AdminGate error:", e);
        if (!cancelled) {
          setAllowed(false);
          setChecking(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  if (checking) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
        Vérification des droits admin...
      </main>
    );
  }

  if (!allowed) {
    return <Navigate to={ADMIN_LOGIN_PATH} replace state={{ from: location.pathname, reason: "session-required" }} />;
  }

  return <>{children}</>;
}
