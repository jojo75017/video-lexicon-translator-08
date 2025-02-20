
import React from 'react';
import { Card } from "@/components/ui/card";
import { BarChart3, Users, Clock, ArrowRight } from "lucide-react";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const mockData = [
  { date: '01/05', visits: 1200 },
  { date: '02/05', visits: 1900 },
  { date: '03/05', visits: 1600 },
  { date: '04/05', visits: 2100 },
  { date: '05/05', visits: 1800 },
  { date: '06/05', visits: 2300 },
  { date: '07/05', visits: 2100 }
];

const AnalyticsOverview = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Aperçu Analytics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-blue-600 font-medium">Visiteurs uniques</span>
            </div>
            <p className="text-2xl font-bold">2,547</p>
            <p className="text-sm text-blue-600">+12.5% vs mois précédent</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-green-600" />
              <span className="text-green-600 font-medium">Temps moyen</span>
            </div>
            <p className="text-2xl font-bold">2m 35s</p>
            <p className="text-sm text-green-600">+5.2% vs mois précédent</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <ArrowRight className="h-5 w-5 text-purple-600" />
              <span className="text-purple-600 font-medium">Taux de rebond</span>
            </div>
            <p className="text-2xl font-bold">45.8%</p>
            <p className="text-sm text-purple-600">-2.1% vs mois précédent</p>
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={mockData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="visits" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsOverview;
