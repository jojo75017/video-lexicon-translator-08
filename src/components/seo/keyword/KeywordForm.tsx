
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, RefreshCw } from 'lucide-react';

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
  onSubmit
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
      
      <Button 
        type="submit" 
        className="w-full md:w-auto bg-indigo-700 hover:bg-indigo-800"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Génération en cours...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Générer ma stratégie de mots-clés
          </>
        )}
      </Button>
    </form>
  );
};

export default KeywordForm;
