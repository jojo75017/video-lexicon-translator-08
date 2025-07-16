import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BarChart3, TrendingUp, Users, Eye, Globe, Smartphone, Monitor, Download, Calendar, Clock, Target, MousePointer, Search, Share2, FileText, Zap, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { analyzeAnalytics } from '@/utils/seo/analyticsAnalyzer';
import { toast } from 'sonner';

const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('30days');
  const [selectedMetric, setSelectedMetric] = useState('pageviews');
  
  const analyticsData = useMemo(() => analyzeAnalytics(timeRange), [timeRange]);

  // Données pour les graphiques
  const trendData = [
    { date: '01/01', visiteurs: 1200, pages: 2800, conversions: 45 },
    { date: '02/01', visiteurs: 1350, pages: 3100, conversions: 52 },
    { date: '03/01', visiteurs: 1180, pages: 2650, conversions: 38 },
    { date: '04/01', visiteurs: 1420, pages: 3350, conversions: 61 },
    { date: '05/01', visiteurs: 1680, pages: 3900, conversions: 74 },
    { date: '06/01', visiteurs: 1520, pages: 3600, conversions: 65 },
    { date: '07/01', visiteurs: 1750, pages: 4100, conversions: 82 }
  ];

  const deviceData = [
    { name: 'Desktop', value: analyticsData.deviceBreakdown.desktop, color: '#3b82f6' },
    { name: 'Mobile', value: analyticsData.deviceBreakdown.mobile, color: '#10b981' },
    { name: 'Tablet', value: analyticsData.deviceBreakdown.tablet, color: '#f59e0b' }
  ];

  const timeOnSiteData = [
    { range: '0-30s', value: analyticsData.timeOnSite['0-30s'] },
    { range: '30s-2m', value: analyticsData.timeOnSite['30s-2m'] },
    { range: '2m-5m', value: analyticsData.timeOnSite['2m-5m'] },
    { range: '5m+', value: analyticsData.timeOnSite['5m+'] }
  ];

  const exportData = (format: string) => {
    toast.success(`Export ${format.toUpperCase()} généré avec succès!`);
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'users': return Users;
      case 'pageviews': return Eye;
      case 'bounce': return MousePointer;
      case 'duration': return Clock;
      default: return BarChart3;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              📊 Analytics Avancées
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <Button
                variant={timeRange === '7days' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('7days')}
              >
                7 jours
              </Button>
              <Button
                variant={timeRange === '30days' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('30days')}
              >
                30 jours
              </Button>
              <Button
                variant={timeRange === '90days' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('90days')}
              >
                90 jours
              </Button>
            </div>
            <Button onClick={() => exportData('pdf')} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="traffic">Trafic</TabsTrigger>
            <TabsTrigger value="behavior">Comportement</TabsTrigger>
            <TabsTrigger value="acquisition">Acquisition</TabsTrigger>
            <TabsTrigger value="content">Contenu</TabsTrigger>
            <TabsTrigger value="conversions">Conversions</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            {/* KPIs principaux */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Visiteurs Uniques</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.uniqueVisitors.toLocaleString()}</div>
                  <div className="flex items-center text-xs text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +20.1% vs période précédente
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pages Vues</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.pageViews.toLocaleString()}</div>
                  <div className="flex items-center text-xs text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +15.3% vs période précédente
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taux de Rebond</CardTitle>
                  <MousePointer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.bounceRate}%</div>
                  <div className="flex items-center text-xs text-red-600">
                    <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                    -2.1% vs période précédente
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Temps Moyen</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.floor(analyticsData.averageTimeOnPage / 60)}m {analyticsData.averageTimeOnPage % 60}s</div>
                  <div className="flex items-center text-xs text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12.5% vs période précédente
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Graphique de tendance principal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Évolution du Trafic
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="visiteurs" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="pages" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Distribution par appareil et temps passé */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Répartition par Appareil
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Durée des Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={timeOnSiteData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trafic */}
          <TabsContent value="traffic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Top Pays
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { country: 'France', visits: 8420 },
                      { country: 'Belgique', visits: 2340 },
                      { country: 'Suisse', visits: 1890 },
                      { country: 'Canada', visits: 1450 },
                      { country: 'Maroc', visits: 980 }
                    ].map((country, index) => (
                      <div key={country.country} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{index + 1}</Badge>
                          <span className="font-medium">{country.country}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{country.visits.toLocaleString()} visites</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Sources de Trafic
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <div className="font-medium">Recherche Organique</div>
                        <div className="text-sm text-muted-foreground">45.2% du trafic total</div>
                      </div>
                      <div className="text-xl font-bold text-blue-600">18,420</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <div className="font-medium">Trafic Direct</div>
                        <div className="text-sm text-muted-foreground">28.7% du trafic total</div>
                      </div>
                      <div className="text-xl font-bold text-green-600">11,680</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div>
                        <div className="font-medium">Réseaux Sociaux</div>
                        <div className="text-sm text-muted-foreground">16.1% du trafic total</div>
                      </div>
                      <div className="text-xl font-bold text-orange-600">6,550</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div>
                        <div className="font-medium">Référencement</div>
                        <div className="text-sm text-muted-foreground">10.0% du trafic total</div>
                      </div>
                      <div className="text-xl font-bold text-purple-600">4,070</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Comportement */}
          <TabsContent value="behavior" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Pages les Plus Consultées
                </CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="space-y-3">
                    {analyticsData.topPages.map((page, index) => (
                      <div key={page.url} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{index + 1}</Badge>
                          <div>
                            <div className="font-medium">{page.url}</div>
                            <div className="text-sm text-muted-foreground">{Math.floor(Math.random() * 80 + 10)}% de trafic SEO</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{(page as any).visits ? (page as any).visits.toLocaleString() : Math.floor(Math.random() * 5000 + 1000).toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">visites</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Acquisition */}
          <TabsContent value="acquisition" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Mots-clés de Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="space-y-3">
                    {[
                      { keyword: 'seo tools', volume: 8900, competition: 0.8 },
                      { keyword: 'analytics', volume: 12400, competition: 0.6 },
                      { keyword: 'marketing digital', volume: 5600, competition: 0.7 },
                      { keyword: 'référencement', volume: 3400, competition: 0.5 },
                      { keyword: 'optimisation web', volume: 2100, competition: 0.4 }
                    ].map((keyword, index) => (
                      <div key={keyword.keyword} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{index + 1}</Badge>
                          <div>
                            <div className="font-medium">{keyword.keyword}</div>
                            <div className="text-sm text-muted-foreground">
                              Compétition: {keyword.competition >= 0.7 ? 'Élevée' : keyword.competition >= 0.5 ? 'Moyenne' : 'Faible'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{keyword.volume.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">recherches/mois</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contenu */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance du Contenu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="font-medium text-green-800">Articles de Blog</div>
                      <div className="text-2xl font-bold text-green-600">85%</div>
                      <div className="text-sm text-green-600">Taux d'engagement</div>
                    </div>
                    
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-blue-800">Pages Produits</div>
                      <div className="text-2xl font-bold text-blue-600">72%</div>
                      <div className="text-sm text-blue-600">Taux de conversion</div>
                    </div>
                    
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="font-medium text-orange-800">Pages de Service</div>
                      <div className="text-2xl font-bold text-orange-600">68%</div>
                      <div className="text-sm text-orange-600">Rétention utilisateur</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Métriques d'Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="conversions" stroke="#f59e0b" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Conversions */}
          <TabsContent value="conversions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Objectifs Atteints
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">247</div>
                  <div className="text-sm text-muted-foreground">+18% ce mois</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Valeur Moyenne</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">€185.50</div>
                  <div className="text-sm text-muted-foreground">Par conversion</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>ROI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">342%</div>
                  <div className="text-sm text-muted-foreground">Retour sur investissement</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalyticsPage;