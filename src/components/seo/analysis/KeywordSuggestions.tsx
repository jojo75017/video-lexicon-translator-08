
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KeywordSuggestion } from '@/types/seo';
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, FileText, AlignLeft, BarChart } from "lucide-react";

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
  maxLengthDescription = 155,
  descriptionType = 'short'
}: KeywordSuggestionsProps) => {
  const [activeDescType, setActiveDescType] = useState<'short' | 'long'>(descriptionType);
  
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
    toast.success(`Description ${activeDescType === 'short' ? 'courte' : 'longue'} insérée`);
  };

  // Obtenir la bonne description en fonction du type actif
  const getDescription = (kw: KeywordSuggestion): string => {
    if (activeDescType === 'short') {
      return kw.suggestedShortDescription || kw.suggestedDescription || '';
    }
    return kw.suggestedLongDescription || kw.suggestedDescription || '';
  };

  return (
    <Card className="p-6 shadow-sm bg-white">
      <h3 className="text-lg font-medium mb-4">Suggestions pour "{generatedKeywords[0]?.keyword}"</h3>

      <Tabs defaultValue="titles" onValueChange={(value) => {
        if (value === 'descriptions') {
          setActiveDescType('short'); // Réinitialiser à court par défaut quand on va aux descriptions
        }
      }}>
        <TabsList className="mb-4">
          <TabsTrigger value="titles" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Titres
          </TabsTrigger>
          <TabsTrigger value="descriptions" className="flex items-center gap-2">
            <AlignLeft className="h-4 w-4" />
            Descriptions
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Métriques
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="titles">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Titres suggérés</h4>
            <div className="grid gap-3">
              {generatedKeywords.map((kw, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{kw.suggestedTitle || "Pas de titre disponible"}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Longueur: {kw.suggestedTitle?.length || 0}/{maxLength} caractères
                    </p>
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
        </TabsContent>
        
        <TabsContent value="descriptions">
          <div className="space-y-6">
            <Tabs defaultValue="short" onValueChange={(val) => setActiveDescType(val as 'short' | 'long')}>
              <TabsList className="mb-2">
                <TabsTrigger value="short">Description courte (155 car)</TabsTrigger>
                <TabsTrigger value="long">Description longue (500 car)</TabsTrigger>
              </TabsList>
              
              <TabsContent value="short">
                <div className="space-y-3">
                  <div className="grid gap-3">
                    {generatedKeywords.map((kw, idx) => {
                      const shortDescription = kw.suggestedShortDescription || kw.suggestedDescription;
                      
                      return (
                        <div key={`short-${idx}`} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                          <div className="flex-1">
                            <p className="text-sm line-clamp-2">{shortDescription || "Pas de description disponible"}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Longueur: {shortDescription?.length || 0}/155 caractères
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onInsertDescription && handleInsertDescription(shortDescription)}
                            disabled={!shortDescription || !onInsertDescription}
                            className="ml-3 whitespace-nowrap"
                          >
                            Utiliser
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="long">
                <div className="space-y-3">
                  <div className="grid gap-3">
                    {generatedKeywords.map((kw, idx) => {
                      const longDescription = kw.suggestedLongDescription || "";
                      
                      return (
                        <div key={`long-${idx}`} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-sm font-medium">{kw.keyword}</p>
                            <p className="text-xs text-gray-500">
                              {longDescription.length}/500 caractères
                            </p>
                          </div>
                          <p className="text-sm mb-3 line-clamp-3">{longDescription || "Pas de description longue disponible"}</p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onInsertDescription && handleInsertDescription(longDescription)}
                            disabled={!longDescription || !onInsertDescription}
                          >
                            Utiliser
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
        
        <TabsContent value="metrics">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Métriques des mots-clés</h4>
            <div className="grid gap-3">
              {generatedKeywords.map((kw, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium mb-2">{kw.keyword}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <BarChart className="h-3.5 w-3.5 text-blue-500" />
                      <span>Volume: {kw.searchVolume.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${
                        kw.difficulty < 30 ? 'bg-green-500' : 
                        kw.difficulty < 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></span>
                      <span>Difficulté: {kw.difficulty}/100</span>
                    </div>
                    <div>CPC: {kw.cpc.toFixed(2)} €</div>
                    <div>Concurrence: {Math.round(kw.competition * 100)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="pt-4 mt-4 border-t border-gray-200">
        <Button 
          onClick={onGenerateClick}
          variant="outline"
          className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700"
        >
          Générer plus de suggestions
        </Button>
      </div>
    </Card>
  );
};

export default KeywordSuggestions;
