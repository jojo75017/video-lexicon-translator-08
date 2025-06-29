
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle } from 'lucide-react';
import { KeywordSuggestion } from '@/types/seo/Keyword';

interface ArticlePlanGeneratorProps {
  keywords: KeywordSuggestion[];
  mainKeyword: string;
}

const ArticlePlanGenerator: React.FC<ArticlePlanGeneratorProps> = ({ keywords, mainKeyword }) => {
  const generateArticlePlan = () => {
    if (!mainKeyword) return [];
    
    return [
      `Introduction : Qu'est-ce que ${mainKeyword} ?`,
      `Pourquoi ${mainKeyword} est important en 2025`,
      `Les meilleures options pour ${mainKeyword}`,
      `Comment choisir ${mainKeyword}`,
      `Conseils d'experts pour ${mainKeyword}`,
      `Erreurs à éviter avec ${mainKeyword}`,
      `FAQ sur ${mainKeyword}`,
      `Conclusion et recommandations`
    ];
  };

  const articlePlan = generateArticlePlan();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-orange-500" />
          Plan d'article optimisé
        </CardTitle>
      </CardHeader>
      <CardContent>
        {articlePlan.length > 0 ? (
          <div className="space-y-3">
            <p className="text-gray-600 mb-4">
              Plan d'article optimisé pour "{mainKeyword}"
            </p>
            <ol className="space-y-2">
              {articlePlan.map((section, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-sm">{section}</span>
                </li>
              ))}
            </ol>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 Ce plan est optimisé pour {keywords.length} mots-clés associés
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Générez d'abord des mots-clés pour créer un plan d'article.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ArticlePlanGenerator;
