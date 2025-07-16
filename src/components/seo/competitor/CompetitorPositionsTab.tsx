
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { CompetitorComparison } from "@/types/seo/CompetitorData";
import { getPositionColor } from "@/utils/competitorAnalysisUtils";

interface CompetitorPositionsTabProps {
  analysisResult: CompetitorComparison;
}

const CompetitorPositionsTab: React.FC<CompetitorPositionsTabProps> = ({ analysisResult }) => {
  const getPositionTrend = (yourPos: number, compPos: number) => {
    if (yourPos < compPos) return { icon: ArrowUp, color: 'text-green-600', text: 'Vous êtes devant' };
    if (yourPos > compPos) return { icon: ArrowDown, color: 'text-red-600', text: 'Vous êtes derrière' };
    return { icon: Minus, color: 'text-gray-600', text: 'Position égale' };
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Bataille des positions - Où vous situez-vous ?</h4>
      <div className="space-y-3">
        {analysisResult.comparison.positionAnalysis.map((analysis, index) => {
          const trend1 = getPositionTrend(analysis.yourPosition, analysis.comp1Position);
          const trend2 = getPositionTrend(analysis.yourPosition, analysis.comp2Position);
          
          return (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-medium">{analysis.keyword}</h5>
                  <div className="text-xs text-gray-500">Positions actuelles</div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Votre position</div>
                    <Badge className={getPositionColor(analysis.yourPosition)}>
                      #{analysis.yourPosition}
                    </Badge>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Concurrent leader</div>
                    <Badge className={getPositionColor(analysis.comp1Position)}>
                      #{analysis.comp1Position}
                    </Badge>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Concurrent 2</div>
                    <Badge className={getPositionColor(analysis.comp2Position)}>
                      #{analysis.comp2Position}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className={`flex items-center gap-2 ${trend1.color}`}>
                    <trend1.icon className="h-4 w-4" />
                    <span>vs Leader: {trend1.text}</span>
                  </div>
                  <div className={`flex items-center gap-2 ${trend2.color}`}>
                    <trend2.icon className="h-4 w-4" />
                    <span>vs Concurrent 2: {trend2.text}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CompetitorPositionsTab;
