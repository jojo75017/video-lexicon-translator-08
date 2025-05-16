
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { KeywordSuggestion } from "@/types/seo/Keyword";
import { PerplexityService } from "@/services/perplexityService";
import { Sparkles, BarChart3, Loader2, Search, Settings } from "lucide-react";
import { toast } from "sonner";

const KeywordGenerator: React.FC = () => {
  const [keyword, setKeyword] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem("perplexityKey") || "");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("standard");
  const [standardKeywords, setStandardKeywords] = useState<KeywordSuggestion[]>([]);
  const [longTailKeywords, setLongTailKeywords] = useState<KeywordSuggestion[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [showApiConfig, setShowApiConfig] = useState<boolean>(!localStorage.getItem("perplexityKey"));
  
  // Handle API key validation
  const validateApiKey = async () => {
    if (!apiKey) {
      toast.error("Veuillez entrer une clé API Perplexity");
      return false;
    }
    
    const service = PerplexityService.createService(apiKey);
    const isValid = await service.validateApiKey();
    
    if (isValid) {
      localStorage.setItem("perplexityKey", apiKey);
      setShowApiConfig(false);
    }
    
    return isValid;
  };
  
  // Generate keywords using Perplexity AI
  const generateKeywords = async () => {
    if (!keyword) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }
    
    if (!localStorage.getItem("perplexityKey")) {
      setShowApiConfig(true);
      toast.error("Veuillez configurer votre clé API Perplexity");
      return;
    }
    
    setIsGenerating(true);
    const service = PerplexityService.createService(apiKey || localStorage.getItem("perplexityKey") || "");
    
    try {
      // Generate regular keywords
      const standardResults = await service.getKeywordSuggestions(keyword);
      setStandardKeywords(standardResults);
      
      // Generate long-tail keywords
      const longTailResults = await service.getLongTailKeywords(keyword);
      setLongTailKeywords(longTailResults);
      
      toast.success(`${standardResults.length + longTailResults.length} suggestions générées au total`);
    } catch (error) {
      console.error("Erreur lors de la génération de mots-clés:", error);
      toast.error("Échec de la génération des mots-clés");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const toggleKeywordSelection = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(selectedKeywords.filter(k => k !== keyword));
    } else {
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
  };
  
  const exportSelectedKeywords = () => {
    if (selectedKeywords.length === 0) {
      toast.error("Aucun mot-clé sélectionné pour l'export");
      return;
    }
    
    const keywordsToExport = [...standardKeywords, ...longTailKeywords]
      .filter(k => selectedKeywords.includes(k.keyword));
    
    const csv = [
      ["Mot-clé", "Volume", "Difficulté", "CPC", "Compétition"].join(","),
      ...keywordsToExport.map(k => [
        `"${k.keyword}"`,
        k.volume,
        k.difficulty,
        k.cpc,
        k.competition
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `mots-cles-${keyword.replace(/\s+/g, "-")}.csv`);
    link.click();
    
    toast.success(`${keywordsToExport.length} mots-clés exportés`);
  };
  
  // Render keyword card
  const renderKeywordCard = (keywordData: KeywordSuggestion, index: number) => {
    const isSelected = selectedKeywords.includes(keywordData.keyword);
    
    return (
      <Card 
        key={index}
        className={`p-4 cursor-pointer transition-all ${
          isSelected ? "border-blue-500 bg-blue-50" : "hover:border-gray-400"
        }`}
        onClick={() => toggleKeywordSelection(keywordData.keyword)}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-blue-900">{keywordData.keyword}</h3>
          {isSelected && <div className="w-4 h-4 bg-blue-500 rounded-full"></div>}
        </div>
        
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div>
            <p className="text-gray-500">Volume</p>
            <p className="font-semibold">{keywordData.volume}</p>
          </div>
          <div>
            <p className="text-gray-500">Difficulté</p>
            <div className="flex items-center gap-1">
              <div className="w-10 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    keywordData.difficulty < 30 ? "bg-green-500" : 
                    keywordData.difficulty < 60 ? "bg-yellow-500" : "bg-red-500"
                  }`} 
                  style={{width: `${keywordData.difficulty}%`}}
                ></div>
              </div>
              <span>{keywordData.difficulty}</span>
            </div>
          </div>
          <div>
            <p className="text-gray-500">CPC</p>
            <p className="font-semibold">{keywordData.cpc.toFixed(2)} €</p>
          </div>
          <div>
            <p className="text-gray-500">Compétition</p>
            <div className="flex items-center gap-1">
              <div className="w-10 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full" 
                  style={{width: `${keywordData.competition * 100}%`}}
                ></div>
              </div>
              <span>{Math.round(keywordData.competition * 100)}%</span>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* API Configuration Section */}
      {showApiConfig && (
        <Card className="p-6 border-blue-100 bg-blue-50">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Configuration de Perplexity AI</h2>
          <p className="text-blue-800 mb-4">
            Ce générateur de mots-clés utilise l'API Perplexity AI pour générer des suggestions de mots-clés précises et contextuelles.
            Veuillez entrer votre clé API ci-dessous pour commencer.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Clé API Perplexity</label>
              <Input
                type="password"
                placeholder="pplx-xxxxxxxxxxxxxxxxxxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-blue-700 mt-1">
                Obtenez votre clé sur{" "}
                <a 
                  href="https://www.perplexity.ai/settings/api"
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="underline hover:text-blue-900"
                >
                  perplexity.ai/settings/api
                </a>
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={validateApiKey} className="flex-1">
                Valider et enregistrer
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowApiConfig(false)}
                className="flex-1"
              >
                Annuler
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {/* Search Form */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          Générateur de mots-clés
        </h2>
        
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="Entrez un mot-clé principal..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <Button 
            onClick={generateKeywords} 
            disabled={isGenerating || !keyword}
            className="flex items-center gap-2"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Générer
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowApiConfig(true)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </Card>
      
      {/* Results */}
      {(standardKeywords.length > 0 || longTailKeywords.length > 0) && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Résultats ({standardKeywords.length + longTailKeywords.length})</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedKeywords([])}
                disabled={selectedKeywords.length === 0}
              >
                Désélectionner tout ({selectedKeywords.length})
              </Button>
              <Button
                size="sm"
                onClick={exportSelectedKeywords}
                disabled={selectedKeywords.length === 0}
              >
                Exporter la sélection
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="standard" className="flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                Standards <span className="ml-1 bg-blue-100 text-blue-700 text-xs px-1.5 rounded-full">{standardKeywords.length}</span>
              </TabsTrigger>
              <TabsTrigger value="longTail" className="flex items-center gap-1">
                <BarChart3 className="w-4 h-4" />
                Longue traîne <span className="ml-1 bg-blue-100 text-blue-700 text-xs px-1.5 rounded-full">{longTailKeywords.length}</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="standard" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {standardKeywords.map((kw, idx) => renderKeywordCard(kw, idx))}
              </div>
            </TabsContent>
            
            <TabsContent value="longTail" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {longTailKeywords.map((kw, idx) => renderKeywordCard(kw, idx))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      )}
      
      {/* Empty State */}
      {standardKeywords.length === 0 && longTailKeywords.length === 0 && !isGenerating && (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Aucun résultat</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-4">
            Entrez un mot-clé principal et cliquez sur "Générer" pour obtenir des suggestions de mots-clés pertinents
            pour votre contenu SEO.
          </p>
        </Card>
      )}
      
      {/* Loading State */}
      {isGenerating && (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Génération en cours...</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-4">
            Perplexity AI génère des suggestions de mots-clés pour "{keyword}".
            Veuillez patienter un moment.
          </p>
        </Card>
      )}
    </div>
  );
};

export default KeywordGenerator;
