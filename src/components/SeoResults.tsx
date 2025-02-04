
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { SeoAnalysis } from '@/types/seo';
import { motion } from "framer-motion";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ImageDetails from './ImageDetails';
import { useTranslation } from 'react-i18next';
import SeoScore from './seo/SeoScore';
import SeoSuggestions from './seo/SeoSuggestions';
import SeoMainTags from './seo/SeoMainTags';
import SeoStructure from './seo/SeoStructure';
import SeoContent from './seo/SeoContent';
import ShareResults from './ShareResults';
import LoadingPerformance from './seo/LoadingPerformance';
import SocialTags from './seo/SocialTags';
import BrokenLinks from './seo/BrokenLinks';
import KeywordSuggestions from './seo/KeywordSuggestions';
import SocialMetrics from './seo/SocialMetrics';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download, Share2, Zap } from "lucide-react";

interface SeoResultsProps {
  seoAnalysis: SeoAnalysis;
}

const SeoResults = ({ seoAnalysis }: SeoResultsProps) => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('overview');
  const [showAllMetrics, setShowAllMetrics] = useState(false);
  
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
      suggestions.push(t('seo.suggestions.noTitle'));
    } else if (seoAnalysis.title.length < 30) {
      suggestions.push(t('seo.suggestions.titleTooShort'));
    } else if (seoAnalysis.title.length > 60) {
      suggestions.push(t('seo.suggestions.titleTooLong'));
    }
    if (!seoAnalysis.description) {
      suggestions.push(t('seo.suggestions.noDescription'));
    } else if (seoAnalysis.description.length < 120) {
      suggestions.push(t('seo.suggestions.descriptionTooShort'));
    } else if (seoAnalysis.description.length > 160) {
      suggestions.push(t('seo.suggestions.descriptionTooLong'));
    }
    if (!seoAnalysis.keywords || seoAnalysis.keywords.length === 0) {
      suggestions.push(t('seo.suggestions.noKeywords'));
    }
    const imagesWithoutAlt = seoAnalysis.imagesDetails.filter(img => !img.hasAlt).length;
    if (imagesWithoutAlt > 0) {
      suggestions.push(t('seo.suggestions.imagesNoAlt', { count: imagesWithoutAlt }));
    }
    
    if (seoAnalysis.brokenLinks.length > 0) {
      suggestions.push(t('seo.suggestions.brokenLinks', { count: seoAnalysis.brokenLinks.length }));
    }
    if (!seoAnalysis.socialTags.ogTitle || !seoAnalysis.socialTags.ogDescription) {
      suggestions.push(t('seo.suggestions.noSocialTags'));
    }
    if (seoAnalysis.performance.loadTime > 3000) {
      suggestions.push(t('seo.suggestions.slowLoading'));
    }
    return suggestions;
  };

  const handleImageClick = (image: { url: string; alt?: string }) => {
    window.open(image.url, '_blank', 'width=800,height=600');
  };

  const seoScore = calculateSeoScore();
  const suggestions = getSeoSuggestions();

  // Données pour le graphique de performance
  const performanceData = [
    { name: 'Load Time', value: seoAnalysis.performance.loadTime },
    { name: 'TTFB', value: seoAnalysis.performance.firstContentfulPaint },
    { name: 'DOM Load', value: seoAnalysis.performance.domLoadTime },
  ];

  const generateSearchTrendData = () => {
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString();
    }).reverse();

    return dates.map(date => ({
      date,
      clicks: Math.floor(Math.random() * seoAnalysis.searchConsole.clicks),
      impressions: Math.floor(Math.random() * seoAnalysis.searchConsole.impressions)
    }));
  };

  const searchTrendData = generateSearchTrendData();

  return (
    <ScrollArea className="h-[calc(100vh-200px)] pr-4">
      <div className="space-y-6 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Analyse SEO</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
              </div>
            </div>
            
            <motion.div 
              className="grid gap-6 md:grid-cols-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-4 bg-white">
                <SeoScore score={seoScore} />
              </Card>
              
              <Card className="p-4 bg-white md:col-span-2">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Performance Globale
                </h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="#6366f1" fill="#818cf8" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>

            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <SeoSuggestions suggestions={suggestions} />
            </motion.div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Tendances de recherche</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={searchTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="clicks" 
                    stackId="1"
                    stroke="#3b82f6" 
                    fill="#93c5fd" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="impressions" 
                    stackId="1"
                    stroke="#6366f1" 
                    fill="#818cf8" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

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
          className="grid gap-6 md:grid-cols-2"
        >
          <LoadingPerformance 
            loadTime={seoAnalysis.performance.loadTime}
            firstContentfulPaint={seoAnalysis.performance.firstContentfulPaint}
            domLoadTime={seoAnalysis.performance.domLoadTime}
          />
          <SocialMetrics metrics={seoAnalysis.socialMetrics} />
        </motion.div>

        {showAllMetrics && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <SocialTags socialTags={seoAnalysis.socialTags} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
            >
              <BrokenLinks brokenLinks={seoAnalysis.brokenLinks} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
            >
              <KeywordSuggestions suggestions={seoAnalysis.keywordSuggestions} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
            >
              <ImageDetails 
                images={seoAnalysis.imagesDetails} 
                onImageClick={handleImageClick}
              />
            </motion.div>
          </>
        )}

        <div className="flex justify-center">
          <Button 
            variant="outline"
            onClick={() => setShowAllMetrics(!showAllMetrics)}
          >
            {showAllMetrics ? 'Voir moins' : 'Voir plus de métriques'}
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};

export default SeoResults;

