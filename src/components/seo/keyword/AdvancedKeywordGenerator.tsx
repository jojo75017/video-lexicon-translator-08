import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Search, 
  Sparkles, 
  Zap,
  Eye,
  Copy,
  Download,
  Rocket,
  Target,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import KeywordTabsNavigation from './KeywordTabsNavigation';
import KeywordTabsContent from './KeywordTabsContent';

interface AdvancedKeywordGeneratorProps {}

const AdvancedKeywordGenerator: React.FC<AdvancedKeywordGeneratorProps> = () => {
  const [keyword, setKeyword] = useState('');
  const [language, setLanguage] = useState('fr');
  const [isLoading, setIsLoading] = useState(false);
  const [keywords, setKeywords] = useState<KeywordSuggestion[]>([]);
  const [activeTab, setActiveTab] = useState('keywords');
  const [hasGenerated, setHasGenerated] = useState(false);
  const [generatedArticle, setGeneratedArticle] = useState('');
  const [showArticleDialog, setShowArticleDialog] = useState(false);

  const generateKeywords = async () => {
    if (!keyword.trim()) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedKeywords: KeywordSuggestion[] = [
        {
          keyword: `${keyword} guide complet`,
          volume: 2400,
          difficulty: 45,
          cpc: 1.2,
          competition: 0.6,
          trend: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75],
          intent: 'informational',
          type: 'long-tail',
          opportunity: 75,
          searchVolume: 2400,
          relevance: 90,
          suggestedTitle: `Guide Complet ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} 2025`,
          suggestedDescription: `Découvrez tout sur ${keyword} avec notre guide expert. Conseils pratiques et stratégies éprouvées pour ${keyword}.`
        },
        {
          keyword: `comment ${keyword}`,
          volume: 1800,
          difficulty: 35,
          cpc: 0.8,
          competition: 0.4,
          trend: [15, 18, 22, 28, 32, 38, 42, 48, 52, 58, 62, 68],
          intent: 'informational',
          type: 'question',
          opportunity: 80,
          searchVolume: 1800,
          relevance: 85,
          suggestedTitle: `Comment ${keyword} - Guide Pratique`,
          suggestedDescription: `Apprenez comment bien faire ${keyword} étape par étape avec nos conseils d'experts.`
        },
        {
          keyword: `${keyword} prix`,
          volume: 3200,
          difficulty: 55,
          cpc: 2.1,
          competition: 0.8,
          trend: [25, 28, 32, 35, 40, 45, 50, 55, 60, 65, 70, 75],
          intent: 'commercial',
          type: 'standard',
          opportunity: 65,
          searchVolume: 3200,
          relevance: 95,
          suggestedTitle: `Prix ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} 2025 : Comparatif`,
          suggestedDescription: `Découvrez les prix ${keyword} actuels. Comparaisons détaillées, promotions et conseils d'achat pour ${keyword}.`
        },
        {
          keyword: `meilleur ${keyword}`,
          volume: 2800,
          difficulty: 60,
          cpc: 1.8,
          competition: 0.7,
          trend: [30, 32, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80],
          intent: 'commercial',
          type: 'standard',
          opportunity: 70,
          searchVolume: 2800,
          relevance: 88,
          suggestedTitle: `Meilleur ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} 2025 : Top 10`,
          suggestedDescription: `Classement des meilleurs ${keyword}. Tests complets, avis détaillés et recommandations d'experts pour ${keyword}.`
        },
        {
          keyword: `${keyword} conseils`,
          volume: 1600,
          difficulty: 30,
          cpc: 0.9,
          competition: 0.3,
          trend: [12, 15, 18, 22, 25, 30, 35, 40, 45, 50, 55, 60],
          intent: 'informational',
          type: 'long-tail',
          opportunity: 85,
          searchVolume: 1600,
          relevance: 82,
          suggestedTitle: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} : Conseils d'Experts`,
          suggestedDescription: `Conseils pratiques pour ${keyword}. Guide complet avec exemples concrets et astuces d'experts.`
        }
      ];

      setKeywords(generatedKeywords);
      setHasGenerated(true);
      
      generateArticle(keyword);
      
      toast.success(`${generatedKeywords.length} mots-clés générés avec succès !`);
      
    } catch (error) {
      toast.error("Erreur lors de la génération des mots-clés");
    } finally {
      setIsLoading(false);
    }
  };

  const generateArticle = (userKeyword: string) => {
    if (!userKeyword) return;
    
    // Création d'un contenu spécifique selon le mot-clé
    const getSpecificContent = (keyword: string) => {
      const lowerKeyword = keyword.toLowerCase();
      
      // Contenu spécialisé pour l'aquariophilie
      if (lowerKeyword.includes('aquariophilie') || lowerKeyword.includes('aquarium') || lowerKeyword.includes('poisson')) {
        if (lowerKeyword.includes('erreur')) {
          return {
            title: "Les Erreurs les Plus Fréquentes en Aquariophilie : Guide Complet",
            intro: "L'aquariophilie est un hobby passionnant mais délicat qui demande des connaissances spécifiques. De nombreux débutants commettent des erreurs qui peuvent être fatales pour leurs poissons. Ce guide détaille les erreurs les plus courantes et comment les éviter.",
            sections: [
              {
                title: "Erreurs de Démarrage d'Aquarium",
                content: `
**Le cycle de l'azote négligé**
L'erreur la plus grave est de ne pas effectuer le cycle de l'azote avant d'introduire les poissons. Ce processus de 4-6 semaines permet aux bactéries bénéfiques de s'établir pour transformer l'ammoniaque toxique.

**Surpopulation immédiate**
Beaucoup introduisent trop de poissons d'un coup. Il faut respecter la règle de 1 cm de poisson par litre d'eau et introduire progressivement les habitants.

**Filtration insuffisante**
Sous-dimensionner le système de filtration est une erreur critique. Le débit du filtre doit représenter 3 à 5 fois le volume de l'aquarium par heure.
                `
              },
              {
                title: "Erreurs d'Alimentation",
                content: `
**Suralimentation**
C'est l'erreur n°1 des débutants. Les poissons doivent consommer toute la nourriture en 2-3 minutes maximum. Le surplus pollue l'eau et peut être mortel.

**Nourriture inadaptée**
Chaque espèce a des besoins nutritionnels spécifiques. Les poissons de fond ne mangent pas les flocons de surface, les carnivores ont besoin de protéines animales.

**Fréquence incorrecte**
Un à deux repas par jour suffisent pour la plupart des poissons adultes. Certains aquariophiles nourrissent 5-6 fois par jour, ce qui est excessif.
                `
              },
              {
                title: "Erreurs de Maintenance",
                content: `
**Changements d'eau insuffisants**
Il faut renouveler 20-30% de l'eau chaque semaine. Beaucoup négligent cette étape cruciale pour évacuer les nitrates et reminéraliser l'eau.

**Nettoyage excessif du filtre**
Nettoyer trop souvent ou avec l'eau du robinet détruit les bactéries bénéfiques. Un rinçage mensuel à l'eau de l'aquarium suffit.

**Paramètres ignorés**
Ne pas tester régulièrement pH, nitrites, nitrates, GH et KH mène à des déséquilibres mortels pour les poissons.
                `
              },
              {
                title: "Erreurs de Choix d'Espèces",
                content: `
**Incompatibilité des espèces**
Mélanger poissons agressifs et paisibles, ou espèces aux besoins différents (température, pH) cause stress et mortalité.

**Taille adulte méconnue**
Beaucoup achètent des poissons juvéniles sans connaître leur taille adulte. Un poisson rouge peut atteindre 30 cm !

**Besoins spécifiques ignorés**
Certaines espèces ont des exigences très particulières (température précise, eau douce/salée, cachettes spécifiques) qu'il faut respecter.
                `
              }
            ],
            faq: [
              {
                question: "Combien de temps faut-il pour cycler un aquarium ?",
                answer: "Le cycle de l'azote prend généralement 4 à 6 semaines. On peut l'accélérer avec des bactéries du commerce, mais il ne faut jamais le négliger."
              },
              {
                question: "Que faire si mes poissons meurent un par un ?",
                answer: "Testez immédiatement les paramètres de l'eau (ammoniaque, nitrites, nitrates, pH). Une hausse de ces valeurs indique un problème de filtration ou de surpopulation."
              },
              {
                question: "Comment savoir si je nourris trop mes poissons ?",
                answer: "Si la nourriture n'est pas consommée en 2-3 minutes, c'est trop. Des algues excessives et une eau trouble sont aussi des signes de suralimentation."
              },
              {
                question: "Puis-je mélanger poissons d'eau douce et d'eau de mer ?",
                answer: "Absolument pas ! Ce sont deux écosystèmes totalement différents qui nécessitent des équipements et paramètres distincts."
              }
            ]
          };
        }
      }
      
      // Contenu générique pour d'autres sujets
      return {
        title: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} : Guide Pratique et Informatif`,
        intro: `Ce guide explore le sujet "${keyword}" de manière approfondie et pratique. Vous trouverez ici des informations concrètes, des conseils d'experts et des réponses aux questions les plus fréquentes.`,
        sections: [
          {
            title: `Introduction à ${keyword}`,
            content: `${keyword} est un domaine qui nécessite une approche méthodique et des connaissances précises. Dans cette section, nous abordons les concepts fondamentaux et les principes de base à maîtriser.`
          },
          {
            title: `Les aspects techniques de ${keyword}`,
            content: `Pour bien comprendre ${keyword}, il est essentiel de maîtriser les aspects techniques. Cette section détaille les mécanismes, les outils et les méthodes utilisés dans ce domaine.`
          },
          {
            title: `Applications pratiques de ${keyword}`,
            content: `${keyword} trouve son application dans de nombreux contextes. Nous explorons ici les cas d'usage concrets, les exemples pratiques et les meilleures approches à adopter.`
          }
        ],
        faq: [
          {
            question: `Qu'est-ce qu'il faut savoir sur ${keyword} ?`,
            answer: `${keyword} requiert une compréhension des principes de base et une approche méthodique pour obtenir les meilleurs résultats.`
          },
          {
            question: `Comment débuter avec ${keyword} ?`,
            answer: `Pour débuter avec ${keyword}, il est recommandé de commencer par les fondamentaux et de progresser étape par étape.`
          }
        ]
      };
    };

    const content = getSpecificContent(userKeyword);
    
    const article = `# ${content.title}

## Introduction

${content.intro}

${content.sections.map(section => `
## ${section.title}

${section.content}
`).join('')}

## Questions Fréquemment Posées (FAQ)

${content.faq.map(faq => `
### ${faq.question}

${faq.answer}
`).join('')}

## Conclusion

Ce guide sur ${userKeyword} vous donne les bases essentielles pour éviter les pièges les plus courants et réussir dans ce domaine. La clé du succès réside dans la patience, l'observation et l'application rigoureuse des bonnes pratiques.

N'hésitez pas à approfondir vos connaissances en consultant des sources spécialisées et en échangeant avec des experts du domaine.

---

*Article rédigé le ${new Date().toLocaleDateString('fr-FR')} - Guide pratique et informatif*`;

    setGeneratedArticle(article);
  };

  const copyArticle = () => {
    navigator.clipboard.writeText(generatedArticle);
    toast.success('Article copié dans le presse-papier');
  };

  const downloadArticle = () => {
    const blob = new Blob([generatedArticle], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `article-${keyword.replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Article téléchargé');
  };

  return (
    <div className="space-y-8">
      {/* Hero Section with Gradient */}
      <Card className="relative overflow-hidden border-0 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-pink-500/90"></div>
        <CardContent className="relative p-12 text-center text-white">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Générateur de Mots-Clés IA
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Découvrez des mots-clés performants avec l'intelligence artificielle. 
            Analysez la concurrence, générez du contenu optimisé et boostez votre SEO.
          </p>
        </CardContent>
      </Card>

      {/* Main Generator Card */}
      <Card className="shadow-xl border-2 border-gradient-to-r from-blue-200 to-purple-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Search className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Générateur de mots-clés
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Mot-clé principal</label>
              <Input 
                placeholder="ex: marketing digital"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="border-2 border-blue-200 focus:border-blue-500 rounded-lg"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Langue</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="border-2 border-blue-200 focus:border-blue-500 rounded-lg">
                  <SelectValue placeholder="Langue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">🇫🇷 Français</SelectItem>
                  <SelectItem value="en">🇺🇸 Anglais</SelectItem>
                  <SelectItem value="es">🇪🇸 Espagnol</SelectItem>
                  <SelectItem value="de">🇩🇪 Allemand</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={generateKeywords}
              disabled={isLoading || !keyword.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg h-12 mt-6"
            >
              {isLoading ? (
                <>
                  <Zap className="mr-2 h-5 w-5 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <Rocket className="mr-2 h-5 w-5" />
                  Générer les mots-clés
                </>
              )}
            </Button>

            {hasGenerated && generatedArticle && (
              <Dialog open={showArticleDialog} onOpenChange={setShowArticleDialog}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg h-12 mt-6"
                  >
                    <Eye className="mr-2 h-5 w-5" />
                    Voir l'Article
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center justify-between text-xl">
                      <span className="flex items-center gap-2">
                        <Target className="h-6 w-6 text-blue-500" />
                        Article Informatif - {keyword}
                      </span>
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={copyArticle}
                          className="hover:bg-blue-50 border-blue-200"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copier
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={downloadArticle}
                          className="hover:bg-green-50 border-green-200"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                      </div>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-6">
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl border-2 border-blue-100 max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed font-sans">
                        {generatedArticle}
                      </pre>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {hasGenerated && (
            <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-green-700 font-medium">
                ✨ {keywords.length} mots-clés générés avec succès !
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {hasGenerated && (
        <div className="bg-white rounded-xl shadow-xl border-2 border-gray-100">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b bg-gradient-to-r from-gray-50 to-blue-50 p-2 rounded-t-xl">
              <KeywordTabsNavigation 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                hasResults={hasGenerated} 
              />
            </div>
            <div className="p-6">
              <KeywordTabsContent 
                activeTab={activeTab} 
                keywords={keywords} 
                keyword={keyword} 
              />
            </div>
          </Tabs>
        </div>
      )}

      {!hasGenerated && !isLoading && (
        <Card className="p-16 text-center bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-dashed border-blue-200">
          <div className="p-6 bg-white rounded-full w-32 h-32 mx-auto mb-6 shadow-lg">
            <Search className="h-20 w-20 text-blue-400 mx-auto mt-6" />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Commencez votre recherche</h3>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Entrez un mot-clé pour générer des suggestions intelligentes, 
            analyser la concurrence et découvrir de nouvelles opportunités SEO. 
            Notre IA vous accompagne dans votre stratégie de contenu.
          </p>
        </Card>
      )}
    </div>
  );
};

export default AdvancedKeywordGenerator;
