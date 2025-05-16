
import React from 'react';
import { Card } from "@/components/ui/card";
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
  return (
    <Card 
      className={`p-4 cursor-pointer transition-all ${
        isSelected ? "border-blue-500 bg-blue-50" : "hover:border-gray-400"
      }`}
      onClick={() => onToggleSelection(keywordData.keyword)}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-blue-900">{keywordData.keyword}</h3>
        {isSelected && <div className="w-4 h-4 bg-blue-500 rounded-full"></div>}
      </div>
      
      <div className="grid grid-cols-4 gap-2 text-xs">
        <div>
          <p className="text-gray-500">Volume</p>
          <p className="font-semibold">{keywordData.volume}</p>
        </div>
        <div>
          <p className="text-gray-500">Difficulté</p>
          <div className="flex items-center gap-1">
            <div className="w-10 bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  keywordData.difficulty < 30 ? "bg-green-500" : 
                  keywordData.difficulty < 60 ? "bg-yellow-500" : "bg-red-500"
                }`} 
                style={{width: `${keywordData.difficulty}%`}}
              ></div>
            </div>
            <span>{keywordData.difficulty}</span>
          </div>
        </div>
        <div>
          <p className="text-gray-500">CPC</p>
          <p className="font-semibold">{keywordData.cpc.toFixed(2)} €</p>
        </div>
        <div>
          <p className="text-gray-500">Compétition</p>
          <div className="flex items-center gap-1">
            <div className="w-10 bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full rounded-full" 
                style={{width: `${keywordData.competition * 100}%`}}
              ></div>
            </div>
            <span>{Math.round(keywordData.competition * 100)}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default KeywordCard;
