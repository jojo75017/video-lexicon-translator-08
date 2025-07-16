
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const LoadingSpeedAnalysis: React.FC = () => {
  // Données simulées de performance de chargement
  const performanceData = {
    score: 85,
    fcp: 1.5, // First Contentful Paint (secondes)
    lcp: 2.3, // Largest Contentful Paint (secondes)
    cls: 0.05, // Cumulative Layout Shift
    fid: 95, // First Input Delay (ms)
    ttfb: 0.28, // Time to First Byte (secondes)
    resources: {
      js: 450, // taille en KB
      css: 80, // taille en KB
      images: 320, // taille en KB
      fonts: 50, // taille en KB
      other: 20, // taille en KB
    }
  };

  // Fonction pour déterminer la couleur en fonction du score
  const getScoreColor = (score: number) => {
    if (score >= 90) return { bg: 'bg-green-100', text: 'text-green-800' };
    if (score >= 70) return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
    return { bg: 'bg-red-100', text: 'text-red-800' };
  };

  // Fonction pour déterminer la couleur de progression
  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Vitesse de chargement</CardTitle>
            <Badge className={`${getScoreColor(performanceData.score).bg} ${getScoreColor(performanceData.score).text}`}>
              {performanceData.score}/100
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Score de performance</span>
              <span className="text-sm text-gray-500">{performanceData.score}/100</span>
            </div>
            <Progress value={performanceData.score} className={`h-2 ${getProgressColor(performanceData.score)}`} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">FCP</span>
                <Badge variant="outline">{performanceData.fcp}s</Badge>
              </div>
              <Progress 
                value={100 - Math.min(performanceData.fcp / 3 * 100, 100)} 
                className={`h-2 ${getProgressColor(100 - Math.min(performanceData.fcp / 3 * 100, 100))}`} 
              />
              <p className="text-xs text-gray-500">First Contentful Paint</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">LCP</span>
                <Badge variant="outline">{performanceData.lcp}s</Badge>
              </div>
              <Progress 
                value={100 - Math.min(performanceData.lcp / 4 * 100, 100)} 
                className={`h-2 ${getProgressColor(100 - Math.min(performanceData.lcp / 4 * 100, 100))}`}
              />
              <p className="text-xs text-gray-500">Largest Contentful Paint</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">CLS</span>
                <Badge variant="outline">{performanceData.cls}</Badge>
              </div>
              <Progress 
                value={100 - Math.min(performanceData.cls * 1000, 100)} 
                className={`h-2 ${getProgressColor(100 - Math.min(performanceData.cls * 1000, 100))}`}
              />
              <p className="text-xs text-gray-500">Cumulative Layout Shift</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">FID</span>
                <Badge variant="outline">{performanceData.fid}ms</Badge>
              </div>
              <Progress 
                value={100 - Math.min(performanceData.fid / 3, 100)} 
                className={`h-2 ${getProgressColor(100 - Math.min(performanceData.fid / 3, 100))}`}
              />
              <p className="text-xs text-gray-500">First Input Delay</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Ressources de la page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Type</span>
            <span>Taille</span>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">JavaScript</span>
                <Badge variant="outline">{performanceData.resources.js} KB</Badge>
              </div>
              <Progress value={performanceData.resources.js / 10} className="h-2 bg-blue-500" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">CSS</span>
                <Badge variant="outline">{performanceData.resources.css} KB</Badge>
              </div>
              <Progress value={performanceData.resources.css / 2} className="h-2 bg-purple-500" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Images</span>
                <Badge variant="outline">{performanceData.resources.images} KB</Badge>
              </div>
              <Progress value={performanceData.resources.images / 10} className="h-2 bg-green-500" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Fonts</span>
                <Badge variant="outline">{performanceData.resources.fonts} KB</Badge>
              </div>
              <Progress value={performanceData.resources.fonts / 2} className="h-2 bg-amber-500" />
            </div>
          </div>
          
          <div className="pt-4 border-t mt-4">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{Object.values(performanceData.resources).reduce((a, b) => a + b, 0)} KB</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingSpeedAnalysis;
