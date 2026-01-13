import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, BookOpen, Zap, Download, Star, ArrowRight, Play, Loader2, Clock, HelpCircle, CheckCircle, Calculator, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ExitIntentPopup from "@/components/sales/ExitIntentPopup";
import { generateKdpNichesPdf } from "@/utils/generateKdpNichesPdf";
const SalesPage = () => {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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
    const targetDate = new Date('2025-01-31T23:59:59');
    
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
      id: "lifetime",
      name: "Accès Complet à Vie",
      price: "37",
      originalPrice: "97",
      period: "",
      description: "Offre réservée aux 50 premiers utilisateurs",
      badge: "🔥 50 PREMIERS INSCRITS",
      discount: "🎯 Économie immédiate : 60 € (-62%)",
      features: [
        "✨ Ebooks illimités à vie",
        "📝 Chapitres illimités",
        "🎨 Couvertures illimitées",
        "📄 Export PDF / EPUB / Word / Google Docs",
        "🎓 Toutes les formations (texte + audio)",
        "📚 Gestionnaire Séries / Sagas",
        "📊 Outils KDP Premium",
        "🔄 Mises à jour gratuites à vie",
        "💬 Support prioritaire inclus",
      ],
      cta: "🚀 Rejoindre les 50 Premiers",
      popular: true,
      footnote: "📌 Paiement unique – Accès immédiat et illimité – Sans abonnement",
    },
  ];

  const handlePlanClick = (planId: string) => {
    setSelectedPlan(planId);
    setShowEmailDialog(true);
  };

  const handleCheckout = async () => {
    if (!email || !selectedPlan) {
      toast.error("Veuillez entrer votre email");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("stripe-checkout", {
        body: {
          planId: selectedPlan,
          email,
          successUrl: `${window.location.origin}/paiement-succes`,
          cancelUrl: `${window.location.origin}/offres`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        // Ouvrir dans nouvel onglet pour une meilleure expérience
        const newWindow = window.open(data.url, '_blank');
        if (!newWindow) {
          // Fallback si popup bloqué
          window.location.href = data.url;
        } else {
          setShowEmailDialog(false);
          toast.success("Page de paiement ouverte dans un nouvel onglet");
        }
      } else {
        throw new Error("URL de paiement non reçue");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Erreur lors de la création du paiement");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Bannière Lancement Spécial */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white py-5 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMSIgY3g9IjIwIiBjeT0iMjAiIHI9IjIiLz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl">🙏</span>
            <span className="font-bold text-xl md:text-2xl">
              Merci d'être arrivé(e) jusqu'ici !
            </span>
            <span className="text-3xl">❤️</span>
          </div>
          <p className="text-base md:text-lg font-medium mb-3">
            Vous faites partie des personnes qui veulent <strong>vraiment</strong> changer leur vie avec l'écriture.
          </p>
          <div className="bg-white/20 backdrop-blur-sm px-4 py-3 rounded-xl inline-block">
            <p className="text-sm md:text-base font-bold">
              🎁 Pour vous remercier : <span className="text-yellow-200">Accès à vie pour seulement 37€</span> au lieu de 97€
            </p>
            <p className="text-xs mt-1 opacity-90">
              ⚡ Offre réservée aux <strong>50 premiers inscrits</strong> – Ensuite le prix remonte
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 px-4">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          
          {/* Message personnel */}
          <div className="max-w-3xl mx-auto mb-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl border-2 border-amber-200 dark:border-amber-800">
            <p className="text-lg md:text-xl text-amber-900 dark:text-amber-100 leading-relaxed">
              <span className="text-2xl">👋</span> <strong>Salut !</strong> Si vous êtes ici, c'est que vous avez un rêve : 
              <strong> écrire et publier votre propre livre</strong>. 
              <br className="hidden md:block" />
              Je sais à quel point ça peut sembler compliqué... C'est pour ça que j'ai créé cet outil.
              <br />
              <span className="text-amber-700 dark:text-amber-300 font-semibold">
                En vous inscrivant aujourd'hui, vous rejoignez une communauté d'auteurs qui osent se lancer. 🚀
              </span>
            </p>
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

          {/* Vidéo de présentation */}
          <div className="max-w-3xl mx-auto mb-10">
            <Card className="overflow-hidden border-2 border-primary/30 shadow-2xl">
              <CardContent className="p-0">
                <div className="relative aspect-video">
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
              </CardContent>
            </Card>
            <p className="text-sm text-muted-foreground mt-3 flex items-center justify-center gap-2">
              <Play className="w-4 h-4" />
              Découvrez en 3 minutes comment créer votre premier ebook
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Profiter de l'Offre à 37€
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => navigate('/demo')}
            >
              <Play className="w-5 h-5 mr-2" />
              Essayer la Démo Gratuite
            </Button>
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
                    <Button size="lg" onClick={() => navigate('/demo')}>
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

          {/* Countdown Timer */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-6 text-white text-center shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Clock className="w-5 h-5 animate-pulse" />
                <span className="font-bold text-lg">🔥 Tarif de lancement – Après le 31 janvier : 97€</span>
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
              <p className="text-sm mt-3 text-white/80">Offre valable jusqu{"'"}au 31 janvier 2025</p>
            </div>
          </div>
          
          <div className="flex justify-center">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className="relative border-2 flex flex-col max-w-md w-full border-primary shadow-xl bg-gradient-to-br from-primary/5 to-primary/10"
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

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-2">
              <HelpCircle className="w-4 h-4 mr-2" />
              Questions Fréquentes
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Tout ce que vous devez savoir</h2>
            <p className="text-muted-foreground">
              Réponses aux questions les plus courantes sur notre générateur
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-6 bg-card">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                Comment fonctionne la garantie satisfait ou remboursé ?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                Vous disposez de 30 jours après votre achat pour demander un remboursement complet, sans condition. 
                Il vous suffit de nous contacter par email et nous procédons au remboursement sous 48h. 
                Nous sommes convaincus que vous allez adorer notre outil !
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-lg px-6 bg-card">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                Comment accéder à mon compte après achat ?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                Après votre paiement, vous recevez immédiatement un email avec votre code d'accès personnel. 
                Connectez-vous sur la plateforme avec votre email et ce code pour accéder à tous vos outils. 
                L'accès est instantané, vous pouvez commencer à créer vos ebooks dans les minutes qui suivent !
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-lg px-6 bg-card">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                Les mises à jour sont-elles incluses ?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                Oui ! Toutes les mises à jour sont gratuites et automatiques. Nous améliorons constamment 
                l'outil avec de nouvelles fonctionnalités, modèles et optimisations. Avec l'offre Lifetime, 
                vous bénéficiez de toutes les évolutions futures sans frais supplémentaires.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg px-6 bg-card">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                Puis-je publier mes ebooks sur Amazon KDP ?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                Absolument ! Les ebooks générés vous appartiennent à 100%. Vous pouvez les publier sur 
                Amazon KDP, Kobo, Apple Books ou toute autre plateforme. Notre outil inclut même des 
                fonctionnalités spécifiques pour optimiser vos publications KDP (mots-clés, catégories, descriptions).
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border rounded-lg px-6 bg-card">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                Que comprend l'offre à 37€ ?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                L'offre à 37€ vous donne un accès complet et illimité à vie : ebooks illimités, chapitres illimités, 
                couvertures illimitées, toutes les formations (texte et audio), tous les outils KDP, 
                et toutes les mises à jour futures. C'est l'accès le plus complet possible.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border rounded-lg px-6 bg-card">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                Comment fonctionne le support ?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                Tous les utilisateurs bénéficient d'un support prioritaire par email avec réponse rapide. 
                Nous sommes là pour vous aider à tirer le meilleur parti de l'outil.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à créer vos ebooks ?</h2>
          <p className="text-muted-foreground mb-8">
            Rejoignez +5000 entrepreneurs qui utilisent notre générateur pour créer du contenu professionnel
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6"
            onClick={() => handlePlanClick("lifetime")}
          >
            Accéder Maintenant – 37€
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
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleCheckout}
              disabled={isLoading || !email}
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

      {/* Bouton bonus fallback (mobile) */}
      <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden">
        <button
          onClick={() => {
            generateKdpNichesPdf();
            toast.success("🎉 Votre guide PDF a été téléchargé !");
          }}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium py-3 px-4 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <Gift className="w-4 h-4" />
          <span>🎁 Télécharger le Guide Gratuit (10 Niches KDP)</span>
        </button>
      </div>

      {/* Footer avec liens SEO */}
      <footer className="py-8 pb-20 md:pb-8 text-center border-t border-border/50 bg-slate-50/50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 mb-4 text-sm">
            <button 
              onClick={() => navigate("/ecrire-livre-chatgpt")}
              className="text-violet-600 hover:text-violet-700 underline-offset-2 hover:underline"
            >
              📚 Guide : Écrire un Livre avec ChatGPT
            </button>
            <button 
              onClick={() => navigate("/valeur-offre")}
              className="text-muted-foreground hover:text-foreground"
            >
              Valeur de l'offre
            </button>
            <button 
              onClick={() => navigate("/demo")}
              className="text-muted-foreground hover:text-foreground"
            >
              Démo gratuite
            </button>
          </div>
          <p className="text-xs text-muted-foreground/50">
            © 2025 EbookStudio.fr • Générateur de Livre IA pour Amazon KDP
          </p>
        </div>
      </footer>

      {/* Exit Intent Popup */}
      <ExitIntentPopup />
    </div>
  );
};

export default SalesPage;
