
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { MetricItemProps } from './types';

const MetricItem: React.FC<MetricItemProps> = ({ 
  label, 
  value, 
  maxValue, 
  formatFunc, 
  getColorClass 
}) => {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className={getColorClass(value)}>
          {formatFunc(value)}
        </span>
      </div>
      <Progress 
        value={(value / maxValue) * 100} 
        className={`h-2 ${getColorClass(value, 'bg')}`} 
      />
    </div>
  );
};

export default MetricItem;
