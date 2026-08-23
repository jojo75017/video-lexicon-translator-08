import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getStripeEnvironment } from '@/lib/stripe';
import { useAdminAccess } from '@/contexts/AdminAccessContext';

/**
 * Droits d'accès au Générateur de Coloriages Cherche & Trouve.
 *
 * Accès accordé si :
 *  - Admin
 *  - Abonné plan Pro / Édition (plan_tier : editeur, auteur, lifetime, vip)
 *  - Achat one-shot 27 € du module (module_entitlements, module = 'cherche-trouve')
 */
const PRO_TIERS = new Set(['editeur', 'auteur', 'lifetime', 'vip']);
const PAID_STATUSES = new Set(['active', 'completed', 'paid']);

export function useChercheTrouveAccess() {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [reason, setReason] = useState<'admin' | 'plan' | 'purchased' | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const { isAdmin, isChecking } = useAdminAccess();

  const check = useCallback(async () => {
    setLoading(true);
    try {
      if (isChecking) return;
      if (isAdmin) {
        setHasAccess(true);
        setReason('admin');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      const email = user?.email?.toLowerCase() ?? '';
      setUserEmail(email);
      if (!email) {
        setHasAccess(false);
        setReason(null);
        return;
      }

      // 1) Abonnement plan Pro / Édition actif
      try {
        const { data } = await supabase
          .from('subscribers')
          .select('plan_tier,status')
          .eq('email', email)
          .eq('status', 'active')
          .maybeSingle();
        if (PRO_TIERS.has((data?.plan_tier ?? '').toLowerCase())) {
          setHasAccess(true);
          setReason('plan');
          return;
        }
      } catch { /* ignore */ }

      // 2) Achat one-shot du module
      try {
        const { data } = await supabase.rpc('get_my_module_entitlements');
        const env = getStripeEnvironment();
        const owned = (data ?? []).some(
          (r: any) =>
            r.module === 'cherche-trouve' &&
            PAID_STATUSES.has((r.status ?? '').toLowerCase()) &&
            r.environment === env,
        );
        if (owned) {
          setHasAccess(true);
          setReason('purchased');
          return;
        }
      } catch { /* ignore */ }

      setHasAccess(false);
      setReason(null);
    } catch {
      setHasAccess(false);
      setReason(null);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, isChecking]);

  useEffect(() => {
    void check();
  }, [check]);

  return { loading, hasAccess, reason, userEmail, refresh: check };
}

export default useChercheTrouveAccess;
