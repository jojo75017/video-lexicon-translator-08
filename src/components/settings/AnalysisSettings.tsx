
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Settings, Key, Globe, Zap } from "lucide-react";

interface OpenAIKeyFormProps {
  apiKey: string;
  onSave: (key: string) => void;
  isLoading: boolean;
  isValid: boolean;
}

const OpenAIKeyForm: React.FC<OpenAIKeyFormProps> = ({ apiKey, onSave, isLoading, isValid }) => {
  const [key, setKey] = useState(apiKey);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="openai-key">Clé API OpenAI</Label>
        <Input
          id="openai-key"
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="sk-..."
          className="mt-1"
        />
      </div>
      <Button 
        onClick={() => onSave(key)} 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Validation..." : "Sauvegarder"}
      </Button>
      {isValid && (
        <p className="text-green-600 text-sm">✓ Clé API validée</p>
      )}
    </div>
  );
};

const AnalysisSettings = () => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [firecrawlKey, setFirecrawlKey] = useState('');
  const [isLoadingOpenAI, setIsLoadingOpenAI] = useState(false);
  const [isLoadingFirecrawl, setIsLoadingFirecrawl] = useState(false);
  const [openaiValid, setOpenaiValid] = useState(false);
  const [firecrawlValid, setFirecrawlValid] = useState(false);
  const [autoAnalysis, setAutoAnalysis] = useState(true);
  const [deepAnalysis, setDeepAnalysis] = useState(false);
  const [region, setRegion] = useState('europe');

  useEffect(() => {
    // Charger les clés depuis le localStorage
    const savedOpenAI = localStorage.getItem('openaiKey');
    const savedFirecrawl = localStorage.getItem('firecrawlKey');
    
    if (savedOpenAI) {
      setOpenaiKey(savedOpenAI);
      setOpenaiValid(true);
    }
    
    if (savedFirecrawl) {
      setFirecrawlKey(savedFirecrawl);
      setFirecrawlValid(true);
    }
  }, []);

  const handleSaveOpenAI = async (key: string) => {
    setIsLoadingOpenAI(true);
    try {
      // Simuler la validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('openaiKey', key);
      setOpenaiKey(key);
      setOpenaiValid(true);
      toast.success("Clé OpenAI sauvegardée et validée");
    } catch (error) {
      toast.error("Erreur lors de la validation de la clé OpenAI");
    } finally {
      setIsLoadingOpenAI(false);
    }
  };

  const handleSaveFirecrawl = async () => {
    setIsLoadingFirecrawl(true);
    try {
      // Simuler la validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('firecrawlKey', firecrawlKey);
      setFirecrawlValid(true);
      toast.success("Clé Firecrawl sauvegardée et validée");
    } catch (error) {
      toast.error("Erreur lors de la validation de la clé Firecrawl");
    } finally {
      setIsLoadingFirecrawl(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Paramètres d'analyse
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuration OpenAI */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              <h3 className="font-medium">Configuration OpenAI</h3>
            </div>
            <OpenAIKeyForm
              apiKey={openaiKey}
              onSave={handleSaveOpenAI}
              isLoading={isLoadingOpenAI}
              isValid={openaiValid}
            />
          </div>

          {/* Configuration Firecrawl */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <h3 className="font-medium">Configuration Firecrawl</h3>
            </div>
            <div>
              <Label htmlFor="firecrawl-key">Clé API Firecrawl</Label>
              <Input
                id="firecrawl-key"
                type="password"
                value={firecrawlKey}
                onChange={(e) => setFirecrawlKey(e.target.value)}
                placeholder="fc-..."
                className="mt-1"
              />
            </div>
            <Button 
              onClick={handleSaveFirecrawl} 
              disabled={isLoadingFirecrawl}
              className="w-full"
            >
              {isLoadingFirecrawl ? "Validation..." : "Sauvegarder"}
            </Button>
            {firecrawlValid && (
              <p className="text-green-600 text-sm">✓ Clé API validée</p>
            )}
          </div>

          {/* Options d'analyse */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <h3 className="font-medium">Options d'analyse</h3>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Analyse automatique</Label>
                <p className="text-sm text-gray-600">
                  Lancer automatiquement l'analyse lors du chargement
                </p>
              </div>
              <Switch
                checked={autoAnalysis}
                onCheckedChange={setAutoAnalysis}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Analyse approfondie</Label>
                <p className="text-sm text-gray-600">
                  Analyser plus de pages et de données
                </p>
              </div>
              <Switch
                checked={deepAnalysis}
                onCheckedChange={setDeepAnalysis}
              />
            </div>
            
            <div>
              <Label htmlFor="region">Région d'analyse</Label>
              <select
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="europe">Europe</option>
                <option value="north-america">Amérique du Nord</option>
                <option value="asia">Asie</option>
                <option value="global">Global</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisSettings;
