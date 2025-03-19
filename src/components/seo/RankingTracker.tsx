
import React from 'react';
import { Card } from "@/components/ui/card";
import SearchTrends from "@/components/seo/SearchTrends";
import { motion } from "framer-motion";
import { analyzeSearchConsole } from '@/utils/seo/searchConsoleAnalyzer';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';

interface RankingTrackerProps {
  url: string;
}

const RankingTracker: React.FC<RankingTrackerProps> = ({ url }) => {
  const { data: searchData, isLoading } = useQuery({
    queryKey: ['searchConsole', url],
    queryFn: () => analyzeSearchConsole(url),
    enabled: !!url && url.length > 0,
  });

  // Show empty state if no URL is provided
  if (!url) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Aucun site web à analyser</h3>
          <p className="text-gray-500 max-w-md">
            Veuillez entrer l'URL d'un site web dans le formulaire d'analyse pour voir les données de classement.
          </p>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Card>
    );
  }

  if (!searchData) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500 py-10">Aucune donnée disponible</p>
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
