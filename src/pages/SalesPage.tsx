import { useState, useEffect, useRef } from "react";
import { trackDemoClick } from "@/utils/analytics";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, BookOpen, Zap, Download, Star, ArrowRight, Play, Loader2, Clock, HelpCircle, CheckCircle, CheckCircle2, Calculator, Gift, Mail, Send, Rocket } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ExitIntentPopup from "@/components/sales/ExitIntentPopup";
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
  
  // Vérifier disponibilité VIP (20 places à 37€)
  const { isVipAvailable, remainingSpots, isLoading: vipLoading } = useVipAvailability();

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
    document.title = "Créer un Ebook avec l'IA - Générateur de Livres Amazon KDP | 37€";
    
    // Meta description optimisée
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Créez un ebook professionnel avec l'intelligence artificielle. Générateur de livre IA complet pour autoédition Amazon KDP. Écrivez et publiez votre premier livre en quelques clics. Accès à vie pour seulement 37€.");
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
      ogDescription.setAttribute("content", "Générateur de livre IA pour Amazon KDP. Créez, écrivez et publiez votre ebook en autoédition facilement.");
    }
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute("content", "https://ebookstudio.fr/offres");
    }
  }, []);

  // Countdown to January 31, 2025
  useEffect(() => {
    // Countdown dynamique : 3 jours à partir de maintenant (créant urgence permanente)
    const getTargetDate = () => {
      const stored = sessionStorage.getItem('countdown_target');
      if (stored) {
        return new Date(stored);
      }
      const newTarget = new Date();
      newTarget.setDate(newTarget.getDate() + 3);
      newTarget.setHours(23, 59, 59, 999);
      sessionStorage.setItem('countdown_target', newTarget.toISOString());
      return newTarget;
    };
    const targetDate = getTargetDate();
    
    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: Sparkles, title: "Génération IA", description: "Plans d'ebook complets générés par intelligence artificielle" },
    { icon: BookOpen, title: "300+ Idées de Titres", description: "Bibliothèque de titres rentables par catégorie" },
    { icon: Download, title: "Export Pro", description: "Export PDF et EPUB professionnel en un clic" },
    { icon: Zap, title: "Outils Amazon KDP", description: "Analyse de marché et optimisation pour KDP" },
  ];

  const testimonials = [
    { name: "Marie D.", role: "Auteure Kindle", text: "J'ai créé 5 ebooks en 1 mois grâce à ce générateur. Mes revenus KDP ont triplé !", rating: 5, avatar: "MD", color: "bg-pink-500" },
    { name: "Thomas L.", role: "Entrepreneur", text: "L'outil parfait pour créer du contenu premium rapidement. ROI immédiat.", rating: 5, avatar: "TL", color: "bg-blue-500" },
    { name: "Sophie R.", role: "Coach Business", text: "La formation audio incluse m'a permis de comprendre toute la stratégie ebook.", rating: 5, avatar: "SR", color: "bg-purple-500" },
    { name: "Jean-Marc P.", role: "Auteur Indépendant", text: "En 3 semaines, j'ai publié mon premier ebook sur Amazon. Les outils KDP sont incroyables !", rating: 5, avatar: "JP", color: "bg-green-500" },
    { name: "Camille B.", role: "Formatrice en ligne", text: "J'utilise les ebooks générés comme lead magnets. Mon taux de conversion a doublé !", rating: 5, avatar: "CB", color: "bg-orange-500" },
    { name: "Nicolas F.", role: "Blogueur Pro", text: "La qualité des contenus générés est bluffante. Mes lecteurs adorent mes ebooks.", rating: 5, avatar: "NF", color: "bg-cyan-500" },
  ];

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "47",
      originalPrice: "97",
      period: "",
      description: "Idéal pour créer votre premier livre",
      badge: "🚀 DÉMARRAGE",
      discount: "",
      features: [
        "✨ 20 ebooks/mois",
        "📝 Chapitres inclus",
        "📄 Export PDF",
        "🎓 Modules 1-4 (suffisant pour créer votre livre)",
        "💬 Support email",
      ],
      blocked: [
        "❌ Couvertures IA",
        "❌ Traduction multi-langues",
        "❌ Générateur Audiobooks",
        "❌ Outils KDP Premium",
        "❌ Modules 5-12",
      ],
      cta: "Commencer à 47€",
      popular: false,
      footnote: "📌 Paiement unique – Accès immédiat",
    },
    {
      id: "pro",
      name: "Pro Lifetime",
      price: "97",
      originalPrice: "197",
      period: "",
      description: "Tout débloqué à vie",
      badge: "⭐ MEILLEURE OFFRE",
      discount: "🎯 Économie : 100€ (-51%)",
      features: [
        "✨ Ebooks illimités à vie",
        "📝 Chapitres illimités",
        "🎨 10 couvertures IA/mois",
        "📄 Export PDF / EPUB / Word / Google Docs",
        "🎓 Toutes les formations (12 modules + audio)",
        "📚 Gestionnaire Séries / Sagas",
        "📊 Outils KDP Premium complets",
        "🌍 Traduction multi-langues",
        "🎧 Générateur Audiobooks",
        "🔄 Mises à jour gratuites à vie",
        "💬 Support prioritaire inclus",
      ],
      blocked: [],
      cta: "🚀 Débloquer TOUT pour 97€",
      popular: true,
      footnote: "📌 Paiement unique – Accès complet à vie – Sans abonnement",
    },
  ];

  const handlePlanClick = (planId: string) => {
    // Si VIP disponible (< 20 places), offre à 37€
    // Sinon, rediriger vers les offres normales 47€/97€
    if (isVipAvailable) {
      navigate('/paiement-manuel');
    } else {
      // VIP épuisé → rediriger vers upsell avec le plan choisi
      navigate(`/upsell-paiement?plan=${planId === 'starter' ? 'starter' : 'pro'}`);
    }
  };

  const handleCheckout = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Veuillez entrer un email valide");
      return;
    }

    if (!selectedPlan) {
      toast.error("Veuillez sélectionner un plan");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("stripe-checkout", {
        body: {
          planId: selectedPlan,
          email: email.trim().toLowerCase(),
          successUrl: selectedPlan === "starter" 
            ? `${window.location.origin}/upsell?email=${encodeURIComponent(email.trim().toLowerCase())}`
            : `${window.location.origin}/paiement-succes`,
          cancelUrl: `${window.location.origin}/offres`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Pas d'URL de paiement reçue");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Erreur lors du paiement. Réessayez.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header Navigation */}
      <header className="bg-slate-950/95 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/offres" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">EbookStudio Pro</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
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
            {isVipAvailable ? `Offre Fondateur ${remainingSpots} places` : 'Voir les offres'}
          </Button>
        </div>
      </header>

      {/* Urgency Banner - rotating messages */}
      <UrgencyBanner />

      {/* Bannière Avant / Après */}
      <div className="bg-gradient-to-r from-slate-900 via-violet-950 to-slate-900 text-white py-8 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMDUiIGN4PSIyMCIgY3k9IjIwIiByPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-50" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-center text-xl md:text-2xl font-bold mb-6">
            🕐 Résultat en <span className="text-violet-400">5 minutes</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* AVANT */}
            <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">❌</span>
                <span className="font-bold text-lg text-red-300">AVANT</span>
              </div>
              <ul className="space-y-2 text-sm text-red-200/90">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span>Page blanche pendant des heures</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span>Pas d'idée de structure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span>Syndrome de l'imposteur</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span>Projet abandonné en cours de route</span>
                </li>
              </ul>
            </div>
            {/* APRÈS */}
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">✅</span>
                <span className="font-bold text-lg text-emerald-300">APRÈS (5 min)</span>
              </div>
              <ul className="space-y-2 text-sm text-emerald-200/90">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  <span>Plan complet généré automatiquement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  <span>Structure claire chapitre par chapitre</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  <span>Premiers contenus déjà rédigés</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  <span>Prêt à exporter et publier</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* CTA sous Avant/Après */}
          <div className="mt-6 flex flex-col items-center">
            <Button 
              size="lg" 
              className="text-base md:text-lg px-6 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg mb-3"
              onClick={() => {
                trackDemoClick("Voir le résultat par moi-même (démo gratuite)");
                document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Play className="w-5 h-5 mr-2" />
              Voir le résultat par moi-même (démo gratuite)
            </Button>
            <p className="text-xs text-white/70">
              ✅ Sans carte bancaire • ✅ Résultat visible en 5 min
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 px-4">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          
          {/* Preuve concrète : exemple réel généré */}
          <div className="max-w-4xl mx-auto mb-10 p-6 md:p-8 bg-gradient-to-br from-violet-50 via-indigo-50 to-purple-50 dark:from-violet-950/40 dark:via-indigo-950/30 dark:to-purple-950/40 rounded-2xl border-2 border-violet-300 dark:border-violet-700 shadow-xl">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-foreground">
              📖 Exemple réel généré en 5 minutes
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Plan généré */}
              <div className="bg-white/80 dark:bg-white/10 rounded-xl p-5 border border-violet-200 dark:border-violet-700/50">
                <h3 className="font-bold text-lg mb-3 text-foreground flex items-center gap-2">
                  <span className="text-xl">📋</span> Plan généré :
                </h3>
                <p className="text-sm font-semibold text-violet-700 dark:text-violet-300 mb-3">
                  "Créer un revenu avec un ebook"
                </p>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="bg-violet-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <span>Introduction : pourquoi l'ebook reste rentable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-violet-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <span>Choisir un sujet qui se vend</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-violet-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <span>Structurer un ebook clair et logique</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-violet-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                    <span>Rédiger rapidement sans blocage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-violet-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">5</span>
                    <span>Publier et vendre son ebook</span>
                  </li>
                </ol>
              </div>
              
              {/* Extrait de chapitre */}
              <div className="bg-white/80 dark:bg-white/10 rounded-xl p-5 border border-emerald-200 dark:border-emerald-700/50">
                <h3 className="font-bold text-lg mb-3 text-foreground flex items-start gap-2">
                  <span className="text-xl">✍️</span> Extrait généré :
                </h3>
                <blockquote className="text-sm text-muted-foreground italic border-l-4 border-emerald-400 pl-4 py-2 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-r-lg leading-relaxed">
                  "Créer un ebook rentable ne demande pas d'être écrivain professionnel. La clé est d'avoir une structure claire, un objectif précis et une méthode simple. Dans ce chapitre, nous allons poser les bases pour passer de l'idée à un contenu concret…"
                </blockquote>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  ⚡ Généré automatiquement en quelques secondes
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-lg mb-3"
                onClick={() => {
                  trackDemoClick("Accéder à la démo gratuite (sans carte bancaire)");
                  document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Play className="w-5 h-5 mr-2" />
                Accéder à la démo gratuite (sans carte bancaire)
              </Button>
              <p className="text-sm text-muted-foreground">
                ✅ Accès immédiat • ✅ Aucune inscription requise • ✅ Tu juges par toi-même
              </p>
            </div>
          </div>
          
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Générateur IA Professionnel
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Votre Premier Ebook
            <br />
            <span className="text-primary">Publié Cette Semaine</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
            Fini la page blanche et les heures de travail. L'IA fait 90% du travail, 
            <strong className="text-foreground"> vous gardez 100% des droits et revenus</strong>.
          </p>
          
          <p className="text-lg text-primary font-semibold mb-8">
            ✅ Aucune compétence technique requise • ✅ Résultats en quelques minutes
          </p>

          {/* Phrase d'accroche au-dessus de la vidéo */}
          <div className="text-center mb-6">
            <p className="text-lg md:text-xl font-semibold text-foreground">
              🎬 Regarde 3 minutes : tu verras exactement le résultat avant toute décision.
            </p>
            <p className="text-sm text-muted-foreground mt-1.5">
              Sans carte bancaire • Sans engagement
            </p>
          </div>

          {/* Vidéo de présentation - Carte Premium */}
          <div className="max-w-4xl mx-auto mb-10">
            <div className="relative p-3 md:p-5 bg-gradient-to-br from-slate-50 via-violet-50/50 to-purple-50 dark:from-slate-900 dark:via-violet-950/30 dark:to-purple-950/30 rounded-3xl shadow-[0_8px_40px_-12px_rgba(139,92,246,0.25)] border border-violet-200/50 dark:border-violet-800/40">
              {/* Badge premium */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <Badge className="bg-gradient-to-r from-violet-600 to-purple-600 text-white border-0 shadow-lg px-4 py-1.5 text-sm">
                  <Play className="w-3.5 h-3.5 mr-1.5" />
                  Vidéo démo (3 min)
                </Badge>
              </div>
              
              {/* Conteneur vidéo agrandi */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-violet-300/30 dark:border-violet-700/30">
                <div className="relative" style={{ paddingBottom: '62.5%' }}> {/* Ratio 16:10 pour plus de hauteur */}
                  <iframe 
                    title="Présentation EbookStudio" 
                    src="https://player.vimeo.com/video/1153641502?h=d5388db3e9" 
                    className="absolute inset-0 w-full h-full"
                    frameBorder="0" 
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
              
              {/* Repères de timing */}
              <div className="flex justify-center gap-4 md:gap-8 mt-4 text-xs md:text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5 bg-white/80 dark:bg-white/10 px-3 py-1.5 rounded-full border border-violet-200 dark:border-violet-700/50">
                  <Clock className="w-3.5 h-3.5 text-violet-500" />
                  <span><strong className="text-foreground">0:20</strong> – Présentation</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/80 dark:bg-white/10 px-3 py-1.5 rounded-full border border-violet-200 dark:border-violet-700/50">
                  <Clock className="w-3.5 h-3.5 text-violet-500" />
                  <span><strong className="text-foreground">1:10</strong> – Génération IA</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/80 dark:bg-white/10 px-3 py-1.5 rounded-full border border-violet-200 dark:border-violet-700/50">
                  <Clock className="w-3.5 h-3.5 text-violet-500" />
                  <span><strong className="text-foreground">2:15</strong> – Résultat</span>
                </div>
              </div>
              
              {/* CTA unique sous la vidéo */}
              <div className="mt-5 text-center">
                <Button 
                  size="lg" 
                  className="text-base md:text-lg px-8 py-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={() => {
                    trackDemoClick("Accéder à la démo gratuite (sans carte bancaire)");
                    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Accéder à la démo gratuite (sans carte bancaire)
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  ✅ Sans carte bancaire • ✅ Accès immédiat
                </p>
          </div>
            </div>
          </div>

          {/* Section supprimée : Tunnel 2026 - déplacée hors page de vente */}

          {/* Section "Ce que la démo te montre en 5 minutes" */}
          <div className="max-w-3xl mx-auto mb-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl border border-emerald-300 dark:border-emerald-700">
            <h3 className="text-xl md:text-2xl font-bold text-center mb-5 text-emerald-800 dark:text-emerald-200">
              🎯 Ce que la démo te montre en 5 minutes :
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/80 dark:bg-white/10 rounded-xl p-4 text-center border border-emerald-200 dark:border-emerald-700/50">
                <div className="text-2xl mb-2">📋</div>
                <span className="font-semibold text-sm text-foreground">Plan complet</span>
              </div>
              <div className="bg-white/80 dark:bg-white/10 rounded-xl p-4 text-center border border-emerald-200 dark:border-emerald-700/50">
                <div className="text-2xl mb-2">🏗️</div>
                <span className="font-semibold text-sm text-foreground">Structure claire</span>
              </div>
              <div className="bg-white/80 dark:bg-white/10 rounded-xl p-4 text-center border border-emerald-200 dark:border-emerald-700/50">
                <div className="text-2xl mb-2">✍️</div>
                <span className="font-semibold text-sm text-foreground">Premiers chapitres</span>
              </div>
              <div className="bg-white/80 dark:bg-white/10 rounded-xl p-4 text-center border border-emerald-200 dark:border-emerald-700/50">
                <div className="text-2xl mb-2">📤</div>
                <span className="font-semibold text-sm text-foreground">Export PDF/EPUB</span>
              </div>
            </div>
          </div>

          {/* Bloc Démo - Résultat immédiat */}
          <div id="demo" className="max-w-3xl mx-auto mb-12 p-8 bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 dark:from-violet-950/40 dark:via-purple-950/30 dark:to-indigo-950/40 rounded-3xl border-2 border-violet-300 dark:border-violet-700 shadow-xl">
            <p className="text-center text-lg text-foreground mb-6">
              Entre ton idée, et vois le résultat en 5 minutes.
            </p>
            
            <div className="flex flex-col items-center">
              <Button 
                size="lg" 
                className="text-lg md:text-xl px-10 py-7 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 mb-4"
                onClick={() => {
                  trackDemoClick("Accéder à la démo gratuite");
                  navigate('/demo');
                }}
              >
                <Play className="w-6 h-6 mr-2" />
                Accéder à la démo gratuite
              </Button>
              <p className="text-sm text-muted-foreground">
                ✅ Accès immédiat • ✅ Sans carte bancaire • ✅ Sans engagement
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {isVipAvailable ? `Offre Fondateur à 37€ (${remainingSpots} places)` : 'Voir les offres dès 47€'}
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => {
                trackDemoClick("Essayer la Démo Gratuite");
                navigate('/demo');
              }}
            >
              <Play className="w-5 h-5 mr-2" />
              Essayer la Démo Gratuite
            </Button>
          </div>

          {/* Live viewer count + Compteur live */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <LiveViewerCount />
            <LiveEbookCounter variant="compact" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">5000+</div>
              <div className="text-sm text-muted-foreground">Utilisateurs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">300+</div>
              <div className="text-sm text-muted-foreground">Idées de Titres</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">4.9/5</div>
              <div className="text-sm text-muted-foreground">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/5 via-violet-500/5 to-background">
        <div className="max-w-4xl mx-auto">
          <AuthorQuiz showEmailCapture={true} />
        </div>
      </section>

      {/* Demo Section */}
      {showDemo && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Découvrez le Générateur en Action</h2>
            <Card className="overflow-hidden border-2 border-primary/20">
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <div className="text-center p-8">
                    <BookOpen className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-4">Essayez Gratuitement</h3>
                    <p className="text-muted-foreground mb-6">
                      Découvrez l'interface et testez la génération de plans
                    </p>
                    <Button size="lg" onClick={() => {
                      trackDemoClick("Accéder à la Démo");
                      navigate('/demo');
                    }}>
                      Accéder à la Démo
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Tout ce dont vous avez besoin</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Un générateur complet avec tous les outils pour créer, optimiser et vendre vos ebooks
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

      {/* What's Included */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Ce qui est inclus</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Générateur de plans d'ebook IA",
              "300+ idées de titres par catégorie",
              "Export PDF professionnel",
              "Export EPUB pour Kindle",
              "Outils d'analyse Amazon KDP",
              "Générateur de couvertures",
              "Formation PDF complète",
              "Formation Audio (plan Annuel+)",
              "Templates de chapitres",
              "Banque d'images intégrée",
              "Gestion de projets multiples",
              "Historique des versions",
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-background rounded-lg">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Ce qu'en disent nos utilisateurs</h2>
          <p className="text-muted-foreground text-center mb-12">+5000 entrepreneurs utilisent déjà notre générateur</p>
          
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
          
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 dark:text-green-400 px-6 py-3 rounded-full font-medium">
              <CheckCircle className="w-5 h-5" />
              <span>Satisfaction garantie à 100% - Plus de 15 000 ebooks générés</span>
            </div>
          </div>
        </div>
      </section>

      {/* Star Testimonials Carousel */}
      <StarTestimonials />

      {/* Video Testimonials Section */}
      <VideoTestimonials />

      {/* Price Comparison Table */}
      <PriceComparison />

      {/* ROI Calculator Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-emerald-50/50 via-background to-teal-50/50 dark:from-emerald-950/20 dark:via-background dark:to-teal-950/20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">💰 Combien pouvez-vous gagner ?</h2>
          <p className="text-muted-foreground text-center mb-8">
            Calculez votre potentiel de revenus passifs avec Amazon KDP
          </p>
          <KdpRoiCalculator />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Une offre simple, tout inclus</h2>
          <p className="text-muted-foreground text-center mb-6">
            Paiement unique – Accès illimité à vie
          </p>
          
          {/* Why 37€ Banner */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
              <p className="text-lg font-medium text-foreground mb-2">
                💎 Pourquoi seulement <span className="text-emerald-600 dark:text-emerald-400 font-bold">37€</span> ?
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xl mx-auto mb-3">
                Toutes les formations sont intégrées directement dans le générateur : vous ne serez jamais perdu.
                <br />
                <span className="font-medium text-foreground">Support inclus + mises à jour gratuites à vie.</span> À ce prix, c{"'"}est un cadeau.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
                onClick={() => navigate('/valeur-offre')}
              >
                <Calculator className="w-4 h-4 mr-2" />
                Voir le détail de la valeur (12 modules + 5 bonus)
              </Button>
            </div>
          </div>

          {/* Spots Counter - Dynamic */}
          {isVipAvailable && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl p-4 text-white text-center shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjEiIGN4PSIxMCIgY3k9IjEwIiByPSIxIi8+PC9zdmc+')] opacity-30" />
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-2xl">🔥</span>
                  <span className="font-bold text-lg">Places Fondateur restantes à 37€</span>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-yellow-300 animate-pulse">{remainingSpots}</span>
                    <span className="text-2xl font-bold text-white/80">/ 20</span>
                  </div>
                </div>
                <div className="mt-3 bg-white/20 rounded-full h-3 max-w-xs mx-auto overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${((20 - (remainingSpots ?? 20)) / 20) * 100}%` }}
                  />
                </div>
                <p className="text-sm mt-2 text-white/80">
                  ⚡ Places limitées — Offre Fondateur exclusive
                </p>
              </div>
            </div>
          </div>
          )}

          {/* Countdown Timer */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-6 text-white text-center shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Clock className="w-5 h-5 animate-pulse" />
                <span className="font-bold text-lg">🔥 Offre spéciale lancement – Prix réduit limité</span>
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
              <p className="text-sm mt-3 text-white/80">⏳ Cette offre peut être retirée à tout moment</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative border-2 flex flex-col ${plan.popular ? 'border-primary shadow-xl bg-gradient-to-br from-primary/5 to-primary/10 scale-[1.02]' : 'border-border shadow-md'}`}
              >
                {plan.badge && (
                  <Badge className={`absolute -top-3 left-1/2 -translate-x-1/2 ${plan.id === 'lifetime' ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-primary'}`}>
                    {plan.badge}
                  </Badge>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    {plan.originalPrice && (
                      <span className="text-xl text-muted-foreground line-through mr-2">{plan.originalPrice} €</span>
                    )}
                    <span className="text-4xl font-bold">{plan.price} €</span>
                    <div className="text-sm text-muted-foreground mt-1">(paiement unique)</div>
                  </div>
                  <CardDescription className="mt-2 font-medium">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.discount && (
                    <div className="mt-4 p-3 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-lg text-center">
                      <span className="font-bold text-orange-600 dark:text-orange-400">{plan.discount}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  <Button 
                    className={`w-full ${plan.id === 'lifetime' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 text-white' : ''}`}
                    size="lg"
                    variant={plan.popular ? "default" : plan.id === 'lifetime' ? "default" : "outline"}
                    onClick={() => handlePlanClick(plan.id)}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  {plan.footnote && (
                    <p className="text-xs text-muted-foreground text-center">{plan.footnote}</p>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Garantie Satisfait ou Remboursé */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="relative bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950/50 dark:via-green-950/50 dark:to-teal-950/50 border-2 border-emerald-400 dark:border-emerald-600 rounded-2xl p-6 shadow-lg">
              {/* Badge circulaire */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-xl border-4 border-white dark:border-gray-800">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-yellow-900 shadow-md">
                    ✓
                  </div>
                </div>
              </div>
              
              <div className="text-center pt-6">
                <h3 className="text-xl md:text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">
                  🛡️ Garantie Satisfait ou Remboursé
                </h3>
                <div className="inline-block bg-emerald-500 text-white font-bold text-lg px-4 py-1 rounded-full mb-3">
                  30 JOURS
                </div>
                <p className="text-emerald-700 dark:text-emerald-300 leading-relaxed max-w-lg mx-auto">
                  Testez l'outil pendant <strong>30 jours complets</strong>. Si vous n'êtes pas 100% satisfait(e), 
                  envoyez-moi un simple email et je vous rembourse <strong>intégralement</strong>, sans question.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-emerald-600 dark:text-emerald-400">
                  <span className="flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Aucun risque
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Remboursement immédiat
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Sans justification
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <TrustBadges />

      {/* Success Stories Gallery */}
      <section className="py-20 px-4 bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="max-w-6xl mx-auto">
          <SuccessGallery variant="grid" limit={3} />
        </div>
      </section>

      {/* Mini FAQ Section */}
      <SalesFaq />

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à créer vos ebooks ?</h2>
          <p className="text-muted-foreground mb-8">
            Rejoignez les entrepreneurs qui utilisent notre générateur pour publier sur Amazon KDP
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6"
            onClick={() => handlePlanClick("pro")}
          >
            {isVipAvailable ? `Offre Fondateur – ${37}€` : 'Accéder maintenant – 47€'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Paiement unique • Accès illimité à vie • Mises à jour gratuites
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

      {/* Bouton Sticky Achat - Mobile (bottom) */}
      <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden">
        <button
          onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold py-4 px-4 rounded-full shadow-xl hover:shadow-2xl transition-all border-2 border-white/20"
        >
          <Zap className="w-5 h-5" />
          <span>{isVipAvailable ? `Offre Fondateur 37€ (${remainingSpots} places)` : 'Voir les offres dès 47€'}</span>
        </button>
      </div>

      {/* Footer avec liens SEO */}
      <footer className="py-12 pb-20 md:pb-12 border-t border-border/50 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            {/* Logo & Description */}
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                EbookStudio Pro
              </h3>
              <p className="text-gray-400 text-sm">
                Le générateur d'ebook IA #1 en France. Créez et publiez votre livre sur Amazon KDP en 24h.
              </p>
            </div>
            
            {/* Guides SEO */}
            <div>
              <h4 className="font-semibold mb-3 text-gray-200">📚 Guides Gratuits</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={() => navigate("/ecrire-livre-chatgpt")} className="text-gray-400 hover:text-violet-400 transition-colors">
                    Écrire un livre avec ChatGPT
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/creer-ebook-ia")} className="text-gray-400 hover:text-violet-400 transition-colors">
                    Créer un ebook avec l'IA
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/generateur-ebook")} className="text-gray-400 hover:text-violet-400 transition-colors">
                    Générateur ebook IA
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Produit */}
            <div>
              <h4 className="font-semibold mb-3 text-gray-200">🚀 Produit</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={() => navigate("/demo")} className="text-gray-400 hover:text-violet-400 transition-colors">
                    Essai gratuit
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/valeur-offre")} className="text-gray-400 hover:text-violet-400 transition-colors">
                    Valeur de l'offre
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/formation")} className="text-gray-400 hover:text-violet-400 transition-colors">
                    Formation complète
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Ressources */}
            <div>
              <h4 className="font-semibold mb-3 text-gray-200">💡 Ressources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={() => navigate("/faq")} className="text-gray-400 hover:text-violet-400 transition-colors">
                    FAQ & Assistance
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/blog")} className="text-gray-400 hover:text-violet-400 transition-colors">
                    Blog
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/affiliation")} className="text-gray-400 hover:text-violet-400 transition-colors">
                    Programme d'affiliation
                  </button>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-semibold mb-3 text-gray-200">📧 Newsletter</h4>
              <p className="text-gray-400 text-sm mb-3">Recevez nos conseils KDP gratuits</p>
              <NewsletterForm />
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-xs text-gray-500">
              © 2025 EbookStudio Pro • Générateur de Livre IA pour Amazon KDP • Tous droits réservés
            </p>
          </div>
        </div>
      </footer>

      {/* Exit Intent Popup */}
      <ExitIntentPopup />

      {/* Scroll Intent Popup at 50% */}
      <ScrollIntentPopup scrollThreshold={50} />

      {/* Live Activity Notifications - remplace SocialProofNotifications */}
      <LiveActivityNotifications position="bottom-left" intervalMs={30000} />

      {/* Sticky CTA Bar */}
      <StickyCtaBar />

      {/* Floating Mobile CTA */}
      <FloatingMobileCta />
    </div>
  );
};

export default SalesPage;
