
import React from 'react';
import { Card } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { motion } from "framer-motion";

interface SearchTrendsProps {
  clicks: number;
  impressions: number;
}

const SearchTrends = ({ clicks, impressions }: SearchTrendsProps) => {
  const generateSearchTrendData = () => {
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString();
    }).reverse();

    return dates.map(date => ({
      date,
      clicks: Math.floor(Math.random() * clicks),
      impressions: Math.floor(Math.random() * impressions)
    }));
  };

  const searchTrendData = generateSearchTrendData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Tendances de recherche</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={searchTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="clicks" 
                stackId="1"
                stroke="#3b82f6" 
                fill="#93c5fd" 
              />
              <Area 
                type="monotone" 
                dataKey="impressions" 
                stackId="1"
                stroke="#6366f1" 
                fill="#818cf8" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
};

export default SearchTrends;
