import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { trackEvent, trackCTAClick, trackNewsletterSignup, trackPlanSelect, trackBeginCheckout, trackDemoClick, trackOffresClick } from "@/utils/analytics";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, BookOpen, Zap, Star, ArrowRight, Play, Loader2, Clock, HelpCircle, CheckCircle, Gift, Send, Rocket, ShieldCheck, Crown, BarChart3, Landmark, PenTool, BadgeCheck, Package, Search, Brain, Link2, Eye, RotateCcw, Palette, Trophy, Shield, Cpu, Mic, Image, Globe, Headphones, Key, GraduationCap, Users, TrendingUp, Award, Timer, Flame } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import ExitIntentPopup from "@/components/sales/ExitIntentPopup";
import SalesFaq from "@/components/sales/SalesFaq";
import AuthorShowcase from "@/components/sales/AuthorShowcase";
import SpotsCounter from "@/components/sales/SpotsCounter";
import RoiCalculator from "@/components/sales/RoiCalculator";
import SocialProofToast from "@/components/sales/SocialProofToast";
import PriceComparison from "@/components/sales/PriceComparison";
import CountdownTimer from "@/components/sales/CountdownTimer";
import UrgencyBanner from "@/components/sales/UrgencyBanner";
import GuaranteeSection from "@/components/sales/GuaranteeSection";
import ProgressEngagement from "@/components/sales/ProgressEngagement";
import InteractiveDemo from "@/components/sales/InteractiveDemo";
import WhoIsThisFor from "@/components/sales/WhoIsThisFor";
import TonightOutcomes from "@/components/sales/TonightOutcomes";
import ExclusiveFlashBanner from "@/components/sales/ExclusiveFlashBanner";
import BeforeAfterSection from "@/components/sales/BeforeAfterSection";
import KdpTestimonials from "@/components/sales/KdpTestimonials";
import { FloatingMobileCta } from "@/components/sales/FloatingMobileCta";

// ════════════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM 2026 — Palette Premium
// ════════════════════════════════════════════════════════════════════════════════

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
  })
};

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } }
};

// Prix
const LAUNCH_PRICE = 67;
const NORMAL_PRICE = 147;
const LAUNCH_END = new Date('2026-06-30T23:59:59').getTime();

const useCountdown = (targetDate: number) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, targetDate - Date.now());
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return timeLeft;
};

// Newsletter Form
const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setLoading(true);
    try {
      await supabase.functions.invoke("add-to-email-sequence", { body: { email: email.trim().toLowerCase() } });
      trackNewsletterSignup("footer");
      setDone(true);
    } catch { toast.error("Erreur"); }
    setLoading(false);
  };

  if (done) return <p className="text-emerald-400 text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4" />Inscrit !</p>;

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} 
        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 h-10 rounded-xl" />
      <Button type="submit" disabled={loading} className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold h-10 px-4 rounded-xl">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
      </Button>
    </form>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

const SalesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const countdown = useCountdown(LAUNCH_END);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [hasWorkflowProgress, setHasWorkflowProgress] = useState(false);
  const [hasSubscriberAccess, setHasSubscriberAccess] = useState(false);
  const [hasAdminSession, setHasAdminSession] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [trialEmail, setTrialEmail] = useState("");
  const [trialLoading, setTrialLoading] = useState(false);
  const [trialResult, setTrialResult] = useState<{ ok: boolean; accessCode?: string; email?: string } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    if (ref) sessionStorage.setItem('referral_code', ref);
  }, [location.search]);

  useEffect(() => {
    document.title = "EbookStudio Pro 2026 — Créez des ebooks professionnels avec l'IA";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Workflow IA complet pour créer et publier des ebooks sur Amazon KDP. Gemini 3 Flash, couvertures IA, audiobooks. 67€ à vie.");
  }, []);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const refreshAccessState = async () => {
      const savedWorkflow = localStorage.getItem('ebook_workflow_progress');
      const savedSubscriberEmail = localStorage.getItem('subscriber_email');
      const savedSubscriberData = localStorage.getItem('subscriber_data');

      let subscriberAccess = false;

      if (savedSubscriberEmail && savedSubscriberData) {
        try {
          const parsed = JSON.parse(savedSubscriberData);
          subscriberAccess = Boolean(
            parsed?.access_code ||
            parsed?.status === 'active' ||
            parsed?.plan_type === 'lifetime' ||
            parsed?.plan_type === 'pro'
          );
        } catch {
          subscriberAccess = false;
        }
      }

      const { data: { session } } = await supabase.auth.getSession();

      setHasWorkflowProgress(Boolean(savedWorkflow));
      setHasSubscriberAccess(subscriberAccess);
      setHasAdminSession(Boolean(session));
    };

    void refreshAccessState();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      setTimeout(() => {
        void refreshAccessState();
      }, 0);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handlePlanClick = () => {
    trackPlanSelect('pro', LAUNCH_PRICE);
    trackCTAClick('plan_click', 'trial_modal');
    setShowTrialModal(true);
  };

  const handleStartTrial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trialEmail.includes("@")) {
      toast.error("Veuillez entrer un email valide");
      return;
    }
    setTrialLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("start-trial", {
        body: { email: trialEmail.trim().toLowerCase() },
      });
      if (error) throw error;
      if (data?.ok) {
        setTrialResult(data);
        localStorage.setItem("subscriber_email", data.email);
        localStorage.setItem("subscriber_data", JSON.stringify({
          email: data.email,
          access_code: data.accessCode,
          status: data.status,
          plan_type: 'pro',
        }));
        trackBeginCheckout('pro', 0);
        toast.success("🎉 Essai gratuit activé !");
      } else {
        toast.error(data?.error || "Erreur lors de l'activation");
      }
    } catch (err: any) {
      toast.error(err?.message || "Erreur serveur");
    } finally {
      setTrialLoading(false);
    }
  };

  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden pt-[42px]">
      <Helmet>
        <title>EbookStudio Pro — Créez des Ebooks avec l'IA | 67€ à Vie</title>
        <meta name="description" content="Créez un ebook complet en moins d'une heure avec l'IA. Plan structuré, rédaction, couverture, audiobook et export KDP. Accès à vie pour 67€." />
        <meta property="og:title" content="EbookStudio Pro — Créez des Ebooks avec l'IA" />
        <meta property="og:description" content="Générez des ebooks professionnels avec l'IA : plan, rédaction, couverture, audiobook. 67€ accès à vie." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://video-lexicon-translator-08.lovable.app/offres" />
        <link rel="canonical" href="https://video-lexicon-translator-08.lovable.app/offres" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "EbookStudio Pro",
          "description": "Plateforme de création d'ebooks et audiobooks par IA avec Gemini 3 Flash. Créez, publiez et vendez sur Amazon KDP.",
          "brand": { "@type": "Brand", "name": "EbookStudio" },
          "image": "https://ebookstudio.fr/og-image.png",
          "offers": {
            "@type": "Offer",
            "price": "67",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock",
            "priceValidUntil": "2026-06-30",
            "url": "https://ebookstudio.fr/offres"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "127",
            "bestRating": "5",
            "worstRating": "1"
          },
          "review": [
            { "@type": "Review", "author": { "@type": "Person", "name": "Marie D." }, "reviewRating": { "@type": "Rating", "ratingValue": "5" }, "reviewBody": "J'ai publié 3 ebooks en 2 semaines. Le workflow IA est incroyable, tout est guidé étape par étape." },
            { "@type": "Review", "author": { "@type": "Person", "name": "Thomas L." }, "reviewRating": { "@type": "Rating", "ratingValue": "5" }, "reviewBody": "BSR passé de 890 000 à 12 400. 1 847€/mois de revenus passifs grâce aux outils KDP intégrés." },
            { "@type": "Review", "author": { "@type": "Person", "name": "Sophie R." }, "reviewRating": { "@type": "Rating", "ratingValue": "5" }, "reviewBody": "Même sans savoir écrire, l'IA génère des chapitres de qualité pro. Mon premier ebook publié en 45 minutes." }
          ]
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "Comment fonctionne le paiement unique à 67€ ?", "acceptedAnswer": { "@type": "Answer", "text": "Vous payez 67€ une seule fois via PayPal et vous obtenez un accès à vie à l'ensemble de la plateforme. Pas d'abonnement mensuel, pas de frais cachés. Des facilités sont disponibles : 2×35€ ou 3×25€." } },
            { "@type": "Question", "name": "Ai-je besoin de compétences techniques ou de savoir écrire ?", "acceptedAnswer": { "@type": "Answer", "text": "Absolument pas ! EbookStudio est conçu pour les débutants complets. L'IA Gemini 3 Flash rédige l'intégralité de votre ebook." } },
            { "@type": "Question", "name": "Qu'est-ce que Gemini 3 Flash et combien ça coûte ?", "acceptedAnswer": { "@type": "Answer", "text": "Gemini 3 Flash est l'IA de Google. Coût moyen : 0,20€ à 0,50€ par ebook complet. Un guide vidéo est inclus après l'achat." } },
            { "@type": "Question", "name": "Puis-je vendre les ebooks générés sur Amazon KDP ?", "acceptedAnswer": { "@type": "Answer", "text": "Oui, vous gardez 100% des droits sur tout ce que vous créez. Nos outils KDP intégrés vous aident à maximiser vos ventes." } },
            { "@type": "Question", "name": "Combien de temps faut-il pour créer un ebook complet ?", "acceptedAnswer": { "@type": "Answer", "text": "Avec le workflow en 7 étapes guidées par l'IA, vous pouvez avoir un ebook complet en moins d'une heure." } },
            { "@type": "Question", "name": "Que se passe-t-il si je ne suis pas satisfait ?", "acceptedAnswer": { "@type": "Answer", "text": "Nous offrons une garantie satisfait ou remboursé de 30 jours, sans condition." } },
            { "@type": "Question", "name": "Le prix de 67€ va-t-il augmenter ?", "acceptedAnswer": { "@type": "Answer", "text": "Oui. Le prix normal passera à 147€ le 1er juillet. Le tarif de lancement est à 67€ à vie avec toutes les futures mises à jour incluses." } },
            { "@type": "Question", "name": "Puis-je créer des audiobooks et des BD ?", "acceptedAnswer": { "@type": "Answer", "text": "Oui ! EbookStudio inclut un module audiobook et un module BD/Comics. Tout est inclus sans surcoût." } },
            { "@type": "Question", "name": "Comment fonctionne le paiement en plusieurs fois ?", "acceptedAnswer": { "@type": "Answer", "text": "Vous pouvez payer en 2 fois (2×35€) ou 3 fois (3×25€) via PayPal. Accès immédiat dès le premier paiement." } }
          ]
        })}</script>
      </Helmet>
      
      {/* ═══════════════════════════════════════ URGENCY BANNER ═══════════════════════════════════════ */}
      <UrgencyBanner />

      {/* ═══════════════════════════════════════ TOP BAR ═══════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-cyan-600 via-cyan-500 to-emerald-500 text-slate-900 py-2.5 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-4 text-sm font-semibold">
          <Flame className="w-4 h-4" />
          <span>OFFRE DE LANCEMENT — Fin le 30 juin 2026</span>
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/20 rounded-lg px-3 py-1">
            <span className="tabular-nums font-bold">{countdown.days}j</span>
            <span>:</span>
            <span className="tabular-nums font-bold">{countdown.hours}h</span>
            <span>:</span>
            <span className="tabular-nums font-bold">{countdown.minutes}m</span>
          </div>
          <Badge className="bg-slate-900 text-cyan-400 border-0 font-bold">−150€</Badge>
        </div>
      </div>

      {/* ═══════════════════════════════════════ HEADER ═══════════════════════════════════════ */}
      <header className="sticky top-[42px] z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/offres" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <span className="font-bold text-lg">EbookStudio</span>
              <span className="text-cyan-400 font-bold ml-1">Pro</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors">Fonctionnalités</a>
            <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">Tarif</a>
            <Link to="/nouveautes-2026" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">Nouveautés 2026</Link>
            <Link to="/demo" className="text-slate-300 hover:text-white transition-colors">Démo</Link>
            <Link to="/subscription" className="text-slate-300 hover:text-white transition-colors">Connexion</Link>
          </nav>

          <Button onClick={scrollToPricing} className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl px-5">
            <Sparkles className="w-4 h-4 mr-2" />
            67€ à vie
          </Button>
        </div>
      </header>

      {/* ═══════════════════════════════════════ FLASH EXCLUSIF ═══════════════════════════════════════ */}
      <ExclusiveFlashBanner />

      {/* ═══════════════════════════════════════ HERO ═══════════════════════════════════════ */}
      <section className="relative py-20 sm:py-28 px-4">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(6,182,212,0.15),transparent)]" />
        <div className="absolute top-40 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl mx-auto text-center relative z-10">
          
          <motion.div variants={fadeIn} className="mb-6">
            <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 px-4 py-2 text-sm font-semibold">
              <Cpu className="w-4 h-4 mr-2" />
              Propulsé par Gemini 3 Flash & Imagen 3
            </Badge>
          </motion.div>

          <motion.h1 variants={fadeIn} custom={1} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-6">
            Créez des ebooks
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              professionnels
            </span>
            <br />
            en moins d'une heure
          </motion.h1>

          <motion.p variants={fadeIn} custom={2} className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Le workflow IA complet qui a déjà généré <span className="text-white font-semibold">+35 ebooks publiés</span> sur Amazon KDP.
            Rédaction, couvertures, audiobooks — tout en un.
          </motion.p>

          {/* Stats */}
          <motion.div variants={fadeIn} custom={3} className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-10">
            {[
              { value: "35+", label: "Ebooks publiés" },
              { value: "~0,30€", label: "Coût par ebook" },
              { value: "45 min", label: "Temps moyen" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl sm:text-4xl font-black text-white">{stat.value}</p>
                <p className="text-sm text-white/70 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {(hasWorkflowProgress || hasSubscriberAccess || hasAdminSession) && (
            <motion.div variants={fadeIn} custom={3.5} className="mb-8">
              <div className="mx-auto max-w-2xl rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-4 sm:p-5 shadow-lg shadow-cyan-500/10 backdrop-blur-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-left">
                    <p className="text-sm font-semibold text-cyan-400">Session détectée</p>
                    <p className="text-sm text-white/75">
                      {hasWorkflowProgress
                        ? 'Votre progression est sauvegardée : vous pouvez reprendre immédiatement.'
                        : 'Votre accès a été détecté : vous pouvez rouvrir le générateur.'}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      type="button"
                      onClick={() => navigate(hasAdminSession || hasSubscriberAccess ? '/ebook-planner' : '/subscription')}
                      className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-900 font-bold rounded-xl"
                    >
                      <Rocket className="w-4 h-4 mr-2" />
                      {hasAdminSession || hasSubscriberAccess ? 'Reprendre le générateur' : 'Retrouver mon accès'}
                    </Button>

                    {hasAdminSession && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/admin')}
                        className="border-cyan-500/40 text-cyan-400 hover:text-white hover:bg-cyan-500/10 rounded-xl"
                      >
                        Dashboard admin
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* CTA Principal */}
          <motion.div variants={fadeIn} custom={4} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-5">
            <Button size="lg" onClick={handlePlanClick}
              className="w-full sm:w-auto text-lg px-10 py-7 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-900 font-bold rounded-2xl shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:-translate-y-1">
              <Rocket className="w-5 h-5 mr-2" />
              Je publie mon 1er ebook — 67€ à vie
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/demo')}
              className="w-full sm:w-auto text-base px-8 py-6 border-cyan-500/50 text-cyan-400 hover:text-white hover:border-cyan-400 hover:bg-cyan-500/10 rounded-2xl">
              <Play className="w-5 h-5 mr-2" />
              Voir la démo
            </Button>
          </motion.div>

          {/* CTA Gratuit — capture de leads */}
          <motion.div variants={fadeIn} custom={4.5} className="mb-6">
            <a
              href="https://www.trafic-affiliation.com/ebookstudio_capture"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTAClick('hero_free_guide', 'capture_tunnel')}
              className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold text-sm transition-colors group"
            >
              <Gift className="w-4 h-4 group-hover:animate-bounce" />
              Pas encore prêt ? Recevez notre guide gratuit : 10 Niches KDP Rentables
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

          <motion.div variants={fadeIn} custom={5} className="flex flex-wrap justify-center gap-4 text-sm text-white/70">
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" />Paiement unique</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" />Accès à vie</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" />Garantie 30 jours</span>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════ TRIAL INLINE BANNER ═══════════════════════════════════════ */}
      <section className="py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-emerald-500/10 border-2 border-emerald-500/30 rounded-2xl p-6 sm:p-8 overflow-hidden">
            {/* Shimmer */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
            />
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Gift className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-white mb-1">
                  🎁 Essai gratuit 7 jours — Aucune carte requise
                </h3>
                <p className="text-white/70 text-sm">
                  Testez toutes les fonctionnalités Pro gratuitement. Si ça ne vous plaît pas, vous ne payez rien.
                </p>
              </div>
              <Button
                onClick={handlePlanClick}
                className="shrink-0 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-900 font-bold px-6 py-5 rounded-xl shadow-lg shadow-emerald-500/25 whitespace-nowrap"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Commencer gratuitement
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════ VIDEO PRÉSENTATION ═══════════════════════════════════════ */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-8">
            <motion.p variants={fadeIn} className="text-cyan-400 font-semibold mb-3 uppercase tracking-wider text-sm">Présentation vidéo</motion.p>
            <motion.h2 variants={fadeIn} custom={1} className="text-3xl sm:text-4xl font-black mb-3">
              Découvrez l'Offre Fondatrice
            </motion.h2>
            <motion.p variants={fadeIn} custom={2} className="text-white/70">Tout ce qui est inclus, en moins de 3 minutes</motion.p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-2xl overflow-hidden border-2 border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
            <video
              controls
              preload="metadata"
              poster="/images/video-poster-offre.jpg"
              className="w-full aspect-video bg-slate-900"
              playsInline
            >
              <source src="/videos/ebookstudio-offre-fondatrice.mp4" type="video/mp4" />
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ SOCIAL PROOF ═══════════════════════════════════════ */}
      <section className="py-12 border-y border-slate-800/50 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {['MD','TL','SR','JP','CB'].map((a, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-xs text-slate-900 font-bold border-2 border-slate-900">{a}</div>
                ))}
              </div>
              <div>
                <p className="font-semibold text-white">47+ auteurs</p>
                <p className="text-xs text-white/60">utilisent EbookStudio</p>
              </div>
            </div>
            <div className="h-10 w-px bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-2">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
              <span className="font-bold text-white ml-2">4.8/5</span>
              <span className="text-white/60 text-sm">(47 avis)</span>
            </div>
            <div className="h-10 w-px bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="font-semibold text-white">#1 en France</p>
                <p className="text-xs text-white/60">Workflow KDP IA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ FEATURES ═══════════════════════════════════════ */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.p variants={fadeIn} className="text-cyan-400 font-semibold mb-3 uppercase tracking-wider text-sm">Technologie 2026</motion.p>
            <motion.h2 variants={fadeIn} custom={1} className="text-3xl sm:text-4xl md:text-5xl font-black mb-5">
              Tout ce dont vous avez besoin
            </motion.h2>
            <motion.p variants={fadeIn} custom={2} className="text-white/80 text-lg max-w-2xl mx-auto">
              Un écosystème complet pour créer, optimiser et publier vos ebooks sur Amazon KDP
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Cpu, title: "Gemini 3 Flash", desc: "IA la plus rapide de Google pour une rédaction instantanée", color: "from-blue-500 to-cyan-500" },
              { icon: Image, title: "Imagen 3", desc: "Couvertures photoréalistes générées en quelques secondes", color: "from-violet-500 to-purple-500" },
              { icon: Headphones, title: "Azure Neural Voices", desc: "Audiobooks avec 7 voix neuronales premium", color: "from-emerald-500 to-teal-500" },
              { icon: Globe, title: "Multi-langues", desc: "Rédaction et traduction dans 30+ langues", color: "from-amber-500 to-orange-500" },
              { icon: Search, title: "SEO Amazon", desc: "Mots-clés optimisés pour le référencement KDP", color: "from-pink-500 to-rose-500" },
              { icon: Package, title: "Export Pro", desc: "PDF, EPUB, Word — formats KDP et distribution", color: "from-indigo-500 to-blue-500" },
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeIn} custom={i}>
                <Card className="h-full bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 group">
                  <CardContent className="pt-8 pb-8">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-xl text-white mb-2">{feature.title}</h3>
                    <p className="text-white/70 leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ DÉMO INTERACTIVE ═══════════════════════════════════════ */}
      <InteractiveDemo />

      {/* ═══════════════════════════════════════ POUR QUI ? ═══════════════════════════════════════ */}
      <WhoIsThisFor />

      {/* ═══════════════════════════════════════ AVANT/APRÈS ═══════════════════════════════════════ */}
      <BeforeAfterSection />

      {/* ═══════════════════════════════════════ TÉMOIGNAGES KDP ═══════════════════════════════════════ */}
      <KdpTestimonials />

      {/* ═══════════════════════════════════════ COMPARATIF PRIX ═══════════════════════════════════════ */}
      <PriceComparison />

      {/* ═══════════════════════════════════════ LEAD CAPTURE GRATUIT ═══════════════════════════════════════ */}
      <section className="py-16 px-4 bg-gradient-to-b from-slate-950 to-slate-900">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-3xl mx-auto">
          <Card className="bg-gradient-to-br from-amber-950/40 to-slate-900 border-2 border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/10">
            <CardContent className="p-8 md:p-10">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <motion.h2 variants={fadeIn} className="text-2xl sm:text-3xl font-black text-white">
                  Pas encore décidé ?
                </motion.h2>
                <motion.p variants={fadeIn} custom={1} className="text-white/80 text-lg max-w-xl mx-auto">
                  Recevez <span className="text-amber-400 font-bold">10 niches KDP rentables</span> gratuitement et commencez à valider votre marché avant de vous lancer.
                </motion.p>
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/70 pt-2">
                  <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" />Guide PDF offert</span>
                  <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" />Niches validées 2026</span>
                  <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" />Accès immédiat</span>
                </div>
                <motion.div variants={fadeIn} custom={2} className="pt-4">
                  <a
                    href="https://www.trafic-affiliation.com/ebookstudio_capture"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackCTAClick('mid_page_free_guide', 'capture_tunnel')}
                  >
                    <Button size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-bold rounded-2xl shadow-2xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 hover:-translate-y-1">
                      <Gift className="w-5 h-5 mr-2" />
                      Recevoir les 10 niches gratuites
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                  <p className="text-white/40 text-xs mt-3">🔒 Aucune carte bancaire requise • Accès instantané</p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════ CE SOIR VOUS AUREZ ═══════════════════════════════════════ */}
      <TonightOutcomes />

      {/* ═══════════════════════════════════════ ROI CALCULATOR ═══════════════════════════════════════ */}
      <section className="py-16 px-4 bg-slate-900/30">
        <div className="max-w-3xl mx-auto">
          <RoiCalculator />
        </div>
      </section>

      {/* ═══════════════════════════════════════ PRICING ═══════════════════════════════════════ */}
      <section id="pricing" className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(6,182,212,0.08),transparent)]" />
        
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-10">
            <motion.div variants={fadeIn}>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 px-5 py-2 font-semibold mb-5">
                <Gift className="w-4 h-4 mr-2" />
                ESSAI GRATUIT 7 JOURS — Puis {LAUNCH_PRICE}€ à vie
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeIn} custom={1} className="text-4xl sm:text-5xl md:text-6xl font-black mb-4">
              Essayez <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">gratuitement</span> pendant 7 jours
            </motion.h2>
            <motion.p variants={fadeIn} custom={2} className="text-white/80 text-lg">
              Accès complet à toutes les fonctionnalités Pro. Si ça ne vous plaît pas, annulez avant 7 jours — <strong className="text-white">0€ facturé</strong>.
            </motion.p>
          </motion.div>

          {/* Pricing Card */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            <Card className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-cyan-500/10">
              <CardContent className="p-8 md:p-12">
                {/* Price */}
                <div className="text-center mb-10">
                  <div className="flex items-baseline justify-center gap-3 mb-2">
                    <span className="text-7xl md:text-8xl font-black text-white">0€</span>
                  </div>
                  <p className="text-white/80 text-lg">pendant <span className="text-cyan-400 font-bold">7 jours</span></p>
                  <p className="text-white/50 mt-2">Puis <span className="line-through">{NORMAL_PRICE}€</span> <span className="text-cyan-400 font-bold">{LAUNCH_PRICE}€</span> paiement unique — Accès à vie</p>
                </div>

                {/* Features */}
                <div className="grid sm:grid-cols-2 gap-4 mb-10">
                  {[
                    "Workflow 15 rôles IA complet",
                    "Gemini 3 Flash — rédaction ultra-rapide",
                    "Imagen 3 — couvertures photoréalistes",
                    "Azure Neural — audiobooks premium",
                    "P15 Humanisation Anti-IA",
                    "Export PDF / EPUB / Word",
                    "🎓 Formation 18 modules (147€ offerts)",
                    "SEO Amazon automatisé",
                    "Traduction 30+ langues",
                    "Mises à jour gratuites à vie",
                    "Support prioritaire",
                    "Zoom gratuit avec le créateur",
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-cyan-400" />
                      </div>
                      <span className="text-sm text-white">{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Button size="lg" onClick={handlePlanClick}
                  className="w-full py-8 text-xl font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-900 rounded-2xl shadow-xl shadow-cyan-500/20">
                  <Rocket className="w-6 h-6 mr-2" />
                  Commencer mon essai gratuit de 7 jours
                  <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
                <p className="text-center text-white/50 text-xs mt-3 flex items-center justify-center gap-3">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />Aucune facturation pendant 7 jours</span>
                  <span>•</span>
                  <span>Annulation en 1 clic</span>
                  <span>•</span>
                  <span>Accès instantané</span>
                </p>

                {/* Trial details */}
                <div className="mt-8 pt-6 border-t border-slate-800">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {[
                      { label: "Jour 1–7", desc: "Accès complet gratuit", icon: "🎉" },
                      { label: "Jour 5", desc: "Rappel par email", icon: "📧" },
                      { label: "Jour 8", desc: `${LAUNCH_PRICE}€ si vous gardez`, icon: "💎" },
                    ].map((step, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-800/50">
                        <p className="text-lg mb-1">{step.icon}</p>
                        <p className="font-bold text-white text-sm">{step.label}</p>
                        <p className="text-xs text-white/60">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Garantie */}
                <div className="flex items-center justify-center gap-3 mt-8 text-white/60 text-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span>Paiement sécurisé • Accès immédiat • Garantie 30 jours</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Garantie */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-8">
            <Card className="bg-emerald-950/30 border-emerald-900/50">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-emerald-400 mb-2">Garantie 30 jours — Satisfait ou remboursé</h3>
                <p className="text-white/80 text-sm">
                  Testez pendant 30 jours. Si vous ne publiez pas votre 1er ebook, on vous rembourse intégralement. <strong className="text-emerald-400">Aucune question posée.</strong>
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Countdown Timer */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-6">
            <CountdownTimer />
          </motion.div>

          {/* Spots Counter */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-6">
            <SpotsCounter />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ AUTHOR SHOWCASE ═══════════════════════════════════════ */}
      <div id="author-showcase">
        <AuthorShowcase />
      </div>

      {/* ═══════════════════════════════════════ GARANTIE ═══════════════════════════════════════ */}
      <GuaranteeSection />

      {/* ═══════════════════════════════════════ FAQ ═══════════════════════════════════════ */}
      <SalesFaq />

      {/* ═══════════════════════════════════════ FINAL CTA ═══════════════════════════════════════ */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(6,182,212,0.06),transparent)]" />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="max-w-3xl mx-auto text-center relative z-10">
          <motion.h2 variants={fadeIn} className="text-3xl sm:text-4xl md:text-5xl font-black mb-5 leading-tight">
            Chaque jour sans ebook publié
            <br />
            <span className="text-white/60">est un jour de revenus perdu.</span>
          </motion.h2>
          <motion.p variants={fadeIn} custom={1} className="text-white/80 mb-8 text-lg">
            Votre premier ebook peut être en ligne sur Amazon ce soir.
          </motion.p>
          <motion.div variants={fadeIn} custom={2}>
            <Button size="lg" onClick={handlePlanClick}
              className="text-lg px-12 py-8 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-900 font-bold rounded-2xl shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:-translate-y-1">
              <Rocket className="w-6 h-6 mr-2" />
              Essai gratuit 7 jours — puis {LAUNCH_PRICE}€ à vie
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
            <p className="text-white/60 text-sm mt-5">0€ pendant 7 jours • Annulation en 1 clic • Garantie 30 jours</p>
            <p className="text-white/40 text-xs mt-2 flex items-center justify-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              Rejoignez +47 auteurs qui publient déjà avec EbookStudio
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════ FOOTER ═══════════════════════════════════════ */}
      <footer className="py-16 border-t border-slate-800 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-10 mb-10">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-slate-900" />
                </div>
                <h3 className="text-lg font-bold text-white">EbookStudio Pro</h3>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">Le workflow IA #1 en France pour Amazon KDP.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white text-sm uppercase tracking-wider">Guides</h4>
              <ul className="space-y-2.5 text-sm">
                <li><button onClick={() => navigate("/ecrire-livre-chatgpt")} className="text-white/60 hover:text-cyan-400 transition-colors">Écrire avec l'IA</button></li>
                <li><button onClick={() => navigate("/creer-ebook-ia")} className="text-white/60 hover:text-cyan-400 transition-colors">Créer un ebook IA</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white text-sm uppercase tracking-wider">Produit</h4>
              <ul className="space-y-2.5 text-sm">
                <li><button onClick={() => navigate("/demo")} className="text-white/60 hover:text-cyan-400 transition-colors">Démo gratuite</button></li>
                <li><button onClick={() => navigate("/formation")} className="text-white/60 hover:text-cyan-400 transition-colors">Formation</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white text-sm uppercase tracking-wider">Légal</h4>
              <ul className="space-y-2.5 text-sm">
                <li><button onClick={() => navigate("/mentions-legales")} className="text-white/60 hover:text-cyan-400 transition-colors">Mentions légales</button></li>
                <li><button onClick={() => navigate("/cgv")} className="text-white/60 hover:text-cyan-400 transition-colors">CGV</button></li>
                <li><button onClick={() => navigate("/politique-confidentialite")} className="text-white/60 hover:text-cyan-400 transition-colors">Confidentialité</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white text-sm uppercase tracking-wider">Newsletter</h4>
              <p className="text-white/60 text-sm mb-4">Conseils KDP et IA gratuits</p>
              <NewsletterForm />
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-xs text-white/40">© 2026 EbookStudio Pro — Tous droits réservés</p>
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════ STICKY MOBILE CTA ═══════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 p-3 safe-area-inset-bottom">
        <Button onClick={handlePlanClick}
          className="w-full py-5 text-base font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-900 rounded-xl">
          <Rocket className="w-4 h-4 mr-2" />
          Accès Pro — {LAUNCH_PRICE}€ à vie
        </Button>
      </div>

      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Remonter en haut"
          className="fixed right-4 bottom-28 md:bottom-8 z-[85] h-11 w-11 rounded-full bg-primary text-primary-foreground shadow-lg hover:opacity-90 transition"
        >
          ↑
        </button>
      )}

      <ExitIntentPopup />
      <SocialProofToast />
      <ProgressEngagement />
      <FloatingMobileCta />

      {/* ═══════════════════════════════════════ TRIAL MODAL ═══════════════════════════════════════ */}
      {showTrialModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => !trialLoading && setShowTrialModal(false)}>
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-8 relative" onClick={e => e.stopPropagation()}>
            <button type="button" onClick={() => !trialLoading && setShowTrialModal(false)} className="absolute top-4 right-4 text-white/50 hover:text-white text-xl">✕</button>
            
            {trialResult?.ok ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Essai activé ! 🎉</h3>
                <p className="text-white/70">Votre accès gratuit de 7 jours est prêt.</p>
                <div className="bg-slate-800 rounded-xl p-4 space-y-2">
                  <p className="text-sm text-white/60">Votre code d'accès :</p>
                  <p className="text-2xl font-mono font-bold text-cyan-400">{trialResult.accessCode}</p>
                  <p className="text-sm text-white/60">Email : {trialResult.email}</p>
                </div>
                <Button size="lg" onClick={() => navigate("/subscription")} className="w-full py-6 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-900 font-bold rounded-xl">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Se connecter maintenant
                </Button>
              </div>
            ) : (
              <form onSubmit={handleStartTrial} className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto">
                    <Gift className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Essai gratuit 7 jours</h3>
                  <p className="text-white/60 text-sm">Accès complet à toutes les fonctionnalités Pro. Aucune carte bancaire requise.</p>
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    value={trialEmail}
                    onChange={e => setTrialEmail(e.target.value)}
                    required
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-12 rounded-xl text-center text-lg"
                  />
                </div>
                <Button type="submit" size="lg" disabled={trialLoading} className="w-full py-6 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-900 font-bold rounded-xl text-lg">
                  {trialLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Rocket className="w-5 h-5 mr-2" />}
                  {trialLoading ? "Activation..." : "Démarrer mon essai gratuit"}
                </Button>
                <p className="text-center text-white/40 text-xs">
                  Puis {LAUNCH_PRICE}€ paiement unique si vous souhaitez continuer après 7 jours.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesPage;
