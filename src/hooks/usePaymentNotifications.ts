import { useEffect, useRef, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaymentNotification {
  email: string;
  planType: string;
  accessCode: string;
  createdAt: string;
}

export const usePaymentNotifications = (enabled: boolean = true) => {
  const [lastCheckedCount, setLastCheckedCount] = useState<number | null>(null);
  const [newPayments, setNewPayments] = useState<PaymentNotification[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(enabled);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Create audio element for notification sound
  useEffect(() => {
    // Create a simple notification sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const createNotificationSound = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    };

    // Store the function for later use
    (window as any).__playPaymentNotification = createNotificationSound;

    return () => {
      delete (window as any).__playPaymentNotification;
    };
  }, []);

  const playNotificationSound = useCallback(() => {
    try {
      if ((window as any).__playPaymentNotification) {
        (window as any).__playPaymentNotification();
      }
    } catch (error) {
      console.log('Could not play notification sound:', error);
    }
  }, []);

  const checkForNewPayments = useCallback(async () => {
    if (!isMonitoring) return;

    try {
      const { data, error, count } = await supabase
        .from('subscribers')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const currentCount = count || 0;

      // If this is the first check, just set the baseline
      if (lastCheckedCount === null) {
        setLastCheckedCount(currentCount);
        return;
      }

      // Check if there are new subscribers
      if (currentCount > lastCheckedCount) {
        const newCount = currentCount - lastCheckedCount;
        const latestPayments = (data || []).slice(0, newCount).map(sub => ({
          email: sub.email,
          planType: sub.plan_type,
          accessCode: sub.access_code || '',
          createdAt: sub.created_at
        }));

        setNewPayments(latestPayments);
        setLastCheckedCount(currentCount);

        // Play notification sound
        playNotificationSound();

        // Show toast for each new payment
        latestPayments.forEach(payment => {
          toast.success(
            `🎉 Nouveau paiement ! ${payment.email} - Plan ${payment.planType}`,
            { duration: 10000 }
          );
        });
      }
    } catch (error) {
      console.error('Error checking for new payments:', error);
    }
  }, [isMonitoring, lastCheckedCount, playNotificationSound]);

  // Set up polling interval
  useEffect(() => {
    if (isMonitoring) {
      // Initial check
      checkForNewPayments();
      
      // Check every 30 seconds
      intervalRef.current = setInterval(checkForNewPayments, 30000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isMonitoring, checkForNewPayments]);

  // Also set up realtime subscription for instant notifications
  useEffect(() => {
    if (!isMonitoring) return;

    const channel = supabase
      .channel('new-payments')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'subscribers'
        },
        (payload) => {
          const newSub = payload.new as any;
          
          // Play sound
          playNotificationSound();
          
          // Show toast
          toast.success(
            `🎉 Nouveau paiement ! ${newSub.email} - Plan ${newSub.plan_type}`,
            { 
              duration: 10000,
              action: {
                label: 'Voir',
                onClick: () => {
                  // Scroll to subscriber list or highlight
                  document.getElementById('subscribers-list')?.scrollIntoView({ behavior: 'smooth' });
                }
              }
            }
          );

          // Update state
          setNewPayments(prev => [{
            email: newSub.email,
            planType: newSub.plan_type,
            accessCode: newSub.access_code || '',
            createdAt: newSub.created_at
          }, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isMonitoring, playNotificationSound]);

  const toggleMonitoring = useCallback(() => {
    setIsMonitoring(prev => !prev);
  }, []);

  const clearNewPayments = useCallback(() => {
    setNewPayments([]);
  }, []);

  const testSound = useCallback(() => {
    playNotificationSound();
    toast.info('🔔 Test de notification sonore');
  }, [playNotificationSound]);

  return {
    isMonitoring,
    toggleMonitoring,
    newPayments,
    clearNewPayments,
    testSound
  };
};
