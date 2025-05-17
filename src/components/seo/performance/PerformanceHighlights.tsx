
import React from 'react';
import { BarChart3, Zap, Clock, ArrowRight } from 'lucide-react';
import { PerformanceHighlightsProps } from './types';
import MetricItem from './MetricItem';
import { formatTime, formatSize, getSpeedColorClass, getScoreColorClass, getClsColorClass } from './utils';
import PerformanceScore from './PerformanceScore';

const PerformanceHighlights: React.FC<PerformanceHighlightsProps> = ({ deviceData, activeDevice }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow border border-blue-100">
          <div className="flex items-start justify-between mb-2">
            <div className="text-blue-800">
              <h3 className="text-sm font-semibold text-blue-700">Score de performance</h3>
              <p className="text-xs text-blue-600">Impact sur le classement</p>
            </div>
            <div className="bg-blue-500 p-1 rounded-md text-white">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <PerformanceScore score={deviceData.score || 0} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow border border-green-100">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold text-green-700">Temps de chargement</h3>
              <p className="text-xs text-green-600">De la requête à l'affichage</p>
            </div>
            <div className="bg-green-500 p-1 rounded-md text-white">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className={`text-2xl font-bold ${deviceData.loadTime < 3000 ? 'text-green-600' : deviceData.loadTime < 5000 ? 'text-amber-600' : 'text-red-600'}`}>
            {formatTime(deviceData.loadTime)}
          </p>
          <div className="mt-2 w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${deviceData.loadTime < 3000 ? 'bg-green-500' : deviceData.loadTime < 5000 ? 'bg-amber-500' : 'bg-red-500'}`} 
                style={{ width: `${Math.min((deviceData.loadTime / 10000) * 100, 100)}%` }}>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {deviceData.loadTime < 3000 ? 'Excellent' : deviceData.loadTime < 5000 ? 'Acceptable' : 'Lent'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow border border-purple-100">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold text-purple-700">Interactivité</h3>
              <p className="text-xs text-purple-600">Capacité à interagir</p>
            </div>
            <div className="bg-purple-500 p-1 rounded-md text-white">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
          <p className={`text-2xl font-bold ${deviceData.timeToInteractive && deviceData.timeToInteractive < 3800 ? 'text-green-600' : deviceData.timeToInteractive && deviceData.timeToInteractive < 7500 ? 'text-amber-600' : 'text-red-600'}`}>
            {formatTime(deviceData.timeToInteractive || 0)}
          </p>
          <div className="mt-2 w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${deviceData.timeToInteractive && deviceData.timeToInteractive < 3800 ? 'bg-green-500' : deviceData.timeToInteractive && deviceData.timeToInteractive < 7500 ? 'bg-amber-500' : 'bg-red-500'}`} 
                style={{ width: `${Math.min(((deviceData.timeToInteractive || 0) / 10000) * 100, 100)}%` }}>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {deviceData.timeToInteractive && deviceData.timeToInteractive < 3800 ? 'Excellent' : deviceData.timeToInteractive && deviceData.timeToInteractive < 7500 ? 'Acceptable' : 'Lent'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow border border-amber-100">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold text-amber-700">Taille totale</h3>
              <p className="text-xs text-amber-600">Ressources combinées</p>
            </div>
            <div className="bg-amber-500 p-1 rounded-md text-white">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <p className={`text-2xl font-bold ${deviceData.totalSize && deviceData.totalSize < 1000000 ? 'text-green-600' : deviceData.totalSize && deviceData.totalSize < 3000000 ? 'text-amber-600' : 'text-red-600'}`}>
            {formatSize(deviceData.totalSize || 0)}
          </p>
          <div className="mt-2 w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${deviceData.totalSize && deviceData.totalSize < 1000000 ? 'bg-green-500' : deviceData.totalSize && deviceData.totalSize < 3000000 ? 'bg-amber-500' : 'bg-red-500'}`} 
                style={{ width: `${Math.min(((deviceData.totalSize || 0) / 5000000) * 100, 100)}%` }}>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {deviceData.totalSize && deviceData.totalSize < 1000000 ? 'Optimisé' : deviceData.totalSize && deviceData.totalSize < 3000000 ? 'Correct' : 'Volumineux'}
          </p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium mb-4">Métriques détaillées</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Vitesse de chargement</h4>
            <MetricItem 
              label="First Contentful Paint (FCP)"
              value={deviceData.firstContentfulPaint}
              maxValue={3000}
              formatFunc={formatTime}
              getColorClass={getSpeedColorClass}
            />
            <MetricItem 
              label="Largest Contentful Paint (LCP)"
              value={deviceData.largestContentfulPaint || 0}
              maxValue={4000}
              formatFunc={formatTime}
              getColorClass={getSpeedColorClass}
            />
            <MetricItem 
              label="Time To Interactive (TTI)"
              value={deviceData.timeToInteractive || 0}
              maxValue={5000}
              formatFunc={formatTime}
              getColorClass={getSpeedColorClass}
            />
            <MetricItem 
              label="Temps de réponse serveur"
              value={deviceData.responseTime || 0}
              maxValue={600}
              formatFunc={formatTime}
              getColorClass={getSpeedColorClass}
            />
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Tailles des ressources</h4>
            {deviceData.resourceBreakdown && (
              <>
                <MetricItem 
                  label="JavaScript"
                  value={deviceData.resourceBreakdown.js}
                  maxValue={1000000}
                  formatFunc={formatSize}
                  getColorClass={getSpeedColorClass}
                />
                <MetricItem 
                  label="CSS"
                  value={deviceData.resourceBreakdown.css}
                  maxValue={500000}
                  formatFunc={formatSize}
                  getColorClass={getSpeedColorClass}
                />
                <MetricItem 
                  label="Images"
                  value={deviceData.resourceBreakdown.images}
                  maxValue={2000000}
                  formatFunc={formatSize}
                  getColorClass={getSpeedColorClass}
                />
                <MetricItem 
                  label="Polices"
                  value={deviceData.resourceBreakdown.fonts}
                  maxValue={300000}
                  formatFunc={formatSize}
                  getColorClass={getSpeedColorClass}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceHighlights;
