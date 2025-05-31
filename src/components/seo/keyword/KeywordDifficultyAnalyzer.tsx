
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import { TrendingUp, TrendingDown, Target, AlertTriangle } from 'lucide-react';

interface KeywordDifficultyAnalyzerProps {
  keywords: KeywordSuggestion[];
}

const KeywordDifficultyAnalyzer: React.FC<KeywordDifficultyAnalyzerProps> = ({ keywords }) => {
  const getDifficultyLevel = (difficulty: number) => {
    if (difficulty <= 20) return { level: 'Facile', color: 'bg-green-500', textColor: 'text-green-700' };
    if (difficulty <= 40) return { level: 'Moyen', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    if (difficulty <= 60) return { level: 'Difficile', color: 'bg-orange-500', textColor: 'text-orange-700' };
    return { level: 'Très difficile', color: 'bg-red-500', textColor: 'text-red-700' };
  };

  const getOpportunityScore = (keyword: KeywordSuggestion) => {
    const volumeScore = Math.min(keyword.volume / 1000, 10);
    const difficultyPenalty = keyword.difficulty / 10;
    return Math.max(0, volumeScore - difficultyPenalty);
  };

  const sortedKeywords = keywords
    .map(kw => ({ ...kw, opportunityScore: getOpportunityScore(kw) }))
    .sort((a, b) => b.opportunityScore - a.opportunityScore);

  const easyKeywords = keywords.filter(kw => kw.difficulty <= 30);
  const highVolumeKeywords = keywords.filter(kw => kw.volume >= 1000);
  const bestOpportunities = sortedKeywords.slice(0, 5);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Analyse de difficulté des mots-clés</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{easyKeywords.length}</div>
            <div className="text-sm text-green-700">Mots-clés faciles</div>
            <div className="text-xs text-gray-600">(≤ 30 difficulté)</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{highVolumeKeywords.length}</div>
            <div className="text-sm text-blue-700">Fort volume</div>
            <div className="text-xs text-gray-600">(≥ 1000 recherches/mois)</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{bestOpportunities.length}</div>
            <div className="text-sm text-purple-700">Meilleures opportunités</div>
            <div className="text-xs text-gray-600">(score optimisé)</div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Top 5 des meilleures opportunités</h4>
          {bestOpportunities.map((keyword, index) => {
            const difficultyInfo = getDifficultyLevel(keyword.difficulty);
            return (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{keyword.keyword}</div>
                  <div className="text-sm text-gray-600">
                    Volume: {keyword.volume.toLocaleString()} • CPC: {keyword.cpc}€
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium">Score: {keyword.opportunityScore.toFixed(1)}</div>
                    <Badge variant="outline" className={difficultyInfo.textColor}>
                      {difficultyInfo.level}
                    </Badge>
                  </div>
                  <Progress value={keyword.difficulty} className="w-20" />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default KeywordDifficultyAnalyzer;
