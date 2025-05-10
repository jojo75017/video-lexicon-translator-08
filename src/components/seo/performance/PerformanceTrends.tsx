
import React from 'react';
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PerformanceData } from './types';

interface PerformanceTrendsProps {
  activeDevice: 'mobile' | 'desktop';
}

const PerformanceTrends: React.FC<PerformanceTrendsProps> = ({ activeDevice }) => {
  // Generating mock historical data for the trends chart
  const generateHistoricalData = () => {
    const now = new Date();
    const data = [];
    
    // Generate data for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      
      // Base values that generally improve over time
      const baseLoadTime = activeDevice === 'mobile' ? 
        3000 - (i * 100) + (Math.random() * 500) : 
        1800 - (i * 80) + (Math.random() * 300);
      
      const baseLCP = activeDevice === 'mobile' ? 
        2800 - (i * 90) + (Math.random() * 400) : 
        1600 - (i * 70) + (Math.random() * 250);
      
      const baseTBT = activeDevice === 'mobile' ? 
        400 - (i * 15) + (Math.random() * 100) : 
        250 - (i * 10) + (Math.random() * 60);
      
      // Add random variations to make it look realistic
      data.push({
        date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        loadTime: Math.max(baseLoadTime, activeDevice === 'mobile' ? 1800 : 1000),
        lcp: Math.max(baseLCP, activeDevice === 'mobile' ? 1500 : 800),
        tbt: Math.max(baseTBT, activeDevice === 'mobile' ? 200 : 100),
        score: Math.min(100, 65 + i * 3 + Math.random() * 10)
      });
    }
    
    return data;
  };
  
  const historicalData = generateHistoricalData();
  
  // Format for tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded-md shadow-sm">
          <p className="text-sm font-medium">{`${label}`}</p>
          <p className="text-xs text-blue-600">{`Temps de chargement: ${payload[0].value.toFixed(0)}ms`}</p>
          <p className="text-xs text-green-600">{`LCP: ${payload[1].value.toFixed(0)}ms`}</p>
          <p className="text-xs text-orange-600">{`TBT: ${payload[2].value.toFixed(0)}ms`}</p>
          <p className="text-xs text-purple-600">{`Score: ${payload[3].value.toFixed(0)}/100`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-3 mt-8">
      <h3 className="text-md font-medium">Tendances de performance sur 7 jours</h3>
      <Card className="p-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={historicalData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="date" />
              <YAxis yAxisId="time" orientation="left" />
              <YAxis yAxisId="score" orientation="right" domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                yAxisId="time"
                type="monotone" 
                dataKey="loadTime" 
                name="Temps de chargement" 
                stroke="#3b82f6" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
              <Line 
                yAxisId="time"
                type="monotone" 
                dataKey="lcp" 
                name="LCP" 
                stroke="#10b981" 
                activeDot={{ r: 6 }} 
                strokeWidth={2}
              />
              <Line 
                yAxisId="time"
                type="monotone" 
                dataKey="tbt" 
                name="TBT" 
                stroke="#f97316" 
                activeDot={{ r: 6 }} 
                strokeWidth={2}
              />
              <Line 
                yAxisId="score"
                type="monotone" 
                dataKey="score" 
                name="Score" 
                stroke="#8b5cf6" 
                activeDot={{ r: 6 }} 
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="text-xs text-gray-500 text-center mt-2">
          Évolution des performances du site {activeDevice === 'mobile' ? 'mobile' : 'desktop'} sur les 7 derniers jours
        </div>
      </Card>
    </div>
  );
};

export default PerformanceTrends;
