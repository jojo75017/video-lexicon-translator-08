import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAccess } from '@/contexts/AdminAccessContext';

export type ProBookTier = 'standard' | 'pro';

/**
 * Détermine le niveau (standard / pro avancé) pour les modules
 * Documentaire · Atlas · Cuisine · Voyage.
 *
 * - Standard : inclus dans les 3 forfaits V3 (Débutant / Expert / Éditeur).
 * - Pro : réservé au forfait Édition 27 € (+ lifetime, vip, admin).
 */
const PRO_TIERS = new Set(['editeur', 'auteur', 'lifetime', 'vip']);

export function useProBookTier() {
  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState<ProBookTier>('standard');
  const { isAdmin, isChecking } = useAdminAccess();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      if (isChecking) return;
      const admin = isAdmin;

      if (admin) {
        setTier('pro');
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      const email = user?.email;
      if (!email) {
        if (!cancelled) {
          setTier('standard');
          setLoading(false);
        }
        return;
      }

      try {
        const { data } = await supabase
          .from('subscribers')
          .select('plan_tier,status')
          .eq('email', email.toLowerCase())
          .eq('status', 'active')
          .maybeSingle();

        if (cancelled) return;
        const planTier = (data?.plan_tier ?? '').toLowerCase();
        setTier(PRO_TIERS.has(planTier) ? 'pro' : 'standard');
      } catch {
        if (!cancelled) setTier('standard');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [isAdmin, isChecking]);

  return { loading, tier, isAdmin, isPro: tier === 'pro' };
}

export default useProBookTier;
