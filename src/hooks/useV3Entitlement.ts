import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getStripeEnvironment } from '@/lib/stripe';
import { getIsCurrentSessionAdmin } from '@/lib/adminAccess';

/**
 * Droits d'accès V3 d'après les commandes réellement payées (v3_installment_orders).
 *
 * - `hasBase`  : a réglé l'offre Base 197€ (plan `base_*`, statut actif/terminé/payé).
 * - `hasFull`  : a réglé le Pack Tout Complet 547€ (plan `full_*`, statut actif/terminé/payé).
 * - L'admin a accès à tout (préparation / démonstration).
 *
 * Tant que rien n'est réglé, le parcours Pro 547€ reste verrouillé : impossible
 * de "commencer à 547€" sans paiement.
 */
const PAID_STATUSES = new Set(['active', 'completed', 'paid']);

export function useV3Entitlement() {
  const [loading, setLoading] = useState(true);
  const [hasBase, setHasBase] = useState(false);
  const [hasFull, setHasFull] = useState(false);
  const [hasV2, setHasV2] = useState(false);
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
        setHasV2(true);
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      const email = user?.email;
      if (cancelled) return;
      if (!email) {
        setHasBase(false);
        setHasFull(false);
        setHasV2(false);
        setLoading(false);
        return;
      }

      try {
        const { data } = await supabase.rpc('get_my_v3_installment_orders');

        if (cancelled) return;
        const env = getStripeEnvironment();
        const rows = (data ?? []).filter((r: any) => r.environment === env);
        const paid = rows.filter((r: any) => PAID_STATUSES.has((r.status ?? '').toLowerCase()));
        const full = paid.some((r: any) => (r.plan ?? '').startsWith('full'));
        setHasFull(full);
        setHasBase(full || paid.some((r: any) => (r.plan ?? '').startsWith('base')));
        // Acheteur V2 (accès à vie) : plans `v2_1x` / `v2_3x` réglés.
        setHasV2(paid.some((r: any) => (r.plan ?? '').startsWith('v2')));

      } catch {
        if (!cancelled) {
          setHasBase(false);
          setHasFull(false);
          setHasV2(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { loading, hasBase, hasFull, hasV2, isAdmin };
}

export default useV3Entitlement;
