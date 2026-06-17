import React, { useState, useCallback } from 'react';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { X, Loader2, Gift } from 'lucide-react';
import { getStripe, getStripeEnvironment } from '@/lib/stripe';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { V3_PRICE, V3_GIFT_PRICE, V3_GIFT_DISCOUNT } from '@/data/roadmapV3';

const AMBER = '#E8951E';
const AMBER_DEEP = '#C97A14';
const INK = '#2A2118';

/** Modale d'achat d'une carte cadeau Noël (Base à -20%). */
const V3GiftCheckout: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [buyerEmail, setBuyerEmail] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const reset = useCallback(() => {
    setClientSecret(null);
    setLoading(false);
    setBuyerEmail('');
    setRecipientEmail('');
  }, []);

  const handleClose = () => { reset(); onClose(); };

  const startPayment = async () => {
    const b = buyerEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b)) {
      toast.error('Merci de saisir votre email.');
      return;
    }
    const r = recipientEmail.trim().toLowerCase();
    if (r && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r)) {
      toast.error('Email du bénéficiaire invalide.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('v3-gift-checkout', {
        body: {
          buyerEmail: b,
          recipientEmail: r || undefined,
          environment: getStripeEnvironment(),
          returnUrl: `${window.location.origin}/carte-cadeau-merci?session_id={CHECKOUT_SESSION_ID}`,
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

  if (!open) return null;

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
            <div className="flex items-center gap-2 mb-1">
              <Gift className="h-5 w-5" style={{ color: AMBER }} />
              <h3 className="text-xl font-black" style={{ color: AMBER_DEEP }}>Carte Cadeau Noël</h3>
            </div>
            <p className="text-sm mb-4" style={{ color: '#6f5e47' }}>
              Offrez le générateur de livres (Base — création & publication, accès à vie). Le bénéficiaire
              reçoit un code unique à activer sur son compte.
            </p>
            <div className="flex items-end gap-2 mb-1">
              <span className="text-lg line-through" style={{ color: '#bcaa8c' }}>{V3_PRICE}€</span>
              <span className="text-3xl font-black" style={{ color: AMBER_DEEP }}>{V3_GIFT_PRICE}€</span>
            </div>
            <p className="text-xs font-bold mb-5" style={{ color: '#1f9d6b' }}>
              −{Math.round(V3_GIFT_DISCOUNT * 100)}% offre de Noël
            </p>

            <label className="block text-xs font-semibold mb-1" style={{ color: '#6f5e47' }}>Votre email (acheteur)</label>
            <input
              type="email"
              value={buyerEmail}
              onChange={(ev) => setBuyerEmail(ev.target.value)}
              placeholder="vous@email.com"
              className="w-full rounded-xl border px-4 py-3 text-sm mb-4 focus:outline-none"
              style={{ borderColor: `${AMBER}55`, color: INK }}
            />

            <label className="block text-xs font-semibold mb-1" style={{ color: '#6f5e47' }}>
              Email du bénéficiaire <span style={{ color: '#a18a6c' }}>(optionnel — on lui enverra le code)</span>
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(ev) => setRecipientEmail(ev.target.value)}
              placeholder="proche@email.com"
              className="w-full rounded-xl border px-4 py-3 text-sm mb-5 focus:outline-none"
              style={{ borderColor: `${AMBER}55`, color: INK }}
            />

            <button
              onClick={startPayment}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: `linear-gradient(90deg, ${AMBER}, #FFB44D)`, color: '#fff' }}
            >
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Préparation…</> : `Offrir — ${V3_GIFT_PRICE}€`}
            </button>
            <p className="text-center text-[10px] mt-3" style={{ color: '#a18a6c' }}>
              Paiement sécurisé. La carte ne débloque que la Base (les packs premium restent séparés).
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

export default V3GiftCheckout;
