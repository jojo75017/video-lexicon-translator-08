
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Loader2, Search, Settings, Globe, Zap } from "lucide-react";

interface KeywordSearchFormProps {
  keyword: string;
  setKeyword: (value: string) => void;
  isConfigured: boolean;
  isGenerating: boolean;
  hasCompetitorData: boolean;
  showCompetitors: boolean;
  generateKeywords: () => void;
  setShowApiConfig: (show: boolean) => void;
  toggleCompetitors: () => void;
}

const KeywordSearchForm: React.FC<KeywordSearchFormProps> = ({
  keyword,
  setKeyword,
  isConfigured,
  isGenerating,
  hasCompetitorData,
  showCompetitors,
  generateKeywords,
  setShowApiConfig,
  toggleCompetitors
}) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-blue-600" />
        Générateur de mots-clés
      </h2>
      
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Entrez un mot-clé principal..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && generateKeywords()}
          />
        </div>
        <Button 
          onClick={() => generateKeywords()} 
          disabled={isGenerating || !keyword}
          className="flex items-center gap-2"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Générer
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setShowApiConfig(true)}
          title="Configuration de l'API"
        >
          <Settings className="w-4 h-4" />
        </Button>
        {isConfigured && (
          <Button 
            variant={hasCompetitorData ? "default" : "secondary"}
            onClick={toggleCompetitors}
            title="Analyse concurrentielle"
            className="gap-2"
          >
            <Globe className="w-4 h-4" />
            {showCompetitors ? "Masquer" : "Concurrents"}
          </Button>
        )}
      </div>
      
      {isConfigured && (
        <div className="mt-3 flex items-center">
          <div className="flex-shrink-0 flex items-center text-sm text-green-600">
            <Zap className="w-4 h-4 mr-1" />
            <span>API connectée</span>
          </div>
          <div className="ml-auto text-xs text-gray-500">
            Les données concurrentielles réelles sont disponibles
          </div>
        </div>
      )}
    </Card>
  );
};

export default KeywordSearchForm;
