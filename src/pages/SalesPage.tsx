import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { trackEvent, trackDemoClick, trackCTAClick, trackNewsletterSignup, trackPlanSelect, trackBeginCheckout, trackPricingView, trackZoomBooking, trackOffresClick } from "@/utils/analytics";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, BookOpen, Zap, Download, Star, ArrowRight, Play, Loader2, Clock, HelpCircle, CheckCircle, Calculator, Gift, Mail, Send, Rocket, ShieldCheck, Crown, BarChart3, Landmark, PenTool, RefreshCw, BadgeCheck, Package, Search, Brain, Link2, Eye, RotateCcw, Palette, Trophy, Shield } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ExitIntentPopup from "@/components/sales/ExitIntentPopup";
import SocialProofBanner from "@/components/sales/SocialProofBanner";
import SalesFaq from "@/components/sales/SalesFaq";
import { useVipAvailability } from "@/hooks/useVipAvailability";
import AuthorShowcase from "@/components/sales/AuthorShowcase";
import PassiveRevenueProof from "@/components/sales/PassiveRevenueProof";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
  })
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } }
};

// Newsletter inline
const NewsletterForm = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) { toast.error("Email invalide"); return; }
    setIsSubscribing(true);
    try {
      await supabase.functions.invoke("add-to-email-sequence", { body: { email: newsletterEmail.trim().toLowerCase() } });
      trackNewsletterSignup("footer_offres");
      setIsSubscribed(true);
      toast.success("🎉 Inscrit ! Vérifiez votre boîte mail");
      setNewsletterEmail("");
    } catch { toast.error("Erreur, réessayez"); }
    finally { setIsSubscribing(false); }
  };

  if (isSubscribed) return <div className="flex items-center gap-2 text-emerald-400 text-sm"><CheckCircle className="w-4 h-4" /><span>Inscrit !</span></div>;

  return (
    <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
      <Input type="email" placeholder="votre@email.com" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} className="bg-slate-800 border-slate-700 text-white placeholder:text-gray-500 text-sm h-9" disabled={isSubscribing} />
      <Button type="submit" size="sm" disabled={isSubscribing} className="bg-violet-600 hover:bg-violet-700 h-9 px-3">
        {isSubscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
      </Button>
    </form>
  );
};

// Data
const phases = [
  {
    title: "Direction & Stratégie",
    phase: "Phase 1",
    color: "from-violet-500 to-purple-600",
    borderColor: "border-violet-500/30",
    bgColor: "bg-violet-500/5",
    badgeColor: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    roles: [
      { icon: Crown, label: "P1", name: "Directeur", desc: "Vision globale du projet" },
      { icon: BarChart3, label: "P2", name: "Marché", desc: "Analyse concurrentielle" },
      { icon: Landmark, label: "P3", name: "Architecte", desc: "Structure du livre" },
    ]
  },
  {
    title: "Production",
    phase: "Phase 2",
    color: "from-amber-500 to-orange-500",
    borderColor: "border-amber-500/30",
    bgColor: "bg-amber-500/5",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    roles: [
      { icon: PenTool, label: "P4", name: "Rédaction", desc: "Écriture guidée" },
      { icon: Sparkles, label: "P5", name: "Réécriture", desc: "Amélioration du style" },
      { icon: BadgeCheck, label: "P6", name: "Qualité", desc: "Contrôle éditorial" },
    ]
  },
  {
    title: "Publication",
    phase: "Phase 3",
    color: "from-emerald-500 to-teal-500",
    borderColor: "border-emerald-500/30",
    bgColor: "bg-emerald-500/5",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    roles: [
      { icon: Package, label: "P7", name: "Packaging", desc: "Mise en forme finale" },
      { icon: Search, label: "P8", name: "Diagnostic", desc: "Vérification complète" },
    ]
  },
  {
    title: "Intelligence Avancée",
    phase: "Phase 4",
    color: "from-sky-500 to-blue-600",
    borderColor: "border-sky-500/30",
    bgColor: "bg-sky-500/5",
    badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    roles: [
      { icon: Brain, label: "P9", name: "Mémoire", desc: "Contexte persistant" },
      { icon: Link2, label: "P10", name: "Cohérence", desc: "Fil narratif" },
      { icon: Eye, label: "P11", name: "Critique", desc: "Regard externe" },
      { icon: RotateCcw, label: "P12", name: "Boucle", desc: "Itération continue" },
      { icon: Palette, label: "P13", name: "Style", desc: "Ton & voix" },
      { icon: Trophy, label: "P14", name: "Verdict", desc: "Validation finale" },
    ]
  },
];

const steps = [
  { num: "01", title: "Positionner", desc: "Analyse marché, promesse unique et architecture complète du livre", icon: BarChart3, color: "from-violet-500 to-purple-600" },
  { num: "02", title: "Produire", desc: "Rédaction guidée par rôle, amélioration itérative et contrôle qualité", icon: PenTool, color: "from-amber-500 to-orange-500" },
  { num: "03", title: "Optimiser", desc: "Mots-clés Amazon, packaging professionnel et export multi-format", icon: Zap, color: "from-emerald-500 to-teal-500" },
  { num: "04", title: "Déployer", desc: "Marketing automatisé, audiobook et catalogue de publications", icon: Rocket, color: "from-sky-500 to-blue-600" },
];

const valuePrices = [
  { label: "Rédacteur freelance", price: "500 – 2 000€", color: "text-red-500", borderColor: "border-red-500/20", bgColor: "bg-red-500/5" },
  { label: "Ghostwriter", price: "1 500 – 5 000€", color: "text-orange-500", borderColor: "border-orange-500/20", bgColor: "bg-orange-500/5" },
  { label: "Agence éditoriale", price: "jusqu'à 10 000€", color: "text-amber-500", borderColor: "border-amber-500/20", bgColor: "bg-amber-500/5" },
];

const testimonials = [
  { name: "Marie D.", role: "Auteure Kindle", text: "J'ai créé 5 ebooks en 1 mois grâce au workflow structuré. Mes revenus KDP ont triplé !", avatar: "MD", color: "from-pink-500 to-rose-500" },
  { name: "Thomas L.", role: "Entrepreneur", text: "L'outil parfait pour créer du contenu premium rapidement. ROI immédiat.", avatar: "TL", color: "from-blue-500 to-cyan-500" },
  { name: "Sophie R.", role: "Coach Business", text: "La formation audio incluse m'a permis de comprendre toute la stratégie ebook.", avatar: "SR", color: "from-violet-500 to-purple-500" },
  { name: "Jean-Marc P.", role: "Auteur Indépendant", text: "En 3 semaines, j'ai publié mon premier ebook sur Amazon grâce au workflow structuré.", avatar: "JP", color: "from-emerald-500 to-teal-500" },
  { name: "Camille B.", role: "Formatrice en ligne", text: "J'utilise les ebooks créés comme lead magnets. Mon taux de conversion a doublé !", avatar: "CB", color: "from-amber-500 to-orange-500" },
  { name: "Nicolas F.", role: "Blogueur Pro", text: "La qualité des contenus est bluffante. Le workflow éditorial fait toute la différence.", avatar: "NF", color: "from-cyan-500 to-blue-500" },
];

const SalesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const { isVipAvailable, daysRemaining, isLoading: vipLoading } = useVipAvailability();

  // Capture referral code from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    if (ref) {
      sessionStorage.setItem('referral_code', ref);
    }
  }, [location.search]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 20;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 300);
    }
  }, [location.hash]);

  useEffect(() => {
    document.title = "Workflow Éditorial IA en 14 Rôles - EbookStudio Pro Amazon KDP | 37€";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Le premier workflow éditorial IA structuré en 14 rôles professionnels. Créez un ebook optimisé pour Amazon KDP. Accès à vie 37€.");
  }, []);

  const OFFER_END_DATE = new Date('2026-06-30T23:59:59+02:00');

  useEffect(() => {
    const update = () => {
      const diff = OFFER_END_DATE.getTime() - Date.now();
      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff % 86400000) / 3600000),
          minutes: Math.floor((diff % 3600000) / 60000),
          seconds: Math.floor((diff % 60000) / 1000)
        });
      }
    };
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, []);

  const handlePlanClick = () => {
    const planName = isVipAvailable ? 'fondateur' : 'pro';
    const planPrice = isVipAvailable ? 37 : 147;
    trackPlanSelect(planName, planPrice);
    trackCTAClick('plan_click', isVipAvailable ? '/paiement-manuel' : '/upsell-paiement');
    if (isVipAvailable) navigate('/paiement-manuel');
    else navigate('/upsell-paiement?plan=pro');
  };

  const handleCheckout = () => {
    if (!email || !email.includes("@")) { toast.error("Email invalide"); return; }
    if (!selectedPlan) { toast.error("Sélectionnez un plan"); return; }
    trackBeginCheckout(selectedPlan, selectedPlan === 'fondateur' ? 37 : 147);
    sessionStorage.setItem('payment_email', email.trim().toLowerCase());
    navigate(`/upsell-paiement?plan=${selectedPlan}`);
  };

  const price = isVipAvailable ? '37' : '147';
  const daysLeft = daysRemaining ?? 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Zoom Banner */}
      <a href="https://calendly.com/boubetgeorges/nouvelle-reunion" target="_blank" rel="noopener noreferrer"
        className="block w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white text-center py-2.5 px-4 text-sm font-semibold hover:brightness-110 transition-all sticky top-0 z-[60]">
        <span className="flex items-center justify-center gap-2">
          <Play className="w-4 h-4 fill-white" />
          🎥 Dispo en Zoom — Voyez l'outil en direct
          <span className="hidden sm:inline border border-white/30 rounded-full px-3 py-0.5 text-xs ml-2">Réserver →</span>
        </span>
      </a>

      {/* Header */}
      <header className="bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-[40px] z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/offres" onClick={() => trackOffresClick('logo_header')} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">EbookStudio Pro</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#author-showcase" onClick={(e) => { e.preventDefault(); document.getElementById('author-showcase')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-muted-foreground hover:text-primary transition-colors font-medium cursor-pointer">📚 Ebooks créés</a>
            <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link>
            <Link to="/demo" className="text-muted-foreground hover:text-primary transition-colors">Démo</Link>
            <Link to="/formation" className="text-muted-foreground hover:text-primary transition-colors">Formation</Link>
            <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5" />FAQ</Link>
          </nav>
          <Button size="sm" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/20"
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
            {isVipAvailable ? `Fondateur — ${daysLeft}j` : 'Voir l\'offre'}
          </Button>
        </div>
      </header>

      {/* ═══════════════════════════════════════ HERO ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-6 sm:pt-10 pb-12 sm:pb-20 px-4">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl mx-auto text-center relative z-10">

          <motion.h1 variants={fadeUp} custom={1} className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-2 sm:mb-3">
            Créer et publier un ebook rentable{" "}
            <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              en moins d'1 heure
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} custom={1.5} className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-2 sm:mb-3">
            Même si vous partez de zéro.
          </motion.p>
          <motion.p variants={fadeUp} custom={1.6} className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 font-medium">
            Lancez votre premier ebook et créez un <span className="text-foreground">actif digital rentable</span>.
          </motion.p>

          <motion.div variants={fadeUp} custom={2} className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center text-left mb-6 sm:mb-8 max-w-xl mx-auto">
            <div className="flex items-center gap-2 text-base sm:text-lg text-foreground font-medium">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span>Trouvez une niche rentable</span>
            </div>
            <div className="flex items-center gap-2 text-base sm:text-lg text-foreground font-medium">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span>Générez votre ebook complet</span>
            </div>
            <div className="flex items-center gap-2 text-base sm:text-lg text-foreground font-medium">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span>Publiez sur Amazon KDP</span>
            </div>
          </motion.div>

          <motion.p variants={fadeUp} custom={2.1} className="text-sm text-muted-foreground mb-5 sm:mb-6">
            ✅ Déjà utilisé pour générer des ebooks publiés sur Amazon KDP.
          </motion.p>

          <motion.div variants={fadeUp} custom={2.2} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-10">
            <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-xl shadow-violet-500/25 hover:shadow-2xl hover:shadow-violet-500/30 transition-all duration-300 hover:-translate-y-0.5"
              onClick={() => { trackCTAClick('hero_cta_top', '/paiement'); handlePlanClick(); }}>
              <Rocket className="w-5 h-5 mr-2" />
              {isVipAvailable ? `👉 Accès Fondateur – ${price}€` : '👉 Créer mon premier ebook maintenant'}
            </Button>
          </motion.div>

          {/* Vidéo démo complète */}
          <motion.div variants={fadeUp} custom={2.5} className="mb-6 sm:mb-8 max-w-3xl mx-auto">
            <h2 className="text-lg sm:text-xl font-bold text-foreground mb-3">
              🎬 Démo réelle — création d'un ebook complet
            </h2>
            <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-violet-500/20 border border-border bg-card aspect-video">
              <iframe
                src="https://www.youtube.com/embed/JD0x6hDhBg0?rel=0"
                title="Démo réelle — création d'un ebook complet"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                loading="lazy"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              👉 Voir le workflow complet ci-dessous
            </p>
          </motion.div>

          <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-3 sm:mb-4">
            <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-xl shadow-violet-500/25 hover:shadow-2xl hover:shadow-violet-500/30 transition-all duration-300 hover:-translate-y-0.5"
              onClick={() => { trackCTAClick('hero_cta_primary', '/paiement'); handlePlanClick(); }}>
              <Rocket className="w-5 h-5 mr-2" />
              👉 Créer mon premier ebook maintenant
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
              onClick={() => { trackEvent('click_demo', { button_text: 'Voir la démonstration complète', page_path: '/offres' }); trackDemoClick("demo_hero"); navigate('/demo'); }}>
              <Play className="w-5 h-5 mr-2" />
              Voir la démonstration complète
            </Button>
          </motion.div>

          <motion.p variants={fadeUp} custom={3.5} className="text-sm text-muted-foreground mb-2">
            Déjà utilisé par des auteurs indépendants pour générer leurs premiers ebooks.
          </motion.p>
          <motion.p variants={fadeUp} custom={3.6} className="mb-1">
            <a href="https://www.amazon.fr/Mr-Georges-Boubet/e/B0CGVLHNX7" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base font-medium text-muted-foreground hover:text-primary transition-colors">
              📚 Ebooks publiés en conditions réelles — voir ma page auteur Amazon
            </a>
          </motion.p>
        </motion.div>
      </section>

      {/* Transition phrase */}
      <div className="text-center py-4 px-4">
        <p className="text-sm text-muted-foreground italic max-w-lg mx-auto">
          ✨ Commencez par regarder la démo — puis voyez pourquoi l'offre fondateur se termine bientôt.
        </p>
      </div>

      {/* ═══════════════════════════════════════ VIDÉO RAPPEL OFFRE ═══════════════════════════ */}
      <section className="py-10 px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-xs mx-auto text-center">
          <motion.p variants={fadeUp} className="text-sm font-semibold text-violet-400 mb-3">🎯 Rappel — Offre Fondateur à 37&nbsp;€</motion.p>
          <motion.div variants={fadeUp} custom={1} className="rounded-xl overflow-hidden shadow-xl shadow-violet-500/10 border border-border bg-card aspect-[9/16]">
            <video
              src="/videos/annonce-ebookstudio.mp4"
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
              title="Annonce offre fondateur EbookStudio 37€"
            />
          </motion.div>
          <motion.p variants={fadeUp} custom={2} className="text-xs text-muted-foreground mt-2">📣 Pourquoi profiter de l'offre fondateur maintenant</motion.p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════ MESSAGE MOTIVATION ═══════════════════════════ */}
      <section className="py-8 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 p-8 shadow-2xl shadow-violet-500/20 border border-white/10 text-center"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-[60px]" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-500/15 rounded-full blur-[50px]" />
          <div className="relative z-10">
            <p className="text-3xl mb-3">🚀</p>
            <h3 className="text-xl md:text-2xl font-extrabold text-white mb-3">
              1, 2, 3… Foncez !
            </h3>
            <p className="text-white/85 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
              Et sachez que je suis <strong className="text-white">toujours là pour vous accompagner</strong> — avec un Zoom gratuit, à tout moment.
            </p>
            <p className="text-white/50 text-sm mt-4 italic">
              — Georges, créateur d'EbookStudio
            </p>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════ PRICING ═══════════════════════════════════ */}
      <section id="pricing" className="py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-6">
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-extrabold mb-4">
              {isVipAvailable ? 'Offre Fondateur' : 'Accès Pro Lifetime'}
            </motion.h2>
            <motion.div variants={fadeUp} custom={1} className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-5 py-2 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Garantie 30 jours satisfait ou remboursé</span>
            </motion.div>
          </motion.div>

          {/* Countdown */}
          {isVipAvailable && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="mb-12">
              <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 text-white text-center shadow-2xl shadow-violet-500/20">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Clock className="w-5 h-5" />
                  <span className="font-bold text-lg">Offre Fondateur — {daysLeft} jours restants</span>
                </div>
                <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
                  {[
                    { val: countdown.days, label: "Jours" },
                    { val: countdown.hours, label: "Heures" },
                    { val: countdown.minutes, label: "Min" },
                    { val: countdown.seconds, label: "Sec" },
                  ].map((c, i) => (
                    <div key={i} className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
                      <div className="text-3xl font-extrabold tabular-nums">{String(c.val).padStart(2, '0')}</div>
                      <div className="text-[10px] uppercase tracking-wider opacity-80">{c.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Pricing Card */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 p-[2px] rounded-3xl">
                <div className="absolute inset-[2px] rounded-[22px] bg-background" />
              </div>

              <div className="relative z-10 p-8 md:p-10">
                {isVipAvailable && (
                  <Badge className="bg-gradient-to-r from-violet-600 to-purple-600 text-white border-0 mb-6 px-4 py-1.5 text-sm font-bold">
                    🔥 OFFRE FONDATEUR — Jusqu'au 30 juin
                  </Badge>
                )}

                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-lg text-muted-foreground line-through">297€</span>
                  <span className="text-6xl md:text-7xl font-extrabold">{price}</span>
                  <span className="text-3xl font-bold">€</span>
                </div>
                <p className="text-sm text-muted-foreground mb-8">Paiement unique • Accès à vie • Sans abonnement</p>

                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 mb-8">
                  {[
                    "Workflow éditorial complet à vie",
                    "14 rôles professionnels intégrés",
                    "P15 Humanisation Anti-IA offert",
                    "Export PDF / EPUB / Word",
                    "Toutes les formations (18 modules)",
                    "Outils KDP Premium complets",
                    "Gestionnaire Séries / Sagas",
                    "Traduction multi-langues",
                    "Infrastructure Audiobooks",
                    "Mises à jour gratuites à vie",
                    "Support prioritaire inclus",
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-sm">{f}</span>
                    </div>
                  ))}
                </div>

                <Button size="lg" className="w-full py-8 text-xl font-extrabold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 rounded-xl animate-pulse hover:animate-none hover:scale-[1.02]"
                  onClick={handlePlanClick}>
                  <Rocket className="w-6 h-6 mr-2" />
                  {isVipAvailable ? '🔥 Accès Fondateur — 37€ à vie' : `Débloquer l'accès Pro — ${price}€`}
                  <ArrowRight className="w-6 h-6 ml-2" />
                </Button>

                {isVipAvailable && (
                  <p className="text-center mt-4 text-sm text-muted-foreground">
                    À partir du 1er juillet : <strong className="text-foreground text-base">147€</strong>
                  </p>
                )}

                {!isVipAvailable && (
                  <div className="mt-6 space-y-2">
                    <p className="text-xs text-muted-foreground text-center mb-3">Ou payez en plusieurs fois :</p>
                    {[
                      { label: "En 3 fois", price: "49", per: "49€/mois × 3" },
                      { label: "En 5 fois", price: "32", per: "32€/mois × 5" },
                    ].map((inst, idx) => (
                      <button key={idx} onClick={handlePlanClick}
                        className="w-full flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="text-left">
                          <span className="font-semibold text-sm">{inst.label}</span>
                          <p className="text-xs text-muted-foreground">{inst.per}</p>
                        </div>
                        <span className="text-lg font-bold">{inst.price}€</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Paiement sécurisé • Accès immédiat</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Garantie */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10">
            <div className="bg-emerald-500/5 border-2 border-emerald-500/20 rounded-2xl p-6 text-center">
              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center justify-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                Garantie Satisfait ou Remboursé — 30 jours
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Testez pendant 30 jours. Pas satisfait ? Un email et vous êtes remboursé intégralement.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ SOCIAL PROOF ═══════════════════════════════ */}
      <SocialProofBanner />

      {/* ═══════════════════════════════════════ 14 RÔLES ═══════════════════════════════════ */}
      <section className="py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="text-center mb-10">
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-extrabold mb-5">
              Un système éditorial complet.{" "}
              <span className="text-muted-foreground">Pas un simple générateur.</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Chaque rôle intervient à un moment précis pour structurer, améliorer et valider votre livre avant publication.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {phases.map((phase, pi) => (
              <motion.div key={pi} variants={fadeUp} custom={pi}>
                <Card className={`h-full border-2 ${phase.borderColor} ${phase.bgColor} hover:shadow-lg transition-shadow duration-300`}>
                  <CardHeader className="pb-4">
                    <Badge className={`w-fit text-xs font-semibold ${phase.badgeColor}`}>{phase.phase}</Badge>
                    <CardTitle className="text-base font-bold mt-2">{phase.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {phase.roles.map((role, ri) => (
                      <div key={ri} className="flex items-center gap-3 group">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${phase.color} flex items-center justify-center shadow-sm`}>
                          <role.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold leading-tight">{role.label} — {role.name}</p>
                          <p className="text-xs text-muted-foreground">{role.desc}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Bonus P15 */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mt-8">
            <Card className="border-2 border-rose-500/30 bg-gradient-to-r from-rose-500/5 via-pink-500/5 to-rose-500/5 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-[60px] pointer-events-none" />
              <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 mb-1">🎁 BONUS OFFERT</Badge>
                    <p className="font-bold text-lg">P15 — Humanisation Anti-Détection IA</p>
                    <p className="text-sm text-muted-foreground">Rendez votre contenu indétectable par les outils anti-IA</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-sm px-4 py-1.5 shrink-0">Inclus gratuitement</Badge>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ COMMENT ÇA MARCHE ═══════════════════════════ */}
      <section className="py-14 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="text-center mb-10">
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-extrabold mb-5">
              Comment ça marche
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-lg">4 étapes. Un seul workflow. Un ebook professionnel.</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="relative text-center group">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px bg-border" />
                )}
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Étape {step.num}</span>
                <h3 className="font-bold text-xl mt-1 mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ APERÇU GRATUIT ═══════════════════════════ */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
            <motion.div variants={fadeUp}>
            <Card className="relative overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-card to-violet-500/5">
              {/* Decorative orbs */}
              <div className="absolute -top-20 -right-20 w-56 h-56 bg-primary/15 rounded-full blur-[80px]" />
              <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-violet-500/10 rounded-full blur-[60px]" />

              <CardContent className="relative p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Left: Visual roadmap mini */}
                  <div className="flex-1 space-y-4">
                    <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 mb-2">
                      <Eye className="w-3 h-3 mr-1" />
                      Aperçu du parcours
                    </Badge>
                    <h3 className="text-2xl md:text-3xl font-extrabold">
                      Curieux de voir le parcours ?
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Explorez la <span className="font-semibold text-foreground">roadmap interactive</span> : les 4 phases, les 15 étapes, et comprenez exactement comment votre ebook sera créé — avant même de commencer.
                    </p>

                    {/* Mini phases preview */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {[
                        { num: '1', label: 'Positionner', emoji: '🎯', color: 'bg-violet-500/10 border-violet-500/20 text-violet-500' },
                        { num: '2', label: 'Produire', emoji: '✍️', color: 'bg-amber-500/10 border-amber-500/20 text-amber-500' },
                        { num: '3', label: 'Optimiser', emoji: '📦', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' },
                        { num: '4', label: 'Perfectionner', emoji: '🧠', color: 'bg-sky-500/10 border-sky-500/20 text-sky-500' },
                      ].map((p) => (
                        <div key={p.num} className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${p.color} text-sm font-medium`}>
                          <span>{p.emoji}</span>
                          <span>{p.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: CTA */}
                  <div className="flex flex-col items-center gap-4 shrink-0">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-2xl shadow-primary/30">
                      <Play className="w-10 h-10 text-white ml-1" />
                    </div>
                    <Button
                      size="lg"
                      onClick={() => navigate('/demo')}
                      className="text-base px-8 py-5 h-auto rounded-2xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 gap-2 group"
                    >
                      Découvrir le parcours
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Sans inscription • Comprenez avant de commencer
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════ AUTHOR SHOWCASE ═══════════════════════ */}
      <div id="author-showcase">
        <AuthorShowcase />
      </div>

      {/* ═══════════════════════ PREUVE REVENUS PASSIFS ═══════════════════════ */}
      <PassiveRevenueProof />

      <section className="py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-10">
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-extrabold mb-5">
              Ce qu'en disent nos utilisateurs
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-lg">Rejoignez les auteurs qui publient avec confiance</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}>
                <Card className="h-full border hover:border-primary/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="pt-6 pb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                        {t.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                      <div className="ml-auto flex gap-0.5">
                        {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
                      </div>
                    </div>
                    <p className="text-foreground/85 text-sm leading-relaxed italic">"{t.text}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ VALEUR ═══════════════════════════════════ */}
      <section className="py-14 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-10">
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-extrabold mb-5">
              Combien coûte réellement un ebook professionnel ?
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid md:grid-cols-3 gap-6 mb-12">
            {valuePrices.map((v, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}>
                <Card className={`border-2 ${v.borderColor} ${v.bgColor} text-center hover:shadow-lg transition-shadow`}>
                  <CardContent className="pt-8 pb-8">
                    <p className="text-base font-semibold mb-3">{v.label}</p>
                    <p className={`text-3xl font-extrabold ${v.color}`}>{v.price}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-2xl px-8 py-4">
              <Sparkles className="w-5 h-5 text-violet-500" />
              <p className="text-xl font-bold">EbookStudio Pro <span className="text-primary">remplace cette chaîne complète</span></p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ GUIDE GRATUIT ═══════════════════════════════ */}
      <section className="py-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-violet-500/10 p-8 shadow-lg shadow-violet-500/10"
        >
          <p className="text-3xl mb-3">🎁</p>
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
            Nouveau sur EbookStudio ?
          </h3>
          <p className="text-muted-foreground text-sm md:text-base mb-6 max-w-lg mx-auto">
            Commencez par le guide gratuit pour comprendre la méthode et avancer plus vite.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/20 text-base px-8 py-6"
            onClick={() => window.open('https://www.trafic-affiliation.com/captureebookstudio2026#formulaire', '_blank')}
          >
            🎁 Commencer par le guide gratuit
          </Button>
        </motion.div>
      </section>




      {/* Tutoriel Vidéo Clé API */}
      <section className="py-16 px-4" id="tuto-api">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp}>
              <Badge className="mb-4 bg-blue-500/10 text-blue-500 border-blue-500/20 px-4 py-2">
                <Play className="w-4 h-4 mr-2" />
                Tutoriel Vidéo — 2 min
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-extrabold mb-4">
              🔑 Comment configurer votre clé API
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
              Avant de créer votre premier ebook, configurez votre clé OpenAI en 2 minutes. 
              Un ebook complet coûte entre 0,30€ et 0,80€.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="rounded-xl overflow-hidden border border-border shadow-lg">
              <video 
                controls 
                className="w-full aspect-video"
                poster=""
                preload="metadata"
              >
                <source src="/videos/tuto-cle-api.mp4" type="video/mp4" />
                Votre navigateur ne supporte pas la vidéo.
              </video>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <SalesFaq />

      {/* Final CTA */}
      <section className="py-14 px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="max-w-3xl mx-auto text-center">
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-extrabold mb-4">
            Prêt à lancer votre workflow éditorial ?
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-muted-foreground mb-8 text-lg">
            Rejoignez les auteurs qui publient sur Amazon KDP avec un système structuré
          </motion.p>
          <motion.div variants={fadeUp} custom={2}>
            <Button size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-xl shadow-violet-500/25"
              onClick={handlePlanClick}>
              {isVipAvailable ? `Débloquer l'accès fondateur – 37€` : 'Accéder maintenant – 147€'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">Paiement unique • Accès à vie • Mises à jour gratuites</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Finaliser votre commande</DialogTitle>
            <DialogDescription>Entrez votre email pour accéder au paiement sécurisé</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input ref={emailInputRef} type="email" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} autoComplete="email" />
            <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isLoading}>
              {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Redirection...</> : <>Passer au paiement<ArrowRight className="w-4 h-4 ml-2" /></>}
            </Button>
            <p className="text-xs text-muted-foreground text-center">Paiement sécurisé • Garantie 30 jours</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Zoom Calendly */}
      <section className="py-10 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-violet-500/10 border-y border-violet-500/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-violet-500" />
              <span className="text-lg font-semibold">🎥 Dispo en Zoom — Voyez l'outil en direct !</span>
            </div>
            <a href="https://calendly.com/boubetgeorges/nouvelle-reunion" target="_blank" rel="noopener noreferrer">
              <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold px-6">
                📅 Réserver un créneau
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">EbookStudio Pro</h3>
              <p className="text-gray-400 text-sm">Le workflow éditorial IA #1 en France pour Amazon KDP.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gray-200">📚 Guides</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate("/ecrire-livre-chatgpt")} className="text-gray-400 hover:text-violet-400 transition-colors">Écrire un livre avec ChatGPT</button></li>
                <li><button onClick={() => navigate("/creer-ebook-ia")} className="text-gray-400 hover:text-violet-400 transition-colors">Créer un ebook avec l'IA</button></li>
                <li><button onClick={() => navigate("/generateur-ebook")} className="text-gray-400 hover:text-violet-400 transition-colors">Générateur ebook IA</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gray-200">🚀 Produit</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate("/demo")} className="text-gray-400 hover:text-violet-400 transition-colors">Essai gratuit</button></li>
                <li><button onClick={() => navigate("/valeur-offre")} className="text-gray-400 hover:text-violet-400 transition-colors">Valeur de l'offre</button></li>
                <li><button onClick={() => navigate("/formation")} className="text-gray-400 hover:text-violet-400 transition-colors">Formation</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gray-200">💡 Ressources</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate("/faq")} className="text-gray-400 hover:text-violet-400 transition-colors">FAQ</button></li>
                <li><button onClick={() => navigate("/blog")} className="text-gray-400 hover:text-violet-400 transition-colors">Blog</button></li>
                <li><button onClick={() => navigate("/affiliation")} className="text-gray-400 hover:text-violet-400 transition-colors">Affiliation</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gray-200">📧 Newsletter</h4>
              <p className="text-gray-400 text-sm mb-3">Conseils KDP gratuits</p>
              <NewsletterForm />
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-xs text-gray-500">© 2026 EbookStudio Pro • Workflow Éditorial IA pour Amazon KDP • Tous droits réservés</p>
          </div>
        </div>
      </footer>
      <ExitIntentPopup />
    </div>
  );
};

export default SalesPage;
