
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
  ExternalLink
} from 'lucide-react';
import SeoOverview from '@/components/seo/SeoOverview';
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
  Legend
} from 'recharts';

const visitData = [
  { day: 'Lun', visits: 2400, pageviews: 4800 },
  { day: 'Mar', visits: 1398, pageviews: 3200 },
  { day: 'Mer', visits: 9800, pageviews: 15000 },
  { day: 'Jeu', visits: 3908, pageviews: 7800 },
  { day: 'Ven', visits: 4800, pageviews: 9600 },
  { day: 'Sam', visits: 3800, pageviews: 6400 },
  { day: 'Dim', visits: 4300, pageviews: 8000 },
];

const deviceData = [
  { device: 'Mobile', visits: 4000, percentage: 50 },
  { device: 'Desktop', visits: 3000, percentage: 37.5 },
  { device: 'Tablet', visits: 1000, percentage: 12.5 },
];

const sourceData = [
  { source: 'Google', visits: 3500, percentage: 42 },
  { source: 'Direct', visits: 2000, percentage: 24 },
  { source: 'Referral', visits: 1500, percentage: 18 },
  { source: 'Social', visits: 1000, percentage: 12 },
  { source: 'Email', visits: 500, percentage: 6 },
];

const pageData = [
  { page: '/accueil', views: 2800, avgTime: '1:45' },
  { page: '/services', views: 1900, avgTime: '2:30' },
  { page: '/blog/seo-guide', views: 1550, avgTime: '4:10' },
  { page: '/contact', views: 950, avgTime: '1:05' },
  { page: '/a-propos', views: 800, avgTime: '1:35' },
];

const conversionData = [
  { name: 'Contact', value: 65 },
  { name: 'Inscription', value: 25 },
  { name: 'Achat', value: 10 },
];

const conversionColors = ['#8884d8', '#83a6ed', '#8dd1e1'];

const AnalyticsTabContent = () => {
  const [timeRange, setTimeRange] = useState('7d');
  
  // Données fictives pour l'aperçu SEO
  const seoOverviewData = {
    score: 78,
    suggestions: [
      "Améliorer le temps de chargement",
      "Optimiser les images pour les appareils mobiles",
      "Ajouter des balises alt à toutes les images"
    ],
    performance: {
      score: 78,
      loadTime: 2500,
      firstContentfulPaint: 1800,
      domLoadTime: 2200,
      timeToInteractive: 3000,
      scriptCount: 12,
      resourceCount: 45,
      imageCount: 15,
      cacheLifetime: 3600,
      totalSize: 2500000,
      resourceBreakdown: {
        images: 1500000,
        scripts: 500000,
        styles: 300000,
        fonts: 150000,
        other: 50000
      },
      largestContentfulPaint: 2100,
      speedIndex: 2800,
      responseTime: 180,
      impressions: 5800,
      clickThroughRate: 3.2
    }
  };

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
          value="15,842"
          change={12.5}
          icon={<Users className="h-5 w-5 text-blue-600" />}
        />
        <MetricCard 
          title="Pages Vues"
          value="42,928"
          change={8.3}
          icon={<Globe className="h-5 w-5 text-indigo-600" />}
        />
        <MetricCard 
          title="Taux de Rebond"
          value="38.2%"
          change={-5.1}
          isGoodWhenNegative={true}
          icon={<Activity className="h-5 w-5 text-emerald-600" />}
        />
        <MetricCard 
          title="Durée Moyenne"
          value="2:18"
          change={15.7}
          icon={<Clock className="h-5 w-5 text-purple-600" />}
        />
      </div>
      
      <SeoOverview 
        score={seoOverviewData.score}
        suggestions={seoOverviewData.suggestions}
        performance={seoOverviewData.performance}
      />
      
      <Tabs defaultValue="traffic">
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="traffic" className="flex-1">Trafic</TabsTrigger>
          <TabsTrigger value="behavior" className="flex-1">Comportement</TabsTrigger>
          <TabsTrigger value="conversion" className="flex-1">Conversion</TabsTrigger>
          <TabsTrigger value="sources" className="flex-1">Sources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="traffic">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 shadow-md">
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
            
            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 shadow-md">
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
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'percentage') return [`${value}%`, 'Pourcentage'];
                        return [value, 'Visites'];
                      }}
                    />
                    <Legend />
                    <Bar dataKey="visits" name="Visites" fill="#8884d8" />
                    <Bar dataKey="percentage" name="Pourcentage" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="behavior">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 shadow-md">
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
                        <tr key={index} className="border-t border-gray-100 dark:border-gray-800">
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
            
            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  Comportement des visiteurs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-500 mb-1">Pages par session</div>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">3.2</div>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-500 mb-1">Taux de rebond</div>
                    <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">38.2%</div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-500 mb-1">Durée session</div>
                    <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">2:18</div>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-500 mb-1">Nouveaux visiteurs</div>
                    <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">68%</div>
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
            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 shadow-md">
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
            
            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 shadow-md">
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
            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 shadow-md">
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
            
            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 shadow-md">
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
                    <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
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
    <Card className="bg-white dark:bg-gray-800 shadow-sm">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</div>
            <div className="text-2xl font-bold">{value}</div>
          </div>
          <div className="rounded-full p-2 bg-blue-50 dark:bg-blue-900/20">
            {icon}
          </div>
        </div>
        <div className="mt-3 flex items-center">
          {isPositiveChange ? (
            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm font-medium ${isPositiveChange ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {Math.abs(change)}% {isPositiveChange ? 'hausse' : 'baisse'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const Clock = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
};

export default AnalyticsTabContent;
