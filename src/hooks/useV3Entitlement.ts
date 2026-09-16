import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getStripeEnvironment } from '@/lib/stripe';
import useIsAdmin from './useIsAdmin';

/**
 * Droits d'accès V3 d'après les commandes réellement payées (v3_installment_orders).
 *
 * - `hasBase`  : possède Plume, Édition ou un ancien pack Base/Full.
 * - `hasFull`  : possède Édition ou un ancien pack Full.
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
  // Statut admin partagé et réactif : `null` = encore inconnu.
  const { isAdmin: adminStatus } = useIsAdmin();
  const isAdmin = adminStatus === true;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Statut admin inconnu : on reste en chargement, aucune conclusion hâtive.
      if (adminStatus === null) { setLoading(true); return; }

      setLoading(true);

      if (adminStatus === true) {
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
        const full = paid.some((r: any) => {
          const plan = String(r.plan ?? '');
          return plan.startsWith('full') || plan.startsWith('v3_edition_');
        });
        setHasFull(full);
        let base = full || paid.some((r: any) => {
          const plan = String(r.plan ?? '');
          return plan.startsWith('base') || plan.startsWith('v3_plume_');
        });
        const { data: paypalRows } = await supabase
          .from('paypal_subscriptions')
          .select('plan_id, status')
          .ilike('email', email)
          .eq('status', 'active');
        const paypalEdition = (paypalRows ?? []).some((r: any) => r.plan_id === 'edition');
        const paypalPlume = (paypalRows ?? []).some((r: any) => r.plan_id === 'plume');
        if (paypalEdition) setHasFull(true);
        base = base || paypalEdition || paypalPlume;
        setHasBase(base);
        // Ancien client V2 : soit un plan `v2_*` réglé, soit un abonné V2 déjà
        // présent en base (offre à vie ou abonnement actif) — reconnu sans achat.
        let legacyV2 = paid.some((r: any) => (r.plan ?? '').startsWith('v2'));
        if (!legacyV2) {
          const { data: sub } = await supabase
            .from('subscribers')
            .select('status, plan_tier')
            .ilike('email', email)
            .maybeSingle();
          const status = (sub?.status ?? '').toLowerCase();
          const tier = String(sub?.plan_tier ?? '').toLowerCase();
          legacyV2 = tier !== 'plume' && tier !== 'edition' &&
            (status === 'active' || status === 'lifetime' || tier === 'lifetime');
        }
        if (cancelled) return;
        setHasV2(legacyV2);


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
  }, [adminStatus]);

  return { loading, hasBase, hasFull, hasV2, isAdmin };
}

export default useV3Entitlement;
