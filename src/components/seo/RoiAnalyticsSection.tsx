
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Users, Target } from 'lucide-react';

interface RoiAnalyticsSectionProps {
  keywords: any[];
  traffic: number;
  conversion: number;
}

const RoiAnalyticsSection: React.FC<RoiAnalyticsSectionProps> = ({ 
  keywords = [], 
  traffic = 0, 
  conversion = 0 
}) => {
  const potentialRevenue = Math.floor(traffic * (conversion / 100) * 45);
  const topKeywords = keywords.slice(0, 5);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          Potentiel ROI SEO
        </CardTitle>
        <p className="text-sm text-gray-600">
          Estimation basée sur les mots-clés détectés
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Trafic potentiel</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">{traffic.toLocaleString()}</div>
            <div className="text-xs text-blue-600">visiteurs/mois</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Conversion</span>
            </div>
            <div className="text-2xl font-bold text-green-900">{conversion.toFixed(1)}%</div>
            <div className="text-xs text-green-600">taux estimé</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Revenus potentiels</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">{potentialRevenue.toLocaleString()}€</div>
            <div className="text-xs text-purple-600">par mois</div>
          </div>
        </div>
        
        {topKeywords.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Top 5 opportunités
            </h4>
            <div className="space-y-2">
              {topKeywords.map((keyword, index) => {
                const monthlyValue = Math.floor(keyword.volume * keyword.cpc * 0.1);
                return (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">{keyword.keyword}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{monthlyValue}€/mois</Badge>
                      <span className="text-xs text-gray-500">{keyword.volume} vol</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        <div className="mt-6 p-4 bg-amber-50 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> Ces estimations sont basées sur les données de mots-clés détectés. 
            Pour des projections plus précises, une analyse approfondie est recommandée.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoiAnalyticsSection;
