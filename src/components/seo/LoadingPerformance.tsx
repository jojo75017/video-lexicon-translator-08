import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Zap, Activity } from 'lucide-react';

interface LoadingPerformanceProps {
  loadTime: number;
  firstContentfulPaint: number;
  domLoadTime: number;
}

const LoadingPerformance = ({ loadTime, firstContentfulPaint, domLoadTime }: LoadingPerformanceProps) => {
  const getPerformanceColor = (time: number) => {
    if (time < 1000) return "bg-green-500";
    if (time < 2500) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Zap className="h-5 w-5 text-yellow-500" />
        Performance de Chargement
      </h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Temps de chargement total
            </span>
            <span className="font-medium">{loadTime}ms</span>
          </div>
          <Progress 
            value={Math.min((loadTime / 3000) * 100, 100)} 
            className={`h-2 ${getPerformanceColor(loadTime)}`}
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              First Contentful Paint
            </span>
            <span className="font-medium">{firstContentfulPaint}ms</span>
          </div>
          <Progress 
            value={Math.min((firstContentfulPaint / 2000) * 100, 100)}
            className={`h-2 ${getPerformanceColor(firstContentfulPaint)}`}
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Chargement du DOM
            </span>
            <span className="font-medium">{domLoadTime}ms</span>
          </div>
          <Progress 
            value={Math.min((domLoadTime / 2500) * 100, 100)}
            className={`h-2 ${getPerformanceColor(domLoadTime)}`}
          />
        </div>
      </div>
    </Card>
  );
};

export default LoadingPerformance;