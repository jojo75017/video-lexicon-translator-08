
import React from 'react';
import { KeywordData } from '@/types/seo/Keyword';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface MetricsSectionProps {
  keywords: KeywordData[];
}

const MetricsSection: React.FC<MetricsSectionProps> = ({ keywords }) => {
  // Sort keywords by density (from highest to lowest)
  const sortedKeywords = [...keywords].sort((a, b) => b.density - a.density);

  // Get top 5 keywords
  const topKeywords = sortedKeywords.slice(0, 5);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mots-clés principaux</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topKeywords.map((keyword, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{keyword.keyword}</span>
                    <Badge variant="outline" className="text-xs">
                      {keyword.count} occurrences
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {keyword.density.toFixed(2)}%
                  </span>
                </div>
                <Progress value={keyword.density * 5} className="h-1" />
                
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  {keyword.volume && (
                    <span>Volume: {keyword.volume}</span>
                  )}
                  {keyword.difficulty !== undefined && (
                    <span>Difficulté: {keyword.difficulty}/100</span>
                  )}
                  {keyword.position !== undefined && (
                    <span>Position: {keyword.position === 0 ? "Non classé" : `#${keyword.position}`}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsSection;
