
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { analyzePerformance, getLighthouseScore, getMockedWpt } from '@/utils/seo/performanceAnalyzer';
import { Performance } from '@/types/seo';
import PerformanceMetrics from '@/components/PerformanceMetrics';
import LoadingPerformance from '@/components/seo/LoadingPerformance';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileDown, RefreshCw, Zap } from "lucide-react";

const PerformanceTabContent = () => {
  const [performanceData, setPerformanceData] = useState<Performance | null>(null);
  const [lighthouseScore, setLighthouseScore] = useState<{score: number; issues: {category: string; description: string}[]}>(
    {score: 0, issues: []}
  );
  const [wptData, setWptData] = useState<any>(null);
  const [resourcesData, setResourcesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Generate performance data when component mounts
    const startTime = performance.now();
    setLoading(true);
    
    // Simulate loading time for better UX
    setTimeout(() => {
      const performanceResults = analyzePerformance(document, startTime);
      setPerformanceData(performanceResults);
      
      // Get Lighthouse score
      const lighthouseResults = getLighthouseScore();
      setLighthouseScore(lighthouseResults);
      
      // Get WebPageTest data
      const wptResults = getMockedWpt();
      setWptData(wptResults);
      
      // Create resources data for chart
      const resourceBreakdown = performanceResults.resourceBreakdown;
      const resourcesArray = [
        { name: 'Images', size: Math.round(resourceBreakdown.images / 1024) },
        { name: 'Scripts', size: Math.round(resourceBreakdown.scripts / 1024) },
        { name: 'Styles', size: Math.round(resourceBreakdown.styles / 1024) },
        { name: 'Fonts', size: Math.round(resourceBreakdown.fonts / 1024) },
        { name: 'Other', size: Math.round(resourceBreakdown.other / 1024) }
      ];
      setResourcesData(resourcesArray);
      setLoading(false);
    }, 1500);
  }, []);

  const handleRefresh = () => {
    const startTime = performance.now();
    setLoading(true);
    
    // Simulate loading time for better UX
    setTimeout(() => {
      const performanceResults = analyzePerformance(document, startTime);
      setPerformanceData(performanceResults);
      
      // Get Lighthouse score
      const lighthouseResults = getLighthouseScore();
      setLighthouseScore(lighthouseResults);
      
      // Get WebPageTest data
      const wptResults = getMockedWpt();
      setWptData(wptResults);
      
      // Create resources data for chart
      const resourceBreakdown = performanceResults.resourceBreakdown;
      const resourcesArray = [
        { name: 'Images', size: Math.round(resourceBreakdown.images / 1024) },
        { name: 'Scripts', size: Math.round(resourceBreakdown.scripts / 1024) },
        { name: 'Styles', size: Math.round(resourceBreakdown.styles / 1024) },
        { name: 'Fonts', size: Math.round(resourceBreakdown.fonts / 1024) },
        { name: 'Other', size: Math.round(resourceBreakdown.other / 1024) }
      ];
      setResourcesData(resourcesArray);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Performance du site</h3>
          <p className="text-sm text-gray-600">
            Analysez les performances techniques de votre site web pour améliorer l'expérience utilisateur.
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          disabled={loading}
        >
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </Button>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 relative min-h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </Card>
          <Card className="p-6 relative min-h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Vitesse de chargement</h3>
              <Badge variant={performanceData && performanceData.loadTime < 1500 ? "secondary" : "outline"} 
                className={performanceData && performanceData.loadTime < 1500 ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-amber-100 text-amber-800 hover:bg-amber-200"}>
                {performanceData ? (performanceData.loadTime / 1000).toFixed(2) + 's' : 'N/A'}
              </Badge>
            </div>
            
            <LoadingPerformance 
              loadTime={performanceData?.loadTime || 0}
              firstContentfulPaint={performanceData?.firstContentfulPaint || 0}
              domLoadTime={performanceData?.domLoadTime || 0}
            />
            
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-500">FCP</p>
                <p className="text-base font-medium">
                  {performanceData ? (performanceData.firstContentfulPaint / 1000).toFixed(2) + 's' : 'N/A'}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-500">LCP</p>
                <p className="text-base font-medium">
                  {performanceData && performanceData.largestContentfulPaint ? 
                    (performanceData.largestContentfulPaint / 1000).toFixed(2) + 's' : 'N/A'}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-500">TTI</p>
                <p className="text-base font-medium">
                  {performanceData && performanceData.timeToInteractive ? 
                    (performanceData.timeToInteractive / 1000).toFixed(2) + 's' : 'N/A'}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Lighthouse Score</h3>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <FileDown className="h-4 w-4" />
                <span className="hidden sm:inline">Rapport complet</span>
              </Button>
            </div>
            
            <div className="flex items-center justify-center mb-6">
              <div className={`h-32 w-32 rounded-full flex items-center justify-center text-white text-3xl font-bold relative
                ${lighthouseScore.score >= 90 ? 'bg-green-500' : 
                  lighthouseScore.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                {lighthouseScore.score}
                <Zap className="h-6 w-6 absolute top-4 right-4" />
              </div>
            </div>
            
            {lighthouseScore.issues.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Problèmes à corriger:</h4>
                <ul className="space-y-2">
                  {lighthouseScore.issues.map((issue, index) => (
                    <li key={index} className="bg-amber-50 p-3 rounded-md border border-amber-200 text-sm">
                      <span className="font-medium text-amber-800">{issue.category}:</span> {issue.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
          
          {performanceData && (
            <>
              <Card className="p-6 md:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Répartition des ressources</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={resourcesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value} KB`} />
                      <Legend />
                      <Bar dataKey="size" name="Taille (KB)" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              <PerformanceMetrics performance={performanceData} />
            </>
          )}
          
          {wptData && (
            <Card className="p-6 md:col-span-2">
              <h3 className="text-xl font-semibold mb-4">WebPageTest Results</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">First Byte</div>
                  <div className="text-xl font-bold">{wptData.firstView.firstByte.toFixed(0)}ms</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Start Render</div>
                  <div className="text-xl font-bold">{wptData.firstView.startRender.toFixed(0)}ms</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Speed Index</div>
                  <div className="text-xl font-bold">{wptData.firstView.speedIndex.toFixed(0)}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Visual Complete</div>
                  <div className="text-xl font-bold">{wptData.firstView.visualComplete.toFixed(0)}ms</div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Statistiques détaillées</h4>
                  <table className="min-w-full text-sm">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600">Nombre de requêtes</td>
                        <td className="py-2 text-right font-medium">{wptData.firstView.requestsCount}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600">Taille totale</td>
                        <td className="py-2 text-right font-medium">
                          {(wptData.firstView.bytesIn / (1024 * 1024)).toFixed(2)} MB
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600">TTFB</td>
                        <td className="py-2 text-right font-medium">{wptData.firstView.ttfb.toFixed(0)} ms</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-600">DOM Loaded</td>
                        <td className="py-2 text-right font-medium">{wptData.firstView.domLoaded.toFixed(0)} ms</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Recommandations</h4>
                  <ul className="space-y-2">
                    <li className="p-3 bg-blue-50 rounded-md border border-blue-100 text-sm">
                      Optimisez les images pour réduire leur poids de 35%
                    </li>
                    <li className="p-3 bg-blue-50 rounded-md border border-blue-100 text-sm">
                      Utilisez la mise en cache du navigateur pour les ressources statiques
                    </li>
                    <li className="p-3 bg-blue-50 rounded-md border border-blue-100 text-sm">
                      Minimisez les scripts JavaScript tiers bloquant le rendu
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default PerformanceTabContent;
