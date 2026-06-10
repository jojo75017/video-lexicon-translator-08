import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import FunnelLayout from '@/components/funnel/FunnelLayout';
import SeoHead from '@/components/funnel/SeoHead';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Copy, Check, TrendingUp, Euro, Download, Image as ImageIcon,
  FileText, Sparkles, Gift, ShieldCheck, Zap, MessageCircle, Link as LinkIcon,
} from 'lucide-react';
import mockup from '@/assets/influenceurs-mockup.jpg';
import {
  COMMISSION_RATE, PRICE_NOW, PRICE_V3, COMMISSION_NOW, COMMISSION_V3,
  getActivePrice, getActiveCommission, isV3PriceActive, formatEuro, ORIGIN,
} from '@/lib/influencerKit';

const TEAL = '#008296';
const ORANGE = '#FF9E2D';

const SCRIPTS: { title: string; body: string }[] = [
  {
    title: 'Script 1 — Le POV transformation',
    body: `[HOOK 0-3s] « POV : tu publies ton premier livre Amazon ce week-end. »
[BODY 3-25s] Montre l'app en train de générer plan + chapitres + couverture. « Avant je bloquais des mois… là, 30 minutes. »
[CTA 25-30s] « Lien en bio, ${PRICE_NOW}€ à vie, pas d'abonnement. »`,
  },
  {
    title: 'Script 2 — Le storytime',
    body: `[HOOK] « J'ai écrit un livre sans savoir écrire. Voilà comment. »
[BODY] Raconte le blocage de la page blanche → découverte de l'outil → résultat à l'écran. Insiste sur « tout est généré, je valide ».
[CTA] « Si tu veux le tester, c'est dans ma bio. »`,
  },
  {
    title: 'Script 3 — La liste rapide',
    body: `[HOOK] « 3 raisons de publier un ebook en 2026 (et l'outil que j'utilise) »
[BODY] 1) Revenu passif. 2) Crédibilité/autorité. 3) C'est devenu ultra simple avec l'IA. Montre l'app.
[CTA] « Outil + tuto offert : lien en bio. »`,
  },
];

const InfluenceursPage = () => {
  const [user, setUser] = useState<any>(null);
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [sales, setSales] = useState(10);

  const price = getActivePrice();
  const commission = getActiveCommission();
  const v3Live = isV3PriceActive();

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      setUser(session.user);
      const { data: existing } = await supabase
        .from('referral_codes')
        .select('code')
        .eq('user_id', session.user.id)
        .maybeSingle();
      if (existing?.code) setCode(existing.code);
    })();
  }, []);

  const join = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast.error('Connecte-toi pour rejoindre le programme.');
      return;
    }
    setJoining(true);
    try {
      const newCode = (session.user.email?.split('@')[0] || 'amb')
        .replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase()
        + Math.floor(Math.random() * 1000);
      const { data: ins, error } = await supabase
        .from('referral_codes')
        .insert({ user_id: session.user.id, code: newCode })
        .select('code')
        .single();
      if (error) throw error;
      setCode(ins.code);
      toast.success('Bienvenue ! Ton lien ambassadeur est prêt.');
    } catch (e: any) {
      toast.error(e?.message || 'Impossible de créer ton lien.');
    } finally {
      setJoining(false);
    }
  };

  const link = useMemo(
    () => (code ? `${ORIGIN}/promo/decouverte?ref=${code}` : ''),
    [code],
  );

  const copy = async (value: string, label: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(label);
    toast.success('Copié !');
    setTimeout(() => setCopied(null), 2000);
  };

  const earnings = formatEuro(sales * commission);
  const earningsV3 = formatEuro(sales * COMMISSION_V3);

  const shareLink = link || `${ORIGIN}/promo/decouverte?ref=TONCODE`;

  const messages: { key: string; label: string; body: string }[] = [
    {
      key: 'dm',
      label: 'DM TikTok / Insta',
      body: `Hello 👋 J'utilise Ebookstudio Pro pour générer un livre complet (plan, chapitres, couverture Amazon KDP, SEO) en 30 min avec l'IA.

Si ça t'intéresse, voici mon lien : ${shareLink}
Paiement unique ${price}€ à vie, zéro abonnement. Dis-moi si tu veux que je te montre 🚀`,
    },
    {
      key: 'bio',
      label: 'Bio / Lien en bio',
      body: `📚 Crée ton livre avec l'IA en 30 min → ${shareLink}`,
    },
    {
      key: 'story',
      label: 'Story Insta',
      body: `J'ai testé Ebookstudio Pro pour écrire un livre sans savoir écrire 😱
Plan + chapitres + couverture générés automatiquement.
👉 Swipe up / lien : ${shareLink}
${price}€ à vie (pas d'abonnement).`,
    },
    {
      key: 'caption',
      label: 'Légende Reel / Post',
      body: `Comment publier ton premier livre Amazon ce week-end (même sans savoir écrire) 📖

J'utilise Ebookstudio Pro : l'IA génère le plan, les chapitres, la couverture KDP et le SEO. Toi tu valides.

🎁 Lien en bio / ${shareLink}
💸 ${price}€ à vie, paiement unique.

#ebook #amazonkdp #revenuPassif #ia #booktok`,
    },
    {
      key: 'email',
      label: 'Email / Newsletter',
      body: `Objet : L'outil que j'utilise pour écrire mes livres avec l'IA

Salut,

Je voulais te partager Ebookstudio Pro : un outil qui génère un livre complet (plan, chapitres, couverture Amazon KDP, fiche SEO) en une trentaine de minutes grâce à l'IA.

Tu peux le tester ici : ${shareLink}
C'est un paiement unique de ${price}€ à vie, sans abonnement.

À très vite !`,
    },
  ];

  const TIPS: string[] = [
    'Mets ton lien en bio ET dans la description de chaque vidéo : la majorité des ventes viennent de là.',
    'Montre le produit en action à l\'écran (screen recording) : la preuve visuelle convertit mieux qu\'un discours.',
    'Accroche les 3 premières secondes : pose une question ou un \u00ab POV \u00bb fort, sinon les gens scrollent.',
    'Publie 3 à 5 contenus sur le sujet : une seule vidéo passe souvent inaperçue, la répétition crée la confiance.',
    'Réponds en commentaire \u00ab lien en bio \u00bb quand on te demande l\'outil : ça booste l\'engagement et les clics.',
    'Insiste sur \u00ab paiement unique, pas d\'abonnement \u00bb : c\'est l\'argument qui rassure le plus.',
  ];


  return (
    <FunnelLayout>
      <SeoHead
        title="Programme Ambassadeur Ebookstudio — 30% par vente"
        description="Deviens ambassadeur Ebookstudio Pro et gagne 30% de commission par vente. Kit influenceur prêt : mockup, scripts TikTok/Reels, lien de suivi unique."
        canonical="/influenceurs"
      />

      {/* HERO */}
      <section className="bg-gradient-to-b from-[#008296]/10 to-transparent">
        <div className="max-w-5xl mx-auto px-4 py-14 grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <span className="inline-block bg-[#FF9E2D]/15 text-[#FF9E2D] px-3 py-1 rounded-full text-sm font-semibold">
              📣 Programme Ambassadeur
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[#232F3E] leading-tight">
              Gagne <span className="text-[#008296]">{formatEuro(commission)}</span> par vente
            </h1>
            <p className="text-lg text-[#232F3E]/75">
              Recommande Ebookstudio Pro sur TikTok ou Instagram et touche{' '}
              <strong>30% de commission</strong> sur chaque vente (paiement unique{' '}
              {price}€ à vie). Kit prêt à poster, lien de suivi automatique.
            </p>
            {!v3Live && (
              <p className="text-sm text-[#232F3E]/60">
                ⏳ Prix actuel <strong>{PRICE_NOW}€</strong> jusqu'au 1er octobre, puis{' '}
                <strong>{PRICE_V3}€</strong> au lancement V3 → ta commission passe à{' '}
                <strong>{formatEuro(COMMISSION_V3)}</strong>/vente.
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={join}
                disabled={joining || !!code}
                style={{ background: ORANGE, color: '#232F3E' }}
                className="font-semibold"
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                {code ? 'Tu es ambassadeur ✓' : 'Rejoindre le programme'}
              </Button>
              <a href="/kit-influenceurs.pdf" download>
                <Button variant="outline" className="border-[#008296] text-[#008296]">
                  <FileText className="w-4 h-4 mr-1.5" /> Dossier PDF
                </Button>
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src={mockup}
              alt="Aperçu de l'application Ebookstudio Pro sur smartphone"
              width={368}
              height={640}
              className="rounded-2xl shadow-2xl max-w-[280px] w-full"
            />
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="max-w-5xl mx-auto px-4 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Euro, t: '30% à vie', d: 'Sur chaque vente générée par ton lien.' },
          { icon: ShieldCheck, t: 'Zéro risque', d: 'Tu gagnes uniquement sur résultat réel.' },
          { icon: Zap, t: 'Suivi auto', d: 'Clics et ventes trackés via ton code unique.' },
          { icon: Gift, t: 'Bonus ambassadeur', d: 'Dès 5 ventes : accès V3 offert.' },
        ].map((b) => (
          <div key={b.t} className="bg-white border border-[#232F3E]/10 rounded-xl p-5 text-center">
            <b.icon className="w-7 h-7 mx-auto text-[#008296] mb-2" />
            <h3 className="font-bold text-[#232F3E]">{b.t}</h3>
            <p className="text-sm text-[#232F3E]/65 mt-1">{b.d}</p>
          </div>
        ))}
      </section>

      {/* SIMULATOR */}
      <section className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white border-2 border-[#008296] rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-[#232F3E]">
            <TrendingUp className="w-6 h-6 text-[#008296]" /> Simule tes gains
          </h2>
          <div>
            <label className="text-sm text-[#232F3E]/70 mb-2 block">
              Ventes générées : <strong>{sales}</strong>
            </label>
            <input
              type="range" min={1} max={100} value={sales}
              onChange={(e) => setSales(Number(e.target.value))}
              className="w-full accent-[#008296]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#FAFAFA] rounded-xl p-5 text-center">
              <p className="text-xs text-[#232F3E]/60 mb-1">
                Maintenant ({PRICE_NOW}€ × 30%)
              </p>
              <p className="text-3xl font-bold text-[#008296]">{earnings}</p>
            </div>
            <div className="bg-[#FF9E2D]/10 rounded-xl p-5 text-center">
              <p className="text-xs text-[#232F3E]/60 mb-1">
                Dès octobre ({PRICE_V3}€ × 30%)
              </p>
              <p className="text-3xl font-bold text-[#FF9E2D]">{earningsV3}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SCRIPTS */}
      <section className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <h2 className="text-2xl font-bold text-[#232F3E]">3 scripts vidéo prêts à tourner</h2>
        {SCRIPTS.map((s) => (
          <div key={s.title} className="bg-white border border-[#232F3E]/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-[#008296]">{s.title}</h3>
              <button
                onClick={() => copy(s.body, s.title)}
                className="text-[#008296] hover:text-[#FF9E2D] flex items-center gap-1 text-sm"
              >
                {copied === s.title ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                Copier
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-[#232F3E]/80 font-sans">{s.body}</pre>
          </div>
        ))}
      </section>

      {/* MY LINK */}
      {code && (
        <section className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-[#008296]/5 border border-[#008296]/30 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-bold text-[#232F3E]">Ton lien ambassadeur</h2>
            <div className="flex gap-2">
              <input
                readOnly value={link}
                className="flex-1 bg-white border border-[#232F3E]/15 rounded-lg px-3 py-2 text-sm"
              />
              <Button
                onClick={() => copy(link, 'lien')}
                style={{ background: TEAL, color: 'white' }}
              >
                {copied === 'lien' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-[#232F3E]/60">
              Code de suivi : <strong>{code}</strong> — chaque vente via ce lien te rapporte 30%.
            </p>
          </div>
        </section>
      )}

      {/* DOWNLOADS */}
      <section className="max-w-3xl mx-auto px-4 py-8 pb-16 grid sm:grid-cols-2 gap-4">
        <a href="/kit-influenceurs.pdf" download className="block">
          <div className="bg-white border border-[#232F3E]/10 rounded-xl p-5 hover:border-[#FF9E2D] transition-colors flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#008296]" />
            <div>
              <p className="font-bold text-[#232F3E]">Dossier Influenceur (PDF)</p>
              <p className="text-sm text-[#232F3E]/60">Pitch, offre, scripts & conditions</p>
            </div>
            <Download className="w-5 h-5 text-[#232F3E]/40 ml-auto" />
          </div>
        </a>
        <a href={mockup} download="ebookstudio-mockup.jpg" className="block">
          <div className="bg-white border border-[#232F3E]/10 rounded-xl p-5 hover:border-[#FF9E2D] transition-colors flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-[#008296]" />
            <div>
              <p className="font-bold text-[#232F3E]">Visuel mockup (9:16)</p>
              <p className="text-sm text-[#232F3E]/60">Prêt pour story / Reel</p>
            </div>
            <Download className="w-5 h-5 text-[#232F3E]/40 ml-auto" />
          </div>
        </a>
      </section>

      <div className="text-center pb-12">
        <Link to="/offres" className="text-[#008296] hover:text-[#FF9E2D] underline">
          ← Découvrir Ebookstudio Pro
        </Link>
      </div>
    </FunnelLayout>
  );
};

export default InfluenceursPage;
