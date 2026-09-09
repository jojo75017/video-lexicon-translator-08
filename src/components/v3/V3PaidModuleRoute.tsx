import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
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
  const { isAuthenticated, isLoading } = useAuth();
  const mod = findPaidModuleForPath(location.pathname);
  const { loading, hasAccess } = useModuleAccess(mod?.key ?? null);

  // Pas un complément payant : verrou habituel.
  if (!mod) return <V3LockedGate>{children}</V3LockedGate>;

  if (isLoading || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--v3-emerald)' }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/v3/auth" replace state={{ from: location.pathname }} />;
  }

  if (hasAccess) return <V3LockedGate>{children}</V3LockedGate>;

  return <V3ModulePaywall>{children}</V3ModulePaywall>;
}

export default V3PaidModuleRoute;
