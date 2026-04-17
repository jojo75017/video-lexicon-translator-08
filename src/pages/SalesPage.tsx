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
import SalesFaq from "@/components/sales/SalesFaq";
import AuthorShowcase from "@/components/sales/AuthorShowcase";
import PriceComparison from "@/components/sales/PriceComparison";
import CountdownTimer from "@/components/sales/CountdownTimer";
import UrgencyBanner from "@/components/sales/UrgencyBanner";
import GuaranteeSection from "@/components/sales/GuaranteeSection";
import HeroVideoTeaser from "@/components/sales/HeroVideoTeaser";
import AgentsShowcase from "@/components/sales/AgentsShowcase";
import EbookieAssistant from "@/components/sales/EbookieAssistant";
import BonusStack from "@/components/sales/BonusStack";
import KdpRoiCalculator from "@/components/sales/KdpRoiCalculator";
import EbookGallery from "@/components/sales/EbookGallery";
import EbookAnatomy from "@/components/sales/EbookAnatomy";
import ToolsNavigationBar from "@/components/sales/ToolsNavigationBar";
import ToolsCounterBanner from "@/components/sales/ToolsCounterBanner";

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

  if (done) return <p className="text-primary text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4" />Inscrit !</p>;

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} 
        className="bg-muted border-border text-foreground placeholder:text-muted-foreground h-10 rounded-xl" />
      <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-10 px-4 rounded-xl">
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
    trackCTAClick('plan_click', 'pricing_section');
    navigate('/upsell-paiement?plan=pro');
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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden pt-[42px]">
      <Helmet>
        <title>EbookStudio Pro — Créez des Ebooks avec l'IA | 67€ à Vie</title>
        <meta name="description" content="Créez un ebook complet en moins d'une heure avec l'IA. Plan structuré, rédaction, couverture, audiobook et export KDP. Accès à vie pour 67€." />
        <meta property="og:title" content="EbookStudio Pro — Créez des Ebooks avec l'IA" />
        <meta property="og:description" content="Générez des ebooks professionnels avec l'IA : plan, rédaction, couverture, audiobook. 67€ accès à vie." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ebookstudio.fr/offres" />
        <link rel="canonical" href="https://ebookstudio.fr/offres" />
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
            "reviewCount": "47",
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
      <div className="bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground py-2.5 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-4 text-sm font-semibold">
          <Flame className="w-4 h-4" />
          <span>OFFRE DE LANCEMENT — Fin le 30 juin 2026</span>
          <div className="hidden sm:flex items-center gap-1.5 bg-background/20 rounded-lg px-3 py-1">
            <span className="tabular-nums font-bold">{countdown.days}j</span>
            <span>:</span>
            <span className="tabular-nums font-bold">{countdown.hours}h</span>
            <span>:</span>
            <span className="tabular-nums font-bold">{countdown.minutes}m</span>
          </div>
          <Badge className="bg-card text-primary border-0 font-bold">−150€</Badge>
        </div>
      </div>

      {/* ═══════════════════════════════════════ HEADER ═══════════════════════════════════════ */}
      <header className="sticky top-[42px] z-50 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/offres" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-lg">EbookStudio</span>
              <span className="text-primary font-bold ml-1">Pro</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Fonctionnalités</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Tarif</a>
            <Link to="/nouveautes-2026" className="text-primary hover:text-primary transition-colors font-medium">Nouveautés 2026</Link>
            <Link to="/demo" className="text-muted-foreground hover:text-foreground transition-colors">Démo</Link>
            <Link to="/subscription" className="text-muted-foreground hover:text-foreground transition-colors">Connexion</Link>
          </nav>

          <Button onClick={scrollToPricing} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl px-5">
            <Sparkles className="w-4 h-4 mr-2" />
            67€ à vie
          </Button>
        </div>
      </header>

      {/* (ExclusiveFlashBanner supprimé — refonte) */}

      {/* ═══════════════════════════════════════ HERO ═══════════════════════════════════════ */}
      <section className="relative py-20 sm:py-28 px-4">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,hsl(var(--primary)/0.1),transparent)]" />
        <div className="absolute top-40 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl mx-auto text-center relative z-10">
          
          <motion.div variants={fadeIn} className="mb-6">
            <Badge className="bg-primary/10 text-primary border-primary/30 px-4 py-2 text-sm font-semibold">
              <Cpu className="w-4 h-4 mr-2" />
              Propulsé par Gemini 3 Flash & Imagen 3
            </Badge>
          </motion.div>

          <motion.h1 variants={fadeIn} custom={1} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
            Ton ebook mérite
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Amazon KDP
            </span>
          </motion.h1>

          <motion.p variants={fadeIn} custom={2} className="text-lg sm:text-xl text-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            15 agents IA qui rédigent, illustrent et publient ton livre — <span className="text-primary font-semibold">en moins d'une heure</span>.
          </motion.p>

          {/* Stats — façon KDP Rocket */}
          <motion.div variants={fadeIn} custom={3} className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto mb-10">
            {[
              { value: "21", label: "outils pro" },
              { value: "47 min", label: "par ebook" },
              { value: "+347%", label: "ventes Amazon" },
            ].map((stat, i) => (
              <div key={i} className="text-center bg-card/60 border border-border rounded-2xl py-4 backdrop-blur">
                <p className="text-2xl sm:text-4xl font-black bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">{stat.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {(hasWorkflowProgress || hasSubscriberAccess || hasAdminSession) && (
            <motion.div variants={fadeIn} custom={3.5} className="mb-8">
              <div className="mx-auto max-w-2xl rounded-2xl border border-primary/30 bg-card/70 p-4 sm:p-5 shadow-lg shadow-primary/10 backdrop-blur-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-left">
                    <p className="text-sm font-semibold text-primary">Session détectée</p>
                    <p className="text-sm text-muted-foreground">
                      {hasWorkflowProgress
                        ? 'Votre progression est sauvegardée : vous pouvez reprendre immédiatement.'
                        : 'Votre accès a été détecté : vous pouvez rouvrir le générateur.'}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      type="button"
                      onClick={() => navigate(hasAdminSession || hasSubscriberAccess ? '/ebook-planner' : '/subscription')}
                      className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold rounded-xl"
                    >
                      <Rocket className="w-4 h-4 mr-2" />
                      {hasAdminSession || hasSubscriberAccess ? 'Reprendre le générateur' : 'Retrouver mon accès'}
                    </Button>

                    {hasAdminSession && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/admin')}
                        className="border-primary/40 text-primary hover:text-foreground hover:bg-primary/10 rounded-xl"
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
              className="w-full sm:w-auto text-lg px-10 py-7 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-bold rounded-2xl shadow-2xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1">
              <Rocket className="w-5 h-5 mr-2" />
              Commencer maintenant — 67€
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => document.getElementById('outils')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto text-base px-8 py-6 border-primary/50 text-primary hover:text-foreground hover:border-primary hover:bg-primary/10 rounded-2xl">
              <Sparkles className="w-5 h-5 mr-2" />
              Voir les 15 agents
            </Button>
          </motion.div>

          {/* CTA Gratuit — capture de leads */}
          <motion.div variants={fadeIn} custom={4.5} className="mb-6">
            <a
              href="https://www.trafic-affiliation.com/ebookstudio_capture"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTAClick('hero_free_guide', 'capture_tunnel')}
              className="inline-flex items-center gap-2 text-kdp-orange hover:text-kdp-orange/80 font-semibold text-sm transition-colors group"
            >
              <Gift className="w-4 h-4 group-hover:animate-bounce" />
              Pas encore prêt ? Recevez notre guide gratuit : 10 Niches KDP Rentables
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

          <motion.div variants={fadeIn} custom={5} className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" />Paiement unique</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" />Accès à vie</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" />Garantie 30 jours</span>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════ NAV PILIERS (sticky) ═══════════════════════════════════════ */}
      <ToolsNavigationBar />

      {/* ═══════════════════════════════════════ VIDÉO EXPLICATIVE ═══════════════════════════════════════ */}
      <HeroVideoTeaser />

      {/* ═══════════════════════════════════════ GALERIE EBOOKS RÉSULTATS ═══════════════════════════════════════ */}
      <EbookGallery />

      {/* ═══════════════════════════════════════ ANATOMIE D'UN PROJET ═══════════════════════════════════════ */}
      <EbookAnatomy />

      {/* ═══════════════════════════════════════ TRIAL INLINE BANNER ═══════════════════════════════════════ */}
      <section className="py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative bg-primary/5 border-2 border-primary/20 rounded-2xl p-6 sm:p-8 overflow-hidden">
            {/* Shimmer */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
            />
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Gift className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-foreground mb-1">
                  🎁 Essai gratuit 7 jours — Aucune carte requise
                </h3>
                <p className="text-muted-foreground text-sm">
                  Testez toutes les fonctionnalités Pro gratuitement. Si ça ne vous plaît pas, vous ne payez rien.
                </p>
              </div>
              <Button
                onClick={handlePlanClick}
                className="shrink-0 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-bold px-6 py-5 rounded-xl shadow-lg shadow-primary/25 whitespace-nowrap"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Accéder — 67€ à vie
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════ SOCIAL PROOF ═══════════════════════════════════════ */}
      <section className="py-12 border-y border-border bg-secondary/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {['MD','TL','SR','JP','CB'].map((a, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs text-primary-foreground font-bold border-2 border-background">{a}</div>
                ))}
              </div>
              <div>
                <p className="font-semibold text-foreground">+200 auteurs</p>
                <p className="text-xs text-muted-foreground">utilisent EbookStudio</p>
              </div>
            </div>
            <div className="h-10 w-px bg-muted hidden sm:block" />
            <div className="flex items-center gap-2">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-kdp-orange text-kdp-orange" />)}
              <span className="font-bold text-foreground ml-2">4.8/5</span>
              <span className="text-muted-foreground text-sm">(89 avis)</span>
            </div>
            <div className="h-10 w-px bg-muted hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-kdp-orange/10 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-kdp-orange" />
              </div>
              <div>
                <p className="font-semibold text-foreground">#1 en France</p>
                <p className="text-xs text-muted-foreground">Workflow KDP IA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ FEATURES ═══════════════════════════════════════ */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.p variants={fadeIn} className="text-primary font-semibold mb-3 uppercase tracking-wider text-sm">Technologie 2026</motion.p>
            <motion.h2 variants={fadeIn} custom={1} className="text-3xl sm:text-4xl md:text-5xl font-black mb-5">
              Tout ce dont vous avez besoin
            </motion.h2>
            <motion.p variants={fadeIn} custom={2} className="text-foreground/80 text-lg max-w-2xl mx-auto">
              Un écosystème complet pour créer, optimiser et publier vos ebooks sur Amazon KDP
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Cpu, title: "Gemini 3 Flash", desc: "IA la plus rapide de Google pour une rédaction instantanée", color: "from-primary to-accent" },
              { icon: Image, title: "Imagen 3", desc: "Couvertures photoréalistes générées en quelques secondes", color: "from-primary to-accent" },
              { icon: Headphones, title: "Azure Neural Voices", desc: "Audiobooks avec 7 voix neuronales premium", color: "from-primary to-accent" },
              { icon: Globe, title: "Multi-langues", desc: "Rédaction et traduction dans 30+ langues", color: "from-kdp-orange to-kdp-orange/80" },
              { icon: Search, title: "SEO Amazon", desc: "Mots-clés optimisés pour le référencement KDP", color: "from-primary to-accent" },
              { icon: Package, title: "Export Pro", desc: "PDF, EPUB, Word — formats KDP et distribution", color: "from-primary to-accent" },
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeIn} custom={i}>
                <Card className="h-full bg-card/50 border-border hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 group">
                  <CardContent className="pt-8 pb-8">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <h3 className="font-bold text-xl text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ AGENTS SHOWCASE (#outils) ═══════════════════════════════════════ */}
      <AgentsShowcase />

      {/* ═══════════════════════════════════════ EBOOKIE COPILOTE IA ═══════════════════════════════════════ */}
      <EbookieAssistant />

      {/* ═══════════════════════════════════════ BONUS STACK 935€ → 67€ ═══════════════════════════════════════ */}
      <BonusStack />

      {/* ═══════════════════════════════════════ COMPARATIF PRIX ═══════════════════════════════════════ */}
      <PriceComparison />

      {/* ═══════════════════════════════════════ LEAD CAPTURE GRATUIT ═══════════════════════════════════════ */}
      <section className="py-12 px-4 bg-secondary/50">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-kdp-orange/10 text-kdp-orange border-kdp-orange/20 px-4 py-2 mb-4">
              <Gift className="w-4 h-4 mr-2" />
              GUIDE GRATUIT
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Pas encore prêt ? Commencez par le guide gratuit
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Recevez gratuitement notre guide <strong className="text-foreground">"10 Niches KDP Rentables en 2026"</strong> — la même liste que nos auteurs top-sellers utilisent.
            </p>
            <a
              href="https://www.trafic-affiliation.com/ebookstudio_capture"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTAClick('lead_capture_section', 'capture_tunnel')}
            >
              <Button size="lg" className="bg-kdp-orange hover:bg-kdp-orange/90 text-foreground font-bold px-8 py-6 rounded-xl shadow-lg">
                <Gift className="w-5 h-5 mr-2" />
                Recevoir le guide gratuit
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
            <p className="text-xs text-muted-foreground mt-3">📩 Envoyé par email • 0€ • Aucun engagement</p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ ROI CALCULATOR KDP ═══════════════════════════════════════ */}
      <section className="py-16 px-4 bg-secondary/50">
        <div className="max-w-3xl mx-auto">
          <KdpRoiCalculator onCtaClick={handlePlanClick} />
        </div>
      </section>

      {/* ═══════════════════════════════════════ PRICING ═══════════════════════════════════════ */}
      <section id="pricing" className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,hsl(var(--primary)/0.06),transparent)]" />
        
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-10">
            <motion.div variants={fadeIn}>
              <Badge className="bg-primary/10 text-primary border-primary/20 px-5 py-2 font-semibold mb-5">
                <Sparkles className="w-4 h-4 mr-2" />
                OFFRE DE LANCEMENT — Prix qui augmentera
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeIn} custom={1} className="text-4xl sm:text-5xl md:text-6xl font-black mb-4">
              Accès à vie pour <span className="text-primary">{LAUNCH_PRICE}€</span>
            </motion.h2>
            <motion.p variants={fadeIn} custom={2} className="text-foreground/80 text-lg">
              Paiement unique — pas d'abonnement. <span className="line-through text-muted-foreground">{NORMAL_PRICE}€</span> → <strong className="text-primary">{LAUNCH_PRICE}€</strong>
            </motion.p>
          </motion.div>

          {/* Pricing Card */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            <Card className="bg-gradient-to-b from-secondary to-muted border-2 border-primary/30 rounded-3xl overflow-hidden shadow-2xl shadow-primary/10">
              <CardContent className="p-8 md:p-12">
                {/* Price */}
                <div className="text-center mb-10">
                  <div className="flex items-baseline justify-center gap-3 mb-2">
                    <span className="text-2xl text-muted-foreground line-through">{NORMAL_PRICE}€</span>
                    <span className="text-7xl md:text-8xl font-black text-foreground">{LAUNCH_PRICE}€</span>
                  </div>
                  <p className="text-foreground/80 text-lg">Paiement unique — <span className="text-primary font-bold">Accès à vie</span></p>
                  <p className="text-muted-foreground mt-2 text-sm">ou en 2×35€ / 3×25€ · Essai gratuit 7 jours inclus</p>
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
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-foreground">{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Button size="lg" onClick={handlePlanClick}
                  className="w-full py-8 text-xl font-bold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground rounded-2xl shadow-xl shadow-primary/20">
                  <Rocket className="w-6 h-6 mr-2" />
                  Accéder pour {LAUNCH_PRICE}€ — Paiement unique
                  <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
                <p className="text-center text-muted-foreground text-xs mt-3 flex items-center justify-center gap-3">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-primary" />Garantie 30 jours satisfait ou remboursé</span>
                  <span>•</span>
                  <span>Accès instantané</span>
                  <span>•</span>
                  <span>Essai 7 jours inclus</span>
                </p>

                {/* Garantie */}
                <div className="flex items-center justify-center gap-3 mt-8 text-muted-foreground text-sm">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span>Paiement sécurisé • Accès immédiat • Garantie 30 jours</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Garantie */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-8">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">Garantie 30 jours — Satisfait ou remboursé</h3>
                <p className="text-foreground/80 text-sm">
                  Testez pendant 30 jours. Si vous ne publiez pas votre 1er ebook, on vous rembourse intégralement. <strong className="text-primary">Aucune question posée.</strong>
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Countdown Timer */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-6">
            <CountdownTimer />
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,hsl(var(--primary)/0.04),transparent)]" />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="max-w-3xl mx-auto text-center relative z-10">
          <motion.h2 variants={fadeIn} className="text-3xl sm:text-4xl md:text-5xl font-black mb-5 leading-tight">
            Chaque jour sans ebook publié
            <br />
            <span className="text-muted-foreground">est un jour de revenus perdu.</span>
          </motion.h2>
          <motion.p variants={fadeIn} custom={1} className="text-foreground/80 mb-8 text-lg">
            Votre premier ebook peut être en ligne sur Amazon ce soir.
          </motion.p>
          <motion.div variants={fadeIn} custom={2}>
            <Button size="lg" onClick={handlePlanClick}
              className="text-lg px-12 py-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-bold rounded-2xl shadow-2xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1">
              <Rocket className="w-6 h-6 mr-2" />
              Accéder — {LAUNCH_PRICE}€ à vie
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
            <p className="text-muted-foreground text-sm mt-5">Paiement unique • Garantie 30 jours • Accès instantané</p>
            <p className="text-muted-foreground text-xs mt-2 flex items-center justify-center gap-1">
              <Users className="w-3.5 h-3.5 text-primary" />
              Rejoignez +200 auteurs qui publient déjà avec EbookStudio
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════ FOOTER ═══════════════════════════════════════ */}
      <footer className="py-16 border-t border-border bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-10 mb-10">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground">EbookStudio Pro</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">Le workflow IA #1 en France pour Amazon KDP.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground text-sm uppercase tracking-wider">Guides</h4>
              <ul className="space-y-2.5 text-sm">
                <li><button onClick={() => navigate("/ecrire-livre-chatgpt")} className="text-muted-foreground hover:text-primary transition-colors">Écrire avec l'IA</button></li>
                <li><button onClick={() => navigate("/creer-ebook-ia")} className="text-muted-foreground hover:text-primary transition-colors">Créer un ebook IA</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground text-sm uppercase tracking-wider">Produit</h4>
              <ul className="space-y-2.5 text-sm">
                <li><button onClick={() => navigate("/demo")} className="text-muted-foreground hover:text-primary transition-colors">Démo gratuite</button></li>
                <li><button onClick={() => navigate("/formation")} className="text-muted-foreground hover:text-primary transition-colors">Formation</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground text-sm uppercase tracking-wider">Légal</h4>
              <ul className="space-y-2.5 text-sm">
                <li><button onClick={() => navigate("/mentions-legales")} className="text-muted-foreground hover:text-primary transition-colors">Mentions légales</button></li>
                <li><button onClick={() => navigate("/cgv")} className="text-muted-foreground hover:text-primary transition-colors">CGV</button></li>
                <li><button onClick={() => navigate("/politique-confidentialite")} className="text-muted-foreground hover:text-primary transition-colors">Confidentialité</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground text-sm uppercase tracking-wider">Newsletter</h4>
              <p className="text-muted-foreground text-sm mb-4">Conseils KDP et IA gratuits</p>
              <NewsletterForm />
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center">
            <p className="text-xs text-muted-foreground">© 2026 EbookStudio Pro — Tous droits réservés</p>
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════ STICKY MOBILE CTA ═══════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-xl border-t border-border p-3 safe-area-inset-bottom">
        <Button onClick={handlePlanClick}
          className="w-full py-5 text-base font-bold bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl">
          <Rocket className="w-4 h-4 mr-2" />
          Accéder — {LAUNCH_PRICE}€ à vie
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
    </div>
  );
};

export default SalesPage;
