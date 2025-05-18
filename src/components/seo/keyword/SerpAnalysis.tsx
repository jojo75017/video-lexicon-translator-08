
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SerpResult } from '@/types/seo/Keyword';
import { generateSerpData } from '@/utils/keyword/keywordAnalyzer';
import { ExternalLink, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SerpAnalysisProps {
  keyword: string;
  serpData?: SerpResult[];
}

const SerpAnalysis: React.FC<SerpAnalysisProps> = ({ keyword, serpData }) => {
  // Si les données SERP ne sont pas fournies, les générer
  const results = serpData || generateSerpData(keyword);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Analyse SERP</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          Aperçu des résultats de recherche Google pour "{keyword}".
        </p>
        
        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={index} className="border border-gray-100 rounded-lg bg-white p-3">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline">{result.position}</Badge>
                <h3 className="text-blue-700 hover:underline font-medium line-clamp-1">
                  {result.title}
                </h3>
              </div>
              
              <a 
                href={result.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-green-700 mb-2 flex items-center gap-1"
              >
                <FileText className="h-3 w-3" />
                {result.url}
              </a>
              
              <p className="text-sm text-gray-700 line-clamp-2">
                {result.description}
              </p>
              
              <div className="flex justify-end mt-2">
                <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Visiter
                </a>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SerpAnalysis;
