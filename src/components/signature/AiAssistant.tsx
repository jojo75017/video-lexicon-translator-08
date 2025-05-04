
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Bot } from "lucide-react";

interface AiAssistantProps {
  onUseResponse: (response: string) => void;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ onUseResponse }) => {
  const [prompt, setPrompt] = useState('');
  const [industry, setIndustry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');

  const generateDescription = () => {
    setIsLoading(true);
    
    // Simulate AI generation with predefined responses based on industry
    setTimeout(() => {
      let response = '';
      
      switch(industry.toLowerCase()) {
        case 'marketing':
          response = 'Expert en stratégie marketing digital et optimisation de conversion';
          break;
        case 'technologie':
          response = 'Spécialiste en développement de solutions technologiques et innovation';
          break;
        case 'finance':
          response = 'Conseiller en gestion financière et stratégies d\'investissement';
          break;
        case 'santé':
          response = 'Professionnel de santé spécialisé en bien-être et médecine préventive';
          break;
        default:
          response = 'Professionnel spécialisé en ' + (industry || 'conseil et stratégie');
      }
      
      if (prompt) {
        // Add personalization based on prompt if provided
        const promptLower = prompt.toLowerCase();
        if (promptLower.includes('créatif')) {
          response += ' avec approche créative';
        }
        if (promptLower.includes('leader')) {
          response += ' et leadership d\'équipe';
        }
        if (promptLower.includes('international')) {
          response += ' à l\'échelle internationale';
        }
      }
      
      setAiResponse(response);
      setIsLoading(false);
      toast.success("Description générée avec succès");
    }, 1500);
  };

  const handleUseResponse = () => {
    onUseResponse(aiResponse);
    toast.success("Description appliquée à votre signature");
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-blue-50 border border-blue-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <Bot className="h-5 w-5 text-blue-700" />
          </div>
          <h3 className="font-medium">Assistant de rédaction</h3>
        </div>
        <p className="text-sm text-gray-600">
          Cet assistant vous aide à créer une description professionnelle pour votre poste.
          Renseignez votre secteur d'activité et quelques mots-clés pour obtenir une proposition.
        </p>
      </Card>

      <div className="space-y-4">
        <div>
          <Label htmlFor="industry">Secteur d'activité</Label>
          <Input
            id="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="Ex: Marketing, Technologie, Finance..."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="prompt">Mots-clés (optionnel)</Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex: leadership, créatif, international..."
            className="mt-1 resize-none"
            rows={3}
          />
        </div>

        <Button 
          onClick={generateDescription} 
          className="w-full"
          disabled={isLoading || !industry}
        >
          {isLoading ? 'Génération en cours...' : 'Générer une description'}
        </Button>

        {aiResponse && (
          <div className="mt-4 space-y-3">
            <div className="bg-green-50 border border-green-100 rounded-md p-3">
              <Label className="text-xs text-green-800 mb-1 block">Suggestion:</Label>
              <p className="font-medium">{aiResponse}</p>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full border-green-300 text-green-700 hover:bg-green-50"
              onClick={handleUseResponse}
            >
              Utiliser cette suggestion
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiAssistant;
