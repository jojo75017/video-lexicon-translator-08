
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Cell, Legend } from 'recharts';
import { BarChart2, TrendingUp, Users, Clock, Globe, PieChart as PieChartIcon, Calendar, Activity } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EnhancedAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7days');
  const [compareMode, setCompareMode] = useState(false);
  
  // Data for traffic chart
  const trafficData = [
    { date: '01/06', visits: 421, users: 312, compareVisits: 380, compareUsers: 290 },
    { date: '02/06', visits: 442, users: 345, compareVisits: 400, compareUsers: 310 },
    { date: '03/06', visits: 475, users: 351, compareVisits: 390, compareUsers: 288 },
    { date: '04/06', visits: 520, users: 410, compareVisits: 450, compareUsers: 330 },
    { date: '05/06', visits: 590, users: 450, compareVisits: 470, compareUsers: 350 },
    { date: '06/06', visits: 620, users: 480, compareVisits: 510, compareUsers: 375 },
    { date: '07/06', visits: 670, users: 520, compareVisits: 530, compareUsers: 390 },
  ];
  
  // Data for sources
  const sourcesData = [
    { name: 'Recherche organique', value: 52 },
    { name: 'Direct', value: 22 },
    { name: 'Réseaux sociaux', value: 18 },
    { name: 'Référencement', value: 8 },
  ];

  // Data for devices
  const devicesData = [
    { name: 'Mobile', value: 62 },
    { name: 'Desktop', value: 32 },
    { name: 'Tablet', value: 6 },
  ];

  // Data for page performance
  const pagesData = [
    { name: 'Accueil', views: 1240, bounceRate: 35, avgTime: 92 },
    { name: 'Blog', views: 980, bounceRate: 42, avgTime: 187 },
    { name: 'Services', views: 720, bounceRate: 28, avgTime: 143 },
    { name: 'À propos', views: 430, bounceRate: 51, avgTime: 76 },
    { name: 'Contact', views: 380, bounceRate: 22, avgTime: 124 },
  ];

  // Colors
  const sourceColors = ['#3b82f6', '#a3a3a3', '#f97316', '#8b5cf6'];
  const deviceColors = ['#10b981', '#6366f1', '#f59e0b'];

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Change time range handler
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    // Ici on pourrait charger de nouvelles données en fonction de la plage de temps
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
        <h3 className="text-xl font-semibold">Analyse avancée du trafic</h3>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 derniers jours</SelectItem>
              <SelectItem value="30days">30 derniers jours</SelectItem>
              <SelectItem value="3months">3 derniers mois</SelectItem>
              <SelectItem value="6months">6 derniers mois</SelectItem>
              <SelectItem value="12months">12 derniers mois</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCompareMode(!compareMode)}
            className={compareMode ? "bg-blue-50" : ""}
          >
            {compareMode ? "Masquer comparaison" : "Comparer les périodes"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="p-4 md:col-span-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium">Évolution du trafic</h4>
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
              <LineChart data={trafficData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="#3b82f6" 
                  activeDot={{ r: 8 }} 
                  name="Visites"
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#10b981" 
                  name="Utilisateurs"
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
                      name="Utilisateurs (période précédente)"
                    />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-blue-600" />
              <h4 className="font-medium">Sources</h4>
            </div>
            <Badge variant="outline" className="bg-blue-50">52% Organique</Badge>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourcesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {sourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={sourceColors[index % sourceColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <h4 className="font-medium">Appareils</h4>
            </div>
            <Badge variant="outline" className="bg-green-50">62% Mobile</Badge>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={devicesData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {devicesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={deviceColors[index % deviceColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-purple-600" />
            <h4 className="font-medium">Performance des pages</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px] text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-1 font-medium">Page</th>
                  <th className="text-right py-2 px-1 font-medium">Vues</th>
                  <th className="text-right py-2 px-1 font-medium">Taux de rebond</th>
                  <th className="text-right py-2 px-1 font-medium">Temps moyen</th>
                </tr>
              </thead>
              <tbody>
                {pagesData.map((page, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-2 px-1">{page.name}</td>
                    <td className="py-2 px-1 text-right">{page.views}</td>
                    <td className="py-2 px-1 text-right">{page.bounceRate}%</td>
                    <td className="py-2 px-1 text-right">{formatTime(page.avgTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Onglets supplémentaires */}
      <Card className="p-4">
        <Tabs defaultValue="audience">
          <TabsList className="mb-4">
            <TabsTrigger value="audience" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Audience</span>
            </TabsTrigger>
            <TabsTrigger value="acquisition" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Acquisition</span>
            </TabsTrigger>
            <TabsTrigger value="behavior" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Comportement</span>
            </TabsTrigger>
            <TabsTrigger value="conversions" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              <span>Conversions</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="audience" className="space-y-4">
            <h4 className="text-lg font-medium">Analyse d'audience</h4>
            <p className="text-gray-600">Visualisez les données démographiques et comportementales de votre audience.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <h5 className="font-medium mb-2">Données démographiques</h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Hommes</span>
                    <span>58%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Femmes</span>
                    <span>42%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>25-34 ans</span>
                    <span>32%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>35-44 ans</span>
                    <span>28%</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h5 className="font-medium mb-2">Localisation</h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>France</span>
                    <span>68%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Belgique</span>
                    <span>12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Suisse</span>
                    <span>8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Canada</span>
                    <span>6%</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="acquisition">
            <h4 className="text-lg font-medium">Canaux d'acquisition</h4>
            <p className="text-gray-600">Analyse des sources de trafic et campagnes marketing.</p>
          </TabsContent>
          
          <TabsContent value="behavior">
            <h4 className="text-lg font-medium">Comportement utilisateur</h4>
            <p className="text-gray-600">Analyse des parcours utilisateurs et interactions sur le site.</p>
          </TabsContent>
          
          <TabsContent value="conversions">
            <h4 className="text-lg font-medium">Suivi des conversions</h4>
            <p className="text-gray-600">Mesure des objectifs et performance des entonnoirs de conversion.</p>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default EnhancedAnalytics;
