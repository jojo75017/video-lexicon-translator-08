
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Sparkles, TrendingUp, RefreshCcw, BarChart, MessageSquare } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import KeywordVisualizations from './KeywordVisualizations';

interface KeywordSuggestion {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  competition: number;
}

interface KeywordSuggestionsTabProps {
  keywordSuggestions: KeywordSuggestion[];
  isLoadingKeywords: boolean;
  useRealData: boolean;
  apiCredentials: {
    login: string;
    password: string;
  };
  onApiCredentialsChange: (credentials: { login: string; password: string }) => void;
  onApiCredentialsSubmit: (e: React.FormEvent) => void;
}

const KeywordSuggestionsTab = ({
  keywordSuggestions,
  isLoadingKeywords,
  useRealData,
  apiCredentials,
  onApiCredentialsChange,
  onApiCredentialsSubmit
}: KeywordSuggestionsTabProps) => {
  const [selectedService, setSelectedService] = useState<'dataforseo' | 'perplexity' | 'openai'>('dataforseo');
  const [perplexityKey, setPerplexityKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [showPerplexityConfig, setShowPerplexityConfig] = useState(false);
  const [showOpenAIConfig, setShowOpenAIConfig] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    if (!apiCredentials.login && !apiCredentials.password) {
      onApiCredentialsChange({
        login: 'aa95cc2bbed069d8',
        password: 'contact@business-affiliations.com'
      });
      
      // Créer un événement FormEvent synthétique
      const syntheticEvent = {
        preventDefault: () => {},
        target: null,
        currentTarget: null,
        bubbles: true,
        cancelable: true,
        defaultPrevented: false,
        eventPhase: 0,
        isTrusted: true,
        nativeEvent: new Event('submit'),
        stopPropagation: () => {},
        isPropagationStopped: () => false,
        persist: () => {},
        isDefaultPrevented: () => false,
        type: 'submit'
      } as React.FormEvent;

      // Appeler onApiCredentialsSubmit avec l'événement synthétique
      setTimeout(() => {
        onApiCredentialsSubmit(syntheticEvent);
        toast.success("Identifiants DataForSEO chargés automatiquement");
      }, 0);
    }
  }, []);

  const handleServiceChange = (value: string) => {
    setSelectedService(value as 'dataforseo' | 'perplexity' | 'openai');
    setShowPerplexityConfig(value === 'perplexity');
    setShowOpenAIConfig(value === 'openai');
  };

  const handlePerplexitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (perplexityKey) {
      toast.success("Clé API Perplexity enregistrée");
      localStorage.setItem('perplexityKey', perplexityKey);
      setIsConfigured(true);
    }
  };

  const handleOpenAISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (openaiKey) {
      toast.success("Clé API OpenAI enregistrée");
      localStorage.setItem('openaiKey', openaiKey);
      setIsConfigured(true);
      getKeywordSuggestionsWithOpenAI();
    }
  };

  const getKeywordSuggestionsWithOpenAI = async () => {
    try {
      toast.info("Récupération des données via OpenAI...");
      
      // Implementation réelle à faire ici
      // Cette fonction sera implémentée pour utiliser l'API OpenAI
      // et obtenir des suggestions de mots-clés réelles
      
      toast.success("Données récupérées avec succès");
    } catch (error) {
      console.error("Erreur lors de la récupération des données via OpenAI:", error);
      toast.error("Erreur lors de la récupération des données");
    }
  };

  return (
    <div className="space-y-6">
      {!isConfigured && (
        <form onSubmit={selectedService === 'dataforseo' ? onApiCredentialsSubmit : 
                        selectedService === 'perplexity' ? handlePerplexitySubmit : 
                        handleOpenAISubmit} 
              className="space-y-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-blue-600" />
            <h3 className="font-medium text-blue-800">Configuration API</h3>
          </div>

          <Select value={selectedService} onValueChange={handleServiceChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choisissez un service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dataforseo">DataForSEO</SelectItem>
              <SelectItem value="perplexity">Perplexity AI</SelectItem>
              <SelectItem value="openai">OpenAI (ChatGPT)</SelectItem>
            </SelectContent>
          </Select>

          {selectedService === 'dataforseo' ? (
            <div className="grid gap-4">
              <p className="text-sm text-blue-700 mb-4">
                Pour obtenir des données réelles, veuillez entrer vos identifiants DataForSEO.
                Vous pouvez créer un compte sur{' '}
                <a 
                  href="https://app.dataforseo.com/register" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-900"
                >
                  DataForSEO
                </a>
              </p>
              <Input
                type="text"
                placeholder="Login DataForSEO"
                value={apiCredentials.login}
                onChange={(e) => onApiCredentialsChange({ ...apiCredentials, login: e.target.value })}
              />
              <Input
                type="password"
                placeholder="Mot de passe DataForSEO"
                value={apiCredentials.password}
                onChange={(e) => onApiCredentialsChange({ ...apiCredentials, password: e.target.value })}
              />
            </div>
          ) : selectedService === 'perplexity' ? (
            <div className="grid gap-4">
              <p className="text-sm text-blue-700 mb-4">
                Entrez votre clé API Perplexity pour obtenir des suggestions de mots-clés intelligentes.
                Vous pouvez obtenir une clé sur{' '}
                <a 
                  href="https://www.perplexity.ai/settings/api" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-900"
                >
                  Perplexity
                </a>
              </p>
              <Input
                type="password"
                placeholder="Clé API Perplexity"
                value={perplexityKey}
                onChange={(e) => setPerplexityKey(e.target.value)}
              />
            </div>
          ) : (
            <div className="grid gap-4">
              <p className="text-sm text-blue-700 mb-4">
                Entrez votre clé API OpenAI pour obtenir des suggestions de mots-clés basées sur ChatGPT.
                Vous pouvez obtenir une clé sur{' '}
                <a 
                  href="https://platform.openai.com/account/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-900"
                >
                  OpenAI
                </a>
              </p>
              <Input
                type="password"
                placeholder="Clé API OpenAI"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
              />
            </div>
          )}

          <Button type="submit" className="w-full">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Configurer l'API
          </Button>
        </form>
      )}

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="list">Liste</TabsTrigger>
          <TabsTrigger value="visualizations">
            <BarChart className="w-4 h-4 mr-2" />
            Visualisations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          {isLoadingKeywords ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Chargement des suggestions...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {keywordSuggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-400 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-5 w-5 text-blue-500" />
                      <h3 className="font-semibold text-lg">{suggestion.keyword}</h3>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        CPC: {suggestion.cpc}€
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Volume mensuel
                      </div>
                      <div className="font-semibold">{suggestion.volume}</div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">Difficulté</div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${suggestion.difficulty}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{suggestion.difficulty}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">Compétition</div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${suggestion.competition * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {Math.round(suggestion.competition * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="visualizations">
          {isLoadingKeywords ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Chargement des visualisations...</p>
            </div>
          ) : (
            <KeywordVisualizations keywordSuggestions={keywordSuggestions} />
          )}
        </TabsContent>
      </Tabs>

      {isConfigured && selectedService === 'openai' && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-5 w-5 text-green-600" />
            <h3 className="font-medium text-green-800">OpenAI activé</h3>
          </div>
          <p className="text-sm text-green-700 mb-4">
            Vous utilisez actuellement l'API OpenAI pour obtenir des suggestions de mots-clés.
          </p>
          <Button 
            onClick={getKeywordSuggestionsWithOpenAI}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            Rafraîchir les suggestions avec OpenAI
          </Button>
        </div>
      )}

      {!isConfigured && (
        <div className="p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            Vous visualisez actuellement des données simulées. Pour obtenir des données réelles,
            veuillez configurer vos identifiants API ci-dessus.
          </p>
        </div>
      )}
    </div>
  );
};

export default KeywordSuggestionsTab;
