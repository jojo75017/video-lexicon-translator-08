
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X, Globe, Brain } from "lucide-react";
import { DomainSuggestion } from '@/types/domain';
import { Badge } from '@/components/ui/badge';

interface UnavailableDomainViewProps {
  domain: string;
  isGeneratingAiSuggestions: boolean;
  onGenerateAiSuggestions: () => void;
  aiSuggestions: DomainSuggestion[];
}

export const UnavailableDomainView: React.FC<UnavailableDomainViewProps> = ({
  domain,
  isGeneratingAiSuggestions,
  onGenerateAiSuggestions,
  aiSuggestions
}) => {
  return (
    <Alert className="bg-red-50 text-red-800 border-red-200">
      <X className="h-5 w-5 text-red-600" />
      <AlertTitle className="font-medium">Domaine non disponible</AlertTitle>
      <AlertDescription>
        Le domaine <strong>{domain}</strong> est déjà enregistré ou réservé.
        <div className="mt-2">
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 border-red-300 hover:bg-red-50"
            onClick={onGenerateAiSuggestions}
            disabled={isGeneratingAiSuggestions}
          >
            <Globe className="h-4 w-4 mr-1" />
            {isGeneratingAiSuggestions ? 'Recherche...' : 'Trouver des alternatives par IA'}
          </Button>
        </div>
        
        {aiSuggestions.length > 0 && (
          <div className="mt-4 border-t border-red-200 pt-4">
            <h3 className="font-medium text-red-800 mb-3 flex items-center">
              <Brain className="h-4 w-4 mr-2" />
              Alternatives disponibles
            </h3>
            <div className="grid gap-2">
              {aiSuggestions.map((suggestion, idx) => (
                <div 
                  key={idx} 
                  className="p-3 bg-white rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between">
                    <div className="font-medium">{suggestion.domain}</div>
                    <Badge className="bg-green-100 text-green-800">
                      Score: {suggestion.score}/100
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{suggestion.reason}</div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-sm text-gray-500">{suggestion.price}</div>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs">
                      Réserver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default UnavailableDomainView;
