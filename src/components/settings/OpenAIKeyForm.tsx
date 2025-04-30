
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyRound, Loader2, Check, AlertCircle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { OpenAIService } from '@/utils/seo/openaiService';
import { toast } from 'sonner';

interface OpenAIKeyFormProps {
  apiKey: string;
  onSave: (key: string) => void;
  isLoading: boolean;
  isValid: boolean;
}

const OpenAIKeyForm: React.FC<OpenAIKeyFormProps> = ({ 
  apiKey, 
  onSave, 
  isLoading, 
  isValid 
}) => {
  const [localKey, setLocalKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [hasBeenValidated, setHasBeenValidated] = useState(false);
  const [validationInProgress, setValidationInProgress] = useState(false);

  useEffect(() => {
    // Update local key when prop changes
    if (apiKey !== localKey) {
      setLocalKey(apiKey);
    }
    
    // Check if key exists and mark as validated
    if (apiKey && isValid) {
      setHasBeenValidated(true);
    }
  }, [apiKey, isValid, localKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!localKey) {
      toast.error("Clé API manquante", {
        description: "Veuillez entrer une clé OpenAI API valide"
      });
      return;
    }
    
    // Validate format before submitting
    if (!localKey.startsWith('sk-') || localKey.length < 20) {
      toast.error("Format de clé incorrect", {
        description: "La clé doit commencer par 'sk-' et être suffisamment longue"
      });
      return;
    }
    
    setValidationInProgress(true);
    
    try {
      // Save key immediately to localStorage to ensure it's available
      localStorage.setItem('openaiKey', localKey);
      
      // Set the key in OpenAIService
      OpenAIService.setApiKey(localKey);
      
      // Ensure proxy is enabled
      OpenAIService.enableProxy();
      
      setHasBeenValidated(true);
      
      // Notify parent component
      onSave(localKey);
      
      toast.success("Clé API sauvegardée", {
        description: "La clé OpenAI a été enregistrée et sera utilisée pour l'analyse"
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la clé API:", error);
      toast.error("Erreur", {
        description: "Une erreur s'est produite lors de l'enregistrement de la clé"
      });
    } finally {
      setValidationInProgress(false);
    }
  };

  // Simplified format validation to give immediate feedback
  const isValidFormat = localKey && localKey.startsWith('sk-') && localKey.length > 20;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="api-key" className="text-sm font-medium text-gray-700 mr-2 flex items-center">
            OpenAI API Key
            {isValid && hasBeenValidated && <Check className="ml-2 h-4 w-4 text-green-500" />}
          </label>
          <a 
            href="https://platform.openai.com/api-keys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
          >
            Get API Key <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </div>
        
        <div className="flex gap-2">
          <Input
            id="api-key"
            type={showKey ? "text" : "password"}
            value={localKey}
            onChange={(e) => setLocalKey(e.target.value)}
            placeholder="sk-..."
            className={`flex-1 ${hasBeenValidated && (isValid ? 'border-green-500 focus:ring-green-500' : 'border-red-500 focus:ring-red-500')}`}
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setShowKey(!showKey)}
          >
            {showKey ? "Hide" : "Show"}
          </Button>
        </div>
        
        <p className="text-xs text-gray-500">
          Votre clé API est stockée localement dans votre navigateur et n'est jamais transmise à nos serveurs.
        </p>
      </div>
      
      {/* Format validation message */}
      {localKey && !isValidFormat && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Format de clé incorrect. La clé doit commencer par 'sk-' et être suffisamment longue.
          </AlertDescription>
        </Alert>
      )}
      
      {hasBeenValidated && !isValid && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            La clé API n'a pas pu être validée. Vérifiez qu'elle est correcte.
          </AlertDescription>
        </Alert>
      )}
      
      {hasBeenValidated && isValid && (
        <Alert variant="default" className="py-2 bg-green-50 text-green-800 border-green-200">
          <Check className="h-4 w-4" />
          <AlertDescription>
            Clé API validée avec succès.
          </AlertDescription>
        </Alert>
      )}
      
      <Button 
        type="submit" 
        disabled={isLoading || validationInProgress || !localKey || !isValidFormat}
        className="w-full"
      >
        {isLoading || validationInProgress ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enregistrement...
          </>
        ) : (
          <>
            <KeyRound className="mr-2 h-4 w-4" />
            Enregistrer la clé API
          </>
        )}
      </Button>
    </form>
  );
};

export default OpenAIKeyForm;
