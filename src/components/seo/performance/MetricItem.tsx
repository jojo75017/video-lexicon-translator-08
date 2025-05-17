
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
  
  // Get gradient background based on the color
  const getGradientStyle = () => {
    if (colorClass.includes('bg-red')) 
      return 'bg-gradient-to-r from-red-500 to-red-600';
    if (colorClass.includes('bg-yellow')) 
      return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
    if (colorClass.includes('bg-amber')) 
      return 'bg-gradient-to-r from-amber-400 to-amber-500';
    if (colorClass.includes('bg-green')) 
      return 'bg-gradient-to-r from-green-500 to-green-600';
    return 'bg-gradient-to-r from-blue-500 to-blue-600';
  };

  return (
    <div className="space-y-2 group hover:bg-gray-50 rounded-md p-3 transition-all duration-300 border border-transparent hover:border-gray-200 hover:shadow-sm">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{label}</span>
        <span className={`text-sm font-semibold ${getTextColorClass()} bg-opacity-15 px-3 py-1 rounded-full ${colorClass.includes('bg-green') ? 'bg-green-100' : colorClass.includes('bg-yellow') ? 'bg-yellow-100' : colorClass.includes('bg-amber') ? 'bg-amber-100' : 'bg-red-100'}`}>
          {formatFunc(value)}
        </span>
      </div>
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner relative">
        <div 
          className={`h-3 rounded-full transition-all duration-1000 ${getGradientStyle()}`} 
          style={{ 
            width: `${widthPercentage}%`,
            boxShadow: `0 0 10px ${colorClass.includes('bg-green') ? 'rgba(34, 197, 94, 0.5)' : 
                          colorClass.includes('bg-yellow') ? 'rgba(234, 179, 8, 0.5)' :
                          colorClass.includes('bg-amber') ? 'rgba(245, 158, 11, 0.5)' :
                          'rgba(239, 68, 68, 0.5)'}` 
          }}
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        {/* Pulse animation at the end of the bar */}
        <div 
          className="absolute top-0 h-3 w-3 rounded-full animate-pulse"
          style={{ 
            left: `calc(${Math.min(widthPercentage, 97)}% - 3px)`,
            background: colorClass.includes('bg-green') ? 'rgba(34, 197, 94, 0.7)' : 
                        colorClass.includes('bg-yellow') ? 'rgba(234, 179, 8, 0.7)' :
                        colorClass.includes('bg-amber') ? 'rgba(245, 158, 11, 0.7)' :
                        'rgba(239, 68, 68, 0.7)'
          }}
        ></div>
      </div>
    </div>
  );
};

export default MetricItem;
