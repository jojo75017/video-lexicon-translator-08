import { useCallback, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ADMIN_LOGIN_PATH } from "@/config/adminRoutes";
import AccessPendingFallback from "@/components/auth/AccessPendingFallback";
import { useAdminAccess } from "@/contexts/AdminAccessContext";
import AdminQuickNav from "@/components/admin/AdminQuickNav";

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
  const [timedOut, setTimedOut] = useState(false);
  const { status, refresh } = useAdminAccess();
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    setTimedOut(false);
    const timer = setTimeout(() => {
      if (!cancelled) setTimedOut(true);
    }, 8000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [status]);

  const onRetry = useCallback(() => { void refresh(); }, [refresh]);

  if (status === 'restoring' || status === 'temporary-error') {
    return <AccessPendingFallback timedOut={timedOut} onRetry={onRetry} />;
  }

  if (status === 'non-admin') {
    return <Navigate to={ADMIN_LOGIN_PATH} replace state={{ from: location.pathname, reason: "session-required" }} />;
  }

  return (
    <>
      <AdminQuickNav />
      {children}
    </>
  );
}
