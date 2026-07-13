import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import FunnelLayout from '@/components/funnel/FunnelLayout';
import SeoHead from '@/components/funnel/SeoHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useReferralTracking, getStoredRefCode } from '@/hooks/useReferralTracking';
import { toast } from 'sonner';
import { Loader2, Check, Lock, ShieldCheck, CreditCard, Zap } from 'lucide-react';
import { PromoStripeCheckout } from '@/components/promo/PromoStripeCheckout';


const schema = z.object({
  first_name: z.string().trim().max(80).optional(),
  email: z.string().trim().email('Email invalide').max(255),
  payment_method: z.enum(['stripe', 'paypal']),
});

const PRODUCT = { key: 'main', label: 'Ebookstudio Pro V2 - Accès à vie', amount: 59 };

const PromoCommandePage = () => {
  useReferralTracking();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [method, setMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [loading, setLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [bonuses, setBonuses] = useState<Array<{ key: string; title: string; amount: number }>>([]);

  useEffect(() => {
    try {
      const e = localStorage.getItem('ebs_lead_email');
      const f = localStorage.getItem('ebs_lead_first_name');
      if (e) setEmail(e);
      if (f) setFirstName(f);
      const b = localStorage.getItem('ebs_selected_bonuses');
      if (b) setBonuses(JSON.parse(b));
    } catch { /* ignore */ }
  }, []);

  const removeBonus = (key: string) => {
    const next = bonuses.filter((b) => b.key !== key);
    setBonuses(next);
    try { localStorage.setItem('ebs_selected_bonuses', JSON.stringify(next)); } catch {}
  };

  const bonusTotal = bonuses.reduce((s, b) => s + b.amount, 0);
  const totalAmount = PRODUCT.amount + bonusTotal;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ first_name: firstName, email, payment_method: method });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    try { localStorage.setItem('ebs_lead_email', parsed.data.email); } catch {}

    if (parsed.data.payment_method === 'stripe') {
      // Show inline embedded checkout
      setShowCheckout(true);
      return;
    }

    // PayPal flow → go through funnel-create-order, then to /promo/paiement
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('funnel-create-order', {
        body: {
          email: parsed.data.email,
          first_name: parsed.data.first_name,
          product_key: PRODUCT.key,
          amount: totalAmount,
          bonuses,
          payment_method: 'paypal',
          ref_code: getStoredRefCode(),
        },
      });
      if (error) throw error;
      toast.success('Commande enregistrée !');
      navigate(`/promo/paiement?email=${encodeURIComponent(parsed.data.email)}`);
    } catch (err) {
      console.error(err);
      toast.error('Erreur. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  const returnUrl = `${window.location.origin}/promo/merci?session_id={CHECKOUT_SESSION_ID}`;

  return (
    <FunnelLayout>
      <SeoHead
        title="Commande - Ebookstudio Pro V2"
        description="Finalisez votre commande Ebookstudio Pro V2. Paiement carte sécurisé ou PayPal."
        canonical="/promo/commande"
        noindex
      />
      
      <section className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Votre commande</h1>
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">{PRODUCT.label}</p>
                <p className="text-sm text-gray-500">Accès 12 mois - Renouvellement manuel</p>
              </div>
              <p className="font-bold text-xl">{PRODUCT.amount}€</p>
            </div>
            {bonuses.map((b) => (
              <div key={b.key} className="flex justify-between items-start pt-2 border-t border-dashed border-gray-200">
                <div className="flex-1">
                  <p className="font-semibold text-sm flex items-center gap-2">
                    <span className="text-[#FF9E2D]">+</span> {b.title}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeBonus(b.key)}
                    className="text-xs text-gray-400 hover:text-red-500 underline mt-1"
                  >
                    Retirer
                  </button>
                </div>
                <p className="font-bold text-sm">{b.amount}€</p>
              </div>
            ))}
            <hr />
            <div className="flex justify-between text-lg font-bold">
              <span>Total TTC</span>
              <span className="text-[#008296]">{totalAmount}€</span>
            </div>
          </div>

          <div className="bg-[#008296]/5 rounded-xl p-6 space-y-3">
            <h3 className="font-bold flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-[#008296]" /> Inclus dans votre abonnement</h3>
            <ul className="space-y-2 text-sm">
              {['Ebooks illimités', 'Couvertures illimitées', 'Audiobook + BD', 'Licence commerciale', 'Formation + Forum', 'Garantie 7 jours'].map((x) => (
                <li key={x} className="flex gap-2"><Check className="w-4 h-4 text-[#008296] mt-0.5" /> {x}</li>
              ))}
            </ul>
          </div>
        </div>

        {showCheckout && method === 'stripe' ? (
          <div className="bg-white border border-gray-200 rounded-xl p-4 h-fit space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2"><CreditCard className="w-5 h-5" /> Paiement carte</h2>
              <button type="button" onClick={() => setShowCheckout(false)} className="text-sm text-gray-500 hover:underline">← Modifier</button>
            </div>
            <PromoStripeCheckout
              email={email.trim().toLowerCase()}
              firstName={firstName}
              refCode={getStoredRefCode()}
              returnUrl={returnUrl}
              bonuses={bonuses}
            />
          </div>
        ) : (
          <form onSubmit={submit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5 h-fit">
            <h2 className="text-xl font-bold flex items-center gap-2"><Lock className="w-5 h-5" /> Paiement sécurisé</h2>

            <div className="space-y-2">
              <Label htmlFor="firstname">Prénom</Label>
              <Input id="firstname" value={firstName} onChange={(e) => setFirstName(e.target.value)} maxLength={80} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} />
            </div>

            <div className="space-y-2">
              <Label>Mode de paiement</Label>
              <div className="space-y-2">
                {[
                  { v: 'stripe' as const, l: 'Carte bancaire', sub: 'Accès immédiat - Visa, Mastercard, Amex', icon: <Zap className="w-4 h-4" /> },
                  { v: 'paypal' as const, l: 'PayPal', sub: 'Accès activé sous 1h ouvrée', icon: null },
                ].map((opt) => (
                  <button
                    type="button"
                    key={opt.v}
                    onClick={() => setMethod(opt.v)}
                    className={`w-full text-left border rounded-lg p-3 flex items-start gap-3 transition ${
                      method === opt.v ? 'border-[#008296] bg-[#008296]/5' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className={`mt-1 w-4 h-4 rounded-full border-2 flex-shrink-0 ${method === opt.v ? 'border-[#008296] bg-[#008296]' : 'border-gray-300'}`} />
                    <span className="flex-1">
                      <span className="font-medium flex items-center gap-1.5">{opt.l} {opt.icon}</span>
                      <span className="block text-xs text-gray-500">{opt.sub}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-[#FF9E2D] hover:bg-[#e88f1f] text-white font-bold py-6 text-base">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `🔒 Confirmer - ${totalAmount}€`}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              En cliquant, vous acceptez les CGV.
            </p>
          </form>
        )}
      </section>
    </FunnelLayout>
  );
};

export default PromoCommandePage;
