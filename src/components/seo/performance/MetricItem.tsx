
import React from 'react';
import { MetricItemProps } from './types';

const MetricItem: React.FC<MetricItemProps> = ({
  label,
  value,
  maxValue,
  formatFunc,
  getColorClass
}) => {
  const widthPercentage = Math.min((value / maxValue) * 100, 100);
  const colorClass = getColorClass(value, maxValue);

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium">{formatFunc(value)}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div 
          className={`h-2.5 rounded-full ${colorClass} transition-all duration-500`} 
          style={{ width: `${widthPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default MetricItem;
