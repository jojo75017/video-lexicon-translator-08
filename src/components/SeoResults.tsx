
import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { SeoAnalysis } from '@/types/seo';
import SeoOverview from './seo/SeoOverview';
import SearchTrends from './seo/SearchTrends';
import DetailedMetrics from './seo/DetailedMetrics';
import SiteComparison from './seo/SiteComparison';
import AnalyticsOverview from './seo/AnalyticsOverview';
import LoadingSpeedAnalysis from './seo/LoadingSpeedAnalysis';
import SeoStructure from './seo/SeoStructure';
import KeywordAnalysis from './seo/KeywordAnalysis';
import { Card } from '@/components/ui/card';
import { analyzeKeywords } from '@/utils/seo/keywordAnalyzer';

interface SeoResultsProps {
  seoAnalysis: SeoAnalysis;
}

const SeoResults = ({ seoAnalysis }: SeoResultsProps) => {
  const [showAllMetrics, setShowAllMetrics] = useState(false);
  const [comparisonSite, setComparisonSite] = useState<{url: string; analysis: SeoAnalysis} | undefined>();
  
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
  const keywordAnalysis = analyzeKeywords(seoAnalysis.title + " " + seoAnalysis.description);

  return (
    <ScrollArea className="h-[calc(100vh-200px)] pr-4">
      <div className="space-y-6 p-4">
        <SeoOverview 
          score={seoScore}
          suggestions={suggestions}
          performance={seoAnalysis.performance}
        />

        <Card className="p-6">
          <SeoStructure 
            h1Count={seoAnalysis.h1Count}
            h2Count={seoAnalysis.h2Count}
            h3Count={seoAnalysis.h3Count}
            imgCount={seoAnalysis.imgCount}
          />
        </Card>

        <KeywordAnalysis keywords={keywordAnalysis} />

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
