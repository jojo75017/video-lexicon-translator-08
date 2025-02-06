
import React from 'react';
import { Card } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SeoAnalysis } from '@/types/seo';

interface AnalyticsOverviewProps {
  analytics: SeoAnalysis['analytics'];
}

const AnalyticsOverview = ({ analytics }: AnalyticsOverviewProps) => {
  const visitsData = [
    { name: '0-30s', visits: analytics.timeOnSite['0-30s'] },
    { name: '30s-2m', visits: analytics.timeOnSite['30s-2m'] },
    { name: '2m-5m', visits: analytics.timeOnSite['2m-5m'] },
    { name: '5m+', visits: analytics.timeOnSite['5m+'] },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Statistiques de visite</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="p-4 bg-blue-50 rounded">
          <h3 className="text-sm font-medium text-blue-600">Pages vues</h3>
          <p className="text-2xl font-bold">{analytics.pageViews}</p>
        </div>
        <div className="p-4 bg-green-50 rounded">
          <h3 className="text-sm font-medium text-green-600">Visiteurs uniques</h3>
          <p className="text-2xl font-bold">{analytics.uniqueVisitors}</p>
        </div>
        <div className="p-4 bg-amber-50 rounded">
          <h3 className="text-sm font-medium text-amber-600">Taux de rebond</h3>
          <p className="text-2xl font-bold">{analytics.bounceRate.toFixed(1)}%</p>
        </div>
        <div className="p-4 bg-purple-50 rounded">
          <h3 className="text-sm font-medium text-purple-600">Temps moyen</h3>
          <p className="text-2xl font-bold">{analytics.averageTimeOnPage}s</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="font-semibold mb-4">Durée des visites</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="visits" stroke="#3b82f6" fill="#93c5fd" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-4">Répartition par appareil</h3>
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span>Desktop</span>
              <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${analytics.deviceBreakdown.desktop}%` }}
                />
              </div>
              <span className="w-16 text-right">{analytics.deviceBreakdown.desktop}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Mobile</span>
              <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${analytics.deviceBreakdown.mobile}%` }}
                />
              </div>
              <span className="w-16 text-right">{analytics.deviceBreakdown.mobile}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Tablet</span>
              <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full" 
                  style={{ width: `${analytics.deviceBreakdown.tablet}%` }}
                />
              </div>
              <span className="w-16 text-right">{analytics.deviceBreakdown.tablet}%</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AnalyticsOverview;
