
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Share2, Zap, AlertTriangle } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { motion } from "framer-motion";
import SeoScore from './SeoScore';
import SeoSuggestions from './SeoSuggestions';
import { Performance } from '@/types/seo';
import { useTranslation } from 'react-i18next';

interface SeoOverviewProps {
  score?: number;
  suggestions?: string[];
  performance?: Performance;
}

const SeoOverview = ({ score, suggestions, performance }: SeoOverviewProps) => {
  const { t } = useTranslation();
  
  const hasData = !!score && !!performance;
  
  let performanceData = [];
  if (performance) {
    performanceData = [
      { name: 'Load Time', value: performance.loadTime },
      { name: 'TTFB', value: performance.firstContentfulPaint },
      { name: 'DOM Load', value: performance.domLoadTime },
    ];
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Analyse SEO</h2>
        {hasData && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Partager
            </Button>
          </div>
        )}
      </div>
      
      {hasData ? (
        <>
          <motion.div 
            className="grid gap-6 md:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-4 bg-white">
              <SeoScore score={score!} />
            </Card>
            
            <Card className="p-4 bg-white md:col-span-2">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                Performance Globale
              </h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#6366f1" fill="#818cf8" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <SeoSuggestions suggestions={suggestions || []} />
          </motion.div>
        </>
      ) : (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Aucun site web analysé</h3>
          <p className="text-gray-500 max-w-md">
            Pour voir l'analyse SEO complète et les suggestions d'amélioration, veuillez analyser un site web en utilisant le formulaire ci-dessus.
          </p>
        </div>
      )}
    </Card>
  );
};

export default SeoOverview;
