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
const NORMAL_PRICE = 197;
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

  const handlePlanClick = () => {
    trackPlanSelect('pro', LAUNCH_PRICE);
    trackCTAClick('plan_click', '/upsell-paiement');
    navigate('/upsell-paiement?plan=pro');
  };

  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
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
          "description": "Plateforme de création d'ebooks et audiobooks par IA",
          "offers": { "@type": "Offer", "price": "97", "priceCurrency": "EUR", "availability": "https://schema.org/InStock" }
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
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50">
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
            <Link to="/faq" className="text-slate-300 hover:text-white transition-colors">FAQ</Link>
          </nav>

          <Button onClick={scrollToPricing} className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl px-5">
            <Sparkles className="w-4 h-4 mr-2" />
            67€ à vie
          </Button>
        </div>
      </header>

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

          {/* CTA Principal */}
          <motion.div variants={fadeIn} custom={4} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button size="lg" onClick={handlePlanClick}
              className="w-full sm:w-auto text-lg px-10 py-7 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-900 font-bold rounded-2xl shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:-translate-y-1">
              <Rocket className="w-5 h-5 mr-2" />
              Commencer — 67€ à vie
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/demo')}
              className="w-full sm:w-auto text-base px-8 py-6 border-cyan-500/50 text-cyan-400 hover:text-white hover:border-cyan-400 hover:bg-cyan-500/10 rounded-2xl">
              <Play className="w-5 h-5 mr-2" />
              Voir la démo
            </Button>
          </motion.div>

          <motion.div variants={fadeIn} custom={5} className="flex flex-wrap justify-center gap-4 text-sm text-white/70">
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" />Paiement unique</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" />Accès à vie</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" />Garantie 30 jours</span>
          </motion.div>
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

      {/* ═══════════════════════════════════════ AVANT/APRÈS ═══════════════════════════════════════ */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
            <motion.h2 variants={fadeIn} className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
              La différence EbookStudio
            </motion.h2>
            <motion.p variants={fadeIn} custom={1} className="text-white/80 text-lg">Comparez vous-même</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid md:grid-cols-2 gap-6">
            {/* AVANT */}
            <motion.div variants={fadeIn}>
              <Card className="h-full bg-red-950/30 border-red-900/50">
                <CardContent className="pt-8 pb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                      <span className="text-2xl">😩</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-red-400 uppercase tracking-wider">Avant</p>
                      <p className="font-bold text-xl text-white">Sans EbookStudio</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      "2 à 6 mois pour écrire un ebook",
                      "Freelance : 500€ à 5 000€ par livre",
                      "Syndrome de la page blanche",
                      "Aucune idée des mots-clés Amazon",
                      "Mise en page amateur, refusée par KDP",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-white/80">
                        <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-red-400 text-xs">✕</span>
                        </div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* APRÈS */}
            <motion.div variants={fadeIn} custom={1}>
              <Card className="h-full bg-emerald-950/30 border-emerald-900/50 relative overflow-hidden">
                <div className="absolute top-3 right-3">
                  <Badge className="bg-emerald-500 text-slate-900 border-0 font-bold">VOTRE FUTUR</Badge>
                </div>
                <CardContent className="pt-8 pb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <span className="text-2xl">🚀</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Après</p>
                      <p className="font-bold text-xl text-white">Avec EbookStudio Pro</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      "Premier ebook en moins d'1 heure",
                      "Coût total : ~0,30€ par ebook",
                      "15 rôles IA qui écrivent pour vous",
                      "SEO Amazon automatiquement optimisé",
                      "Export professionnel PDF/EPUB/Word",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-white">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-emerald-400" />
                        </div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ TÉMOIGNAGES ═══════════════════════════════════════ */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
            <motion.h2 variants={fadeIn} className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
              Ils ont publié avec EbookStudio
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid md:grid-cols-3 gap-6">
            {[
              { 
                name: "Marie D.", role: "5 ebooks publiés en 3 semaines", 
                text: "Mon meilleur mois : 420€ de royalties KDP. Le BSR de mon livre 'Recettes Healthy' est descendu à #2,847 en Cuisine — je n'aurais jamais cru ça possible aussi vite.", 
                avatar: "MD",
                stats: "BSR #2,847 · 420€/mois"
              },
              { 
                name: "Thomas L.", role: "Entrepreneur · 12 ebooks", 
                text: "J'utilise les ebooks comme lead magnets pour mon business. Résultat : +340 leads qualifiés en 2 mois et 3 livres dans le Top 100 de leur catégorie.", 
                avatar: "TL",
                stats: "Top 100 Amazon · 340 leads"
              },
              { 
                name: "Nicolas F.", role: "Revenus passifs · 22 ebooks", 
                text: "De 0€ à 850€/mois en 6 mois. Mon secret : 1 ebook par semaine avec EbookStudio + les mots-clés KDP optimisés. Mes 3 meilleurs titres font chacun +150€/mois.", 
                avatar: "NF",
                stats: "850€/mois · 22 ebooks publiés"
              },
            ].map((t, i) => (
              <motion.div key={i} variants={fadeIn} custom={i}>
                <Card className="h-full bg-slate-900/50 border-slate-800">
                  <CardContent className="pt-6 pb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-slate-900 font-bold">
                        {t.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{t.name}</p>
                        <p className="text-xs text-white/60">{t.role}</p>
                      </div>
                      <div className="ml-auto flex gap-0.5">
                        {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                      </div>
                    </div>
                    <p className="text-white/90 leading-relaxed text-sm">"{t.text}"</p>
                    <div className="mt-3 pt-3 border-t border-slate-800">
                      <p className="text-xs font-semibold text-cyan-400">📊 {t.stats}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ COMPARATIF PRIX ═══════════════════════════════════════ */}
      <PriceComparison />

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
              <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 px-5 py-2 font-semibold mb-5">
                <Gift className="w-4 h-4 mr-2" />
                OFFRE DE LANCEMENT — Économisez 150€
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeIn} custom={1} className="text-4xl sm:text-5xl md:text-6xl font-black mb-4">
              Accès Pro Lifetime
            </motion.h2>
            <motion.p variants={fadeIn} custom={2} className="text-white/80 text-lg">
              Un paiement unique. Accès à vie. Sans abonnement.
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
                    <span className="text-2xl text-white/50 line-through">{NORMAL_PRICE}€</span>
                    <span className="text-7xl md:text-8xl font-black text-white">{LAUNCH_PRICE}</span>
                    <span className="text-3xl font-bold text-white/70">€</span>
                  </div>
                  <p className="text-white/60">Paiement unique • Accès à vie</p>
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
                    "🎓 Formation 18 modules (197€ offerts)",
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
                  Accès Pro Lifetime — {LAUNCH_PRICE}€
                  <ArrowRight className="w-6 h-6 ml-2" />
                </Button>

                {/* Paiement fractionné */}
                <div className="mt-8 pt-6 border-t border-slate-800">
                  <p className="text-center text-white/60 text-sm mb-4">Ou payez en plusieurs fois</p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "En 2 fois", price: "35€/mois" },
                      { label: "En 3 fois", price: "25€/mois" },
                    ].map((opt, i) => (
                      <button key={i} onClick={handlePlanClick}
                        className="p-4 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-colors text-center group">
                        <p className="font-bold text-white group-hover:text-cyan-400 transition-colors">{opt.label}</p>
                        <p className="text-sm text-white/60">{opt.price}</p>
                      </button>
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
              Commencer maintenant — {LAUNCH_PRICE}€
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
            <p className="text-white/60 text-sm mt-5">Paiement unique • Accès à vie • Garantie 30 jours</p>
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
    </div>
  );
};

export default SalesPage;
