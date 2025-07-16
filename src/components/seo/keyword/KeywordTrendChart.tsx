
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { KeywordTrend } from "@/types/seo/Keyword";

interface KeywordTrendChartProps {
  trend: KeywordTrend;
  keyword?: string;
}

const KeywordTrendChart: React.FC<KeywordTrendChartProps> = ({ trend, keyword }) => {
  // Générer des données de démonstration si aucune donnée n'est fournie
  const chartData = trend?.data || Array(12).fill(0).map(() => Math.floor(Math.random() * 100));
  const growth = trend?.growth || 0;
  const seasonal = trend?.seasonal || false;

  const getTrendIcon = () => {
    if (growth > 10) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (growth < -10) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getTrendColor = () => {
    if (growth > 10) return 'text-green-600';
    if (growth < -10) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Tendance de recherche</span>
          <div className="flex items-center gap-2">
            {getTrendIcon()}
            <span className={`text-sm ${getTrendColor()}`}>
              {growth > 0 ? '+' : ''}{growth}%
            </span>
          </div>
        </CardTitle>
        {keyword && (
          <p className="text-sm text-gray-600">Évolution pour "{keyword}"</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Graphique simple avec barres */}
          <div className="h-40 flex items-end justify-between gap-1">
            {chartData.map((value, index) => (
              <div
                key={index}
                className="bg-blue-500 rounded-t flex-1 min-h-[4px]"
                style={{ height: `${(value / Math.max(...chartData)) * 100}%` }}
                title={`Mois ${index + 1}: ${value}`}
              />
            ))}
          </div>
          
          {/* Labels des mois */}
          <div className="flex justify-between text-xs text-gray-500">
            {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 
              'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'].map((month, index) => (
              <span key={index}>{month}</span>
            ))}
          </div>

          {/* Métriques */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <div className="text-sm text-gray-600">Croissance</div>
              <div className={`text-lg font-semibold ${getTrendColor()}`}>
                {growth > 0 ? '+' : ''}{growth}%
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Saisonnalité</div>
              <Badge variant={seasonal ? "default" : "secondary"}>
                {seasonal ? "Saisonnière" : "Stable"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KeywordTrendChart;
