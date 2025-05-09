
import React from 'react';
import { Clock } from 'lucide-react';
import { PerformanceMetricsSectionProps } from './types';
import MetricItem from './MetricItem';
import { formatTime, getSpeedColorClass, getClsColorClass } from './utils';

const PerformanceMetricsSection: React.FC<PerformanceMetricsSectionProps> = ({ 
  deviceData,
  activeDevice
}) => {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-center mb-4">
        <Clock className="w-4 h-4 mr-2 text-blue-600" />
        <h4 className="font-medium">
          {activeDevice === 'mobile' ? 'Temps de chargement mobile' : 'Temps de chargement desktop'}
        </h4>
      </div>
      
      <div className="space-y-4">
        <MetricItem
          label="Temps de chargement total"
          value={deviceData.loadTime}
          maxValue={5000}
          formatFunc={formatTime}
          getColorClass={getSpeedColorClass}
        />
        
        <MetricItem
          label="Premier affichage du contenu"
          value={deviceData.firstContentfulPaint}
          maxValue={2000}
          formatFunc={formatTime}
          getColorClass={getSpeedColorClass}
        />
        
        <MetricItem
          label="Chargement du DOM"
          value={deviceData.domLoadTime}
          maxValue={3000}
          formatFunc={formatTime}
          getColorClass={getSpeedColorClass}
        />
        
        {deviceData.totalBlockingTime !== undefined && (
          <MetricItem
            label="Temps de blocage total"
            value={deviceData.totalBlockingTime}
            maxValue={500}
            formatFunc={formatTime}
            getColorClass={getSpeedColorClass}
          />
        )}
        
        {deviceData.timeToInteractive !== undefined && (
          <MetricItem
            label="Temps avant interactivité"
            value={deviceData.timeToInteractive}
            maxValue={5000}
            formatFunc={formatTime}
            getColorClass={getSpeedColorClass}
          />
        )}
        
        {deviceData.cumulativeLayoutShift !== undefined && (
          <MetricItem
            label="Décalage cumulatif de mise en page (CLS)"
            value={deviceData.cumulativeLayoutShift}
            maxValue={0.5}
            formatFunc={(val) => val.toFixed(3)}
            getColorClass={getClsColorClass}
          />
        )}
      </div>
    </div>
  );
};

export default PerformanceMetricsSection;
