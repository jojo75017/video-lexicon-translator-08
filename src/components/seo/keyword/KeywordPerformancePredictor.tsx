
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import { BarChart3, TrendingUp, Target, Calculator } from 'lucide-react';

interface KeywordPerformanceePredictorProps {
  keywords: KeywordSuggestion[];
}

const KeywordPerformancePredictor: React.FC<KeywordPerformanceePredictorProps> = ({ keywords }) => {
  const [budget, setBudget] = useState('1000');
  const [timeframe, setTimeframe] = useState('6');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  const predictPerformance = (keyword: KeywordSuggestion, monthlyBudget: number) => {
    const ctr = Math.max(0.02, 0.1 - (keyword.difficulty / 1000));
    const avgPosition = Math.max(1, 15 - (monthlyBudget / keyword.cpc / 10));
    const estimatedClicks = Math.round((keyword.volume * ctr) / 4.33); // Monthly clicks
    const estimatedCost = estimatedClicks * keyword.cpc;
    const conversionRate = 0.02; // 2% conversion rate
    const estimatedConversions = Math.round(estimatedClicks * conversionRate);
    
    return {
      estimatedClicks,
      estimatedCost: Math.min(estimatedCost, monthlyBudget),
      avgPosition,
      estimatedConversions,
      roi: estimatedConversions * 50 - estimatedCost // Assuming 50€ per conversion
    };
  };

  const toggleKeywordSelection = (keyword: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  const monthlyBudget = parseFloat(budget) || 0;
  const months = parseInt(timeframe) || 6;

  const predictions = keywords.map(kw => ({
    ...kw,
    performance: predictPerformance(kw, monthlyBudget / keywords.length)
  })).sort((a, b) => b.performance.roi - a.performance.roi);

  const totalBudget = monthlyBudget * months;
  const totalClicks = predictions.reduce((sum, p) => sum + p.performance.estimatedClicks, 0) * months;
  const totalConversions = predictions.reduce((sum, p) => sum + p.performance.estimatedConversions, 0) * months;
  const totalROI = predictions.reduce((sum, p) => sum + p.performance.roi, 0) * months;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-semibold">Prédicteur de performance</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Budget mensuel (€)</label>
          <Input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="1000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Période (mois)</label>
          <Input
            type="number"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            placeholder="6"
          />
        </div>
        <div className="flex items-end">
          <Button className="w-full">
            <Calculator className="h-4 w-4 mr-2" />
            Calculer
          </Button>
        </div>
      </div>

      {monthlyBudget > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{totalBudget.toLocaleString()}€</div>
              <div className="text-sm text-gray-600">Budget total</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{totalClicks.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Clics estimés</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">{totalConversions}</div>
              <div className="text-sm text-gray-600">Conversions</div>
            </div>
            <div className="text-center">
              <div className={`text-xl font-bold ${totalROI > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalROI > 0 ? '+' : ''}{totalROI.toLocaleString()}€
              </div>
              <div className="text-sm text-gray-600">ROI estimé</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Prédictions par mot-clé</h4>
            {predictions.slice(0, 10).map((keyword, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="font-medium">{keyword.keyword}</div>
                  <div className="text-sm text-gray-600">
                    Volume: {keyword.volume.toLocaleString()} • CPC: {keyword.cpc}€ • Difficulté: {keyword.difficulty}
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-sm">
                    <span className="font-medium">{keyword.performance.estimatedClicks}</span> clics/mois
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{keyword.performance.estimatedConversions}</span> conv/mois
                  </div>
                  <Badge 
                    variant={keyword.performance.roi > 0 ? "default" : "destructive"}
                    className="text-xs"
                  >
                    ROI: {keyword.performance.roi > 0 ? '+' : ''}{Math.round(keyword.performance.roi)}€/mois
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
};

export default KeywordPerformancePredictor;
