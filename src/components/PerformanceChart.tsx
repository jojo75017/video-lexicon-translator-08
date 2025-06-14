
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PerformanceData } from '@/types/seo';

interface PerformanceChartProps {
  performance: PerformanceData;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ performance }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance du site</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Temps de chargement</div>
              <div className="text-2xl font-bold">{performance.loadTime}ms</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Score de performance</div>
              <div className="text-2xl font-bold">{performance.score}/100</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
