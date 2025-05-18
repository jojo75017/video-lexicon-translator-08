
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompetitorData } from '@/types/seo/Keyword';
import { generateCompetitors } from '@/utils/keyword/keywordAnalyzer';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Link } from 'lucide-react';

interface CompetitorAnalysisProps {
  keyword: string;
  competitors?: CompetitorData[];
}

const CompetitorAnalysis: React.FC<CompetitorAnalysisProps> = ({ keyword, competitors }) => {
  // Si les concurrents ne sont pas fournis, les générer
  const competitorData = competitors || generateCompetitors(keyword);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Analyse de la concurrence</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          Principaux sites concurrents positionnés sur "{keyword}" et mots-clés associés.
        </p>
        
        <div className="space-y-4">
          {competitorData.map((competitor, index) => (
            <div key={index} className="border border-gray-100 rounded-lg bg-white p-3">
              <div className="flex items-center gap-3 mb-2">
                {competitor.logo && (
                  <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={competitor.logo} 
                      alt={competitor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{competitor.name}</h3>
                    <Badge
                      className={
                        competitor.strength > 80
                          ? "bg-red-100 text-red-800"
                          : competitor.strength > 60
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {competitor.strength}/100
                    </Badge>
                  </div>
                  <a 
                    href={`https://${competitor.url}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Link className="h-3 w-3" />
                    {competitor.url}
                  </a>
                </div>
              </div>
              
              <div className="space-y-2 mt-3">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Traffic organique</span>
                  <span>{competitor.organic_traffic.toLocaleString()} visites/mois</span>
                </div>
                <Progress value={competitor.strength} className="h-1" />
              </div>
              
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Mots-clés en commun</p>
                <div className="flex flex-wrap gap-1">
                  {competitor.commonKeywords?.map((kw, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {kw}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetitorAnalysis;
