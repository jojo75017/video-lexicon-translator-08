
import React from 'react';
import { KeywordSuggestion } from "@/types/seo";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SeoSuggestionsProps {
  keywordData: KeywordSuggestion;
  onInsertTitle: (title: string) => void;
  onInsertDescription: (description: string) => void;
}

const SeoSuggestions: React.FC<SeoSuggestionsProps> = ({ 
  keywordData,
  onInsertTitle,
  onInsertDescription
}) => {
  // Calcul précis des longueurs
  const titleLength = keywordData.suggestedTitle?.length || 0;
  const descriptionLength = keywordData.suggestedDescription?.length || 0;
  const longDescriptionLength = keywordData.suggestedLongDescription?.length || 0;
  
  return (
    <div className="space-y-4">
      <div className="bg-white p-3 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">Titre suggéré</h4>
          <div className="text-xs text-gray-500">
            {titleLength}/60 caractères
          </div>
        </div>
        <p className="my-2 text-sm">{keywordData.suggestedTitle}</p>
        <Button 
          onClick={() => onInsertTitle(keywordData.suggestedTitle || '')} 
          variant="outline" 
          size="sm"
        >
          Utiliser ce titre
        </Button>
      </div>

      <div>
        <Tabs defaultValue="short">
          <TabsList className="w-full mb-2">
            <TabsTrigger value="short" className="flex-1">Description courte</TabsTrigger>
            <TabsTrigger value="long" className="flex-1">Description longue</TabsTrigger>
          </TabsList>
          
          <TabsContent value="short">
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Description courte</h4>
                <div className="text-xs text-gray-500">
                  {descriptionLength}/155 caractères
                </div>
              </div>
              <p className="my-2 text-sm">{keywordData.suggestedDescription}</p>
              <Button 
                onClick={() => onInsertDescription(keywordData.suggestedDescription || '')} 
                variant="outline" 
                size="sm"
              >
                Utiliser cette description
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="long">
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Description longue</h4>
                <div className="text-xs text-gray-500">
                  {longDescriptionLength}/500 caractères
                </div>
              </div>
              <p className="my-2 text-sm line-clamp-3">{keywordData.suggestedLongDescription}</p>
              <Button 
                onClick={() => onInsertDescription(keywordData.suggestedLongDescription || '')} 
                variant="outline" 
                size="sm"
              >
                Utiliser cette description
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SeoSuggestions;
