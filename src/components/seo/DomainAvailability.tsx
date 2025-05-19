
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge"; 
import { Card } from "@/components/ui/card";
import { Check, X, Globe, Refresh } from "lucide-react";
import { toast } from "sonner";
import ApiKeyConfig from './ApiKeyConfig';
import { useCheckDomainAvailability } from '@/hooks/useCheckDomainAvailability';

interface DomainAvailabilityProps {
  domain: string;
}

interface DomainSuggestion {
  domain: string;
  available: boolean;
  price?: string;
  score: number;
  reason?: string;
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
        <div className="bg-green-50 p-6 rounded-lg text-center">
          <Globe className="h-12 w-12 mx-auto text-green-600 mb-3" />
          <h3 className="text-lg font-medium text-green-800">Vérification de disponibilité de domaine</h3>
          <p className="text-green-700 mt-2">
            Entrez un nom de domaine ci-dessus pour vérifier sa disponibilité et obtenir des suggestions alternatives.
          </p>
        </div>
      ) : (
        <>
          {/* Status de disponibilité */}
          {domainAvailable === null ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
              <span className="ml-3 text-green-700">Vérification de la disponibilité...</span>
            </div>
          ) : domainAvailable ? (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <Check className="h-5 w-5 text-green-600" />
              <AlertTitle className="font-medium">Domaine disponible!</AlertTitle>
              <AlertDescription>
                Le domaine <strong>{domain}</strong> est actuellement disponible à l'enregistrement.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="bg-red-50 text-red-800 border-red-200">
              <X className="h-5 w-5 text-red-600" />
              <AlertTitle className="font-medium">Domaine non disponible</AlertTitle>
              <AlertDescription>
                Le domaine <strong>{domain}</strong> est déjà enregistré ou réservé.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Configuration de l'API pour les suggestions */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Suggestions de domaines alternatives</h3>
            
            <ApiKeyConfig 
              openaiKey={openaiKey}
              setOpenaiKey={setOpenaiKey}
              apiKeyStatus={apiKeyStatus}
              setApiKeyStatus={setApiKeyStatus}
              validationMessage={validationMessage}
              setValidationMessage={setValidationMessage}
              onKeyValidated={handleKeyValidated}
            />
            
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Utilisez l'IA pour générer des suggestions de noms de domaine alternatives
              </p>
              <Button
                onClick={handleGenerateSuggestions}
                disabled={isGeneratingSuggestions || apiKeyStatus !== 'valid'}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isGeneratingSuggestions ? (
                  <>
                    <Refresh className="mr-2 h-4 w-4 animate-spin" />
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
            
            {/* Liste des suggestions */}
            {suggestions.length > 0 && (
              <div className="mt-6 grid gap-3">
                {suggestions.map((suggestion, idx) => (
                  <Card key={idx} className={`p-4 ${suggestion.available ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{suggestion.domain}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={suggestion.available ? "success" : "secondary"} className={suggestion.available ? "bg-green-100 text-green-800" : ""}>
                            {suggestion.available ? "Disponible" : "Indisponible"}
                          </Badge>
                          {suggestion.price && (
                            <Badge variant="outline">
                              {suggestion.price}/an
                            </Badge>
                          )}
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            Score: {suggestion.score}/100
                          </Badge>
                        </div>
                      </div>
                      {suggestion.available && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          Réserver
                        </Button>
                      )}
                    </div>
                    {suggestion.reason && (
                      <p className="text-sm text-gray-600 mt-2">{suggestion.reason}</p>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DomainAvailability;
