import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeoAnalysis } from '@/types/seo';
import { FileText, Tag, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import ImageDetails from './ImageDetails';
import { useTranslation } from 'react-i18next';
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SeoResultsProps {
  seoAnalysis: SeoAnalysis;
}

const SeoResults = ({ seoAnalysis }: SeoResultsProps) => {
  const { t } = useTranslation();
  
  const handleImageClick = (image: { url: string; alt?: string }) => {
    window.open(image.url, '_blank', 'width=800,height=600');
  };

  // Calcul du score SEO
  const calculateSeoScore = () => {
    let score = 100;
    
    // Vérification du titre
    if (!seoAnalysis.title) score -= 20;
    else if (seoAnalysis.title.length < 30 || seoAnalysis.title.length > 60) score -= 10;
    
    // Vérification de la description
    if (!seoAnalysis.description) score -= 20;
    else if (seoAnalysis.description.length < 120 || seoAnalysis.description.length > 160) score -= 10;
    
    // Vérification des mots-clés
    if (!seoAnalysis.keywords || seoAnalysis.keywords.length === 0) score -= 15;
    
    // Vérification des images sans alt
    const imagesWithoutAlt = seoAnalysis.imagesDetails.filter(img => !img.hasAlt).length;
    if (imagesWithoutAlt > 0) score -= (imagesWithoutAlt * 5);
    
    return Math.max(0, score);
  };

  const seoScore = calculateSeoScore();

  // Génération des suggestions
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

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">{t('seo.score')}</h2>
          <div className="flex items-center gap-4">
            <Progress value={seoScore} className="w-full" />
            <span className="text-xl font-bold">{seoScore}%</span>
          </div>
        </div>

        {getSeoSuggestions().length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              {t('seo.suggestions.title')}
            </h3>
            <div className="space-y-2">
              {getSeoSuggestions().map((suggestion, index) => (
                <Alert key={index} variant={suggestion.includes('manquant') ? 'destructive' : 'default'}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{suggestion}</AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}
        
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-medium mb-2">{t('seo.mainTags')}</h3>
            <ul className="space-y-4">
              <li>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{t('seo.title')} :</span>
                  {seoAnalysis.title ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {seoAnalysis.title.length} caractères
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-1 text-gray-600">
                  {seoAnalysis.title || t('seo.notDefined')}
                </p>
              </li>
              <li>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{t('seo.description')} :</span>
                  {seoAnalysis.description ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {seoAnalysis.description.length} caractères
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-1 text-gray-600">
                  {seoAnalysis.description || t('seo.notDefined_female')}
                </p>
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
              <li className="flex items-center gap-2">
                <span className="font-medium">H1 :</span> 
                <Badge variant={seoAnalysis.h1Count === 1 ? "secondary" : "destructive"}>
                  {seoAnalysis.h1Count || 0}
                </Badge>
                {seoAnalysis.h1Count !== 1 && (
                  <span className="text-sm text-red-500">
                    {t('seo.suggestions.h1Count')}
                  </span>
                )}
              </li>
              <li><span className="font-medium">H2 :</span> {seoAnalysis.h2Count || 0}</li>
              <li><span className="font-medium">H3 :</span> {seoAnalysis.h3Count || 0}</li>
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