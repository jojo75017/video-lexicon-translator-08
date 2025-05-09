
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface PerformanceScoreProps {
  score: number;
}

const PerformanceScore: React.FC<PerformanceScoreProps> = ({ score }) => {
  const getScoreColorClass = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'Rapide';
    if (score >= 50) return 'Moyen';
    return 'Lent';
  };

  return (
    <>
      <div className={`text-2xl font-bold ${getScoreColorClass()}`}>
        {score.toFixed(0)}/100
        <span className="text-sm font-normal ml-2 text-gray-500">
          ({getScoreLabel()})
        </span>
      </div>
      <Progress value={score} className="h-2 mt-2" />
    </>
  );
};

export default PerformanceScore;
