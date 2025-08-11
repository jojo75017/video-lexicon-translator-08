import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Sparkles, 
  Clock, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  Star,
  ArrowRight,
  Zap,
  Globe,
  Users,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductLandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center space-y-8">
            <Badge variant="secondary" className="mx-auto">
              <Sparkles className="h-4 w-4 mr-2" />
              Intelligence Artificielle Avancée
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent leading-tight">
              PROD-BOT
            </h1>
            
            <h2 className="text-2xl md:text-4xl font-semibold text-foreground/90 max-w-4xl mx-auto">
              Le Générateur de Fiches Produits qui Révolutionne votre E-commerce
            </h2>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transformez un simple titre de produit en fiche commerciale complète et optimisée SEO en moins de 30 secondes. 
              L'IA rédige pour vous des descriptions captivantes de 500 mots, des caractéristiques détaillées et des arguments de vente irrésistibles.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => navigate('/product-generator')}
              >
                <Zap className="h-5 w-5 mr-2" />
                Tester Maintenant
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                <Globe className="h-5 w-5 mr-2" />
                Voir la Démonstration
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pourquoi PROD-BOT va Transformer votre Business ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez les fonctionnalités qui font de PROD-BOT l'outil indispensable pour tout e-commerçant sérieux
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="p-3 rounded-xl bg-primary/10 w-fit">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Génération Ultra-Rapide</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                En moins de 30 secondes, obtenez une fiche produit complète : description longue de 500 mots, 
                description courte optimisée, caractéristiques techniques et avantages commerciaux.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="p-3 rounded-xl bg-secondary/10 w-fit">
                <Target className="h-8 w-8 text-secondary" />
              </div>
              <CardTitle className="text-xl">Optimisation SEO Automatique</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Chaque description intègre automatiquement votre mot-clé principal en gras et respecte 
                les bonnes pratiques SEO pour améliorer votre référencement naturel.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="p-3 rounded-xl bg-accent/10 w-fit">
                <Package className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-xl">Fiche Complète 360°</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Description courte percutante, description longue détaillée, 5 caractéristiques principales, 
                5 spécifications techniques et 4 avantages clients. Tout y est !
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="p-3 rounded-xl bg-primary/10 w-fit">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Copywriting Professionnel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                L'IA maîtrise les techniques de copywriting avancées pour créer des descriptions 
                qui convertissent et donnent envie d'acheter votre produit.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="p-3 rounded-xl bg-secondary/10 w-fit">
                <Sparkles className="h-8 w-8 text-secondary" />
              </div>
              <CardTitle className="text-xl">Export Instantané</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Copiez chaque section individuellement ou exportez la fiche complète en un clic. 
                Intégration immédiate dans vos plateformes e-commerce préférées.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="p-3 rounded-xl bg-accent/10 w-fit">
                <Award className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-xl">Qualité Garantie</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Contenu unique, créatif et adapté à votre secteur d'activité. Fini les descriptions 
                génériques, place aux fiches produits qui se démarquent !
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-br from-muted/20 to-background py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Les Avantages Concrets pour votre Business
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              PROD-BOT ne se contente pas de générer du contenu, il booste vos ventes
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Économisez des Heures de Rédaction</h3>
                  <p className="text-muted-foreground">
                    Plus besoin de passer des heures à rédiger chaque fiche produit. PROD-BOT fait le travail 
                    d'un copywriter professionnel en quelques secondes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Améliorez votre Taux de Conversion</h3>
                  <p className="text-muted-foreground">
                    Des descriptions optimisées et persuasives qui transforment les visiteurs en clients. 
                    Augmentez vos ventes grâce à un contenu qui vend.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Référencement Naturel Optimisé</h3>
                  <p className="text-muted-foreground">
                    Chaque fiche est optimisée SEO avec mots-clés intégrés naturellement. 
                    Grimpez dans les résultats Google et attirez plus de trafic qualifié.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Consistance Professionnelle</h3>
                  <p className="text-muted-foreground">
                    Maintenez un niveau de qualité constant sur tous vos produits. 
                    Fini les fiches bâclées qui nuisent à votre image de marque.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Adaptable à Tous Secteurs</h3>
                  <p className="text-muted-foreground">
                    Que vous vendiez de la tech, de la mode, du mobilier ou des produits artisanaux, 
                    PROD-BOT s'adapte à votre domaine d'activité.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">ROI Immédiat et Mesurable</h3>
                  <p className="text-muted-foreground">
                    Investissement minimal pour un retour maximal. Récupérez votre investissement 
                    dès la première vente générée par vos nouvelles fiches.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Comment ça Marche ? C'est d'une Simplicité Déconcertante
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            3 étapes suffisent pour transformer votre titre en fiche produit vendeuse
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center border-2">
            <CardHeader>
              <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <CardTitle className="text-xl">Saisissez le Titre</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Tapez simplement le nom de votre produit. Exemple : "iPhone 15 Pro Max 256GB Titanium Bleu" 
                ou "Canapé d'angle en cuir véritable".
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-2">
            <CardHeader>
              <div className="p-4 rounded-full bg-secondary/10 w-fit mx-auto">
                <span className="text-2xl font-bold text-secondary">2</span>
              </div>
              <CardTitle className="text-xl">L'IA Travaille</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Notre intelligence artificielle analyse votre produit et génère automatiquement 
                tout le contenu nécessaire en respectant les meilleures pratiques.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-2">
            <CardHeader>
              <div className="p-4 rounded-full bg-accent/10 w-fit mx-auto">
                <span className="text-2xl font-bold text-accent">3</span>
              </div>
              <CardTitle className="text-xl">Récupérez et Utilisez</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Copiez les sections qui vous intéressent ou exportez la fiche complète. 
                Intégrez directement dans votre boutique en ligne et regardez vos ventes décoller !
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Testimonials/Stats Section */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Des Résultats qui Parlent d'Eux-Mêmes
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <Card className="text-center border-2">
              <CardContent className="pt-6">
                <div className="p-3 rounded-xl bg-primary/10 w-fit mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <p className="text-sm text-muted-foreground">Fiches Générées par Jour</p>
              </CardContent>
            </Card>

            <Card className="text-center border-2">
              <CardContent className="pt-6">
                <div className="p-3 rounded-xl bg-secondary/10 w-fit mx-auto mb-4">
                  <Clock className="h-8 w-8 text-secondary" />
                </div>
                <div className="text-3xl font-bold text-secondary mb-2">30s</div>
                <p className="text-sm text-muted-foreground">Temps Moyen de Génération</p>
              </CardContent>
            </Card>

            <Card className="text-center border-2">
              <CardContent className="pt-6">
                <div className="p-3 rounded-xl bg-accent/10 w-fit mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-accent" />
                </div>
                <div className="text-3xl font-bold text-accent mb-2">+45%</div>
                <p className="text-sm text-muted-foreground">Amélioration Moyenne des Conversions</p>
              </CardContent>
            </Card>

            <Card className="text-center border-2">
              <CardContent className="pt-6">
                <div className="p-3 rounded-xl bg-primary/10 w-fit mx-auto mb-4">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">4.9/5</div>
                <p className="text-sm text-muted-foreground">Note de Satisfaction Utilisateur</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="text-center py-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à Révolutionner vos Fiches Produits ?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Rejoignez les centaines d'e-commerçants qui ont déjà adopté PROD-BOT pour booster leurs ventes. 
              Testez dès maintenant et constatez la différence !
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="text-lg px-12 py-6"
                onClick={() => navigate('/product-generator')}
              >
                <Zap className="h-5 w-5 mr-2" />
                Commencer Maintenant
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <p className="text-sm text-muted-foreground">
                Aucun engagement • Test gratuit • Résultats immédiats
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductLandingPage;