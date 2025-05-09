
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatTime } from './utils';

interface PerformanceTrendsProps {
  activeDevice: 'mobile' | 'desktop';
}

// Données fictives pour démontrer la fonctionnalité
const generateTrendData = (device: 'mobile' | 'desktop') => {
  const baseLoadTime = device === 'mobile' ? 3500 : 2200;
  const variability = device === 'mobile' ? 800 : 500;
  
  // Générer des données sur les 14 derniers jours avec une tendance globale d'amélioration
  return Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    
    // Réduction progressive du temps de chargement (amélioration)
    const improvementFactor = 1 - (i / 30);
    const randomVariation = (Math.random() - 0.5) * variability;
    
    return {
      date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      loadTime: Math.max(baseLoadTime * improvementFactor + randomVariation, device === 'mobile' ? 1800 : 1200),
      fcp: Math.max((baseLoadTime * improvementFactor * 0.4) + randomVariation * 0.5, device === 'mobile' ? 800 : 600)
    };
  });
};

const PerformanceTrends: React.FC<PerformanceTrendsProps> = ({ activeDevice }) => {
  const trendData = generateTrendData(activeDevice);
  
  // Calculer les variations pour montrer les améliorations
  const firstLoadTime = trendData[0]?.loadTime || 0;
  const lastLoadTime = trendData[trendData.length - 1]?.loadTime || 0;
  const loadTimeImprovement = firstLoadTime - lastLoadTime;
  const loadTimePercentage = firstLoadTime > 0 ? (loadTimeImprovement / firstLoadTime) * 100 : 0;
  
  const firstFcp = trendData[0]?.fcp || 0;
  const lastFcp = trendData[trendData.length - 1]?.fcp || 0;
  const fcpImprovement = firstFcp - lastFcp;
  const fcpPercentage = firstFcp > 0 ? (fcpImprovement / firstFcp) * 100 : 0;

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mt-6">
      <h3 className="text-lg font-medium mb-4">Tendances de Performance ({activeDevice === 'mobile' ? 'Mobile' : 'Desktop'})</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
          <div className="text-sm text-gray-600">Temps de chargement</div>
          <div className="flex items-baseline">
            <span className="text-xl font-medium">{formatTime(lastLoadTime)}</span>
            {loadTimeImprovement > 0 && (
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                ↓ {formatTime(loadTimeImprovement)} ({loadTimePercentage.toFixed(1)}%)
              </span>
            )}
            {loadTimeImprovement < 0 && (
              <span className="ml-2 text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                ↑ {formatTime(Math.abs(loadTimeImprovement))} ({Math.abs(loadTimePercentage).toFixed(1)}%)
              </span>
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
          <div className="text-sm text-gray-600">Premier contenu (FCP)</div>
          <div className="flex items-baseline">
            <span className="text-xl font-medium">{formatTime(lastFcp)}</span>
            {fcpImprovement > 0 && (
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                ↓ {formatTime(fcpImprovement)} ({fcpPercentage.toFixed(1)}%)
              </span>
            )}
            {fcpImprovement < 0 && (
              <span className="ml-2 text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                ↑ {formatTime(Math.abs(fcpImprovement))} ({Math.abs(fcpPercentage).toFixed(1)}%)
              </span>
            )}
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(value) => formatTime(value)} />
          <Tooltip formatter={(value) => formatTime(Number(value))} labelFormatter={(value) => `Date: ${value}`} />
          <Line 
            type="monotone" 
            dataKey="loadTime" 
            name="Temps de chargement"
            stroke="#3b82f6" 
            strokeWidth={2} 
            dot={{ r: 3 }} 
            activeDot={{ r: 6 }} 
          />
          <Line 
            type="monotone" 
            dataKey="fcp" 
            name="Premier contenu (FCP)"
            stroke="#10b981" 
            strokeWidth={2} 
            dot={{ r: 3 }} 
            activeDot={{ r: 6 }} 
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="text-xs text-center text-gray-500 mt-3">
        Évolution des performances sur les 14 derniers jours
      </div>
    </div>
  );
};

export default PerformanceTrends;
