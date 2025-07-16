
import React from 'react';
import { KeywordSuggestion } from "@/types/seo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, TrendingUp, Target, Eye } from "lucide-react";

export interface SeoSuggestionsProps {
  keywordData: KeywordSuggestion;
  onInsertTitle?: (title: string) => void;
  onInsertDescription?: (description: string) => void;
}

const SeoSuggestions: React.FC<SeoSuggestionsProps> = ({
  keywordData,
  onInsertTitle,
  onInsertDescription
}) => {
  if (!keywordData) {
    return (
      <div className="text-center text-gray-500 py-8">
        <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Sélectionnez un mot-clé pour voir les suggestions SEO</p>
      </div>
    );
  }

  const handleInsertTitle = () => {
    if (keywordData.suggestedTitle && onInsertTitle) {
      onInsertTitle(keywordData.suggestedTitle);
    }
  };

  const handleInsertDescription = () => {
    if (keywordData.suggestedDescription && onInsertDescription) {
      onInsertDescription(keywordData.suggestedDescription);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <h3 className="font-semibold">Suggestions SEO pour "{keywordData.keyword}"</h3>
      </div>

      {/* Métriques du mot-clé */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">{keywordData.searchVolume || 'N/A'}</div>
          <div className="text-xs text-gray-500">Volume</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">{keywordData.relevance}%</div>
          <div className="text-xs text-gray-500">Pertinence</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-orange-600">{keywordData.difficulty || 'N/A'}</div>
          <div className="text-xs text-gray-500">Difficulté</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-purple-600">{keywordData.cpc?.toFixed(2) || 'N/A'}€</div>
          <div className="text-xs text-gray-500">CPC</div>
        </div>
      </div>

      {/* Titre suggéré */}
      {keywordData.suggestedTitle && (
        <Card className="p-4 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-blue-800">Titre suggéré</h4>
            <Badge variant="outline" className="bg-blue-50">
              {keywordData.suggestedTitle.length}/60
            </Badge>
          </div>
          <div className="bg-blue-50 p-3 rounded mb-3">
            <div className="text-blue-900 font-medium">{keywordData.suggestedTitle}</div>
          </div>
          {onInsertTitle && (
            <Button 
              onClick={handleInsertTitle}
              size="sm" 
              className="w-full"
            >
              Insérer ce titre
            </Button>
          )}
        </Card>
      )}

      {/* Description suggérée */}
      {keywordData.suggestedDescription && (
        <Card className="p-4 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-green-800">Meta description suggérée</h4>
            <Badge variant="outline" className="bg-green-50">
              {keywordData.suggestedDescription.length}/155
            </Badge>
          </div>
          <div className="bg-green-50 p-3 rounded mb-3">
            <div className="text-green-900 text-sm">{keywordData.suggestedDescription}</div>
          </div>
          {onInsertDescription && (
            <Button 
              onClick={handleInsertDescription}
              size="sm" 
              className="w-full"
            >
              Insérer cette description
            </Button>
          )}
        </Card>
      )}

      {/* Aperçu SERP */}
      <Card className="p-4 bg-gray-50">
        <div className="flex items-center gap-2 mb-3">
          <Eye className="h-4 w-4 text-gray-600" />
          <h4 className="font-medium text-gray-800">Aperçu dans les résultats Google</h4>
        </div>
        <div className="bg-white p-4 rounded border">
          <div className="text-blue-600 text-lg font-medium hover:underline cursor-pointer mb-1">
            {keywordData.suggestedTitle || keywordData.keyword}
          </div>
          <div className="text-green-700 text-sm mb-2">
            https://votre-site.com/page-optimisee
          </div>
          <div className="text-gray-700 text-sm">
            {keywordData.suggestedDescription || `Découvrez tout sur ${keywordData.keyword}...`}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SeoSuggestions;
