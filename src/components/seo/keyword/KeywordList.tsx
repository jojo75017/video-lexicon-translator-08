
import React from 'react';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';

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
  
  // Fonction pour obtenir la couleur selon le volume
  const getVolumeColor = (volume?: number) => {
    if (!volume) return 'text-gray-500';
    if (volume >= 5000) return 'text-green-600 font-semibold';
    if (volume >= 1000) return 'text-blue-600';
    if (volume >= 500) return 'text-amber-600';
    return 'text-gray-600';
  };
  
  // Fonction pour afficher la position du mot-clé
  const renderPosition = (position?: number) => {
    if (!position) return null;
    
    const positionColor = position <= 10 ? 'text-green-600' : 
                          position <= 30 ? 'text-amber-600' : 
                          'text-gray-600';
    
    return (
      <div className={`flex items-center ${positionColor} text-xs font-medium`}>
        {position <= 10 ? (
          <ArrowUp className="h-3 w-3 mr-1" />
        ) : position > 30 ? (
          <ArrowDown className="h-3 w-3 mr-1" />
        ) : null}
        <span>Position: {position}</span>
      </div>
    );
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
            <div className="flex flex-wrap text-xs gap-2 mt-1">
              <span className={getVolumeColor(keyword.volume)}>
                <TrendingUp className="h-3 w-3 inline mr-1" />
                Volume: {formatVolume(keyword.volume)}
              </span>
              {keyword.cpc !== undefined && (
                <span className="text-gray-600">
                  CPC: {keyword.cpc.toFixed(2)}€
                </span>
              )}
              {keyword.relevance !== undefined && (
                <span className="text-gray-600">
                  Pertinence: {keyword.relevance}%
                </span>
              )}
              {renderPosition(keyword.position)}
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
