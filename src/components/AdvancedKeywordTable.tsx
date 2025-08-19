import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Eye, TrendingUp, DollarSign, Users, Smartphone, BarChart3, MapPin, Star, Activity, LineChart, Timer } from 'lucide-react';
import { toast } from 'sonner';

interface KeywordData {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  trend: 'hausse' | 'baisse' | 'stable';
  type: string;
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  competition: number;
  seasonality: string;
  geo: string[];
  serp_features: string[];
  related_queries: string[];
  cluster: string;
  // Métriques Sistrix-like
  visibility?: number;
  positionHistory?: number[];
  clickPotential?: number;
  conversionRate?: number;
  userValue?: number;
  monthlyTrend?: number[];
  searchSuggestions?: string[];
  competitorCount?: number;
  topCompetitors?: string[];
  questionVariations?: string[];
  localSearchVolume?: { [key: string]: number };
  deviceBreakdown?: { desktop: number; mobile: number; tablet: number };
  ageGroupBreakdown?: { [key: string]: number };
  brandedVsNonBranded?: 'branded' | 'non-branded' | 'mixed';
  commercialValue?: number;
}

interface AdvancedKeywordTableProps {
  keywords: KeywordData[];
  onKeywordSelect: (keyword: string) => void;
  selectedKeywords: Set<string>;
}

export const AdvancedKeywordTable: React.FC<AdvancedKeywordTableProps> = ({
  keywords,
  onKeywordSelect,
  selectedKeywords
}) => {
  const [selectedKeyword, setSelectedKeyword] = useState<KeywordData | null>(null);

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return 'bg-green-100 text-green-800';
    if (difficulty < 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getIntentColor = (intent: string) => {
    const colors: { [key: string]: string } = {
      'informational': 'bg-blue-100 text-blue-800',
      'commercial': 'bg-purple-100 text-purple-800',
      'transactional': 'bg-green-100 text-green-800',
      'navigational': 'bg-orange-100 text-orange-800'
    };
    return colors[intent] || 'bg-gray-100 text-gray-800';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'hausse': return '📈';
      case 'baisse': return '📉';
      default: return '➡️';
    }
  };

  const copyKeyword = (keyword: string) => {
    navigator.clipboard.writeText(keyword);
    toast.success('Mot-clé copié !');
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const renderKeywordDetails = (keyword: KeywordData) => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Analyse Détaillée: {keyword.keyword}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="metrics">Métriques</TabsTrigger>
            <TabsTrigger value="competitors">Concurrence</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{formatNumber(keyword.volume)}</p>
                <p className="text-sm text-blue-600">Volume mensuel</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{keyword.difficulty}%</p>
                <p className="text-sm text-purple-600">Difficulté SEO</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">€{keyword.cpc.toFixed(2)}</p>
                <p className="text-sm text-green-600">CPC moyen</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{keyword.visibility || 0}%</p>
                <p className="text-sm text-orange-600">Visibilité</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Répartition par appareil
                </h4>
                {keyword.deviceBreakdown && (
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Desktop</span>
                      <span>{keyword.deviceBreakdown.desktop}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mobile</span>
                      <span>{keyword.deviceBreakdown.mobile}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tablette</span>
                      <span>{keyword.deviceBreakdown.tablet}%</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Volume par région
                </h4>
                {keyword.localSearchVolume && (
                  <div className="space-y-1">
                    {Object.entries(keyword.localSearchVolume).map(([region, volume]) => (
                      <div key={region} className="flex justify-between">
                        <span>{region}</span>
                        <span>{formatNumber(volume)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <p className="text-xl font-bold">{keyword.clickPotential ? formatNumber(keyword.clickPotential) : 'N/A'}</p>
                <p className="text-sm text-gray-600">Potentiel de clics</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <p className="text-xl font-bold">{keyword.conversionRate ? keyword.conversionRate.toFixed(1) + '%' : 'N/A'}</p>
                <p className="text-sm text-gray-600">Taux de conversion</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                <p className="text-xl font-bold">{keyword.commercialValue || 0}/100</p>
                <p className="text-sm text-gray-600">Valeur commerciale</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Répartition par âge
              </h4>
              {keyword.ageGroupBreakdown && (
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(keyword.ageGroupBreakdown).map(([age, percentage]) => (
                    <div key={age} className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-semibold">{age}</div>
                      <div className="text-sm text-gray-600">{percentage}%</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="competitors" className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Top Concurrents ({keyword.competitorCount || 0} identifiés)
              </h4>
              {keyword.topCompetitors && (
                <div className="space-y-2">
                  {keyword.topCompetitors.map((competitor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{competitor}</span>
                      <Badge variant="outline">Position #{index + 1}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Variations de questions</h4>
              {keyword.questionVariations && (
                <div className="grid grid-cols-1 gap-2">
                  {keyword.questionVariations.map((question, index) => (
                    <div key={index} className="p-2 bg-blue-50 rounded text-sm">
                      {question}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Suggestions de recherche
                </h4>
                {keyword.searchSuggestions && (
                  <div className="space-y-1">
                    {keyword.searchSuggestions.map((suggestion, index) => (
                      <div key={index} className="p-2 bg-green-50 rounded text-sm flex items-center justify-between">
                        <span>{suggestion}</span>
                        <Button size="sm" variant="ghost" onClick={() => copyKeyword(suggestion)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  Informations stratégiques
                </h4>
                <div className="space-y-2">
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="font-medium">Type de marque</div>
                    <Badge variant="outline">{keyword.brandedVsNonBranded || 'Non défini'}</Badge>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-medium">Saisonnalité</div>
                    <div className="text-sm text-gray-600">{keyword.seasonality}</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium">Fonctionnalités SERP</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {keyword.serp_features.map((feature, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Table principale */}
      <Card>
        <CardHeader>
          <CardTitle>Analyse Avancée des Mots-clés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Mot-clé</th>
                  <th className="text-left p-3">Volume</th>
                  <th className="text-left p-3">Difficulté</th>
                  <th className="text-left p-3">CPC</th>
                  <th className="text-left p-3">Tendance</th>
                  <th className="text-left p-3">Intent</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {keywords.slice(0, 20).map((keyword, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedKeywords.has(keyword.keyword)}
                          onChange={() => onKeywordSelect(keyword.keyword)}
                          className="rounded"
                        />
                        <span className="font-medium">{keyword.keyword}</span>
                      </div>
                    </td>
                    <td className="p-3">{formatNumber(keyword.volume)}</td>
                    <td className="p-3">
                      <Badge className={getDifficultyColor(keyword.difficulty)}>
                        {keyword.difficulty}%
                      </Badge>
                    </td>
                    <td className="p-3">€{keyword.cpc.toFixed(2)}</td>
                    <td className="p-3">
                      <span className="flex items-center gap-1">
                        {getTrendIcon(keyword.trend)}
                        {keyword.trend}
                      </span>
                    </td>
                    <td className="p-3">
                      <Badge className={getIntentColor(keyword.intent)}>
                        {keyword.intent}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{keyword.type}</Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyKeyword(keyword.keyword)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedKeyword(keyword)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Détails du mot-clé sélectionné */}
      {selectedKeyword && renderKeywordDetails(selectedKeyword)}
    </div>
  );
};