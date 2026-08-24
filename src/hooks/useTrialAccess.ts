import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * État de l'essai gratuit 7 jours de l'utilisateur connecté.
 *
 *  - `isTrial`      : l'utilisateur est en essai gratuit (palier « essai »)
 *  - `isExpired`    : l'essai est terminé → lecture seule + écran d'achat
 *  - `daysRemaining`: jours restants (0 si terminé)
 *
 * Les modules premium restent bloqués pendant l'essai (2ᵉ livre, Cover Studio Pro,
 * audio, KDP Pilot, traductions, livres de jeux / histoires courtes) et les
 * exports sont filigranés.
 */
export interface TrialAccessState {
  loading: boolean;
  isTrial: boolean;
  isExpired: boolean;
  daysRemaining: number;
  endsAt: string | null;
  email: string;
  /** Export sans filigrane interdit tant que l'utilisateur est en essai. */
  watermarkExports: boolean;
  refresh: () => Promise<void>;
}

export function useTrialAccess(): TrialAccessState {
  const [loading, setLoading] = useState(true);
  const [isTrial, setIsTrial] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [endsAt, setEndsAt] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  const check = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const mail = user?.email?.toLowerCase() ?? '';
      setEmail(mail);
      if (!mail) {
        setIsTrial(false);
        setIsExpired(false);
        setDaysRemaining(0);
        setEndsAt(null);
        return;
      }

      const { data } = await supabase
        .from('subscribers')
        .select('plan_tier,status,trial_ends_at')
        .eq('email', mail)
        .maybeSingle();

      const tier = (data?.plan_tier ?? '').toLowerCase();
      const status = (data?.status ?? '').toLowerCase();
      const trial = tier === 'essai';
      const end = data?.trial_ends_at ?? null;
      const expired = trial && (status === 'expired' || (!!end && new Date(end).getTime() <= Date.now()));

      setIsTrial(trial);
      setIsExpired(expired);
      setEndsAt(end);
      setDaysRemaining(
        trial && end && !expired
          ? Math.max(0, Math.ceil((new Date(end).getTime() - Date.now()) / 86_400_000))
          : 0,
      );
    } catch {
      setIsTrial(false);
      setIsExpired(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void check(); }, [check]);

  return {
    loading,
    isTrial,
    isExpired,
    daysRemaining,
    endsAt,
    email,
    watermarkExports: isTrial,
    refresh: check,
  };
}

export default useTrialAccess;
