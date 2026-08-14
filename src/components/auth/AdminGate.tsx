import { useCallback, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { resolveAdminStatus } from "@/lib/adminAccess";
import { ADMIN_LOGIN_PATH } from "@/config/adminRoutes";
import AccessPendingFallback from "@/components/auth/AccessPendingFallback";

type Props = {
  children: React.ReactNode;
};

/**
 * Server-validated admin gate.
 *
 * Why: admin access must not depend on local/session storage flags.
 * Le rôle a trois états : inconnu (`null`), admin, non-admin. On ne redirige
 * QUE sur un refus confirmé : un statut inconnu patiente puis réessaie.
 */
export function AdminGate({ children }: Props) {
  const [status, setStatus] = useState<boolean | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [retry, setRetry] = useState(0);
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    setTimedOut(false);
    const timer = setTimeout(() => {
      if (!cancelled) setTimedOut(true);
    }, 8000);

    const run = async () => {
      try {
        const result = await resolveAdminStatus();
        if (cancelled) return;
        // Un admin confirmé n'est jamais rétrogradé.
        setStatus((prev) => (prev === true ? true : result));
      } catch (e) {
        console.error("AdminGate error:", e);
      }
    };

    void run();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [retry]);

  const onRetry = useCallback(() => setRetry((n) => n + 1), []);

  if (status === null) {
    return <AccessPendingFallback timedOut={timedOut} onRetry={onRetry} />;
  }

  if (status === false) {
    return <Navigate to={ADMIN_LOGIN_PATH} replace state={{ from: location.pathname, reason: "session-required" }} />;
  }

  return <>{children}</>;
}
