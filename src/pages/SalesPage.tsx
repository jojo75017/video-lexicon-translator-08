import { useState, useEffect, useRef } from "react";
import { trackDemoClick } from "@/utils/analytics";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, BookOpen, Zap, Download, Star, ArrowRight, Play, Loader2, Clock, HelpCircle, CheckCircle, CheckCircle2, Calculator, Gift, Mail, Send, Rocket, ShieldCheck } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ExitIntentPopup from "@/components/sales/ExitIntentPopup";
import SocialProofBanner from "@/components/sales/SocialProofBanner";
import { generateKdpNichesPdf } from "@/utils/generateKdpNichesPdf";
import SocialProofNotifications from "@/components/sales/SocialProofNotifications";
import KdpRoiCalculator from "@/components/sales/KdpRoiCalculator";
import StickyCtaBar from "@/components/sales/StickyCtaBar";
import LiveEbookCounter from "@/components/sales/LiveEbookCounter";
import LiveActivityNotifications from "@/components/sales/LiveActivityNotifications";
import AuthorQuiz from "@/components/sales/AuthorQuiz";
import SuccessGallery from "@/components/sales/SuccessGallery";
import ScrollIntentPopup from "@/components/sales/ScrollIntentPopup";
import VideoTestimonials from "@/components/sales/VideoTestimonials";
import HeroVideoTeaser from "@/components/sales/HeroVideoTeaser";
import TrustBadges from "@/components/sales/TrustBadges";
import PriceComparison from "@/components/sales/PriceComparison";
import SalesFaq from "@/components/sales/SalesFaq";
import StarTestimonials from "@/components/sales/StarTestimonials";
import { useVipAvailability } from "@/hooks/useVipAvailability";
import FloatingMobileCta from "@/components/sales/FloatingMobileCta";
import LiveViewerCount from "@/components/sales/LiveViewerCount";
import UrgencyBanner from "@/components/sales/UrgencyBanner";

// Composant Newsletter inline pour le footer
const NewsletterForm = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      toast.error("Email invalide");
      return;
    }
    
    setIsSubscribing(true);
    try {
      // Ajouter à la séquence email automatique
      await supabase.functions.invoke("add-to-email-sequence", {
        body: { email: newsletterEmail.trim().toLowerCase() }
      });
      
      setIsSubscribed(true);
      toast.success("🎉 Inscrit ! Vérifiez votre boîte mail");
      setNewsletterEmail("");
    } catch (error) {
      console.error("Newsletter error:", error);
      toast.error("Erreur, réessayez");
    } finally {
      setIsSubscribing(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="flex items-center gap-2 text-emerald-400 text-sm">
        <CheckCircle className="w-4 h-4" />
        <span>Inscrit !</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
      <Input
        type="email"
        placeholder="votre@email.com"
        value={newsletterEmail}
        onChange={(e) => setNewsletterEmail(e.target.value)}
        className="bg-slate-800 border-slate-700 text-white placeholder:text-gray-500 text-sm h-9"
        disabled={isSubscribing}
      />
      <Button 
        type="submit" 
        size="sm" 
        disabled={isSubscribing}
        className="bg-violet-600 hover:bg-violet-700 h-9 px-3"
      >
        {isSubscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
      </Button>
    </form>
  );
};

const SalesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDemo, setShowDemo] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  // Vérifier disponibilité VIP (60 jours à 37€)
  const { isVipAvailable, daysRemaining, isLoading: vipLoading } = useVipAvailability();

  // Scroll vers l'ancre #demo au chargement
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      // Petit délai pour laisser le DOM se charger
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location.hash]);

  // SEO Meta Tags dynamiques pour la page /offres
  useEffect(() => {
    // Title optimisé pour le mot-clé principal
    document.title = "Workflow Éditorial IA en 14 Rôles - EbookStudio Pro Amazon KDP | 37€";
    
    // Meta description optimisée
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Le premier workflow éditorial IA structuré en 14 rôles professionnels. Créez un ebook optimisé pour Amazon KDP avec un processus guidé de A à Z. Accès à vie pour seulement 37€.");
    }
    
    // Canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute("href", "https://ebookstudio.fr/offres");
    }
    
    // Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", "Créer un Ebook avec l'IA - Offre Spéciale 37€");
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute("content", "Workflow éditorial IA en 14 rôles professionnels pour Amazon KDP. Créez, structurez et publiez votre ebook avec un processus validé.");
    }
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute("content", "https://ebookstudio.fr/offres");
    }
  }, []);

  // Countdown Offre Fondateur : 60 jours à partir du lancement (13 février 2026)
  const LAUNCH_DATE = new Date('2026-02-13T00:00:00+01:00');
  const OFFER_END_DATE = new Date(LAUNCH_DATE.getTime() + 60 * 24 * 60 * 60 * 1000); // +60 jours

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const difference = OFFER_END_DATE.getTime() - now.getTime();
      
      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: Sparkles, title: "Rédaction assistée par rôle éditorial", description: "14 rôles professionnels structurent chaque étape de votre ebook" },
    { icon: BookOpen, title: "300+ Idées de Titres", description: "Bibliothèque de titres rentables par catégorie" },
    { icon: Download, title: "Export Pro", description: "Export PDF et EPUB professionnel en un clic" },
    { icon: Zap, title: "Outils Amazon KDP", description: "Analyse de marché et optimisation pour KDP" },
  ];

  const testimonials = [
    { name: "Marie D.", role: "Auteure Kindle", text: "J'ai créé 5 ebooks en 1 mois grâce au workflow structuré. Mes revenus KDP ont triplé !", rating: 5, avatar: "MD", color: "bg-pink-500" },
    { name: "Thomas L.", role: "Entrepreneur", text: "L'outil parfait pour créer du contenu premium rapidement. ROI immédiat.", rating: 5, avatar: "TL", color: "bg-blue-500" },
    { name: "Sophie R.", role: "Coach Business", text: "La formation audio incluse m'a permis de comprendre toute la stratégie ebook.", rating: 5, avatar: "SR", color: "bg-purple-500" },
    { name: "Jean-Marc P.", role: "Auteur Indépendant", text: "En 3 semaines, j'ai publié mon premier ebook sur Amazon grâce au workflow structuré. Incroyable !", rating: 5, avatar: "JP", color: "bg-green-500" },
    { name: "Camille B.", role: "Formatrice en ligne", text: "J'utilise les ebooks créés comme lead magnets. Mon taux de conversion a doublé !", rating: 5, avatar: "CB", color: "bg-orange-500" },
    { name: "Nicolas F.", role: "Blogueur Pro", text: "La qualité des contenus est bluffante. Le workflow éditorial fait toute la différence.", rating: 5, avatar: "NF", color: "bg-cyan-500" },
  ];

  // Toujours afficher les deux plans : Fondateur 37€ (tant que VIP dispo) + Pro 147€
  const plans = [
    ...(isVipAvailable
      ? [
          {
            id: "vip",
            name: "Accès Fondateur",
            price: "37",
            originalPrice: "297",
            description: "Tout débloqué à vie — Jusqu'au 30 avril 2026",
            badge: "🔥 OFFRE FONDATEUR — Jusqu'au 30 avril",
            discount: "🎯 Économie : 260€ (-87%)",
            features: [
              "✨ Workflow éditorial complet à vie",
              "📝 14 rôles professionnels intégrés",
              "🎨 10 couvertures IA/mois",
              "📄 Export PDF / EPUB / Word / Google Docs",
              "🎓 Toutes les formations (18 modules + audio)",
              "📚 Gestionnaire Séries / Sagas",
              "📊 Outils KDP Premium complets",
              "🌍 Traduction multi-langues",
              "🎧 Infrastructure Audiobooks",
              "🔄 Mises à jour gratuites à vie",
              "💬 Support prioritaire inclus",
            ],
            blocked: [],
            cta: "🚀 Débloquer l'accès fondateur",
            popular: true,
            footnote: "📌 Paiement unique – Accès complet à vie – Sans abonnement",
            installments: [],
          },
        ]
      : []),
    {
      id: "pro",
      name: "Pro Lifetime",
      price: "147",
      originalPrice: "297",
      description: isVipAvailable ? "À partir du 1er mai 2026" : "Tout débloqué à vie",
      badge: isVipAvailable ? "📅 À PARTIR DU 1ER MAI" : "⭐ MEILLEURE OFFRE",
      discount: "🎯 Économie : 150€ (-50%)",
      features: [
        "✨ Workflow éditorial complet à vie",
        "📝 14 rôles professionnels intégrés",
        "🎨 10 couvertures IA/mois",
        "📄 Export PDF / EPUB / Word / Google Docs",
        "🎓 Toutes les formations (18 modules + audio)",
        "📚 Gestionnaire Séries / Sagas",
        "📊 Outils KDP Premium complets",
        "🌍 Traduction multi-langues",
        "🎧 Infrastructure Audiobooks",
        "🔄 Mises à jour gratuites à vie",
        "💬 Support prioritaire inclus",
      ],
      blocked: [],
      cta: isVipAvailable ? "Ou payer 147€ plus tard" : "🚀 Débloquer TOUT pour 147€",
      popular: !isVipAvailable,
      footnote: "📌 Paiement unique ou en plusieurs fois – Accès à vie",
      installments: [
        { label: "En 3 fois", price: "49", perMonth: "49€/mois pendant 3 mois" },
        { label: "En 5 fois", price: "32", perMonth: "32€/mois pendant 5 mois" },
      ],
    },
  ];

  const handlePlanClick = (planId: string) => {
    if (isVipAvailable) {
      navigate('/paiement-manuel');
    } else {
      navigate('/upsell-paiement?plan=pro');
    }
  };

  const handleCheckout = () => {
    if (!email || !email.includes("@")) {
      toast.error("Veuillez entrer un email valide");
      return;
    }

    if (!selectedPlan) {
      toast.error("Veuillez sélectionner un plan");
      return;
    }

    sessionStorage.setItem('payment_email', email.trim().toLowerCase());
    navigate(`/upsell-paiement?plan=${selectedPlan}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Zoom Live Banner */}
      <a 
        href="https://calendly.com/boubetgeorges/nouvelle-reunion" 
        target="_blank" 
        rel="noopener noreferrer"
        className="block w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white text-center py-2.5 px-4 text-sm font-semibold hover:from-emerald-500 hover:via-emerald-400 hover:to-teal-400 transition-all sticky top-0 z-[60]"
      >
        <span className="flex items-center justify-center gap-2">
          <Play className="w-4 h-4 fill-white" />
          🎥 Je suis dispo en Zoom — Voyez l'outil en direct avant d'acheter !
          <span className="hidden sm:inline border border-white/30 rounded-full px-3 py-0.5 text-xs ml-2">Réserver un créneau →</span>
        </span>
      </a>

      {/* Header Navigation */}
      <header className="bg-slate-950/95 backdrop-blur-sm border-b border-white/10 sticky top-[40px] z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/offres" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">EbookStudio Pro</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/ebook" className="text-white/70 hover:text-violet-400 transition-colors font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Découvrir KDP Studio
            </Link>
            <Link to="/blog" className="text-white/70 hover:text-violet-400 transition-colors font-medium">Blog</Link>
            <Link to="/demo" className="text-white/70 hover:text-white transition-colors">Démo</Link>
            <Link to="/formation" className="text-white/70 hover:text-white transition-colors">Formation</Link>
            <Link to="/valeur-offre" className="text-white/70 hover:text-white transition-colors">Valeur</Link>
            <Link to="/faq" className="text-white/70 hover:text-emerald-400 transition-colors flex items-center gap-1">
              <HelpCircle className="w-4 h-4" />
              FAQ
            </Link>
          </nav>
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white"
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {isVipAvailable ? `Offre Fondateur ${daysRemaining}j restants` : 'Voir les offres'}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          <Badge className="mb-8 bg-primary/10 text-primary border-primary/20 px-5 py-2.5 text-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            5 000 ebooks créés avec EbookStudio Pro
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight tracking-tight">
            <span className="text-foreground">Le premier workflow éditorial IA</span>
            <br />
            <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">structuré en 14 rôles professionnels</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            De l'analyse marché au verdict final, chaque étape de votre ebook est 
            <strong className="text-foreground"> guidée, optimisée et validée</strong> pour Amazon KDP.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button 
              size="lg" 
              className="text-lg px-10 py-6 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-500 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Rocket className="w-5 h-5 mr-2" />
              Découvrir le workflow complet
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-10 py-6 border-2 hover:bg-primary/5 transition-all duration-300"
              onClick={() => {
                trackDemoClick("Voir la démonstration");
                navigate('/demo');
              }}
            >
              <Play className="w-5 h-5 mr-2" />
              Voir la démonstration
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-1 mb-14">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">4.9/5 — 127 avis vérifiés</span>
          </div>

          <HeroVideoTeaser />
        </div>
      </section>

      {/* Section Différenciation — 14 Rôles */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Un système éditorial complet. <span className="text-muted-foreground">Pas un simple générateur.</span>
          </h2>
          <p className="text-muted-foreground text-center mb-14 max-w-2xl mx-auto leading-relaxed">
            EbookStudio Pro fonctionne comme une véritable équipe éditoriale intégrée.
            Chaque rôle intervient à un moment précis pour structurer, améliorer et valider votre livre avant publication.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Phase 1 — Direction & Stratégie */}
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <Badge className="w-fit mb-2 bg-primary/10 text-primary border-primary/20">🟣 Phase 1 — Direction & Stratégie</Badge>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>👑 <strong>P1</strong> — Directeur</p>
                <p>📊 <strong>P2</strong> — Marché</p>
                <p>🏗 <strong>P3</strong> — Architecte</p>
              </CardContent>
            </Card>

            {/* Phase 2 — Production */}
            <Card className="border-2 border-violet-500/20 bg-violet-500/5">
              <CardHeader className="pb-3">
                <Badge className="w-fit mb-2 bg-violet-500/10 text-violet-500 border-violet-500/20">🟡 Phase 2 — Production</Badge>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>✍️ <strong>P4</strong> — Rédaction</p>
                <p>✨ <strong>P5</strong> — Réécriture</p>
                <p>✅ <strong>P6</strong> — Qualité</p>
              </CardContent>
            </Card>

            {/* Phase 3 — Publication */}
            <Card className="border-2 border-emerald-500/20 bg-emerald-500/5">
              <CardHeader className="pb-3">
                <Badge className="w-fit mb-2 bg-emerald-500/10 text-emerald-500 border-emerald-500/20">🟢 Phase 3 — Publication</Badge>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>📦 <strong>P7</strong> — Packaging</p>
                <p>🔍 <strong>P8</strong> — Diagnostic</p>
              </CardContent>
            </Card>

            {/* Phase 4 — Intelligence Avancée */}
            <Card className="border-2 border-amber-500/20 bg-amber-500/5">
              <CardHeader className="pb-3">
                <Badge className="w-fit mb-2 bg-amber-500/10 text-amber-500 border-amber-500/20">🔵 Phase 4 — Intelligence Avancée</Badge>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>🧠 <strong>P9</strong> — Mémoire</p>
                <p>🔗 <strong>P10</strong> — Cohérence</p>
                <p>👁 <strong>P11</strong> — Critique</p>
                <p>🔄 <strong>P12</strong> — Boucle</p>
                <p>🎨 <strong>P13</strong> — Style</p>
                <p>🏆 <strong>P14</strong> — Verdict</p>
              </CardContent>
            </Card>

            {/* Bonus — P15 */}
            <Card className="border-2 border-rose-500/20 bg-rose-500/5 lg:col-span-4 md:col-span-2">
              <CardHeader className="pb-3">
                <Badge className="w-fit mb-2 bg-rose-500/10 text-rose-500 border-rose-500/20">🎁 BONUS — Humanisation</Badge>
              </CardHeader>
              <CardContent className="flex items-center gap-4 text-sm">
                <p>🛡 <strong>P15</strong> — Humanisation Anti-Détection IA</p>
                <span className="text-xs text-muted-foreground ml-auto">Offert avec votre accès</span>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-primary font-semibold mt-10 text-lg">
            🔥 Ça, c'est votre avantage concurrentiel.
          </p>
        </div>
      </section>

      {/* Comment ça marche — 4 étapes */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
            ⚙️ Comment ça marche
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Positionner</h3>
              <p className="text-sm text-muted-foreground">Analyse marché + promesse + architecture du livre</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-violet-500">2</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Produire</h3>
              <p className="text-sm text-muted-foreground">Rédaction guidée + amélioration + contrôle qualité</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-500">3</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Optimiser</h3>
              <p className="text-sm text-muted-foreground">Mots-clés Amazon + packaging + export professionnel</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-500">4</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Déployer</h3>
              <p className="text-sm text-muted-foreground">Marketing + audio + catalogue de publications</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Tout le processus éditorial structuré en une seule interface</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Stratégie, rédaction, amélioration, optimisation Amazon KDP et déploiement marketing : tout est intégré dans un workflow logique.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Banner */}
      <SocialProofBanner />

      {/* Testimonials */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Ce qu'en disent nos utilisateurs</h2>
          <p className="text-muted-foreground text-center mb-12">+5000 entrepreneurs utilisent déjà notre workflow éditorial</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-full ${testimonial.color} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/90 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Price Comparison Table */}
      <PriceComparison />

      {/* Valeur réelle d'un ebook professionnel */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            💰 Combien coûte réellement un ebook professionnel ?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <Card className="border-2 border-red-500/20 bg-red-500/5 text-center">
              <CardContent className="pt-6 pb-6">
                <p className="text-lg font-semibold text-foreground mb-2">Rédacteur freelance</p>
                <p className="text-3xl font-bold text-red-500">500 – 2 000€</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-orange-500/20 bg-orange-500/5 text-center">
              <CardContent className="pt-6 pb-6">
                <p className="text-lg font-semibold text-foreground mb-2">Ghostwriter</p>
                <p className="text-3xl font-bold text-orange-500">1 500 – 5 000€</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-amber-500/20 bg-amber-500/5 text-center">
              <CardContent className="pt-6 pb-6">
                <p className="text-lg font-semibold text-foreground mb-2">Agence éditoriale</p>
                <p className="text-3xl font-bold text-amber-500">jusqu'à 10 000€</p>
              </CardContent>
            </Card>
          </div>
          <p className="text-center text-xl text-muted-foreground">
            EbookStudio Pro <strong className="text-foreground">remplace cette chaîne complète</strong>.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">{isVipAvailable ? 'Une offre simple, tout inclus' : 'Accès Pro Lifetime — Tout inclus'}</h2>
          <p className="text-muted-foreground text-center mb-2">
            {isVipAvailable ? 'Paiement unique – Accès illimité à vie' : 'Paiement unique ou en plusieurs fois – Accès illimité à vie'}
          </p>
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Garantie 30 jours satisfait ou remboursé</span>
            </div>
          </div>

          {/* Countdown Timer */}
          {isVipAvailable && (
            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl p-5 text-white text-center shadow-lg">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Clock className="w-5 h-5" />
                  <span className="font-bold text-lg">Offre Fondateur 37€ — {daysRemaining} jours restants</span>
                </div>
                <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                  <div className="bg-white/20 rounded-lg p-3">
                    <div className="text-3xl font-bold">{countdown.days}</div>
                    <div className="text-xs uppercase tracking-wide">Jours</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    <div className="text-3xl font-bold">{countdown.hours}</div>
                    <div className="text-xs uppercase tracking-wide">Heures</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    <div className="text-3xl font-bold">{countdown.minutes}</div>
                    <div className="text-xs uppercase tracking-wide">Minutes</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    <div className="text-3xl font-bold">{countdown.seconds}</div>
                    <div className="text-xs uppercase tracking-wide">Secondes</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className={`grid ${plans.length > 1 ? 'md:grid-cols-2 max-w-5xl' : 'max-w-3xl'} gap-8 mx-auto`}>
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl overflow-hidden ${plan.popular ? 'md:scale-[1.02]' : ''}`}
              >
                {/* Glassmorphism border gradient */}
                <div className={`absolute inset-0 rounded-2xl ${plan.popular ? 'bg-gradient-to-br from-primary via-violet-500 to-purple-600 p-[2px]' : 'bg-gradient-to-br from-border to-border/50 p-[1px]'}`}>
                  <div className="absolute inset-[1px] rounded-2xl bg-background" />
                </div>

                <div className="relative z-10 p-8">
                  <div className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold mb-4 ${plan.popular ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-muted text-muted-foreground border border-border'}`}>
                    {plan.popular && <Sparkles className="w-3.5 h-3.5" />}
                    {plan.badge}
                  </div>

                  <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-lg text-muted-foreground line-through mr-2">{plan.originalPrice}€</span>
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-2xl font-bold">€</span>
                    <p className="text-xs text-muted-foreground mt-1">Paiement unique • Accès à vie</p>
                  </div>

                  {plan.discount && (
                    <div className="mb-6 p-2.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl text-center">
                      <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">{plan.discount}</span>
                    </div>
                  )}

                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground/90">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full py-6 text-base font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${plan.popular ? 'bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-500 text-white shadow-lg shadow-primary/25' : ''}`}
                    size="lg"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handlePlanClick(plan.id)}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  {/* Options de paiement fractionné */}
                  {plan.installments && plan.installments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs text-muted-foreground text-center mb-2">Ou payez en plusieurs fois :</p>
                      {plan.installments.map((inst: { label: string; price: string; perMonth: string }, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => handlePlanClick(plan.id)}
                          className="w-full flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                        >
                          <div className="text-left">
                            <span className="font-semibold text-sm text-foreground">{inst.label}</span>
                            <p className="text-xs text-muted-foreground">{inst.perMonth}</p>
                          </div>
                          <span className="text-lg font-bold text-foreground">{inst.price}€</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-3">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Paiement sécurisé • Accès immédiat</span>
                  </div>

                  {plan.footnote && (
                    <p className="text-xs text-muted-foreground text-center mt-2">{plan.footnote}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Garantie */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950/50 dark:via-green-950/50 dark:to-teal-950/50 border-2 border-emerald-400 dark:border-emerald-600 rounded-2xl p-6 text-center">
              <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">
                🛡️ Garantie Satisfait ou Remboursé — 30 jours
              </h3>
              <p className="text-emerald-700 dark:text-emerald-300 leading-relaxed max-w-lg mx-auto">
                Testez l'outil pendant <strong>30 jours</strong>. Pas satisfait ? Email → remboursement intégral, sans question.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <SalesFaq />

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à lancer votre workflow éditorial ?</h2>
          <p className="text-muted-foreground mb-8">
            Rejoignez les auteurs qui publient sur Amazon KDP avec un système éditorial structuré
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-500 text-white"
            onClick={() => handlePlanClick("pro")}
          >
            {isVipAvailable ? `Débloquer l'accès fondateur – 37€` : 'Accéder maintenant – 147€'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Paiement unique • Accès à vie • Mises à jour gratuites
          </p>
        </div>
      </section>

      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Finaliser votre commande</DialogTitle>
            <DialogDescription>
              Entrez votre email pour accéder au paiement sécurisé
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              ref={emailInputRef}
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onInput={(e) => setEmail(e.currentTarget.value)}
              disabled={isLoading}
              autoComplete="email"
            />
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleCheckout}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Redirection...
                </>
              ) : (
                <>
                  Passer au paiement
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Paiement sécurisé par Stripe • Garantie 30 jours
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bannière Zoom / Calendly */}
      <section className="py-10 bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-violet-600/20 border-y border-violet-500/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-white">
              <Play className="w-5 h-5 text-violet-400" />
              <span className="text-lg font-semibold">🎥 Je suis dispo en Zoom si vous voulez le voir en direct !</span>
            </div>
            <a
              href="https://calendly.com/boubetgeorges/nouvelle-reunion"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold px-6">
                📅 Réserver un créneau Zoom
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer avec liens SEO */}
      <footer className="py-12 border-t border-border/50 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                EbookStudio Pro
              </h3>
              <p className="text-gray-400 text-sm">
                Le workflow éditorial IA #1 en France. Créez et publiez votre livre sur Amazon KDP.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gray-200">📚 Guides Gratuits</h4>
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
                <li><button onClick={() => navigate("/formation")} className="text-gray-400 hover:text-violet-400 transition-colors">Formation complète</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gray-200">💡 Ressources</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate("/faq")} className="text-gray-400 hover:text-violet-400 transition-colors">FAQ & Assistance</button></li>
                <li><button onClick={() => navigate("/blog")} className="text-gray-400 hover:text-violet-400 transition-colors">Blog</button></li>
                <li><button onClick={() => navigate("/affiliation")} className="text-gray-400 hover:text-violet-400 transition-colors">Programme d'affiliation</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gray-200">📧 Newsletter</h4>
              <p className="text-gray-400 text-sm mb-3">Recevez nos conseils KDP gratuits</p>
              <NewsletterForm />
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-xs text-gray-500">
              © 2025 EbookStudio Pro • Workflow Éditorial IA pour Amazon KDP • Tous droits réservés
            </p>
          </div>
        </div>
      </footer>
      <ExitIntentPopup />
    </div>
  );
};

export default SalesPage;
