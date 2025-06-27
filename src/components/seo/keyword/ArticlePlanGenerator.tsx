
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Lightbulb, Clock, Target, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { KeywordSuggestion } from "@/types/seo/Keyword";

interface ArticlePlan {
  title: string;
  introduction: string;
  sections: {
    title: string;
    subsections: string[];
    keywords: string[];
  }[];
  conclusion: string;
  faq: string[];
  estimatedWordCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface ArticlePlanGeneratorProps {
  keywords: KeywordSuggestion[];
  mainKeyword: string;
}

const ArticlePlanGenerator: React.FC<ArticlePlanGeneratorProps> = ({ keywords, mainKeyword }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [articlePlan, setArticlePlan] = useState<ArticlePlan | null>(null);

  const generateArticlePlan = async () => {
    if (!mainKeyword) {
      toast.error("Veuillez d'abord générer des mots-clés");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simuler une génération de plan d'article
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const plan: ArticlePlan = {
        title: `Guide complet : ${mainKeyword}`,
        introduction: `Introduction complète sur ${mainKeyword} avec définition et contexte`,
        sections: [
          {
            title: `Qu'est-ce que ${mainKeyword} ?`,
            subsections: ["Définition", "Historique", "Importance"],
            keywords: keywords.slice(0, 3).map(k => k.keyword)
          },
          {
            title: `Comment ${mainKeyword} fonctionne`,
            subsections: ["Processus étape par étape", "Méthodes", "Outils nécessaires"],
            keywords: keywords.slice(3, 6).map(k => k.keyword)
          },
          {
            title: `Avantages et inconvénients de ${mainKeyword}`,
            subsections: ["Points positifs", "Limitations", "Comparaisons"],
            keywords: keywords.slice(6, 9).map(k => k.keyword)
          },
          {
            title: `Conseils et bonnes pratiques pour ${mainKeyword}`,
            subsections: ["Recommandations d'experts", "Erreurs à éviter", "Optimisations"],
            keywords: keywords.slice(9, 12).map(k => k.keyword)
          }
        ],
        conclusion: `Résumé des points clés et prochaines étapes pour ${mainKeyword}`,
        faq: [
          `Combien coûte ${mainKeyword} ?`,
          `${mainKeyword} est-il adapté aux débutants ?`,
          `Quels sont les meilleurs outils pour ${mainKeyword} ?`,
          `Comment mesurer le succès de ${mainKeyword} ?`
        ],
        estimatedWordCount: 2500,
        difficulty: 'medium'
      };
      
      setArticlePlan(plan);
      toast.success("Plan d'article généré avec succès");
    } catch (error) {
      console.error('Erreur lors de la génération du plan:', error);
      toast.error("Erreur lors de la génération du plan d'article");
    } finally {
      setIsGenerating(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          Générateur de plan d'article
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!articlePlan && (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Générer un plan d'article SEO</h3>
            <p className="text-gray-600 mb-4">
              Créez un plan d'article optimisé basé sur vos mots-clés pour "{mainKeyword}"
            </p>
            <Button onClick={generateArticlePlan} disabled={isGenerating || !mainKeyword}>
              {isGenerating ? 'Génération en cours...' : 'Générer le plan d\'article'}
            </Button>
          </div>
        )}

        {articlePlan && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">{articlePlan.title}</h3>
              <div className="flex items-center gap-2">
                <Badge className={getDifficultyColor(articlePlan.difficulty)}>
                  {articlePlan.difficulty}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {articlePlan.estimatedWordCount} mots
                </Badge>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Introduction
              </h4>
              <p className="text-blue-700">{articlePlan.introduction}</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-800">Plan détaillé :</h4>
              {articlePlan.sections.map((section, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h5 className="font-medium mb-3 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {index + 1}
                    </span>
                    {section.title}
                  </h5>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Sous-sections :</p>
                      <ul className="text-sm space-y-1">
                        {section.subsections.map((subsection, subIndex) => (
                          <li key={subIndex} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                            {subsection}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Mots-clés à intégrer :</p>
                      <div className="flex flex-wrap gap-1">
                        {section.keywords.map((keyword, keyIndex) => (
                          <Badge key={keyIndex} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Conclusion
              </h4>
              <p className="text-green-700">{articlePlan.conclusion}</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-3">FAQ suggérée :</h4>
              <div className="space-y-2">
                {articlePlan.faq.map((question, index) => (
                  <div key={index} className="text-purple-700 text-sm">
                    <span className="font-medium">Q{index + 1}:</span> {question}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <Button onClick={generateArticlePlan} variant="outline">
                Regénérer le plan
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ArticlePlanGenerator;
