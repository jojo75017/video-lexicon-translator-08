import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeoAnalysis } from '@/types/seo';
import { FileText, Tag } from 'lucide-react';
import ImageDetails from './ImageDetails';
import { useTranslation } from 'react-i18next';

interface SeoResultsProps {
  seoAnalysis: SeoAnalysis;
}

const SeoResults = ({ seoAnalysis }: SeoResultsProps) => {
  const { t } = useTranslation();
  
  const handleImageClick = (image: { url: string; alt?: string }) => {
    window.open(image.url, '_blank', 'width=800,height=600');
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">{t('seo.analysis')}</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-medium mb-2">{t('seo.mainTags')}</h3>
            <ul className="space-y-4">
              <li>
                <span className="font-medium">{t('seo.title')} :</span> 
                {seoAnalysis.title || t('seo.notDefined')}
              </li>
              <li>
                <span className="font-medium">{t('seo.description')} :</span> 
                {seoAnalysis.description || t('seo.notDefined_female')}
              </li>
              <li>
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4" />
                  <span className="font-medium">{t('seo.keywords')} :</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(seoAnalysis.keywords) && seoAnalysis.keywords.length > 0 ? (
                    seoAnalysis.keywords.map((keyword, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                      >
                        {keyword}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-500 italic">{t('seo.noKeywords')}</span>
                  )}
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">{t('seo.structure')}</h3>
            <ul className="space-y-2">
              <li><span className="font-medium">Nombre de H1 :</span> {seoAnalysis.h1Count || 0}</li>
              <li><span className="font-medium">Nombre de H2 :</span> {seoAnalysis.h2Count || 0}</li>
              <li><span className="font-medium">Nombre de H3 :</span> {seoAnalysis.h3Count || 0}</li>
              <li>
                <span className="font-medium">{t('seo.imageCount')} :</span> 
                {seoAnalysis.imgCount || 0}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('seo.content')}
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div>
              <span className="font-medium">{t('seo.wordCount')} :</span> 
              {seoAnalysis.wordCount || 0}
            </div>
            <div>
              <span className="font-medium">{t('seo.internalLinks')} :</span> 
              {seoAnalysis.internalLinks || 0}
            </div>
            <div>
              <span className="font-medium">{t('seo.externalLinks')} :</span> 
              {seoAnalysis.externalLinks || 0}
            </div>
          </div>
        </div>
      </Card>

      <ImageDetails 
        images={seoAnalysis.imagesDetails} 
        onImageClick={handleImageClick}
      />
    </div>
  );
};

export default SeoResults;