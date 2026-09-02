import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getStripeEnvironment } from '@/lib/stripe';
import { useAdminAccess } from '@/contexts/AdminAccessContext';

/**
 * Droits d'accès au Studio BD & Jeunesse (ex-ebook_comic_agent).
 *
 * Accès accordé si :
 *  - Admin
 *  - Abonné plan Pro / Édition (plan_tier : editeur, auteur, lifetime, vip)
 *  - Achat one-shot 17 € du module (module_entitlements, module = 'bd-comic')
 *
 * `isPro` est vrai avec l'upsell 47 € (module = 'bd-comic-pro') ou un plan Pro.
 */
const PRO_TIERS = new Set(['editeur', 'auteur', 'lifetime', 'vip']);
const PAID_STATUSES = new Set(['active', 'completed', 'paid']);

export function useBdComicAccess() {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [reason, setReason] = useState<'admin' | 'plan' | 'purchased' | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const { isAdmin, isChecking } = useAdminAccess();

  const check = useCallback(async () => {
    setLoading(true);
    try {
      if (isChecking) return;
      if (isAdmin) {
        setHasAccess(true);
        setIsPro(true);
        setReason('admin');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      const email = user?.email?.toLowerCase() ?? '';
      setUserEmail(email);
      if (!email) {
        setHasAccess(false);
        setIsPro(false);
        setReason(null);
        return;
      }

      // 1) Abonnement Pro / Édition actif : tout est inclus.
      try {
        const { data } = await supabase
          .from('subscribers')
          .select('plan_tier,plan_type,status')
          .eq('email', email)
          .eq('status', 'active')
          .maybeSingle();
        const tier = (data?.plan_tier ?? '').toLowerCase();
        const type = (data?.plan_type ?? '').toLowerCase();
        if (PRO_TIERS.has(tier) || type === 'lifetime' || type === 'vip') {
          setHasAccess(true);
          setIsPro(true);
          setReason('plan');
          return;
        }
      } catch { /* ignore */ }

      // 2) Achats à l'unité du module (17 €) et de l'upsell Pro (47 €).
      try {
        const { data } = await supabase.rpc('get_my_module_entitlements');
        const env = getStripeEnvironment();
        const rows = (data ?? []) as Array<{ module?: string; status?: string; environment?: string }>;
        const owns = (mod: string) =>
          rows.some(
            (r) =>
              r.module === mod &&
              PAID_STATUSES.has((r.status ?? '').toLowerCase()) &&
              r.environment === env,
          );
        const pro = owns('bd-comic-pro');
        if (pro || owns('bd-comic')) {
          setHasAccess(true);
          setIsPro(pro);
          setReason('purchased');
          return;
        }
      } catch { /* ignore */ }

      setHasAccess(false);
      setIsPro(false);
      setReason(null);
    } catch {
      setHasAccess(false);
      setIsPro(false);
      setReason(null);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, isChecking]);

  useEffect(() => {
    void check();
  }, [check]);

  return { loading, hasAccess, isPro, reason, userEmail, refresh: check };
}

export default useBdComicAccess;
