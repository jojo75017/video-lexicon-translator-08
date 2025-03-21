
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { BarChart3, Users, Clock, ArrowRight, Globe, Smartphone, TrendingUp, Calendar } from "lucide-react";
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
  Bar
} from 'recharts';
import { analyzeAnalytics } from '@/utils/seo/analyticsAnalyzer';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const AnalyticsOverview = () => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30days');

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

  // Préparer les données pour les graphiques
  const last7Days = analyticsData?.trends?.visitors?.slice(-7) || [];
  const chartData = last7Days.map((item: any) => ({
    date: item.date.slice(5), // Format MM-DD
    visits: item.count
  }));

  const deviceData = analyticsData ? [
    { name: 'Desktop', value: analyticsData.deviceBreakdown?.desktop || 0 },
    { name: 'Mobile', value: analyticsData.deviceBreakdown?.mobile || 0 },
    { name: 'Tablet', value: analyticsData.deviceBreakdown?.tablet || 0 }
  ] : [];

  const deviceColors = ['#4F46E5', '#10B981', '#F59E0B'];

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Préparation des données de sources de trafic pour le graphique en barre
  const trafficSourceData = analyticsData ? [
    { name: 'Organique', value: analyticsData.trafficSources?.organic || 0 },
    { name: 'Direct', value: analyticsData.trafficSources?.direct || 0 },
    { name: 'Référents', value: analyticsData.trafficSources?.referral || 0 },
    { name: 'Social', value: analyticsData.trafficSources?.social || 0 },
    { name: 'Email', value: analyticsData.trafficSources?.email || 0 },
    { name: 'Payant', value: analyticsData.trafficSources?.paid || 0 }
  ] : [];
  
  const sourceColors = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#EF4444'];

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    toast.info(`Période changée: ${range}`);
    // Ici, on pourrait recharger les données pour la période sélectionnée
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
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Aperçu Analytics</h3>
          <div className="flex space-x-2">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-3">Trafic sur 7 jours</h4>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="visits" 
                    stroke="#4F46E5" 
                    fill="#4F46E5" 
                    fillOpacity={0.1} 
                  />
                </AreaChart>
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
            <h4 className="text-sm font-medium text-gray-600 mb-3">Principaux pays</h4>
            <div className="space-y-3">
              {analyticsData?.topCountries?.map((country: any, index: number) => (
                <div 
                  key={country.country}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
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
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsOverview;
