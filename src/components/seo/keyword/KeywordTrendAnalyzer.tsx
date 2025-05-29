
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Calendar, BarChart3, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { KeywordSuggestion } from "@/types/seo/Keyword";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface KeywordTrendAnalyzerProps {
  keywords: KeywordSuggestion[];
}

interface TrendData {
  month: string;
  volume: number;
  competition: number;
  cpc: number;
  trend: 'up' | 'down' | 'stable';
}

interface KeywordTrend {
  keyword: string;
  currentVolume: number;
  yearOverYearGrowth: number;
  seasonality: 'high' | 'medium' | 'low';
  trendDirection: 'growing' | 'declining' | 'stable';
  peakMonths: string[];
  lowMonths: string[];
  volatility: number;
  historicalData: TrendData[];
  forecast: TrendData[];
}

const KeywordTrendAnalyzer: React.FC<KeywordTrendAnalyzerProps> = ({ keywords }) => {
  const [trends, setTrends] = useState<KeywordTrend[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState<string>('');

  const generateTrendAnalysis = async () => {
    if (keywords.length === 0) {
      toast.error("Aucun mot-clé à analyser");
      return;
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      const trendAnalysis: KeywordTrend[] = keywords.slice(0, 6).map((keyword) => {
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        
        // Génération de données historiques
        const historicalData: TrendData[] = months.map((month, index) => {
          const baseVolume = keyword.volume || 1000;
          const seasonalFactor = 1 + Math.sin((index / 12) * 2 * Math.PI) * 0.3;
          const randomFactor = 0.8 + Math.random() * 0.4;
          
          return {
            month,
            volume: Math.round(baseVolume * seasonalFactor * randomFactor),
            competition: Math.random() * 100,
            cpc: (keyword.cpc || 1) * (0.8 + Math.random() * 0.4),
            trend: Math.random() > 0.5 ? 'up' : (Math.random() > 0.5 ? 'down' : 'stable') as 'up' | 'down' | 'stable'
          };
        });

        // Génération de prévisions
        const forecast: TrendData[] = ['Jan+1', 'Fév+1', 'Mar+1'].map((month) => {
          const lastVolume = historicalData[historicalData.length - 1].volume;
          const trendFactor = 0.95 + Math.random() * 0.1;
          
          return {
            month,
            volume: Math.round(lastVolume * trendFactor),
            competition: Math.random() * 100,
            cpc: (keyword.cpc || 1) * (0.9 + Math.random() * 0.2),
            trend: Math.random() > 0.6 ? 'up' : 'stable' as 'up' | 'down' | 'stable'
          };
        });

        const yearOverYearGrowth = (Math.random() - 0.5) * 100; // -50% à +50%
        const volatility = Math.random() * 40; // 0-40%
        
        const seasonalities: KeywordTrend['seasonality'][] = ['high', 'medium', 'low'];
        const directions: KeywordTrend['trendDirection'][] = ['growing', 'declining', 'stable'];

        return {
          keyword: keyword.keyword,
          currentVolume: keyword.volume || 1000,
          yearOverYearGrowth,
          seasonality: seasonalities[Math.floor(Math.random() * seasonalities.length)],
          trendDirection: directions[Math.floor(Math.random() * directions.length)],
          peakMonths: ['Déc', 'Jan', 'Nov'],
          lowMonths: ['Fév', 'Aoû'],
          volatility,
          historicalData,
          forecast
        };
      });

      setTrends(trendAnalysis);
      setSelectedKeyword(trendAnalysis[0]?.keyword || '');
      setIsAnalyzing(false);
      toast.success(`${trendAnalysis.length} analyses de tendances générées`);
    }, 3000);
  };

  const getTrendIcon = (direction: KeywordTrend['trendDirection']) => {
    switch (direction) {
      case 'growing': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable': return <BarChart3 className="h-4 w-4 text-gray-500" />;
    }
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 20) return 'bg-green-100 text-green-800';
    if (growth > 0) return 'bg-blue-100 text-blue-800';
    if (growth > -20) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const selectedTrend = trends.find(t => t.keyword === selectedKeyword);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          Analyseur de tendances des mots-clés
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={generateTrendAnalysis}
          disabled={isAnalyzing || keywords.length === 0}
          className="w-full gap-2"
        >
          {isAnalyzing ? (
            <>Analyse des tendances en cours...</>
          ) : (
            <>
              <Calendar className="h-4 w-4" />
              Analyser les tendances
            </>
          )}
        </Button>

        {trends.length > 0 && (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="details">Détails</TabsTrigger>
              <TabsTrigger value="forecast">Prévisions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-3">
                {trends.map((trend, index) => (
                  <div 
                    key={index} 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedKeyword === trend.keyword ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedKeyword(trend.keyword)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{trend.keyword}</h4>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(trend.trendDirection)}
                        <Badge className={getGrowthColor(trend.yearOverYearGrowth)}>
                          {trend.yearOverYearGrowth > 0 ? '+' : ''}{trend.yearOverYearGrowth.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Volume actuel:</span>
                        <div className="font-medium">{trend.currentVolume.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Saisonnalité:</span>
                        <div className="font-medium capitalize">{trend.seasonality}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Volatilité:</span>
                        <div className="font-medium">{trend.volatility.toFixed(1)}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              {selectedTrend && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-medium">{selectedTrend.keyword}</h4>
                    {getTrendIcon(selectedTrend.trendDirection)}
                  </div>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedTrend.historicalData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h5 className="font-medium text-green-800 mb-2">Mois de pic</h5>
                      <div className="flex flex-wrap gap-1">
                        {selectedTrend.peakMonths.map((month, idx) => (
                          <Badge key={idx} className="bg-green-100 text-green-800">
                            {month}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <h5 className="font-medium text-red-800 mb-2">Mois creux</h5>
                      <div className="flex flex-wrap gap-1">
                        {selectedTrend.lowMonths.map((month, idx) => (
                          <Badge key={idx} className="bg-red-100 text-red-800">
                            {month}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="forecast" className="space-y-4">
              {selectedTrend && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-medium">Prévisions pour {selectedTrend.keyword}</h4>
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  </div>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[...selectedTrend.historicalData.slice(-6), ...selectedTrend.forecast]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="volume" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-2">Recommandations stratégiques</h5>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li>• Augmenter les investissements pendant les mois de pic</li>
                      <li>• Préparer du contenu saisonnier à l'avance</li>
                      <li>• Diversifier avec des mots-clés complémentaires</li>
                      <li>• Surveiller la volatilité du marché</li>
                    </ul>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default KeywordTrendAnalyzer;
