
import React from 'react';
import { motion } from "framer-motion";
import SeoMainTags from './SeoMainTags';
import SeoStructure from './SeoStructure';
import SeoContent from './SeoContent';
import LoadingPerformance from './LoadingPerformance';
import SocialMetrics from './SocialMetrics';
import SocialTags from './SocialTags';
import BrokenLinks from './BrokenLinks';
import KeywordSuggestions from './analysis/KeywordSuggestions';
import BacklinksAnalysis from './BacklinksAnalysis';
import ImageDetails from '../ImageDetails';
import { BacklinkInfo, SeoAnalysis } from '@/types/seo';
import { Button } from '@/components/ui/button';

interface DetailedMetricsProps {
  seoAnalysis: SeoAnalysis;
  showAllMetrics: boolean;
  onToggleMetrics: () => void;
  onImageClick: (image: { url: string; alt?: string }) => void;
}

const DetailedMetrics = ({ 
  seoAnalysis, 
  showAllMetrics, 
  onToggleMetrics,
  onImageClick 
}: DetailedMetricsProps) => {
  // Corriger les props pour BacklinksAnalysis
  const backlinkDetails = {
    qualityScore: 65,
    relevanceScore: 70,
    trustScore: 60
  };
  
  // Convertir topBacklinkDomains si nécessaire
  const topDomains = Array.isArray(seoAnalysis.topBacklinkDomains) 
    ? seoAnalysis.topBacklinkDomains.map(item => 
        typeof item === 'string' ? item : item.domain
      )
    : [];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid gap-6 md:grid-cols-2"
      >
        <SeoMainTags 
          title={seoAnalysis.title}
          description={seoAnalysis.description}
          keywords={seoAnalysis.keywords}
        />
        
        <SeoStructure 
          h1Count={seoAnalysis.h1Count}
          h2Count={seoAnalysis.h2Count}
          h3Count={seoAnalysis.h3Count}
          imgCount={seoAnalysis.imgCount}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <SeoContent 
          wordCount={seoAnalysis.wordCount}
          internalLinks={seoAnalysis.internalLinks}
          externalLinks={seoAnalysis.externalLinks}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <BacklinksAnalysis
          backlinks={seoAnalysis.backlinks as BacklinkInfo[] | number}
          backlinkDetails={backlinkDetails}
          topBacklinkDomains={topDomains}
          doFollowBacklinks={seoAnalysis.doFollowBacklinks}
          noFollowBacklinks={seoAnalysis.noFollowBacklinks}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="grid gap-6 md:grid-cols-2"
      >
        <LoadingPerformance 
          loadTime={seoAnalysis.performance?.loadTime}
          firstContentfulPaint={seoAnalysis.performance?.firstContentfulPaint}
          domLoadTime={seoAnalysis.performance?.domLoadTime}
        />
        <SocialMetrics metrics={seoAnalysis.socialMetrics} />
      </motion.div>

      {showAllMetrics && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
          >
            <SocialTags socialTags={{
              ogTitle: seoAnalysis.socialTags?.ogTitle || null,
              ogDescription: seoAnalysis.socialTags?.ogDescription || null,
              ogImage: seoAnalysis.socialTags?.ogImage || null,
              twitterCard: seoAnalysis.socialTags?.twitterCard || null,
              twitterTitle: seoAnalysis.socialTags?.twitterTitle || null,
              twitterDescription: seoAnalysis.socialTags?.twitterDescription || null,
              twitterImage: seoAnalysis.socialTags?.twitterImage || null
            }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
          >
            <BrokenLinks brokenLinks={seoAnalysis.brokenLinks} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
          >
            {seoAnalysis.keywordSuggestions && (
              <KeywordSuggestions 
                generatedKeywords={seoAnalysis.keywordSuggestions}
              />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2 }}
          >
            <ImageDetails 
              images={seoAnalysis.imagesDetails} 
              onImageClick={onImageClick}
            />
          </motion.div>
        </>
      )}

      <div className="flex justify-center">
        <Button 
          variant="outline"
          onClick={onToggleMetrics}
        >
          {showAllMetrics ? 'Voir moins' : 'Voir plus de métriques'}
        </Button>
      </div>
    </>
  );
};

export default DetailedMetrics;
