
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart2, 
  TrendingUp, 
  PieChart, 
  Users, 
  Globe, 
  Activity, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Search,
  ExternalLink,
  Clock
} from 'lucide-react';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart
} from 'recharts';
import { analyzeAnalytics } from '@/utils/seo/analyticsAnalyzer';
import { toast } from "sonner";

const AnalyticsTabContent = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState({
    pageViews: 0,
    uniqueVisitors: 0,
    bounceRate: 0,
    averageTimeOnPage: 0,
    topCountries: [{ country: "France", visits: 0 }],
    deviceBreakdown: {
      desktop: 0,
      mobile: 0,
      tablet: 0,
    },
    timeOnSite: {
      '0-30s': 0,
      '30s-2m': 0,
      '2m-5m': 0,
      '5m+': 0,
    },
    trafficSources: {
      organic: 0,
      direct: 0,
      referral: 0,
      social: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await analyzeAnalytics();
        setAnalyticsData(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données Analytics:', error);
        toast.error("Erreur lors du chargement des données Analytics");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const visitData = [
    { day: 'Lun', visits: Math.floor(analyticsData.pageViews / 7), pageviews: Math.floor(analyticsData.pageViews / 3.5) },
    { day: 'Mar', visits: Math.floor(analyticsData.pageViews / 6), pageviews: Math.floor(analyticsData.pageViews / 3.2) },
    { day: 'Mer', visits: Math.floor(analyticsData.pageViews / 5), pageviews: Math.floor(analyticsData.pageViews / 1.5) },
    { day: 'Jeu', visits: Math.floor(analyticsData.pageViews / 4), pageviews: Math.floor(analyticsData.pageViews / 2.5) },
    { day: 'Ven', visits: Math.floor(analyticsData.pageViews / 3), pageviews: Math.floor(analyticsData.pageViews / 2.1) },
    { day: 'Sam', visits: Math.floor(analyticsData.pageViews / 2), pageviews: Math.floor(analyticsData.pageViews / 3.2) },
    { day: 'Dim', visits: Math.floor(analyticsData.pageViews), pageviews: Math.floor(analyticsData.pageViews / 2.2) }
  ];

  const deviceData = [
    { device: 'Mobile', value: analyticsData.deviceBreakdown.mobile },
    { device: 'Desktop', value: analyticsData.deviceBreakdown.desktop },
    { device: 'Tablet', value: analyticsData.deviceBreakdown.tablet }
  ];

  const deviceColors = ['#4F46E5', '#10B981', '#F59E0B'];

  const sourceData = [
    { source: 'Google', visits: analyticsData.trafficSources?.organic || 0 },
    { source: 'Direct', visits: analyticsData.trafficSources?.direct || 0 },
    { source: 'Referral', visits: analyticsData.trafficSources?.referral || 0 },
    { source: 'Social', visits: analyticsData.trafficSources?.social || 0 }
  ];

  const pageData = [
    { page: '/accueil', views: Math.floor(analyticsData.pageViews * 0.4), avgTime: '1:45' },
    { page: '/services', views: Math.floor(analyticsData.pageViews * 0.2), avgTime: '2:30' },
    { page: '/blog/seo-guide', views: Math.floor(analyticsData.pageViews * 0.15), avgTime: '4:10' },
    { page: '/contact', views: Math.floor(analyticsData.pageViews * 0.1), avgTime: '1:05' },
    { page: '/a-propos', views: Math.floor(analyticsData.pageViews * 0.08), avgTime: '1:35' }
  ];

  const conversionData = [
    { name: 'Contact', value: 65 },
    { name: 'Inscription', value: 25 },
    { name: 'Achat', value: 10 }
  ];

  const conversionColors = ['#8884d8', '#83a6ed', '#8dd1e1'];

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement des données d'analytique...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Analytiques</h2>
          <p className="text-muted-foreground">
            Performances de votre site et statistiques de visite
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 derniers jours</SelectItem>
              <SelectItem value="30d">30 derniers jours</SelectItem>
              <SelectItem value="90d">90 derniers jours</SelectItem>
              <SelectItem value="12m">12 derniers mois</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Personnaliser
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <MetricCard 
          title="Visiteurs"
          value={analyticsData.uniqueVisitors.toLocaleString()}
          change={12.5}
          icon={<Users className="h-5 w-5 text-blue-600" />}
        />
        <MetricCard 
          title="Pages Vues"
          value={analyticsData.pageViews.toLocaleString()}
          change={8.3}
          icon={<Globe className="h-5 w-5 text-indigo-600" />}
        />
        <MetricCard 
          title="Taux de Rebond"
          value={`${analyticsData.bounceRate.toFixed(1)}%`}
          change={-5.1}
          isGoodWhenNegative={true}
          icon={<Activity className="h-5 w-5 text-emerald-600" />}
        />
        <MetricCard 
          title="Durée Moyenne"
          value={formatTime(analyticsData.averageTimeOnPage)}
          change={15.7}
          icon={<Clock className="h-5 w-5 text-purple-600" />}
        />
      </div>
      
      {/* Analytics Overview Card */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Aperçu Analytics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-blue-600 font-medium">Visiteurs uniques</span>
            </div>
            <p className="text-2xl font-bold">{analyticsData.uniqueVisitors.toLocaleString()}</p>
            <p className="text-sm text-blue-600">Visiteurs actuels</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-green-600" />
              <span className="text-green-600 font-medium">Temps moyen</span>
            </div>
            <p className="text-2xl font-bold">{formatTime(analyticsData.averageTimeOnPage)}</p>
            <p className="text-sm text-green-600">Durée moyenne de visite</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <ArrowRight className="h-5 w-5 text-purple-600" />
              <span className="text-purple-600 font-medium">Taux de rebond</span>
            </div>
            <p className="text-2xl font-bold">{analyticsData.bounceRate.toFixed(1)}%</p>
            <p className="text-sm text-purple-600">Taux de rebond actuel</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-3">Trafic sur 7 jours</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={visitData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="visits" 
                    name="Visites"
                    stroke="#4F46E5" 
                    fill="#4F46E5" 
                    fillOpacity={0.1} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pageviews" 
                    name="Pages vues"
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.1} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-3">Répartition par appareil</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="device"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={deviceColors[index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-600">Principaux pays</h4>
          <div className="space-y-2">
            {analyticsData.topCountries.map((country, index) => (
              <div 
                key={country.country}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span>{country.country}</span>
                </div>
                <span className="font-medium">{country.visits.toLocaleString()} visites</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    
      <Tabs defaultValue="traffic" className="mt-8">
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-100">
          <h3 className="text-lg font-semibold mb-3">Données Détaillées</h3>
          <TabsList className="w-full grid grid-cols-4 mb-4">
            <TabsTrigger value="traffic">Trafic</TabsTrigger>
            <TabsTrigger value="behavior">Comportement</TabsTrigger>
            <TabsTrigger value="conversion">Conversion</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="traffic">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-white shadow-md border border-gray-100">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  Visites par jour
                </CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={visitData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="visits" 
                      name="Visiteurs" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="pageviews" 
                      name="Pages vues" 
                      stroke="#82ca9d" 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md border border-gray-100">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  Visites par appareil
                </CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={deviceData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
                    <XAxis dataKey="device" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Visites" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="behavior">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-white shadow-md border border-gray-100">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  Pages les plus consultées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left text-sm font-medium text-gray-500 pb-2">Page</th>
                        <th className="text-right text-sm font-medium text-gray-500 pb-2">Vues</th>
                        <th className="text-right text-sm font-medium text-gray-500 pb-2">Durée moy.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageData.map((page, index) => (
                        <tr key={index} className="border-t border-gray-100">
                          <td className="py-3 text-sm text-blue-600 hover:underline cursor-pointer">{page.page}</td>
                          <td className="py-3 text-sm text-right font-medium">{page.views.toLocaleString()}</td>
                          <td className="py-3 text-sm text-right">{page.avgTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Button variant="ghost" size="sm" className="mt-4 text-blue-600">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Voir toutes les pages
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md border border-gray-100">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  Comportement des visiteurs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-500 mb-1">Pages par session</div>
                    <div className="text-2xl font-bold text-blue-700">3.2</div>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-500 mb-1">Taux de rebond</div>
                    <div className="text-2xl font-bold text-emerald-700">{analyticsData.bounceRate.toFixed(1)}%</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-500 mb-1">Durée session</div>
                    <div className="text-2xl font-bold text-purple-700">{formatTime(analyticsData.averageTimeOnPage)}</div>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-500 mb-1">Nouveaux visiteurs</div>
                    <div className="text-2xl font-bold text-amber-700">68%</div>
                  </div>
                </div>
                <Button className="w-full">
                  <Search className="mr-2 h-4 w-4" />
                  Analyser le comportement
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="conversion">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-white shadow-md border border-gray-100">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <PieChart className="h-4 w-4 text-blue-600" />
                  Types de conversions
                </CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={conversionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {conversionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={conversionColors[index % conversionColors.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(value) => [`${value}%`, 'Pourcentage']} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md border border-gray-100">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  Taux de conversion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Taux global</span>
                    <span className="text-lg font-bold text-green-600">3.8%</span>
                  </div>
                  <Progress value={3.8} max={10} className="h-2" />
                  <div className="mt-1 text-xs text-gray-400 text-right">Objectif: 5%</div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Contact</span>
                      <span className="text-sm font-medium">4.2%</span>
                    </div>
                    <Progress value={4.2} max={10} className="h-1.5 bg-blue-100" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Inscription</span>
                      <span className="text-sm font-medium">2.8%</span>
                    </div>
                    <Progress value={2.8} max={10} className="h-1.5 bg-purple-100" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Achat</span>
                      <span className="text-sm font-medium">1.5%</span>
                    </div>
                    <Progress value={1.5} max={10} className="h-1.5 bg-emerald-100" />
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-6">
                  Configurer les objectifs
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="sources">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-white shadow-md border border-gray-100">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-600" />
                  Sources de trafic
                </CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sourceData}
                    layout="vertical"
                    margin={{
                      top: 20,
                      right: 30,
                      left: 60,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
                    <XAxis type="number" />
                    <YAxis dataKey="source" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="visits" name="Visites" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md border border-gray-100">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Search className="h-4 w-4 text-blue-600" />
                  Mots-clés les plus performants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { keyword: "seo analyse site", clicks: 352, impressions: 5240, position: 3.2 },
                    { keyword: "audit seo gratuit", clicks: 280, impressions: 4150, position: 4.1 },
                    { keyword: "référencement naturel", clicks: 215, impressions: 3800, position: 5.8 },
                    { keyword: "améliorer seo", clicks: 189, impressions: 2950, position: 6.3 },
                    { keyword: "outils seo", clicks: 124, impressions: 2340, position: 7.5 }
                  ].map((item, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-blue-600">{item.keyword}</span>
                        <span className="text-sm bg-blue-100 text-blue-800 py-0.5 px-2 rounded-full">{item.position}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{item.clicks} clics</span>
                        <span>{item.impressions} impressions</span>
                        <span>{(item.clicks / item.impressions * 100).toFixed(1)}% CTR</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button size="sm" variant="ghost" className="mt-4 text-blue-600">
                  Voir tous les mots-clés
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const MetricCard = ({ title, value, change, icon, isGoodWhenNegative = false }) => {
  const isPositiveChange = isGoodWhenNegative ? change < 0 : change > 0;
  
  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-gray-500 mb-1">{title}</div>
            <div className="text-2xl font-bold">{value}</div>
          </div>
          <div className="rounded-full p-2 bg-blue-50">
            {icon}
          </div>
        </div>
        <div className="mt-3 flex items-center">
          {isPositiveChange ? (
            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm font-medium ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(change)}% {isPositiveChange ? 'hausse' : 'baisse'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsTabContent;
