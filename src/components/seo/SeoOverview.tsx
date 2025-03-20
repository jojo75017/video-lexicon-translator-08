
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Performance } from '@/types/seo';
import { 
  AlertTriangle, 
  Check, 
  BarChart, 
  Sparkles, 
  CopyCheck, 
  Zap, 
  Globe, 
  Search 
} from 'lucide-react';

export interface SeoOverviewProps {
  score: number;
  suggestions: string[];
  performance: Performance;
}

const SeoOverview = ({ score, suggestions, performance }: SeoOverviewProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return "text-green-700";
    if (score >= 60) return "text-yellow-700";
    return "text-red-700";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Bon";
    return "À améliorer";
  };

  return (
    <Card className="backdrop-blur-sm bg-white/30 dark:bg-black/30 border-gray-100 dark:border-gray-800 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <BarChart className="h-5 w-5 text-blue-600" />
          Aperçu SEO
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Score Global</h3>
            <div className="relative h-36 w-36 mx-auto">
              <div className={`absolute inset-0 rounded-full flex flex-col items-center justify-center ${getScoreColor(score)} text-white shadow-lg`}>
                <span className="text-4xl font-bold">{score}</span>
                <span className="text-sm font-medium mt-1">{getScoreLabel(score)}</span>
              </div>
              <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 p-1 rounded-full shadow-md">
                <Sparkles className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-2 text-center text-sm">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
                <span className="block font-medium text-blue-700 dark:text-blue-300">
                  {performance.impressions || 1500}
                </span>
                <span className="text-xs text-blue-600 dark:text-blue-400">Impressions</span>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-md">
                <span className="block font-medium text-purple-700 dark:text-purple-300">
                  {performance.clickThroughRate?.toFixed(1) || "3.2"}%
                </span>
                <span className="text-xs text-purple-600 dark:text-purple-400">CTR</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <CopyCheck className="h-4 w-4 text-teal-600 mr-2" />
              Points à améliorer
            </h3>
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-3 h-[calc(100%-2rem)]">
              {suggestions.length > 0 ? (
                <ul className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 p-2 rounded border-l-2 border-amber-500">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-amber-800 dark:text-amber-200">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg h-full justify-center">
                  <Check className="h-6 w-6 text-green-500" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Aucun problème majeur détecté</span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Zap className="h-4 w-4 text-indigo-600 mr-2" />
              Performance
            </h3>
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-3">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300 flex items-center">
                      <Globe className="h-3 w-3 mr-1 text-blue-500" />
                      Temps de chargement
                    </span>
                    <span className={`font-medium ${(performance.loadTime / 1000) < 2 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {(performance.loadTime / 1000).toFixed(2)}s
                    </span>
                  </div>
                  <Progress value={Math.min(100, 100 - (performance.loadTime / 50))} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300 flex items-center">
                      <Search className="h-3 w-3 mr-1 text-purple-500" />
                      First Contentful Paint
                    </span>
                    <span className={`font-medium ${(performance.firstContentfulPaint / 1000) < 1.5 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {(performance.firstContentfulPaint / 1000).toFixed(2)}s
                    </span>
                  </div>
                  <Progress value={Math.min(100, 100 - (performance.firstContentfulPaint / 30))} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">
                      DOM Load
                    </span>
                    <span className={`font-medium ${(performance.domLoadTime / 1000) < 2 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {(performance.domLoadTime / 1000).toFixed(2)}s
                    </span>
                  </div>
                  <Progress value={Math.min(100, 100 - (performance.domLoadTime / 40))} className="h-2" />
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                    {performance.resourceCount} ressources
                  </Badge>
                  <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                    {performance.scriptCount} scripts
                  </Badge>
                  <Badge variant="outline" className="bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800">
                    {performance.imageCount} images
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeoOverview;
