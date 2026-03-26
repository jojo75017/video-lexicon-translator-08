import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  BookOpen, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Star,
  Clock,
  Users,
  Trophy,
  Bot,
  FileText,
  Palette,
  TrendingUp
} from 'lucide-react';

const SeoCreerEbookIaPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Créer un Ebook avec l'IA en 2025 | Générateur Automatique";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', "Créez un ebook professionnel avec l'IA en quelques heures. Générateur automatique de livres avec workflow éditorial complet. Publiez sur Amazon KDP facilement.");
    }
  }, []);

  const features = [
    { icon: Bot, title: "IA Éditoriale Avancée", description: "14 étapes automatisées pour un livre parfait" },
    { icon: FileText, title: "Structure Automatique", description: "Chapitres, sous-chapitres et plan générés" },
    { icon: Palette, title: "Couvertures Pro", description: "Générateur de couvertures professionnelles" },
    { icon: TrendingUp, title: "Optimisé KDP", description: "Prêt pour Amazon en un clic" },
  ];

  const steps = [
    { number: "1", title: "Entrez votre sujet", description: "Un simple titre ou thème suffit" },
    { number: "2", title: "L'IA structure tout", description: "Plan, chapitres, personnages automatiques" },
    { number: "3", title: "Générez le contenu", description: "Rédaction experte chapitre par chapitre" },
    { number: "4", title: "Exportez et publiez", description: "Format KDP prêt à publier" },
  ];

  const faqs = [
    {
      question: "Peut-on vraiment créer un ebook avec l'IA ?",
      answer: "Oui ! Les outils d'IA modernes comme EbookStudio Pro permettent de générer des ebooks complets de qualité professionnelle. L'IA assiste la création tout en vous laissant le contrôle éditorial final."
    },
    {
      question: "Combien de temps faut-il pour créer un ebook avec l'IA ?",
      answer: "Avec EbookStudio Pro, vous pouvez créer un ebook complet de 200+ pages en 24 à 48 heures, contre plusieurs semaines ou mois en écriture traditionnelle."
    },
    {
      question: "Les ebooks générés par IA sont-ils de bonne qualité ?",
      answer: "EbookStudio Pro utilise un workflow éditorial en 14 étapes incluant réécriture naturelle, cohérence narrative et verdict éditeur pour garantir une qualité professionnelle."
    },
    {
      question: "Puis-je publier un ebook créé avec l'IA sur Amazon ?",
      answer: "Absolument ! Les ebooks générés sont originaux et vous appartiennent. EbookStudio Pro formate automatiquement pour Amazon KDP avec métadonnées optimisées."
    },
    {
      question: "Faut-il des compétences techniques pour utiliser le générateur ?",
      answer: "Non, EbookStudio Pro est conçu pour les débutants. L'interface intuitive guide chaque étape, de l'idée à la publication."
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Schema.org Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Créer un Ebook avec l'IA en 2025 : Guide Complet",
          "description": "Découvrez comment créer un ebook professionnel avec l'intelligence artificielle. Guide étape par étape pour publier sur Amazon KDP.",
          "author": { "@type": "Organization", "name": "EbookStudio Pro" },
          "publisher": { "@type": "Organization", "name": "EbookStudio Pro" },
          "datePublished": "2025-01-01",
          "dateModified": new Date().toISOString().split('T')[0]
        })
      }} />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/30 px-4 py-1">
              <Sparkles className="w-4 h-4 mr-2" />
              Générateur IA 2025
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Créer un Ebook avec l'IA<br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                en Quelques Heures
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Transformez vos idées en ebooks professionnels grâce à l'intelligence artificielle. 
              Workflow éditorial complet en 14 étapes, couvertures générées, export Amazon KDP automatique.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg px-8 py-6 text-white"
                onClick={() => navigate('/offres')}
              >
                <Zap className="w-5 h-5 mr-2" />
                Créer mon ebook maintenant
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 border-border text-foreground"
                onClick={() => navigate('/demo')}
              >
                Essayer gratuitement
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Sans carte bancaire
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-primary" />
                Résultat en 24h
              </span>
              <span className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-amber-400" />
                +500 ebooks créés
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Pourquoi créer un ebook avec l'IA ?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} className="border-border hover:border-primary/30 transition-all hover:shadow-lg bg-background/50">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-foreground">
            Comment créer un ebook avec l'IA ?
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            4 étapes simples pour passer de l'idée à un livre publié sur Amazon
          </p>
          
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-lg shadow-primary/25">
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-accent/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-4xl mx-auto prose prose-invert prose-lg">
          <h2>Créer un ebook avec l'IA : La révolution de l'auto-édition</h2>
          
          <p>
            L'intelligence artificielle transforme radicalement la façon dont nous créons des ebooks. 
            Ce qui prenait autrefois des mois de travail peut désormais être accompli en quelques heures 
            grâce aux générateurs d'ebooks IA comme <strong>EbookStudio Pro</strong>.
          </p>

          <h3>Les avantages de créer un ebook avec l'IA</h3>
          
          <ul>
            <li><strong>Gain de temps considérable</strong> : Passez de plusieurs mois à quelques jours</li>
            <li><strong>Qualité professionnelle</strong> : Structure éditoriale optimisée en 14 étapes</li>
            <li><strong>Coût réduit</strong> : Plus besoin de ghostwriter ou d'éditeur externe</li>
            <li><strong>Couvertures incluses</strong> : Génération automatique de visuels professionnels</li>
            <li><strong>Optimisation Amazon</strong> : Métadonnées KDP générées automatiquement</li>
          </ul>

          <h3>Créer un ebook avec l'IA vs ChatGPT seul</h3>
          
          <p>
            Utiliser ChatGPT seul pour écrire un livre présente des limites : incohérences entre chapitres, 
            ton robotique, structure désorganisée. <strong>EbookStudio Pro</strong> résout ces problèmes avec son 
            workflow éditorial en 14 étapes incluant :
          </p>

          <ul>
            <li>Directeur éditorial pour la vision stratégique</li>
            <li>Analyse de marché et mots-clés KDP</li>
            <li>Architecture de contenu structurée</li>
            <li>Rédaction experte avec style personnalisé</li>
            <li>Réécriture naturelle anti-IA</li>
            <li>Cohérence inter-chapitres</li>
            <li>Verdict éditeur final</li>
          </ul>

          <h3>Combien peut-on gagner avec un ebook créé par IA ?</h3>
          
          <p>
            Les revenus varient selon la niche et le marketing, mais de nombreux auteurs auto-édités 
            génèrent entre <strong>500€ et 5000€ par mois</strong> avec des ebooks bien positionnés sur Amazon KDP. 
            Créer un ebook avec l'IA permet de multiplier rapidement votre catalogue et vos sources de revenus.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Questions fréquentes sur la création d'ebook avec l'IA
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card key={idx} className="border-border bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2 flex items-start gap-2 text-foreground">
                    <span className="text-primary">Q:</span>
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground pl-6">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Schema */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            })
          }} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à créer votre ebook avec l'IA ?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Rejoignez +500 auteurs qui ont déjà publié leur livre grâce à EbookStudio Pro
          </p>
          
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 text-lg px-10 py-6 shadow-xl font-bold"
            onClick={() => navigate('/offres')}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Commencer maintenant - 67€ à vie
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <p className="mt-6 text-sm opacity-75">
            Accès illimité • Mises à jour gratuites • Support inclus
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 bg-background border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-3">📚 Guides SEO</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/ecrire-livre-chatgpt" className="text-muted-foreground hover:text-primary transition-colors">Écrire un livre avec ChatGPT</a></li>
                <li><a href="/generateur-ebook" className="text-muted-foreground hover:text-primary transition-colors">Générateur ebook IA</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">🚀 Produit</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/offres" className="text-muted-foreground hover:text-primary transition-colors">Voir les offres</a></li>
                <li><a href="/demo" className="text-muted-foreground hover:text-primary transition-colors">Essai gratuit</a></li>
                <li><a href="/formation" className="text-muted-foreground hover:text-primary transition-colors">Formation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">💡 Ressources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/valeur-offre" className="text-muted-foreground hover:text-primary transition-colors">Valeur de l'offre</a></li>
                <li><a href="/ebook-planner" className="text-muted-foreground hover:text-primary transition-colors">Accéder au générateur</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 text-center text-sm">
            <p className="text-muted-foreground">© 2025 EbookStudio Pro - Générateur d'ebooks avec l'IA</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SeoCreerEbookIaPage;
