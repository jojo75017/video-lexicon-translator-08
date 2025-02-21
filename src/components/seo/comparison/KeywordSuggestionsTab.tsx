
import React from 'react';
import { AlertTriangle, Sparkles, TrendingUp } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  return (
    <div className="space-y-6">
      {!useRealData && (
        <form onSubmit={onApiCredentialsSubmit} className="space-y-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-blue-600" />
            <h3 className="font-medium text-blue-800">Configuration DataForSEO</h3>
          </div>
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
          <div className="grid gap-4">
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
            <Button type="submit" className="w-full">
              Configurer l'API
            </Button>
          </div>
        </form>
      )}

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

      {!useRealData && (
        <div className="p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            Vous visualisez actuellement des données simulées. Pour obtenir des données réelles,
            veuillez configurer vos identifiants DataForSEO ci-dessus.
          </p>
        </div>
      )}
    </div>
  );
};

export default KeywordSuggestionsTab;
