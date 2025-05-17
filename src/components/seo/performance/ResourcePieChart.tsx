
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ChartProps } from './types';

const COLORS = ['#4f46e5', '#0891b2', '#16a34a', '#9333ea', '#f59e0b', '#dc2626'];

const ResourcePieChart: React.FC<ChartProps> = ({ data, activeDevice }) => {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-gray-500">Données non disponibles</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={30}
          outerRadius={60}
          paddingAngle={5}
          dataKey="value"
          animationDuration={1000}
          animationBegin={0}
          animationEasing="ease-out"
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]} 
              stroke="#fff"
              strokeWidth={2}
              className="hover:opacity-80 transition-opacity"
            />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => [`${(value/1000).toFixed(1)} KB`, '']}
          contentStyle={{
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            padding: '8px 12px'
          }}
          itemStyle={{ color: '#4b5563' }}
        />
        <Legend 
          layout="horizontal" 
          verticalAlign="bottom" 
          align="center"
          wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ResourcePieChart;
