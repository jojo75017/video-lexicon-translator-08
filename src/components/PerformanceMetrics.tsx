
import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SeoAnalysis } from '@/types/seo';

interface PerformanceMetricsProps {
  performance: SeoAnalysis['performance'];
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ performance }) => {
  const formatSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (!performance) return null;

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Performances</h3>
      <div className="space-y-4">
        {performance.totalSize !== undefined && (
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Taille totale</span>
              <span className="text-sm text-gray-500">{formatSize(performance.totalSize)}</span>
            </div>
            <Progress 
              value={Math.min(((performance.totalSize / (1024 * 1024)) * 100), 100)} 
              className="h-2"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold">{performance.scriptCount || 0}</div>
            <div className="text-sm text-gray-500">Scripts</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold">{performance.styleCount || 0}</div>
            <div className="text-sm text-gray-500">Styles</div>
          </div>
        </div>

        {performance.responseTime !== undefined && (
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Temps de réponse</span>
              <span className="text-sm text-gray-500">
                {performance.responseTime.toFixed(2)}ms
              </span>
            </div>
            <Progress 
              value={Math.min((performance.responseTime / 1000) * 100, 100)} 
              className="h-2"
            />
          </div>
        )}

        {performance.impressions !== undefined && performance.impressions > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Statistiques de trafic</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold">{performance.impressions}</div>
                <div className="text-sm text-gray-500">Impressions</div>
              </div>
              {performance.clickThroughRate !== undefined && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold">
                    {(performance.clickThroughRate * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-500">Taux de clic</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PerformanceMetrics;
