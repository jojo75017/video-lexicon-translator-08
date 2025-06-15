
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Users, Globe, Calendar, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { analyzeAnalytics } from '@/utils/seo/analyticsAnalyzer';

const EnhancedAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const [activeMetric, setActiveMetric] = useState('visitors');
  
  const analyticsData = analyzeAnalytics(timeRange);

  const deviceData = [
    { name: 'Mobile', value: analyticsData.deviceBreakdown.mobile, color: '#3b82f6' },
    { name: 'Desktop', value: analyticsData.deviceBreakdown.desktop, color: '#10b981' },
    { name: 'Tablet', value: analyticsData.deviceBreakdown.tablet, color: '#f59e0b' }
  ];

  const timeOnSiteData = [
    { name: '0-30s', value: analyticsData.timeOnSite['0-30s'] },
    { name: '30s-2m', value: analyticsData.timeOnSite['30s-2m'] },
    { name: '2m-5m', value: analyticsData.timeOnSite['2m-5m'] },
    { name: '5m+', value: analyticsData.timeOnSite['5m+'] }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête avec métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pages vues</p>
              <p className="text-2xl font-bold">{analyticsData.pageViews.toLocaleString()}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-xs text-green-600 mt-1">+12% vs période précédente</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Visiteurs uniques</p>
              <p className="text-2xl font-bold">{analyticsData.uniqueVisitors.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-xs text-green-600 mt-1">+8% vs période précédente</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taux de rebond</p>
              <p className="text-2xl font-bold">{analyticsData.bounceRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
          <p className="text-xs text-red-600 mt-1">-2% vs période précédente</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taux de conversion</p>
              <p className="text-2xl font-bold">{analyticsData.conversionRate}%</p>
            </div>
            <Activity className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-xs text-green-600 mt-1">+0.5% vs période précédente</p>
        </Card>
      </div>

      {/* Sélecteur de période */}
      <div className="flex gap-2">
        {['7days', '30days', '90days'].map((period) => (
          <Button
            key={period}
            variant={timeRange === period ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange(period)}
          >
            {period === '7days' ? '7 jours' : period === '30days' ? '30 jours' : '90 jours'}
          </Button>
        ))}
      </div>

      {/* Graphiques principaux */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
          <TabsTrigger value="devices">Appareils</TabsTrigger>
          <TabsTrigger value="pages">Pages populaires</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Évolution du trafic</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.trends.visitors}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Visiteurs"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Répartition par appareil</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Pages les plus visitées</h3>
            <div className="space-y-3">
              {analyticsData.topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{page.url}</p>
                    <p className="text-sm text-gray-600">{page.views.toLocaleString()} vues</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{page.conversions} conversions</p>
                    <p className="text-xs text-gray-500">
                      {((page.conversions / page.views) * 100).toFixed(1)}% taux
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Temps passé sur le site</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeOnSiteData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAnalytics;
