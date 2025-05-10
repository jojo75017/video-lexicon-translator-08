
import React from 'react';
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown, CheckCircle, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PerformanceData } from './types';
import { useTranslation } from "react-i18next";

interface PerformanceHighlightsProps {
  deviceData: PerformanceData;
  activeDevice: 'mobile' | 'desktop';
}

const PerformanceHighlights: React.FC<PerformanceHighlightsProps> = ({ 
  deviceData,
  activeDevice 
}) => {
  const { t } = useTranslation();

  // Calculate if metrics are good, average, or concerning
  const getMetricStatus = (value: number, thresholds: { good: number; average: number }) => {
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.average) return 'average';
    return 'concerning';
  };
  
  const loadTimeStatus = getMetricStatus(deviceData.loadTime, { 
    good: activeDevice === 'mobile' ? 2500 : 1800, 
    average: activeDevice === 'mobile' ? 4000 : 3000 
  });
  
  const lcpStatus = getMetricStatus(deviceData.largestContentfulPaint || 0, { 
    good: activeDevice === 'mobile' ? 2500 : 2000, 
    average: activeDevice === 'mobile' ? 4000 : 3000 
  });
  
  const tbtStatus = getMetricStatus(deviceData.totalBlockingTime || 0, { 
    good: 200, 
    average: 500 
  });
  
  const clsStatus = getMetricStatus((deviceData.cumulativeLayoutShift || 0) * 1000, { 
    good: 100, 
    average: 250 
  });
  
  // Format time values
  const formatMs = (ms: number): string => {
    return `${ms.toFixed(0)}ms`;
  };
  
  // Function to render metric cards with appropriate styling
  const renderMetricCard = (
    title: string, 
    value: string, 
    status: 'good' | 'average' | 'concerning',
    tooltip: string
  ) => {
    const statusColors = {
      good: 'bg-green-50 border-green-200 text-green-700',
      average: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      concerning: 'bg-red-50 border-red-200 text-red-700'
    };
    
    const statusIcons = {
      good: <CheckCircle className="h-5 w-5 text-green-500" />,
      average: <Info className="h-5 w-5 text-yellow-500" />,
      concerning: <Info className="h-5 w-5 text-red-500" />
    };
    
    return (
      <div className={`p-4 rounded-lg border ${statusColors[status]}`}>
        <div className="flex justify-between items-start">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-help">
                  <span className="text-sm font-medium">{title}</span>
                  <Info className="h-3.5 w-3.5 opacity-70" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="flex items-center">
            {statusIcons[status]}
          </div>
        </div>
        <p className="text-xl font-semibold mt-2">{value}</p>
      </div>
    );
  };
  
  return (
    <div className="space-y-3 mt-6">
      <h3 className="text-md font-medium">{t('performance.highlights', 'Points clés de performance')}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {renderMetricCard(
          t('performance.loadTime', 'Temps de chargement'),
          formatMs(deviceData.loadTime),
          loadTimeStatus,
          t('performance.loadTimeTooltip', 'Temps total pour charger la page complètement.')
        )}
        
        {renderMetricCard(
          t('performance.lcp', 'LCP'),
          formatMs(deviceData.largestContentfulPaint || 0),
          lcpStatus,
          t('performance.lcpTooltip', 'Largest Contentful Paint - temps nécessaire pour afficher le plus grand élément visible.')
        )}
        
        {renderMetricCard(
          t('performance.tbt', 'Temps de blocage'),
          formatMs(deviceData.totalBlockingTime || 0),
          tbtStatus,
          t('performance.tbtTooltip', 'Total Blocking Time - mesure la durée pendant laquelle le thread principal est bloqué.')
        )}
        
        {renderMetricCard(
          t('performance.cls', 'CLS'),
          (deviceData.cumulativeLayoutShift || 0).toFixed(3),
          clsStatus,
          t('performance.clsTooltip', 'Cumulative Layout Shift - mesure l\'instabilité visuelle de la page.')
        )}
      </div>
      
      <div className="text-sm text-gray-500 mt-2">
        <p>
          {activeDevice === 'mobile' ? 
            t('performance.mobileAnalysis', 'Analyse basée sur une simulation de connexion mobile 4G.') : 
            t('performance.desktopAnalysis', 'Analyse basée sur une simulation de connexion fibre optique.')}
        </p>
      </div>
    </div>
  );
};

export default PerformanceHighlights;
