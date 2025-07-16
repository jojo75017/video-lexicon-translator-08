
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, BarChart3, Target } from "lucide-react";
import { toast } from "sonner";
import { KeywordSuggestion } from "@/types/seo/Keyword";

interface RankingTrackerProps {
  keywords: KeywordSuggestion[];
}

interface RankingData {
  keyword: string;
  currentPosition: number;
  previousPosition: number;
  bestPosition: number;
  url: string;
  searchVolume: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

const RankingTracker: React.FC<RankingTrackerProps> = ({ keywords }) => {
  const [domain, setDomain] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [rankings, setRankings] = useState<RankingData[]>([]);

  const startTracking = async () => {
    if (!domain.trim()) {
      toast.error("Veuillez entrer votre domaine");
      return;
    }

    if (keywords.length === 0) {
      toast.error("Aucun mot-clé à suivre");
      return;
    }

    setIsTracking(true);

    // Simulation du suivi de positions
    setTimeout(() => {
      const mockRankings: RankingData[] = keywords.slice(0, 10).map((keyword) => {
        const currentPos = Math.floor(Math.random() * 100) + 1;
        const previousPos = Math.floor(Math.random() * 100) + 1;
        const change = previousPos - currentPos;
        
        return {
          keyword: keyword.keyword,
          currentPosition: currentPos,
          previousPosition: previousPos,
          bestPosition: Math.min(currentPos, Math.floor(Math.random() * currentPos)),
          url: `${domain}/${keyword.keyword.toLowerCase().replace(/\s+/g, '-')}`,
          searchVolume: keyword.volume || 0,
          trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
          change: Math.abs(change)
        };
      });

      setRankings(mockRankings);
      setIsTracking(false);
      toast.success(`Suivi activé pour ${mockRankings.length} mots-clés`);
    }, 3000);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPositionColor = (position: number) => {
    if (position <= 3) return 'text-green-600 font-bold';
    if (position <= 10) return 'text-blue-600 font-medium';
    if (position <= 20) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-green-500" />
          Suivi de positions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Votre domaine</label>
          <Input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="w-full"
          />
        </div>

        <Button 
          onClick={startTracking}
          disabled={isTracking || keywords.length === 0}
          className="w-full gap-2"
        >
          {isTracking ? (
            <>Analyse en cours...</>
          ) : (
            <>
              <Target className="h-4 w-4" />
              Démarrer le suivi
            </>
          )}
        </Button>

        {isTracking && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">Vérification des positions...</span>
            </div>
            <Progress value={66} className="w-full" />
          </div>
        )}

        {rankings.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Positions actuelles</span>
              <span className="text-gray-500">{rankings.length} mots-clés suivis</span>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {rankings.map((ranking, index) => (
                <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{ranking.keyword}</span>
                      {getTrendIcon(ranking.trend)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg ${getPositionColor(ranking.currentPosition)}`}>
                        #{ranking.currentPosition}
                      </span>
                      {ranking.change > 0 && (
                        <Badge variant={ranking.trend === 'up' ? 'default' : 'destructive'} className="text-xs">
                          {ranking.trend === 'up' ? '+' : '-'}{ranking.change}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
                    <div>
                      <span className="block">Meilleure pos.</span>
                      <span className="font-medium">#{ranking.bestPosition}</span>
                    </div>
                    <div>
                      <span className="block">Volume</span>
                      <span className="font-medium">{ranking.searchVolume.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="block">Position préc.</span>
                      <span className="font-medium">#{ranking.previousPosition}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-blue-600 truncate">
                    {ranking.url}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RankingTracker;
