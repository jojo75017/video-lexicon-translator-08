
import React from 'react';
import { Card } from "@/components/ui/card";
import SearchTrends from "@/components/seo/SearchTrends";
import { motion } from "framer-motion";
import { analyzeSearchConsole } from '@/utils/seo/searchConsoleAnalyzer';
import { useQuery } from '@tanstack/react-query';

interface RankingTrackerProps {
  url: string;
}

const RankingTracker: React.FC<RankingTrackerProps> = ({ url }) => {
  const { data: searchData, isLoading } = useQuery({
    queryKey: ['searchConsole', url],
    queryFn: () => analyzeSearchConsole(url),
    enabled: !!url,
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Card>
    );
  }

  if (!searchData) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">Aucune donnée disponible</p>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Suivi des classements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-700">Position moyenne</h3>
            <p className="text-3xl font-bold text-blue-900">{searchData.position.toFixed(1)}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-700">Clics</h3>
            <p className="text-3xl font-bold text-green-900">{searchData.clicks}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-700">Impressions</h3>
            <p className="text-3xl font-bold text-purple-900">{searchData.impressions}</p>
          </div>
        </div>
        
        <SearchTrends 
          clicks={searchData.clicks} 
          impressions={searchData.impressions} 
        />
      </Card>
    </motion.div>
  );
};

export default RankingTracker;
