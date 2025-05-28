
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, TrendingUp, TrendingDown } from "lucide-react";

interface SeasonalTrendsProps {
  keyword: string;
}

const SeasonalTrends: React.FC<SeasonalTrendsProps> = ({ keyword }) => {
  // Données simulées pour les tendances saisonnières
  const monthlyData = [
    { month: 'Jan', volume: 1200, growth: -15 },
    { month: 'Fév', volume: 1100, growth: -8 },
    { month: 'Mar', volume: 1350, growth: 23 },
    { month: 'Avr', volume: 1800, growth: 33 },
    { month: 'Mai', volume: 2200, growth: 22 },
    { month: 'Jun', volume: 2100, growth: -5 },
    { month: 'Jul', volume: 1900, growth: -10 },
    { month: 'Aoû', volume: 1700, growth: -11 },
    { month: 'Sep', volume: 2000, growth: 18 },
    { month: 'Oct', volume: 2300, growth: 15 },
    { month: 'Nov', volume: 2800, growth: 22 },
    { month: 'Déc', volume: 3200, growth: 14 }
  ];

  const maxVolume = Math.max(...monthlyData.map(d => d.volume));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-500" />
          Tendances saisonnières
        </CardTitle>
        <p className="text-sm text-gray-600">
          Analyse des variations mensuelles pour "{keyword}"
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Graphique en barres simple */}
          <div className="h-32 flex items-end justify-between gap-1">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <div
                  className="bg-blue-500 rounded-t w-full min-h-[4px]"
                  style={{ 
                    height: `${(data.volume / maxVolume) * 100}%`,
                    minWidth: '16px'
                  }}
                  title={`${data.month}: ${data.volume} recherches`}
                />
                <span className="text-xs text-gray-500">{data.month}</span>
              </div>
            ))}
          </div>

          {/* Insights saisonniers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Pic saisonnier</span>
              </div>
              <p className="text-sm text-green-700">
                Décembre: +14% de volume de recherche
              </p>
            </div>
            
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-orange-800">Période creuse</span>
              </div>
              <p className="text-sm text-orange-700">
                Février: -8% de volume de recherche
              </p>
            </div>
          </div>

          {/* Recommandations */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Recommandations</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Intensifiez le contenu en octobre-décembre</li>
              <li>• Préparez des campagnes pour les pics saisonniers</li>
              <li>• Optimisez le budget publicitaire en fonction des tendances</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeasonalTrends;
