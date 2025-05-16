
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface SerpResult {
  title: string;
  url: string;
  description: string;
  position: number;
}

interface SerpResultsProps {
  serps: SerpResult[] | undefined;
}

const SerpResults: React.FC<SerpResultsProps> = ({ serps }) => {
  if (!serps || serps.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-md text-center">
        <p className="text-gray-500">Aucun résultat SERP disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Résultats de la SERP</h3>
        <p className="text-sm text-gray-600">
          Les {serps.length} premiers résultats dans les moteurs de recherche pour ce mot-clé
        </p>
      </div>

      {serps.map((result, index) => (
        <Card key={index} className={`border-l-4 ${index === 0 ? 'border-l-green-500' : index < 3 ? 'border-l-blue-400' : 'border-l-gray-300'}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-blue-600 hover:underline mb-1">
                  <a href={result.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                    {result.title}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </h4>
                <div className="text-xs text-green-800 mb-2">{result.url}</div>
                <p className="text-sm text-gray-600">{result.description}</p>
              </div>
              <Badge className={`shrink-0 ml-2 ${
                index === 0 ? 'bg-green-100 text-green-800' : 
                index < 3 ? 'bg-blue-100 text-blue-800' : 
                'bg-gray-100 text-gray-800'
              }`}>
                #{result.position}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SerpResults;
