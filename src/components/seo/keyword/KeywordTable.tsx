
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { KeywordSuggestion } from '@/types/seo';

interface KeywordTableProps {
  keywords: KeywordSuggestion[];
  title: string;
}

const KeywordTable: React.FC<KeywordTableProps> = ({ keywords, title }) => {
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
    <div>
      <h3 className="text-lg font-medium mb-3">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Mot-clé</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Volume</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Difficulté</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">CPC</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Concurrence</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {keywords.map((kw, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium">{kw.keyword}</td>
                <td className="px-4 py-3 text-sm">{kw.volume?.toLocaleString() || kw.searchVolume?.toLocaleString() || 0}</td>
                <td className="px-4 py-3 text-sm">
                  <Badge variant="outline" className={getDifficultyColor(kw.difficulty)}>
                    {kw.difficulty}/100 - {getDifficultyLabel(kw.difficulty)}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm">{kw.cpc?.toLocaleString(undefined, {style: 'currency', currency: 'EUR', minimumFractionDigits: 2})}</td>
                <td className="px-4 py-3 text-sm">{((typeof kw.competition === 'number' ? kw.competition : 0) * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KeywordTable;
