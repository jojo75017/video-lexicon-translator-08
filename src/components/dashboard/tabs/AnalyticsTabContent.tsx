
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart2, TrendingUp, PieChart, Users, Globe, Activity } from 'lucide-react';
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
  Bar
} from 'recharts';

const visitData = [
  { day: 'Lun', visits: 2400 },
  { day: 'Mar', visits: 1398 },
  { day: 'Mer', visits: 9800 },
  { day: 'Jeu', visits: 3908 },
  { day: 'Ven', visits: 4800 },
  { day: 'Sam', visits: 3800 },
  { day: 'Dim', visits: 4300 },
];

const deviceData = [
  { device: 'Mobile', visits: 4000 },
  { device: 'Desktop', visits: 3000 },
  { device: 'Tablet', visits: 2000 },
];

const AnalyticsTabContent = () => {
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
      styleCount: 8,
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
      <h2 className="text-2xl font-bold">Analytiques</h2>
      <p className="text-muted-foreground">
        Performances de votre site et statistiques de visite
      </p>
      
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
        </TabsList>
        
        <TabsContent value="traffic">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
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
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="visits" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
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
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="device" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="visits" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="behavior">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-600" />
                Comportement des visiteurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Cette section montrera des données comme le taux de rebond, la durée moyenne de session, etc.</p>
              <Button className="mt-4">Récupérer les données</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="conversion">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <PieChart className="h-4 w-4 text-blue-600" />
                Conversions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Cette section montrera des données comme le taux de conversion, les objectifs atteints, etc.</p>
              <Button className="mt-4">Récupérer les données</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsTabContent;
