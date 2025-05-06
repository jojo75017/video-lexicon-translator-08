
import React, { useState } from 'react';
import { KeywordSuggestion } from "@/types/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SeoSuggestions from '@/components/seo/writer/keyword/SeoSuggestions';

export interface KeywordSuggestionsProps {
  generatedKeywords: KeywordSuggestion[];
  onGenerateClick?: () => void;
  fieldValue?: string;
  onInsert?: (value: string) => void;
  maxLength?: number;
  descriptionValue?: string;
  onInsertDescription?: (value: string) => void;
  maxLengthDescription?: number;
}

const KeywordSuggestions: React.FC<KeywordSuggestionsProps> = ({
  generatedKeywords,
  onGenerateClick,
  fieldValue = "",
  onInsert = () => {},
  maxLength = 60,
  descriptionValue = "",
  onInsertDescription = () => {},
  maxLengthDescription = 155
}) => {
  const [selectedKeyword, setSelectedKeyword] = useState<number>(0);

  if (!generatedKeywords || generatedKeywords.length === 0) {
    return null;
  }

  const handleInsertTitle = (title: string) => {
    if (onInsert) {
      onInsert(title);
    }
  };

  const handleInsertDescription = (description: string) => {
    if (onInsertDescription) {
      onInsertDescription(description);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Suggestions de mots-clés</h3>
          {onGenerateClick && (
            <Button 
              variant="outline" 
              onClick={onGenerateClick}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Générer plus
            </Button>
          )}
        </div>

        <Tabs defaultValue="keywords" className="mb-6">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="keywords">Mots-clés</TabsTrigger>
            <TabsTrigger value="preview">Aperçus</TabsTrigger>
          </TabsList>
          
          <TabsContent value="keywords" className="pt-4">
            <div className="grid gap-3 mb-6">
              {generatedKeywords.map((keyword, index) => (
                <div 
                  key={index}
                  className={`border p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedKeyword === index ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedKeyword(index)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{keyword.keyword}</span>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="bg-blue-50">Vol: {keyword.searchVolume || 'N/A'}</Badge>
                      <Badge 
                        variant="outline" 
                        className={`${
                          keyword.difficulty < 30 ? 'bg-green-50' : 
                          keyword.difficulty < 70 ? 'bg-yellow-50' : 'bg-red-50'
                        }`}
                      >
                        Diff: {keyword.difficulty || 'N/A'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Pertinence: {keyword.relevance}%</span>
                    {keyword.cpc !== undefined && (
                      <span>CPC: {keyword.cpc.toFixed(2)}€</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="pt-4">
            {generatedKeywords[selectedKeyword] && (
              <SeoSuggestions 
                keywordData={generatedKeywords[selectedKeyword]}
                onInsertTitle={handleInsertTitle}
                onInsertDescription={handleInsertDescription}
              />
            )}
          </TabsContent>
        </Tabs>

        {generatedKeywords && generatedKeywords.length > 0 && (
          <div className="text-sm text-gray-500 pt-2">
            <p className="mb-1">Mots-clés suggérés basés sur votre recherche. Cliquez pour voir les détails et les recommandations.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KeywordSuggestions;
