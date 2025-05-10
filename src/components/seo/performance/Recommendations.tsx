
import React from 'react';
import { Card } from "@/components/ui/card";
import { Check, AlertCircle, Info } from 'lucide-react';
import { PerformanceData } from './types';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RecommendationsProps {
  activeDevice: 'mobile' | 'desktop';
  deviceData: PerformanceData;
}

const Recommendations: React.FC<RecommendationsProps> = ({ activeDevice, deviceData }) => {
  const { t } = useTranslation();
  
  // Determine which recommendations to show based on the performance data
  const getRecommendations = () => {
    const recommendations = [];
    const { loadTime, firstContentfulPaint, largestContentfulPaint, totalBlockingTime, cumulativeLayoutShift } = deviceData;
    
    // Resource size related recommendations
    if (deviceData.resourceBreakdown?.images > 500) {
      recommendations.push({
        id: 'optimizeImages',
        text: t('performance.recommendations.optimizeImages'),
        priority: 'high',
        impact: 75
      });
    }
    
    if (deviceData.resourceBreakdown?.styles > 200) {
      recommendations.push({
        id: 'minifyCSS',
        text: t('performance.recommendations.minifyCSS'),
        priority: 'medium',
        impact: 50
      });
    }
    
    if (deviceData.resourceBreakdown?.scripts > 300) {
      recommendations.push({
        id: 'minifyJS',
        text: t('performance.recommendations.minifyJS'),
        priority: 'high',
        impact: 65
      });
    }
    
    // Performance metric based recommendations
    if (totalBlockingTime > 300) {
      recommendations.push({
        id: 'reduceTBT',
        text: t('performance.recommendations.reduceTBT'),
        priority: 'high',
        impact: 80
      });
    }
    
    if (loadTime > (activeDevice === 'mobile' ? 3000 : 2000)) {
      recommendations.push({
        id: 'improveServerResponse',
        text: t('performance.recommendations.improveServerResponse'),
        priority: 'high',
        impact: 85
      });
    }
    
    // Specific mobile recommendations
    if (activeDevice === 'mobile' && largestContentfulPaint > 2500) {
      recommendations.push({
        id: 'optimizeLCP',
        text: t('performance.recommendations.optimizeLCP'),
        priority: 'high',
        impact: 90
      });
    }
    
    // Layout shift recommendations for mobile
    if (activeDevice === 'mobile' && cumulativeLayoutShift > 0.1) {
      recommendations.push({
        id: 'reduceCLS',
        text: t('performance.recommendations.reduceCLS'),
        priority: 'medium',
        impact: 70
      });
    }
    
    // General best practice recommendations
    recommendations.push({
      id: 'useCaching',
      text: t('performance.recommendations.useCaching'),
      priority: 'medium',
      impact: 60
    });
    
    if (deviceData.resourceBreakdown && 
        (deviceData.resourceBreakdown.images > 300 || 
         deviceData.resourceBreakdown.scripts > 200)) {
      recommendations.push({
        id: 'useCDN',
        text: t('performance.recommendations.useCDN'),
        priority: 'medium',
        impact: 65
      });
    }
    
    // Sort recommendations by impact (highest first)
    return recommendations.sort((a, b) => b.impact - a.impact);
  };
  
  const recommendations = getRecommendations();

  // Fonction pour obtenir la couleur de la badge de priorité
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      default: return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    }
  };
  
  return (
    <Card className="p-5">
      <h3 className="text-lg font-medium mb-4">{t('performance.recommendations.title')}</h3>
      
      <div className="divide-y">
        {recommendations.map((rec, index) => (
          <div key={rec.id} className="py-3 flex items-start gap-3">
            <div className="mt-0.5">
              {rec.priority === 'high' ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : (
                rec.impact > 70 ? (
                  <Info className="h-5 w-5 text-orange-500" />
                ) : (
                  <Check className="h-5 w-5 text-green-500" />
                )
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-gray-700">{rec.text}</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                        {t(`performance.priority.${rec.priority}`)}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('performance.impactScore')}: {rec.impact}%</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Recommendations;
