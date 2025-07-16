
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle, AlertCircle } from 'lucide-react';
import { OpenAIService } from '@/utils/seo/openaiService';

interface ApiKeyConfigProps {
  openaiKey: string;
  setOpenaiKey: (key: string) => void;
  apiKeyStatus: 'unchecked' | 'valid' | 'invalid';
  setApiKeyStatus: (status: 'unchecked' | 'valid' | 'invalid') => void;
  validationMessage: string;
  setValidationMessage: (message: string) => void;
  onKeyValidated: () => void;
}

const ApiKeyConfig: React.FC<ApiKeyConfigProps> = ({
  openaiKey,
  setOpenaiKey,
  apiKeyStatus,
  setApiKeyStatus,
  validationMessage,
  setValidationMessage,
  onKeyValidated
}) => {
  const [validationInProgress, setValidationInProgress] = useState<boolean>(false);

  const handleSaveApiKey = async () => {
    if (openaiKey) {
      localStorage.setItem('openaiKey', openaiKey);
      toast.info("Validation de la clé API en cours...");
      setValidationMessage("Validation en cours...");
      setValidationInProgress(true);
      
      // Valider la clé API
      const openAIService = new OpenAIService(openaiKey);
      OpenAIService.enableProxy();
      try {
        const isValid = await openAIService.validateApiKey();
        setApiKeyStatus(isValid ? 'valid' : 'invalid');
        
        if (isValid) {
          setValidationMessage("Clé API validée avec succès");
          toast.success("Clé API OpenAI validée avec succès");
          
          // Notify parent to generate suggestions
          onKeyValidated();
        } else {
          setValidationMessage("La clé API n'a pas pu être validée");
          toast.error("La clé API n'a pas pu être validée");
        }
      } catch (error) {
        console.error("Erreur lors de la validation:", error);
        setApiKeyStatus('invalid');
        setValidationMessage("Impossible de vérifier la clé API (problème réseau)");
        toast.warning("Clé sauvegardée mais impossible de la valider (problème réseau)");
      } finally {
        setValidationInProgress(false);
      }
    } else {
      toast.error("Veuillez entrer une clé API");
    }
  };

  return (
    <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
      <h3 className="font-medium mb-2">Configuration de l'API OpenAI</h3>
      <div className="flex gap-2 mb-2">
        <Input
          type="password"
          placeholder="Entrez votre clé API OpenAI (sk-...)"
          value={openaiKey}
          onChange={(e) => setOpenaiKey(e.target.value)}
          className={`flex-1 ${apiKeyStatus === 'valid' ? 'border-green-500' : apiKeyStatus === 'invalid' ? 'border-red-500' : ''}`}
        />
        <Button onClick={handleSaveApiKey} disabled={validationInProgress}>
          {validationInProgress ? 'Validation...' : 'Sauvegarder'}
        </Button>
      </div>
      <div className="flex items-center mt-2">
        {apiKeyStatus === 'valid' && (
          <div className="flex items-center text-xs text-green-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>{validationMessage}</span>
          </div>
        )}
        {apiKeyStatus === 'invalid' && (
          <div className="flex items-center text-xs text-red-600">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>{validationMessage}</span>
          </div>
        )}
        {apiKeyStatus === 'unchecked' && (
          <span className="text-xs text-gray-500">Aucune clé API vérifiée</span>
        )}
      </div>
    </div>
  );
};

export default ApiKeyConfig;
