
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, Target } from "lucide-react";

interface Keyword {
  keyword: string;
  position: number;
  volume: number;
  difficulty: number;
  url: string;
}

interface OrganicSearchProps {
  keywords: Keyword[];
  totalKeywords: number;
  averagePosition: number;
  visibility: number;
}

const OrganicSearch: React.FC<OrganicSearchProps> = ({
  keywords = [],
  totalKeywords = 0,
  averagePosition = 0,
  visibility = 0
}) => {
  const getPositionVariant = (position: number) => {
    if (position <= 3) return "default";
    if (position <= 10) return "secondary";
    return "outline";
  };

  const getPositionColor = (position: number) => {
    if (position <= 3) return "text-green-600";
    if (position <= 10) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-blue-600" />
          Recherche organique
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">Mots-clés totaux</p>
                <p className="text-2xl font-bold text-blue-900">{totalKeywords}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Position moyenne</p>
                <p className="text-2xl font-bold text-green-900">{averagePosition.toFixed(1)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700">Visibilité</p>
                <p className="text-2xl font-bold text-purple-900">{visibility.toFixed(1)}%</p>
              </div>
              <Search className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Top mots-clés</h4>
          <div className="space-y-2">
            {keywords.slice(0, 10).map((keyword, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{keyword.keyword}</div>
                  <div className="text-sm text-gray-600">{keyword.url}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Volume</div>
                    <div className="font-medium">{keyword.volume}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Difficulté</div>
                    <div className="font-medium">{keyword.difficulty}%</div>
                  </div>
                  <Badge variant={getPositionVariant(keyword.position)}>
                    <span className={getPositionColor(keyword.position)}>
                      #{keyword.position}
                    </span>
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganicSearch;
