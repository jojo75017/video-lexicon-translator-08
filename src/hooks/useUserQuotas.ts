import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface QuotaInfo {
  used: number;
  limit: number;
  remaining: number;
}

interface UserQuotas {
  plan: string;
  ebook_plans: QuotaInfo;
  chapters: QuotaInfo;
  subchapters: QuotaInfo;
  covers: QuotaInfo;
}

interface UseUserQuotasReturn {
  quotas: UserQuotas | null;
  isLoading: boolean;
  hasSubscription: boolean;
  refreshQuotas: () => Promise<void>;
  checkQuota: (action: 'ebook_plan' | 'chapter' | 'subchapter' | 'cover') => Promise<boolean>;
  incrementQuota: (action: 'ebook_plan' | 'chapter' | 'subchapter' | 'cover', count?: number) => Promise<boolean>;
}

export const useUserQuotas = (): UseUserQuotasReturn => {
  const [quotas, setQuotas] = useState<UserQuotas | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);

  const fetchQuotas = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('check-quota', {
        body: { email: user.email }
      });

      if (error) {
        console.error('Error fetching quotas:', error);
        setHasSubscription(false);
        setIsLoading(false);
        return;
      }

      if (data.quotas) {
        setQuotas(data.quotas);
        setHasSubscription(data.hasSubscription);
      } else {
        setHasSubscription(false);
      }
    } catch (error) {
      console.error('Error fetching quotas:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkQuota = useCallback(async (action: 'ebook_plan' | 'chapter' | 'subchapter' | 'cover'): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        toast.error('Veuillez vous connecter pour continuer');
        return false;
      }

      const { data, error } = await supabase.functions.invoke('check-quota', {
        body: { email: user.email, action }
      });

      if (error) {
        const errorData = error.message ? JSON.parse(error.message) : {};
        if (errorData.code === 'QUOTA_EXCEEDED') {
          toast.error(errorData.error || 'Quota épuisé');
          return false;
        }
        if (errorData.code === 'NO_SUBSCRIPTION') {
          toast.error('Aucun abonnement actif. Veuillez souscrire à une offre.');
          return false;
        }
        console.error('Quota check error:', error);
        return false;
      }

      return data.canProceed;
    } catch (error) {
      console.error('Error checking quota:', error);
      return false;
    }
  }, []);

  const incrementQuota = useCallback(async (action: 'ebook_plan' | 'chapter' | 'subchapter' | 'cover', count = 1): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) return false;

      const { error } = await supabase.functions.invoke('increment-quota', {
        body: { email: user.email, action, count }
      });

      if (error) {
        console.error('Increment quota error:', error);
        return false;
      }

      // Rafraîchir les quotas après l'incrémentation
      await fetchQuotas();
      return true;
    } catch (error) {
      console.error('Error incrementing quota:', error);
      return false;
    }
  }, [fetchQuotas]);

  useEffect(() => {
    fetchQuotas();
  }, [fetchQuotas]);

  return {
    quotas,
    isLoading,
    hasSubscription,
    refreshQuotas: fetchQuotas,
    checkQuota,
    incrementQuota,
  };
};

// Helper pour formater l'affichage des quotas
export const formatQuotaDisplay = (quota: QuotaInfo): string => {
  if (quota.limit === -1) {
    return `${quota.used} utilisé(s) - Illimité`;
  }
  return `${quota.used} / ${quota.limit}`;
};

// Helper pour calculer le pourcentage d'utilisation
export const getQuotaPercentage = (quota: QuotaInfo): number => {
  if (quota.limit === -1) return 0;
  if (quota.limit === 0) return 100;
  return Math.min(100, Math.round((quota.used / quota.limit) * 100));
};
