
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ApiConfigSectionProps {
  apiKey: string;
  setApiKey: (value: string) => void;
  validateApiKey: () => Promise<boolean>;
  setShowApiConfig: (show: boolean) => void;
}

const ApiConfigSection: React.FC<ApiConfigSectionProps> = ({ 
  apiKey, 
  setApiKey, 
  validateApiKey, 
  setShowApiConfig 
}) => {
  return (
    <Card className="p-6 border-blue-100 bg-blue-50">
      <h2 className="text-lg font-semibold text-blue-900 mb-4">Configuration de OpenAI</h2>
      <p className="text-blue-800 mb-4">
        Ce générateur de mots-clés utilise l'API OpenAI pour générer des suggestions de mots-clés précises et contextuelles.
        Veuillez entrer votre clé API ci-dessous pour commencer.
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-blue-900 mb-1">Clé API OpenAI</label>
          <Input
            type="password"
            placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full"
          />
          <p className="text-xs text-blue-700 mt-1">
            Obtenez votre clé sur{" "}
            <a 
              href="https://platform.openai.com/api-keys"
              target="_blank" 
              rel="noopener noreferrer" 
              className="underline hover:text-blue-900"
            >
              platform.openai.com/api-keys
            </a>
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={validateApiKey} className="flex-1">
            Valider et enregistrer
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowApiConfig(false)}
            className="flex-1"
          >
            Annuler
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ApiConfigSection;
