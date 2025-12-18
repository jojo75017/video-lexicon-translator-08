import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, BookOpen, Zap, Download, Star, ArrowRight, Play, Loader2, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SalesPage = () => {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Countdown to March 31, 2026
  useEffect(() => {
    const targetDate = new Date('2026-03-31T23:59:59');
    
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
    { name: "Marie D.", role: "Auteure Kindle", text: "J'ai créé 5 ebooks en 1 mois grâce à ce générateur. Mes revenus KDP ont triplé !", rating: 5 },
    { name: "Thomas L.", role: "Entrepreneur", text: "L'outil parfait pour créer du contenu premium rapidement. ROI immédiat.", rating: 5 },
    { name: "Sophie R.", role: "Coach Business", text: "La formation audio incluse m'a permis de comprendre toute la stratégie ebook.", rating: 5 },
  ];

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "27",
      originalPrice: null,
      period: "",
      description: "Pour débuter",
      badge: null,
      features: [
        "5 ebooks (crédits inclus)",
        "10 chapitres maximum par ebook",
        "3 couvertures incluses",
        "Export PDF",
        "🎓 Formation Ebook incluse",
        "Support email",
      ],
      cta: "Commencer",
      popular: false,
      footnote: "📌 Accès immédiat – aucun abonnement",
    },
    {
      id: "pro",
      name: "Pro",
      price: "67",
      originalPrice: null,
      period: "",
      description: "⭐ Le plus populaire",
      badge: "Plus populaire",
      features: [
        "20 ebooks",
        "20 chapitres maximum par ebook",
        "10 couvertures",
        "Export PDF + EPUB",
        "🎓 3 formations incluses",
        "📚 Gestionnaire de Séries / Sagas",
        "Outils KDP avancés",
        "Support prioritaire",
      ],
      cta: "Choisir Pro",
      popular: true,
      footnote: "📌 Paiement unique – accès complet aux fonctionnalités Pro",
    },
    {
      id: "lifetime",
      name: "Lifetime",
      price: "397",
      originalPrice: "897",
      period: "",
      description: "Accès à vie — Tout inclus",
      badge: "OFFRE DE LANCEMENT",
      discount: "🎯 Économie immédiate : 500 €",
      features: [
        "Ebooks illimités à vie",
        "Chapitres illimités",
        "Couvertures illimitées",
        "Export PDF / EPUB / Word",
        "🎓 Toutes les formations (texte + audio)",
        "📚 Séries / Sagas complet",
        "Outils KDP Premium",
        "Mises à jour gratuites à vie",
        "Support VIP 24/7",
      ],
      cta: "Accéder à vie",
      popular: false,
      footnote: null,
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
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Générateur IA Professionnel
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Créez des Ebooks Professionnels
            <br />
            <span className="text-primary">en Quelques Minutes</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            L'outil IA complet pour générer des plans d'ebook, créer du contenu de qualité 
            et publier sur Amazon KDP avec succès.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => setShowDemo(true)}
            >
              <Play className="w-5 h-5 mr-2" />
              Voir la Démo
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Voir les Offres
              <ArrowRight className="w-5 h-5 ml-2" />
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
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Ce qu'en disent nos utilisateurs</h2>
          <p className="text-muted-foreground text-center mb-12">+5000 entrepreneurs utilisent déjà notre générateur</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <div className="flex gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-foreground text-base">
                    "{testimonial.text}"
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Une offre simple, sans abonnement</h2>
          <p className="text-muted-foreground text-center mb-6">
            3 niveaux en paiement unique – Commencez maintenant et créez vos premiers ebooks dès aujourd'hui
          </p>
          
          {/* Countdown Timer */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-6 text-white text-center shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Clock className="w-5 h-5 animate-pulse" />
                <span className="font-bold text-lg">🔥 Offre de lancement - Économisez 500€ sur Lifetime</span>
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
              <p className="text-sm mt-3 text-white/80">Offre valable jusqu'au 31 mars 2026</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative border-2 flex flex-col ${plan.popular ? 'border-primary shadow-xl scale-105 z-10' : plan.id === 'lifetime' ? 'border-orange-500 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30' : 'border-border'}`}
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
                    {plan.id !== 'lifetime' && (
                      <div className="text-sm text-muted-foreground mt-1">(paiement unique)</div>
                    )}
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

          {/* Guarantee */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 px-6 py-3 rounded-full">
              <Check className="w-5 h-5" />
              <span className="font-medium">Garantie satisfait ou remboursé 30 jours</span>
            </div>
          </div>
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
            onClick={() => handlePlanClick("starter")}
          >
            Commencer à 27€/mois
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Annulez à tout moment • Support inclus • Mises à jour gratuites
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

      {/* Footer */}
      <footer className="py-6 text-center border-t border-border/50">
        <p className="text-xs text-muted-foreground/50">
          © 2024
        </p>
      </footer>
    </div>
  );
};

export default SalesPage;
