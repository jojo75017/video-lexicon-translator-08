
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
  Search,
  ArrowUp,
  ArrowDown,
  Clock,
  Image
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
    <Card className="bg-white shadow-md border border-gray-100">
      <CardHeader className="pb-2 border-b border-gray-100">
        <CardTitle className="text-xl flex items-center gap-2">
          <BarChart className="h-5 w-5 text-blue-600" />
          Analyse SEO - Vue d'ensemble
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Sparkles className="h-4 w-4 text-amber-500 mr-2" /> 
              Score SEO
            </h3>
            <div className="flex items-center mb-4">
              <div className={`h-20 w-20 rounded-full flex flex-col items-center justify-center ${getScoreColor(score)} text-white shadow-sm`}>
                <span className="text-2xl font-bold">{score}</span>
                <span className="text-xs">{getScoreLabel(score)}</span>
              </div>
              <div className="ml-5">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Impressions</span>
                    <div className="font-semibold text-blue-700">{performance.impressions.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">CTR</span>
                    <div className="font-semibold text-purple-700">{performance.clickThroughRate?.toFixed(1)}%</div>
                  </div>
                </div>
                
                <div className="mt-2 flex items-center">
                  <span className="text-xs text-gray-500 mr-1">Position moyenne:</span>
                  <span className="text-sm font-semibold text-amber-600">4.2</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="flex items-center">
                <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700 mr-2">
                  <ArrowUp className="h-3 w-3 mr-1" />25
                </Badge>
                <span className="text-xs text-gray-600">Mots clés qui progressent</span>
              </div>
              <div className="flex items-center">
                <Badge variant="outline" className="bg-red-50 border-red-200 text-red-700 mr-2">
                  <ArrowDown className="h-3 w-3 mr-1" />12
                </Badge>
                <span className="text-xs text-gray-600">Mots clés en baisse</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <CopyCheck className="h-4 w-4 text-teal-600 mr-2" />
              Points à améliorer
            </h3>
            <div className="bg-gray-50 rounded-lg p-3 h-[calc(100%-2rem)] overflow-hidden">
              {suggestions.length > 0 ? (
                <ul className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 bg-amber-50 p-2 rounded border-l-2 border-amber-500">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-amber-800">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center gap-2 bg-green-50 p-4 rounded-lg h-full justify-center">
                  <Check className="h-6 w-6 text-green-500" />
                  <span className="text-sm font-medium text-green-700">Aucun problème majeur détecté</span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Zap className="h-4 w-4 text-indigo-600 mr-2" />
              Performance
            </h3>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-blue-500" />
                      Temps de chargement
                    </span>
                    <span className={`font-medium ${(performance.loadTime / 1000) < 2 ? 'text-green-600' : 'text-amber-600'}`}>
                      {(performance.loadTime / 1000).toFixed(2)}s
                    </span>
                  </div>
                  <Progress value={Math.min(100, 100 - (performance.loadTime / 50))} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 flex items-center">
                      <Globe className="h-3 w-3 mr-1 text-purple-500" />
                      First Contentful Paint
                    </span>
                    <span className={`font-medium ${(performance.firstContentfulPaint / 1000) < 1.5 ? 'text-green-600' : 'text-amber-600'}`}>
                      {(performance.firstContentfulPaint / 1000).toFixed(2)}s
                    </span>
                  </div>
                  <Progress value={Math.min(100, 100 - (performance.firstContentfulPaint / 30))} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 flex items-center">
                      <Search className="h-3 w-3 mr-1 text-indigo-500" />
                      DOM Load
                    </span>
                    <span className={`font-medium ${(performance.domLoadTime / 1000) < 2 ? 'text-green-600' : 'text-amber-600'}`}>
                      {(performance.domLoadTime / 1000).toFixed(2)}s
                    </span>
                  </div>
                  <Progress value={Math.min(100, 100 - (performance.domLoadTime / 40))} className="h-2" />
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="bg-white p-2 rounded border border-gray-100 text-center">
                    <span className="text-xs text-gray-500 block">Ressources</span>
                    <span className="font-medium text-sm">{performance.resourceCount}</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-gray-100 text-center">
                    <span className="text-xs text-gray-500 block">Scripts</span>
                    <span className="font-medium text-sm">{performance.scriptCount}</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-gray-100 text-center">
                    <span className="text-xs text-gray-500 block">Images</span>
                    <span className="font-medium text-sm">{performance.imageCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional metrics section */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <h3 className="text-lg font-medium mb-3">Analyse globale</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Mobile Friendly</span>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  Excellent
                </Badge>
              </div>
              <Progress value={92} className="h-1.5" />
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Liens internes</span>
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                  Bon
                </Badge>
              </div>
              <Progress value={78} className="h-1.5" />
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Balises Title</span>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  Excellent
                </Badge>
              </div>
              <Progress value={95} className="h-1.5" />
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Optimisation images</span>
                <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                  À améliorer
                </Badge>
              </div>
              <Progress value={45} className="h-1.5" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeoOverview;
