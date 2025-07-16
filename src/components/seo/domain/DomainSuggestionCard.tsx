
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DomainSuggestion } from '@/types/domain';

interface DomainSuggestionCardProps {
  suggestion: DomainSuggestion;
}

export const DomainSuggestionCard: React.FC<DomainSuggestionCardProps> = ({ suggestion }) => {
  return (
    <Card 
      className={`p-4 ${suggestion.available ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">{suggestion.domain}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge 
              variant={suggestion.available ? "default" : "secondary"}
              className={suggestion.available ? "bg-green-100 text-green-800" : ""}
            >
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
  );
};

export default DomainSuggestionCard;
