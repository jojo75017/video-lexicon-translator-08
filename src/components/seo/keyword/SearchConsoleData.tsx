
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Line } from "recharts";
import { LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { SearchConsoleData, RankingData } from '@/types/seo/Ranking';
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Minus, TrendingUp, Search, BarChart2 } from "lucide-react";

interface SearchConsoleDataProps {
  data?: RankingData;
  isLoading: boolean;
  keyword?: string;
}

const SearchConsoleDataViewer: React.FC<SearchConsoleDataProps> = ({
  data,
  isLoading,
  keyword
}) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <BarChart2 className="h-5 w-5 mr-2 text-blue-500" />
            Chargement des données Google Search Console...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded-md w-full"></div>
            <div className="h-40 bg-gray-200 rounded-md w-full"></div>
            <div className="h-60 bg-gray-200 rounded-md w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="p-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <Search className="h-5 w-5 mr-2 text-blue-500" />
            Données Search Console
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <Search className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Aucune donnée disponible</h3>
            <p className="text-gray-500 text-center max-w-md">
              Connectez votre compte Google Search Console pour visualiser les données de recherche
              pour vos mots-clés et pages.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Formater les données pour le graphique
  const chartData = data.historicalData || Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (30 - i));
    return {
      date: date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
      position: Math.random() * 30 + 1
    };
  });

  // Calculer la tendance
  const calculateTrend = (values: number[]): number => {
    if (values.length < 2) return 0;
    return values[values.length - 1] - values[0];
  };

  const positionTrend = chartData.length > 1 
    ? chartData[chartData.length - 1].position - chartData[0].position 
    : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Search className="h-5 w-5 mr-2 text-blue-500" />
          {keyword ? `Search Console: ${keyword}` : 'Données Search Console'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Impressions</div>
            <div className="text-2xl font-semibold mt-1">{data.impressions?.toLocaleString() || "N/A"}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Clics</div>
            <div className="text-2xl font-semibold mt-1">{data.clicks?.toLocaleString() || "N/A"}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Position moyenne</div>
            <div className="flex items-center">
              <div className="text-2xl font-semibold mt-1">{data.position?.toFixed(1) || "N/A"}</div>
              {positionTrend !== 0 && (
                <div className={`flex items-center ml-2 ${positionTrend < 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {positionTrend < 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                  <span className="text-xs">{Math.abs(positionTrend).toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-md font-medium mb-2">Évolution du positionnement</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis reversed domain={[1, 'dataMax']} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="position"
                  stroke="#1e40af"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium mb-3">Top requêtes</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requête</TableHead>
                <TableHead className="text-center">Position</TableHead>
                <TableHead className="text-right">Clics</TableHead>
                <TableHead className="text-right">Impressions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.topQueries?.map((query, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{query.query}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      <span>{query.position.toFixed(1)}</span>
                      {query.change && (
                        <span className={`ml-1 ${query.change < 0 ? 'text-green-500' : query.change > 0 ? 'text-red-500' : 'text-gray-500'}`}>
                          {query.change < 0 ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : query.change > 0 ? (
                            <ArrowDown className="h-3 w-3" />
                          ) : (
                            <Minus className="h-3 w-3" />
                          )}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{query.clicks}</TableCell>
                  <TableCell className="text-right">{query.impressions}</TableCell>
                </TableRow>
              ))}
              {(!data.topQueries || data.topQueries.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                    Aucune donnée de requête disponible
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-6">
          <h3 className="text-md font-medium mb-3">Opportunités d'optimisation</h3>
          <div className="space-y-3">
            {data.optimizationOpportunities?.slice(0, 3).map((opportunity, index) => (
              <div key={index} className="bg-amber-50 border border-amber-100 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-amber-800">{opportunity.query}</div>
                    <div className="text-sm text-amber-700 mt-1">
                      Position: {opportunity.position.toFixed(1)} | CTR: {(opportunity.ctr * 100).toFixed(1)}% | Impressions: {opportunity.impressions}
                    </div>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                    Opportunité
                  </Badge>
                </div>
                <div className="text-xs text-amber-600 mt-2">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  Cette requête a une position correcte mais un faible taux de clic. Optimisez votre méta-description pour augmenter les clics.
                </div>
              </div>
            ))}
            {(!data.optimizationOpportunities || data.optimizationOpportunities.length === 0) && (
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg text-center text-gray-500">
                Aucune opportunité d'optimisation identifiée pour le moment
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchConsoleDataViewer;
