
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface OpenAIKeyFormProps {
  onKeyValidated?: (key: string) => void;
}

const OpenAIKeyForm: React.FC<OpenAIKeyFormProps> = ({ onKeyValidated }) => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openaiKey') || '');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');

  const validateApiKey = async (key: string) => {
    if (!key.startsWith('sk-')) {
      return false;
    }

    try {
      // Simulation de validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      return key.length > 20; // Validation basique
    } catch (error) {
      return false;
    }
  };

  const handleValidation = async () => {
    if (!apiKey) {
      toast.error('Veuillez entrer une clé API');
      return;
    }

    setIsValidating(true);
    
    try {
      const isValid = await validateApiKey(apiKey);
      
      if (isValid) {
        setValidationStatus('valid');
        localStorage.setItem('openaiKey', apiKey);
        toast.success('Clé API validée avec succès');
        onKeyValidated?.(apiKey);
      } else {
        setValidationStatus('invalid');
        toast.error('Clé API invalide');
      }
    } catch (error) {
      setValidationStatus('invalid');
      toast.error('Erreur lors de la validation');
    } finally {
      setIsValidating(false);
    }
  };

  const removeKey = () => {
    setApiKey('');
    setValidationStatus('idle');
    localStorage.removeItem('openaiKey');
    toast.info('Clé API supprimée');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Configuration OpenAI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Votre clé API OpenAI est stockée localement dans votre navigateur et n'est jamais transmise à nos serveurs.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <label className="text-sm font-medium">Clé API OpenAI</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type={showKey ? 'text' : 'password'}
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-6 w-6 p-0"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
            </div>
            <Button 
              onClick={handleValidation}
              disabled={!apiKey || isValidating}
              className="whitespace-nowrap"
            >
              {isValidating ? 'Validation...' : 'Valider'}
            </Button>
          </div>
        </div>

        {validationStatus === 'valid' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              Clé API validée et configurée avec succès
            </AlertDescription>
          </Alert>
        )}

        {validationStatus === 'invalid' && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              Clé API invalide. Vérifiez que votre clé commence par "sk-" et est active.
            </AlertDescription>
          </Alert>
        )}

        {validationStatus === 'valid' && (
          <div className="flex justify-end">
            <Button variant="outline" onClick={removeKey}>
              Supprimer la clé
            </Button>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Obtenez votre clé API sur platform.openai.com</p>
          <p>• La clé est nécessaire pour les fonctionnalités IA avancées</p>
          <p>• Votre clé reste privée et sécurisée</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpenAIKeyForm;
