
import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { SeoAnalysis } from '@/types/seo';
import SeoOverview from './seo/SeoOverview';
import SearchTrends from './seo/SearchTrends';
import DetailedMetrics from './seo/DetailedMetrics';
import SiteComparison from './seo/SiteComparison';
import AnalyticsOverview from './seo/AnalyticsOverview';
import LoadingSpeedAnalysis from './seo/LoadingSpeedAnalysis';

interface SeoResultsProps {
  seoAnalysis: SeoAnalysis;
}

const SeoResults = ({ seoAnalysis }: SeoResultsProps) => {
  const [showAllMetrics, setShowAllMetrics] = useState(false);
  const [comparisonSite, setComparisonSite] = useState<{url: string; analysis: SeoAnalysis} | undefined>();
  
  const calculateSeoScore = () => {
    let score = 100;
    if (!seoAnalysis.title) score -= 20;
    else if (seoAnalysis.title.length < 30 || seoAnalysis.title.length > 60) score -= 10;
    if (!seoAnalysis.description) score -= 20;
    else if (seoAnalysis.description.length < 120 || seoAnalysis.description.length > 160) score -= 10;
    if (!seoAnalysis.keywords || seoAnalysis.keywords.length === 0) score -= 15;
    if (seoAnalysis.brokenLinks.length > 0) score -= (seoAnalysis.brokenLinks.length * 5);
    if (!seoAnalysis.socialTags.ogTitle || !seoAnalysis.socialTags.ogDescription) score -= 10;
    const imagesWithoutAlt = seoAnalysis.imagesDetails.filter(img => !img.hasAlt).length;
    if (imagesWithoutAlt > 0) score -= (imagesWithoutAlt * 5);
    return Math.max(0, score);
  };

  const getSeoSuggestions = () => {
    const suggestions = [];
    if (!seoAnalysis.title) {
      suggestions.push('Le titre de la page est manquant');
    } else if (seoAnalysis.title.length < 30) {
      suggestions.push('Le titre de la page est trop court');
    } else if (seoAnalysis.title.length > 60) {
      suggestions.push('Le titre de la page est trop long');
    }
    if (!seoAnalysis.description) {
      suggestions.push('La description meta est manquante');
    } else if (seoAnalysis.description.length < 120) {
      suggestions.push('La description meta est trop courte');
    } else if (seoAnalysis.description.length > 160) {
      suggestions.push('La description meta est trop longue');
    }
    if (!seoAnalysis.keywords || seoAnalysis.keywords.length === 0) {
      suggestions.push('Aucun mot-clé défini');
    }
    const imagesWithoutAlt = seoAnalysis.imagesDetails.filter(img => !img.hasAlt).length;
    if (imagesWithoutAlt > 0) {
      suggestions.push(`${imagesWithoutAlt} image(s) sans attribut alt`);
    }
    if (seoAnalysis.brokenLinks.length > 0) {
      suggestions.push(`${seoAnalysis.brokenLinks.length} lien(s) cassé(s)`);
    }
    if (!seoAnalysis.socialTags.ogTitle || !seoAnalysis.socialTags.ogDescription) {
      suggestions.push('Tags Open Graph manquants');
    }
    if (seoAnalysis.performance.loadTime > 3000) {
      suggestions.push('Temps de chargement trop long');
    }
    return suggestions;
  };

  const handleImageClick = (image: { url: string; alt?: string }) => {
    window.open(image.url, '_blank', 'width=800,height=600');
  };

  const handleCompare = (url: string) => {
    setComparisonSite({
      url: "https://example.com",
      analysis: seoAnalysis
    });
  };

  const seoScore = calculateSeoScore();
  const suggestions = getSeoSuggestions();

  return (
    <ScrollArea className="h-[calc(100vh-200px)] pr-4">
      <div className="space-y-6 p-4">
        <SeoOverview 
          score={seoScore}
          suggestions={suggestions}
          performance={seoAnalysis.performance}
        />

        <LoadingSpeedAnalysis performance={{
          ...seoAnalysis.performance,
          speedIndex: seoAnalysis.performance.speedIndex || 0,
          largestContentfulPaint: seoAnalysis.performance.largestContentfulPaint || seoAnalysis.performance.firstContentfulPaint * 1.2,
          timeToInteractive: seoAnalysis.performance.timeToInteractive || seoAnalysis.performance.domLoadTime,
          resourceBreakdown: seoAnalysis.performance.resourceBreakdown || {
            images: 0,
            scripts: 0,
            styles: 0,
            fonts: 0,
            other: 0
          }
        }} />

        <SearchTrends 
          clicks={seoAnalysis.searchConsole.clicks}
          impressions={seoAnalysis.searchConsole.impressions}
        />

        <AnalyticsOverview analytics={seoAnalysis.analytics} />

        <SiteComparison 
          site1={{url: window.location.href, analysis: seoAnalysis}}
          site2={comparisonSite}
          onCompare={handleCompare}
        />

        <DetailedMetrics 
          seoAnalysis={seoAnalysis}
          showAllMetrics={showAllMetrics}
          onToggleMetrics={() => setShowAllMetrics(!showAllMetrics)}
          onImageClick={handleImageClick}
        />
      </div>
    </ScrollArea>
  );
};

export default SeoResults;
