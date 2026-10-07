import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isPreviewingAsSubscriber } from '@/components/v3/V3ContemplationMode';

export interface CoverProCredits {
  granted: number;
  used: number;
  remaining: number;
}

export interface CoverProKeyInfo {
  provider: string;
  /** Aperçu masqué uniquement — la clé complète ne quitte jamais le serveur. */
  mask: string;
  lastTestedAt?: string | null;
  lastTestOk?: boolean | null;
}

export interface CoverProStatus {
  hasAccess: boolean;
  reason: 'admin' | 'purchased' | null;
  isAdmin: boolean;
  credits: CoverProCredits;
  key: CoverProKeyInfo | null;
}

const EMPTY: CoverProStatus = {
  hasAccess: false,
  reason: null,
  isAdmin: false,
  credits: { granted: 0, used: 0, remaining: 0 },
  key: null,
};

/**
 * Droit réel « Cover Studio KDP Pro » : la vérification est faite côté serveur
 * (`cover-pro-status`). L'interface ne fait que refléter cette réponse ; toutes
 * les fonctions sensibles revérifient le droit indépendamment.
 */
export default function useCoverProAccess() {
  const [status, setStatus] = useState<CoverProStatus>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setStatus(EMPTY);
        return;
      }
      const { data, error: fnError } = await supabase.functions.invoke('cover-pro-status', { body: {} });
      if (fnError) throw fnError;
      setStatus({
        hasAccess: Boolean(data?.hasAccess),
        reason: data?.reason ?? null,
        isAdmin: Boolean(data?.isAdmin),
        credits: data?.credits ?? EMPTY.credits,
        key: data?.key ?? null,
      });
    } catch (err) {
      setStatus(EMPTY);
      setError(err instanceof Error ? err.message : 'Statut indisponible');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  // Admin en « Voir comme un abonné » : on montre exactement ce que voit un
  // abonné sans le Pro (le droit admin n'est pas affiché).
  const [preview, setPreview] = useState(isPreviewingAsSubscriber);
  useEffect(() => {
    const sync = () => setPreview(isPreviewingAsSubscriber());
    window.addEventListener('v3-admin-preview-change', sync);
    return () => window.removeEventListener('v3-admin-preview-change', sync);
  }, []);
  const view = preview && status.reason === 'admin'
    ? { ...EMPTY, isAdmin: status.isAdmin }
    : status;

  return { ...view, loading, error, refresh };
}
