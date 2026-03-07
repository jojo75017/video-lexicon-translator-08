import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Sparkles, 
  CheckCircle, 
  ArrowRight, 
  Lightbulb, 
  Target, 
  Zap,
  FileText,
  PenTool,
  Rocket,
  AlertTriangle,
  Clock,
  Users,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SeoTutorialChatGptPage = () => {
  const navigate = useNavigate();

  // SEO Meta Tags dynamiques
  useEffect(() => {
    document.title = "Écrire un Livre avec ChatGPT - Guide Complet 2025 | Tutoriel Gratuit";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Apprenez à écrire un livre avec ChatGPT étape par étape. Tutoriel complet : prompts efficaces, structure de roman, astuces d'écriture IA et publication Amazon KDP. Guide gratuit 2025.");
    }
    
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute("href", "https://ebookstudio.fr/ecrire-livre-chatgpt");
    }
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", "Écrire un Livre avec ChatGPT - Guide Complet 2025");
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute("content", "Tutoriel gratuit pour écrire votre premier livre avec l'IA. Prompts ChatGPT, structure, et publication Amazon KDP.");
    }
  }, []);

  const steps = [
    {
      number: 1,
      title: "Définir votre concept de livre",
      icon: Lightbulb,
      content: "Avant de commencer avec ChatGPT, clarifiez votre idée : genre (roman, guide pratique, développement personnel), public cible, et message principal. ChatGPT excelle quand vous lui donnez un contexte précis.",
      prompt: "Je veux écrire un livre de [GENRE] destiné à [PUBLIC CIBLE]. Le thème principal est [THÈME]. Aide-moi à définir le concept, l'angle unique et la promesse du livre."
    },
    {
      number: 2,
      title: "Créer la structure et le plan détaillé",
      icon: FileText,
      content: "Demandez à ChatGPT de générer une table des matières complète avec chapitres et sous-sections. Un bon plan est la fondation d'un livre cohérent et professionnel.",
      prompt: "Crée une structure détaillée pour mon livre [TITRE] avec 10 chapitres. Chaque chapitre doit avoir 3-4 sous-sections. Inclus une introduction accrocheuse et une conclusion avec call-to-action."
    },
    {
      number: 3,
      title: "Rédiger chapitre par chapitre",
      icon: PenTool,
      content: "Ne demandez jamais à ChatGPT d'écrire tout le livre d'un coup. Procédez chapitre par chapitre en gardant le contexte. Relisez et ajustez chaque section avant de passer à la suivante.",
      prompt: "Écris le chapitre 1 : [TITRE DU CHAPITRE]. Longueur : 2000 mots. Style : [professionnel/accessible/narratif]. Inclus des exemples concrets et des conseils pratiques. Évite le jargon technique."
    },
    {
      number: 4,
      title: "Humaniser et personnaliser le contenu",
      icon: Users,
      content: "Le contenu généré par IA peut sembler générique. Ajoutez vos anecdotes personnelles, votre expertise, et votre voix unique. ChatGPT est un assistant, pas l'auteur.",
      prompt: "Réécris ce paragraphe en ajoutant plus d'émotion et un ton conversationnel. Utilise des métaphores et des exemples du quotidien. Évite les formulations robotiques."
    },
    {
      number: 5,
      title: "Réviser et optimiser pour Amazon KDP",
      icon: Target,
      content: "Utilisez ChatGPT pour créer un titre accrocheur, une description optimisée pour le SEO Amazon, et des mots-clés stratégiques pour maximiser la visibilité de votre livre.",
      prompt: "Génère 5 titres accrocheurs pour mon livre sur [SUJET]. Chaque titre doit inclure un mot-clé recherché et créer de la curiosité. Ajoute des sous-titres explicatifs."
    }
  ];

  const mistakes = [
    {
      title: "Copier-coller sans relecture",
      description: "ChatGPT peut générer des erreurs factuelles ou des incohérences. Toujours vérifier et corriger."
    },
    {
      title: "Manquer de structure initiale",
      description: "Sans plan détaillé, votre livre sera décousu. Investissez du temps dans la planification."
    },
    {
      title: "Ignorer votre voix d'auteur",
      description: "Les lecteurs achètent votre perspective unique, pas du contenu générique IA."
    },
    {
      title: "Publier sans formatage pro",
      description: "Un ebook mal formaté = mauvaises critiques. Utilisez des outils de mise en page professionnels."
    }
  ];

  const benefits = [
    { icon: Clock, title: "Gain de temps", description: "Réduisez le temps d'écriture de 70% avec l'assistance IA" },
    { icon: TrendingUp, title: "Productivité x10", description: "Publiez plusieurs livres par mois au lieu d'un par an" },
    { icon: Sparkles, title: "Qualité constante", description: "Maintenez un niveau de qualité élevé sur tous vos chapitres" },
    { icon: Rocket, title: "Lancement rapide", description: "De l'idée à la publication Amazon KDP en quelques semaines" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-purple-50/20">
      {/* Hero Section - H1 optimisé SEO */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-purple-500/10 to-fuchsia-500/10" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Badge className="mb-4 bg-violet-100 text-violet-700 border-violet-200">
            📚 Guide Complet 2025 • 1 300 recherches/mois
          </Badge>
          
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Comment <span className="text-violet-600">Écrire un Livre avec ChatGPT</span> : 
            <br />Tutoriel Étape par Étape
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Découvrez comment utiliser l'intelligence artificielle pour <strong>écrire votre premier livre</strong> et le publier sur Amazon KDP. 
            Prompts efficaces, structure optimale et astuces de pro inclus.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-violet-600 hover:bg-violet-700"
              onClick={() => navigate("/offres")}
            >
              <Zap className="mr-2 h-5 w-5" />
              Essayer le Générateur IA
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/demo")}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Voir la Démo Gratuite
            </Button>
          </div>
        </div>
      </section>

      {/* Sommaire rapide */}
      <section className="py-12 px-4 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <Card className="border-violet-200 bg-violet-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-violet-700">
                <FileText className="h-5 w-5" />
                Dans ce guide, vous apprendrez :
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid md:grid-cols-2 gap-3">
                {[
                  "Les meilleurs prompts ChatGPT pour écrire un livre",
                  "Comment structurer un roman ou guide pratique",
                  "Les erreurs fatales à éviter avec l'IA",
                  "Comment publier sur Amazon KDP efficacement",
                  "Les techniques pour humaniser le contenu IA",
                  "Optimiser son livre pour les ventes"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pourquoi ChatGPT - H2 */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground">
            Pourquoi Utiliser ChatGPT pour Écrire un Livre ?
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            L'IA révolutionne l'écriture. Voici les avantages concrets pour les auteurs :
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, i) => (
              <Card key={i} className="border-slate-200 hover:border-violet-300 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-violet-100">
                      <benefit.icon className="h-6 w-6 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm">{benefit.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Les 5 étapes - H2 principal */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-violet-50/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground">
            5 Étapes pour Écrire un Livre avec ChatGPT
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Suivez ce processus éprouvé pour transformer votre idée en livre publié sur Amazon :
          </p>
          
          <div className="space-y-8">
            {steps.map((step) => (
              <Card key={step.number} className="border-l-4 border-l-violet-500 shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-violet-600 text-white font-bold text-lg">
                      {step.number}
                    </div>
                    <div className="flex items-center gap-2">
                      <step.icon className="h-5 w-5 text-violet-600" />
                      <CardTitle className="text-xl text-foreground">{step.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{step.content}</p>
                  
                  <div className="bg-slate-900 rounded-lg p-4 text-sm">
                    <div className="flex items-center gap-2 text-violet-400 mb-2 font-medium">
                      <Sparkles className="h-4 w-4" />
                      Prompt ChatGPT recommandé :
                    </div>
                    <code className="text-green-400 whitespace-pre-wrap block">
                      {step.prompt}
                    </code>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Erreurs à éviter - H2 */}
      <section className="py-16 px-4 bg-red-50/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground">
            <AlertTriangle className="inline h-8 w-8 text-red-500 mr-2" />
            4 Erreurs Fatales à Éviter
          </h2>
          <p className="text-center text-muted-foreground mb-10">
            Ne sabotez pas votre livre avec ces erreurs courantes :
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {mistakes.map((mistake, i) => (
              <Card key={i} className="border-red-200 bg-white">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-red-600 mb-2 flex items-center gap-2">
                    <span className="text-red-500">✗</span>
                    {mistake.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{mistake.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution automatisée - CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-violet-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">
            🚀 Solution Tout-en-Un
          </Badge>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Automatisez Tout le Processus avec EbookStudio
          </h2>
          
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Pourquoi jongler avec ChatGPT quand vous pouvez avoir un <strong>générateur de livre IA professionnel</strong> 
            qui gère structure, rédaction, cohérence et formatage automatiquement ?
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { title: "14 étapes éditoriales", desc: "Workflow complet automatisé" },
              { title: "Export KDP Ready", desc: "PDF, EPUB, Word optimisés" },
              { title: "97€ accès à vie", desc: "Ebooks illimités" }
            ].map((item, i) => (
              <div key={i} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="font-bold text-lg">{item.title}</div>
                <div className="text-white/80 text-sm">{item.desc}</div>
              </div>
            ))}
          </div>
          
          <Button 
            size="lg" 
            className="bg-white text-violet-700 hover:bg-white/90"
            onClick={() => navigate("/offres")}
          >
            Découvrir EbookStudio
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* FAQ SEO - H2 */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground">
            Questions Fréquentes sur l'Écriture avec ChatGPT
          </h2>
          
          <div className="space-y-4">
            {[
              {
                q: "ChatGPT peut-il vraiment écrire un livre entier ?",
                a: "Oui, mais avec supervision. ChatGPT génère du contenu de qualité, mais nécessite votre direction, vos corrections et votre voix personnelle pour créer un livre vendable."
              },
              {
                q: "Est-ce légal de publier un livre écrit avec l'IA ?",
                a: "Absolument. Amazon KDP accepte les livres assistés par IA tant que le contenu est original et que vous êtes l'éditeur responsable. Ajoutez toujours votre touche personnelle."
              },
              {
                q: "Combien de temps pour écrire un livre avec ChatGPT ?",
                a: "Avec une bonne méthode, vous pouvez rédiger un ebook de 100 pages en 1-2 semaines, contre 3-6 mois en écriture traditionnelle."
              },
              {
                q: "Quel modèle ChatGPT utiliser ?",
                a: "GPT-4 est recommandé pour la qualité d'écriture. GPT-3.5 fonctionne pour les brouillons mais nécessite plus de révisions."
              }
            ].map((faq, i) => (
              <Card key={i} className="border-slate-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-foreground">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-12 px-4 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Prêt à Écrire Votre Premier Livre ?
          </h2>
          <p className="text-slate-300 mb-6">
            Commencez gratuitement avec notre générateur IA ou testez la démo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-violet-600 hover:bg-violet-700"
              onClick={() => navigate("/offres")}
            >
              Accès Complet 97€
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
              onClick={() => navigate("/demo")}
            >
              Essayer Gratuitement
            </Button>
          </div>
        </div>
      </section>

      {/* Footer SEO */}
      <footer className="py-10 px-4 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-white mb-3">📚 Guides SEO</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/creer-ebook-ia" className="hover:text-violet-400 transition-colors">Créer un ebook avec l'IA</a></li>
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
            <p>© 2025 EbookStudio Pro - Comment écrire un livre avec ChatGPT</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SeoTutorialChatGptPage;
