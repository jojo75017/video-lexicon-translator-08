import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  BookOpen,
  Sparkles,
  Send,
  Loader2,
  CheckCircle,
  Rocket,
  ShieldCheck,
  ArrowRight,
  Star,
  Clock,
  TrendingUp,
  Zap,
  Globe,
  Headphones,
  PenTool,
  Image as ImageIcon,
  Target,
  Wand2,
  Crown,
  X,
  Check,
  Quote,
} from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  trackCTAClick,
  trackNewsletterSignup,
  trackPlanSelect,
} from "@/utils/analytics";

import CoachingVipBanner from "@/components/sales/CoachingVipBanner";
import CountdownDeadline from "@/components/sales/CountdownDeadline";
import KdpRoiCalculator from "@/components/sales/KdpRoiCalculator";

const LAUNCH_PRICE = 67;
const NORMAL_PRICE = 197;

// ── Newsletter form (footer) ─────────────────────────────────────────────────
const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setLoading(true);
    try {
      await supabase.functions.invoke("add-to-email-sequence", {
        body: { email: email.trim().toLowerCase() },
      });
      trackNewsletterSignup("footer");
      setDone(true);
    } catch {
      toast.error("Erreur");
    }
    setLoading(false);
  };

  if (done)
    return (
      <p className="text-foreground text-sm flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-accent" /> Inscrit, à très vite.
      </p>
    );

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="email"
        placeholder="votre@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-background border-border h-10 rounded-xl"
      />
      <Button
        type="submit"
        disabled={loading}
        className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-10 px-4 rounded-xl"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
      </Button>
    </form>
  );
};

// ─── Animations helpers ──────────────────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const SectionTitle = ({
  eyebrow,
  title,
  subtitle,
  light = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  light?: boolean;
}) => (
  <div className="max-w-3xl mx-auto text-center mb-14">
    {eyebrow && (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider mb-5 ${light ? "bg-white/10 text-white border border-white/20" : "bg-primary/10 text-primary border border-primary/20"}`}>
        <Sparkles className="w-3 h-3" />
        {eyebrow}
      </div>
    )}
    <h2 className={`text-3xl md:text-5xl font-extrabold tracking-tight leading-tight ${light ? "text-white" : "text-foreground"}`}>
      {title}
    </h2>
    {subtitle && (
      <p className={`mt-5 text-lg ${light ? "text-white/70" : "text-muted-foreground"} leading-relaxed`}>
        {subtitle}
      </p>
    )}
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// MAIN SALES PAGE — Premium Conversion v3
// ════════════════════════════════════════════════════════════════════════════

const SalesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasSubscriberAccess, setHasSubscriberAccess] = useState(false);
  const [hasAdminSession, setHasAdminSession] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");
    if (ref) sessionStorage.setItem("referral_code", ref);
  }, [location.search]);

  useEffect(() => {
    const refresh = async () => {
      const savedSubscriberEmail = localStorage.getItem("subscriber_email");
      const savedSubscriberData = localStorage.getItem("subscriber_data");
      let subscriberAccess = false;
      if (savedSubscriberEmail && savedSubscriberData) {
        try {
          const parsed = JSON.parse(savedSubscriberData);
          subscriberAccess = Boolean(
            parsed?.access_code ||
              parsed?.status === "active" ||
              parsed?.plan_type === "lifetime" ||
              parsed?.plan_type === "pro"
          );
        } catch {
          subscriberAccess = false;
        }
      }
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setHasSubscriberAccess(subscriberAccess);
      setHasAdminSession(Boolean(session));
    };
    void refresh();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => setTimeout(refresh, 0));
    return () => subscription.unsubscribe();
  }, []);

  const handlePlanClick = () => {
    trackPlanSelect("pro", LAUNCH_PRICE);
    trackCTAClick("plan_click", "pricing_section");
    navigate("/upsell-paiement?plan=pro");
  };

  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Helmet>
        <title>Ebookstudio Pro V2 — Créez et monétisez vos eBooks avec l'IA</title>
        <meta
          name="description"
          content="15 agents IA qui transforment votre idée en eBook publié sur Amazon KDP et en revenus passifs. Workflow complet, qualité pro, 67€ à vie. Garantie 30 jours."
        />
        <meta property="og:title" content="Ebookstudio Pro V2 — Créez et monétisez vos eBooks avec l'IA" />
        <meta property="og:description" content="15 agents IA pour publier vos eBooks rentables sur Amazon KDP. 67€ à vie." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ebookstudio.fr/offres" />
        <link rel="canonical" href="https://ebookstudio.fr/offres" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "Ebookstudio Pro V2",
          "description": "Plateforme IA tout-en-un pour créer, illustrer et publier des eBooks rentables sur Amazon KDP. 15 agents IA, export EPUB/PDF/audiobook, formation incluse.",
          "brand": { "@type": "Brand", "name": "Ebookstudio Pro V2" },
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "212" },
          "offers": {
            "@type": "Offer",
            "price": "67",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock",
            "priceValidUntil": "2026-09-15",
            "url": "https://ebookstudio.fr/offres",
          },
        })}</script>
      </Helmet>

      <CountdownDeadline />
      <CoachingVipBanner />

      {/* TRUST TOP BAR */}
      <div className="bg-foreground text-background text-xs">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            <strong>Garantie 30 jours</strong> satisfait ou remboursé
          </span>
          <span className="opacity-40 hidden sm:inline">·</span>
          <span className="hidden sm:flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-primary" /> Paiement unique · accès à vie</span>
        </div>
      </div>

      {/* Bandeau admin */}
      {hasAdminSession && (
        <div className="bg-accent/10 text-foreground text-xs border-b border-accent/30">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 px-4 py-1.5">
            <span className="flex items-center gap-1.5 font-semibold">
              <CheckCircle className="w-3 h-3 text-accent" /> Admin
            </span>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate("/admin")} className="underline underline-offset-2 hover:opacity-80">Dashboard</button>
              <span className="opacity-50">·</span>
              <button onClick={() => navigate("/ebook-planner")} className="underline underline-offset-2 hover:opacity-80">Générateur</button>
            </div>
          </div>
        </div>
      )}

      {/* Bandeau abonné */}
      {hasSubscriberAccess && !hasAdminSession && (
        <div className="bg-accent/15 border-b border-accent/30">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 px-4 py-2 text-sm">
            <span className="flex items-center gap-1.5 text-foreground font-semibold">
              <CheckCircle className="w-3.5 h-3.5 text-accent" /> Votre accès est actif
            </span>
            <Button size="sm" onClick={() => navigate("/ebook-planner")} className="h-7 bg-foreground text-background hover:bg-foreground/90 font-bold rounded-full">
              <Rocket className="w-3 h-3 mr-1" /> Ouvrir le générateur
            </Button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link to="/offres" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="font-extrabold text-base text-foreground tracking-tight">
              Ebookstudio <span className="text-primary">Pro</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <a href="#solution" className="text-muted-foreground hover:text-foreground transition">Solution</a>
            <a href="#workflow" className="text-muted-foreground hover:text-foreground transition">Workflow</a>
            <a href="#resultats" className="text-muted-foreground hover:text-foreground transition">Résultats</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition">Tarif</a>
            <Link to="/subscription" className="text-muted-foreground hover:text-foreground transition">Connexion</Link>
          </nav>

          <Button
            onClick={scrollToPricing}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-full px-5 h-10 shadow-sm shadow-primary/20"
          >
            Démarrer · 67€
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </header>

      {/* ════════════════ 1. HERO PREMIUM ════════════════ */}
      <section className="relative overflow-hidden pt-16 md:pt-24 pb-20 md:pb-28 px-4">
        {/* Background mesh */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
          <motion.div {...fadeUp}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Nouveauté · 15 agents IA propulsés par Gemini 3
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] tracking-tight text-foreground mb-6">
              Publiez votre premier{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-primary to-[#E55300] bg-clip-text text-transparent">eBook rentable</span>
              </span>{" "}
              en 7 jours grâce à l'IA.
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl">
              15 agents IA transforment votre idée en livre publié sur Amazon KDP — manuscrit, couverture, audiobook, mots-clés, marketing. <strong className="text-foreground">Vous restez l'auteur, l'IA fait le travail répétitif.</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button
                size="lg"
                onClick={handlePlanClick}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base h-14 px-7 rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
              >
                Démarrer pour 67€ à vie
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/demo")}
                className="border-2 border-foreground/20 hover:border-foreground/40 bg-background text-foreground font-bold text-base h-14 px-7 rounded-xl"
              >
                Voir la démo (2 min)
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-accent" /> Garantie 30 jours</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-accent" /> Paiement unique · à vie</span>
              <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-primary" /> Mises à jour incluses</span>
            </div>
          </motion.div>

          {/* Mockup macOS */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-6 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl overflow-hidden border border-border bg-card shadow-2xl shadow-foreground/10">
              {/* Window chrome */}
              <div className="flex items-center gap-1.5 px-4 py-3 bg-muted border-b border-border">
                <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <span className="w-3 h-3 rounded-full bg-[#28C840]" />
                <span className="ml-3 text-xs text-muted-foreground font-mono">ebookstudio.fr / planner</span>
              </div>
              <div className="p-5 md:p-6 space-y-3 bg-card">
                {/* Fake workflow rows */}
                {[
                  { icon: PenTool, label: "Manuscrit — Chapitre 7 sur 12", color: "accent", progress: 100 },
                  { icon: ImageIcon, label: "Couverture HD générée", color: "accent", progress: 100 },
                  { icon: Headphones, label: "Audiobook — Voix neuronale", color: "primary", progress: 72 },
                  { icon: Target, label: "7 mots-clés KDP optimisés", color: "accent", progress: 100 },
                  { icon: Globe, label: "Traduction EN · ES · DE", color: "primary", progress: 45 },
                ].map((row, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-secondary border border-border"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${row.color === "accent" ? "bg-accent/15 text-accent" : "bg-primary/15 text-primary"}`}>
                      <row.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground truncate">{row.label}</div>
                      <div className="mt-1.5 h-1.5 rounded-full bg-border overflow-hidden">
                        <div
                          className={`h-full rounded-full ${row.color === "accent" ? "bg-accent" : "bg-primary"}`}
                          style={{ width: `${row.progress}%` }}
                        />
                      </div>
                    </div>
                    {row.progress === 100 && <CheckCircle className="w-4 h-4 text-accent shrink-0" />}
                  </motion.div>
                ))}
                <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Temps écoulé : 4j 12h</span>
                  <span className="text-accent font-bold">82% terminé</span>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, type: "spring" }}
              className="absolute -bottom-5 -left-5 bg-card border border-border rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Revenus mois 3</div>
                <div className="text-lg font-extrabold text-foreground leading-none">+1 240 €</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ 2. LOGOS / TRUST STRIP ════════════════ */}
      <section className="py-10 border-y border-border bg-secondary/40">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">
            Compatible et reconnu sur les plateformes leaders
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70">
            {["Amazon KDP", "Apple Books", "Kobo", "Google Play Books", "Stripe", "Gemini 3"].map((n) => (
              <span key={n} className="text-base md:text-lg font-bold text-foreground/60 tracking-tight">{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ 3. WHY AUTHORS FAIL ════════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle
            eyebrow="Le constat"
            title={<>Pourquoi <span className="text-primary">9 auteurs sur 10</span><br className="hidden md:block" /> n'arrivent jamais à publier ?</>}
            subtitle="Avoir une idée ne suffit pas. Entre la page blanche, la mise en page KDP, la couverture et le marketing, la plupart abandonnent en chemin."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: PenTool, title: "La page blanche", desc: "Vous savez quoi dire, mais structurer 150 pages cohérentes prend des mois." },
              { icon: Clock, title: "Le temps", desc: "Écrire, corriger, mettre en page : 400+ heures de travail invisible." },
              { icon: ImageIcon, title: "La couverture", desc: "Une mauvaise couverture = 0 vente. Et un graphiste coûte 300€ minimum." },
              { icon: Target, title: "Le marketing", desc: "Mots-clés KDP, description, A+ Content : l'algorithme ignore les amateurs." },
            ].map((item, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="bg-card border border-border rounded-2xl p-6 hover:border-destructive/40 hover:shadow-lg transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ 4. SOLUTION BENTO ════════════════ */}
      <section id="solution" className="py-24 px-4 bg-secondary/40 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <SectionTitle
            eyebrow="La solution"
            title={<>Un workflow, <span className="text-primary">15 agents IA</span>, zéro friction.</>}
            subtitle="Chaque étape de la création d'un eBook est gérée par un agent IA spécialisé. Vous validez, l'IA exécute."
          />

          <div className="grid md:grid-cols-6 gap-4 auto-rows-[180px]">
            {/* Big card — Écriture */}
            <div className="md:col-span-3 md:row-span-2 bg-card border border-border rounded-3xl p-7 hover:border-primary/40 transition-all relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-5">
                  <PenTool className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Manuscrit complet en quelques heures</h3>
                <p className="text-muted-foreground leading-relaxed mb-5">
                  Les agents P1 à P10 structurent votre plan, rédigent chaque chapitre, vérifient la cohérence, corrigent et humanisent le texte pour passer les détecteurs IA.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Plan détaillé", "Rédaction", "Relecture", "Anti-IA"].map((t) => (
                    <span key={t} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary border border-border text-foreground/70">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Couverture */}
            <div className="md:col-span-3 bg-card border border-border rounded-3xl p-6 hover:border-primary/40 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">Couverture HD photoréaliste</h3>
                  <p className="text-sm text-muted-foreground">Studio IA intégré (Imagen 3) — 6 variantes en un clic.</p>
                </div>
              </div>
            </div>

            {/* Audiobook */}
            <div className="md:col-span-2 bg-card border border-border rounded-3xl p-6 hover:border-primary/40 transition-all">
              <div className="w-11 h-11 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-3">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-foreground mb-1">Audiobook inclus</h3>
              <p className="text-sm text-muted-foreground">Voix neuronales pro, export prêt à vendre.</p>
            </div>

            {/* KDP */}
            <div className="md:col-span-2 bg-card border border-border rounded-3xl p-6 hover:border-primary/40 transition-all">
              <div className="w-11 h-11 rounded-xl bg-accent/15 text-accent flex items-center justify-center mb-3">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-foreground mb-1">KDP optimisé</h3>
              <p className="text-sm text-muted-foreground">7 mots-clés + description vendeuse.</p>
            </div>

            {/* Marketing */}
            <div className="md:col-span-2 bg-card border border-border rounded-3xl p-6 hover:border-primary/40 transition-all">
              <div className="w-11 h-11 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-3">
                <Wand2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-foreground mb-1">Marketing intégré</h3>
              <p className="text-sm text-muted-foreground">Posts, emails, visuels prêts à publier.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ 5. BEFORE / AFTER ════════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <SectionTitle
            eyebrow="Avant / Après"
            title={<>De <span className="text-destructive">6 mois de galère</span> à <span className="text-accent">7 jours de publication</span></>}
          />

          <div className="grid md:grid-cols-2 gap-5">
            {/* Avant */}
            <div className="bg-card border border-border rounded-2xl p-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-bold uppercase mb-5">
                <X className="w-3.5 h-3.5" /> Méthode classique
              </div>
              <ul className="space-y-3.5">
                {[
                  "3 à 6 mois d'écriture pénible",
                  "300€+ pour une couverture pro",
                  "Mise en page KDP qui plante 10× sur 10",
                  "Description et mots-clés au hasard",
                  "Aucun audiobook (trop cher)",
                  "Lancement sans plan marketing",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <X className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Après */}
            <div style={{ backgroundColor: '#0F1115', color: '#FFFFFF' }} className="rounded-2xl p-7 relative overflow-hidden">
              <div className="relative z-10">
                <div style={{ backgroundColor: '#FF6B1A', color: '#FFFFFF' }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase mb-5">
                  <Check className="w-3.5 h-3.5" /> Avec Ebookstudio Pro
                </div>
                <ul className="space-y-3.5">
                  {[
                    "Manuscrit complet en quelques heures",
                    "Couverture HD générée et incluse",
                    "Export EPUB / PDF / DOCX conformes KDP",
                    "7 mots-clés optimisés automatiquement",
                    "Audiobook neural inclus + hébergement",
                    "Posts, emails et visuels prêts à publier",
                  ].map((t) => (
                    <li key={t} style={{ color: '#FFFFFF' }} className="flex items-start gap-2.5 text-sm font-medium">
                      <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#10B981' }} />
                      <span style={{ color: '#FFFFFF' }}>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ 6. WORKFLOW DEMO ════════════════ */}
      <section id="workflow" className="py-24 px-4 bg-foreground text-background">
        <div className="max-w-6xl mx-auto">
          <SectionTitle
            light
            eyebrow="Workflow en 4 étapes"
            title={<>De l'idée au livre publié, <span className="text-primary">en 4 étapes guidées.</span></>}
            subtitle="Aucune compétence technique requise. Vous validez chaque étape, l'IA fait le reste."
          />

          <div className="grid md:grid-cols-4 gap-5">
            {[
              { n: "01", title: "Votre idée", desc: "Décrivez votre sujet ou choisissez une niche rentable parmi 600+ analysées." },
              { n: "02", title: "Manuscrit IA", desc: "Les 15 agents rédigent, corrigent et humanisent votre livre complet." },
              { n: "03", title: "Couverture + Audio", desc: "Studio couverture HD et audiobook neural générés en un clic." },
              { n: "04", title: "Publication KDP", desc: "Export conforme, mots-clés optimisés, prêt à uploader sur Amazon." },
            ].map((step, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.1 }}
                className="relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition"
              >
                <div className="text-5xl font-black text-primary/80 mb-3 leading-none">{step.n}</div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{step.desc}</p>
                {i < 3 && (
                  <ArrowRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ 7. BENEFITS GRID ════════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle
            eyebrow="Bénéfices clés"
            title={<>Tout ce qu'il vous faut pour <span className="text-primary">vivre de vos livres.</span></>}
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Clock, title: "Gain de temps massif", desc: "Ce qui prenait 6 mois prend désormais 7 jours. Vous lancez 5×/an au lieu de 0." },
              { icon: TrendingUp, title: "Revenus passifs KDP", desc: "Chaque livre rapporte entre 200€ et 2 000€/mois selon la niche. Multipliez les titres." },
              { icon: Sparkles, title: "Qualité professionnelle", desc: "Manuscrit humanisé, couverture HD, audiobook neural. Indiscernable du travail d'agence." },
              { icon: Globe, title: "Multi-langues 30+", desc: "Publiez le même livre en anglais, espagnol, allemand. 1 livre = 30 marchés." },
              { icon: Headphones, title: "Audiobook inclus", desc: "Format premium qui se vend 3× plus cher. Voix neuronales pro, hébergement intégré." },
              { icon: Crown, title: "Mises à jour à vie", desc: "Toutes les futures fonctionnalités sont incluses. Aucun abonnement, aucun upsell forcé." },
            ].map((b, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.06 }}
                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-md transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <b.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ 8. TESTIMONIALS ════════════════ */}
      <section id="resultats" className="py-24 px-4 bg-secondary/40 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <SectionTitle
            eyebrow="Résultats réels"
            title={<>Ils ont publié leur premier <span className="text-primary">eBook rentable.</span></>}
          />

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                name: "Camille R.",
                role: "Coach bien-être · Bordeaux",
                quote: "J'ai publié 4 livres en 3 mois. Mon meilleur titre me rapporte 1 240€/mois en passif sur Amazon.",
                result: "+1 240 €/mois",
              },
              {
                name: "Marc T.",
                role: "Ex-salarié, retraité",
                quote: "À 67 ans je n'avais jamais écrit. En 5 jours mon livre était sur KDP. 320 ventes le premier mois.",
                result: "320 ventes / mois",
              },
              {
                name: "Sophia L.",
                role: "Formatrice indépendante",
                quote: "L'audiobook neural a doublé mes revenus. Les gens achètent les deux formats sans hésiter.",
                result: "Revenus ×2",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-7 flex flex-col"
              >
                <Quote className="w-7 h-7 text-primary/40 mb-3" />
                <p className="text-foreground leading-relaxed mb-5 flex-1">"{t.quote}"</p>
                <div className="flex items-center justify-between pt-5 border-t border-border">
                  <div>
                    <div className="font-bold text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                  <span className="text-sm font-extrabold text-accent">{t.result}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ 9. ROI CALCULATOR ════════════════ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto bg-card rounded-3xl border border-border p-6 md:p-8 shadow-sm">
          <KdpRoiCalculator onCtaClick={handlePlanClick} />
        </div>
      </section>

      {/* ════════════════ 10. PRICING ════════════════ */}
      <section id="pricing" className="py-24 px-4 bg-secondary/40 border-y border-border">
        <div className="max-w-3xl mx-auto">
          <SectionTitle
            eyebrow="Offre fondateur"
            title={<>Un seul paiement, <span className="text-primary">accès à vie.</span></>}
            subtitle="Pas d'abonnement. Pas de carte. Pas de surprise. 67€ aujourd'hui, et toutes les futures mises à jour incluses pour toujours."
          />

          <motion.div {...fadeUp} className="relative">
            <div className="absolute -inset-3 bg-gradient-to-br from-primary/30 to-accent/20 rounded-3xl blur-xl opacity-60" />
            <div className="relative bg-card border-2 border-primary rounded-3xl overflow-hidden shadow-2xl shadow-primary/10">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl">
                ⭐ Recommandé
              </div>

              <div className="p-8 md:p-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                    <Crown className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Ebookstudio Pro V2 · Lifetime</div>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-foreground leading-tight">Accès à vie · 15 agents IA</h3>
                  </div>
                </div>

                <div className="flex items-end gap-3 mb-6 pb-6 border-b border-border">
                  <span className="text-5xl md:text-6xl font-black text-foreground leading-none">67€</span>
                  <span className="text-2xl text-muted-foreground line-through pb-1">{NORMAL_PRICE}€</span>
                  <span className="ml-auto text-xs font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-full">Économie 130€</span>
                </div>

                <ul className="grid sm:grid-cols-2 gap-2.5 mb-8">
                  {[
                    "Workflow 15 agents IA (P1 à P15)",
                    "Générateur d'eBooks illimité",
                    "Studio Couverture IA + bibliothèque",
                    "Audiobook neural + hébergement",
                    "Export EPUB / PDF / DOCX pro",
                    "Recherche niches KDP temps réel",
                    "CRM + module marketing",
                    "Formation complète (18 modules)",
                    "Communauté privée + support",
                    "Mises à jour à vie incluses",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={handlePlanClick}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-14 rounded-xl text-base shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
                >
                  Verrouiller mon accès à vie · 67€
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-accent" /> Garantie 30 jours</span>
                  <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-primary" /> Paiement sécurisé Stripe</span>
                  <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-accent" /> Accès immédiat</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ 11. GUARANTEE ════════════════ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto bg-card border border-accent/30 rounded-3xl p-8 md:p-10 text-center shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-accent/15 text-accent flex items-center justify-center mb-5">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3">
            30 jours pour tester, 100% remboursé.
          </h3>
          <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Si dans les 30 jours vous n'avez pas publié votre premier eBook ou si ça ne vous convient pas, vous m'écrivez et <strong className="text-foreground">je vous rembourse intégralement</strong>. Sans question. C'est promis.
          </p>
        </div>
      </section>

      {/* ════════════════ 12. FAQ ════════════════ */}
      <section className="py-24 px-4 bg-secondary/40 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <SectionTitle
            eyebrow="FAQ"
            title="Vos questions, nos réponses honnêtes."
          />

          <div className="space-y-3">
            {[
              { q: "Je n'ai aucune idée de livre. Ça marche quand même ?", a: "Oui. L'outil intègre 600+ niches Amazon KDP analysées en temps réel (volume de recherche, concurrence, prix moyen). Vous choisissez celle qui vous parle, l'IA propose 5 angles et un plan détaillé." },
              { q: "Je n'écris pas bien. Le résultat sera publiable ?", a: "Vous n'écrivez rien. Les agents P1-P10 rédigent, P11 corrige, P15 humanise pour passer les détecteurs IA. Le résultat est indiscernable d'un livre écrit à la main." },
              { q: "Combien de temps pour publier mon premier eBook ?", a: "Entre 2 et 7 jours selon le niveau de finition que vous voulez. La majorité des utilisateurs publient en moins d'une semaine, à raison de 1 à 2h/jour." },
              { q: "Et si Amazon KDP refuse mon livre ?", a: "Nos exports sont 100% conformes aux exigences KDP (typographie, dimensions, ISBN optionnel, métadonnées). Si Amazon refuse, on corrige avec vous gratuitement." },
              { q: "Le 67€ est vraiment à vie ?", a: "Oui. Paiement unique, accès illimité, toutes les futures mises à jour incluses. Pas d'abonnement caché. Le tarif passera à 197€ après le 15 septembre." },
              { q: "Si je ne suis pas satisfait, comment je récupère mon argent ?", a: "Un simple email dans les 30 jours et je rembourse intégralement sous 48h. Pas de question, pas de jugement. C'est dans les CGV." },
              { q: "Je suis débutant total en informatique. C'est compliqué ?", a: "Non. L'interface est en français, guidée pas à pas. Vous cliquez, l'IA travaille. Une formation vidéo complète (18 modules) est incluse." },
              { q: "Puis-je vendre en plusieurs langues ?", a: "Oui. Le module traduction couvre 30+ langues. 1 livre écrit = 30 marchés potentiels. Le même contenu, multiplié par 30." },
            ].map((f, i) => (
              <details key={i} className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition">
                <summary className="cursor-pointer list-none p-5 flex items-center justify-between gap-4 font-semibold text-foreground">
                  <span>{f.q}</span>
                  <span className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0 group-open:bg-primary group-open:text-primary-foreground group-open:rotate-45 transition-all text-lg leading-none">+</span>
                </summary>
                <div className="px-5 pb-5 text-muted-foreground leading-relaxed text-sm">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ 13. FINAL CTA ════════════════ */}
      <section className="py-24 px-4 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 -z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tight mb-6">
            Votre premier eBook rentable<br />
            <span className="bg-gradient-to-r from-primary to-[#FFA873] bg-clip-text text-transparent">commence aujourd'hui.</span>
          </h2>
          <p className="text-lg md:text-xl text-white/70 mb-9 max-w-xl mx-auto">
            67€ à vie. Garantie 30 jours. Accès immédiat. Aucune raison d'attendre.
          </p>
          <Button
            size="lg"
            onClick={handlePlanClick}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg h-16 px-10 rounded-2xl shadow-2xl shadow-primary/40 hover:scale-[1.02] transition-all"
          >
            Démarrer pour 67€ à vie
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
          <p className="mt-5 text-sm text-white/50">
            Paiement unique · Sans engagement · Remboursé sous 48h si insatisfait
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary-foreground" />
                </div>
                <h3 className="text-base font-extrabold text-foreground">Ebookstudio Pro V2</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Le workflow IA #1 en France pour créer et monétiser vos eBooks sur Amazon KDP.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-foreground text-xs uppercase tracking-wider">Produit</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/demo" className="text-muted-foreground hover:text-foreground">Démo gratuite</Link></li>
                <li><button onClick={() => navigate("/formation")} className="text-muted-foreground hover:text-foreground">Formation</button></li>
                <li><button onClick={() => navigate("/extension-chrome")} className="text-muted-foreground hover:text-foreground">Extension Chrome</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-foreground text-xs uppercase tracking-wider">Légal</h4>
              <ul className="space-y-2.5 text-sm">
                <li><button onClick={() => navigate("/mentions-legales")} className="text-muted-foreground hover:text-foreground">Mentions légales</button></li>
                <li><button onClick={() => navigate("/cgv")} className="text-muted-foreground hover:text-foreground">CGV</button></li>
                <li><button onClick={() => navigate("/politique-confidentialite")} className="text-muted-foreground hover:text-foreground">Confidentialité</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-foreground text-xs uppercase tracking-wider">Newsletter</h4>
              <p className="text-muted-foreground text-sm mb-4">Conseils KDP & IA, 1×/semaine.</p>
              <NewsletterForm />
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center">
            <p className="text-xs text-muted-foreground">© 2026 Ebookstudio Pro V2 — Tous droits réservés</p>
          </div>
        </div>
      </footer>

      {/* STICKY MOBILE CTA */}
      <div className="fixed bottom-4 left-4 right-4 md:hidden z-40">
        <Button
          onClick={handlePlanClick}
          className="w-full bg-primary text-primary-foreground font-bold py-6 rounded-2xl shadow-xl shadow-primary/30"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          67€ à vie · Garantie 30 jours
        </Button>
      </div>
    </div>
  );
};

export default SalesPage;
