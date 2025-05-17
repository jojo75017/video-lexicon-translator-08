
import React from 'react';
import { BarChart, BarChart2, Clock, FileDown, TrendingUp, Zap } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { PerformanceData } from '@/types/seo/Performance';

interface LoadingSpeedAnalysisProps {
  performance: PerformanceData;
}

const LoadingSpeedAnalysis: React.FC<LoadingSpeedAnalysisProps> = ({ performance }) => {
  // Fonctions utilitaires
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };
  
  const formatTime = (ms?: number) => {
    if (!ms) return '0ms';
    return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
  };
  
  const getScoreColor = (score?: number) => {
    if (!score) return 'text-gray-400';
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };
  
  const getScoreBackground = (score?: number) => {
    if (!score) return 'bg-gray-100';
    if (score >= 90) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    if (score >= 50) return 'bg-amber-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`rounded-lg p-4 border ${getScoreBackground(performance.score)}`}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium">Score de performance</h3>
            <Zap className="h-5 w-5 text-blue-600" />
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(performance.score)}`}>
            {performance.score || 0}/100
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Basé sur les métriques Web Vitals
          </p>
        </div>
        
        <div className="bg-white rounded-lg p-4 border shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium">Temps de chargement</h3>
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold">
            {formatTime(performance.loadTime)}
          </div>
          <Progress 
            className="h-1.5 mt-2 bg-gray-100"
            value={Math.min(100, performance.loadTime ? (performance.loadTime / 3000 * 100) : 0)}
          />
          <p className="text-xs text-gray-500 mt-1">
            {performance.loadTime && performance.loadTime < 2000 ? 'Bon' : 
             performance.loadTime && performance.loadTime < 4000 ? 'Acceptable' : 'Lent'}
          </p>
        </div>
        
        <div className="bg-white rounded-lg p-4 border shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium">Taille totale</h3>
            <FileDown className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold">
            {formatFileSize(performance.totalSize)}
          </div>
          <Progress 
            className="h-1.5 mt-2 bg-gray-100"
            value={Math.min(100, performance.totalSize ? (performance.totalSize / 2000000 * 100) : 0)}
          />
          <p className="text-xs text-gray-500 mt-1">
            {performance.resourceCount || 0} ressources
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-3 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Métriques principales
          </h3>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">First Contentful Paint</span>
                <span className="font-medium">{formatTime(performance.firstContentfulPaint)}</span>
              </div>
              <Progress 
                className="h-1.5 bg-gray-100"
                value={Math.min(100, performance.firstContentfulPaint ? 100 - (performance.firstContentfulPaint / 2000 * 100) : 0)}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Largest Contentful Paint</span>
                <span className="font-medium">{formatTime(performance.largestContentfulPaint)}</span>
              </div>
              <Progress 
                className="h-1.5 bg-gray-100"
                value={Math.min(100, performance.largestContentfulPaint ? 100 - (performance.largestContentfulPaint / 2500 * 100) : 0)}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">DOM Load</span>
                <span className="font-medium">{formatTime(performance.domLoadTime)}</span>
              </div>
              <Progress 
                className="h-1.5 bg-gray-100"
                value={Math.min(100, performance.domLoadTime ? 100 - (performance.domLoadTime / 1500 * 100) : 0)}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Time to Interactive</span>
                <span className="font-medium">{formatTime(performance.timeToInteractive)}</span>
              </div>
              <Progress 
                className="h-1.5 bg-gray-100"
                value={Math.min(100, performance.timeToInteractive ? 100 - (performance.timeToInteractive / 3500 * 100) : 0)}
              />
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-3 flex items-center">
            <BarChart2 className="h-4 w-4 mr-2" />
            Répartition des ressources
          </h3>
          
          <div className="space-y-3">
            {performance.resourceBreakdown && (
              <>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">JavaScript</span>
                    <span className="font-medium">{formatFileSize(performance.resourceBreakdown.js || performance.resourceBreakdown.scripts)}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-yellow-400 h-1.5 rounded-full" style={{ 
                      width: `${Math.min(100, ((performance.resourceBreakdown.js || performance.resourceBreakdown.scripts || 0) / (performance.totalSize || 1) * 100).toFixed(0))}%` 
                    }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">CSS</span>
                    <span className="font-medium">{formatFileSize(performance.resourceBreakdown.css || performance.resourceBreakdown.styles)}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-blue-400 h-1.5 rounded-full" style={{ 
                      width: `${Math.min(100, ((performance.resourceBreakdown.css || performance.resourceBreakdown.styles || 0) / (performance.totalSize || 1) * 100).toFixed(0))}%` 
                    }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Images</span>
                    <span className="font-medium">{formatFileSize(performance.resourceBreakdown.images)}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-green-400 h-1.5 rounded-full" style={{ 
                      width: `${Math.min(100, ((performance.resourceBreakdown.images || 0) / (performance.totalSize || 1) * 100).toFixed(0))}%` 
                    }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Fonts</span>
                    <span className="font-medium">{formatFileSize(performance.resourceBreakdown.fonts)}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-purple-400 h-1.5 rounded-full" style={{ 
                      width: `${Math.min(100, ((performance.resourceBreakdown.fonts || 0) / (performance.totalSize || 1) * 100).toFixed(0))}%` 
                    }}></div>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="text-sm font-medium mb-2 text-blue-800">Recommandations de performance</h3>
        <ul className="space-y-2">
          {performance.resourceBreakdown?.images && performance.resourceBreakdown.images > 500000 && (
            <li className="flex items-start">
              <div className="bg-blue-200 rounded-full p-0.5 mr-2 mt-0.5">
                <BarChart className="h-3.5 w-3.5 text-blue-700" />
              </div>
              <span className="text-sm text-blue-800">Optimisez les images pour réduire leur taille</span>
            </li>
          )}
          
          {performance.resourceBreakdown?.js && performance.resourceBreakdown.js > 300000 && (
            <li className="flex items-start">
              <div className="bg-blue-200 rounded-full p-0.5 mr-2 mt-0.5">
                <BarChart className="h-3.5 w-3.5 text-blue-700" />
              </div>
              <span className="text-sm text-blue-800">Réduisez la taille des scripts JavaScript</span>
            </li>
          )}
          
          {performance.loadTime && performance.loadTime > 3000 && (
            <li className="flex items-start">
              <div className="bg-blue-200 rounded-full p-0.5 mr-2 mt-0.5">
                <BarChart className="h-3.5 w-3.5 text-blue-700" />
              </div>
              <span className="text-sm text-blue-800">Améliorez le temps de chargement global</span>
            </li>
          )}
          
          <li className="flex items-start">
            <div className="bg-blue-200 rounded-full p-0.5 mr-2 mt-0.5">
              <BarChart className="h-3.5 w-3.5 text-blue-700" />
            </div>
            <span className="text-sm text-blue-800">Utilisez la mise en cache du navigateur pour les ressources statiques</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LoadingSpeedAnalysis;
