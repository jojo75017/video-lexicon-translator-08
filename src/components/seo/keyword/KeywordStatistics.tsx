
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { KeywordSuggestion } from "@/types/seo/Keyword";

interface KeywordStatisticsProps {
  keywords: KeywordSuggestion[];
}

const KeywordStatistics: React.FC<KeywordStatisticsProps> = ({ keywords }) => {
  if (keywords.length === 0) return null;

  const averageVolume = Math.round(keywords.reduce((acc, kw) => acc + kw.volume, 0) / keywords.length);
  const averageDifficulty = Math.round(keywords.reduce((acc, kw) => acc + kw.difficulty, 0) / keywords.length);
  const averageOpportunity = Math.round(keywords.reduce((acc, kw) => acc + (kw.opportunity || 0), 0) / keywords.length);

  const topKeywords = keywords
    .sort((a, b) => (b.opportunity || 0) - (a.opportunity || 0))
    .slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-orange-600" />
          Analyse des Tendances
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <h4 className="font-medium">Volume moyen</h4>
              <p className="text-2xl font-bold text-blue-600">
                {averageVolume.toLocaleString()}
              </p>
            </Card>
            <Card className="p-4 text-center">
              <h4 className="font-medium">Difficulté moyenne</h4>
              <p className="text-2xl font-bold text-yellow-600">
                {averageDifficulty}/100
              </p>
            </Card>
            <Card className="p-4 text-center">
              <h4 className="font-medium">Opportunité moyenne</h4>
              <p className="text-2xl font-bold text-green-600">
                {averageOpportunity}%
              </p>
            </Card>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Top mots-clés par opportunité</h4>
            <div className="space-y-2">
              {topKeywords.map((kw, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{kw.keyword}</span>
                  <Badge className="bg-green-100 text-green-800">
                    {kw.opportunity}% opp.
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KeywordStatistics;
