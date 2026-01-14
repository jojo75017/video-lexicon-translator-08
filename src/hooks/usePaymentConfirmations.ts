import { useEffect, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PaymentConfirmation {
  id: string;
  email: string;
  status: string;
  created_at: string;
  processed_at: string | null;
  processed_by: string | null;
}

export const usePaymentConfirmations = () => {
  const [confirmations, setConfirmations] = useState<PaymentConfirmation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  const loadConfirmations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('payment_confirmations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const typedData = (data || []) as PaymentConfirmation[];
      setConfirmations(typedData);
      setPendingCount(typedData.filter(c => c.status === 'pending').length);
    } catch (error) {
      console.error('Error loading confirmations:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsProcessed = useCallback(async (id: string, adminEmail: string) => {
    try {
      const { error } = await supabase
        .from('payment_confirmations')
        .update({ 
          status: 'processed',
          processed_at: new Date().toISOString(),
          processed_by: adminEmail
        })
        .eq('id', id);

      if (error) throw error;

      setConfirmations(prev => 
        prev.map(c => c.id === id 
          ? { ...c, status: 'processed', processed_at: new Date().toISOString(), processed_by: adminEmail }
          : c
        )
      );
      setPendingCount(prev => Math.max(0, prev - 1));
      toast.success('Confirmation marquée comme traitée');
    } catch (error) {
      console.error('Error marking as processed:', error);
      toast.error('Erreur lors du traitement');
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadConfirmations();
  }, [loadConfirmations]);

  // Realtime subscription for new confirmations
  useEffect(() => {
    const channel = supabase
      .channel('payment-confirmations')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'payment_confirmations'
        },
        (payload) => {
          const newConfirmation = payload.new as PaymentConfirmation;
          
          // Play notification sound
          if ((window as any).__playPaymentNotification) {
            (window as any).__playPaymentNotification();
          }
          
          toast.success(
            `📬 Nouvelle confirmation de paiement ! ${newConfirmation.email}`,
            { duration: 10000 }
          );

          setConfirmations(prev => [newConfirmation, ...prev]);
          setPendingCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    confirmations,
    pendingCount,
    isLoading,
    loadConfirmations,
    markAsProcessed
  };
};
