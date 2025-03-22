
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, ResponsiveContainer, 
  CartesianGrid, XAxis, YAxis, Tooltip, Cell, Legend, AreaChart, Area 
} from 'recharts';
import { 
  BarChart2, TrendingUp, Users, Clock, Globe, PieChart as PieChartIcon, 
  Calendar, Activity, Target, HelpCircle, ArrowUp, ArrowDown
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { analyzeAnalytics } from '@/utils/seo/analyticsAnalyzer';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

const EnhancedAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const [compareMode, setCompareMode] = useState(false);
  
  // Get real data from analytics analyzer
  const analyticsData = analyzeAnalytics(timeRange);
  
  // Format data for charts
  const trafficData = analyticsData.trends.visitors.map((item, index) => ({
    date: item.date,
    visits: item.count,
    pageviews: analyticsData.trends.pageviews[index].count,
    compareVisits: Math.floor(item.count * 0.85),
    compareUsers: Math.floor(item.count * 0.7),
  }));
  
  // Data for sources
  const sourcesData = [
    { name: 'Organique', value: analyticsData.trafficSources.organic },
    { name: 'Direct', value: analyticsData.trafficSources.direct },
    { name: 'Réseaux sociaux', value: analyticsData.trafficSources.social },
    { name: 'Référencement', value: analyticsData.trafficSources.referral },
    { name: 'Email', value: analyticsData.trafficSources.email },
    { name: 'Payant', value: analyticsData.trafficSources.paid },
  ];

  // Data for devices
  const devicesData = [
    { name: 'Mobile', value: analyticsData.deviceBreakdown.mobile },
    { name: 'Desktop', value: analyticsData.deviceBreakdown.desktop },
    { name: 'Tablet', value: analyticsData.deviceBreakdown.tablet },
  ];

  // Data for page performance
  const pagesData = analyticsData.topPages.map(page => ({
    name: page.url.replace('/', '').charAt(0).toUpperCase() + page.url.replace('/', '').slice(1) || 'Accueil',
    views: page.views,
    conversions: page.conversions,
    convRate: ((page.conversions / page.views) * 100).toFixed(1)
  }));

  // User engagement data
  const timeOnSiteData = Object.entries(analyticsData.timeOnSite).map(([key, value]) => ({
    name: key,
    value: value
  }));

  // Colors
  const sourceColors = ['#3b82f6', '#a3a3a3', '#f97316', '#8b5cf6', '#14b8a6', '#ef4444'];
  const deviceColors = ['#10b981', '#6366f1', '#f59e0b'];
  const timeColors = ['#e11d48', '#ec4899', '#8b5cf6', '#06b6d4'];

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  // Change time range handler
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Tableau de bord analytique</h3>
            <p className="text-gray-500 text-sm mt-1">Visualisez les performances de votre site web</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={handleTimeRangeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">7 derniers jours</SelectItem>
                <SelectItem value="30days">30 derniers jours</SelectItem>
                <SelectItem value="90days">90 derniers jours</SelectItem>
                <SelectItem value="custom">Période personnalisée</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCompareMode(!compareMode)}
              className={compareMode ? "bg-blue-50 border-blue-200" : ""}
            >
              {compareMode ? "Masquer comparaison" : "Comparer les périodes"}
            </Button>
            <Button variant="outline" size="sm">
              <HelpCircle className="h-4 w-4 mr-2" />
              Aide
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Visiteurs uniques</p>
                <h4 className="text-2xl font-bold mt-1">{formatNumber(analyticsData.uniqueVisitors)}</h4>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-xs">
              <span className={`flex items-center font-medium ${
                analyticsData.userEngagement.newUsers > analyticsData.userEngagement.returningUsers ? "text-green-600" : "text-red-600"
              }`}>
                {analyticsData.userEngagement.newUsers > analyticsData.userEngagement.returningUsers ? 
                  <ArrowUp className="h-3 w-3 mr-1" /> : 
                  <ArrowDown className="h-3 w-3 mr-1" />
                }
                {Math.abs(analyticsData.userEngagement.newUsers - analyticsData.userEngagement.returningUsers) / 
                (analyticsData.userEngagement.newUsers + analyticsData.userEngagement.returningUsers) * 100}% 
              </span>
              <span className="text-gray-500 ml-1">vs. période précédente</span>
            </div>
          </Card>
          
          <Card className="p-4 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Pages vues</p>
                <h4 className="text-2xl font-bold mt-1">{formatNumber(analyticsData.pageViews)}</h4>
              </div>
              <div className="p-2 bg-indigo-50 rounded-lg">
                <BarChart2 className="h-5 w-5 text-indigo-500" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-xs">
              <span className="flex items-center font-medium text-green-600">
                <ArrowUp className="h-3 w-3 mr-1" />
                12.3%
              </span>
              <span className="text-gray-500 ml-1">vs. période précédente</span>
            </div>
          </Card>
          
          <Card className="p-4 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Taux de rebond</p>
                <h4 className="text-2xl font-bold mt-1">{analyticsData.bounceRate.toFixed(1)}%</h4>
              </div>
              <div className="p-2 bg-amber-50 rounded-lg">
                <Activity className="h-5 w-5 text-amber-500" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-xs">
              <span className="flex items-center font-medium text-red-600">
                <ArrowUp className="h-3 w-3 mr-1" />
                2.1%
              </span>
              <span className="text-gray-500 ml-1">vs. période précédente</span>
            </div>
          </Card>
          
          <Card className="p-4 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Taux de conversion</p>
                <h4 className="text-2xl font-bold mt-1">{analyticsData.conversionRate.toFixed(2)}%</h4>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <Target className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-xs">
              <span className="flex items-center font-medium text-green-600">
                <ArrowUp className="h-3 w-3 mr-1" />
                0.5%
              </span>
              <span className="text-gray-500 ml-1">vs. période précédente</span>
            </div>
          </Card>
        </div>

        {/* Main Chart */}
        <Card className="p-4 border border-gray-200 shadow-sm mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium">Tendance du trafic</h4>
            </div>
            {compareMode && (
              <div className="flex items-center text-sm">
                <div className="flex items-center gap-1 mr-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Période actuelle</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
                  <span>Période précédente</span>
                </div>
              </div>
            )}
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPageviews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickMargin={10} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="#3b82f6" 
                  fillOpacity={1}
                  fill="url(#colorVisits)"
                  activeDot={{ r: 8 }} 
                  name="Visites"
                />
                <Area 
                  type="monotone" 
                  dataKey="pageviews" 
                  stroke="#10b981" 
                  fillOpacity={1}
                  fill="url(#colorPageviews)"
                  name="Pages vues"
                />
                {compareMode && (
                  <>
                    <Line 
                      type="monotone" 
                      dataKey="compareVisits" 
                      stroke="#93c5fd" 
                      strokeDasharray="5 5"
                      name="Visites (période précédente)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="compareUsers" 
                      stroke="#6ee7b7" 
                      strokeDasharray="5 5"
                      name="Pages vues (période précédente)"
                    />
                  </>
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Secondary Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-blue-600" />
                <h4 className="font-medium">Sources de trafic</h4>
              </div>
              <Badge variant="outline" className="bg-blue-50">
                {analyticsData.trafficSources.organic}% Organique
              </Badge>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourcesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {sourcesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={sourceColors[index % sourceColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Pourcentage']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                <h4 className="font-medium">Appareils</h4>
              </div>
              <Badge variant="outline" className="bg-green-50">
                {analyticsData.deviceBreakdown.mobile}% Mobile
              </Badge>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={devicesData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Pourcentage']} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {devicesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={deviceColors[index % deviceColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-purple-600" />
              <h4 className="font-medium">Durée des sessions</h4>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={timeOnSiteData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={true}
                  >
                    {timeOnSiteData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={timeColors[index % timeColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Sessions']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Page Performance Table */}
        <Card className="p-4 border border-gray-200 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-purple-600" />
            <h4 className="font-medium">Performance des pages</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px] text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-2 font-medium text-gray-500">Page</th>
                  <th className="text-right py-2 px-2 font-medium text-gray-500">Vues</th>
                  <th className="text-right py-2 px-2 font-medium text-gray-500">Conversions</th>
                  <th className="text-right py-2 px-2 font-medium text-gray-500">Taux de conv.</th>
                </tr>
              </thead>
              <tbody>
                {pagesData.map((page, index) => (
                  <tr key={index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium">{page.name}</td>
                    <td className="py-3 px-2 text-right">{formatNumber(page.views)}</td>
                    <td className="py-3 px-2 text-right">{formatNumber(page.conversions)}</td>
                    <td className="py-3 px-2 text-right font-medium">{page.convRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Campaign Performance */}
        <Card className="p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-indigo-600" />
            <h4 className="font-medium">Performance des campagnes</h4>
          </div>
          <div className="space-y-4">
            {analyticsData.campaignPerformance?.map((campaign, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">{campaign.name}</div>
                  <Badge variant={index === 0 ? "default" : "outline"} className={
                    index === 0 ? "bg-green-500" : "bg-gray-100"
                  }>
                    ROI: {campaign.roi.toFixed(0)}%
                  </Badge>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div>
                    <div className="text-gray-500">Clics</div>
                    <div className="font-medium">{formatNumber(campaign.clicks)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Impressions</div>
                    <div className="font-medium">{formatNumber(campaign.impressions)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">CTR</div>
                    <div className="font-medium">{campaign.ctr.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Conversions</div>
                    <div className="font-medium">{formatNumber(campaign.conversions)}</div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span>Taux de conversion</span>
                    <span className="font-medium">
                      {((campaign.conversions / campaign.clicks) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={(campaign.conversions / campaign.clicks) * 100 * 5} className="h-1.5" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Conversion Funnel */}
        <div className="mt-6">
          <Card className="p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-rose-600" />
                <h4 className="font-medium">Entonnoir de conversion</h4>
              </div>
              <Select defaultValue="0">
                <SelectTrigger className="w-[180px] h-8 text-sm">
                  <SelectValue placeholder="Choisir un entonnoir" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Achat produit</SelectItem>
                  <SelectItem value="1">Inscription newsletter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              {analyticsData.conversionFunnels?.[0].stages.map((stage, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium">{stage.name}</div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm">{formatNumber(stage.users)} utilisateurs</div>
                      {index > 0 && (
                        <Badge variant="outline" className="bg-red-50 text-red-700 text-xs">
                          -{stage.dropoffRate}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Progress 
                    value={(stage.users / analyticsData.conversionFunnels![0].stages[0].users) * 100} 
                    className={`h-3 mb-3 ${index === 0 ? 'bg-blue-100' : ''}`}
                  />
                  {index < analyticsData.conversionFunnels![0].stages.length - 1 && (
                    <div className="flex justify-center">
                      <div className="w-0 h-0 mb-2 
                        border-l-[8px] border-l-transparent 
                        border-r-[8px] border-r-transparent 
                        border-t-[8px] border-t-gray-300"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAnalytics;
