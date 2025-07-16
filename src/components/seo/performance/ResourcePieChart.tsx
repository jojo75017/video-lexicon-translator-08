
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ChartProps } from './types';

// Couleurs vives et vibrantes pour le graphique en premier plan
const COLORS = [
  '#4338ca', // indigo-700
  '#0ea5e9', // sky-500
  '#10b981', // emerald-500
  '#8b5cf6', // violet-500
  '#f59e0b', // amber-500
  '#ef4444'  // red-500
];

const ResourcePieChart: React.FC<ChartProps> = ({ data, activeDevice }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 bg-gray-50 rounded-lg p-4 border border-gray-200">
        <p>Données non disponibles</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={80}
          paddingAngle={6}
          dataKey="value"
          animationDuration={800}
          animationBegin={300}
          animationEasing="ease-out"
          className="drop-shadow-xl"
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]} 
              stroke="#fff"
              strokeWidth={3}
              className="hover:opacity-90 transition-all duration-300 hover:scale-105"
              style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
            />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => [`${(value/1000).toFixed(1)} KB`, '']}
          contentStyle={{
            borderRadius: '10px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(209, 213, 219, 0.5)',
            padding: '12px 16px'
          }}
          itemStyle={{ 
            color: '#4b5563',
            fontWeight: '500',
            fontSize: '14px'
          }}
          wrapperStyle={{
            zIndex: 1000
          }}
        />
        <Legend 
          layout="horizontal" 
          verticalAlign="bottom" 
          align="center"
          wrapperStyle={{ 
            fontSize: '13px', 
            fontWeight: '500',
            paddingTop: '15px' 
          }}
          formatter={(value, entry) => (
            <span style={{ color: entry.color, fontWeight: 'bold', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ResourcePieChart;
