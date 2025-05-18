
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, ArrowRight, Search, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { RankingData, SearchConsoleData } from '@/types/seo/Ranking';

interface RankingTrackerProps {
  url: string;
}

const RankingTracker: React.FC<RankingTrackerProps> = ({ url }) => {
  const [rankingData, setRankingData] = useState<RankingData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Simule le chargement des données de classement
    setTimeout(() => {
      fetchRankingData();
    }, 1000);
  }, [url]);
  
  const fetchRankingData = () => {
    // Simule une requête API
    const mockData: RankingData = {
      totalImpressions: 12500,
      totalClicks: 850,
      averageCTR: "6.8%",
      averagePosition: 18.3,
      position: 18.3, // Pour compatibilité
      clicks: 850, // Pour compatibilité
      impressions: 12500, // Pour compatibilité
      keywords: [
        { query: "référencement naturel", clicks: 180, impressions: 2400, ctr: 7.5, position: 4.2, change: -0.3 },
        { query: "seo google", clicks: 145, impressions: 1800, ctr: 8.1, position: 6.5, change: 1.2 },
        { query: "optimisation site web", clicks: 95, impressions: 1320, ctr: 7.2, position: 8.7, change: 0.5 }
      ],
      topPages: [
        { query: "/blog/seo-techniques", clicks: 210, impressions: 2800, ctr: 7.5, position: 3.2, change: 0.8 },
        { query: "/services/referencement", clicks: 175, impressions: 2300, ctr: 7.6, position: 5.1, change: -0.2 },
        { query: "/outils-seo", clicks: 110, impressions: 1600, ctr: 6.9, position: 7.4, change: 2.1 }
      ],
      topQueries: [
        { query: "référencement naturel", clicks: 180, impressions: 2400, ctr: 7.5, position: 4.2, change: -0.3 },
        { query: "seo google", clicks: 145, impressions: 1800, ctr: 8.1, position: 6.5, change: 1.2 },
        { query: "optimisation site web", clicks: 95, impressions: 1320, ctr: 7.2, position: 8.7, change: 0.5 }
      ],
      optimizationOpportunities: [
        { query: "référencement local", clicks: 15, impressions: 980, ctr: 1.5, position: 25.3, change: 0 },
        { query: "audit seo", clicks: 8, impressions: 720, ctr: 1.1, position: 31.2, change: -2.4 },
        { query: "backlinks seo", clicks: 12, impressions: 850, ctr: 1.4, position: 28.7, change: 1.2 }
      ]
    };
    
    setRankingData(mockData);
    setLoading(false);
  };
  
  const renderChangeIndicator = (change: number | undefined) => {
    if (!change) return <Minus className="h-4 w-4 text-gray-500" />;
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  };
  
  const getChangeClass = (change: number | undefined) => {
    if (!change) return "text-gray-500";
    if (change > 0) return "text-green-500";
    return "text-red-500";
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Chargement des données de classement...</p>
        </CardContent>
      </Card>
    );
  }

  if (!rankingData) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Aucune donnée de classement disponible pour cette URL.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-t-4 border-t-purple-500">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Position moyenne</p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">{rankingData.position.toFixed(1)}</p>
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                {rankingData.position < 10 ? "TOP 10" : rankingData.position < 20 ? "TOP 20" : "TOP 50"}
              </Badge>
            </div>
            <Progress value={100 - Math.min(rankingData.position * 2, 100)} className="h-1.5 mt-2" />
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Clics</p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">{rankingData.clicks.toLocaleString()}</p>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                30 derniers jours
              </Badge>
            </div>
            <Progress value={Math.min(rankingData.clicks / 100, 100)} className="h-1.5 mt-2" />
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Impressions</p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">{rankingData.impressions.toLocaleString()}</p>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                CTR: {rankingData.averageCTR}
              </Badge>
            </div>
            <Progress value={Math.min(rankingData.impressions / 200, 100)} className="h-1.5 mt-2" />
          </div>
        </div>
        
        <Tabs defaultValue="keywords">
          <TabsList className="mb-4">
            <TabsTrigger value="keywords" className="flex items-center gap-1">
              <Search className="h-4 w-4" />
              Mots-clés
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Pages
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="keywords">
            <h3 className="font-medium mb-3">Mots-clés les plus performants</h3>
            <div className="space-y-3">
              {rankingData.keywords && rankingData.keywords.map((keyword, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{keyword.query}</span>
                      {keyword.position <= 10 && (
                        <Badge className="bg-green-100 text-green-800">Top 10</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {keyword.clicks} clics · {keyword.impressions} impressions · CTR {keyword.ctr.toFixed(1)}%
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="font-medium">{keyword.position.toFixed(1)}</div>
                      <div className={`text-xs flex items-center ${getChangeClass(keyword.change)}`}>
                        {renderChangeIndicator(keyword.change)}
                        <span>{keyword.change ? Math.abs(keyword.change).toFixed(1) : "0.0"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <h3 className="font-medium mb-3 mt-6">Opportunités d'optimisation</h3>
            <div className="space-y-3">
              {rankingData.optimizationOpportunities.map((keyword, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white border border-yellow-100 rounded-lg hover:bg-yellow-50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{keyword.query}</span>
                      <ArrowRight className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {keyword.impressions} impressions · seulement {keyword.clicks} clics
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="font-medium text-yellow-600">{keyword.position.toFixed(1)}</div>
                      <div className={`text-xs flex items-center ${getChangeClass(keyword.change)}`}>
                        {renderChangeIndicator(keyword.change)}
                        <span>{keyword.change ? Math.abs(keyword.change).toFixed(1) : "0.0"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="pages">
            <h3 className="font-medium mb-3">Pages les plus performantes</h3>
            <div className="space-y-3">
              {rankingData.topPages && rankingData.topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{page.query}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {page.clicks} clics · {page.impressions} impressions · CTR {page.ctr.toFixed(1)}%
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="font-medium">{page.position.toFixed(1)}</div>
                      <div className={`text-xs flex items-center ${getChangeClass(page.change)}`}>
                        {renderChangeIndicator(page.change)}
                        <span>{page.change ? Math.abs(page.change).toFixed(1) : "0.0"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RankingTracker;
