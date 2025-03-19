
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { useTranslation } from 'react-i18next';

interface SeoScoreProps {
  score: number;
}

const SeoScore = ({ score }: SeoScoreProps) => {
  const { t } = useTranslation();
  
  // Détermine la couleur en fonction du score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };
  
  // Détermine la couleur de la progress bar en fonction du score
  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-gradient-to-r from-green-500 to-emerald-600";
    if (score >= 60) return "bg-gradient-to-r from-amber-500 to-orange-600";
    return "bg-gradient-to-r from-red-500 to-rose-600";
  };
  
  // Détermine le message en fonction du score
  const getScoreMessage = (score: number) => {
    if (score >= 80) return t('seo.excellent');
    if (score >= 60) return t('seo.good');
    if (score >= 40) return t('seo.needsImprovement');
    return t('seo.critical');
  };
  
  return (
    <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between mb-3">
        <h2 className="text-xl font-bold text-gray-800">{t('seo.score')}</h2>
        <span className={`text-sm font-medium ${getScoreColor(score)}`}>
          {getScoreMessage(score)}
        </span>
      </div>
      
      <div className="flex items-center gap-4 mb-3">
        <div className="w-full">
          <Progress 
            value={score} 
            className={`h-3 ${getProgressColor(score)}`} 
          />
        </div>
        <div className="shrink-0 w-16 h-16 rounded-full flex items-center justify-center border-4 border-white shadow-md" style={{
          background: score >= 80 ? "linear-gradient(135deg, #10b981, #059669)" : 
                    score >= 60 ? "linear-gradient(135deg, #f59e0b, #d97706)" : 
                    "linear-gradient(135deg, #ef4444, #dc2626)"
        }}>
          <span className="text-white text-xl font-bold">{score}</span>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-md border border-gray-100">
        {score >= 80 
          ? t('seo.excellentDescription') 
          : score >= 60 
          ? t('seo.goodDescription') 
          : t('seo.needsImprovementDescription')}
      </p>
    </div>
  );
};

export default SeoScore;
