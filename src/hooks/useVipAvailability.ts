import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useVipAvailability = () => {
  const [canCreateVip, setCanCreateVip] = useState<boolean | null>(null);
  const [vipCount, setVipCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkVipAvailability = async () => {
      try {
        // Check if we can still create VIP (less than 20)
        const { data: canCreate, error: canCreateError } = await supabase
          .rpc('can_create_vip');
        
        if (canCreateError) {
          console.error('Error checking VIP availability:', canCreateError);
          setCanCreateVip(true); // Default to allowing if error
        } else {
          setCanCreateVip(canCreate);
        }

        // Get current VIP count
        const { data: count, error: countError } = await supabase
          .rpc('count_vip_subscribers');
        
        if (!countError) {
          setVipCount(count);
        }
      } catch (error) {
        console.error('Error in VIP check:', error);
        setCanCreateVip(true); // Default to allowing if error
      } finally {
        setIsLoading(false);
      }
    };

    checkVipAvailability();
  }, []);

  return {
    canCreateVip,
    vipCount,
    remainingSpots: vipCount !== null ? Math.max(0, 30 - vipCount) : null,
    isLoading,
    isVipAvailable: canCreateVip === true
  };
};
