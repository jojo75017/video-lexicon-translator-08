
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
import { calculateSpeedScore, formatTime } from './performance/utils';

interface LoadingSpeedAnalysisProps {
  performance: PerformanceData;
}

const LoadingSpeedAnalysis: React.FC<LoadingSpeedAnalysisProps> = ({ performance }) => {
  const [activeDevice, setActiveDevice] = useState<'mobile' | 'desktop'>('desktop');

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
    { name: 'Contenu', value: deviceData.firstContentfulPaint || 0 },
    { name: 'DOM', value: deviceData.domLoadTime || 0 },
    { name: 'Total', value: deviceData.loadTime || 0 },
    { name: 'Interactif', value: deviceData.timeToInteractive || deviceData.loadTime * 1.1 || 0 },
  ];

  // Data for the resources chart
  const resourcesData = [];
  
  if (deviceData.resourceBreakdown) {
    const { images, scripts, styles, fonts, other } = deviceData.resourceBreakdown;
    
    if (images) resourcesData.push({ name: 'Images', value: images });
    if (scripts) resourcesData.push({ name: 'Scripts', value: scripts });
    if (styles) resourcesData.push({ name: 'Styles', value: styles });
    if (fonts) resourcesData.push({ name: 'Polices', value: fonts });
    if (other) resourcesData.push({ name: 'Autres', value: other });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Zap className="w-5 h-5 mr-2 text-blue-600" />
          <h3 className="text-lg font-medium">Performance de chargement</h3>
        </div>
        <PerformanceScore score={speedScore} />
      </div>
      
      <Tabs defaultValue={activeDevice} onValueChange={(value) => setActiveDevice(value as 'mobile' | 'desktop')}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="desktop" className="flex items-center gap-2">
            <Monitor className="w-4 h-4" /> Desktop
          </TabsTrigger>
          <TabsTrigger value="mobile" className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" /> Mobile
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
