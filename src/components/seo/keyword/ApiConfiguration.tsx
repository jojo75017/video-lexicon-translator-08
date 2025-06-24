
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key } from "lucide-react";
import { toast } from "sonner";
import { OpenAIService } from "@/utils/seo/openaiService";

interface ApiConfigurationProps {
  openaiKey: string;
  setOpenaiKey: (key: string) => void;
  onConfigured: () => void;
  onCancel: () => void;
}

const ApiConfiguration: React.FC<ApiConfigurationProps> = ({
  openaiKey,
  setOpenaiKey,
  onConfigured,
  onCancel
}) => {
  const validateAndSaveApiKey = async () => {
    if (!openaiKey.trim()) {
      toast.error("Veuillez entrer une clé API OpenAI");
      return;
    }

    try {
      const openAIService = new OpenAIService(openaiKey);
      const isValid = await openAIService.validateApiKey();
      
      if (isValid) {
        localStorage.setItem('openaiKey', openaiKey);
        onConfigured();
        toast.success("Clé API OpenAI configurée avec succès !");
      } else {
        toast.error("Clé API OpenAI invalide");
      }
    } catch (error) {
      toast.error("Erreur lors de la validation de la clé API");
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Configuration OpenAI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600">
          Pour utiliser le générateur de mots-clés IA avancé, configurez votre clé API OpenAI.
        </p>
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
            value={openaiKey}
            onChange={(e) => setOpenaiKey(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Obtenez votre clé sur{" "}
            <a 
              href="https://platform.openai.com/api-keys"
              target="_blank" 
              rel="noopener noreferrer" 
              className="underline"
            >
              platform.openai.com/api-keys
            </a>
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={validateAndSaveApiKey} className="flex-1">
            Valider et sauvegarder
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="flex-1"
          >
            Annuler
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiConfiguration;
