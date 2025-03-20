
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, AlignLeft, Tag, Copy, Check, PenTool, Sparkles, Search } from 'lucide-react';
import { toast } from "sonner";
import { KeywordSuggestion } from '@/types/seo';
import { analyzeKeywords, generateKeywordSuggestions } from '@/utils/seo/keywordAnalyzer';

const SuggestionsTabContent = () => {
  const [keyword, setKeyword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<KeywordSuggestion[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerateSuggestions = () => {
    setIsLoading(true);
    
    // Simulation d'une analyse pour générer des suggestions
    setTimeout(() => {
      try {
        const mockContent = "Le référencement naturel (SEO) est l'ensemble des techniques qui permettent d'améliorer la position d'un site web dans les résultats des moteurs de recherche. L'objectif est d'optimiser le site pour qu'il apparaisse dans les premiers résultats pour des mots-clés pertinents. Cela comprend l'optimisation technique, l'optimisation du contenu et la création de liens.";
        const keywords = analyzeKeywords(mockContent + (keyword ? ` ${keyword}` : ''));
        const generatedSuggestions = generateKeywordSuggestions(keywords);
        
        setSuggestions(generatedSuggestions);
        toast.success("Suggestions générées avec succès", {
          description: `${generatedSuggestions.length} suggestions ont été créées`
        });
      } catch (error) {
        console.error("Erreur lors de la génération des suggestions:", error);
        toast.error("Erreur lors de la génération des suggestions");
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copié dans le presse-papiers!");
    
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">Suggestions de contenu SEO</h2>
      <p className="text-muted-foreground">
        Obtenez des suggestions pour optimiser vos titres (balises title) et descriptions (meta descriptions) 
        pour améliorer votre référencement.
      </p>
      
      <Card className="border border-gray-200 rounded-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <PenTool className="h-4 w-4 text-amber-600" />
            Générateur de suggestions SEO
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6">
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
                  Mot-clé principal (optionnel)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="keyword"
                    id="keyword"
                    className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Ex: référencement local"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-end">
                <Button
                  onClick={handleGenerateSuggestions}
                  className="bg-amber-600 text-white hover:bg-amber-700 transition-colors flex items-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading && <span className="animate-spin">⏳</span>}
                  <Sparkles className="h-4 w-4" />
                  Générer des suggestions
                </Button>
              </div>
            </div>
          </div>
          
          {suggestions.length > 0 && (
            <Tabs defaultValue="titles" className="mt-6">
              <TabsList className="mb-4 grid grid-cols-3 w-full">
                <TabsTrigger value="titles" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Balises Title (60 car.)
                </TabsTrigger>
                <TabsTrigger value="descriptions" className="flex items-center gap-2">
                  <AlignLeft className="h-4 w-4" />
                  Meta Descriptions (155 car.)
                </TabsTrigger>
                <TabsTrigger value="keywords" className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Mots-clés
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="titles">
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="bg-amber-50 p-3 rounded-md border border-amber-100">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4 text-amber-600" />
                        <span className="font-medium">{suggestion.keyword}</span>
                        <Badge variant="outline" className="ml-auto text-xs">
                          {suggestion.suggestedTitle?.length || 0}/60
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => copyToClipboard(suggestion.suggestedTitle || "", index)}
                        >
                          {copiedIndex === index ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <div className="p-3 bg-white rounded border border-amber-200 text-sm mt-1 font-medium">
                        {suggestion.suggestedTitle || "Non disponible"}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="descriptions">
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="bg-green-50 p-3 rounded-md border border-green-100">
                      <div className="flex items-center gap-2 mb-1">
                        <AlignLeft className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{suggestion.keyword}</span>
                        <Badge variant="outline" className="ml-auto text-xs">
                          {suggestion.suggestedDescription?.length || 0}/155
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => copyToClipboard(suggestion.suggestedDescription || "", index)}
                        >
                          {copiedIndex === index ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <div className="p-3 bg-white rounded border border-green-200 text-sm mt-1">
                        {suggestion.suggestedDescription || "Non disponible"}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="keywords">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="flex justify-between bg-blue-50 p-3 rounded-md border border-blue-100">
                      <span className="font-medium">{suggestion.keyword}</span>
                      <span className="text-gray-500 text-sm bg-white px-2 py-1 rounded-full border border-gray-200">
                        {suggestion.searchVolume} recherches/mois
                      </span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          {suggestions.length === 0 && (
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <Sparkles className="h-12 w-12 mx-auto text-amber-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune suggestion générée</h3>
              <p className="text-gray-500 mb-4">
                Cliquez sur le bouton "Générer des suggestions" pour créer des suggestions
                de titres et de descriptions optimisées pour le SEO.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SuggestionsTabContent;
