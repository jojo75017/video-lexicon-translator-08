
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart3, DollarSign, Check } from "lucide-react";
import { KeywordSuggestion } from '@/types/seo/Keyword';

interface KeywordCardProps {
  keywordData: KeywordSuggestion;
  isSelected: boolean;
  onToggleSelection: (keyword: string) => void;
}

const KeywordCard: React.FC<KeywordCardProps> = ({
  keywordData,
  isSelected,
  onToggleSelection
}) => {
  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return 'text-green-600';
    if (difficulty < 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ai-generated': return 'bg-purple-100 text-purple-800';
      case 'long-tail': return 'bg-blue-100 text-blue-800';
      case 'question': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-medium text-sm flex-1 pr-2">
            {keywordData.keyword}
          </h3>
          <Button
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => onToggleSelection(keywordData.keyword)}
            className="h-6 w-6 p-0"
          >
            {isSelected && <Check className="h-3 w-3" />}
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          {keywordData.type && (
            <Badge className={getTypeColor(keywordData.type)} variant="secondary">
              {keywordData.type}
            </Badge>
          )}
          {keywordData.intent && (
            <Badge variant="outline" className="text-xs">
              {keywordData.intent}
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-blue-500" />
            <span>{keywordData.volume?.toLocaleString() || 'N/A'}</span>
          </div>
          <div className={`flex items-center gap-1 ${getDifficultyColor(keywordData.difficulty || 0)}`}>
            <BarChart3 className="h-3 w-3" />
            <span>{keywordData.difficulty || 'N/A'}/100</span>
          </div>
          {keywordData.cpc && (
            <div className="flex items-center gap-1 text-green-600">
              <DollarSign className="h-3 w-3" />
              <span>{keywordData.cpc}€</span>
            </div>
          )}
          {keywordData.opportunity && (
            <div className="flex items-center gap-1 text-purple-600">
              <span className="font-medium">{keywordData.opportunity}%</span>
              <span className="text-gray-500">opp.</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KeywordCard;
