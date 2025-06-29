
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
  Copy,
  TreePine
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
          suggestedTitle: `Guide Complet - ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} 2025`,
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
          suggestedTitle: `Comment ${keyword} - Guide Pratique`,
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
          suggestedDescription: `Conseils pratiques pour ${keyword}. Guide complet avec exemples concrets.`
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
    
    // Générer un article spécifique au mot-clé saisi
    const article = `# ${userKeyword.charAt(0).toUpperCase() + userKeyword.slice(1)} : Guide Complet 2025

## Table des matières
1. [Introduction](#introduction)
2. [Pourquoi s'intéresser à ${userKeyword} ?](#pourquoi)
3. [Les meilleures options pour ${userKeyword}](#meilleures-options)
4. [Comment bien choisir ${userKeyword}](#comment-choisir)
5. [Conseils d'experts pour ${userKeyword}](#conseils-experts)
6. [Erreurs courantes à éviter](#erreurs-courantes)
7. [FAQ - Questions fréquentes](#faq)
8. [Tendances 2025 pour ${userKeyword}](#tendances)
9. [Conclusion](#conclusion)

## Introduction {#introduction}

Si vous cherchez des informations sur **${userKeyword}**, vous êtes au bon endroit ! Ce guide complet vous donnera toutes les clés pour bien comprendre et maîtriser ce sujet important.

${userKeyword} est devenu un élément incontournable qu'il faut absolument connaître en 2025. Que vous soyez débutant ou que vous souhaitiez approfondir vos connaissances, ce guide détaillé vous accompagnera pas à pas.

## Pourquoi s'intéresser à ${userKeyword} ? {#pourquoi}

### Les avantages principaux

Comprendre ${userKeyword} présente de nombreux avantages :

- **Gain de temps** : Une bonne maîtrise de ${userKeyword} vous permettra d'être plus efficace
- **Économies** : Évitez les erreurs coûteuses en connaissant les bonnes pratiques
- **Résultats optimaux** : Obtenez de meilleurs résultats en appliquant les bonnes méthodes
- **Confiance** : Prenez des décisions éclairées concernant ${userKeyword}

### Pourquoi maintenant ?

2025 est l'année parfaite pour s'intéresser à ${userKeyword} car :
- Les innovations récentes ont simplifié l'approche
- Les coûts sont devenus plus accessibles
- L'information de qualité est maintenant disponible
- La concurrence n'est pas encore trop forte

## Les meilleures options pour ${userKeyword} {#meilleures-options}

### Option 1 : L'approche classique
L'approche traditionnelle de ${userKeyword} reste une valeur sûre. Elle convient parfaitement aux débutants et offre :
- **Fiabilité** : Méthodes éprouvées et testées
- **Simplicité** : Facile à comprendre et à mettre en œuvre  
- **Coût maîtrisé** : Budget prévisible et raisonnable

### Option 2 : L'approche moderne
Les nouvelles approches de ${userKeyword} apportent innovation et efficacité :
- **Performance** : Résultats supérieurs aux méthodes classiques
- **Rapidité** : Mise en œuvre plus rapide
- **Flexibilité** : S'adapte à différents contextes

### Option 3 : L'approche hybride
Combiner les avantages des deux approches précédentes :
- **Équilibre** : Le meilleur des deux mondes
- **Personnalisation** : Adaptation selon vos besoins spécifiques
- **Évolutivité** : Possibilité de faire évoluer votre approche

## Comment bien choisir ${userKeyword} {#comment-choisir}

### Étape 1 : Définir vos besoins
Avant de vous lancer avec ${userKeyword}, posez-vous ces questions essentielles :
- Quel est votre objectif principal ?
- Quel budget pouvez-vous allouer ?
- Dans quel délai souhaitez-vous des résultats ?
- Avez-vous des contraintes particulières ?

### Étape 2 : Comparer les options
Ne vous précipitez pas sur la première option venue. Prenez le temps de comparer :
- **Fonctionnalités** : Vérifiez que tous vos besoins sont couverts
- **Prix** : Analysez le rapport qualité-prix
- **Support** : Assurez-vous d'avoir un accompagnement si nécessaire
- **Évolutivité** : Pensez à vos besoins futurs

### Étape 3 : Tester avant de s'engager
Chaque fois que c'est possible :
- Demandez une période d'essai
- Consultez les avis d'autres utilisateurs
- Vérifiez les références et études de cas
- Posez toutes vos questions avant de décider

## Conseils d'experts pour ${userKeyword} {#conseils-experts}

### Conseil n°1 : Commencez simple
Ne cherchez pas la complexité dès le départ. Maîtrisez d'abord les bases de ${userKeyword} avant d'explorer les fonctionnalités avancées.

### Conseil n°2 : Planifiez sur le long terme
${userKeyword} n'est pas une solution miracle instantanée. Prévoyez une approche progressive et des résultats sur plusieurs mois.

### Conseil n°3 : Restez informé
Le domaine de ${userKeyword} évolue rapidement. Suivez les actualités, participez à des formations et échangez avec d'autres praticiens.

### Conseil n°4 : Mesurez vos résultats
Mettez en place des indicateurs pour mesurer l'efficacité de votre approche de ${userKeyword}. Ajustez si nécessaire.

## FAQ - Questions fréquentes {#faq}

### Combien coûte ${userKeyword} ?
Le coût de ${userKeyword} varie considérablement selon vos besoins :
- **Solution de base** : 0 à 50€/mois
- **Solution intermédiaire** : 50 à 200€/mois  
- **Solution premium** : 200€ et plus/mois

### Combien de temps faut-il pour maîtriser ${userKeyword} ?
La courbe d'apprentissage dépend de votre niveau initial :
- **Bases** : 1 à 2 semaines
- **Niveau intermédiaire** : 1 à 3 mois
- **Maîtrise** : 6 mois à 1 an

### ${userKeyword} convient-il aux débutants ?
Absolument ! De nombreuses solutions sont spécialement conçues pour les débutants. Commencez par les options les plus simples et progressez à votre rythme.

### Quelles sont les erreurs les plus courantes avec ${userKeyword} ?
Les principales erreurs à éviter :
- Se précipiter sans planification
- Négliger la formation initiale
- Choisir une solution trop complexe au début
- Ne pas mesurer les résultats

## Tendances 2025 pour ${userKeyword} {#tendances}

### Intelligence artificielle
L'IA révolutionne ${userKeyword} avec :
- Automatisation des tâches répétitives
- Analyse prédictive avancée
- Personnalisation intelligente
- Optimisation en temps réel

### Mobilité et accessibilité
${userKeyword} devient de plus en plus mobile :
- Applications dédiées
- Interface responsive
- Accès hors ligne
- Synchronisation multi-appareils

### Durabilité et responsabilité
L'approche de ${userKeyword} évolue vers plus de durabilité :
- Solutions éco-responsables
- Transparence accrue
- Impact social positif
- Économie circulaire

## Conclusion {#conclusion}

${userKeyword} représente une opportunité fantastique en 2025. Avec les bonnes informations, une approche méthodique et de la patience, vous pouvez obtenir d'excellents résultats.

### Points clés à retenir :
1. **Commencez simple** et progressez étape par étape
2. **Planifiez sur le long terme** pour des résultats durables
3. **Restez informé** des évolutions du secteur
4. **Mesurez vos résultats** et ajustez si nécessaire
5. **N'hésitez pas à demander conseil** aux experts

### Prochaines étapes recommandées :
- Définissez clairement vos objectifs avec ${userKeyword}
- Établissez un budget réaliste
- Choisissez votre première solution
- Planifiez votre montée en compétences
- Commencez votre premier projet

N'attendez plus pour vous lancer avec ${userKeyword} ! Les meilleures opportunités sont souvent saisies par ceux qui agissent en premier.

---

*Guide rédigé le ${new Date().toLocaleDateString('fr-FR')} - Spécialiste ${userKeyword}*`;

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

      {hasGenerated && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <KeywordTabsNavigation 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            hasResults={hasGenerated} 
          />
          <KeywordTabsContent 
            activeTab={activeTab} 
            keywords={keywords} 
            keyword={keyword} 
          />
        </Tabs>
      )}

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
