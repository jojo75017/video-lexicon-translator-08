import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import FunnelLayout from '@/components/funnel/FunnelLayout';
import SeoHead from '@/components/funnel/SeoHead';
import { Button } from '@/components/ui/button';
import { useReferralTracking, getStoredRefCode } from '@/hooks/useReferralTracking';
import { toast } from 'sonner';
import { Check, Sparkles, Crown, Loader2 } from 'lucide-react';

const UPSELLS = [
  {
    key: 'license_extended',
    icon: Crown,
    title: 'Licence commerciale étendue',
    price: 47,
    desc: 'Vendez vos ebooks sous votre marque blanche, créez votre propre catalogue éditorial, redistribuez vos productions sans limite.',
    benefits: [
      'Marque blanche illimitée',
      'Droits de revente complets',
      'Pas de mention EbookStudio',
      'Idéal pour agences & studios',
    ],
  },
  {
    key: 'templates_premium',
    icon: Sparkles,
    title: 'Pack 50 templates premium',
    price: 25,
    badge: '🎁 + Cadeau : Guide 10 niches inclus',
    desc: '50 plans d\'ebooks best-sellers prêts à utiliser : développement personnel, business, fiction, jeunesse, parascolaire, cuisine… + le guide PDF "10 niches KDP rentables 2026" offert.',
    benefits: [
      '🎁 BONUS offert : Guide PDF "10 niches KDP rentables 2026"',
      '50 plans complets KDP-ready',
      'Mots-clés Amazon optimisés',
      'Couvertures concept incluses',
      'Mises à jour à vie',
    ],
  },
];

const PromoBonusPage = () => {
  useReferralTracking();
  const navigate = useNavigate();
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const buyUpsell = async (key: string, amount: number) => {
    setLoadingKey(key);
    try {
      const email = localStorage.getItem('ebs_lead_email');
      if (!email) {
        toast.error('Email manquant. Recommencez la commande.');
        navigate('/promo/commande');
        return;
      }
      const { error } = await supabase.functions.invoke('funnel-create-order', {
        body: {
          email,
          first_name: localStorage.getItem('ebs_lead_first_name') || undefined,
          product_key: key,
          amount,
          payment_method: 'paypal',
          ref_code: getStoredRefCode(),
        },
      });
      if (error) throw error;
      toast.success('Bonus ajouté à votre commande !');
      navigate('/promo/espace');
    } catch (err) {
      console.error(err);
      toast.error('Erreur. Réessayez.');
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <FunnelLayout>
      <SeoHead
        title="Boostez votre commande - Bonus EbookStudio"
        description="Ajoutez la licence commerciale étendue ou le pack 50 templates premium à votre commande."
        canonical="/promo/bonus"
        noindex
      />
      <section className="max-w-5xl mx-auto px-4 py-12 space-y-10">
        <div className="text-center space-y-4">
          <span className="inline-block bg-[#FF9E2D]/10 text-[#FF9E2D] px-3 py-1 rounded-full text-sm font-semibold">
            🎁 Offre exclusive - Disponible uniquement maintenant
          </span>
          <h1 className="text-3xl md:text-4xl font-bold">Une dernière chose avant de finaliser…</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Ajoutez à votre commande l'un de ces bonus à prix préférentiel. Vous ne reverrez plus jamais cette offre.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {UPSELLS.map((u) => (
            <div key={u.key} className="bg-white border-2 border-gray-200 hover:border-[#008296] transition rounded-2xl p-6 space-y-4 relative">
              {(u as any).badge && (
                <span className="absolute -top-3 left-4 bg-[#FF9E2D] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                  {(u as any).badge}
                </span>
              )}
              <u.icon className="w-10 h-10 text-[#008296]" />
              <h2 className="text-xl font-bold">{u.title}</h2>
              <p className="text-gray-700">{u.desc}</p>
              <ul className="space-y-2">
                {u.benefits.map((b) => (
                  <li key={b} className="flex gap-2 text-sm"><Check className="w-4 h-4 text-[#008296] mt-0.5" /> {b}</li>
                ))}
              </ul>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-3xl font-bold text-[#008296] mb-3">{u.price}€ <span className="text-sm text-gray-500 font-normal">paiement unique</span></p>
                <Button
                  onClick={() => buyUpsell(u.key, u.price)}
                  disabled={loadingKey !== null}
                  className="w-full bg-[#FF9E2D] hover:bg-[#e88f1f] text-white font-bold py-5"
                >
                  {loadingKey === u.key ? <Loader2 className="w-5 h-5 animate-spin" /> : `Ajouter - ${u.price}€`}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-6">
          <Link to="/promo/espace" className="text-gray-500 hover:text-[#008296] underline text-sm">
            Non merci, accéder à mon espace membre
          </Link>
        </div>
      </section>
    </FunnelLayout>
  );
};

export default PromoBonusPage;
