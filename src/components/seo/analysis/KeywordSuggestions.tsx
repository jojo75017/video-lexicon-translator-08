
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KeywordSuggestion } from '@/types/seo';
import { toast } from "sonner";

export interface KeywordSuggestionsProps {
  generatedKeywords: KeywordSuggestion[];
  onGenerateClick: () => void;
  fieldValue: string;
  onInsert: (value: string) => void;
  maxLength: number;
  descriptionValue?: string;
  onInsertDescription?: (value: string) => void;
  maxLengthDescription?: number;
  descriptionType?: 'short' | 'long';
}

const KeywordSuggestions = ({ 
  generatedKeywords, 
  onGenerateClick,
  fieldValue,
  onInsert,
  maxLength,
  descriptionValue,
  onInsertDescription,
  maxLengthDescription,
  descriptionType = 'short'
}: KeywordSuggestionsProps) => {
  if (generatedKeywords.length === 0) return null;

  const handleInsertTitle = (title: string | undefined) => {
    if (!title) {
      toast.error("Pas de titre disponible");
      return;
    }
    onInsert(title);
    toast.success("Titre inséré");
  };

  const handleInsertDescription = (description: string | undefined) => {
    if (!onInsertDescription || !description) {
      toast.error("Pas de description disponible");
      return;
    }
    onInsertDescription(description);
    toast.success(`Description ${descriptionType} insérée`);
  };

  return (
    <Card className="p-6 shadow-sm bg-white">
      <h3 className="text-lg font-medium mb-4">Suggestions pour "{generatedKeywords[0]?.keyword}"</h3>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Titres suggérés</h4>
          <div className="grid gap-3">
            {generatedKeywords.map((kw, idx) => (
              <div key={idx} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{kw.suggestedTitle || "Pas de titre disponible"}</p>
                  <p className="text-xs text-gray-500 mt-1">Longueur: {kw.suggestedTitle?.length || 0}/{maxLength} caractères</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleInsertTitle(kw.suggestedTitle)}
                  disabled={!kw.suggestedTitle}
                  className="ml-3"
                >
                  Utiliser
                </Button>
              </div>
            ))}
          </div>
        </div>
        
        {onInsertDescription && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Descriptions suggérées</h4>
            <div className="grid gap-3">
              {generatedKeywords.map((kw, idx) => {
                const description = descriptionType === 'short' 
                  ? kw.suggestedShortDescription || kw.suggestedDescription 
                  : kw.suggestedLongDescription || kw.suggestedDescription;
                
                return (
                  <div key={idx} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                    <div className="flex-1">
                      <p className="text-sm line-clamp-2">{description || "Pas de description disponible"}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Longueur: {description?.length || 0}/{maxLengthDescription || 155} caractères
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleInsertDescription(description)}
                      disabled={!description}
                      className="ml-3 whitespace-nowrap"
                    >
                      Utiliser
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="pt-4 mt-4 border-t border-gray-200">
          <Button 
            onClick={onGenerateClick}
            variant="outline"
            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700"
          >
            Générer plus de suggestions
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default KeywordSuggestions;
