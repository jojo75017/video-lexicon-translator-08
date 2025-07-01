
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, TrendingUp, Target, Search } from 'lucide-react';
import { toast } from 'sonner';
import { KeywordSuggestion } from '@/types/seo/Keyword';

interface SeoSuggestionsProps {
  keywords: KeywordSuggestion[];
  onSelectKeyword: (keyword: KeywordSuggestion) => void;
}

const SeoSuggestions: React.FC<SeoSuggestionsProps> = ({ keywords, onSelectKeyword }) => {
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copié dans le presse-papier`);
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'informational': return 'bg-blue-100 text-blue-800';
      case 'commercial': return 'bg-green-100 text-green-800';
      case 'transactional': return 'bg-purple-100 text-purple-800';
      case 'navigational': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return 'text-green-600';
    if (difficulty < 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Suggestions SEO ({keywords.length})</h3>
        <Badge variant="outline" className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          Optimisé IA
        </Badge>
      </div>

      {keywords.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune suggestion disponible</p>
            <p className="text-sm text-gray-400 mt-2">Générez des mots-clés pour voir les suggestions</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {keywords.map((keyword, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-lg mb-1">{keyword.keyword}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Vol: {keyword.volume?.toLocaleString() || 'N/A'}</span>
                      <span>•</span>
                      <span className={getDifficultyColor(keyword.difficulty || 0)}>
                        Diff: {keyword.difficulty || 0}%
                      </span>
                      <span>•</span>
                      <span>CPC: {keyword.cpc ? `${keyword.cpc}€` : 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getIntentColor(keyword.intent || 'informational')}>
                      {keyword.intent || 'informational'}
                    </Badge>
                    <Badge variant="outline">
                      {keyword.type || 'standard'}
                    </Badge>
                  </div>
                </div>

                {keyword.suggestedTitle && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-medium text-gray-700">Titre suggéré</label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(keyword.suggestedTitle!, 'Titre')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
                      <p className="text-sm font-medium">{keyword.suggestedTitle}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {keyword.suggestedTitle.length} caractères
                      </p>
                    </div>
                  </div>
                )}

                {keyword.suggestedDescription && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-medium text-gray-700">Meta description</label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(keyword.suggestedDescription!, 'Description')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="bg-green-50 p-3 rounded-md border-l-4 border-green-400">
                      <p className="text-sm">{keyword.suggestedDescription}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {keyword.suggestedDescription.length} caractères
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-4 text-sm">
                    {keyword.opportunity && (
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3 text-green-500" />
                        <span>Opportunité: {keyword.opportunity}%</span>
                      </div>
                    )}
                    {keyword.searchVolume && (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-blue-500" />
                        <span>Recherches: {keyword.searchVolume.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectKeyword(keyword)}
                  >
                    Utiliser ce mot-clé
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeoSuggestions;
