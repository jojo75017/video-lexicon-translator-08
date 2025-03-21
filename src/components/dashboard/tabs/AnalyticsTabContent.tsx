
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart2, PieChart as PieChartIcon, TrendingUp, Users, 
  Globe, Clock, ArrowUpRight, ExternalLink, Calendar 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell, Legend, 
  PieChart, Pie
} from 'recharts';
import { toast } from "sonner";
import { analyzeAnalytics } from '@/utils/seo/analyticsAnalyzer';
import AnalyticsOverview from '@/components/seo/AnalyticsOverview';
import EnhancedAnalytics from '@/components/seo/EnhancedAnalytics';
import { TabsContent } from "@/components/ui/tabs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AnalyticsTabContent: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('30days');
  const [activeView, setActiveView] = useState<string>('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = analyzeAnalytics();
        setAnalyticsData(data);
        console.log("Analytics data loaded:", data);
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
    { name: 'Jan', visits: analyticsData?.pageViews ? analyticsData.pageViews * 0.4 : 400 },
    { name: 'Feb', visits: analyticsData?.pageViews ? analyticsData.pageViews * 0.3 : 300 },
    { name: 'Mar', visits: analyticsData?.pageViews ? analyticsData.pageViews * 0.6 : 600 },
    { name: 'Apr', visits: analyticsData?.pageViews ? analyticsData.pageViews * 0.8 : 800 },
    { name: 'May', visits: analyticsData?.pageViews ? analyticsData.pageViews * 0.7 : 700 },
    { name: 'Jun', visits: analyticsData?.pageViews ? analyticsData.pageViews * 0.9 : 900 },
    { name: 'Jul', visits: analyticsData?.pageViews ? analyticsData.pageViews * 1.1 : 1100 },
  ];

  const pageViewData = analyticsData?.topPages ? 
    analyticsData.topPages.map((page: any) => ({
      name: page.url.split('/').pop() || page.url,
      views: page.visits
    })) : 
    [
      { name: 'Home', views: 1200 },
      { name: 'About', views: 800 },
      { name: 'Services', views: 1500 },
      { name: 'Blog', views: 2200 },
      { name: 'Contact', views: 600 },
    ];

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const deviceData = analyticsData ? [
    { name: 'Desktop', value: analyticsData.deviceBreakdown?.desktop || 42 },
    { name: 'Mobile', value: analyticsData.deviceBreakdown?.mobile || 45 },
    { name: 'Tablet', value: analyticsData.deviceBreakdown?.tablet || 13 }
  ] : [
    { name: 'Desktop', value: 42 },
    { name: 'Mobile', value: 45 },
    { name: 'Tablet', value: 13 }
  ];

  const deviceColors = ['#4F46E5', '#10B981', '#F59E0B'];

  const trafficSources = [
    { name: 'Direct', value: 42 },
    { name: 'Organic', value: 28 },
    { name: 'Social', value: 18 },
    { name: 'Referral', value: 12 }
  ];

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    toast.info(`Période sélectionnée: ${period}`);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              <span>Vue d'ensemble</span>
            </TabsTrigger>
            <TabsTrigger value="detailed" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Analyse détaillée</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            <Button 
              variant={selectedPeriod === '7days' ? "default" : "outline"} 
              size="sm"
              onClick={() => handlePeriodChange('7days')}
            >
              7 jours
            </Button>
            <Button 
              variant={selectedPeriod === '30days' ? "default" : "outline"} 
              size="sm"
              onClick={() => handlePeriodChange('30days')}
            >
              30 jours
            </Button>
            <Button 
              variant={selectedPeriod === '90days' ? "default" : "outline"} 
              size="sm"
              onClick={() => handlePeriodChange('90days')}
            >
              90 jours
            </Button>
            <Button 
              variant={selectedPeriod === 'custom' ? "default" : "outline"} 
              size="sm"
              onClick={() => handlePeriodChange('custom')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Personnalisé
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="mt-0">
          {/* Analytics Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Visiteurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold">{analyticsData?.uniqueVisitors?.toLocaleString() || "24,892"}</div>
                  <div className="text-xs text-green-500 flex items-center font-medium">
                    +12.5%
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">vs période précédente</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Pages vues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold">{analyticsData?.pageViews?.toLocaleString() || "78,349"}</div>
                  <div className="text-xs text-green-500 flex items-center font-medium">
                    +8.2%
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">vs période précédente</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Taux de rebond</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold">{analyticsData?.bounceRate?.toFixed(1) || "36.5"}%</div>
                  <div className="text-xs text-red-500 flex items-center font-medium">
                    +2.1%
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">vs période précédente</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Temps moyen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold">{formatTime(analyticsData?.averageTimeOnPage || 222)}</div>
                  <div className="text-xs text-green-500 flex items-center font-medium">
                    +0.8%
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">vs période précédente</p>
              </CardContent>
            </Card>
          </div>

          {/* Visitors trend chart */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Tendance des visites</CardTitle>
              <CardDescription>Nombre de visiteurs au cours du temps</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={visitData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="visitGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="visits" 
                      stroke="#4f46e5" 
                      fillOpacity={1} 
                      fill="url(#visitGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Two column layout for additional charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Pages les plus visitées</CardTitle>
                <CardDescription>Nombre de vues par page</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={pageViewData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={50} />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip />
                      <Bar dataKey="views" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par appareil</CardTitle>
                <CardDescription>Type d'appareils utilisés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={deviceColors[index % deviceColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sources de trafic */}
          <Card>
            <CardHeader>
              <CardTitle>Sources de trafic</CardTitle>
              <CardDescription>D'où viennent vos visiteurs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trafficSources.map((source) => (
                  <div key={source.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {source.name === 'Direct' && <Globe className="h-4 w-4 text-blue-500" />}
                      {source.name === 'Organic' && <TrendingUp className="h-4 w-4 text-green-500" />}
                      {source.name === 'Social' && <Users className="h-4 w-4 text-purple-500" />}
                      {source.name === 'Referral' && <ExternalLink className="h-4 w-4 text-amber-500" />}
                      <span>{source.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            source.name === 'Direct' ? 'bg-blue-500' : 
                            source.name === 'Organic' ? 'bg-green-500' : 
                            source.name === 'Social' ? 'bg-purple-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${source.value}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{source.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="mt-0">
          {/* Contenu de l'analyse détaillée */}
          <EnhancedAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsTabContent;
