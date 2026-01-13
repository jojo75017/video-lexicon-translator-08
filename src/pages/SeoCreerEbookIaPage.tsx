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
    // Update meta tags for SEO
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
      answer: "Oui ! Les outils d'IA modernes comme EbookiaPro permettent de générer des ebooks complets de qualité professionnelle. L'IA assiste la création tout en vous laissant le contrôle éditorial final."
    },
    {
      question: "Combien de temps faut-il pour créer un ebook avec l'IA ?",
      answer: "Avec EbookiaPro, vous pouvez créer un ebook complet de 200+ pages en 24 à 48 heures, contre plusieurs semaines ou mois en écriture traditionnelle."
    },
    {
      question: "Les ebooks générés par IA sont-ils de bonne qualité ?",
      answer: "EbookiaPro utilise un workflow éditorial en 14 étapes incluant réécriture naturelle, cohérence narrative et verdict éditeur pour garantir une qualité professionnelle."
    },
    {
      question: "Puis-je publier un ebook créé avec l'IA sur Amazon ?",
      answer: "Absolument ! Les ebooks générés sont originaux et vous appartiennent. EbookiaPro formate automatiquement pour Amazon KDP avec métadonnées optimisées."
    },
    {
      question: "Faut-il des compétences techniques pour utiliser le générateur ?",
      answer: "Non, EbookiaPro est conçu pour les débutants. L'interface intuitive guide chaque étape, de l'idée à la publication."
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Schema.org Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Créer un Ebook avec l'IA en 2025 : Guide Complet",
          "description": "Découvrez comment créer un ebook professionnel avec l'intelligence artificielle. Guide étape par étape pour publier sur Amazon KDP.",
          "author": { "@type": "Organization", "name": "EbookiaPro" },
          "publisher": { "@type": "Organization", "name": "EbookiaPro" },
          "datePublished": "2025-01-01",
          "dateModified": new Date().toISOString().split('T')[0]
        })
      }} />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-purple-500/5 to-pink-500/10" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-4 py-1">
              <Sparkles className="w-4 h-4 mr-2" />
              Générateur IA 2025
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Créer un Ebook avec l'IA<br />
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                en Quelques Heures
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Transformez vos idées en ebooks professionnels grâce à l'intelligence artificielle. 
              Workflow éditorial complet en 14 étapes, couvertures générées, export Amazon KDP automatique.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-lg px-8 py-6"
                onClick={() => navigate('/offres')}
              >
                <Zap className="w-5 h-5 mr-2" />
                Créer mon ebook maintenant
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6"
                onClick={() => navigate('/demo')}
              >
                Essayer gratuitement
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Sans carte bancaire
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-blue-500" />
                Résultat en 24h
              </span>
              <span className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-amber-500" />
                +500 ebooks créés
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Pourquoi créer un ebook avec l'IA ?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} className="border-2 hover:border-violet-300 transition-all hover:shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-7 h-7 text-violet-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gradient-to-b from-violet-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Comment créer un ebook avec l'IA ?
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            4 étapes simples pour passer de l'idée à un livre publié sur Amazon
          </p>
          
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-violet-300 to-purple-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h2>Créer un ebook avec l'IA : La révolution de l'auto-édition</h2>
          
          <p>
            L'intelligence artificielle transforme radicalement la façon dont nous créons des ebooks. 
            Ce qui prenait autrefois des mois de travail peut désormais être accompli en quelques heures 
            grâce aux générateurs d'ebooks IA comme <strong>EbookiaPro</strong>.
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
            ton robotique, structure désorganisée. <strong>EbookiaPro</strong> résout ces problèmes avec son 
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
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Questions fréquentes sur la création d'ebook avec l'IA
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card key={idx} className="border">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2 flex items-start gap-2">
                    <span className="text-violet-500">Q:</span>
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 pl-6">{faq.answer}</p>
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
      <section className="py-20 px-4 bg-gradient-to-r from-violet-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à créer votre ebook avec l'IA ?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Rejoignez +500 auteurs qui ont déjà publié leur livre grâce à EbookiaPro
          </p>
          
          <Button 
            size="lg" 
            className="bg-white text-violet-700 hover:bg-gray-100 text-lg px-10 py-6 shadow-xl"
            onClick={() => navigate('/offres')}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Commencer maintenant - 37€ à vie
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <p className="mt-6 text-sm opacity-75">
            Accès illimité • Mises à jour gratuites • Support inclus
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-white mb-3">📚 Guides SEO</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/ecrire-livre-chatgpt" className="hover:text-violet-400 transition-colors">Écrire un livre avec ChatGPT</a></li>
                <li><a href="/generateur-ebook" className="hover:text-violet-400 transition-colors">Générateur ebook IA</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">🚀 Produit</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/offres" className="hover:text-violet-400 transition-colors">Voir les offres</a></li>
                <li><a href="/demo" className="hover:text-violet-400 transition-colors">Essai gratuit</a></li>
                <li><a href="/formation" className="hover:text-violet-400 transition-colors">Formation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">💡 Ressources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/valeur-offre" className="hover:text-violet-400 transition-colors">Valeur de l'offre</a></li>
                <li><a href="/ebook-planner" className="hover:text-violet-400 transition-colors">Accéder au générateur</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-sm">
            <p>© 2025 EbookiaPro - Générateur d'ebooks avec l'IA</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SeoCreerEbookIaPage;
