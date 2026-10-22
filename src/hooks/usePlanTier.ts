import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getStripeEnvironment } from '@/lib/stripe';
import { useAdminAccess } from '@/contexts/AdminAccessContext';
import { PLAN_TIER_META, TIER_RANK, type V3PlanTier } from '@/data/v3PlanTiers';

const PAID_STATUSES = new Set(['active', 'completed', 'paid']);

/**
 * Plan du compte courant parmi les 3 nouvelles formules
 * (Starter 27 € / Auteur 97 € / Édition 197 €).
 *
 * - Admin → 'edition' (passe-partout).
 * - Compte avec un droit plan_starter / plan_auteur / plan_edition
 *   (module_entitlements, écrit par le futur tunnel de paiement) → ce plan.
 * - Tout autre compte (clients historiques, abonnés actuels, visiteurs) →
 *   null : AUCUN cadenas ne s'applique, leurs droits sont préservés.
 */
export function usePlanTier() {
  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState<V3PlanTier | null>(null);
  const { isAdmin, isChecking } = useAdminAccess();

  const check = useCallback(async () => {
    if (isChecking) { setLoading(true); return; }
    if (isAdmin) { setTier('edition'); setLoading(false); return; }
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setTier(null); return; }
      const env = getStripeEnvironment();
      const { data } = await supabase.rpc('get_my_module_entitlements');
      let best: V3PlanTier | null = null;
      for (const r of data ?? []) {
        const mod = String(r.module ?? '');
        const match = (Object.keys(PLAN_TIER_META) as V3PlanTier[]).find(
          (t) => PLAN_TIER_META[t].entitlement === mod,
        );
        if (
          match &&
          PAID_STATUSES.has(String(r.status ?? '').toLowerCase()) &&
          r.environment === env &&
          (best === null || TIER_RANK[match] > TIER_RANK[best])
        ) {
          best = match;
        }
      }
      setTier(best);
    } catch {
      setTier(null);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, isChecking]);

  useEffect(() => { void check(); }, [check]);

  return { loading, tier, refresh: check };
}

export default usePlanTier;
