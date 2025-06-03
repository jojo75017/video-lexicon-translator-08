
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import { TrendingUp, TrendingDown, BarChart3, Calendar } from 'lucide-react';

interface KeywordTrendAnalyzerProps {
  keywords: KeywordSuggestion[];
}

const KeywordTrendAnalyzer: React.FC<KeywordTrendAnalyzerProps> = ({ keywords }) => {
  const trendAnalysis = useMemo(() => {
    if (keywords.length === 0) return null;

    // Générer des données de tendance fictives mais réalistes
    const trendsData = keywords.map(kw => {
      const trend = Array.from({ length: 12 }, () => Math.random() * 100);
      const avgTrend = trend.reduce((a, b) => a + b, 0) / trend.length;
      const lastMonthTrend = trend.slice(-3).reduce((a, b) => a + b, 0) / 3;
      const growth = ((lastMonthTrend - avgTrend) / avgTrend) * 100;
      
      return {
        ...kw,
        trend,
        growth: growth.toFixed(1),
        isGrowing: growth > 5,
        isStable: Math.abs(growth) <= 5,
        isDecreasing: growth < -5
      };
    });

    const growingKeywords = trendsData.filter(kw => kw.isGrowing);
    const stableKeywords = trendsData.filter(kw => kw.isStable);
    const decreasingKeywords = trendsData.filter(kw => kw.isDecreasing);

    return {
      trendsData,
      growingKeywords,
      stableKeywords,
      decreasingKeywords,
      totalGrowthRate: (growingKeywords.reduce((sum, kw) => sum + parseFloat(kw.growth), 0) / growingKeywords.length).toFixed(1)
    };
  }, [keywords]);

  if (!trendAnalysis || keywords.length === 0) {
    return (
      <Card className="p-6 text-center">
        <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">Aucune donnée de tendance disponible</p>
      </Card>
    );
  }

  const { trendsData, growingKeywords, stableKeywords, decreasingKeywords } = trendAnalysis;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Analyse des tendances</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{growingKeywords.length}</div>
            <div className="text-sm text-green-700">En croissance</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <BarChart3 className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{stableKeywords.length}</div>
            <div className="text-sm text-blue-700">Stables</div>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <TrendingDown className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">{decreasingKeywords.length}</div>
            <div className="text-sm text-red-700">En baisse</div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Mots-clés en forte croissance</h4>
          {growingKeywords.slice(0, 5).map((kw, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
              <div>
                <div className="font-medium">{kw.keyword}</div>
                <div className="text-sm text-gray-600">
                  Volume: {kw.volume?.toLocaleString()} • Difficulté: {kw.difficulty}
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-green-100 text-green-800">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{kw.growth}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Prédictions saisonnières</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Hiver', 'Printemps', 'Été', 'Automne'].map((saison, index) => {
            const seasonalKeywords = trendsData.filter(kw => 
              kw.keyword.toLowerCase().includes(saison.toLowerCase()) ||
              (index === 0 && kw.keyword.toLowerCase().includes('noël')) ||
              (index === 1 && kw.keyword.toLowerCase().includes('jardin')) ||
              (index === 2 && kw.keyword.toLowerCase().includes('vacances')) ||
              (index === 3 && kw.keyword.toLowerCase().includes('rentrée'))
            );

            return (
              <div key={saison} className="text-center p-4 border rounded-lg">
                <div className="text-lg font-semibold">{saison}</div>
                <div className="text-sm text-gray-600">{seasonalKeywords.length} mots-clés</div>
                {seasonalKeywords.length > 0 && (
                  <div className="text-xs text-blue-600 mt-1">
                    Opportunité détectée
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default KeywordTrendAnalyzer;
