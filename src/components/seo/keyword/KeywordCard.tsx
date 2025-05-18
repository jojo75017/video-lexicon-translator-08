
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KeywordSuggestion } from '@/types/seo/Keyword';
import { Button } from '@/components/ui/button';
import { Check, PlusCircle, ChevronRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface KeywordCardProps {
  keywordData: KeywordSuggestion;
  isSelected?: boolean;
  onToggleSelection?: (keyword: string) => void;
}

const KeywordCard: React.FC<KeywordCardProps> = ({
  keywordData,
  isSelected = false,
  onToggleSelection
}) => {
  const getDifficultyColor = (difficulty: number | undefined) => {
    if (!difficulty) return "bg-gray-100";
    return difficulty < 30 
      ? "bg-green-500" 
      : difficulty < 70 
        ? "bg-yellow-500" 
        : "bg-red-500";
  };

  const getOpportunityLabel = (score: number | undefined) => {
    if (!score) return "N/A";
    return score > 70 
      ? "Excellente" 
      : score > 40 
        ? "Moyenne" 
        : "Faible";
  };

  const handleToggle = () => {
    if (onToggleSelection) {
      onToggleSelection(keywordData.keyword);
    }
  };

  return (
    <Card className={`overflow-hidden transition-all ${isSelected ? 'border-blue-500 shadow-blue-100 shadow-md' : ''}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium truncate pr-2">{keywordData.keyword}</h3>
          {onToggleSelection && (
            <Button 
              variant={isSelected ? "secondary" : "ghost"} 
              size="sm" 
              onClick={handleToggle}
              className="h-8 w-8 p-0"
            >
              {isSelected ? (
                <Check className="h-4 w-4 text-blue-600" />
              ) : (
                <PlusCircle className="h-4 w-4 text-gray-500" />
              )}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div>
            <span className="text-gray-500 block text-xs">Volume</span>
            <span className="font-medium">{keywordData.volume || 'N/A'}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs">CPC</span>
            <span className="font-medium">{keywordData.cpc ? `${keywordData.cpc.toFixed(2)}€` : 'N/A'}</span>
          </div>
        </div>

        <div className="mb-2">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-gray-500">Difficulté</span>
            <span className="font-medium">{keywordData.difficulty || 'N/A'}</span>
          </div>
          <Progress 
            value={keywordData.difficulty} 
            className="h-1.5"
            indicatorClassName={getDifficultyColor(keywordData.difficulty)}
          />
        </div>

        <div className="mb-3">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-gray-500">Opportunité</span>
            <span className="font-medium">{keywordData.opportunity || 'N/A'}</span>
          </div>
          <Progress 
            value={keywordData.opportunity} 
            className="h-1.5"
            indicatorClassName="bg-blue-500"
          />
        </div>

        {(keywordData.intent || keywordData.type) && (
          <div className="flex flex-wrap gap-1 mt-2">
            {keywordData.intent && (
              <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
                {keywordData.intent}
              </Badge>
            )}
            {keywordData.type && (
              <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 bg-gray-50">
                {keywordData.type}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KeywordCard;
