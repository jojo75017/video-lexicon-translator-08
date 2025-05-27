
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KeywordSuggestion } from "@/types/seo/Keyword";
import { Target, TrendingUp } from 'lucide-react';

interface KeywordOpportunityChartProps {
  keywords: KeywordSuggestion[];
}

const KeywordOpportunityChart: React.FC<KeywordOpportunityChartProps> = ({ keywords }) => {
  // Calculer le score d'opportunité pour chaque mot-clé
  const calculateOpportunityScore = (keyword: KeywordSuggestion): number => {
    const volume = keyword.volume || 0;
    const difficulty = keyword.difficulty || 100;
    const cpc = keyword.cpc || 0;
    
    // Score basé sur volume élevé, difficulté faible, et CPC élevé
    return Math.round(((volume / 1000) + (100 - difficulty) + (cpc * 10)) / 3);
  };

  const opportunityKeywords = keywords
    .map(keyword => ({
      ...keyword,
      opportunityScore: calculateOpportunityScore(keyword)
    }))
    .sort((a, b) => b.opportunityScore - a.opportunityScore)
    .slice(0, 10);

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'bg-green-100 text-green-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="h-5 w-5 text-orange-600" />
          Opportunités de mots-clés
        </CardTitle>
        <p className="text-sm text-gray-600">
          Mots-clés avec le meilleur potentiel ROI
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {opportunityKeywords.map((keyword, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <div className="font-medium text-gray-900">{keyword.keyword}</div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                  <span>Vol: {keyword.volume?.toLocaleString() || 0}</span>
                  <span>Diff: {keyword.difficulty || 0}</span>
                  <span>CPC: {keyword.cpc?.toFixed(2) || '0.00'}€</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getScoreColor(keyword.opportunityScore)}>
                  {keyword.opportunityScore}/100
                </Badge>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </div>
          ))}
          
          {opportunityKeywords.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Aucune opportunité détectée</p>
              <p className="text-xs">Ajoutez des mots-clés pour voir les opportunités</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KeywordOpportunityChart;
