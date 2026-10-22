import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import usePlanTier from '@/hooks/usePlanTier';
import { isPathLockedForTier, minTierForPath, PLAN_TIER_META } from '@/data/v3PlanTiers';

/**
 * Verrou de page lié à la grille des 3 formules (Starter / Auteur / Édition).
 *
 * - Compte sans nouvelle formule (clients historiques inclus) → accès inchangé.
 * - Compte Starter/Auteur sur une route au-dessus de son plan → écran d'upgrade
 *   poli renvoyant vers /v3/plans.
 * - Admin → toujours ouvert.
 */
export default function PlanGuard({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { loading, tier } = usePlanTier();

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center" aria-label="Vérification de votre formule">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" style={{ color: 'var(--v3-emerald, #064e3b)' }} />
      </div>
    );
  }

  if (!isPathLockedForTier(pathname, tier)) return <>{children}</>;

  const required = minTierForPath(pathname) ?? 'auteur';
  const meta = PLAN_TIER_META[required];

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div
        className="max-w-lg w-full rounded-3xl bg-white p-8 text-center"
        style={{ border: '1px solid var(--v3-line, #e5e0d5)', boxShadow: 'var(--v3-shadow-menu, 0 12px 40px rgba(0,0,0,0.08))' }}
      >
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: 'var(--v3-gold-soft, #faf3e3)', color: 'var(--v3-emerald, #064e3b)' }}
        >
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--v3-emerald, #064e3b)' }}>
          Cette fonction est réservée au plan {meta.label}
        </h1>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--v3-muted, #6b6558)' }}>
          Votre formule actuelle ne comprend pas cet outil. Passez au plan {meta.label}
          ({meta.price} €) pour le débloquer, ainsi que toutes les fonctions des niveaux inférieurs.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/v3/plans"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
            style={{ background: 'var(--v3-emerald, #064e3b)' }}
          >
            Comparer les 3 plans <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/v3"
            className="text-sm font-semibold underline underline-offset-4"
            style={{ color: 'var(--v3-muted, #6b6558)' }}
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
