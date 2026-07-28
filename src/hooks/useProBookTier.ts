import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getIsCurrentSessionAdmin } from '@/lib/adminAccess';

export type ProBookTier = 'standard' | 'pro';

/**
 * Détermine le niveau (standard / pro avancé) pour les modules
 * Documentaire · Atlas · Cuisine · Voyage.
 *
 * - Standard : inclus dans les 3 forfaits V3 (Débutant / Expert / Éditeur).
 * - Pro : réservé au forfait Éditeur 59 € (+ lifetime, vip, admin).
 */
const PRO_TIERS = new Set(['editeur', 'auteur', 'lifetime', 'vip']);

export function useProBookTier() {
  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState<ProBookTier>('standard');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const admin = await getIsCurrentSessionAdmin();
      if (cancelled) return;
      setIsAdmin(admin);

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
  }, []);

  return { loading, tier, isAdmin, isPro: tier === 'pro' };
}

export default useProBookTier;
