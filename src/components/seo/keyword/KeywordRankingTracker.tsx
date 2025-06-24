
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Eye, Search } from "lucide-react";
import { toast } from "sonner";

const KeywordRankingTracker = () => {
  const [url, setUrl] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [rankings, setRankings] = useState<any[]>([]);

  const trackRankings = async () => {
    if (!url.trim() || !keywords.trim()) {
      toast.error("Veuillez entrer une URL et des mots-clés");
      return;
    }

    setIsTracking(true);
    
    setTimeout(() => {
      const keywordList = keywords.split(',').map(k => k.trim());
      const mockRankings = keywordList.map(keyword => ({
        keyword,
        currentPosition: Math.floor(Math.random() * 50) + 1,
        previousPosition: Math.floor(Math.random() * 50) + 1,
        change: Math.floor(Math.random() * 20) - 10,
        searchVolume: Math.floor(Math.random() * 5000) + 100,
        clicks: Math.floor(Math.random() * 200) + 10,
        impressions: Math.floor(Math.random() * 2000) + 100,
        ctr: (Math.random() * 10).toFixed(1),
        history: Array.from({ length: 30 }, () => Math.floor(Math.random() * 50) + 1)
      }));

      setRankings(mockRankings);
      setIsTracking(false);
      toast.success(`Suivi des positions démarré pour ${keywordList.length} mots-clés`);
    }, 2500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-purple-600" />
          Suivi de Positions SEO
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="URL du site (ex: monsite.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Input
            placeholder="Mots-clés (séparés par des virgules)"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>
        
        <Button onClick={trackRankings} disabled={isTracking} className="w-full">
          {isTracking ? 'Analyse des positions...' : 'Commencer le suivi'}
        </Button>

        {rankings.length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <h4 className="font-medium text-gray-600">Position moyenne</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(rankings.reduce((acc, r) => acc + r.currentPosition, 0) / rankings.length)}
                </p>
              </Card>
              <Card className="p-4 text-center">
                <h4 className="font-medium text-gray-600">Clics totaux</h4>
                <p className="text-2xl font-bold text-green-600">
                  {rankings.reduce((acc, r) => acc + r.clicks, 0)}
                </p>
              </Card>
              <Card className="p-4 text-center">
                <h4 className="font-medium text-gray-600">CTR moyen</h4>
                <p className="text-2xl font-bold text-orange-600">
                  {(rankings.reduce((acc, r) => acc + parseFloat(r.ctr), 0) / rankings.length).toFixed(1)}%
                </p>
              </Card>
            </div>

            <div>
              <h3 className="font-medium mb-3">Évolution des positions</h3>
              <div className="space-y-3">
                {rankings.map((ranking, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{ranking.keyword}</h4>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          Position {ranking.currentPosition}
                        </Badge>
                        <Badge className={`flex items-center gap-1 ${
                          ranking.change > 0 ? 'bg-green-100 text-green-800' :
                          ranking.change < 0 ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {ranking.change > 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : ranking.change < 0 ? (
                            <TrendingDown className="h-3 w-3" />
                          ) : null}
                          {ranking.change > 0 ? '+' : ''}{ranking.change}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-500">Volume:</span>
                        <span className="ml-1 font-medium">{ranking.searchVolume}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Clics:</span>
                        <span className="ml-1 font-medium">{ranking.clicks}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Impressions:</span>
                        <span className="ml-1 font-medium">{ranking.impressions}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">CTR:</span>
                        <span className="ml-1 font-medium">{ranking.ctr}%</span>
                      </div>
                    </div>

                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={ranking.history.map((pos: number, i: number) => ({ day: i + 1, position: pos }))}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis reversed domain={[1, 50]} />
                          <Tooltip />
                          <Line type="monotone" dataKey="position" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KeywordRankingTracker;
