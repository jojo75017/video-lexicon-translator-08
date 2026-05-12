import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import FunnelLayout from '@/components/funnel/FunnelLayout';
import SeoHead from '@/components/funnel/SeoHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Loader2, Copy, Check, TrendingUp, Users, Euro, Share2,
  Mail, MessageSquare, Twitter, Image as ImageIcon, Link as LinkIcon,
} from 'lucide-react';

const COMMISSION_RATE = 0.30;
const PRICE = 67;
const COMMISSION = Math.round(PRICE * COMMISSION_RATE * 100) / 100; // 20.10

const ORIGIN = 'https://ebookstudio.fr';

const PromoAffiliePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
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

      const { data: existing } = await supabase
        .from('referral_codes')
        .select('code')
        .eq('user_id', session.user.id)
        .maybeSingle();

      let myCode = existing?.code;
      if (!myCode) {
        const newCode = (session.user.email?.split('@')[0] || 'aff')
          .replace(/[^a-zA-Z0-9]/g, '')
          .slice(0, 8)
          .toUpperCase() + Math.floor(Math.random() * 1000);
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

  const link = useMemo(() => code ? `${ORIGIN}/promo/decouverte?ref=${code}` : '', [code]);
  const linkBonus = useMemo(() => code ? `${ORIGIN}/promo/bonus?ref=${code}` : '', [code]);
  const linkFormation = useMemo(() => code ? `${ORIGIN}/formation?ref=${code}` : '', [code]);

  const monthlyEarnings = (calcSales * COMMISSION).toFixed(2);
  const yearlyEarnings = (calcSales * COMMISSION * 12).toFixed(0);

  const copy = async (value: string, label: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(label);
    toast.success(`${label} copié !`);
    setTimeout(() => setCopied(null), 2000);
  };

  // Argumentaires prêts à copier
  const emailTemplate = code ? `Objet : J'ai trouvé l'outil qui change tout pour publier un ebook sur Amazon

Bonjour,

Si vous avez déjà rêvé d'écrire et publier votre propre livre sur Amazon KDP mais que vous bloquiez sur le plan, les chapitres, la couverture ou les mots-clés SEO… j'ai trouvé l'outil qui débloque tout.

EbookStudio transforme une simple idée en ebook complet (plan, chapitres, couverture, fichiers KDP-compliant) en moins de 30 minutes. Tout est généré, vous n'avez qu'à valider.

Le mieux ? C'est un paiement unique de 67€ - accès à vie, aucun abonnement.

Mon lien : ${link}

Si vous le testez, dites-moi ce que vous en pensez !` : '';

  const socialPost = code ? `🚀 Vous voulez publier votre 1er ebook sur Amazon KDP cette semaine ?

J'utilise EbookStudio depuis quelques semaines : un outil tout-en-un qui génère le plan, les chapitres, la couverture, les mots-clés SEO et les fichiers KDP-compliant en moins de 30 minutes.

✅ Paiement unique 67€
✅ Accès à vie (pas d'abonnement)
✅ Conforme aux normes Amazon KDP

Mon lien (avec petit cashback pour moi 😉) : ${link}` : '';

  const tweet = code ? `J'ai testé EbookStudio : un ebook complet (plan, chapitres, couverture, KDP) en 30 min pour 67€ à vie.

Plus besoin de bricoler 10 outils. ${link}` : '';

  const reelScript = code ? `[HOOK 0-3s] "Comment j'ai écrit un livre Amazon KDP en 1 après-midi"

[BODY 3-25s]
- Avant : 6 mois bloqué sur le plan
- Maintenant : 30 min avec EbookStudio
- Plan, chapitres, couverture, mots-clés : tout généré
- Paiement unique 67€, accès à vie

[CTA 25-30s] "Lien dans la bio" → ${link}` : '';

  const objections = [
    { q: 'C\'est de l\'IA, donc le contenu est plat ?', a: 'Non - EbookStudio utilise un workflow à 15 agents IA spécialisés (un par tâche : plan, narration, dialogue, SEO, etc.) qui produit du contenu structuré et professionnel. L\'auteur garde le contrôle à chaque étape.' },
    { q: 'Pourquoi 67€ alors que d\'autres outils sont gratuits ?', a: 'Parce que c\'est un paiement unique - pas un abonnement à 30€/mois. À l\'année, vous économisez plusieurs centaines d\'euros vs Jasper, Sudowrite ou ChatGPT Plus.' },
    { q: 'Je suis débutant, c\'est pour moi ?', a: 'Oui - tout est guidé pas à pas. Une formation est incluse pour publier votre 1er ebook sur Amazon KDP de A à Z.' },
    { q: 'Y a-t-il une garantie ?', a: 'Garantie satisfait ou remboursé 14 jours, sans condition.' },
  ];

  return (
    <FunnelLayout>
      <SeoHead
        title="Programme d'affiliation EbookStudio - 30% par vente"
        description="Gagnez 20,10€ par vente en recommandant EbookStudio. Paiement unique 67€ à vie. Cookie 30 jours, paiement PayPal."
        canonical="/promo/affilie"
      />

      {/* HERO */}
      <section className="bg-gradient-to-b from-[#008296]/10 to-transparent">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
          <span className="inline-block bg-[#FF9E2D]/10 text-[#FF9E2D] px-3 py-1 rounded-full text-sm font-semibold">
            💰 Programme d'affiliation
          </span>
          <h1 className="text-4xl md:text-5xl font-bold">
            Gagnez <span className="text-[#008296]">20,10€</span> par vente
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            30% de commission sur chaque vente d'EbookStudio (paiement unique 67€ à vie). Cookie 30 jours, paiement PayPal mensuel dès 50€.
          </p>
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white border-2 border-[#008296] rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#008296]" /> Simulez vos revenus
          </h2>
          <div>
            <label className="text-sm text-gray-600 mb-2 block">
              Ventes générées par mois : <strong>{calcSales}</strong>
            </label>
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
            <p className="text-sm text-gray-500">Soit {yearlyEarnings}€ sur l'année</p>
          </div>
        </div>
      </section>

      {/* DASHBOARD or CTA */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#008296]" /></div>
      ) : !user ? (
        <section className="max-w-3xl mx-auto px-4 py-12 text-center bg-white border border-gray-200 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Devenez affilié en 30 secondes</h2>
          <p className="text-gray-700 mb-6">Créez votre compte gratuit pour récupérer votre lien et votre kit de promotion.</p>
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
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Share2 className="w-5 h-5" /> Votre lien d'affiliation principal
              </h2>
              <div className="flex gap-2">
                <Input value={link} readOnly className="font-mono text-sm" />
                <Button onClick={() => copy(link, 'Lien')} className="bg-[#008296] hover:bg-[#006d7e] text-white">
                  {copied === 'Lien' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
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

          {/* KIT DE PROMOTION */}
          <section id="kit" className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-white border-2 border-[#FF9E2D] rounded-2xl p-6 md:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  🎁 Kit de promotion
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Tout ce dont vous avez besoin pour promouvoir EbookStudio. Copiez-collez et adaptez.
                </p>
              </div>

              <Tabs defaultValue="liens" className="w-full">
                <TabsList className="flex flex-wrap h-auto">
                  <TabsTrigger value="liens"><LinkIcon className="w-4 h-4 mr-2" />Liens</TabsTrigger>
                  <TabsTrigger value="email"><Mail className="w-4 h-4 mr-2" />Email</TabsTrigger>
                  <TabsTrigger value="social"><MessageSquare className="w-4 h-4 mr-2" />Post social</TabsTrigger>
                  <TabsTrigger value="tweet"><Twitter className="w-4 h-4 mr-2" />Tweet</TabsTrigger>
                  <TabsTrigger value="reel">Reel / Story</TabsTrigger>
                  <TabsTrigger value="visuels"><ImageIcon className="w-4 h-4 mr-2" />Visuels</TabsTrigger>
                  <TabsTrigger value="objections">FAQ</TabsTrigger>
                </TabsList>

                {/* LIENS */}
                <TabsContent value="liens" className="space-y-3 mt-4">
                  {[
                    { label: 'Page de vente principale', value: link },
                    { label: 'Page bonus', value: linkBonus },
                    { label: 'Page formation', value: linkFormation },
                  ].map((l) => (
                    <div key={l.label}>
                      <p className="text-xs uppercase text-gray-500 mb-1">{l.label}</p>
                      <div className="flex gap-2">
                        <Input value={l.value} readOnly className="font-mono text-xs" />
                        <Button
                          onClick={() => copy(l.value, l.label)}
                          variant="outline"
                          size="icon"
                        >
                          {copied === l.label ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                {/* EMAIL */}
                <TabsContent value="email" className="mt-4 space-y-3">
                  <textarea
                    readOnly
                    value={emailTemplate}
                    rows={14}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-mono"
                  />
                  <Button
                    onClick={() => copy(emailTemplate, 'Email')}
                    className="bg-[#008296] hover:bg-[#006d7e] text-white"
                  >
                    {copied === 'Email' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    Copier l'email
                  </Button>
                </TabsContent>

                {/* SOCIAL */}
                <TabsContent value="social" className="mt-4 space-y-3">
                  <p className="text-xs text-gray-500">LinkedIn / Facebook (~800 caractères)</p>
                  <textarea
                    readOnly
                    value={socialPost}
                    rows={10}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-mono"
                  />
                  <Button
                    onClick={() => copy(socialPost, 'Post')}
                    className="bg-[#008296] hover:bg-[#006d7e] text-white"
                  >
                    {copied === 'Post' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    Copier le post
                  </Button>
                </TabsContent>

                {/* TWEET */}
                <TabsContent value="tweet" className="mt-4 space-y-3">
                  <p className="text-xs text-gray-500">X / Twitter (≤ 280 caractères)</p>
                  <textarea
                    readOnly
                    value={tweet}
                    rows={4}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-mono"
                  />
                  <Button
                    onClick={() => copy(tweet, 'Tweet')}
                    className="bg-[#008296] hover:bg-[#006d7e] text-white"
                  >
                    {copied === 'Tweet' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    Copier le tweet
                  </Button>
                </TabsContent>

                {/* REEL */}
                <TabsContent value="reel" className="mt-4 space-y-3">
                  <p className="text-xs text-gray-500">Script Reel Instagram / TikTok / Story (30s)</p>
                  <textarea
                    readOnly
                    value={reelScript}
                    rows={10}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-mono"
                  />
                  <Button
                    onClick={() => copy(reelScript, 'Script')}
                    className="bg-[#008296] hover:bg-[#006d7e] text-white"
                  >
                    {copied === 'Script' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    Copier le script
                  </Button>
                </TabsContent>

                {/* VISUELS */}
                <TabsContent value="visuels" className="mt-4">
                  <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center space-y-3">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-700 font-medium">Visuels prêts à partager</p>
                    <p className="text-xs text-gray-500 max-w-md mx-auto">
                      Bannières 1200×630 (post Facebook/LinkedIn), 1080×1080 (Instagram), 1080×1920 (Story/Reel) - disponibles très bientôt.
                    </p>
                    <p className="text-xs text-gray-500">
                      En attendant, contactez-nous : <strong>contact@ebookstudio.fr</strong>
                    </p>
                  </div>
                </TabsContent>

                {/* OBJECTIONS */}
                <TabsContent value="objections" className="mt-4 space-y-3">
                  <p className="text-xs text-gray-500">
                    Réponses aux objections les plus fréquentes - copiez-les pour répondre à vos prospects.
                  </p>
                  {objections.map((o) => (
                    <div key={o.q} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="font-bold text-sm mb-1">{o.q}</p>
                      <p className="text-sm text-gray-700">{o.a}</p>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
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
            { q: 'Sur quoi touche-je ma commission ?', a: 'Sur la vente principale (67€ à vie) et tous les bonus achetés par votre filleul.' },
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
