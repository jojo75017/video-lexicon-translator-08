import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getIsCurrentSessionAdmin } from "@/lib/adminAccess";

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
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          console.log("AdminGate: No session found");
          if (!cancelled) {
            setAllowed(false);
            setChecking(false);
          }
          return;
        }

        console.log("AdminGate: Session found, checking admin status...");

        const isAdmin = await getIsCurrentSessionAdmin();

        if (cancelled) return;

        console.log("AdminGate: isAdmin =", isAdmin);

        if (isAdmin) {
          // Persist admin status for UI optimizations
          sessionStorage.setItem('is_admin', 'true');
          setAllowed(true);
        } else {
          // Non-admin trying to access admin area
          sessionStorage.removeItem('is_admin');
          // Pas de toast ici: on redirige simplement vers /auth (ou /admin-direct si admin permanent)
          // pour éviter la popup répétitive quand la session est instable.
          setAllowed(false);
        }
        
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
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
