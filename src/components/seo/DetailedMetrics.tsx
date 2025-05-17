
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
import { BacklinkInfo, SeoAnalysis, SocialMetrics as SocialMetricsType } from '@/types/seo';
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
    ? seoAnalysis.topBacklinkDomains.map(item => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item !== null && 'domain' in item) return item.domain;
        return '';
      })
    : [];

  // Assurer que ces valeurs ne sont jamais undefined pour éviter des erreurs
  const socialMetricsDefault: SocialMetricsType = {
    facebook: { shares: 0, comments: 0, likes: 0 },
    twitter: { tweets: 0, retweets: 0, likes: 0, shares: 0, replies: 0 },
    pinterest: { pins: 0, saves: 0 },
    linkedin: { shares: 0, engagements: 0 }
  };

  const socialMetrics = seoAnalysis.socialMetrics || socialMetricsDefault;
  
  // S'assurer que keywords est toujours un tableau
  const keywords = typeof seoAnalysis.keywords === 'string' 
    ? [seoAnalysis.keywords]
    : Array.isArray(seoAnalysis.keywords) 
      ? seoAnalysis.keywords 
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
          keywords={keywords}
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

      {showAllMetrics && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="grid gap-6 md:grid-cols-2"
          >
            <SocialMetrics socialMetrics={socialMetrics} />
            <SocialTags socialTags={seoAnalysis.socialTags} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="mt-6"
          >
            {seoAnalysis.performance && seoAnalysis.performance.loadTime && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Performance</h3>
                <LoadingPerformance 
                  loadTime={seoAnalysis.performance.loadTime}
                  firstContentfulPaint={seoAnalysis.performance.firstContentfulPaint || 0}
                  domLoadTime={seoAnalysis.performance.domLoadTime || 0}
                />
              </div>
            )}
            
            {seoAnalysis.brokenLinks && seoAnalysis.brokenLinks.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Liens cassés</h3>
                <BrokenLinks brokenLinks={seoAnalysis.brokenLinks} />
              </div>
            )}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
          >
            <div className="mt-6">
              {seoAnalysis.backlinks && (
                <BacklinksAnalysis 
                  backlinks={typeof seoAnalysis.backlinks === 'number' 
                    ? [] 
                    : (seoAnalysis.backlinks as BacklinkInfo[])} 
                  doFollowCount={seoAnalysis.doFollowBacklinks || 0}
                  noFollowCount={seoAnalysis.noFollowBacklinks || 0}
                  topDomains={topDomains}
                  qualityScore={backlinkDetails.qualityScore}
                  relevanceScore={backlinkDetails.relevanceScore}
                  trustScore={backlinkDetails.trustScore}
                />
              )}
            </div>
          </motion.div>
          
          {seoAnalysis.images && seoAnalysis.images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
              className="mt-6"
            >
              <h3 className="text-lg font-semibold mb-4">Images</h3>
              <ImageDetails 
                images={seoAnalysis.images} 
                onImageClick={onImageClick}
              />
            </motion.div>
          )}
          
          {seoAnalysis.keywordSuggestions && seoAnalysis.keywordSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              className="mt-6"
            >
              <KeywordSuggestions generatedKeywords={seoAnalysis.keywordSuggestions} />
            </motion.div>
          )}
        </>
      )}
      
      <div className="flex justify-center mt-8">
        <Button 
          variant="outline" 
          onClick={onToggleMetrics}
          className="px-6"
        >
          {showAllMetrics ? "Afficher moins" : "Afficher plus de métriques"}
        </Button>
      </div>
    </>
  );
};

export default DetailedMetrics;
