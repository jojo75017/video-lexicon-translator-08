
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from 'lucide-react';

interface PerformanceScoreProps {
  score: number;
}

const PerformanceScore: React.FC<PerformanceScoreProps> = ({ score }) => {
  const getScoreColorClass = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColorClass = () => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 50) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const getScoreLabel = () => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Très Rapide';
    if (score >= 65) return 'Rapide';
    if (score >= 50) return 'Moyen';
    return 'Lent';
  };

  return (
    <div className="relative">
      <div className={`text-2xl font-bold ${getScoreColorClass()}`}>
        {score.toFixed(0)}/100
        <span className="text-sm font-normal ml-2 text-gray-500">
          ({getScoreLabel()})
        </span>
        
        {score >= 90 && (
          <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">
            <Sparkles className="h-3 w-3 mr-1" />
            Optimisé
          </Badge>
        )}
      </div>
      <Progress value={score} className={`h-2.5 mt-2 ${getProgressColorClass()} bg-opacity-20`} />
      
      {score <= 49 && (
        <div className="mt-2 text-xs text-red-600 italic">
          Votre site est significativement plus lent que 75% des sites web analysés.
        </div>
      )}
      
      {score >= 90 && (
        <div className="mt-2 text-xs text-green-600 italic">
          Votre site est plus rapide que 90% des sites web analysés.
        </div>
      )}
    </div>
  );
};

export default PerformanceScore;
