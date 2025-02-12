
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { useTranslation } from 'react-i18next';

interface SeoScoreProps {
  score: number;
}

const SeoScore = ({ score }: SeoScoreProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-2">{t('seo.score')}</h2>
      <div className="flex items-center gap-4">
        <Progress value={score} className="w-full" />
        <span className="text-xl font-bold">{score}%</span>
      </div>
    </div>
  );
};

export default SeoScore;
