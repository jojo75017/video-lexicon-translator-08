
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

interface ProfessionalKeywordGeneratorProps {}

const ProfessionalKeywordGenerator: React.FC<ProfessionalKeywordGeneratorProps> = () => {
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
          keyword: `comment utiliser ${keyword}`,
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
          suggestedTitle: `Comment Utiliser ${keyword} Efficacement`,
          suggestedDescription: `Apprenez à utiliser ${keyword} étape par étape avec nos conseils d'experts.`
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
      
      // Générer l'article automatiquement
      await generateArticle();
      
      toast.success(`${generatedKeywords.length} mots-clés générés avec succès !`);
      
    } catch (error) {
      toast.error("Erreur lors de la génération des mots-clés");
    } finally {
      setIsLoading(false);
    }
  };

  const generateArticle = async () => {
    if (!keyword) return;
    
    const article = `# ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} : Guide Complet 2025

## Table des matières
1. [Introduction](#introduction)
2. [Qu'est-ce que ${keyword} ?](#definition)
3. [Comment bien utiliser ${keyword}](#utilisation)
4. [Les meilleures pratiques](#meilleures-pratiques)
5. [Erreurs courantes à éviter](#erreurs-courantes)
6. [Outils et ressources recommandés](#outils-ressources)
7. [Études de cas et exemples](#etudes-cas)
8. [FAQ - Questions fréquentes](#faq)
9. [Tendances et évolutions futures](#tendances)
10. [Conclusion](#conclusion)

## Introduction {#introduction}

Découvrez tout ce que vous devez savoir sur **${keyword}** dans ce guide exhaustif. Que vous soyez débutant ou expert, ce guide vous accompagnera pas à pas pour maîtriser parfaitement ce sujet essentiel.

Dans un monde où la concurrence est de plus en plus forte, comprendre ${keyword} devient crucial pour réussir. Ce guide de plus de 1500 mots vous donnera toutes les clés pour exceller.

## Qu'est-ce que ${keyword} ? {#definition}

${keyword} représente un élément fondamental dans son domaine. Pour bien comprendre son importance, analysons ses différents aspects et applications pratiques.

### Les bases essentielles

Avant de vous lancer, maîtrisez ces concepts de base :

- **Définition claire** : ${keyword} se caractérise par ses spécificités uniques qui le distinguent des alternatives
- **Applications pratiques** : Utilisations concrètes dans différents contextes professionnels et personnels
- **Avantages principaux** : Bénéfices directs et indirects pour les utilisateurs et entreprises
- **Considérations importantes** : Points d'attention cruciaux à retenir pour éviter les pièges

### Historique et évolution

L'évolution de ${keyword} au fil des années montre une progression constante vers plus d'efficacité et d'accessibilité. Les innovations récentes ont révolutionné la façon dont nous appréhendons cette discipline.

## Comment bien utiliser ${keyword} {#utilisation}

### Étape 1 : Préparation stratégique

La première étape consiste à bien préparer votre approche. Cette phase de préparation est cruciale car elle détermine 80% de votre succès futur.

**Actions concrètes :**
- Analysez vos besoins spécifiques et contraintes
- Définissez vos objectifs SMART (Spécifiques, Mesurables, Atteignables, Réalistes, Temporels)
- Évaluez les ressources disponibles (temps, budget, compétences)
- Identifiez les parties prenantes et leurs attentes

### Étape 2 : Mise en œuvre progressive

Une fois la préparation terminée, passez à l'action avec une méthode structurée et progressive qui a fait ses preuves.

**Méthode recommandée :**
1. Commencez par les bases fondamentales
2. Testez sur de petits projets pilotes
3. Mesurez les résultats intermédiaires
4. Ajustez votre approche selon les retours
5. Déployez à plus grande échelle

### Étape 3 : Optimisation continue

L'optimisation continue vous permettra d'obtenir les meilleurs résultats possibles avec ${keyword} et de maintenir un avantage concurrentiel.

## Les meilleures pratiques {#meilleures-pratiques}

Pour maximiser l'efficacité de votre approche ${keyword}, suivez ces recommandations d'experts qui ont fait leurs preuves :

### 1. Planification rigoureuse
- Établissez un plan détaillé avec des jalons clairs
- Anticipez les obstacles potentiels et préparez des solutions de contournement
- Définissez des indicateurs de performance pertinents

### 2. Suivi et analyse réguliers
- Mettez en place un système de monitoring efficace
- Analysez les données régulièrement (hebdomadaire ou mensuelle)
- Ajustez votre stratégie selon les insights obtenus

### 3. Formation continue
- Restez informé des dernières évolutions et tendances
- Participez à des formations spécialisées
- Échangez avec d'autres professionnels du secteur

## FAQ - Questions fréquentes {#faq}

### Combien de temps faut-il pour maîtriser ${keyword} ?
La maîtrise de ${keyword} dépend de votre niveau initial et de votre investissement personnel. En général :
- **Niveau débutant :** 2-3 mois pour les bases
- **Niveau intermédiaire :** 6-12 mois de pratique régulière
- **Niveau expert :** 2-3 ans d'expérience variée

### ${keyword} est-il adapté aux débutants ?
Absolument ! Avec une approche progressive et les bonnes ressources, tout le monde peut apprendre ${keyword} efficacement.

### Quels sont les coûts associés à ${keyword} ?
Les coûts varient considérablement selon vos besoins :
- **Solutions gratuites :** Parfaites pour débuter et tester
- **Solutions intermédiaires :** 50-200€/mois pour PME
- **Solutions enterprise :** 500-2000€/mois pour grandes structures

## Conclusion {#conclusion}

${keyword} représente une opportunité majeure pour quiconque souhaite progresser dans ce domaine en 2025. Avec les bonnes connaissances, les outils adaptés et une approche méthodique, vous pouvez obtenir d'excellents résultats.

### Points clés à retenir :
1. **Préparation** : 20% du temps, 80% du succès
2. **Formation** : Investissez dans vos compétences
3. **Pratique** : L'expérience est irremplaçable
4. **Patience** : Les résultats prennent du temps
5. **Amélioration continue** : Restez curieux et adaptable

N'hésitez pas à commencer dès aujourd'hui en appliquant les conseils de ce guide !

---

*Article généré automatiquement le ${new Date().toLocaleDateString('fr-FR')} - Guide professionnel ${keyword}*`;

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

  const KeywordCard = ({ keywordData }: { keywordData: KeywordSuggestion }) => (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900">{keywordData.keyword}</h3>
        <Badge className={`
          ${keywordData.intent === 'commercial' ? 'bg-green-100 text-green-800' : ''}
          ${keywordData.intent === 'informational' ? 'bg-blue-100 text-blue-800' : ''}
          ${keywordData.intent === 'transactional' ? 'bg-purple-100 text-purple-800' : ''}
        `}>
          {keywordData.intent}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
        <div>
          <span className="text-gray-500">Volume:</span>
          <span className="ml-1 font-medium">{keywordData.volume?.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-gray-500">Difficulté:</span>
          <span className="ml-1 font-medium">{keywordData.difficulty}/100</span>
        </div>
        <div>
          <span className="text-gray-500">CPC:</span>
          <span className="ml-1 font-medium">{keywordData.cpc}€</span>
        </div>
        <div>
          <span className="text-gray-500">Opportunité:</span>
          <span className="ml-1 font-medium text-green-600">{keywordData.opportunity}%</span>
        </div>
      </div>
      
      {keywordData.suggestedTitle && (
        <div className="mt-3 p-2 bg-gray-50 rounded">
          <p className="text-xs text-gray-600 mb-1">Titre suggéré:</p>
          <p className="text-sm font-medium">{keywordData.suggestedTitle}</p>
        </div>
      )}
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* En-tête du générateur */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Générateur de Mots-Clés Professionnel
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Générez des mots-clés intelligents, analysez la concurrence, identifiez les opportunités 
            et créez du contenu optimisé SEO avec notre outil professionnel.
          </p>
        </div>
      </Card>

      {/* Formulaire de recherche */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-bold">Recherche de mots-clés</h2>
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

          {/* Bouton pour voir l'article - Toujours visible si un article existe */}
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
              <KeywordCard key={idx} keywordData={kw} />
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

export default ProfessionalKeywordGenerator;
