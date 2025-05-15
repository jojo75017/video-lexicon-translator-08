
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { KeywordSuggestion, KeywordIntent } from '@/types/seo';
import { MessageSquare, Search, Link2 } from 'lucide-react';

interface KeywordGroupsProps {
  byIntent: KeywordIntent;
}

const KeywordGroups: React.FC<KeywordGroupsProps> = ({ byIntent }) => {
  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return "bg-green-100 text-green-800 border-green-200";
    if (difficulty < 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };
  
  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty < 30) return "Facile";
    if (difficulty < 60) return "Moyen";
    return "Difficile";
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-blue-100 text-blue-800 p-1 rounded">
            <MessageSquare className="h-4 w-4" />
          </div>
          <h3 className="text-md font-medium">Informationnelle</h3>
        </div>
        <div className="space-y-2">
          {byIntent.informational.map((kw, index) => (
            <div key={index} className="p-3 bg-blue-50 rounded-md border border-blue-100">
              <p className="font-medium text-blue-800">{kw.keyword}</p>
              <div className="flex justify-between mt-2 text-sm text-blue-600">
                <span>{(kw.volume || kw.searchVolume || 0).toLocaleString()}</span>
                <Badge variant="outline" className={getDifficultyColor(kw.difficulty)}>
                  {getDifficultyLabel(kw.difficulty)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-green-100 text-green-800 p-1 rounded">
            <Search className="h-4 w-4" />
          </div>
          <h3 className="text-md font-medium">Transactionnelle</h3>
        </div>
        <div className="space-y-2">
          {byIntent.transactional.map((kw, index) => (
            <div key={index} className="p-3 bg-green-50 rounded-md border border-green-100">
              <p className="font-medium text-green-800">{kw.keyword}</p>
              <div className="flex justify-between mt-2 text-sm text-green-600">
                <span>{(kw.volume || kw.searchVolume || 0).toLocaleString()}</span>
                <Badge variant="outline" className={getDifficultyColor(kw.difficulty)}>
                  {getDifficultyLabel(kw.difficulty)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-purple-100 text-purple-800 p-1 rounded">
            <Link2 className="h-4 w-4" />
          </div>
          <h3 className="text-md font-medium">Navigationnelle</h3>
        </div>
        <div className="space-y-2">
          {byIntent.navigational.map((kw, index) => (
            <div key={index} className="p-3 bg-purple-50 rounded-md border border-purple-100">
              <p className="font-medium text-purple-800">{kw.keyword}</p>
              <div className="flex justify-between mt-2 text-sm text-purple-600">
                <span>{(kw.volume || kw.searchVolume || 0).toLocaleString()}</span>
                <Badge variant="outline" className={getDifficultyColor(kw.difficulty)}>
                  {getDifficultyLabel(kw.difficulty)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeywordGroups;
