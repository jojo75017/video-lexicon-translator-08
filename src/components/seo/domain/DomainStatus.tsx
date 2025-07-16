
import React from 'react';
import { DomainSuggestion } from '@/types/domain';
import AvailableDomainView from './AvailableDomainView';
import UnavailableDomainView from './UnavailableDomainView';
import useDomainSuggestions from '@/hooks/useDomainSuggestions';

interface DomainStatusProps {
  domain: string;
  isAvailable: boolean | null;
  isChecking: boolean;
}

export const DomainStatus: React.FC<DomainStatusProps> = ({ domain, isAvailable, isChecking }) => {
  const { 
    isGeneratingAiSuggestions,
    aiSuggestions,
    generateAdvancedAiSuggestions
  } = useDomainSuggestions(domain);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
        <span className="ml-3 text-green-700">Vérification de la disponibilité...</span>
      </div>
    );
  }
  
  if (isAvailable === null) {
    return null;
  }
  
  return isAvailable ? (
    <AvailableDomainView domain={domain} />
  ) : (
    <UnavailableDomainView 
      domain={domain}
      isGeneratingAiSuggestions={isGeneratingAiSuggestions}
      onGenerateAiSuggestions={generateAdvancedAiSuggestions}
      aiSuggestions={aiSuggestions}
    />
  );
};

export default DomainStatus;
