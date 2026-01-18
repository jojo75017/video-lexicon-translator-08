import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
          if (!cancelled) {
            setAllowed(false);
            setChecking(false);
          }
          return;
        }

        const { data, error } = await supabase.functions.invoke("check-admin", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (cancelled) return;

        if (error) {
          console.error("AdminGate check-admin error:", error);
          toast.error("Impossible de vérifier les droits admin");
          setAllowed(false);
          setChecking(false);
          return;
        }

        const isAdmin = !!data?.isAdmin;

        if (!isAdmin) {
          // Safety: ensure we don't keep an authenticated non-admin session for admin area
          await supabase.auth.signOut();
          toast.error("Accès admin refusé");
        }

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
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
