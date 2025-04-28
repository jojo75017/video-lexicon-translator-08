
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const trendData = [
  { month: 'Jan', volume: 1200 },
  { month: 'Fév', volume: 1400 },
  { month: 'Mar', volume: 1100 },
  { month: 'Avr', volume: 1600 },
  { month: 'Mai', volume: 2000 },
  { month: 'Jun', volume: 1800 },
];

const KeywordTrends = () => {
  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            stroke="#888888"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="volume"
            stroke="#4f46e5"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default KeywordTrends;
