import { useCallback, useEffect, useState } from 'react';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { X } from 'lucide-react';
import { getStripe, getStripeEnvironment } from '@/lib/stripe';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  priceId: string;
  planName: string;
  onClose: () => void;
  /** Offre de lancement : première facture au 1er novembre 2026. */
  firstMonthFree?: boolean;
  /** Où revenir après le paiement (défaut : page de remerciement V3). */
  returnUrl?: string;
}

export default function V3SubscribeCheckout({
  priceId,
  planName,
  onClose,
  firstMonthFree,
  returnUrl,
}: Props) {
  const [email, setEmail] = useState('');
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user?.email) {
        setEmail(data.user.email);
        setReady(true);
      }
    })();
  }, []);

  const fetchClientSecret = useCallback(async (): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser();
    const target =
      returnUrl ??
      `${window.location.origin}/v3/offres/merci?session_id={CHECKOUT_SESSION_ID}&plan=${encodeURIComponent(planName)}`;
    const { data, error } = await supabase.functions.invoke('v3-subscription-checkout', {
      body: {
        priceId,
        email: user?.email || email,
        userId: user?.id,
        environment: getStripeEnvironment(),
        returnUrl: target,
        firstMonthFree: firstMonthFree === true,
      },
    });
    if (error || !data?.clientSecret) {
      throw new Error(error?.message || data?.error || 'Impossible de créer la session de paiement');
    }
    return data.clientSecret as string;
  }, [priceId, email, planName, firstMonthFree, returnUrl]);


  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
          <div>
            <div className="text-xs uppercase tracking-wider text-[var(--v3-orange-600,#C97A14)] font-semibold">
              Abonnement V3
            </div>
            <div className="v3-serif text-xl font-bold text-[var(--v3-ink,#2A2118)]">
              {planName}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-black/5 transition"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {!ready ? (
            <form
              className="max-w-md mx-auto py-8 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (email.includes('@')) setReady(true);
              }}
            >
              <label className="block text-sm font-medium text-[var(--v3-ink)]">
                Votre email
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 focus:border-[var(--v3-orange,#E8951E)] focus:outline-none"
                />
              </label>
              <button type="submit" className="v3-btn v3-btn-primary w-full justify-center">
                Continuer
              </button>
              <p className="text-xs text-center text-[var(--v3-muted,#6B6257)]">
                Sans engagement — résiliable à tout moment.
              </p>
            </form>
          ) : error ? (
            <div className="text-center py-10 text-red-600">{error}</div>
          ) : (
            <EmbeddedCheckoutProvider
              stripe={getStripe()}
              options={{ fetchClientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}
        </div>
      </div>
    </div>
  );
}
