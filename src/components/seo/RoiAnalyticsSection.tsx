
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, LineChart, PercentSquare, TrendingUp, ArrowUp, ArrowRight, DollarSign } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { calculateSeoROI } from '@/utils/seo/semanticAnalyzer';

interface AnalyticsData {
  visitors?: number;
  pageViews?: number;
  bounceRate?: number;
  avgSessionDuration?: number;
  conversions?: number;
  conversionRate?: number;
  ctr?: number;
}

interface PerformanceMetrics {
  loadTime?: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  speedIndex?: number;
  totalBlockingTime?: number;
  score?: number;
  resourceBreakdown?: {
    js: number;
    css: number;
    images: number;
    fonts: number;
    other: number;
  };
}

interface RoiAnalyticsSectionProps {
  analytics?: AnalyticsData;
  performance?: PerformanceMetrics;
  isLoading: boolean;
}

const RoiAnalyticsSection = ({
  analytics = {},
  performance = {},
  isLoading
}: RoiAnalyticsSectionProps) => {
  // Default values
  const [traffic, setTraffic] = useState(analytics?.visitors || 1000);
  const [conversionRate, setConversionRate] = useState(analytics?.conversionRate || 2.5);
  const [avgOrderValue, setAvgOrderValue] = useState(85);
  
  const roi = calculateSeoROI(traffic, conversionRate, avgOrderValue);

  // Create chart data
  const months = ["Jan", "Fev", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Dec"];
  
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
    
  const getScoreColor = (score?: number) => {
    if (score === undefined) return "bg-gray-200";
    if (score >= 90) return "bg-green-500";
    if (score >= 70) return "bg-yellow-500";
    if (score >= 50) return "bg-orange-500";
    return "bg-red-500";
  };
  
  const getLoadTimeLabel = (time?: number) => {
    if (time === undefined) return "Inconnu";
    if (time < 1) return "Excellent";
    if (time < 2.5) return "Bon";
    if (time < 4) return "Moyen";
    return "Lent";
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-white to-slate-50">
      <div className="flex items-center mb-4">
        <div className="w-1 h-6 bg-purple-500 rounded-full mr-3"></div>
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Performance et ROI
        </h2>
      </div>
      
      <Tabs defaultValue="roi" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="roi" className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            ROI
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-1">
            <LineChart className="h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="roi">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthly-traffic">Trafic mensuel</Label>
                <div className="flex gap-3">
                  <Input 
                    id="monthly-traffic"
                    type="number" 
                    value={traffic}
                    onChange={(e) => setTraffic(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full"
                  />
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                    visiteurs
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="conversion-rate">Taux de conversion (%)</Label>
                <div className="flex gap-3">
                  <Input 
                    id="conversion-rate"
                    type="number" 
                    value={conversionRate}
                    onChange={(e) => setConversionRate(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                    step="0.1"
                    className="w-full"
                  />
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                    %
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="avg-order">Valeur moyenne commande</Label>
                <div className="flex gap-3">
                  <Input 
                    id="avg-order"
                    type="number" 
                    value={avgOrderValue}
                    onChange={(e) => setAvgOrderValue(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full"
                  />
                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                    €
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-3">Résultats calculés</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-3 rounded-lg shadow-sm flex flex-col">
                  <span className="text-xs text-gray-500">Conversions mensuelles</span>
                  <div className="text-lg font-semibold">{roi.monthlyConversions.toFixed(1)}</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm flex flex-col">
                  <span className="text-xs text-gray-500">Revenu mensuel</span>
                  <div className="text-lg font-semibold text-green-600">{formatCurrency(roi.monthlyRevenue)}</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm flex flex-col">
                  <span className="text-xs text-gray-500">Revenu annuel</span>
                  <div className="text-lg font-semibold text-green-700">{formatCurrency(roi.yearlyRevenue)}</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm flex flex-col">
                  <span className="text-xs text-gray-500">ROI sur 2 ans</span>
                  <div className="text-lg font-semibold text-purple-600">{formatCurrency(roi.roi.twoYears)}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <h3 className="font-medium mb-3">Projection ROI par période</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-500">3 mois</span>
                    <span className="text-sm font-medium">{formatCurrency(roi.roi.threeMonths)}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-500">6 mois</span>
                    <span className="text-sm font-medium">{formatCurrency(roi.roi.sixMonths)}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-500">1 an</span>
                    <span className="text-sm font-medium">{formatCurrency(roi.roi.oneYear)}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-full bg-blue-700 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-500">2 ans</span>
                    <span className="text-sm font-medium">{formatCurrency(roi.roi.twoYears)}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-full bg-blue-800 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-800">Visiteurs</h3>
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {analytics.visitors ? analytics.visitors.toLocaleString() : '1,243'}
                </div>
                <div className="flex items-center mt-2 text-xs text-green-600">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  <span>+12.5% vs mois dernier</span>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-800">Pages vues</h3>
                  <BarChart3 className="h-4 w-4 text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {analytics.pageViews ? analytics.pageViews.toLocaleString() : '3,721'}
                </div>
                <div className="flex items-center mt-2 text-xs text-green-600">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  <span>+8.2% vs mois dernier</span>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-800">Taux rebond</h3>
                  <PercentSquare className="h-4 w-4 text-amber-500" />
                </div>
                <div className="text-2xl font-bold text-amber-600">
                  {analytics.bounceRate ? analytics.bounceRate.toFixed(1) + '%' : '52.7%'}
                </div>
                <div className="flex items-center mt-2 text-xs text-red-600">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  <span>+2.3% vs mois dernier</span>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-800">Conversions</h3>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {analytics.conversions ? analytics.conversions.toLocaleString() : '83'}
                </div>
                <div className="flex items-center mt-2 text-xs text-green-600">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  <span>+15.8% vs mois dernier</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <h3 className="font-medium mb-4">Trafic par source</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Organique</span>
                    <span className="text-sm font-medium">56%</span>
                  </div>
                  <Progress value={56} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Direct</span>
                    <span className="text-sm font-medium">22%</span>
                  </div>
                  <Progress value={22} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Réseaux sociaux</span>
                    <span className="text-sm font-medium">14%</span>
                  </div>
                  <Progress value={14} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Référencement</span>
                    <span className="text-sm font-medium">8%</span>
                  </div>
                  <Progress value={8} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="performance">
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <h3 className="font-medium mb-3">Score de performance</h3>
              <div className="flex items-center justify-center">
                <div className="relative rounded-full h-32 w-32 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      className="text-gray-100"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                    />
                    <circle
                      className={getScoreColor(performance?.score)}
                      strokeWidth="10"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * (performance?.score || 0) / 100)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold">
                      {performance?.score || 0}
                    </div>
                    <div className="text-xs text-gray-500">sur 100</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-xs text-gray-500">Temps de chargement</div>
                  <div className="flex items-center">
                    <div className="text-lg font-semibold">
                      {performance?.loadTime?.toFixed(1) || '2.4'} s
                    </div>
                    <Badge className="ml-2 text-xs" variant="outline">
                      {getLoadTimeLabel(performance?.loadTime)}
                    </Badge>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-xs text-gray-500">First Contentful Paint</div>
                  <div className="flex items-center">
                    <div className="text-lg font-semibold">
                      {performance?.firstContentfulPaint?.toFixed(1) || '1.2'} s
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-xs text-gray-500">Largest Contentful Paint</div>
                  <div className="flex items-center">
                    <div className="text-lg font-semibold">
                      {performance?.largestContentfulPaint?.toFixed(1) || '2.8'} s
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <h3 className="font-medium mb-3">Répartition des ressources</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">JavaScript</span>
                    <span className="text-sm font-medium">
                      {performance?.resourceBreakdown?.js || 235} KB
                    </span>
                  </div>
                  <Progress 
                    value={performance?.resourceBreakdown?.js ? Math.min(performance.resourceBreakdown.js / 10, 100) : 24} 
                    className="h-2 bg-gray-100" 
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">CSS</span>
                    <span className="text-sm font-medium">
                      {performance?.resourceBreakdown?.css || 56} KB
                    </span>
                  </div>
                  <Progress 
                    value={performance?.resourceBreakdown?.css ? Math.min(performance.resourceBreakdown.css / 3, 100) : 19} 
                    className="h-2 bg-gray-100" 
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Images</span>
                    <span className="text-sm font-medium">
                      {performance?.resourceBreakdown?.images || 845} KB
                    </span>
                  </div>
                  <Progress 
                    value={performance?.resourceBreakdown?.images ? Math.min(performance.resourceBreakdown.images / 20, 100) : 42} 
                    className="h-2 bg-gray-100" 
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Fonts</span>
                    <span className="text-sm font-medium">
                      {performance?.resourceBreakdown?.fonts || 124} KB
                    </span>
                  </div>
                  <Progress 
                    value={performance?.resourceBreakdown?.fonts ? Math.min(performance.resourceBreakdown.fonts / 5, 100) : 25} 
                    className="h-2 bg-gray-100" 
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Other</span>
                    <span className="text-sm font-medium">
                      {performance?.resourceBreakdown?.other || 38} KB
                    </span>
                  </div>
                  <Progress 
                    value={performance?.resourceBreakdown?.other ? Math.min(performance.resourceBreakdown.other / 2, 100) : 19} 
                    className="h-2 bg-gray-100" 
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default RoiAnalyticsSection;
