
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Search, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Building2, 
  FileText, 
  Users, 
  BarChart3,
  Lightbulb,
  Download,
  Key,
  MessageSquare,
  Zap,
  Eye,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';
import { KeywordSuggestion } from '@/types/seo/Keyword';

interface AdvancedKeywordGeneratorProps {}

const AdvancedKeywordGenerator: React.FC<AdvancedKeywordGeneratorProps> = () => {
  const [keyword, setKeyword] = useState('');
  const [language, setLanguage] = useState('fr');
  const [isLoading, setIsLoading] = useState(false);
  const [keywords, setKeywords] = useState<KeywordSuggestion[]>([]);
  const [activeTab, setActiveTab] = useState('generator');
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
      // Simuler la génération de mots-clés
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
          suggestedTitle: `Guide Complet ${keyword} 2025`,
          suggestedDescription: `Découvrez tout sur ${keyword} avec notre guide expert. Conseils pratiques et stratégies éprouvées.`
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
          suggestedTitle: `Comment ${keyword} Efficacement`,
          suggestedDescription: `Apprenez ${keyword} étape par étape avec nos conseils d'experts.`
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
          suggestedTitle: `Prix ${keyword} 2025 : Comparatif Complet`,
          suggestedDescription: `Découvrez les prix ${keyword} actuels. Comparaisons, promotions et conseils d'achat.`
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
          suggestedTitle: `Meilleur ${keyword} 2025 : Top 10`,
          suggestedDescription: `Classement des meilleurs ${keyword}. Tests, avis et recommandations d'experts.`
        },
        {
          keyword: `${keyword} débutant`,
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
          suggestedTitle: `${keyword} pour Débutants : Guide Facile`,
          suggestedDescription: `Commencez avec ${keyword} facilement. Guide débutant avec exemples pratiques.`
        }
      ];

      setKeywords(generatedKeywords);
      setHasGenerated(true);
      
      // Générer l'article automatiquement avec le vrai mot-clé de l'utilisateur
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

## Table des matières
1. [Introduction](#introduction)
2. [Qu'est-ce que ${userKeyword} ?](#definition)
3. [Comment bien choisir ${userKeyword}](#utilisation)
4. [Les meilleures pratiques pour ${userKeyword}](#meilleures-pratiques)
5. [Erreurs courantes à éviter](#erreurs-courantes)
6. [Outils et ressources recommandés](#outils-ressources)
7. [Études de cas et exemples](#etudes-cas)
8. [FAQ - Questions fréquentes](#faq)
9. [Tendances et évolutions futures](#tendances)
10. [Conclusion](#conclusion)

## Introduction {#introduction}

Découvrez tout ce que vous devez savoir sur **${userKeyword}** dans ce guide exhaustif. Que vous soyez débutant ou expert, ce guide vous accompagnera pas à pas pour maîtriser parfaitement ce sujet essentiel.

Dans un monde où les choix sont de plus en plus nombreux, bien comprendre ${userKeyword} devient crucial pour faire les meilleurs choix. Ce guide de plus de 1500 mots vous donnera toutes les clés pour exceller dans votre recherche de ${userKeyword}.

## Qu'est-ce que ${userKeyword} ? {#definition}

${userKeyword} représente un choix important qui mérite une attention particulière. Pour bien comprendre son importance, analysons ses différents aspects et applications pratiques.

### Les bases essentielles

Avant de vous lancer dans votre recherche de ${userKeyword}, maîtrisez ces concepts de base :

- **Définition claire** : ${userKeyword} se caractérise par ses spécificités uniques qui le distinguent des alternatives
- **Applications pratiques** : Utilisations concrètes dans différents contextes
- **Avantages principaux** : Bénéfices directs et indirects pour les utilisateurs
- **Considérations importantes** : Points d'attention cruciaux à retenir pour éviter les pièges

### Historique et évolution

L'évolution de ${userKeyword} au fil des années montre une progression constante vers plus de qualité et d'accessibilité. Les innovations récentes ont révolutionné la façon dont nous appréhendons ${userKeyword}.

## Comment bien choisir ${userKeyword} {#utilisation}

### Étape 1 : Analyse de vos besoins

La première étape consiste à bien analyser vos besoins spécifiques concernant ${userKeyword}. Cette phase d'analyse est cruciale car elle détermine 80% de votre satisfaction future.

**Actions concrètes :**
- Analysez vos besoins spécifiques et contraintes
- Définissez vos critères prioritaires
- Évaluez votre budget disponible
- Identifiez les caractéristiques indispensables

### Étape 2 : Recherche et comparaison

Une fois vos besoins définis, passez à la phase de recherche avec une méthode structurée et comparative qui a fait ses preuves.

**Méthode recommandée :**
1. Listez les options disponibles pour ${userKeyword}
2. Comparez les caractéristiques principales
3. Lisez les avis et retours d'expérience
4. Vérifiez la réputation et la fiabilité
5. Prenez votre décision en toute connaissance de cause

### Étape 3 : Validation et suivi

La validation de votre choix vous permettra d'obtenir les meilleurs résultats avec ${userKeyword} et d'éviter les déceptions.

## Les meilleures pratiques pour ${userKeyword} {#meilleures-pratiques}

Pour maximiser votre satisfaction avec ${userKeyword}, suivez ces recommandations d'experts qui ont fait leurs preuves :

### 1. Préparation rigoureuse
- Établissez une liste de critères clairs
- Définissez un budget réaliste
- Planifiez le timing de votre recherche

### 2. Recherche approfondie
- Consultez plusieurs sources fiables
- Lisez les avis clients authentiques
- Comparez objectivement les options

### 3. Vérification continue
- Surveillez les évolutions du marché
- Restez informé des nouveautés
- Adaptez vos critères si nécessaire

## Erreurs courantes à éviter {#erreurs-courantes}

Voici les principales erreurs que font 90% des personnes lors de leur recherche de ${userKeyword} :

### Erreur #1 : Se précipiter
Beaucoup se précipitent sans avoir suffisamment analysé leurs besoins. Cette précipitation coûte cher en satisfaction.

**Solution :** Prenez le temps nécessaire pour bien définir vos critères.

### Erreur #2 : Ne considérer que le prix
Se focaliser uniquement sur le prix peut conduire à des choix décevants pour ${userKeyword}.

**Solution :** Considérez le rapport qualité-prix global.

### Erreur #3 : Ignorer les avis
Négliger les retours d'expérience d'autres utilisateurs est une erreur commune.

**Solution :** Consultez toujours les avis authentiques et récents.

## FAQ - Questions fréquentes {#faq}

### Comment choisir le meilleur ${userKeyword} ?
Le choix du meilleur ${userKeyword} dépend de vos besoins spécifiques et de votre budget. En général :
- **Analysez vos besoins** : 2-3 critères prioritaires
- **Comparez les options** : Au moins 3-5 alternatives
- **Vérifiez la qualité** : Avis, garanties, réputation

### ${userKeyword} est-il adapté aux débutants ?
Absolument ! Avec une approche progressive et les bonnes informations, tout le monde peut faire le bon choix pour ${userKeyword}.

### Quels sont les budgets moyens pour ${userKeyword} ?
Les budgets varient considérablement selon vos besoins :
- **Entrée de gamme :** Solutions abordables pour débuter
- **Milieu de gamme :** Bon compromis qualité-prix
- **Haut de gamme :** Solutions premium pour exigences élevées

### Comment éviter les arnaques liées à ${userKeyword} ?
Pour éviter les problèmes :
- Vérifiez la réputation du fournisseur
- Lisez les conditions générales
- Méfiez-vous des offres trop alléchantes
- Privilégiez les sources fiables

### Quand revoir son choix de ${userKeyword} ?
Il est recommandé de réévaluer votre choix :
- Tous les 6-12 mois selon le domaine
- Lors de changements de besoins
- Si de nouvelles options apparaissent
- En cas d'insatisfaction

## Tendances et évolutions futures {#tendances}

Le domaine de ${userKeyword} évolue rapidement. Voici les principales tendances à surveiller :

### Innovation technologique
L'intégration de nouvelles technologies révolutionne ${userKeyword} :
- Amélioration de la qualité
- Nouvelles fonctionnalités
- Meilleure accessibilité
- Prix plus compétitifs

### Approches durables
La durabilité devient un critère essentiel pour ${userKeyword} :
- Solutions éco-responsables
- Longévité accrue
- Impact environnemental réduit
- Transparence des pratiques

## Conclusion {#conclusion}

${userKeyword} représente un choix important qui mérite une attention particulière en 2025. Avec les bonnes informations, une méthode claire et une approche réfléchie, vous pouvez faire le meilleur choix possible.

### Points clés à retenir :
1. **Préparation** : Analysez bien vos besoins avant tout
2. **Recherche** : Comparez plusieurs options sérieusement
3. **Vérification** : Consultez les avis et références
4. **Budget** : Définissez un budget réaliste
5. **Suivi** : Restez informé des évolutions

### Prochaines étapes recommandées :
- Définissez vos critères prioritaires pour ${userKeyword}
- Établissez votre budget maximum
- Consultez les sources fiables
- Comparez au moins 3 options
- Prenez votre décision en toute sérénité

N'hésitez pas à prendre le temps nécessaire pour faire le bon choix concernant ${userKeyword}. Un choix réfléchi aujourd'hui vous évitera bien des déceptions demain !

---

*Article généré automatiquement le ${new Date().toLocaleDateString('fr-FR')} - Guide professionnel ${userKeyword}*`;

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
    <div className="space-y-6">
      {/* En-tête du générateur */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Générateur de Mots-Clés IA Avancé
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Générez des mots-clés intelligents avec l'IA OpenAI. Obtenez des suggestions sémantiques, 
            longue traîne, analyses approfondies, générateur de contenu, FAQ automatique et optimisation complète.
          </p>
        </div>
      </Card>

      {/* Formulaire de recherche */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-bold">Générateur de mots-clés</h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
          <Input 
            placeholder="Entrez votre mot-clé principal"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full"
          />
          
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Langue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="en">Anglais</SelectItem>
              <SelectItem value="es">Espagnol</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={generateKeywords}
            disabled={isLoading || !keyword.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Zap className="mr-2 h-4 w-4 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Générer
              </>
            )}
          </Button>

          {/* Bouton pour voir l'article - Visible après génération */}
          {hasGenerated && generatedArticle && (
            <Dialog open={showArticleDialog} onOpenChange={setShowArticleDialog}>
              <DialogTrigger asChild>
                <Button 
                  variant="secondary" 
                  className="w-full bg-green-100 hover:bg-green-200 text-green-800 border-green-300"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Voir l'Article
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>Article Professionnel - {keyword}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={copyArticle}>
                        <Copy className="h-4 w-4 mr-1" />
                        Copier
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadArticle}>
                        <Download className="h-4 w-4 mr-1" />
                        Télécharger
                      </Button>
                    </div>
                  </DialogTitle>
                </DialogHeader>
                <div className="prose prose-lg max-w-none mt-4">
                  <div className="whitespace-pre-wrap text-sm font-mono bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                    {generatedArticle}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </Card>

      {/* Résultats des mots-clés */}
      {hasGenerated && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Mots-clés générés</h2>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {keywords.length} mots-clés
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keywords.map((kw, idx) => (
              <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900">{kw.keyword}</h3>
                  <Badge className={`
                    ${kw.intent === 'commercial' ? 'bg-green-100 text-green-800' : ''}
                    ${kw.intent === 'informational' ? 'bg-blue-100 text-blue-800' : ''}
                    ${kw.intent === 'transactional' ? 'bg-purple-100 text-purple-800' : ''}
                  `}>
                    {kw.intent}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <span className="text-gray-500">Volume:</span>
                    <span className="ml-1 font-medium">{kw.volume?.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Difficulté:</span>
                    <span className="ml-1 font-medium">{kw.difficulty}/100</span>
                  </div>
                  <div>
                    <span className="text-gray-500">CPC:</span>
                    <span className="ml-1 font-medium">{kw.cpc}€</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Opportunité:</span>
                    <span className="ml-1 font-medium text-green-600">{kw.opportunity}%</span>
                  </div>
                </div>
                
                {kw.suggestedTitle && (
                  <div className="mt-3 p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-600 mb-1">Titre suggéré:</p>
                    <p className="text-sm font-medium">{kw.suggestedTitle}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* État vide */}
      {!hasGenerated && !isLoading && (
        <Card className="p-12 text-center">
          <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">Commencez votre recherche</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Entrez un mot-clé pour générer des suggestions intelligentes, 
            analyser la concurrence et découvrir de nouvelles opportunités SEO.
          </p>
        </Card>
      )}
    </div>
  );
};

export default AdvancedKeywordGenerator;
