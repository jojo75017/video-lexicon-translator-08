import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KeywordSuggestion } from "@/types/seo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessagesSquare, Badge } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KeywordMetrics from './keyword/KeywordMetrics';
import KeywordTrends from './keyword/KeywordTrends';
import SeoSuggestions from './keyword/SeoSuggestions';

interface KeywordStepProps {
  selectedKeyword: string;
  keywords: KeywordSuggestion[];
  onKeywordChange: (value: string) => void;
  onQuoraClick?: () => void;
}

const KeywordStep: React.FC<KeywordStepProps> = ({
  selectedKeyword,
  keywords,
  onKeywordChange,
  onQuoraClick,
}) => {
  const [activeTab, setActiveTab] = useState("trends");
  const selectedKeywordData = keywords.find(kw => kw.keyword === selectedKeyword);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold">Recherche de mots-clés rentables</Label>
        {onQuoraClick && (
          <Button
            onClick={onQuoraClick}
            className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white border-none gap-2 shadow-md transition-all duration-200 hover:scale-105"
          >
            <MessagesSquare className="h-4 w-4" />
            Réponses Quora
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-4">
          <Label>Sélectionnez un mot-clé</Label>
          <Select value={selectedKeyword} onValueChange={onKeywordChange}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Choisissez un mot-clé" />
            </SelectTrigger>
            <SelectContent>
              {keywords.map((kw, index) => (
                <SelectItem key={index} value={kw.keyword}>
                  {kw.keyword} (Volume: {kw.searchVolume || 0})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedKeywordData && <KeywordMetrics keywordData={selectedKeywordData} />}
        </Card>

        <Card className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="trends" className="flex-1">Évolution du volume</TabsTrigger>
              <TabsTrigger value="suggestions" className="flex-1">Suggestions SEO</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trends">
              <KeywordTrends />
            </TabsContent>
            
            <TabsContent value="suggestions">
              {selectedKeywordData?.suggestedTitle && selectedKeywordData?.suggestedDescription && (
                <SeoSuggestions keywordData={selectedKeywordData} />
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      
      {/* Section de débogage - Affichons toutes les suggestions */}
      <Card className="p-4 mt-4 bg-gray-50">
        <h3 className="font-medium mb-3">Toutes les suggestions disponibles</h3>
        <div className="grid gap-3 max-h-60 overflow-y-auto">
          {keywords.map((kw, index) => (
            <div key={index} className="p-3 bg-white rounded border border-gray-200">
              <div className="flex justify-between mb-1">
                <span className="font-semibold">{kw.keyword}</span>
                <Badge variant="outline">{kw.relevance}%</Badge>
              </div>
              <div className="text-sm space-y-1 mt-2">
                <div>
                  <span className="font-medium text-blue-600">Title: </span>
                  <span>{kw.suggestedTitle || "Non disponible"}</span>
                </div>
                <div>
                  <span className="font-medium text-green-600">Description: </span>
                  <span>{kw.suggestedDescription || "Non disponible"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default KeywordStep;
