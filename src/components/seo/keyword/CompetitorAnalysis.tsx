
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CompetitorData } from "@/types/seo";
import { ExternalLink, TrendingUp, Users, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface CompetitorAnalysisProps {
  competitors: CompetitorData[];
}

const CompetitorAnalysis: React.FC<CompetitorAnalysisProps> = ({ competitors }) => {
  if (!competitors || competitors.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-md text-center">
        <p className="text-gray-500">Aucune donnée concurrentielle disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Analyse des concurrents</h3>
        <p className="text-sm text-gray-600">
          Les 5 principaux concurrents sur ce mot-clé et leur performance
        </p>
      </div>

      {competitors.map((competitor, index) => (
        <Card key={index} className="border overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium flex items-center gap-1">
                  <a href={competitor.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                    {competitor.name}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </h4>
                <div className="text-xs text-gray-500">{competitor.url}</div>
              </div>
              <div className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
                Force: {competitor.strength}/100
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-500" />
                <div>
                  <div className="text-sm font-medium">Trafic organique</div>
                  <div className="text-lg font-semibold">{competitor.organic_traffic?.toLocaleString() || 'N/A'}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-green-500" />
                <div>
                  <div className="text-sm font-medium">Mots-clés</div>
                  <div className="text-lg font-semibold">{competitor.keywords?.toLocaleString() || 'N/A'}</div>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1">Force relative</div>
                <Progress 
                  value={competitor.strength} 
                  className="h-2" 
                  indicatorClassName={
                    competitor.strength > 70 ? "bg-red-500" :
                    competitor.strength > 50 ? "bg-orange-500" :
                    competitor.strength > 30 ? "bg-yellow-500" :
                    "bg-green-500"
                  } 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CompetitorAnalysis;
