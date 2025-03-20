
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Performance } from '@/types/seo';
import { AlertTriangle, Check, BarChart } from 'lucide-react';

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

  return (
    <Card>
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
            <div className="relative h-32 w-32 mx-auto">
              <div className={`absolute inset-0 rounded-full flex items-center justify-center ${getScoreColor(score)} text-white font-bold text-3xl`}>
                {score}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Points à améliorer</h3>
            <ul className="space-y-2">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{suggestion}</span>
                  </li>
                ))
              ) : (
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Aucun problème détecté</span>
                </li>
              )}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Performance</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Temps de chargement</span>
                  <span className="font-medium">
                    {(performance.loadTime / 1000).toFixed(2)}s
                  </span>
                </div>
                <Progress value={Math.min(100, 100 - (performance.loadTime / 50))} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>First Contentful Paint</span>
                  <span className="font-medium">
                    {(performance.firstContentfulPaint / 1000).toFixed(2)}s
                  </span>
                </div>
                <Progress value={Math.min(100, 100 - (performance.firstContentfulPaint / 30))} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>DOM Load</span>
                  <span className="font-medium">
                    {(performance.domLoadTime / 1000).toFixed(2)}s
                  </span>
                </div>
                <Progress value={Math.min(100, 100 - (performance.domLoadTime / 40))} className="h-2" />
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline">{performance.resourceCount} ressources</Badge>
                <Badge variant="outline">{performance.scriptCount} scripts</Badge>
                <Badge variant="outline">{performance.imageCount} images</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeoOverview;
