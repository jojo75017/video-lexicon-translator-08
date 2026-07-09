import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getStripeEnvironment } from '@/lib/stripe';
import { getIsCurrentSessionAdmin } from '@/lib/adminAccess';

/**
 * Droits d'accès à BookPerfect AI.
 *
 * Accès accordé UNIQUEMENT si :
 *  - Admin (préparation / démonstration)
 *  - Achat direct de BookPerfect AI (module_entitlements)
 *
 * Aucun accès gratuit : ni Base 197€, ni Pack Pro 347€, ni V2, ni aucun autre
 * module. Tout le monde (sauf admin) doit acheter BookPerfect séparément.
 */
const PAID_STATUSES = new Set(['active', 'completed', 'paid']);

export function useBookPerfectAccess() {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [reason, setReason] = useState<'admin' | 'purchased' | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const admin = await getIsCurrentSessionAdmin();
        if (cancelled) return;
        if (admin) {
          setHasAccess(true);
          setReason('admin');
          setLoading(false);
          return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        const email = user?.email;
        if (cancelled) return;
        if (!email) {
          setHasAccess(false);
          setReason(null);
          setLoading(false);
          return;
        }

        const env = getStripeEnvironment();

        // 1) Pack Pro V3 347€ inclut BookPerfect
        try {
          const { data } = await supabase.rpc('get_my_v3_installment_orders');
          if (cancelled) return;
          const rows = (data ?? []).filter((r: any) => r.environment === env);
          const paid = rows.filter((r: any) => PAID_STATUSES.has((r.status ?? '').toLowerCase()));
          const hasFull = paid.some((r: any) => (r.plan ?? '').startsWith('full'));
          if (hasFull) {
            setHasAccess(true);
            setReason('pack-pro');
            setLoading(false);
            return;
          }
        } catch { /* ignore */ }

        // 2) Achat direct BookPerfect
        try {
          const { data } = await supabase.rpc('get_my_module_entitlements');
          if (cancelled) return;
          const owned = (data ?? []).some(
            (r: any) =>
              r.module === 'bookperfect' &&
              PAID_STATUSES.has((r.status ?? '').toLowerCase()) &&
              r.environment === env,
          );
          if (owned) {
            setHasAccess(true);
            setReason('purchased');
            setLoading(false);
            return;
          }
        } catch { /* ignore */ }

        setHasAccess(false);
        setReason(null);
      } catch {
        if (!cancelled) {
          setHasAccess(false);
          setReason(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return { loading, hasAccess, reason };
}

export default useBookPerfectAccess;
