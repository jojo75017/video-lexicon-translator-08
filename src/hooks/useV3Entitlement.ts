import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getStripeEnvironment } from '@/lib/stripe';
import { getIsCurrentSessionAdmin } from '@/lib/adminAccess';

/**
 * Droits d'accès V3 d'après les commandes réellement payées (v3_installment_orders).
 *
 * - `hasBase`  : a réglé l'offre Base 197€ (plan `base_*`, statut actif/terminé/payé).
 * - `hasFull`  : a réglé le Pack Tout Complet 497€ (plan `full_*`, statut actif/terminé/payé).
 * - L'admin a accès à tout (préparation / démonstration).
 *
 * Tant que rien n'est réglé, le parcours Pro 497€ reste verrouillé : impossible
 * de "commencer à 497€" sans paiement.
 */
const PAID_STATUSES = new Set(['active', 'completed', 'paid']);

export function useV3Entitlement() {
  const [loading, setLoading] = useState(true);
  const [hasBase, setHasBase] = useState(false);
  const [hasFull, setHasFull] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const admin = await getIsCurrentSessionAdmin();
      if (cancelled) return;
      setIsAdmin(admin);

      if (admin) {
        setHasBase(true);
        setHasFull(true);
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      const email = user?.email;
      if (cancelled) return;
      if (!email) {
        setHasBase(false);
        setHasFull(false);
        setLoading(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('v3_installment_orders')
          .select('plan, status')
          .eq('environment', getStripeEnvironment())
          .ilike('email', email);

        if (cancelled) return;
        const rows = data ?? [];
        const paid = rows.filter((r) => PAID_STATUSES.has((r.status ?? '').toLowerCase()));
        const full = paid.some((r) => (r.plan ?? '').startsWith('full'));
        setHasFull(full);
        setHasBase(full || paid.some((r) => (r.plan ?? '').startsWith('base')));
      } catch {
        if (!cancelled) {
          setHasBase(false);
          setHasFull(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.email, isAuthenticated]);

  return { loading, hasBase, hasFull, isAdmin };
}

export default useV3Entitlement;
