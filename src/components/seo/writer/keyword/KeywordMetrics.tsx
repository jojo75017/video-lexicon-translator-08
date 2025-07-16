
import React from 'react';
import { Users, TrendingUp, BarChart2, ArrowRight } from 'lucide-react';
import { KeywordSuggestion } from "@/types/seo";

interface KeywordMetricsProps {
  keywordData: KeywordSuggestion;
}

const KeywordMetrics: React.FC<KeywordMetricsProps> = ({ keywordData }) => {
  return (
    <div className="mt-4 space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">Volume</span>
          </div>
          <p className="text-lg font-semibold text-blue-900">
            {keywordData.searchVolume}
          </p>
        </div>

        <div className="p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">Tendance</span>
          </div>
          <p className="text-lg font-semibold text-green-900">
            +{Math.floor(Math.random() * 30)}%
          </p>
        </div>

        <div className="p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-2 text-purple-600 mb-1">
            <BarChart2 className="h-4 w-4" />
            <span className="text-sm font-medium">Difficulté</span>
          </div>
          <p className="text-lg font-semibold text-purple-900">
            {keywordData.difficulty}/100
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <ArrowRight className="h-4 w-4" />
        {keywordData.difficulty < 30 ? (
          <span className="text-green-600 font-medium">Facile à classer</span>
        ) : keywordData.difficulty < 60 ? (
          <span className="text-yellow-600 font-medium">Difficulté moyenne</span>
        ) : (
          <span className="text-red-600 font-medium">Très compétitif</span>
        )}
      </div>
    </div>
  );
};

export default KeywordMetrics;
