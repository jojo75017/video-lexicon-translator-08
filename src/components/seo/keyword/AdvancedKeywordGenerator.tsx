
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
    
    const article = `# ${userKeyword.charAt(0).toUpperCase() + userKeyword.slice(1)} : Guide Complet et Informatif

## Table des matières
1. [Introduction](#introduction)
2. [Définition et concepts de base](#definition)
3. [Fonctionnement](#fonctionnement)
4. [Types et variantes](#types)
5. [Guide d'utilisation](#guide)
6. [Avantages et inconvénients](#avantages)
7. [Comparaisons](#comparaisons)
8. [FAQ](#faq)
9. [Conclusion](#conclusion)

## Introduction {#introduction}

${userKeyword} est un sujet qui mérite une explication détaillée et factuelle. Dans cet article, nous allons explorer en profondeur tous les aspects liés à ${userKeyword}, sans prétention commerciale, mais avec l'objectif de vous fournir une information complète et utile.

Ce guide s'adresse à toute personne souhaitant comprendre ${userKeyword} de manière approfondie, que vous soyez débutant ou que vous cherchiez à approfondir vos connaissances existantes.

## Définition et concepts de base {#definition}

### Qu'est-ce que ${userKeyword} ?

${userKeyword} peut être défini comme [définition technique appropriée selon le contexte]. Cette définition englobe plusieurs aspects importants :

- **Aspect technique** : Les caractéristiques techniques fondamentales
- **Aspect pratique** : L'application concrète dans la vie quotidienne
- **Aspect historique** : L'évolution du concept au fil du temps

### Origines et histoire

L'histoire de ${userKeyword} remonte à [période appropriée]. Les développements majeurs incluent :

1. **Première phase** : Les origines et premiers développements
2. **Phase d'évolution** : Les améliorations et adaptations
3. **Phase moderne** : L'état actuel et les tendances récentes

## Fonctionnement {#fonctionnement}

### Principes de base

Le fonctionnement de ${userKeyword} repose sur plusieurs principes fondamentaux :

**Principe 1 : Structure de base**
- Composant A : Description du rôle et de l'importance
- Composant B : Interaction avec les autres éléments
- Composant C : Impact sur le résultat final

**Principe 2 : Processus opérationnel**
- Étape 1 : Initialisation et préparation
- Étape 2 : Mise en œuvre principale
- Étape 3 : Finalisation et contrôle qualité

### Mécanismes détaillés

Les mécanismes qui régissent ${userKeyword} sont complexes mais peuvent être expliqués de manière accessible :

- **Mécanisme primaire** : [Explication détaillée]
- **Mécanismes secondaires** : [Interactions et dépendances]
- **Facteurs influents** : [Variables qui affectent le fonctionnement]

## Types et variantes {#types}

Il existe plusieurs types de ${userKeyword}, chacun ayant ses propres caractéristiques :

### Type A : [Nom du type]
- **Caractéristiques** : Description des traits distinctifs
- **Applications** : Domaines d'utilisation privilégiés
- **Avantages spécifiques** : Points forts de ce type

### Type B : [Nom du type]
- **Caractéristiques** : Particularités techniques
- **Applications** : Cas d'usage recommandés
- **Limitations** : Contraintes à considérer

### Type C : [Nom du type]
- **Caractéristiques** : Spécificités notables
- **Applications** : Secteurs d'application
- **Considérations** : Points d'attention importants

## Guide d'utilisation pratique {#guide}

### Préparation

Avant de commencer avec ${userKeyword}, il est important de :

1. **Évaluer vos besoins** : Déterminer précisément vos objectifs
2. **Rassembler les ressources** : Identifier ce dont vous aurez besoin
3. **Planifier l'approche** : Établir une stratégie claire

### Mise en œuvre étape par étape

**Étape 1 : Configuration initiale**
- Vérifiez les prérequis techniques
- Préparez l'environnement de travail
- Configurez les paramètres de base

**Étape 2 : Application principale**
- Commencez par les éléments fondamentaux
- Procédez progressivement vers les aspects plus complexes
- Testez régulièrement les résultats

**Étape 3 : Optimisation et ajustements**
- Analysez les performances obtenues
- Identifiez les points d'amélioration
- Appliquez les corrections nécessaires

### Bonnes pratiques

- **Régularité** : Maintenez une approche cohérente
- **Documentation** : Enregistrez vos observations et résultats
- **Patience** : Accordez le temps nécessaire pour des résultats durables
- **Adaptation** : Restez flexible face aux situations particulières

## Avantages et inconvénients {#avantages}

### Avantages principaux

**Efficacité**
- Gain de temps considérable dans la plupart des cas
- Résultats généralement supérieurs aux méthodes alternatives

**Flexibilité**
- Adaptation possible à différents contextes
- Personnalisation selon les besoins spécifiques

**Durabilité**
- Solutions à long terme
- Impact positif sur la durée

### Inconvénients à considérer

**Complexité initiale**
- Courbe d'apprentissage parfois importante
- Nécessité d'acquérir certaines compétences

**Coût**
- Investissement initial parfois conséquent
- Coûts de maintenance à prévoir

**Dépendances**
- Peut nécessiter d'autres éléments pour fonctionner optimalement
- Sensibilité aux changements extérieurs

## Comparaisons avec les alternatives {#comparaisons}

### ${userKeyword} vs Alternative A

| Critère | ${userKeyword} | Alternative A |
|---------|----------------|---------------|
| Facilité d'utilisation | Moyenne | Élevée |
| Efficacité | Élevée | Moyenne |
| Coût | Variable | Généralement plus bas |
| Durabilité | Excellente | Bonne |

### ${userKeyword} vs Alternative B

| Critère | ${userKeyword} | Alternative B |
|---------|----------------|---------------|
| Flexibilité | Élevée | Limitée |
| Résultats | Consistants | Variables |
| Support | Bien documenté | Documentation limitée |
| Communauté | Active | Restreinte |

## Questions fréquemment posées {#faq}

### Question 1 : Combien de temps faut-il pour maîtriser ${userKeyword} ?
La durée d'apprentissage varie selon votre expérience préalable et vos objectifs. En général, comptez quelques semaines pour les bases et plusieurs mois pour une maîtrise avancée.

### Question 2 : ${userKeyword} est-il adapté aux débutants ?
Oui, bien que certains aspects puissent paraître complexes au début. Il est recommandé de commencer par les concepts de base avant de progresser vers les applications plus avancées.

### Question 3 : Quelles sont les erreurs courantes à éviter ?
Les erreurs les plus fréquentes incluent : précipitation dans l'apprentissage, négligence des fondamentaux, et manque de pratique régulière.

### Question 4 : Où trouver des ressources supplémentaires ?
De nombreuses ressources sont disponibles : documentation officielle, forums spécialisés, tutoriels en ligne, et communautés de pratique.

### Question 5 : ${userKeyword} évolue-t-il rapidement ?
Comme dans beaucoup de domaines, ${userKeyword} connaît des évolutions régulières. Il est important de rester informé des nouveautés et mises à jour.

## Conclusion {#conclusion}

${userKeyword} représente un domaine riche et complexe qui mérite une approche méthodique et patiente. Les informations présentées dans cet article vous donnent une base solide pour comprendre et utiliser ${userKeyword} de manière efficace.

Les points clés à retenir :

- **Compréhension des fondamentaux** : Une base solide est essentielle
- **Approche progressive** : Avancez étape par étape
- **Pratique régulière** : L'expérience est irremplaçable
- **Veille continue** : Restez informé des évolutions

Que vous soyez au début de votre parcours ou que vous cherchiez à approfondir vos connaissances, ${userKeyword} offre de nombreuses possibilités d'application et d'amélioration continue.

---

*Article rédigé le ${new Date().toLocaleDateString('fr-FR')} - Contenu informatif et éducatif*`;

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
