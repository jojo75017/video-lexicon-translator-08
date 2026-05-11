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
import { Loader2, Check, Lock, ShieldCheck } from 'lucide-react';

const schema = z.object({
  first_name: z.string().trim().max(80).optional(),
  email: z.string().trim().email('Email invalide').max(255),
  payment_method: z.enum(['paypal', 'virement']),
});

const PRODUCT = { key: 'main_yearly', label: 'EbookStudio — Abonnement annuel', amount: 67 };

const PromoCommandePage = () => {
  useReferralTracking();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [method, setMethod] = useState<'paypal' | 'virement'>('paypal');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const e = localStorage.getItem('ebs_lead_email');
      const f = localStorage.getItem('ebs_lead_first_name');
      if (e) setEmail(e);
      if (f) setFirstName(f);
    } catch { /* ignore */ }
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ first_name: firstName, email, payment_method: method });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('funnel-create-order', {
        body: {
          email: parsed.data.email,
          first_name: parsed.data.first_name,
          product_key: PRODUCT.key,
          amount: PRODUCT.amount,
          payment_method: parsed.data.payment_method,
          ref_code: getStoredRefCode(),
        },
      });
      if (error) throw error;
      toast.success('Commande enregistrée !');
      navigate('/promo/bonus');
    } catch (err) {
      console.error(err);
      toast.error('Erreur. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FunnelLayout>
      <SeoHead
        title="Commande — EbookStudio"
        description="Finalisez votre commande EbookStudio. Paiement sécurisé PayPal ou virement."
        canonical="/promo/commande"
        noindex
      />
      <section className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8">
        {/* SUMMARY */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Votre commande</h1>
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">{PRODUCT.label}</p>
                <p className="text-sm text-gray-500">Accès 12 mois — Renouvellement manuel</p>
              </div>
              <p className="font-bold text-xl">{PRODUCT.amount}€</p>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-bold">
              <span>Total TTC</span>
              <span className="text-[#008296]">{PRODUCT.amount}€</span>
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

        {/* FORM */}
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
                { v: 'paypal', l: 'PayPal — Validation immédiate' },
                { v: 'virement', l: 'Virement bancaire — Validation 24h' },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.v}
                  onClick={() => setMethod(opt.v as 'paypal' | 'virement')}
                  className={`w-full text-left border rounded-lg p-3 flex items-center gap-3 transition ${
                    method === opt.v ? 'border-[#008296] bg-[#008296]/5' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full border-2 ${method === opt.v ? 'border-[#008296] bg-[#008296]' : 'border-gray-300'}`} />
                  <span>{opt.l}</span>
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-[#FF9E2D] hover:bg-[#e88f1f] text-white font-bold py-6 text-base">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `🔒 Confirmer — ${PRODUCT.amount}€`}
          </Button>
          <p className="text-xs text-gray-500 text-center">
            En cliquant, vous acceptez les CGV. Vous serez redirigé vers les instructions de paiement.
          </p>
        </form>
      </section>
    </FunnelLayout>
  );
};

export default PromoCommandePage;
