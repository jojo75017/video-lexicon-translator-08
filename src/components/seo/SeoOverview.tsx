
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Share2, Zap, AlertTriangle, FileCheck, ChevronRight, Lightbulb } from "lucide-react";
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
      { name: 'Chargement', value: performance.loadTime },
      { name: 'Premier affichage', value: performance.firstContentfulPaint },
      { name: 'DOM Complet', value: performance.domLoadTime },
      { name: 'Interactivité', value: performance.timeToInteractive },
    ];
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-indigo-50 border-0 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-indigo-600 rounded-full mr-3"></div>
          <h2 className="text-2xl font-bold text-gray-800">Analyse SEO</h2>
        </div>
        {hasData && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="bg-white">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button variant="outline" size="sm" className="bg-white">
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
            <Card className="p-4 bg-white border border-gray-100 shadow-sm">
              <SeoScore score={score!} />
              
              <div className="mt-4 space-y-2">
                <ScoreDetail 
                  label="Performance" 
                  value={performance!.score} 
                  color="bg-indigo-600" 
                />
                <ScoreDetail 
                  label="Structure" 
                  value={calculateStructureScore(performance!)} 
                  color="bg-emerald-600" 
                />
                <ScoreDetail 
                  label="Contenu" 
                  value={calculateContentScore(performance!)} 
                  color="bg-amber-600" 
                />
              </div>
            </Card>
            
            <Card className="p-4 bg-white border border-gray-100 shadow-sm md:col-span-2">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                Performance Globale
              </h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip 
                      formatter={(value: number) => [`${(value / 1000).toFixed(2)}s`, 'Temps']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#6366f1" 
                      fillOpacity={1}
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2 bg-indigo-50 rounded-md">
                  <div className="text-xs text-indigo-600 font-medium">Chargement</div>
                  <div className="font-semibold text-indigo-900">
                    {(performance!.loadTime / 1000).toFixed(2)}s
                  </div>
                </div>
                <div className="p-2 bg-blue-50 rounded-md">
                  <div className="text-xs text-blue-600 font-medium">Premier affichage</div>
                  <div className="font-semibold text-blue-900">
                    {(performance!.firstContentfulPaint / 1000).toFixed(2)}s
                  </div>
                </div>
                <div className="p-2 bg-emerald-50 rounded-md">
                  <div className="text-xs text-emerald-600 font-medium">DOM</div>
                  <div className="font-semibold text-emerald-900">
                    {(performance!.domLoadTime / 1000).toFixed(2)}s
                  </div>
                </div>
                <div className="p-2 bg-amber-50 rounded-md">
                  <div className="text-xs text-amber-600 font-medium">Interactivité</div>
                  <div className="font-semibold text-amber-900">
                    {(performance!.timeToInteractive / 1000).toFixed(2)}s
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {suggestions && suggestions.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <Lightbulb className="h-5 w-5 text-amber-500 mr-2" />
                  <h3 className="font-semibold text-gray-800">Recommandations d'optimisation</h3>
                </div>
                <SeoSuggestions suggestions={suggestions} />
              </div>
            ) : (
              <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
                <div className="flex items-center">
                  <div className="mr-3 bg-green-100 p-2 rounded-full">
                    <FileCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-800">Excellent travail!</h3>
                    <p className="text-sm text-green-700">
                      Aucun problème majeur n'a été détecté. Votre site respecte les bonnes pratiques SEO.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        </>
      ) : (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Aucun site web analysé</h3>
          <p className="text-gray-500 max-w-md mb-6">
            Pour voir l'analyse SEO complète et les suggestions d'amélioration, veuillez analyser un site web en utilisant le formulaire ci-dessus.
          </p>
          <Button 
            variant="outline" 
            className="group text-indigo-600 border-indigo-200 hover:bg-indigo-50"
          >
            Comment fonctionne l'analyse SEO
            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      )}
    </Card>
  );
};

// Fonction utilitaire pour calculer un score de structure
const calculateStructureScore = (performance: Performance): number => {
  // Exemple simple, à adapter selon vos besoins réels
  return Math.min(100, Math.max(0, 100 - (performance.cssCount > 15 ? 20 : 0) - (performance.scriptCount > 20 ? 20 : 0)));
};

// Fonction utilitaire pour calculer un score de contenu
const calculateContentScore = (performance: Performance): number => {
  // Exemple simple, à adapter selon vos besoins réels
  return Math.min(100, Math.max(0, 75 + Math.random() * 15));
};

interface ScoreDetailProps {
  label: string;
  value: number;
  color: string;
}

const ScoreDetail: React.FC<ScoreDetailProps> = ({ label, value, color }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm font-medium">{value}%</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color}`} 
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
};

export default SeoOverview;
