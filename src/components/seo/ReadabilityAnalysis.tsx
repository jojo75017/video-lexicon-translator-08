
import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookText, Clock, Info } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Tooltip } from '../ui/tooltip';
import { TooltipContent } from '@radix-ui/react-tooltip';
import { TooltipTrigger } from '@radix-ui/react-tooltip';

interface ReadabilityAnalysisProps {
  score: number;
  readingTime: number;
  wordCount: number;
  complexity: number;
}

const ReadabilityAnalysis = ({ score, readingTime, wordCount, complexity }: ReadabilityAnalysisProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <BookText className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Analyse de lisibilité</h3>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Score de lisibilité</span>
            <span className={`font-bold ${getScoreColor(score)}`}>{score}/100</span>
          </div>
          <Progress value={score} className="h-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-gray-600" />
              <span className="font-medium">Temps de lecture</span>
            </div>
            <div className="text-2xl font-bold">{readingTime} min</div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BookText className="h-4 w-4 text-gray-600" />
              <span className="font-medium">Nombre de mots</span>
            </div>
            <div className="text-2xl font-bold">{wordCount}</div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-gray-600" />
              <span className="font-medium">Complexité</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="p-2">Score basé sur la longueur des phrases et la difficulté des mots</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={complexity < 50 ? "default" : "destructive"}>
                {complexity < 50 ? "Simple" : "Complexe"}
              </Badge>
              <span className="text-sm text-gray-600">{complexity}/100</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ReadabilityAnalysis;
