
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { KeywordSuggestion } from '@/types/seo/Keyword';

interface KeywordListProps {
  keywords: KeywordSuggestion[];
  selectedKeywords: string[];
  onToggleSelection: (keyword: string) => void;
}

const KeywordList: React.FC<KeywordListProps> = ({ 
  keywords, 
  selectedKeywords, 
  onToggleSelection 
}) => {
  if (!keywords || keywords.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">Aucun mot-clé trouvé</p>
      </Card>
    );
  }

  const getTrendIcon = (trend: string) => {
    switch (trend?.toLowerCase()) {
      case 'up':
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
      case 'decreasing':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
      case 'facile':
        return 'bg-green-100 text-green-800';
      case 'medium':
      case 'moyen':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
      case 'difficile':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {keywords.map((keyword, index) => (
        <Card key={index} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <Checkbox
                id={`keyword-${index}`}
                checked={selectedKeywords.includes(keyword.keyword)}
                onCheckedChange={() => onToggleSelection(keyword.keyword)}
                className="mt-1"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <label 
                    htmlFor={`keyword-${index}`}
                    className="font-medium text-gray-900 cursor-pointer truncate"
                  >
                    {keyword.keyword}
                  </label>
                  {keyword.trend && getTrendIcon(keyword.trend)}
                </div>
                
                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                  {keyword.volume && (
                    <span className="bg-blue-50 px-2 py-1 rounded text-blue-700">
                      Vol: {typeof keyword.volume === 'number' ? keyword.volume.toLocaleString() : keyword.volume}
                    </span>
                  )}
                  
                  {keyword.difficulty && (
                    <Badge className={getDifficultyColor(keyword.difficulty)}>
                      {keyword.difficulty}
                    </Badge>
                  )}
                  
                  {keyword.cpc && (
                    <span className="bg-green-50 px-2 py-1 rounded text-green-700">
                      CPC: {typeof keyword.cpc === 'number' ? keyword.cpc.toFixed(2) : keyword.cpc}
                    </span>
                  )}
                  
                  {keyword.competition && (
                    <span className="bg-purple-50 px-2 py-1 rounded text-purple-700">
                      Concurrence: {typeof keyword.competition === 'number' ? (keyword.competition * 100).toFixed(0) + '%' : keyword.competition}
                    </span>
                  )}
                </div>
                
                {keyword.intent && (
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      {keyword.intent}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default KeywordList;
