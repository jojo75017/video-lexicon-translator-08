import React, { useState, useCallback } from 'react';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { Check, Sparkles, Loader2, Gift, Image as ImageIcon, FileText, Clock } from 'lucide-react';
import { getStripe, getStripeEnvironment } from '@/lib/stripe';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import BackButton from '@/components/v3/BackButton';

const AMBER = '#E8951E';
const AMBER_DEEP = '#C97A14';
const INK = '#2A2118';

/**
 * Upsell 17€ — Pack Boost de Lancement.
 * Affiché après inscription / création de premier livre, et accessible
 * depuis les bandeaux "Passer en PRO" des modules Standard.
 */
const V3Upsell17Page: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const startPayment = useCallback(async () => {
    const e = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      toast.error('Merci de saisir un email valide.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('v3-upsell-checkout', {
        body: {
          packId: 'boost_lancement',
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
  }, [email]);

  const bullets = [
    { icon: ImageIcon, text: '10 visuels Pinterest prêts à poster (formats optimisés)' },
    { icon: Sparkles, text: '5 posts Instagram générés par IA — légendes + hashtags' },
    { icon: FileText, text: 'Checklist ISBN & KDP premium (dépôt, catégories, mots-clés)' },
    { icon: Gift, text: 'Template métadonnées optimisées (titre, sous-titre, description)' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAFA', color: INK }}>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <BackButton />

        {/* Header */}
        <div className="mb-6 rounded-2xl p-6 text-center" style={{ background: `linear-gradient(135deg, ${AMBER}22, #FFF3DF)` }}>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold" style={{ color: AMBER_DEEP }}>
            <Clock className="h-3.5 w-3.5" /> Offre découverte réservée aux nouveaux inscrits
          </div>
          <h1 className="mt-3 text-3xl md:text-4xl font-black" style={{ color: AMBER_DEEP }}>
            Pack Boost de Lancement — 17 €
          </h1>
          <p className="mt-2 text-sm md:text-base" style={{ color: '#6f5e47' }}>
            Le kit minimal pour lancer ton livre avec un vrai coup d'accélérateur.
            Une seule fois, accès à vie.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Left : contenu du pack */}
          <div className="rounded-2xl border bg-white p-6" style={{ borderColor: `${AMBER}33` }}>
            <h2 className="mb-4 text-lg font-bold" style={{ color: INK }}>Ce que tu reçois</h2>
            <ul className="space-y-3">
              {bullets.map(({ icon: Icon, text }, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${AMBER}22`, color: AMBER_DEEP }}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-xl border p-4 text-xs" style={{ borderColor: `${AMBER}33`, backgroundColor: '#FFF9EF', color: '#6f5e47' }}>
              <div className="flex items-center gap-2 font-semibold" style={{ color: AMBER_DEEP }}>
                <Check className="h-4 w-4" /> Sans engagement
              </div>
              <p className="mt-1">Paiement unique de 17 € — pas d'abonnement, accès à vie à ton pack via ton compte.</p>
            </div>
          </div>

          {/* Right : paiement */}
          <div className="rounded-2xl border bg-white p-6" style={{ borderColor: `${AMBER}55` }}>
            {!clientSecret ? (
              <>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black" style={{ color: AMBER_DEEP }}>17€</span>
                  <span className="pb-1 text-sm" style={{ color: '#a18a6c' }}>paiement unique</span>
                </div>
                <p className="mt-1 text-xs" style={{ color: '#a18a6c' }}>Valeur estimée : 97 € · Économies : 80 €</p>

                <label className="mt-5 block text-xs font-semibold" style={{ color: '#6f5e47' }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  placeholder="ton@email.com"
                  className="mt-1 w-full rounded-xl border px-4 py-3 text-sm focus:outline-none"
                  style={{ borderColor: `${AMBER}55`, color: INK }}
                />

                <button
                  onClick={startPayment}
                  disabled={loading}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                  style={{ background: `linear-gradient(90deg, ${AMBER}, #FFB44D)`, color: '#fff' }}
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Préparation…</>
                  ) : (
                    <>Débloquer mon Pack Boost — 17 €</>
                  )}
                </button>

                <p className="mt-3 text-center text-[11px]" style={{ color: '#a18a6c' }}>
                  Paiement sécurisé · Carte, Apple Pay, Google Pay & PayPal acceptés
                </p>
              </>
            ) : (
              <EmbeddedCheckoutProvider stripe={getStripe()} options={{ clientSecret }}>
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default V3Upsell17Page;
