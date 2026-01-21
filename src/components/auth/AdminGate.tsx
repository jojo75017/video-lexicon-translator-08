import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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

    const PERMANENT_ADMIN_EMAIL = "boubetgeorges@gmail.com";

    const run = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          // Session absente (souvent après expiration). Pour l'admin permanent,
          // on redirige vers /admin-direct pour récupérer une session via lien email.
          const storedAdminEmail = localStorage.getItem("permanent_admin_email");
          const isPermanentAdmin = (storedAdminEmail || "").toLowerCase() === PERMANENT_ADMIN_EMAIL;

          console.log("AdminGate: No session found", { isPermanentAdmin });

          if (!cancelled) {
            setAllowed(false);
            setChecking(false);
          }
          return;
        }

        console.log("AdminGate: Session found, checking admin status...");

        const { data, error } = await supabase.functions.invoke("check-admin", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (cancelled) return;

        if (error) {
          console.error("AdminGate check-admin error:", error);
          // Évite les popups/toasts bruyants en cas d'erreur réseau temporaire.
          // La redirection (ou /admin-direct pour l'admin permanent) gère le flux.
          setAllowed(false);
          setChecking(false);
          return;
        }

        const isAdmin = !!data?.isAdmin;
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
    const PERMANENT_ADMIN_EMAIL = "boubetgeorges@gmail.com";
    const storedAdminEmail = localStorage.getItem("permanent_admin_email");
    const isPermanentAdmin = (storedAdminEmail || "").toLowerCase() === PERMANENT_ADMIN_EMAIL;

    // Si on sait que c'est l'admin permanent mais qu'il n'y a plus de session,
    // on l'envoie vers le flux de reconnexion automatique.
    if (isPermanentAdmin) {
      return <Navigate to="/admin-direct" replace state={{ from: location }} />;
    }

    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
