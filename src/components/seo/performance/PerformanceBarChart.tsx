
import React from 'react';
import { BarChart2 } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { ChartProps } from './types';
import { formatTime } from './utils';

const PerformanceBarChart: React.FC<ChartProps> = ({ activeDevice, data }) => {
  // Format for tooltip
  const renderBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded text-sm">
          <p>{`${payload[0].name}: ${formatTime(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-center mb-2">
        <BarChart2 className="w-4 h-4 mr-2 text-blue-600" />
        <h4 className="font-medium">
          {activeDevice === 'mobile' ? 'Analyse des métriques mobiles' : 'Analyse des métriques desktop'}
        </h4>
      </div>
      
      <div className="h-[200px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <XAxis type="number" hide={true} />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={70}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={renderBarTooltip} />
            <Bar 
              dataKey="value" 
              fill={activeDevice === 'mobile' ? '#6366F1' : '#4F46E5'} 
              radius={[0, 4, 4, 0]}
              barSize={20}
              label={{ 
                position: 'right', 
                formatter: (value: number) => formatTime(value),
                fontSize: 12,
                fill: '#6B7280'
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceBarChart;
