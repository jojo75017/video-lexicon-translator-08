import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getStripeEnvironment } from '@/lib/stripe';
import { useAdminAccess } from '@/contexts/AdminAccessContext';
import { isPreviewingAsSubscriber } from '@/components/v3/V3ContemplationMode';

/**
 * Droit d'accès à l'outil « Ebook Version Longue » (47 €).
 *
 * Accès accordé si :
 *  - Admin (sauf en aperçu « Voir comme un abonné ») ;
 *  - Abonné Pro / Édition (plan_tier editeur, auteur, lifetime, vip) ;
 *  - Achat du module (module_entitlements, module = 'ebook-version-longue'
 *    ou l'identifiant de pack historique 'ebook_version_longue').
 */
const PRO_TIERS = new Set(['editeur', 'auteur', 'lifetime', 'vip']);
const PAID_STATUSES = new Set(['active', 'completed', 'paid']);
const MODULES = ['ebook-version-longue', 'ebook_version_longue'];

export function useEbookLongFormAccess() {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [reason, setReason] = useState<'admin' | 'plan' | 'purchased' | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const { isAdmin, isChecking } = useAdminAccess();
  const [previewAsSubscriber, setPreviewAsSubscriber] = useState(isPreviewingAsSubscriber);

  useEffect(() => {
    const sync = () => setPreviewAsSubscriber(isPreviewingAsSubscriber());
    window.addEventListener('v3-admin-preview-change', sync);
    return () => window.removeEventListener('v3-admin-preview-change', sync);
  }, []);

  const check = useCallback(async () => {
    setLoading(true);
    try {
      if (isChecking) return;
      if (isAdmin && !previewAsSubscriber) {
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
          setReason('plan');
          return;
        }
      } catch { /* ignore */ }

      try {
        const { data } = await supabase.rpc('get_my_module_entitlements');
        const env = getStripeEnvironment();
        const rows = (data ?? []) as Array<{ module?: string; status?: string; environment?: string }>;
        const owns = rows.some(
          (r) =>
            MODULES.includes(r.module ?? '') &&
            PAID_STATUSES.has((r.status ?? '').toLowerCase()) &&
            r.environment === env,
        );
        if (owns) {
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
  }, [isAdmin, isChecking, previewAsSubscriber]);

  useEffect(() => {
    void check();
  }, [check]);

  return { loading, hasAccess, reason, userEmail, refresh: check };
}

export default useEbookLongFormAccess;
