
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Trophy } from "lucide-react";
import { CompetitorComparison } from "@/types/seo/CompetitorData";
import { getPositionColor } from "@/utils/competitorAnalysisUtils";

interface CompetitorKeywordsTabProps {
  analysisResult: CompetitorComparison;
}

const CompetitorKeywordsTab: React.FC<CompetitorKeywordsTabProps> = ({ analysisResult }) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium flex items-center gap-2">
        <Search className="h-4 w-4" />
        Comparaison des top mots-clés
      </h4>
      {[
        { data: analysisResult.yourSite, label: 'Votre site', color: 'green' },
        { data: analysisResult.competitor1, label: 'Concurrent leader', color: 'red' },
        { data: analysisResult.competitor2, label: 'Concurrent 2', color: 'blue' }
      ].map((site, siteIndex) => (
        <Card key={siteIndex} className="overflow-hidden">
          <CardHeader className={`pb-3 bg-${site.color}-50`}>
            <h5 className={`font-medium text-${site.color}-700 flex items-center gap-2`}>
              {site.label}
              {siteIndex === 0 && <Badge variant="outline">C'est vous</Badge>}
            </h5>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {site.data.topKeywords.map((keyword, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <span className="font-medium">{keyword.keyword}</span>
                    <div className="text-xs text-gray-500 mt-1">
                      Volume: {keyword.volume.toLocaleString()} recherches/mois
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPositionColor(keyword.position)}>
                      #{keyword.position}
                    </Badge>
                    {keyword.position <= 3 && <Trophy className="h-4 w-4 text-yellow-500" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CompetitorKeywordsTab;
