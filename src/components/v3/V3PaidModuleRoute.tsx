import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { findPaidModuleForPath } from '@/data/v3ModuleAccess';
import useModuleAccess from '@/hooks/useModuleAccess';
import V3ModulePaywall from '@/components/v3/V3ModulePaywall';
import V3LockedGate from '@/components/v3/V3LockedGate';

/**
 * Route d'un complément payant : l'encart d'achat passe AVANT le verrou
 * d'avant-lancement.
 *
 * - Sans session : redirection vers `/v3/auth` (comportement inchangé).
 * - Connecté sans droit sur le module : aperçu grisé + prix + « Débloquer ».
 * - Connecté avec droit (admin, forfait Édition, achat) : la page normale,
 *   derrière le verrou de lancement habituel.
 */
export function V3PaidModuleRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  // Session lue directement : ce composant vit hors du contexte d'auth global.
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  useEffect(() => {
    let cancelled = false;
    void supabase.auth.getSession().then(({ data }) => {
      if (!cancelled) setSignedIn(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(!!session);
    });
    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, []);
  const mod = findPaidModuleForPath(location.pathname);
  const { loading, hasAccess } = useModuleAccess(mod?.key ?? null);

  // Pas un complément payant : verrou habituel.
  if (!mod) return <V3LockedGate>{children}</V3LockedGate>;

  if (signedIn === null || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--v3-emerald)' }} />
      </div>
    );
  }

  if (!signedIn) {
    return <Navigate to="/v3/auth" replace state={{ from: location.pathname }} />;
  }

  if (hasAccess) return <V3LockedGate>{children}</V3LockedGate>;

  return <V3ModulePaywall>{children}</V3ModulePaywall>;
}

export default V3PaidModuleRoute;
