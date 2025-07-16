
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpRight, ArrowDownRight, Filter, BarChart3, Users, Clock, Percent, Globe, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#f44336'];

const AnalyticsTabContent = () => {
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [sourceData, setSourceData] = useState<any[]>([]);
  const [deviceData, setDeviceData] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [campaignsData, setCampaignsData] = useState<any[]>([]);
  const [keywordsData, setKeywordsData] = useState<any[]>([]);
  const [conversionData, setConversionData] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState('30days');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [comparisonEnabled, setComparisonEnabled] = useState(false);
  
  useEffect(() => {
    generateData(timeRange);
  }, [timeRange]);

  const generateData = (period: string) => {
    setIsLoading(true);
    
    // Simulate loading time for better UX
    setTimeout(() => {
      // Generate mock traffic data with more points based on period
      const days = period === '7days' ? 7 : period === '30days' ? 30 : 90;
      const dateFormat = period === '90days' ? 'MMM' : 'DD/MM';
      
      const mockTrafficData = Array.from({ length: days }, (_, i) => {
        // Add slight upward trend
        const trend = Math.pow(1.01, i);
        // Add weekend dip pattern (i % 7 === 0 or i % 7 === 6 are weekends)
        const isWeekend = i % 7 === 0 || i % 7 === 6;
        const weekendFactor = isWeekend ? 0.7 : 1;
        
        // Base values adjusted by period length
        const baseVisitors = period === '7days' ? 800 : period === '30days' ? 600 : 500;
        const basePageviews = period === '7days' ? 2000 : period === '30days' ? 1500 : 1200;
        
        // Calculate date label based on period
        let dateLabel;
        if (period === '90days') {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const date = new Date();
          date.setDate(date.getDate() - (days - i));
          dateLabel = months[date.getMonth()];
        } else {
          const date = new Date();
          date.setDate(date.getDate() - (days - i));
          dateLabel = `${date.getDate()}/${date.getMonth() + 1}`;
        }
        
        return {
          date: dateLabel,
          visitors: Math.floor((baseVisitors * trend * weekendFactor) + (Math.random() * 300 - 150)),
          pageviews: Math.floor((basePageviews * trend * weekendFactor) + (Math.random() * 700 - 350)),
          comparison: comparisonEnabled ? Math.floor((baseVisitors * 0.9) + (Math.random() * 200 - 100)) : null
        };
      });
      
      // Generate performance metrics over time
      const performanceMetrics = Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - i));
        const dateLabel = period === '90days' ? 
          `${date.toLocaleString('default', { month: 'short' })}` : 
          `${date.getDate()}/${date.getMonth() + 1}`;
        
        return {
          date: dateLabel,
          bounceRate: 40 + (Math.random() * 10 - 5), // 35-45%
          avgSessionDuration: 2.5 + (Math.random() * 1 - 0.5), // 2-3 minutes
          pagesPerSession: 2.5 + (Math.random() * 1 - 0.5) // 2-3 pages
        };
      });
      
      // Generate more detailed source data
      const mockSourceData = [
        { name: 'Recherche organique', value: 42 + (Math.random() * 6 - 3) },
        { name: 'Réseaux sociaux', value: 21 + (Math.random() * 4 - 2) },
        { name: 'Accès direct', value: 18 + (Math.random() * 4 - 2) },
        { name: 'Référencement', value: 10 + (Math.random() * 2 - 1) },
        { name: 'Email', value: 6 + (Math.random() * 2 - 1) },
        { name: 'Autres', value: 3 + (Math.random() * 1 - 0.5) },
      ];
      
      // Generate device data
      const mockDeviceData = [
        { name: 'Mobile', value: 62 + (Math.random() * 6 - 3) },
        { name: 'Desktop', value: 32 + (Math.random() * 4 - 2) },
        { name: 'Tablette', value: 6 + (Math.random() * 2 - 1) },
      ];
      
      // Generate campaigns data
      const mockCampaignsData = [
        { name: 'Google Ads', impressions: 42500, clicks: 2125, conversions: 85, ctr: 5.0, convRate: 4.0 },
        { name: 'Facebook Ads', impressions: 85300, clicks: 3412, conversions: 102, ctr: 4.0, convRate: 3.0 },
        { name: 'Email Campaign', impressions: 12000, clicks: 840, conversions: 42, ctr: 7.0, convRate: 5.0 },
        { name: 'Instagram', impressions: 28500, clicks: 1140, conversions: 34, ctr: 4.0, convRate: 3.0 },
        { name: 'LinkedIn', impressions: 8500, clicks: 340, conversions: 14, ctr: 4.0, convRate: 4.1 }
      ];
      
      // Generate keywords data
      const mockKeywordsData = [
        { keyword: 'marketing digital', position: 5, clicks: 450, impressions: 2800, ctr: 16.1 },
        { keyword: 'seo optimisation', position: 8, clicks: 380, impressions: 2400, ctr: 15.8 },
        { keyword: 'référencement naturel', position: 4, clicks: 320, impressions: 1900, ctr: 16.8 },
        { keyword: 'analytics web', position: 3, clicks: 290, impressions: 1600, ctr: 18.1 },
        { keyword: 'stratégie digitale', position: 7, clicks: 250, impressions: 1400, ctr: 17.9 },
        { keyword: 'audit seo', position: 6, clicks: 215, impressions: 1250, ctr: 17.2 },
        { keyword: 'conversion rate optimization', position: 9, clicks: 180, impressions: 1100, ctr: 16.4 },
        { keyword: 'content marketing', position: 5, clicks: 165, impressions: 950, ctr: 17.4 }
      ];
      
      // Generate conversion funnel data
      const mockConversionData = [
        { name: 'Visites', value: 10000 },
        { name: 'Fiches Produits', value: 4500 },
        { name: 'Panier', value: 1800 },
        { name: 'Checkout', value: 950 },
        { name: 'Achat', value: 520 }
      ];
      
      setTrafficData(mockTrafficData);
      setSourceData(mockSourceData);
      setDeviceData(mockDeviceData);
      setPerformanceData(performanceMetrics);
      setCampaignsData(mockCampaignsData);
      setKeywordsData(mockKeywordsData);
      setConversionData(mockConversionData);
      setIsLoading(false);
    }, 1200);
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    toast.info(`Période changée: ${range === '7days' ? '7 jours' : range === '30days' ? '30 jours' : '90 jours'}`);
  };
  
  const handleComparisonToggle = () => {
    setComparisonEnabled(!comparisonEnabled);
    toast.info(`Comparaison ${!comparisonEnabled ? 'activée' : 'désactivée'}`);
    // Regenerate data with comparison
    generateData(timeRange);
  };

  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold">Statistiques de trafic</h3>
          <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 p-6 rounded-lg h-32"></div>
          ))}
        </div>
        <div className="animate-pulse bg-gray-100 p-6 rounded-lg h-80"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h3 className="text-xl font-semibold">Statistiques de trafic</h3>
          <p className="text-sm text-gray-600">
            Consultez les statistiques et analyses de trafic de votre site web.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant={timeRange === '7days' ? "default" : "outline"} 
            size="sm"
            onClick={() => handleTimeRangeChange('7days')}
          >
            7 jours
          </Button>
          <Button 
            variant={timeRange === '30days' ? "default" : "outline"} 
            size="sm"
            onClick={() => handleTimeRangeChange('30days')}
          >
            30 jours
          </Button>
          <Button 
            variant={timeRange === '90days' ? "default" : "outline"} 
            size="sm"
            onClick={() => handleTimeRangeChange('90days')}
          >
            90 jours
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleComparisonToggle}
            className={comparisonEnabled ? "bg-blue-50" : ""}
          >
            <Filter className="h-4 w-4 mr-1" />
            Comparer
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => generateData(timeRange)}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Actualiser
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-white shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-blue-600 font-medium">Visiteurs uniques</span>
          </div>
          <p className="text-2xl font-bold">
            {trafficData.length > 0 ? trafficData[trafficData.length - 1].visitors.toLocaleString() : '0'}
          </p>
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-600">Moyenne: {Math.round(trafficData.reduce((sum, item) => sum + item.visitors, 0) / trafficData.length).toLocaleString()}</p>
            <span className="text-xs text-green-600 flex items-center">
              +8.5% <ArrowUpRight className="ml-1 h-3 w-3" />
            </span>
          </div>
        </Card>
        
        <Card className="p-4 bg-white shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            <span className="text-sm text-indigo-600 font-medium">Pages vues</span>
          </div>
          <p className="text-2xl font-bold">
            {trafficData.length > 0 ? trafficData[trafficData.length - 1].pageviews.toLocaleString() : '0'}
          </p>
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-600">Moyenne: {Math.round(trafficData.reduce((sum, item) => sum + item.pageviews, 0) / trafficData.length).toLocaleString()}</p>
            <span className="text-xs text-green-600 flex items-center">
              +12.3% <ArrowUpRight className="ml-1 h-3 w-3" />
            </span>
          </div>
        </Card>
        
        <Card className="p-4 bg-white shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center gap-2 mb-1">
            <Percent className="h-5 w-5 text-amber-600" />
            <span className="text-sm text-amber-600 font-medium">Taux de rebond</span>
          </div>
          <p className="text-2xl font-bold">
            {performanceData.length > 0 ? performanceData[performanceData.length - 1].bounceRate.toFixed(1) + '%' : '0%'}
          </p>
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-600">Moyenne: {(performanceData.reduce((sum, item) => sum + item.bounceRate, 0) / performanceData.length).toFixed(1)}%</p>
            <span className="text-xs text-red-600 flex items-center">
              +2.1% <ArrowUpRight className="ml-1 h-3 w-3" />
            </span>
          </div>
        </Card>
        
        <Card className="p-4 bg-white shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-5 w-5 text-green-600" />
            <span className="text-sm text-green-600 font-medium">Durée moyenne</span>
          </div>
          <p className="text-2xl font-bold">
            {performanceData.length > 0 ? formatTime(performanceData[performanceData.length - 1].avgSessionDuration) : '0:00'}
          </p>
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-600">Moyenne: {formatTime(performanceData.reduce((sum, item) => sum + item.avgSessionDuration, 0) / performanceData.length)}</p>
            <span className="text-xs text-green-600 flex items-center">
              +0.8% <ArrowUpRight className="ml-1 h-3 w-3" />
            </span>
          </div>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="acquisition">Acquisition</TabsTrigger>
          <TabsTrigger value="behavior">Comportement</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Trafic sur la période</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trafficData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorPageviews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                    </linearGradient>
                    {comparisonEnabled && (
                      <linearGradient id="colorComparison" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ffc658" stopOpacity={0.1}/>
                      </linearGradient>
                    )}
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="visitors" 
                    stroke="#8884d8" 
                    fillOpacity={1} 
                    fill="url(#colorVisitors)" 
                    name="Visiteurs"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pageviews" 
                    stroke="#82ca9d" 
                    fillOpacity={1} 
                    fill="url(#colorPageviews)" 
                    name="Pages vues"
                  />
                  {comparisonEnabled && (
                    <Area 
                      type="monotone" 
                      dataKey="comparison" 
                      stroke="#ffc658" 
                      fillOpacity={1} 
                      fill="url(#colorComparison)" 
                      name="Période précédente"
                      strokeDasharray="5 5"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Sources de trafic</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Répartition par appareils</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={deviceData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Bar 
                      dataKey="value" 
                      name="Pourcentage" 
                      radius={[0, 4, 4, 0]}
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="acquisition" className="mt-6">
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Top mots-clés</h3>
              <Select defaultValue="ctr">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ctr">Trier par CTR</SelectItem>
                  <SelectItem value="clicks">Trier par Clics</SelectItem>
                  <SelectItem value="impressions">Trier par Impressions</SelectItem>
                  <SelectItem value="position">Trier par Position</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mot-clé</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clics</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impressions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTR</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {keywordsData.map((keyword, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{keyword.keyword}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{keyword.position}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{keyword.clicks.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{keyword.impressions.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{keyword.ctr.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Campagnes marketing</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campagne</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impressions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clics</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTR</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taux de conversion</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {campaignsData.map((campaign, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{campaign.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.impressions.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.clicks.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.ctr.toFixed(1)}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.conversions.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.convRate.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="behavior" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Métriques de performance</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={performanceData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left" 
                      type="monotone" 
                      dataKey="bounceRate" 
                      stroke="#ff8042" 
                      name="Taux de rebond (%)" 
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="avgSessionDuration" 
                      stroke="#0088fe" 
                      name="Durée de session (min)" 
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="pagesPerSession" 
                      stroke="#00c49f" 
                      name="Pages par session" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Répartition géographique</h3>
              <div className="h-80">
                <div className="mb-4">
                  <Select defaultValue="france">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sélectionner un pays" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="france">France</SelectItem>
                      <SelectItem value="belgium">Belgique</SelectItem>
                      <SelectItem value="switzerland">Suisse</SelectItem>
                      <SelectItem value="canada">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3 mt-8">
                  {[
                    { region: "Île-de-France", percent: 35 },
                    { region: "Auvergne-Rhône-Alpes", percent: 18 },
                    { region: "Provence-Alpes-Côte d'Azur", percent: 12 },
                    { region: "Nouvelle-Aquitaine", percent: 8 },
                    { region: "Occitanie", percent: 7 },
                    { region: "Autres régions", percent: 20 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{item.region}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500"
                            style={{ width: `${item.percent}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{item.percent}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Pages les plus visitées</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vues</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temps moyen</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taux de rebond</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taux de sortie</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { url: "/", views: 5842, time: "2:35", bounce: 32.5, exit: 18.2 },
                    { url: "/blog/seo-guide", views: 3217, time: "4:12", bounce: 28.7, exit: 15.5 },
                    { url: "/products", views: 2845, time: "3:18", bounce: 34.2, exit: 22.3 },
                    { url: "/services", views: 2156, time: "2:55", bounce: 35.8, exit: 24.1 },
                    { url: "/about", views: 1872, time: "1:48", bounce: 42.3, exit: 31.5 },
                    { url: "/contact", views: 1654, time: "1:32", bounce: 38.7, exit: 42.8 },
                    { url: "/blog/marketing-tips", views: 1438, time: "3:45", bounce: 30.2, exit: 19.7 }
                  ].map((page, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{page.url}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{page.views.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{page.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{page.bounce}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{page.exit}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="conversions" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Entonnoir de conversion</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={conversionData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      tick={{ fontSize: 13 }} 
                    />
                    <Tooltip />
                    <Bar 
                      dataKey="value" 
                      fill="#8884d8" 
                      radius={[0, 4, 4, 0]}
                      name="Utilisateurs"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Statistiques de conversion</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">Transactions</p>
                  <p className="text-2xl font-bold text-blue-900">542</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-green-600 flex items-center">
                      +15.2% <ArrowUpRight className="ml-1 h-3 w-3" />
                    </span>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-700">Taux de conversion</p>
                  <p className="text-2xl font-bold text-green-900">5.2%</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-green-600 flex items-center">
                      +0.8% <ArrowUpRight className="ml-1 h-3 w-3" />
                    </span>
                  </div>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-sm text-amber-700">Valeur moyenne</p>
                  <p className="text-2xl font-bold text-amber-900">89€</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-green-600 flex items-center">
                      +12.5% <ArrowUpRight className="ml-1 h-3 w-3" />
                    </span>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-700">Revenu</p>
                  <p className="text-2xl font-bold text-purple-900">48,238€</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-green-600 flex items-center">
                      +18.4% <ArrowUpRight className="ml-1 h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
              
              <h4 className="font-medium mb-2 text-sm text-gray-700">Conversions par source</h4>
              <div className="space-y-2">
                {[
                  { source: "Recherche organique", conversions: 245, rate: 4.8 },
                  { source: "Trafic direct", conversions: 128, rate: 6.2 },
                  { source: "Réseaux sociaux", conversions: 87, rate: 3.5 },
                  { source: "Email marketing", conversions: 52, rate: 8.4 },
                  { source: "Campagnes payantes", conversions: 30, rate: 5.1 }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                    <span className="font-medium">{item.source}</span>
                    <div className="flex items-center gap-4">
                      <span>{item.conversions} <span className="text-xs text-gray-500">conversions</span></span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {item.rate}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Objectifs atteints</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Objectif</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complétions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taux de conversion</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valeur</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { goal: "Achat complété", completions: 542, rate: 5.2, value: "48,238€" },
                    { goal: "Inscription newsletter", completions: 824, rate: 8.1, value: "4,120€" },
                    { goal: "Téléchargement brochure", completions: 645, rate: 6.3, value: "3,225€" },
                    { goal: "Contact formulaire", completions: 328, rate: 3.2, value: "6,560€" },
                    { goal: "Création de compte", completions: 412, rate: 4.0, value: "2,060€" }
                  ].map((goal, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{goal.goal}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{goal.completions.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{goal.rate}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{goal.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsTabContent;
