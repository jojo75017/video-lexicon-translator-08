import React, { useState, useCallback } from 'react';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { X, Loader2, Check } from 'lucide-react';
import { getStripe, getStripeEnvironment } from '@/lib/stripe';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const GOLD = '#c9a84c';
const GOLD_LIGHT = '#f0d78c';

type PlanId = 'full_1x' | 'full_3x' | 'full_4x' | 'base_1x' | 'base_3x';
type Product = 'full' | 'base';

const PLANS_BY_PRODUCT: Record<Product, { title: string; options: { id: PlanId; label: string; sub: string }[] }> = {
  full: {
    title: 'Pack Pro Vendeur V3',
    options: [
      { id: 'full_1x', label: '1 × 547€', sub: 'Paiement unique · le plus économique' },
      { id: 'full_3x', label: '3 × 189€', sub: 'Échéancier mensuel (357€)' },
      { id: 'full_4x', label: '4 × 144€', sub: 'Petit budget (356€)' },
    ],
  },
  base: {
    title: 'Base — Création & Publication',
    options: [
      { id: 'base_1x', label: '1 × 197€', sub: 'Paiement unique · le plus économique' },
      { id: 'base_3x', label: '3 × 69€', sub: 'Échéancier mensuel (207€)' },
    ],
  },
};

/** Modale de paiement V3 (Pack Tout Complet ou Base) avec choix des mensualités + checkout embarqué. */
const V3PackCheckout: React.FC<{ open: boolean; onClose: () => void; product?: Product }> = ({ open, onClose, product = 'full' }) => {
  const config = PLANS_BY_PRODUCT[product];
  const [step, setStep] = useState<'form' | 'pay'>('form');
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState<PlanId>(config.options[0].id);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  React.useEffect(() => { setPlan(config.options[0].id); }, [product]);

  const reset = useCallback(() => {
    setStep('form'); setClientSecret(null); setLoading(false);
  }, []);

  const handleClose = () => { reset(); onClose(); };

  const startPayment = async () => {
    const e = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      toast.error('Merci de saisir un email valide.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('v3-pack-checkout', {
        body: {
          plan,
          email: e,
          environment: getStripeEnvironment(),
          returnUrl: `${window.location.origin}/paiement-succes?session_id={CHECKOUT_SESSION_ID}`,
        },
      });
      if (error) throw new Error(error.message);
      const secret = (data as { clientSecret?: string })?.clientSecret;
      if (!secret) throw new Error('Session de paiement indisponible.');
      setClientSecret(secret);
      setStep('pay');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Paiement impossible.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={handleClose}>
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border p-6"
        style={{ background: '#161616', borderColor: `${GOLD}55` }}
        onClick={(ev) => ev.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute right-4 top-4 text-white/50 hover:text-white">
          <X className="h-5 w-5" />
        </button>

        {step === 'form' ? (
          <>
            <h3 className="text-xl font-black mb-1" style={{ color: GOLD_LIGHT }}>{config.title}</h3>
            <p className="text-white/55 text-sm mb-5">Choisis ta facilité de paiement.</p>

            <label className="block text-xs font-semibold text-white/60 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              placeholder="ton@email.com"
              className="w-full rounded-xl bg-[#1a1a1a] border border-[#c9a84c33] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#c9a84c] mb-5"
            />

            <div className="space-y-2 mb-6">
              {config.options.map((opt) => {
                const active = plan === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setPlan(opt.id)}
                    className="w-full flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all"
                    style={{
                      borderColor: active ? GOLD : '#ffffff1a',
                      background: active ? `${GOLD}1a` : 'transparent',
                    }}
                  >
                    <span>
                      <span className="block text-sm font-bold text-white">{opt.label}</span>
                      <span className="block text-[11px] text-white/50">{opt.sub}</span>
                    </span>
                    {active && <Check className="h-4 w-4" style={{ color: GOLD }} />}
                  </button>
                );
              })}
            </div>

            <button
              onClick={startPayment}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`, color: '#1a1a1a' }}
            >
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Préparation…</> : 'Procéder au paiement'}
            </button>
            <p className="text-center text-[10px] text-white/35 mt-3">
              Paiement sécurisé. Pour l'échéancier, l'accès s'ouvre dès la 1re mensualité.
            </p>
          </>
        ) : clientSecret ? (
          <EmbeddedCheckoutProvider stripe={getStripe()} options={{ clientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        ) : null}
      </div>
    </div>
  );
};

export default V3PackCheckout;
