
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KeywordSuggestion } from "@/types/seo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessagesSquare, TrendingUp, BarChart2, Users, ArrowRight } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface KeywordStepProps {
  selectedKeyword: string;
  keywords: KeywordSuggestion[];
  onKeywordChange: (value: string) => void;
  onQuoraClick?: () => void;
}

const KeywordStep: React.FC<KeywordStepProps> = ({
  selectedKeyword,
  keywords,
  onKeywordChange,
  onQuoraClick,
}) => {
  // Données simulées pour les tendances mensuelles
  const trendData = [
    { month: 'Jan', volume: 1200 },
    { month: 'Fév', volume: 1400 },
    { month: 'Mar', volume: 1100 },
    { month: 'Avr', volume: 1600 },
    { month: 'Mai', volume: 2000 },
    { month: 'Jun', volume: 1800 },
  ];

  const selectedKeywordData = keywords.find(kw => kw.keyword === selectedKeyword);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold">Recherche de mots-clés rentables</Label>
        {onQuoraClick && (
          <Button
            onClick={onQuoraClick}
            className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white border-none gap-2 shadow-md transition-all duration-200 hover:scale-105"
          >
            <MessagesSquare className="h-4 w-4" />
            Réponses Quora
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-4">
          <Label>Sélectionnez un mot-clé</Label>
          <Select value={selectedKeyword} onValueChange={onKeywordChange}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Choisissez un mot-clé" />
            </SelectTrigger>
            <SelectContent>
              {keywords.map((kw, index) => (
                <SelectItem key={index} value={kw.keyword}>
                  {kw.keyword} (Volume: {kw.searchVolume || 0})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedKeywordData && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">Volume</span>
                  </div>
                  <p className="text-lg font-semibold text-blue-900">
                    {selectedKeywordData.searchVolume}
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
                    {selectedKeywordData.difficulty}/100
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ArrowRight className="h-4 w-4" />
                {selectedKeywordData.difficulty < 30 ? (
                  <span className="text-green-600 font-medium">Facile à classer</span>
                ) : selectedKeywordData.difficulty < 60 ? (
                  <span className="text-yellow-600 font-medium">Difficulté moyenne</span>
                ) : (
                  <span className="text-red-600 font-medium">Très compétitif</span>
                )}
              </div>
            </div>
          )}
        </Card>

        <Card className="p-4">
          <Label>Évolution du volume de recherche</Label>
          <div className="h-[200px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default KeywordStep;
