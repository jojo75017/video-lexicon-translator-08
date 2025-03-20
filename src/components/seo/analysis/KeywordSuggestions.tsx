
import React from 'react';
import { KeywordSuggestion } from '@/types/seo';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, AlignLeft, Tag, TrendingUp, BarChart2 } from 'lucide-react';

interface KeywordSuggestionsProps {
  generatedKeywords: KeywordSuggestion[];
  onGenerateClick?: () => void;
}

const KeywordSuggestions: React.FC<KeywordSuggestionsProps> = ({
  generatedKeywords,
  onGenerateClick
}) => {
  return (
    <Card className="border border-gray-200 rounded-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Tag className="h-4 w-4 text-blue-600" />
          Suggestions de mots-clés
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Obtenez des suggestions de mots-clés pertinents pour votre site.
          </p>
          
          <Button
            onClick={onGenerateClick}
            className="bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            Générer des suggestions
          </Button>
        </div>
        
        {generatedKeywords.length > 0 && (
          <Tabs defaultValue="keywords" className="mt-4">
            <TabsList className="mb-4">
              <TabsTrigger value="keywords">Mots-clés</TabsTrigger>
              <TabsTrigger value="titles">Suggestions de titres</TabsTrigger>
              <TabsTrigger value="descriptions">Meta descriptions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="keywords">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {generatedKeywords.map((keyword, index) => (
                  <div key={index} className="flex justify-between bg-gray-50 p-2 rounded-md">
                    <span>{keyword.keyword}</span>
                    <span className="text-gray-500 text-sm">
                      {keyword.searchVolume} recherches
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="titles">
              <div className="space-y-3">
                {generatedKeywords.map((keyword, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{keyword.keyword}</span>
                      <Badge variant="outline" className="ml-auto text-xs">
                        {keyword.suggestedTitle?.length || 0}/60
                      </Badge>
                    </div>
                    <div className="p-2 bg-blue-50 rounded text-sm mt-1">
                      {keyword.suggestedTitle || "Non disponible"}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="descriptions">
              <div className="space-y-3">
                {generatedKeywords.map((keyword, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center gap-2 mb-1">
                      <AlignLeft className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{keyword.keyword}</span>
                      <Badge variant="outline" className="ml-auto text-xs">
                        {keyword.suggestedDescription?.length || 0}/155
                      </Badge>
                    </div>
                    <div className="p-2 bg-green-50 rounded text-sm mt-1">
                      {keyword.suggestedDescription || "Non disponible"}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default KeywordSuggestions;
