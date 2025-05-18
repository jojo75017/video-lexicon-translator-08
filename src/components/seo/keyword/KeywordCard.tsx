
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { KeywordSuggestion } from '@/types/seo/Keyword';
import { Info, TrendingUp, BarChart3, Target, MessageSquare } from 'lucide-react';

interface KeywordCardProps {
  keywordData: KeywordSuggestion;
  isSelected?: boolean;
  onToggleSelection: (keyword: string) => void;
  showDetails?: boolean;
}

const KeywordCard: React.FC<KeywordCardProps> = ({ 
  keywordData, 
  isSelected = false, 
  onToggleSelection,
  showDetails = false
}) => {
  // Fonction pour formater les nombres
  const formatNumber = (num?: number) => {
    if (num === undefined) return 'N/A';
    return new Intl.NumberFormat().format(num);
  };
  
  // Détermine la couleur de badge pour la difficulté
  const getDifficultyBadge = () => {
    const difficulty = keywordData.difficulty || 0;
    if (difficulty < 30) return "bg-green-100 text-green-800 border-green-200";
    if (difficulty < 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };
  
  // Détermine le texte pour la difficulté
  const getDifficultyText = () => {
    const difficulty = keywordData.difficulty || 0;
    if (difficulty < 30) return "Facile";
    if (difficulty < 60) return "Modéré";
    return "Difficile";
  };
  
  // Détermine la couleur de badge pour le volume
  const getVolumeBadge = () => {
    const volume = keywordData.volume || 0;
    if (volume < 500) return "bg-gray-100 text-gray-800 border-gray-200";
    if (volume < 2000) return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-indigo-100 text-indigo-800 border-indigo-200";
  };
  
  // Détermine la couleur de badge pour le CPC
  const getCpcBadge = () => {
    const cpc = keywordData.cpc || 0;
    if (cpc < 0.5) return "bg-gray-100 text-gray-800 border-gray-200";
    if (cpc < 1.5) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    return "bg-purple-100 text-purple-800 border-purple-200";
  };

  return (
    <Card 
      className={`p-3 transition-colors cursor-pointer hover:bg-slate-50 ${isSelected ? 'border-blue-400 bg-blue-50' : ''}`}
      onClick={() => onToggleSelection(keywordData.keyword)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className={`font-medium text-sm ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
          {keywordData.keyword}
        </h3>
        <div className="flex gap-1">
          {keywordData.difficulty !== undefined && (
            <Badge variant="outline" className={getDifficultyBadge()}>
              {getDifficultyText()}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-3 text-xs text-gray-600">
        {keywordData.volume !== undefined && (
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>Vol: {formatNumber(keywordData.volume)}</span>
          </div>
        )}
        
        {keywordData.difficulty !== undefined && (
          <div className="flex items-center gap-1">
            <BarChart3 className="h-3 w-3" />
            <span>Diff: {keywordData.difficulty}/100</span>
          </div>
        )}
        
        {keywordData.cpc !== undefined && (
          <div className="flex items-center gap-1">
            <Info className="h-3 w-3" />
            <span>CPC: {keywordData.cpc.toFixed(2)}€</span>
          </div>
        )}
        
        {keywordData.competition !== undefined && (
          <div className="flex items-center gap-1">
            <Info className="h-3 w-3" />
            <span>Comp: {Math.round(keywordData.competition * 100)}%</span>
          </div>
        )}
      </div>
      
      {showDetails && (
        <>
          <div className="mb-2">
            <div className="flex justify-between items-center text-xs mb-1">
              <span>Difficulté</span>
              <span className={keywordData.difficulty && keywordData.difficulty > 70 ? "text-red-600" : keywordData.difficulty && keywordData.difficulty > 40 ? "text-yellow-600" : "text-green-600"}>
                {keywordData.difficulty}/100
              </span>
            </div>
            <Progress 
              value={keywordData.difficulty || 0} 
              className="h-1.5 bg-gray-100"
              aria-label="Difficulté du mot-clé"
            />
          </div>
          
          <div className="mb-3">
            <div className="flex justify-between items-center text-xs mb-1">
              <span>Opportunité</span>
              <span className="text-blue-600">
                {keywordData.opportunity || Math.floor(Math.random() * 30) + 50}/100
              </span>
            </div>
            <Progress 
              value={keywordData.opportunity || Math.floor(Math.random() * 30) + 50} 
              className="h-1.5 bg-gray-100"
              aria-label="Opportunité du mot-clé"
            />
          </div>
          
          {(keywordData.intent || keywordData.type) && (
            <div className="flex gap-1 mt-2">
              {keywordData.intent && (
                <Badge variant="outline" className="text-[9px]">
                  {keywordData.intent}
                </Badge>
              )}
              
              {keywordData.type && (
                <Badge variant="outline" className="text-[9px]">
                  {keywordData.type}
                </Badge>
              )}
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default KeywordCard;
