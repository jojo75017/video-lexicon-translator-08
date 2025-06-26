
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

export interface ApiConfigurationProps {
  openaiKey: string;
  setOpenaiKey: (key: string) => void;
  onKeyValidated: () => void;
}

const ApiConfiguration: React.FC<ApiConfigurationProps> = ({
  openaiKey,
  setOpenaiKey,
  onKeyValidated
}) => {
  const [validationMessage, setValidationMessage] = useState('');
  const [apiKeyStatus, setApiKeyStatus] = useState<'unchecked' | 'valid' | 'invalid'>('unchecked');
  const [isValidating, setIsValidating] = useState(false);

  const validateApiKey = async () => {
    if (!openaiKey.trim()) {
      toast.error('Veuillez entrer une clé API');
      return;
    }

    setIsValidating(true);
    setValidationMessage('');

    try {
      // Simulate API validation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (openaiKey.startsWith('sk-')) {
        setApiKeyStatus('valid');
        setValidationMessage('Clé API validée avec succès');
        localStorage.setItem('openaiKey', openaiKey);
        toast.success('Clé API OpenAI configurée');
        onKeyValidated();
      } else {
        setApiKeyStatus('invalid');
        setValidationMessage('Format de clé API invalide');
        toast.error('Clé API invalide');
      }
    } catch (error) {
      setApiKeyStatus('invalid');
      setValidationMessage('Erreur lors de la validation');
      toast.error('Erreur de validation');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Configuration API OpenAI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Clé API OpenAI</label>
          <div className="flex gap-2">
            <Input 
              type="password"
              placeholder="sk-..."
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={validateApiKey}
              disabled={isValidating || !openaiKey.trim()}
            >
              {isValidating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Valider'
              )}
            </Button>
          </div>
        </div>

        {validationMessage && (
          <Alert className={apiKeyStatus === 'valid' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            <div className="flex items-center gap-2">
              {apiKeyStatus === 'valid' ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={apiKeyStatus === 'valid' ? 'text-green-800' : 'text-red-800'}>
                {validationMessage}
              </AlertDescription>
            </div>
          </Alert>
        )}

        <div className="text-sm text-gray-600 space-y-2">
          <p>Votre clé API OpenAI permet d'accéder aux fonctionnalités avancées :</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Génération intelligente de mots-clés</li>
            <li>Analyse sémantique avancée</li>
            <li>Suggestions de contenu personnalisées</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiConfiguration;
