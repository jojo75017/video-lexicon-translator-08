
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Tag, FileHeading, Heading1, Heading2, Heading3, Image } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SeoMainTagsProps {
  title: string;
  description: string;
  keywords: string[];
  h1Count?: number;
  h2Count?: number;
  h3Count?: number;
  imgCount?: number;
}

const SeoMainTags = ({ 
  title, 
  description, 
  keywords, 
  h1Count = 0,
  h2Count = 0,
  h3Count = 0,
  imgCount = 0
}: SeoMainTagsProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <h3 className="font-medium mb-4 text-lg border-b pb-2">{t('seo.mainTags')}</h3>
      <ul className="space-y-4">
        <li>
          <div className="flex items-center gap-2">
            <span className="font-medium">{t('seo.title')} :</span>
            {title && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {title.length} caractères
              </Badge>
            )}
          </div>
          <p className="mt-1 text-gray-600">
            {title || t('seo.notDefined')}
          </p>
        </li>
        
        <li>
          <div className="flex items-center gap-2">
            <span className="font-medium">{t('seo.description')} :</span>
            {description && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {description.length} caractères
              </Badge>
            )}
          </div>
          <p className="mt-1 text-gray-600">
            {description || t('seo.notDefined_female')}
          </p>
        </li>
        
        <li>
          <div className="flex items-center gap-2 mb-2">
            <Tag className="h-4 w-4" />
            <span className="font-medium">{t('seo.keywords')} :</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(keywords) && keywords.length > 0 ? (
              keywords.map((keyword, index) => (
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
      
      <div className="mt-8 pt-4 border-t">
        <h4 className="font-medium mb-4 flex items-center">
          <FileHeading className="h-4 w-4 mr-2" />
          Structure de balises
        </h4>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-red-50 p-3 rounded-lg border border-red-100 flex flex-col items-center">
            <Heading1 className="h-5 w-5 text-red-600 mb-1" />
            <span className="text-2xl font-bold text-red-800">{h1Count}</span>
            <span className="text-xs text-red-700">Balises H1</span>
          </div>
          
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 flex flex-col items-center">
            <Heading2 className="h-5 w-5 text-orange-600 mb-1" />
            <span className="text-2xl font-bold text-orange-800">{h2Count}</span>
            <span className="text-xs text-orange-700">Balises H2</span>
          </div>
          
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 flex flex-col items-center">
            <Heading3 className="h-5 w-5 text-yellow-600 mb-1" />
            <span className="text-2xl font-bold text-yellow-800">{h3Count}</span>
            <span className="text-xs text-yellow-700">Balises H3</span>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex flex-col items-center">
            <Image className="h-5 w-5 text-blue-600 mb-1" />
            <span className="text-2xl font-bold text-blue-800">{imgCount}</span>
            <span className="text-xs text-blue-700">Images</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoMainTags;
