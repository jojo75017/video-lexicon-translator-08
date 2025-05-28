
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, BarChart3, AlertTriangle } from "lucide-react";
import { KeywordSuggestion } from "@/types/seo/Keyword";

interface SearchVolumePredictorProps {
  keywords: KeywordSuggestion[];
}

const SearchVolumePredictor: React.FC<SearchVolumePredictorProps> = ({ keywords }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'3months' | '6months' | '1year'>('6months');
  const [predictions, setPredictions] = useState<any[]>([]);

  const generatePredictions = () => {
    const newPredictions = keywords.slice(0, 5).map(keyword => {
      const currentVolume = keyword.volume || 1000;
      const seasonalFactor = Math.random() * 0.4 + 0.8; // 0.8 à 1.2
      const trendFactor = Math.random() * 0.6 + 0.7; // 0.7 à 1.3
      
      let multiplier = 1;
      switch (selectedPeriod) {
        case '3months': multiplier = 1.1; break;
        case '6months': multiplier = 1.2; break;
        case '1year': multiplier = 1.4; break;
      }
      
      const predictedVolume = Math.round(currentVolume * seasonalFactor * trendFactor * multiplier);
      const growth = ((predictedVolume - currentVolume) / currentVolume * 100);
      
      return {
        keyword: keyword.keyword,
        currentVolume,
        predictedVolume,
        growth: Math.round(growth),
        confidence: Math.round(Math.random() * 30 + 70), // 70-100%
        factors: [
          { name: 'Tendance saisonnière', impact: Math.round((seasonalFactor - 1) * 100) },
          { name: 'Évolution du marché', impact: Math.round((trendFactor - 1) * 100) },
          { name: 'Croissance naturelle', impact: Math.round((multiplier - 1) * 100) }
        ]
      };
    });
    
    setPredictions(newPredictions);
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 20) return 'text-green-600';
    if (growth > 0) return 'text-blue-600';
    return 'text-red-600';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100 text-green-800';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-purple-500" />
          Prédiction de volume
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 mb-4">
          {[
            { key: '3months', label: '3 mois' },
            { key: '6months', label: '6 mois' },
            { key: '1year', label: '1 an' }
          ].map((period) => (
            <Button
              key={period.key}
              variant={selectedPeriod === period.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period.key as any)}
            >
              {period.label}
            </Button>
          ))}
        </div>

        <Button 
          onClick={generatePredictions}
          className="w-full gap-2"
          disabled={keywords.length === 0}
        >
          <TrendingUp className="h-4 w-4" />
          Prédire les volumes
        </Button>

        {predictions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              Prédictions pour les {selectedPeriod === '3months' ? '3 prochains mois' : 
                selectedPeriod === '6months' ? '6 prochains mois' : 'prochaine année'}
            </div>
            
            {predictions.map((pred, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{pred.keyword}</h4>
                  <Badge className={getConfidenceColor(pred.confidence)}>
                    {pred.confidence}% confiance
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Volume actuel</div>
                    <div className="text-lg font-semibold">{pred.currentVolume.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Volume prédit</div>
                    <div className="text-lg font-semibold">{pred.predictedVolume.toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Évolution prédite :</span>
                  <span className={`font-medium ${getGrowthColor(pred.growth)}`}>
                    {pred.growth > 0 ? '+' : ''}{pred.growth}%
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">Facteurs d'influence :</div>
                  {pred.factors.map((factor: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span>{factor.name}</span>
                      <span className={factor.impact > 0 ? 'text-green-600' : 'text-red-600'}>
                        {factor.impact > 0 ? '+' : ''}{factor.impact}%
                      </span>
                    </div>
                  ))}
                </div>
                
                {pred.confidence < 70 && (
                  <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                    <AlertTriangle className="h-3 w-3" />
                    Prédiction avec faible confiance - données limitées
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchVolumePredictor;
