
import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SeoChecklistItem from './SeoChecklistItem';
import { SeoAnalysis } from '@/types/seo';

interface SeoHealthCheckProps {
  seoAnalysis: SeoAnalysis;
}

const SeoHealthCheck: React.FC<SeoHealthCheckProps> = ({ seoAnalysis }) => {
  const { t } = useTranslation();

  // Calculate overall health score based on various metrics
  const calculateHealthScore = () => {
    let score = 70; // Base score
    
    // Title optimization
    if (!seoAnalysis.title) score -= 10;
    else if (seoAnalysis.title.length < 10) score -= 5;
    else if (seoAnalysis.title.length > 60) score -= 3;
    
    // Description optimization
    if (!seoAnalysis.description) score -= 10;
    else if (seoAnalysis.description.length < 70) score -= 5;
    else if (seoAnalysis.description.length > 160) score -= 3;
    
    // Heading structure
    if (seoAnalysis.h1Count !== 1) score -= 8;
    if (seoAnalysis.h2Count < 2) score -= 3;
    
    // Image optimization
    if (seoAnalysis.imgWithoutAlt > 0) {
      const penaltyPerImg = Math.min(2, seoAnalysis.imgWithoutAlt);
      score -= penaltyPerImg;
    }
    
    // Load time penalty for slow sites
    if (seoAnalysis.performance?.loadTime && seoAnalysis.performance.loadTime > 3000) {
      const loadTimePenalty = Math.min(10, Math.floor((seoAnalysis.performance.loadTime - 3000) / 500));
      score -= loadTimePenalty;
    }
    
    // Bonus for social tags
    if (seoAnalysis.socialTags?.ogTitle && 
        seoAnalysis.socialTags?.ogDescription && 
        seoAnalysis.socialTags?.ogImage) {
      score += 5;
    }
    
    // Ensure score is between 0-100
    return Math.max(0, Math.min(100, score));
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };
  
  const getScoreText = (score: number) => {
    if (score >= 80) return t('seo.excellent');
    if (score >= 60) return t('seo.improvementPossible');
    return t('seo.needsAttention');
  };
  
  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-6 w-6 text-green-500" />;
    if (score >= 60) return <AlertTriangle className="h-6 w-6 text-amber-500" />;
    return <XCircle className="h-6 w-6 text-red-500" />;
  };
  
  const healthScore = calculateHealthScore();
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{t('seo.healthCheck')}</h3>
        <div className="flex items-center gap-2">
          {getScoreIcon(healthScore)}
          <span className={`font-bold text-xl ${getScoreColor(healthScore)}`}>{healthScore}%</span>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>{getScoreText(healthScore)}</span>
          <span className={getScoreColor(healthScore)}>{healthScore}/100</span>
        </div>
        <Progress 
          value={healthScore} 
          className={`h-2.5 ${
            healthScore >= 80 ? 'bg-green-100' : 
            healthScore >= 60 ? 'bg-amber-100' : 
            'bg-red-100'
          }`}
        />
      </div>
      
      <div className="space-y-4">
        {/* Title Check */}
        <SeoChecklistItem
          title={t('seo.title')}
          status={seoAnalysis.title ? 'success' : 'error'}
          description={seoAnalysis.title || t('seo.notDefined_female')}
          value={seoAnalysis.title ? `${seoAnalysis.title.length} ${t('seo.characters', 'caractères')}` : null}
          advice={!seoAnalysis.title ? t('seo.advice.addTitle') : 
                 seoAnalysis.title.length > 60 ? t('seo.advice.shortenTitle', 'Raccourcissez votre titre à moins de 60 caractères') : null}
          priority={!seoAnalysis.title ? 'high' : seoAnalysis.title.length > 60 ? 'medium' : 'low'}
          impact={!seoAnalysis.title ? 85 : seoAnalysis.title.length > 60 ? 60 : 0}
        />
        
        {/* Description Check */}
        <SeoChecklistItem
          title={t('seo.description')}
          status={seoAnalysis.description ? (seoAnalysis.description.length < 70 ? 'warning' : 'success') : 'error'}
          description={seoAnalysis.description || t('seo.notDefined_female')}
          value={seoAnalysis.description ? `${seoAnalysis.description.length} ${t('seo.characters', 'caractères')}` : null}
          advice={!seoAnalysis.description ? t('seo.advice.addDescription') : 
                 seoAnalysis.description.length < 70 ? t('seo.advice.extendDescription') : null}
          priority={!seoAnalysis.description ? 'high' : seoAnalysis.description.length < 70 ? 'medium' : 'low'}
          impact={!seoAnalysis.description ? 75 : seoAnalysis.description.length < 70 ? 50 : 0}
        />
        
        {/* Heading Structure Check */}
        <SeoChecklistItem
          title={t('seo.headingStructure')}
          status={seoAnalysis.h1Count === 1 ? 'success' : 'error'}
          description={seoAnalysis.h1Count === 0 ? 
            t('seo.missingH1Element', 'Il manque un élément H1 principal') : 
            seoAnalysis.h1Count > 1 ? 
              t('seo.multipleH1Elements', 'Plusieurs éléments H1 détectés') : 
              t('seo.goodHeadingStructure', 'Bonne structure de titres')}
          value={`H1: ${seoAnalysis.h1Count}, H2: ${seoAnalysis.h2Count}, H3+: ${seoAnalysis.h3Count || 0}`}
          advice={seoAnalysis.h1Count !== 1 ? t('seo.advice.fixH1') : null}
          priority={seoAnalysis.h1Count !== 1 ? 'high' : 'low'}
          impact={seoAnalysis.h1Count !== 1 ? 70 : 0}
        />
        
        {/* Image Alt Tags Check */}
        <SeoChecklistItem
          title={t('seo.imageAlt')}
          status={seoAnalysis.imgWithoutAlt > 0 ? 'warning' : 'success'}
          description={seoAnalysis.imgWithoutAlt > 0 ? 
            `${seoAnalysis.imgWithoutAlt} ${t('seo.imagesWithoutAlt')}` : 
            t('seo.allImagesHaveAlt')}
          advice={seoAnalysis.imgWithoutAlt > 0 ? t('seo.advice.addAltTags') : null}
          priority={seoAnalysis.imgWithoutAlt > 3 ? 'high' : seoAnalysis.imgWithoutAlt > 0 ? 'medium' : 'low'}
          impact={seoAnalysis.imgWithoutAlt > 3 ? 65 : seoAnalysis.imgWithoutAlt > 0 ? 40 : 0}
        />
        
        {/* Page Speed Check */}
        {seoAnalysis.performance?.loadTime && (
          <SeoChecklistItem
            title={t('performance.loadTime')}
            status={
              seoAnalysis.performance.loadTime < 1500 ? 'success' : 
              seoAnalysis.performance.loadTime < 3000 ? 'warning' : 'error'
            }
            description={
              seoAnalysis.performance.loadTime < 1500 ? 
                t('performance.fastLoadTime', 'Temps de chargement rapide') : 
                seoAnalysis.performance.loadTime < 3000 ? 
                  t('performance.averageLoadTime', 'Temps de chargement moyen') : 
                  t('performance.slowLoadTime', 'Temps de chargement lent')
            }
            value={`${(seoAnalysis.performance.loadTime / 1000).toFixed(2)}s`}
            advice={seoAnalysis.performance.loadTime >= 3000 ? t('seo.advice.improveLoadTime') : null}
            priority={
              seoAnalysis.performance.loadTime >= 4000 ? 'high' : 
              seoAnalysis.performance.loadTime >= 3000 ? 'medium' : 'low'
            }
            impact={
              seoAnalysis.performance.loadTime >= 4000 ? 75 : 
              seoAnalysis.performance.loadTime >= 3000 ? 55 : 0
            }
          />
        )}
      </div>
    </Card>
  );
};

export default SeoHealthCheck;
