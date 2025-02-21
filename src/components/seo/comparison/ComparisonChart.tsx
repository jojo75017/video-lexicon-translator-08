
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SeoAnalysis } from '@/types/seo';

interface ComparisonChartProps {
  site1: {
    url: string;
    analysis: SeoAnalysis;
  };
  site2: {
    url: string;
    analysis: SeoAnalysis;
  };
}

const ComparisonChart = ({ site1, site2 }: ComparisonChartProps) => {
  const getComparisonData = () => [
    {
      metric: 'Score SEO',
      site1: site1.analysis.readabilityScore,
      site2: site2.analysis.readabilityScore,
    },
    {
      metric: 'Performance',
      site1: site1.analysis.performance.score,
      site2: site2.analysis.performance.score,
    },
    {
      metric: 'Temps de chargement (s)',
      site1: Math.round(site1.analysis.performance.loadTime / 1000 * 10) / 10,
      site2: Math.round(site2.analysis.performance.loadTime / 1000 * 10) / 10,
    },
    {
      metric: 'Mots clés',
      site1: (site1.analysis.keywords || []).length,
      site2: (site2.analysis.keywords || []).length,
    },
    {
      metric: 'Liens internes',
      site1: site1.analysis.internalLinks,
      site2: site2.analysis.internalLinks,
    },
    {
      metric: 'Liens externes',
      site1: site1.analysis.externalLinks,
      site2: site2.analysis.externalLinks,
    },
    {
      metric: 'Score Mobile',
      site1: site1.analysis.mobileAnalysis?.score || 0,
      site2: site2.analysis.mobileAnalysis?.score || 0,
    },
    {
      metric: 'Images sans alt',
      site1: site1.analysis.imgWithoutAlt,
      site2: site2.analysis.imgWithoutAlt,
    },
    {
      metric: 'Backlinks',
      site1: Array.isArray(site1.analysis.backlinks) ? site1.analysis.backlinks.length : 0,
      site2: Array.isArray(site2.analysis.backlinks) ? site2.analysis.backlinks.length : 0,
    },
    {
      metric: 'Nombre de titres',
      site1: site1.analysis.h1Count + site1.analysis.h2Count + site1.analysis.h3Count,
      site2: site2.analysis.h1Count + site2.analysis.h2Count + site2.analysis.h3Count,
    }
  ];

  return (
    <div className="space-y-6">
      <div className="h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={getComparisonData()} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="metric" type="category" width={150} />
            <Tooltip 
              formatter={(value) => [value, '']}
              labelStyle={{ color: '#111' }}
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '8px'
              }}
            />
            <Bar dataKey="site1" fill="#3b82f6" name="Page principale" />
            <Bar dataKey="site2" fill="#22c55e" name="Page comparée" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-sm text-gray-600 flex items-center justify-center space-x-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span>Page principale</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span>Page comparée</span>
        </div>
      </div>
    </div>
  );
};

export default ComparisonChart;
