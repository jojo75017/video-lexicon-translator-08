
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { KeywordSuggestion } from '@/types/seo/Keyword';

interface TrendAnalysisProps {
  keywords: KeywordSuggestion[];
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ keywords }) => {
  const getTrendIcon = (trend?: number[]) => {
    if (!trend || trend.length < 2) return <Minus className="h-4 w-4 text-gray-500" />;
    
    const start = trend[0];
    const end = trend[trend.length - 1];
    
    if (end > start * 1.1) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (end < start * 0.9) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getTrendPercentage = (trend?: number[]) => {
    if (!trend || trend.length < 2) return 0;
    
    const start = trend[0];
    const end = trend[trend.length - 1];
    
    return Math.round(((end - start) / start) * 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          Analyse des Tendances
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {keywords.map((keyword, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{keyword.keyword}</h3>
                <div className="flex items-center gap-2">
                  {getTrendIcon(keyword.trend)}
                  <span className={`text-sm font-medium ${
                    getTrendPercentage(keyword.trend) > 0 ? 'text-green-600' :
                    getTrendPercentage(keyword.trend) < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {getTrendPercentage(keyword.trend) > 0 ? '+' : ''}{getTrendPercentage(keyword.trend)}%
                  </span>
                </div>
              </div>
              
              {keyword.trend && (
                <div className="flex items-end gap-1 h-12">
                  {keyword.trend.map((value, i) => (
                    <div
                      key={i}
                      className="bg-blue-500 rounded-sm min-w-[3px] opacity-70 hover:opacity-100"
                      style={{
                        height: `${(value / Math.max(...keyword.trend!)) * 100}%`
                      }}
                    />
                  ))}
                </div>
              )}
              
              <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                <div>
                  <span className="text-gray-600">Volume</span>
                  <div className="font-medium">{keyword.volume?.toLocaleString() || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-gray-600">Difficulté</span>
                  <div className="font-medium">{keyword.difficulty || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-gray-600">Opportunité</span>
                  <div className="font-medium text-green-600">{keyword.opportunity || 'N/A'}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendAnalysis;
