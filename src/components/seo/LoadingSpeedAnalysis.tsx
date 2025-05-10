
import React, { useState } from 'react';
import { Zap, Monitor, Smartphone } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PerformanceData } from './performance/types';
import PerformanceMetricsSection from './performance/PerformanceMetricsSection';
import PerformanceBarChart from './performance/PerformanceBarChart';
import ResourcesChart from './performance/ResourcesChart';
import Recommendations from './performance/Recommendations';
import PerformanceScore from './performance/PerformanceScore';
import PerformanceComparisonChart from './performance/PerformanceComparisonChart';
import PerformanceHighlights from './performance/PerformanceHighlights';
import PerformanceTrends from './performance/PerformanceTrends';
import { calculateSpeedScore } from './performance/utils';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../LanguageSelector';

interface LoadingSpeedAnalysisProps {
  performance: PerformanceData;
}

const LoadingSpeedAnalysis: React.FC<LoadingSpeedAnalysisProps> = ({ performance }) => {
  const [activeDevice, setActiveDevice] = useState<'mobile' | 'desktop'>('desktop');
  const { t, i18n } = useTranslation();
  
  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  // Get device-specific performance data
  const getDevicePerformance = (): PerformanceData => {
    if (activeDevice === 'mobile' && performance.mobilePerformance) {
      return performance.mobilePerformance;
    }
    
    if (activeDevice === 'desktop' && performance.desktopPerformance) {
      return performance.desktopPerformance;
    }
    
    // Fallback to generic data if device-specific data is not available
    return performance;
  };

  const deviceData = getDevicePerformance();
  
  // Calculate speed score
  const speedScore = calculateSpeedScore(deviceData);

  // Data for the bar chart
  const barData = [
    { name: t('performance.firstContent', 'Contenu'), value: deviceData.firstContentfulPaint || 0 },
    { name: t('performance.dom', 'DOM'), value: deviceData.domLoadTime || 0 },
    { name: t('performance.total', 'Total'), value: deviceData.loadTime || 0 },
    { name: t('performance.interactive', 'Interactif'), value: deviceData.timeToInteractive || deviceData.loadTime * 1.1 || 0 },
  ];

  // Data for the resources chart
  const resourcesData = [];
  
  if (deviceData.resourceBreakdown) {
    const { images, scripts, styles, fonts, other } = deviceData.resourceBreakdown;
    
    if (images) resourcesData.push({ name: t('performance.images', 'Images'), value: images });
    if (scripts) resourcesData.push({ name: t('performance.scripts', 'Scripts'), value: scripts });
    if (styles) resourcesData.push({ name: t('performance.styles', 'Styles'), value: styles });
    if (fonts) resourcesData.push({ name: t('performance.fonts', 'Polices'), value: fonts });
    if (other) resourcesData.push({ name: t('performance.other', 'Autres'), value: other });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center">
          <Zap className="w-5 h-5 mr-2 text-blue-600" />
          <h3 className="text-lg font-medium">{t('performance.loadingPerformance', 'Performance de chargement')}</h3>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelector onLanguageChange={handleLanguageChange} />
          <PerformanceScore score={speedScore} />
        </div>
      </div>
      
      <Tabs defaultValue={activeDevice} onValueChange={(value) => setActiveDevice(value as 'mobile' | 'desktop')}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="desktop" className="flex items-center gap-2">
            <Monitor className="w-4 h-4" /> {t('performance.desktop', 'Desktop')}
          </TabsTrigger>
          <TabsTrigger value="mobile" className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" /> {t('performance.mobile', 'Mobile')}
          </TabsTrigger>
        </TabsList>
        
        {/* Add Performance Highlights */}
        <PerformanceHighlights 
          deviceData={deviceData} 
          activeDevice={activeDevice} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <PerformanceMetricsSection deviceData={deviceData} activeDevice={activeDevice} />
          <PerformanceBarChart activeDevice={activeDevice} data={barData} />
        </div>
      </Tabs>
      
      {/* Add comparison chart between mobile and desktop */}
      <PerformanceComparisonChart 
        mobileData={performance.mobilePerformance} 
        desktopData={performance.desktopPerformance} 
      />
      
      {/* Add performance trends */}
      <PerformanceTrends activeDevice={activeDevice} />
      
      {resourcesData.length > 0 && (
        <ResourcesChart activeDevice={activeDevice} resourcesData={resourcesData} />
      )}
      
      <Recommendations activeDevice={activeDevice} deviceData={deviceData} />
    </div>
  );
};

export default LoadingSpeedAnalysis;
