
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
    
    const article = `# ${userKeyword.charAt(0).toUpperCase() + userKeyword.slice(1)} : Guide Complet 2025

## Introduction à ${userKeyword}

Dans le monde d'aujourd'hui, **${userKeyword}** représente un enjeu majeur pour de nombreuses personnes. Ce guide complet vous donnera toutes les clés pour comprendre et maîtriser ${userKeyword} efficacement.

## Pourquoi ${userKeyword} est-il important ?

### Les enjeux de ${userKeyword}
- **Impact direct** : ${userKeyword} influence directement vos résultats
- **Évolution constante** : Le domaine de ${userKeyword} évolue rapidement
- **Opportunités** : Maîtriser ${userKeyword} ouvre de nouvelles possibilités

### Tendances actuelles pour ${userKeyword}
En 2025, ${userKeyword} connaît des évolutions importantes :
- Nouvelles approches pour ${userKeyword}
- Technologies émergentes dans ${userKeyword}
- Changements réglementaires autour de ${userKeyword}

## Comment optimiser ${userKeyword}

### Étape 1 : Analyse de ${userKeyword}
Avant de vous lancer, analysez votre situation actuelle concernant ${userKeyword} :
- Évaluez vos besoins spécifiques pour ${userKeyword}
- Identifiez les obstacles liés à ${userKeyword}
- Définissez des objectifs clairs pour ${userKeyword}

### Étape 2 : Stratégie pour ${userKeyword}
Développez une approche structurée :
- **Planification** : Établissez un plan d'action pour ${userKeyword}
- **Ressources** : Identifiez les outils nécessaires pour ${userKeyword}
- **Timeline** : Définissez un calendrier réaliste pour ${userKeyword}

### Étape 3 : Mise en œuvre de ${userKeyword}
- Commencez par les aspects fondamentaux de ${userKeyword}
- Progressez étape par étape avec ${userKeyword}
- Mesurez régulièrement vos progrès avec ${userKeyword}

## Meilleures pratiques pour ${userKeyword}

### Conseils d'experts pour ${userKeyword}
1. **Restez informé** : Suivez les actualités sur ${userKeyword}
2. **Expérimentez** : Testez différentes approches de ${userKeyword}
3. **Mesurez** : Analysez l'impact de vos actions sur ${userKeyword}
4. **Adaptez** : Ajustez votre stratégie ${userKeyword} si nécessaire

### Erreurs à éviter avec ${userKeyword}
- Ne pas sous-estimer l'importance de ${userKeyword}
- Négliger la veille sur ${userKeyword}
- Manquer de patience avec ${userKeyword}
- Oublier de mesurer les résultats de ${userKeyword}

## Questions fréquentes sur ${userKeyword}

### Combien de temps faut-il pour maîtriser ${userKeyword} ?
La maîtrise de ${userKeyword} dépend de plusieurs facteurs :
- Votre niveau de départ avec ${userKeyword}
- Le temps que vous consacrez à ${userKeyword}
- La complexité de votre domaine d'application de ${userKeyword}

En général, comptez :
- **Bases de ${userKeyword}** : 2-4 semaines
- **Niveau intermédiaire** : 2-6 mois
- **Expertise en ${userKeyword}** : 1-2 ans

### Quels sont les coûts associés à ${userKeyword} ?
Les coûts varient selon vos besoins :
- **Formation ${userKeyword}** : 100-1000€
- **Outils pour ${userKeyword}** : 50-500€/mois
- **Accompagnement ${userKeyword}** : 500-5000€

## Conclusion sur ${userKeyword}

${userKeyword} représente un investissement stratégique important en 2025. Avec une approche méthodique et les bonnes ressources, vous pouvez obtenir d'excellents résultats avec ${userKeyword}.

### Points clés à retenir :
- ${userKeyword} nécessite une approche structurée
- La réussite avec ${userKeyword} demande du temps et de la patience
- Les bénéfices de ${userKeyword} sont durables
- L'évolution constante de ${userKeyword} nécessite une veille permanente

N'hésitez pas à commencer dès maintenant votre parcours avec ${userKeyword} !

---
*Guide rédigé le ${new Date().toLocaleDateString('fr-FR')} - Dernière mise à jour sur ${userKeyword}*`;

    setGeneratedArticle(article);
  };

  const copyArticle = () => {
    navigator.clipboard.writeText(generatedArticle);
    toast.success('Article copié dans le presse-papiers');
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
                        Article Optimisé SEO - {keyword}
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
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
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
