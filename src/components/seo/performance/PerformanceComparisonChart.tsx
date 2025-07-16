
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { formatTime } from './utils';
import { PerformanceData } from './types';

interface PerformanceComparisonChartProps {
  mobileData?: PerformanceData;
  desktopData?: PerformanceData;
}

const PerformanceComparisonChart: React.FC<PerformanceComparisonChartProps> = ({ 
  mobileData, 
  desktopData 
}) => {
  if (!mobileData || !desktopData) {
    return <div className="text-center text-gray-500">Données insuffisantes pour le graphique de comparaison</div>;
  }

  // Créer les données pour le graphique de comparaison
  const chartData = [
    {
      name: 'Temps de chargement',
      mobile: mobileData.loadTime,
      desktop: desktopData.loadTime,
    },
    {
      name: 'Premier contenu',
      mobile: mobileData.firstContentfulPaint,
      desktop: desktopData.firstContentfulPaint,
    },
    {
      name: 'LCP',
      mobile: mobileData.largestContentfulPaint || 0,
      desktop: desktopData.largestContentfulPaint || 0,
    },
    {
      name: 'Temps de blocage',
      mobile: mobileData.totalBlockingTime || 0,
      desktop: desktopData.totalBlockingTime || 0,
    }
  ];

  // Format personnalisé pour le tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-blue-600">
            <span className="font-medium">Mobile:</span> {formatTime(payload[0].value)}
          </p>
          <p className="text-sm text-green-600">
            <span className="font-medium">Desktop:</span> {formatTime(payload[1].value)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Différence: {formatTime(Math.abs(payload[0].value - payload[1].value))}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">Comparaison Mobile vs Desktop</h3>
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => formatTime(value)} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="mobile" fill="#3b82f6" name="Mobile" />
            <Bar dataKey="desktop" fill="#10b981" name="Desktop" />
          </BarChart>
        </ResponsiveContainer>
        <div className="text-xs text-center text-gray-500 mt-3">
          Comparaison des métriques clés entre les versions mobile et desktop
        </div>
      </div>
    </div>
  );
};

export default PerformanceComparisonChart;
