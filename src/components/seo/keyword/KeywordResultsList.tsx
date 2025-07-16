
import React from 'react';
import { Card } from '@/components/ui/card';
import { KeywordSuggestion } from '@/types/seo/Keyword';
import { Badge } from '@/components/ui/badge';
import { Loader2, BarChart, TrendingUp } from 'lucide-react';

interface KeywordResultsListProps {
  keywords: KeywordSuggestion[];
  isLoading: boolean;
}

const KeywordResultsList: React.FC<KeywordResultsListProps> = ({ 
  keywords, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <Card className="p-6 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <p className="ml-3 text-gray-500">Génération des mots-clés...</p>
      </Card>
    );
  }

  const getDifficultyColor = (difficulty: number | undefined) => {
    if (!difficulty) return "bg-gray-100 text-gray-700";
    if (difficulty < 30) return "bg-green-100 text-green-800";
    if (difficulty < 60) return "bg-amber-100 text-amber-800";
    return "bg-red-100 text-red-800";
  };

  const getVolumeDisplay = (volume: number | undefined) => {
    if (!volume) return "N/A";
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}k`;
    return volume.toString();
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
        Suggestions de mots-clés ({keywords.length})
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Mot-clé</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                <div className="flex items-center">
                  <BarChart className="h-4 w-4 mr-1" />
                  <span>Volume</span>
                </div>
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Difficulté</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">CPC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {keywords.map((kw, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-3 px-4 text-sm">
                  <div className="font-medium">{kw.keyword}</div>
                </td>
                <td className="py-3 px-4 text-sm">
                  {getVolumeDisplay(kw.volume)}
                </td>
                <td className="py-3 px-4 text-sm">
                  <Badge className={`${getDifficultyColor(kw.difficulty)}`}>
                    {kw.difficulty || "N/A"}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-sm">
                  {kw.cpc ? `${kw.cpc}€` : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {keywords.length > 0 && (
        <div className="mt-4 text-xs text-gray-500">
          <p>Ces suggestions sont basées sur votre mot-clé de recherche. 
          Le volume représente les recherches mensuelles estimées.</p>
        </div>
      )}
    </Card>
  );
};

export default KeywordResultsList;
