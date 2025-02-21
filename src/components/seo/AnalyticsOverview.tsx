
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { BarChart3, Users, Clock, ArrowRight, Globe, DevicePhoneIcon } from "lucide-react";
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
  Cell
} from 'recharts';
import { analyzeAnalytics } from '@/utils/seo/analyticsAnalyzer';
import { toast } from "sonner";

const AnalyticsOverview = () => {
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

  const chartData = [
    { date: '01/05', visits: analyticsData.pageViews / 7 },
    { date: '02/05', visits: analyticsData.pageViews / 6 },
    { date: '03/05', visits: analyticsData.pageViews / 5 },
    { date: '04/05', visits: analyticsData.pageViews / 4 },
    { date: '05/05', visits: analyticsData.pageViews / 3 },
    { date: '06/05', visits: analyticsData.pageViews / 2 },
    { date: '07/05', visits: analyticsData.pageViews }
  ];

  const deviceColors = ['#4F46E5', '#10B981', '#F59E0B'];

  const deviceData = [
    { name: 'Desktop', value: analyticsData.deviceBreakdown.desktop },
    { name: 'Mobile', value: analyticsData.deviceBreakdown.mobile },
    { name: 'Tablet', value: analyticsData.deviceBreakdown.tablet }
  ];

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Aperçu Analytics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-blue-600 font-medium">Visiteurs uniques</span>
            </div>
            <p className="text-2xl font-bold">{analyticsData.uniqueVisitors}</p>
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
            <p className="text-2xl font-bold">{analyticsData.bounceRate}%</p>
            <p className="text-sm text-purple-600">Taux de rebond actuel</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-3">Trafic sur 7 jours</h4>
            <div className="h-[200px]">
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
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={deviceColors[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 text-sm">
                {deviceData.map((device, index) => (
                  <div key={device.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: deviceColors[index] }}
                    />
                    <span>{device.name}</span>
                  </div>
                ))}
              </div>
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
                <span className="font-medium">{country.visits} visites</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsOverview;

