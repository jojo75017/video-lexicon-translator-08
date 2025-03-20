
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag, TrendingUp, BarChart, FileText, AlignLeft } from 'lucide-react';
import { KeywordSuggestion } from '@/types/seo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

      <Tabs defaultValue="keywords">
        <TabsList className="mb-4">
          <TabsTrigger value="keywords">Mots-clés</TabsTrigger>
          <TabsTrigger value="titles">Suggestions de titres</TabsTrigger>
          <TabsTrigger value="descriptions">Meta descriptions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="keywords">
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
        </TabsContent>
        
        <TabsContent value="titles">
          <div className="grid gap-3">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">{suggestion.keyword}</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {suggestion.suggestedTitle?.length || 0}/60
                  </Badge>
                </div>
                
                <div className="p-3 bg-blue-50 rounded text-sm">
                  {suggestion.suggestedTitle || "Non disponible"}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="descriptions">
          <div className="grid gap-3">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlignLeft className="h-4 w-4 text-green-600" />
                  <span className="font-medium">{suggestion.keyword}</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {suggestion.suggestedDescription?.length || 0}/155
                  </Badge>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-sm">
                  {suggestion.suggestedDescription || "Non disponible"}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default KeywordSuggestions;
