import React, { useState } from 'react';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { X, Loader2, Search, Lock, Crown } from 'lucide-react';
import { getStripe, getStripeEnvironment } from '@/lib/stripe';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Modal d'upsell du Générateur de Coloriages Cherche & Trouve.
 * Deux portes d'entrée : achat one-shot 27 € OU passage au plan Pro (inclus).
 */
const V3ChercheTrouveUpsell: React.FC<{ defaultEmail?: string; onClose: () => void }> = ({
  defaultEmail = '',
  onClose,
}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const startPayment = async () => {
    const e = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      toast.error('Merci de saisir un email valide.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('v3-upsell-checkout', {
        body: {
          packId: 'cherche_trouve',
          email: e,
          environment: getStripeEnvironment(),
          returnUrl: `${window.location.origin}/v3/livres/cherche-trouve?paiement=ok&session_id={CHECKOUT_SESSION_ID}`,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border bg-white p-6"
        style={{ borderColor: 'var(--v3-gold, #c9a84c)' }}
        onClick={(ev) => ev.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Débloquez le Générateur de Coloriages Cherche & Trouve"
      >
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-4 top-4 text-black/40 hover:text-black"
        >
          <X className="h-5 w-5" />
        </button>

        {!clientSecret ? (
          <>
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: 'var(--v3-gold-soft, rgba(201,168,76,0.15))' }}
            >
              <Search className="h-7 w-7" style={{ color: 'var(--v3-emerald, #064e3b)' }} />
            </div>

            <h3
              className="text-xl font-black text-center mb-2"
              style={{ color: 'var(--v3-emerald, #064e3b)' }}
            >
              Débloquez le Générateur de Coloriages Cherche &amp; Trouve
            </h3>
            <p className="text-sm text-center mb-5" style={{ color: 'var(--v3-muted, #6b7280)' }}>
              Concepts de scènes, listes d'objets cachés et prompts IA parfaits pour créer des
              livres de coloriage Cherche &amp; Trouve prêts pour Amazon KDP.
            </p>

            <div
              className="rounded-xl border p-4 mb-3"
              style={{ borderColor: 'rgba(201,168,76,0.4)', background: 'rgba(201,168,76,0.06)' }}
            >
              <div className="flex items-end justify-center gap-2 mb-1">
                <span className="text-3xl font-black" style={{ color: 'var(--v3-emerald, #064e3b)' }}>
                  27 €
                </span>
                <span className="text-xs pb-1.5" style={{ color: 'var(--v3-muted, #6b7280)' }}>
                  paiement unique · accès à vie
                </span>
              </div>
              <p className="text-center text-xs" style={{ color: 'var(--v3-muted, #6b7280)' }}>
                Offert et inclus directement pour les abonnés au plan Pro.
              </p>
            </div>

            <label
              htmlFor="cherche-trouve-upsell-email"
              className="block text-xs font-semibold mb-1"
              style={{ color: 'var(--v3-muted, #6b7280)' }}
            >
              Email
            </label>
            <input
              id="cherche-trouve-upsell-email"
              type="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              placeholder="votre@email.com"
              className="w-full rounded-xl border px-4 py-3 text-sm mb-4 focus:outline-none"
              style={{ borderColor: 'rgba(201,168,76,0.4)' }}
            />

            <button
              onClick={startPayment}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: 'linear-gradient(90deg, var(--v3-emerald, #064e3b), #0d7a5f)' }}
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Préparation…</>
              ) : (
                <><Lock className="h-4 w-4" /> Débloquer pour 27 €</>
              )}
            </button>

            <button
              onClick={() => navigate('/v3/forfaits')}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3 text-sm font-bold transition-colors hover:bg-black/[0.03]"
              style={{ borderColor: 'var(--v3-gold, #c9a84c)', color: 'var(--v3-emerald, #064e3b)' }}
            >
              <Crown className="h-4 w-4" /> Passer au plan Pro — module inclus
            </button>

            <p className="text-center text-[10px] mt-3" style={{ color: 'var(--v3-muted, #6b7280)' }}>
              Paiement sécurisé. Accès immédiat après validation.
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

export default V3ChercheTrouveUpsell;
