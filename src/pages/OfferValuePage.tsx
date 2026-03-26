import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  BookOpen, 
  Sparkles, 
  Image, 
  FileText, 
  Mic, 
  BarChart3, 
  Users, 
  Layers, 
  Download, 
  Globe, 
  Bot, 
  Palette,
  CheckCircle,
  Gift,
  Calculator,
  Zap,
  Crown,
  HelpCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ModuleValue {
  icon: React.ElementType;
  name: string;
  description: string;
  marketValue: number;
  color: string;
}

const OfferValuePage = () => {
  const navigate = useNavigate();
  const [showBreakdown, setShowBreakdown] = useState(true);

  const modules: ModuleValue[] = [
    {
      icon: BookOpen,
      name: "Générateur de Plans IA",
      description: "Création automatique de structures d'ebooks complètes avec chapitres et sous-chapitres",
      marketValue: 97,
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: FileText,
      name: "Rédaction de Chapitres IA",
      description: "Génération de contenu de qualité professionnelle pour chaque chapitre",
      marketValue: 147,
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Image,
      name: "Générateur de Couvertures",
      description: "Création de couvertures professionnelles avec l'IA DALL-E",
      marketValue: 67,
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: Palette,
      name: "Générateur 4ème de Couverture",
      description: "Dos et résumé professionnel pour Amazon KDP",
      marketValue: 47,
      color: "from-rose-500 to-rose-600"
    },
    {
      icon: Users,
      name: "Gestionnaire de Personnages",
      description: "Création et suivi de jusqu'à 6 personnages avec portraits IA",
      marketValue: 37,
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: Layers,
      name: "Gestionnaire Séries/Sagas",
      description: "Organisation multi-tomes avec bible de série et continuité",
      marketValue: 67,
      color: "from-violet-500 to-violet-600"
    },
    {
      icon: Globe,
      name: "Atlas Naturaliste",
      description: "Génération de fiches géographiques et écologiques (50+ fiches)",
      marketValue: 87,
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: BookOpen,
      name: "Encyclopédie IA",
      description: "Fiches encyclopédiques détaillées pour ebooks spécialisés",
      marketValue: 87,
      color: "from-teal-500 to-teal-600"
    },
    {
      icon: BarChart3,
      name: "Outils Amazon KDP Premium",
      description: "Analyse de marché, mots-clés, catégories et stratégie de prix",
      marketValue: 127,
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Download,
      name: "Export Multi-Formats",
      description: "Export PDF, EPUB, Word, Google Docs en un clic",
      marketValue: 47,
      color: "from-cyan-500 to-cyan-600"
    },
    {
      icon: Bot,
      name: "Assistant IA Intégré",
      description: "Chat IA pour améliorer, reformuler et optimiser vos textes",
      marketValue: 67,
      color: "from-amber-500 to-amber-600"
    },
    {
      icon: Mic,
      name: "Dictée Vocale",
      description: "Écriture par la voix avec transcription automatique",
      marketValue: 37,
      color: "from-red-500 to-red-600"
    },
  ];

  const bonuses: ModuleValue[] = [
    {
      icon: FileText,
      name: "Formation PDF Complète",
      description: "Guide étape par étape pour créer et vendre des ebooks",
      marketValue: 97,
      color: "from-green-500 to-green-600"
    },
    {
      icon: Mic,
      name: "Formation Audio Premium",
      description: "Toutes les formations en version audio (5h+)",
      marketValue: 147,
      color: "from-blue-600 to-blue-700"
    },
    {
      icon: Sparkles,
      name: "300+ Idées de Titres",
      description: "Bibliothèque de titres rentables par catégorie",
      marketValue: 47,
      color: "from-yellow-500 to-yellow-600"
    },
    {
      icon: Image,
      name: "Banque d'Images Intégrée",
      description: "Accès à des milliers d'images libres de droits",
      marketValue: 37,
      color: "from-fuchsia-500 to-fuchsia-600"
    },
    {
      icon: Zap,
      name: "Mises à Jour à Vie",
      description: "Toutes les nouvelles fonctionnalités gratuitement",
      marketValue: 197,
      color: "from-lime-500 to-lime-600"
    },
  ];

  const totalModulesValue = modules.reduce((sum, m) => sum + m.marketValue, 0);
  const totalBonusesValue = bonuses.reduce((sum, b) => sum + b.marketValue, 0);
  const totalValue = totalModulesValue + totalBonusesValue;
  const currentPrice = 67;
  const savings = totalValue - currentPrice;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <Calculator className="w-3 h-3 mr-1" />
            Valeur Totale : {totalValue}€
          </Badge>
        </div>
      </div>

      {/* Hero */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-amber-500/10 text-amber-600 border-amber-500/20 px-4 py-2">
            <Gift className="w-4 h-4 mr-2" />
            Analyse Complète de l'Offre
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Ce que vous obtenez pour
            <span className="block text-5xl md:text-7xl text-primary mt-2">seulement 67€</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            Voici le détail de tous les modules et bonus inclus dans votre accès à vie
          </p>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
              <CardContent className="pt-6 text-center">
                <div className="text-5xl font-bold text-blue-500 mb-2">{modules.length}</div>
                <div className="text-sm font-medium text-foreground">Modules Premium</div>
                <div className="text-xs text-muted-foreground mt-1">Valeur : {totalModulesValue}€</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
              <CardContent className="pt-6 text-center">
                <div className="text-5xl font-bold text-green-500 mb-2">{bonuses.length}</div>
                <div className="text-sm font-medium text-foreground">Bonus Exclusifs</div>
                <div className="text-xs text-muted-foreground mt-1">Valeur : {totalBonusesValue}€</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
              <CardContent className="pt-6 text-center">
                <div className="text-5xl font-bold text-amber-500 mb-2">{savings}€</div>
                <div className="text-sm font-medium text-foreground">Économies Réalisées</div>
                <div className="text-xs text-muted-foreground mt-1">Soit {Math.round((savings / totalValue) * 100)}% de réduction</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Crown className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-center">{modules.length} Modules Premium Inclus</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${module.color}`} />
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center shadow-lg`}>
                      <module.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="outline" className="text-lg font-bold border-2">
                      {module.marketValue}€
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-3">{module.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Modules Total */}
          <div className="mt-8 flex justify-end">
            <Card className="bg-muted/50 border-2 border-primary/20">
              <CardContent className="py-4 px-6 flex items-center gap-4">
                <span className="text-lg font-medium">Sous-total Modules :</span>
                <span className="text-3xl font-bold text-primary">{totalModulesValue}€</span>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Bonuses Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Gift className="w-8 h-8 text-amber-500" />
            <h2 className="text-3xl font-bold text-center">{bonuses.length} Bonus Offerts</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bonuses.map((bonus, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-amber-500/20">
                <div className="absolute top-0 right-0">
                  <Badge className="rounded-none rounded-bl-lg bg-amber-500 text-white">
                    BONUS
                  </Badge>
                </div>
                <CardHeader className="pb-2 pt-8">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bonus.color} flex items-center justify-center shadow-lg`}>
                      <bonus.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="outline" className="text-lg font-bold border-2 border-amber-500 text-amber-600">
                      {bonus.marketValue}€
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-3">{bonus.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{bonus.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bonuses Total */}
          <div className="mt-8 flex justify-end">
            <Card className="bg-amber-500/10 border-2 border-amber-500/30">
              <CardContent className="py-4 px-6 flex items-center gap-4">
                <span className="text-lg font-medium">Sous-total Bonus :</span>
                <span className="text-3xl font-bold text-amber-600">{totalBonusesValue}€</span>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Grand Total Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="border-4 border-primary overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 text-center">
              <h3 className="text-2xl font-bold mb-2">Récapitulatif de la Valeur</h3>
              <p className="text-primary-foreground/80">Ce que vous obtiendriez en achetant séparément</p>
            </div>
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-lg">{modules.length} Modules Premium</span>
                  <span className="text-xl font-bold">{totalModulesValue}€</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-lg">{bonuses.length} Bonus Exclusifs</span>
                  <span className="text-xl font-bold text-amber-600">{totalBonusesValue}€</span>
                </div>
                <div className="flex justify-between items-center py-4 bg-muted/50 rounded-lg px-4 -mx-4">
                  <span className="text-xl font-bold">Valeur Totale</span>
                  <span className="text-3xl font-bold text-muted-foreground line-through">{totalValue}€</span>
                </div>
                
                <div className="relative py-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-dashed border-primary/30" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-background px-4 text-sm font-medium text-muted-foreground">
                      VOTRE PRIX AUJOURD'HUI
                    </span>
                  </div>
                </div>

                <div className="text-center py-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl border-2 border-green-500/30">
                  <div className="text-6xl md:text-7xl font-black text-green-600 mb-2">
                    {currentPrice}€
                  </div>
                  <p className="text-lg font-medium text-green-600">
                    Paiement unique • Accès à vie
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    <CheckCircle className="w-4 h-4" />
                    Vous économisez {savings}€
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full text-xl py-7 mt-6"
                  onClick={() => navigate('/offres')}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Accéder à l'Offre Maintenant
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Comparison with freelance */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8">
            💡 Et si vous le faisiez faire par un freelance ?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-red-500/20 bg-red-500/5">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-red-500 mb-2">500-2000€</div>
                <div className="font-medium">Rédaction d'un ebook</div>
                <div className="text-sm text-muted-foreground mt-1">Par un ghostwriter professionnel</div>
              </CardContent>
            </Card>
            <Card className="border-red-500/20 bg-red-500/5">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-red-500 mb-2">150-500€</div>
                <div className="font-medium">Design couverture</div>
                <div className="text-sm text-muted-foreground mt-1">Par un graphiste freelance</div>
              </CardContent>
            </Card>
            <Card className="border-red-500/20 bg-red-500/5">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-red-500 mb-2">200-800€</div>
                <div className="font-medium">Stratégie KDP</div>
                <div className="text-sm text-muted-foreground mt-1">Par un consultant Amazon</div>
              </CardContent>
            </Card>
          </div>

          <p className="text-xl text-muted-foreground">
            <strong className="text-foreground">Pour un seul ebook</strong>, vous dépenseriez entre <strong className="text-red-500">850€ et 3300€</strong>.
            <br />
            Avec notre générateur, créez des <strong className="text-primary">ebooks illimités</strong> pour seulement <strong className="text-green-500">67€</strong>.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8">
            <HelpCircle className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-center">Questions Fréquentes</h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="text-left font-medium hover:no-underline">
                Est-ce vraiment un paiement unique sans abonnement ?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Oui, absolument ! Vous payez une seule fois 67€ et vous avez accès à vie à tous les modules, bonus et mises à jour futures. Aucun abonnement, aucun frais caché, aucune limite d'utilisation.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="text-left font-medium hover:no-underline">
                Combien d'ebooks puis-je créer avec le générateur ?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Vous pouvez créer un nombre illimité d'ebooks ! Que vous souhaitiez en créer 1, 10 ou 100, il n'y a aucune restriction. Vous pouvez également générer autant de chapitres, couvertures et contenus que vous le souhaitez.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="text-left font-medium hover:no-underline">
                Ai-je besoin de compétences techniques pour utiliser l'outil ?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Aucune compétence technique n'est requise ! L'interface est intuitive et les formations incluses vous guident pas à pas. En quelques clics, vous pouvez générer un plan complet d'ebook et le rédiger avec l'aide de l'IA.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="text-left font-medium hover:no-underline">
                Comment fonctionnent les mises à jour gratuites à vie ?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Chaque nouvelle fonctionnalité que nous ajoutons est automatiquement disponible pour vous, sans frais supplémentaires. Vous bénéficiez des améliorations, nouveaux modules et optimisations tant que le service existe.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="text-left font-medium hover:no-underline">
                Puis-je vendre les ebooks générés sur Amazon KDP ?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Oui ! Les ebooks que vous créez vous appartiennent à 100%. Vous pouvez les publier sur Amazon KDP, les vendre sur votre site, les offrir comme lead magnets, ou les utiliser de toute autre manière commerciale.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="text-left font-medium hover:no-underline">
                Les formations audio sont-elles vraiment incluses ?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Oui, les formations audio premium (plus de 5 heures de contenu) sont incluses dans votre accès. Vous pouvez les écouter en ligne ou les télécharger pour les écouter hors connexion.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="text-left font-medium hover:no-underline">
                Y a-t-il une garantie de remboursement ?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Oui, nous offrons une garantie satisfait ou remboursé de 30 jours. Si le générateur ne répond pas à vos attentes, contactez-nous et nous vous rembourserons intégralement, sans questions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="text-left font-medium hover:no-underline">
                Comment accéder au générateur après l'achat ?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Immédiatement après votre paiement, vous recevez un email avec vos identifiants d'accès. Vous pouvez commencer à créer votre premier ebook dans les 5 minutes qui suivent votre achat.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9" className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="text-left font-medium hover:no-underline">
                Pourquoi le prix passera-t-il à 247€ ?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Le tarif actuel de 67€ est un prix de lancement exceptionnel pour remercier nos premiers utilisateurs. Une fois la période de lancement terminée, le prix passera à 197€ pour refléter la valeur réelle de l'outil.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10" className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="text-left font-medium hover:no-underline">
                Proposez-vous un support client ?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Oui, un support prioritaire est inclus. Vous pouvez nous contacter par email et nous répondons généralement sous 24-48h. Nous sommes là pour vous aider à tirer le meilleur parti du générateur.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* CTA after FAQ */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">Encore des questions ? Passez à l'action !</p>
            <Button 
              size="lg" 
              className="text-lg px-8"
              onClick={() => navigate('/offres')}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Accéder pour 67€
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OfferValuePage;
