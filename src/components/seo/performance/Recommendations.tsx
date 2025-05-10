
import React from 'react';
import { Card } from "@/components/ui/card";
import { Check, AlertCircle } from 'lucide-react';
import { PerformanceData } from './types';
import { useTranslation } from 'react-i18next';

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
        text: t('performance.recommendations.optimizeImages')
      });
    }
    
    if (deviceData.resourceBreakdown?.styles > 200) {
      recommendations.push({
        id: 'minifyCSS',
        text: t('performance.recommendations.minifyCSS')
      });
    }
    
    if (deviceData.resourceBreakdown?.scripts > 300) {
      recommendations.push({
        id: 'minifyJS',
        text: t('performance.recommendations.minifyJS')
      });
    }
    
    // Performance metric based recommendations
    if (totalBlockingTime > 300) {
      recommendations.push({
        id: 'reduceTBT',
        text: t('performance.recommendations.reduceTBT')
      });
    }
    
    if (loadTime > (activeDevice === 'mobile' ? 3000 : 2000)) {
      recommendations.push({
        id: 'improveServerResponse',
        text: t('performance.recommendations.improveServerResponse')
      });
    }
    
    // General best practice recommendations
    recommendations.push({
      id: 'useCaching',
      text: t('performance.recommendations.useCaching')
    });
    
    recommendations.push({
      id: 'useCDN',
      text: t('performance.recommendations.useCDN')
    });
    
    return recommendations;
  };
  
  const recommendations = getRecommendations();
  
  return (
    <Card className="p-5">
      <h3 className="text-lg font-medium mb-4">{t('performance.recommendations.title')}</h3>
      
      <div className="divide-y">
        {recommendations.map((rec, index) => (
          <div key={rec.id} className="py-3 flex items-start gap-3">
            <div className="mt-0.5">
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-gray-700">{rec.text}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Recommendations;
