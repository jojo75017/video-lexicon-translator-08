
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyRound, Loader2, Check } from 'lucide-react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localKey) {
      onSave(localKey);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center">
          <label htmlFor="api-key" className="text-sm font-medium text-gray-700 mr-2">
            Clé API OpenAI
          </label>
          {isValid && <Check className="h-4 w-4 text-green-500" />}
        </div>
        <div className="flex gap-2">
          <Input
            id="api-key"
            type={showKey ? "text" : "password"}
            value={localKey}
            onChange={(e) => setLocalKey(e.target.value)}
            placeholder="sk-..."
            className="flex-1"
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setShowKey(!showKey)}
          >
            {showKey ? "Masquer" : "Afficher"}
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          Votre clé API est stockée localement dans votre navigateur et n'est jamais transmise à nos serveurs.
        </p>
      </div>
      
      <Button 
        type="submit" 
        disabled={isLoading || !localKey || localKey === apiKey}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Validation en cours...
          </>
        ) : (
          <>
            <KeyRound className="mr-2 h-4 w-4" />
            Sauvegarder la clé API
          </>
        )}
      </Button>
    </form>
  );
};

export default OpenAIKeyForm;
