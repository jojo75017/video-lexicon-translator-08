import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useVipAvailability = () => {
  const [canCreateVip, setCanCreateVip] = useState<boolean | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkVipAvailability = async () => {
      try {
        const [{ data: canCreate, error: canCreateError }, { data: days, error: daysError }] = await Promise.all([
          supabase.rpc('can_create_vip'),
          supabase.rpc('vip_days_remaining'),
        ]);

        if (canCreateError) {
          console.error('Error checking VIP availability:', canCreateError);
          setCanCreateVip(true);
        } else {
          setCanCreateVip(canCreate);
        }

        if (!daysError) {
          setDaysRemaining(days);
        }
      } catch (error) {
        console.error('Error in VIP check:', error);
        setCanCreateVip(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkVipAvailability();
  }, []);

  return {
    canCreateVip,
    daysRemaining,
    isLoading,
    isVipAvailable: canCreateVip === true,
    // Keep backwards compat
    vipCount: null,
    remainingSpots: daysRemaining,
  };
};
