
import React, { useEffect, useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { BarChart3, Users, Clock, ArrowRight, Globe, Smartphone, TrendingUp, Calendar, Filter, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { analyzeAnalytics } from '@/utils/seo/analyticsAnalyzer';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AnalyticsOverview = () => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30days');
  const [activeTab, setActiveTab] = useState('performance');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = analyzeAnalytics(timeRange);
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
  }, [timeRange]);

  // Formatage des données pour les graphiques
  const visitorsChartData = useMemo(() => {
    if (!analyticsData?.trends?.visitors) return [];
    return analyticsData.trends.visitors.map((item: any) => ({
      date: item.date.slice(5), // Format MM-DD
      visits: item.count
    }));
  }, [analyticsData]);

  const deviceData = useMemo(() => {
    if (!analyticsData?.deviceBreakdown) return [];
    return [
      { name: 'Desktop', value: analyticsData.deviceBreakdown.desktop },
      { name: 'Mobile', value: analyticsData.deviceBreakdown.mobile },
      { name: 'Tablet', value: analyticsData.deviceBreakdown.tablet }
    ];
  }, [analyticsData]);

  const trafficSourceData = useMemo(() => {
    if (!analyticsData?.trafficSources) return [];
    return [
      { name: 'Organique', value: analyticsData.trafficSources.organic },
      { name: 'Direct', value: analyticsData.trafficSources.direct },
      { name: 'Référents', value: analyticsData.trafficSources.referral },
      { name: 'Social', value: analyticsData.trafficSources.social },
      { name: 'Email', value: analyticsData.trafficSources.email },
      { name: 'Payant', value: analyticsData.trafficSources.paid }
    ];
  }, [analyticsData]);

  const campaignPerformanceData = useMemo(() => {
    return analyticsData?.campaignPerformance || [];
  }, [analyticsData]);

  const conversionFunnelData = useMemo(() => {
    if (!analyticsData?.conversionFunnels?.[0]) return [];
    return analyticsData.conversionFunnels[0].stages;
  }, [analyticsData]);

  const contentPerformanceData = useMemo(() => {
    return analyticsData?.contentPerformance || [];
  }, [analyticsData]);

  const deviceColors = ['#4F46E5', '#10B981', '#F59E0B'];
  const sourceColors = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#EF4444'];

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    toast.info(`Période changée: ${range}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Aperçu Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-[300px] w-full mb-6" />
          <Skeleton className="h-[200px] w-full" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h3 className="text-lg font-semibold">Aperçu Analytics</h3>
          <div className="flex flex-wrap gap-2">
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
              variant={timeRange === 'custom' ? "default" : "outline"} 
              size="sm"
              onClick={() => handleTimeRangeChange('custom')}
              className="gap-1"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Personnalisé</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-blue-600 font-medium">Visiteurs uniques</span>
            </div>
            <p className="text-2xl font-bold">{analyticsData?.uniqueVisitors?.toLocaleString()}</p>
            <div className="flex justify-between items-center mt-1">
              <p className="text-sm text-blue-600">Visiteurs actuels</p>
              <span className="text-xs text-green-600 flex items-center">
                +12.5% <TrendingUp className="ml-1 h-3 w-3" />
              </span>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <span className="text-green-600 font-medium">Pages vues</span>
            </div>
            <p className="text-2xl font-bold">{analyticsData?.pageViews?.toLocaleString()}</p>
            <div className="flex justify-between items-center mt-1">
              <p className="text-sm text-green-600">Vues totales</p>
              <span className="text-xs text-green-600 flex items-center">
                +8.2% <TrendingUp className="ml-1 h-3 w-3" />
              </span>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <ArrowRight className="h-5 w-5 text-purple-600" />
              <span className="text-purple-600 font-medium">Taux de rebond</span>
            </div>
            <p className="text-2xl font-bold">{analyticsData?.bounceRate?.toFixed(1)}%</p>
            <div className="flex justify-between items-center mt-1">
              <p className="text-sm text-purple-600">Taux actuel</p>
              <span className="text-xs text-red-600 flex items-center">
                +2.1% <TrendingUp className="ml-1 h-3 w-3" />
              </span>
            </div>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-amber-600" />
              <span className="text-amber-600 font-medium">Temps moyen</span>
            </div>
            <p className="text-2xl font-bold">{formatTime(analyticsData?.averageTimeOnPage)}</p>
            <div className="flex justify-between items-center mt-1">
              <p className="text-sm text-amber-600">Durée de visite</p>
              <span className="text-xs text-green-600 flex items-center">
                +0.8% <TrendingUp className="ml-1 h-3 w-3" />
              </span>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="performance" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>Performance</span>
            </TabsTrigger>
            <TabsTrigger value="audience" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Audience</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span>Contenu</span>
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span>Campagnes</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-3">Tendance des visiteurs</h4>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={visitorsChartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="visits" 
                        stroke="#4F46E5" 
                        fill="url(#visitorsGradient)" 
                        fillOpacity={1}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-3">Taux de conversion</h4>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={conversionFunnelData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="users" fill="#8884d8" />
                      <Bar dataKey="dropoffRate" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-3">Sources de trafic</h4>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={trafficSourceData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {trafficSourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={sourceColors[index]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-3">Répartition par appareil</h4>
                <div className="h-[250px]">
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
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={deviceColors[index]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="audience" className="pt-4">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-3">Répartition géographique</h4>
                <div className="space-y-3">
                  {analyticsData?.topCountries?.map((country: any, index: number) => (
                    <div 
                      key={country.country}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <span>{country.country}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500"
                            style={{ width: `${country.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{country.visits.toLocaleString()} ({country.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-3">Engagement utilisateur</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600">Nouveaux utilisateurs</p>
                      <p className="text-xl font-bold">{analyticsData?.userEngagement?.newUsers?.toLocaleString()}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-green-600 flex items-center">
                          +5.3% <ArrowUpRight className="ml-1 h-3 w-3" />
                        </span>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-purple-600">Utilisateurs de retour</p>
                      <p className="text-xl font-bold">{analyticsData?.userEngagement?.returningUsers?.toLocaleString()}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-green-600 flex items-center">
                          +2.7% <ArrowUpRight className="ml-1 h-3 w-3" />
                        </span>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600">Sessions par utilisateur</p>
                      <p className="text-xl font-bold">{analyticsData?.userEngagement?.averageSessionsPerUser?.toFixed(1)}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-red-600 flex items-center">
                          -0.8% <ArrowDownRight className="ml-1 h-3 w-3" />
                        </span>
                      </div>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <p className="text-sm text-amber-600">Pages par session</p>
                      <p className="text-xl font-bold">{analyticsData?.userEngagement?.pagesPerSession?.toFixed(1)}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-green-600 flex items-center">
                          +1.2% <ArrowUpRight className="ml-1 h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-3">Temps passé sur le site</h4>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: '0-30s', value: analyticsData?.timeOnSite?.['0-30s'] || 0 },
                            { name: '30s-2m', value: analyticsData?.timeOnSite?.['30s-2m'] || 0 },
                            { name: '2m-5m', value: analyticsData?.timeOnSite?.['2m-5m'] || 0 },
                            { name: '5m+', value: analyticsData?.timeOnSite?.['5m+'] || 0 }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill="#EF4444" />
                          <Cell fill="#F59E0B" />
                          <Cell fill="#10B981" />
                          <Cell fill="#3B82F6" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="pt-4">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-3">Performance du contenu</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type de contenu</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vues</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temps moyen</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taux de rebond</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {contentPerformanceData.map((item: any, index: number) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.contentType}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.views.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTime(item.avgTimeOnPage)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.bounceRate}%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.conversions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-3">Pages les plus visitées</h4>
                  <div className="space-y-2">
                    {analyticsData?.topPages?.slice(0, 5).map((page: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex-1 truncate">
                          <span className="text-sm font-medium">{page.url}</span>
                        </div>
                        <div className="text-sm text-gray-500">{page.views.toLocaleString()} vues</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-3">Mots-clés principaux</h4>
                  <div className="space-y-2">
                    {analyticsData?.topKeywords?.map((keyword: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex-1">
                          <span className="text-sm font-medium">{keyword.keyword}</span>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-gray-500">Position: {keyword.position}</span>
                            <span className="mx-2">•</span>
                            <span className="text-xs text-gray-500">CTR: {keyword.ctr.toFixed(1)}%</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">{keyword.clicks.toLocaleString()} clics</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="pt-4">
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-3">Performance des campagnes</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campagne</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clics</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impressions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTR</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coût</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROI</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {campaignPerformanceData.map((campaign: any, index: number) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{campaign.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.clicks.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.impressions.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.ctr.toFixed(1)}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.conversions.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.cost.toLocaleString()} €</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.roi.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-600 mb-3">Distribution des conversions</h4>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} width={730} height={250} data={campaignPerformanceData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                    <Radar name="ROI" dataKey="roi" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Radar name="CTR" dataKey="ctr" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AnalyticsOverview;
