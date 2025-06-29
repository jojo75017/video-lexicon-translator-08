
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
  Download
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

## Introduction

Si vous cherchez des informations sur **${userKeyword}**, vous êtes au bon endroit ! Ce guide complet vous donnera toutes les clés pour bien comprendre et maîtriser ${userKeyword}.

${userKeyword} est devenu un élément incontournable en 2025. Que vous soyez débutant ou que vous souhaitiez approfondir vos connaissances sur ${userKeyword}, ce guide détaillé vous accompagnera pas à pas.

## Pourquoi s'intéresser à ${userKeyword} ?

### Les avantages principaux de ${userKeyword}

Comprendre ${userKeyword} présente de nombreux avantages :

- **Efficacité** : Une bonne maîtrise de ${userKeyword} vous permettra d'être plus performant
- **Économies** : Évitez les erreurs coûteuses en connaissant les bonnes pratiques de ${userKeyword}
- **Résultats optimaux** : Obtenez de meilleurs résultats en appliquant les bonnes méthodes pour ${userKeyword}
- **Expertise** : Développez votre expertise sur ${userKeyword}

### Pourquoi ${userKeyword} maintenant ?

2025 est l'année parfaite pour s'intéresser à ${userKeyword} car :
- Les innovations récentes ont simplifié l'approche de ${userKeyword}
- Les ressources sur ${userKeyword} sont maintenant plus accessibles
- L'information de qualité sur ${userKeyword} est disponible
- C'est le moment idéal pour se lancer avec ${userKeyword}

## Comment bien choisir ${userKeyword}

### Étape 1 : Définir vos besoins pour ${userKeyword}
Avant de vous lancer avec ${userKeyword}, posez-vous ces questions :
- Quel est votre objectif principal avec ${userKeyword} ?
- Quel budget pouvez-vous allouer à ${userKeyword} ?
- Dans quel délai souhaitez-vous des résultats avec ${userKeyword} ?

### Étape 2 : Comparer les options de ${userKeyword}
Ne vous précipitez pas sur la première option de ${userKeyword}. Prenez le temps de comparer :
- **Fonctionnalités** : Vérifiez que ${userKeyword} couvre tous vos besoins
- **Prix** : Analysez le rapport qualité-prix de ${userKeyword}
- **Support** : Assurez-vous d'avoir un accompagnement pour ${userKeyword}

## Conseils d'experts pour ${userKeyword}

### Conseil n°1 : Commencez simple avec ${userKeyword}
Ne cherchez pas la complexité dès le départ avec ${userKeyword}. Maîtrisez d'abord les bases avant d'explorer les fonctionnalités avancées de ${userKeyword}.

### Conseil n°2 : Planifiez sur le long terme pour ${userKeyword}
${userKeyword} n'est pas une solution miracle instantanée. Prévoyez une approche progressive avec ${userKeyword} et des résultats sur plusieurs mois.

### Conseil n°3 : Restez informé sur ${userKeyword}
Le domaine de ${userKeyword} évolue rapidement. Suivez les actualités sur ${userKeyword}, participez à des formations et échangez avec d'autres praticiens de ${userKeyword}.

## Questions fréquentes sur ${userKeyword}

### Combien coûte ${userKeyword} ?
Le coût de ${userKeyword} varie considérablement selon vos besoins :
- **Solution de base pour ${userKeyword}** : 0 à 50€/mois
- **Solution intermédiaire pour ${userKeyword}** : 50 à 200€/mois  
- **Solution premium pour ${userKeyword}** : 200€ et plus/mois

### Combien de temps faut-il pour maîtriser ${userKeyword} ?
La courbe d'apprentissage de ${userKeyword} dépend de votre niveau initial :
- **Bases de ${userKeyword}** : 1 à 2 semaines
- **Niveau intermédiaire avec ${userKeyword}** : 1 à 3 mois
- **Maîtrise de ${userKeyword}** : 6 mois à 1 an

### ${userKeyword} convient-il aux débutants ?
Absolument ! De nombreuses solutions ${userKeyword} sont spécialement conçues pour les débutants. Commencez par les options les plus simples de ${userKeyword} et progressez à votre rythme.

## Conclusion sur ${userKeyword}

${userKeyword} représente une opportunité fantastique en 2025. Avec les bonnes informations, une approche méthodique et de la patience, vous pouvez obtenir d'excellents résultats avec ${userKeyword}.

### Points clés à retenir sur ${userKeyword} :
1. **Commencez simple** avec ${userKeyword} et progressez étape par étape
2. **Planifiez sur le long terme** pour des résultats durables avec ${userKeyword}
3. **Restez informé** des évolutions de ${userKeyword}
4. **Mesurez vos résultats** avec ${userKeyword} et ajustez si nécessaire
5. **N'hésitez pas à demander conseil** aux experts de ${userKeyword}

N'attendez plus pour vous lancer avec ${userKeyword} ! Les meilleures opportunités sont souvent saisies par ceux qui agissent en premier.

---

*Guide ${userKeyword} rédigé le ${new Date().toLocaleDateString('fr-FR')}*`;

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
            Générez des mots-clés intelligents avec l'IA. Obtenez des suggestions sémantiques, 
            longue traîne, analyses approfondies, générateur de contenu et optimisation complète.
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
                  <div className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
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
