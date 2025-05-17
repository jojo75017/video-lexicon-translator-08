
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
  
  // Get text color class based on the bar color
  const getTextColorClass = () => {
    if (colorClass.includes('bg-red')) return 'text-red-700';
    if (colorClass.includes('bg-yellow')) return 'text-yellow-700';
    if (colorClass.includes('bg-amber')) return 'text-amber-700';
    if (colorClass.includes('bg-green')) return 'text-green-700';
    return 'text-gray-700';
  };

  return (
    <div className="space-y-1 group hover:bg-gray-50 rounded-md p-2 transition-all">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{label}</span>
        <span className={`text-sm font-medium ${getTextColorClass()} bg-opacity-10 px-2 py-0.5 rounded-full bg-${colorClass.split('-')[1]}-100`}>
          {formatFunc(value)}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden shadow-inner">
        <div 
          className={`h-2.5 rounded-full ${colorClass} transition-all duration-1000 shadow-sm`} 
          style={{ 
            width: `${widthPercentage}%`,
            boxShadow: `0 0 8px ${colorClass.includes('bg-green') ? 'rgba(34, 197, 94, 0.5)' : 
                         colorClass.includes('bg-yellow') ? 'rgba(234, 179, 8, 0.5)' :
                         colorClass.includes('bg-amber') ? 'rgba(245, 158, 11, 0.5)' :
                         'rgba(239, 68, 68, 0.5)'}` 
          }}
        ></div>
      </div>
    </div>
  );
};

export default MetricItem;
