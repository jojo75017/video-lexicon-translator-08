
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { MetricItemProps } from './types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

const MetricItem: React.FC<MetricItemProps> = ({ 
  label, 
  value, 
  maxValue, 
  formatFunc, 
  getColorClass,
  tooltip
}) => {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <div className="flex items-center">
          <span>{label}</span>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 ml-1 text-gray-400 hover:text-gray-600 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <span className={getColorClass(value, 'text')}>
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
