
import React from 'react';
import { DomainSuggestion } from '@/types/domain';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Share2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AiSuggestionsListProps {
  suggestions: DomainSuggestion[];
  categoryFilter: string;
  onChangeCategoryFilter: (value: string) => void;
}

export const AiSuggestionsList: React.FC<AiSuggestionsListProps> = ({ 
  suggestions, 
  categoryFilter, 
  onChangeCategoryFilter 
}) => {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 border-t border-green-200 pt-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-green-800 flex items-center">
          <Brain className="h-4 w-4 mr-2" />
          Suggestions générées par IA
        </h3>
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={onChangeCategoryFilter}>
            <SelectTrigger className="h-8 text-xs w-32">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="technology">Technologie</SelectItem>
              <SelectItem value="creative">Créatif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-2">
        {suggestions.map((suggestion, idx) => (
          <div 
            key={idx} 
            className="p-3 bg-white rounded-md border border-green-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-green-800">{suggestion.domain}</div>
                <div className="text-sm text-gray-600 mt-1">{suggestion.reason}</div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center mb-1">
                  <Badge className="bg-green-100 text-green-800 font-medium">
                    Score: {suggestion.score}/100
                  </Badge>
                </div>
                <div className="text-sm text-gray-500">{suggestion.price}</div>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="flex items-center text-xs">
                <span className="w-24">Pertinence:</span>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full" 
                    style={{ width: `${suggestion.categoryRelevance}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center text-xs">
                <span className="w-24">Mémorabilité:</span>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-purple-600 h-1.5 rounded-full" 
                    style={{ width: `${suggestion.memorability}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center text-xs">
                <span className="w-24">SEO:</span>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-green-600 h-1.5 rounded-full" 
                    style={{ width: `${suggestion.seoFriendliness}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center text-xs">
                <span className="w-24">Marque:</span>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-amber-600 h-1.5 rounded-full" 
                    style={{ width: `${suggestion.brandability}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-3 gap-2">
              <Button size="sm" variant="outline" className="h-7 text-xs px-2">
                <Share2 className="h-3 w-3 mr-1" />
                Partager
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs px-2">
                Réserver
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiSuggestionsList;
