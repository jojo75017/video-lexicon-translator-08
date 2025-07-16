
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, RefreshCw, Sparkles, Info } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface KeywordFormProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  language: string;
  onLanguageChange: (value: string) => void;
  niche: string;
  onNicheChange: (value: string) => void;
  objective: string;
  onObjectiveChange: (value: string) => void;
  region: string;
  onRegionChange: (value: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  useAI?: boolean;
  onToggleAI?: (value: boolean) => void;
  openaiKey?: string;
}

const KeywordForm: React.FC<KeywordFormProps> = ({
  keyword,
  onKeywordChange,
  language,
  onLanguageChange,
  niche,
  onNicheChange,
  objective,
  onObjectiveChange,
  region,
  onRegionChange,
  isLoading,
  onSubmit,
  useAI,
  onToggleAI,
  openaiKey
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="keyword" className="text-sm font-medium text-gray-700 block mb-1">
            Mot-clé principal
          </label>
          <Input
            id="keyword"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="Ex: voyage au Vietnam"
            className="border-indigo-200 focus-visible:ring-indigo-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="objective" className="text-sm font-medium text-gray-700 block mb-1">
            Objectif
          </label>
          <Select value={objective} onValueChange={onObjectiveChange}>
            <SelectTrigger id="objective" className="border-indigo-200 focus:ring-indigo-500">
              <SelectValue placeholder="Type de contenu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blog">Blog</SelectItem>
              <SelectItem value="ecommerce">E-commerce</SelectItem>
              <SelectItem value="landing">Landing page</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label htmlFor="niche" className="text-sm font-medium text-gray-700 block mb-1">
            Niche ou secteur
          </label>
          <Input
            id="niche"
            value={niche}
            onChange={(e) => onNicheChange(e.target.value)}
            placeholder="Ex: voyage, tech, mode"
            className="border-indigo-200 focus-visible:ring-indigo-500"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="language" className="text-sm font-medium text-gray-700 block mb-1">
              Langue
            </label>
            <Select value={language} onValueChange={onLanguageChange}>
              <SelectTrigger id="language" className="border-indigo-200 focus:ring-indigo-500">
                <SelectValue placeholder="Langue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">Anglais</SelectItem>
                <SelectItem value="es">Espagnol</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="region" className="text-sm font-medium text-gray-700 block mb-1">
              Région
            </label>
            <Select value={region} onValueChange={onRegionChange}>
              <SelectTrigger id="region" className="border-indigo-200 focus:ring-indigo-500">
                <SelectValue placeholder="Pays cible" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FR">France</SelectItem>
                <SelectItem value="BE">Belgique</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="CH">Suisse</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Option pour utiliser l'IA (OpenAI) */}
      {onToggleAI && (
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2 bg-blue-50/50 p-3 rounded-md border border-blue-100">
            <Switch 
              id="use-ai"
              checked={useAI}
              onCheckedChange={onToggleAI}
              disabled={!openaiKey}
            />
            <div>
              <Label 
                htmlFor="use-ai" 
                className="flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span>Utiliser l'IA pour des suggestions plus précises</span>
              </Label>
              <p className="text-xs text-gray-500 mt-1">
                {openaiKey 
                  ? "Génère des mots-clés plus pertinents et précis avec OpenAI" 
                  : "Configuration d'une clé API OpenAI requise pour utiliser cette fonctionnalité"}
              </p>
            </div>
          </div>
          
          {useAI && openaiKey && (
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm">
                L'activation de l'IA fournira des données complètes : volume de recherche, CPC, données SERP (10 premiers résultats) et analyse des 5 principaux concurrents.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
      
      <Button 
        type="submit" 
        className={`w-full md:w-auto ${useAI ? 'bg-blue-600 hover:bg-blue-700' : 'bg-indigo-700 hover:bg-indigo-800'}`}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Génération en cours...
          </>
        ) : (
          <>
            {useAI ? (
              <Sparkles className="mr-2 h-4 w-4" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            Générer ma stratégie de mots-clés {useAI ? "avec IA" : ""}
          </>
        )}
      </Button>
    </form>
  );
};

export default KeywordForm;
