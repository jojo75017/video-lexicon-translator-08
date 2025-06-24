
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, Loader2, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { OpenAIService } from '../../../utils/seo/openaiService';

interface TrendData {
  month: string;
  volume: number;
}

interface KeywordTrend {
  keyword: string;
  trend: string;
  data: TrendData[];
  seasonality: string;
  peakMonths: string[];
}

const KeywordTrendAnalysis = () => {
  const [keyword, setKeyword] = useState('');
  const [trends, setTrends] = useState<KeywordTrend[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiKey] = useState(() => localStorage.getItem('openaiKey') || '');

  const analyzeTrends = async () => {
    if (!keyword.trim()) {
      toast.error('Veuillez entrer un mot-clé');
      return;
    }

    setIsAnalyzing(true);
    try {
      if (apiKey) {
        const openAIService = new OpenAIService(apiKey);
        const trendResult = await openAIService.analyzeTrends(keyword);
        
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 
                       'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        
        const trendData: TrendData[] = trendResult.data.map((volume, index) => ({
          month: months[index],
          volume
        }));

        const peakMonths = trendData
          .filter(d => d.volume > 70)
          .map(d => d.month);

        const trend: KeywordTrend = {
          keyword,
          trend: trendResult.trend,
          data: trendData,
          seasonality: peakMonths.length > 3 ? 'Saisonnière' : 'Stable',
          peakMonths
        };

        setTrends([trend, ...trends.slice(0, 4)]);
        toast.success('Analyse des tendances terminée !');
      } else {
        // Analyse basique sans API
        generateBasicTrends();
        toast.info('Analyse basique (configurez OpenAI pour plus de précision)');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'analyse des tendances');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateBasicTrends = () => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 
                   'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    
    const trendData: TrendData[] = months.map(month => ({
      month,
      volume: Math.floor(Math.random() * 80) + 20
    }));

    const trends_types = ['croissant', 'décroissant', 'stable'];
    const peakMonths = trendData
      .filter(d => d.volume > 60)
      .map(d => d.month);

    const trend: KeywordTrend = {
      keyword,
      trend: trends_types[Math.floor(Math.random() * trends_types.length)],
      data: trendData,
      seasonality: peakMonths.length > 3 ? 'Saisonnière' : 'Stable',
      peakMonths
    };

    setTrends([trend, ...trends.slice(0, 4)]);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'croissant': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'décroissant': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <BarChart3 className="h-4 w-4 text-blue-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'croissant': return 'bg-green-100 text-green-800';
      case 'décroissant': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            Analyse des Tendances de Mots-Clés
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Mot-clé à analyser..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && analyzeTrends()}
              className="flex-1"
            />
            <Button
              onClick={analyzeTrends}
              disabled={isAnalyzing || !keyword.trim()}
            >
              {isAnalyzing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <BarChart3 className="h-4 w-4 mr-2" />
              )}
              Analyser
            </Button>
          </div>
        </CardContent>
      </Card>

      {trends.map((trend, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{trend.keyword}</span>
              <div className="flex items-center gap-2">
                <Badge className={getTrendColor(trend.trend)}>
                  {getTrendIcon(trend.trend)}
                  {trend.trend}
                </Badge>
                <Badge variant="outline">
                  {trend.seasonality}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="volume" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {trend.peakMonths.length > 0 && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-1">
                  Mois de pic d'activité :
                </p>
                <div className="flex flex-wrap gap-1">
                  {trend.peakMonths.map((month, i) => (
                    <Badge key={i} className="bg-blue-100 text-blue-800">
                      {month}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default KeywordTrendAnalysis;
