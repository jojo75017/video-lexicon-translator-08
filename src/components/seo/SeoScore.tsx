
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
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Bon";
    if (score >= 40) return "Amélioration nécessaire";
    return "Critique";
  };
  
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-1">
        <h2 className="text-lg font-semibold text-gray-800">{t('seo.score')}</h2>
        <span className={`text-sm font-medium ${getScoreColor(score)}`}>
          {getScoreMessage(score)}
        </span>
      </div>
      
      <div className="flex items-center gap-4 mb-1">
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getProgressColor(score)} transition-all duration-500 ease-out`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
        <div className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm" style={{
          background: score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444"
        }}>
          <span className="text-white text-lg font-bold">{score}</span>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 mt-1">
        {score >= 80 
          ? "Votre site est bien optimisé pour les moteurs de recherche." 
          : score >= 60 
          ? "Votre site a un bon potentiel, mais peut être amélioré." 
          : "Votre site nécessite des améliorations significatives."}
      </p>
    </div>
  );
};

export default SeoScore;
