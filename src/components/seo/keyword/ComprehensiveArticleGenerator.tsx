
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Download, 
  Copy, 
  Sparkles, 
  Zap,
  CheckCircle,
  Globe,
  Target,
  TrendingUp,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';
import { KeywordSuggestion } from '@/types/seo/Keyword';

interface ComprehensiveArticleGeneratorProps {
  keywords: KeywordSuggestion[];
  mainKeyword: string;
}

const ComprehensiveArticleGenerator: React.FC<ComprehensiveArticleGeneratorProps> = ({
  keywords,
  mainKeyword
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedArticle, setGeneratedArticle] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [articleStats, setArticleStats] = useState({
    wordCount: 0,
    readingTime: 0,
    seoScore: 0
  });

  const generateComprehensiveArticle = async () => {
    if (!mainKeyword) {
      toast.error('Veuillez d\'abord entrer un mot-clé principal');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate article generation with realistic content
      const article = `# ${mainKeyword.charAt(0).toUpperCase() + mainKeyword.slice(1)} : Guide Complet 2025

## Introduction

Découvrez tout ce que vous devez savoir sur ${mainKeyword}. Ce guide exhaustif vous accompagnera pas à pas pour maîtriser parfaitement ce sujet essentiel.

## Qu'est-ce que ${mainKeyword} ?

${mainKeyword} représente un élément fondamental dans son domaine. Pour bien comprendre son importance, il faut analyser ses différents aspects et applications pratiques.

### Les bases essentielles

Avant de vous lancer, voici les concepts de base à maîtriser :

- **Définition claire** : ${mainKeyword} se caractérise par ses spécificités uniques
- **Applications pratiques** : Utilisations concrètes dans différents contextes
- **Avantages principaux** : Bénéfices directs pour les utilisateurs
- **Considérations importantes** : Points d'attention à retenir

## Comment bien utiliser ${mainKeyword} ?

### Étape 1 : Préparation

La première étape consiste à bien préparer votre approche. Analysez vos besoins spécifiques et définissez vos objectifs clairement.

### Étape 2 : Mise en œuvre

Une fois la préparation terminée, passez à l'action avec une méthode structurée et progressive.

### Étape 3 : Optimisation

L'optimisation continue vous permettra d'obtenir les meilleurs résultats possibles avec ${mainKeyword}.

## Les meilleures pratiques

Pour maximiser l'efficacité de votre approche ${mainKeyword}, suivez ces recommandations d'experts :

1. **Planification rigoureuse** : Établissez un plan détaillé avant de commencer
2. **Suivi régulier** : Monitorer les résultats et ajustez si nécessaire
3. **Formation continue** : Restez informé des dernières évolutions
4. **Networking** : Échangez avec d'autres professionnels du domaine

## Erreurs courantes à éviter

Voici les principales erreurs que font les débutants avec ${mainKeyword} :

- Manque de préparation initiale
- Sous-estimation de la complexité
- Négligence du suivi et de l'analyse
- Manque de patience dans les résultats

## Outils et ressources recommandés

### Outils gratuits
- Outil A : Description et utilité
- Outil B : Fonctionnalités principales
- Outil C : Avantages spécifiques

### Solutions premium
- Solution avancée 1 : Pour les professionnels
- Solution avancée 2 : Fonctionnalités complètes
- Solution avancée 3 : Support expert inclus

## Études de cas et exemples concrets

### Cas d'étude #1 : Success Story
Une entreprise a réussi à améliorer ses résultats de 150% en appliquant correctement les principes de ${mainKeyword}.

### Cas d'étude #2 : Transformation digitale
Comment une organisation traditionnelle a modernisé son approche grâce à ${mainKeyword}.

## FAQ - Questions fréquentes

### Combien de temps faut-il pour maîtriser ${mainKeyword} ?
La maîtrise de ${mainKeyword} dépend de votre niveau initial et de votre investissement. Comptez généralement entre 3 à 6 mois pour une bonne compréhension.

### ${mainKeyword} est-il adapté aux débutants ?
Absolument ! Avec une approche progressive et les bonnes ressources, tout le monde peut apprendre ${mainKeyword} efficacement.

### Quels sont les coûts associés à ${mainKeyword} ?
Les coûts varient selon vos besoins. Des solutions gratuites existent pour débuter, avec des options premium pour des besoins avancés.

### Comment mesurer le succès avec ${mainKeyword} ?
Utilisez des indicateurs clés comme la progression, l'efficacité et les résultats obtenus par rapport à vos objectifs initiaux.

## Tendances et évolutions futures

Le domaine de ${mainKeyword} évolue rapidement. Voici les principales tendances à surveiller :

- **Intelligence artificielle** : Intégration croissante de l'IA
- **Automatisation** : Processus de plus en plus automatisés
- **Personnalisation** : Solutions sur-mesure pour chaque contexte
- **Durabilité** : Approches éco-responsables en développement

## Conclusion

${mainKeyword} représente une opportunité majeure pour quiconque souhaite progresser dans ce domaine. Avec les bonnes connaissances, les outils adaptés et une approche méthodique, vous pouvez obtenir d'excellents résultats.

N'hésitez pas à commencer dès aujourd'hui en appliquant les conseils de ce guide. La clé du succès réside dans la pratique régulière et l'amélioration continue.

---

*Article généré automatiquement - ${new Date().toLocaleDateString('fr-FR')}*`;

      setGeneratedArticle(article);
      setShowPreview(true);
      
      // Calculate stats
      const wordCount = article.split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
      const seoScore = Math.min(95, Math.floor(wordCount / 20) + 50); // Simple scoring
      
      setArticleStats({
        wordCount,
        readingTime,
        seoScore
      });
      
      toast.success('Article complet généré avec succès !', {
        description: `${wordCount} mots - ${readingTime} min de lecture`
      });
      
    } catch (error) {
      console.error('Erreur génération article:', error);
      toast.error('Erreur lors de la génération de l\'article');
    } finally {
      setIsGenerating(false);
    }
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
    a.download = `article-${mainKeyword.replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Article téléchargé');
  };

  // Convert markdown to HTML for preview
  const renderMarkdownAsHTML = (markdown: string) => {
    return markdown
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4 text-gray-900">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-3 text-gray-800 mt-6">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-medium mb-2 text-gray-700 mt-4">$1</h3>')
      .replace(/^\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
      .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-3">')
      .replace(/^(?!<[h|l])/gm, '<p class="mb-3">')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="space-y-6">
      {/* Header with action button */}
      <div className="text-center">
        <Button
          onClick={generateComprehensiveArticle}
          disabled={isGenerating}
          size="lg"
          className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-bold py-4 px-8 text-lg shadow-lg"
        >
          {isGenerating ? (
            <>
              <Zap className="mr-2 h-5 w-5 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-5 w-5" />
              🚀 Générer l'Article Complet
            </>
          )}
        </Button>
        
        {mainKeyword && (
          <p className="mt-3 text-sm text-gray-600">
            Article optimisé pour : <span className="font-semibold text-emerald-600">{mainKeyword}</span>
          </p>
        )}
      </div>

      {/* Stats and features preview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <Target className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
          <h3 className="font-semibold">1500+ Mots</h3>
          <p className="text-sm text-gray-600">Article détaillé</p>
        </Card>
        
        <Card className="text-center p-4">
          <Globe className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <h3 className="font-semibold">SEO Optimisé</h3>
          <p className="text-sm text-gray-600">Structure H1-H6</p>
        </Card>
        
        <Card className="text-center p-4">
          <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
          <h3 className="font-semibold">FAQ Incluse</h3>
          <p className="text-sm text-gray-600">Questions fréquentes</p>
        </Card>
        
        <Card className="text-center p-4">
          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <h3 className="font-semibold">Prêt à publier</h3>
          <p className="text-sm text-gray-600">Format markdown</p>
        </Card>
      </div>

      {/* Generated article display */}
      {generatedArticle && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold">Article généré</h2>
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {articleStats.wordCount} mots
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {articleStats.readingTime} min
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  SEO {articleStats.seoScore}/100
                </Badge>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-1" />
                    Code
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    Aperçu
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={copyArticle}>
                <Copy className="h-4 w-4 mr-1" />
                Copier
              </Button>
              <Button variant="outline" size="sm" onClick={downloadArticle}>
                <Download className="h-4 w-4 mr-1" />
                Télécharger
              </Button>
            </div>
          </div>
          
          <Separator className="mb-4" />
          
          <div className="max-h-96 overflow-y-auto border rounded-lg">
            {showPreview ? (
              <div 
                className="p-6 prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: renderMarkdownAsHTML(generatedArticle) 
                }}
              />
            ) : (
              <Textarea
                value={generatedArticle}
                onChange={(e) => setGeneratedArticle(e.target.value)}
                className="min-h-[300px] font-mono text-sm border-0 resize-none"
                placeholder="L'article généré apparaîtra ici..."
              />
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ComprehensiveArticleGenerator;
