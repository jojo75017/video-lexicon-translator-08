import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, BookOpen, Zap, Download, Star, ArrowRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SalesPage = () => {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);

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
      name: "Mensuel",
      price: "27",
      period: "/mois",
      description: "Accès complet + mises à jour",
      features: [
        "Générateur de plans IA illimité",
        "300+ idées de titres",
        "Export PDF/EPUB",
        "Outils Amazon KDP",
        "Formation PDF incluse",
        "Support email",
      ],
      cta: "Commencer maintenant",
      popular: false,
      link: "https://www.trafic-affiliation.com/pagedeventeebook",
      external: true,
    },
    {
      name: "Annuel",
      price: "197",
      period: "/an",
      originalPrice: "324",
      description: "Économisez 40% - ~16€/mois",
      features: [
        "Tout du plan Mensuel",
        "Formation Audio complète",
        "Templates premium",
        "Accès prioritaire nouveautés",
        "Support prioritaire",
        "2 mois offerts",
      ],
      cta: "Économiser 40%",
      popular: true,
      link: null,
      external: false,
    },
    {
      name: "Lifetime",
      price: "297",
      period: " une fois",
      description: "Achat unique - Accès à vie",
      features: [
        "Tout du plan Annuel",
        "Accès à vie garanti",
        "Toutes les futures mises à jour",
        "Licence commerciale",
        "Coaching de démarrage",
        "Communauté privée",
      ],
      cta: "Accès à vie",
      popular: false,
      link: null,
      external: false,
    },
  ];

  const handlePlanClick = (plan: typeof plans[0]) => {
    if (plan.external && plan.link) {
      window.open(plan.link, "_blank");
    } else {
      // TODO: Implement Stripe checkout for annual and lifetime
      alert("Paiement Stripe bientôt disponible ! En attendant, choisissez l'offre mensuelle.");
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
                    <Button size="lg" onClick={() => navigate('/ebook-ideas')}>
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
          <h2 className="text-3xl font-bold text-center mb-4">Choisissez votre formule</h2>
          <p className="text-muted-foreground text-center mb-12">
            Commencez maintenant et créez vos premiers ebooks dès aujourd'hui
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative border-2 ${plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border'}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                    Plus Populaire
                  </Badge>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    {plan.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through mr-2">
                        {plan.originalPrice}€
                      </span>
                    )}
                    <span className="text-4xl font-bold">{plan.price}€</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    size="lg"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handlePlanClick(plan)}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
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
            onClick={() => window.open("https://www.trafic-affiliation.com/pagedeventeebook", "_blank")}
          >
            Commencer à 27€/mois
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Annulez à tout moment • Support inclus • Mises à jour gratuites
          </p>
        </div>
      </section>
    </div>
  );
};

export default SalesPage;
