
import React, { useState } from 'react';
import { PerformanceMetricsSectionProps } from './types';
import { Gauge, ChevronDown, ChevronUp, FilePlus, Clock, Database, Image } from 'lucide-react';
import { formatTime, formatBytes, getLevelColor, getLevelLabel, getLevelTextColor } from './utils';
import ResourcePieChart from './ResourcePieChart';
import MetricItem from './MetricItem';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

const PerformanceHighlights: React.FC<PerformanceMetricsSectionProps> = ({ 
  deviceData,
  activeDevice
}) => {
  const [expanded, setExpanded] = useState(false);

  // Score color class
  const getScoreBackgroundClass = (score: number) => {
    if (score >= 90) return 'from-green-400 to-green-600';
    if (score >= 75) return 'from-lime-400 to-lime-600';
    if (score >= 50) return 'from-yellow-400 to-yellow-600'; 
    if (score >= 25) return 'from-orange-400 to-orange-600';
    return 'from-red-400 to-red-600';
  };
  
  // Handle resource breakdown data
  const resourceData = deviceData.resourceBreakdown ? [
    {
      name: 'JavaScript',
      value: deviceData.resourceBreakdown.js || 0,
      color: '#4f46e5' // indigo
    },
    {
      name: 'CSS',
      value: deviceData.resourceBreakdown.css || 0,
      color: '#0891b2' // cyan
    },
    {
      name: 'Images',
      value: deviceData.resourceBreakdown.images || 0,
      color: '#16a34a' // green
    },
    {
      name: 'Fonts',
      value: deviceData.resourceBreakdown.fonts || 0,
      color: '#9333ea' // purple
    },
    {
      name: 'Other',
      value: deviceData.resourceBreakdown.other || 0,
      color: '#f59e0b' // amber
    }
  ] : [];

  // Prepare chart data
  const chartData = resourceData.map(item => ({
    name: item.name,
    value: item.value
  }));

  return (
    <div className="space-y-8">
      {/* Score card */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Performance score */}
        <div className="col-span-1">
          <Card className="p-6 h-full border-0 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md hover:shadow-lg transition-all">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg text-gray-800">Score de performance</h3>
              <Badge
                className={`bg-gradient-to-r ${getScoreBackgroundClass(deviceData.score)} text-white font-semibold px-3 py-1`}
              >
                {getLevelLabel(deviceData.score)}
              </Badge>
            </div>
            
            <div className="relative pt-4 pb-2">
              <div className="w-[120px] h-[120px] mx-auto relative">
                <div 
                  className={`absolute inset-0 rounded-full flex items-center justify-center bg-gradient-to-br ${getScoreBackgroundClass(deviceData.score)} text-white text-3xl font-bold shadow-lg`}
                >
                  {deviceData.score}
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className={`text-lg font-semibold ${getLevelTextColor(deviceData.score)}`}>
                  {deviceData.score >= 75 
                    ? 'Excellente performance!' 
                    : deviceData.score >= 50 
                    ? 'Performance acceptable' 
                    : 'Nécessite des améliorations'}
                </p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Resource breakdown */}
        <div className="col-span-1">
          <Card className="p-6 h-full border-0 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-md hover:shadow-lg transition-all">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg text-gray-800">Ressources</h3>
              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                {formatBytes(deviceData.totalSize || 0)}
              </Badge>
            </div>
            
            {deviceData.resourceBreakdown && (
              <div className="pt-2">
                <div className="h-[140px] w-full">
                  <ResourcePieChart activeDevice={activeDevice} data={chartData} />
                </div>
              </div>
            )}
          </Card>
        </div>
        
        {/* Quick metrics */}
        <div className="col-span-1">
          <Card className="p-6 h-full border-0 bg-gradient-to-br from-pink-50 to-rose-50 shadow-md hover:shadow-lg transition-all">
            <h3 className="font-medium text-lg text-gray-800 mb-4">Temps de chargement</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Premier contenu</span>
                  <span className="font-medium text-rose-600">{formatTime(deviceData.firstContentfulPaint)}</span>
                </div>
                <Progress value={(deviceData.firstContentfulPaint / 2000) * 100} className="h-2 bg-pink-100" indicatorClassName="bg-gradient-to-r from-pink-500 to-rose-500" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">DOM chargé</span>
                  <span className="font-medium text-rose-600">{formatTime(deviceData.domLoadTime)}</span>
                </div>
                <Progress value={(deviceData.domLoadTime / 3000) * 100} className="h-2 bg-pink-100" indicatorClassName="bg-gradient-to-r from-pink-500 to-rose-500" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Total</span>
                  <span className="font-medium text-rose-600">{formatTime(deviceData.loadTime)}</span>
                </div>
                <Progress value={(deviceData.loadTime / 5000) * 100} className="h-2 bg-pink-100" indicatorClassName="bg-gradient-to-r from-pink-500 to-rose-500" />
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Detailed metrics */}
      <Card className="border-0 bg-gradient-to-br from-gray-50 to-slate-100 shadow-md hover:shadow-lg transition-all overflow-hidden">
        <div 
          className="p-4 cursor-pointer flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center">
            <Gauge className="mr-2 h-5 w-5" />
            <h3 className="font-medium">Métriques détaillées</h3>
          </div>
          {expanded ? 
            <ChevronUp className="h-5 w-5" /> : 
            <ChevronDown className="h-5 w-5" />
          }
        </div>
        
        {expanded && (
          <div className="p-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-4">
              <h4 className="font-medium text-indigo-700 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Temps de chargement
              </h4>
              
              <MetricItem
                label="Temps de chargement total"
                value={deviceData.loadTime}
                maxValue={5000}
                formatFunc={formatTime}
                getColorClass={(v, m) => v < m/2 ? 'bg-green-500' : v < m*0.8 ? 'bg-yellow-500' : 'bg-red-500'}
              />
              
              <MetricItem
                label="Premier affichage du contenu"
                value={deviceData.firstContentfulPaint}
                maxValue={2000}
                formatFunc={formatTime}
                getColorClass={(v, m) => v < m/2 ? 'bg-green-500' : v < m*0.8 ? 'bg-yellow-500' : 'bg-red-500'}
              />
              
              {deviceData.largestContentfulPaint && (
                <MetricItem
                  label="Plus grand élément visible"
                  value={deviceData.largestContentfulPaint}
                  maxValue={2500}
                  formatFunc={formatTime}
                  getColorClass={(v, m) => v < m/2 ? 'bg-green-500' : v < m*0.8 ? 'bg-yellow-500' : 'bg-red-500'}
                />
              )}
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-blue-700 flex items-center">
                <Database className="h-4 w-4 mr-2" />
                Ressources
              </h4>
              
              {deviceData.totalSize && (
                <MetricItem
                  label="Taille totale des ressources"
                  value={deviceData.totalSize}
                  maxValue={2000000}
                  formatFunc={formatBytes}
                  getColorClass={(v, m) => v < m/3 ? 'bg-green-500' : v < m*0.66 ? 'bg-yellow-500' : 'bg-red-500'}
                />
              )}
              
              {deviceData.resourceCount && (
                <MetricItem
                  label="Nombre de requêtes"
                  value={deviceData.resourceCount}
                  maxValue={100}
                  formatFunc={(v) => v.toString()}
                  getColorClass={(v, m) => v < m/3 ? 'bg-green-500' : v < m*0.66 ? 'bg-yellow-500' : 'bg-red-500'}
                />
              )}
              
              {deviceData.scriptCount && (
                <MetricItem
                  label="Scripts JavaScript"
                  value={deviceData.scriptCount}
                  maxValue={30}
                  formatFunc={(v) => v.toString()}
                  getColorClass={(v, m) => v < m/3 ? 'bg-green-500' : v < m*0.66 ? 'bg-yellow-500' : 'bg-red-500'}
                />
              )}
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-emerald-700 flex items-center">
                <FilePlus className="h-4 w-4 mr-2" />
                Interactivité
              </h4>
              
              {deviceData.timeToInteractive && (
                <MetricItem
                  label="Temps avant interactivité"
                  value={deviceData.timeToInteractive}
                  maxValue={5000}
                  formatFunc={formatTime}
                  getColorClass={(v, m) => v < m/3 ? 'bg-green-500' : v < m*0.66 ? 'bg-yellow-500' : 'bg-red-500'}
                />
              )}
              
              {deviceData.totalBlockingTime && (
                <MetricItem
                  label="Temps de blocage total"
                  value={deviceData.totalBlockingTime}
                  maxValue={500}
                  formatFunc={formatTime}
                  getColorClass={(v, m) => v < m/3 ? 'bg-green-500' : v < m*0.66 ? 'bg-yellow-500' : 'bg-red-500'}
                />
              )}
              
              {deviceData.cumulativeLayoutShift !== undefined && (
                <MetricItem
                  label="Décalage cumulatif de mise en page"
                  value={deviceData.cumulativeLayoutShift}
                  maxValue={0.5}
                  formatFunc={(v) => v.toFixed(3)}
                  getColorClass={(v, m) => v < m/3 ? 'bg-green-500' : v < m*0.66 ? 'bg-yellow-500' : 'bg-red-500'}
                />
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PerformanceHighlights;
