
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SeoChecklistItem from './SeoChecklistItem';
import { SeoAnalysis } from '@/types/seo';

interface SeoHealthCheckProps {
  seoAnalysis: SeoAnalysis;
}

const SeoHealthCheck: React.FC<SeoHealthCheckProps> = ({ seoAnalysis }) => {
  const { t } = useTranslation();
  
  // Calculer le score global à partir des différentes métriques
  const calculateScore = () => {
    let score = 70; // Score de base
    
    // Facteurs positifs
    if (seoAnalysis.h1Count === 1) score += 5;
    if (seoAnalysis.description && seoAnalysis.description.length > 50) score += 5;
    if (seoAnalysis.keywords && seoAnalysis.keywords.length > 0) score += 3;
    if (seoAnalysis.internalLinks && seoAnalysis.internalLinks > 3) score += 3;
    if (seoAnalysis.wordCount && seoAnalysis.wordCount > 300) score += 5;
    if (seoAnalysis.performance?.loadTime && seoAnalysis.performance.loadTime < 2000) score += 5;
    if (seoAnalysis.metaTagsAnalysis?.hasOpenGraphTags) score += 2;
    
    // Facteurs négatifs
    if (!seoAnalysis.description) score -= 10;
    if (!seoAnalysis.h1Count || seoAnalysis.h1Count !== 1) score -= 8;
    if (seoAnalysis.imgWithoutAlt && seoAnalysis.imgWithoutAlt > 0) score -= 5;
    if (seoAnalysis.performance?.loadTime && seoAnalysis.performance.loadTime > 3000) score -= 8;
    if (seoAnalysis.brokenLinks && seoAnalysis.brokenLinks.length > 0) score -= 10;
    
    // Limiter le score entre 0 et 100
    return Math.max(0, Math.min(100, score));
  };
  
  const score = calculateScore();
  
  // Générer des éléments de checklist basés sur l'analyse
  const getChecklistItems = () => {
    const items = [];
    
    // Balise titre
    items.push({
      title: t('seo.title'),
      status: seoAnalysis.title ? 'success' : 'error',
      description: seoAnalysis.title || t('seo.notDefined_female'),
      advice: !seoAnalysis.title ? t('seo.advice.addTitle') : undefined
    });
    
    // Description meta
    items.push({
      title: t('seo.description'),
      status: seoAnalysis.description ? 
        (seoAnalysis.description.length > 50 ? 'success' : 'warning') : 
        'error',
      description: seoAnalysis.description || t('seo.notDefined_female'),
      advice: !seoAnalysis.description ? 
        t('seo.advice.addDescription') : 
        (seoAnalysis.description.length < 50 ? t('seo.advice.extendDescription') : undefined)
    });
    
    // Structure des titres
    items.push({
      title: t('seo.headingStructure'),
      status: seoAnalysis.h1Count === 1 ? 'success' : 'error',
      description: `H1: ${seoAnalysis.h1Count || 0}, H2: ${seoAnalysis.h2Count || 0}, H3: ${seoAnalysis.h3Count || 0}`,
      advice: seoAnalysis.h1Count !== 1 ? t('seo.advice.fixH1') : undefined,
      priority: seoAnalysis.h1Count !== 1 ? 'high' : undefined
    });
    
    // Images sans attribut alt
    if (seoAnalysis.imgCount) {
      items.push({
        title: t('seo.imageAlt'),
        status: seoAnalysis.imgWithoutAlt && seoAnalysis.imgWithoutAlt > 0 ? 'warning' : 'success',
        description: seoAnalysis.imgWithoutAlt ? 
          `${seoAnalysis.imgWithoutAlt} ${t('seo.imagesWithoutAlt')} / ${seoAnalysis.imgCount}` :
          t('seo.allImagesHaveAlt'),
        advice: seoAnalysis.imgWithoutAlt && seoAnalysis.imgWithoutAlt > 0 ? 
          t('seo.advice.addAltTags') : undefined,
        priority: 'medium'
      });
    }
    
    // Temps de chargement
    if (seoAnalysis.performance?.loadTime) {
      items.push({
        title: t('performance.loadTime'),
        status: seoAnalysis.performance.loadTime < 2000 ? 'success' : 
                seoAnalysis.performance.loadTime < 3000 ? 'warning' : 
                'error',
        value: `${(seoAnalysis.performance.loadTime / 1000).toFixed(2)}s`,
        advice: seoAnalysis.performance.loadTime > 2000 ? 
          t('seo.advice.improveLoadTime') : undefined,
        priority: seoAnalysis.performance.loadTime > 3000 ? 'high' : 'medium',
        impact: seoAnalysis.performance.loadTime > 3000 ? 85 : 60
      });
    }
    
    return items;
  };
  
  const checklistItems = getChecklistItems();
  
  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };
  
  const getScoreIcon = () => {
    if (score >= 80) return <CheckCircle className="h-6 w-6 text-green-500" />;
    if (score >= 60) return <AlertTriangle className="h-6 w-6 text-orange-500" />;
    return <XCircle className="h-6 w-6 text-red-500" />;
  };
  
  const getProgressColor = () => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t('seo.healthCheck', 'Vérification de santé SEO')}</span>
          <div className="flex items-center gap-2">
            {getScoreIcon()}
            <span className={`font-bold text-2xl ${getScoreColor()}`}>{score}/100</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Progress
          value={score}
          className="h-2 mb-6"
          indicatorClassName={getProgressColor()}
        />
        
        <div className="space-y-4 mt-4">
          {checklistItems.map((item, index) => (
            <SeoChecklistItem
              key={index}
              title={item.title}
              status={item.status}
              description={item.description}
              advice={item.advice}
              value={item.value}
              priority={item.priority}
              impact={item.impact}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SeoHealthCheck;
