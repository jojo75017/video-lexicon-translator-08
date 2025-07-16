
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MetricsPage = () => {
  const [timeframe, setTimeframe] = useState('7d');
  
  const performanceData = [
    { date: '01/06', score: 85, speed: 2.4, fcp: 1.2, lcp: 2.8 },
    { date: '02/06', score: 82, speed: 2.6, fcp: 1.3, lcp: 3.0 },
    { date: '03/06', score: 88, speed: 2.2, fcp: 1.1, lcp: 2.6 },
    { date: '04/06', score: 90, speed: 2.0, fcp: 1.0, lcp: 2.4 },
    { date: '05/06', score: 86, speed: 2.3, fcp: 1.2, lcp: 2.7 },
    { date: '06/06', score: 89, speed: 2.1, fcp: 1.1, lcp: 2.5 },
    { date: '07/06', score: 92, speed: 1.9, fcp: 0.9, lcp: 2.3 },
  ];
  
  const resourceData = [
    { type: 'HTML', size: 46, count: 1 },
    { type: 'CSS', size: 184, count: 3 },
    { type: 'JavaScript', size: 742, count: 8 },
    { type: 'Images', size: 1245, count: 12 },
    { type: 'Fonts', size: 298, count: 2 },
    { type: 'Other', size: 124, count: 5 },
  ];
  
  return (
    <PageLayout title="Métriques de Performance" description="Analyser les métriques détaillées de performance">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Métriques de Performance</h1>
          
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">1 jour</SelectItem>
              <SelectItem value="7d">7 jours</SelectItem>
              <SelectItem value="30d">30 jours</SelectItem>
              <SelectItem value="90d">90 jours</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Score Performance</h3>
            <div className="text-4xl font-bold text-blue-600">92<span className="text-xl font-medium text-gray-400">/100</span></div>
            <div className="text-sm text-green-600 mt-1">+3 depuis la semaine dernière</div>
          </Card>
          
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Temps de Chargement</h3>
            <div className="text-4xl font-bold text-blue-600">1.9<span className="text-xl font-medium text-gray-400">s</span></div>
            <div className="text-sm text-green-600 mt-1">-0.2s depuis la semaine dernière</div>
          </Card>
          
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Taille de la Page</h3>
            <div className="text-4xl font-bold text-blue-600">2.6<span className="text-xl font-medium text-gray-400">MB</span></div>
            <div className="text-sm text-red-600 mt-1">+0.3MB depuis la semaine dernière</div>
          </Card>
        </div>
        
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="performance">Scores de Performance</TabsTrigger>
            <TabsTrigger value="timings">Temps de Chargement</TabsTrigger>
            <TabsTrigger value="resources">Ressources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Évolution du Score Performance</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={performanceData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#3b82f6" name="Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Performances Mobile</h4>
                  <div className="text-2xl font-bold text-blue-600">87<span className="text-base font-medium text-gray-400">/100</span></div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Performances Desktop</h4>
                  <div className="text-2xl font-bold text-blue-600">94<span className="text-base font-medium text-gray-400">/100</span></div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Accessibilité</h4>
                  <div className="text-2xl font-bold text-blue-600">89<span className="text-base font-medium text-gray-400">/100</span></div>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="timings">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Métrique de Vitesse Web</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={performanceData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="speed" fill="#3b82f6" name="Temps de Chargement (s)" />
                    <Bar dataKey="fcp" fill="#10b981" name="First Contentful Paint (s)" />
                    <Bar dataKey="lcp" fill="#f59e0b" name="Largest Contentful Paint (s)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Time to Interactive</h4>
                  <div className="text-2xl font-bold text-blue-600">2.4s</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Total Blocking Time</h4>
                  <div className="text-2xl font-bold text-blue-600">120ms</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Cumulative Layout Shift</h4>
                  <div className="text-2xl font-bold text-blue-600">0.02</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Speed Index</h4>
                  <div className="text-2xl font-bold text-blue-600">1.7s</div>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="resources">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Distribution des Ressources</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={resourceData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis yAxisId="size" orientation="left" />
                    <YAxis yAxisId="count" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="size" dataKey="size" fill="#3b82f6" name="Taille (KB)" />
                    <Bar yAxisId="count" dataKey="count" fill="#f59e0b" name="Nombre" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-3">Optimisations Recommandées</h4>
                <ul className="space-y-2">
                  <li className="bg-blue-50 p-3 rounded-lg">
                    <div className="font-medium text-blue-800">Réduire les ressources JavaScript non utilisées</div>
                    <div className="text-sm text-blue-600 mt-1">Économie potentielle: 320KB</div>
                  </li>
                  <li className="bg-blue-50 p-3 rounded-lg">
                    <div className="font-medium text-blue-800">Optimiser les images</div>
                    <div className="text-sm text-blue-600 mt-1">Économie potentielle: 480KB</div>
                  </li>
                  <li className="bg-blue-50 p-3 rounded-lg">
                    <div className="font-medium text-blue-800">Mettre en place une politique de cache efficace</div>
                    <div className="text-sm text-blue-600 mt-1">Amélioration: temps de chargement pour les visiteurs récurrents</div>
                  </li>
                </ul>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default MetricsPage;
