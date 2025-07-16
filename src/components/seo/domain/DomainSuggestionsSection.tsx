
import React from 'react';
import { Button } from "@/components/ui/button";
import { Globe, RefreshCw } from "lucide-react";
import ApiKeyConfig from '../analysis/ApiKeyConfig';
import DomainSuggestionsList from './DomainSuggestionsList';
import { DomainSuggestion } from '@/types/domain';

interface DomainSuggestionsSectionProps {
  domain: string;
  apiKeyStatus: 'unchecked' | 'valid' | 'invalid';
  openaiKey: string;
  setOpenaiKey: React.Dispatch<React.SetStateAction<string>>;
  setApiKeyStatus: React.Dispatch<React.SetStateAction<'unchecked' | 'valid' | 'invalid'>>;
  validationMessage: string;
  setValidationMessage: React.Dispatch<React.SetStateAction<string>>;
  onKeyValidated: () => void;
  onGenerateSuggestions: () => void;
  isGeneratingSuggestions: boolean;
  suggestions: DomainSuggestion[];
}

export const DomainSuggestionsSection: React.FC<DomainSuggestionsSectionProps> = ({
  domain,
  apiKeyStatus,
  openaiKey,
  setOpenaiKey,
  setApiKeyStatus,
  validationMessage,
  setValidationMessage,
  onKeyValidated,
  onGenerateSuggestions,
  isGeneratingSuggestions,
  suggestions
}) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">Suggestions de domaines alternatives</h3>
      
      <ApiKeyConfig 
        openaiKey={openaiKey}
        setOpenaiKey={setOpenaiKey}
        apiKeyStatus={apiKeyStatus}
        setApiKeyStatus={setApiKeyStatus}
        validationMessage={validationMessage}
        setValidationMessage={setValidationMessage}
        onKeyValidated={onKeyValidated}
      />
      
      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Utilisez l'IA pour générer des suggestions de noms de domaine alternatives
        </p>
        <Button
          onClick={onGenerateSuggestions}
          disabled={isGeneratingSuggestions || apiKeyStatus !== 'valid'}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {isGeneratingSuggestions ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Génération...
            </>
          ) : (
            <>
              <Globe className="mr-2 h-4 w-4" />
              Générer des suggestions
            </>
          )}
        </Button>
      </div>
      
      <DomainSuggestionsList suggestions={suggestions} />
    </div>
  );
};

export default DomainSuggestionsSection;
