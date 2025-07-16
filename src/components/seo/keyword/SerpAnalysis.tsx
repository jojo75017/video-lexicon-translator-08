
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ExternalLink } from 'lucide-react';
import { KeywordSuggestion, SerpResult } from '@/types/seo/Keyword';

interface SerpAnalysisProps {
  keywords: KeywordSuggestion[];
}

const SerpAnalysis: React.FC<SerpAnalysisProps> = ({ keywords }) => {
  const serpResults: SerpResult[] = [
    {
      title: "Guide complet - Où dormir à Paris en 2025",
      url: "https://example.com/guide-dormir-paris",
      description: "Découvrez les meilleurs quartiers pour dormir à Paris, avec nos conseils d'experts pour choisir votre hébergement.",
      position: 1,
      domain: "example.com",
      authority: 85
    },
    {
      title: "Meilleurs hôtels à Paris - Booking.com",
      url: "https://booking.com/paris-hotels",
      description: "Réservez votre hôtel à Paris au meilleur prix. Large choix d'hébergements dans tous les quartiers.",
      position: 2,
      domain: "booking.com", 
      authority: 95
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-green-500" />
          Analyse SERP
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {serpResults.map((result, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-600 hover:underline cursor-pointer">
                    {result.title}
                  </h3>
                  <p className="text-sm text-green-600 mb-1">{result.url}</p>
                  <p className="text-sm text-gray-600">{result.description}</p>
                </div>
                <Badge variant="outline">#{result.position}</Badge>
              </div>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>Domaine: {result.domain}</span>
                <span>Autorité: {result.authority}/100</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SerpAnalysis;
