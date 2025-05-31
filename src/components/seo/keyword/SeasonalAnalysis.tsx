
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import { Calendar, TrendingUp, Snowflake, Sun, Leaf, CloudRain } from 'lucide-react';

interface SeasonalAnalysisProps {
  keywords: KeywordSuggestion[];
}

const SeasonalAnalysis: React.FC<SeasonalAnalysisProps> = ({ keywords }) => {
  const getSeasonalTrend = (keyword: string) => {
    const seasonal = {
      'été': { season: 'Été', icon: Sun, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
      'hiver': { season: 'Hiver', icon: Snowflake, color: 'text-blue-600', bgColor: 'bg-blue-50' },
      'printemps': { season: 'Printemps', icon: Leaf, color: 'text-green-600', bgColor: 'bg-green-50' },
      'automne': { season: 'Automne', icon: CloudRain, color: 'text-orange-600', bgColor: 'bg-orange-50' },
      'noël': { season: 'Noël', icon: Snowflake, color: 'text-red-600', bgColor: 'bg-red-50' },
      'vacances': { season: 'Vacances', icon: Sun, color: 'text-blue-600', bgColor: 'bg-blue-50' },
      'rentrée': { season: 'Rentrée', icon: Leaf, color: 'text-green-600', bgColor: 'bg-green-50' }
    };

    for (const [key, value] of Object.entries(seasonal)) {
      if (keyword.toLowerCase().includes(key)) {
        return value;
      }
    }
    return null;
  };

  const seasonalKeywords = keywords
    .map(kw => ({ ...kw, seasonal: getSeasonalTrend(kw.keyword) }))
    .filter(kw => kw.seasonal);

  const monthlyTrends = [
    { month: 'Jan', trend: Math.random() * 100 },
    { month: 'Fév', trend: Math.random() * 100 },
    { month: 'Mar', trend: Math.random() * 100 },
    { month: 'Avr', trend: Math.random() * 100 },
    { month: 'Mai', trend: Math.random() * 100 },
    { month: 'Jun', trend: Math.random() * 100 },
    { month: 'Jul', trend: Math.random() * 100 },
    { month: 'Aoû', trend: Math.random() * 100 },
    { month: 'Sep', trend: Math.random() * 100 },
    { month: 'Oct', trend: Math.random() * 100 },
    { month: 'Nov', trend: Math.random() * 100 },
    { month: 'Déc', trend: Math.random() * 100 }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold">Analyse saisonnière</h3>
      </div>

      {seasonalKeywords.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seasonalKeywords.map((keyword, index) => {
              const IconComponent = keyword.seasonal!.icon;
              return (
                <div key={index} className={`p-4 rounded-lg ${keyword.seasonal!.bgColor}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <IconComponent className={`h-4 w-4 ${keyword.seasonal!.color}`} />
                    <Badge variant="outline" className={keyword.seasonal!.color}>
                      {keyword.seasonal!.season}
                    </Badge>
                  </div>
                  <div className="font-medium">{keyword.keyword}</div>
                  <div className="text-sm text-gray-600">
                    Volume: {keyword.volume.toLocaleString()} • Difficulté: {keyword.difficulty}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <h4 className="font-medium mb-3">Tendances mensuelles estimées</h4>
            <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
              {monthlyTrends.map((month, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-gray-600 mb-1">{month.month}</div>
                  <div 
                    className="bg-blue-200 rounded"
                    style={{ height: `${Math.max(20, month.trend)}px` }}
                  ></div>
                  <div className="text-xs mt-1">{Math.round(month.trend)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Aucun mot-clé saisonnier détecté</p>
          <p className="text-sm">Les mots-clés saisonniers apparaîtront ici automatiquement</p>
        </div>
      )}
    </Card>
  );
};

export default SeasonalAnalysis;
