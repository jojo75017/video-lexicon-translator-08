
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useCheckDomainAvailability } from '@/hooks/useCheckDomainAvailability';
import DomainWelcomeScreen from './domain/DomainWelcomeScreen';
import DomainStatus from './domain/DomainStatus';
import DomainSuggestionsSection from './domain/DomainSuggestionsSection';
import { DomainSuggestion } from '@/types/domain';

interface DomainAvailabilityProps {
  domain: string;
}

const DomainAvailability: React.FC<DomainAvailabilityProps> = ({ domain }) => {
  const [openaiKey, setOpenaiKey] = useState<string>(() => localStorage.getItem('openaiKey') || '');
  const [apiKeyStatus, setApiKeyStatus] = useState<'unchecked' | 'valid' | 'invalid'>(
    localStorage.getItem('openaiKey') ? 'valid' : 'unchecked'
  );
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [domainAvailable, setDomainAvailable] = useState<boolean | null>(null);
  const [suggestions, setSuggestions] = useState<DomainSuggestion[]>([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  
  const { 
    checkAvailability,
    isChecking,
    generateAiSuggestions,
    isGenerating
  } = useCheckDomainAvailability();
  
  // Check domain availability when domain changes
  useEffect(() => {
    if (domain) {
      checkDomainAvailability(domain);
    } else {
      setDomainAvailable(null);
    }
  }, [domain]);
  
  const checkDomainAvailability = async (domainName: string) => {
    setDomainAvailable(null);
    const result = await checkAvailability(domainName);
    setDomainAvailable(result);
    
    if (result === false) {
      toast.error(`Le domaine ${domainName} n'est pas disponible`);
    } else if (result === true) {
      toast.success(`Le domaine ${domainName} est disponible!`);
    }
  };
  
  const handleGenerateSuggestions = async () => {
    if (!domain) {
      toast.error("Veuillez d'abord entrer un nom de domaine");
      return;
    }
    
    if (apiKeyStatus !== 'valid') {
      toast.error("Veuillez configurer une clé API OpenAI valide pour générer des suggestions");
      return;
    }
    
    setIsGeneratingSuggestions(true);
    try {
      // Generate AI suggestions
      const aiSuggestions = await generateAiSuggestions(domain, openaiKey);
      setSuggestions(aiSuggestions);
      
      if (aiSuggestions.length === 0) {
        toast.warning("Aucune suggestion générée. Essayez avec un autre domaine.");
      } else {
        toast.success(`${aiSuggestions.length} suggestions générées avec succès`);
      }
    } catch (error) {
      console.error("Erreur lors de la génération des suggestions:", error);
      toast.error("Impossible de générer des suggestions. Veuillez réessayer.");
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };
  
  // Fonction pour gérer la validation de la clé API
  const handleKeyValidated = () => {
    // Générer automatiquement des suggestions si la clé est validée et qu'un domaine est spécifié
    if (domain) {
      handleGenerateSuggestions();
    }
  };
  
  return (
    <div className="space-y-6">
      {!domain ? (
        <DomainWelcomeScreen />
      ) : (
        <>
          <DomainStatus
            domain={domain}
            isAvailable={domainAvailable}
            isChecking={isChecking}
          />
          
          <DomainSuggestionsSection
            domain={domain}
            apiKeyStatus={apiKeyStatus}
            openaiKey={openaiKey}
            setOpenaiKey={setOpenaiKey}
            setApiKeyStatus={setApiKeyStatus}
            validationMessage={validationMessage}
            setValidationMessage={setValidationMessage}
            onKeyValidated={handleKeyValidated}
            onGenerateSuggestions={handleGenerateSuggestions}
            isGeneratingSuggestions={isGeneratingSuggestions}
            suggestions={suggestions}
          />
        </>
      )}
    </div>
  );
};

export default DomainAvailability;
