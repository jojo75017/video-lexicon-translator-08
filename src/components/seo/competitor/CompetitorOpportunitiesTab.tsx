
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { CompetitorComparison } from "@/types/seo/CompetitorData";

interface CompetitorOpportunitiesTabProps {
  analysisResult: CompetitorComparison;
}

const CompetitorOpportunitiesTab: React.FC<CompetitorOpportunitiesTabProps> = ({ analysisResult }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <AlertTriangle className="h-5 w-5" />
            Mots-clés manqués (opportunités dorées)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysisResult.comparison.keywordGaps.map((gap, index) => (
              <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-orange-800">{gap}</span>
                  <Badge variant="outline" className="bg-white">
                    Opportunité
                  </Badge>
                </div>
                <p className="text-xs text-orange-600 mt-1">
                  Vos concurrents se positionnent dessus, pas vous !
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Plan d'amélioration immédiate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysisResult.comparison.opportunities.slice(0, 5).map((opportunity, index) => (
              <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="bg-white text-xs">
                    #{index + 1}
                  </Badge>
                  <span className="text-sm text-green-800 flex-1">{opportunity}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetitorOpportunitiesTab;
