import React from 'react';
import { Card } from "@/components/ui/card";
import { SeoAnalysis } from '@/types/seo';
import ImageDetails from './ImageDetails';
import { useTranslation } from 'react-i18next';
import SeoScore from './seo/SeoScore';
import SeoSuggestions from './seo/SeoSuggestions';
import SeoMainTags from './seo/SeoMainTags';
import SeoStructure from './seo/SeoStructure';
import SeoContent from './seo/SeoContent';

interface SeoResultsProps {
  seoAnalysis: SeoAnalysis;
}

const SeoResults = ({ seoAnalysis }: SeoResultsProps) => {
  const { t } = useTranslation();
  
  const calculateSeoScore = () => {
    let score = 100;
    if (!seoAnalysis.title) score -= 20;
    else if (seoAnalysis.title.length < 30 || seoAnalysis.title.length > 60) score -= 10;
    if (!seoAnalysis.description) score -= 20;
    else if (seoAnalysis.description.length < 120 || seoAnalysis.description.length > 160) score -= 10;
    if (!seoAnalysis.keywords || seoAnalysis.keywords.length === 0) score -= 15;
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
    return suggestions;
  };

  const handleImageClick = (image: { url: string; alt?: string }) => {
    window.open(image.url, '_blank', 'width=800,height=600');
  };

  const seoScore = calculateSeoScore();
  const suggestions = getSeoSuggestions();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <SeoScore score={seoScore} />
        <SeoSuggestions suggestions={suggestions} />
        
        <div className="grid gap-6 md:grid-cols-2">
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
        </div>

        <SeoContent 
          wordCount={seoAnalysis.wordCount}
          internalLinks={seoAnalysis.internalLinks}
          externalLinks={seoAnalysis.externalLinks}
        />
      </Card>

      <ImageDetails 
        images={seoAnalysis.imagesDetails} 
        onImageClick={handleImageClick}
      />
    </div>
  );
};

export default SeoResults;