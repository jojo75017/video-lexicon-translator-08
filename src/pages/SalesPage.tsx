import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { trackEvent, trackCTAClick, trackNewsletterSignup, trackPlanSelect, trackBeginCheckout, trackDemoClick, trackOffresClick } from "@/utils/analytics";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, BookOpen, Zap, Star, ArrowRight, Play, Loader2, Clock, HelpCircle, CheckCircle, Gift, Send, Rocket, ShieldCheck, Crown, BarChart3, Landmark, PenTool, BadgeCheck, Package, Search, Brain, Link2, Eye, RotateCcw, Palette, Trophy, Shield, Cpu, Mic, Image, Globe, Headphones } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import ExitIntentPopup from "@/components/sales/ExitIntentPopup";
import SocialProofBanner from "@/components/sales/SocialProofBanner";
import SalesFaq from "@/components/sales/SalesFaq";
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
  { name: "Marie D.", role: "Auteure Kindle — 5 ebooks publiés", text: "En 3 semaines, j'ai publié 5 ebooks avec le workflow. Mon meilleur mois : 420€ de royalties KDP. Avant, je mettais 2 mois par livre.", avatar: "MD", color: "from-pink-500 to-rose-500" },
  { name: "Thomas L.", role: "Entrepreneur — Lead magnets", text: "J'utilise les ebooks comme lead magnets B2B. Résultat : +340 leads qualifiés en 2 mois. Le ROI est immédiat, l'outil se rembourse en 1 semaine.", avatar: "TL", color: "from-blue-500 to-cyan-500" },
  { name: "Sophie R.", role: "Coach Business — Formation", text: "La formation audio m'a fait gagner 6 mois d'apprentissage. Mon premier ebook s'est vendu à 127 exemplaires le premier mois sur Amazon.", avatar: "SR", color: "from-violet-500 to-purple-500" },
  { name: "Jean-Marc P.", role: "Retraité — Premier ebook à 62 ans", text: "Zéro compétence technique au départ. Le workflow m'a guidé étape par étape. Mon ebook sur le jardinage est à 4.3 étoiles sur Amazon.", avatar: "JP", color: "from-emerald-500 to-teal-500" },
  { name: "Camille B.", role: "Formatrice — Catalogue de 12 ebooks", text: "J'ai automatisé ma création de contenu. 12 ebooks en 4 mois, tous avec 4+ étoiles. Mon taux de conversion email a doublé grâce aux lead magnets.", avatar: "CB", color: "from-amber-500 to-orange-500" },
  { name: "Nicolas F.", role: "Blogueur Pro — Revenus passifs", text: "De 0€ à 850€/mois de revenus passifs KDP en 6 mois. Le secret : le workflow qui structure tout. Je ne reviendrais jamais en arrière.", avatar: "NF", color: "from-cyan-500 to-blue-500" },
];

const techStack = [
  { icon: Cpu, name: "Gemini 3 Flash", desc: "IA la plus rapide de Google, rédaction instantanée", color: "from-blue-500 to-cyan-500" },
  { icon: Image, name: "Imagen 3", desc: "Couvertures photoréalistes professionnelles", color: "from-violet-500 to-purple-500" },
  { icon: Headphones, name: "Azure Neural Voices", desc: "Audiobooks avec voix neuronales premium", color: "from-emerald-500 to-teal-500" },
  { icon: Globe, name: "Multi-langues", desc: "Traduction et rédaction dans 30+ langues", color: "from-amber-500 to-orange-500" },
];

const LAUNCH_PRICE = 97;
const NORMAL_PRICE = 247;
const PROMO_DISCOUNT = 50;
const FUTURE_PRICE = NORMAL_PRICE - PROMO_DISCOUNT; // 197€

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

const SalesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const countdown = useCountdown(LAUNCH_END);

  // Capture referral code from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    if (ref) sessionStorage.setItem('referral_code', ref);
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
    document.title = "EbookStudio Pro — Workflow IA Premium pour Amazon KDP | 97€ à vie";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Créez des ebooks haut de gamme avec Gemini 3 Flash, Imagen 3 et Azure Neural Voices. Workflow éditorial 15 rôles IA. Accès à vie 97€. Garantie 30 jours.");
  }, []);

  // JSON-LD structured data
  useEffect(() => {
    const existingLd = document.querySelector('script[data-ld="sales"]');
    if (existingLd) existingLd.remove();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-ld', 'sales');
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "EbookStudio Pro",
      "applicationCategory": "ProductivityApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": LAUNCH_PRICE, "priceCurrency": "EUR", "availability": "https://schema.org/InStock" },
      "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "47" },
      "description": "Workflow éditorial IA premium avec Gemini 3 Flash pour créer et publier des ebooks sur Amazon KDP."
    });
    document.head.appendChild(script);
    return () => { const ld = document.querySelector('script[data-ld="sales"]'); if (ld) ld.remove(); };
  }, []);

  const handlePlanClick = () => {
    trackPlanSelect('pro', LAUNCH_PRICE);
    trackCTAClick('plan_click', '/upsell-paiement');
    navigate('/upsell-paiement?plan=pro');
  };

  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

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

      {/* ═══ COMPTEUR DE LANCEMENT PREMIUM ═══ */}
      <div className="w-full bg-gradient-to-r from-slate-900 via-violet-950 to-slate-900 text-white py-4 px-4 border-b border-violet-500/20">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-md animate-pulse" />
              <Clock className="w-5 h-5 text-amber-400 relative z-10" />
            </div>
            <span className="text-sm font-bold tracking-wide uppercase text-amber-300">Offre de lancement — Fin le 30 juin 2026</span>
          </div>
          <div className="flex items-center gap-1.5">
            {[
              { value: countdown.days, label: 'Jours' },
              { value: countdown.hours, label: 'Heures' },
              { value: countdown.minutes, label: 'Min' },
              { value: countdown.seconds, label: 'Sec' },
            ].map((unit, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="flex flex-col items-center">
                  <span className="bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-1.5 text-xl font-extrabold tabular-nums min-w-[3rem] text-center shadow-inner">
                    {unit.value.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-white/50 font-medium mt-1 uppercase tracking-wider">{unit.label}</span>
                </div>
                {i < 3 && <span className="text-white/20 text-xl font-light mb-4">:</span>}
              </div>
            ))}
          </div>
          <Badge className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30 text-xs font-bold px-3 py-1">
            −{NORMAL_PRICE - LAUNCH_PRICE}€
          </Badge>
        </div>
      </div>

      {/* Header Premium */}
      <header className="bg-background/60 backdrop-blur-2xl border-b border-border/30 sticky top-[40px] z-50">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link to="/offres" onClick={() => trackOffresClick('logo_header')} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold block leading-tight">EbookStudio Pro</span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">Workflow IA Premium</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {[
              { href: "#author-showcase", label: "📚 Ebooks créés", scroll: true },
              { to: "/blog", label: "Blog" },
              { to: "/demo", label: "Démo" },
              { to: "/formation", label: "Formation" },
            ].map((item, i) => (
              'scroll' in item ? (
                <a key={i} href={item.href} onClick={(e) => { e.preventDefault(); document.getElementById('author-showcase')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="text-muted-foreground hover:text-primary transition-all font-medium cursor-pointer px-3 py-1.5 rounded-lg hover:bg-primary/5">{item.label}</a>
              ) : (
                <Link key={i} to={item.to!} className="text-muted-foreground hover:text-primary transition-all px-3 py-1.5 rounded-lg hover:bg-primary/5">{item.label}</Link>
              )
            ))}
            <Link to="/faq" className="text-muted-foreground hover:text-primary transition-all flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-primary/5"><HelpCircle className="w-3.5 h-3.5" />FAQ</Link>
          </nav>
          <Button size="sm" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/20 font-bold"
            onClick={scrollToPricing}>
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Offre de lancement
          </Button>
        </div>
      </header>

      {/* ═══════════════════════════════════════ HERO ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-16 sm:pb-28 px-4">
        {/* Premium background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.15),transparent)]" />
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-violet-500/8 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-[200px] pointer-events-none" />

        <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl mx-auto text-center relative z-10">

          <motion.div variants={fadeUp} custom={0.5} className="mb-6">
            <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 px-5 py-2.5 text-sm font-bold shadow-lg shadow-amber-500/5">
              <Sparkles className="w-4 h-4 mr-2" />
              OFFRE DE LANCEMENT — 97€ au lieu de 247€
            </Badge>
          </motion.div>

          <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight mb-5">
            Créez des ebooks{" "}
            <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              haut de gamme
            </span>
            <br className="hidden sm:block" />
            <span className="text-foreground/80"> avec l'IA la plus puissante</span>
          </motion.h1>

          <motion.p variants={fadeUp} custom={1.5} className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-3 font-light tracking-wide">
            Gemini 3 Flash &bull; Imagen 3 &bull; Azure Neural Voices
          </motion.p>
          <motion.p variants={fadeUp} custom={1.6} className="text-base sm:text-lg text-muted-foreground mb-8 font-medium max-w-2xl mx-auto">
            Le workflow IA en 15 rôles qui a déjà généré <span className="text-foreground font-bold">+35 ebooks publiés</span> sur Amazon KDP.
          </motion.p>

          {/* Tech stack badges - premium style */}
          <motion.div variants={fadeUp} custom={1.8} className="flex flex-wrap justify-center gap-3 mb-8">
            {techStack.map((tech, i) => (
              <div key={i} className="flex items-center gap-2.5 bg-card/80 backdrop-blur-sm border border-border/50 rounded-full px-5 py-2.5 text-sm shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${tech.color} flex items-center justify-center shadow-sm`}>
                  <tech.icon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-semibold">{tech.name}</span>
              </div>
            ))}
          </motion.div>

          {/* 3 pillars - premium cards */}
          <motion.div variants={fadeUp} custom={2} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
            {[
              { text: "Trouvez une niche rentable", emoji: "🎯" },
              { text: "Générez votre ebook complet", emoji: "✍️" },
              { text: "Publiez sur Amazon KDP", emoji: "🚀" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3 text-sm font-medium">
                <span className="text-lg">{item.emoji}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>

          {/* Social proof bar - more credible */}
          <motion.div variants={fadeUp} custom={2.05} className="flex flex-wrap items-center justify-center gap-6 mb-8 py-4 px-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/30 max-w-lg mx-auto">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex -space-x-2.5">
                {['MD','TL','SR','JP'].map((a, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-[10px] text-white font-bold border-2 border-background shadow-sm">{a}</div>
                ))}
              </div>
              <span className="ml-1.5 font-medium">Auteurs indépendants</span>
            </div>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
              <span className="text-sm text-muted-foreground font-semibold ml-1">4.8/5</span>
            </div>
          </motion.div>

          {/* CTA Button - bigger, bolder */}
          <motion.div variants={fadeUp} custom={2.2} className="flex flex-col items-center gap-4 mb-10">
            <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-10 sm:px-14 py-8 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 hover:from-violet-500 hover:via-purple-500 hover:to-violet-600 text-white shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] rounded-2xl font-extrabold"
              onClick={() => { trackCTAClick('hero_cta_top', '#pricing'); scrollToPricing(); }}>
              <Rocket className="w-5 h-5 mr-2" />
              🔥 Offre de lancement — 97€ au lieu de 247€
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" />+35 ebooks publiés</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" />~0,30€/ebook</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" />45 min en moyenne</span>
            </div>
          </motion.div>

          {/* Vidéo démo - cinematic frame */}
          <motion.div variants={fadeUp} custom={2.5} className="mb-8 max-w-3xl mx-auto">
            <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4 flex items-center justify-center gap-2">
              <Play className="w-5 h-5 text-primary" />
              Démo réelle — création d'un ebook complet
            </h2>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/15 border border-border/50 bg-card aspect-video group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <iframe
                src="https://www.youtube.com/embed/JD0x6hDhBg0?rel=0"
                title="Démo réelle — création d'un ebook complet"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                loading="lazy"
              />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-8 py-7 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-xl shadow-violet-500/25 transition-all duration-300 hover:-translate-y-0.5 rounded-xl font-bold"
              onClick={() => { trackCTAClick('hero_cta_primary', '/paiement'); handlePlanClick(); }}>
              <Rocket className="w-5 h-5 mr-2" />
              👉 Créer mon premier ebook maintenant
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm sm:text-base px-6 py-6 border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 rounded-xl"
              onClick={() => { trackDemoClick("demo_hero"); navigate('/demo'); }}>
              <Play className="w-5 h-5 mr-2" />
              Voir la démonstration complète
            </Button>
          </motion.div>

          <motion.p variants={fadeUp} custom={3.5} className="mt-5">
            <a href="https://www.amazon.fr/Mr-Georges-Boubet/e/B0CGVLHNX7" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5">
              📚 Ebooks publiés en conditions réelles — voir ma page auteur Amazon
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </motion.p>
        </motion.div>
      </section>

      {/* ═══════════════════════ TECHNOLOGIE PREMIUM ═══════════════════════ */}
      <section className="py-16 px-4 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.05),transparent_50%)]" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
            <motion.div variants={fadeUp}>
              <Badge className="mb-5 bg-blue-500/10 text-blue-500 border-blue-500/20 px-5 py-2.5 text-sm font-bold">
                <Cpu className="w-4 h-4 mr-2" />
                Technologie de pointe 2026
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-extrabold mb-5 leading-tight">
              Propulsé par les{" "}
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">meilleurs modèles IA</span>
              <br className="hidden md:block" /> du marché
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Vos propres clés API pour un accès direct — sans intermédiaire, sans limite imposée.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((tech, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}>
                <Card className="h-full border hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2 text-center group bg-card/80 backdrop-blur-sm">
                  <CardContent className="pt-10 pb-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tech.color} flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <tech.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{tech.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{tech.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10 text-center">
            <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-8 py-4 text-sm shadow-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                BYOK (Bring Your Own Key) — Vos clés API, votre contrôle total, ~0,30€/ebook
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ MESSAGE MOTIVATION ═══════════════════════════ */}
      <section className="py-10 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-10 shadow-2xl shadow-violet-500/20 border border-white/10 text-center">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-[70px]" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-pink-500/15 rounded-full blur-[60px]" />
          <div className="relative z-10">
            <p className="text-4xl mb-4">🚀</p>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4">1, 2, 3… Foncez !</h3>
            <p className="text-white/85 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
              Et sachez que je suis <strong className="text-white">toujours là pour vous accompagner</strong> — avec un Zoom gratuit, à tout moment.
            </p>
            <p className="text-white/40 text-sm mt-5 italic">— Georges, créateur d'EbookStudio</p>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════ TÉMOIGNAGES ═══════════════════════════════ */}
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

      <SocialProofBanner />

      {/* ═══════════════════════════════════════ AVANT / APRÈS ═══════════════════════════════ */}
      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-10">
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-extrabold mb-3">
              Avant vs Après EbookStudio
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-lg">La différence est immédiate</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motion.div variants={fadeUp}>
              <Card className="h-full border-2 border-red-500/20 bg-red-500/5">
                <CardContent className="pt-8 pb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                      <span className="text-2xl">😩</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-red-500 uppercase tracking-wider">Avant</p>
                      <p className="font-bold text-lg">Sans EbookStudio</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { text: "2 à 6 mois pour écrire un seul ebook", icon: "⏳" },
                      { text: "0€ de revenus passifs", icon: "💸" },
                      { text: "Syndrome de la page blanche permanent", icon: "📝" },
                      { text: "Aucune idée des mots-clés Amazon", icon: "🔍" },
                      { text: "Mise en page amateur, refusée par KDP", icon: "❌" },
                      { text: "Freelance : 500€ à 5 000€ par ebook", icon: "💰" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-lg shrink-0 mt-0.5">{item.icon}</span>
                        <p className="text-sm text-foreground/80">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeUp} custom={1}>
              <Card className="h-full border-2 border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden">
                <div className="absolute top-3 right-3">
                  <Badge className="bg-emerald-500 text-white border-0 text-xs">VOTRE FUTUR</Badge>
                </div>
                <CardContent className="pt-8 pb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <span className="text-2xl">🚀</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Après</p>
                      <p className="font-bold text-lg">Avec EbookStudio Pro</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { text: "Premier ebook publié en moins d'1 heure", icon: "⚡" },
                      { text: "Revenus passifs dès le premier mois", icon: "💰" },
                      { text: "15 rôles IA qui écrivent pour vous", icon: "🤖" },
                      { text: "Gemini 3 Flash — IA la plus rapide", icon: "🧠" },
                      { text: "Export PDF/Word/EPUB professionnel", icon: "✅" },
                      { text: "Investissement unique : 97€ à vie", icon: "🏆" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-lg shrink-0 mt-0.5">{item.icon}</span>
                        <p className="text-sm text-foreground/80 font-medium">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
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

      {/* ═══════════════════════════════════════ PRICING ═══════════════════════════════════ */}
      <section id="pricing" className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-8">
            <motion.div variants={fadeUp}>
              <Badge className="mb-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 px-5 py-2 text-sm font-bold">
                <Gift className="w-4 h-4 mr-2" />
                OFFRE DE LANCEMENT — Prix réduit temporaire
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-extrabold mb-4">
              Accès Pro Lifetime
            </motion.h2>
            <motion.div variants={fadeUp} custom={2} className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-5 py-2 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Garantie 30 jours satisfait ou remboursé</span>
            </motion.div>
          </motion.div>

          {/* Pricing Card */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 p-[2px] rounded-3xl">
                <div className="absolute inset-[2px] rounded-[22px] bg-background" />
              </div>

              <div className="relative z-10 p-8 md:p-10">
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 mb-6 px-4 py-1.5 text-sm font-bold">
                  🔥 LANCEMENT — Économisez {NORMAL_PRICE - LAUNCH_PRICE}€
                </Badge>

                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-lg text-muted-foreground line-through">{NORMAL_PRICE}€</span>
                  <span className="text-6xl md:text-7xl font-extrabold">{LAUNCH_PRICE}</span>
                  <span className="text-3xl font-bold">€</span>
                </div>
                <p className="text-sm text-muted-foreground mb-8">Paiement unique • Accès à vie • Sans abonnement</p>

                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 mb-8">
                  {[
                    "Workflow éditorial complet 15 rôles",
                    "Gemini 3 Flash — IA la plus rapide",
                    "Imagen 3 — couvertures photoréalistes",
                    "Azure Neural Voices — audiobooks",
                    "P15 Humanisation Anti-IA offert",
                    "Export PDF / EPUB / Word",
                    "🎓 Formation 18 modules vidéo (valeur 297€)",
                    "Outils KDP Premium complets",
                    "Gestionnaire Séries / Sagas",
                    "Traduction multi-langues (30+)",
                    "Mises à jour gratuites à vie",
                    "Support prioritaire + Zoom gratuit",
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-sm">{f}</span>
                    </div>
                  ))}
                </div>

                <Button size="lg" className="w-full py-8 text-xl font-extrabold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 rounded-xl hover:scale-[1.02]"
                  onClick={handlePlanClick}>
                  <Rocket className="w-6 h-6 mr-2" />
                  🔥 Accès Pro Lifetime — {LAUNCH_PRICE}€ à vie
                  <ArrowRight className="w-6 h-6 ml-2" />
                </Button>

                <p className="text-center mt-4 text-sm text-muted-foreground">
                  Après la période de lancement : <strong className="text-foreground text-base">{FUTURE_PRICE}€</strong>{" "}
                  <span className="text-xs">({NORMAL_PRICE}€ - {PROMO_DISCOUNT}€ de promo)</span>
                </p>

                <div className="mt-6 space-y-2">
                  <p className="text-xs text-muted-foreground text-center mb-3">Ou payez en plusieurs fois :</p>
                  {[
                    { label: "En 3 fois", price: "33", per: "33€/mois × 3" },
                    { label: "En 5 fois", price: "20", per: "20€/mois × 5" },
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
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${phase.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
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
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-extrabold mb-5">Comment ça marche</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-lg">4 étapes. Un seul workflow. Un ebook professionnel.</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="relative text-center group">
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
              <div className="absolute -top-20 -right-20 w-56 h-56 bg-primary/15 rounded-full blur-[80px]" />
              <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-violet-500/10 rounded-full blur-[60px]" />
              <CardContent className="relative p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 space-y-4">
                    <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 mb-2">
                      <Eye className="w-3 h-3 mr-1" />
                      Aperçu du parcours
                    </Badge>
                    <h3 className="text-2xl md:text-3xl font-extrabold">Curieux de voir le parcours ?</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Explorez la <span className="font-semibold text-foreground">roadmap interactive</span> : les 4 phases, les 15 étapes, et comprenez exactement comment votre ebook sera créé.
                    </p>
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
                  <div className="flex flex-col items-center gap-4 shrink-0">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-2xl shadow-primary/30">
                      <Play className="w-10 h-10 text-white ml-1" />
                    </div>
                    <Button size="lg" onClick={() => navigate('/demo')}
                      className="text-base px-8 py-5 h-auto rounded-2xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 gap-2 group">
                      Découvrir le parcours
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">Sans inscription • Comprenez avant de commencer</p>
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

      <PassiveRevenueProof />

      {/* ═══════════════════════════════════════ GUIDE GRATUIT ═══════════════════════════════ */}
      <section className="py-10 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-violet-500/10 p-8 shadow-lg shadow-violet-500/10">
          <p className="text-3xl mb-3">🎁</p>
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">Nouveau sur EbookStudio ?</h3>
          <p className="text-muted-foreground text-sm md:text-base mb-6 max-w-lg mx-auto">Commencez par le guide gratuit pour comprendre la méthode et avancer plus vite.</p>
          <Button size="lg" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/20 text-base px-8 py-6"
            onClick={() => window.open('https://www.trafic-affiliation.com/captureebookstudio2026#formulaire', '_blank')}>
            🎁 Commencer par le guide gratuit
          </Button>
        </motion.div>
      </section>

      {/* Tutoriel Vidéo Configuration */}
      <section className="py-16 px-4" id="tuto-api">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp}>
              <Badge className="mb-4 bg-blue-500/10 text-blue-500 border-blue-500/20 px-4 py-2">
                <Cpu className="w-4 h-4 mr-2" />
                Configuration — 2 min
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-extrabold mb-4">🔑 Obtenez votre clé Gemini 3 Flash gratuitement</motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
              Google offre un accès gratuit à Gemini 3 Flash. Un ebook complet coûte entre 0,20€ et 0,50€ en coût API.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left mb-8">
              {[
                { step: "1", title: "Créez un compte Google AI Studio", desc: "Rendez-vous sur aistudio.google.com et connectez-vous avec votre compte Google", icon: "🌐" },
                { step: "2", title: "Générez votre clé API", desc: "Cliquez sur 'Get API Key' → 'Create API Key' → Copiez votre clé", icon: "🔑" },
                { step: "3", title: "Collez dans EbookStudio", desc: "Allez dans Paramètres → Clés API → Collez votre clé Gemini", icon: "✅" },
              ].map((item, i) => (
                <Card key={i} className="border hover:border-primary/30 transition-all">
                  <CardContent className="pt-6 pb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {item.step}
                      </div>
                      <span className="text-2xl">{item.icon}</span>
                    </div>
                    <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
            <motion.div variants={fadeUp} custom={4} className="flex flex-wrap justify-center gap-4">
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2 border-blue-500/30 text-blue-600 hover:bg-blue-500/10">
                  <Cpu className="w-4 h-4" />
                  Obtenir ma clé Gemini gratuite →
                </Button>
              </a>
              <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 text-sm">
                <Mic className="w-4 h-4 text-emerald-500" />
                <span>Clé Azure Speech (audiobooks, optionnelle)</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <SalesFaq />

      {/* Final CTA */}
      <section className="py-14 px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="max-w-3xl mx-auto text-center">
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-extrabold mb-4">
            Chaque jour sans ebook publié est un jour de revenus passifs perdu.
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-muted-foreground mb-4 text-lg">
            Votre premier ebook peut être en ligne sur Amazon ce soir.
          </motion.p>
          <motion.div variants={fadeUp} custom={1.5} className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground mb-8">
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" />Pas besoin de savoir écrire</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" />Pas besoin de compétence technique</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" />Résultats dès le premier jour</span>
          </motion.div>
          <motion.div variants={fadeUp} custom={2}>
            <Button size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-xl shadow-violet-500/25 hover:scale-[1.02] transition-all"
              onClick={handlePlanClick}>
              <Rocket className="w-5 h-5 mr-2" />
              Accès Pro Lifetime — {LAUNCH_PRICE}€ à vie
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">Paiement unique • Accès à vie • Garantie 30 jours</p>
            <p className="text-xs text-muted-foreground mt-1">
              Prix après lancement : {FUTURE_PRICE}€ ({NORMAL_PRICE}€ - {PROMO_DISCOUNT}€ promo)
            </p>
          </motion.div>
        </motion.div>
      </section>

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
              <h4 className="font-semibold mb-2 mt-4 text-gray-200">⚖️ Légal</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate("/mentions-legales")} className="text-gray-400 hover:text-violet-400 transition-colors">Mentions légales</button></li>
                <li><button onClick={() => navigate("/cgv")} className="text-gray-400 hover:text-violet-400 transition-colors">CGV</button></li>
                <li><button onClick={() => navigate("/politique-confidentialite")} className="text-gray-400 hover:text-violet-400 transition-colors">Confidentialité</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gray-200">📧 Newsletter</h4>
              <p className="text-gray-400 text-sm mb-3">Conseils KDP gratuits</p>
              <NewsletterForm />
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-xs text-gray-500">© 2026 EbookStudio Pro • Workflow Éditorial IA Premium pour Amazon KDP • Tous droits réservés</p>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-xl border-t border-border p-3">
        <Button className="w-full py-5 text-base font-bold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg rounded-xl"
          onClick={handlePlanClick}>
          <Rocket className="w-4 h-4 mr-2" />
          Accès Pro — {LAUNCH_PRICE}€ à vie
        </Button>
      </div>

      <ExitIntentPopup />
    </div>
  );
};

export default SalesPage;
