import React, { useState, useCallback } from 'react';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { X, Loader2 } from 'lucide-react';
import { getStripe, getStripeEnvironment } from '@/lib/stripe';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { V3UpsellPack } from '@/data/roadmapV3';

const AMBER = '#E8951E';
const AMBER_DEEP = '#C97A14';
const AMBER_SOFT = '#FFF3DF';
const INK = '#2A2118';

/** Modale d'achat d'un pack premium à la carte (paiement unique, checkout embarqué). */
const V3UpsellCheckout: React.FC<{ pack: V3UpsellPack | null; onClose: () => void }> = ({ pack, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const reset = useCallback(() => {
    setClientSecret(null);
    setLoading(false);
    setEmail('');
  }, []);

  const handleClose = () => { reset(); onClose(); };

  const startPayment = async () => {
    if (!pack) return;
    const e = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      toast.error('Merci de saisir un email valide.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('v3-upsell-checkout', {
        body: {
          packId: pack.id,
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
    } finally {
      setLoading(false);
    }
  };

  if (!pack) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={handleClose}>
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border p-6 bg-white"
        style={{ borderColor: `${AMBER}55` }}
        onClick={(ev) => ev.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute right-4 top-4 text-black/40 hover:text-black">
          <X className="h-5 w-5" />
        </button>

        {!clientSecret ? (
          <>
            <h3 className="text-xl font-black mb-1" style={{ color: AMBER_DEEP }}>{pack.title}</h3>
            <p className="text-sm mb-4" style={{ color: '#6f5e47' }}>{pack.desc}</p>
            <div className="flex items-end gap-2 mb-5">
              <span className="text-3xl font-black" style={{ color: AMBER_DEEP }}>{pack.price}€</span>
              <span className="text-sm pb-1" style={{ color: '#a18a6c' }}>paiement unique · accès à vie</span>
            </div>

            <label className="block text-xs font-semibold mb-1" style={{ color: '#6f5e47' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              placeholder="ton@email.com"
              className="w-full rounded-xl border px-4 py-3 text-sm mb-5 focus:outline-none"
              style={{ borderColor: `${AMBER}55`, color: INK }}
            />

            <button
              onClick={startPayment}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: `linear-gradient(90deg, ${AMBER}, #FFB44D)`, color: '#fff' }}
            >
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Préparation…</> : `Acheter — ${pack.price}€`}
            </button>
            <p className="text-center text-[10px] mt-3" style={{ color: '#a18a6c' }}>
              Paiement sécurisé.
            </p>
          </>
        ) : (
          <EmbeddedCheckoutProvider stripe={getStripe()} options={{ clientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        )}
      </div>
    </div>
  );
};

export default V3UpsellCheckout;
