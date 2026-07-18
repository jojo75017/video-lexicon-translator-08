import React, { useState, useCallback } from 'react';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { X, Loader2, CreditCard } from 'lucide-react';
import { getStripe, getStripeEnvironment } from '@/lib/stripe';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Props {
  email: string;
  label?: string;
  className?: string;
}

/** Bouton d'achat BookPerfect AI (67€ paiement unique, checkout Stripe embarqué). */
const BookPerfectCheckout: React.FC<Props> = ({ email, label = 'Débloquer BookPerfect AI — 67€', className }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const reset = useCallback(() => {
    setClientSecret(null);
    setLoading(false);
    setOpen(false);
  }, []);

  const start = async () => {
    const e = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      toast.error('Merci de saisir un email valide.');
      return;
    }
    setOpen(true);
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('v3-subscription-checkout', {
        body: {
          priceId: 'bookperfect_launch_once',
          email: e,
          environment: getStripeEnvironment(),
          returnUrl: `${window.location.origin}/paiement-succes?session_id={CHECKOUT_SESSION_ID}`,
        },
      });
      if (error) throw new Error(error.message);
      const secret = (data as { clientSecret?: string })?.clientSecret;
      if (!secret) throw new Error('Session de paiement indisponible.');
      setClientSecret(secret);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Paiement impossible.');
      reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={start}
        disabled={loading}
        className={
          className ||
          'w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4 text-base font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl disabled:opacity-60 disabled:hover:scale-100'
        }
      >
        {loading ? (
          <><Loader2 className="h-5 w-5 animate-spin" /> Ouverture…</>
        ) : (
          <><CreditCard className="h-5 w-5" /> {label}</>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={reset}>
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-4"
            onClick={(ev) => ev.stopPropagation()}
          >
            <button onClick={reset} className="absolute right-3 top-3 text-black/40 hover:text-black z-10">
              <X className="h-5 w-5" />
            </button>
            {clientSecret ? (
              <EmbeddedCheckoutProvider stripe={getStripe()} options={{ clientSecret }}>
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            ) : (
              <div className="flex items-center justify-center py-16 text-sm text-neutral-500">
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Préparation du paiement…
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BookPerfectCheckout;
