
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Eye } from "lucide-react";
import { CompetitorComparison } from "@/types/seo/CompetitorData";
import { getScoreColor } from "@/utils/competitorAnalysisUtils";

interface CompetitorOverviewTabProps {
  analysisResult: CompetitorComparison;
}

const CompetitorOverviewTab: React.FC<CompetitorOverviewTabProps> = ({ analysisResult }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { data: analysisResult.yourSite, color: 'green', label: 'Votre site', status: 'À améliorer' },
          { data: analysisResult.competitor1, color: 'red', label: 'Concurrent leader', status: 'À rattraper' },
          { data: analysisResult.competitor2, color: 'blue', label: 'Concurrent 2', status: 'Dépassable' }
        ].map((site, index) => (
          <Card key={index} className={`border-${site.color}-200 relative overflow-hidden`}>
            <div className={`absolute top-0 left-0 w-full h-1 bg-${site.color}-500`}></div>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <h4 className={`font-medium text-${site.color}-700`}>{site.label}</h4>
                <Badge className={getScoreColor(site.data.seoScore)}>
                  {site.data.seoScore}/100
                </Badge>
              </div>
              <p className="text-xs text-gray-500 truncate">{site.data.domain}</p>
              <Badge variant="outline" className="text-xs">
                {site.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2 bg-gray-50 rounded">
                  <span className="text-gray-500">Trafic mensuel:</span>
                  <div className="font-bold text-sm">{site.data.organicTraffic.toLocaleString()}</div>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <span className="text-gray-500">Mots-clés:</span>
                  <div className="font-bold text-sm">{site.data.totalKeywords.toLocaleString()}</div>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <span className="text-gray-500">Backlinks:</span>
                  <div className="font-bold text-sm">{site.data.backlinksCount.toLocaleString()}</div>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <span className="text-gray-500">Autorité:</span>
                  <div className="font-bold text-sm">{site.data.domainAuthority}/100</div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                asChild
              >
                <a href={site.data.site} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Analyser le site
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-semibold">Analyse rapide</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {analysisResult.comparison.strengthComparison[0].strength < analysisResult.comparison.strengthComparison[1].strength ? 
                (analysisResult.comparison.strengthComparison[1].strength - analysisResult.comparison.strengthComparison[0].strength) : 0}
              </div>
              <div className="text-sm text-gray-600">Points à rattraper sur le leader</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{analysisResult.comparison.keywordGaps.length}</div>
              <div className="text-sm text-gray-600">Opportunités de mots-clés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{analysisResult.comparison.opportunities.length}</div>
              <div className="text-sm text-gray-600">Actions d'amélioration</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetitorOverviewTab;
