import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import FunnelLayout from '@/components/funnel/FunnelLayout';
import SeoHead from '@/components/funnel/SeoHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, Copy, Check, TrendingUp, Users, Euro, Share2 } from 'lucide-react';

const COMMISSION_RATE = 0.30;
const PRICE = 67;

const PromoAffiliePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ clicks: 0, referrals: 0, paid: 0, earnings: 0 });
  const [calcSales, setCalcSales] = useState(10);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }
      setUser(session.user);

      // get or create code
      const { data: existing } = await supabase
        .from('referral_codes')
        .select('code')
        .eq('user_id', session.user.id)
        .maybeSingle();

      let myCode = existing?.code;
      if (!myCode) {
        const newCode = (session.user.email?.split('@')[0] || 'aff').replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase()
          + Math.floor(Math.random() * 1000);
        const { data: ins } = await supabase
          .from('referral_codes')
          .insert({ user_id: session.user.id, code: newCode })
          .select('code')
          .single();
        myCode = ins?.code;
      }
      setCode(myCode || null);

      if (myCode) {
        const [{ count: clicks }, { data: refs }] = await Promise.all([
          supabase.from('affiliate_clicks').select('id', { count: 'exact', head: true }).eq('ref_code', myCode),
          supabase.from('referrals').select('status, commission_amount').eq('referrer_id', session.user.id),
        ]);
        const referrals = refs?.length || 0;
        const paid = refs?.filter(r => r.status === 'paid' || r.status === 'converted').length || 0;
        const earnings = (refs || []).reduce((s, r) => s + Number(r.commission_amount || 0), 0);
        setStats({ clicks: clicks || 0, referrals, paid, earnings });
      }
      setLoading(false);
    })();
  }, []);

  const link = useMemo(() => code ? `https://ebookstudio.fr/promo?ref=${code}` : '', [code]);
  const monthlyEarnings = Math.round(calcSales * PRICE * COMMISSION_RATE);

  const copy = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Lien copié !');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <FunnelLayout>
      <SeoHead
        title="Programme d'affiliation EbookStudio — 30% de commission"
        description="Gagnez 30% de commission récurrente en recommandant EbookStudio. Inscription gratuite, paiement mensuel."
        canonical="/promo/affilie"
      />

      {/* HERO */}
      <section className="bg-gradient-to-b from-[#008296]/10 to-transparent">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
          <span className="inline-block bg-[#FF9E2D]/10 text-[#FF9E2D] px-3 py-1 rounded-full text-sm font-semibold">
            💰 Programme d'affiliation
          </span>
          <h1 className="text-4xl md:text-5xl font-bold">
            Gagnez <span className="text-[#008296]">30%</span> sur chaque vente
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Recommandez EbookStudio à votre audience et touchez 20,10€ par abonnement vendu. Cookie 30 jours, paiement mensuel via PayPal.
          </p>
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white border-2 border-[#008296] rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2"><TrendingUp className="w-6 h-6 text-[#008296]" /> Simulez vos revenus</h2>
          <div>
            <label className="text-sm text-gray-600 mb-2 block">Ventes par mois : <strong>{calcSales}</strong></label>
            <input
              type="range"
              min={1}
              max={100}
              value={calcSales}
              onChange={(e) => setCalcSales(Number(e.target.value))}
              className="w-full accent-[#008296]"
            />
          </div>
          <div className="text-center bg-[#008296]/5 rounded-xl p-6">
            <p className="text-sm text-gray-600">Vos revenus mensuels</p>
            <p className="text-5xl font-bold text-[#008296] my-2">{monthlyEarnings}€</p>
            <p className="text-sm text-gray-500">Soit {monthlyEarnings * 12}€ par an</p>
          </div>
        </div>
      </section>

      {/* DASHBOARD or CTA */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#008296]" /></div>
      ) : !user ? (
        <section className="max-w-3xl mx-auto px-4 py-12 text-center bg-white border border-gray-200 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Devenez affilié en 30 secondes</h2>
          <p className="text-gray-700 mb-6">Créez votre compte gratuit pour récupérer votre lien d'affiliation unique.</p>
          <Button
            onClick={() => navigate('/auth?redirect=/promo/affilie')}
            className="bg-[#FF9E2D] hover:bg-[#e88f1f] text-white font-bold py-6 px-8"
          >
            Créer mon compte affilié
          </Button>
        </section>
      ) : (
        <>
          {/* LINK */}
          <section className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2"><Share2 className="w-5 h-5" /> Votre lien d'affiliation</h2>
              <div className="flex gap-2">
                <Input value={link} readOnly className="font-mono text-sm" />
                <Button onClick={copy} className="bg-[#008296] hover:bg-[#006d7e] text-white">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-500">Cookie 30 jours · Paiement PayPal · Code : <strong>{code}</strong></p>
            </div>
          </section>

          {/* STATS */}
          <section className="max-w-4xl mx-auto px-4 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Users, label: 'Clics', value: stats.clicks },
                { icon: Users, label: 'Inscrits', value: stats.referrals },
                { icon: Check, label: 'Conversions', value: stats.paid },
                { icon: Euro, label: 'Gains', value: `${stats.earnings.toFixed(2)}€` },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                  <s.icon className="w-6 h-6 text-[#008296] mx-auto mb-2" />
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* HOW IT WORKS */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { n: '1', t: 'Récupérez votre lien', d: 'Créez votre compte et copiez votre lien d\'affiliation unique.' },
            { n: '2', t: 'Partagez', d: 'Sur votre blog, vos réseaux sociaux, votre newsletter, votre chaîne YouTube.' },
            { n: '3', t: 'Touchez 30%', d: 'Chaque vente vous rapporte 20,10€. Paiement mensuel via PayPal dès 50€.' },
          ].map((s) => (
            <div key={s.n} className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-[#008296] text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">{s.n}</div>
              <h3 className="font-bold text-lg mb-2">{s.t}</h3>
              <p className="text-sm text-gray-600">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-8 pb-16">
        <h2 className="text-2xl font-bold text-center mb-6">Questions fréquentes</h2>
        <div className="space-y-3">
          {[
            { q: 'Quand suis-je payé ?', a: 'Tous les mois, dès que vos commissions atteignent 50€. Paiement par PayPal.' },
            { q: 'Le cookie dure combien de temps ?', a: '30 jours. Si votre prospect achète dans les 30 jours après son clic, vous touchez la commission.' },
            { q: 'Y a-t-il un plafond ?', a: 'Non. Vous pouvez générer autant de ventes que vous voulez.' },
            { q: 'Sur quoi touche-je ma commission ?', a: 'Sur l\'abonnement principal et tous les bonus achetés par votre filleul.' },
          ].map((f) => (
            <details key={f.q} className="bg-white border border-gray-200 rounded-xl p-5">
              <summary className="font-bold cursor-pointer">{f.q}</summary>
              <p className="mt-2 text-gray-700">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/promo/espace" className="text-[#008296] hover:underline text-sm">← Retour à mon espace</Link>
        </div>
      </section>
    </FunnelLayout>
  );
};

export default PromoAffiliePage;
