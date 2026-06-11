import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getIsCurrentSessionAdmin } from "@/lib/adminAccess";

type Props = {
  children: React.ReactNode;
};

/**
 * Gate du Hub V3 : accessible aux admins ET à tout utilisateur connecté.
 * Les droits fins (Inclus 197€ / Pack) sont gérés dans la page via useV3Entitlement —
 * le gate ne sert qu'à exiger une session.
 */
export function V3Gate({ children }: Props) {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          if (!cancelled) {
            setAllowed(true);
            setChecking(false);
          }
          return;
        }
        // Pas de session : dernier recours, vérifier un admin en cache
        const isAdmin = await getIsCurrentSessionAdmin();
        if (!cancelled) {
          setAllowed(isAdmin);
          setChecking(false);
        }
      } catch {
        if (!cancelled) {
          setAllowed(false);
          setChecking(false);
        }
      }
    };

    run();
    return () => { cancelled = true; };
  }, []);

  if (checking) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
        Chargement du Hub V3...
      </main>
    );
  }

  if (!allowed) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
