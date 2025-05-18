
import React from 'react';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface KeywordListProps {
  keywords: KeywordSuggestion[];
  selectedKeywords: string[];
  toggleKeywordSelection: (keyword: string) => void;
}

const KeywordList: React.FC<KeywordListProps> = ({
  keywords,
  selectedKeywords,
  toggleKeywordSelection
}) => {
  // Fonction pour formater le volume de recherche
  const formatVolume = (volume?: number) => {
    if (!volume) return 'N/A';
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}k`;
    }
    return volume.toString();
  };

  // Fonction pour obtenir la couleur selon la difficulté
  const getDifficultyColor = (difficulty?: number) => {
    if (!difficulty) return 'bg-gray-100 text-gray-600';
    if (difficulty < 30) return 'bg-green-100 text-green-800';
    if (difficulty < 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-2">
      {keywords.map((keyword, index) => (
        <div 
          key={index}
          className="flex items-center p-3 border rounded-md hover:bg-gray-50 transition-colors"
        >
          <Checkbox 
            id={`keyword-${index}`}
            checked={selectedKeywords.includes(keyword.keyword)}
            onCheckedChange={() => toggleKeywordSelection(keyword.keyword)}
          />
          <label 
            htmlFor={`keyword-${index}`}
            className="ml-3 flex-1 cursor-pointer"
          >
            <div className="font-medium">{keyword.keyword}</div>
            <div className="flex text-xs text-gray-500 gap-2 mt-1">
              <span>Volume: {formatVolume(keyword.searchVolume)}</span>
              {keyword.cpc !== undefined && <span>CPC: {keyword.cpc.toFixed(2)}€</span>}
              {keyword.relevance !== undefined && <span>Pertinence: {keyword.relevance}%</span>}
            </div>
          </label>
          <div>
            <Badge className={getDifficultyColor(keyword.difficulty)}>
              {keyword.difficulty || 'N/A'}
            </Badge>
          </div>
        </div>
      ))}
      
      {keywords.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          Aucun mot-clé disponible.
        </div>
      )}
    </div>
  );
};

export default KeywordList;
