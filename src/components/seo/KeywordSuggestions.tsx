
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag, TrendingUp, BarChart } from 'lucide-react';

interface KeywordSuggestion {
  keyword: string;
  relevance: number;
  searchVolume?: number;
  difficulty?: number;
}

interface KeywordSuggestionsProps {
  suggestions: KeywordSuggestion[];
}

const KeywordSuggestions = ({ suggestions }: KeywordSuggestionsProps) => {
  if (suggestions.length === 0) return null;
  
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Tag className="h-5 w-5 text-blue-500" />
        Suggestions de Mots-clés
      </h3>

      <div className="grid gap-3">
        {suggestions.map((suggestion, index) => (
          <div 
            key={index}
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{suggestion.keyword}</span>
              <Badge 
                variant="secondary"
                className={`${
                  suggestion.relevance >= 80 ? 'bg-green-100 text-green-800' :
                  suggestion.relevance >= 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}
              >
                {suggestion.relevance}% pertinent
              </Badge>
            </div>
            
            <div className="flex gap-4 text-sm text-gray-600">
              {suggestion.searchVolume && (
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  {suggestion.searchVolume} recherches/mois
                </div>
              )}
              {suggestion.difficulty && (
                <div className="flex items-center gap-1">
                  <BarChart className="h-4 w-4" />
                  Difficulté: {suggestion.difficulty}/100
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default KeywordSuggestions;
