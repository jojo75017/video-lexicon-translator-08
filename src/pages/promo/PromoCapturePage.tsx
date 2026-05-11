import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import FunnelLayout from '@/components/funnel/FunnelLayout';
import SeoHead from '@/components/funnel/SeoHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useReferralTracking, getStoredRefCode } from '@/hooks/useReferralTracking';
import { toast } from 'sonner';
import { Loader2, BookOpen, TrendingUp, Target } from 'lucide-react';
import coverImg from '@/assets/lead-magnet-cover.png';

const schema = z.object({
  first_name: z.string().trim().max(80).optional(),
  email: z.string().trim().email('Email invalide').max(255),
});

const PromoCapturePage = () => {
  useReferralTracking();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ first_name: firstName, email });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('funnel-capture-lead', {
        body: {
          email: parsed.data.email,
          first_name: parsed.data.first_name,
          ref_code: getStoredRefCode(),
          website,
          landing_url: window.location.href,
        },
      });
      if (error) throw error;
      try {
        localStorage.setItem('ebs_lead_email', parsed.data.email);
        if (parsed.data.first_name) localStorage.setItem('ebs_lead_first_name', parsed.data.first_name);
      } catch { /* ignore */ }
      navigate('/promo/merci', { state: { url: data?.lead_magnet_url } });
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de l\'envoi. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FunnelLayout>
      <SeoHead
        title="5 niches rentables d'ebooks en 2026 — Guide gratuit"
        description="Téléchargez le guide PDF gratuit : 5 niches d'ebooks à fort potentiel sur Amazon en 2026, mots-clés et plan d'ebook inclus."
        canonical="/promo"
      />
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="inline-block bg-[#FF9E2D]/10 text-[#FF9E2D] px-3 py-1 rounded-full text-sm font-semibold">
            🎁 Guide PDF offert
          </span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Découvrez les <span className="text-[#008296]">5 niches d'ebooks</span> qui cartonnent sur Amazon en 2026
          </h1>
          <p className="text-lg text-gray-700">
            Mots-clés Amazon à fort volume, top best-sellers, plan d'ebook type. Le guide compilé à partir des données de vente Amazon les plus récentes.
          </p>

          <form onSubmit={submit} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-3">
            <Input
              type="text"
              placeholder="Votre prénom (optionnel)"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              maxLength={80}
            />
            <Input
              type="email"
              placeholder="Votre meilleur email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
            />
            {/* honeypot */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="hidden"
              aria-hidden="true"
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF9E2D] hover:bg-[#e88f1f] text-white font-bold py-6 text-base"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : '📥 Recevoir mon guide gratuit'}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Pas de spam. Désinscription en 1 clic.
            </p>
          </form>

          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { icon: Target, label: '5 niches porteuses' },
              { icon: TrendingUp, label: 'Demande croissante' },
              { icon: BookOpen, label: 'Plan d\'ebook offert' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="text-center">
                <Icon className="w-6 h-6 text-[#008296] mx-auto mb-1" />
                <p className="text-xs text-gray-600">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src={coverImg}
            alt="Couverture du guide 5 niches rentables d'ebooks 2026"
            className="max-w-sm w-full drop-shadow-2xl"
            width={800}
            height={1024}
          />
        </div>
      </section>
    </FunnelLayout>
  );
};

export default PromoCapturePage;
