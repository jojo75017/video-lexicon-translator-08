
import React, { useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Check } from "lucide-react";
import { DomainSuggestion } from '@/types/domain';
import DomainQualityScore from './DomainQualityScore';
import DomainActionButtons from './DomainActionButtons';
import AiSuggestionsList from './AiSuggestionsList';
import DomainFilterDialog from './DomainFilterDialog';
import useDomainSuggestions from '@/hooks/useDomainSuggestions';

interface AvailableDomainViewProps {
  domain: string;
}

export const AvailableDomainView: React.FC<AvailableDomainViewProps> = ({ domain }) => {
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  
  const {
    isGeneratingAiSuggestions,
    aiSuggestions,
    generateAdvancedAiSuggestions,
    categoryFilter,
    setCategoryFilter,
    minScore,
    setMinScore,
    maxPrice,
    setMaxPrice,
    includeNonLatin,
    setIncludeNonLatin,
    domainLength,
    setDomainLength,
    preferredExtensions,
    setPreferredExtensions
  } = useDomainSuggestions(domain);

  return (
    <Alert className="bg-green-50 text-green-800 border-green-200">
      <div className="flex flex-col w-full">
        <div className="flex items-start">
          <Check className="h-5 w-5 text-green-600 mt-0.5" />
          <div className="ml-2">
            <AlertTitle className="font-medium">Domaine disponible!</AlertTitle>
            <AlertDescription>
              Le domaine <strong>{domain}</strong> est actuellement disponible à l'enregistrement.
            </AlertDescription>
          </div>
        </div>
        
        <DomainQualityScore domain={domain} />
        
        <DomainActionButtons 
          domain={domain} 
          onGenerateAiSuggestions={generateAdvancedAiSuggestions} 
          onShowFilterDialog={() => setShowFilterDialog(true)} 
        />

        {aiSuggestions.length > 0 && (
          <AiSuggestionsList 
            suggestions={aiSuggestions} 
            categoryFilter={categoryFilter} 
            onChangeCategoryFilter={setCategoryFilter} 
          />
        )}
      </div>

      <DomainFilterDialog 
        open={showFilterDialog}
        onOpenChange={setShowFilterDialog}
        minScore={minScore}
        setMinScore={setMinScore}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        domainLength={domainLength}
        setDomainLength={setDomainLength}
        preferredExtensions={preferredExtensions}
        setPreferredExtensions={setPreferredExtensions}
        includeNonLatin={includeNonLatin}
        setIncludeNonLatin={setIncludeNonLatin}
        onGenerateWithFilters={generateAdvancedAiSuggestions}
      />
    </Alert>
  );
};

export default AvailableDomainView;
