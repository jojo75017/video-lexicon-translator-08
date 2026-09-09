import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getStripeEnvironment } from '@/lib/stripe';
import { useAdminAccess } from '@/contexts/AdminAccessContext';
import useV3Entitlement from '@/hooks/useV3Entitlement';

/**
 * Droit d'accès générique à un complément payant V3.
 *
 * Accès accordé si :
 *  - Admin (préparation / démonstration) ;
 *  - Forfait tout compris (Pack Pro / Édition) ;
 *  - Achat du complément (module_entitlements, même environnement Stripe).
 *
 * Aucun accès gratuit par défaut : un abonné sans achat voit l'outil grisé.
 */
const PAID_STATUSES = new Set(['active', 'completed', 'paid']);

export type ModuleAccessReason = 'admin' | 'plan' | 'purchased' | null;

export function useModuleAccess(moduleKey: string | null | undefined) {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [reason, setReason] = useState<ModuleAccessReason>(null);
  const { isAdmin, isChecking } = useAdminAccess();
  const { loading: entLoading, hasFull } = useV3Entitlement();

  const check = useCallback(async () => {
    if (!moduleKey) { setHasAccess(true); setReason('plan'); setLoading(false); return; }
    if (isChecking) { setLoading(true); return; }
    if (isAdmin) { setHasAccess(true); setReason('admin'); setLoading(false); return; }
    if (entLoading) { setLoading(true); return; }
    if (hasFull) { setHasAccess(true); setReason('plan'); setLoading(false); return; }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) { setHasAccess(false); setReason(null); return; }

      const env = getStripeEnvironment();
      const { data } = await supabase.rpc('get_my_module_entitlements');
      const owned = (data ?? []).some(
        (r: any) =>
          r.module === moduleKey &&
          PAID_STATUSES.has(String(r.status ?? '').toLowerCase()) &&
          r.environment === env,
      );
      setHasAccess(owned);
      setReason(owned ? 'purchased' : null);
    } catch {
      setHasAccess(false);
      setReason(null);
    } finally {
      setLoading(false);
    }
  }, [moduleKey, isAdmin, isChecking, entLoading, hasFull]);

  useEffect(() => { void check(); }, [check]);

  return { loading, hasAccess, reason, refresh: check };
}

export default useModuleAccess;
